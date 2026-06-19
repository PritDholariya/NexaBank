"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { registerAccount } from "@/services/account-service";
import { ApiError } from "@/services/api-client";
import type { AccountRegistrationRequest, AccountType, CustomerStatus } from "@/types/account";

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

export default function OpenAccountPage() {
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
      window.sessionStorage.setItem("nexabank.application.customerId", String(response.customerId));
      setForm(initialForm);
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(requestError.message || "Registration failed. Please check details and retry.");
      } else {
        setError("Unexpected error while registering your account.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onChange = <K extends keyof AccountRegistrationRequest>(key: K, value: AccountRegistrationRequest[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f1f4ff_0%,#fbfcff_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-[#dce3ff] bg-white p-6 shadow-[0_24px_80px_-45px_rgba(39,70,152,0.28)] sm:p-10">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-[0.16em] text-[#4f66d5] uppercase">NexaBank Onboarding</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#16264a] sm:text-4xl">Open your account</h1>
          <p className="mt-3 text-[#4f5d7b]">
            Submit your details for admin review. After approval, you will receive your Client ID, IBAN, and first-time login credentials.
          </p>
        </div>

        {result ? (
          <section className="mb-8 rounded-2xl border border-[#b6ebcb] bg-[#effdf4] p-5">
            <h2 className="text-lg font-bold text-[#0f6b37]">Application received</h2>
            <p className="mt-2 text-sm text-[#1a7a46]">{result.message}</p>
            <p className="mt-3 text-sm text-[#205931]">Customer ID: <span className="font-bold">{result.customerId}</span></p>
            <p className="text-sm text-[#205931]">Status: <span className="font-bold">{result.status}</span></p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/login" className="rounded-xl bg-[#155dfc] px-4 py-2 text-sm font-semibold text-white">Go to login</Link>
              <button
                type="button"
                onClick={() => setResult(null)}
                className="rounded-xl border border-[#6e8ce6] px-4 py-2 text-sm font-semibold text-[#2a4ab5]"
              >
                Submit another application
              </button>
            </div>
          </section>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full Name">
              <input value={form.name} onChange={(event) => onChange("name", event.target.value)} className={inputClass} required />
            </Field>
            <Field label="Email Address">
              <input type="email" value={form.email} onChange={(event) => onChange("email", event.target.value)} className={inputClass} required />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Phone Number">
              <input value={form.phoneNumber} onChange={(event) => onChange("phoneNumber", event.target.value)} className={inputClass} required />
            </Field>
            <Field label="Date of Birth">
              <input type="date" value={form.dateOfBirth} onChange={(event) => onChange("dateOfBirth", event.target.value)} className={inputClass} required />
            </Field>
          </div>

          <Field label="Residential Address">
            <textarea value={form.address} onChange={(event) => onChange("address", event.target.value)} className={`${inputClass} min-h-24`} required />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Government ID">
              <input value={form.governmentId} onChange={(event) => onChange("governmentId", event.target.value)} className={inputClass} required />
            </Field>
            <Field label="Preferred Account Type">
              <select
                value={form.accountType}
                onChange={(event) => onChange("accountType", event.target.value as AccountType)}
                className={inputClass}
              >
                <option value="SAVINGS">Savings</option>
                <option value="CURRENT">Current</option>
              </select>
            </Field>
          </div>

          {error ? <p className="rounded-xl border border-[#ffd5d5] bg-[#fff3f3] px-4 py-3 text-sm text-[#aa1f1f]">{error}</p> : null}

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[linear-gradient(135deg,#1347c5_0%,#2463eb_100%)] px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Submitting application..." : "Submit application"}
            </button>
            <Link href="/" className="text-sm font-semibold text-[#3550aa]">
              Back to home
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#ccd8fb] bg-white px-3 py-2.5 text-[#14213f] shadow-sm outline-none transition focus:border-[#3a6af0] focus:ring-4 focus:ring-[#d8e4ff]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-[#32456f]">{label}</span>
      {children}
    </label>
  );
}
