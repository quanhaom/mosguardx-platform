"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Building2,
  Check,
  ChevronDown,
  Home,
  Landmark,
  Layers3,
} from "lucide-react";

import { useState } from "react";

type PlatformId =
  | "home"
  | "enterprise"
  | "command-center";

type PlatformStatus =
  | "LIVE"
  | "MVP";

type PlatformSwitcherProps = {
  variant?: "dark" | "light";
  compact?: boolean;
  align?: "left" | "right";
  className?: string;
};

const platforms = [
  {
    id: "home" as const,

    name:
      "MosGuardX Home",

    shortName:
      "Home",

    segment:
      "B2C · HOUSEHOLD",

    description:
      "Theo dõi hoạt động muỗi, cảnh báo và thiết bị trong gia đình.",

    href:
      "/household",

    appHref:
      "/home",

    icon:
      Home,

    status:
      "LIVE" as PlatformStatus,
  },

  {
    id:
      "enterprise" as const,

    name:
      "MosGuardX Enterprise",

    shortName:
      "Enterprise",

    segment:
      "B2B · BUSINESS & OPERATORS",

    description:
      "Quản lý nhiều site, thiết bị, bảo trì và hoạt động vận hành.",

    href:
      "/enterprise",

    appHref:
      "/enterprise/app",

    icon:
      Building2,

    status:
      "LIVE" as PlatformStatus,
  },

  {
    id:
      "command-center" as const,

    name:
      "MosGuardX Command Center",

    shortName:
      "Command Center",

    segment:
      "B2G · PUBLIC HEALTH",

    description:
      "Giám sát mạng lưới trạm, khu vực, hotspot và cảnh báo.",

    href:
      "/dashboard",

    appHref:
      "/dashboard",

    icon:
      Landmark,

    status:
      "MVP" as PlatformStatus,
  },
];

