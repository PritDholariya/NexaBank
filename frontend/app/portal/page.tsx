"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { clearSession, getClientId, getToken } from "@/lib/auth-session";
import { useRouter } from "next/navigation";
import { getMyProfile } from "@/services/account-service";
import { ApiError } from "@/services/api-client";
import type { UserProfileResponse } from "@/types/account";

export default function PortalPage() {
  const router = useRouter();
  const token = useMemo(() => getToken(), []);
  const clientId = useMemo(() => getClientId(), []);
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let active = true;

    const loadProfile = async () => {
      try {
        const data = await getMyProfile();
        if (active) {
          setProfile(data);
          setError(null);
        }
      } catch (requestError) {
        if (!active) {
          return;
        }

        if (requestError instanceof ApiError && requestError.status === 401) {
          clearSession();
          router.push("/login");
          return;
        }

        setError("Unable to load profile details right now.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [router, token]);

  const onLogout = () => {
    clearSession();
    router.push("/login");
  };

  if (!token || !clientId) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#eef3ff_0%,#ffffff_100%)] px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-xl rounded-3xl border border-[#dce5ff] bg-white p-7 text-center shadow-[0_26px_80px_-45px_rgba(32,73,153,0.34)] sm:p-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#172856]">Session not found</h1>
          <p className="mt-3 text-sm text-[#55668c]">Please login first to access your portal.</p>
          <Link href="/login" className="mt-6 inline-block rounded-xl bg-[#255fe6] px-5 py-2.5 text-sm font-bold text-white">
            Go to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#edf3ff_0%,#fefeff_100%)] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-3xl border border-[#d4e1ff] bg-[linear-gradient(140deg,#1948c4_0%,#356ff4_100%)] p-7 text-white shadow-[0_28px_90px_-48px_rgba(20,54,131,0.58)] sm:p-9">
          <p className="text-sm tracking-[0.15em] uppercase text-[#dce6ff]">NexaBank Secure Portal</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Welcome back</h1>
          <p className="mt-3 text-sm text-[#e8eeff]">You are signed in as Client ID: <span className="font-bold">{clientId}</span></p>
          <button
            type="button"
            onClick={onLogout}
            className="mt-5 rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#1f4ac2]"
          >
            Logout
          </button>
        </section>

        {loading ? <p className="text-sm font-semibold text-[#4b5f8f]">Loading your banking profile...</p> : null}
        {error ? <p className="rounded-xl border border-[#ffd5d5] bg-[#fff5f5] px-3 py-2 text-sm text-[#aa1f1f]">{error}</p> : null}

        {profile ? (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card title="Account Holder" value={profile.name} caption={profile.email} />
            <Card title="Client ID" value={profile.clientId} caption={`Type: ${profile.accountType}`} />
            <Card title="IBAN" value={profile.iban} caption={`BIC: ${profile.bic}`} />
            <Card title="Available Balance" value={`$${Number(profile.balance).toFixed(2)}`} caption="Live from account service" />
            <Card title="Phone" value={profile.phoneNumber} caption="Registered contact" />
            <Card title="Address" value={profile.address} caption="KYC verified address" />
          </section>
        ) : null}
      </div>
    </main>
  );
}

function Card({ title, value, caption }: { title: string; value: string; caption: string }) {
  return (
    <article className="rounded-2xl border border-[#dde6ff] bg-white p-5 shadow-[0_20px_60px_-42px_rgba(24,60,140,0.35)]">
      <p className="text-sm font-semibold text-[#4b5f8f]">{title}</p>
      <p className="mt-2 text-2xl font-extrabold text-[#142856]">{value}</p>
      <p className="mt-2 text-sm text-[#697ca4]">{caption}</p>
    </article>
  );
}
