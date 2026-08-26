"use client";

import Link from "next/link";
import { ArrowRight, Languages, Menu, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/i18n/language-context";

const navigation = [
  { href: "/#hero", id: "hero", vi: "Tổng quan", en: "Overview" },
  { href: "/#problem", id: "problem", vi: "Bài toán", en: "Problem" },
  { href: "/#product", id: "product", vi: "Sản phẩm", en: "Product" },
  { href: "/#solution", id: "solution", vi: "Giải pháp", en: "Solution" },
  { href: "/#ai", id: "ai", vi: "AI", en: "AI" },
  { href: "/#demo", id: "demo", vi: "Demo", en: "Demo" },
  { href: "/#experiment", id: "experiment", vi: "Thực nghiệm", en: "Experiment" },
  { href: "/#segments", id: "segments", vi: "Khách hàng", en: "Customers" },
  { href: "/#business", id: "business", vi: "Kinh doanh", en: "Business" },
  { href: "/#expansion", id: "expansion", vi: "Mở rộng", en: "Expansion" },
  { href: "/#team", id: "team", vi: "Đội ngũ", en: "Team" },
] as const;

export default function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const updateActiveSection = () => {
      const headerOffset = 120;
      let currentSection = "hero";

      for (const item of navigation) {
        const section = document.getElementById(item.id);
        if (!section) continue;
        if (section.getBoundingClientRect().top <= headerOffset) {
          currentSection = item.id;
        }
      }

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 10;

      if (atBottom) currentSection = navigation[navigation.length - 1].id;
      setActiveSection(currentSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  const handleNavigationClick = (id: string) => {
    setActiveSection(id);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b211b]/95 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-5 md:px-8">
        <Link
          href="/#hero"
          className="flex shrink-0 items-center gap-3"
          onClick={() => handleNavigationClick("hero")}
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
          aria-label={language === "vi" ? "Điều hướng trang giới thiệu" : "Landing page navigation"}
          className="hidden flex-1 items-center justify-center gap-0.5 text-[10px] font-semibold xl:flex"
        >
          {navigation.map((item) => {
            const active = activeSection === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => handleNavigationClick(item.id)}
                className={`relative whitespace-nowrap rounded-lg px-2 py-2 transition-all duration-300 ${
                  active
                    ? "bg-emerald-400/15 text-emerald-300"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item[language]}
                <span
                  className={`absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-emerald-400 transition-all duration-300 ${
                    active ? "w-5 opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center rounded-xl border border-white/10 bg-white/[0.05] p-1 md:flex">
            <Languages size={14} className="ml-2 mr-1 text-slate-400" />
            <button
              type="button"
              onClick={() => setLanguage("vi")}
              className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold transition ${
                language === "vi"
                  ? "bg-emerald-400 text-[#10251f]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              VI
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold transition ${
                language === "en"
                  ? "bg-emerald-400 text-[#10251f]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              EN
            </button>
          </div>

          <Link
            href="/dashboard"
            className="hidden items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-bold text-[#10251f] transition hover:bg-emerald-300 sm:inline-flex"
          >
            Dashboard
            <ArrowRight size={15} />
          </Link>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
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
          <div className="mx-auto mb-4 flex max-w-7xl items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-2">
            <span className="flex items-center gap-2 px-2 text-xs font-semibold text-slate-300">
              <Languages size={15} />
              {language === "vi" ? "Ngôn ngữ" : "Language"}
            </span>
            <div className="flex gap-1">
              {(["vi", "en"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`rounded-lg px-4 py-2 text-xs font-bold ${
                    language === lang
                      ? "bg-emerald-400 text-[#10251f]"
                      : "text-slate-300"
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <nav className="mx-auto grid max-w-7xl grid-cols-2 gap-2 sm:grid-cols-4">
            {navigation.map((item, index) => {
              const active = activeSection === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => handleNavigationClick(item.id)}
                  className={`rounded-xl border px-3 py-3 text-sm transition-all duration-300 ${
                    active
                      ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300"
                      : "border-white/10 text-slate-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="mr-2 text-[10px] font-bold text-emerald-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item[language]}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="mx-auto mt-3 flex max-w-7xl items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-[#10251f] sm:hidden"
          >
            {language === "vi" ? "Mở Dashboard" : "Open Dashboard"}
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </header>
  );
}
