import { IPhrase } from "../interfaces/language.interfaces";

export const getQuizType = (index: number): QuizType => {
  const types: QuizType[] = ["multiple_choice", "listen_pick", "fill_blank"];
  return types[index % types.length];
};

export const buildQuestion = (
  phrase: IPhrase,
  allPhrases: IPhrase[],
  type: QuizType
): QuizQuestion => {
  const base = {
    id: `q-${phrase._id}`,
    phraseId: phrase._id.toString(),
    type,
    correctAnswer: phrase.translation,
  };

  if (type === "multiple_choice") {
    const distractors = allPhrases
      .filter((p) => p._id.toString() !== phrase._id.toString())
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((p) => p.translation);

    const options = shuffle([phrase.translation, ...distractors]);
    return {
      ...base,
      question: `What does "${phrase.text}" mean?`,
      options,
    };
  }

  if (type === "listen_pick") {
    const distractors = allPhrases
      .filter((p) => p._id.toString() !== phrase._id.toString())
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((p) => p.translation);

    const options = shuffle([phrase.translation, ...distractors]);
    return {
      ...base,
      question: "Listen and choose the correct meaning",
      audioUrl: phrase.audioUrl,
      options,
    };
  }

  // fill_blank
  return {
    ...base,
    question: `Translate to English: "${phrase.text}"`,
  };
};

export const shuffle = <T>(arr: T[]): T[] => {
  return arr.sort(() => Math.random() - 0.5);
};

export const calculateQuizXP = (correct: number, total: number): number => {
  const base = correct * 10;
  const perfectBonus = correct === total ? 20 : 0;
  return base + perfectBonus;
};
