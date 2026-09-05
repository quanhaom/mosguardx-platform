"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronLeft, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import type { PpfDemoPhase } from "@/components/product-3d/ppf-dissemination-viewer";

const PpfDisseminationViewer = dynamic(
  () => import("@/components/product-3d/ppf-dissemination-viewer"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 grid place-items-center">
        <div className="rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-violet-200 backdrop-blur-xl">
          ĐANG KHỞI TẠO DEMO PPF 3D
        </div>
      </div>
    ),
  },
);

const phaseCopy: Record<
  PpfDemoPhase,
  { title: string; description: string; step: string }
> = {
  handoff: {
    step: "01",
    title: "Rời hệ thống sau vùng PPF",
    description:
      "Demo 2 bắt đầu tại đúng cửa thoát của luồng 3D trước. Muỗi đã tiếp xúc PPF được biểu diễn bằng màu tím.",
  },
  dispersal: {
    step: "02",
    title: "Phân tán ra môi trường",
    description:
      "Camera tiếp tục bám theo đàn muỗi mang PPF khi chúng rời thiết bị và di chuyển trong không gian.",
  },
  breeding: {
    step: "03",
    title: "Tiếp cận điểm sinh sản",
    description:
      "Một phần đàn muỗi tới vũng nước phù hợp để đẻ trứng và chuyển chất sang môi trường nước.",
  },
  transfer: {
    step: "04",
    title: "Autodissemination PPF",
    description:
      "Các hạt tím minh họa quá trình PPF được đưa từ cá thể mang chất vào điểm nước sinh sản.",
  },
  blocked: {
    step: "05",
    title: "Vòng đời bị chặn",
    description:
      "Trứng và giai đoạn non vẫn được minh họa, nhưng nhánh xuất hiện muỗi trưởng thành bị chặn trong demo.",
  },
  complete: {
    step: "06",
    title: "Hoàn tất mô phỏng",
    description:
      "Demo kết thúc tại điểm sinh sản với trạng thái không xuất hiện muỗi trưởng thành.",
  },
};

export default function Ppf3DPage() {
  const [phase, setPhase] = useState<PpfDemoPhase>("handoff");
  const [runSignal, setRunSignal] = useState(1);
  const [complete, setComplete] = useState(false);

  const current = useMemo(() => phaseCopy[phase], [phase]);

  const handlePhaseChange = useCallback((nextPhase: PpfDemoPhase) => {
    setPhase(nextPhase);
    if (nextPhase !== "complete") setComplete(false);
  }, []);

  const handleComplete = useCallback(() => {
    setComplete(true);
  }, []);

  const replay = () => {
    setComplete(false);
    setPhase("handoff");
    setRunSignal((value) => value + 1);
  };

  return (
    <main className="relative h-[100svh] min-h-[620px] overflow-hidden bg-[#020706] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_58%,rgba(139,92,246,0.12),transparent_30%),radial-gradient(circle_at_20%_28%,rgba(16,185,129,0.09),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-44 bg-gradient-to-b from-black/75 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-48 bg-gradient-to-t from-black/80 to-transparent" />

      <div className="absolute inset-0">
        <PpfDisseminationViewer
          runSignal={runSignal}
          onPhaseChange={handlePhaseChange}
          onComplete={handleComplete}
        />
      </div>

      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 p-4 sm:p-6">
        <div className="pointer-events-auto flex items-center gap-3">
          <Link
            href="/product-3d"
            aria-label="Quay lại demo thiết bị"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/55 text-slate-200 shadow-2xl backdrop-blur-xl transition hover:border-violet-300/40 hover:bg-violet-400/10 hover:text-violet-200"
          >
            <ChevronLeft size={18} />
          </Link>

          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] text-violet-300/90">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-300" />
              BIOLOGICAL CONTINUATION · DEMO 02
            </div>
            <h1 className="mt-1 text-lg font-semibold tracking-tight text-white sm:text-xl">
              MosGuardX · PPF Autodissemination
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={replay}
          className="pointer-events-auto flex h-10 items-center gap-2 rounded-full border border-white/10 bg-black/55 px-4 text-[11px] font-semibold text-slate-200 shadow-2xl backdrop-blur-xl transition hover:border-violet-300/40 hover:text-violet-200"
        >
          <RotateCcw size={14} />
          Chạy lại
        </button>
      </header>

      <aside className="pointer-events-none absolute bottom-24 left-4 z-20 w-[min(390px,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-[#07110e]/88 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:bottom-24 sm:left-6">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-violet-300">
            {phase === "blocked" || phase === "complete" ? (
              <ShieldCheck size={18} />
            ) : (
              <Sparkles size={18} />
            )}
          </div>

          <div>
            <div className="text-[10px] font-black tracking-[0.18em] text-violet-300">
              STEP {current.step}
            </div>
            <h2 className="mt-1 text-base font-semibold text-white">{current.title}</h2>
          </div>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-300">{current.description}</p>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-violet-400 transition-all duration-700"
            style={{
              width: `${(Number(current.step) / 6) * 100}%`,
            }}
          />
        </div>
      </aside>

      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center px-4">
        <div className="max-w-2xl rounded-full border border-amber-300/15 bg-black/55 px-4 py-2 text-center text-[10px] font-medium leading-4 text-amber-100 shadow-xl backdrop-blur-xl">
          Mô phỏng cơ chế phục vụ trình bày MVP — không biểu diễn hiệu lực định lượng thực nghiệm của PPF.
        </div>
      </div>

      {complete && (
        <div className="pointer-events-none absolute right-5 top-24 z-20 hidden w-[300px] rounded-2xl border border-violet-300/20 bg-violet-950/80 p-4 shadow-2xl backdrop-blur-xl md:block">
          <div className="text-[10px] font-black tracking-[0.16em] text-violet-300">
            DEMO 02 COMPLETE
          </div>
          <p className="mt-2 text-sm font-semibold text-white">
            Muỗi mang PPF → điểm sinh sản → chặn xuất hiện muỗi trưởng thành.
          </p>
        </div>
      )}
    </main>
  );
}
