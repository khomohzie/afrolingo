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

// --- Navbar Component ---
function Navbar() {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-surface border-b border-outline">
            <Link href="/" className="flex items-center gap-3">
                <img src="/logo.png" alt="AfroLingo Logo" className="w-8 h-8 rounded-md" />
                <span className="font-heading font-bold text-xl text-primary tracking-tight">
                    AfroLingo
                </span>
            </Link>
            <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-on-surface-variant">
                <Link href="/learn" className="hover:text-primary transition-colors">Lessons</Link>
                <Link href="/practice" className="text-primary font-bold border-b-2 border-primary pb-1">Practice</Link>
                <Link href="/community" className="hover:text-primary transition-colors">Community</Link>
            </nav>
            <div className="flex items-center gap-4">
                <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
                    <FaCog className="text-lg" />
                </button>
                <button className="w-10 h-10 rounded-full bg-[#d6c5b3] border-2 border-surface flex items-center justify-center overflow-hidden">
                    <div className="w-full h-2/3 bg-surface-container-lowest mt-4 rounded-t-full opacity-50"></div>
                </button>
            </div>
        </header>
    );
}

export default function PracticePage() {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isPlayingNative, setIsPlayingNative] = useState<boolean>(false);
    const [analysisStatus, setAnalysisStatus] = useState<"idle" | "analyzing" | "aiSpeaking" | "complete">("idle");
    const [aiSubtitle, setAiSubtitle] = useState<string>("");

    const defaultHeights = [40, 60, 30, 80, 100, 60, 40, 90, 70, 50, 80, 40, 60];
    const [waveHeights, setWaveHeights] = useState<number[]>(defaultHeights);

    // FIXED: Moved these inside the component!
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<BlobPart[]>([]);

    const handleAiResponse = useCallback((feedbackText: string) => {
        const utterance = new SpeechSynthesisUtterance(feedbackText);

        utterance.onstart = () => {
            setAnalysisStatus("aiSpeaking");
            setAiSubtitle(feedbackText);

            // --- Start the Visualizer Magic ---
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 32;

            audioContextRef.current = audioCtx;
            analyserRef.current = analyser;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const updateWave = () => {
                if (analyserRef.current) {
                    analyserRef.current.getByteFrequencyData(dataArray);
                    const newHeights = Array.from(dataArray).slice(0, 13).map(val =>
                        Math.max(20, (val / 255) * 100)
                    );
                    setWaveHeights(newHeights);
                    requestAnimationFrame(updateWave);
                }
            };
            updateWave();
        };

        utterance.onend = () => {
            analyserRef.current = null;
            if (audioContextRef.current) audioContextRef.current.close();
            setTimeout(() => {
                setAnalysisStatus("idle");
                setWaveHeights(defaultHeights);
            }, 500);
        };

        window.speechSynthesis.speak(utterance);
    }, [defaultHeights]);

    const handleToggleRecord = useCallback(async () => {
        if (!isRecording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                mediaRecorder.start();
                setIsRecording(true);
                setAnalysisStatus("idle");
                setAiSubtitle(""); // Clear old subtitles

            } catch (error) {
                console.error("Error accessing microphone:", error);
                alert("Please allow microphone access to practice pronunciation.");
            }
        } else {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());

                mediaRecorderRef.current.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

                    setIsRecording(false);
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
        }
    }, [isRecording, handleAiResponse]);

    const handlePlayNative = useCallback(() => {
        setIsPlayingNative(true);
        setTimeout(() => setIsPlayingNative(false), 2000);
    }, []);

    return (
        <>
            <Head>
                <title>Practice | AI Voice Lab - AfroLingo</title>
            </Head>

            <div className="min-h-screen flex flex-col bg-surface font-sans text-foreground">
                <Navbar />

                <main className="flex-1 w-full max-w-6xl mx-auto px-6 pt-8 pb-20">
                    <nav className="flex items-center gap-2 text-sm text-on-surface-variant font-medium mb-4">
                        <Link href="/learn" className="hover:text-primary transition-colors">Lessons</Link>
                        <span>›</span>
                        <span>{CURRENT_PHRASE.language} Basics</span>
                        <span>›</span>
                        <span className="text-primary font-bold">Pronunciation</span>
                    </nav>

                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-10">
                        AI Voice Lab
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[2rem] overflow-hidden float-shadow mb-8">
                        {/* Left Panel */}
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
                                <button onClick={handlePlayNative} className="btn-primary flex items-center gap-3 px-6 py-4 text-lg border-none">
                                    <FaVolumeUp className="text-xl" />
                                    Listen to Native
                                </button>
                                <button className="w-14 h-14 flex items-center justify-center rounded-xl border-2 border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer">
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

                            {/* FIXED: Waveform colors and speed */}
                            {/* Right Panel Waveform */}
                            <div className="flex items-center justify-center gap-1.5 h-32 mb-16">
                                {waveHeights.map((height, i) => (
                                    <div
                                        key={i}
                                        className={`w-2 rounded-full transition-all duration-75 ${isRecording
                                                ? "bg-primary animate-pulse"
                                                : analysisStatus === "aiSpeaking"
                                                    ? "bg-primary"
                                                    : "bg-primary/30"
                                            }`}
                                        style={{ height: `${height}%` }}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={handleToggleRecord}
                                disabled={analysisStatus === "analyzing" || analysisStatus === "aiSpeaking"}
                                className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl text-on-primary shadow-xl transition-all duration-300 ${isRecording
                                        ? "bg-error animate-pulse hover:scale-105 cursor-pointer"
                                        : analysisStatus !== "idle"
                                            ? "bg-primary/50 cursor-not-allowed scale-95"
                                            : "bg-primary hover:scale-105 cursor-pointer"
                                    }`}
                            >
                                {isRecording ? <FaStop /> : <FaMicrophone />}
                            </button>

                            {/* FIXED: Added Subtitle UI */}
                            <div className="mt-8 text-center h-24 flex flex-col items-center justify-start w-full max-w-sm">
                                {analysisStatus === "analyzing" && (
                                    <div className="animate-in fade-in duration-300">
                                        <h3 className="text-xl font-bold text-primary mb-1">Analyzing pronunciation...</h3>
                                        <div className="w-48 h-1.5 bg-surface-container-high rounded-full mt-4 mx-auto overflow-hidden">
                                            <div className="h-full bg-primary w-1/2 animate-pulse rounded-full" />
                                        </div>
                                    </div>
                                )}

                                {/* Real-time Subtitles display here! */}
                                {(analysisStatus === "aiSpeaking" || (analysisStatus === "idle" && aiSubtitle)) && (
                                    <div className="min-h-[60px] flex items-center justify-center animate-in fade-in duration-500">
                                        <p className="text-lg font-medium text-primary leading-relaxed text-center">
                                            "{aiSubtitle}"
                                        </p>
                                    </div>
                                )}

                                {analysisStatus === "idle" && !aiSubtitle && (
                                    <p className="text-on-surface-variant font-medium">Tap to speak</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FeatureCard icon={<BsSoundwave />} title="Pitch Detection" description="Visual feedback on your tonal accuracy for Yoruba's three core tones." />
                        <FeatureCard icon={<BsPieChartFill />} title="Rhythm Analysis" description="Learn the natural cadence and flow of conversational Yoruba." />
                        <FeatureCard icon={<FaHistory />} title="Practice History" description="Track your progress over time with stored recordings and scores." />
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
        <div className="bg-surface-container-lowest p-8 rounded-2xl float-shadow transition-transform hover:-translate-y-1">
            <div className="text-2xl text-primary mb-4">{icon}</div>
            <h3 className="font-heading font-bold text-lg text-primary mb-2">{title}</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">{description}</p>
        </div>
    );
}