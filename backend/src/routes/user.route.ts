import express, { Router } from "express";

const router: Router = express.Router();

//Import Controller
import { getMe } from "controllers/user";

//Import middleware
import { requireSignin } from "middlewares/auth.middleware";
import { logger } from "../middlewares/logger.middleware";

router.get("/me", requireSignin, getMe);

logger({
  allowed: ["status", "host", "method", "protocol", "path"],
  log: process.env.NODE_ENV !== "production",
  // format: "[STATUS] [METHOD] [PATH] [TIME]",
});

export default router;
