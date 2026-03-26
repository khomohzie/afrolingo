import express, { Router } from "express";
import { default as authRoute } from "./auth.route";
import { default as userRoute } from "./user.route";
import { default as aiVoiceLabRoute } from "./ai_voice_lab.route";
import { default as lessonRoute } from "./lesson.route";
import { default as progressRoute } from "./progress.route";
import { default as quizRoute } from "./quiz.route";

const router: Router = express.Router();

router.use("/auth", authRoute);

router.use("/user", userRoute);

router.use("/ai", aiVoiceLabRoute);

router.use("/lessons", lessonRoute);

router.use("/progress", progressRoute);

router.use("/quiz", quizRoute);

export default router;
