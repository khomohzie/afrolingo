import React, { useState, useCallback, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
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
import { completePhrase } from "@/lib/lessons";
import api from "@/lib/axios";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface PhraseData {
  id: string;
  targetPhrase: string;
  translation: string;
  language: string;
  audioUrl?: string;
  romanization?: string;
  toneNotes?: string;
}

interface IScoreBreakdown {
  overall: number;
  tone: number;
  rhythm: number;
  clarity: number;
  feedback: string[];
  grade: "A" | "B" | "C" | "D" | "F";
}

interface IHistoryRecord {
  score: number;
  recordedAt: string;
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const DEFAULT_WAVE_HEIGHTS = [
  40, 60, 30, 80, 100, 60, 40, 90, 70, 50, 80, 40, 60,
];

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
  const router = useRouter();
  const { authenticated, ready } = useAuth();
  const { phraseId, phrase, translation, language } = router.query;

  const [phraseData, setPhraseData] = useState<PhraseData | null>(null);
  const [isLoadingPhrase, setIsLoadingPhrase] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!ready) return;
    if (!authenticated) router.replace("/login");
  }, [ready, authenticated, router]);

  useEffect(() => {
    if (!ready || !authenticated) return;

    const fetchPhraseData = async () => {
      setIsLoadingPhrase(true);
      setError(null);

      if (phrase && translation && language) {
        setPhraseData({
          id: (phraseId as string) || "temp",
          targetPhrase: phrase as string,
          translation: translation as string,
          language: language as string,
          audioUrl: (router.query.audioUrl as string) || undefined,
          romanization: (router.query.romanization as string) || undefined,
          toneNotes: (router.query.toneNotes as string) || undefined,
        });
        setIsLoadingPhrase(false);
        return;
      }

      setError("Missing phrase information");
      setIsLoadingPhrase(false);
    };

    fetchPhraseData();
  }, [phraseId, phrase, translation, language, ready, authenticated]);

  const mainRef = useRef<HTMLElement>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isPlayingNative, setIsPlayingNative] = useState<boolean>(false);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [hasAttempted, setHasAttempted] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const [analysisStatus, setAnalysisStatus] = useState<
    "idle" | "analyzing" | "complete"
  >("idle");
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const [pronunciationBreakdown, setPronunciationBreakdown] =
    useState<IScoreBreakdown | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [passedAttempt, setPassedAttempt] = useState<boolean | null>(null);
  const [attemptHistory, setAttemptHistory] = useState<IHistoryRecord[]>([]);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const [waveHeights, setWaveHeights] = useState<number[]>(DEFAULT_WAVE_HEIGHTS);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const idleAnimationRef = useRef<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // GSAP animations
  useEffect(() => {
    if (!isMounted || isLoadingPhrase || !mainRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".animate-nav", { opacity: 0, y: -10, duration: 0.4, ease: "power2.out" })
        .from(".animate-title", { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" }, "-=0.2")
        .from(".animate-panel-left", { opacity: 0, x: -40, duration: 0.8, ease: "power3.out" }, "-=0.4")
        .from(".animate-panel-right", { opacity: 0, x: 40, duration: 0.8, ease: "power3.out" }, "-=0.8")
        .from(".animate-feature", { opacity: 0, y: 30, stagger: 0.15, duration: 0.6, ease: "back.out(1.7)" }, "-=0.4");
    }, mainRef);
    return () => ctx.revert();
  }, [isMounted, isLoadingPhrase]);

  const loadPhraseHistory = useCallback(async (id: string) => {
    if (!id || id === "temp") return;

    setIsLoadingHistory(true);
    try {
      const res = await api.get(`/ai/history/${id}`);
      const data = res.data?.data;

      setAttemptHistory(data?.history ?? []);
      setBestScore(data?.bestScore ?? null);
    } catch (historyError) {
      console.error("Failed to load phrase history", historyError);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    if (!phraseData?.id || phraseData.id === "temp") return;
    loadPhraseHistory(phraseData.id);
  }, [phraseData?.id, loadPhraseHistory]);

  useEffect(() => {
    const shouldAnimate =
      !isRecording &&
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

  const handlePlayNative = useCallback(() => {
    if (!phraseData) return;
    if (!phraseData.audioUrl) {
      toast.error("Audio not available for this phrase.");
      return;
    }
    if (isPlayingNative) return;

    setIsPlayingNative(true);
    const audio = new Audio(phraseData.audioUrl);
    audio.onended = () => setIsPlayingNative(false);
    audio.play().catch((err) => {
      console.error("Playback error:", err);
      setIsPlayingNative(false);
      toast.error("Could not play audio.");
    });
  }, [phraseData, isPlayingNative]);

  const handleToggleRecord = useCallback(async () => {
    if (!phraseData) return;
    if (!phraseData.id || phraseData.id === "temp") {
      toast.error("Phrase id is missing. Please open this from a lesson phrase.");
      return;
    }

    if (!isRecording) {
      setWaveHeights(DEFAULT_WAVE_HEIGHTS);
      setHasAttempted(false);
      setAccuracyScore(null);
      setPronunciationBreakdown(null);
      setXpEarned(0);
      setPassedAttempt(null);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
        toast.error("Please allow microphone access to practice pronunciation.");
      }
    } else {
      if (!mediaRecorderRef.current) return;

      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());

      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      setWaveHeights((prev) => [...prev]);
      analyserRef.current = null;
      if (audioContextRef.current) audioContextRef.current.close();

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setIsRecording(false);
        setHasAttempted(true);
        setAnalysisStatus("analyzing");

        const sendRecording = async () => {
          try {
            const formData = new FormData();
            formData.append("audio", audioBlob, "recording.webm");

            const res = await api.post(`/ai/score/${phraseData.id}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            const payload = res.data?.data;
            setAccuracyScore(payload?.score?.overall ?? null);
            setPronunciationBreakdown(payload?.score ?? null);
            setXpEarned(payload?.xpEarned ?? 0);
            setPassedAttempt(Boolean(payload?.passed));
            setBestScore(payload?.bestScore ?? null);
            setAnalysisStatus("complete");

            if (phraseData.id && phraseData.id !== "temp") {
              loadPhraseHistory(phraseData.id);
            }
          } catch (scoreError) {
            console.error("Failed to score recording", scoreError);
            setAnalysisStatus("idle");
            toast.error("Could not score recording. Please try again.");
          }
        };

        sendRecording();
      };
    }
  }, [isRecording, phraseData, loadPhraseHistory]);

  const handleComplete = useCallback(async () => {
    if (!phraseData?.id) return;
    setIsCompleting(true);
    try {
      const data = await completePhrase(phraseData.id);
      if (data.success) {
        setIsCompleted(true);
        toast.success("Phrase completed! 🎉");
        setTimeout(() => router.back(), 1000);
      } else {
        toast.error("Could not mark as complete. Try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  }, [phraseData, router]);


  if (!ready || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (isLoadingPhrase) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }


  if (error || !phraseData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <p className="text-red-500 text-center mb-4">{error || "Phrase not found"}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

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
        >
          <nav className="animate-nav flex items-center gap-2 text-sm text-on-surface-variant font-medium mb-4">
            <Link href="/learn" className="hover:text-primary transition-colors">
              Lessons
            </Link>
            <span>›</span>
            <button
              onClick={() => router.back()}
              className="hover:text-primary cursor-pointer transition-colors capitalize"
            >
              {phraseData.language} Basics
            </button>
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
                {phraseData.targetPhrase}
              </h2>
              <p className="text-2xl text-on-surface-variant mb-12">
                {phraseData.translation}
              </p>

              {phraseData.romanization && (
                <p className="text-sm text-on-surface-variant mb-4 italic">
                  {phraseData.romanization}
                </p>
              )}

              <div className="flex items-center gap-4 mb-16">
                <Button
                  onClick={handlePlayNative}
                  disabled={isPlayingNative}
                  className="flex items-center gap-3 px-6 h-14 text-lg rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <FaVolumeUp className="text-xl" />
                  {isPlayingNative ? "Playing..." : "Listen to Native"}
                </Button>

                {hasAttempted && !isCompleted && (
                  <Button
                    onClick={handleComplete}
                    disabled={isCompleting}
                    className="flex items-center gap-3 px-6 h-14 text-lg rounded-xl bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isCompleting ? (
                      <FaSpinner className="animate-spin text-xl" />
                    ) : (
                      <FaCheckCircle className="text-xl" />
                    )}
                    {isCompleting ? "Saving..." : "Complete Lesson"}
                  </Button>
                )}

                {isCompleted && (
                  <div className="flex items-center gap-2 text-green-500 font-bold">
                    <FaCheckCircle />
                    <span>Completed!</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm font-medium text-green-500 bg-green-50 w-fit px-4 py-2 rounded-lg">
                <FaCheckCircle className="text-lg" />
                AI analysis active.
              </div>
            </div>

            <div className="animate-panel-right bg-surface-container-low p-10 md:p-14 flex flex-col items-center justify-center relative min-h-125">
              <div className="flex items-center justify-center gap-1.5 h-32 mb-16">
                {waveHeights.map((height, i) => (
                  <div
                    key={i}
                    className={`w-2 rounded-full transition-all duration-100 ${isRecording
                      ? "bg-primary"
                      : analysisStatus === "analyzing"
                        ? "bg-primary"
                        : "bg-primary/40"
                      }`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>

              <Button
                onClick={handleToggleRecord}
                disabled={analysisStatus === "analyzing"}
                className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 [&_svg]:size-8 ${isRecording
                  ? "bg-red-500 hover:bg-red-600 animate-pulse scale-105 text-white"
                  : analysisStatus === "analyzing"
                    ? "bg-primary/50 cursor-not-allowed scale-95 text-primary-foreground"
                    : "bg-primary hover:bg-primary/90 hover:scale-105 text-primary-foreground"
                  }`}
              >
                {isRecording ? <FaStop /> : hasAttempted ? <FaRedo /> : <FaMicrophone />}
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

                {pronunciationBreakdown && analysisStatus !== "analyzing" && (
                  <div className="w-full bg-surface-container-lowest border border-border rounded-xl p-4 text-left space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-on-surface-variant">
                        Grade
                      </span>
                      <span className="font-bold text-primary">
                        {pronunciationBreakdown.grade}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <p>Tone: {pronunciationBreakdown.tone}%</p>
                      <p>Rhythm: {pronunciationBreakdown.rhythm}%</p>
                      <p>Clarity: {pronunciationBreakdown.clarity}%</p>
                    </div>
                    {passedAttempt !== null && (
                      <p
                        className={`text-sm font-semibold ${passedAttempt ? "text-green-600" : "text-amber-600"}`}
                      >
                        {passedAttempt
                          ? `Passed! +${xpEarned} XP earned`
                          : "Below pass mark (60%). Try again!"}
                      </p>
                    )}
                    <div className="space-y-1">
                      {pronunciationBreakdown.feedback.map((tip, idx) => (
                        <p
                          key={`${tip}-${idx}`}
                          className="text-xs text-on-surface-variant"
                        >
                          - {tip}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {analysisStatus === "idle" &&
                  !pronunciationBreakdown &&
                  accuracyScore === null && (
                    <p className="text-on-surface-variant font-medium">Tap to speak</p>
                  )}
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 float-shadow mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-xl text-primary">
                Phrase History
              </h3>
              {bestScore !== null && (
                <span className="text-sm font-semibold text-on-surface-variant">
                  Best Score: {bestScore}%
                </span>
              )}
            </div>

            {isLoadingHistory && (
              <p className="text-sm text-on-surface-variant">
                Loading history...
              </p>
            )}

            {!isLoadingHistory && attemptHistory.length === 0 && (
              <p className="text-sm text-on-surface-variant">
                No attempts yet. Record your first attempt.
              </p>
            )}

            {!isLoadingHistory && attemptHistory.length > 0 && (
              <div className="space-y-2">
                {attemptHistory
                  .slice()
                  .reverse()
                  .slice(0, 6)
                  .map((entry, index) => (
                    <div
                      key={`${entry.recordedAt}-${index}`}
                      className="flex items-center justify-between border border-border rounded-lg px-4 py-3 text-sm"
                    >
                      <span className="text-on-surface-variant">
                        {new Date(entry.recordedAt).toLocaleString()}
                      </span>
                      <span className="font-bold text-primary">
                        {entry.score}%
                      </span>
                    </div>
                  ))}
              </div>
            )}
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
      <h3 className="font-heading font-bold text-lg text-primary mb-2">{title}</h3>
      <p className="text-on-surface-variant text-sm leading-relaxed">{description}</p>
    </div>
  );
}