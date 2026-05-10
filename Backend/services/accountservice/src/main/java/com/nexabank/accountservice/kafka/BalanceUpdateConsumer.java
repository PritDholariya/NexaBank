package com.nexabank.accountservice.kafka;

import com.nexabank.accountservice.dto.BalanceUpdateEvent;
import com.nexabank.accountservice.entity.Account;
import com.nexabank.accountservice.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BalanceUpdateConsumer {

    private final AccountRepository accountRepository;
    private final TransactionStatusProducer transactionStatusProducer;

    @Transactional
    @KafkaListener(topics = "balance-updates", groupId = "account-service-group")
    public void consumeBalanceUpdate(BalanceUpdateEvent event) {
        log.info("KAFKA CONSUMER: Received {} event for IBAN: {} with Amount: {}", 
                 event.operation(), event.iban(), event.amount());

        Account account = accountRepository.findByIban(event.iban())
                .orElseThrow(() -> new RuntimeException("Account not found for IBAN: " + event.iban()));

        if ("CREDIT".equalsIgnoreCase(event.operation())) {
            account.setBalance(account.getBalance().add(event.amount()));
            log.info("KAFKA CONSUMER: Deposited {}. New balance: {}", event.amount(), account.getBalance());
        } else if ("DEBIT".equalsIgnoreCase(event.operation())) {
            account.setBalance(account.getBalance().subtract(event.amount()));
            log.info("KAFKA CONSUMER: Withdrew {}. New balance: {}", event.amount(), account.getBalance());
        }

        try {
            accountRepository.save(account);
            // Success! Tell Transaction Service to mark it as COMPLETED
            transactionStatusProducer.publishStatusUpdate(
                new com.nexabank.accountservice.dto.TransactionStatusEvent(event.transactionId(), "COMPLETED")
            );
        } catch (Exception e) {
            log.error("KAFKA CONSUMER: Failed to update balance for IBAN {}", event.iban(), e);
            // Tell Transaction Service to mark it as FAILED
            transactionStatusProducer.publishStatusUpdate(
                new com.nexabank.accountservice.dto.TransactionStatusEvent(event.transactionId(), "FAILED")
            );
            throw e; // Rethrow so Spring's Transaction manager rolls it back
        }
    }
}
