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
import { deposit } from "@/services/transaction-service";
import { ApiError } from "@/services/api-client";
import type { TransactionResponse } from "@/types/transaction";

type DepositFormProps = {
  onSuccess?: () => void;
};

export function DepositForm({ onSuccess }: DepositFormProps) {
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
      setError("Minimum deposit amount is $1.00.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await deposit({
        amount: parsedAmount,
        description: description.trim() || undefined,
      });
      setResult(response);
      setAmount("");
      setDescription("");
      onSuccess?.();
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(requestError.message || "Deposit failed.");
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
        <CardTitle>Deposit funds</CardTitle>
        <CardDescription>
          Add money to your NexaBank account. Deposits are processed
          asynchronously.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="depositAmount">Amount (USD)</Label>
            <Input
              id="depositAmount"
              type="number"
              min={1}
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="100.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="depositDescription">Description (optional)</Label>
            <Textarea
              id="depositDescription"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="e.g. Salary deposit"
            />
          </div>

          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {result ? (
            <Alert className="border-green-200 bg-green-50 text-green-900">
              <AlertTitle>Deposit initiated</AlertTitle>
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
              {isSubmitting ? "Processing..." : "Deposit"}
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
