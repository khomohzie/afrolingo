import Head from "next/head";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { getPostAuthRoute, loginUser, saveAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Geist } from "next/font/google";
import gsap from "gsap";

const geist = Geist({ subsets: ["latin"] });

export default function Login() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.from(".gsap-header", { y: -30, opacity: 0, duration: 1.2 })
        .from(
          ".gsap-bg-asset",
          { scale: 0.8, opacity: 0, duration: 1.5, ease: "power3.out" },
          "-=1"
        )
        .from(
          ".gsap-card",
          { y: 50, opacity: 0, duration: 1.2, clearProps: "all" },
          "-=1.2"
        )
        .from(
          ".gsap-item",
          { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 },
          "-=0.8"
        )
        .from(".gsap-footer", { y: 30, opacity: 0, duration: 1.2 }, "-=0.8");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleChange =
    (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const result = await loginUser({
        email: form.email.trim(),
        password: form.password,
      });

      const authData = result.data;

      if (!authData?.accessToken || !authData?.user) {
        toast.error("Login succeeded, but auth data was incomplete.");
        return;
      }

      saveAuth(authData);

      toast.success(result.message || "Welcome back!");
      void router.replace(getPostAuthRoute(authData.user));
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Unable to login right now";
      toast.error(message);
      console.error("Login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Afrolingo</title>
        <meta name="description" content="Login to your Afrolingo account" />
      </Head>

      <div
        ref={containerRef}
        className={`min-h-screen flex flex-col bg-surface font-body text-on-surface ${geist.className}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23362516' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2v-4h4v-2H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        <header className="gsap-header w-full px-8 py-6 flex justify-center md:justify-start">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Afrolingo Logo"
              width={32}
              height={32}
              sizes="32px"
              className="h-8 w-auto"
            />
            <span className="text-xl font-headline font-bold tracking-tight">
              <span className="text-on-surface">Afro</span>
              <span className="text-secondary">Lingo</span>
            </span>
          </Link>
        </header>

        <main className="flex-grow flex items-center justify-center px-6 py-12 relative overflow-hidden">
          <div className="gsap-bg-asset absolute -bottom-6 -right-12 opacity-5 pointer-events-none">
            <img
              src="/logo.png"
              alt=""
              className="w-[400px] h-[400px] object-contain"
            />
          </div>

          <div className="gsap-card w-full max-w-md bg-surface-container-lowest rounded-[2rem] p-10 md:p-12 z-10 shadow-[0px_20px_40px_rgba(26,28,28,0.05)] border border-outline-variant/20">
            <div className="gsap-item mb-10 text-center md:text-left">
              <h1 className="font-headline font-bold text-3xl text-primary tracking-tight mb-2">
                Welcome Back
              </h1>
              <p className="font-label text-on-surface-variant text-sm">
                Continue your journey into African heritage.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="gsap-item space-y-2">
                <label
                  className="font-label font-semibold text-sm text-primary"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    className="w-full bg-surface-container border-none focus-visible:ring-2 mt-1 focus-visible:ring-secondary/20 rounded-xl px-4 py-6 text-on-surface placeholder:text-outline/60 transition-all outline-none"
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              <div className="gsap-item space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    className="font-label font-semibold text-sm text-primary"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="font-label text-xs text-red-500 font-bold hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    className="w-full bg-surface-container border-none focus-visible:ring-2 mt-1 focus-visible:ring-secondary/20 rounded-xl px-4 py-6 pr-12 text-on-surface placeholder:text-outline/60 transition-all outline-none"
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange("password")}
                    disabled={isSubmitting}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center justify-center cursor-pointer text-outline/70 hover:text-primary transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5 mt-1" />
                    ) : (
                      <EyeIcon className="h-5 w-5 mt-1" />
                    )}
                  </button>
                </div>
              </div>

              <div className="gsap-item mt-4">
                <Button
                  className="w-full h-auto bg-primary hover:bg-primary-container text-on-primary font-headline font-bold py-4 rounded-xl transition-all active:scale-[0.98]"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>

            <p className="gsap-item mt-10 text-center font-label text-sm text-on-surface-variant">
              Don&apos;t have an account?
              <Link
                href="/register"
                className="text-secondary font-bold hover:underline ml-1"
              >
                Join the community
              </Link>
            </p>
          </div>
        </main>

        <footer className="gsap-footer w-full px-8 py-8 border-t border-outline-variant/20 bg-surface mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Afrolingo Logo"
                  width={32}
                  height={32}
                  sizes="32px"
                  className="h-8 w-auto"
                />
                <span className="text-xl font-headline font-bold tracking-tight">
                  <span className="text-on-surface">Afro</span>
                  <span className="text-secondary">Lingo</span>
                </span>
              </Link>

              <span className="text-outline-variant/50 hidden md:block">|</span>

              <p className="font-label text-sm text-on-surface-variant opacity-70">
                © {new Date().getFullYear()} Afrolingo. All rights reserved.
              </p>
            </div>

            <nav className="flex gap-8">
              <Link
                href="/privacy"
                className="font-label text-sm text-on-surface-variant hover:text-secondary transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="font-label text-sm text-on-surface-variant hover:text-secondary transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                Terms of Service
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
