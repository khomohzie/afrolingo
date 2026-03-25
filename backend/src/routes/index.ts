import express, { Router } from "express";
import { default as authRoute } from "./auth.route";
import { default as userRoute } from "./user.route";
import { default as aiVoiceLabRoute } from "./ai_voice_lab.route";

const router: Router = express.Router();

router.use("/auth", authRoute);

router.use("/user", userRoute);

router.use("/ai", aiVoiceLabRoute);

export default router;
