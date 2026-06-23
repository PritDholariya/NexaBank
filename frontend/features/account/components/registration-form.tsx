"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/layout/site-header";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { registerAccount } from "@/services/account-service";
import { ApiError } from "@/services/api-client";
import type {
  AccountRegistrationRequest,
  AccountType,
  CustomerStatus,
} from "@/types/account";

type RegistrationState = {
  customerId: number;
  status: CustomerStatus;
  message: string;
} | null;

const initialForm: AccountRegistrationRequest = {
  name: "",
  email: "",
  phoneNumber: "",
  address: "",
  dateOfBirth: "",
  governmentId: "",
  accountType: "SAVINGS",
};

export function RegistrationForm() {
  const [form, setForm] = useState<AccountRegistrationRequest>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RegistrationState>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await registerAccount(form);
      setResult(response);
      setForm(initialForm);
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(
          requestError.message ||
            "Registration failed. Please check your details.",
        );
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onChange = <K extends keyof AccountRegistrationRequest>(
    key: K,
    value: AccountRegistrationRequest[K],
  ) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-muted/30 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">
              Open an account
            </h1>
            <p className="mt-2 text-muted-foreground">
              Complete the form below. Your application will be reviewed by our
              team before your account is activated.
            </p>
          </div>

          {result ? (
            <Alert className="mb-6 border-green-200 bg-green-50 text-green-900">
              <AlertTitle>Application submitted</AlertTitle>
              <AlertDescription className="text-green-800">
                {result.message}
                <br />
                Customer ID: <strong>{result.customerId}</strong> · Status:{" "}
                <strong>{result.status}</strong>
              </AlertDescription>
              <div className="mt-4 flex gap-2">
                <Button size="sm" asChild>
                  <Link href="/login">Go to sign in</Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setResult(null)}
                >
                  Submit another
                </Button>
              </div>
            </Alert>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Application details</CardTitle>
              <CardDescription>
                All fields are required. Please ensure your information is
                accurate.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(event) => onChange("name", event.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        onChange("email", event.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                      id="phone"
                      value={form.phoneNumber}
                      onChange={(event) =>
                        onChange("phoneNumber", event.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(event) =>
                        onChange("dateOfBirth", event.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Residential address</Label>
                  <Textarea
                    id="address"
                    value={form.address}
                    onChange={(event) =>
                      onChange("address", event.target.value)
                    }
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="govId">Government ID</Label>
                    <Input
                      id="govId"
                      value={form.governmentId}
                      onChange={(event) =>
                        onChange("governmentId", event.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Account type</Label>
                    <Select
                      value={form.accountType}
                      onValueChange={(value) =>
                        onChange("accountType", value as AccountType)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SAVINGS">Savings</SelectItem>
                        <SelectItem value="CURRENT">Current</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {error ? (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : null}

                <div className="flex flex-wrap gap-3">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit application"}
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
