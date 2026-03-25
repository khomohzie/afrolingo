import { IPhrase } from "interfaces/language.interfaces";
import mongoose, { Schema } from "mongoose";

const phraseModel = new Schema<IPhrase>(
  {
    language: {
      type: String,
      enum: ["yoruba", "igbo", "hausa"],
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: [true, "Phrase text is required"],
      trim: true,
    },
    translation: {
      type: String,
      required: [true, "Translation is required"],
      trim: true,
    },
    romanization: {
      type: String,
      default: "",
    },
    audioUrl: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      enum: [
        "greetings",
        "numbers",
        "family",
        "food",
        "directions",
        "emotions",
        "everyday",
      ],
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
      index: true,
    },
    toneNotes: {
      type: String,
      default: "",
    },
    orderIndex: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Compound index for efficient lesson queries
phraseModel.index({ language: 1, category: 1, difficulty: 1, orderIndex: 1 });

export default mongoose.model<IPhrase>("Phrase", phraseModel);
