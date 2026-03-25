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
