package com.nexabank.authservice.dto;

public record ChangePasswordRequest(
    String clientId,
    String oldPassword,
    String newPassword
) {}
