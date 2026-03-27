import LeftSidebar from "@/components/layout/LeftSidebar";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { ILeaderboardData } from "@/interfaces/learn.interfaces";
import api from "@/lib/axios";
import { Flame, Target, Trophy, Zap } from "lucide-react";
import { Geist } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function Leaderboard() {
  const { user, authenticated, ready, logout } = useAuth();
  const router = useRouter();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("weekly");
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
  }, [ready, authenticated, router]);

  useEffect(() => {
    if (!authenticated) return;
    getLeaderboardData();
  }, [authenticated]);

  if (!ready || !authenticated || !user) {
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

  const sortedLeaderboard = [...leaderboardData].sort(
    (a, b) => a.rank - b.rank
  );
  const topThree = sortedLeaderboard.slice(0, 3);
  const remainingUsers = sortedLeaderboard.slice(3);
  const currentUserEntry = sortedLeaderboard.find(
    (item) => item.id === user._id
  );
  const userAhead = currentUserEntry
    ? sortedLeaderboard.find((item) => item.rank === currentUserEntry.rank - 1)
    : null;
  const progressTargetXp = userAhead?.xp ?? currentUserEntry?.xp ?? user.xp;
  const progressValue =
    progressTargetXp > 0 ? (user.xp / progressTargetXp) * 100 : 0;
  const clampedProgress = Math.min(100, Math.max(0, progressValue));

  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

  return (
    <>
      <Head>
        <title>Leaderboard | AfroLingo</title>
      </Head>
      <div
        className={`${geistSans.className} min-h-screen flex bg-background text-foreground`}
      >
        {/* LEFT SIDEBAR */}
        <LeftSidebar title="Leaderboard" />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 ml-60 mr-97.5 min-h-screen py-16 relative overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 flex flex-col items-center">
            <header className="text-center mb-12 cursor-default group w-full">
              <h1 className="text-4xl font-extrabold text-primary mb-6 group-hover:scale-105 transition-transform duration-500">
                Global Rankings
              </h1>

              <div className="flex items-center justify-center gap-2 bg-surface-container-low p-1.5 rounded-2xl w-max mx-auto border border-border">
                <button
                  onClick={() => setActiveTab("weekly")}
                  className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                    activeTab === "weekly"
                      ? "bg-background text-primary shadow-sm scale-100"
                      : "text-muted-foreground hover:text-foreground scale-95"
                  }`}
                >
                  Weekly Rank
                </button>
                <button
                  onClick={() => setActiveTab("all-time")}
                  className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                    activeTab === "all-time"
                      ? "bg-background text-primary shadow-sm scale-100"
                      : "text-muted-foreground hover:text-foreground scale-95"
                  }`}
                >
                  All Time
                </button>
              </div>
            </header>

            {loadingLeaderboard && (
              <div className="w-full space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-18 rounded-2xl border border-border animate-pulse bg-surface-container-lowest"
                  />
                ))}
              </div>
            )}

            {!loadingLeaderboard && sortedLeaderboard.length === 0 && (
              <div className="w-full text-center py-12 text-muted-foreground">
                No leaderboard data available yet.
              </div>
            )}

            {!loadingLeaderboard && sortedLeaderboard.length > 0 && (
              <>
                {/* PODIUM (Top 3) */}
                <div className="flex items-end justify-center gap-4 mb-16 w-full h-64 mt-8">
                  {topThree[1] && (
                    <div className="flex flex-col items-center group cursor-pointer w-32 relative">
                      <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm text-muted-foreground bg-surface-container-high px-3 py-1 rounded-full shadow-md">
                        {topThree[1].xp.toLocaleString()} XP
                      </div>
                      <Avatar className="w-20 h-20 border-4 border-[#C0C0C0] shadow-lg mb-4 group-hover:scale-110 transition-transform z-10 bg-background">
                        <AvatarFallback className="bg-surface-container-low text-[#C0C0C0] text-xl font-bold">
                          {getInitials(topThree[1].name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="w-full h-32 bg-linear-to-t from-background to-[#C0C0C0]/20 rounded-t-2xl border-t-4 border-[#C0C0C0] flex flex-col items-center justify-start pt-4 group-hover:brightness-110 transition-all">
                        <span className="text-3xl font-black text-[#C0C0C0]">
                          2
                        </span>
                        <span className="font-bold text-sm text-foreground mt-2 truncate max-w-[90%]">
                          {topThree[1].name.split(" ")[0]}
                        </span>
                      </div>
                    </div>
                  )}

                  {topThree[0] && (
                    <div className="flex flex-col items-center group cursor-pointer w-36 relative">
                      <div className="absolute -top-20 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full shadow-md whitespace-nowrap z-20">
                        {topThree[0].xp.toLocaleString()} XP
                      </div>
                      <div className="absolute -top-10 z-20 text-[#d4af37] group-hover:-translate-y-2 group-hover:scale-125 transition-transform duration-300">
                        <Trophy fill="currentColor" size={32} />
                      </div>
                      <Avatar className="w-28 h-28 border-4 border-[#d4af37] shadow-xl mb-4 group-hover:scale-105 transition-transform z-10 bg-background">
                        <AvatarFallback className="bg-yellow-50 text-[#d4af37] text-2xl font-black">
                          {getInitials(topThree[0].name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="w-full h-40 bg-linear-to-t from-background to-[#d4af37]/20 rounded-t-2xl border-t-4 border-[#d4af37] flex flex-col items-center justify-start pt-4 group-hover:brightness-110 transition-all shadow-[0_-10px_30px_-15px_rgba(212,175,55,0.5)]">
                        <span className="text-4xl font-black text-[#d4af37]">
                          1
                        </span>
                        <span className="font-bold text-base text-foreground mt-2 truncate max-w-[90%]">
                          {topThree[0].name.split(" ")[0]}
                        </span>
                      </div>
                    </div>
                  )}

                  {topThree[2] && (
                    <div className="flex flex-col items-center group cursor-pointer w-32 relative">
                      <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm text-muted-foreground bg-surface-container-high px-3 py-1 rounded-full shadow-md">
                        {topThree[2].xp.toLocaleString()} XP
                      </div>
                      <Avatar className="w-20 h-20 border-4 border-[#CD7F32] shadow-lg mb-4 group-hover:scale-110 transition-transform z-10 bg-background">
                        <AvatarFallback className="bg-surface-container-low text-[#CD7F32] text-xl font-bold">
                          {getInitials(topThree[2].name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="w-full h-24 bg-linear-to-t from-background to-[#CD7F32]/20 rounded-t-2xl border-t-4 border-[#CD7F32] flex flex-col items-center justify-start pt-4 group-hover:brightness-110 transition-all">
                        <span className="text-3xl font-black text-[#CD7F32]">
                          3
                        </span>
                        <span className="font-bold text-sm text-foreground mt-2 truncate max-w-[90%]">
                          {topThree[2].name.split(" ")[0]}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* LIST VIEW */}
                <div className="w-full flex flex-col gap-3">
                  {remainingUsers.map((item) => {
                    const isCurrentUser = item.id === user._id;

                    return (
                      <div
                        key={item.id}
                        className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 active:scale-[0.98] cursor-pointer
                          ${
                            isCurrentUser
                              ? "bg-primary-container border-primary text-on-primary shadow-md hover:shadow-lg hover:-translate-y-1"
                              : "bg-surface-container-lowest border-border hover:border-primary/30 hover:shadow-sm"
                          }
                        `}
                      >
                        <span
                          className={`font-black w-8 text-center text-lg ${
                            isCurrentUser
                              ? "text-on-primary"
                              : "text-muted-foreground group-hover:text-primary transition-colors"
                          }`}
                        >
                          {item.rank}
                        </span>

                        <Avatar className="w-12 h-12 border-2 border-background group-hover:scale-110 transition-transform">
                          <AvatarFallback
                            className={`${
                              isCurrentUser
                                ? "bg-background text-primary"
                                : "bg-surface-variant text-foreground"
                            } font-bold`}
                          >
                            {getInitials(item.name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 flex flex-col justify-center">
                          <span
                            className={`font-bold text-base ${
                              isCurrentUser
                                ? ""
                                : "group-hover:text-primary transition-colors"
                            }`}
                          >
                            {isCurrentUser ? `You (${item.name})` : item.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-6">
                          <span
                            className={`font-extrabold tracking-wide ${
                              isCurrentUser
                                ? "text-on-primary"
                                : "text-foreground"
                            }`}
                          >
                            {item.xp.toLocaleString()}{" "}
                            <span className="text-xs font-bold opacity-70">
                              XP
                            </span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="w-97.5 fixed right-0 top-0 bottom-0 border-l border-border bg-surface-container-lowest z-20 p-8 overflow-y-auto">
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
                {user.xp.toLocaleString()}
              </div>
              <p className="text-[10px] font-bold text-muted-foreground tracking-wider mt-1">
                TOTAL XP
              </p>
            </div>
          </div>

          <div className="group bg-accent/5 border border-accent/20 p-6 rounded-2xl relative overflow-hidden cursor-pointer hover:shadow-md hover:border-accent/30 transition-all active:scale-[0.98]">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors"></div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-accent text-accent-foreground flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                <Target size={24} className="group-hover:animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-foreground group-hover:text-accent transition-colors">
                  Climb the Ranks!
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {userAhead
                    ? `Earn ${(
                        userAhead.xp - user.xp
                      ).toLocaleString()} more XP to pass ${userAhead.name}.`
                    : "You are at the top. Keep learning to stay ahead."}
                </p>
              </div>
            </div>
            <div className="mt-6 relative z-10">
              <div className="flex justify-between text-[10px] font-bold text-muted-foreground tracking-wider mb-2 uppercase group-hover:text-accent transition-colors">
                <span>{user.xp.toLocaleString()} XP</span>
                <span>{progressTargetXp.toLocaleString()} XP</span>
              </div>
              <Progress
                value={clampedProgress}
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
              Are you sure you want to log out? You&apos;ll need to sign in
              again to access your progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="px-6 py-6 cursor-pointer">
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
