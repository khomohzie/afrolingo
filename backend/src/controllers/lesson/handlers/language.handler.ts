import { NextFunction, Request, Response } from "express";
import languageModel from "../../../models/language.model";
import phraseModel from "../../../models/phrase.model";
import userProgressModel from "../../../models/user-progress.model";
import CustomException from "../../../utils/handlers/error.handler";
import CustomResponse from "../../../utils/handlers/response.handler";

/**
 * @route GET /api/lessons/languages
 * @desc Retrieve all languages
 * @access Public
 * @param req
 * @param res
 * @param next
 */
export const getLanguages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const languages = await languageModel.find({ isActive: true }).sort("name");

    return new CustomResponse(res).success(
      "Languages retrieved!",
      languages,
      200
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

/**
 * @route GET /api/lessons/:language
 * @desc Returns phrases grouped by category with user progress attached
 * @access Public
 * @param req
 * @param res
 * @param next
 */
export const getLessonsByLanguage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const language = req.params.language as string | undefined;
    const userId = req.user.id;

    if (!language) {
      return next(
        new CustomException(400, "language params is required", {
          success: false,
          path: "/lessons/:language",
        })
      );
    }

    const validLanguages = ["yoruba", "igbo", "hausa"];

    if (!validLanguages.includes(language)) {
      return next(
        new CustomException(400, "Invalid language", {
          success: false,
          path: "/auth/signup",
        })
      );
    }

    const phrases = await phraseModel
      .find({ language, isActive: true })
      .sort("orderIndex");

    // Get user progress for all these phrases in one query
    const phraseIds = phrases.map((p) => p._id);

    const progressRecords = await userProgressModel.find({
      user: userId,
      phrase: { $in: phraseIds },
    });

    const progressMap = new Map(
      progressRecords.map((p) => [p.phrase.toString(), p])
    );

    // Attach progress to each phrase and group by category
    const grouped: Record<string, any[]> = {};

    for (const phrase of phrases) {
      const progress = progressMap.get(phrase._id.toString());

      const phraseWithProgress = {
        ...phrase.toObject(),
        userProgress: progress
          ? {
              attempts: progress.attempts,
              bestScore: progress.bestScore,
              lastScore: progress.lastScore,
              completed: progress.completedAt !== null,
            }
          : null,
      };

      if (!grouped[phrase.category]) {
        grouped[phrase.category] = [];
      }

      grouped[phrase.category].push(phraseWithProgress);
    }

    // Build lesson modules (each category = one module)
    const modules = Object.entries(grouped).map(([category, items]) => {
      const completed = items.filter((p) => p.userProgress?.completed).length;

      return {
        category,
        totalPhrases: items.length,
        completedPhrases: completed,
        isUnlocked: true, // for MVP all unlocked; I will add logic later
        phrases: items,
      };
    });

    return new CustomResponse(res).success(
      "Retrieved user progress for all phrases in selected language",
      {
        language,
        modules,
      },
      200
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
