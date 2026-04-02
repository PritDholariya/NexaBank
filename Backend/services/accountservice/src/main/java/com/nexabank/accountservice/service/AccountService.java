package com.nexabank.accountservice.service;

import com.nexabank.accountservice.entity.Account;
import com.nexabank.accountservice.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service // Tells Spring: "This is a Business Logic class. Load it into memory!"
@RequiredArgsConstructor // Lombok: Automatically injects the repository for us!
public class AccountService {

    // This is Dependency Injection. The Service asks for the Repository to talk to the DB.
    private final AccountRepository accountRepository;

    public Account createAccount(Long userId) {
        Account newAccount = Account.builder()
                .userId(userId)
                .accountNumber(UUID.randomUUID().toString().substring(0, 10)) // Generate random 10-char String
                .balance(BigDecimal.ZERO)
                .build();
        return accountRepository.save(newAccount);
    }

    public Account getAccount(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with ID: " + id));
    }

    public Account deposit(Long id, BigDecimal amount) {
        Account account = getAccount(id);
        account.setBalance(account.getBalance().add(amount));
        return accountRepository.save(account);
    }

    public Account withdraw(Long id, BigDecimal amount) {
        Account account = getAccount(id);
        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient funds!");
        }
        account.setBalance(account.getBalance().subtract(amount));
        return accountRepository.save(account);
    }
}
