"use client";

import Link from "next/link";

import { Navbar } from "@/components/navbar";

const featureCards = [
  {
    title: "Bank-grade protection",
    description:
      "Multi-layer encryption, biometric sign-in, card controls, and live fraud monitoring across every transaction.",
    tone: "text-[#4f5ff1] bg-[#eff1ff]",
    icon: ShieldIcon,
  },
  {
    title: "Accounts that fit real life",
    description:
      "Savings, salary, premium, and business accounts designed for daily money movement and long-term goals.",
    tone: "text-[#4967f6] bg-[#eef4ff]",
    icon: CardIcon,
  },
  {
    title: "Smarter money growth",
    description:
      "Track cashflow, automate savings, and view actionable insights through simple visual analytics.",
    tone: "text-[#6352eb] bg-[#f2efff]",
    icon: ChartIcon,
  },
  {
    title: "Global-ready banking",
    description:
      "Travel-friendly cards, transparent FX fees, and fast international transfers for personal and business users.",
    tone: "text-[#4b7bfa] bg-[#eef3ff]",
    icon: GlobeIcon,
  },
];

const trustBadges = [
  "Visual analytics",
  "2FA protection",
  "Virtual cards",
  "24/7 support",
];

const pricingRows = [
  ["Monthly fee", "$0", "$12", "$24"],
  ["Minimum balance", "$0", "$1,000", "$2,500"],
  ["Domestic transfers", "Free", "Free", "Free"],
  ["International transfers", "$18", "$10", "$8"],
  ["Debit card replacement", "$5", "Free", "Free"],
  ["Priority support", "No", "Yes", "Dedicated manager"],
];

