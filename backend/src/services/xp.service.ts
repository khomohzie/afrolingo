import { IXPResult } from "../interfaces/user.interfaces";
import userModel from "../models/user.model";

/**
 * Award XP to a user and update their streak.
 * Call this after any completed lesson or quiz.
 */
export const awardXP = async (
  userId: string,
  xp: number
): Promise<IXPResult> => {
  const user = await userModel.findById(userId);
  if (!user) throw new Error("User not found");

  const now = new Date();
  const today = startOfDay(now);

  let streakUpdated = false;
  let newStreak = user.streak;

  if (user.lastPracticeDate) {
    const lastDay = startOfDay(user.lastPracticeDate);
    const daysDiff = Math.floor(
      (today.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 0) {
      // Already practiced today — no streak change
    } else if (daysDiff === 1) {
      // Practiced yesterday — extend streak
      newStreak = user.streak + 1;
      streakUpdated = true;
    } else {
      // Missed a day — reset streak
      newStreak = 1;
      streakUpdated = true;
    }
  } else {
    // First time practicing
    newStreak = 1;
    streakUpdated = true;
  }

  const oldLevel = calculateLevel(user.xp);
  const newXP = user.xp + xp;
  const newLevel = calculateLevel(newXP);
  const levelUp = newLevel > oldLevel;

  user.xp = newXP;
  user.streak = newStreak;
  user.lastPracticeDate = now;
  await user.save();

  return {
    totalXP: newXP,
    streak: newStreak,
    streakUpdated,
    levelUp,
    newLevel,
  };
};

/**
 * XP thresholds per level.
 * Level 1: 0-99 XP
 * Level 2: 100-249 XP
 * Level 3: 250-499 XP ... and so on
 */
export const calculateLevel = (xp: number): number => {
  if (xp < 100) return 1;
  if (xp < 250) return 2;
  if (xp < 500) return 3;
  if (xp < 1000) return 4;
  if (xp < 2000) return 5;
  if (xp < 3500) return 6;
  if (xp < 5000) return 7;
  if (xp < 7500) return 8;
  if (xp < 10000) return 9;
  return 10;
};

export const xpToNextLevel = (
  xp: number
): { current: number; needed: number; level: number } => {
  const thresholds = [
    0,
    100,
    250,
    500,
    1000,
    2000,
    3500,
    5000,
    7500,
    10000,
    Infinity,
  ];
  const level = calculateLevel(xp);
  const needed = thresholds[level] - xp;
  return { current: xp, needed: Math.max(0, needed), level };
};

const startOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};
