import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  selectedLanguage: "yoruba" | "igbo" | "hausa" | null;
  xp: number;
  streak: number;
  lastPracticeDate: Date | null;
  isPremium?: boolean;
  premiumExpiresAt?: Date;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserProgress extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  phrase: mongoose.Types.ObjectId;
  attempts: number;
  bestScore: number; // 0-100 pronunciation score
  lastScore: number;
  completedAt: Date | null;
  voiceRecordings: {
    score: number;
    recordedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IXPResult {
  totalXP: number;
  streak: number;
  streakUpdated: boolean;
  levelUp: boolean;
  newLevel: number;
}

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  txnRef: string;
  amount: number;
  status: "pending" | "success" | "failed";
  currency: number;
  paidAt?: Date;
}
