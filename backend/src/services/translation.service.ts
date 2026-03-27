import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-flash-latest",
});

interface TranslationResult {
  english: string;
  amiOhun?: string;
}

export const translateText = async (
  text: string,
  language: "yoruba" | "igbo" | "hausa"
): Promise<TranslationResult> => {
  const prompt = `
    Translate the following text from ${language} to English: "${text}".
    
    Rules:
    1. If the language is "yoruba", you MUST also provide the input text with proper tonal marks (ami ohun).
    
    Return the response in this JSON format:
    {
      "english": "translation here",
      "amiOhun": "original with marks"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();

    // Clean the response text (sometimes AI wraps JSON in backticks)
    const cleanedJson = responseText.replace(/```json|```/g, "").trim();

    return JSON.parse(cleanedJson) as TranslationResult;
  } catch (error: any) {
    console.error(
      "Gemini Error Details:",
      error.response?.data || error.message
    );
    throw new Error(`Translation failed: ${error.message}`);
  }
};
