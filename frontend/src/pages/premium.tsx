import gsap from "gsap";
import {
  Ban,
  BookOpen,
  CreditCard,
  DownloadCloud,
  Lock,
  ShieldCheck,
} from "lucide-react";
import Head from "next/head";
import { useEffect, useRef } from "react";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import {
  IInitiatePaymentResponse,
  IInterswitchPaymentResponse,
} from "@/interfaces/payment.interface";
import api from "@/lib/axios";
import { toast } from "sonner";

export default function PremiumCheckout() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".value-prop-animate",
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, stagger: 0.15 }
      )
        .fromTo(
          ".checkout-card-animate",
          { x: 40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8 },
          "-=0.6"
        )
        .fromTo(
          ".featured-image-animate",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.4"
        );
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const handlePayment = async () => {
    try {
      // Call backend to initialize payment
      const res = await api.post("/payment/initiate");

      toast.success(res.data.message);

      const data: IInitiatePaymentResponse = res.data.data;

      // Trigger Interswitch Checkout
      window.webpayCheckout({
        ...data,
        merchant_code: process.env.NEXT_PUBLIC_MERCHANT_CODE,
        pay_item_id: process.env.NEXT_PUBLIC_PAY_ITEM_ID,
        onComplete: async (response: IInterswitchPaymentResponse) => {
          try {
            console.log("Payment response:", response);

            // Verify payment on backend
            const res = await api.post("/payment/verify", {
              txnRef: data.txn_ref,
            });

            toast.success(res.data.message);
          } catch (err: any) {
            console.error(err);

            if (err.response?.status === 404) {
              toast.error(
                err.response.data?.message ||
                  "Payment not found. Please contact support."
              );
            } else {
              toast.error("Verification failed. Try again.");
            }
          }
        },
        mode: process.env.NEXT_PUBLIC_INTERSWITCH_MODE,
      });
    } catch (err) {
      console.error(err);
      toast.error("Payment failed! Try again.");
    }
  };

  return (
    <>
      <Head>
        <title>AfroLingo Premium | Unlock the Full Experience</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-surface font-sans text-foreground">
        {/* Global Navbar */}
        <Navbar />

        <main
          ref={mainRef}
          className="flex-1 flex flex-col justify-center py-8 md:py-16 px-4 max-w-250 mx-auto w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Value Proposition */}
            <div className="flex flex-col gap-8">
              <div className="value-prop-animate flex flex-col gap-4">
                <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full w-fit tracking-wide">
                  PREMIUM PLAN
                </span>
                <h1 className="text-4xl md:text-5xl font-black font-heading leading-tight tracking-tight text-primary">
                  Unlock the Full African Experience
                </h1>
                <p className="text-on-surface-variant text-lg">
                  Master Yoruba, Igbo, Hausa, Swahili, and 20+ other languages
                  with our expert-led premium curriculum.
                </p>
              </div>

              <div className="value-prop-animate flex flex-col gap-4">
                {/* Feature 1 */}
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-surface-container-lowest shadow-sm hover:border-primary/30 transition-colors">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-primary font-heading">
                      Access 50+ Lessons
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      Structured courses from beginner to pro.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-surface-container-lowest shadow-sm hover:border-primary/30 transition-colors">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary">
                    <DownloadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-primary font-heading">
                      Offline Mode
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      Learn anywhere, even without internet access.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-surface-container-lowest shadow-sm hover:border-primary/30 transition-colors">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary">
                    <Ban className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-primary font-heading">
                      No Ads
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      Enjoy an uninterrupted learning journey.
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="value-prop-animate flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-green-600 dark:text-green-500" />
                  <span className="text-xs font-semibold text-on-surface-variant tracking-wider">
                    SSL ENCRYPTED
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-500" />
                  <span className="text-xs font-semibold text-on-surface-variant tracking-wider">
                    SECURE PAYMENT
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Checkout Card */}
            <div className="checkout-card-animate flex flex-col bg-surface-container-lowest rounded-2xl border border-border p-8 float-shadow">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-xl font-bold font-heading text-primary">
                    Premium Annual
                  </h3>
                  <p className="text-on-surface-variant text-sm mt-1">
                    Billed monthly, cancel anytime
                  </p>
                </div>
                <span className="bg-primary text-on-primary text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wider">
                  MOST POPULAR
                </span>
              </div>

              <div className="mb-10 flex items-baseline gap-1">
                <span className="text-5xl font-black font-heading text-primary">
                  ₦2,000
                </span>
                <span className="text-lg font-bold text-on-surface-variant">
                  / mo
                </span>
              </div>

              <div className="space-y-6">
                <div className="h-px bg-border w-full"></div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-on-surface-variant">
                      Subscription Total
                    </span>
                    <span className="font-bold text-primary">₦2,000.00</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-on-surface-variant">VAT (7.5%)</span>
                    <span className="font-bold text-primary">₦150.00</span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-black font-heading border-t border-dashed border-border pt-4">
                    <span className="text-primary">Total Due</span>
                    <span className="text-primary">₦2,150.00</span>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  className="btn-primary w-full h-14 flex items-center justify-center gap-3 text-lg mt-4 cursor-pointer shadow-primary/20"
                >
                  <CreditCard className="w-5 h-5" />
                  Pay Securely with Interswitch
                </Button>

                <p className="text-center text-[10.5px] text-on-surface-muted uppercase tracking-widest leading-relaxed">
                  Your payment is processed through Interswitch's secure
                  gateway. <br />
                  AfroLingo does not store your card details.
                </p>
              </div>

              {/* Payment Method Logos */}
              <div className="mt-8 flex justify-center gap-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <img
                  alt="Visa"
                  className="h-4 object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBDQykijcj8vHOSIwoeugloI76mNcnG0S9H6-GQ03kbV492KXQuG71wgw1ZdAAur4fGY9W7hwf5lNO0jA-dhFLELmKqhN_-85FmqUUfDmx1RqbcfXxzPjxkdM5FH5CWgeo3yA-EMmZbUWDOiXmcX10BCmoIVKCJ0ckd9s7a_SJLXFh-_otLnQ-XZP6Hopv_KlTc5eTaYoDu_tm1EBG6YyVcF-cn1cDbpT7Pc76dR23vQqv41vqrHY9Y0JEjuQkadZ5LTJozB_vuSAu"
                />
                <img
                  alt="Mastercard"
                  className="h-4 object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsj-LqWLFFF56DhdnjHO2mR9dO8f_t_-aLzX55VDWOP6gaYDFrRjXgONJ--LPnULnthzCmx4sLhQzxy_LX0A_gNU_e0w18yr_EqM-SGiFU6_XdxwrJoH6E-ebMyp5FpEh4NNUP0eDwe3KJb2ZKBg8GZV7b0e0YqId8W4tE8Wx3TubUWfHGGA2QDMa4G8qWtCrm3EyZsaYTzrUU3uXI_CCsM1qbf0poE_63sltmliDR-baJI5hJggon0PcuaM9PB1cVxuoSpb7-GJcQ"
                />
                <img
                  alt="Verve"
                  className="h-4 object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuACPfVo9nlhIYQeTChKCVzpyzSsYyLoMfH3fU4yqIDBCjYeXJWrNilo8usGuDmawJIUEdzkV0oUk-7wlrNyqa3H0hXGE6DY5mPx6dBixxC4EZ6EB1Ow8kUFD-MJaph-JgOtZbgtIlESo9QzqgBbwEGVrEUZa-IUCdvECy4hFhOsym2VBReLWY0GBY3fi70eI688F9UUfWoCuj1cZaxmPU5r9lYoGpRTW7B3Kj1hfgMjfb8nWCh4fZ8xj_WuLUH-sF1hAj_WgHGU9_q1"
                />
              </div>
            </div>
          </div>

          {/* Featured Section / Illustration */}
          <div className="featured-image-animate mt-16 w-full">
            <div
              className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-2xl min-h-75 border border-border relative float-shadow"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAIKrY1Wqw12Xo9KGp__tEE29iogVgzQBqubMkOVKXln0QtVjdnoSh8k5C5RNTLiCo76sR4eviiIZZQd2AwKkhjVKIRbO42IlYt05xtY1LacrJrzmihJD7Q2RrG23Z1P5QjR23n1gzvfxhQvShzQxIu1sDTBMNGK17-pbZOtSq-t5g0-z2MRYeTGkTJaEbpHQWeMQ-4GhlmQ8NTpVZoQim-iUq-auHHGiNHLGtJsbn8E7HBbk3cKlwnFkTGjNsLm2f-ncMHlTyoe-xB")',
              }}
            >
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="relative p-8 md:p-10 max-w-2xl">
                <h4 className="text-white text-3xl font-heading font-bold mb-3">
                  Learn Beyond Words
                </h4>
                <p className="text-white/90 text-base md:text-lg italic leading-relaxed">
                  "Language is the road map of a culture. It tells you where its
                  people come from and where they are going."
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </>
  );
}
