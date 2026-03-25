import { Request } from "express";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      PORT: number;
      APP_NAME: string;
      JWT_SECRET: string;
      ACCESS_TOKEN_EXPIRES_IN_DAY: number;
      REFRESH_TOKEN_EXPIRES_IN_DAY: number;
    }
  }

  namespace Express {
    export interface Request {
      user: { _id: string; email?: string; expiresIn?: any };
    }
  }
}

export { };
