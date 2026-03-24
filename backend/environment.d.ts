import { Request } from "express";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      PORT: number;
      APP_NAME: string;
    }
  }

  namespace Express {
    export interface Request {
      user: { _id: string; email?: string; expiresIn?: any };
    }
  }
}

export { };
