package com.nexabank.notificationservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Persisted notification record. One notification is created per Kafka event per affected user.
 * For a TRANSFER, two records are created: one for the sender, one for the receiver.
 */
@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The NexaBank client ID (e.g. "NEXA-5B457433") of the user this notification belongs to.
     * Injected from the JWT claim X-Client-Id at the REST layer; from Kafka event at the consumer layer.
     */
    @Column(nullable = false)
    private String clientId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    /** Human-readable notification message shown in the frontend bell icon dropdown. */
    @Column(nullable = false)
    private String message;

    /** The transaction ID this notification relates to (for deep-linking in the UI). */
    @Column
    private String referenceId;

    /** The monetary amount involved, if applicable. Null for pure status notifications. */
    @Column(precision = 19, scale = 4)
    private BigDecimal amount;

    /** Whether the user has already seen/dismissed this notification. Defaults to false. */
    @Column(nullable = false)
    @Builder.Default
    private boolean isRead = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
