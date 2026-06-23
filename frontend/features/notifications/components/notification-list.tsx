"use client";

import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDateTime } from "@/lib/format";

export function NotificationList() {
  const { notifications, loading, error, markNotificationRead } =
    useNotifications({ pollIntervalMs: 30_000 });

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        You have no notifications yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          size="sm"
          className={notification.isRead ? "opacity-80" : "border-primary/20"}
        >
          <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">
                {notification.message}
              </CardTitle>
              <CardDescription>
                {formatDateTime(notification.createdAt)}
                {notification.amount != null
                  ? ` · ${formatCurrency(Number(notification.amount))}`
                  : ""}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {!notification.isRead ? (
                <Badge variant="secondary">New</Badge>
              ) : null}
              {!notification.isRead ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markNotificationRead(notification.id)}
                >
                  Mark read
                </Button>
              ) : null}
            </div>
          </CardHeader>
          {notification.referenceId ? (
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground">
                Reference: {notification.referenceId}
              </p>
            </CardContent>
          ) : null}
        </Card>
      ))}
    </div>
  );
}
