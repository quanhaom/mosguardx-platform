"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const landingNavigation = [
  {
    href: "/#overview",
    section: "overview",
    label: "Tổng quan",
  },
  {
    href: "/#demo",
    section: "demo",
    label: "Demo MVP",
  },
  {
    href: "/#solution",
    section: "solution",
    label: "Giải pháp",
  },

  {
    href: "/#segments",
    section: "segments",
    label: "Ứng dụng",
  },
];

export default function PublicHeader() {
  const pathname = usePathname();

  const [activeSection, setActiveSection] =
    useState("");

  const [mobileOpen, setMobileOpen] =
    useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    function updateSectionFromHash() {
      const hash = window.location.hash.replace("#", "");

      if (hash) {
        setActiveSection(hash);
      }
    }

    updateSectionFromHash();

    const sections = landingNavigation
      .map((item) =>
        document.getElementById(item.section),
      )
      .filter(
        (section): section is HTMLElement =>
          Boolean(section),
      );

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              second.intersectionRatio -
              first.intersectionRatio,
          );

        const currentSection =
          visibleSections[0]?.target.id;

        if (currentSection) {
          setActiveSection(currentSection);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.05, 0.15, 0.3, 0.5],
      },
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    window.addEventListener(
      "hashchange",
      updateSectionFromHash,
    );

    return () => {
      observer.disconnect();

      window.removeEventListener(
        "hashchange",
        updateSectionFromHash,
      );
    };
  }, [pathname]);

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b211b]/95 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-[#10251f]">
            <ShieldCheck size={23} />
          </span>

          <span>
            <strong className="block text-lg leading-none">
              MosguardX
            </strong>

            <small className="mt-1 block text-[9px] font-bold tracking-[0.2em] text-emerald-300">
              EARLY WARNING NETWORK
            </small>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {landingNavigation.map((item) => {
            const active =
              pathname === "/" &&
              activeSection === item.section;

            return (
              <Link
                key={item.section}
                href={item.href}
                aria-current={
                  active ? "location" : undefined
                }
                className={`relative rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-emerald-400/15 text-emerald-300"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}

                {active && (
                  <>
                    <span className="absolute left-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-emerald-400" />

                    <span className="absolute inset-x-4 -bottom-[9px] h-0.5 rounded-full bg-emerald-400" />
                  </>
                )}
              </Link>
            );
          })}

          <Link
            href="/expansion"
            aria-current={
              pathname.startsWith("/expansion")
                ? "page"
                : undefined
            }
            className={`relative rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              pathname.startsWith("/expansion")
                ? "bg-emerald-400/15 text-emerald-300"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            Mở rộng

            {pathname.startsWith("/expansion") && (
              <>
                <span className="absolute left-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-emerald-400" />

                <span className="absolute inset-x-4 -bottom-[9px] h-0.5 rounded-full bg-emerald-400" />
              </>
            )}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-bold text-[#10251f] transition hover:bg-emerald-300 sm:inline-flex"
          >
            Dashboard
            <ArrowRight size={15} />
          </Link>

          <button
            type="button"
            aria-label={
              mobileOpen
                ? "Đóng menu"
                : "Mở menu"
            }
            className="rounded-xl border border-white/15 p-2.5 text-white md:hidden"
            onClick={() =>
              setMobileOpen(
                (current) => !current,
              )
            }
          >
            {mobileOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-white/10 bg-[#0b211b] px-5 py-4 md:hidden">
          <div className="space-y-1">
            {landingNavigation.map((item) => {
              const active =
                pathname === "/" &&
                activeSection === item.section;

              return (
                <Link
                  key={item.section}
                  href={item.href}
                  onClick={closeMobileMenu}
                  aria-current={
                    active
                      ? "location"
                      : undefined
                  }
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-emerald-400 text-[#10251f]"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}

                  {active && (
                    <span className="h-2 w-2 rounded-full bg-[#10251f]" />
                  )}
                </Link>
              );
            })}

            <Link
              href="/expansion"
              onClick={closeMobileMenu}
              aria-current={
                pathname.startsWith("/expansion")
                  ? "page"
                  : undefined
              }
              className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                pathname.startsWith("/expansion")
                  ? "bg-emerald-400 text-[#10251f]"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              Mở rộng

              {pathname.startsWith("/expansion") && (
                <span className="h-2 w-2 rounded-full bg-[#10251f]" />
              )}
            </Link>

            <Link
              href="/dashboard"
              onClick={closeMobileMenu}
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-[#10251f]"
            >
              Mở Dashboard
              <ArrowRight size={16} />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}