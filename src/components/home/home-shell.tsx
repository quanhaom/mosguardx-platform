"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Activity,
  Bell,
  ChevronDown,
  Home,
  Menu,
  Settings,
  ShieldCheck,
  Smartphone,
  X,
} from "lucide-react";

import { useState } from "react";

import PlatformSwitcher from "@/components/layout/platform-switcher";

const navigation = [
  {
    href: "/home",
    label: "Trang chủ",
    icon: Home,
  },
  {
    href: "/activity",
    label: "Hoạt động",
    icon: Activity,
  },
  {
    href: "/my-device",
    label: "Thiết bị",
    icon: Smartphone,
  },
  {
    href: "/home-alerts",
    label: "Cảnh báo",
    icon: Bell,
  },
  {
    href: "/home-settings",
    label: "Cài đặt",
    icon: Settings,
  },
];

export default function HomeShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-[#f6f8f6] text-[#17352b]">
      {/* =========================
          HEADER
      ========================= */}

      <header className="sticky top-0 z-40 border-b border-[#e0e9e4] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-6">
            <Link
              href="/home"
              className="flex shrink-0 items-center gap-3"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#16352a] text-emerald-300">
                <ShieldCheck size={22} />
              </span>

              <div className="hidden sm:block">
                <strong className="block text-lg leading-none">
                  MosGuardX
                </strong>

                <span className="mt-1 block text-[9px] font-bold tracking-[0.2em] text-emerald-700">
                  HOME · B2C
                </span>
              </div>
            </Link>

            {/* Desktop nav */}

            <nav className="hidden items-center gap-1 lg:flex">
              {navigation.map(
                ({
                  href,
                  label,
                  icon: Icon,
                }) => {
                  const active =
                    pathname === href;

                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                        active
                          ? "bg-emerald-50 text-emerald-800"
                          : "text-slate-500 hover:bg-slate-50 hover:text-[#16352a]"
                      }`}
                    >
                      <Icon size={17} />

                      {label}
                    </Link>
                  );
                },
              )}
            </nav>
          </div>

          {/* RIGHT */}

          <div className="flex shrink-0 items-center gap-2">
            {/* Platform switcher */}

            <PlatformSwitcher
              variant="light"
              compact
            />

            {/* Alert */}

            <Link
              href="/home-alerts"
              aria-label="Cảnh báo"
              className="relative hidden rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 sm:block"
            >
              <Bell size={19} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
            </Link>

            {/* Household */}

            <button
              type="button"
              className="hidden items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-50 xl:flex"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                HQ
              </span>

              <span className="text-left">
                <span className="block text-xs text-slate-400">
                  Nhà của
                </span>

                <strong className="block text-sm">
                  Quân
                </strong>
              </span>

              <ChevronDown
                size={15}
                className="text-slate-400"
              />
            </button>

            {/* Mobile menu */}

            <button
              type="button"
              aria-label="Mở menu"
              onClick={() =>
                setMobileOpen(true)
              }
              className="rounded-xl border border-slate-200 p-2.5 text-slate-700 lg:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* =========================
          MOBILE DRAWER
      ========================= */}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Đóng menu"
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() =>
              setMobileOpen(false)
            }
          />

          <aside className="relative ml-auto flex h-full w-[82%] max-w-sm flex-col bg-white p-5 shadow-2xl">
            {/* Drawer header */}

            <div className="flex items-center justify-between">
              <Link
                href="/home"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="flex items-center gap-3"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#16352a] text-emerald-300">
                  <ShieldCheck size={22} />
                </span>

                <div>
                  <strong>
                    MosGuardX
                  </strong>

                  <p className="text-[9px] font-bold tracking-[0.2em] text-emerald-700">
                    HOME · B2C
                  </p>
                </div>
              </Link>

              <button
                type="button"
                aria-label="Đóng menu"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="rounded-xl bg-slate-100 p-2"
              >
                <X size={19} />
              </button>
            </div>

            {/* Mobile household */}

            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                HQ
              </span>

              <div>
                <p className="text-xs text-slate-400">
                  Household
                </p>

                <strong className="text-sm text-[#16352a]">
                  Nhà của Quân
                </strong>
              </div>
            </div>

            {/* Navigation */}

            <nav className="mt-5 space-y-2">
              {navigation.map(
                ({
                  href,
                  label,
                  icon: Icon,
                }) => {
                  const active =
                    pathname === href;

                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() =>
                        setMobileOpen(false)
                      }
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold ${
                        active
                          ? "bg-[#16352a] text-white"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Icon size={19} />

                      {label}
                    </Link>
                  );
                },
              )}
            </nav>

            {/* Product landing */}

            <Link
              href="/household"
              onClick={() =>
                setMobileOpen(false)
              }
              className="mt-5 flex items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800"
            >
              Xem MosGuardX Home
            </Link>

            {/* Device state */}

            <div className="mt-auto rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-xs text-slate-500">
                Thiết bị đang kết nối
              </p>

              <div className="mt-2 flex items-center gap-2 font-semibold text-emerald-800">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                MosGuardX Home
              </div>

              <p className="mt-1 text-[10px] text-slate-400">
                Online
              </p>
            </div>
          </aside>
        </div>
      )}

      {/* =========================
          CONTENT
      ========================= */}

      <main className="mx-auto max-w-7xl px-4 py-6 pb-28 sm:px-6 md:py-8 lg:px-8 lg:pb-10">
        {children}
      </main>

      {/* =========================
          MOBILE BOTTOM NAV
      ========================= */}

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-xl justify-around">
          {navigation.map(
            ({
              href,
              label,
              icon: Icon,
            }) => {
              const active =
                pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex min-w-[64px] flex-col items-center gap-1 py-3 text-[10px] font-semibold ${
                    active
                      ? "text-emerald-700"
                      : "text-slate-400"
                  }`}
                >
                  <Icon size={19} />

                  <span>
                    {label}
                  </span>
                </Link>
              );
            },
          )}
        </div>
      </nav>
    </div>
  );
}