export default function PlatformSwitcher({
  variant = "dark",
  compact = false,
  align = "right",
  className = "",
}: PlatformSwitcherProps) {
  const pathname =
    usePathname();

  const [
    open,
    setOpen,
  ] = useState(false);

  const current =
    getCurrentPlatform(
      pathname,
    );

  const CurrentIcon =
    current?.icon ??
    Layers3;

  const buttonClass =
    variant === "dark"
      ? [
          "bg-emerald-400",
          "text-[#10251f]",
          "hover:bg-emerald-300",
          "shadow-sm",
        ].join(" ")
      : [
          "border",
          "border-emerald-200",
          "bg-emerald-50",
          "text-emerald-900",
          "hover:border-emerald-300",
          "hover:bg-emerald-100",
        ].join(" ");

  return (
    <div
      className={`relative ${className}`}
    >
      {/* =============================================
          BUTTON
      ============================================= */}

      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() =>
          setOpen(
            (value) =>
              !value,
          )
        }
        className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3.5 text-xs font-bold transition ${buttonClass}`}
      >
        <CurrentIcon
          size={15}
          className="shrink-0"
        />

        <span className="hidden whitespace-nowrap sm:inline">
          {compact
            ? current?.shortName ??
              "Platforms"
            : current
              ? current.shortName
              : "Platforms"}
        </span>

        <span className="sm:hidden">
          {current
            ? current.id ===
              "command-center"
              ? "B2G"
              : current.id ===
                  "enterprise"
                ? "B2B"
                : "B2C"
            : "Apps"}
        </span>

        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform duration-200 ${
            open
              ? "rotate-180"
              : ""
          }`}
        />
      </button>

      {/* =============================================
          DROPDOWN
      ============================================= */}

      {open && (
        <>
          {/* Outside click */}

          <button
            type="button"
            aria-label="Close platform menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() =>
              setOpen(false)
            }
          />

          <div
            role="menu"
            className={`absolute top-[calc(100%+12px)] z-50 w-[min(390px,calc(100vw-2rem))] overflow-hidden rounded-[26px] border border-white/10 bg-[#10251f] p-2 text-white shadow-2xl ${
              align === "left"
                ? "left-0"
                : "right-0"
            }`}
          >
            {/* =====================================
                HEADER
            ===================================== */}

            <div className="px-3 pb-3 pt-2">
              <div className="flex items-center gap-2">
                <Layers3
                  size={15}
                  className="text-emerald-300"
                />

                <p className="text-[10px] font-bold tracking-[0.18em] text-emerald-300">
                  MOSGUARDX PLATFORM
                </p>
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Một hệ sinh thái,
                ba trải nghiệm dành
                cho ba nhóm người dùng.
              </p>
            </div>

            {/* =====================================
                PLATFORM CARDS
            ===================================== */}

            <div className="space-y-2">
              {platforms.map(
                (platform) => {
                  const Icon =
                    platform.icon;

                  const active =
                    current?.id ===
                    platform.id;

                  return (
                    <Link
                      key={
                        platform.id
                      }
                      role="menuitem"
                      href={
                        platform.href
                      }
                      onClick={() =>
                        setOpen(false)
                      }
                      className={`group block rounded-[22px] border p-4 transition duration-200 ${
                        active
                          ? "border-emerald-400/40 bg-emerald-400/[0.12]"
                          : "border-transparent hover:border-white/10 hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex items-start gap-3">

                        {/* Icon */}

                        <span
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition ${
                            active
                              ? "bg-emerald-400 text-[#10251f]"
                              : "bg-white/[0.07] text-emerald-300 group-hover:bg-white/[0.1]"
                          }`}
                        >
                          <Icon
                            size={21}
                          />
                        </span>

                        {/* Content */}

                        <div className="min-w-0 flex-1">

                          {/* Name + status */}

                          <div className="flex items-start justify-between gap-3">

                            <div className="min-w-0">
                              <p className="truncate text-[15px] font-bold text-white">
                                {
                                  platform.name
                                }
                              </p>

                              <p className="mt-1 text-[9px] font-bold tracking-[0.13em] text-emerald-300">
                                {
                                  platform.segment
                                }
                              </p>
                            </div>

                            {/* Status area */}

                            <div className="flex shrink-0 items-center gap-2">

                              {/* Active indicator */}

                              {active && (
                                <span
                                  title="Current platform"
                                  className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-[#10251f]"
                                >
                                  <Check
                                    size={13}
                                    strokeWidth={3}
                                  />
                                </span>
                              )}

                              {/* Status */}

                              <PlatformStatusBadge
                                status={
                                  platform.status
                                }
                              />
                            </div>
                          </div>

                          {/* Description */}

                          <p className="mt-3 text-xs leading-5 text-slate-400">
                            {
                              platform.description
                            }
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                },
              )}
            </div>

            {/* =====================================
                SHARED CORE
            ===================================== */}

            <div className="mx-2 mt-3 rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
              <p className="text-[9px] font-bold tracking-[0.14em] text-slate-500">
                SHARED CORE
              </p>

              <p className="mt-1 text-[11px] leading-5 text-slate-400">
                Device · AI · Events ·
                Weather · Alerts · Data
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


/* =========================================================
   STATUS BADGE
========================================================= */

function PlatformStatusBadge({
  status,
}: {
  status: PlatformStatus;
}) {
  if (
    status === "LIVE"
  ) {
    return (
      <span className="inline-flex min-w-[42px] items-center justify-center rounded-full bg-emerald-400 px-2.5 py-1 text-[8px] font-extrabold tracking-[0.06em] text-[#10251f]">
        LIVE
      </span>
    );
  }

  return (
    <span className="inline-flex min-w-[42px] items-center justify-center rounded-full bg-sky-300/10 px-2.5 py-1 text-[8px] font-extrabold tracking-[0.06em] text-sky-200">
      MVP
    </span>
  );
}


/* =========================================================
   CURRENT PLATFORM
========================================================= */

function getCurrentPlatform(
  pathname: string,
) {
  const homeRoutes = [
    "/household",
    "/home",
    "/activity",
    "/my-device",
    "/home-alerts",
    "/home-settings",
    "/onboarding",
  ];

  const commandCenterRoutes =
    [
      "/dashboard",
      "/map",
      "/alerts",
      "/devices",
      "/reports",
      "/ai-api",
      "/settings",
      "/detection",
    ];

  if (
    matchesAnyRoute(
      pathname,
      homeRoutes,
    )
  ) {
    return platforms.find(
      (platform) =>
        platform.id ===
        "home",
    );
  }

  if (
    routeMatches(
      pathname,
      "/enterprise",
    )
  ) {
    return platforms.find(
      (platform) =>
        platform.id ===
        "enterprise",
    );
  }

  if (
    matchesAnyRoute(
      pathname,
      commandCenterRoutes,
    )
  ) {
    return platforms.find(
      (platform) =>
        platform.id ===
        "command-center",
    );
  }

  return null;
}


/* =========================================================
   ROUTE HELPERS
========================================================= */

function matchesAnyRoute(
  pathname: string,
  routes: string[],
) {
  return routes.some(
    (route) =>
      routeMatches(
        pathname,
        route,
      ),
  );
}


function routeMatches(
  pathname: string,
  route: string,
) {
  return (
    pathname === route ||
    pathname.startsWith(
      `${route}/`,
    )
  );
}