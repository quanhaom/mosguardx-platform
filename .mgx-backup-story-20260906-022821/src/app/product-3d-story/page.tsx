"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ChevronLeft,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import type { StoryPhase } from "@/components/product-3d/product-story-viewer";

const ProductStoryViewer = dynamic(
  () => import("@/components/product-3d/product-story-viewer"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 grid place-items-center">
        <div className="rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-emerald-300 backdrop-blur-xl">
          ĐANG KHỞI TẠO STORY 3D
        </div>
      </div>
    ),
  },
);

const copy: Record<StoryPhase, { step: string; title: string; body: string }> = {
  idle: {
    step: "00",
    title: "Sẵn sàng",
    body: "Một Canvas duy nhất cho toàn bộ hành trình từ MosGuardX ra môi trường.",
  },
  approach: {
    step: "01",
    title: "Tiếp cận thiết bị",
    body: "Muỗi ngoài môi trường bay tới vùng dẫn dụ của MosGuardX.",
  },
  inlet: {
    step: "02",
    title: "Đi vào hệ thống",
    body: "Đàn muỗi đi qua cửa hút và luồng dẫn khí.",
  },
  imaging: {
    step: "03",
    title: "Vùng camera",
    body: "Muỗi đi qua vùng quan sát để phục vụ nhận diện và ghi nhận.",
  },
  ppf: {
    step: "04",
    title: "Tiếp xúc PPF",
    body: "Từng cá thể đổi từ đen sang tím ngay khi đi qua MGX_BOX/điểm PPF của demo.",
  },
  fan: {
    step: "05",
    title: "Qua quạt dẫn dòng",
    body: "Muỗi đã mang PPF tiếp tục một chiều qua quạt, không quay lại hộp mồi.",
  },
  exit: {
    step: "06",
    title: "Rời MosGuardX",
    body: "Camera theo đàn muỗi qua EXIT mà không đổi route hoặc reload Canvas.",
  },
  outdoor: {
    step: "07",
    title: "Phân tán ngoài sân",
    body: "Camera kéo ra môi trường nhà ở và tiếp tục bám theo đàn muỗi tím.",
  },
  breeding: {
    step: "08",
    title: "Điểm nước sinh sản",
    body: "Muỗi tiếp cận vũng nước ngoài khu dân cư và thực hiện hành vi sinh sản trong mô phỏng.",
  },
  transfer: {
    step: "09",
    title: "Autodissemination",
    body: "Các hạt tím biểu diễn PPF được chuyển từ cá thể mang chất xuống điểm nước.",
  },
  blocked: {
    step: "10",
    title: "Chặn trưởng thành",
    body: "Giai đoạn non vẫn được minh họa, nhưng nhánh xuất hiện muỗi trưởng thành bị chặn.",
  },
  complete: {
    step: "11",
    title: "Hoàn tất",
    body: "Toàn bộ hành trình được chạy trong cùng một không gian Three.js.",
  },
};

export default function Product3DStoryPage() {
  const [active, setActive] = useState(false);
  const [runSignal, setRunSignal] = useState(0);
  const [phase, setPhase] = useState<StoryPhase>("idle");

  const current = useMemo(() => copy[phase], [phase]);

  const start = () => {
    setPhase("approach");
    setRunSignal((value) => value + 1);
    setActive(true);
  };

  const replay = () => {
    setActive(false);
    setPhase("idle");

    window.setTimeout(() => {
      setRunSignal((value) => value + 1);
      setPhase("approach");
      setActive(true);
    }, 80);
  };

  const handlePhaseChange = useCallback((next: StoryPhase) => {
    setPhase(next);
  }, []);

  const handleComplete = useCallback(() => {
    setPhase("complete");
    setActive(false);
  }, []);

  return (
    <main className="relative h-[100svh] min-h-[620px] overflow-hidden bg-[#030807] text-white">
      <div className="absolute inset-0">
        <ProductStoryViewer
          runSignal={runSignal}
          active={active}
          onPhaseChange={handlePhaseChange}
          onComplete={handleComplete}
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-44 bg-gradient-to-b from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-48 bg-gradient-to-t from-black/75 to-transparent" />

      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 p-4 sm:p-6">
        <div className="pointer-events-auto flex items-center gap-3">
          <Link
            href="/product-3d"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/55 text-slate-200 shadow-2xl backdrop-blur-xl transition hover:border-emerald-300/40 hover:text-emerald-200"
          >
            <ChevronLeft size={18} />
          </Link>

          <div>
            <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.22em] text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
              SINGLE CANVAS STORY · PREVIEW
            </div>
            <h1 className="mt-1 text-lg font-semibold sm:text-xl">
              MosGuardX · Full biological journey
            </h1>
          </div>
        </div>

        <div className="pointer-events-auto flex gap-2">
          {!active && phase === "idle" && (
            <button
              type="button"
              onClick={start}
              className="flex h-10 items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 text-[11px] font-bold text-emerald-100 shadow-xl backdrop-blur-xl transition hover:bg-emerald-400/20"
            >
              <Play size={14} />
              Bắt đầu
            </button>
          )}

          {phase !== "idle" && (
            <button
              type="button"
              onClick={replay}
              className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-black/55 px-4 text-[11px] font-semibold text-slate-200 shadow-xl backdrop-blur-xl transition hover:border-violet-300/30 hover:text-violet-200"
            >
              <RotateCcw size={14} />
              Chạy lại
            </button>
          )}
        </div>
      </header>

      <aside className="pointer-events-none absolute bottom-24 left-4 z-20 w-[min(390px,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-[#07110e]/86 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:left-6">
        <div className="flex items-start gap-3">
          <div
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${
              phase === "blocked" || phase === "complete"
                ? "border-violet-300/20 bg-violet-400/10 text-violet-300"
                : "border-emerald-300/20 bg-emerald-400/10 text-emerald-300"
            }`}
          >
            {phase === "blocked" || phase === "complete" ? (
              <ShieldCheck size={18} />
            ) : (
              <Sparkles size={18} />
            )}
          </div>

          <div>
            <div className="text-[10px] font-black tracking-[0.18em] text-emerald-300">
              STEP {current.step}
            </div>
            <h2 className="mt-1 text-base font-semibold">{current.title}</h2>
          </div>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-300">{current.body}</p>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all duration-500"
            style={{
              width: `${
                phase === "idle"
                  ? 0
                  : Math.min(100, (Number(current.step) / 11) * 100)
              }%`,
            }}
          />
        </div>
      </aside>

      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center px-4">
        <div className="max-w-2xl rounded-full border border-amber-300/15 bg-black/55 px-4 py-2 text-center text-[10px] font-medium leading-4 text-amber-100 shadow-xl backdrop-blur-xl">
          Màu tím là ký hiệu trực quan cho cá thể đã tiếp xúc PPF; đây là mô phỏng cơ chế MVP, không phải dữ liệu hiệu lực thực nghiệm.
        </div>
      </div>
    </main>
  );
}
