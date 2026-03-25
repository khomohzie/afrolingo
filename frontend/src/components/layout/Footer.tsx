import Link from "next/link";
import Image from "next/image";
import { FaGithub, FaTwitter } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-surface-container-low/40 z-50 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="AfroLingo Logo"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
          <span className="text-xl font-heading font-bold tracking-tight">
            <span className="text-on-surface">Afro</span>
            <span className="text-[#964B00]">Lingo</span>
          </span>
          </Link>
          <nav className="flex flex-wrap gap-6 text-sm text-on-surface-variant font-medium">
            <Link href="/privacy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms of Service
            </Link>
            <Link href="/careers" className="hover:text-primary">
              Careers
            </Link>
            <Link href="/contact" className="hover:text-primary">
              Contact Us
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/afrolingo"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant"
              aria-label="GitHub"
            >
              <FaGithub size={20} color="currentColor" aria-hidden="true" />
            </a>
            <a
              href="https://twitter.com/afrolingo"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant"
              aria-label="Twitter"
            >
              <FaTwitter size={20} color="currentColor" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-outline-variant text-xs text-on-surface-muted">
          <p>© 2026 AfroLingo. Empowering voices across Africa.</p>
          <p>Designed for the future of language learning.</p>
        </div>
      </div>
    </footer>
  );
}