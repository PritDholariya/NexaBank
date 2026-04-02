package com.nexabank.accountservice.dto;

public record AccountApprovalResponse(
    String clientId,
    String iban,
    String bic,
    String message
) {}
