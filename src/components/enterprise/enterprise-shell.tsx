"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  Bell,
  Building2,
  ChevronRight,
  FileBarChart,
  Globe2,
  Home,
  Layers3,
  Menu,
  Settings,
  ShieldCheck,
  Users,
  Wrench,
  X,
} from "lucide-react";

import { useState } from "react";

import PlatformSwitcher from "@/components/layout/platform-switcher";

const navigation = [
  {
    href: "/enterprise/app",
    label: "Overview",
    icon: BarChart3,
  },
  {
    href: "/enterprise/app/sites",
    label: "Sites",
    icon: Layers3,
  },
  {
    href: "/enterprise/app/devices",
    label: "Devices",
    icon: Building2,
  },
  {
    href: "/enterprise/app/alerts",
    label: "Alerts",
    icon: Bell,
  },
  {
    href: "/enterprise/app/maintenance",
    label: "Maintenance",
    icon: Wrench,
  },
  {
    href: "/enterprise/app/reports",
    label: "Reports",
    icon: FileBarChart,
  },
  {
    href: "/enterprise/app/team",
    label: "Team",
    icon: Users,
  },
  {
    href: "/enterprise/app/settings",
    label: "Settings",
    icon: Settings,
  },
];

const pageTitles: Record<string, string> = {
  "/enterprise/app":
    "Enterprise Overview",

  "/enterprise/app/sites":
    "Sites",

  "/enterprise/app/devices":
    "Devices",

  "/enterprise/app/alerts":
    "Alerts",

  "/enterprise/app/maintenance":
    "Maintenance",

  "/enterprise/app/reports":
    "Reports",

  "/enterprise/app/team":
    "Team",

  "/enterprise/app/settings":
    "Settings",
};

export default function EnterpriseShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname =
    usePathname();

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const currentTitle =
    pageTitles[pathname] ??
    "MosGuardX Enterprise";

  const sidebar = (
    <>
      {/* ================================================
          BRAND
      ================================================ */}

      <div className="flex h-20 shrink-0 items-center gap-3 border-b border-white/10 px-6">
        <Link
          href="/enterprise/app"
          onClick={() =>
            setMobileOpen(false)
          }
          className="flex items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-[#10251f]">
            <ShieldCheck
              size={23}
            />
          </span>

          <span>
            <strong className="block text-lg leading-none text-white">
              MosGuardX
            </strong>

            <small className="mt-1 block text-[9px] font-bold tracking-[0.18em] text-emerald-300">
              ENTERPRISE
            </small>
          </span>
        </Link>

        <button
          type="button"
          aria-label="Close menu"
          onClick={() =>
            setMobileOpen(false)
          }
          className="ml-auto rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
        >
          <X size={19} />
        </button>
      </div>

      {/* ================================================
          SEGMENT
      ================================================ */}

      <div className="mx-4 mt-5 rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.06] p-4">
        <p className="text-[9px] font-bold tracking-[0.16em] text-emerald-300">
          B2B · BUSINESS & OPERATORS
        </p>

        <p className="mt-2 text-xs leading-5 text-slate-400">
          Multi-site operations,
          devices and maintenance.
        </p>
      </div>

      {/* ================================================
          QUICK LINKS
      ================================================ */}

      <div className="mx-3 mt-4 space-y-2">
        <Link
          href="/"
          onClick={() =>
            setMobileOpen(false)
          }
          className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
        >
          <Globe2 size={18} />

          <span>
            Website MosGuardX
          </span>
        </Link>

        <Link
          href="/enterprise"
          onClick={() =>
            setMobileOpen(false)
          }
          className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
        >
          <Home size={18} />

          <span>
            Enterprise landing
          </span>
        </Link>
      </div>

      {/* ================================================
          NAV
      ================================================ */}

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {navigation.map(
          ({
            href,
            label,
            icon: Icon,
          }) => {
            const active =
              href ===
              "/enterprise/app"
                ? pathname ===
                  href
                : pathname ===
                    href ||
                  pathname.startsWith(
                    `${href}/`,
                  );

            return (
              <Link
                key={href}
                href={href}
                onClick={() =>
                  setMobileOpen(false)
                }
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-emerald-400 font-semibold text-[#10251f]"
                    : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <Icon
                  size={19}
                />

                <span className="flex-1">
                  {label}
                </span>

                {active && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10251f]" />
                )}
              </Link>
            );
          },
        )}
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f4f7f5]">

      {/* ================================================
          DESKTOP SIDEBAR
      ================================================ */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-[#10251f] lg:flex">
        {sidebar}
      </aside>

      {/* ================================================
          MOBILE DRAWER
      ================================================ */}

      {mobileOpen && (
        <div className="fixed inset-0 z-[230] lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            onClick={() =>
              setMobileOpen(false)
            }
          />

          <aside className="relative flex h-full w-72 flex-col bg-[#10251f] shadow-2xl">
            {sidebar}
          </aside>
        </div>
      )}

      {/* ================================================
          APP
      ================================================ */}

      <div className="lg:ml-64">

        {/* ==============================================
            HEADER
        ============================================== */}

        <header className="sticky top-0 z-[220] flex h-20 items-center justify-between border-b border-[#dde7e2] bg-white/95 px-5 shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-xl md:px-8">

          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-3">

            <button
              type="button"
              aria-label="Open menu"
              onClick={() =>
                setMobileOpen(true)
              }
              className="rounded-xl border border-slate-200 p-2.5 text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 lg:hidden"
            >
              <Menu size={19} />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.14em] text-slate-400">

                <Link
                  href="/enterprise/app"
                  className="transition hover:text-emerald-700"
                >
                  MOSGUARDX
                </Link>

                <ChevronRight
                  size={11}
                />

                <span className="text-emerald-700">
                  B2B ENTERPRISE
                </span>
              </div>

              <h1 className="mt-1 truncate text-lg font-bold text-[#16352a] sm:text-xl">
                {currentTitle}
              </h1>
            </div>
          </div>

          {/* RIGHT */}

          <div className="flex shrink-0 items-center gap-2">

            {/* Platform dropdown */}

            <PlatformSwitcher
              variant="light"
              compact
              align="right"
            />

            {/* Enterprise landing */}

            <Link
              href="/enterprise"
              className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 md:flex"
            >
              <Home size={15} />

              Enterprise
            </Link>

            {/* Website */}

            <Link
              href="/"
              className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 xl:flex"
            >
              <Globe2 size={15} />

              Website
            </Link>
          </div>
        </header>

        {/* ==============================================
            CONTENT
        ============================================== */}

        <main className="mx-auto max-w-[1500px] p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}