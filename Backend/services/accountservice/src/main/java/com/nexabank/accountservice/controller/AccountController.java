package com.nexabank.accountservice.controller;

import com.nexabank.accountservice.entity.Account;
import com.nexabank.accountservice.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController // Tells Spring: "This class answers HTTP web requests with JSON."
@RequestMapping("/api/accounts") // All URLs in this class will start with /api/accounts
@RequiredArgsConstructor
public class AccountController {

    // The Controller asks for the Service, so it can hand off the work.
    private final AccountService accountService;

    // Triggered by POST: http://localhost:8081/api/accounts?userId=5
    @PostMapping
    public ResponseEntity<Account> createAccount(@RequestParam("userId") Long userId) {
        return ResponseEntity.ok(accountService.createAccount(userId));
    }

    // Triggered by GET: http://localhost:8081/api/accounts/1
    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccount(@PathVariable("id") Long id) {
        return ResponseEntity.ok(accountService.getAccount(id));
    }

    // Triggered by PUT: http://localhost:8081/api/accounts/1/deposit?amount=50.00
    @PutMapping("/{id}/deposit")
    public ResponseEntity<Account> deposit(@PathVariable("id") Long id, @RequestParam("amount") BigDecimal amount) {
        return ResponseEntity.ok(accountService.deposit(id, amount));
    }

    // Triggered by PUT: http://localhost:8081/api/accounts/1/withdraw?amount=20.00
    @PutMapping("/{id}/withdraw")
    public ResponseEntity<Account> withdraw(@PathVariable("id") Long id, @RequestParam("amount") BigDecimal amount) {
        return ResponseEntity.ok(accountService.withdraw(id, amount));
    }
}
