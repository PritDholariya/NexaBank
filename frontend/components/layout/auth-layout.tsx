import type { ReactNode } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthLayout({
  title,
  description,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-lg font-semibold"
            >
              <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <BankIcon className="size-4" />
              </div>
              NexaBank
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
          </Card>

          {footer ? (
            <div className="mt-6 text-center text-sm">{footer}</div>
          ) : null}
        </div>
      </div>
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
