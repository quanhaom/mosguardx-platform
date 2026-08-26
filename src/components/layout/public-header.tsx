"use client";

import Link from "next/link";
import { ArrowRight, Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";

const navigation = [
  { href: "/#problem", label: "Bài toán" },
  { href: "/#product", label: "Sản phẩm" },
  { href: "/#solution", label: "Giải pháp" },
  { href: "/#ai", label: "AI" },
  { href: "/#demo", label: "Demo" },
  { href: "/#experiment", label: "Thực nghiệm" },
  { href: "/#segments", label: "Khách hàng" },
  { href: "/#business", label: "Kinh doanh" },
  { href: "/#expansion", label: "Mở rộng" },
  { href: "/#team", label: "Đội ngũ" },
];

export default function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b211b]/90 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <Link
          href="/#hero"
          className="flex shrink-0 items-center gap-3"
          onClick={() => setMobileOpen(false)}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-[#10251f]">
            <ShieldCheck size={23} />
          </span>

          <span>
            <strong className="block text-lg leading-none">MosguardX</strong>
            <small className="text-[9px] font-bold tracking-[0.2em] text-emerald-300">
              EARLY WARNING NETWORK
            </small>
          </span>
        </Link>

        <nav
          aria-label="Điều hướng trang giới thiệu"
          className="hidden items-center gap-3 text-[11px] font-semibold text-slate-300 xl:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-bold text-[#10251f] transition hover:bg-emerald-300 sm:inline-flex"
          >
            Dashboard
            <ArrowRight size={15} />
          </Link>

          <button
            type="button"
            aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-slate-200 transition hover:bg-white/10 xl:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0b211b] px-5 py-4 xl:hidden">
          <nav
            aria-label="Điều hướng trang giới thiệu trên thiết bị di động"
            className="mx-auto grid max-w-7xl grid-cols-2 gap-2 sm:grid-cols-4"
          >
            {navigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-white/10 px-3 py-3 text-sm text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                <span className="mr-2 text-[10px] font-bold text-emerald-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="mx-auto mt-3 flex max-w-7xl items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-[#10251f] sm:hidden"
          >
            Mở Dashboard
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </header>
  );
}
