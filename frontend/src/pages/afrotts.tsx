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
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LeftSidebar from "@/components/layout/LeftSidebar";

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
  const waveHeights = [
    20, 40, 70, 40, 90, 60, 30, 80, 100, 50, 30, 60, 40, 80, 50,
  ];

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
      <div
        className={`${geistSans.className} min-h-screen flex bg-background text-foreground`}
      >
        {/* LEFT SIDEBAR */}
        <LeftSidebar title="AfroTTS" />

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
                <div className="flex-1 flex items-center gap-3 px-4 py-2">
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
              </div>

              {/* Text Input Area */}
              <div className="relative">
                <textarea
                  className="w-full h-75 p-6 bg-surface-container-lowest border border-border rounded-3xl shadow-sm resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-lg transition-all"
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
                    <Wand2 className="animate-spin" size={24} /> Synthesizing
                    Voice...
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
                    <p className="font-medium text-muted-foreground">
                      Your generated audio will appear here
                    </p>
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
                    {/* Animated Waveform */}
                    <div className="flex items-center justify-center gap-1.5 h-24 mb-10 w-full px-4">
                      {waveHeights.map((height, i) => (
                        <div
                          key={i}
                          className={`w-2 rounded-full transition-all ${isPlaying
                              ? "bg-primary animate-bounce duration-75"
                              : "bg-primary/30"
                            }`}
                          style={{
                            height: `${isPlaying ? height : height / 3}%`,
                            animationDelay: `${i * 0.05}s`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Audio Controls */}
                    <div className="flex items-center gap-6 mb-8">
                      <Button
                        variant="outline"
                        className="w-12 h-12 rounded-full border-2 border-border text-foreground hover:bg-surface-container"
                      >
                        <span className="font-bold text-sm">1x</span>
                      </Button>

                      <Button
                        onClick={togglePlay}
                        className="w-20 h-20 rounded-full bg-primary text-on-primary shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                      >
                        {isPlaying ? (
                          <Pause size={32} fill="currentColor" />
                        ) : (
                          <Play
                            size={32}
                            fill="currentColor"
                            className="ml-2"
                          />
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        className="w-12 h-12 rounded-full border-2 border-border text-foreground hover:bg-surface-container group"
                      >
                        <Download
                          size={20}
                          className="group-hover:translate-y-1 transition-transform"
                        />
                      </Button>
                    </div>

                    <div className="text-center w-full bg-surface-container px-4 py-3 rounded-xl border border-border">
                      <p className="text-sm font-bold text-foreground">
                        afrotts_{language.toLowerCase()}_001.mp3
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ready to download
                      </p>
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