package com.nexabank.transactionservice.kafka;

import com.nexabank.transactionservice.dto.TransactionStatusEvent;
import com.nexabank.transactionservice.entity.Transaction;
import com.nexabank.transactionservice.entity.TransactionStatus;
import com.nexabank.transactionservice.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionStatusConsumer {

    private final TransactionRepository transactionRepository;

    @Transactional
    @KafkaListener(topics = "transaction-status-updates", groupId = "transaction-service-group")
    public void consumeStatusUpdate(TransactionStatusEvent event) {
        log.info("KAFKA CONSUMER: Received Status Update for Transaction {}: {}", 
                 event.transactionId(), event.status());

        Transaction transaction = transactionRepository.findById(event.transactionId())
                .orElseThrow(() -> new RuntimeException("Transaction not found for ID: " + event.transactionId()));

        if ("COMPLETED".equalsIgnoreCase(event.status())) {
            transaction.setStatus(TransactionStatus.COMPLETED);
        } else if ("FAILED".equalsIgnoreCase(event.status())) {
            transaction.setStatus(TransactionStatus.FAILED);
        }

        transactionRepository.save(transaction);
        log.info("SAGA COMPLETE: Transaction {} is now {}", transaction.getId(), transaction.getStatus());
    }
}
