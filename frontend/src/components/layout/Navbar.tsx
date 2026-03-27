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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpen, LogOut } from "lucide-react";
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

const isDisabledLink = (href: string) => {
  return href === "/courses" || href === "/community";
};

export function Navbar() {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user, authenticated, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const dropdownContentRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (dropdownOpen && dropdownContentRef.current) {
      gsap.fromTo(
        dropdownContentRef.current,
        { opacity: 0, y: -8, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "back.out(0.3)" }
      );
    }
  }, [dropdownOpen]);

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

    return () => trigger.kill();
  }, [isPracticePage]);

  const isActive = (path: string) => router.pathname === path;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const currentTheme = resolvedTheme || theme;
  const isAuthenticated = authenticated;
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  const handleSignOut = () => {
    setLogoutDialogOpen(true);
  };

  const confirmLogout = async () => {
    logout();
    setLogoutDialogOpen(false);
    setOpen(false);
    setDropdownOpen(false);
    await router.push("/");
  };

  return (
    <>
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
            {currentNavLinks.map(({ href, label }) => {
              const disabled = isDisabledLink(href);
              const active = isActive(href) && !disabled;
              if (disabled) {
                return (
                  <div
                    key={href}
                    className="transition-colors hover:text-primary cursor-pointer"
                    onClick={() => {}}
                  >
                    {label}
                  </div>
                );
              }
              return (
                <Link
                  key={href}
                  href={href}
                  className={`transition-colors hover:text-primary ${active
                    ? "text-primary font-bold border-b-2 border-primary pb-1"
                    : ""
                    }`}
                >
                  {label}
                </Link>
              );
            })}
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
                {/* Only show Go Premium button if user is not premium */}
                {!user?.isPremium && (
                  <Button className="bg-linear-to-r from-[#d4af37] to-[#f3e5ab] text-black px-6 py-6 font-bold border-none hover:opacity-90">
                    <Link href="/premium">Go Premium</Link>
                  </Button>
                )}

                <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="relative w-10 h-10 rounded-full cursor-pointer bg-primary/20 border-2 border-primary flex items-center justify-center overflow-hidden transition-all duration-200 hover:scale-105 hover:border-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/30"
                      aria-label="Account menu"
                      title={user?.name || "Profile"}
                    >
                      <span className="text-sm font-bold text-primary">{userInitial}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    ref={dropdownContentRef}
                    align="end"
                    className="w-64 p-2 mt-4 bg-surface-container-lowest/95 backdrop-blur-sm border border-outline-variant/20 rounded-xl shadow-xl"
                  >
                    {/* User Info with Premium Badge */}
                    <div className="flex items-center gap-3 px-2 py-3 border-b border-outline-variant/20">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-primary">{userInitial}</span>
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-on-surface truncate">
                            {user?.name || "User"}
                          </span>
                          {user?.isPremium && (
                            <span className="bg-yellow-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                              PREMIUM
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-on-surface-variant/70 truncate">
                          {user?.email || "user@example.com"}
                        </span>
                      </div>
                    </div>

                    <DropdownMenuSeparator className="bg-outline-variant/20 my-2" />

                    <DropdownMenuItem
                      onClick={() => router.push("/learn")}
                      className="group cursor-pointer hover:!bg-primary -mt-3 gap-3 py-3 px-4 rounded-lg transition-all duration-150"
                    >
                      <BookOpen className="h-4 w-4 text-primary transition-transform group-hover:scale-110 group-hover:text-white" />
                      <span className="text-on-surface group-hover:text-white">My Learning</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-outline-variant/20 my-2" />

                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="group cursor-pointer -mt-3 hover:!bg-red-500 gap-3 py-3 px-4 rounded-lg transition-all duration-150"
                    >
                      <LogOut className="h-4 w-4 text-red-500 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
                      <span className="text-red-500 group-hover:text-white">Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                  {currentNavLinks.map(({ href, label }) => {
                    const disabled = isDisabledLink(href);
                    const active = isActive(href) && !disabled;
                    if (disabled) {
                      return (
                        <div
                          key={href}
                          className="text-lg font-medium transition-colors hover:text-primary cursor-pointer"
                          onClick={() => {}}
                        >
                          {label}
                        </div>
                      );
                    }
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setOpen(false)}
                        className={`text-lg font-medium transition-colors hover:text-primary ${active ? "text-primary font-bold" : ""
                          }`}
                      >
                        {label}
                      </Link>
                    );
                  })}

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
                      {/* Only show Go Premium button if user is not premium */}
                      {!user?.isPremium && (
                        <Button className="w-full bg-linear-to-r from-[#d4af37] to-[#f3e5ab] text-black font-bold border-none">
                          <Link href="/premium">Go Premium</Link>
                        </Button>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                              {userInitial}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="text-on-surface-variant font-medium">
                                {user?.name || "Profile"}
                              </span>
                              {user?.isPremium && (
                                <span className="bg-yellow-500 text-black text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                  PREMIUM
                                </span>
                              )}
                            </div>
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

      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent className="p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold">
              Confirm Logout
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Are you sure you want to log out? You'll need to sign in again to access
              your progress.
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