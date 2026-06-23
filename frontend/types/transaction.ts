export type TransactionType = "DEPOSIT" | "WITHDRAWAL" | "TRANSFER";

export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED";

export type TransactionRequest = {
  amount: number;
  receiverIban?: string;
  description?: string;
};

export type TransactionResponse = {
  transactionId: number;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  message: string;
  timestamp: string;
};

export type Transaction = {
  id: number;
  senderIban: string | null;
  receiverIban: string | null;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  description: string | null;
  createdAt: string;
};
