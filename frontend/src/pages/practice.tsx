import React, { useState, useCallback, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  FaMicrophone,
  FaVolumeUp,
  FaPlay,
  FaStop,
  FaCheckCircle,
  FaHistory,
  FaRobot,
  FaSpinner,
} from "react-icons/fa";
import { BsSoundwave, BsPieChartFill } from "react-icons/bs";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// --- Types ---
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

const audioCache = new Map<string, string>(); 

export default function PracticePage() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlayingNative, setIsPlayingNative] = useState<boolean>(false);
  const [analysisStatus, setAnalysisStatus] = useState<
    "idle" | "analyzing" | "complete"
  >("idle");
  const [gptFeedback, setGptFeedback] = useState<string | null>(null);
  const [isPreloading, setIsPreloading] = useState<boolean>(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cacheKey = `${CURRENT_PHRASE.language}:${CURRENT_PHRASE.targetPhrase}`;

  // Preload audio on mount
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
            voice: "femi",      // Yoruba male voice (valid Spitch voice)
            language: "yo",     // Yoruba language code
            format: "mp3",
          }),
        });

        if (!response.ok) throw new Error("Preload failed");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        audioCache.set(cacheKey, url);

        // Preload the audio element for faster playback
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

  const handleToggleRecord = useCallback(async () => {
    setIsRecording((prev) => !prev);
    if (isRecording) {
      setAnalysisStatus("analyzing");
      setGptFeedback(null);
      const feedbackText =
        "Great effort! Your mid-tone on 'Ẹ' was perfect, but try to elevate your pitch slightly more on 'ká'.";

      // Simulate analysis (skip audio generation to keep it simple and avoid errors)
      setTimeout(() => {
        setGptFeedback(feedbackText);
        setAnalysisStatus("complete");
      }, 1000);
    } else {
      setAnalysisStatus("idle");
      setGptFeedback(null);
    }
  }, [isRecording]);

  const handlePlayNative = useCallback(async () => {
    if (isPlayingNative) return;

    let audioUrl = audioCache.get(cacheKey);
    if (audioUrl) {
      const audio = new Audio(audioUrl);
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

  return (
    <>
      <Head>
        <title>Practice | AI Voice Lab - Afrolingo</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-surface font-sans text-foreground">
        <Navbar />

        <main className="flex-1 w-full max-w-6xl mx-auto px-6 pt-8 pb-20">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-on-surface-variant font-medium mb-4">
            <Link href="/learn" className="hover:text-primary transition-colors">
              Lessons
            </Link>
            <span>›</span>
            <span>{CURRENT_PHRASE.language} Basics</span>
            <span>›</span>
            <span className="text-primary font-bold">Pronunciation</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-10">
            AI Voice Lab
          </h1>

          {/* Top Section: Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[2rem] overflow-hidden float-shadow mb-8 shadow-sm border border-outline-variant">
            {/* Left Panel - Prompt */}
            <div className="bg-surface-container-lowest p-10 md:p-14 flex flex-col justify-center">
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
                <button
                  onClick={handlePlayNative}
                  className={`flex items-center gap-3 px-6 py-4 text-lg font-bold rounded-xl transition-colors ${
                    isPlayingNative
                      ? "bg-primary/80 text-on-primary cursor-not-allowed"
                      : "bg-primary text-on-primary hover:bg-primary/90 cursor-pointer"
                  }`}
                >
                  {isPreloading ? (
                    <FaSpinner className="animate-spin text-xl" />
                  ) : (
                    <FaVolumeUp className="text-xl" />
                  )}
                  {isPreloading ? "Loading audio..." : "Listen to Native"}
                </button>
                <button
                  className="w-14 h-14 flex items-center justify-center rounded-xl border-2 border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                  aria-label="Play slowly"
                >
                  <FaPlay className="ml-1" />
                </button>
              </div>

              <div className="flex items-center gap-3 text-sm font-medium text-success bg-success/10 w-fit px-4 py-2 rounded-lg">
                <FaCheckCircle className="text-lg" />
                AI analysis active. Focus on the {CURRENT_PHRASE.toneFocus}.
              </div>
            </div>

            {/* Right Panel */}
            <div className="bg-surface-container-low p-10 md:p-14 flex flex-col items-center justify-center relative min-h-[500px]">
              {/* Visualizer */}
              <div className="flex items-center justify-center gap-1.5 h-32 mb-16">
                {[40, 60, 30, 80, 100, 60, 40, 90, 70, 50, 80, 40, 60].map(
                  (height, i) => (
                    <div
                      key={i}
                      className={`w-2 rounded-full transition-all duration-300 ${
                        isRecording
                          ? "bg-primary animate-pulse"
                          : "bg-primary/30"
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  )
                )}
              </div>

              {/* Record Button */}
              <button
                onClick={handleToggleRecord}
                className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl text-on-primary shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer ${
                  isRecording ? "bg-error animate-pulse" : "bg-primary"
                }`}
              >
                {isRecording ? <FaStop /> : <FaMicrophone />}
              </button>

              {/* Status & Yarn GPT Feedback */}
              <div className="mt-8 text-center min-h-[120px] w-full max-w-md">
                {analysisStatus === "analyzing" && (
                  <div className="animate-fade-in">
                    <h3 className="text-xl font-bold text-primary mb-1 flex items-center justify-center gap-2">
                      <FaRobot className="animate-bounce" /> Yarn GPT is
                      analyzing...
                    </h3>
                    <p className="text-sm text-on-surface-variant">
                      Checking tone and rhythm against native models
                    </p>
                    <div className="w-48 h-1.5 bg-surface-container-high rounded-full mt-4 mx-auto overflow-hidden">
                      <div className="h-full bg-primary w-1/2 animate-pulse rounded-full" />
                    </div>
                  </div>
                )}

                {analysisStatus === "complete" && gptFeedback && (
                  <div className="bg-surface p-4 rounded-xl border border-primary/20 shadow-sm animate-fade-in">
                    <h3 className="text-lg font-bold text-success flex items-center justify-center gap-2 mb-2">
                      <FaCheckCircle /> Analysis Complete
                    </h3>
                    <p className="text-sm text-on-surface leading-relaxed">
                      <strong className="text-primary">Yarn GPT:</strong>{" "}
                      {gptFeedback}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section: Features Grid  */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              icon={<FaRobot />}
              title="Yarn GPT Feedback"
              description="Get instant, personalized coaching tips from our AI language tutor."
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

// --- Subcomponents ---
function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant transition-transform hover:-translate-y-1">
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