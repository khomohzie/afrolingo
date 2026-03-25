import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, voice = 'femi', language = 'yo', format = 'mp3' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const apiKey = process.env.SPITCH_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing API key' });
  }

  try {
    const response = await fetch('https://api.spi-tch.com/v1/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        language,
        voice,
        format,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Spitch error:', errorText);
      return res.status(response.status).json({ error: 'Spitch API error' });
    }

    const audioBuffer = await response.arrayBuffer();

    // Determine content type from format
    let contentType = 'audio/mpeg';
    switch (format) {
      case 'wav':
        contentType = 'audio/wav';
        break;
      case 'ogg_opus':
        contentType = 'audio/ogg';
        break;
      case 'webm_opus':
        contentType = 'audio/webm';
        break;
      case 'flac':
        contentType = 'audio/flac';
        break;
      case 'pcm_s16le':
        contentType = 'audio/L16';
        break;
      case 'mulaw':
        contentType = 'audio/mulaw';
        break;
      case 'alaw':
        contentType = 'audio/alaw';
        break;
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', audioBuffer.byteLength);
    res.send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error('TTS generation failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}