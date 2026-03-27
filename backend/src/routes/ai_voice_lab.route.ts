import express, { Router } from "express";
import { audioUpload } from "../config/audioupload";

const router: Router = express.Router();

//Import Controller
import {
  cacheAudio,
  cacheAudioAll,
  getPhraseHistory,
  getVoiceLabPhrase,
  getVoiceLabSummary,
  scorePhraseRecording,
} from "../controllers/ai_voice_lab";

import { requireSignin } from "../middlewares/auth.middleware";

router.post("/cacheAudio", cacheAudio);
router.post("/cacheAudioAll", cacheAudioAll);

router.get("/summary", requireSignin, getVoiceLabSummary);
router.get("/phrase/:phraseId", requireSignin, getVoiceLabPhrase);
router.get("/history/:phraseId", requireSignin, getPhraseHistory);
router.post(
  "/score/:phraseId",
  requireSignin,
  audioUpload.single("audio"),
  scorePhraseRecording
);

//Import middleware
import { logger } from "../middlewares/logger.middleware";

logger({
  allowed: ["status", "host", "method", "protocol", "path"],
  log: process.env.NODE_ENV !== "production",
  // format: "[STATUS] [METHOD] [PATH] [TIME]",
});

export default router;
