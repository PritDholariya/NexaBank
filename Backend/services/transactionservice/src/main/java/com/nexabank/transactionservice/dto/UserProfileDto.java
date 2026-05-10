package com.nexabank.transactionservice.dto;

import java.math.BigDecimal;

public record UserProfileDto(
        String name,
        String email,
        String phoneNumber,
        String address,
        String photoUrl,
        String clientId,
        String iban,
        String bic,
        BigDecimal balance,
        String accountType
) {}
