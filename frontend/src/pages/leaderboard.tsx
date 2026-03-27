import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
    Home,
    BookOpen,
    BarChart2,
    Target,
    ShoppingCart,
    Award,
    Play,
    Utensils,
    Lock,
    Flame,
    Zap,
    Trophy,
    Volume2,
    LogOut,
    Medal,
    ChevronUp,
    ChevronDown,
    Minus
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Geist } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

// Mock data for the leaderboard
const leaderboardData = [
    { rank: 1, name: "Kofi Mensah", xp: 15420, initials: "KM", trend: "up", avatar: "/avatars/kofi.png" },
    { rank: 2, name: "Amara Okafor", xp: 14890, initials: "AO", trend: "same", avatar: "/avatars/amara.png" },
    { rank: 3, name: "Zainab Bello", xp: 13200, initials: "ZB", trend: "up", avatar: "/avatars/zainab.png" },
    { rank: 4, name: "Tariq Diallo", xp: 12100, initials: "TD", trend: "down" },
    { rank: 5, name: "You", xp: 11450, initials: "ME", trend: "up", isCurrentUser: true },
    { rank: 6, name: "Nia Adebayo", xp: 10900, initials: "NA", trend: "same" },
    { rank: 7, name: "Kwame Osei", xp: 9850, initials: "KO", trend: "down" },
    { rank: 8, name: "Fatima Sani", xp: 9200, initials: "FS", trend: "up" },
    { rank: 9, name: "Chidi Eze", xp: 8750, initials: "CE", trend: "down" },
    { rank: 10, name: "Aisha Keita", xp: 8100, initials: "AK", trend: "same" },
];

