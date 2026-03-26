export interface IInterswitchPaymentResponse {
  payRef: string;
  txnRef: string;
  amount: number;
  apprAmt: number;
  resp: string;
}

export interface IInitiatePaymentResponse {
  txn_ref: string;
  amount: string;
  currency: number;
  site_redirect_url: string;
}
