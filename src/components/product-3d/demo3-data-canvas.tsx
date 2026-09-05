"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  CloudUpload,
  ImageIcon,
  Play,
  Radio,
  RefreshCcw,
  Server,
  Sparkles,
  Tag,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Stage =
  | "idle"
  | "pin"
  | "metadata"
  | "packet"
  | "backend"
  | "dashboard"
  | "complete";

const ORDER: Stage[] = [
  "pin",
  "metadata",
  "packet",
  "backend",
  "dashboard",
  "complete",
];

const COPY: Record<Stage, { title: string; subtitle: string }> = {
  idle: {
    title: "Sẵn sàng",
    subtitle: "Frame đang chờ được đưa vào luồng dữ liệu MosGuardX.",
  },
  pin: {
    title: "Ảnh được ghim lên data canvas",
    subtitle: "Frame camera trở thành evidence card của một lượt ghi nhận.",
  },
  metadata: {
    title: "Metadata được dán vào frame",
    subtitle: "Thông tin thiết bị, thời gian và môi trường được gắn với ảnh.",
  },
  packet: {
    title: "Đóng gói detection event",
    subtitle: "Ảnh + metadata + kết quả AI được gom thành một packet duy nhất.",
  },
  backend: {
    title: "Event được gửi tới backend",
    subtitle: "Backend mô phỏng validate và chấp nhận detection mới.",
  },
  dashboard: {
    title: "Dashboard phản ánh thay đổi",
    subtitle: "Lượt ghi nhận và cảnh báo tăng ngay sau khi event được backend chấp nhận.",
  },
  complete: {
    title: "Hoàn tất luồng",
    subtitle: "Một frame đã đi trọn từ camera tới dashboard.",
  },
};

const metadata = [
  ["Capture ID", "MGX-HN-001-20260906-021532"],
  ["Device", "MGX-HN-001"],
  ["Captured", "2026-09-06 · 02:15:32"],
  ["Location", "Hà Nội"],
  ["Temp", "28.4 °C"],
  ["Humidity", "81%"],
];

