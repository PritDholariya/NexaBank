package com.nexabank.transactionservice.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record TransactionRequest(
        @NotNull(message = "Amount is required")
        @DecimalMin(value = "1.0", message = "Minimum transaction amount is 1.00")
        BigDecimal amount,
        
        String receiverIban, // Required only for Transfers
        String description
) {}
