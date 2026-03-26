import express, { Router } from "express";

const router: Router = express.Router();

//Import Controller
import { getLanguages, getLessonsByLanguage } from "../controllers/lesson";
import { requireSignin } from "../middlewares/auth.middleware";

router.get("/languages", getLanguages);
router.get("/:language", requireSignin, getLessonsByLanguage);

//Import middleware
import { logger } from "../middlewares/logger.middleware";

logger({
  allowed: ["status", "host", "method", "protocol", "path"],
  log: process.env.NODE_ENV !== "production",
  // format: "[STATUS] [METHOD] [PATH] [TIME]",
});

export default router;
