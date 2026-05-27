package com.nexabank.transactionservice.service;

import com.nexabank.transactionservice.client.AccountServiceClient;
import com.nexabank.transactionservice.dto.TransactionRequest;
import com.nexabank.transactionservice.dto.TransactionResponse;
import com.nexabank.transactionservice.dto.UserProfileDto;
import com.nexabank.transactionservice.entity.Transaction;
import com.nexabank.transactionservice.entity.TransactionStatus;
import com.nexabank.transactionservice.entity.TransactionType;
import com.nexabank.transactionservice.repository.TransactionRepository;
import com.nexabank.transactionservice.dto.BalanceUpdateEvent;
import com.nexabank.transactionservice.kafka.TransactionProducer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountServiceClient accountServiceClient;
    private final TransactionProducer transactionProducer;

    @Transactional
    public TransactionResponse processDeposit(String clientId, TransactionRequest request) {
        log.info("Processing DEPOSIT for Client ID: {}", clientId);
        
        UserProfileDto profile = accountServiceClient.getMyProfile(clientId);

        Transaction transaction = Transaction.builder()
                .receiverIban(profile.iban()) // Money goes INTO their account
                .amount(request.amount())
                .type(TransactionType.DEPOSIT)
                .status(TransactionStatus.PENDING) // Pending until Kafka updates the balance!
                .description(request.description() != null ? request.description() : "Deposit")
                .build();

        transaction = transactionRepository.save(transaction);
        
        // Step 5: Publish event to Kafka (include clientId + transactionType for Notification Service)
        transactionProducer.publishBalanceUpdate(
            new BalanceUpdateEvent(transaction.getId(), profile.iban(), transaction.getAmount(), "CREDIT",
                                   profile.clientId(), transaction.getType().name())
        );

        return new TransactionResponse(
                transaction.getId(),
                transaction.getType(),
                transaction.getStatus(),
                transaction.getAmount(),
                "Deposit initiated and pending processing.",
                transaction.getCreatedAt()
        );
    }

    @Transactional
    public TransactionResponse processWithdrawal(String clientId, TransactionRequest request) {
        log.info("Processing WITHDRAWAL for Client ID: {}", clientId);
        
        UserProfileDto profile = accountServiceClient.getMyProfile(clientId);

        if (profile.balance().compareTo(request.amount()) < 0) {
            throw new RuntimeException("Insufficient funds! Your balance is " + profile.balance());
        }

        Transaction transaction = Transaction.builder()
                .senderIban(profile.iban()) // Money comes OUT of their account
                .amount(request.amount())
                .type(TransactionType.WITHDRAWAL)
                .status(TransactionStatus.PENDING)
                .description(request.description() != null ? request.description() : "Withdrawal")
                .build();

        transaction = transactionRepository.save(transaction);
        
        // Step 5: Publish event to Kafka (include clientId + transactionType for Notification Service)
        transactionProducer.publishBalanceUpdate(
            new BalanceUpdateEvent(transaction.getId(), profile.iban(), transaction.getAmount(), "DEBIT",
                                   profile.clientId(), transaction.getType().name())
        );

        return new TransactionResponse(
                transaction.getId(),
                transaction.getType(),
                transaction.getStatus(),
                transaction.getAmount(),
                "Withdrawal initiated and pending processing.",
                transaction.getCreatedAt()
        );
    }

    @Transactional
    public TransactionResponse processTransfer(String clientId, TransactionRequest request) {
        log.info("Processing TRANSFER for Client ID: {}", clientId);
        
        if (request.receiverIban() == null || request.receiverIban().isBlank()) {
            throw new RuntimeException("Receiver IBAN is absolutely required for a Transfer!");
        }

        UserProfileDto profile = accountServiceClient.getMyProfile(clientId);

        if (profile.iban().equals(request.receiverIban())) {
            throw new RuntimeException("You cannot transfer money to yourself!");
        }

        if (profile.balance().compareTo(request.amount()) < 0) {
            throw new RuntimeException("Insufficient funds! Your balance is " + profile.balance());
        }

        Boolean receiverExists = accountServiceClient.verifyIban(request.receiverIban());
        if (Boolean.FALSE.equals(receiverExists)) {
            throw new RuntimeException("The Receiver IBAN does not exist in NexaBank!");
        }

        Transaction transaction = Transaction.builder()
                .senderIban(profile.iban())
                .receiverIban(request.receiverIban())
                .amount(request.amount())
                .type(TransactionType.TRANSFER)
                .status(TransactionStatus.PENDING)
                .description(request.description() != null ? request.description() : "Transfer")
                .build();

        transaction = transactionRepository.save(transaction);
        
        // Step 5: Publish events to Kafka (One to DEBIT the sender, one to CREDIT the receiver!)
        // Include clientId + transactionType so Notification Service knows who to notify.
        // Note: CREDIT event carries receiver IBAN; Account Service resolves clientId from IBAN for the status event.
        transactionProducer.publishBalanceUpdate(
            new BalanceUpdateEvent(transaction.getId(), profile.iban(), transaction.getAmount(), "DEBIT",
                                   profile.clientId(), transaction.getType().name())
        );
        transactionProducer.publishBalanceUpdate(
            new BalanceUpdateEvent(transaction.getId(), request.receiverIban(), transaction.getAmount(), "CREDIT",
                                   null, transaction.getType().name()) // receiver clientId resolved by Account Service
        );

        return new TransactionResponse(
                transaction.getId(),
                transaction.getType(),
                transaction.getStatus(),
                transaction.getAmount(),
                "Transfer initiated and pending processing.",
                transaction.getCreatedAt()
        );
    }

    public List<Transaction> getTransactionHistory(String clientId) {
        log.info("Fetching transaction history for Client ID: {}", clientId);
        UserProfileDto profile = accountServiceClient.getMyProfile(clientId);
        
        return transactionRepository.findBySenderIbanOrReceiverIbanOrderByCreatedAtDesc(
                profile.iban(), 
                profile.iban()
        );
    }
}
