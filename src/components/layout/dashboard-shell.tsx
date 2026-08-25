"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  BrainCircuit,
  ChevronRight,
  Cpu,
  House,
  LayoutDashboard,
  Map,
  Menu,
  Radio,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    href: "/dashboard",
    label: "Tổng quan",
    icon: LayoutDashboard,
  },
  {
    href: "/map",
    label: "Bản đồ dịch tễ",
    icon: Map,
  },
  {
    href: "/alerts",
    label: "Cảnh báo",
    icon: Bell,
    badge: 2,
  },
  {
    href: "/devices",
    label: "Thiết bị",
    icon: Cpu,
  },
  {
    href: "/ai-api",
    label: "AI / API",
    icon: BrainCircuit,
  },
  {
    href: "/reports",
    label: "Báo cáo",
    icon: BarChart3,
  },
  {
    href: "/settings",
    label: "Cấu hình",
    icon: Settings,
  },
];

const pageNames: Record<string, string> = {
  "/dashboard": "Tổng quan hệ thống",
  "/map": "Bản đồ dịch tễ",
  "/alerts": "Quản lý cảnh báo",
  "/devices": "Quản lý thiết bị",
  "/ai-api": "AI và API nhận diện",
  "/reports": "Báo cáo và phân tích",
  "/settings": "Cấu hình hệ thống",
};

const publicRoutes = [
  "/",
  "/risk-api",
  "/household",
  "/expansion",
];

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isPublicRoute = publicRoutes.some((route) => {
    if (route === "/") {
      return pathname === "/";
    }

    return pathname === route || pathname.startsWith(`${route}/`);
  });

  if (isPublicRoute) {
    return <>{children}</>;
  }

  const currentPageName =
    pageNames[pathname] ?? "MosguardX Operations";

  const currentPageSlug =
    pathname === "/dashboard"
      ? ""
      : pathname.split("/").filter(Boolean).join(" / ").toUpperCase();

  const sidebar = (
    <>
      {/* Logo */}
      <div className="flex h-20 shrink-0 items-center gap-3 border-b border-white/10 px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
          onClick={() => setMobileOpen(false)}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-[#10251f]">
            <ShieldCheck size={24} />
          </span>

          <span>
            <strong className="block text-lg leading-none">
              MosguardX
            </strong>

            <small className="mt-1 block text-[10px] font-semibold tracking-[0.2em] text-emerald-300">
              OPERATIONS
            </small>
          </span>
        </Link>

        <button
          type="button"
          aria-label="Đóng menu"
          className="ml-auto rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mgx-scrollbar flex-1 space-y-1 overflow-y-auto px-3 py-6">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="mb-4 flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
        >
          <House size={19} />
          <span>Website giới thiệu</span>
        </Link>

        <p className="mb-2 px-4 text-[9px] font-bold tracking-[0.18em] text-slate-500">
          TRUNG TÂM ĐIỀU HÀNH
        </p>

        {navigation.map(
          ({
            href,
            label,
            icon: Icon,
            badge,
          }) => {
            const active =
              pathname === href ||
              pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-emerald-400 font-semibold text-[#10251f] shadow-lg shadow-emerald-950/10"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={19} />

                <span className="flex-1">{label}</span>

                {badge !== undefined && badge > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    {badge}
                  </span>
                )}

                {active && badge === undefined && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10251f]" />
                )}
              </Link>
            );
          },
        )}
      </nav>

      {/* MVP status */}
      <div className="mx-4 mb-4 shrink-0 rounded-xl border border-emerald-300/15 bg-emerald-300/5 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          MVP đang phát triển
        </div>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          Dashboard đang sử dụng dữ liệu minh họa
        </p>
      </div>

      {/* User */}
      <div className="flex shrink-0 items-center gap-3 border-t border-white/10 p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800">
          HQ
        </div>

        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">
            Hòn Quôn
          </div>

          <div className="text-xs text-slate-400">
            Quản trị viên
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f3f7f5]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-[#10251f] text-white lg:flex">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Đóng menu"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="relative flex h-full w-72 flex-col bg-[#10251f] text-white shadow-2xl">
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#dce8e2] bg-white/90 px-5 backdrop-blur-xl md:px-8">
          {/* Left side */}
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Mở menu"
              className="shrink-0 rounded-xl border border-slate-200 bg-white p-2 transition hover:border-emerald-300 hover:text-emerald-700 lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>

            <div className="min-w-0">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.12em] text-slate-400">
                <Link
                  href="/dashboard"
                  className="transition hover:text-emerald-700"
                >
                  MOSGUARDX
                </Link>

                <ChevronRight
                  size={11}
                  className="shrink-0"
                />

                <span className="truncate text-emerald-700">
                  TRUNG TÂM ĐIỀU HÀNH
                </span>
              </div>

              {/* Current page */}
              <div className="mt-1 flex min-w-0 items-center gap-2">
                <h1 className="truncate text-lg font-bold text-[#16352a] sm:text-xl">
                  {currentPageName}
                </h1>

                {currentPageSlug && (
                  <span className="hidden shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700 sm:inline">
                    {currentPageSlug}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 sm:flex">
              <Radio
                size={14}
                className="animate-pulse"
              />
              Dữ liệu minh họa
            </span>

            <Link
              href="/alerts"
              aria-label="Mở thông báo"
              className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700"
            >
              <Bell size={18} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}