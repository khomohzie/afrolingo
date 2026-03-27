import Head from "next/head";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { getPostAuthRoute, saveAuth, signupUser } from "@/lib/auth";
import { getErrorMessage, wait } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { Geist } from "next/font/google";
import gsap from "gsap";

const geist = Geist({ subsets: ["latin"] });

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUCCESS_REDIRECT_DELAY_MS = 1200;

export default function Register() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const normalizedName = useMemo(() => form.name.trim().replace(/\s+/g, " "), [form.name]);
  const normalizedEmail = useMemo(() => form.email.trim().toLowerCase(), [form.email]);
  const isNameValid = useMemo(() => normalizedName.length >= 2, [normalizedName]);
  const isEmailValid = useMemo(() => EMAIL_REGEX.test(normalizedEmail), [normalizedEmail]);
  const isPasswordValid = useMemo(() => form.password.trim().length >= 6, [form.password]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "expo.out" } })
        .from(".gsap-header", { y: -30, opacity: 0, duration: 1.2 })
        .from(".gsap-card", { y: 50, opacity: 0, duration: 1.2, clearProps: "all" }, "-=1")
        .from(".gsap-hero", { x: -30, opacity: 0, duration: 1.2 }, "-=1")
        .from(".gsap-item", { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.8")
        .from(".gsap-footer", { y: 30, opacity: 0, duration: 1.2 }, "-=0.8");
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: field === "email" ? value.replace(/\s+/g, "") : value }));
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!normalizedName || !normalizedEmail || !form.password) return toast.error("Please complete all required fields.");
    if (!isNameValid) return toast.error("Please enter your full name.");
    if (!isEmailValid) return toast.error("Please enter a valid email address.");
    if (!isPasswordValid) return toast.error("Password must be at least 6 characters.");

    setIsSubmitting(true);
    try {
      const result = await signupUser({ name: normalizedName, email: normalizedEmail, password: form.password });
      const authData = result?.data;

      if (!result?.success) return toast.error(result?.message || "Unable to create account.");
      if (!authData?.accessToken || !authData?.user) return toast.error("Signup succeeded, but the account session was incomplete.");

      saveAuth(authData);
      toast.success("Sign Up successful");
      await wait(SUCCESS_REDIRECT_DELAY_MS);
      await router.replace(getPostAuthRoute(authData.user));
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
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
      </Head>

      <div
        ref={containerRef}
        className={`bg-surface font-body text-on-surface selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen flex flex-col ${geist.className}`}
      >
        <header className="gsap-header w-full px-8 py-6 max-w-7xl mx-auto flex justify-between items-center z-50">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Afrolingo Logo" width={32} height={32} sizes="32px" className="h-8 w-auto" />
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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKLcPxbSBnyF9s6ZaStBcZ338wwEL1CB-mg1v8KneUScOObbIYAObf9rI-z3kkrYTWCT6UG9D6R13vM-PZRJ3QXBtdKjTTjEbkIUbM-v8W9ac-HcXuw3CztIdYKMqL-LqERoQq182bxp3gpMtbDvRzhbwvlxetTSIMfzMjqdqUbuzfxCvlB4-dCbqnj-E4JBRD0_OUztdnHxwC2u5b9CGWTqBoTh5D8iR98oTeN9Ab0nwzKFvEq60lJD0TAuykMWwXxdsDeuqH2uM"
                alt="Cultural Heritage"
                fill
                sizes="50vw"
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
                  Join over 50,000 learners preserving heritage through the beauty of African dialects.
                </p>
                <div className="pt-8 flex gap-4 items-center">
                  <div className="flex -space-x-3">
                    <div className="h-10 w-10 rounded-full border-2 border-white bg-orange-200" />
                    <div className="h-10 w-10 rounded-full border-2 border-white bg-orange-300" />
                    <div className="h-10 w-10 rounded-full border-2 border-white bg-orange-400" />
                  </div>
                  <span className="text-xs text-surface-container-low/40 uppercase tracking-widest font-bold">Community Choice</span>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-16 flex flex-col justify-center">
              <div className="gsap-item mb-10 text-center md:text-left">
                <h2 className="font-headline text-3xl font-extrabold text-primary mb-2">Create Account</h2>
                <p className="font-body text-on-surface-variant">Embark on your linguistic journey today.</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-6" noValidate>
                <div className="gsap-item space-y-2">
                  <label className="font-label text-sm font-bold text-primary px-1" htmlFor="name">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                      <FaUser className="text-[18px] text-primary/60" />
                    </div>
                    <Input
                      className="w-full pl-11 pr-4 py-6 bg-surface-container-low border-none rounded-xl text-on-surface placeholder:text-outline/50 focus-visible:ring-2 focus-visible:ring-secondary/20 transition-all shadow-none"
                      id="name"
                      placeholder="Kwame Mensah"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={handleChange("name")}
                      disabled={isSubmitting}
                      required
                      aria-invalid={form.name.length > 0 && !isNameValid}
                    />
                  </div>
                </div>

                <div className="gsap-item space-y-2">
                  <label className="font-label text-sm font-bold text-primary px-1" htmlFor="email">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                      <FaEnvelope className="text-[18px] text-primary/60" />
                    </div>
                    <Input
                      className="w-full pl-11 pr-4 py-6 bg-surface-container-low border-none rounded-xl text-on-surface placeholder:text-outline/50 focus-visible:ring-2 focus-visible:ring-secondary/20 transition-all shadow-none"
                      id="email"
                      placeholder="kwame@example.com"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={handleChange("email")}
                      disabled={isSubmitting}
                      required
                      aria-invalid={form.email.length > 0 && !isEmailValid}
                    />
                  </div>
                </div>

                <div className="gsap-item space-y-2">
                  <label className="font-label text-sm font-bold text-primary px-1" htmlFor="password">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                      <FaLock className="text-[18px] text-primary/60" />
                    </div>
                    <Input
                      className="w-full pl-11 pr-12 py-6 bg-surface-container-low border-none rounded-xl text-on-surface placeholder:text-outline/50 focus-visible:ring-2 focus-visible:ring-secondary/20 transition-all shadow-none"
                      id="password"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={form.password}
                      onChange={handleChange("password")}
                      disabled={isSubmitting}
                      required
                      aria-invalid={form.password.length > 0 && !isPasswordValid}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center justify-center cursor-pointer text-outline/70 hover:text-secondary transition-colors disabled:cursor-not-allowed"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      disabled={isSubmitting}
                    >
                      {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
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
                  Already have an account?{" "}
                  <Link href="/login" className="font-bold text-secondary hover:text-on-secondary-container transition-colors ml-1 underline decoration-secondary/30 underline-offset-4">
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
                <Image src="/logo.png" alt="Afrolingo Logo" width={32} height={32} sizes="32px" className="h-8 w-auto" />
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
              <Link href="/privacy" className="font-label text-sm text-on-surface-variant hover:text-secondary transition-colors" onClick={(e) => e.preventDefault()}>Privacy Policy</Link>
              <Link href="/terms" className="font-label text-sm text-on-surface-variant hover:text-secondary transition-colors" onClick={(e) => e.preventDefault()}>Terms of Service</Link>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}