import { apiRequest } from "@/services/api-client";
import type { Notification, UnreadCountResponse } from "@/types/notification";

export function getNotifications() {
  return apiRequest<Notification[]>("/api/notifications", {
    requiresAuth: true,
  });
}

export function getUnreadCount() {
  return apiRequest<UnreadCountResponse>("/api/notifications/unread-count", {
    requiresAuth: true,
  });
}

export function markAsRead(notificationId: number) {
  return apiRequest<void>(`/api/notifications/${notificationId}/read`, {
    method: "PATCH",
    requiresAuth: true,
  });
}
