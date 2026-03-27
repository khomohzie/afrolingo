import express, { Router } from "express";

const router: Router = express.Router();

//Import Controller
import {
  completePhrase,
  deleteAllCustomPhrases,
  deleteCustomPhrase,
  getCustomPhraseHistory,
  getLanguages,
  getLessonsByLanguage,
  getPhrase,
  submitPhraseForAudio,
} from "../controllers/lesson";
import { requireSignin } from "../middlewares/auth.middleware";

router.get("/languages", getLanguages);
router.get("/:language", requireSignin, getLessonsByLanguage);

router.get("/phrase/:phraseId", requireSignin, getPhrase);
router.get("/phrase/custom/history", requireSignin, getCustomPhraseHistory);
router.post("/phrase/:phraseId/complete", requireSignin, completePhrase);
router.post("/phrase", requireSignin, submitPhraseForAudio);

router.delete("/phrase/custom/:id", requireSignin, deleteCustomPhrase);
router.delete("/phrase/custom", requireSignin, deleteAllCustomPhrases);

//Import middleware
import { logger } from "../middlewares/logger.middleware";

logger({
  allowed: ["status", "host", "method", "protocol", "path"],
  log: process.env.NODE_ENV !== "production",
  // format: "[STATUS] [METHOD] [PATH] [TIME]",
});

export default router;
