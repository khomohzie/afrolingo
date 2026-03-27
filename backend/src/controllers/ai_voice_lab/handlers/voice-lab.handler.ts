import { Request, Response, NextFunction } from "express";
import phraseModel from "../../../models/phrase.model";
import CustomException from "../../../utils/handlers/error.handler";
import { cacheAudioForPhrase } from "../../../services/yarngpt.service";
import userProgressModel from "../../../models/user-progress.model";
import CustomResponse from "../../../utils/handlers/response.handler";
import { scorePronunciation } from "../../../services/pronunciation.service";
import { awardXP, calculateVoiceXP } from "../../../services/xp.service";

/**
 * @route GET /api/ai/phrase/:phraseId
 * @desc Returns phrase + ensures native audio is cached before the user records
 * @access Public
 * @param req
 * @param res
 * @param next
 */
export const getVoiceLabPhrase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const phraseId = req.params.phraseId as string;
    const userId = req.user.id;

    const phrase = await phraseModel.findById(phraseId);

    if (!phrase) {
      return next(
        new CustomException(404, "Phrase not found", {
          success: false,
          path: "/ai/phrase/:phraseId",
        })
      );
    }

    // Ensure native audio is cached. Generate if missing
    if (!phrase.audioUrl) {
      console.log(`Generating audio on demand for phrase: ${phrase.text}`);

      const url = await cacheAudioForPhrase({ phraseId: phraseId });

      if (url) {
        phrase.audioUrl = url;

        await phrase.save();
      }
    }

    const freshPhrase = await phraseModel.findById(phraseId);

    // Fetch existing attempts for this phrase
    const progress = await userProgressModel.findOne({
      user: userId,
      phrase: phraseId,
    });

    return new CustomResponse(res).success(
      "Phrase details retrieved successfully!",
      {
        phrase: freshPhrase,
        nativeAudioUrl: freshPhrase?.audioUrl ?? null,
        previousAttempts: progress?.voiceRecordings?.slice(-5) ?? [], // last 5 attempts
        bestScore: progress?.bestScore ?? null,
      },
      200
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

/**
 * @route POST /api/ai/score/:phraseId
 * @desc Accepts audio file, scores it, returns detailed feedback. Frontend sends: multipart/form-data with field "audio"
 * @access Public
 * @param req
 * @param res
 * @param next
 */
export const scorePhraseRecording = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const phraseId = req.params.phraseId as string;
    const userId = req.user.id;

    if (!req.file) {
      return next(
        new CustomException(400, "Audio file is required", {
          success: false,
          path: "/ai/score/:phraseId",
        })
      );
    }

    const phrase = await phraseModel.findById(phraseId);
    if (!phrase) {
      return next(
        new CustomException(404, "Phrase not found", {
          success: false,
          path: "/ai/score/:phraseId",
        })
      );
    }

    if (!phrase.audioUrl) {
      return next(
        new CustomException(
          400,
          "Native audio not yet generated for this phrase. Try again in a moment.",
          {
            success: false,
            path: "/ai/score/:phraseId",
          }
        )
      );
    }

    // Score the pronunciation
    const score = await scorePronunciation(
      req.file.buffer,
      phrase.audioUrl,
      phrase.language,
      phrase.text
    );

    // Save progress record for history/tracking
    const progress = await userProgressModel.findOneAndUpdate(
      { user: userId, phrase: phraseId },
      {
        $inc: { attempts: 1 },
        $set: {
          lastScore: score.overall,
          ...(score.overall >= 60 && { completedAt: new Date() }),
        },
        $max: { bestScore: score.overall },
        $push: {
          voiceRecordings: {
            score: score.overall,
            recordedAt: new Date(),
          },
        },
      },
      { upsert: true, new: true }
    );

    // Award XP based on score (only if they passed)
    let xpEarned = 0;
    let totalXP = 0;
    let streak = 0;

    if (score.overall >= 60) {
      xpEarned = calculateVoiceXP(score.overall);
      const xpResult = await awardXP(userId, xpEarned);
      totalXP = xpResult.totalXP;
      streak = xpResult.streak;
    }

    return new CustomResponse(res).success(
      "Phrase recording has been scored",
      {
        score,
        // aiFeedback,
        xpEarned,
        totalXP,
        streak,
        passed: score.overall >= 60,
        attempts: progress?.attempts ?? 1,
        bestScore: progress?.bestScore ?? score.overall,
        lastScore: progress?.lastScore ?? score.overall,
        phraseText: phrase.text,
        translation: phrase.translation,
        toneNotes: phrase.toneNotes,
        nativeAudioUrl: phrase.audioUrl,
      },
      200
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

/**
 * @route GET /api/ai/history/:phraseId
 * @desc Returns score history for a phrase — powers the progress graph on the UI
 * @access Public
 * @param req
 * @param res
 * @param next
 */
export const getPhraseHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const phraseId = req.params.phraseId as string;
    const userId = req.user.id;

    const progress = await userProgressModel
      .findOne({
        user: userId,
        phrase: phraseId,
      })
      .populate("phrase", "text translation language");

    if (!progress) {
      return new CustomResponse(res).success(
        "Success!",
        { attempts: 0, bestScore: 0, history: [] },
        200
      );
    }

    return new CustomResponse(res).success(
      "Success!",
      {
        attempts: progress.attempts,
        bestScore: progress.bestScore,
        lastScore: progress.lastScore,
        history: progress.voiceRecordings,
        phrase: progress.phrase,
      },
      200
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

/**
 * @route GET /api/ai/summary
 * @desc All-time voice lab stats for the current user
 * @access Public
 * @param req
 * @param res
 * @param next
 */
export const getVoiceLabSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;

    const allProgress = await userProgressModel
      .find({
        user: userId,
        attempts: { $gt: 0 },
      })
      .populate("phrase", "text translation language category");

    const totalRecordings = allProgress.reduce(
      (sum, p) => sum + (p.voiceRecordings?.length ?? 0),
      0
    );

    const avgBestScore =
      allProgress.length > 0
        ? Math.round(
            allProgress.reduce((sum, p) => sum + p.bestScore, 0) /
              allProgress.length
          )
        : 0;

    const perfectScores = allProgress.filter((p) => p.bestScore >= 85).length;

    // Most improved: highest (bestScore - firstScore)
    const mostImproved = allProgress
      .filter((p) => p.voiceRecordings.length >= 2)
      .map((p) => ({
        phrase: p.phrase,
        improvement: p.bestScore - (p.voiceRecordings[0]?.score ?? 0),
      }))
      .sort((a, b) => b.improvement - a.improvement)
      .slice(0, 3);

    return new CustomResponse(res).success(
      "All-time voice lab stats retrieved!",
      {
        totalRecordings,
        avgBestScore,
        perfectScores,
        phrasesAttempted: allProgress.length,
        mostImproved,
      },
      200
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
