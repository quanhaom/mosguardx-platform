"use client";
import PlatformSwitcher from "@/components/layout/platform-switcher";
import Link from "next/link";
import {
  usePathname,
} from "next/navigation";

import {
  BarChart3,
  Bell,
  BrainCircuit,
  ChevronRight,
  Cpu,
  House,
  Languages,
  Landmark,
  LayoutDashboard,
  Map,
  Menu,
  Radio,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useLanguage,
} from "../i18n/language-context";

const publicRoutes = [
  "/",
  "/risk-api",
  "/household",
  "/enterprise",
  "/expansion",
  "/product-3d",

  // MosGuardX Home
  "/home",
  "/activity",
  "/my-device",
  "/home-alerts",
  "/home-settings",
  "/login",
  "/onboarding",
];

export default function DashboardShell({
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

  const {
    language,
    setLanguage,
    tr,
  } = useLanguage();

  const navigation = [
    {
      href: "/dashboard",

      label: tr(
        "Tổng quan",
        "Overview",
      ),

      icon: LayoutDashboard,
    },
    {
      href: "/map",

      label: tr(
        "Bản đồ giám sát",
        "Monitoring map",
      ),

      icon: Map,
    },
    {
      href: "/alerts",

      label: tr(
        "Cảnh báo",
        "Alerts",
      ),

      icon: Bell,

      badge: 2,
    },
    {
      href: "/devices",

      label: tr(
        "Mạng lưới trạm",
        "Station network",
      ),

      icon: Cpu,
    },
    {
      href: "/ai-api",

      label: tr(
        "AI / API",
        "AI / API",
      ),

      icon: BrainCircuit,
    },
    {
      href: "/reports",

      label: tr(
        "Báo cáo",
        "Reports",
      ),

      icon: BarChart3,
    },
    {
      href: "/settings",

      label: tr(
        "Cấu hình",
        "Settings",
      ),

      icon: Settings,
    },
  ];

  const pageNames: Record<
    string,
    string
  > = {
    "/dashboard": tr(
      "Tổng quan Command Center",
      "Command Center overview",
    ),

    "/map": tr(
      "Bản đồ giám sát vector",
      "Vector monitoring map",
    ),

    "/alerts": tr(
      "Cảnh báo mạng lưới",
      "Network alerts",
    ),

    "/devices": tr(
      "Mạng lưới thiết bị",
      "Device network",
    ),

    "/ai-api": tr(
      "AI và API",
      "AI and API",
    ),

    "/reports": tr(
      "Báo cáo và phân tích",
      "Reports and analytics",
    ),

    "/settings": tr(
      "Cấu hình Command Center",
      "Command Center settings",
    ),
  };

  const isPublicRoute =
    publicRoutes.some(
      (route) => {
        if (route === "/") {
          return (
            pathname === "/"
          );
        }

        return (
          pathname === route ||
          pathname.startsWith(
            `${route}/`,
          )
        );
      },
    );

  if (isPublicRoute) {
    return <>{children}</>;
  }

  const currentPageName =
    pageNames[pathname] ??
    "MosGuardX Command Center";

  const currentPageSlug =
    pathname === "/dashboard"
      ? ""
      : pathname
          .split("/")
          .filter(Boolean)
          .join(" / ")
          .toUpperCase();

  const sidebar = (
    <>
      {/* BRAND */}

      <div className="flex h-20 shrink-0 items-center gap-3 border-b border-white/10 px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
          onClick={() =>
            setMobileOpen(false)
          }
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-[#10251f]">
            <ShieldCheck
              size={24}
            />
          </span>

          <span>
            <strong className="block text-lg leading-none">
              MosguardX
            </strong>

            <small className="mt-1 block text-[9px] font-semibold tracking-[0.16em] text-emerald-300">
              COMMAND CENTER
            </small>
          </span>
        </Link>

        <button
          type="button"
          aria-label={tr(
            "Đóng menu",
            "Close menu",
          )}
          className="ml-auto rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
          onClick={() =>
            setMobileOpen(false)
          }
        >
          <X size={20} />
        </button>
      </div>

      {/* NAVIGATION */}

      <nav className="mgx-scrollbar flex-1 space-y-1 overflow-y-auto px-3 py-6">
        <Link
          href="/"
          onClick={() =>
            setMobileOpen(false)
          }
          className="mb-4 flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
        >
          <House size={19} />

          <span>
            {tr(
              "Website MosGuardX",
              "MosGuardX website",
            )}
          </span>
        </Link>

        <p className="mb-2 px-4 text-[9px] font-bold tracking-[0.18em] text-emerald-300">
          B2G · PUBLIC HEALTH
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
              pathname.startsWith(
                `${href}/`,
              );

            return (
              <Link
                key={href}
                href={href}
                onClick={() =>
                  setMobileOpen(
                    false,
                  )
                }
                aria-current={
                  active
                    ? "page"
                    : undefined
                }
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-emerald-400 font-semibold text-[#10251f] shadow-lg shadow-emerald-950/10"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon
                  size={19}
                />

                <span className="flex-1">
                  {label}
                </span>

                {badge !==
                  undefined &&
                  badge > 0 && (
                    <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      {badge}
                    </span>
                  )}

                {active &&
                  badge ===
                    undefined && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10251f]" />
                  )}
              </Link>
            );
          },
        )}
      </nav>

      {/* STATUS */}

      <div className="mx-4 mb-4 shrink-0 rounded-xl border border-emerald-300/15 bg-emerald-300/5 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

          Command Center MVP
        </div>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          {tr(
            "Dữ liệu hiện tại chủ yếu phục vụ trình diễn MVP.",
            "Current data is primarily used for MVP demonstration.",
          )}
        </p>
      </div>

      {/* PROFILE */}

      <div className="flex shrink-0 items-center gap-3 border-t border-white/10 p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800">
          HQ
        </div>

        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">
            Command Center
          </div>

          <div className="text-xs text-slate-400">
            {tr(
              "Quản trị hệ thống",
              "System administrator",
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f3f7f5]">
      {/* DESKTOP */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-[#10251f] text-white lg:flex">
        {sidebar}
      </aside>

      {/* MOBILE */}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label={tr(
              "Đóng menu",
              "Close menu",
            )}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() =>
              setMobileOpen(false)
            }
          />

          <aside className="relative flex h-full w-72 flex-col bg-[#10251f] text-white shadow-2xl">
            {sidebar}
          </aside>
        </div>
      )}

      {/* CONTENT */}

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#dce8e2] bg-white/90 px-5 backdrop-blur-xl md:px-8">
          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label={tr(
                "Mở menu",
                "Open menu",
              )}
              className="shrink-0 rounded-xl border border-slate-200 bg-white p-2 transition hover:border-emerald-300 hover:text-emerald-700 lg:hidden"
              onClick={() =>
                setMobileOpen(true)
              }
            >
              <Menu
                size={20}
              />
            </button>

            <div className="min-w-0">
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

                <span className="flex items-center gap-1.5 truncate text-emerald-700">
                  <Landmark
                    size={12}
                  />

                  B2G COMMAND CENTER
                </span>
              </div>

              <div className="mt-1 flex min-w-0 items-center gap-2">
                <h1 className="truncate text-lg font-bold text-[#16352a] sm:text-xl">
                  {
                    currentPageName
                  }
                </h1>

                {currentPageSlug && (
                  <span className="hidden shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700 sm:inline">
                    {
                      currentPageSlug
                    }
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Platform switcher */}

            <PlatformSwitcher
              variant="light"
              compact
            />

            {/* Language */}

            <div className="hidden items-center rounded-full border border-slate-200 bg-white p-1 text-[10px] shadow-sm sm:flex">
              <Languages
                size={14}
                className="ml-2 hidden text-slate-400 md:block"
              />

              {(["vi", "en"] as const).map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setLanguage(item)
                    }
                    className={`rounded-full px-2.5 py-1.5 font-bold transition ${
                      language === item
                        ? "bg-[#10251f] text-white"
                        : "text-slate-500 hover:text-emerald-700"
                    }`}
                  >
                    {item.toUpperCase()}
                  </button>
                ),
              )}
            </div>

            {/* Data status */}

            <span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 lg:flex">
              <Radio
                size={14}
                className="animate-pulse"
              />

              {tr(
                "Dữ liệu minh họa",
                "Illustrative data",
              )}
            </span>

            {/* Alerts */}

            <Link
              href="/alerts"
              aria-label={tr(
                "Mở cảnh báo",
                "Open alerts",
              )}
              className="relative hidden rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 sm:block"
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