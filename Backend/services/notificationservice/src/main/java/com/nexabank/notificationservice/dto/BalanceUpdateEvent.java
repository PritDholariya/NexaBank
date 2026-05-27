package com.nexabank.notificationservice.dto;

import java.math.BigDecimal;

/**
 * Mirrors the BalanceUpdateEvent produced by Transaction Service.
 * Each service owns its own DTO copy — no cross-module dependency.
 * Fields must match the JSON produced by transactionservice.
 */
public record BalanceUpdateEvent(
        Long transactionId,
        String iban,
        BigDecimal amount,
        String operation,      // "CREDIT" or "DEBIT"
        String clientId,       // clientId of the account owner
        String transactionType // "DEPOSIT", "WITHDRAWAL", or "TRANSFER"
) {}
