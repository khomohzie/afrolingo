import userModel from "../../../models/user.model";
import CustomException from "../../../utils/handlers/error.handler";
import CustomResponse from "../../../utils/handlers/response.handler";
import { NextFunction, Request, Response } from "express";

/**
 * @route GET /api/user/me
 * @desc Retrieve logged in user's profile
 * @access Public
 */

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return next(
        new CustomException(404, "User not found", {
          status: false,
          path: "get logged in user /api/user/me",
        }),
      );
    }

    return new CustomResponse(res).success(
      "User retrieved successfully",
      user,
      200,
      {
        success: true,
        path: "get logged in user /api/user/me",
      },
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export { getMe };
