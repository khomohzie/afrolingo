import express, { Router } from "express";

const router: Router = express.Router();

//Import Controller
import { initiatePayment, verifyPayment } from "../controllers/subscription";
import { requireSignin } from "../middlewares/auth.middleware";

router.post("/initiate", requireSignin, initiatePayment);
router.post("/verify", requireSignin, verifyPayment);

//Import middleware
import { logger } from "../middlewares/logger.middleware";

logger({
  allowed: ["status", "host", "method", "protocol", "path"],
  log: process.env.NODE_ENV !== "production",
  // format: "[STATUS] [METHOD] [PATH] [TIME]",
});

export default router;
