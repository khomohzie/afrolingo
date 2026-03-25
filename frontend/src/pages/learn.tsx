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
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Geist } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function LearnPath() {
  return (
    <>
      <Head>
        <title>Yoruba Path | Afrolingo</title>
      </Head>
      <div
        className={`${geistSans.className} min-h-screen flex bg-background text-foreground`}
      >
        {/* LEFT SIDEBAR */}
        <aside className="w-[240px] fixed left-0 top-0 bottom-0 flex flex-col border-r border-border bg-background z-20">
          <div className="p-8 group cursor-pointer">
            <div className="flex items-center gap-3 font-black text-2xl text-primary group-hover:scale-105 transition-transform origin-left">
              <div className="w-8 h-8 relative group-hover:rotate-12 transition-transform duration-300">
                <Image
                  src="/logo.png"
                  alt="Afrolingo Logo"
                  fill
                  className="object-contain"
                />
              </div>
              Afrolingo
            </div>
            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mt-1 group-hover:text-primary transition-colors">
              Yoruba Path
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

            <div className="pt-4">
              <Button className="group w-full flex items-center justify-center gap-2 bg-primary text-on-primary h-auto py-4 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all hover:-translate-y-1 hover:shadow-primary/30">
                <Award
                  size={20}
                  className="group-hover:rotate-12 transition-transform"
                />{" "}
                Go Premium
              </Button>
            </div>
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 ml-[240px] mr-[320px] min-h-screen py-16 relative">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <header className="text-center mb-16 cursor-default group">
              <h1 className="text-4xl font-extrabold text-primary mb-2 group-hover:scale-105 transition-transform duration-500">
                Yoruba Path
              </h1>
              <p className="text-muted-foreground text-lg group-hover:text-foreground transition-colors">
                Master the language of the Orishas
              </p>
            </header>

            <div className="relative flex flex-col items-center w-full">
              <div className="absolute top-0 bottom-[44px] left-1/2 -translate-x-1/2 w-1 border-l-[3px] border-dashed border-primary/20 z-0" />

              {/* UNIT 1: COMPLETED */}
              <div className="relative z-10 flex flex-col items-center gap-4 mb-12 group cursor-pointer active:scale-95 transition-all">
                <div className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center shadow-md border-4 border-background group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                  <Check
                    size={28}
                    strokeWidth={3}
                    className="group-hover:scale-125 transition-transform"
                  />
                </div>
                <div className="bg-surface-container-lowest border border-border px-8 py-4 rounded-2xl shadow-sm text-center min-w-[280px] group-hover:border-success/50 transition-colors">
                  <h3 className="font-bold text-lg text-foreground">
                    Unit 1: Greetings
                  </h3>
                  <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase mt-1 group-hover:text-green-600 transition-colors">
                    Completed
                  </p>
                </div>
              </div>

              {/* UNIT 2: ACTIVE */}
              <div className="relative z-10 flex flex-col items-center gap-4 mb-12 group cursor-pointer active:scale-95 transition-all">
                <div className="absolute top-0 w-20 h-20 bg-primary/20 rounded-full blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>

                <div className="w-20 h-20 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xl border-4 border-background group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300">
                  <Play
                    size={32}
                    fill="currentColor"
                    className="ml-1 group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="bg-primary text-on-primary px-8 py-5 rounded-2xl shadow-lg text-center min-w-[280px] group-hover:-translate-y-1 transition-transform">
                  <h3 className="font-bold text-lg">
                    Unit 2: Family & Kinship
                  </h3>
                  <p className="text-xs font-bold text-on-primary/70 tracking-widest uppercase mt-1">
                    In Progress
                  </p>
                </div>
              </div>

              {/* UNIT 3: NEXT UP */}
              <div className="relative z-10 flex flex-col items-center gap-4 mb-12 group cursor-pointer active:scale-95 transition-all">
                <div className="w-16 h-16 rounded-full bg-surface-container text-primary flex items-center justify-center shadow-sm border-4 border-background group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Utensils
                    size={24}
                    className="group-hover:rotate-12 transition-transform"
                  />
                </div>
                <div className="bg-surface-container-lowest border border-border px-8 py-4 rounded-2xl shadow-sm text-center min-w-[280px] group-hover:border-primary/50 group-hover:shadow-md transition-all">
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
                <div className="bg-surface-variant border border-border px-8 py-4 rounded-2xl shadow-sm text-center min-w-[280px] flex flex-col justify-center min-h-[88px] group-hover:border-error/30 transition-colors">
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
                <div className="bg-surface-variant border border-border px-8 py-4 rounded-2xl shadow-sm text-center min-w-[280px] flex flex-col justify-center min-h-[88px] group-hover:border-error/30 transition-colors">
                  <h3 className="font-bold text-lg text-foreground">
                    Unit 5: Work & Business
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="w-[320px] fixed right-0 top-0 bottom-0 border-l border-border bg-surface-container-lowest z-20 p-8 overflow-y-auto">
          <div className="flex items-center justify-between gap-4 mb-10">
            {/* STREAK */}
            <div className="group flex-1 bg-surface-container-lowest border border-border hover:border-warning/50 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer transition-all active:scale-95">
              <div className="flex items-center gap-2 text-xl font-black text-foreground group-hover:scale-110 transition-transform">
                <Flame
                  className="text-red-500 group-hover:animate-pulse"
                  fill="currentColor"
                  size={24}
                />{" "}
                12
              </div>
              <p className="text-[10px] font-bold text-muted-foreground tracking-wider mt-1">
                DAYS STREAK
              </p>
            </div>
            {/* TOTAL XP */}
            <div className="group flex-1 bg-surface-container-lowest border border-border hover:border-warning/50 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer transition-all active:scale-95">
              <div className="flex items-center gap-2 text-xl font-black text-foreground group-hover:scale-110 transition-transform">
                <Zap
                  className="text-orange-500 group-hover:rotate-12 transition-transform"
                  fill="currentColor"
                  size={24}
                />{" "}
                2,450
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
              {[
                {
                  rank: 1,
                  name: "Kofi Mensah",
                  xp: "3,120",
                  initials: "KM",
                  bg: "bg-warning/30",
                },
                {
                  rank: 2,
                  name: "Amara Okafor",
                  xp: "2,890",
                  initials: "AO",
                  bg: "bg-warning/30",
                },
              ].map((user) => (
                <div
                  key={user.rank}
                  className="group flex items-center gap-4 p-3 bg-surface-container-lowest rounded-xl border border-border shadow-sm hover:border-warning/50 hover:shadow-md cursor-pointer transition-all active:scale-95"
                >
                  <span className="font-bold text-muted-foreground w-4 group-hover:text-primary transition-colors">
                    {user.rank}
                  </span>

                  <Avatar className="w-8 h-8 group-hover:scale-110 transition-transform">
                    <AvatarFallback
                      className={`${user.bg} text-xs font-bold text-foreground`}
                    >
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>

                  <span className="font-bold flex-1 text-sm group-hover:text-primary transition-colors">
                    {user.name}
                  </span>
                  <span className="font-bold text-sm text-muted-foreground">
                    {user.xp}
                  </span>
                </div>
              ))}

              <div className="group flex items-center gap-4 p-3 leaderboard-current-user shadow-md mt-2 cursor-pointer hover:brightness-105 hover:-translate-y-0.5 transition-all active:scale-95">
                <span className="font-bold w-4">4</span>

                <Avatar className="w-8 h-8 group-hover:rotate-6 transition-transform">
                  <AvatarFallback className="bg-on-primary/20 text-xs font-bold text-on-primary">
                    SY
                  </AvatarFallback>
                </Avatar>

                <span className="font-bold flex-1 text-sm">You (Sarah)</span>
                <span className="font-bold text-sm">2,450</span>
              </div>

              <div className="group flex items-center gap-4 p-3 bg-surface-container-lowest rounded-xl border border-border shadow-sm mt-2 hover:border-surface-variant hover:shadow-md cursor-pointer transition-all active:scale-95">
                <span className="font-bold text-muted-foreground w-4 group-hover:text-primary transition-colors">
                  5
                </span>

                <Avatar className="w-8 h-8 group-hover:scale-110 transition-transform">
                  <AvatarFallback className="bg-surface-variant text-xs font-bold text-foreground">
                    TD
                  </AvatarFallback>
                </Avatar>

                <span className="font-bold flex-1 text-sm group-hover:text-primary transition-colors">
                  Tariq Diallo
                </span>
                <span className="font-bold text-sm text-muted-foreground">
                  2,100
                </span>
              </div>
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
                className="h-2 bg-surface-container-lowest border border-accent/10 [&>div]:bg-accent group-hover:[&>div]:brightness-110 [&>div]:relative [&>div]:overflow-hidden [&>div]:after:content-[''] [&>div]:after:absolute [&>div]:after:inset-0 [&>div]:after:-translate-x-full [&>div]:after:bg-gradient-to-r [&>div]:after:from-transparent [&>div]:after:white/30 [&>div]:after:to-transparent group-hover:[&>div]:after:animate-[shimmer_1.5s_infinite]"
              />
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
