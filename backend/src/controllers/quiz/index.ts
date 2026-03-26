import { NextFunction, Request, Response } from "express";
import phraseModel from "../../models/phrase.model";
import userProgressModel from "../../models/user-progress.model";
import {
  buildQuestion,
  calculateQuizXP,
  getQuizType,
} from "../../services/quiz.service";
import { awardXP } from "../../services/xp.service";
import CustomException from "../../utils/handlers/error.handler";
import CustomResponse from "../../utils/handlers/response.handler";

/**
 * @route GET /api/quiz/:language?category=greetings&count=5
 * @desc Generate a quiz for a language
 * @access Public
 * @param req
 * @param res
 * @param next
 */
export const generateQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { language } = req.params;
    const { category, count = "5" } = req.query;

    const filter: Record<string, any> = { language, isActive: true };
    if (category) filter.category = category;

    const allPhrases = await phraseModel.find(filter);

    if (allPhrases.length < 4) {
      return next(
        new CustomException(400, "Not enough phrases to generate quiz", {
          success: false,
          path: "/quiz/:language?category=greetings&count=5",
        })
      );
    }

    // Shuffle and pick N phrases
    const shuffled = allPhrases.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(
      0,
      Math.min(Number(count), shuffled.length)
    );

    const questions: QuizQuestion[] = selected.map((phrase, index) => {
      const type = getQuizType(index);
      return buildQuestion(phrase, allPhrases, type);
    });

    // Strip correct answers before sending to client
    const sanitized = questions.map(({ correctAnswer: _ca, ...rest }) => rest);

    // Store correct answers in a short-lived way — encode them signed
    // For MVP simplicity, re-derive on submit. No server-side session needed.
    return new CustomResponse(res).success(
      "Quiz generated for selected language",
      {
        quizId: `${language}-${Date.now()}`,
        language,
        questions: sanitized,
        totalQuestions: sanitized.length,
      },
      200
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

/**
 * @route POST /api/quiz/submit
 * @desc Submit answers to quiz
 * @access Public
 * @param req
 * @param res
 * @param next
 */
export const submitQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;

    const { answers } = req.body as {
      answers: { phraseId: string; answer: string }[];
    };

    if (!answers || !Array.isArray(answers)) {
      return next(
        new CustomException(400, "answers array is required", {
          success: false,
          path: "/quiz/submit",
        })
      );
    }

    let correct = 0;

    const results: {
      phraseId: string;
      correct: boolean;
      correctAnswer: string;
    }[] = [];

    for (const { phraseId, answer } of answers) {
      const phrase = await phraseModel.findById(phraseId);
      if (!phrase) continue;

      const isCorrect =
        answer.trim().toLowerCase() === phrase.translation.trim().toLowerCase();

      if (isCorrect) correct++;

      results.push({
        phraseId,
        correct: isCorrect,
        correctAnswer: phrase.translation,
      });

      // Update progress record
      const score = isCorrect ? 100 : 0;
      await userProgressModel.findOneAndUpdate(
        { user: userId, phrase: phraseId },
        {
          $inc: { attempts: 1 },
          $set: {
            lastScore: score,
            ...(isCorrect && { completedAt: new Date() }),
          },
          $max: { bestScore: score },
        },
        { upsert: true }
      );
    }

    const percentage = Math.round((correct / answers.length) * 100);
    const xpEarned = calculateQuizXP(correct, answers.length);

    // Award XP and update streak
    const { totalXP, streak } = await awardXP(userId, xpEarned);

    return new CustomResponse(res).success(
      "Quiz submitted successfully!",
      {
        correct,
        total: answers.length,
        percentage,
        xpEarned,
        totalXP,
        streak,
        results,
        passed: percentage >= 60,
      },
      200
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
