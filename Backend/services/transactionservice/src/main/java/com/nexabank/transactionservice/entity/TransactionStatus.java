package com.nexabank.transactionservice.entity;

public enum TransactionStatus {
    PENDING,
    COMPLETED,
    FAILED,
    FLAGGED // Phase 8: Added for Fraud Detection Service
}
