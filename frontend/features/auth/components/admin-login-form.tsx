"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clearSession, getRole, saveSession } from "@/lib/auth-session";
import { login } from "@/services/auth-service";
import { ApiError } from "@/services/api-client";

export function AdminLoginForm() {
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

      if (!response.token) {
        setError(response.message || "Sign in failed.");
        return;
      }

      saveSession(response.token, clientId);
      const role = getRole();

      if (role !== "ROLE_ADMIN") {
        clearSession();
        setError("This account does not have administrator access.");
        return;
      }

      router.push("/admin/dashboard");
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

        setError(message || "Sign in failed.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Admin sign in"
      description="Sign in with administrator credentials to manage customer applications."
      footer={
        <div className="space-y-2 text-muted-foreground">
          <p>
            Customer?{" "}
            <Link href="/login" className="font-medium text-primary">
              Customer sign in
            </Link>
          </p>
          <p>
            <Link href="/" className="font-medium text-primary">
              Back to homepage
            </Link>
          </p>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="adminClientId">Admin Client ID</Label>
          <Input
            id="adminClientId"
            value={clientId}
            onChange={(event) => setClientId(event.target.value)}
            placeholder="NEXA-MASTER-ADMIN"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="adminPassword">Password</Label>
          <Input
            id="adminPassword"
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
