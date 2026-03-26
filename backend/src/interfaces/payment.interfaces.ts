import mongoose, { Document } from "mongoose";

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  txnRef: string;
  amount: number;
  status: "pending" | "success" | "failed";
  currency: number;
  paidAt?: Date;
}

export interface IInterswitchPaymentVerificationResponse {
  Amount: number;
  CardNumber: string;
  MerchantReference: string;
  PaymentReference: string;
  RetrievalReferenceNumber: string;
  SplitAccounts: any[];
  TransactionDate: string;
  ResponseCode: string;
  ResponseDescription: string;
  AccountNumber: string;
}
