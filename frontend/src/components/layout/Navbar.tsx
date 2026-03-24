import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sun, Moon } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const navLinks = [
  { href: "/courses", label: "Courses" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const user = null;
  const signOut = async () => {
    console.log("Sign out placeholder");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!headerRef.current) return;

    gsap.fromTo(
      headerRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    );

    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "+=100",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const blurIntensity = 8 + progress * 12; 
        const shadowOpacity = progress * 0.1;
        if (headerRef.current) {
          headerRef.current.style.backdropFilter = `blur(${blurIntensity}px)`;
          headerRef.current.style.boxShadow = `0 4px 20px rgba(0,0,0,${shadowOpacity})`;
        }
      },
    });

    linkRefs.current.forEach((link) => {
      if (!link) return;
      const hoverTimeline = gsap.timeline({ paused: true });
      hoverTimeline.to(link, {
        scale: 1.05,
        color: "var(--primary)", 
        ease: "power2.out",
      });
      link.addEventListener("mouseenter", () => hoverTimeline.play());
      link.addEventListener("mouseleave", () => hoverTimeline.reverse());
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      linkRefs.current.forEach((link) => {
        if (!link) return;
        link.removeEventListener("mouseenter", () => {});
        link.removeEventListener("mouseleave", () => {});
      });
    };
  }, []);

  const isActive = (path: string) => router.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const currentTheme = resolvedTheme || theme;

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md transition-shadow"
      style={{ backdropFilter: "blur(8px)" }} 
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Afrolingo Logo"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
          <span className="text-xl font-bold text-primary">Afrolingo</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-on-surface-variant">
          {navLinks.map(({ href, label }, idx) => (
            <Link
              key={href}
              href={href}
              ref={(el) => {
                if (el) linkRefs.current[idx] = el;
              }}
              className={`transition-colors hover:text-primary ${
                isActive(href) ? "text-primary" : ""
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="text-on-surface-variant hover:text-primary"
          >
            {mounted ? (
              currentTheme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )
            ) : (
              <div className="h-5 w-5" />
            )}
          </Button>

          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-surface-container-high flex items-center justify-center">
                  <span className="text-xs font-bold text-on-surface-variant">
                    U
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-on-surface-variant hover:text-primary"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-2 border-outline-variant text-on-surface-variant hover:bg-surface-container px-6 py-6 hover:text-primary"
                asChild
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                variant="default"
                className="bg-primary px-6 py-6 text-on-primary hover:bg-primary/90 rounded-lg font-bold"
                asChild
              >
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-surface p-6">
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      isActive(href) ? "text-primary" : ""
                    }`}
                  >
                    {label}
                  </Link>
                ))}
                {mounted && (
                  <button
                    onClick={() => {
                      toggleTheme();
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 text-lg font-medium text-on-surface-variant hover:text-primary"
                  >
                    {currentTheme === "dark" ? (
                      <>
                        <Sun className="h-5 w-5" /> Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="h-5 w-5" /> Dark Mode
                      </>
                    )}
                  </button>
                )}
                {user ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant">
                        user@example.com
                      </span>
                      <button
                        onClick={handleSignOut}
                        className="text-sm text-on-surface-variant hover:text-primary"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="text-on-surface-variant w-full justify-start"
                      asChild
                    >
                      <Link href="/login" onClick={() => setOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button
                      variant="default"
                      className="bg-primary text-on-primary rounded-lg font-bold w-full"
                      asChild
                    >
                      <Link href="/register" onClick={() => setOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}