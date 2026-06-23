"use client";

import Link from "next/link";
import { useProfile } from "@/features/account/hooks/use-profile";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { TransactionList } from "@/features/transactions/components/transaction-list";
import { useTransactions } from "@/features/transactions/hooks/use-transactions";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { formatCurrency } from "@/lib/format";

const quickActions = [
  { href: "/portal/deposit", label: "Deposit", description: "Add funds" },
  { href: "/portal/withdraw", label: "Withdraw", description: "Take out cash" },
  { href: "/portal/transfer", label: "Transfer", description: "Send to IBAN" },
];

export function PortalDashboard() {
  const { profile, loading: profileLoading, error: profileError } = useProfile();
  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
  } = useTransactions({ pollIntervalMs: 10_000 });
  const { notifications, loading: notificationsLoading } = useNotifications({
    pollIntervalMs: 30_000,
  });

  const recentNotifications = notifications.slice(0, 3);

  return (
    <PortalLayout
      title={`Welcome${profile ? `, ${profile.name.split(" ")[0]}` : ""}`}
      description="Manage your balance, transactions, and account activity."
    >
      {profileError ? (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{profileError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {profileLoading ? (
            <Skeleton className="h-36 w-full" />
          ) : profile ? (
            <Card className="border-primary/20">
              <CardHeader>
                <CardDescription>Available balance</CardDescription>
                <CardTitle className="text-4xl font-semibold tabular-nums">
                  {formatCurrency(Number(profile.balance))}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary">{profile.accountType}</Badge>
                  <span>IBAN: {profile.iban}</span>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <div>
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">
              Quick actions
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {quickActions.map((action) => (
                <Card
                  key={action.href}
                  size="sm"
                  className="transition-colors hover:border-primary/30"
                >
                  <CardHeader>
                    <CardTitle className="text-base">{action.label}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link href={action.href}>Continue</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Recent transactions</CardTitle>
                <CardDescription>Your latest account activity</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/portal/transactions">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-full" />
                  ))}
                </div>
              ) : transactionsError ? (
                <p className="text-sm text-destructive">{transactionsError}</p>
              ) : (
                <TransactionList
                  transactions={transactions}
                  userIban={profile?.iban}
                  compact
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {profile ? (
            <Card size="sm">
              <CardHeader>
                <CardTitle>Account details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Detail label="Client ID" value={profile.clientId} />
                <Detail label="BIC" value={profile.bic} />
                <Detail label="Email" value={profile.email} />
                <Detail label="Phone" value={profile.phoneNumber} />
              </CardContent>
            </Card>
          ) : null}

          <Card size="sm">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Notifications</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/portal/notifications">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {notificationsLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : recentNotifications.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No notifications yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {recentNotifications.map((notification) => (
                    <li
                      key={notification.id}
                      className={`text-sm ${notification.isRead ? "text-muted-foreground" : "font-medium"}`}
                    >
                      {notification.message}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium break-all">{value}</p>
    </div>
  );
}
