package com.nexabank.notificationservice.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO sent to the frontend containing notification details.
 */
public record NotificationResponse(
        Long id,
        String type,
        String message,
        String referenceId,
        BigDecimal amount,
        boolean isRead,
        LocalDateTime createdAt
) {}
