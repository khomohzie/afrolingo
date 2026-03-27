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
  Check,
  Play,
  Utensils,
  Lock,
  Flame,
  Zap,
  Trophy,
  Volume2,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Geist } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import api from "@/lib/axios";
import { ILeaderboardData } from "@/interfaces/learn.interfaces";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const languageMeta: Record<
  string,
  { title: string; description: string; color?: string }
> = {
  yoruba: {
    title: "Yoruba Path",
    description: "Master the language of the Orishas",
    color: "#964B00",
  },
  igbo: {
    title: "Igbo Path",
    description: "Discover the wisdom of the Igbo people",
    color: "#228B22",
  },
  hausa: {
    title: "Hausa Path",
    description: "Explore the culture of the Sahel",
    color: "#DAA520",
  },
};

export default function LearnPath() {
  const { user, authenticated, ready, logout } = useAuth();
  const router = useRouter();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<ILeaderboardData[]>(
    []
  );

  const getLeaderboardData = async () => {
    setLoadingLeaderboard(true);

    try {
      const res = await api.get("/progress/leaderboard");

      setLeaderboardData(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  useEffect(() => {
    if (!ready) return;

    if (!authenticated) {
      router.replace("/login");
      return;
    }

    if (user && !user.selectedLanguage) {
      router.replace("/onboarding/choose-language");
      return;
    }
  }, [ready, authenticated, user, router]);

  useEffect(() => {
    getLeaderboardData();
  }, []);

  if (!ready || !authenticated || !user?.selectedLanguage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const languageCode = user.selectedLanguage.toLowerCase();
  const meta = languageMeta[languageCode] || {
    title: "Language Path",
    description: "Continue your learning journey",
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const confirmLogout = () => {
    logout();
    setLogoutDialogOpen(false);
    router.push("/");
  };

  const getRankStyles = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-400/20 border-yellow-400/40";
      case 2:
        return "bg-gray-300/20 border-gray-400/40";
      case 3:
        return "bg-amber-600/20 border-amber-600/40";
      default:
        return "";
    }
  };

  const getAvatarStyles = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-400/30 text-yellow-900";
      case 2:
        return "bg-gray-300/30 text-gray-800";
      case 3:
        return "bg-amber-600/30 text-amber-900";
      default:
        return "bg-warning/30 text-foreground";
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  return (
    <>
      <Head>
        <title>{meta.title} | AfroLingo</title>
      </Head>
      <div
        className={`${geistSans.className} min-h-screen flex bg-background text-foreground`}
      >
        {/* LEFT SIDEBAR */}
        <aside className="w-60 fixed left-0 top-0 bottom-0 flex flex-col border-r border-border bg-background z-20">
          <div className="p-8 group cursor-pointer">
            <div className="flex items-center gap-3 font-black text-2xl group-hover:scale-105 transition-transform origin-left">
              <div className="w-8 h-8 relative group-hover:rotate-12 transition-transform duration-300">
                <Image
                  src="/logo.png"
                  alt="AfroLingo Logo"
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </div>
              <span className="tracking-tight">
                <span className="text-on-surface">Afro</span>
                <span className="text-[#8B4513]">Lingo</span>
              </span>
            </div>
            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mt-1 group-hover:text-primary transition-colors">
              {meta.title}
            </p>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <Link
              href="/"
              className="group flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-surface-container rounded-xl font-semibold transition-all active:scale-95"
            >
              <Home
                size={20}
                className="group-hover:-translate-y-1 transition-transform"
              />{" "}
              Home
            </Link>
            <div className="group flex items-center gap-4 px-4 py-3 bg-primary text-on-primary rounded-xl font-semibold shadow-md cursor-pointer transition-all active:scale-95">
              <BookOpen
                size={20}
                className="group-hover:scale-110 transition-transform"
              />{" "}
              Learn
            </div>
            <Link
              href="/leaderboard"
              className="group flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-surface-container rounded-xl font-semibold transition-all active:scale-95"
            >
              <BarChart2
                size={20}
                className="group-hover:-translate-y-1 transition-transform"
              />{" "}
              Leaderboard
            </Link>
            <Link
              href="/quests"
              className="group flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-surface-container rounded-xl font-semibold transition-all active:scale-95"
            >
              <Target
                size={20}
                className="group-hover:-translate-y-1 transition-transform"
              />{" "}
              Quests
            </Link>
            <Link
              href="/shop"
              className="group flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-surface-container rounded-xl font-semibold transition-all active:scale-95"
            >
              <ShoppingCart
                size={20}
                className="group-hover:-translate-y-1 transition-transform"
              />{" "}
              Shop
            </Link>
            <Link
              href="/afrotts"
              className="group flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-surface-container rounded-xl font-semibold transition-all active:scale-95"
            >
              <Volume2
                size={20}
                className="group-hover:-translate-y-1 transition-transform"
              />{" "}
              AfroTTS
            </Link>

            <div className="pt-4">
              <Button className="group w-full flex items-center justify-center gap-2 bg-linear-to-r from-[#d4af37] to-[#f3e5ab] text-black h-auto py-4 rounded-xl font-bold border-none transition-all hover:opacity-90 active:scale-95">
                <Award
                  size={20}
                  className="group-hover:rotate-12 transition-transform"
                />{" "}
                Go Premium
              </Button>
            </div>
            <div className="pt-2">
              <button
                onClick={handleLogoutClick}
                className="group cursor-pointer w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-150 hover:!bg-red-500"
              >
                <LogOut className="h-4 w-4 text-red-500 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
                <span className="text-red-500 group-hover:text-white">
                  Logout
                </span>
              </button>
            </div>
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 ml-60 mr-80 min-h-screen py-16 relative">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <header className="text-center mb-16 cursor-default group">
              <h1 className="text-4xl font-extrabold text-primary mb-2 group-hover:scale-105 transition-transform duration-500">
                {meta.title}
              </h1>
              <p className="text-muted-foreground text-lg group-hover:text-foreground transition-colors">
                {meta.description}
              </p>
            </header>

            <div className="relative flex flex-col items-center w-full">
              <div className="absolute top-0 bottom-11 left-1/2 -translate-x-1/2 w-1 border-l-[3px] border-dashed border-primary/20 z-0" />

              {/* UNIT 1: COMPLETED */}
              <div className="relative z-10 flex flex-col items-center gap-4 mb-12 group cursor-pointer active:scale-95 transition-all">
                <div className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center shadow-md border-4 border-background group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                  <Check
                    size={28}
                    strokeWidth={3}
                    className="group-hover:scale-125 transition-transform"
                  />
                </div>
                <div className="bg-surface-container-lowest border border-border px-8 py-4 rounded-2xl shadow-sm text-center min-w-70 group-hover:border-success/50 transition-colors">
                  <h3 className="font-bold text-lg text-foreground">
                    Unit 1: Greetings
                  </h3>
                  <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase mt-1 group-hover:text-green-600 transition-colors">
                    Completed
                  </p>
                </div>
              </div>

              {/* UNIT 2: ACTIVE */}
              <Link href="/quiz/unit-2">
                <div className="relative z-10 flex flex-col items-center gap-4 mb-12 group cursor-pointer active:scale-95 transition-all">
                  <div className="absolute top-0 w-20 h-20 bg-primary/20 rounded-full blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
                  <div className="w-20 h-20 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xl border-4 border-background group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300">
                    <Play
                      size={32}
                      fill="currentColor"
                      className="ml-1 group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="bg-primary text-on-primary px-8 py-5 rounded-2xl shadow-lg text-center min-w-70 group-hover:-translate-y-1 transition-transform">
                    <h3 className="font-bold text-lg">
                      Unit 2: Family & Kinship
                    </h3>
                    <p className="text-xs font-bold text-on-primary/70 tracking-widest uppercase mt-1">
                      In Progress
                    </p>
                  </div>
                </div>
              </Link>

              {/* UNIT 3: NEXT UP */}
              <div className="relative z-10 flex flex-col items-center gap-4 mb-12 group cursor-pointer active:scale-95 transition-all">
                <div className="w-16 h-16 rounded-full bg-surface-container text-primary flex items-center justify-center shadow-sm border-4 border-background group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Utensils
                    size={24}
                    className="group-hover:rotate-12 transition-transform"
                  />
                </div>
                <div className="bg-surface-container-lowest border border-border px-8 py-4 rounded-2xl shadow-sm text-center min-w-70 group-hover:border-primary/50 group-hover:shadow-md transition-all">
                  <h3 className="font-bold text-lg text-foreground">
                    Unit 3: Food & Market
                  </h3>
                  <p className="text-xs font-bold text-primary tracking-widest uppercase mt-1">
                    Start Now
                  </p>
                </div>
              </div>

              {/* UNIT 4: LOCKED */}
              <div className="relative z-10 flex flex-col items-center gap-4 mb-12 opacity-40 group cursor-not-allowed">
                <div className="w-16 h-16 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center shadow-sm border-4 border-background group-hover:bg-error/10 group-hover:text-error group-active:animate-bounce transition-colors">
                  <Lock
                    size={24}
                    className="group-active:rotate-12 transition-transform"
                  />
                </div>
                <div className="bg-surface-variant border border-border px-8 py-4 rounded-2xl shadow-sm text-center min-w-70 flex flex-col justify-center min-h-22 group-hover:border-error/30 transition-colors">
                  <h3 className="font-bold text-lg text-foreground">
                    Unit 4: Travel
                  </h3>
                  <p className="text-xs font-bold tracking-widest uppercase mt-1 text-on-surface-variant group-hover:text-error transition-colors">
                    Unlock at Level 10
                  </p>
                </div>
              </div>

              {/* UNIT 5: LOCKED */}
              <div className="relative z-10 flex flex-col items-center gap-4 opacity-40 group cursor-not-allowed">
                <div className="w-16 h-16 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center shadow-sm border-4 border-background group-hover:bg-error/10 group-hover:text-error group-active:animate-bounce transition-colors">
                  <Lock size={24} />
                </div>
                <div className="bg-surface-variant border border-border px-8 py-4 rounded-2xl shadow-sm text-center min-w-70 flex flex-col justify-center min-h-22 group-hover:border-error/30 transition-colors">
                  <h3 className="font-bold text-lg text-foreground">
                    Unit 5: Work & Business
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="w-[390px] fixed right-0 top-0 bottom-0 border-l border-border bg-surface-container-lowest z-20 p-8 overflow-y-auto">
          <div className="flex items-center justify-between gap-4 mb-10">
            <div className="group flex-1 bg-surface-container-lowest border border-border hover:border-warning/50 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer transition-all active:scale-95">
              <div className="flex items-center gap-2 text-xl font-black text-foreground group-hover:scale-110 transition-transform">
                <Flame
                  className="text-red-500 group-hover:animate-pulse"
                  fill="currentColor"
                  size={24}
                />{" "}
                {user.streak}
              </div>
              <p className="text-[10px] font-bold text-muted-foreground tracking-wider mt-1">
                DAYS STREAK
              </p>
            </div>
            <div className="group flex-1 bg-surface-container-lowest border border-border hover:border-warning/50 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer transition-all active:scale-95">
              <div className="flex items-center gap-2 text-xl font-black text-foreground group-hover:scale-110 transition-transform">
                <Zap
                  className="text-orange-500 group-hover:rotate-12 transition-transform"
                  fill="currentColor"
                  size={24}
                />{" "}
                {user.xp}
              </div>
              <p className="text-[10px] font-bold text-muted-foreground tracking-wider mt-1">
                TOTAL XP
              </p>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xs tracking-widest text-muted-foreground uppercase">
                Leaderboard
              </h3>
              <Link
                href="/leaderboard"
                className="text-xs font-bold text-primary hover:text-primary/70 hover:underline uppercase transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="space-y-2">
              {/* Loading */}
              {loadingLeaderboard && (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 rounded-xl border border-border animate-pulse"
                    >
                      <div className="w-4 h-4 bg-muted rounded" />
                      <div className="w-8 h-8 bg-muted rounded-full" />
                      <div className="flex-1 h-4 bg-muted rounded" />
                      <div className="w-10 h-4 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              )}

              {/* Empty */}
              {!loadingLeaderboard && leaderboardData.length === 0 && (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  No leaderboard data available yet.
                </div>
              )}

              {/* Leaderboard */}
              {!loadingLeaderboard &&
                leaderboardData.map((item) => {
                  const isCurrentUser = item.id === user._id;
                  const isTop3 = item.rank <= 3;

                  const initials = item.name.slice(0, 2).toUpperCase();

                  return (
                    <div
                      key={item.id}
                      className={`group flex items-center gap-4 p-3 rounded-xl border shadow-sm cursor-pointer transition-all active:scale-95
          
          ${
            isCurrentUser
              ? "leaderboard-current-user shadow-md mt-2 hover:brightness-105 hover:-translate-y-0.5"
              : isTop3
              ? getRankStyles(item.rank)
              : "bg-surface-container-lowest border-border hover:border-warning/50 hover:shadow-md"
          }
        `}
                    >
                      {/* Rank / Medal */}
                      <span
                        className={`font-bold w-6 transition-colors ${
                          isCurrentUser
                            ? ""
                            : isTop3
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-primary"
                        }`}
                      >
                        {getRankIcon(item.rank) || item.rank}
                      </span>

                      {/* Avatar */}
                      <Avatar
                        className={`w-8 h-8 transition-transform ${
                          isCurrentUser
                            ? "group-hover:rotate-6"
                            : "group-hover:scale-110"
                        }`}
                      >
                        <AvatarFallback
                          className={`text-xs font-bold ${
                            isCurrentUser
                              ? "bg-on-primary/20 text-on-primary"
                              : isTop3
                              ? getAvatarStyles(item.rank)
                              : "bg-warning/30 text-foreground"
                          }`}
                        >
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      {/* Name */}
                      <span
                        className={`font-bold flex-1 text-sm ${
                          isCurrentUser
                            ? ""
                            : "group-hover:text-primary transition-colors"
                        }`}
                      >
                        {isCurrentUser ? `You (${item.name})` : item.name}
                      </span>

                      {/* XP */}
                      <span
                        className={`font-bold text-sm ${
                          isCurrentUser
                            ? "text-on-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.xp.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="group bg-accent/5 border border-accent/20 p-6 rounded-2xl relative overflow-hidden cursor-pointer hover:shadow-md hover:border-accent/30 transition-all active:scale-[0.98]">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors"></div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-accent text-accent-foreground flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                <Trophy size={24} className="group-hover:animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-foreground group-hover:text-accent transition-colors">
                  Daily Quest
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Complete 3 lessons to earn bonus gems.
                </p>
              </div>
            </div>
            <div className="mt-6 relative z-10">
              <div className="flex justify-between text-[10px] font-bold text-muted-foreground tracking-wider mb-2 uppercase group-hover:text-accent transition-colors">
                <span>2 / 3 Lessons Done</span>
                <span>66%</span>
              </div>
              <Progress
                value={66}
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
            <AlertDialogTitle className="text-xl font-semibold">
              Confirm Logout
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Are you sure you want to log out? You'll need to sign in again to
              access your progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className=" px-6 py-6 cursor-pointer">
              No, go back
            </AlertDialogCancel>
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
