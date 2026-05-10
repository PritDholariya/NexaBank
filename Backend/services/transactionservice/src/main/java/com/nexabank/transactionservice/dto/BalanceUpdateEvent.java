package com.nexabank.transactionservice.dto;

import java.math.BigDecimal;

public record BalanceUpdateEvent(
        Long transactionId,
        String iban,
        BigDecimal amount,
        String operation // "CREDIT" (deposit/receive) or "DEBIT" (withdrawal/send)
) {}
