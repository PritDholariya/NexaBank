package com.nexabank.accountservice.dto;

import com.nexabank.accountservice.entity.AccountType;
import java.math.BigDecimal;

public record UserProfileResponse(
    // Personal Details
    String name,
    String email,
    String phoneNumber,
    String address,
    String photoUrl,
    String clientId,
    
    // Banking Details
    String iban,
    String bic,
    BigDecimal balance,
    AccountType accountType
) {}
