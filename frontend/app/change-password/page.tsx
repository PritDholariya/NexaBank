"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { changePassword } from "@/services/auth-service";
import { ApiError } from "@/services/api-client";
import { getRole, saveSession } from "@/lib/auth-session";

export default function ChangePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clientIdInput, setClientIdInput] = useState(searchParams.get("clientId") ?? "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = useMemo(() => {
    return clientIdInput.trim().length > 0 && oldPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword;
  }, [clientIdInput, oldPassword, newPassword, confirmPassword]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password must match.");
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
        setError("Unexpected error while changing password.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef3ff_0%,#ffffff_100%)] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-lg rounded-3xl border border-[#dce5ff] bg-white p-7 shadow-[0_26px_80px_-45px_rgba(32,73,153,0.34)] sm:p-9">
        <p className="text-xs font-extrabold tracking-[0.2em] text-[#4f64cb] uppercase">First Login Security</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#172856]">Set a new password</h1>
        <p className="mt-2 text-sm text-[#55668c]">For security reasons, update your initial temporary password before accessing the portal.</p>

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <Field label="Client ID">
            <input value={clientIdInput} onChange={(event) => setClientIdInput(event.target.value)} className={inputClass} required />
          </Field>

          <Field label="Old password">
            <input type="password" value={oldPassword} onChange={(event) => setOldPassword(event.target.value)} className={inputClass} required />
          </Field>

          <Field label="New password (min 8 chars)">
            <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className={inputClass} minLength={8} required />
          </Field>

          <Field label="Confirm new password">
            <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className={inputClass} minLength={8} required />
          </Field>

          {error ? <p className="rounded-xl border border-[#ffd5d5] bg-[#fff5f5] px-3 py-2 text-sm text-[#aa1f1f]">{error}</p> : null}

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="mt-2 w-full rounded-xl bg-[linear-gradient(135deg,#1d4bc9_0%,#346df6_100%)] px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Updating password..." : "Update password"}
          </button>
        </form>

        <div className="mt-6 text-sm">
          <Link href="/login" className="font-semibold text-[#3057d6]">Back to login</Link>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-[#304777]">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#cddcff] px-3 py-2.5 text-[#1f2e53] outline-none transition focus:border-[#3664ea] focus:ring-4 focus:ring-[#dee8ff]";
