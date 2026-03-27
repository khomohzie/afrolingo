import axios from "axios";
import { WaveFile } from "wavefile";
// @ts-ignore — no types for fft-js
import fft from "fft-js";

export interface PronunciationScore {
  overall: number; // 0-100
  tone: number; // 0-100 — frequency profile match
  rhythm: number; // 0-100 — amplitude envelope match
  clarity: number; // 0-100 — signal energy ratio
  feedback: string[];
  grade: "A" | "B" | "C" | "D" | "F";
}

/**
 * Main entry point.
 * Downloads the native YarnGPT audio, converts both to PCM,
 * then runs three signal-level comparisons.
 */
export const scorePronunciation = async (
  userAudioBuffer: Buffer,
  nativeAudioUrl: string,
  language: "yoruba" | "igbo" | "hausa",
  _phraseText: string
): Promise<PronunciationScore> => {
  try {
    const nativeBuffer = await downloadAudio(nativeAudioUrl);

    const userPCM = extractPCM(userAudioBuffer);
    const nativePCM = extractPCM(nativeBuffer);

    if (userPCM.length < 100) {
      return silenceScore();
    }

    const toneScore = compareFrequencyProfiles(userPCM, nativePCM);
    const rhythmScore = compareAmplitudeEnvelopes(userPCM, nativePCM);
    const clarityScore = computeClarity(userPCM);

    // Tone weighted highest — critical for Yoruba/Igbo/Hausa
    const overall = Math.round(
      toneScore * 0.5 + rhythmScore * 0.3 + clarityScore * 0.2
    );

    const clamped = {
      overall: clamp(overall),
      tone: clamp(toneScore),
      rhythm: clamp(rhythmScore),
      clarity: clamp(clarityScore),
    };

    return {
      ...clamped,
      feedback: buildFeedback(clamped, language),
      grade: scoreToGrade(clamped.overall),
    };
  } catch (error: any) {
    console.error("Scoring error:", error.message);
    return fallbackScore();
  }
};

// ─── Signal Processing ───────────────────────────────────────────────────────

/**
 * Extract normalised PCM samples.
 * Handles WAV natively via wavefile. For WebM from browser MediaRecorder,
 * falls back to treating raw bytes as 16-bit signed PCM.
 */
const extractPCM = (buffer: Buffer): Float64Array => {
  try {
    const wav = new WaveFile(buffer);
    wav.toBitDepth("32f");
    const samples = wav.getSamples(false, Float64Array);
    return normalise(samples);
  } catch {
    // Fallback for WebM/Ogg — read as raw 16-bit PCM
    const samples = new Float64Array(Math.floor(buffer.length / 2));
    for (let i = 0; i < samples.length; i++) {
      samples[i] = buffer.readInt16LE(i * 2) / 32768;
    }
    return normalise(samples);
  }
};

/**
 * Frequency profile comparison using FFT.
 * Computes cosine similarity between magnitude spectra.
 * Similar frequency profiles = similar tonal pattern.
 */
const compareFrequencyProfiles = (
  userPCM: Float64Array,
  nativePCM: Float64Array
): number => {
  const fftSize = 2048;
  const userSpectrum = computeSpectrum(userPCM, fftSize);
  const nativeSpectrum = computeSpectrum(nativePCM, fftSize);
  const similarity = cosineSimilarity(userSpectrum, nativeSpectrum);
  // Curve the similarity — even good matches land around 0.5-0.85
  return Math.round(Math.pow(Math.max(0, similarity), 0.6) * 100);
};

/**
 * Amplitude envelope comparison.
 * Splits signals into RMS frames and compares envelope shapes.
 * Also penalises large duration differences (speaking too fast/slow).
 */
const compareAmplitudeEnvelopes = (
  userPCM: Float64Array,
  nativePCM: Float64Array
): number => {
  const frameSize = 512;
  const userEnvelope = computeEnvelope(userPCM, frameSize);
  const nativeEnvelope = computeEnvelope(nativePCM, frameSize);

  const len = Math.min(userEnvelope.length, nativeEnvelope.length, 100);
  const userResampled = resampleArray(userEnvelope, len);
  const nativeResampled = resampleArray(nativeEnvelope, len);

  const similarity = cosineSimilarity(
    new Float64Array(userResampled),
    new Float64Array(nativeResampled)
  );

  const durationRatio =
    Math.min(userPCM.length, nativePCM.length) /
    Math.max(userPCM.length, nativePCM.length);

  return Math.round(similarity * 0.7 * 100 + durationRatio * 0.3 * 100);
};

/**
 * Clarity score — measures signal energy.
 * Strong consistent energy = clear speech.
 * Low energy = silence, mumbling, or bad mic.
 */
