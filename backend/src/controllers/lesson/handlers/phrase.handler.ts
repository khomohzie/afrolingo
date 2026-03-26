import { NextFunction, Request, Response } from "express";
import phraseModel from "../../../models/phrase.model";
import userProgressModel from "../../../models/user-progress.model";
import CustomException from "../../../utils/handlers/error.handler";
import CustomResponse from "../../../utils/handlers/response.handler";

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
