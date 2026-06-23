import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    title: "Secure accounts",
    description:
      "Protected sign-in, encrypted data, and account controls designed for everyday banking.",
  },
  {
    title: "Easy transfers",
    description:
      "Send money between NexaBank accounts quickly with clear transaction history.",
  },
  {
    title: "Admin onboarding",
    description:
      "New customers apply online. Bank staff review and approve applications securely.",
  },
  {
    title: "Real-time updates",
    description:
      "Balance changes and transaction notifications keep customers informed.",
  },
];

const accountTypes = [
  {
    name: "Savings",
    fee: "No monthly fee",
    description: "For personal savings and everyday deposits.",
  },
  {
    name: "Current",
    fee: "No monthly fee",
    description: "For salary credits and regular payments.",
    highlighted: true,
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main>
        <section className="border-b bg-background">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <div className="max-w-2xl">
              <Badge variant="secondary" className="mb-4">
                Digital banking platform
              </Badge>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Banking that is clear, secure, and easy to use
              </h1>
              <p className="mt-5 text-lg text-muted-foreground">
                NexaBank helps customers open accounts, manage balances, and
                complete transactions through a straightforward online experience.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link href="/open-account">Open an account</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">Sign in to banking</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight">
                Everything you need to bank online
              </h2>
              <p className="mt-3 text-muted-foreground">
                A practical set of features built for customers and bank staff.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <CardHeader>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="accounts" className="border-y bg-muted/40 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight">
                Account options
              </h2>
              <p className="mt-3 text-muted-foreground">
                Choose the account type that fits your needs. Applications are
                reviewed by our team before activation.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {accountTypes.map((account) => (
                <Card
                  key={account.name}
                  className={
                    account.highlighted ? "border-primary/30 shadow-sm" : ""
                  }
                >
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle>{account.name} account</CardTitle>
                      {account.highlighted ? (
                        <Badge>Popular</Badge>
                      ) : null}
                    </div>
                    <CardDescription>{account.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium">{account.fee}</p>
                    <Button className="mt-4" variant="outline" asChild>
                      <Link href="/open-account">Apply now</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="security" className="py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Security you can rely on</CardTitle>
                <CardDescription>
                  NexaBank uses role-based access, secure authentication, and
                  protected APIs to keep customer data safe.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-3 text-sm sm:grid-cols-3">
                  <li className="rounded-lg border bg-muted/30 px-4 py-3">
                    JWT-secured API gateway
                  </li>
                  <li className="rounded-lg border bg-muted/30 px-4 py-3">
                    Admin-reviewed account opening
                  </li>
                  <li className="rounded-lg border bg-muted/30 px-4 py-3">
                    Mandatory password change on first login
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="border-t bg-primary py-16 text-primary-foreground">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-semibold tracking-tight">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
              Submit your application in minutes. Once approved, you will receive
              your login credentials and can access online banking immediately.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                variant="secondary"
                className="bg-background text-foreground hover:bg-background/90"
                asChild
              >
                <Link href="/open-account">Open account</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link href="/login">Customer sign in</Link>
              </Button>
            </div>
            <Separator className="mx-auto my-8 max-w-xs bg-primary-foreground/20" />
            <p className="text-sm text-primary-foreground/70">
              Bank staff can access the{" "}
              <Link
                href="/admin/login"
                className="font-medium underline underline-offset-4"
              >
                admin portal
              </Link>
              .
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
