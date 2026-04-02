package com.nexabank.accountservice.dto;

public record AccountRegistrationResponse(
    String clientId,
    String iban,
    String bic,
    String initialPassword,
    String message
) {}
