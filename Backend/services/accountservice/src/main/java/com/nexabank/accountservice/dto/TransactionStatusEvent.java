package com.nexabank.accountservice.dto;

public record TransactionStatusEvent(
        Long transactionId,
        String status // "COMPLETED" or "FAILED"
) {}
