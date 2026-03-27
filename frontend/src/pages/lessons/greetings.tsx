import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { Geist } from "next/font/google";
import gsap from "gsap";

const geist = Geist({ subsets: ["latin"] });

export default function GreetingsLesson() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".gsap-nav", { y: -20, opacity: 0, duration: 0.8 })
        .from(".gsap-sidebar-left > *", { x: -30, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.4")
        .from(".gsap-main-content > *", { y: 30, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.6")
        .from(".gsap-sidebar-right > *", { x: 30, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.8");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Head>
        <title>Greeting Phrases | Afrolingo</title>
        {/* Make sure Material Symbols are loaded in your _document.tsx or _app.tsx! */}
      </Head>

      <div ref={containerRef} className={`bg-surface font-body text-on-surface antialiased min-h-screen ${geist.className}`}>
        
        {/* Top Navigation Bar */}
        <header className="gsap-nav fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="bg-primary w-10 h-10 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-white">language</span>
              </div>
              <span className="font-headline font-black text-xl tracking-tighter text-primary">AfroLingo</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/learn" className="text-sm font-bold text-primary border-b-2 border-primary pb-1">Learn</Link>
              <Link href="/dictionary" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Dictionary</Link>
              <Link href="/community" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Community</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden lg:flex px-6 py-2.5 bg-secondary text-white rounded-full font-headline font-bold text-sm shadow-sm hover:bg-secondary/90 transition-all active:scale-95">
              Go Premium
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/20">
              <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              <span className="font-headline font-bold text-sm text-primary">125 XP</span>
            </div>
            <button className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border border-outline-variant/20">
              <span className="material-symbols-outlined text-on-surface-variant">person</span>
            </button>
          </div>
        </header>

        <main className="pt-28 pb-20 px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Sidebar: Progress & Navigation (3 columns) */}
            <aside className="gsap-sidebar-left lg:col-span-3 space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <button 
                  onClick={() => router.back()}
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-high transition-colors active:scale-95"
                >
                  <span className="material-symbols-outlined text-primary">arrow_back</span>
                </button>
                <h1 className="font-headline font-bold text-xl text-primary">Greeting Phrases</h1>
              </div>

              {/* Progress Section */}
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest font-bold">Your Progress</span>
                  <span className="text-secondary font-headline font-black text-xl">20%</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-secondary w-1/5 rounded-full"></div>
                </div>
                <div className="space-y-4 pt-4 border-t border-outline-variant/20">
                  <div className="flex items-center gap-3 text-sm font-medium text-primary">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span>Alphabet Basics</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-secondary">
                    <span className="material-symbols-outlined text-secondary">radio_button_checked</span>
                    <span>Greetings</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-on-surface-variant opacity-50">
                    <span className="material-symbols-outlined">lock</span>
                    <span>Family Titles</span>
                  </div>
                </div>
              </div>

              {/* CTA Sidebar Card */}
              <div className="bg-primary p-6 rounded-2xl text-white">
                <h4 className="font-headline font-bold mb-2">Master Pronunciation</h4>
                <p className="text-xs text-white/70 mb-4 leading-relaxed">Join a live session with native Yoruba speakers this weekend.</p>
                <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors border border-white/20">
                  View Schedule
                </button>
              </div>
            </aside>

            {/* Main Content: Phrases List (6 columns) */}
            <div className="gsap-main-content lg:col-span-6 space-y-6">
              
              {/* Lesson Context Card */}
              <div className="relative overflow-hidden bg-[#4e3b2a] rounded-3xl p-8 text-white shadow-lg border border-primary/10">
                <div className="relative z-10 max-w-lg">
                  <p className="text-[#c0a58f] font-label text-xs uppercase tracking-widest font-bold mb-2">Module 1 • Level 2</p>
                  <h2 className="font-headline font-black text-4xl mb-4">Essential Yoruba</h2>
                  <p className="text-white/90 text-lg leading-relaxed">
                    Master the foundations of daily social interaction in the heart of Yorubaland. Learn how to greet according to time and context.
                  </p>
                </div>
                {/* Large Cultural Watermark */}
                <div className="absolute -right-8 -bottom-12 opacity-10 pointer-events-none">
                  <span className="font-headline font-black text-[200px] select-none text-white">A</span>
                </div>
              </div>

              {/* Phrase List */}
              <div className="space-y-4">
                {/* Active Card: E kaaro */}
                <div className="w-full text-left group relative active-phrase">
                  <div className="bg-[#4e3b2a] rounded-[1.5rem] p-8 border-2 border-[#652f19]/30 transition-all shadow-[0px_15px_30px_rgba(78,59,42,0.12)]">
                    <div className="flex justify-between items-start mb-6">
                      <button className="bg-secondary p-3 rounded-xl hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>volume_up</span>
                      </button>
                      <span className="bg-white/10 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-white/20">
                        Learning Now
                      </span>
                    </div>
                    <h3 className="font-headline font-bold text-4xl text-white mb-2">E kaaro</h3>
                    <p className="text-[#c0a58f] text-xl font-medium">Good Morning</p>
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <p className="text-[#c0a58f]/70 text-sm italic">Used from dawn until about 11:59 AM.</p>
                    </div>
                  </div>
                </div>

                {/* Upcoming Locked Cards */}
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { phrase: "E kaasan", meaning: "Good Afternoon" },
                    { phrase: "E kale", meaning: "Good Evening", opacity: "opacity-50" },
                    { phrase: "E ku ojumo", meaning: "Greetings for the dawn", opacity: "opacity-40" },
                    { phrase: "E ku ise", meaning: "Greetings for your work", opacity: "opacity-30" },
                  ].map((item, index) => (
                    <div key={index} className={`w-full flex justify-between items-center bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 ${item.opacity || 'opacity-70'}`}>
                      <div>
                        <h3 className="font-headline font-bold text-xl text-primary mb-1">{item.phrase}</h3>
                        <p className="text-on-surface-variant text-sm">{item.meaning}</p>
                      </div>
                      <span className="material-symbols-outlined text-outline-variant">lock</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar: Action & Details (3 columns) */}
            <aside className="gsap-sidebar-right lg:col-span-3 space-y-6">
              <div className="sticky top-28 space-y-6">
                
                {/* Lesson Action Card */}
                <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/20 shadow-xl shadow-primary/5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">school</span>
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-primary">Lesson 1</h4>
                      <p className="text-xs text-on-surface-variant font-medium">Topic: Greetings</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-on-surface-variant">Steps</span>
                      <span className="font-bold text-primary">1 / 5</span>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="h-1.5 flex-1 rounded-full bg-secondary"></div>
                      <div className="h-1.5 flex-1 rounded-full bg-surface-container-highest"></div>
                      <div className="h-1.5 flex-1 rounded-full bg-surface-container-highest"></div>
                      <div className="h-1.5 flex-1 rounded-full bg-surface-container-highest"></div>
                      <div className="h-1.5 flex-1 rounded-full bg-surface-container-highest"></div>
                    </div>
                  </div>

                  {/* THIS IS THE MAGIC BUTTON TO THE AI VOICE LAB */}
                  <Link href="/voice-lab" className="w-full bg-primary text-white font-headline font-extrabold py-5 rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3 group">
                    <span>Start Practice</span>
                    <span className="material-symbols-outlined text-xl group-hover:animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  </Link>

                  <button className="w-full mt-4 py-4 text-primary font-headline font-bold text-sm hover:bg-surface-container-low transition-colors rounded-xl">
                    Skip for now
                  </button>
                </div>

                {/* Cultural Note Card */}
                <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
                  <h5 className="font-headline font-bold text-primary text-sm mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-lg">lightbulb</span>
                    Cultural Insight
                  </h5>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    In Yoruba culture, greetings are extremely important. Younger people often bow (girls) or prostrate (boys) while saying "E kaaro" to elders to show deep respect.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-12 border-t border-outline-variant/10 text-center text-on-surface-variant/40 text-xs font-medium mt-auto">
          <p>© {new Date().getFullYear()} AfroLingo. All rights reserved. Learning Yoruba through meaningful connections.</p>
        </footer>
      </div>
    </>
  );
}