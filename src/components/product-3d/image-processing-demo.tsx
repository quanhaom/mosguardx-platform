"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  CloudUpload,
  Cpu,
  FileImage,
  Image as ImageIcon,
  Play,
  RefreshCcw,
  ScanLine,
  Server,
  SlidersHorizontal,
} from "lucide-react";
import {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type PipelineStep = {
  id: string;
  title: string;
  subtitle: string;
  duration: number;
  icon: typeof FileImage;
};

const STEPS: PipelineStep[] = [
  {
    id: "capture",
    title: "Capture frame",
    subtitle: "Nhận ảnh từ camera + gắn Capture ID",
    duration: 1600,
    icon: FileImage,
  },
  {
    id: "metadata",
    title: "Validate metadata",
    subtitle: "Kiểm tra Device ID, thời gian và dữ liệu môi trường",
    duration: 1500,
    icon: SlidersHorizontal,
  },
  {
    id: "preprocess",
    title: "Pre-process",
    subtitle: "Resize · normalize · chuẩn hóa input AI",
    duration: 1800,
    icon: ScanLine,
  },
  {
    id: "inference",
    title: "YOLO inference",
    subtitle: "Phát hiện và phân loại ứng viên muỗi",
    duration: 2500,
    icon: Cpu,
  },
  {
    id: "postprocess",
    title: "Post-process",
    subtitle: "Confidence threshold · NMS · class mapping",
    duration: 1700,
    icon: Server,
  },
  {
    id: "sync",
    title: "Event & cloud sync",
    subtitle: "Ghép metadata + kết quả AI và gửi backend",
    duration: 1800,
    icon: CloudUpload,
  },
];

const DEFAULT_METADATA = {
  capture_id: "MGX-HN-001-20260906-021532",
  device_id: "MGX-HN-001",
  captured_at: "2026-09-06T02:15:32+07:00",
  location: "Hà Nội, Việt Nam",
  temperature_c: 28.4,
  humidity_pct: 81,
  camera: "MosGuardX imaging chamber",
  source: "Demo metadata",
};

const LOG_LINES: Record<string, string[]> = {
  capture: [
    "camera.frame_received=true",
    "capture_id assigned",
    "frame queued for processing",
  ],
  metadata: [
    "device_id valid",
    "timestamp normalized to ISO-8601",
    "environment metadata attached",
  ],
  preprocess: [
    "input decoded",
    "resize -> 640x640",
    "pixel normalization complete",
  ],
  inference: [
    "model=yolo11n",
    "candidate object found",
    "class probability calculated",
  ],
  postprocess: [
    "confidence threshold=0.45",
    "NMS complete",
    "class mapped to albopictus",
  ],
  sync: [
    "event payload created",
    "POST /api/detections",
    "dashboard stream updated",
  ],
};

export default function ImageProcessingDemo() {
  const [activeStep, setActiveStep] = useState(-1);
  const [completed, setCompleted] = useState(false);
  const [running, setRunning] = useState(false);
  const [imageUrl, setImageUrl] = useState("/demo3/mosquito-input.jpg");
  const [customImage, setCustomImage] = useState(false);
  const timers = useRef<number[]>([]);

  const activeId =
    activeStep >= 0 && activeStep < STEPS.length
      ? STEPS[activeStep].id
      : null;

  const progress =
    activeStep < 0
      ? 0
      : completed
        ? 100
        : Math.round(((activeStep + 0.5) / STEPS.length) * 100);

  const inferenceReached =
    activeStep >= STEPS.findIndex((step) => step.id === "inference");

  const payload = useMemo(
    () => ({
      capture_id: DEFAULT_METADATA.capture_id,
      device_id: DEFAULT_METADATA.device_id,
      captured_at: DEFAULT_METADATA.captured_at,
      environment: {
        temperature_c: DEFAULT_METADATA.temperature_c,
        humidity_pct: DEFAULT_METADATA.humidity_pct,
      },
      detection: {
        class_name: "albopictus",
        confidence: 0.92,
        bbox_xyxy: [168, 112, 468, 406],
        model: "yolo11n-demo",
      },
      status: completed ? "synced" : "processing",
    }),
    [completed],
  );

  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  };

  const runDemo = () => {
    clearTimers();
    setCompleted(false);
    setActiveStep(0);
    setRunning(true);

    let elapsed = 0;

    STEPS.forEach((step, index) => {
      if (index > 0) {
        elapsed += STEPS[index - 1].duration;
        const timer = window.setTimeout(() => {
          setActiveStep(index);
        }, elapsed);
        timers.current.push(timer);
      }
    });

    elapsed += STEPS[STEPS.length - 1].duration;

    const doneTimer = window.setTimeout(() => {
      setCompleted(true);
      setRunning(false);
    }, elapsed);

    timers.current.push(doneTimer);
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setCustomImage(true);
  };

  const reset = () => {
    clearTimers();
    setRunning(false);
    setCompleted(false);
    setActiveStep(-1);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#030807] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_22%_30%,rgba(16,185,129,0.10),transparent_28%),radial-gradient(circle_at_78%_38%,rgba(139,92,246,0.10),transparent_26%)]" />

      <header className="relative z-20 flex items-start justify-between gap-4 border-b border-white/8 px-5 py-5 sm:px-7">
        <div className="flex items-center gap-3">
          <Link
            href="/product-3d/ppf"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/55 text-slate-200 backdrop-blur-xl transition hover:border-emerald-300/40 hover:text-emerald-200"
          >
            <ChevronLeft size={18} />
          </Link>

          <div>
            <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.22em] text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
              DEMO 03 · IMAGE DATA PIPELINE
            </div>
            <h1 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
              MosGuardX · Luồng xử lý hình ảnh
            </h1>
          </div>
        </div>

        <div className="flex gap-2">
          <label className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-emerald-300/30 hover:bg-emerald-400/10">
            Chọn ảnh demo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onImageChange}
            />
          </label>

          <button
            type="button"
            onClick={completed || activeStep >= 0 ? reset : runDemo}
            disabled={running}
            className="flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-4 py-2 text-xs font-bold text-emerald-100 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {activeStep < 0 ? (
              <>
                <Play size={14} />
                Chạy pipeline
              </>
            ) : (
              <>
                <RefreshCcw size={14} />
                Reset
              </>
            )}
          </button>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-[1500px] gap-5 px-5 py-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-7">
        <div className="space-y-5">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#07110e]/86 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <div>
                <p className="text-[10px] font-black tracking-[0.18em] text-emerald-300">
                  SOURCE FRAME
                </p>
                <h2 className="mt-1 text-sm font-semibold text-white">
                  Ảnh đầu vào từ camera MosGuardX
                </h2>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <ImageIcon size={13} />
                {customImage ? "Ảnh người dùng chọn" : "/public/demo3/mosquito-input.jpg"}
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden bg-black">
              <img
                src={imageUrl}
                alt="MosGuardX demo input"
                className="h-full w-full object-contain"
                onError={(event) => {
                  const target = event.currentTarget;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement | null;
                  if (fallback) fallback.style.display = "grid";
                }}
              />

              <div className="absolute inset-0 hidden place-items-center bg-[#07110e] p-8 text-center">
                <div>
                  <ImageIcon className="mx-auto text-emerald-300" size={34} />
                  <p className="mt-4 text-sm font-semibold text-white">
                    Chưa có ảnh demo
                  </p>
                  <p className="mt-2 max-w-md text-xs leading-5 text-slate-400">
                    Chọn ảnh ở góc trên hoặc đặt ảnh tại
                    <span className="mx-1 font-mono text-emerald-300">
                      public/demo3/mosquito-input.jpg
                    </span>
                  </p>
                </div>
              </div>

              {activeId === "preprocess" && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div className="mgx-scan-line absolute inset-x-0 h-[2px] bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
                  <div className="absolute inset-0 bg-emerald-400/5" />
                </div>
              )}

              {inferenceReached && activeStep >= 0 && (
                <div className="pointer-events-none absolute left-[26%] top-[21%] h-[47%] w-[46%] rounded-md border-2 border-violet-400 shadow-[0_0_24px_rgba(167,139,250,0.35)]">
                  <div className="absolute -top-7 left-0 rounded-md bg-violet-500 px-2 py-1 text-[10px] font-black text-white">
                    albopictus · 0.92
                  </div>
                </div>
              )}

              <div className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 font-mono text-[10px] text-slate-200 backdrop-blur-xl">
                {DEFAULT_METADATA.capture_id}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#07110e]/86 p-5 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black tracking-[0.18em] text-sky-300">
                  DEMO METADATA
                </p>
                <h2 className="mt-1 text-sm font-semibold">
                  Context gắn với frame
                </h2>
              </div>
              <span className="rounded-full border border-amber-300/15 bg-amber-400/8 px-3 py-1 text-[9px] font-bold text-amber-100">
                SYNTHETIC / DEMO
              </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {Object.entries(DEFAULT_METADATA).map(([key, value]) => (
                <div
                  key={key}
                  className={`rounded-xl border px-3 py-2.5 transition ${
                    activeId === "metadata"
                      ? "border-emerald-300/25 bg-emerald-400/8"
                      : "border-white/8 bg-black/20"
                  }`}
                >
                  <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    {key}
                  </div>
                  <div className="mt-1 break-all font-mono text-[11px] text-slate-200">
                    {String(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-white/10 bg-[#07110e]/86 p-5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black tracking-[0.18em] text-violet-300">
                  PROCESSING FLOW
                </p>
                <h2 className="mt-1 text-base font-semibold">
                  Camera → AI → Backend
                </h2>
              </div>
              <div className="font-mono text-xs text-emerald-300">
                {progress}%
              </div>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-5 space-y-2">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === activeStep && !completed;
                const isDone = completed || index < activeStep;

                return (
                  <div
                    key={step.id}
                    className={`group relative flex items-center gap-3 rounded-2xl border p-3.5 transition-all duration-500 ${
                      isActive
                        ? "border-emerald-300/30 bg-emerald-400/10 shadow-[0_0_24px_rgba(16,185,129,0.08)]"
                        : isDone
                          ? "border-white/10 bg-white/[0.035]"
                          : "border-white/6 bg-black/15 opacity-55"
                    }`}
                  >
                    <div
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${
                        isDone
                          ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-300"
                          : isActive
                            ? "border-violet-300/20 bg-violet-400/10 text-violet-200"
                            : "border-white/8 bg-white/5 text-slate-500"
                      }`}
                    >
                      {isDone ? <Check size={15} /> : <Icon size={15} />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black tracking-[0.14em] text-slate-500">
                          0{index + 1}
                        </span>
                        <h3 className="text-sm font-semibold text-slate-100">
                          {step.title}
                        </h3>
                      </div>
                      <p className="mt-0.5 text-[11px] leading-4 text-slate-400">
                        {step.subtitle}
                      </p>
                    </div>

                    {index < STEPS.length - 1 && (
                      <ArrowRight
                        size={14}
                        className="shrink-0 text-slate-600"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#050a08]/92 shadow-2xl">
              <div className="border-b border-white/8 px-4 py-3 text-[10px] font-black tracking-[0.16em] text-emerald-300">
                LIVE PROCESS LOG
              </div>
              <div className="min-h-[230px] p-4 font-mono text-[10px] leading-6 text-slate-400">
                {activeStep < 0 ? (
                  <span className="text-slate-600">
                    $ waiting for demo pipeline...
                  </span>
                ) : (
                  STEPS.slice(0, activeStep + 1).flatMap((step, index) =>
                    LOG_LINES[step.id].map((line) => (
                      <div key={`${step.id}-${line}`}>
                        <span className="text-emerald-400">
                          [{String(index + 1).padStart(2, "0")}]
                        </span>{" "}
                        {line}
                      </div>
                    )),
                  )
                )}
                {completed && (
                  <div className="mt-2 text-emerald-300">
                    ✓ processing pipeline complete
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#050a08]/92 shadow-2xl">
              <div className="border-b border-white/8 px-4 py-3 text-[10px] font-black tracking-[0.16em] text-violet-300">
                EVENT PAYLOAD
              </div>
              <pre className="max-h-[260px] overflow-auto p-4 text-[9px] leading-5 text-slate-300">
                {JSON.stringify(payload, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .mgx-scan-line {
          animation: mgxScan 1.15s linear infinite;
        }

        @keyframes mgxScan {
          0% {
            top: 4%;
          }
          100% {
            top: 96%;
          }
        }
      `}</style>
    </main>
  );
}
