package com.nexabank.transactionservice.dto;

import com.nexabank.transactionservice.entity.TransactionStatus;
import com.nexabank.transactionservice.entity.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponse(
        Long transactionId,
        TransactionType type,
        TransactionStatus status,
        BigDecimal amount,
        String message,
        LocalDateTime timestamp
) {}
