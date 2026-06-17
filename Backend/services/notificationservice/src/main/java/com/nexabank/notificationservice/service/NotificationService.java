package com.nexabank.notificationservice.service;

import com.nexabank.notificationservice.dto.NotificationResponse;
import com.nexabank.notificationservice.entity.Notification;
import com.nexabank.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<NotificationResponse> getNotificationsForClient(String clientId) {
        log.info("Fetching notifications for Client ID: {}", clientId);
        return notificationRepository.findByClientIdOrderByCreatedAtDesc(clientId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(String clientId) {
        return notificationRepository.countByClientIdAndIsReadFalse(clientId);
    }

    public void markAsRead(Long id, String clientId) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        // Security check: ensure the user can only mark their OWN notifications as read
        if (!notification.getClientId().equals(clientId)) {
            throw new RuntimeException("Unauthorized: This notification does not belong to you");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
        log.info("Marked notification {} as read for Client ID: {}", id, clientId);
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getType().name(),
                notification.getMessage(),
                notification.getReferenceId(),
                notification.getAmount(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}
