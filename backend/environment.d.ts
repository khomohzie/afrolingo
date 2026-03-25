import { Request } from "express";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      PORT: number;
      MONGO_URI: string;
      MONGO_URI_CLOUD: string;
      APP_NAME: string;
      JWT_SECRET: string;
      ACCESS_TOKEN_EXPIRES_IN_DAY: number;
      REFRESH_TOKEN_EXPIRES_IN_DAY: number;
      ACCESS_TOKEN_EXPIRES_IN: number;
      REFRESH_TOKEN_EXPIRES_IN: number;
      YARNGPT_BASE_URL: string;
      YARNGPT_API_KEY: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
      CLOUDINARY_API_VARIABLE: string;
      CLOUDINARY_CLOUD_NAME: string;
    }
  }

  namespace Express {
    export interface Request {
      user: { id: string; email?: string; expiresIn?: any };
    }
  }
}

export {};
