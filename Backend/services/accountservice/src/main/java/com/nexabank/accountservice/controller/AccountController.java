package com.nexabank.accountservice.controller;

import com.nexabank.accountservice.dto.AccountRegistrationRequest;
import com.nexabank.accountservice.dto.AccountRegistrationResponse;
import com.nexabank.accountservice.entity.Account;
import com.nexabank.accountservice.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController // Tells Spring: "This class answers HTTP web requests with JSON."
@RequestMapping("/api/accounts") // All URLs in this class will start with /api/accounts
@RequiredArgsConstructor
public class AccountController {

    // The Controller asks for the Service, so it can hand off the work.
    private final AccountService accountService;

    // Triggered by POST: http://localhost:8080/api/accounts/register
    // Uses @RequestBody to map the JSON from Postman perfectly into our DTO!
    @PostMapping("/register")
    public ResponseEntity<AccountRegistrationResponse> register(@RequestBody AccountRegistrationRequest request) {
        return ResponseEntity.ok(accountService.registerCustomerAccount(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccount(@PathVariable("id") Long id) {
        return ResponseEntity.ok(accountService.getAccount(id));
    }
}
