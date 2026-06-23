"use client";

import { useCallback, useEffect, useState } from "react";
import { useHandleAuthError } from "@/features/auth/hooks/use-require-auth";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
} from "@/services/notification-service";
import { ApiError } from "@/services/api-client";
import type { Notification } from "@/types/notification";

export function useNotifications(options?: { pollIntervalMs?: number }) {
  const handleAuthError = useHandleAuthError();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const [list, count] = await Promise.all([
        getNotifications(),
        getUnreadCount(),
      ]);
      setNotifications(list);
      setUnreadCount(count.unreadCount);
    } catch (requestError) {
      if (
        requestError instanceof ApiError &&
        handleAuthError(requestError.status)
      ) {
        return;
      }
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  const markNotificationRead = useCallback(
    async (notificationId: number) => {
      try {
        await markAsRead(notificationId);
        setNotifications((current) =>
          current.map((item) =>
            item.id === notificationId ? { ...item, isRead: true } : item,
          ),
        );
        setUnreadCount((current) => Math.max(0, current - 1));
      } catch (requestError) {
        if (
          requestError instanceof ApiError &&
          handleAuthError(requestError.status)
        ) {
          return;
        }
        setError("Unable to update notification.");
      }
    },
    [handleAuthError],
  );

  useEffect(() => {
    refresh();

    if (!options?.pollIntervalMs) {
      return;
    }

    const interval = window.setInterval(refresh, options.pollIntervalMs);
    return () => window.clearInterval(interval);
  }, [refresh, options?.pollIntervalMs]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refresh,
    markNotificationRead,
  };
}
