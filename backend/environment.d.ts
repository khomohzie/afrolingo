import { Request } from "express";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      PORT: number;
      MONGO_URI: string;
      MONGO_URI_CLOUD: string;
      APP_NAME: string;
      FRONTEND_URL: string;
      JWT_SECRET: string;
      ACCESS_TOKEN_EXPIRES_IN_DAY: number;
      REFRESH_TOKEN_EXPIRES_IN_DAY: number;
      ACCESS_TOKEN_EXPIRES_IN: number;
      REFRESH_TOKEN_EXPIRES_IN: number;
      YARNGPT_BASE_URL: string;
      YARNGPT_API_KEY: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_URL: string;
      INTERSWITCH_MERCHANT_CODE: string;
      INTERSWITCH_PAY_ITEM_ID: string;
      INTERSWITCH_CLIENT_ID: string;
      INTERSWITCH_CLIENT_SECRET: string;
      INTERSWITCH_BASE_URL: string;
      SUBSCRIPTION_AMOUNT: number;
    }
  }

  namespace Express {
    export interface Request {
      user: { id: string; email?: string; expiresIn?: any };
    }
  }
}

export {};
