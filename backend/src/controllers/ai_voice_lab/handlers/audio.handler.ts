import CustomException from "@utils/handlers/error.handler";
import CustomResponse from "@utils/handlers/response.handler";
import { NextFunction, Request, Response } from "express";
import { batchCacheAudio, cacheAudioForPhrase } from "services/yarngpt.service";

/**
 * @route POST /api/ai/cacheAudioAll
 * @desc Batch-cache AI audio for all phrases
 * @access Public
 */

const cacheAudioAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { language } = req.body;

    if (!language) {
      return next(
        new CustomException(400, "Please provide a language.", {
          success: false,
          path: "/ai/cacheAudioAll",
        }),
      );
    }

    const result = await batchCacheAudio(language);

    return new CustomResponse(res).success(
      "All audio cached!",
      {
        success: result.success,
        failed: result.failed,
      },
      200,
      {
        type: "success",
        action: "Batch Cache Audio",
      },
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

/**
 * @route POST /api/ai/cacheAudio
 * @desc Cache AI audio for a phrase
 * @access Public
 */
const cacheAudio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phraseId } = req.body;

    if (!phraseId) {
      return next(
        new CustomException(400, "Please provide a phraseId.", {
          success: false,
          path: "/ai/cacheAudio",
        }),
      );
    }

    const url = await cacheAudioForPhrase(phraseId);

    if (!url) {
      return next(
        new CustomException(500, "Failed to retrieve audio url", {
          success: false,
          path: "/ai/cacheAudio",
        }),
      );
    }

    return new CustomResponse(res).success("Audio cached!", url, 200, {
      type: "success",
      action: "Cache Audio",
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export { cacheAudio, cacheAudioAll };
