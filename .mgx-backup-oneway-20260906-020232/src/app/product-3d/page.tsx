"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  ChevronLeft,
  Eye,
  EyeOff,
  Info,
  MousePointer2,
  RotateCcw,
  Sparkles,
  Wind,
} from "lucide-react";
import { useCallback, useState } from "react";

import type { ProductPart } from "@/components/product-3d/product-catalog";

const MosguardXViewer = dynamic(
  () => import("@/components/product-3d/mosguardx-viewer"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 grid place-items-center">
        <div className="rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-emerald-300 backdrop-blur-xl">
          ĐANG KHỞI TẠO KHÔNG GIAN 3D
        </div>
      </div>
    ),
  },
);

type ViewMode = "normal" | "transparent";

export default function Product3DPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("normal");
  const [hoveredPart, setHoveredPart] = useState<ProductPart | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [mosquitoWave, setMosquitoWave] = useState(0);
  const [mosquitoActive, setMosquitoActive] = useState(false);
  const [status, setStatus] = useState("Mô hình sẵn sàng");

  const resetDevice = useCallback(() => {
    setMosquitoActive(false);
    setHoveredPart(null);
    setViewMode("normal");
    setResetSignal((value) => value + 1);
    setStatus("Đã thu linh kiện, gắn nắp và trở về mặt sau");
  }, []);

  const releaseMosquitoes = useCallback(() => {
    setResetSignal((value) => value + 1);
    setMosquitoWave((value) => value + 1);
    setMosquitoActive(true);
    setStatus("Đang mô phỏng đàn muỗi tiếp cận cửa hút");
  }, []);

  return (
    <main className="product-3d-grid relative h-[100svh] min-h-[620px] overflow-hidden bg-[#030807] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(16,185,129,0.11),transparent_33%),radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.08),transparent_25%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-black/65 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-44 bg-gradient-to-t from-black/70 to-transparent" />

      <div className="absolute inset-0 z-0">
        <MosguardXViewer
          shellOpacity={viewMode === "transparent" ? 0.3 : 1}
          resetSignal={resetSignal}
          mosquitoActive={mosquitoActive}
          mosquitoWave={mosquitoWave}
          onPartHover={setHoveredPart}
          onReset={resetDevice}
          onReleaseMosquitoes={releaseMosquitoes}
          onMosquitoPhaseChange={(phase) => {
            if (phase === "bait") {
              setStatus("Đã tiếp xúc hộp mồi PPF — cá thể mang PPF chuyển sang màu tím");
            } else if (phase === "fan") {
              setStatus("Muỗi mang PPF đang đi qua quạt dẫn dòng");
            } else if (phase === "exit") {
              setStatus("Muỗi màu tím đang rời hệ thống — chuẩn bị chuyển sang Demo 02");
            }
          }}
          onMosquitoComplete={() => {
            setMosquitoActive(false);
            setStatus("Muỗi mang PPF đã rời thiết bị — chuyển sang Demo 02");

            window.setTimeout(() => {
              router.push("/product-3d/ppf");
            }, 650);
          }}
        />
      </div>

      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 p-4 sm:p-6">
        <div className="pointer-events-auto flex items-center gap-3">
          <Link
            href="/"
            aria-label="Quay về trang giới thiệu"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/55 text-slate-200 shadow-2xl backdrop-blur-xl transition hover:border-emerald-300/40 hover:bg-emerald-400/10 hover:text-emerald-200"
          >
            <ChevronLeft size={18} />
          </Link>

          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] text-emerald-300/90">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
              DIGITAL PRODUCT EXPLORER
            </div>
            <h1 className="mt-1 text-lg font-semibold tracking-tight text-white sm:text-xl">
              MosGuardX · Cấu trúc thiết bị
            </h1>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center rounded-full border border-white/10 bg-black/55 p-1 shadow-2xl backdrop-blur-xl">
          <button
            type="button"
            aria-label="Hiển thị vỏ bình thường"
            aria-pressed={viewMode === "normal"}
            onClick={() => setViewMode("normal")}
            className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-[11px] font-semibold transition ${
              viewMode === "normal"
                ? "bg-white text-slate-950"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Eye size={13} />
            <span className="hidden sm:inline">Vỏ thường</span>
          </button>

          <button
            type="button"
            aria-label="Hiển thị vỏ trong suốt 70 phần trăm"
            aria-pressed={viewMode === "transparent"}
            onClick={() => setViewMode("transparent")}
            className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-[11px] font-semibold transition ${
              viewMode === "transparent"
                ? "bg-emerald-300 text-[#05251a]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <EyeOff size={13} />
            <span className="hidden sm:inline">Trong suốt</span>
          </button>
        </div>
      </header>

      {hoveredPart && (
        <aside className="mgx-part-panel pointer-events-none absolute bottom-24 left-4 z-20 w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#07110e]/88 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:bottom-24 sm:left-6">
          <div className="h-0.5 w-full" style={{ backgroundColor: hoveredPart.accent }} />
          <div className="p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border"
                style={{
                  color: hoveredPart.accent,
                  borderColor: `${hoveredPart.accent}44`,
                  backgroundColor: `${hoveredPart.accent}12`,
                }}
              >
                <Box size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-white">{hoveredPart.label}</p>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-bold tracking-wider text-slate-400">
                    {hoveredPart.code}
                  </span>
                </div>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300/80">
                  {hoveredPart.category}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm font-medium leading-6 text-slate-200">
              {hoveredPart.summary}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-400">{hoveredPart.details}</p>

            <div className="mt-4 flex items-center gap-2 border-t border-white/8 pt-3 text-[10px] font-medium text-slate-400">
              <MousePointer2 size={13} className="text-emerald-300" />
              {hoveredPart.interaction === "lid"
                ? "Nhấp trái để tháo hoặc gắn nắp"
                : hoveredPart.interaction === "explode"
                  ? "Nhấp trái để bung hoặc thu linh kiện"
                  : "Linh kiện khung cố định"}
            </div>
          </div>
        </aside>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center px-4 sm:bottom-6">
        <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-black/55 p-1.5 text-[10px] font-medium text-slate-300 shadow-2xl backdrop-blur-xl sm:gap-2 sm:px-2">
          <span className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5">
            <MousePointer2 size={12} className="text-emerald-300" />
            Trái · chọn linh kiện
          </span>
          <span className="hidden h-4 w-px bg-white/10 sm:block" />
          <span className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5">
            <RotateCcw size={12} className="text-sky-300" />
            Phải trên máy · reset
          </span>
          <span className="hidden h-4 w-px bg-white/10 sm:block" />
          <span className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5">
            <Wind size={12} className="text-violet-300" />
            Phải trên nền · thả muỗi
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-20 z-20 -translate-x-1/2 sm:top-6">
        <div
          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold tracking-wide shadow-xl backdrop-blur-xl transition ${
            mosquitoActive
              ? "border-violet-300/30 bg-violet-400/10 text-violet-100"
              : "border-white/8 bg-black/35 text-slate-400"
          }`}
        >
          {mosquitoActive ? <Sparkles size={12} /> : <Info size={12} />}
          {status}
        </div>
      </div>
    </main>
  );
}
