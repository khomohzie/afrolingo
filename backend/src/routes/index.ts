import express, { Router } from "express";
import { default as authRoute } from "./auth.route";
import { default as userRoute } from "./user.route";

const router: Router = express.Router();

router.use("/auth", authRoute);

router.use("/user", userRoute);

export default router;
