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
import { transfer } from "@/services/transaction-service";
import { ApiError } from "@/services/api-client";
import type { TransactionResponse } from "@/types/transaction";

type TransferFormProps = {
  senderIban?: string;
  availableBalance?: number;
  onSuccess?: () => void;
};

export function TransferForm({
  senderIban,
  availableBalance,
  onSuccess,
}: TransferFormProps) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [receiverIban, setReceiverIban] = useState("");
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
      setError("Minimum transfer amount is $1.00.");
      return;
    }

    if (!receiverIban.trim()) {
      setError("Receiver IBAN is required.");
      return;
    }

    if (senderIban && receiverIban.trim() === senderIban) {
      setError("You cannot transfer to your own account.");
      return;
    }

    if (
      availableBalance !== undefined &&
      parsedAmount > availableBalance
    ) {
      setError("Insufficient balance for this transfer.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await transfer({
        amount: parsedAmount,
        receiverIban: receiverIban.trim(),
        description: description.trim() || undefined,
      });
      setResult(response);
      setAmount("");
      setReceiverIban("");
      setDescription("");
      onSuccess?.();
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(requestError.message || "Transfer failed.");
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
        <CardTitle>Transfer funds</CardTitle>
        <CardDescription>
          Send money to another NexaBank account using the recipient&apos;s IBAN.
          {availableBalance !== undefined
            ? ` Available balance: ${formatCurrency(availableBalance)}`
            : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="receiverIban">Receiver IBAN</Label>
            <Input
              id="receiverIban"
              value={receiverIban}
              onChange={(event) => setReceiverIban(event.target.value)}
              placeholder="NEXA-IBAN-XXXXXXXX"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transferAmount">Amount (USD)</Label>
            <Input
              id="transferAmount"
              type="number"
              min={1}
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="75.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transferDescription">Description (optional)</Label>
            <Textarea
              id="transferDescription"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="e.g. Rent payment"
            />
          </div>

          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {result ? (
            <Alert className="border-green-200 bg-green-50 text-green-900">
              <AlertTitle>Transfer initiated</AlertTitle>
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
              {isSubmitting ? "Processing..." : "Transfer"}
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
