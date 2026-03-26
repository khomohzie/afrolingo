import express, { Router } from "express";

const router: Router = express.Router();

//Import Controller
import {
  getLeaderboard,
  getProgressByLanguage,
  getUserStats,
} from "../controllers/progress";
import { requireSignin } from "../middlewares/auth.middleware";

router.get("/stats", requireSignin, getUserStats);
router.get("/leaderboard", requireSignin, getLeaderboard);
router.get("/:language", requireSignin, getProgressByLanguage);

//Import middleware
import { logger } from "../middlewares/logger.middleware";

logger({
  allowed: ["status", "host", "method", "protocol", "path"],
  log: process.env.NODE_ENV !== "production",
  // format: "[STATUS] [METHOD] [PATH] [TIME]",
});

export default router;
