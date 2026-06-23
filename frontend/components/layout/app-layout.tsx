"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { clearSession, getClientId } from "@/lib/auth-session";

type AppLayoutProps = {
  title: string;
  description?: string;
  children: ReactNode;
  variant?: "portal" | "admin";
  actions?: ReactNode;
};

export function AppLayout({
  title,
  description,
  children,
  variant = "portal",
  actions,
}: AppLayoutProps) {
  const router = useRouter();
  const clientId = getClientId();

  const onLogout = () => {
    clearSession();
    router.push(variant === "admin" ? "/admin/login" : "/login");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <BankIcon className="size-4" />
              </div>
              <span className="font-semibold">NexaBank</span>
            </Link>
            <Separator orientation="vertical" className="hidden h-6 sm:block" />
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {variant === "admin" ? "Admin Console" : "Online Banking"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {clientId ? (
              <span className="hidden text-sm text-muted-foreground md:inline">
                {clientId}
              </span>
            ) : null}
            {actions}
            <Button variant="outline" size="sm" onClick={onLogout}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {children}
      </main>
    </div>
  );
}

function BankIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 10h18M5 10V19M9 10V19M15 10V19M19 10V19M2 19h20M12 3l9 5H3l9-5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
