package com.nexabank.transactionservice.dto;

public record TransactionStatusEvent(
        Long transactionId,
        String status,    // "COMPLETED" or "FAILED"
        String clientId   // clientId of the account owner — used by Notification Service
) {}

