"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ChevronDown,
  Home,
  Landmark,
  Layers3,
} from "lucide-react";
import { useState } from "react";

const platforms = [
  {
    name: "MosGuardX Home",
    segment: "B2C · Household",
    description:
      "Theo dõi hoạt động muỗi và thiết bị tại gia đình.",
    href: "/household",
    icon: Home,
    status: "LIVE",
  },
  {
    name: "MosGuardX Enterprise",
    segment: "B2B · Business & Operators",
    description:
      "Quản lý nhiều cơ sở, thiết bị và hoạt động vận hành.",
    href: "/enterprise",
    icon: Building2,
    status: "COMING SOON",
  },
  {
    name: "MosGuardX Command Center",
    segment: "B2G · Public Health",
    description:
      "Giám sát mạng lưới, khu vực, hotspot và cảnh báo.",
    href: "/dashboard",
    icon: Landmark,
    status: "MVP",
  },
];

export default function PlatformSwitcher() {
  const pathname = usePathname();

  const [open, setOpen] =
    useState(false);

  const current =
    pathname.startsWith("/household") ||
    pathname.startsWith("/home") ||
    pathname.startsWith("/activity") ||
    pathname.startsWith("/my-device") ||
    pathname.startsWith("/home-alerts") ||
    pathname.startsWith("/home-settings")
      ? "MosGuardX Home"
      : pathname.startsWith("/enterprise")
        ? "MosGuardX Enterprise"
        : pathname.startsWith("/dashboard") ||
            pathname.startsWith("/map") ||
            pathname.startsWith("/alerts") ||
            pathname.startsWith("/devices") ||
            pathname.startsWith("/reports") ||
            pathname.startsWith("/ai-api")
          ? "MosGuardX Command Center"
          : null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() =>
          setOpen((value) => !value)
        }
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-bold text-[#10251f] shadow-sm transition hover:bg-emerald-300"
      >
        <Layers3 size={15} />

        {current ?? "Platforms"}

        <ChevronDown
          size={15}
          className={`transition ${
            open
              ? "rotate-180"
              : ""
          }`}
        />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close platform menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() =>
              setOpen(false)
            }
          />

          <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[360px] overflow-hidden rounded-[24px] border border-white/10 bg-[#10251f] p-2 shadow-2xl">
            <div className="px-3 py-3">
              <p className="text-[10px] font-bold tracking-[0.18em] text-emerald-300">
                MOSGUARDX PLATFORM
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Chọn nền tảng phù hợp với
                nhu cầu sử dụng.
              </p>
            </div>

            <div className="space-y-1">
              {platforms.map(
                (platform) => {
                  const Icon =
                    platform.icon;

                  const active =
                    current ===
                    platform.name;

                  return (
                    <Link
                      key={
                        platform.name
                      }
                      href={
                        platform.href
                      }
                      onClick={() =>
                        setOpen(false)
                      }
                      className={`block rounded-[18px] p-4 transition ${
                        active
                          ? "bg-emerald-400/15"
                          : "hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                            active
                              ? "bg-emerald-400 text-[#10251f]"
                              : "bg-white/[0.06] text-emerald-300"
                          }`}
                        >
                          <Icon
                            size={20}
                          />
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-bold text-white">
                                {
                                  platform.name
                                }
                              </p>

                              <p className="mt-0.5 text-[10px] font-bold tracking-wide text-emerald-300">
                                {
                                  platform.segment
                                }
                              </p>
                            </div>

                            <span className="shrink-0 rounded-full bg-white/[0.07] px-2 py-1 text-[8px] font-bold tracking-wide text-slate-300">
                              {
                                platform.status
                              }
                            </span>
                          </div>

                          <p className="mt-2 text-xs leading-5 text-slate-400">
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
          </div>
        </>
      )}
    </div>
  );
}