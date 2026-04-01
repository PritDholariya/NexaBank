import Link from "next/link";
import { Manrope, Playfair_Display } from "next/font/google";

import { Button } from "@/components/ui/button";

const headingFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const services = [
  {
    title: "Instant Digital Banking",
    description:
      "Track balances, transfer funds, and manage cards in seconds from one secure dashboard.",
  },
  {
    title: "Smart Loan Guidance",
    description:
      "Get eligibility insights, transparent rates, and guided repayment plans tailored to your profile.",
  },
  {
    title: "Business Cashflow Tools",
    description:
      "Automate invoices, monitor incoming payments, and optimize working capital for your business.",
  },
];

const facilities = [
  "24x7 UPI, IMPS, and NEFT transfers",
  "Zero hidden charges with transparent fee cards",
  "AI-powered fraud alerts and card controls",
  "Dedicated relationship manager for premium plans",
];

export default function Home() {
  return (
    <div
      className={`${bodyFont.className} min-h-screen bg-[radial-gradient(circle_at_15%_15%,#cae8d8_0%,transparent_34%),radial-gradient(circle_at_85%_0%,#b8e0f7_0%,transparent_32%),linear-gradient(160deg,#f4f8f7_0%,#f7f1e6_100%)] text-slate-900`}
    >
      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-8 sm:px-10 lg:px-12">
        <header className="sticky top-4 z-30 mb-6">
          <nav className="flex items-center justify-between gap-4 rounded-2xl border border-slate-900/10 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-md sm:px-5">
            <Link href="#home" className="text-base font-extrabold tracking-wide text-slate-900">
              NexaBank
            </Link>
            <div className="hidden items-center gap-4 text-sm font-medium text-slate-700 sm:flex">
              <Link href="#services" className="transition-colors hover:text-slate-950">
                Services
              </Link>
              <Link href="#facilities" className="transition-colors hover:text-slate-950">
                Facilities
              </Link>
              <Link href="#accounts" className="transition-colors hover:text-slate-950">
                Accounts
              </Link>
            </div>
            <Button asChild size="sm" className="bg-slate-900 text-slate-100 hover:bg-slate-800">
              <Link href="#accounts">Open Account</Link>
            </Button>
          </nav>
        </header>

        <section
          id="home"
          className="scroll-mt-24 relative overflow-hidden rounded-3xl border border-slate-900/10 bg-[#06253a] px-6 py-10 text-white shadow-[0_20px_60px_-25px_rgba(6,37,58,0.75)] animate-in fade-in slide-in-from-top-4 duration-700 sm:px-10 sm:py-14"
        >
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#2daac9]/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#f0b452]/35 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <p className="inline-flex rounded-full border border-white/35 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-white/90 uppercase">
                Trusted by 1M+ customers
              </p>
              <h1
                className={`${headingFont.className} text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl`}
              >
                Banking that feels premium, fast, and secure.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-100/90 sm:text-lg">
                NexaBank brings modern finance to everyday life with secure
                payments, intelligent money tools, and account plans made for
                both individuals and businesses.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#f0b452] text-slate-950 hover:bg-[#f3c173]"
                >
                  <Link href="#accounts">Open an Account</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/35 bg-white/5 text-white hover:bg-white/20"
                >
                  <Link href="#services">Explore Services</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-sm text-slate-100/85">Avg. Onboarding Time</p>
                <p className="text-3xl font-bold">6 min</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-sm text-slate-100/85">Support Availability</p>
                <p className="text-3xl font-bold">24x7</p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="services"
          className="scroll-mt-24 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100"
        >
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className={`${headingFont.className} text-3xl font-semibold sm:text-4xl`}>
              Services that move with your goals
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="rounded-2xl border border-slate-900/10 bg-white/80 p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1"
              >
                <h3 className="text-lg font-bold text-slate-900">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="facilities"
          className="scroll-mt-24 mt-10 grid gap-4 rounded-3xl border border-slate-900/10 bg-white/70 p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center"
        >
          <div>
            <h2 className={`${headingFont.className} text-3xl font-semibold sm:text-4xl`}>
              Facilities designed around trust
            </h2>
            <p className="mt-3 max-w-2xl text-slate-700">
              From secure transactions to premium support, every NexaBank
              service is built with reliability, transparency, and speed.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-slate-800 sm:text-base">
            {facilities.map((facility) => (
              <li key={facility} className="rounded-xl bg-slate-900/5 px-3 py-2">
                {facility}
              </li>
            ))}
          </ul>
        </section>

        <section
          id="accounts"
          className="scroll-mt-24 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300"
        >
          <h2 className={`${headingFont.className} text-3xl font-semibold sm:text-4xl`}>
            Open your account in minutes
          </h2>
          <p className="mt-2 max-w-2xl text-slate-700">
            Choose the account type that matches your needs. You can always
            upgrade as your financial goals grow.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <article className="rounded-3xl border border-emerald-900/20 bg-[linear-gradient(160deg,#e5fff2_0%,#f6fff9_100%)] p-6 shadow-sm">
              <p className="text-xs font-semibold tracking-[0.16em] text-emerald-800 uppercase">
                Personal Banking
              </p>
              <h3 className={`${headingFont.className} mt-2 text-3xl font-semibold text-emerald-950`}>
                Savings Account
              </h3>
              <p className="mt-3 text-sm leading-6 text-emerald-900/85">
                Ideal for salary credits, savings goals, debit card usage, and
                digital payments with zero-balance options.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-5 bg-emerald-900 text-emerald-50 hover:bg-emerald-800"
              >
                <Link href="/register?account=savings">Open Savings Account</Link>
              </Button>
            </article>

            <article className="rounded-3xl border border-cyan-950/20 bg-[linear-gradient(160deg,#e7f6ff_0%,#f5fbff_100%)] p-6 shadow-sm">
              <p className="text-xs font-semibold tracking-[0.16em] text-cyan-800 uppercase">
                Business Banking
              </p>
              <h3 className={`${headingFont.className} mt-2 text-3xl font-semibold text-cyan-950`}>
                Current Account
              </h3>
              <p className="mt-3 text-sm leading-6 text-cyan-900/85">
                Best for businesses and professionals needing high transaction
                limits, cash management, and advanced banking tools.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-5 bg-cyan-900 text-cyan-50 hover:bg-cyan-800"
              >
                <Link href="/register?account=current">Open Current Account</Link>
              </Button>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
