package com.nexabank.transactionservice.kafka;

import com.nexabank.transactionservice.dto.BalanceUpdateEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String TOPIC = "balance-updates";

    public void publishBalanceUpdate(BalanceUpdateEvent event) {
        log.info("KAFKA PRODUCER: Publishing {} event for IBAN: {} with Amount: {}", 
                 event.operation(), event.iban(), event.amount());
                 
        kafkaTemplate.send(TOPIC, event);
    }
}
