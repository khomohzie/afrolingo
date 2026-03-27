import express, { Router } from "express";

const router: Router = express.Router();

//Import Controller
import {
  completePhrase,
  getLanguages,
  getLessonsByLanguage,
  getPhrase,
  submitPhraseForAudio,
} from "../controllers/lesson";
import { requireSignin } from "../middlewares/auth.middleware";

router.get("/languages", getLanguages);
router.get("/:language", requireSignin, getLessonsByLanguage);

router.get("/phrase/:phraseId", requireSignin, getPhrase);
router.post("/phrase/:phraseId/complete", requireSignin, completePhrase);
router.post("/phrase", requireSignin, submitPhraseForAudio);

//Import middleware
import { logger } from "../middlewares/logger.middleware";

logger({
  allowed: ["status", "host", "method", "protocol", "path"],
  log: process.env.NODE_ENV !== "production",
  // format: "[STATUS] [METHOD] [PATH] [TIME]",
});

export default router;
