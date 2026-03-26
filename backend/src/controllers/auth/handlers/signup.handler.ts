import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../../../config/jwt.config";
import { generate } from "../../../utils/auth.util";
import CustomException from "../../../utils/handlers/error.handler";
import CustomResponse from "../../../utils/handlers/response.handler";
import { NextFunction, Request, Response } from "express";
import languageModel from "../../../models/language.model";
import userModel from "../../../models/user.model";

/**
 * @route POST /api/auth/signup
 * @desc Register a new user with email
 * @access Public
 * @param req
 * @param res
 * @param next
 */

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(
        new CustomException(400, "Please provide name, email and password", {
          success: false,
          path: "/auth/signup",
        })
      );
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return next(
        new CustomException(400, "Email already registered", {
          success: false,
          path: "/auth/signup",
        })
      );
    }

    const user = await userModel.create({
      name,
      email,
      password,
    });

    // Create the Access and refresh Tokens
    const { accessToken, refreshToken } = await generate(user);

    // Send Access Token in Cookie
    res.cookie("access_token", accessToken, accessTokenCookieOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);

    return new CustomResponse(res).success(
      "Signup successful",
      {
        accessToken,
        refreshToken,
        user,
      },
      200
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

/**
 * @route PATCH /api/auth/onboarding
 * @desc Onboard a new user
 * @access Public
 * @param req
 * @param res
 * @param next
 */

const selectLanguage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { language } = req.body;

    const validLanguages = ["yoruba", "igbo", "hausa"];

    if (!validLanguages.includes(language)) {
      return next(
        new CustomException(
          400,
          "Invalid language. Choose yoruba, igbo, or hausa",
          {
            success: false,
            path: "/auth/onboarding",
          }
        )
      );
    }

    // Check language is active in DB
    const lang = await languageModel.findOne({
      code: language,
      isActive: true,
    });

    if (!lang) {
      return next(
        new CustomException(404, "Language not available yet", {
          success: false,
          path: "/auth/onboarding",
        })
      );
    }

    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      { selectedLanguage: language },
      { new: true }
    );

    return new CustomResponse(res).success(
      `Language set to ${lang.name}`,
      {
        user,
      },
      200
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export { signup, selectLanguage };
