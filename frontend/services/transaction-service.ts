import { apiRequest } from "@/services/api-client";
import type {
  Transaction,
  TransactionRequest,
  TransactionResponse,
} from "@/types/transaction";

export function deposit(payload: TransactionRequest) {
  return apiRequest<TransactionResponse>("/api/transactions/deposit", {
    method: "POST",
    body: payload,
    requiresAuth: true,
  });
}

export function withdraw(payload: TransactionRequest) {
  return apiRequest<TransactionResponse>("/api/transactions/withdraw", {
    method: "POST",
    body: payload,
    requiresAuth: true,
  });
}

export function transfer(payload: TransactionRequest) {
  return apiRequest<TransactionResponse>("/api/transactions/transfer", {
    method: "POST",
    body: payload,
    requiresAuth: true,
  });
}

export function getTransactionHistory() {
  return apiRequest<Transaction[]>("/api/transactions/history", {
    requiresAuth: true,
  });
}
