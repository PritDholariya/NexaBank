package com.nexabank.accountservice.dto;

import com.nexabank.accountservice.entity.AccountType;
import java.time.LocalDate;

// A Record is a modern Java feature that creates a perfect, immutable "Data Transfer Object" (DTO).
// Postman will send JSON that maps perfectly to this Record.
public record AccountRegistrationRequest(
    String name,
    String email,
    String phoneNumber,
    String address,
    LocalDate dateOfBirth,
    String governmentId,
    AccountType accountType
) {}
