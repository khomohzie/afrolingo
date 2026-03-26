type QuizType = "multiple_choice" | "fill_blank" | "listen_pick";

interface QuizQuestion {
  id: string;
  phraseId: string;
  type: QuizType;
  question: string;
  options?: string[]; // for multiple_choice and listen_pick
  audioUrl?: string | null; // for listen_pick
  correctAnswer: string;
}
