"use client";

import { NotificationList } from "@/features/notifications/components/notification-list";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function NotificationsPage() {
  return (
    <PortalLayout
      title="Notifications"
      description="Stay updated on your account activity and transaction status."
    >
      <Card>
        <CardHeader>
          <CardTitle>All notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationList />
        </CardContent>
      </Card>
    </PortalLayout>
  );
}
