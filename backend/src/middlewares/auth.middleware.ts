import { decode } from "../utils/auth.util";
import CustomException from "../utils/handlers/error.handler";
import { NextFunction, Request, Response } from "express";
import userModel from "../models/user.model";

export const requireSignin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];

      const data = await decode.accessToken(token);

      if (!data) {
        return next(new CustomException(401, "An error occurred."));
      }

      if (
        data?.name == "TokenExpiredError" ||
        data?.message == "jwt expired" ||
        new Date(data?.expiredAt).getTime() < new Date().getTime()
      ) {
        return next(
          new CustomException(401, "Access expired. Please log in to continue.")
        );
      }

      const userExists = await userModel
        .findOne({
          _id: data?.id,
          $or: [
            { deletedAt: null }, // Check if deletedAt is null
            { deletedAt: "" }, // Check if deletedAt is an empty string
          ],
        })
        .exec();

      if (userExists) {
        req.user = data!;
        next();
      } else {
        return next(
          new CustomException(401, "User does not exist! Please signup.", {
            reason: "account not found",
            alias: "acc_not_found",
            code: "ACC_ERR_01",
          })
        );
      }
    } catch (error: any) {
      return next(
        new CustomException(
          error?.status,
          "Token not provided / Wrong token format.",
          {
            path: "requireSignin",
            reason: "token sent but possibly wrong",
          }
        )
      );
    }
  } else {
    return next(
      new CustomException(
        401,
        "You must be logged in to access this feature.",
        {
          reason: "No authorization header or invalid token.",
          alias: "token_not_found",
        }
      )
    );
  }
};