const computeClarity = (pcm: Float64Array): number => {
  const rms = Math.sqrt(pcm.reduce((sum, s) => sum + s * s, 0) / pcm.length);
  const mean = pcm.reduce((a, b) => a + b, 0) / pcm.length;
  const variance =
    pcm.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / pcm.length;

  const rmsScore = Math.min(1, rms / 0.15) * 100;
  const varScore = Math.min(1, Math.sqrt(variance) / 0.1) * 100;

  return Math.round(rmsScore * 0.6 + varScore * 0.4);
};

// ─── FFT Helpers ─────────────────────────────────────────────────────────────

const computeSpectrum = (pcm: Float64Array, fftSize: number): Float64Array => {
  const start = Math.max(0, Math.floor(pcm.length / 2) - fftSize / 2);
  const chunk = Array.from(pcm.slice(start, start + fftSize));
  while (chunk.length < fftSize) chunk.push(0);

  // Hann window to reduce spectral leakage
  const windowed = chunk.map(
    (s, i) => s * 0.5 * (1 - Math.cos((2 * Math.PI * i) / (fftSize - 1)))
  );

  const phasors = fft.fft(windowed);
  const magnitudes = fft.util.fftMag(phasors) as number[];
  return new Float64Array(magnitudes.slice(0, fftSize / 2));
};

const computeEnvelope = (pcm: Float64Array, frameSize: number): number[] => {
  const frames = Math.floor(pcm.length / frameSize);
  return Array.from({ length: frames }, (_, i) => {
    const frame = pcm.slice(i * frameSize, (i + 1) * frameSize);
    return Math.sqrt(frame.reduce((sum, s) => sum + s * s, 0) / frame.length);
  });
};

const cosineSimilarity = (a: Float64Array, b: Float64Array): number => {
  const len = Math.min(a.length, b.length);
  let dot = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

const normalise = (samples: Float64Array): Float64Array => {
  const max = Math.max(...Array.from(samples).map(Math.abs));
  if (max === 0) return samples;
  return new Float64Array(samples.map((s) => s / max));
};

const resampleArray = (arr: number[], targetLen: number): number[] =>
  Array.from({ length: targetLen }, (_, i) => {
    const pos = (i / targetLen) * arr.length;
    const idx = Math.floor(pos);
    const frac = pos - idx;
    return (arr[idx] ?? 0) + ((arr[idx + 1] ?? 0) - (arr[idx] ?? 0)) * frac;
  });

// ─── Audio Download ───────────────────────────────────────────────────────────

const downloadAudio = async (url: string): Promise<Buffer> => {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 10000,
  });
  return Buffer.from(response.data);
};

// ─── Feedback & Grading ───────────────────────────────────────────────────────

const buildFeedback = (
  scores: { overall: number; tone: number; rhythm: number; clarity: number },
  language: string
): string[] => {
  const tips: string[] = [];

  if (scores.overall >= 85) {
    tips.push(
      "Excellent! Your pronunciation matches the native speaker very closely."
    );
  } else if (scores.overall >= 70) {
    tips.push("Good effort — you are getting the hang of it.");
  } else if (scores.overall >= 50) {
    tips.push("Keep practising — you are improving with each attempt.");
  } else {
    tips.push(
      "Try listening to the native audio a few more times before recording again."
    );
  }

  if (scores.tone < 60 && (language === "yoruba" || language === "igbo")) {
    tips.push(
      `Tonal accuracy needs work. ${
        language === "yoruba" ? "Yoruba" : "Igbo"
      } tones change word meanings entirely — focus on matching the pitch of each syllable.`
    );
  } else if (scores.tone >= 80) {
    tips.push(
      "Your tone matching is strong — that is the hardest part for most learners!"
    );
  }

  if (scores.rhythm < 60) {
    tips.push(
      "Try to match the natural pace and rhythm of the native speaker."
    );
  }

  if (scores.clarity < 60) {
    tips.push("Speak more clearly and ensure your microphone is working well.");
  }

  return tips;
};

const scoreToGrade = (score: number): "A" | "B" | "C" | "D" | "F" => {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
};

const clamp = (n: number) => Math.min(100, Math.max(0, Math.round(n)));

const silenceScore = (): PronunciationScore => ({
  overall: 0,
  tone: 0,
  rhythm: 0,
  clarity: 0,
  grade: "F",
  feedback: ["No audio detected. Please check your microphone and try again."],
});

const fallbackScore = (): PronunciationScore => ({
  overall: 60,
  tone: 60,
  rhythm: 60,
  clarity: 60,
  grade: "C",
  feedback: ["Scoring is temporarily unavailable. Keep practising!"],
});
