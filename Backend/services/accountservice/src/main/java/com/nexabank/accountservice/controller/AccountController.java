package com.nexabank.accountservice.controller;

import com.nexabank.accountservice.dto.AccountRegistrationRequest;
import com.nexabank.accountservice.dto.AccountRegistrationResponse;
import com.nexabank.accountservice.dto.AccountApprovalResponse;
import com.nexabank.accountservice.entity.Account;
import com.nexabank.accountservice.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Slf4j
@RestController 
@Tag(name = "Account Management", description = "Endpoints for registering and managing customer accounts")
@RequestMapping("/api/accounts") 
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    // Triggered by POST: http://localhost:8080/api/accounts/register
    @Operation(summary = "Register a new customer account", description = "Saves customer details and initiates the account creation process pending admin review.")
    @PostMapping("/register")
    public ResponseEntity<AccountRegistrationResponse> register(@RequestBody AccountRegistrationRequest request) {
        log.info("Received request to register account for email: {}", request.email());
        return ResponseEntity.ok(accountService.registerCustomerAccount(request));
    }

    // Triggered by POST: http://localhost:8080/api/accounts/admin/approve/1
    @Operation(summary = "Approve customer application", description = "Admin endpoint to approve a pending customer application and generate banking credentials.")
    @PostMapping("/admin/approve/{customerId}")
    public ResponseEntity<AccountApprovalResponse> approveAccount(@PathVariable("customerId") Long customerId) {
        log.info("Received request to approve account for customer ID: {}", customerId);
        return ResponseEntity.ok(accountService.approveCustomerApplication(customerId));
    }

    @Operation(summary = "Get an account by ID", description = "Retrieves the account details using the specific account ID.")
    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccount(@PathVariable("id") Long id) {
        log.info("Received request to fetch account details for account ID: {}", id);
        return ResponseEntity.ok(accountService.getAccount(id));
    }

    // --- INTERNAL APIs FOR AUTH SERVICE ---
    
    @io.swagger.v3.oas.annotations.Hidden
    @PostMapping("/internal/verify")
    public ResponseEntity<Boolean> verifyCredentials(@RequestParam("clientId") String clientId, @RequestParam("password") String password) {
        return ResponseEntity.ok(accountService.verifyCustomerCredentials(clientId, password));
    }

    @io.swagger.v3.oas.annotations.Hidden
    @PostMapping("/internal/requires-password-change")
    public ResponseEntity<Boolean> requiresPasswordChange(@RequestParam("clientId") String clientId) {
        return ResponseEntity.ok(accountService.requiresPasswordChange(clientId));
    }

    @io.swagger.v3.oas.annotations.Hidden
    @PostMapping("/internal/change-password")
    public ResponseEntity<Void> changePassword(@RequestParam("clientId") String clientId, @RequestParam("newPassword") String newPassword) {
        accountService.updatePassword(clientId, newPassword);
        return ResponseEntity.ok().build();
    }
}
