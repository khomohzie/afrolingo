import React, { useState, useCallback, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import gsap from "gsap";
import {
  FaMicrophone,
  FaVolumeUp,
  FaStop,
  FaCheckCircle,
  FaHistory,
  FaSpinner,
  FaRedo,
} from "react-icons/fa";
import { BsSoundwave, BsPieChartFill } from "react-icons/bs";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

interface PhraseData {
  id: string;
  targetPhrase: string;
  translation: string;
  language: string;
  toneFocus: string;
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const CURRENT_PHRASE: PhraseData = {
  id: "phrase-1",
  targetPhrase: "Ẹ̀gbọ́n mi",
  translation: '"My older sibling" (Yoruba)',
  language: "Yoruba",
  toneFocus: "low tone on 'Ẹ̀' and the high tone on 'gbọ́n'",
};

const DEFAULT_WAVE_HEIGHTS = [
  40, 60, 30, 80, 100, 60, 40, 90, 70, 50, 80, 40, 60,
];

const audioCache = new Map<string, string>();

function AccuracyRing({ score }: { score: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  const colorClass =
    score >= 80
      ? "stroke-green-500"
      : score >= 60
      ? "stroke-amber-400"
      : "stroke-red-400";
  const textColorClass =
    score >= 80
      ? "text-green-500"
      : score >= 60
      ? "text-amber-400"
      : "text-red-400";
  const label =
    score >= 80
      ? "Excellent pronunciation!"
      : score >= 60
      ? "Good effort, keep practicing"
      : "Keep going, you'll get it!";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center gap-3 w-full">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-surface-container-high"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`transition-all duration-1000 ${colorClass}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-2xl font-black leading-none ${textColorClass}`}
          >
            {score}%
          </span>
        </div>
      </div>
      <p className={`text-sm font-bold ${textColorClass}`}>{label}</p>
    </div>
  );
}

export default function PracticePage() {
  const mainRef = useRef<HTMLElement>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isPlayingNative, setIsPlayingNative] = useState<boolean>(false);
  const [isPreloading, setIsPreloading] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cacheKey = `${CURRENT_PHRASE.language}:${CURRENT_PHRASE.targetPhrase}`;

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [hasAttempted, setHasAttempted] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const [analysisStatus, setAnalysisStatus] = useState<
    "idle" | "analyzing" | "aiSpeaking" | "complete"
  >("idle");
  const [aiSubtitle, setAiSubtitle] = useState<string>("");
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);

  const [waveHeights, setWaveHeights] =
    useState<number[]>(DEFAULT_WAVE_HEIGHTS);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const idleAnimationRef = useRef<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const shouldAnimate =
      !isRecording &&
      analysisStatus !== "aiSpeaking" &&
      analysisStatus !== "analyzing";

    if (shouldAnimate) {
      const animateIdle = () => {
        setWaveHeights((prev) =>
          prev.map((h) => {
            const delta = (Math.random() - 0.5) * 15;
            return Math.min(100, Math.max(15, h + delta));
          })
        );
        idleAnimationRef.current = window.setTimeout(animateIdle, 120);
      };
      idleAnimationRef.current = window.setTimeout(animateIdle, 120);
    }

    return () => {
      if (idleAnimationRef.current) clearTimeout(idleAnimationRef.current);
    };
  }, [isRecording, analysisStatus]);

  useEffect(() => {
    if (!isMounted) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".animate-nav", {
        opacity: 0,
        y: -10,
        duration: 0.4,
        ease: "power2.out",
      })
        .from(
          ".animate-title",
          { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" },
          "-=0.2"
        )
        .from(
          ".animate-panel-left",
          { opacity: 0, x: -40, duration: 0.8, ease: "power3.out" },
          "-=0.4"
        )
        .from(
          ".animate-panel-right",
          { opacity: 0, x: 40, duration: 0.8, ease: "power3.out" },
          "-=0.8"
        )
        .from(
          ".animate-feature",
          {
            opacity: 0,
            y: 30,
            stagger: 0.15,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        );
    }, mainRef);
    return () => ctx.revert();
  }, [isMounted]);

  useEffect(() => {
    const preloadAudio = async () => {
      if (audioCache.has(cacheKey)) {
        setIsPreloading(false);
        return;
      }
      try {
        const response = await fetch("/api/text-to-speech", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: CURRENT_PHRASE.targetPhrase,
            voice: "femi",
            language: "yo",
            format: "mp3",
          }),
        });
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Server error: ${response.status}`);
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        audioCache.set(cacheKey, url);
        const audio = new Audio(url);
        audio.load();
        audioRef.current = audio;
      } catch (error) {
        console.error("Preload error:", error);
      } finally {
        setIsPreloading(false);
      }
    };
    preloadAudio();
  }, [cacheKey]);

  const handleAiResponse = useCallback((feedbackText: string) => {
    const utterance = new SpeechSynthesisUtterance(feedbackText);

    utterance.onstart = () => {
      setAnalysisStatus("aiSpeaking");
      setAiSubtitle(feedbackText);

      const audioCtx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 32;
      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateWave = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          setWaveHeights(
            Array.from(dataArray)
              .slice(0, 13)
              .map((val) => Math.max(20, (val / 255) * 100))
          );
          animationFrameRef.current = requestAnimationFrame(updateWave);
        }
      };
      updateWave();
    };

    utterance.onend = () => {
      analyserRef.current = null;
      if (audioContextRef.current) audioContextRef.current.close();
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      setTimeout(() => {
        setAnalysisStatus("idle");
        setWaveHeights(DEFAULT_WAVE_HEIGHTS);
      }, 500);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const handleToggleRecord = useCallback(async () => {
    if (!isRecording) {
      setWaveHeights(DEFAULT_WAVE_HEIGHTS);
      setHasAttempted(false);
      setAccuracyScore(null);
      setAiSubtitle("");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        const audioCtx = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 32;
        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateWave = () => {
          if (analyserRef.current) {
            analyserRef.current.getByteFrequencyData(dataArray);
            setWaveHeights(
              Array.from(dataArray)
                .slice(0, 13)
                .map((val) => Math.max(20, (val / 255) * 100))
            );
            animationFrameRef.current = requestAnimationFrame(updateWave);
          }
        };
        updateWave();

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };

        mediaRecorder.start();
        setIsRecording(true);
        setAnalysisStatus("idle");
      } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Please allow microphone access to practice pronunciation.");
      }
    } else {
      if (!mediaRecorderRef.current) return;

      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());

      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      setWaveHeights((prev) => [...prev]);
      analyserRef.current = null;
      if (audioContextRef.current) audioContextRef.current.close();

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setIsRecording(false);
        setHasAttempted(true);
        setAnalysisStatus("analyzing");

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          try {
            const base64Audio = reader.result;
            const response = await fetch("/api/analyze", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                audioBase64: base64Audio,
                language: CURRENT_PHRASE.language,
                targetPhrase: CURRENT_PHRASE.targetPhrase,
                toneFocus: CURRENT_PHRASE.toneFocus,
              }),
            });

            const data = await response.json();
            if (data.feedback) {
              setAccuracyScore(data.score ?? null);
              handleAiResponse(data.feedback);
            }
          } catch (error) {
            console.error("Failed to fetch analysis", error);
            setAnalysisStatus("idle");
            alert("Sorry, the AI is taking a break. Try again!");
          }
        };
      };
    }
  }, [isRecording, handleAiResponse]);

  const handlePlayNative = useCallback(async () => {
    if (isPlayingNative) return;

    const cachedUrl = audioCache.get(cacheKey);
    if (cachedUrl) {
      const audio = new Audio(cachedUrl);
      audio.onended = () => setIsPlayingNative(false);
      setIsPlayingNative(true);
      audio.play().catch((err) => {
        console.error("Playback error:", err);
        setIsPlayingNative(false);
      });
      return;
    }

    setIsPlayingNative(true);
    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: CURRENT_PHRASE.targetPhrase,
          voice: "femi",
          language: "yo",
          format: "mp3",
        }),
      });
      if (!response.ok) throw new Error("API request failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      audioCache.set(cacheKey, url);
      const audio = new Audio(url);
      audio.onended = () => setIsPlayingNative(false);
      await audio.play();
    } catch (error) {
      console.error("Error generating native audio:", error);
      alert("Oops! Couldn't load the native pronunciation right now.");
      setIsPlayingNative(false);
    }
  }, [isPlayingNative, cacheKey]);

  if (!isMounted) return null;

  return (
    <>
      <Head>
        <title>Practice | AI Voice Lab - AfroLingo</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-surface font-sans text-foreground">
        <Navbar />

        <main
          ref={mainRef}
          className="flex-1 w-full max-w-6xl mx-auto px-6 pt-8 pb-20"
          style={{ visibility: isMounted ? "visible" : "hidden" }}
        >
          <nav className="animate-nav flex items-center gap-2 text-sm text-on-surface-variant font-medium mb-4">
            <Link
              href="/learn"
              className="hover:text-primary transition-colors"
            >
              Lessons
            </Link>
            <span>›</span>
            <span>{CURRENT_PHRASE.language} Basics</span>
            <span>›</span>
            <span className="text-primary font-bold">Pronunciation</span>
          </nav>

          <h1 className="animate-title text-4xl md:text-5xl font-heading font-bold text-primary mb-10">
            AI Voice Lab
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-4xl overflow-hidden float-shadow mb-8">
            <div className="animate-panel-left bg-surface-container-lowest p-10 md:p-14 flex flex-col justify-center">
              <div className="mb-8">
                <span className="inline-block bg-surface-container px-4 py-1.5 rounded-full text-xs font-bold tracking-widest text-on-surface-variant uppercase">
                  Target Phrase
                </span>
              </div>

              <h2 className="text-6xl md:text-7xl font-heading font-bold text-primary mb-4 tracking-tight">
                {CURRENT_PHRASE.targetPhrase}
              </h2>
              <p className="text-2xl text-on-surface-variant mb-12">
                {CURRENT_PHRASE.translation}
              </p>

              <div className="flex items-center gap-4 mb-16">
                <Button
                  onClick={handlePlayNative}
                  disabled={isPlayingNative || isPreloading}
                  className={`flex items-center gap-3 px-6 h-14 text-lg rounded-xl transition-colors ${
                    isPlayingNative || isPreloading
                      ? "bg-primary/80 text-primary-foreground cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90 text-primary-foreground"
                  }`}
                >
                  {isPreloading ? (
                    <FaSpinner className="animate-spin text-xl" />
                  ) : (
                    <FaVolumeUp className="text-xl" />
                  )}
                  {isPreloading
                    ? "Loading audio..."
                    : isPlayingNative
                    ? "Speaking..."
                    : "Listen to Native"}
                </Button>
              </div>

              <div className="flex items-center gap-3 text-sm font-medium text-green-500 bg-green-50 w-fit px-4 py-2 rounded-lg">
                <FaCheckCircle className="text-lg" />
                AI analysis active. Focus on the {CURRENT_PHRASE.toneFocus}.
              </div>
            </div>

            <div className="animate-panel-right bg-surface-container-low p-10 md:p-14 flex flex-col items-center justify-center relative min-h-125">
              <div className="flex items-center justify-center gap-1.5 h-32 mb-16">
                {waveHeights.map((height, i) => (
                  <div
                    key={i}
                    className={`w-2 rounded-full transition-all duration-100 ${
                      isRecording
                        ? "bg-primary"
                        : analysisStatus === "aiSpeaking"
                        ? "bg-primary"
                        : "bg-primary/40"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>

              <Button
                onClick={handleToggleRecord}
                disabled={
                  analysisStatus === "analyzing" ||
                  analysisStatus === "aiSpeaking"
                }
                className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 [&_svg]:size-8 ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 animate-pulse scale-105 text-white"
                    : analysisStatus !== "idle"
                    ? "bg-primary/50 cursor-not-allowed scale-95 text-primary-foreground"
                    : "bg-primary hover:bg-primary/90 hover:scale-105 text-primary-foreground"
                }`}
              >
                {isRecording ? (
                  <FaStop />
                ) : hasAttempted ? (
                  <FaRedo />
                ) : (
                  <FaMicrophone />
                )}
              </Button>

              <div className="mt-8 text-center flex flex-col items-center justify-start w-full max-w-sm gap-4">
                {accuracyScore !== null && analysisStatus !== "analyzing" && (
                  <AccuracyRing score={accuracyScore} />
                )}

                {analysisStatus === "analyzing" && (
                  <div className="animate-in fade-in duration-300">
                    <h3 className="text-xl font-bold text-primary mb-1">
                      Analyzing pronunciation...
                    </h3>
                    <div className="w-48 h-1.5 bg-surface-container-high rounded-full mt-4 mx-auto overflow-hidden">
                      <div className="h-full bg-primary w-1/2 animate-pulse rounded-full" />
                    </div>
                  </div>
                )}

                {(analysisStatus === "aiSpeaking" ||
                  (analysisStatus === "idle" && aiSubtitle)) && (
                  <div className="flex items-center justify-center animate-in fade-in duration-500">
                    <p className="text-base font-medium text-on-surface-variant leading-relaxed text-center italic">
                      "{aiSubtitle}"
                    </p>
                  </div>
                )}

                {analysisStatus === "idle" &&
                  !aiSubtitle &&
                  accuracyScore === null && (
                    <p className="text-on-surface-variant font-medium">
                      Tap to speak
                    </p>
                  )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<BsSoundwave />}
              title="Pitch Detection"
              description="Visual feedback on your tonal accuracy for Yoruba's three core tones."
            />
            <FeatureCard
              icon={<BsPieChartFill />}
              title="Rhythm Analysis"
              description="Learn the natural cadence and flow of conversational Yoruba."
            />
            <FeatureCard
              icon={<FaHistory />}
              title="Practice History"
              description="Track your progress over time with stored recordings and scores."
            />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="animate-feature bg-surface-container-lowest p-8 rounded-2xl float-shadow transition-transform hover:-translate-y-1">
      <div className="text-2xl text-primary mb-4">{icon}</div>
      <h3 className="font-heading font-bold text-lg text-primary mb-2">
        {title}
      </h3>
      <p className="text-on-surface-variant text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
