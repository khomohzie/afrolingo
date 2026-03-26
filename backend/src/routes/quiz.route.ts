import express, { Router } from "express";

const router: Router = express.Router();

//Import Controller
import { generateQuiz, submitQuiz } from "../controllers/quiz";
import { requireSignin } from "../middlewares/auth.middleware";

router.get("/:language", requireSignin, generateQuiz);
router.post("/submit", requireSignin, submitQuiz);

//Import middleware
import { logger } from "../middlewares/logger.middleware";

logger({
  allowed: ["status", "host", "method", "protocol", "path"],
  log: process.env.NODE_ENV !== "production",
  // format: "[STATUS] [METHOD] [PATH] [TIME]",
});

export default router;
