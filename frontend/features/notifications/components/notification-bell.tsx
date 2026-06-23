"use client";

import Link from "next/link";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDateTime } from "@/lib/format";

export function NotificationBell() {
  const { notifications, unreadCount, loading, markNotificationRead } =
    useNotifications({ pollIntervalMs: 30_000 });

  const recent = notifications.slice(0, 5);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          Notifications
          {unreadCount > 0 ? (
            <Badge className="absolute -top-2 -right-2 size-5 justify-center rounded-full p-0 text-[10px]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Recent notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
        ) : recent.length === 0 ? (
          <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
        ) : (
          recent.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex cursor-pointer flex-col items-start gap-1 py-2"
              onClick={() => {
                if (!notification.isRead) {
                  markNotificationRead(notification.id);
                }
              }}
            >
              <div className="flex w-full items-start justify-between gap-2">
                <span
                  className={`text-sm ${notification.isRead ? "text-muted-foreground" : "font-medium"}`}
                >
                  {notification.message}
                </span>
                {!notification.isRead ? (
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                ) : null}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDateTime(notification.createdAt)}
                {notification.amount != null
                  ? ` · ${formatCurrency(Number(notification.amount))}`
                  : ""}
              </span>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/portal/notifications" className="w-full cursor-pointer">
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
