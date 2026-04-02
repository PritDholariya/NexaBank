package com.nexabank.accountservice.dto;

import com.nexabank.accountservice.entity.CustomerStatus;

public record AccountRegistrationResponse(
    Long customerId,
    CustomerStatus status,
    String message
) {}
