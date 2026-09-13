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
      {/* Desktop header */}
      <header className="sticky top-0 z-40 border-b border-[#e0e9e4] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link
              href="/home"
              className="flex items-center gap-3"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#16352a] text-emerald-300">
                <ShieldCheck size={22} />
              </span>

              <div>
                <strong className="block text-lg leading-none">
                  MosGuardX
                </strong>

                <span className="mt-1 block text-[9px] font-bold tracking-[0.24em] text-emerald-700">
                  HOME
                </span>
              </div>
            </Link>

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
                      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
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

          <div className="flex items-center gap-2">
            <Link
              href="/home-alerts"
              className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700"
              aria-label="Cảnh báo"
            >
              <Bell size={19} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
            </Link>

            <button
              type="button"
              className="hidden items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-50 sm:flex"
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

      {/* Mobile drawer */}
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
                  <strong>MosGuardX</strong>

                  <p className="text-[9px] font-bold tracking-[0.2em] text-emerald-700">
                    HOME
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="rounded-xl bg-slate-100 p-2"
              >
                <X size={19} />
              </button>
            </div>

            <nav className="mt-8 space-y-2">
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

            <div className="mt-auto rounded-2xl bg-emerald-50 p-4">
              <p className="text-xs text-slate-500">
                Thiết bị đang kết nối
              </p>

              <div className="mt-2 flex items-center gap-2 font-semibold text-emerald-800">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                MosGuardX Home
              </div>
            </div>
          </aside>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-6 pb-28 sm:px-6 md:py-8 lg:px-8 lg:pb-10">
        {children}
      </main>

      {/* Mobile bottom navigation */}
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

                  <span>{label}</span>
                </Link>
              );
            },
          )}
        </div>
      </nav>
    </div>
  );
}