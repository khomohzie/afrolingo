import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sun, Moon } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "@/hooks/useAuth";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const defaultLinks = [
  { href: "/courses", label: "Courses" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About" },
];

const practiceLinks = [
  { href: "/learn", label: "Lessons" },
  { href: "/practice", label: "Practice" },
  { href: "/community", label: "Community" },
];

export function Navbar() {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user, authenticated, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);

  const isPracticePage =
    router.pathname.startsWith("/practice") ||
    router.pathname.startsWith("/learn");

  const currentNavLinks = useMemo(
    () => (isPracticePage ? practiceLinks : defaultLinks),
    [isPracticePage]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!headerRef.current) return;

    const header = headerRef.current;

    gsap.fromTo(
      header,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    );

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "+=100",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const blurIntensity = 8 + progress * 12;
        const shadowOpacity = progress * 0.1;

        header.style.backdropFilter = `blur(${blurIntensity}px)`;
        header.style.boxShadow = `0 4px 20px rgba(0,0,0,${shadowOpacity})`;
      },
    });

    return () => {
      trigger.kill();
    };
  }, [isPracticePage]);

  const isActive = (path: string) => router.pathname === path;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const currentTheme = resolvedTheme || theme;
  const isAuthenticated = authenticated;
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  const handleSignOut = async () => {
    logout();
    setOpen(false);
    await router.push("/");
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 bg-surface/80 backdrop-blur-sm border-b border-outline"
      style={{ backdropFilter: "blur(8px)" }}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Afrolingo Logo"
            width={32}
            height={32}
            sizes="32px"
            className="h-8 w-auto"
          />
          <span className="text-xl font-heading font-bold tracking-tight">
            <span className="text-on-surface">Afro</span>
            <span className="text-[#964B00]">Lingo</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-on-surface-variant">
          {currentNavLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`transition-colors hover:text-primary ${
                isActive(href)
                  ? "text-primary font-bold border-b-2 border-primary pb-1"
                  : ""
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="text-on-surface-variant hover:text-primary rounded-full bg-surface-container"
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

          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-4">
              <Button className="bg-linear-to-r from-[#d4af37] to-[#f3e5ab] text-black px-6 py-6 font-bold border-none hover:opacity-90">
                Go Premium
              </Button>

              <button
                onClick={handleSignOut}
                className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center overflow-hidden transition-transform hover:scale-105"
                aria-label="Logout"
                title={user?.name || "Profile"}
              >
                <span className="text-sm font-bold text-primary">
                  {userInitial}
                </span>
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
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
            </div>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="bg-surface p-6">
              <div className="flex flex-col gap-6 mt-8">
                {currentNavLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      isActive(href) ? "text-primary font-bold" : ""
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

                <div className="w-full h-px bg-outline-variant my-2" />

                {isAuthenticated ? (
                  <div className="flex flex-col gap-4">
                    <Button className="w-full bg-linear-to-r from-[#d4af37] to-[#f3e5ab] text-black font-bold border-none">
                      Go Premium
                    </Button>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">
                            {userInitial}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-on-surface-variant font-medium">
                            {user?.name || "Profile"}
                          </span>
                          <span className="text-xs text-on-surface-variant/70">
                            {user?.email}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleSignOut}
                        className="text-sm font-bold text-error hover:opacity-80 transition-opacity"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="text-on-surface-variant w-full justify-start text-lg"
                      asChild
                    >
                      <Link href="/login" onClick={() => setOpen(false)}>
                        Login
                      </Link>
                    </Button>

                    <Button
                      className="bg-primary text-on-primary rounded-lg font-bold w-full text-lg py-6"
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
