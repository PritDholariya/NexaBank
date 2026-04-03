package com.nexabank.accountservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String iban; // International Bank Account Number

    @Column(nullable = false)
    private String bic; // Bank Identifier Code

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountType accountType; // SAVINGS or CURRENT

    @Column(nullable = false)
    private Long customerId; // The Database ID of the Customer who owns this account

    @Column(nullable = false)
    private BigDecimal balance;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
