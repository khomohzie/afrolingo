import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import {
  Globe2,
  Tent,
  Moon,
  Trees,
  CheckCircle2,
  MoreHorizontal,
  ArrowRight,
} from "lucide-react";
import gsap from "gsap";

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

  return (
    <>
      <Head>
        <title>Afrolingo - Choose Your Language</title>
      </Head>

      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Navbar />

        {/* Main Content */}
        <main
          ref={mainRef}
          className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10"
        >
          {/* Hero Banner */}
          <div className="hero-animate mb-10 w-full rounded-xl bg-primary/10 border border-primary/5 min-h-[240px] relative overflow-hidden flex items-center justify-center p-8 text-center">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, var(--primary) 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10 flex max-w-2xl flex-col items-center">
              <Globe2 className="mb-4 h-12 w-12 text-primary" />
              <h2 className="headline-md mb-4 text-foreground text-3xl md:text-4xl font-bold">
                Choose your language
              </h2>
              <p className="body-md text-primary/80 font-medium text-lg">
                Embark on a journey through the heart of Africa. Master the
                rhythms and tones of the continent's most vibrant tongues.
              </p>
            </div>
          </div>

          {/* Language Grid */}
          <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Yoruba Card */}
            <button
              onClick={() => setSelectedLang("yoruba")}
              className={`lang-card card-editorial cursor-pointer group flex flex-col gap-4 text-left p-4 rounded-xl border-2 transition-all duration-300 focus:outline-none [-webkit-tap-highlight-color:transparent] ${
                selectedLang === "yoruba"
                  ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                  : "border-transparent bg-surface hover:border-primary/20 hover:bg-surface-container-low"
              }`}
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-primary/10">
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <Tent
                    className={`h-16 w-16 transition-transform duration-300 ${
                      selectedLang === "yoruba"
                        ? "text-primary opacity-50 scale-110"
                        : "text-primary opacity-30 group-hover:scale-110"
                    }`}
                  />
                </div>
                <img
                  alt="Yoruba patterns"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQdicePZwvVQAL2kXjTV_6kBWyArd55SQOZSXDM3Az9IZxyPNJUy6ssyud7kN6L-bXO8ztr32ldpRfUE9PVKegbCJ_4ClkFszTmXGc6ZP3YsWC9mdbUsnF_cJ_hxFMyBIz95tmfJJzOhp8NM2edhJWZ6WYd9wFkAa4jEhhcA0cXnCNHYp-9UaZ3_msFlb_ZHinyANfmK0MNJ2YArJ6F5ekj-A9XAHlOoEjkKkDxP5QXwysBVpF_1hOj1CkTbPzMtei9Vu9zRIbeW-1"
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
                    selectedLang === "yoruba"
                      ? "grayscale-0 opacity-90 mix-blend-normal"
                      : "grayscale opacity-50 mix-blend-multiply group-hover:grayscale-0 group-hover:opacity-80 group-hover:mix-blend-normal"
                  }`}
                />
              </div>
              <div className="w-full">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-lg font-bold text-foreground font-heading">
                    Yoruba
                  </p>
                  <CheckCircle2
                    className={`h-5 w-5 transition-all duration-300 ${
                      selectedLang === "yoruba"
                        ? "text-primary opacity-100 scale-100"
                        : "text-primary opacity-0 scale-50 group-hover:opacity-30"
                    }`}
                  />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  West Africa • 45M Speakers
                </p>
              </div>
            </button>

            {/* Hausa Card */}
            <button
              onClick={() => setSelectedLang("hausa")}
              className={`lang-card card-editorial cursor-pointer group flex flex-col gap-4 text-left p-4 rounded-xl border-2 transition-all duration-300 focus:outline-none [-webkit-tap-highlight-color:transparent] ${
                selectedLang === "hausa"
                  ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                  : "border-transparent bg-surface hover:border-primary/20 hover:bg-surface-container-low"
              }`}
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-primary/10">
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <Moon
                    className={`h-16 w-16 transition-transform duration-300 ${
                      selectedLang === "hausa"
                        ? "text-primary opacity-50 scale-110"
                        : "text-primary opacity-30 group-hover:scale-110"
                    }`}
                  />
                </div>
                <img
                  alt="Hausa architecture"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBE34UCLeDECRQ92GE91aKZLSVfiAR4TNbMLp5CnpdCTjhwNjeVJc-R-YtNei-3LJGNvC83bwkvNqkyz5M7zD35UMItY1KjK3BIbHfyk44cFNN6ad6G6ABlYWvrH7hgfd5rjI8dOK9DNyGMEe3o7Tj7Rkwk1oDBfIAX6U17VJtXiF4A7V7RENBj2joJVwZten7xzPFlZVBZzaL2V7qqBjmKI-m3S8lwn6ICgzz07ATMtlAbTiFfZCvoUK9srVN5QFMtDGX0kJ5QfJb6"
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
                    selectedLang === "hausa"
                      ? "grayscale-0 opacity-90 mix-blend-normal"
                      : "grayscale opacity-50 mix-blend-multiply group-hover:grayscale-0 group-hover:opacity-80 group-hover:mix-blend-normal"
                  }`}
                />
              </div>
              <div className="w-full">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-lg font-bold text-foreground font-heading">
                    Hausa
                  </p>
                  <CheckCircle2
                    className={`h-5 w-5 transition-all duration-300 ${
                      selectedLang === "hausa"
                        ? "text-primary opacity-100 scale-100"
                        : "text-primary opacity-0 scale-50 group-hover:opacity-30"
                    }`}
                  />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Sahel Region • 80M Speakers
                </p>
              </div>
            </button>

            {/* Igbo Card */}
            <button
              onClick={() => setSelectedLang("igbo")}
              className={`lang-card card-editorial cursor-pointer group flex flex-col gap-4 text-left p-4 rounded-xl border-2 transition-all duration-300 focus:outline-none [-webkit-tap-highlight-color:transparent] ${
                selectedLang === "igbo"
                  ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                  : "border-transparent bg-surface hover:border-primary/20 hover:bg-surface-container-low"
              }`}
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-primary/10">
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <Trees
                    className={`h-16 w-16 transition-transform duration-300 ${
                      selectedLang === "igbo"
                        ? "text-primary opacity-50 scale-110"
                        : "text-primary opacity-30 group-hover:scale-110"
                    }`}
                  />
                </div>
                <img
                  alt="Igbo landscapes"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS-z6hNCQlBf6zmLB-Amo0YSGG7n2LrYJqjy0xrYf3ESJo0VROh8pfp2NczhEodMja231HkO6Z_8ytHOV0V8WSMu0W-_U_N1HHvLiRlAF4AAfeYKgzFwnTDPWC6bCX-Q7_pkzMLmnHokmzY00Fqv0elwcB_DilUMadyleU-fEVMdPTq3jClAOR4EMPyU2Zqf8AlvePtaObGxR7buqJuXl8DExBbAmC1LBkzUCt7XEb9I5wwFlY8a3A6mIKgTDC9VwSk5wwrZXood64"
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
                    selectedLang === "igbo"
                      ? "grayscale-0 opacity-90 mix-blend-normal"
                      : "grayscale opacity-50 mix-blend-multiply group-hover:grayscale-0 group-hover:opacity-80 group-hover:mix-blend-normal"
                  }`}
                />
              </div>
              <div className="w-full">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-lg font-bold text-foreground font-heading">
                    Igbo
                  </p>
                  <CheckCircle2
                    className={`h-5 w-5 transition-all duration-300 ${
                      selectedLang === "igbo"
                        ? "text-primary opacity-100 scale-100"
                        : "text-primary opacity-0 scale-50 group-hover:opacity-30"
                    }`}
                  />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  West Africa • 30M Speakers
                </p>
              </div>
            </button>

            {/* Coming Soon Card */}
            <div className="lang-card flex flex-col gap-4 rounded-xl border-2 border-dashed border-primary/20 bg-surface-container-low p-4 text-left opacity-80">
              <div className="flex aspect-square w-full flex-col items-center justify-center rounded-lg bg-surface-container/50 p-4 text-center">
                <MoreHorizontal className="mb-2 h-12 w-12 text-primary/40" />
                <p className="font-bold text-primary">Exploring More</p>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground font-heading">
                  Swahili, Zulu...
                </p>
                <p className="text-sm font-medium italic text-muted-foreground">
                  More coming soon
                </p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="action-animate mx-auto flex w-full max-w-md flex-col items-center gap-6">
            <Button
              disabled={!selectedLang}
              className={`w-full h-14 flex items-center justify-center gap-2 text-lg transition-all duration-300 ${
                selectedLang
                  ? "bg-primary text-on-primary py-8 shadow-primary/20 hover:bg-primary/90 hover:-translate-y-1 cursor-pointer"
                  : "bg-surface-variant text-on-surface-variant opacity-50 cursor-not-allowed"
              }`}
            >
              <span className="truncate">
                {selectedLang ? "Continue Your Journey" : "Select a Language"}
              </span>
              <ArrowRight className="h-5 w-5" />
            </Button>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/50">
              Step 2 of 5: Fundamentals
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
