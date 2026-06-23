"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { TransactionStatusBadge } from "@/features/transactions/components/transaction-status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/format";
import { withdraw } from "@/services/transaction-service";
import { ApiError } from "@/services/api-client";
import type { TransactionResponse } from "@/types/transaction";

type WithdrawFormProps = {
  availableBalance?: number;
  onSuccess?: () => void;
};

export function WithdrawForm({
  availableBalance,
  onSuccess,
}: WithdrawFormProps) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TransactionResponse | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount < 1) {
      setError("Minimum withdrawal amount is $1.00.");
      return;
    }

    if (
      availableBalance !== undefined &&
      parsedAmount > availableBalance
    ) {
      setError("Insufficient balance for this withdrawal.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await withdraw({
        amount: parsedAmount,
        description: description.trim() || undefined,
      });
      setResult(response);
      setAmount("");
      setDescription("");
      onSuccess?.();
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(requestError.message || "Withdrawal failed.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Withdraw funds</CardTitle>
        <CardDescription>
          Withdraw money from your account. Available balance is checked before
          processing.
          {availableBalance !== undefined
            ? ` Current balance: ${formatCurrency(availableBalance)}`
            : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="withdrawAmount">Amount (USD)</Label>
            <Input
              id="withdrawAmount"
              type="number"
              min={1}
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="50.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdrawDescription">Description (optional)</Label>
            <Textarea
              id="withdrawDescription"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="e.g. ATM withdrawal"
            />
          </div>

          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {result ? (
            <Alert className="border-green-200 bg-green-50 text-green-900">
              <AlertTitle>Withdrawal initiated</AlertTitle>
              <AlertDescription className="text-green-800">
                {result.message}
                <br />
                Amount: {formatCurrency(Number(result.amount))} ·{" "}
                <TransactionStatusBadge status={result.status} />
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Withdraw"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/portal")}
            >
              Back to dashboard
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
