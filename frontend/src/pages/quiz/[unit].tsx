import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import gsap from "gsap";
import { Loader2, Trophy, Volume2, X } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FaMicrophone } from "react-icons/fa";

// Define the types based on your API
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
  const { user, authenticated, ready, getUpdatedUser } = useAuth();
  const router = useRouter();
  const { unit } = router.query; // e.g., "yoruba" from /quiz/yoruba

  // Data States
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null); // To store the results from the submit API

  // Interaction States
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

    if (user && !user.selectedLanguage) {
      router.replace("/onboarding/choose-language");
      return;
    }
  }, [ready, authenticated, user, router]);

  // 1. FETCH THE QUIZ DATA ON LOAD
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

  // Loading State UI
  if (isLoading || !quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin" size={48} />
          <h2 className="font-heading font-bold text-xl">
            Loading your lesson...
          </h2>
        </div>
      </div>
    );
  }

  const currentQ = quizData.questions[currentIndex];
  const progressPercentage = (currentIndex / quizData.totalQuestions) * 100;

  // Handle Play Audio
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

  // 2. HANDLE SUBMITTING THE QUIZ
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
      // LAST QUESTION: Submit
      setIsSubmitting(true);
      try {
        const res = await api.post("/quiz/submit", { answers: newAnswers });
        setQuizResults(res.data.data);
      } catch (error) {
        console.error("Submit error:", error);
      } finally {
        setIsSubmitting(false);

        // update stored user object with recent database information
        getUpdatedUser();
      }
    }
  };

  // ==========================================
  // VIEW 1: THE BRIDGE SCREEN (QUIZ FINISHED)
  // ==========================================
  if (quizResults) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in duration-500">
          <div
            className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-xl ${
              quizResults.passed
                ? "bg-green-100 text-green-500"
                : "bg-red-100 text-red-500"
            }`}
          >
            {quizResults.passed ? <Trophy size={64} /> : <X size={64} />}
          </div>

          <div>
            <h1 className="text-4xl font-heading font-black text-primary mb-4">
              {quizResults.passed ? "Quiz Passed!" : "Keep Trying!"}
            </h1>
            <p className="text-lg text-on-surface-variant">
              You scored {quizResults.percentage}% ({quizResults.correct}/
              {quizResults.total} correct). You earned {quizResults.xpEarned}{" "}
              XP!
            </p>
          </div>

          {quizResults.passed && (
            <div className="p-6 bg-surface-container-lowest border border-border rounded-2xl flex items-center gap-4 text-left mt-8">
              <FaMicrophone className="text-3xl text-primary" />
              <div>
                <h3 className="font-bold text-foreground">
                  Next Up: AI Voice Lab
                </h3>
                <p className="text-sm text-muted-foreground">
                  Perfect your {quizData.language} tones.
                </p>
              </div>
            </div>
          )}

          <Button
            size="lg"
            className="w-full h-14 text-lg font-bold rounded-full bg-primary text-on-primary hover:scale-105 transition-transform mt-6"
            onClick={() =>
              quizResults.passed ? router.push("/practice") : router.reload()
            }
          >
            {quizResults.passed ? "Start Pronunciation Practice" : "Try Again"}
          </Button>

          <button
            onClick={() => router.push("/learn")}
            className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors block mx-auto mt-4"
          >
            Return to map
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: THE ACTIVE QUIZ SCREEN
  // ==========================================
  return (
    <>
      <Head>
        <title>Quiz | AfroLingo</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <header className="w-full max-w-4xl mx-auto p-6 flex items-center gap-6">
          <Link
            href="/learn"
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <X size={28} strokeWidth={2.5} />
          </Link>
          <Progress
            value={progressPercentage}
            className="h-4 bg-surface-container-high [&>div]:bg-primary rounded-full flex-1 transition-all duration-500"
          />
        </header>

        <main className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-6 pb-32">
          <div
            ref={questionContainerRef}
            className="w-full flex flex-col items-center"
          >
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-primary mb-10 text-center">
              {currentQ.question}
            </h1>

            {currentQ.type === "listen_pick" && (
              <button
                onClick={playAudio}
                disabled={isPlayingAudio}
                className={`w-24 h-24 mb-10 rounded-full flex items-center justify-center shadow-xl transition-all ${
                  isPlayingAudio
                    ? "bg-primary/80 text-on-primary scale-95 animate-pulse"
                    : "bg-primary text-on-primary hover:scale-105 active:scale-95"
                }`}
              >
                <Volume2 size={40} />
              </button>
            )}

            {currentQ.type !== "fill_blank" && currentQ.options && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedOption(option)}
                      className={`p-6 rounded-2xl text-lg font-bold text-center transition-all duration-200 active:scale-95 ${
                        isSelected
                          ? "bg-primary/10 border-2 border-primary text-primary shadow-sm"
                          : "bg-surface-container-lowest border-2 border-border hover:bg-surface-container-low hover:border-outline"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Added basic support for the fill_blank type mentioned in your API docs */}
            {currentQ.type === "fill_blank" && (
              <input
                type="text"
                placeholder="Type your answer here..."
                className="w-full p-6 rounded-2xl text-lg font-bold border-2 border-border bg-surface-container-lowest focus:border-primary focus:outline-none"
                onChange={(e) => setSelectedOption(e.target.value)}
              />
            )}
          </div>
        </main>

        <footer className="fixed bottom-0 left-0 w-full border-t border-border bg-background">
          <div className="max-w-4xl mx-auto px-6 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-end gap-4">
            <Button
              size="lg"
              onClick={handleNextOrSubmit}
              disabled={!selectedOption || isSubmitting}
              className={`w-full sm:w-auto min-w-[180px] h-14 text-lg font-bold rounded-2xl transition-all ${
                selectedOption
                  ? "bg-primary text-on-primary hover:bg-primary/90 hover:scale-105"
                  : "bg-surface-variant text-on-surface-variant cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : currentIndex === quizData.totalQuestions - 1 ? (
                "SUBMIT QUIZ"
              ) : (
                "NEXT QUESTION"
              )}
            </Button>
          </div>
        </footer>
      </div>
    </>
  );
}
