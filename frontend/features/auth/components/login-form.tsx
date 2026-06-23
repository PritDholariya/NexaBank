"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getRole, saveSession } from "@/lib/auth-session";
import { login } from "@/services/auth-service";
import { ApiError } from "@/services/api-client";

export function LoginForm() {
  const router = useRouter();
  const [clientId, setClientId] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await login({ clientId, password });

      if (response.token) {
        saveSession(response.token, clientId);
        const role = getRole();
        router.push(role === "ROLE_ADMIN" ? "/admin/dashboard" : "/portal");
        return;
      }

      setError(response.message || "Login failed.");
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        const message = requestError.message;
        if (
          requestError.status === 403 &&
          message === "PASSWORD_CHANGE_REQUIRED"
        ) {
          const params = new URLSearchParams({ clientId });
          router.push(`/change-password?${params.toString()}`);
          return;
        }

        setError(message || "Login failed. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      description="Enter your Client ID and password to access online banking."
      footer={
        <div className="space-y-2 text-muted-foreground">
          <p>
            New customer?{" "}
            <Link href="/open-account" className="font-medium text-primary">
              Open an account
            </Link>
          </p>
          <p>
            Bank staff?{" "}
            <Link href="/admin/login" className="font-medium text-primary">
              Admin sign in
            </Link>
          </p>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clientId">Client ID</Label>
          <Input
            id="clientId"
            value={clientId}
            onChange={(event) => setClientId(event.target.value)}
            placeholder="NEXA-XXXXXXXX"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthLayout>
  );
}
