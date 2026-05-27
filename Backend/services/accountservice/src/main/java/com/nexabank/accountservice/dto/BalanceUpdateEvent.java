package com.nexabank.accountservice.dto;

import java.math.BigDecimal;

public record BalanceUpdateEvent(
        Long transactionId,
        String iban,
        BigDecimal amount,
        String operation,      // "CREDIT" or "DEBIT"
        String clientId,       // clientId of the account owner — used by Notification Service
        String transactionType // "DEPOSIT", "WITHDRAWAL", or "TRANSFER"
) {}
