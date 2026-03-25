import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "@config/jwt.config";
import { generate } from "@utils/auth.util";
import CustomException from "@utils/handlers/error.handler";
import CustomResponse from "@utils/handlers/response.handler";
import { NextFunction, Request, Response } from "express";
import userModel from "models/user.model";

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new CustomException(400, "Please provide email and password", {
          success: false,
          path: "/auth/login",
        })
      );
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return next(
        new CustomException(401, "Invalid email or password", {
          success: false,
          path: "/auth/login",
        })
      );
    }

    // Generate the JWT tokens
    const { accessToken, refreshToken } = await generate(user);

    // Send Access Token in Cookie
    res.cookie("access_token", accessToken, accessTokenCookieOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);

    return new CustomResponse(res).success(
      "Welcome back!",
      {
        accessToken,
        refreshToken,
        user,
      },
      200,
      {
        type: "success",
        action: "Login",
      }
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export default login;
