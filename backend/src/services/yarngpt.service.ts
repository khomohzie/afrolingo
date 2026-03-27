import axios from "axios";
import fs from "fs";
import phraseModel from "../models/phrase.model";
import path from "path";
import cloudinaryUpload from "../utils/cloudinary";

// Map our language codes to YarnGPT speaker names
const YARNGPT_SPEAKERS: Record<string, string> = {
  yoruba: "Remi",
  igbo: "Chinenye",
  hausa: "Umar",
};

/**
 * Call YarnGPT to convert a phrase to speech.
 * Returns an audio file.
 */
export const generateAudio = async (
  text: string,
  language: "yoruba" | "igbo" | "hausa"
): Promise<string> => {
  const speaker = YARNGPT_SPEAKERS[language];

  const response = await axios.post(
    process.env.YARNGPT_BASE_URL,
    { text, voice: speaker },
    {
      headers: {
        Authorization: `Bearer ${process.env.YARNGPT_API_KEY}`,
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
      timeout: 25000,
    }
  );

  const uploadDir = path.join(__dirname, "../uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const filePath = `${uploadDir}/${text}.mp3`;

  fs.writeFileSync(filePath, response.data);

  return filePath;
};

/**
 * Generate and cache audio for a single phrase.
 * If phrase exists in the DB, skips if audioUrl already exists.
 * If phrase does not exist, generates audio and saves it.
 */
export const cacheAudioForPhrase = async ({
  phraseId,
  phraseText,
  language,
}: {
  phraseId?: string;
  phraseText?: string;
  language?: "yoruba" | "igbo" | "hausa";
}): Promise<string | null> => {
  let phraseDoc: any = null;
  let text: string;
  let lang: "yoruba" | "igbo" | "hausa";

  if (phraseId) {
    phraseDoc = await phraseModel.findById(phraseId);
    if (!phraseDoc) throw new Error("Phrase not found");

    // Already cached — skip
    if (phraseDoc.audioUrl) return phraseDoc.audioUrl;

    text = phraseDoc.text;
    lang = phraseDoc.language;
  } else if (phraseText && language) {
    text = phraseText;
    lang = language;
  } else {
    throw new Error("Provide either phraseId or (phraseText + language)");
  }

  try {
    const filePath = await generateAudio(text, lang);

    let audioUrl: string | null = null;

    // Upload audio to cloudinary
    const cloudinaryFolder = "afrolingo-media";

    if (filePath) {
      try {
        audioUrl = await cloudinaryUpload(filePath, cloudinaryFolder);
      } catch (error: any) {
        console.error(error);
      }
    }

    // Save only if it's a DB phrase
    if (phraseDoc && audioUrl) {
      phraseDoc.audioUrl = audioUrl;
      await phraseDoc.save();
    }

    return audioUrl;
  } catch (error: any) {
    console.error(`YarnGPT failed for phrase ${phraseId}:`, error.message);
    return null;
  }
};

/**
 * Batch-generate audio for all phrases of a language that have no audio yet.
 * Call this once on Day 1 to pre-cache everything.
 * Adds a 300ms delay between calls to avoid rate limiting.
 */
export const batchCacheAudio = async (
  language: "yoruba" | "igbo" | "hausa"
): Promise<{ success: number; failed: number }> => {
  const phrases = await phraseModel.find({
    language,
    isActive: true,
    $or: [{ audioUrl: null }, { audioUrl: "" }],
  });

  console.log(`Caching audio for ${phrases.length} ${language} phrases...`);

  let success = 0;
  let failed = 0;

  for (const phrase of phrases) {
    try {
      const filePath = await generateAudio(phrase.text, language);

      if (!filePath) {
        failed++;
        continue;
      }

      // Upload audio to cloudinary
      const cloudinaryFolder = "afrolingo-media";

      if (filePath) {
        try {
          const downloadURL = await cloudinaryUpload(
            filePath,
            cloudinaryFolder
          );

          phrase.audioUrl = downloadURL;
        } catch (error: any) {
          console.error(error);
        }
      }

      await phrase.save();

      success++;
      console.log(`✓ [${success}/${phrases.length}] ${phrase.text}`);
    } catch (err: any) {
      failed++;
      console.error(`✗ Failed: "${phrase.text}" — ${err.message}`);
    }

    // Polite delay between requests
    await new Promise((r) => setTimeout(r, 300));
  }

  return { success, failed };
};
