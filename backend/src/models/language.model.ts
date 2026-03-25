import { ILanguage } from "../interfaces/language.interfaces";
import mongoose, { Schema } from "mongoose";

const languageModel = new Schema<ILanguage>(
  {
    code: {
      type: String,
      enum: ["yoruba", "igbo", "hausa"],
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    nativeName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    flagEmoji: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    totalPhrases: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model<ILanguage>("Language", languageModel);
