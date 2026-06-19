"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth-service";
import { ApiError } from "@/services/api-client";
import { getRole, saveSession } from "@/lib/auth-session";

export default function AdminLoginPage() {
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
        setError(response.message || "Admin login failed.");
        return;
      }

      saveSession(response.token, clientId);
      const role = getRole();

      if (role !== "ROLE_ADMIN") {
        setError("This account does not have admin permissions.");
        return;
      }

      router.push("/admin/dashboard");
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        const message = requestError.message;
        if (requestError.status === 403 && message === "PASSWORD_CHANGE_REQUIRED") {
          const params = new URLSearchParams({ clientId });
          router.push(`/change-password?${params.toString()}`);
          return;
        }

        setError(message || "Admin login failed.");
      } else {
        setError("Unexpected admin login error.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e7edff_0%,#f8fbff_40%,#ffffff_100%)] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-md rounded-3xl border border-[#dce5ff] bg-white p-7 shadow-[0_30px_90px_-50px_rgba(30,68,154,0.42)] sm:p-9">
        <p className="text-xs font-extrabold tracking-[0.2em] text-[#4f64cb] uppercase">NexaBank Admin</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#172856]">Admin login</h1>
        <p className="mt-2 text-sm text-[#55668c]">Use admin credentials to manage customer applications.</p>

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#304777]">Admin Client ID</span>
            <input
              value={clientId}
              onChange={(event) => setClientId(event.target.value)}
              className={inputClass}
              placeholder="NEXA-XXXXXXXX"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#304777]">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClass}
              required
            />
          </label>

          {error ? <p className="rounded-xl border border-[#ffd5d5] bg-[#fff5f5] px-3 py-2 text-sm text-[#aa1f1f]">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-xl bg-[linear-gradient(135deg,#1d4bc9_0%,#346df6_100%)] px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in as admin"}
          </button>
        </form>

        <div className="mt-6 flex flex-wrap justify-between gap-2 text-sm">
          <Link href="/login" className="font-semibold text-[#3057d6]">Customer login</Link>
          <Link href="/" className="font-semibold text-[#60729d]">Back to home</Link>
        </div>
      </div>
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#cddcff] px-3 py-2.5 text-[#1f2e53] outline-none transition focus:border-[#3664ea] focus:ring-4 focus:ring-[#dee8ff]";
