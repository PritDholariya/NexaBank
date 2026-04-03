package com.nexabank.authservice.dto;

public record AuthResponse(
    String token,
    String message
) {}
