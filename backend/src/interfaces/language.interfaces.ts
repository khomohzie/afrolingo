import mongoose, { Document } from "mongoose";

export interface ILanguage extends Document {
  _id: mongoose.Types.ObjectId;
  code: "yoruba" | "igbo" | "hausa";
  name: string;
  nativeName: string;
  description: string;
  flagEmoji: string;
  isActive: boolean;
  totalPhrases: number;
}

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type PhraseCategory =
  | "greetings"
  | "numbers"
  | "family"
  | "food"
  | "directions"
  | "emotions"
  | "everyday"
  | "custom";

export interface IPhrase extends Document {
  _id: mongoose.Types.ObjectId;
  createdBy?: mongoose.Types.ObjectId;
  language: "yoruba" | "igbo" | "hausa";
  text: string; // e.g. "Ẹ káàárọ̀"
  translation: string; // e.g. "Good morning"
  romanization: string; // pronunciation guide
  audioUrl: string | null; // cached YarnGPT audio
  category: PhraseCategory;
  difficulty: DifficultyLevel;
  toneNotes: string; // e.g. "rising tone on 'ká'"
  orderIndex: number; // lesson ordering
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