export default function Leaderboard() {
    const { user, authenticated, ready, logout } = useAuth();
    const router = useRouter();
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("weekly");

    useEffect(() => {
        if (!ready) return;
        if (!authenticated) {
            router.replace("/login");
            return;
        }
    }, [ready, authenticated, router]);

    if (!ready || !authenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const handleLogoutClick = () => setLogoutDialogOpen(true);
    const confirmLogout = () => {
        logout();
        setLogoutDialogOpen(false);
        router.push("/");
    };

    const topThree = leaderboardData.slice(0, 3);
    const remainingUsers = leaderboardData.slice(3);

    return (
        <>
            <Head>
                <title>Leaderboard | AfroLingo</title>
            </Head>
            <div className={`${geistSans.className} min-h-screen flex bg-background text-foreground`}>

                {/* LEFT SIDEBAR */}
                <aside className="w-60 fixed left-0 top-0 bottom-0 flex flex-col border-r border-border bg-background z-20">
                    <div className="p-8 group cursor-pointer">
                        <div className="flex items-center gap-3 font-black text-2xl group-hover:scale-105 transition-transform origin-left">
                            <div className="w-8 h-8 relative group-hover:rotate-12 transition-transform duration-300">
                                <Image src="/logo.png" alt="AfroLingo Logo" fill sizes="32px" className="object-contain" />
                            </div>
                            <span className="tracking-tight">
                                <span className="text-on-surface">Afro</span>
                                <span className="text-[#8B4513]">Lingo</span>
                            </span>
                        </div>
                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mt-1 group-hover:text-primary transition-colors">
                            Leaderboard
                        </p>
                    </div>

                    <nav className="flex-1 px-4 space-y-2">
                        <Link href="/" className="group flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-surface-container rounded-xl font-semibold transition-all active:scale-95">
                            <Home size={20} className="group-hover:-translate-y-1 transition-transform" /> Home
                        </Link>
                        <Link href="/learn" className="group flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-surface-container rounded-xl font-semibold transition-all active:scale-95">
                            <BookOpen size={20} className="group-hover:-translate-y-1 transition-transform" /> Learn
                        </Link>
                        {/* ACTIVE STATE: Leaderboard */}
                        <div className="group flex items-center gap-4 px-4 py-3 bg-primary text-on-primary rounded-xl font-semibold shadow-md cursor-pointer transition-all active:scale-95">
                            <BarChart2 size={20} className="group-hover:scale-110 transition-transform" /> Leaderboard
                        </div>
                        <Link href="/quests" className="group flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-surface-container rounded-xl font-semibold transition-all active:scale-95">
                            <Target size={20} className="group-hover:-translate-y-1 transition-transform" /> Quests
                        </Link>
                        <Link href="/shop" className="group flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-surface-container rounded-xl font-semibold transition-all active:scale-95">
                            <ShoppingCart size={20} className="group-hover:-translate-y-1 transition-transform" /> Shop
                        </Link>
                        <Link href="/afrotts" className="group flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-surface-container rounded-xl font-semibold transition-all active:scale-95">
                            <Volume2 size={20} className="group-hover:-translate-y-1 transition-transform" /> AfroTTS
                        </Link>

                        <div className="pt-4">
                            <Button className="group w-full flex items-center justify-center gap-2 bg-linear-to-r from-[#d4af37] to-[#f3e5ab] text-black h-auto py-4 rounded-xl font-bold border-none transition-all hover:opacity-90 active:scale-95">
                                <Award size={20} className="group-hover:rotate-12 transition-transform" /> Go Premium
                            </Button>
                        </div>
                        <div className="pt-2">
                            <button onClick={handleLogoutClick} className="group cursor-pointer w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-150 hover:bg-red-500!">
                                <LogOut className="h-4 w-4 text-red-500 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
                                <span className="text-red-500 group-hover:text-white">Logout</span>
                            </button>
                        </div>
                    </nav>
                </aside>

                {/* MAIN CONTENT AREA */}
                <main className="flex-1 ml-60 mr-97.5 min-h-screen py-16 relative overflow-y-auto">
                    <div className="max-w-3xl mx-auto px-8 flex flex-col items-center">
                        <header className="text-center mb-12 cursor-default group w-full">
                            <h1 className="text-4xl font-extrabold text-primary mb-6 group-hover:scale-105 transition-transform duration-500">
                                Global Rankings
                            </h1>

                            {/* Custom Tabs */}
                            <div className="flex items-center justify-center gap-2 bg-surface-container-low p-1.5 rounded-2xl w-max mx-auto border border-border">
                                <button
                                    onClick={() => setActiveTab("weekly")}
                                    className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === "weekly" ? "bg-background text-primary shadow-sm scale-100" : "text-muted-foreground hover:text-foreground scale-95"}`}
                                >
                                    Weekly Rank
                                </button>
                                <button
                                    onClick={() => setActiveTab("all-time")}
                                    className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === "all-time" ? "bg-background text-primary shadow-sm scale-100" : "text-muted-foreground hover:text-foreground scale-95"}`}
                                >
                                    All Time
                                </button>
                            </div>
                        </header>

                        {/* PODIUM (Top 3) */}
                        <div className="flex items-end justify-center gap-4 mb-16 w-full h-64 mt-8">
                            {/* Rank 2 (Silver) */}
                            <div className="flex flex-col items-center group cursor-pointer w-32 relative">
                                <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm text-muted-foreground bg-surface-container-high px-3 py-1 rounded-full shadow-md">
                                    {topThree[1].xp.toLocaleString()} XP
                                </div>
                                <Avatar className="w-20 h-20 border-4 border-[#C0C0C0] shadow-lg mb-4 group-hover:scale-110 transition-transform z-10 bg-background">
                                    <AvatarFallback className="bg-surface-container-low text-[#C0C0C0] text-xl font-bold">
                                        {topThree[1].initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="w-full h-32 bg-linear-to-t from-background to-[#C0C0C0]/20 rounded-t-2xl border-t-4 border-[#C0C0C0] flex flex-col items-center justify-start pt-4 group-hover:brightness-110 transition-all">
                                    <span className="text-3xl font-black text-[#C0C0C0]">2</span>
                                    <span className="font-bold text-sm text-foreground mt-2 truncate max-w-[90%]">{topThree[1].name.split(" ")[0]}</span>
                                </div>
                            </div>

                            {/* Rank 1 (Gold) */}
                            <div className="flex flex-col items-center group cursor-pointer w-36 relative">
                                <div className="absolute -top-20 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full shadow-md whitespace-nowrap z-20">
                                    {topThree[0].xp.toLocaleString()} XP
                                </div>
                                <div className="absolute -top-10 z-20 text-[#d4af37] group-hover:-translate-y-2 group-hover:scale-125 transition-transform duration-300">
                                    <Trophy fill="currentColor" size={32} />
                                </div>
                                <Avatar className="w-28 h-28 border-4 border-[#d4af37] shadow-xl mb-4 group-hover:scale-105 transition-transform z-10 bg-background">
                                    <AvatarFallback className="bg-yellow-50 text-[#d4af37] text-2xl font-black">
                                        {topThree[0].initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="w-full h-40 bg-linear-to-t from-background to-[#d4af37]/20 rounded-t-2xl border-t-4 border-[#d4af37] flex flex-col items-center justify-start pt-4 group-hover:brightness-110 transition-all shadow-[0_-10px_30px_-15px_rgba(212,175,55,0.5)]">
                                    <span className="text-4xl font-black text-[#d4af37]">1</span>
                                    <span className="font-bold text-base text-foreground mt-2 truncate max-w-[90%]">{topThree[0].name.split(" ")[0]}</span>
                                </div>
                            </div>

                            {/* Rank 3 (Bronze) */}
                            <div className="flex flex-col items-center group cursor-pointer w-32 relative">
                                <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm text-muted-foreground bg-surface-container-high px-3 py-1 rounded-full shadow-md">
                                    {topThree[2].xp.toLocaleString()} XP
                                </div>
                                <Avatar className="w-20 h-20 border-4 border-[#CD7F32] shadow-lg mb-4 group-hover:scale-110 transition-transform z-10 bg-background">
                                    <AvatarFallback className="bg-surface-container-low text-[#CD7F32] text-xl font-bold">
                                        {topThree[2].initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="w-full h-24 bg-linear-to-t from-background to-[#CD7F32]/20 rounded-t-2xl border-t-4 border-[#CD7F32] flex flex-col items-center justify-start pt-4 group-hover:brightness-110 transition-all">
                                    <span className="text-3xl font-black text-[#CD7F32]">3</span>
                                    <span className="font-bold text-sm text-foreground mt-2 truncate max-w-[90%]">{topThree[2].name.split(" ")[0]}</span>
                                </div>
                            </div>
                        </div>

                        {/* LIST VIEW */}
                        <div className="w-full flex flex-col gap-3">
                            {remainingUsers.map((user) => (
                                <div
                                    key={user.rank}
                                    className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 active:scale-[0.98] cursor-pointer
                                        ${user.isCurrentUser
                                            ? "bg-primary-container border-primary text-on-primary shadow-md hover:shadow-lg hover:-translate-y-1"
                                            : "bg-surface-container-lowest border-border hover:border-primary/30 hover:shadow-sm"
                                        }
                                    `}
                                >
                                    <span className={`font-black w-8 text-center text-lg ${user.isCurrentUser ? "text-on-primary" : "text-muted-foreground group-hover:text-primary transition-colors"}`}>
                                        {user.rank}
                                    </span>

                                    <Avatar className="w-12 h-12 border-2 border-background group-hover:scale-110 transition-transform">
                                        <AvatarFallback className={`${user.isCurrentUser ? "bg-background text-primary" : "bg-surface-variant text-foreground"} font-bold`}>
                                            {user.initials}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 flex flex-col justify-center">
                                        <span className={`font-bold text-base ${user.isCurrentUser ? "" : "group-hover:text-primary transition-colors"}`}>
                                            {user.name}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <span className={`font-extrabold tracking-wide ${user.isCurrentUser ? "text-on-primary" : "text-foreground"}`}>
                                            {user.xp.toLocaleString()} <span className="text-xs font-bold opacity-70">XP</span>
                                        </span>

                                        {/* Trend Icon */}
                                        <div className="w-6 flex justify-center">
                                            {user.trend === "up" && <ChevronUp className="text-green-500" strokeWidth={3} size={20} />}
                                            {user.trend === "down" && <ChevronDown className="text-red-500" strokeWidth={3} size={20} />}
                                            {user.trend === "same" && <Minus className="text-muted-foreground" strokeWidth={3} size={20} />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                {/* RIGHT SIDEBAR */}
                <aside className="w-97.5 fixed right-0 top-0 bottom-0 border-l border-border bg-surface-container-lowest z-20 p-8 overflow-y-auto">
                    <div className="flex items-center justify-between gap-4 mb-10">
                        <div className="group flex-1 bg-surface-container-lowest border border-border hover:border-warning/50 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer transition-all active:scale-95">
                            <div className="flex items-center gap-2 text-xl font-black text-foreground group-hover:scale-110 transition-transform">
                                <Flame className="text-red-500 group-hover:animate-pulse" fill="currentColor" size={24} /> 12
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground tracking-wider mt-1">DAYS STREAK</p>
                        </div>
                        <div className="group flex-1 bg-surface-container-lowest border border-border hover:border-warning/50 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer transition-all active:scale-95">
                            <div className="flex items-center gap-2 text-xl font-black text-foreground group-hover:scale-110 transition-transform">
                                <Zap className="text-orange-500 group-hover:rotate-12 transition-transform" fill="currentColor" size={24} /> 11,450
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground tracking-wider mt-1">TOTAL XP</p>
                        </div>
                    </div>

                    <div className="group bg-accent/5 border border-accent/20 p-6 rounded-2xl relative overflow-hidden cursor-pointer hover:shadow-md hover:border-accent/30 transition-all active:scale-[0.98]">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors"></div>
                        <div className="flex items-start gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-accent text-accent-foreground flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                                <Target size={24} className="group-hover:animate-pulse" />
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground group-hover:text-accent transition-colors">Climb the Ranks!</h4>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Earn 650 more XP today to pass Tariq Diallo and enter the top 4.</p>
                            </div>
                        </div>
                        <div className="mt-6 relative z-10">
                            <div className="flex justify-between text-[10px] font-bold text-muted-foreground tracking-wider mb-2 uppercase group-hover:text-accent transition-colors">
                                <span>11,450 XP</span>
                                <span>12,100 XP</span>
                            </div>
                            <Progress
                                value={(11450 / 12100) * 100}
                                className="h-2 bg-surface-container-lowest border border-accent/10 [&>div]:bg-accent group-hover:[&>div]:brightness-110 [&>div]:relative [&>div]:overflow-hidden [&>div]:after:content-[''] [&>div]:after:absolute [&>div]:after:inset-0 [&>div]:after:-translate-x-full [&>div]:after:bg-linear-to-r [&>div]:after:from-transparent [&>div]:after:white/30 [&>div]:after:to-transparent group-hover:[&>div]:after:animate-[shimmer_1.5s_infinite]"
                            />
                        </div>
                    </div>
                </aside>
            </div>

            {/* Logout confirmation dialog */}
            <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
                <AlertDialogContent className="p-6">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-semibold">Confirm Logout</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">
                            Are you sure you want to log out? You'll need to sign in again to access your progress.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="px-6 py-6 cursor-pointer">No, go back</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmLogout}
                            className="cursor-pointer px-6 py-6 bg-red-500 hover:bg-red-600 focus:ring-red-500"
                        >
                            Yes, logout
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}