import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { audioBase64, language, targetPhrase, toneFocus } = req.body;
    
    if (!audioBase64) {
        return res.status(400).json({ error: "No audio data provided" });
    }

    // 1. Process the audio
    const base64Data = audioBase64.split(",")[1];
    const audioBuffer = Buffer.from(base64Data, "base64");
    const audioBlob = new Blob([audioBuffer], { type: "audio/webm" });
    
    const formData = new FormData();
    formData.append("file", audioBlob, "user-audio.webm");
    formData.append("model", "whisper-large-v3");

    // 2. Transcribe with Groq
    if (!process.env.GROQ_API_KEY) throw new Error("Missing GROQ_API_KEY");

    const groqResponse = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: formData as any,
    });

    if (!groqResponse.ok) throw new Error(`Groq API failed: ${groqResponse.status}`);
    
    const groqData = await groqResponse.json();
    const userTranscript = groqData.text.trim();

    if (!userTranscript || userTranscript.length < 2) {
      return res.status(200).json({ 
        feedback: "I didn't quite catch that. Could you please try speaking a bit louder?" 
      });
    }

    // 3. Analyze with Gemini
    if (!process.env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");

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

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
      }),
    });

    if (!geminiResponse.ok) throw new Error(`Gemini API failed: ${geminiResponse.status}`);
    
    const geminiData = await geminiResponse.json();
    const aiFeedback = geminiData.candidates[0].content.parts[0].text;

    // 4. Send to Frontend
    res.status(200).json({ 
        transcript: userTranscript, 
        feedback: aiFeedback 
    });

  } catch (error) {
    console.error("Voice Analysis Error:", error);
    res.status(500).json({ error: "Failed to analyze voice" });
  }
}