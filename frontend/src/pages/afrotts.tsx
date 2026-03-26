import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Geist } from "next/font/google";
import {
    Home,
    BookOpen,
    BarChart2,
    Target,
    ShoppingCart,
    Volume2,
    Award,
    Play,
    Pause,
    Download,
    Wand2,
    Languages,
    UserCircle,
    Settings2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

export default function AfroTTSPage() {
    const [text, setText] = useState("");
    const [language, setLanguage] = useState("Yoruba");
    const [isGenerating, setIsGenerating] = useState(false);
    const [audioReady, setAudioReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Mock waveform data for the UI
    const waveHeights = [20, 40, 70, 40, 90, 60, 30, 80, 100, 50, 30, 60, 40, 80, 50];

    const handleGenerate = () => {
        if (!text) return;
        setIsGenerating(true);
        setAudioReady(false);

        // Mock API Call delay
        setTimeout(() => {
            setIsGenerating(false);
            setAudioReady(true);
        }, 2000);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <>
            <Head>
                <title>AfroTTS | AfroLingo</title>
            </Head>
            <div className={`${geistSans.className} min-h-screen flex bg-background text-foreground`}>

                {/* LEFT SIDEBAR (Reused from your layout) */}
                <aside className="w-60 fixed left-0 top-0 bottom-0 flex flex-col border-r border-border bg-background z-20">
                    <div className="p-8 group cursor-pointer">
                        <Link href="/" className="flex items-center gap-3 font-black text-2xl group-hover:scale-105 transition-transform origin-left">
                            <div className="w-8 h-8 relative group-hover:rotate-12 transition-transform duration-300">
                                <Image src="/logo.png" alt="AfroLingo Logo" fill sizes="32px" className="object-contain" />
                            </div>
                            <span className="tracking-tight">
                                <span className="text-on-surface">Afro</span>
                                <span className="text-[#8B4513]">Lingo</span>
                            </span>
                        </Link>
                    </div>

                    <nav className="flex-1 px-4 space-y-2">
                        <Link href="/" className="group flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-surface-container rounded-xl font-semibold transition-all active:scale-95">
                            <Home size={20} className="group-hover:-translate-y-1 transition-transform" /> Home
                        </Link>
                        <Link href="/learn" className="group flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-surface-container rounded-xl font-semibold transition-all active:scale-95">
                            <BookOpen size={20} className="group-hover:-translate-y-1 transition-transform" /> Learn
                        </Link>
                        <Link href="/leaderboard" className="group flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-surface-container rounded-xl font-semibold transition-all active:scale-95">
                            <BarChart2 size={20} className="group-hover:-translate-y-1 transition-transform" /> Leaderboard
                        </Link>
                        <Link href="/quests" className="group flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-surface-container rounded-xl font-semibold transition-all active:scale-95">
                            <Target size={20} className="group-hover:-translate-y-1 transition-transform" /> Quests
                        </Link>
                        <Link href="/shop" className="group flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-surface-container rounded-xl font-semibold transition-all active:scale-95">
                            <ShoppingCart size={20} className="group-hover:-translate-y-1 transition-transform" /> Shop
                        </Link>

                        {/* ACTIVE STATE FOR AFROTTS */}
                        <div className="group flex items-center gap-4 px-4 py-3 bg-primary text-on-primary rounded-xl font-semibold shadow-md cursor-default transition-all">
                            <Volume2 size={20} className="group-hover:scale-110 transition-transform" /> AfroTTS
                        </div>

                        <div className="pt-4">
                            <Button className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-black h-auto py-4 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all hover:-translate-y-1 shadow-md">
                                <Award size={20} className="group-hover:rotate-12 transition-transform" /> Go Premium
                            </Button>
                        </div>
                    </nav>
                </aside>

                {/* MAIN CONTENT AREA */}
                <main className="flex-1 ml-60 min-h-screen py-12 px-10 relative bg-surface/30">
                    <header className="mb-10">
                        <h1 className="text-4xl font-extrabold text-primary mb-2 flex items-center gap-3">
                            <Volume2 size={36} className="text-[#8B4513]" />
                            AfroTTS Studio
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Transform text into lifelike Yoruba, Hausa, and Igbo speech.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl">

                        {/* LEFT COLUMN: Input Controls (Spans 3 cols) */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Controls Bar */}
                            <div className="flex flex-wrap gap-4 p-2 bg-surface-container-lowest border border-border rounded-2xl shadow-sm">
                                <div className="flex-1 flex items-center gap-3 px-4 py-2 border-r border-border">
                                    <Languages size={18} className="text-muted-foreground" />
                                    <select
                                        className="bg-transparent border-none outline-none font-bold text-foreground w-full cursor-pointer"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                    >
                                        <option value="Yoruba">Yoruba</option>
                                        <option value="Hausa">Hausa</option>
                                        <option value="Igbo">Igbo</option>
                                    </select>
                                </div>
                                <div className="flex-1 flex items-center gap-3 px-4 py-2">
                                    <UserCircle size={18} className="text-muted-foreground" />
                                    <select className="bg-transparent border-none outline-none font-bold text-foreground w-full cursor-pointer">
                                        <option>Adebayo (Male)</option>
                                        <option>Folake (Female)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Text Input Area */}
                            <div className="relative">
                                <textarea
                                    className="w-full h-[300px] p-6 bg-surface-container-lowest border border-border rounded-3xl shadow-sm resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-lg transition-all"
                                    placeholder={`Type something in ${language} to generate speech... \n\nExample: Bawo ni? (How are you?)`}
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                />
                                <div className="absolute bottom-6 right-6 text-sm font-medium text-muted-foreground">
                                    {text.length} / 500
                                </div>
                            </div>

                            <Button
                                onClick={handleGenerate}
                                disabled={!text || isGenerating}
                                className={`w-full h-16 rounded-2xl font-bold text-lg shadow-lg transition-all ${isGenerating
                                        ? "bg-primary/70 cursor-wait"
                                        : "bg-primary hover:scale-[1.02] hover:shadow-primary/30 active:scale-95"
                                    }`}
                            >
                                {isGenerating ? (
                                    <span className="flex items-center gap-2 animate-pulse">
                                        <Wand2 className="animate-spin" size={24} /> Synthesizing Voice...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Wand2 size={24} /> Generate Speech
                                    </span>
                                )}
                            </Button>
                        </div>

                        {/* RIGHT COLUMN: Playback & Results (Spans 2 cols) */}
                        <div className="lg:col-span-2">
                            <div className="bg-surface-container-lowest border border-border rounded-3xl shadow-sm p-8 h-full flex flex-col items-center justify-center relative overflow-hidden">

                                {!audioReady && !isGenerating ? (
                                    <div className="text-center opacity-50 flex flex-col items-center gap-4">
                                        <Volume2 size={48} className="text-muted-foreground" />
                                        <p className="font-medium text-muted-foreground">Your generated audio will appear here</p>
                                    </div>
                                ) : (
                                    <div className="w-full flex flex-col items-center animate-in fade-in duration-500">

                                        {/* Animated Waveform */}
                                        <div className="flex items-center justify-center gap-1.5 h-24 mb-10 w-full px-4">
                                            {waveHeights.map((height, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-2 rounded-full transition-all ${isPlaying ? "bg-primary animate-bounce duration-75" : "bg-primary/30"
                                                        }`}
                                                    style={{
                                                        height: `${isPlaying ? height : height / 3}%`,
                                                        animationDelay: `${i * 0.05}s`
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        {/* Audio Controls */}
                                        <div className="flex items-center gap-6 mb-8">
                                            <Button variant="outline" className="w-12 h-12 rounded-full border-2 border-border text-foreground hover:bg-surface-container">
                                                <span className="font-bold text-sm">1x</span>
                                            </Button>

                                            <Button
                                                onClick={togglePlay}
                                                className="w-20 h-20 rounded-full bg-primary text-on-primary shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                                            >
                                                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-2" />}
                                            </Button>

                                            <Button variant="outline" className="w-12 h-12 rounded-full border-2 border-border text-foreground hover:bg-surface-container group">
                                                <Download size={20} className="group-hover:translate-y-1 transition-transform" />
                                            </Button>
                                        </div>

                                        <div className="text-center w-full bg-surface-container px-4 py-3 rounded-xl border border-border">
                                            <p className="text-sm font-bold text-foreground">afrotts_yoruba_001.mp3</p>
                                            <p className="text-xs text-muted-foreground mt-1">Ready to download</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </>
    );
}