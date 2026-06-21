package com.nexabank.notificationservice.kafka;

import com.nexabank.notificationservice.dto.BalanceUpdateEvent;
import com.nexabank.notificationservice.dto.TransactionStatusEvent;
import com.nexabank.notificationservice.dto.FraudAlertEvent;
import com.nexabank.notificationservice.entity.Notification;
import com.nexabank.notificationservice.entity.NotificationType;
import com.nexabank.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationConsumer {

    private final NotificationRepository notificationRepository;

    @KafkaListener(
            topics = "balance-updates",
            groupId = "notification-service-group",
            containerFactory = "balanceUpdateListenerContainerFactory"
    )
    public void consumeBalanceUpdate(BalanceUpdateEvent event) {
        log.info("KAFKA CONSUMER: Received BalanceUpdateEvent for Transaction: {}", event.transactionId());

        if (event.clientId() == null) {
            log.warn("Missing clientId in BalanceUpdateEvent {}. Cannot create notification.", event.transactionId());
            return;
        }

        Notification notification = Notification.builder()
                .clientId(event.clientId())
                .referenceId(String.valueOf(event.transactionId()))
                .amount(event.amount())
                .build();

        if ("TRANSFER".equalsIgnoreCase(event.transactionType())) {
            if ("DEBIT".equalsIgnoreCase(event.operation())) {
                notification.setType(NotificationType.TRANSFER_SENT);
                notification.setMessage(String.format("You sent a transfer of %s", event.amount()));
            } else {
                notification.setType(NotificationType.TRANSFER_RECEIVED);
                notification.setMessage(String.format("You received a transfer of %s", event.amount()));
            }
        } else if ("WITHDRAWAL".equalsIgnoreCase(event.transactionType())) {
            notification.setType(NotificationType.WITHDRAWAL);
            notification.setMessage(String.format("You withdrew %s", event.amount()));
        } else { // DEPOSIT
            notification.setType(NotificationType.DEPOSIT);
            notification.setMessage(String.format("You deposited %s", event.amount()));
        }

        notificationRepository.save(notification);
        log.info("Saved {} notification for Client: {}", notification.getType(), event.clientId());
    }

    @KafkaListener(
            topics = "transaction-status-updates",
            groupId = "notification-service-group",
            containerFactory = "transactionStatusListenerContainerFactory"
    )
    public void consumeTransactionStatus(TransactionStatusEvent event) {
        log.info("KAFKA CONSUMER: Received TransactionStatusEvent for Transaction: {} with Status: {}",
                 event.transactionId(), event.status());

        if (event.clientId() == null) {
            log.warn("Missing clientId in TransactionStatusEvent {}. Cannot create notification.", event.transactionId());
            return;
        }

        NotificationType type = "COMPLETED".equalsIgnoreCase(event.status()) 
                ? NotificationType.TRANSACTION_COMPLETED 
                : NotificationType.TRANSACTION_FAILED;

        Notification notification = Notification.builder()
                .clientId(event.clientId())
                .referenceId(String.valueOf(event.transactionId()))
                .type(type)
                .message(String.format("Your transaction %d has been %s", event.transactionId(), event.status()))
                .amount(null) // Status events don't strictly need the amount
                .build();

        notificationRepository.save(notification);
        log.info("Saved {} notification for Client: {}", notification.getType(), event.clientId());
    }

    // Phase 8: Added consumer for fraud detection alerts
    @KafkaListener(
            topics = "fraud-alerts",
            groupId = "notification-service-group",
            containerFactory = "fraudAlertListenerContainerFactory"
    )
    public void consumeFraudAlert(FraudAlertEvent event) {
        log.info("KAFKA CONSUMER: Received FraudAlertEvent for Transaction: {}", event.transactionId());

        if (event.clientId() == null) {
            log.warn("Missing clientId in FraudAlertEvent {}. Cannot create notification.", event.transactionId());
            return;
        }

        if (Boolean.TRUE.equals(event.isFraud())) {
            Notification notification = Notification.builder()
                    .clientId(event.clientId())
                    .referenceId(String.valueOf(event.transactionId()))
                    .type(NotificationType.FRAUD_ALERT)
                    .message(String.format("⚠️ Suspicious activity detected on transaction %d. Fraud score: %.2f", 
                                           event.transactionId(), event.fraudScore()))
                    .amount(event.amount())
                    .build();

            notificationRepository.save(notification);
            log.info("Saved FRAUD_ALERT notification for Client: {}", event.clientId());
        }
    }
}
