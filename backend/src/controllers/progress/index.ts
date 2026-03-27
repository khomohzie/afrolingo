import { NextFunction, Request, Response } from "express";
import userProgressModel from "../../models/user-progress.model";
import userModel from "../../models/user.model";
import { calculateLevel, xpToNextLevel } from "../../services/xp.service";
import CustomException from "../../utils/handlers/error.handler";
import CustomResponse from "../../utils/handlers/response.handler";

/**
 * @route GET /api/progress/stats
 * @desc Overall stats for the logged-in user
 * @access Public
 * @param req
 * @param res
 * @param next
 */
export const getUserStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId);

    if (!user) {
      return next(
        new CustomException(404, "User not found", {
          success: false,
          path: "/progress/stats",
        })
      );
    }

    const totalCompleted = await userProgressModel.countDocuments({
      user: userId,
      completedAt: { $ne: null },
    });

    const totalAttempts = await userProgressModel.countDocuments({
      user: userId,
    });

    const avgScoreResult = await userProgressModel.aggregate([
      { $match: { user: user._id, lastScore: { $gt: 0 } } },
      { $group: { _id: null, avg: { $avg: "$lastScore" } } },
    ]);

    const avgScore = avgScoreResult[0]?.avg
      ? Math.round(avgScoreResult[0].avg)
      : 0;

    const { needed, level } = xpToNextLevel(user.xp);

    return new CustomResponse(res).success(
      "Retrieved overall stats for user",
      {
        xp: user.xp,
        level,
        xpToNextLevel: needed,
        streak: user.streak,
        lastPracticeDate: user.lastPracticeDate,
        selectedLanguage: user.selectedLanguage,
        totalCompleted,
        totalAttempts,
        avgScore,
      },
      200
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

/**
 * @route GET /api/progress/:language
 * @desc Progress breakdown per language
 * @access Public
 * @param req
 * @param res
 * @param next
 */
export const getProgressByLanguage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const { language } = req.params;

    const progress = await userProgressModel
      .find({ user: userId })
      .populate({
        path: "phrase",
        match: { language },
        select: "text translation category difficulty",
      })
      .sort({ updatedAt: -1 });

    // Filter out nulls (populate returns null for non-matching phrases)
    const filtered = progress.filter((p) => p.phrase !== null);

    return new CustomResponse(res).success(
      "Retrieved progress breakdown per language",
      {
        language,
        progress: filtered,
      },
      200
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

/**
 * @route GET /api/progress/leaderboard
 * @desc Top 10 users by XP
 * @access Public
 * @param req
 * @param res
 * @param next
 */
export const getLeaderboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userModel
      .find({ xp: { $gt: 0 } })
      .select("_id name email xp streak selectedLanguage")
      .sort({ xp: -1 })
      .limit(10);

    const leaderboard = users.map((u, index) => ({
      id: u._id,
      rank: index + 1,
      name: u.name,
      email: u.email,
      xp: u.xp,
      level: calculateLevel(u.xp),
      streak: u.streak,
      language: u.selectedLanguage,
    }));

    return new CustomResponse(res).success(
      "Leaderboard retrieved!",
      leaderboard,
      200
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
