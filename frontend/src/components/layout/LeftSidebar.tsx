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
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  Award,
  BarChart2,
  BookOpen,
  Home,
  LogOut,
  ShoppingCart,
  Target,
  Volume2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const LeftSidebar = ({ title }: { title: string }) => {
  const router = useRouter();

  const { user, authenticated, ready, logout } = useAuth();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;

    if (!authenticated) {
      router.replace("/login");
      return;
    }

    if (user && !user.selectedLanguage) {
      router.replace("/onboarding/choose-language");
      return;
    }
  }, [ready, authenticated, user, router]);

  if (!ready || !authenticated || !user?.selectedLanguage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const confirmLogout = () => {
    logout();
    setLogoutDialogOpen(false);
    router.push("/");
  };

  // Function to determine if the current link is active
  const isActive = (href: string) => router.pathname === href;

  return (
    <>
      <aside className="w-60 fixed left-0 top-0 bottom-0 flex flex-col border-r border-border bg-background z-20">
        <div className="p-8 group cursor-pointer">
          <div className="flex items-center gap-3 font-black text-2xl group-hover:scale-105 transition-transform origin-left">
            <div className="w-8 h-8 relative group-hover:rotate-12 transition-transform duration-300">
              <Image
                src="/logo.png"
                alt="AfroLingo Logo"
                fill
                sizes="32px"
                className="object-contain"
              />
            </div>
            <span className="tracking-tight">
              <span className="text-on-surface">Afro</span>
              <span className="text-[#8B4513]">Lingo</span>
            </span>
          </div>
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mt-1 group-hover:text-primary transition-colors">
            {title}
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link
            href="/"
            className={`group flex items-center gap-4 px-4 py-3 ${
              isActive("/")
                ? "bg-primary text-on-primary"
                : "text-muted-foreground"
            } ${
              !isActive("/") ? "hover:bg-surface-container" : ""
            } rounded-xl font-semibold transition-all active:scale-95`}
          >
            <Home
              size={20}
              className="group-hover:-translate-y-1 transition-transform"
            />{" "}
            Home
          </Link>
          <Link
            href="/learn"
            className={`group flex items-center gap-4 px-4 py-3 ${
              isActive("/learn")
                ? "bg-primary text-on-primary"
                : "text-muted-foreground"
            } ${
              !isActive("/learn") ? "hover:bg-surface-container" : ""
            } rounded-xl font-semibold transition-all active:scale-95`}
          >
            <BookOpen
              size={20}
              className="group-hover:scale-110 transition-transform"
            />{" "}
            Learn
          </Link>
          <Link
            href="/leaderboard"
            className={`group flex items-center gap-4 px-4 py-3 ${
              isActive("/leaderboard")
                ? "bg-primary text-on-primary"
                : "text-muted-foreground"
            } ${
              !isActive("/leaderboard") ? "hover:bg-surface-container" : ""
            } rounded-xl font-semibold transition-all active:scale-95`}
          >
            <BarChart2
              size={20}
              className="group-hover:-translate-y-1 transition-transform"
            />{" "}
            Leaderboard
          </Link>
          <Link
            href="/quests"
            className={`group flex items-center gap-4 px-4 py-3 ${
              isActive("/quests")
                ? "bg-primary text-on-primary"
                : "text-muted-foreground"
            } ${
              !isActive("/quests") ? "hover:bg-surface-container" : ""
            } rounded-xl font-semibold transition-all active:scale-95`}
          >
            <Target
              size={20}
              className="group-hover:-translate-y-1 transition-transform"
            />{" "}
            Quests
          </Link>
          <Link
            href="/shop"
            className={`group flex items-center gap-4 px-4 py-3 ${
              isActive("/shop")
                ? "bg-primary text-on-primary"
                : "text-muted-foreground"
            } ${
              !isActive("/shop") ? "hover:bg-surface-container" : ""
            } rounded-xl font-semibold transition-all active:scale-95`}
          >
            <ShoppingCart
              size={20}
              className="group-hover:-translate-y-1 transition-transform"
            />{" "}
            Shop
          </Link>
          <Link
            href="/afrotts"
            className={`group flex items-center gap-4 px-4 py-3 ${
              isActive("/afrotts")
                ? "bg-primary text-on-primary"
                : "text-muted-foreground"
            } ${
              !isActive("/afrotts") ? "hover:bg-surface-container" : ""
            } rounded-xl font-semibold transition-all active:scale-95`}
          >
            <Volume2
              size={20}
              className="group-hover:-translate-y-1 transition-transform"
            />{" "}
            AfroTTS
          </Link>

          <div className="pt-4">
            <Button className="group w-full flex items-center justify-center gap-2 bg-linear-to-r from-[#d4af37] to-[#f3e5ab] text-black h-auto py-4 rounded-xl font-bold border-none transition-all hover:opacity-90 active:scale-95">
              <Award
                size={20}
                className="group-hover:rotate-12 transition-transform"
              />{" "}
              Go Premium
            </Button>
          </div>
          <div className="pt-2">
            <button
              onClick={handleLogoutClick}
              className="group cursor-pointer w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-150 hover:!bg-red-500"
            >
              <LogOut className="h-4 w-4 text-red-500 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
              <span className="text-red-500 group-hover:text-white">
                Logout
              </span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Logout confirmation dialog */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent className="p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold">
              Confirm Logout
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Are you sure you want to log out? You'll need to sign in again to
              access your progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className=" px-6 py-6 cursor-pointer">
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
};

export default LeftSidebar;
