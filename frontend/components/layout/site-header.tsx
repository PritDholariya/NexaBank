import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#accounts", label: "Accounts" },
  { href: "/#security", label: "Security" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BankIcon className="size-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            NexaBank
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/open-account">Open account</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <BankIcon className="size-4" />
              </div>
              <span className="text-lg font-semibold">NexaBank</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Secure digital banking for individuals and businesses. Manage
              accounts, transfers, and finances in one place.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold">Product</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/open-account" className="hover:text-foreground">
                  Open account
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground">
                  Online banking
                </Link>
              </li>
              <li>
                <Link href="/#accounts" className="hover:text-foreground">
                  Account types
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">Support</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/admin/login" className="hover:text-foreground">
                  Admin portal
                </Link>
              </li>
              <li>
                <Link href="/#security" className="hover:text-foreground">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} NexaBank. All rights reserved.
        </p>
      </div>
    </footer>
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
