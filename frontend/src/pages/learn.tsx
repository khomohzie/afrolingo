import LeftSidebar from "@/components/layout/LeftSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { ILeaderboardData } from "@/interfaces/learn.interfaces";
import api from "@/lib/axios";
import { getPhrases, getUserStats, type PhraseModule, type UserStats } from "@/lib/lessons";
import { Check, Flame, Lock, Play, Trophy, Zap, Target } from "lucide-react";
import { Geist } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const languageMeta: Record<string, { title: string; description: string }> = {
  yoruba: { title: "Yoruba Path",  description: "Master the language of the Orishas" },
  igbo:   { title: "Igbo Path",    description: "Discover the wisdom of the Igbo people" },
  hausa:  { title: "Hausa Path",   description: "Explore the culture of the Sahel" },
};

const KNOWN_CATEGORIES: Record<string, string> = {
  greetings: "Greetings",
  everyday:  "Everyday Phrases",
  food:      "Food & Market",
};

const DAILY_QUEST_TARGET = 3;

const formatCategoryName = (category: string): string =>
  KNOWN_CATEGORIES[category] ?? category.charAt(0).toUpperCase() + category.slice(1);

export default function LearnPath() {
  const { user, authenticated, ready } = useAuth();
  const router = useRouter();

  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData]       = useState<ILeaderboardData[]>([]);
  const [modules, setModules]                       = useState<PhraseModule[]>([]);
  const [loadingModules, setLoadingModules]         = useState(true);
  const [userStats, setUserStats]                   = useState<UserStats | null>(null);

  // Auth guard
  useEffect(() => {
    if (!ready) return;
    if (!authenticated) { router.replace("/login"); return; }
    if (user && !user.selectedLanguage) { router.replace("/onboarding/choose-language"); return; }
  }, [ready, authenticated, user, router]);

  // Fetch modules
  useEffect(() => {
    if (!user?.selectedLanguage) return;

    const fetchModules = async () => {
      setLoadingModules(true);
      try {
        const result = await getPhrases(user.selectedLanguage as string);
        const allModules: PhraseModule[] = result?.data?.modules || [];
        // Keep only known categories (or all, but we filter to avoid unknown)
        setModules(allModules.filter((m) => m.category in KNOWN_CATEGORIES));
      } catch (error) {
        console.error("Failed to fetch modules:", error);
      } finally {
        setLoadingModules(false);
      }
    };

    fetchModules();
  }, [user?.selectedLanguage]);

  // Fetch user stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getUserStats();
        setUserStats(data.data ?? null);
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Fetch leaderboard
  useEffect(() => {
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
    getLeaderboardData();
  }, []);

  if (!ready || !authenticated || !user?.selectedLanguage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const languageCode = user.selectedLanguage.toLowerCase();
  const meta = languageMeta[languageCode] || {
    title: "Language Path",
    description: "Continue your learning journey",
  };

  // ----- SEQUENTIAL UNLOCKING -----
  // For each module, compute:
  // - isCompleted (all phrases done)
  // - isLocked (if not first unit and previous unit not completed)
  const modulesWithStatus = modules.map((module, idx) => {
    const isCompleted = module.completedPhrases === module.totalPhrases;
    // Previous unit must be completed to unlock this one (except first)
    const previousCompleted = idx === 0 ? true : modules.slice(0, idx).every(prev => prev.completedPhrases === prev.totalPhrases);
    // Also respect backend's isUnlocked (e.g., premium flags) – but we combine with our sequential rule
    const isLocked = !previousCompleted || !module.isUnlocked;
    return { ...module, isCompleted, isLocked };
  });

  // Find the first unit that is not completed and not locked – that's the active unit
  const activeIndex = modulesWithStatus.findIndex(
    (m) => !m.isCompleted && !m.isLocked
  );

  // Helper to get status for display
  const getUnitStatus = (module: typeof modulesWithStatus[0], index: number) => {
    if (module.isLocked) return "locked";
    if (module.isCompleted) return "completed";
    if (index === activeIndex) return "active";
    return "inactive";
  };

  const getUnitIcon = (status: string) => {
    switch (status) {
      case "completed": return <Check size={28} strokeWidth={3} />;
      case "active":    return <Play size={32} fill="currentColor" className="ml-1" />;
      default:          return <Lock size={24} />;
    }
  };

  const getCircleColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-600";
      case "active":    return "bg-primary";
      default:          return "bg-surface-variant";
    }
  };

  const getTextColor = (status: string) => {
    if (status === "active")    return "text-secondary font-extrabold tracking-widest";
    if (status === "completed") return "text-green-600";
    return "text-on-surface-variant";
  };

  const getProgressText = (module: typeof modulesWithStatus[0], status: string) => {
    if (status === "completed") return "Completed";
    if (status === "active")    return "In Progress";
    if (status === "locked")    return "Locked";
    if (module.completedPhrases === 0) return "Not Started";
    return `${module.completedPhrases}/${module.totalPhrases} phrases`;
  };

  // Daily Quest progress (using totalCompleted from stats as a proxy)
  const totalCompleted      = userStats?.totalCompleted ?? 0;
  const questDone           = Math.min(totalCompleted % DAILY_QUEST_TARGET || (totalCompleted > 0 && totalCompleted % DAILY_QUEST_TARGET === 0 ? DAILY_QUEST_TARGET : 0), DAILY_QUEST_TARGET);
  const questProgress       = Math.round((questDone / DAILY_QUEST_TARGET) * 100);
  const questComplete       = questDone >= DAILY_QUEST_TARGET;

  if (loadingModules) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{meta.title} | AfroLingo</title>
      </Head>

      <div className={`${geistSans.className} min-h-screen flex bg-background text-foreground`}>
        <LeftSidebar title={meta.title} isPremium={user?.isPremium} />

        {/* MAIN CONTENT */}
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

              {modulesWithStatus.map((module, index) => {
                const status = getUnitStatus(module, index);
                const isActive = status === "active";
                const isCompleted = status === "completed";
                const isLocked = status === "locked";
                const categoryName = formatCategoryName(module.category);

                return (
                  <div key={module.category} className="relative z-10 flex flex-col items-center gap-4 mb-12 group transition-all">
                    {isActive && (
                      <div className="absolute top-0 w-20 h-20 bg-primary/20 rounded-full blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
                    )}

                    <Link
                      href={isLocked ? "#" : `/lessons/${module.category}`}
                      className={isLocked ? "cursor-not-allowed" : "cursor-pointer"}
                      onClick={(e) => isLocked && e.preventDefault()}
                    >
                      <div className={`
                        ${isActive ? "w-20 h-20" : "w-16 h-16"}
                        rounded-full ${getCircleColor(status)} text-white
                        flex items-center justify-center shadow-md border-4 border-background
                        transition-all duration-300
                        ${isActive
                          ? "group-hover:scale-110 group-hover:shadow-lg group-hover:-translate-y-2"
                          : "group-hover:scale-110 group-hover:shadow-lg"
                        }
                      `}>
                        {getUnitIcon(status)}
                      </div>
                    </Link>

                    <div className={`
                      bg-surface-container-lowest border border-border px-8 py-4 rounded-2xl shadow-sm text-center min-w-[280px]
                      transition-all
                      ${isActive ? "bg-primary text-on-primary shadow-lg" : "group-hover:border-primary/50 group-hover:shadow-md"}
                      ${isCompleted ? "group-hover:border-green-500/50" : ""}
                      ${isLocked ? "opacity-40" : ""}
                    `}>
                      <h3 className="font-bold text-lg text-foreground">
                        Unit {index + 1}: {categoryName}
                      </h3>
                      <p className={`text-xs font-bold tracking-widest uppercase mt-1 ${getTextColor(status)}`}>
                        {getProgressText(module, status)}
                      </p>
                      {!isLocked && !isCompleted && module.completedPhrases > 0 && (
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {module.completedPhrases}/{module.totalPhrases} phrases
                        </p>
                      )}
                      {isLocked && (
                        <p className="text-xs font-bold text-on-surface-variant group-hover:text-error transition-colors">
                          {index === 0 ? "Complete this unit to unlock next" : "Complete previous unit to unlock"}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR (unchanged except daily quest) */}
        <aside className="w-[390px] fixed right-0 top-0 bottom-0 border-l border-border bg-surface-container-lowest z-20 p-8 overflow-y-auto">
          {/* Streak & XP cards – same as before */}
          <div className="flex items-center justify-between gap-4 mb-10">
            <div className="group flex-1 bg-surface-container-lowest border border-border hover:border-warning/50 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer transition-all active:scale-95">
              <div className="flex items-center gap-2 text-xl font-black text-foreground group-hover:scale-110 transition-transform">
                <Flame className="text-red-500 group-hover:animate-pulse" fill="currentColor" size={24} />
                {user.streak}
              </div>
              <p className="text-[10px] font-bold text-muted-foreground tracking-wider mt-1">DAYS STREAK</p>
            </div>
            <div className="group flex-1 bg-surface-container-lowest border border-border hover:border-warning/50 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer transition-all active:scale-95">
              <div className="flex items-center gap-2 text-xl font-black text-foreground group-hover:scale-110 transition-transform">
                <Zap className="text-orange-500 group-hover:rotate-12 transition-transform" fill="currentColor" size={24} />
                {user.xp}
              </div>
              <p className="text-[10px] font-bold text-muted-foreground tracking-wider mt-1">TOTAL XP</p>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xs tracking-widest text-muted-foreground uppercase">Leaderboard</h3>
              <Link href="/leaderboard" className="cursor-pointer text-xs font-bold text-primary hover:text-primary/70 hover:underline uppercase transition-colors">
                View All
              </Link>
            </div>
            <div className="space-y-2">
              {loadingLeaderboard && (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-border animate-pulse">
                      <div className="w-4 h-4 bg-muted rounded" />
                      <div className="w-8 h-8 bg-muted rounded-full" />
                      <div className="flex-1 h-4 bg-muted rounded" />
                      <div className="w-10 h-4 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              )}
              {!loadingLeaderboard && leaderboardData.length === 0 && (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  No leaderboard data available yet.
                </div>
              )}
              {!loadingLeaderboard && leaderboardData.slice(0, 3).map((item) => {
                const isCurrentUser = item.id === user._id;
                const isTop3        = item.rank <= 3;
                const initials      = item.name.slice(0, 2).toUpperCase();
                return (
                  <div
                    key={item.id}
                    className={`group flex items-center gap-4 p-3 rounded-xl border shadow-sm cursor-pointer transition-all active:scale-95
                      ${isCurrentUser
                        ? "leaderboard-current-user shadow-md mt-2 hover:brightness-105 hover:-translate-y-0.5"
                        : isTop3
                        ? item.rank === 1 ? "bg-yellow-400/20 border-yellow-400/40"
                          : item.rank === 2 ? "bg-gray-300/20 border-gray-400/40"
                          : "bg-amber-600/20 border-amber-600/40"
                        : "bg-surface-container-lowest border-border hover:border-warning/50 hover:shadow-md"
                      }`}
                  >
                    <span className={`font-bold w-6 transition-colors ${isCurrentUser ? "" : isTop3 ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`}>
                      {item.rank === 1 ? "🥇" : item.rank === 2 ? "🥈" : item.rank === 3 ? "🥉" : item.rank}
                    </span>
                    <Avatar className={`w-8 h-8 transition-transform ${isCurrentUser ? "group-hover:rotate-6" : "group-hover:scale-110"}`}>
                      <AvatarFallback className={`text-xs font-bold ${
                        isCurrentUser ? "bg-on-primary/20 text-on-primary"
                          : isTop3
                          ? item.rank === 1 ? "bg-yellow-400/30 text-yellow-900"
                            : item.rank === 2 ? "bg-gray-300/30 text-gray-800"
                            : "bg-amber-600/30 text-amber-900"
                          : "bg-warning/30 text-foreground"
                      }`}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`font-bold flex-1 text-sm ${isCurrentUser ? "" : "group-hover:text-primary transition-colors"}`}>
                      {isCurrentUser ? `You (${item.name})` : item.name}
                      {isCurrentUser && user?.isPremium && (
                        <span className="ml-2 bg-yellow-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider align-middle">PREMIUM</span>
                      )}
                    </span>
                    <span className={`font-bold text-sm ${isCurrentUser ? "text-on-primary" : "text-muted-foreground"}`}>
                      {item.xp.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Quest */}
          <div className={`group border p-6 rounded-2xl relative overflow-hidden cursor-pointer hover:shadow-md transition-all active:scale-[0.98] ${
            questComplete
              ? "bg-green-50/50 border-green-500/30 hover:border-green-500/50"
              : "bg-accent/5 border-accent/20 hover:border-accent/30"
          }`}>
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl transition-colors ${
              questComplete ? "bg-green-500/10 group-hover:bg-green-500/20" : "bg-accent/10 group-hover:bg-accent/20"
            }`} />
            <div className="flex items-start gap-4 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 ${
                questComplete ? "bg-green-500 text-white" : "bg-accent text-accent-foreground"
              }`}>
                {questComplete
                  ? <Check size={24} className="group-hover:animate-pulse" />
                  : <Target size={24} className="group-hover:animate-pulse" />
                }
              </div>
              <div>
                <h4 className={`font-bold transition-colors ${
                  questComplete ? "text-green-700 group-hover:text-green-600" : "text-foreground group-hover:text-accent"
                }`}>
                  {questComplete ? "Daily Quest Complete! 🎉" : "Daily Quest"}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {questComplete
                    ? `You've completed ${DAILY_QUEST_TARGET} phrases today. Great work!`
                    : `Complete ${DAILY_QUEST_TARGET} phrases to earn bonus XP.`
                  }
                </p>
              </div>
            </div>
            <div className="mt-6 relative z-10">
              <div className={`flex justify-between text-[10px] font-bold tracking-wider mb-2 uppercase transition-colors ${
                questComplete ? "text-green-600" : "text-muted-foreground group-hover:text-accent"
              }`}>
                <span>{questDone} / {DAILY_QUEST_TARGET} Phrases Done</span>
                <span>{questProgress}%</span>
              </div>
              <Progress
                value={questProgress}
                className={`h-2 bg-surface-container-lowest border ${
                  questComplete
                    ? "border-green-500/20 [&>div]:bg-green-500"
                    : "border-accent/10 [&>div]:bg-accent"
                }`}
              />
            </div>
            {userStats && (
              <div className="mt-4 pt-4 border-t border-outline-variant/10 flex items-center justify-between relative z-10">
                <div className="text-center">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Level</p>
                  <p className="text-lg font-black text-primary">{userStats.level}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg Score</p>
                  <p className="text-lg font-black text-primary">{userStats.avgScore}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Completed</p>
                  <p className="text-lg font-black text-primary">{userStats.totalCompleted}</p>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}