import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

function calculatePronunciationScore(transcript: string, target: string): number {
  const normalize = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .trim();

  const userWords = normalize(transcript).split(/\s+/);
  const targetWords = normalize(target).split(/\s+/);

  if (targetWords.length === 0) return 0;

  let matches = 0;
  targetWords.forEach((word, i) => {
    if (userWords[i] === word) {
      matches += 1;
    } else if (userWords[i]?.includes(word) || word.includes(userWords[i] ?? "")) {
      matches += 0.5;
    }
  });

  return Math.min(100, Math.round((matches / targetWords.length) * 100));
}

function generateFallbackFeedback(score: number, targetPhrase: string): string {
  if (score >= 80) return `Great job! Your pronunciation of "${targetPhrase}" was really close — keep it up!`;
  if (score >= 60) return `Good effort on "${targetPhrase}"! Focus on the tonal marks and try once more.`;
  return `Keep practicing "${targetPhrase}" — listen to the native pronunciation and try to match the tone closely.`;
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3,
  baseDelay = 1000
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.status === 429 || response.status === 503) {
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 500;
        await new Promise((resolve) => setTimeout(resolve, delay));
        lastError = new Error(`Rate limited (${response.status}), retrying...`);
        continue;
      }

      return response;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error("Unknown fetch error");
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError ?? new Error("Max retries exceeded");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { audioBase64, language, targetPhrase, toneFocus } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: "No audio data provided" });
    }

    if (!process.env.GROQ_API_KEY) throw new Error("Missing GROQ_API_KEY");
    if (!process.env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");

    const base64Data = audioBase64.split(",")[1];
    const audioBuffer = Buffer.from(base64Data, "base64");
    const audioBlob = new Blob([audioBuffer], { type: "audio/webm" });

    const formData = new FormData();
    formData.append("file", audioBlob, "user-audio.webm");
    formData.append("model", "whisper-large-v3");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    let groqResponse: Response;
    try {
      groqResponse = await fetchWithRetry(
        "https://api.groq.com/openai/v1/audio/transcriptions",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
          body: formData as any,
          signal: controller.signal,
        },
        3,
        500
      );
    } finally {
      clearTimeout(timeout);
    }

    if (!groqResponse.ok) {
      const errorBody = await groqResponse.json().catch(() => ({}));
      throw new Error(`Groq API failed: ${groqResponse.status} — ${JSON.stringify(errorBody)}`);
    }

    const groqData = await groqResponse.json();
    const userTranscript = groqData.text?.trim() ?? "";

    if (!userTranscript || userTranscript.length < 2) {
      return res.status(200).json({
        feedback: "I didn't quite catch that. Could you please try speaking a bit louder?",
        score: 0,
      });
    }

    const score = calculatePronunciationScore(userTranscript, targetPhrase);

    const systemPrompt = `You are a supportive ${language} language tutor for the AfroLingo app. 
Inputs:
1. Target Phrase: ${targetPhrase}
2. Primary Focus: ${toneFocus}
3. User's Spoken Transcript: ${userTranscript}

Your Task: Evaluate the User's Transcript against the Target Phrase. 
- If completely wrong words: gently correct them.
- If right words but missing tonal marks: tell them they got the words right but need to adjust their pronunciation based on the Primary Focus.
- If perfect match: praise them!
Constraints: Keep response conversational, encouraging, and STRICTLY under 2 sentences. Only output what the AI should say out loud.`;

    let aiFeedback: string;

    try {
      const geminiResponse = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
          }),
        },
        3,
        1000
      );

      if (!geminiResponse.ok) {
        console.warn(`Gemini failed after retries: ${geminiResponse.status} — using fallback`);
        aiFeedback = generateFallbackFeedback(score, targetPhrase);
      } else {
        const geminiData = await geminiResponse.json();
        aiFeedback =
          geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ??
          generateFallbackFeedback(score, targetPhrase);
      }
    } catch (geminiError) {
      console.warn("Gemini threw an error — using fallback feedback:", geminiError);
      aiFeedback = generateFallbackFeedback(score, targetPhrase);
    }

    return res.status(200).json({
      transcript: userTranscript,
      feedback: aiFeedback,
      score,
    });
  } catch (error) {
    console.error("Voice Analysis Error:", error);
    return res.status(500).json({ error: "Failed to analyze voice" });
  }
}