package com.nexabank.transactionservice.dto;

public record TransactionStatusEvent(
        Long transactionId,
        String status // "COMPLETED" or "FAILED"
) {}
