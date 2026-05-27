package com.nexabank.transactionservice.dto;

import java.math.BigDecimal;

public record BalanceUpdateEvent(
        Long transactionId,
        String iban,
        BigDecimal amount,
        String operation,      // "CREDIT" (deposit/receive) or "DEBIT" (withdrawal/send)
        String clientId,       // clientId of the account owner — used by Notification Service
        String transactionType // "DEPOSIT", "WITHDRAWAL", or "TRANSFER" — for notification message
) {}
