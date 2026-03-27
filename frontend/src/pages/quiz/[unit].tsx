import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import api from "@/lib/axios";
import gsap from "gsap";
import { Loader2, Trophy, Volume2, X } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FaMicrophone } from "react-icons/fa";

interface Question {
  id: string;
  phraseId: string;
  type: string;
  question: string;
  options?: string[];
  audioUrl?: string;
}

interface QuizData {
  quizId: string;
  language: string;
  questions: Question[];
  totalQuestions: number;
}

interface UserAnswer {
  phraseId: string;
  answer: string;
}

export default function QuizPage() {
  const { user, authenticated, ready } = useAuth(); // removed getUpdatedUser
  const router = useRouter();
  const { unit } = router.query;

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const questionContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready) return;
    if (!authenticated) {
      router.replace("/login");
      return;
    }
  }, [ready, authenticated, router]);

  useEffect(() => {
    if (!router.isReady || !unit || !user) return;

    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quiz/${user.selectedLanguage}`);
        setQuizData(res.data.data);
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [router.isReady, unit, user]);

  // Animate question entry
  useEffect(() => {
    if (questionContainerRef.current && quizData && !quizResults) {
      gsap.fromTo(
        questionContainerRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [currentIndex, quizData, quizResults]);

  if (isLoading || !quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-primary">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin" size={48} />
          <h2 className="font-heading font-bold text-xl">Loading your quiz...</h2>
        </div>
      </div>
    );
  }

  const currentQ = quizData.questions[currentIndex];
  const progressPercentage = ((currentIndex) / quizData.totalQuestions) * 100;
  const languageName =
    quizData.language.charAt(0).toUpperCase() + quizData.language.slice(1);

  const playAudio = () => {
    if (isPlayingAudio || !currentQ.audioUrl) return;
    setIsPlayingAudio(true);
    const audio = new Audio(currentQ.audioUrl);
    audio.onended = () => setIsPlayingAudio(false);
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
      setIsPlayingAudio(false);
    });
  };

  const handleNextOrSubmit = async () => {
    if (!selectedOption) return;

    const newAnswers = [
      ...userAnswers,
      { phraseId: currentQ.phraseId, answer: selectedOption.toLowerCase() },
    ];
    setUserAnswers(newAnswers);

    if (currentIndex < quizData.totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsSubmitting(true);
      try {
        const res = await api.post("/quiz/submit", { answers: newAnswers });
        setQuizResults(res.data.data);
      } catch (error) {
        console.error("Submit error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // ==========================================
  // VIEW 1: RESULTS SCREEN
  // ==========================================
  if (quizResults) {
    return (
      <>
        <Head>
          <title>Quiz Results | {languageName} | AfroLingo</title>
        </Head>

        <div className="min-h-screen flex flex-col bg-surface text-on-surface">
          <Navbar />

          <main className="flex-1 flex flex-col items-center justify-center p-6 pt-28">
            <div className="max-w-md w-full text-center space-y-6 animate-in zoom-in duration-500">

              {/* Score Ring */}
              <div className="relative w-36 h-36 mx-auto">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-surface-container-high"
                  />
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={2 * Math.PI * 42 * (1 - quizResults.percentage / 100)}
                    className={`transition-all duration-1000 ${quizResults.passed ? "stroke-secondary" : "stroke-red-400"}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {quizResults.passed
                    ? <Trophy size={36} className="text-secondary" />
                    : <X size={36} className="text-red-400" />
                  }
                </div>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-4xl font-heading font-black text-primary mb-2">
                  {quizResults.passed ? "Quiz Passed!" : "Keep Trying!"}
                </h1>
                <p className="text-on-surface-variant text-base">
                  You scored{" "}
                  <span className="font-bold text-primary">{quizResults.percentage}%</span>
                  {" "}— {quizResults.correct}/{quizResults.total} correct
                </p>
                {quizResults.xpEarned > 0 && (
                  <p className="text-secondary font-bold mt-1">
                    +{quizResults.xpEarned} XP earned 🎉
                  </p>
                )}
              </div>

              {/* Next Up card — only on pass */}
              {quizResults.passed && (
                <div className="p-5 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl flex items-center gap-4 text-left">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <FaMicrophone className="text-xl text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-sm">Next Up: AI Voice Lab</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Perfect your {languageName} tones with AI feedback.
                    </p>
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col gap-3 pt-2">
                <Button
                  size="lg"
                  className="cursor-pointer w-full h-14 text-base font-extrabold rounded-2xl bg-primary text-on-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                  onClick={() => router.back()}
                >
                  Back to Learn Path
                </Button>

                <button
                  onClick={() => router.push("/learn")}
                  className="cursor-pointer text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
                >
                  Return to map
                </button>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  // ==========================================
  // VIEW 2: ACTIVE QUIZ SCREEN
  // ==========================================
  return (
    <>
      <Head>
        <title>{languageName} Quiz | AfroLingo</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-surface text-on-surface">
        <Navbar />

        {/* Quiz Header */}
        <header className="w-full max-w-4xl mx-auto px-6 pt-28 pb-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                Unit Quiz
              </p>
              <h2 className="text-2xl font-heading font-black text-primary">
                {languageName} Quiz
              </h2>
            </div>
            <Link
              href="/learn"
              className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-primary"
            >
              <X size={22} strokeWidth={2.5} />
            </Link>
          </div>

          {/* Progress bar + counter */}
          <div className="flex items-center gap-4">
            <Progress
              value={progressPercentage}
              className="h-3 bg-surface-container-high [&>div]:bg-secondary rounded-full flex-1 transition-all duration-500"
            />
            <span className="text-xs font-bold text-on-surface-variant whitespace-nowrap">
              {currentIndex + 1} / {quizData.totalQuestions}
            </span>
          </div>
        </header>

        {/* Question Area */}
        <main className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-6 pb-36">
          <div
            ref={questionContainerRef}
            className="w-full flex flex-col items-center"
          >
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-primary mb-10 text-center leading-tight">
              {currentQ.question}
            </h1>

            {/* Audio button for listen_pick type */}
            {currentQ.type === "listen_pick" && (
              <button
                onClick={playAudio}
                disabled={isPlayingAudio}
                className={`cursor-pointer w-24 h-24 mb-10 rounded-full flex items-center justify-center shadow-xl transition-all ${isPlayingAudio
                    ? "bg-primary/80 text-on-primary scale-95 animate-pulse cursor-not-allowed"
                    : "bg-primary text-on-primary hover:scale-105 active:scale-95"
                  }`}
              >
                <Volume2 size={40} />
              </button>
            )}

            {/* Multiple choice options */}
            {currentQ.type !== "fill_blank" && currentQ.options && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedOption(option)}
                      className={`cursor-pointer p-6 rounded-2xl text-lg font-bold text-center transition-all duration-200 active:scale-95 ${isSelected
                          ? "bg-primary/10 border-2 border-primary text-primary shadow-sm scale-[1.02]"
                          : "bg-surface-container-lowest border-2 border-outline-variant/20 hover:bg-surface-container-low hover:border-outline text-on-surface"
                        }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Fill in the blank */}
            {currentQ.type === "fill_blank" && (
              <input
                type="text"
                placeholder="Type your answer here..."
                className="cursor-text w-full p-6 rounded-2xl text-lg font-bold border-2 border-outline-variant/20 bg-surface-container-lowest focus:border-primary focus:outline-none transition-colors"
                onChange={(e) => setSelectedOption(e.target.value)}
              />
            )}
          </div>
        </main>

        {/* Sticky Footer */}
        <footer className="fixed bottom-0 left-0 w-full border-t border-outline-variant/20 bg-surface">
          <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
            <p className="text-sm text-on-surface-variant font-medium hidden sm:block">
              Question {currentIndex + 1} of {quizData.totalQuestions}
            </p>
            <Button
              size="lg"
              onClick={handleNextOrSubmit}
              disabled={!selectedOption || isSubmitting}
              className={`cursor-pointer w-full sm:w-auto min-w-[200px] h-14 text-base font-extrabold rounded-2xl transition-all ${selectedOption
                  ? "bg-primary text-on-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
                  : "bg-surface-container text-on-surface-variant cursor-not-allowed"
                }`}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : currentIndex === quizData.totalQuestions - 1 ? (
                "Submit Quiz"
              ) : (
                "Next Question →"
              )}
            </Button>
          </div>
        </footer>
      </div>
    </>
  );
}