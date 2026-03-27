import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger if not already (safe to call multiple times)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial load animations
      gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } })
        .from(".hero-badge", { y: -30, opacity: 0, duration: 0.6 })
        .from(".hero-title", { y: 50, opacity: 0, stagger: 0.1, duration: 0.8 }, "-=0.4")
        .from(".hero-description p", { y: 30, opacity: 0, stagger: 0.2, duration: 0.8 }, "-=0.6")
        .from(".vision-card, .mission-card", { y: 40, opacity: 0, stagger: 0.2, duration: 0.8 }, "-=0.4")
        .from(".hero-image", { scale: 0.9, opacity: 0, duration: 1 }, "-=0.8")
        .from(".hero-float-card", { y: 50, opacity: 0, duration: 0.8, delay: 0.2 }, "-=0.4");

      // Team cards – scroll triggered
      gsap.fromTo(
        ".team-card",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 0.8,
          scrollTrigger: {
            trigger: ".team-section",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Roadmap items – scroll triggered
      gsap.fromTo(
        ".roadmap-item",
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.3,
          duration: 0.8,
          scrollTrigger: {
            trigger: ".roadmap-section",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert(); // Clean up animations on unmount
  }, []);

  return (
    <>
      <Head>
        <title>About Us | Afrolingo</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div
        ref={containerRef}
        className="min-h-screen bg-surface text-on-surface font-body selection:bg-secondary-fixed selection:text-on-secondary-fixed"
      >
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Hero Section: Our Vision & Mission */}
          <section className="py-20 md:py-32">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-7 mb-12 lg:mb-0">
                <span className="hero-badge inline-block text-secondary font-bold tracking-widest text-sm mb-4 font-headline uppercase">
                  The Heritage Modernist
                </span>
                <h1 className="hero-title text-5xl md:text-7xl font-black text-primary font-headline leading-[1.1] mb-8">
                  Preserving the <br />{" "}
                  <span className="text-secondary italic">Breath</span> of a
                  Continent.
                </h1>
                <div className="hero-description space-y-6 text-on-surface-variant max-w-xl">
                  <p className="text-xl leading-relaxed">
                    Afrolingo was born from a singular realization: that every
                    language lost is a library burned. Our mission is to
                    digitize, democratize, and revitalize the linguistic
                    heritage of Africa.
                  </p>
                  <p className="text-lg opacity-80">
                    We are starting with the foundational pillars—Yoruba, Hausa,
                    and Igbo—but our gaze is fixed on the horizon of 2,000+
                    dialects.
                  </p>
                </div>
                <div className="mt-12 flex flex-col sm:flex-row gap-6">
                  <div className="vision-card p-8 bg-primary-container text-white rounded-full shadow-[0px_20px_40px_rgba(26,28,28,0.05)] flex-1">
                    <h3 className="font-headline text-2xl font-bold mb-2">
                      Our Vision
                    </h3>
                    <p className="text-sm opacity-90 leading-relaxed">
                      To be the digital bridge that connects the next generation
                      to the wisdom of their ancestors through fluent
                      conversation.
                    </p>
                  </div>
                  <div className="mission-card p-8 bg-surface-container-low rounded-full shadow-[0px_20px_40px_rgba(26,28,28,0.05)] flex-1 border-l-4 border-secondary">
                    <h3 className="font-headline text-2xl font-bold text-primary mb-2">
                      Our Mission
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Providing high-end, immersive learning experiences for
                      every African language, without exception.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-5 relative">
                <div className="hero-image aspect-[4/5] rounded-[3rem] overflow-hidden shadow-[0px_20px_40px_rgba(26,28,28,0.05)] bg-surface-container-highest">
                  <img
                    className="w-full h-full object-cover mix-blend-multiply opacity-90"
                    alt="Modern artistic portrait of a diverse African woman"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgP5zrsI7H-rEeHpkb8qFc4CMnV20VjjkJu_8zlSYGKSE-8QJ43yIoLyyk0tezcd2MVHYMYReJ9RGpW4jb4uKW7JA84-IETrYn_cjNYaPZ4Gie1iT0kjE3fzZSWNBxbfUaltTwW1j2e6DN6rv9FNEatS4gBpUzBy9d5ysGdmuQMegjY-zDyiJxwCCYphE82CTmx6sgLnOWn805qlr8Lf9napYRcRK_2_6yLR86_3Px7ymII02a3ULnpZCZr0N_wsA_BlSlA6sKeHeQ"
                  />
                </div>
                <div className="hero-float-card absolute -bottom-8 -left-8 md:-left-16 p-6 bg-surface-container-lowest shadow-[0px_20px_40px_rgba(26,28,28,0.05)] rounded-[2rem] max-w-xs hidden sm:block">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-secondary text-4xl">
                      auto_stories
                    </span>
                    <p className="text-xs font-semibold text-primary">
                      Crafting stories through syntax and cultural nuance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Our Team Section */}
          <section className="team-section py-20 border-t border-outline-variant/10">
            <div className="text-center mb-16">
              <h2 className="font-headline text-4xl font-bold text-primary mb-4">
                Architects of Heritage
              </h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">
                A collective of linguists, creators, and technologists dedicated
                to cultural preservation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Daniel Komolafe */}
              <div className="team-card group">
                <div className="aspect-square rounded-[2rem] mb-6 overflow-hidden bg-surface-container transition-transform group-hover:scale-[1.02] duration-300">
                  <img
                    className="w-full h-full object-cover"
                    alt="Daniel Komolafe"
                    src="/images/komo.jpg"
                  />
                </div>
                <div className="text-center">
                  <h4 className="font-headline text-xl font-bold text-primary">
                    Daniel Komolafe
                  </h4>
                  <p className="text-secondary font-semibold text-sm tracking-widest uppercase mb-3">
                    Backend Eng. (Team Lead)
                  </p>
                  <p className="text-on-surface-variant text-sm leading-relaxed px-4">
                    Architecting the robust systems and secure infrastructure that
                    powers the Afrolingo learning engine.
                  </p>
                </div>
              </div>

              {/* Oluwatobiloba Oni */}
              <div className="team-card group">
                <div className="aspect-square rounded-[2rem] mb-6 overflow-hidden bg-surface-container transition-transform group-hover:scale-[1.02] duration-300">
                  <img
                    className="w-full h-full object-cover"
                    alt="Oluwatobiloba Oni"
                    src="/images/tobi.jpg"
                  />
                </div>
                <div className="text-center">
                  <h4 className="font-headline text-xl font-bold text-primary">
                    Oluwatobiloba Oni
                  </h4>
                  <p className="text-secondary font-semibold text-sm tracking-widest uppercase mb-3">
                    UI/UX Engineer
                  </p>
                  <p className="text-on-surface-variant text-sm leading-relaxed px-4">
                    Crafting intuitive, culturally resonant, and highly engaging
                    interfaces for our global learners.
                  </p>
                </div>
              </div>

              {/* Boluwatife */}
              <div className="team-card group">
                <div className="aspect-square rounded-[2rem] mb-6 overflow-hidden bg-surface-container transition-transform group-hover:scale-[1.02] duration-300">
                  <img
                    className="w-full h-full object-cover"
                    alt="Boluwatife"
                    src="/images/tife.jpg"
                  />
                </div>
                <div className="text-center">
                  <h4 className="font-headline text-xl font-bold text-primary">
                    Boluwatife
                  </h4>
                  <p className="text-secondary font-semibold text-sm tracking-widest uppercase mb-3">
                    Frontend Engineer
                  </p>
                  <p className="text-on-surface-variant text-sm leading-relaxed px-4">
                    Translating beautiful designs into seamless, responsive, and
                    interactive web experiences.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* The Journey Ahead (Roadmap) */}
          <section className="roadmap-section py-20 mb-20 text-white">
            <div className="bg-primary-container rounded-[3rem] p-8 md:p-16 text-on-primary-container relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                <h2 className="font-headline text-4xl md:text-5xl font-bold mb-12">
                  The Journey Ahead
                </h2>
                <div className="space-y-12">
                  <div className="roadmap-item flex flex-col md:flex-row gap-6 md:items-center">
                    <div className="w-16 h-16 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-headline font-bold text-2xl shrink-0">
                      01
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">
                        Foundational Pillars
                      </h4>
                      <p className="opacity-80">
                        Full immersive tracks for Yoruba, Hausa, and Igbo.
                        Currently serving 100k+ learners.
                      </p>
                    </div>
                  </div>
                  <div className="roadmap-item flex flex-col md:flex-row gap-6 md:items-center">
                    <div className="w-16 h-16 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-headline font-bold text-2xl shrink-0">
                      02
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">
                        Continental Expansion
                      </h4>
                      <p className="opacity-80">
                        Scaling to 50+ major regional languages including Swahili,
                        Amharic, and Zulu by late 2025.
                      </p>
                    </div>
                  </div>
                  <div className="roadmap-item flex flex-col md:flex-row gap-6 md:items-center">
                    <div className="w-16 h-16 rounded-full border-2 border-on-primary-container/30 text-on-primary-container flex items-center justify-center font-headline font-bold text-2xl shrink-0">
                      03
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">
                        The Linguistic Tapestry
                      </h4>
                      <p className="opacity-80">
                        The ultimate goal: A digital archive and learning platform
                        for all 2,000+ African languages.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-[30rem]">
                  language
                </span>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}