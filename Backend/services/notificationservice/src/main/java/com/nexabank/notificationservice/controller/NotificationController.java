package com.nexabank.notificationservice.controller;

import com.nexabank.notificationservice.dto.NotificationResponse;
import com.nexabank.notificationservice.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notification", description = "Endpoints for user notifications")
@SecurityRequirement(name = "bearerAuth")
public class NotificationController {

    private final NotificationService notificationService;

    @Operation(summary = "Get all notifications for the logged-in user")
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(
            @RequestHeader("X-Client-Id") String clientId) {
        return ResponseEntity.ok(notificationService.getNotificationsForClient(clientId));
    }

    @Operation(summary = "Get count of unread notifications")
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @RequestHeader("X-Client-Id") String clientId) {
        long count = notificationService.getUnreadCount(clientId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    @Operation(summary = "Mark a notification as read")
    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable("id") Long id,
            @RequestHeader("X-Client-Id") String clientId) {
        notificationService.markAsRead(id, clientId);
        return ResponseEntity.noContent().build();
    }
}
