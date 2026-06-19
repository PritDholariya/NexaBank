"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { approveAccount } from "@/services/account-service";
import { ApiError } from "@/services/api-client";
import type { AccountApprovalResponse } from "@/types/account";

export default function AdminApprovalsPage() {
  const [customerId, setCustomerId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approval, setApproval] = useState<AccountApprovalResponse | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setApproval(null);

    const parsedId = Number(customerId);
    if (Number.isNaN(parsedId) || parsedId <= 0) {
      setError("Please enter a valid positive customer ID.");
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
        setError("Unexpected approval error.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eff5ff_0%,#ffffff_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-3xl border border-[#d8e3ff] bg-white p-6 shadow-[0_25px_90px_-50px_rgba(29,71,152,0.36)] sm:p-10">
        <p className="text-xs font-extrabold tracking-[0.2em] text-[#5065cb] uppercase">Admin Console</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#172856]">Approve pending application</h1>
        <p className="mt-2 text-sm text-[#55668c]">
          Current backend supports direct approval by Customer ID. Use this screen to trigger account creation and credentials generation.
        </p>

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#304777]">Customer ID</span>
            <input
              type="number"
              value={customerId}
              onChange={(event) => setCustomerId(event.target.value)}
              className="w-full rounded-xl border border-[#cddcff] px-3 py-2.5 text-[#1f2e53] outline-none transition focus:border-[#3664ea] focus:ring-4 focus:ring-[#dee8ff]"
              min={1}
              required
            />
          </label>

          {error ? <p className="rounded-xl border border-[#ffd5d5] bg-[#fff5f5] px-3 py-2 text-sm text-[#aa1f1f]">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-[linear-gradient(135deg,#1d4bc9_0%,#346df6_100%)] px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Approving..." : "Approve application"}
          </button>
        </form>

        {approval ? (
          <section className="mt-7 rounded-2xl border border-[#b8e9cb] bg-[#effdf4] p-5">
            <h2 className="text-lg font-bold text-[#0f6b37]">Approval successful</h2>
            <p className="mt-3 text-sm text-[#205931]">Client ID: <span className="font-bold">{approval.clientId}</span></p>
            <p className="text-sm text-[#205931]">IBAN: <span className="font-bold">{approval.iban}</span></p>
            <p className="text-sm text-[#205931]">BIC: <span className="font-bold">{approval.bic}</span></p>
            <p className="mt-2 text-sm text-[#1a7a46]">{approval.message}</p>
          </section>
        ) : null}

        <div className="mt-6 text-sm">
          <Link href="/" className="font-semibold text-[#3057d6]">Back to home</Link>
        </div>
      </div>
    </main>
  );
}
