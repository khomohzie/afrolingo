import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const socialRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    if (!footerRef.current) return;

    gsap.fromTo(
      footerRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          end: "bottom 20%",
          toggleActions: "play none none none",
        },
      }
    );

    socialRefs.current.forEach((icon) => {
      if (!icon) return;
      const hoverTl = gsap.timeline({ paused: true });
      hoverTl.to(icon, {
        scale: 1.1,
        backgroundColor: "rgba(0,0,0,0.05)",
        duration: 0.2,
        ease: "power2.out",
      });
      icon.addEventListener("mouseenter", () => hoverTl.play());
      icon.addEventListener("mouseleave", () => hoverTl.reverse());
    });

    linkRefs.current.forEach((link) => {
      if (!link) return;
      const hoverTl = gsap.timeline({ paused: true });
      hoverTl.to(link, {
        y: -2,
        color: "var(--primary)",
        duration: 0.2,
        ease: "power2.out",
      });
      link.addEventListener("mouseenter", () => hoverTl.play());
      link.addEventListener("mouseleave", () => hoverTl.reverse());
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      socialRefs.current.forEach((icon) => {
        if (!icon) return;
        icon.removeEventListener("mouseenter", () => {});
        icon.removeEventListener("mouseleave", () => {});
      });
      linkRefs.current.forEach((link) => {
        if (!link) return;
        link.removeEventListener("mouseenter", () => {});
        link.removeEventListener("mouseleave", () => {});
      });
    };
  }, []);

  return (
    <footer ref={footerRef} className="bg-surface-container-low/40 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Afrolingo Logo"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <span className="text-lg font-bold text-primary">Afrolingo</span>
          </Link>
          <nav className="flex flex-wrap gap-6 text-sm text-on-surface-variant font-medium">
            {["/privacy", "/terms", "/careers", "/contact"].map((href, idx) => (
              <Link
                key={href}
                href={href}
                ref={(el) => {
                  if (el) linkRefs.current[idx] = el;
                }}
                className="hover:text-primary transition-colors"
              >
                {href === "/privacy" && "Privacy Policy"}
                {href === "/terms" && "Terms of Service"}
                {href === "/careers" && "Careers"}
                {href === "/contact" && "Contact Us"}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/afrolingo"
              target="_blank"
              rel="noopener noreferrer"
              ref={(el) => {
                if (el) socialRefs.current[0] = el;
              }}
              className="h-10 w-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="h-5 w-5 text-on-surface-variant" />
            </a>
            <a
              href="https://x.com/afrolingo"
              target="_blank"
              rel="noopener noreferrer"
              ref={(el) => {
                if (el) socialRefs.current[1] = el;
              }}
              className="h-10 w-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors"
              aria-label="X (formerly Twitter)"
            >
              <FaXTwitter className="h-5 w-5 text-on-surface-variant" />
            </a>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-outline-variant text-xs text-on-surface-muted">
          <p>© 2026 Afrolingo. Empowering voices across Africa.</p>
          <p>Designed for the future of language learning.</p>
        </div>
      </div>
    </footer>
  );
}