const footerGroups = [
  {
    title: "Product",
    links: ["Digital Account", "Savings Vaults", "Business Banking", "Cards"],
  },
  {
    title: "Company",
    links: ["About Us", "Security", "Careers", "Newsroom"],
  },
  {
    title: "Support",
    links: ["Help Center", "Contact", "Status", "Compliance"],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f8ff] text-[#101a33]">
      <Navbar />

      <main>
        <section id="home" className="relative px-4 pb-24 pt-32 sm:px-6 lg:px-8 lg:pb-32 lg:pt-44">
          <div className="absolute inset-x-0 top-0 -z-20 h-[24rem] bg-[linear-gradient(180deg,#f4f4ff_0%,#f7f8ff_100%)]" />
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-[2.75rem] border border-[#e1e5fb] bg-[linear-gradient(180deg,#ffffff_0%,#f7f8ff_100%)] px-6 py-14 text-center shadow-[0_38px_110px_-60px_rgba(83,92,230,0.32)] sm:px-8 lg:px-12 lg:py-18">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(98,103,241,0.12),transparent_20%),radial-gradient(circle_at_82%_16%,rgba(79,124,255,0.12),transparent_22%),radial-gradient(circle_at_50%_100%,rgba(95,103,255,0.08),transparent_35%)]" />
              <div className="absolute left-[-4rem] top-16 h-48 w-48 rounded-full bg-[#8e8bff]/18 blur-[100px]" />
              <div className="absolute right-[-5rem] top-10 h-56 w-56 rounded-full bg-[#7ca5ff]/18 blur-[120px]" />
              <div className="absolute bottom-[-3rem] left-1/2 h-44 w-[26rem] -translate-x-1/2 rounded-full bg-[#7869ff]/10 blur-[120px]" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e5fb] bg-[#f2f3ff] px-4 py-2 text-[#5057dc] backdrop-blur-sm">
                <span className="flex size-2 rounded-full bg-[#5a4ff3]" />
                <span className="text-xs font-bold tracking-[0.22em] uppercase">
                  Smarter digital banking is live
                </span>
                </div>

                <h1 className="font-heading mx-auto mt-8 max-w-5xl text-5xl leading-[1.02] font-extrabold tracking-tight text-[#11182f] sm:text-6xl lg:text-7xl">
                  Banking that moves
                  <br />
                  <span className="bg-[linear-gradient(135deg,#5a4ff3_0%,#4f7cff_100%)] bg-clip-text text-transparent">
                    at the speed of life.
                  </span>
                </h1>

                <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-[#55627a] sm:text-xl">
                  Manage daily spending, savings, cards, transfers, and business
                  cashflow through a premium banking experience designed to look
                  trustworthy, fast, and beautifully modern.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    href="/open-account"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-[1.4rem] bg-[linear-gradient(135deg,#5a4ff3_0%,#4f7cff_100%)] px-8 py-4 text-lg font-bold text-white shadow-[0_22px_50px_-24px_rgba(85,102,246,0.45)] transition-all hover:-translate-y-0.5 sm:w-auto"
                  >
                    Start Your Journey
                    <ArrowRightIcon className="size-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-[1.4rem] border border-[#dde3f6] bg-white px-8 py-4 text-lg font-bold text-[#33415e] transition-colors hover:bg-[#f9faff] sm:w-auto"
                  >
                    <PhoneIcon className="size-5" />
                    Client Login
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto mt-18 max-w-6xl">
                <div className="rounded-[2rem] border border-[#e1e5fb] bg-white/82 p-4 shadow-[0_35px_90px_-48px_rgba(83,92,230,0.22)] backdrop-blur-xl sm:p-6 lg:p-8">
                  <div className="grid gap-6 lg:grid-cols-[1.1fr_0.85fr_0.95fr]">
                    <article className="rounded-[1.75rem] border border-white/12 bg-white/92 p-6 text-left">
                      <p className="text-sm font-semibold text-[#6b7f98]">Total Balance</p>
                      <h2 className="mt-2 text-3xl font-extrabold text-[#10233d]">$42,580.00</h2>
                      <p className="mt-1 text-sm text-[#5f7490]">+8.4% from last month</p>
                      <div className="mt-6 flex h-28 items-end gap-2 rounded-2xl bg-[linear-gradient(180deg,#edf5ff_0%,#f7fbff_100%)] p-3">
                        {[42, 76, 55, 90, 68, 84, 61].map((height, index) => (
                          <div
                            key={index}
                            className="flex-1 rounded-t-xl bg-[linear-gradient(180deg,#7b82ff_0%,#4f7cff_100%)]"
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                    </article>

                    <article className="relative overflow-hidden rounded-[1.75rem] bg-[linear-gradient(160deg,#232768_0%,#4d53d9_100%)] p-6 text-left text-white shadow-[0_24px_60px_-36px_rgba(74,82,210,0.45)]">
                      <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 opacity-15">
                        <BoltIcon className="size-28" />
                      </div>
                      <p className="text-sm font-semibold text-[#d5d7ff]">Active Card</p>
                      <h3 className="mt-2 font-mono text-2xl font-bold tracking-[0.22em]">
                        **** 8842
                      </h3>
                      <div className="mt-10 flex items-end justify-between">
                        <div>
                          <p className="text-sm text-white/65">Card Holder</p>
                          <p className="mt-1 font-bold">Nexa Platinum</p>
                        </div>
                        <div className="flex -space-x-2">
                          <span className="size-8 rounded-full bg-[#ff605d]/90" />
                          <span className="size-8 rounded-full bg-[#f7c948]/90" />
                        </div>
                      </div>
                    </article>

                    <article className="rounded-[1.75rem] border border-white/12 bg-white/92 p-6 text-left">
                      <p className="text-sm font-semibold text-[#6b7f98]">Recent Activity</p>
                      <div className="mt-5 space-y-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#e9fbf2] text-[#149a5b]">
                              <CheckCircleIcon className="size-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#132c4d]">Salary Credit</p>
                              <p className="text-xs text-[#71839b]">Today, 09:28 AM</p>
                            </div>
                          </div>
                          <span className="text-sm font-extrabold text-[#149a5b]">+$4,200</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#fff2f0] text-[#da3f34]">
                              <CloseIcon className="size-4" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#132c4d]">Coffee Shop</p>
                              <p className="text-xs text-[#71839b]">Today, 10:14 AM</p>
                            </div>
                          </div>
                          <span className="text-sm font-extrabold text-[#132c4d]">-$12.50</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#eef0ff] text-[#5a4ff3]">
                              <ShieldIcon className="size-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#132c4d]">Security Check</p>
                              <p className="text-xs text-[#71839b]">Card controls updated</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-[#5a4ff3]">Protected</span>
                        </div>
                      </div>
                    </article>
                  </div>
                </div>

                <div className="absolute -right-2 top-1/2 hidden -translate-y-1/2 rounded-[1.5rem] border border-[#e1e5fb] bg-white/96 p-4 shadow-[0_24px_70px_-34px_rgba(83,92,230,0.22)] md:block">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-full bg-[#e8fff3] text-[#149a5b]">
                      <TrendingUpIcon className="size-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-extrabold tracking-[0.16em] text-[#7b8ea7] uppercase">
                        Weekly growth
                      </p>
                      <p className="text-sm font-bold text-[#10233d]">+12.4% this week</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="personal" className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-extrabold tracking-[0.2em] text-[#5a4ff3] uppercase">
                Banking features
              </p>
              <h2
                className="font-heading mt-4 text-4xl font-bold tracking-tight text-[#10233d] md:text-5xl"
              >
                Everything users expect from a premium bank
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#60738d]">
                No branch friction, no confusing design, and no missing trust
                signals. Just a polished digital banking experience built around
                security and clarity.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {featureCards.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article
                    key={feature.title}
                className="group rounded-[2rem] border border-[#e6e9fb] bg-[#fafbff] p-8 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_60px_-42px_rgba(83,92,230,0.18)]"
                  >
                    <div
                      className={`flex size-14 items-center justify-center rounded-2xl ${feature.tone} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="size-7" />
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-[#132c4d]">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#5e728d]">
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-[#f7f8ff] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[2.5rem] bg-[linear-gradient(135deg,#27296a_0%,#4f52d9_58%,#4f7cff_100%)] p-8 text-white shadow-[0_34px_80px_-44px_rgba(83,92,230,0.4)] md:p-12">
              <div className="grid gap-12 xl:grid-cols-[0.95fr_1.05fr] xl:items-start">
                <div>
                  <p className="text-sm font-extrabold tracking-[0.22em] text-[#9edcff] uppercase">
                    Transparent pricing
                  </p>
                  <h2 className="font-heading mt-4 text-4xl font-bold leading-tight md:text-5xl">
                    Clear charges help customers trust the bank faster.
                  </h2>
                  <p className="mt-6 max-w-xl text-lg leading-8 text-[#d4e4f1]">
                    Savings, premium, and business plans are shown side by side
                    with pricing and service fees so the landing page feels
                    informative, not vague.
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-white/12 bg-white/10 p-5">
                      <p className="text-xs font-extrabold tracking-[0.18em] text-[#d9deff] uppercase">
                        Domestic transfers
                      </p>
                      <p className="mt-3 text-3xl font-extrabold">Free</p>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/12 bg-white/10 p-5">
                      <p className="text-xs font-extrabold tracking-[0.18em] text-[#d9deff] uppercase">
                        Account opening
                      </p>
                      <p className="mt-3 text-3xl font-extrabold">From 6 min</p>
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/95 text-[#10233d] shadow-[0_24px_60px_-40px_rgba(16,35,61,0.55)]">
                  <div className="grid grid-cols-4 bg-[#10233d] text-white">
                    <div className="px-4 py-4 text-sm font-bold">Service</div>
                    <div className="px-4 py-4 text-sm font-bold">Essential</div>
                    <div className="px-4 py-4 text-sm font-bold">Premium</div>
                    <div className="px-4 py-4 text-sm font-bold">Business</div>
                  </div>
                  {pricingRows.map((row, index) => (
                    <div
                      key={row[0]}
                      className={`grid grid-cols-4 border-t border-[#e1eaf3] ${
                        index % 2 === 0 ? "bg-[#f8fbff]" : "bg-white"
                      }`}
                    >
                      {row.map((cell, cellIndex) => (
                        <div
                          key={`${row[0]}-${cellIndex}`}
                          className={`px-4 py-4 text-sm leading-7 ${
                            cellIndex === 0
                              ? "font-bold text-[#14345b]"
                              : "text-[#5f7390]"
                          }`}
                        >
                          {cell}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="security" className="bg-[#f7f8ff] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[3rem] bg-[linear-gradient(140deg,#232768_0%,#4f52d9_54%,#4f7cff_100%)] p-8 md:p-12">
              <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/8" />
              <div className="grid gap-12 lg:grid-cols-[1fr_0.95fr] lg:items-center">
                <div className="text-center lg:text-left">
                  <p className="text-sm font-extrabold tracking-[0.22em] text-[#d5d9ff] uppercase">
                    Mobile-first banking
                  </p>
                  <h2 className="font-heading mt-5 text-4xl font-bold leading-tight text-white md:text-5xl">
                    Designed for customers who bank from their phone first.
                  </h2>
                  <p className="mt-6 max-w-xl text-lg leading-8 text-[#d2e1f0]">
                    Check balances, move money, manage cards, review analytics,
                    and protect your account with a fast, confident mobile
                    experience that feels modern and secure.
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
                    {trustBadges.map((badge, index) => (
                      <div
                        key={badge}
                        className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-3 ${
                          index % 2 === 0
                            ? "border-white/12 bg-white/10 text-white"
                            : "border-white/12 bg-white/12 text-white"
                        }`}
                      >
                        {index % 2 === 0 ? (
                          <PieIcon className="size-5 text-[#dce0ff]" />
                        ) : (
                          <LockIcon className="size-5 text-[#dce0ff]" />
                        )}
                        <span className="font-semibold">{badge}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div id="mobile" className="relative">
                  <div className="mx-auto w-[17rem] rounded-[3rem] border-[10px] border-[#223b5b] bg-[#0d1b2d] shadow-[0_30px_70px_-36px_rgba(0,0,0,0.75)]">
                    <div className="overflow-hidden rounded-[2.3rem]">
                      <div className="bg-[linear-gradient(180deg,#5a4ff3_0%,#4f7cff_100%)] px-6 pb-8 pt-12">
                        <p className="text-xs font-extrabold tracking-[0.18em] text-[#dfe3ff] uppercase">
                          Available balance
                        </p>
                        <h3 className="mt-3 text-3xl font-extrabold text-white">$12,492.00</h3>
                      </div>
                      <div className="space-y-5 bg-[#f8fbff] p-6">
                        <div className="h-4 rounded-full bg-[#e5edf5]" />
                        <div className="h-4 w-3/4 rounded-full bg-[#e5edf5]" />
                        <div className="pt-4">
                          {[1, 2, 3].map((item) => (
                            <div key={item} className="mt-4 flex gap-3">
                              <div className="size-11 rounded-2xl bg-[#e8f2ff]" />
                              <div className="flex-1 space-y-2">
                                <div className="h-3 rounded-full bg-[#dbe6f2]" />
                                <div className="h-2 w-1/2 rounded-full bg-[#e7eef6]" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -right-2 top-1/2 hidden -translate-y-1/2 rounded-[1.5rem] bg-white p-4 shadow-[0_24px_60px_-34px_rgba(8,25,47,0.35)] md:block">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-full bg-[#e8fff3] text-[#149a5b]">
                        <TrendingUpIcon className="size-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-extrabold tracking-[0.15em] text-[#7990ab] uppercase">
                          Profit
                        </p>
                        <p className="text-sm font-bold text-[#10233d]">+12.4% this week</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="business" className="bg-white py-24">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-sm font-extrabold tracking-[0.2em] text-[#5a4ff3] uppercase">
              Conversion-ready CTA
            </p>
            <h2
              className="font-heading mt-5 text-4xl font-bold tracking-tight text-[#10233d] md:text-5xl"
            >
              Ready to upgrade your financial life?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#60738d]">
              Join customers who want one clean platform for payments, savings,
              cards, and business cashflow without old-fashioned banking
              friction.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="#pricing"
                className="rounded-[1.35rem] bg-[linear-gradient(135deg,#5a4ff3_0%,#4f7cff_100%)] px-10 py-4 text-xl font-bold text-white shadow-[0_22px_50px_-24px_rgba(85,102,246,0.38)] transition-transform hover:scale-[1.02]"
              >
                Open a free account
              </Link>
              <Link
                href="#business"
                className="rounded-[1.35rem] px-10 py-4 text-xl font-bold text-[#29425f] transition-colors hover:bg-[#f1f6fb]"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#101531] py-16 text-[#a6afc9]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 grid gap-12 md:grid-cols-2 lg:grid-cols-[1.2fr_0.7fr_0.7fr_0.7fr]">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#5a4ff3_0%,#4f7cff_100%)] text-white">
                  <BoltIcon className="size-5" />
                </div>
                <span className="font-heading text-2xl font-bold text-white">
                  NexaBank
                </span>
              </div>
              <p className="mt-5 max-w-sm text-sm leading-7">
                Redefining online banking with a cleaner interface, clearer
                pricing, stronger trust signals, and a premium digital-first
                experience.
              </p>
              <div className="mt-6 flex gap-4">
                <div className="flex size-11 items-center justify-center rounded-full bg-[#132338] text-[#9fd8ff] transition-colors hover:bg-[#1a5ea4] hover:text-white">
                  <GlobeIcon className="size-5" />
                </div>
                <div className="flex size-11 items-center justify-center rounded-full bg-[#132338] text-[#9fd8ff] transition-colors hover:bg-[#1a5ea4] hover:text-white">
                  <PhoneIcon className="size-5" />
                </div>
              </div>
            </div>

            {footerGroups.map((group) => (
              <div key={group.title}>
                <h4 className="text-sm font-extrabold tracking-[0.2em] text-white uppercase">
                  {group.title}
                </h4>
                <ul className="mt-6 space-y-4 text-sm">
                  {group.links.map((link) => (
                    <li key={link}>
                  <Link href="#" className="transition-colors hover:text-[#cbd1ff]">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-8 text-sm md:flex-row">
            <p>© 2026 NexaBank Financial Group. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                Terms of Service
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M5 12h14m0 0-5-5m5 5-5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M13 2 5 14h5l-1 8 8-12h-5l1-8Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3 5 6v6c0 4.5 3 7.9 7 9 4-1.1 7-4.5 7-9V6l-7-3Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m9.5 12 1.8 1.8L15 10.2"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.9" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 19h16M7 16V9m5 7V5m5 11v-4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="M3 12h18M12 3c2.7 2.9 4.1 5.9 4.1 9S14.7 18.1 12 21c-2.7-2.9-4.1-5.9-4.1-9S9.3 5.9 12 3Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect
        x="7"
        y="2.5"
        width="10"
        height="19"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <circle cx="12" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <path
        d="M8 11V8a4 4 0 1 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PieIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3v9h9A9 9 0 0 0 12 3Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M21 13a9 9 0 1 1-10-10"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="m8.5 12.2 2.2 2.2 4.8-5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrendingUpIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 16l5-5 4 4 7-8M15 7h5v5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}
