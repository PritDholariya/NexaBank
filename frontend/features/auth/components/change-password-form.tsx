"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getRole, saveSession } from "@/lib/auth-session";
import { changePassword } from "@/services/auth-service";
import { ApiError } from "@/services/api-client";

export function ChangePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clientIdInput, setClientIdInput] = useState(
    searchParams.get("clientId") ?? "",
  );
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = useMemo(() => {
    return (
      clientIdInput.trim().length > 0 &&
      oldPassword.length > 0 &&
      newPassword.length >= 8 &&
      newPassword === confirmPassword
    );
  }, [clientIdInput, oldPassword, newPassword, confirmPassword]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation must match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await changePassword({
        clientId: clientIdInput,
        oldPassword,
        newPassword,
      });

      if (!response.token) {
        setError(response.message || "Password change failed.");
        return;
      }

      saveSession(response.token, clientIdInput);
      const role = getRole();
      router.push(role === "ROLE_ADMIN" ? "/admin/dashboard" : "/portal");
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(requestError.message || "Password change failed.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Change password"
      description="You must set a new password before continuing to your account."
      footer={
        <Link href="/login" className="font-medium text-primary">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clientId">Client ID</Label>
          <Input
            id="clientId"
            value={clientIdInput}
            onChange={(event) => setClientIdInput(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="oldPassword">Current password</Label>
          <Input
            id="oldPassword"
            type="password"
            value={oldPassword}
            onChange={(event) => setOldPassword(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">New password</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            minLength={8}
            required
          />
          <p className="text-xs text-muted-foreground">
            Minimum 8 characters.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            minLength={8}
            required
          />
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <Button
          type="submit"
          className="w-full"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update password"}
        </Button>
      </form>
    </AuthLayout>
  );
}
