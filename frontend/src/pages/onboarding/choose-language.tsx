import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { Compass, BadgeCheck } from "lucide-react";
import gsap from "gsap";
import Image from "next/image";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

export default function ChooseLanguage() {
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".hero-animate",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }
      )
        .fromTo(
          ".lang-card",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 },
          "-=0.4"
        )
        .fromTo(
          ".action-animate",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.2"
        );
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const languages = [
    {
      id: "yoruba",
      name: "Yoruba",
      speakers: "45M Speakers",
      description: "Talking drum and Aso Oke fabric",
      image: "/images/yoruba-man.png", 
    },
    {
      id: "hausa",
      name: "Hausa",
      speakers: "80M Speakers",
      description: "Sahelian architecture and embroidery",
      image: "/images/hausa-man.png", 
    },
    {
      id: "igbo",
      name: "Igbo",
      speakers: "30M Speakers",
      description: "Isiagu pattern and cultural staff",
      image: "/images/igbo-man.png",
    },
  ];

  return (
    <>
      <Head>
        <title>Afrolingo - Choose Your Language</title>
      </Head>

      <div
        className="min-h-screen flex flex-col font-sans"
        style={{
          backgroundColor: "#fdfaf7",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 30H15L30 0zM0 30l15 30H-15L0 30zm60 0l15 30H45L60 30zM30 60l15-30H15l15 30z' fill='%234e3b2a' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E\")"
        }}
      >
        <Navbar />

        <main
          ref={mainRef}
          className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-12 md:py-20"
        >
          <div className="hero-animate flex flex-col gap-4 mb-12 text-center max-w-3xl mx-auto">
            <h1 className="text-primary text-4xl md:text-5xl font-black leading-tight tracking-tight">
              Choose your language
            </h1>
            <p className="text-primary/70 text-lg font-medium leading-relaxed">
              Connect with the soul of the continent through its diverse voices. <br className="hidden md:block" />
              Begin your journey into the heart of Africa.
            </p>
          </div>

          <div className="mb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {languages.map((lang) => {
              const isSelected = selectedLang === lang.id;

              return (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLang(lang.id)}
                  className={`lang-card h-full group flex flex-col rounded-2xl shadow-sm border transition-all duration-300 cursor-pointer overflow-hidden text-left outline-none [-webkit-tap-highlight-color:transparent] ${isSelected
                      ? "border-primary scale-[1.02] shadow-xl ring-2 ring-primary/20"
                      : "border-transparent bg-background hover:border-primary/40"
                    }`}
                >
                  <div className="w-full aspect-[4/5] overflow-hidden relative bg-primary/5">
                    <div
                      className={`absolute inset-0 bg-center bg-no-repeat bg-cover transition-transform duration-700 ${isSelected ? "scale-110" : "group-hover:scale-105"
                        }`}
                      style={{ backgroundImage: `url(${lang.image})` }}
                    />
                  </div>


                  <div className={`p-5 border-t transition-colors duration-300 w-full flex-1 flex flex-col ${isSelected ? "bg-primary border-primary text-primary-foreground" : "bg-card border-border text-foreground"
                    }`}>
                    <div className="flex justify-between items-baseline mb-1">
                      <p className={`text-lg font-bold leading-none ${isSelected ? "text-primary-foreground" : "text-primary"}`}>
                        {lang.name}
                      </p>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-primary-foreground/70" : "text-primary/50"}`}>
                        {lang.speakers}
                      </p>
                    </div>
                    <p className={`text-sm ${isSelected ? "text-primary-foreground/90" : "text-primary/60"}`}>
                      {lang.description}
                    </p>
                  </div>
                </button>
              );
            })}

            <div className="lang-card h-full flex flex-col rounded-2xl border-2 border-dashed border-primary/30 p-6 items-center justify-center text-center group hover:bg-white/50 transition-colors cursor-default bg-white/60 backdrop-blur-sm shadow-xl shadow-primary/5">
              <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <Compass className="text-primary/40 h-8 w-8" />
              </div>
              <p className="text-primary text-lg font-bold">Coming Soon</p>
              <p className="text-primary/60 text-sm mt-2 px-4">
                Swahili, Zulu, and many more voices of Africa
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <span className="px-2 py-1 rounded-md bg-primary/5 text-[10px] font-bold uppercase tracking-wider text-primary/50">Swahili</span>
                <span className="px-2 py-1 rounded-md bg-primary/5 text-[10px] font-bold uppercase tracking-wider text-primary/50">Zulu</span>
                <span className="px-2 py-1 rounded-md bg-primary/5 text-[10px] font-bold uppercase tracking-wider text-primary/50">Amharic</span>
              </div>
            </div>
          </div>

          <div className="action-animate flex flex-col items-center gap-6">
            <Button
              disabled={!selectedLang}
              className={`min-w-[280px] h-14 px-8 rounded-xl text-lg font-bold leading-normal tracking-wide transition-all duration-300 ${selectedLang
                  ? "bg-primary text-primary-foreground  shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  : "bg-surface-variant text-muted-foreground opacity-50 cursor-not-allowed"
                }`}
            >
              <span className="truncate">
                {selectedLang ? "Continue Your Journey" : "Select a Language"}
              </span>
            </Button>
            <p className="text-primary/40 text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-green-500" />
              Trusted by 500k+ learners
            </p>
          </div>
        </main>

      </div>
      <Footer />
    </>
  );
}