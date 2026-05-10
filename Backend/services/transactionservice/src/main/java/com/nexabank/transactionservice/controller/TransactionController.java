package com.nexabank.transactionservice.controller;

import com.nexabank.transactionservice.dto.TransactionRequest;
import com.nexabank.transactionservice.dto.TransactionResponse;
import com.nexabank.transactionservice.entity.Transaction;
import com.nexabank.transactionservice.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Tag(name = "Transaction Management", description = "Endpoints for processing deposits, withdrawals, and transfers")
public class TransactionController {

    private final TransactionService transactionService;

    @Operation(summary = "Deposit Money", description = "Deposit funds into your own account.")
    @PostMapping("/deposit")
    public ResponseEntity<TransactionResponse> deposit(
            @RequestHeader("X-Client-Id") String clientId,
            @Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(transactionService.processDeposit(clientId, request));
    }

    @Operation(summary = "Withdraw Money", description = "Withdraw funds from your own account. Requires sufficient balance.")
    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResponse> withdraw(
            @RequestHeader("X-Client-Id") String clientId,
            @Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(transactionService.processWithdrawal(clientId, request));
    }

    @Operation(summary = "Transfer Money", description = "Transfer funds to another NexaBank IBAN. Requires sufficient balance.")
    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponse> transfer(
            @RequestHeader("X-Client-Id") String clientId,
            @Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(transactionService.processTransfer(clientId, request));
    }

    @Operation(summary = "Transaction History", description = "View all your past and pending transactions.")
    @GetMapping("/history")
    public ResponseEntity<List<Transaction>> getHistory(
            @RequestHeader("X-Client-Id") String clientId) {
        return ResponseEntity.ok(transactionService.getTransactionHistory(clientId));
    }
}
