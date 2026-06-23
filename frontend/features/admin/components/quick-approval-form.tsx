"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { useRequireAuth } from "@/features/auth/hooks/use-require-auth";
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
import { approveAccount } from "@/services/account-service";
import { ApiError } from "@/services/api-client";
import type { AccountApprovalResponse } from "@/types/account";

export function QuickApprovalForm() {
  useRequireAuth({ adminOnly: true });

  const [customerId, setCustomerId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approval, setApproval] = useState<AccountApprovalResponse | null>(
    null,
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setApproval(null);

    const parsedId = Number(customerId);
    if (Number.isNaN(parsedId) || parsedId <= 0) {
      setError("Please enter a valid customer ID.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await approveAccount(parsedId);
      setApproval(response);
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(requestError.message || "Approval failed.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout
      title="Quick approve"
      description="Approve a pending application by customer ID."
      variant="admin"
      actions={
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/dashboard">Full dashboard</Link>
        </Button>
      }
    >
      <div className="mx-auto max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Approve by ID</CardTitle>
            <CardDescription>
              Enter the customer ID from a pending application to generate
              credentials and activate the account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer ID</Label>
                <Input
                  id="customerId"
                  type="number"
                  value={customerId}
                  onChange={(event) => setCustomerId(event.target.value)}
                  min={1}
                  required
                />
              </div>

              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              {approval ? (
                <Alert className="border-green-200 bg-green-50 text-green-900">
                  <AlertTitle>Account approved</AlertTitle>
                  <AlertDescription className="text-green-800">
                    Client ID: <strong>{approval.clientId}</strong>
                    <br />
                    IBAN: <strong>{approval.iban}</strong>
                    <br />
                    BIC: <strong>{approval.bic}</strong>
                    <br />
                    {approval.message}
                  </AlertDescription>
                </Alert>
              ) : null}

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Approving..." : "Approve application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
