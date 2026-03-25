import { useEffect, useRef } from "react";
import Head from "next/head";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, BookOpen, Globe } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heroTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "restart none restart none", 
      },
    });
    heroTimeline
      .fromTo(
        ".hero-title",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" }
      )
      .fromTo(
        ".hero-text",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        ".hero-buttons",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        ".hero-stats",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.2"
      );
  
    gsap.to(heroImageRef.current, {
      y: 50,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  
    const cards = gsap.utils.toArray<HTMLElement>(".feature-card");
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.15,
          scrollTrigger: {
            trigger: card,              
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "restart none restart none", 
          },
        }
      );
    });
  
    gsap.fromTo(
      ctaRef.current,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "restart none restart none",
        },
      }
    );
  
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <Head>
        <title>AfroLingo – Unlock the Voices of Africa</title>
        <meta
          name="description"
          content="Learn African languages like Yoruba, Hausa, and Igbo with AI voice comparison and cultural immersion."
        />
      </Head>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="py-12 md:py-20 bg-surface overflow-hidden"
        >
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="hero-title text-xs font-bold tracking-widest text-primary uppercase mb-4">
                Learn African Dialects
              </p>
              <h1 className="hero-title display-lg mb-6">
                Unlock the <br />
                <span className="text-secondary">voices</span> of Africa.<br />
              </h1>
              <p className="hero-text body-md text-gray-500 text-base md:text-lg leading-relaxed max-w-md mb-8">
                Master indigenous languages like Yoruba, Hausa, and Igbo.
                Connect deeply with a vibrant community of learners from across
                the globe. Professional courses for real-world fluency.
              </p>
              <div className="hero-buttons flex flex-wrap gap-4 mb-10">
                <Button
                  size="lg"
                  className="bg-primary text-on-primary hover:bg-primary/90 px-8 py-8 rounded-xl font-bold hover:-translate-y-1 transition-all"
                  asChild
                >
                  <Link href="/register">Start Learning Now</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-outline-variant text-on-surface-variant hover:bg-surface-container px-8 py-8 rounded-xl font-bold"
                  asChild
                >
                  <Link href="/courses">View Courses</Link>
                </Button>
              </div>
              <div className="hero-stats flex items-center gap-3">
                <div className="flex -space-x-3">
                  <div className="h-10 w-10 rounded-full border-2 border-white bg-orange-200" />
                  <div className="h-10 w-10 rounded-full border-2 border-white bg-orange-300" />
                  <div className="h-10 w-10 rounded-full border-2 border-white bg-orange-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  <span className="font-black text-primary">2,500+</span> learners joined this week
                </p>
              </div>
            </div>
            <div
              ref={heroImageRef}
              className="relative transform-gpu will-change-transform"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl rotate-1 md:rotate-2">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgP5zrsI7H-rEeHpkb8qFc4CMnV20VjjkJu_8zlSYGKSE-8QJ43yIoLyyk0tezcd2MVHYMYReJ9RGpW4jb4uKW7JA84-IETrYn_cjNYaPZ4Gie1iT0kjE3fzZSWNBxbfUaltTwW1j2e6DN6rv9FNEatS4gBpUzBy9d5ysGdmuQMegjY-zDyiJxwCCYphE82CTmx6sgLnOWn805qlr8Lf9napYRcRK_2_6yLR86_3Px7ymII02a3ULnpZCZr0N_wsA_BlSlA6sKeHeQ"
                  alt="Stylized digital art of three African women representing Yoruba, Hausa, and Igbo cultures in traditional attire"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-primary/10 blur-3xl"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          ref={featuresRef}
          className="py-24 bg-surface-container-low"
        >
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-[#4A331A]">
                Why Learn with AfroLingo?
              </h2>
              <p className="text-gray-500 text-base md:text-lg leading-relaxed">
                We combine linguistic expertise with cultural immersion to
                provide the most effective learning experience for African
                languages.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="feature-card p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="mb-6 h-14 w-14 rounded-2xl bg-[#FAFAFA] border border-gray-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-[#4A331A]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Native Speakers</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Learn from certified instructors living in Lagos, Nairobi,
                  Dakar, and across the continent for authentic pronunciation.
                </p>
              </div>
              <div className="feature-card p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="mb-6 h-14 w-14 rounded-2xl bg-[#FAFAFA] border border-gray-100 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-[#4A331A]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Interactive Courses</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Gamified lessons, speech recognition tools, and real-time
                  feedback to keep you engaged and motivated.
                </p>
              </div>
              <div className="feature-card p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="mb-6 h-14 w-14 rounded-2xl bg-[#FAFAFA] border border-gray-100 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-[#4A331A]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Cultural Context</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Go beyond vocabulary. Understand idioms, traditions, and the
                  cultural heartbeat behind every language.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20 max-w-6xl">
          <div
            ref={ctaRef}
            className="bg-[#4A331A] rounded-[40px] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl"
          >
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight">
                Ready to speak your heritage?
              </h2>
              <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto font-medium">
                Join thousands of students on the most comprehensive African
                language platform in the world.
              </p>
              <Button
                size="lg"
                variant="ghost"
                className="bg-surface text-primary px-8 py-8 rounded-2xl font-black hover:opacity-90 hover:text-primary transition-all duration-200"
                asChild
              >
                <Link href="/register">Get Started Today</Link>
              </Button>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#6a4a28] blur-[100px] pointer-events-none opacity-50"></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}