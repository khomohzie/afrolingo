import type { NextApiRequest, NextApiResponse } from 'next';

function mimeFromFormat(format: string) {
  switch (format) {
    case 'wav':
      return 'audio/wav';
    case 'ogg_opus':
      return 'audio/ogg';
    case 'webm_opus':
      return 'audio/webm';
    case 'flac':
      return 'audio/flac';
    case 'pcm_s16le':
      return 'audio/L16';
    case 'mulaw':
      return 'audio/mulaw';
    case 'alaw':
      return 'audio/alaw';
    case 'mp3':
    default:
      return 'audio/mpeg';
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      text,
      voice = 'femi',
      language = 'yo',
      format = 'mp3',
      model = 'legacy',
    } = req.body ?? {};

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const apiKey = process.env.SPITCH_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing SPITCH_API_KEY' });
    }

    const upstream = await fetch('https://api.spi-tch.com/v1/speech', {
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
        model,
      }),
    });

    const upstreamType = upstream.headers.get('content-type') || '';

    if (!upstream.ok) {
      let message = `Spitch API error (${upstream.status})`;
      let code: string | undefined;

      try {
        if (upstreamType.includes('application/json')) {
          const err = await upstream.json();
          message =
            err?.error?.message ||
            err?.message ||
            message;
          code = err?.error?.code;
        } else {
          const txt = await upstream.text();
          if (txt) message = txt;
        }
      } catch {
        // ignore parse failure, keep fallback message
      }

      console.error('Spitch upstream error:', {
        status: upstream.status,
        message,
        code,
      });

      return res.status(upstream.status).json({
        error: message,
        code,
      });
    }

    const audioBuffer = Buffer.from(await upstream.arrayBuffer());

    res.setHeader(
      'Content-Type',
      upstream.headers.get('content-type') || mimeFromFormat(format)
    );
    res.setHeader('Content-Length', String(audioBuffer.length));
    res.setHeader('Cache-Control', 'no-store');

    return res.status(200).send(audioBuffer);
  } catch (error) {
    console.error('TTS generation failed:', error);

    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}