import Head from "next/head";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { getPostAuthRoute, saveAuth, signupUser } from "@/lib/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Geist } from "next/font/google";
import gsap from "gsap";

const geist = Geist({ subsets: ["latin"] });

export default function Register() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: "",
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
          ".gsap-card",
          { y: 50, opacity: 0, duration: 1.2, clearProps: "all" },
          "-=1"
        )
        .from(".gsap-hero", { x: -30, opacity: 0, duration: 1.2 }, "-=1")
        .from(
          ".gsap-item",
          { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 },
          "-=0.8"
        )
        .from(".gsap-footer", { y: 30, opacity: 0, duration: 1.2 }, "-=0.8");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleChange =
    (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const result = await signupUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      const authData = result.data;

      saveAuth(authData);

      toast.success("Sign Up successful");

      await wait(1200);

      await router.replace(getPostAuthRoute(authData.user));
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Unable to create account";

      toast.error(message);
      console.error("Signup failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up | Afrolingo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <style>{`
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
          .pattern-bg {
            background-color: #faf9f8;
            background-image:
              linear-gradient(135deg, rgba(78, 59, 42, 0.03) 25%, transparent 25%),
              linear-gradient(225deg, rgba(78, 59, 42, 0.03) 25%, transparent 25%),
              linear-gradient(45deg, rgba(78, 59, 42, 0.03) 25%, transparent 25%),
              linear-gradient(315deg, rgba(78, 59, 42, 0.03) 25%, transparent 25%);
            background-position: 40px 0, 40px 0, 0 0, 0 0;
            background-size: 80px 80px;
            background-repeat: repeat;
          }
          .editorial-shadow {
            box-shadow: 0px 20px 40px rgba(26, 28, 28, 0.05);
          }
        `}</style>
      </Head>

      <div
        ref={containerRef}
        className={`bg-surface font-body text-on-surface selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen flex flex-col ${geist.className}`}
      >
        <header className="gsap-header w-full px-8 py-6 max-w-7xl mx-auto flex justify-between items-center z-50">
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

        <main className="flex-grow flex items-center justify-center px-4 md:px-8 py-12 pattern-bg overflow-hidden">
          <div className="gsap-card w-full max-w-5xl grid md:grid-cols-2 bg-surface-container-lowest rounded-[2rem] overflow-hidden editorial-shadow border border-outline-variant/20">
            <div className="gsap-hero hidden md:block relative bg-primary overflow-hidden">
              <Image
                src="/hero-signup.jpg"
                alt="Cultural Heritage"
                fill
                className="absolute inset-0 object-cover opacity-60 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-12 space-y-4">
                <h1 className="font-headline text-4xl font-bold text-on-primary leading-tight tracking-tight">
                  Connect with your <br />
                  <span className="text-secondary-container">roots</span>{" "}
                  through language.
                </h1>

                <p className="text-white opacity-75 font-body text-lg leading-relaxed max-w-sm">
                  Join over 50,000 learners preserving heritage through the
                  beauty of African dialects.
                </p>

                <div className="pt-8 flex gap-4 items-center">
                  <div className="flex -space-x-3">
                    <div className="h-10 w-10 rounded-full border-2 border-white bg-orange-200" />
                    <div className="h-10 w-10 rounded-full border-2 border-white bg-orange-300" />
                    <div className="h-10 w-10 rounded-full border-2 border-white bg-orange-400" />
                  </div>
                  <span className="text-xs text-surface-container-low/40 uppercase tracking-widest font-bold">
                    Community Choice
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-16 flex flex-col justify-center">
              <div className="gsap-item mb-10 text-center md:text-left">
                <h2 className="font-headline text-3xl font-extrabold text-primary mb-2">
                  Create Account
                </h2>
                <p className="font-body text-on-surface-variant">
                  Embark on your linguistic journey today.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-6">
                <div className="gsap-item space-y-2">
                  <label
                    className="font-label text-sm font-bold text-primary px-1"
                    htmlFor="name"
                  >
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined text-[20px]">
                        person
                      </span>
                    </div>
                    <Input
                      className="w-full pl-11 pr-4 py-6 bg-surface-container-low border-none rounded-xl text-on-surface placeholder:text-outline/50 focus-visible:ring-2 focus-visible:ring-secondary/20 transition-all shadow-none"
                      id="name"
                      placeholder="Kwame Mensah"
                      type="text"
                      value={form.name}
                      onChange={handleChange("name")}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>

                <div className="gsap-item space-y-2">
                  <label
                    className="font-label text-sm font-bold text-primary px-1"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined text-[20px]">
                        mail
                      </span>
                    </div>
                    <Input
                      className="w-full pl-11 pr-4 py-6 bg-surface-container-low border-none rounded-xl text-on-surface placeholder:text-outline/50 focus-visible:ring-2 focus-visible:ring-secondary/20 transition-all shadow-none"
                      id="email"
                      placeholder="kwame@example.com"
                      type="email"
                      value={form.email}
                      onChange={handleChange("email")}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>

                <div className="gsap-item space-y-2">
                  <label
                    className="font-label text-sm font-bold text-primary px-1"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined text-[20px]">
                        lock
                      </span>
                    </div>
                    <Input
                      className="w-full pl-11 pr-12 py-6 bg-surface-container-low border-none rounded-xl text-on-surface placeholder:text-outline/50 focus-visible:ring-2 focus-visible:ring-secondary/20 transition-all shadow-none"
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
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-secondary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="gsap-item mt-4">
                  <Button
                    className="w-full h-auto bg-primary py-5 rounded-xl text-on-primary font-headline font-bold text-lg hover:bg-primary-container transition-all active:scale-[0.98] shadow-primary/10"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Account"}
                  </Button>
                </div>
              </form>

              <div className="gsap-item mt-10 text-center">
                <p className="font-body text-on-surface-variant">
                  Already have an account?
                  <Link
                    href="/login"
                    className="font-bold text-secondary hover:text-on-secondary-container transition-colors ml-2 underline decoration-secondary/30 underline-offset-4"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>
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
