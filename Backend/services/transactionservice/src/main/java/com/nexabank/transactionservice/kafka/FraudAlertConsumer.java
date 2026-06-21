package com.nexabank.transactionservice.kafka;

import com.nexabank.transactionservice.dto.FraudAlertEvent;
import com.nexabank.transactionservice.entity.Transaction;
import com.nexabank.transactionservice.entity.TransactionStatus;
import com.nexabank.transactionservice.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Phase 8: Added for Fraud Detection Service
 * Consumes fraud alerts from the Kafka topic and updates transaction statuses.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FraudAlertConsumer {

    private final TransactionRepository transactionRepository;

    @Transactional
    @KafkaListener(
            topics = "fraud-alerts", 
            groupId = "transaction-service-group",
            containerFactory = "fraudAlertListenerContainerFactory"
    )
    public void consumeFraudAlert(FraudAlertEvent event) {
        log.info("KAFKA CONSUMER: Received Fraud Alert for Transaction {}: Score={}", 
                 event.transactionId(), event.fraudScore());

        if (Boolean.TRUE.equals(event.isFraud())) {
            transactionRepository.findById(event.transactionId()).ifPresentOrElse(transaction -> {
                transaction.setStatus(TransactionStatus.FLAGGED);
                transactionRepository.save(transaction);
                log.warn("🚨 Fraud detected! Transaction {} status updated to FLAGGED", transaction.getId());
            }, () -> log.error("Transaction {} not found for Fraud Alert", event.transactionId()));
        } else {
            log.info("Transaction {} is safe (Score: {}). No action taken.", event.transactionId(), event.fraudScore());
        }
    }
}
