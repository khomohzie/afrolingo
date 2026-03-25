import mongoose from "mongoose";
import { IUser } from "../interfaces/user.interfaces";
import { signJwt, verifyJwt } from "./jwt.utils";

type TAUser = IUser & mongoose.Document;

type TGenerate = {
  accessToken: string;
  refreshToken: string;
};

type TVerify = {
  id: string;
  email?: string;
  expiresIn?: any;
  name?: string;
  message?: string;
  expiredAt?: any;
};

//  Generate tokens
export const generate = async (user: TAUser): Promise<TGenerate> => {
  const accessToken = signJwt(
    { id: user._id },
    {
      expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN_DAY}d`,
    }
  );

  const refreshToken = signJwt(
    { id: user._id },
    {
      expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_IN_DAY}d`,
    }
  );

  // Return access and refresh token
  return { accessToken, refreshToken };
};

//  Read tokens
export const decode = {
  accessToken: async (token: string) => {
    try {
      return verifyJwt<TVerify>(token);
    } catch (err: any) {
      throw new Error(err);
    }
  },

  refreshToken: async (token: string): Promise<string | null> => {
    try {
      const decoded = verifyJwt<TVerify>(token);

      return decoded!.id;
    } catch (err: any) {
      throw new Error(err);
    }
  },
};

const authUtil = {
  generate,
  decode,
};

export default authUtil;
