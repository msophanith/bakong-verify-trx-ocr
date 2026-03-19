export interface TransactionData {
  hash: string;
  fromAccountId: string;
  toAccountId: string;
  currency: string;
  amount: number;
  description: string;
  createdDateMs: number;
  acknowledgedDateMs: number;
  respondedDateMs: number;
}

export interface TransactionResult {
  responseCode: number;
  responseMessage: string;
  errorCode: string | null;
  data: TransactionData | null;
}

export interface ExtractedData {
  hash: string;
  amount: string;
  currency: string;
}
