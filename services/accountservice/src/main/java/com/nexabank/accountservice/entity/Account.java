package com.nexabank.accountservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity // Tells Hibernate: "This class represents a database table!"
@Table(name = "accounts") // We explicitly name the table "accounts" (plural)
@Data // Lombok: Auto-generates getters, setters, toString(), etc.
@NoArgsConstructor // Lombok: Auto-generates an empty constructor (required by Hibernate)
@AllArgsConstructor // Lombok: Auto-generates a constructor with all arguments
@Builder // Lombok: Gives us a cool way to easily create Account objects later
public class Account {

    @Id // Tells Hibernate this is the Primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Tells Postgres to auto-increment 1, 2, 3...
    private Long id;

    @Column(unique = true, nullable = false) // Forces the DB to never allow duplicates
    private String accountNumber;

    @Column(nullable = false)
    private Long userId; // The ID of the human who owns this account

    @Column(nullable = false)
    private BigDecimal balance; // Using BigDecimal instead of Double because it's PERFECTly accurate for Money!

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Automatically set the creation date before saving to the DB!
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
