"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { Sora } from "next/font/google";

const headingFont = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

type NavbarItem = {
  href: string;
  label: string;
};

const items: NavbarItem[] = [];

function NavbarLink({
  href,
  children,
  mobile = false,
  light = false,
}: {
  href: string;
  children: ReactNode;
  mobile?: boolean;
  light?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        mobile
          ? "rounded-2xl px-4 py-3 text-base font-semibold text-[#29425f] transition-colors hover:bg-[#eef4fb] hover:text-[#10325c]"
          : light
            ? "text-sm font-semibold text-white/80 transition-colors hover:text-white"
            : "text-sm font-semibold text-[#51647f] transition-colors hover:text-[#123a63]"
      }
    >
      {children}
    </Link>
  );
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "px-4 py-3 sm:px-6" : "px-4 py-5 sm:px-6"
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-7xl items-center justify-between rounded-full border px-4 py-3 transition-all duration-300 sm:px-6 ${
          scrolled
            ? "border-[#dfe4f6] bg-white/92 shadow-[0_18px_50px_-28px_rgba(56,63,145,0.22)] backdrop-blur-xl"
            : "border-white/60 bg-white/88 shadow-[0_20px_60px_-30px_rgba(79,76,221,0.18)] backdrop-blur-md"
        }`}
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#5a4ff3_0%,#4f7cff_100%)] text-white shadow-lg shadow-[#8f88ff]/35">
            <BoltIcon className="size-5" />
          </div>
          <span
            className={`${headingFont.className} text-xl font-bold tracking-tight ${
              scrolled ? "text-[#1d2740]" : "text-[#1d2740]"
            }`}
          >
            Nexa<span className="text-[#5566f6]">Bank</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {items.map((item) => (
            <NavbarLink key={item.label} href={item.href} light={!scrolled}>
              {item.label}
            </NavbarLink>
          ))}
          <Link
            href="#pricing"
            className="rounded-full bg-[linear-gradient(135deg,#5a4ff3_0%,#4f7cff_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_40px_-20px_rgba(85,102,246,0.5)] transition-transform hover:-translate-y-0.5"
          >
            Open Account
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="inline-flex items-center justify-center rounded-full p-2 text-[#3c4863] md:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <CloseIcon className="size-7" /> : <MenuIcon className="size-7" />}
        </button>
      </div>

      {isMenuOpen ? (
        <div className="mx-auto mt-3 w-full max-w-7xl rounded-[2rem] border border-[#dfe4f6] bg-white p-4 shadow-[0_22px_50px_-30px_rgba(56,63,145,0.22)] md:hidden">
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <NavbarLink key={item.label} href={item.href} mobile>
                {item.label}
              </NavbarLink>
            ))}
            <Link
              href="#pricing"
              className="rounded-2xl bg-[linear-gradient(135deg,#5a4ff3_0%,#4f7cff_100%)] px-4 py-3 text-center text-base font-bold text-white"
            >
              Open Account
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
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

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
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
