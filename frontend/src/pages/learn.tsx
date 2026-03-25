import {
    Home,
    BookOpen,
    BarChart2,
    Target,
    ShoppingCart,
    Award,
    Check,
    Play,
    Utensils,
    Lock,
    Flame,
    Zap,
    Trophy
} from "lucide-react";
import Link from "next/link";
import { Geist } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

export default function LearnPath() {
    return (
        <div className={`${geistSans.className} min-h-screen flex bg-background text-foreground`}>

            <aside className="w-[240px] fixed left-0 top-0 bottom-0 flex flex-col border-r border-border bg-background z-20">
                <div className="p-8">
                    <div className="flex items-center gap-2 font-black text-2xl text-primary">
                        <img src="/logo.png" alt="Afrolingo Logo" className="w-6 h-6" /> Afrolingo
                    </div>
                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mt-1">Yoruba Path</p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <Link href="/" className="flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-surface-container rounded-xl font-semibold transition-colors">
                        <Home size={20} /> Home
                    </Link>
                    <div className="flex items-center gap-4 px-4 py-3 bg-primary text-on-primary rounded-xl font-semibold shadow-md">
                        <BookOpen size={20} /> Learn
                    </div>
                    <Link href="/leaderboard" className="flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-surface-container rounded-xl font-semibold transition-colors">
                        <BarChart2 size={20} /> Leaderboard
                    </Link>
                    <Link href="/quests" className="flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-surface-container rounded-xl font-semibold transition-colors">
                        <Target size={20} /> Quests
                    </Link>
                    <Link href="/shop" className="flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-surface-container rounded-xl font-semibold transition-colors">
                        <ShoppingCart size={20} /> Shop
                    </Link>
                    
                    <div className="pt-4">
                        <button className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-4 rounded-xl font-bold hover:brightness-110 transition-all shadow-lg">
                            <Award size={20} /> Go Premium
                        </button>
                    </div>
                </nav>
            </aside>

            <main className="flex-1 ml-[240px] mr-[320px] min-h-screen py-16 relative">
                <div className="max-w-2xl mx-auto flex flex-col items-center">

                    <header className="text-center mb-16">
                        <h1 className="text-4xl font-extrabold text-primary mb-2">Yoruba Path</h1>
                        <p className="text-muted-foreground text-lg">Master the language of the Orishas</p>
                    </header>

                    <div className="relative flex flex-col items-center w-full">

                        <div className="absolute top-0 bottom-[44px] left-1/2 -translate-x-1/2 w-1 border-l-[3px] border-dashed border-primary/20 z-0" />

                        <div className="relative z-10 flex flex-col items-center gap-4 mb-12">
                            <div className="w-16 h-16 rounded-full bg-[#003107] text-white flex items-center justify-center shadow-md border-4 border-background">
                                <Check size={28} strokeWidth={3} />
                            </div>
                            <div className="bg-surface-container-lowest border border-border px-8 py-4 rounded-2xl shadow-sm text-center min-w-[280px]">
                                <h3 className="font-bold text-lg text-foreground">Unit 1: Greetings</h3>
                                <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase mt-1">Completed</p>
                            </div>
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-4 mb-12">
                            <div className="w-20 h-20 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xl border-4 border-background hover:scale-105 transition-transform cursor-pointer">
                                <Play size={32} fill="currentColor" />
                            </div>
                            <div className="bg-primary text-on-primary px-8 py-5 rounded-2xl shadow-lg text-center min-w-[280px]">
                                <h3 className="font-bold text-lg">Unit 2: Family & Kinship</h3>
                                <p className="text-xs font-bold text-on-primary/70 tracking-widest uppercase mt-1">In Progress</p>
                            </div>
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-4 mb-12">
                            <div className="w-16 h-16 rounded-full bg-surface-container text-primary flex items-center justify-center shadow-sm border-4 border-background">
                                <Utensils size={24} />
                            </div>
                            <div className="bg-surface-container-lowest border border-border px-8 py-4 rounded-2xl shadow-sm text-center min-w-[280px]">
                                <h3 className="font-bold text-lg text-foreground">Unit 3: Food & Market</h3>
                                <p className="text-xs font-bold text-primary tracking-widest uppercase mt-1">Start Now</p>
                            </div>
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-4 mb-12 opacity-40">
                            <div className="w-16 h-16 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center shadow-sm border-4 border-background">
                                <Lock size={24} />
                            </div>
                            <div className="bg-surface-variant border border-border px-8 py-4 rounded-2xl shadow-sm text-center min-w-[280px] flex flex-col justify-center min-h-[88px]">
                                <h3 className="font-bold text-lg text-foreground">Unit 4: Travel</h3>
                                <p className="text-xs font-bold tracking-widest uppercase mt-1 text-on-surface-variant">Unlock at Level 10</p>
                            </div>
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-4 opacity-40">
                            <div className="w-16 h-16 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center shadow-sm border-4 border-background">
                                <Lock size={24} />
                            </div>
                            <div className="bg-surface-variant border border-border px-8 py-4 rounded-2xl shadow-sm text-center min-w-[280px] flex flex-col justify-center min-h-[88px]">
                                <h3 className="font-bold text-lg text-foreground">Unit 5: Work & Business</h3>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <aside className="w-[320px] fixed right-0 top-0 bottom-0 border-l border-border bg-[#FAFAFA] z-20 p-8 overflow-y-auto">

                <div className="flex items-center justify-between gap-4 mb-10">
                    <div className="flex-1 bg-white border border-border rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
                        <div className="flex items-center gap-2 text-xl font-black text-foreground">
                            <Flame className="text-orange-500" fill="currentColor" size={24} /> 12
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground tracking-wider mt-1">DAYS STREAK</p>
                    </div>
                    <div className="flex-1 bg-white border border-border rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
                        <div className="flex items-center gap-2 text-xl font-black text-foreground">
                            <Zap className="text-yellow-500" fill="currentColor" size={24} /> 2,450
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground tracking-wider mt-1">TOTAL XP</p>
                    </div>
                </div>

                <div className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-xs tracking-widest text-muted-foreground uppercase">Leaderboard</h3>
                        <Link href="/leaderboard" className="text-xs font-bold text-primary hover:underline uppercase">View All</Link>
                    </div>

                    <div className="space-y-2">
                        {[
                            { rank: 1, name: "Kofi Mensah", xp: "3,120", initials: "KM" },
                            { rank: 2, name: "Amara Okafor", xp: "2,890", initials: "AO" },
                        ].map((user) => (
                            <div key={user.rank} className="flex items-center gap-4 p-3 bg-white rounded-xl border border-border shadow-sm">
                                <span className="font-bold text-muted-foreground w-4">{user.rank}</span>
                                <div className="w-8 h-8 rounded-full bg-[#FFD29D] flex items-center justify-center text-xs font-bold">{user.initials}</div>
                                <span className="font-bold flex-1 text-sm">{user.name}</span>
                                <span className="font-bold text-sm text-muted-foreground">{user.xp}</span>
                            </div>
                        ))}

                        <div className="flex items-center gap-4 p-3 leaderboard-current-user shadow-md mt-2">
                            <span className="font-bold w-4">4</span>
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">SY</div>
                            <span className="font-bold flex-1 text-sm">You (Sarah)</span>
                            <span className="font-bold text-sm">2,450</span>
                        </div>

                        <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-border shadow-sm mt-2">
                            <span className="font-bold text-muted-foreground w-4">5</span>
                            <div className="w-8 h-8 rounded-full bg-[#E8E1D5] flex items-center justify-center text-xs font-bold">TD</div>
                            <span className="font-bold flex-1 text-sm">Tariq Diallo</span>
                            <span className="font-bold text-sm text-muted-foreground">2,100</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#eaf2eb] border border-[#d0e5d2] p-6 rounded-2xl relative overflow-hidden">
                    <div className="flex items-start gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-[#003107] text-white flex items-center justify-center shrink-0">
                            <Trophy size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-foreground">Daily Quest</h4>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Complete 3 lessons to earn bonus gems.</p>
                        </div>
                    </div>

                    <div className="mt-6 relative z-10">
                        <div className="flex justify-between text-[10px] font-bold text-muted-foreground tracking-wider mb-2 uppercase">
                            <span>2 / 3 Lessons Done</span>
                            <span>66%</span>
                        </div>
                        <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                            <div className="h-full bg-[#003107] w-[66%] rounded-full"></div>
                        </div>
                    </div>
                </div>

            </aside>

        </div>
    );
}