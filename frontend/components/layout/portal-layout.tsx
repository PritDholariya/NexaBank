"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NotificationBell } from "@/features/notifications/components/notification-bell";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { clearSession, getClientId, getToken } from "@/lib/auth-session";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/portal", label: "Dashboard", exact: true },
  { href: "/portal/transactions", label: "Transactions" },
  { href: "/portal/notifications", label: "Notifications" },
];

type PortalLayoutProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function PortalLayout({
  title,
  description,
  children,
}: PortalLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const clientId = getClientId();
  const token = getToken();

  const onLogout = () => {
    clearSession();
    router.push("/login");
  };

  if (!token || !clientId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-md rounded-xl border bg-card p-6 text-center">
          <h1 className="text-lg font-semibold">Sign in required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Please sign in to access online banking.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

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
              Online Banking
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden text-sm text-muted-foreground md:inline">
              {clientId}
            </span>
            <NotificationBell />
            <Button variant="outline" size="sm" onClick={onLogout}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="border-b bg-background">
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-6">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

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
