import { IUserProgress } from "../interfaces/user.interfaces";
import mongoose, { Schema } from "mongoose";

const userProgressModel = new Schema<IUserProgress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    phrase: {
      type: Schema.Types.ObjectId,
      ref: "Phrase",
      required: true,
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    bestScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    voiceRecordings: [
      {
        score: { type: Number, min: 0, max: 100 },
        recordedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

// One progress record per user per phrase
userProgressModel.index({ user: 1, phrase: 1 }, { unique: true });

export default mongoose.model<IUserProgress>("UserProgress", userProgressModel);
