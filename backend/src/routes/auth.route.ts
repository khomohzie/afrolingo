import express, { Router } from "express";

const router: Router = express.Router();

//Import Controller
import { login, selectLanguage, signup } from "../controllers/auth";
import { requireSignin } from "../middlewares/auth.middleware";

router.post("/signup", signup);
router.post("/login", login);

router.patch("/onboarding", requireSignin, selectLanguage);

//Import middleware
import { logger } from "../middlewares/logger.middleware";

logger({
  allowed: ["status", "host", "method", "protocol", "path"],
  log: process.env.NODE_ENV !== "production",
  // format: "[STATUS] [METHOD] [PATH] [TIME]",
});

export default router;
