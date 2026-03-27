import { EdgeTTS } from 'edge-tts-universal';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, voice } = req.body;

  try {
    // This connects to Microsoft's cloud - very low CPU usage for you
    const tts = new EdgeTTS(text, voice || 'yo-NG-OluwaseunNeural');
    const result = await tts.synthesize();
    
    // Convert the response to a buffer to send to the frontend
    const audioBuffer = Buffer.from(await result.audio.arrayBuffer());

    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);
  } catch (error) {
    console.error("TTS Error:", error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
}