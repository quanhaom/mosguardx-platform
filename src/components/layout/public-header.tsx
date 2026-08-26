"use client";

import Link from "next/link";
import { ArrowRight, Menu, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";

const navigation = [
  { href: "/#hero", id: "hero", label: "Tổng quan" },
  { href: "/#problem", id: "problem", label: "Bài toán" },
  { href: "/#product", id: "product", label: "Sản phẩm" },
  { href: "/#solution", id: "solution", label: "Giải pháp" },
  { href: "/#ai", id: "ai", label: "AI" },
  { href: "/#demo", id: "demo", label: "Demo" },
  { href: "/#experiment", id: "experiment", label: "Thực nghiệm" },
  { href: "/#segments", id: "segments", label: "Khách hàng" },
  { href: "/#business", id: "business", label: "Kinh doanh" },
  { href: "/#expansion", id: "expansion", label: "Mở rộng" },
  { href: "/#team", id: "team", label: "Đội ngũ" },
];

export default function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const updateActiveSection = () => {
      const headerOffset = 110;

      let currentSection = "";

      for (const item of navigation) {
        const section = document.getElementById(item.id);

        if (!section) continue;

        const rect = section.getBoundingClientRect();

        if (rect.top <= headerOffset) {
          currentSection = item.id;
        }
      }

      // Nếu đang ở gần đầu trang
      if (window.scrollY < 100) {
        currentSection = "";
      }

      setActiveSection(currentSection);
    };

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, {
      passive: true,
    });

    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  const handleNavigationClick = (id:string) => {
    setActiveSection(id);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b211b]/90 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        {/* Logo */}
        <Link
          href="/#hero"
          className="flex shrink-0 items-center gap-3"
          onClick={() => {
            setMobileOpen(false);
            setActiveSection("");
          }}
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

        {/* Desktop Navigation */}
        <nav
          aria-label="Điều hướng trang giới thiệu"
          className="hidden items-center gap-1 text-[11px] font-semibold xl:flex"
        >
          {navigation.map((item) => {
            const active = activeSection === item.id;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavigationClick(item.id)}
                className={`
                  relative whitespace-nowrap rounded-lg px-2.5 py-2
                  transition-all duration-300
                  ${
                    active
                      ? "bg-emerald-400/15 text-emerald-300"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                {item.label}

                {/* active underline */}
                <span
                  className={`
                    absolute bottom-0 left-1/2 h-[2px]
                    -translate-x-1/2 rounded-full bg-emerald-400
                    transition-all duration-300
                    ${active ? "w-6 opacity-100" : "w-0 opacity-0"}
                  `}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right */}
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

      {/* Mobile */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0b211b] px-5 py-4 xl:hidden">
          <nav
            aria-label="Điều hướng trang giới thiệu trên thiết bị di động"
            className="mx-auto grid max-w-7xl grid-cols-2 gap-2 sm:grid-cols-4"
          >
            {navigation.map((item, index) => {
              const active = activeSection === item.id;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavigationClick(item.id)}
                  className={`
                    rounded-xl border px-3 py-3 text-sm
                    transition-all duration-300
                    ${
                      active
                        ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300"
                        : "border-white/10 text-slate-200 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <span
                    className={`
                      mr-2 text-[10px] font-bold
                      ${
                        active
                          ? "text-emerald-300"
                          : "text-emerald-300/70"
                      }
                    `}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {item.label}
                </Link>
              );
            })}
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