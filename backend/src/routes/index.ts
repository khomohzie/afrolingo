import express, { Router } from "express";
import { default as authRoute } from "./auth.route";

const router: Router = express.Router();

router.use(
  "/auth",
  authRoute
);

export default router;
