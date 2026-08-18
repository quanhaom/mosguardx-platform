"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  Cpu,
  LayoutDashboard,
  Map,
  ScanSearch,
  Menu,
  Radio,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { href: "/", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/map", label: "Bản đồ dịch tễ", icon: Map },
  { href: "/alerts", label: "Cảnh báo", icon: Bell, badge: 2 },
  { href: "/devices", label: "Thiết bị", icon: Cpu },
  { href: "/reports", label: "Báo cáo", icon: BarChart3 },
  {
  href: "/detection",
  label: "AI Detection",
  icon: ScanSearch,
  },
  { href: "/settings", label: "Cấu hình", icon: Settings },
];

const pageNames: Record<string, string> = {
  "/": "Tổng quan hệ thống",
  "/map": "Bản đồ dịch tễ",
  "/alerts": "Quản lý cảnh báo",
  "/devices": "Quản lý thiết bị",
  "/reports": "Báo cáo và phân tích",
  "/settings": "Cấu hình hệ thống",
};

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <>
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-[#10251f]">
          <ShieldCheck size={24} />
        </div>

        <div>
          <div className="text-lg font-bold">MosguardX</div>
          <div className="text-[10px] font-semibold tracking-[0.2em] text-emerald-300">
            OPERATIONS
          </div>
        </div>

        <button
          aria-label="Đóng menu"
          className="ml-auto lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        {navigation.map(({ href, label, icon: Icon, badge }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                active
                  ? "bg-emerald-400 font-semibold text-[#10251f]"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={19} />
              <span className="flex-1">{label}</span>

              {badge && (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 mb-4 rounded-xl border border-emerald-300/15 bg-emerald-300/5 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          Hệ thống hoạt động
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Môi trường dữ liệu mô phỏng
        </p>
      </div>

      <div className="flex items-center gap-3 border-t border-white/10 p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800">
          HQ
        </div>
        <div>
          <div className="text-sm font-semibold">Hòn Quôn</div>
          <div className="text-xs text-slate-400">Quản trị viên</div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f3f7f5]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-[#10251f] text-white lg:flex">
        {sidebar}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Đóng menu"
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="relative flex h-full w-72 flex-col bg-[#10251f] text-white">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#dce8e2] bg-white/90 px-5 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <button
              aria-label="Mở menu"
              className="rounded-xl border border-slate-200 p-2 lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] text-emerald-700">
                TRUNG TÂM ĐIỀU HÀNH
              </p>
              <h1 className="text-xl font-bold text-[#16352a]">
                {pageNames[pathname] ?? "MosguardX Operations"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 sm:flex">
              <Radio size={14} className="animate-pulse" />
              Dữ liệu trực tiếp
            </span>

            <Link
              href="/alerts"
              aria-label="Thông báo"
              className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600"
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
