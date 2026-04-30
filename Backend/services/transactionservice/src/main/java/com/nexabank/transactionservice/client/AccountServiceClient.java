package com.nexabank.transactionservice.client;

import com.nexabank.transactionservice.dto.UserProfileDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "ACCOUNT-SERVICE")
public interface AccountServiceClient {

    @GetMapping("/api/accounts/profile")
    UserProfileDto getMyProfile(@RequestHeader("X-Client-Id") String clientId);

    @GetMapping("/api/accounts/internal/verify-iban")
    Boolean verifyIban(@org.springframework.web.bind.annotation.RequestParam("iban") String iban);
}
