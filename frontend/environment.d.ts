import { IInterswitchPaymentResponse } from "@/interfaces/payment.interface";

interface WebpayCheckout {
  (options: {
    merchant_code: string;
    pay_item_id: string;
    onComplete: (response: IInterswitchPaymentResponse) => void;
    mode: string;
  }): void;
}

declare global {
  interface Window {
    webpayCheckout: WebpayCheckout;
  }

  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: "production" | "development" | "test";
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_MERCHANT_CODE: string;
      NEXT_PUBLIC_PAY_ITEM_ID: string;
      NEXT_PUBLIC_INTERSWITCH_MODE: string;
      GROQ_API_KEY: string;
      GEMINI_API_KEY: string;
      SPITCH_API_KEY: string;
    }
  }
}

export {};
