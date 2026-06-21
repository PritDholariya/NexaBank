package com.nexabank.notificationservice.entity;

/**
 * Classifies the type of notification so the frontend can render the right icon/color.
 */
public enum NotificationType {
    DEPOSIT,            // Money was credited via a deposit
    WITHDRAWAL,         // Money was debited via a withdrawal
    TRANSFER_SENT,      // User sent a transfer out
    TRANSFER_RECEIVED,  // User received a transfer in
    TRANSACTION_COMPLETED, // Saga confirmed the transaction as COMPLETED
    TRANSACTION_FAILED,    // Saga confirmed the transaction as FAILED
    FRAUD_ALERT            // Phase 8: Added for Fraud Detection Service
}
