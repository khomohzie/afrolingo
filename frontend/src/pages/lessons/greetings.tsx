import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Geist } from "next/font/google";
import { ArrowLeft, CheckCircle2, Lock, Mic, Loader2, Volume2, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getPhrases, type Phrase } from "@/lib/lessons";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";

const geist = Geist({ subsets: ["latin"] });
const phraseCache = new Map<string, Phrase[]>();

export default function GreetingsLesson() {
    const router = useRouter();
    const { user, authenticated, ready } = useAuth();

    const [phrases, setPhrases] = useState<Phrase[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
    const [showContent, setShowContent] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const activeLanguageRef = useRef<string | undefined>(undefined);
    const animatedRef = useRef(false);

    const activeLanguage = user?.selectedLanguage?.toLowerCase();

    // Auth guard
    useEffect(() => {
        if (!ready) return;
        if (!authenticated) router.replace("/login");
    }, [ready, authenticated, router]);

    // Fetch phrases and user progress
    useEffect(() => {
        if (!activeLanguage) {
            setIsLoading(false);
            setPhrases([]);
            setCompletedIds(new Set());
            return;
        }

        activeLanguageRef.current = activeLanguage;

        let isMounted = true;
        const abortController = new AbortController();

        const load = async () => {
            setIsLoading(true);
            try {
                const result = await getPhrases(activeLanguage, abortController.signal);
                if (!isMounted) return;
                if (activeLanguageRef.current !== activeLanguage) return;

                const modules = result?.data?.modules || [];
                const greetingsModule = modules.find((m) => m.category === "greetings");

                let sorted: Phrase[] = [];
                let completed: Set<string> = new Set();

                if (greetingsModule?.phrases?.length) {
                    sorted = [...greetingsModule.phrases].sort((a, b) => {
                        const orderA = a.orderIndex ?? a.order ?? 0;
                        const orderB = b.orderIndex ?? b.order ?? 0;
                        return orderA - orderB;
                    });
                    sorted.forEach((p) => {
                        if (p.userProgress?.completed) completed.add(p._id);
                    });
                    if (!phraseCache.has(activeLanguage)) phraseCache.set(activeLanguage, sorted);
                }

                if (isMounted) {
                    setPhrases(sorted);
                    setCompletedIds(completed);
                }
            } catch (error: any) {
                if (error.name !== "AbortError" && isMounted) {
                    console.error("Error loading phrases:", error);
                    toast.error("Could not load lesson phrases. Please try again.");
                    setPhrases([]);
                    setCompletedIds(new Set());
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        load();

        return () => {
            isMounted = false;
            abortController.abort();
        };
    }, [activeLanguage]);

    // Simple CSS fade‑in animation after data is loaded
    useEffect(() => {
        if (!isLoading && phrases.length > 0 && !animatedRef.current) {
            animatedRef.current = true;
            const timer = setTimeout(() => setShowContent(true), 50);
            return () => clearTimeout(timer);
        }
    }, [isLoading, phrases.length]);

    // Determine if a phrase is unlocked (all previous are completed)
    const isUnlocked = (index: number) => {
        if (index === 0) return true;
        const prevPhrase = phrases[index - 1];
        return completedIds.has(prevPhrase._id);
    };

    const handlePhraseClick = (phrase: Phrase, index: number) => {
        if (!isUnlocked(index)) {
            toast.error("Complete the previous phrase first.");
            return;
        }

        void router.push({
            pathname: "/practice",
            query: {
                phraseId: phrase._id,
                phrase: phrase.text,
                translation: phrase.translation,
                language: activeLanguage,
                audioUrl: phrase.audioUrl || "",
                romanization: phrase.romanization || "",
                toneNotes: phrase.toneNotes || "",
            },
        });
    };

    const completedCount = phrases.filter((p) => completedIds.has(p._id)).length;
    const progress = phrases.length > 0 ? Math.round((completedCount / phrases.length) * 100) : 0;
    const activeIndex = phrases.findIndex((_, idx) => !completedIds.has(phrases[idx]._id) && isUnlocked(idx));
    const activePhrase = activeIndex !== -1 ? phrases[activeIndex] : null;

    const getLanguageName = () => {
        if (!activeLanguage) return "Language";
        return activeLanguage.charAt(0).toUpperCase() + activeLanguage.slice(1);
    };
    const getWatermarkLetter = () => activeLanguage?.charAt(0).toUpperCase() || "A";

    if (!ready || !authenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-surface text-on-surface">
                <Navbar />
                <div className="pt-28 max-w-7xl mx-auto px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-3 space-y-8 animate-pulse">
                            <div className="h-10 w-40 bg-surface-container rounded" />
                            <div className="bg-surface-container-low p-6 rounded-2xl h-64" />
                            <div className="bg-primary p-6 rounded-2xl h-40" />
                        </div>
                        <div className="lg:col-span-6 space-y-6 animate-pulse">
                            <div className="bg-[#4e3b2a] rounded-3xl h-64" />
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-surface-container-lowest rounded-2xl h-28" />
                                ))}
                            </div>
                        </div>
                        <div className="lg:col-span-3 space-y-6 animate-pulse">
                            <div className="bg-surface-container-lowest rounded-3xl h-80" />
                            <div className="bg-surface-container-low rounded-2xl h-32" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Greetings | {getLanguageName()} | AfroLingo</title>
            </Head>

            <div ref={containerRef} className={`bg-surface text-on-surface ${geist.className}`}>
                <Navbar />

                <main className="pt-28 pb-20 px-8 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* LEFT SIDEBAR */}
                        <aside className="lg:col-span-3 space-y-8">
                            <div className="flex items-center gap-3 mb-6 cursor-pointer"
                                onClick={() => router.back()}>
                                <button

                                    className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-high transition-colors active:scale-95"
                                >
                                    <ArrowLeft className="h-5 w-5 text-primary" />
                                </button>
                                <h1 className="font-bold text-xl text-primary">Learning Path</h1>
                            </div>

                            {/* Progress Card */}
                            <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
                                <div className="flex justify-between items-end mb-3">
                                    <span className="text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">
                                        Your Progress
                                    </span>
                                    <span className="text-secondary font-black text-xl">{progress}%</span>
                                </div>
                                <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden mb-6">
                                    <div className="h-full bg-secondary rounded-full" style={{ width: `${progress}%` }} />
                                </div>
                                <div className="space-y-4 pt-4 border-t border-outline-variant/20">
                                    <div className="flex items-center gap-3 text-sm font-medium text-green-500">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span>Alphabet Basics</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-bold text-secondary">
                                        <Mic className="h-4 w-4 text-secondary" />
                                        <span>Greetings</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-medium text-on-surface-variant opacity-50">
                                        <Lock className="h-4 w-4" />
                                        <span>Family Titles</span>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Card */}
                            <div className="bg-primary p-6 rounded-2xl text-white">
                                <h4 className="font-bold mb-2">Master Pronunciation</h4>
                                <p className="text-xs text-white/70 mb-4 leading-relaxed">
                                    Join a live session with native {getLanguageName()} speakers this weekend.
                                </p>
                                <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors border border-white/20">
                                    View Schedule
                                </button>
                            </div>
                        </aside>

                        {/* MAIN CONTENT */}
                        <div className="lg:col-span-6 space-y-6">
                            {/* Lesson Context Card */}
                            <div
                                className={`relative overflow-hidden bg-[#4e3b2a] rounded-3xl p-8 text-white shadow-lg border border-primary/10 transition-all duration-700 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                    }`}
                            >
                                <div className="relative z-10 max-w-lg">
                                    <p className="text-[#c0a58f] text-xs uppercase tracking-widest font-bold mb-2">
                                        Unit 2 · Greeting Phrases
                                    </p>
                                    <h2 className="font-black text-4xl mb-4">Essential {getLanguageName()}</h2>
                                    <p className="text-white/90 text-lg leading-relaxed">
                                        Master the foundations of daily social interaction. Learn how to greet according to time and context.
                                    </p>
                                </div>
                                <div className="absolute -right-8 -bottom-12 opacity-10 pointer-events-none">
                                    <span className="font-black text-[200px] select-none text-white">{getWatermarkLetter()}</span>
                                </div>
                            </div>

                            {/* Phrase List */}
                            {phrases.length === 0 ? (
                                <div className="text-center py-20 text-on-surface-variant">
                                    <p className="font-medium">No phrases found for this lesson.</p>
                                    <Link
                                        href="/learn"
                                        className="text-primary font-bold text-sm mt-2 inline-block hover:underline"
                                    >
                                        Back to Learn
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Active Phrase (large card) */}
                                    {activePhrase && (
                                        <div
                                            className={`transition-all duration-700 delay-100 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                                } w-full text-left group`}
                                        >
                                            <div className="bg-[#4e3b2a] rounded-[1.5rem] p-8 border-2 border-[#652f19]/30 transition-all shadow-[0px_15px_30px_rgba(78,59,42,0.12)]">
                                                <div className="flex justify-between items-start mb-6">
                                                    <button
                                                        onClick={() => {
                                                            if (activePhrase.audioUrl) {
                                                                const audio = new Audio(activePhrase.audioUrl);
                                                                audio.play().catch(console.error);
                                                            } else {
                                                                toast.info("Audio not available yet.");
                                                            }
                                                        }}
                                                        className="bg-secondary p-3 rounded-xl hover:scale-105 transition-transform"
                                                    >
                                                        <Volume2 className="h-6 w-6 text-white" />
                                                    </button>
                                                    <span className="bg-white/10 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-white/20">
                                                        Learning Now
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-4xl text-white mb-2">{activePhrase.text}</h3>
                                                <p className="text-[#c0a58f] text-xl font-medium">{activePhrase.translation}</p>
                                                {activePhrase.romanization && (
                                                    <p className="text-[#c0a58f]/80 text-sm mt-2">{activePhrase.romanization}</p>
                                                )}
                                                <div className="mt-6 pt-6 border-t border-white/10">
                                                    <p className="text-[#c0a58f]/70 text-sm italic">
                                                        {activePhrase.toneNotes || "Practice pronunciation to sound natural."}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Other Phrases */}
                                    <div className="grid grid-cols-1 gap-4">
                                        {phrases.map((phrase, idx) => {
                                            const completed = completedIds.has(phrase._id);
                                            const locked = !completed && idx > activeIndex;
                                            if (phrase === activePhrase) return null;
                                            return (
                                                <button
                                                    key={phrase._id}
                                                    onClick={() => handlePhraseClick(phrase, idx)}
                                                    disabled={locked}
                                                    className={`transition-all duration-700 delay-${Math.min(idx * 75, 400)} ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                                        } w-full flex justify-between items-center bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 ${completed ? "hover:bg-green-50/30" : locked ? "cursor-not-allowed" : "hover:bg-surface-container-low"
                                                        } ${locked ? "opacity-50" : ""}`}
                                                >
                                                    <div>
                                                        <h3 className="font-bold text-xl text-primary mb-1">{phrase.text}</h3>
                                                        <p className="text-on-surface-variant text-sm">{phrase.translation}</p>
                                                        {phrase.romanization && (
                                                            <p className="text-xs text-on-surface-variant/60 mt-1">{phrase.romanization}</p>
                                                        )}
                                                    </div>
                                                    {completed ? (
                                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                    ) : locked ? (
                                                        <Lock className="h-5 w-5 text-outline-variant" />
                                                    ) : null}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT SIDEBAR */}
                        <aside className="lg:col-span-3 space-y-6">
                            <div className="sticky top-28 space-y-6">
                                {/* Lesson Action Card */}
                                <div
                                    className={`bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/20 shadow-xl shadow-primary/5 transition-all duration-700 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center">
                                            <Sparkles className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-primary">Unit 2</h4>
                                            <p className="text-xs text-on-surface-variant font-medium">Topic: Greetings</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-on-surface-variant">Steps</span>
                                            <span className="font-bold text-primary">
                                                {completedCount} / {phrases.length}
                                            </span>
                                        </div>
                                        <div className="flex gap-1.5">
                                            {phrases.map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`h-1.5 flex-1 rounded-full ${idx < completedCount
                                                        ? "bg-secondary"
                                                        : idx === activeIndex
                                                            ? "bg-secondary animate-pulse"
                                                            : "bg-surface-container-highest"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <Link
                                        href={{
                                            pathname: "/practice",
                                            query: {
                                                phraseId: activePhrase?._id,
                                                phrase: activePhrase?.text,
                                                translation: activePhrase?.translation,
                                                language: activeLanguage,
                                                audioUrl: activePhrase?.audioUrl || "",
                                                romanization: activePhrase?.romanization || "",
                                                toneNotes: activePhrase?.toneNotes || "",
                                            },
                                        }}
                                        className="w-full bg-primary text-white font-extrabold py-5 rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3 group"
                                    >
                                        <span>Start Practice</span>
                                        <Mic className="h-5 w-5 group-hover:animate-pulse" />
                                    </Link>
                                </div>

                                {/* Cultural Note Card */}
                                <div
                                    className={`bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 transition-all duration-700 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                        }`}
                                >
                                    <h5 className="font-bold text-primary text-sm mb-3 flex items-center gap-2">
                                        <Star className="h-4 w-4 text-secondary" />
                                        Cultural Insight
                                    </h5>
                                    <p className="text-xs text-on-surface-variant leading-relaxed">
                                        In many African cultures, greetings are elaborate and reflect deep respect. The time of day, age, and social status often determine the appropriate greeting.
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* Unit Complete Section */}
                    {!isLoading && completedCount === phrases.length && phrases.length > 0 && (
                        <div className={`mt-10 transition-all duration-700 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                            <div className="relative overflow-hidden bg-[#4e3b2a] rounded-3xl p-10 text-white shadow-lg border border-primary/10">
                                {/* Watermark */}
                                <div className="absolute -right-8 -bottom-12 opacity-10 pointer-events-none">
                                    <span className="font-black text-[200px] select-none text-white">{getWatermarkLetter()}</span>
                                </div>

                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div>
                                        <p className="text-[#c0a58f] text-xs uppercase tracking-widest font-bold mb-2">
                                            Unit Complete
                                        </p>
                                        <h3 className="font-black text-4xl mb-3">All Phrases Mastered</h3>
                                        <p className="text-white/70 text-sm leading-relaxed max-w-sm">
                                            You've completed all greetings in this unit. Ready to test your knowledge?
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-3 min-w-[200px] w-full md:w-auto">
                                        <Link href="/learn">
                                            <button className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer border border-white/20">
                                                Back to Learn Path
                                            </button>
                                        </Link>
                                        <Link href={`/quiz/${activeLanguage}`}>
                                            <Button className="w-full py-8 px-6 bg-green-500 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-all hover:-translate-y-0.5 active:scale-[0.98]">
                                                Take Quiz →
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}