package com.nexabank.accountservice.kafka;

import com.nexabank.accountservice.dto.TransactionStatusEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionStatusProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String TOPIC = "transaction-status-updates";

    public void publishStatusUpdate(TransactionStatusEvent event) {
        log.info("KAFKA PRODUCER: Publishing status update for Transaction ID: {} -> {}", 
                 event.transactionId(), event.status());
                 
        kafkaTemplate.send(TOPIC, event);
    }
}
