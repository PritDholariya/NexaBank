package com.nexabank.transactionservice.repository;

import com.nexabank.transactionservice.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    // Spring Boot automatically translates this method name into the SQL query:
    // SELECT * FROM transactions WHERE sender_iban = ? OR receiver_iban = ? ORDER BY created_at DESC
    List<Transaction> findBySenderIbanOrReceiverIbanOrderByCreatedAtDesc(String senderIban, String receiverIban);
}
