import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
    FaMicrophone,
    FaVolumeUp,
    FaPlay,
    FaStop,
    FaCheckCircle,
    FaHistory,
    FaCog
} from 'react-icons/fa';
import { BsSoundwave, BsPieChartFill } from 'react-icons/bs';

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

// --- Mock Data ---
const CURRENT_PHRASE: PhraseData = {
    id: 'phrase-1',
    targetPhrase: 'Ẹ káàárọ̀',
    translation: '"Good morning" (Yoruba)',
    language: 'Yoruba',
    toneFocus: "rising tone on 'ká'",
};

// --- Navbar Component ---
function Navbar() {
    return (
        // Updated: Changed border color to your solid outline token to make it visible
        <header className="flex items-center justify-between px-6 py-4 bg-surface border-b border-outline">
            {/* Logo Area */}
            <Link href="/" className="flex items-center gap-3">
                {/* Placeholder for your actual logo image */}
                <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-on-primary font-bold text-xs">
                    A
                </div>
                <span className="font-heading font-bold text-xl text-primary tracking-tight">
                    Afrolingo
                </span>
            </Link>

            {/* Center Navigation */}
            <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-on-surface-variant">
                <Link href="/learn" className="hover:text-primary transition-colors">
                    Lessons
                </Link>
                {/* Active Link State */}
                <Link href="/practice" className="text-primary font-bold border-b-2 border-primary pb-1">
                    Practice
                </Link>
                <Link href="/community" className="hover:text-primary transition-colors">
                    Community
                </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <button
                    className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                    aria-label="Settings"
                >
                    <FaCog className="text-lg" />
                </button>
                {/* Avatar Placeholder */}
                <button
                    className="w-10 h-10 rounded-full bg-[#d6c5b3] border-2 border-surface flex items-center justify-center overflow-hidden"
                    aria-label="Profile"
                >
                    <div className="w-full h-2/3 bg-surface-container-lowest mt-4 rounded-t-full opacity-50"></div>
                </button>
            </div>
        </header>
    );
}

export default function PracticePage() {
    // --- State Hooks for Interactivity ---
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isPlayingNative, setIsPlayingNative] = useState<boolean>(false);
    const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'complete'>('idle');

    // --- Handlers ---
    const handleToggleRecord = useCallback(() => {
        setIsRecording((prev) => !prev);
        if (!isRecording) {
            setAnalysisStatus('analyzing');
            // Mocking an analysis completion after 3 seconds
            setTimeout(() => setAnalysisStatus('complete'), 3000);
        } else {
            setAnalysisStatus('idle');
        }
    }, [isRecording]);

    const handlePlayNative = useCallback(() => {
        setIsPlayingNative(true);
        // Logic to play audio goes here
        setTimeout(() => setIsPlayingNative(false), 2000);
    }, []);

    return (
        <>
            <Head>
                <title>Practice | AI Voice Lab - Afrolingo</title>
            </Head>

            {/* Inject Navbar Here */}
            <Navbar />

            {/* Main Container */}
            <main className="min-h-screen bg-surface pt-8 pb-20 px-6 font-sans">
                <div className="max-w-6xl mx-auto">

                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-on-surface-variant font-medium mb-4">
                        <Link href="/learn" className="hover:text-primary transition-colors">Lessons</Link>
                        <span>›</span>
                        <span>{CURRENT_PHRASE.language} Basics</span>
                        <span>›</span>
                        <span className="text-primary font-bold">Pronunciation</span>
                    </nav>

                    {/* Page Title */}
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-10">
                        AI Voice Lab
                    </h1>

                    {/* Top Section: Split Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[2rem] overflow-hidden float-shadow mb-8">

                        {/* Left Panel: Target Phrase */}
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
                                    className="btn-primary flex items-center gap-3 px-6 py-4 rounded-xl text-lg"
                                >
                                    <FaVolumeUp className="text-xl" />
                                    Listen to Native
                                </button>
                                <button
                                    className="w-14 h-14 flex items-center justify-center rounded-xl border-2 border-outline-variant text-primary hover:border-primary transition-colors"
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

                        {/* Right Panel: Recording Interface */}
                        <div className="bg-surface-container-low p-10 md:p-14 flex flex-col items-center justify-center relative min-h-[500px]">

                            {/* Mock Waveform */}
                            <div className="flex items-center justify-center gap-1.5 h-32 mb-16">
                                {[40, 60, 30, 80, 100, 60, 40, 90, 70, 50, 80, 40, 60].map((height, i) => (
                                    <div
                                        key={i}
                                        className={`w-2 rounded-full transition-all duration-300 ${isRecording ? 'bg-primary animate-pulse' : 'bg-primary/30'}`}
                                        style={{ height: `${height}%` }}
                                    />
                                ))}
                            </div>

                            {/* Record Button */}
                            <button
                                onClick={handleToggleRecord}
                                className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl text-on-primary shadow-xl transition-all duration-300 hover:scale-105 ${isRecording ? 'bg-error animate-pulse' : 'bg-primary'
                                    }`}
                            >
                                {isRecording ? <FaStop /> : <FaMicrophone />}
                            </button>

                            {/* Status Text */}
                            <div className="mt-8 text-center h-16 w-full max-w-sm">
                                {analysisStatus === 'analyzing' && (
                                    <>
                                        <h3 className="text-xl font-bold text-primary mb-1">Analyzing pronunciation...</h3>
                                        <p className="text-sm text-on-surface-variant">Comparing with 14,000+ native samples</p>
                                        <div className="w-full h-1.5 bg-surface-container-high rounded-full mt-4 mx-auto overflow-hidden">
                                            <div className="h-full bg-primary w-1/2 animate-pulse rounded-full" />
                                        </div>
                                    </>
                                )}
                                {analysisStatus === 'complete' && (
                                    <h3 className="text-xl font-bold text-success">Analysis Complete!</h3>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section: Features Grid */}
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

                </div>
            </main>
        </>
    );
}

// --- Subcomponents ---
function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="bg-surface-container-lowest p-8 rounded-2xl float-shadow transition-transform hover:-translate-y-1">
            <div className="text-2xl text-primary mb-4">
                {icon}
            </div>
            <h3 className="font-heading font-bold text-lg text-primary mb-2">{title}</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
                {description}
            </p>
        </div>
    );
}