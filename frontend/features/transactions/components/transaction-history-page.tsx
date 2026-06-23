"use client";

import { useMemo, useState } from "react";
import { useProfile } from "@/features/account/hooks/use-profile";
import { TransactionList } from "@/features/transactions/components/transaction-list";
import { useTransactions } from "@/features/transactions/hooks/use-transactions";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TransactionStatus, TransactionType } from "@/types/transaction";

type FilterValue = "ALL" | TransactionType | TransactionStatus;

const filters: Array<{ label: string; value: FilterValue }> = [
  { label: "All", value: "ALL" },
  { label: "Deposits", value: "DEPOSIT" },
  { label: "Withdrawals", value: "WITHDRAWAL" },
  { label: "Transfers", value: "TRANSFER" },
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Failed", value: "FAILED" },
];

export function TransactionHistoryPage() {
  const { profile } = useProfile();
  const { transactions, loading, error } = useTransactions({
    pollIntervalMs: 10_000,
  });
  const [filter, setFilter] = useState<FilterValue>("ALL");
  const [search, setSearch] = useState("");

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesFilter =
        filter === "ALL" ||
        transaction.type === filter ||
        transaction.status === filter;

      if (!matchesFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      const fields = [
        transaction.type,
        transaction.status,
        transaction.description ?? "",
        transaction.senderIban ?? "",
        transaction.receiverIban ?? "",
        String(transaction.amount),
      ];

      return fields.some((field) => field.toLowerCase().includes(query));
    });
  }, [transactions, filter, search]);

  return (
    <PortalLayout
      title="Transaction history"
      description="View and filter all deposits, withdrawals, and transfers."
    >
      <Card>
        <CardHeader className="space-y-4">
          <CardTitle>All transactions</CardTitle>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Tabs
              value={filter}
              onValueChange={(value) => setFilter(value as FilterValue)}
            >
              <TabsList className="h-auto flex-wrap">
                {filters.map((item) => (
                  <TabsTrigger key={item.value} value={item.value}>
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search transactions..."
              className="max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <TransactionList
              transactions={filteredTransactions}
              userIban={profile?.iban}
              emptyMessage="No transactions match your filters."
            />
          )}
        </CardContent>
      </Card>
    </PortalLayout>
  );
}
