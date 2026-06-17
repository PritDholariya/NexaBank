package com.nexabank.notificationservice.dto;

/**
 * Mirrors the TransactionStatusEvent produced by Account Service.
 */
public record TransactionStatusEvent(
        Long transactionId,
        String status,    // "COMPLETED" or "FAILED"
        String clientId   // clientId of the account owner — used by Notification Service
) {}