export default function Demo3DataCanvas() {
  const [stage, setStage] = useState<Stage>("idle");
  const [running, setRunning] = useState(false);
  const timers = useRef<number[]>([]);

  const stageIndex = stage === "idle" ? -1 : ORDER.indexOf(stage);
  const dashboardUpdated = stage === "dashboard" || stage === "complete";
  const backendAccepted = stageIndex >= ORDER.indexOf("backend");

  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  };

  const run = () => {
    clearTimers();
    setRunning(true);
    setStage("pin");

    const plan: Array<[Stage, number]> = [
      // Slower pacing for presentation: viewers have time to read each visual.
      ["metadata", 2200],
      ["packet", 4400],
      ["backend", 6900],
      ["dashboard", 9600],
      ["complete", 12200],
    ];

    plan.forEach(([next, delay]) => {
      const timer = window.setTimeout(() => {
        setStage(next);
        if (next === "complete") setRunning(false);
      }, delay);
      timers.current.push(timer);
    });
  };

  const reset = () => {
    clearTimers();
    setStage("idle");
    setRunning(false);
  };

  useEffect(() => {
    // Auto-start on every actual mount.
    // In React Strict Mode the first development mount is intentionally
    // cleaned up; the second mount schedules a fresh timer correctly.
    const timer = window.setTimeout(() => {
      run();
    }, 900);

    timers.current.push(timer);

    return () => {
      window.clearTimeout(timer);
      clearTimers();
    };
  }, []);

  const packetLeft =
    stageIndex < 2
      ? "28%"
      : stageIndex === 2
        ? "40%"
        : stageIndex === 3
          ? "55%"
          : "76%";

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#030807] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_26%,rgba(16,185,129,0.10),transparent_28%),radial-gradient(circle_at_52%_38%,rgba(56,189,248,0.08),transparent_23%),radial-gradient(circle_at_84%_32%,rgba(139,92,246,0.10),transparent_27%)]" />

      <header className="relative z-30 flex items-center justify-between gap-4 border-b border-white/8 bg-black/20 px-5 py-4 backdrop-blur-xl sm:px-7">
        <div className="flex items-center gap-3">
          <Link
            href="/product-3d/ppf"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/55 text-slate-200 transition hover:border-emerald-300/40 hover:text-emerald-200"
          >
            <ChevronLeft size={18} />
          </Link>

          <div>
            <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.22em] text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
              DEMO 03 · IMAGE DATA FLOW
            </div>
            <h1 className="mt-1 text-lg font-semibold sm:text-xl">
              Frame → Backend → Dashboard
            </h1>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={reset}
            disabled={stage === "idle"}
            className="flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-[11px] font-semibold text-slate-300 disabled:opacity-30"
          >
            <RefreshCcw size={13} />
            Reset
          </button>

          <button
            type="button"
            onClick={() => {
              reset();
              window.setTimeout(run, 120);
            }}
            disabled={running}
            className="flex h-9 items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-4 text-[11px] font-bold text-emerald-100 transition hover:bg-emerald-400/20 disabled:opacity-40"
          >
            <Play size={13} />
            Chạy lại
          </button>
        </div>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-[1580px] px-4 py-5 sm:px-6">
        <div className="mb-4 flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-[#07110e]/72 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl border border-emerald-300/15 bg-emerald-400/8 text-emerald-300">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="text-[10px] font-black tracking-[0.16em] text-emerald-300">
                STORY STATE
              </div>
              <div className="mt-0.5 text-sm font-semibold">{COPY[stage].title}</div>
            </div>
          </div>

          <p className="hidden max-w-xl text-right text-[11px] leading-5 text-slate-400 md:block">
            {COPY[stage].subtitle}
          </p>
        </div>

        <div className="relative min-h-[720px] overflow-hidden rounded-[28px] border border-white/10 bg-[#07110e]/82 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:34px_34px]" />

          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 1200 720"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="flowLine" x1="0%" x2="100%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.45" />
              </linearGradient>
            </defs>
            <path
              d="M 290 360 C 430 360, 450 300, 565 300 S 755 315, 835 350 S 940 360, 1010 360"
              fill="none"
              stroke="url(#flowLine)"
              strokeWidth="2.5"
              strokeDasharray="9 10"
            />
          </svg>

          <div
            className={`pointer-events-none absolute top-[47%] z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-[1100ms] ease-in-out ${
              stageIndex >= 2 ? "opacity-100" : "opacity-0"
            }`}
            style={{ left: packetLeft }}
          >
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-sky-400/25" />
              <div className="relative grid h-12 w-12 place-items-center rounded-2xl border border-sky-300/35 bg-sky-400/15 text-sky-200 shadow-[0_0_28px_rgba(56,189,248,0.3)] backdrop-blur-xl">
                <CloudUpload size={19} />
              </div>
              <span className="absolute left-1/2 top-14 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/8 bg-black/70 px-2.5 py-1 font-mono text-[9px] text-slate-300">
                detection_event.json
              </span>
            </div>
          </div>

          <div className="relative grid min-h-[720px] gap-6 p-5 lg:grid-cols-[1fr_0.56fr_1fr] lg:p-7">
            <section className="rounded-3xl border border-white/8 bg-black/20 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black tracking-[0.18em] text-emerald-300">
                    01 · EVIDENCE CANVAS
                  </p>
                  <h2 className="mt-1 text-base font-semibold">Frame + metadata</h2>
                </div>
                <ImageIcon size={17} className="text-slate-500" />
              </div>

              <div
                className={`relative mx-auto mt-8 max-w-[470px] transition-all duration-700 ${
                  stage === "idle"
                    ? "translate-y-5 scale-95 opacity-15"
                    : "translate-y-0 scale-100 opacity-100"
                }`}
              >
                <div className="absolute left-1/2 top-[-10px] z-20 h-7 w-24 -translate-x-1/2 rotate-[-2deg] bg-amber-100/50 shadow-sm backdrop-blur-sm" />

                <div className="rotate-[-1deg] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1713] p-3 shadow-[0_26px_55px_rgba(0,0,0,0.45)]">
                  <div className="relative overflow-hidden rounded-xl bg-black">
                    <img
                      src="/demo3/mosquito-input.jpg"
                      alt="MosGuardX mosquito frame"
                      className="block h-auto w-full"
                    />

                    <div
                      className={`pointer-events-none absolute left-[40.9%] top-[19.3%] h-[50.4%] w-[46.8%] rounded border-2 border-violet-400 transition-all duration-700 ${
                        stageIndex >= 1 ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <span className="absolute -top-6 left-0 whitespace-nowrap rounded bg-violet-500 px-2 py-1 text-[9px] font-black text-white">
                        albopictus · DEMO 0.92
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-mono text-[9px] text-emerald-300">
                        MGX-HN-001-20260906-021532
                      </div>
                      <div className="mt-1 text-[10px] text-slate-500">
                        OSK.jpg · 472×280
                      </div>
                    </div>
                    <span className="rounded-full border border-violet-300/15 bg-violet-400/8 px-2.5 py-1 text-[9px] font-bold text-violet-200">
                      DETECTION
                    </span>
                  </div>
                </div>

                <div
                  className={`mt-5 grid grid-cols-2 gap-2 transition-all duration-700 ${
                    stageIndex >= 1 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  {metadata.map(([label, value], index) => (
                    <div
                      key={label}
                      className="rounded-xl border border-emerald-300/10 bg-emerald-400/[0.055] p-2.5 shadow-lg"
                      style={{ transform: `rotate(${index % 2 === 0 ? -0.6 : 0.6}deg)` }}
                    >
                      <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.12em] text-emerald-300">
                        <Tag size={9} />
                        {label}
                      </div>
                      <div className="mt-1 font-mono text-[10px] text-slate-200">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {stageIndex >= 2 && (
                  <div className="mt-4 rounded-xl border border-sky-300/15 bg-sky-400/8 px-3 py-2.5 text-[10px] text-sky-100">
                    <strong>PACKED:</strong> frame + metadata + AI result
                  </div>
                )}
              </div>
            </section>

            <section className="relative flex flex-col items-center justify-center">
              <div
                className={`w-full max-w-[250px] rounded-3xl border p-5 text-center transition-all duration-700 ${
                  backendAccepted
                    ? "border-sky-300/30 bg-sky-400/10 shadow-[0_0_45px_rgba(56,189,248,0.12)]"
                    : "border-white/8 bg-black/25"
                }`}
              >
                <div
                  className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl border ${
                    backendAccepted
                      ? "border-sky-300/25 bg-sky-400/10 text-sky-200"
                      : "border-white/8 bg-white/5 text-slate-500"
                  }`}
                >
                  <Server size={27} />
                </div>

                <p className="mt-4 text-[9px] font-black tracking-[0.18em] text-sky-300">
                  02 · BACKEND
                </p>
                <h2 className="mt-1 text-sm font-semibold">MosGuardX API</h2>

                <div className="mt-4 space-y-2 text-left font-mono text-[9px]">
                  {[
                    ["POST", "/api/detections"],
                    ["VALIDATE", "metadata"],
                    ["WRITE", "detection store"],
                    ["EMIT", "dashboard event"],
                  ].map(([action, value]) => (
                    <div
                      key={action}
                      className={`flex items-center justify-between rounded-lg border px-2.5 py-2 transition ${
                        backendAccepted
                          ? "border-emerald-300/12 bg-emerald-400/5 text-slate-200"
                          : "border-white/6 bg-black/20 text-slate-600"
                      }`}
                    >
                      <span className="text-emerald-300">{action}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>

                {backendAccepted && (
                  <div className="mt-4 flex items-center justify-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-400/8 px-3 py-2 text-[9px] font-black text-emerald-200">
                    <CheckCircle2 size={12} />
                    EVENT ACCEPTED · 201
                  </div>
                )}
              </div>
            </section>

            <section
              className={`rounded-3xl border p-5 transition-all duration-700 ${
                dashboardUpdated
                  ? "border-violet-300/25 bg-violet-400/[0.045] shadow-[0_0_50px_rgba(139,92,246,0.10)]"
                  : "border-white/8 bg-black/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black tracking-[0.18em] text-violet-300">
                    03 · DASHBOARD MIRROR
                  </p>
                  <h2 className="mt-1 text-base font-semibold">
                    Thay đổi sau detection
                  </h2>
                </div>
                <Radio
                  size={17}
                  className={dashboardUpdated ? "text-violet-300" : "text-slate-600"}
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
                  <div className="flex items-center gap-2 text-[9px] font-black tracking-wider text-slate-500">
                    <Activity size={13} />
                    LƯỢT GHI NHẬN
                  </div>
                  <div className="mt-3 flex items-end gap-2">
                    <strong className="text-3xl text-white">
                      {dashboardUpdated ? "128" : "127"}
                    </strong>
                    {dashboardUpdated && (
                      <span className="mb-1 rounded-full bg-emerald-400/10 px-2 py-1 text-[9px] font-bold text-emerald-300">
                        +1
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className={`rounded-2xl border p-4 transition ${
                    dashboardUpdated
                      ? "border-amber-300/25 bg-amber-400/8"
                      : "border-white/8 bg-white/[0.035]"
                  }`}
                >
                  <div className="flex items-center gap-2 text-[9px] font-black tracking-wider text-slate-500">
                    <AlertTriangle size={13} />
                    CẢNH BÁO MỞ
                  </div>
                  <div className="mt-3 flex items-end gap-2">
                    <strong className="text-3xl text-white">
                      {dashboardUpdated ? "4" : "3"}
                    </strong>
                    {dashboardUpdated && (
                      <span className="mb-1 rounded-full bg-amber-400/10 px-2 py-1 text-[9px] font-bold text-amber-200">
                        +1
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`mt-4 rounded-2xl border p-4 transition-all duration-700 ${
                  dashboardUpdated
                    ? "translate-y-0 border-violet-300/20 bg-violet-400/8 opacity-100"
                    : "translate-y-3 border-white/6 bg-black/20 opacity-30"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[9px] font-black tracking-[0.14em] text-violet-300">
                      NEW DETECTION
                    </div>
                    <div className="mt-1 text-sm font-semibold">
                      MGX-HN-001 · albopictus
                    </div>
                  </div>
                  <span className="rounded-full bg-violet-400/10 px-2.5 py-1 text-[9px] font-black text-violet-200">
                    92%
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-black/20 p-2">
                    <div className="text-[8px] text-slate-500">TEMP</div>
                    <div className="mt-1 text-[11px] font-semibold">28.4 °C</div>
                  </div>
                  <div className="rounded-xl bg-black/20 p-2">
                    <div className="text-[8px] text-slate-500">HUMIDITY</div>
                    <div className="mt-1 text-[11px] font-semibold">81%</div>
                  </div>
                  <div className="rounded-xl bg-black/20 p-2">
                    <div className="text-[8px] text-slate-500">RISK</div>
                    <div className="mt-1 text-[11px] font-semibold text-amber-200">
                      MEDIUM
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/8 bg-black/20 p-4 font-mono text-[9px] leading-5 text-slate-500">
                <div className={stageIndex >= 3 ? "text-slate-300" : ""}>
                  backend.event.accepted
                </div>
                <div className={dashboardUpdated ? "text-emerald-300" : ""}>
                  dashboard.detections += 1
                </div>
                <div className={dashboardUpdated ? "text-amber-200" : ""}>
                  dashboard.open_alerts += 1
                </div>
              </div>

              <Link
                href="/dashboard"
                className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold text-emerald-300"
              >
                Mở dashboard thật
                <ArrowRight size={13} />
              </Link>
            </section>
          </div>
        </div>

        <div className="mt-4 text-center text-[10px] text-slate-500">
          Dashboard bên phải chỉ mô phỏng tác động của event trong Demo 03; trang /dashboard thật chưa bị thay đổi.
        </div>
      </section>
    </main>
  );
}
