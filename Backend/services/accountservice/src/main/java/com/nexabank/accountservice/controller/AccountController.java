package com.nexabank.accountservice.controller;

import com.nexabank.accountservice.dto.AccountRegistrationRequest;
import com.nexabank.accountservice.dto.AccountRegistrationResponse;
import com.nexabank.accountservice.dto.AccountApprovalResponse;
import com.nexabank.accountservice.entity.Account;
import com.nexabank.accountservice.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController 
@RequestMapping("/api/accounts") 
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    // Triggered by POST: http://localhost:8080/api/accounts/register
    @PostMapping("/register")
    public ResponseEntity<AccountRegistrationResponse> register(@RequestBody AccountRegistrationRequest request) {
        return ResponseEntity.ok(accountService.registerCustomerAccount(request));
    }

    // Triggered by POST: http://localhost:8080/api/accounts/admin/approve/1
    @PostMapping("/admin/approve/{customerId}")
    public ResponseEntity<AccountApprovalResponse> approveAccount(@PathVariable("customerId") Long customerId) {
        return ResponseEntity.ok(accountService.approveCustomerApplication(customerId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccount(@PathVariable("id") Long id) {
        return ResponseEntity.ok(accountService.getAccount(id));
    }
}
