import mongoose from "mongoose";
import { IUser } from "../interfaces/user.interfaces";
import { signJwt } from "./jwt.utils";


type TAUser = IUser & mongoose.Document;

type TGenerate = {
  accessToken: string;
  refreshToken: string;
};

type TVerify = {
  _id: string;
  email?: string;
  expiresIn?: any;
  name?: string;
  message?: string;
  expiredAt?: any;
};

//  Generate tokens
export const generate = async (user: TAUser): Promise<TGenerate> => {
  const accessToken = signJwt(
    { _id: user._id },
    {
      expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN_DAY}d`,
    }
  );

  const refreshToken = signJwt(
    { _id: user._id },
    {
      expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_IN_DAY}d`,
    }
  );

  // Return access and refresh token
  return { accessToken, refreshToken };
};



const authUtil = {
  generate,
};

export default authUtil;
