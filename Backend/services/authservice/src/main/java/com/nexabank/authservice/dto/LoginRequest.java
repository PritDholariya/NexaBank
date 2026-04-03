package com.nexabank.authservice.dto;

public record LoginRequest(
    String clientId,
    String password
) {}
