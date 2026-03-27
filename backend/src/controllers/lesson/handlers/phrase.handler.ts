import { NextFunction, Request, Response } from "express";
import phraseModel from "../../../models/phrase.model";
import userProgressModel from "../../../models/user-progress.model";
import CustomException from "../../../utils/handlers/error.handler";
import CustomResponse from "../../../utils/handlers/response.handler";
import { cacheAudioForPhrase } from "../../../services/yarngpt.service";
import { translateText } from "../../../services/translation.service";
import { cloudinaryDelete } from "../../../utils/cloudinary";

/**
 * @route GET /api/lessons/phrase/:phraseId
 * @desc Retrieve a particular phrase by id with user's progress
 * @access Public
 * @param req
 * @param res
 * @param next
 */
export const getPhrase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const phraseId = req.params.phraseId as string | undefined;
    const userId = req.user.id;

    if (!phraseId) {
      return next(
        new CustomException(400, "phraseId params is required", {
          success: false,
          path: "/lessons/phrase/:phraseId",
        })
      );
    }

    const phrase = await phraseModel.findById(phraseId);

    if (!phrase) {
      return next(
        new CustomException(404, "Phrase not found", {
          success: false,
          path: "/lessons/phrase/:phraseId",
        })
      );
    }

    const progress = await userProgressModel.findOne({
      user: userId,
      phrase: phraseId,
    });

    return new CustomResponse(res).success(
      "Phrase retrieved!",
      { phrase, userProgress: progress || null },
      200
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

/**
 * @route POST /api/lessons/phrase/:phraseId/complete
 * @desc Called after user listens and marks a phrase as learned (no voice scoring)
 * @access Public
 * @param req
 * @param res
 * @param next
 */
export const completePhrase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const phraseId = req.params.phraseId as string | undefined;
    const userId = req.user.id;

    if (!phraseId) {
      return next(
        new CustomException(400, "phraseId params is required", {
          success: false,
          path: "/lessons/phrase/:phraseId",
        })
      );
    }

    const phrase = await phraseModel.findById(phraseId);

    if (!phrase) {
      return next(
        new CustomException(404, "Phrase not found", {
          success: false,
          path: "/lessons/phrase/:phraseId",
        })
      );
    }

    const progress = await userProgressModel.findOneAndUpdate(
      { user: userId, phrase: phraseId },
      {
        $inc: { attempts: 1 },
        $set: { completedAt: new Date(), lastScore: 100 },
        $max: { bestScore: 100 },
      },
      { upsert: true, new: true }
    );

    return new CustomResponse(res).success("Phrase completed", progress, 200);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

/**
 * @route POST /api/lessons/phrase
 * @desc Allows a user to submit a new phrase so they can get the audio speech
 * @access Public
 * @param req
 * @param res
 * @param next
 */
export const submitPhraseForAudio = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;

    const { text, language } = req.body;

    if (!userId) {
      return next(
        new CustomException(401, "userId is required", {
          success: false,
          path: "/lessons/phrase",
        })
      );
    }

    if (!text) {
      return next(
        new CustomException(400, "text is required", {
          success: false,
          path: "/lessons/phrase",
        })
      );
    }

    const result = await translateText(
      text,
      language as "yoruba" | "igbo" | "hausa"
    );

    const url = await cacheAudioForPhrase({
      phraseText: language === "yoruba" ? result.amiOhun : text,
      language: language,
    });

    if (!url) {
      return next(
        new CustomException(500, "Failed to retrieve audio url", {
          success: false,
          path: "/lessons/phrase",
        })
      );
    }

    const newPhrase = new phraseModel({
      createdBy: userId,
      language: language,
      text: language === "yoruba" ? result.amiOhun : text,
      translation: result.english,
      audioUrl: url,
      category: "custom",
    });

    await newPhrase.save();

    return new CustomResponse(res).success(
      "Speech generation successful!",
      url,
      200
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

/**
 * @route GET /api/lessons/phrase/custom/history
 * @desc Retrieve current user's custom generated phrases
 * @access Public
 * @param req
 * @param res
 * @param next
 */
export const getCustomPhraseHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const language = req.query.language as string | undefined;
    const validLanguages = ["yoruba", "igbo", "hausa"];

    const query: Record<string, any> = {
      createdBy: userId,
      category: "custom",
      isActive: true,
    };

    if (language) {
      if (!validLanguages.includes(language)) {
        return next(
          new CustomException(400, "Invalid language", {
            success: false,
            path: "/lessons/phrase/custom/history",
          })
        );
      }

      query.language = language;
    }

    const phrases = await phraseModel
      .find(query)
      .sort({ createdAt: -1 })
      .select("text translation audioUrl language category createdAt");

    return new CustomResponse(res).success(
      "Custom phrase history retrieved!",
      phrases,
      200
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

/**
 * @route DELETE /api/lessons/phrase/custom/:id
 * @desc Soft delete a specific custom phrase
 * @access Public
 * @param req
 * @param res
 * @param next
 */
export const deleteCustomPhrase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const phraseId = req.params.id;

    const phrase = await phraseModel.findOne({
      _id: phraseId,
      createdBy: userId,
      category: "custom",
    });

    if (!phrase) {
      return next(
        new CustomException(404, "Phrase not found or already deleted", {
          success: false,
          path: "/lessons/phrase/custom/:id",
        })
      );
    }

    // Delete audio from Cloudinary
    if (phrase.audioUrl) {
      try {
        await cloudinaryDelete(phrase.audioUrl);
      } catch (err) {
        console.error("Cloudinary delete error:", err);
      }
    }

    await phrase.deleteOne();

    return new CustomResponse(res).success(
      "Custom phrase deleted successfully!",
      {},
      200
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

/**
 * @route DELETE /api/lessons/phrase/custom
 * @desc Soft delete all custom phrases for current user
 * @access Public
 * @param req
 * @param res
 * @param next
 */
export const deleteAllCustomPhrases = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;

    const phrases = await phraseModel.find({
      createdBy: userId,
      category: "custom",
    });

    if (!phrases.length) {
      return new CustomResponse(res).success(
        "No active custom phrases to delete",
        [],
        200
      );
    }

    // Delete all Cloudinary audio files
    const deletePromises = phrases
      .filter((p) => p.audioUrl)
      .map((p) => {
        if (p.audioUrl) {
          return cloudinaryDelete(p.audioUrl).catch((err) => {
            console.error("Cloudinary delete error:", err);
          });
        }
      });

    await Promise.all(deletePromises);

    await phraseModel.deleteMany({
      createdBy: userId,
      category: "custom",
    });

    return new CustomResponse(res).success(
      "All custom phrases deleted successfully!",
      null,
      200
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
