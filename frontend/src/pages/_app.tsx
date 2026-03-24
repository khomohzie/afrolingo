import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  // Force light mode on the client
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    // Optional: also clear any stored theme to prevent future issues
    localStorage.removeItem("theme");
    localStorage.removeItem("afrolingo-theme");
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="afrolingo-theme"
    >
      <Component {...pageProps} />
      <Toaster richColors closeButton />
    </ThemeProvider>
  );
}