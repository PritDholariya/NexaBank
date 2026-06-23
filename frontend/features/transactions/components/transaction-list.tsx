import Link from "next/link";
import { TransactionStatusBadge } from "@/features/transactions/components/transaction-status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatTransactionType } from "@/lib/format";
import type { Transaction } from "@/types/transaction";

type TransactionListProps = {
  transactions: Transaction[];
  userIban?: string;
  compact?: boolean;
  emptyMessage?: string;
};

export function TransactionList({
  transactions,
  userIban,
  compact = false,
  emptyMessage = "No transactions yet.",
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  const displayTransactions = compact ? transactions.slice(0, 5) : transactions;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="whitespace-nowrap">
                {formatDateTime(transaction.createdAt)}
              </TableCell>
              <TableCell>{formatTransactionType(transaction.type)}</TableCell>
              <TableCell className="max-w-xs truncate text-muted-foreground">
                {getTransactionDetail(transaction, userIban)}
              </TableCell>
              <TableCell>
                <TransactionStatusBadge status={transaction.status} />
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">
                {getAmountPrefix(transaction, userIban)}
                {formatCurrency(Number(transaction.amount))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {compact && transactions.length > 5 ? (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" asChild>
            <Link href="/portal/transactions">View all</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function getTransactionDetail(transaction: Transaction, userIban?: string) {
  if (transaction.description) {
    return transaction.description;
  }

  if (transaction.type === "DEPOSIT") {
    return "Deposit to your account";
  }

  if (transaction.type === "WITHDRAWAL") {
    return "Withdrawal from your account";
  }

  if (transaction.type === "TRANSFER") {
    if (userIban && transaction.senderIban === userIban) {
      return `To ${transaction.receiverIban ?? "recipient"}`;
    }
    return `From ${transaction.senderIban ?? "sender"}`;
  }

  return "—";
}

function getAmountPrefix(transaction: Transaction, userIban?: string) {
  if (transaction.type === "DEPOSIT") {
    return "+";
  }

  if (transaction.type === "WITHDRAWAL") {
    return "−";
  }

  if (transaction.type === "TRANSFER" && userIban) {
    return transaction.senderIban === userIban ? "−" : "+";
  }

  return "";
}
