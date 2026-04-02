package com.nexabank.accountservice.repository;

import com.nexabank.accountservice.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    
        Optional<Account> findByIban(String iban);
        List<Account> findByCustomerId(Long customerId);

       // MAGIC: We don't have to write the SQL code for these! 
    // Spring Boot reads the method name and automatically writes: "SELECT * FROM accounts WHERE account_number = ?"
    // Optional<Account> findByAccountNumber(String accountNumber);

    // Automatically writes: "SELECT * FROM accounts WHERE user_id = ?"
    // List<Account> findByUserId(Long userId);

    /* 
       Note: Because we extended JpaRepository, we also get these for FREE without typing them:
       - save(Account account)     -> (INSERT INTO or UPDATE)
       - findById(Long id)         -> (SELECT * WHERE id =)
       - deleteById(Long id)       -> (DELETE FROM WHERE id =)
       - findAll()                 -> (SELECT * FROM accounts)
    */
}
