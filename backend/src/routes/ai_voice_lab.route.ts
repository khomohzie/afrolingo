import express, { Router } from "express";

const router: Router = express.Router();

//Import Controller
import { cacheAudio, cacheAudioAll } from "../controllers/ai_voice_lab";

router.post("/cacheAudio", cacheAudio);
router.post("/cacheAudioAll", cacheAudioAll);

//Import middleware
import { logger } from "../middlewares/logger.middleware";

logger({
  allowed: ["status", "host", "method", "protocol", "path"],
  log: process.env.NODE_ENV !== "production",
  // format: "[STATUS] [METHOD] [PATH] [TIME]",
});

export default router;
