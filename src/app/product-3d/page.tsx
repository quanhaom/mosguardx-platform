"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

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

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type {
  ProductPart,
} from "@/components/product-3d/product-catalog";


const MosguardXViewer =
  dynamic(
    () =>
      import(
        "@/components/product-3d/mosguardx-viewer"
      ),

    {
      ssr:
        false,

      loading: () => (
        <div className="absolute inset-0 grid place-items-center">
          <div className="rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-emerald-300 backdrop-blur-xl">
            ĐANG KHỞI TẠO KHÔNG GIAN 3D
          </div>
        </div>
      ),
    },
  );


type ViewMode =
  | "normal"
  | "transparent";


export default function Product3DPage() {
  const router =
    useRouter();


  const [
    viewMode,
    setViewMode,
  ] =
    useState<ViewMode>(
      "normal",
    );


  const [
    hoveredPart,
    setHoveredPart,
  ] =
    useState<ProductPart | null>(
      null,
    );


  const [
    resetSignal,
    setResetSignal,
  ] =
    useState(0);


  const [
    mosquitoWave,
    setMosquitoWave,
  ] =
    useState(0);


  const [
    mosquitoActive,
    setMosquitoActive,
  ] =
    useState(false);


  const [
    status,
    setStatus,
  ] =
    useState(
      "Mô hình sẵn sàng",
    );


  const [
    cameraHandoffSignal,
    setCameraHandoffSignal,
  ] =
    useState(0);


  const [
    handoffMode,
    setHandoffMode,
  ] =
    useState(false);


  const [
    flashActive,
    setFlashActive,
  ] =
    useState(false);


  /* =========================================================
     RESET DEVICE
  ========================================================= */

  const resetDevice =
    useCallback(
      () => {
        setMosquitoActive(
          false,
        );

        setHoveredPart(
          null,
        );

        setViewMode(
          "normal",
        );

        setResetSignal(
          (
            value,
          ) =>
            value +
            1,
        );

        setStatus(
          "Đã thu linh kiện, gắn nắp và trở về mặt sau",
        );
      },
      [],
    );


  /* =========================================================
     RELEASE MOSQUITOES
  ========================================================= */

  const releaseMosquitoes =
    useCallback(
      () => {
        /*
         * Một wave chỉ chạy một lần.
         */
        if (
          mosquitoActive
        ) {
          return;
        }


        setResetSignal(
          (
            value,
          ) =>
            value +
            1,
        );


        setMosquitoWave(
          (
            value,
          ) =>
            value +
            1,
        );


        setMosquitoActive(
          true,
        );


        setStatus(
          "Đang mô phỏng đàn muỗi tiếp cận cửa hút",
        );
      },
      [
        mosquitoActive,
      ],
    );


  /* =========================================================
     CAMERA HANDOFF
  ========================================================= */

  const handleCameraHandoffReady =
    useCallback(
      () => {
        setStatus(
          "MGX_CAMERA · CAPTURE FRAME",
        );


        setFlashActive(
          true,
        );


        window.setTimeout(
          () => {
            setFlashActive(
              false,
            );
          },

          760,
        );


        window.setTimeout(
          () => {
            router.push(
              "/product-3d/image-flow",
            );
          },

          1050,
        );
      },
      [
        router,
      ],
    );


  /* =========================================================
     HANDOFF MODE
  ========================================================= */

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search,
      );


    if (
      params.get(
        "handoff",
      ) !==
      "camera"
    ) {
      return;
    }


    setHandoffMode(
      true,
    );


    setMosquitoActive(
      false,
    );


    setHoveredPart(
      null,
    );


    setViewMode(
      "transparent",
    );


    setStatus(
      "MGX_CAMERA · đang zoom vào vùng chụp",
    );


    const timer =
      window.setTimeout(
        () => {
          setCameraHandoffSignal(
            (
              value,
            ) =>
              value +
              1,
          );
        },

        650,
      );


    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, []);


  return (
    <main className="product-3d-grid relative h-[100svh] min-h-[620px] overflow-hidden bg-[#030807] text-white">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(16,185,129,0.11),transparent_33%),radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.08),transparent_25%)]" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-black/65 to-transparent" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-44 bg-gradient-to-t from-black/70 to-transparent" />


      {/* =====================================================
          3D
      ===================================================== */}

      <div className="absolute inset-0 z-0">
        <MosguardXViewer
          shellOpacity={
            viewMode ===
            "transparent"
              ? 0.3
              : 1
          }

          resetSignal={
            resetSignal
          }

          mosquitoActive={
            mosquitoActive
          }

          mosquitoWave={
            mosquitoWave
          }

          cameraHandoffSignal={
            cameraHandoffSignal
          }

          onCameraHandoffReady={
            handleCameraHandoffReady
          }

          onPartHover={
            setHoveredPart
          }

          onReset={
            resetDevice
          }

          onReleaseMosquitoes={
            releaseMosquitoes
          }

          onMosquitoPhaseChange={(
            phase,
          ) => {
            if (
              phase ===
              "bait"
            ) {
              setStatus(
                "Đã tiếp xúc hộp mồi PPF — cá thể mang PPF chuyển sang màu tím",
              );
            } else if (
              phase ===
              "fan"
            ) {
              setStatus(
                "Muỗi mang PPF đang đi qua quạt dẫn dòng",
              );
            } else if (
              phase ===
              "exit"
            ) {
              setStatus(
                "Muỗi màu tím đang rời hệ thống — chuẩn bị chuyển sang Demo 02",
              );
            }
          }}

          onMosquitoComplete={() => {
            setMosquitoActive(
              false,
            );


            setStatus(
              "Muỗi mang PPF đã rời thiết bị — chuyển sang Demo 02",
            );


            window.setTimeout(
              () => {
                router.push(
                  "/product-3d/ppf",
                );
              },

              650,
            );
          }}
        />
      </div>


      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 p-3 sm:gap-4 sm:p-6">

        <div className="pointer-events-auto flex min-w-0 items-center gap-2 sm:gap-3">

          <Link
            href="/"

            aria-label="Quay về trang giới thiệu"

            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-black/55 text-slate-200 shadow-2xl backdrop-blur-xl transition hover:border-emerald-300/40 hover:bg-emerald-400/10 hover:text-emerald-200 sm:h-10 sm:w-10"
          >
            <ChevronLeft
              size={18}
            />
          </Link>


          <div className="min-w-0">

            <div className="hidden items-center gap-2 text-[10px] font-bold tracking-[0.22em] text-emerald-300/90 sm:flex">

              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />

              DIGITAL PRODUCT EXPLORER
            </div>


            <h1 className="truncate text-sm font-semibold tracking-tight text-white sm:mt-1 sm:text-xl">
              MosGuardX · Cấu trúc thiết bị
            </h1>
          </div>
        </div>


        {/* VIEW MODE */}

        <div className="pointer-events-auto flex shrink-0 items-center rounded-full border border-white/10 bg-black/55 p-1 shadow-2xl backdrop-blur-xl">

          <button
            type="button"

            aria-label="Hiển thị vỏ bình thường"

            aria-pressed={
              viewMode ===
              "normal"
            }

            onClick={() => {
              setViewMode(
                "normal",
              );
            }}

            className={`flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-semibold transition sm:px-3 ${
              viewMode ===
              "normal"
                ? "bg-white text-slate-950"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Eye
              size={13}
            />

            <span className="hidden sm:inline">
              Vỏ thường
            </span>
          </button>


          <button
            type="button"

            aria-label="Hiển thị vỏ trong suốt 70 phần trăm"

            aria-pressed={
              viewMode ===
              "transparent"
            }

            onClick={() => {
              setViewMode(
                "transparent",
              );
            }}

            className={`flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-semibold transition sm:px-3 ${
              viewMode ===
              "transparent"
                ? "bg-emerald-300 text-[#05251a]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <EyeOff
              size={13}
            />

            <span className="hidden sm:inline">
              Trong suốt
            </span>
          </button>
        </div>
      </header>


      {/* =====================================================
          PART INFORMATION
      ===================================================== */}

      {hoveredPart && (
        <aside className="mgx-part-panel pointer-events-none absolute bottom-40 left-3 z-20 w-[min(320px,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#07110e]/88 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:bottom-24 sm:left-6 sm:w-[min(340px,calc(100vw-2rem))]">

          <div
            className="h-0.5 w-full"

            style={{
              backgroundColor:
                hoveredPart.accent,
            }}
          />


          <div className="p-4 sm:p-5">

            <div className="flex items-start gap-3">

              <div
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border"

                style={{
                  color:
                    hoveredPart.accent,

                  borderColor:
                    `${hoveredPart.accent}44`,

                  backgroundColor:
                    `${hoveredPart.accent}12`,
                }}
              >
                <Box
                  size={18}
                />
              </div>


              <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center gap-2">

                  <p className="text-sm font-semibold text-white">
                    {
                      hoveredPart.label
                    }
                  </p>


                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-bold tracking-wider text-slate-400">
                    {
                      hoveredPart.code
                    }
                  </span>
                </div>


                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300/80">
                  {
                    hoveredPart.category
                  }
                </p>
              </div>
            </div>


            <p className="mt-4 text-sm font-medium leading-6 text-slate-200">
              {
                hoveredPart.summary
              }
            </p>


            <p className="mt-2 text-xs leading-5 text-slate-400">
              {
                hoveredPart.details
              }
            </p>


            <div className="mt-4 flex items-center gap-2 border-t border-white/8 pt-3 text-[10px] font-medium text-slate-400">

              <MousePointer2
                size={13}

                className="text-emerald-300"
              />


              {hoveredPart.interaction ===
              "lid"
                ? "Chạm để tháo hoặc gắn nắp"
                : hoveredPart.interaction ===
                    "explode"
                  ? "Chạm để bung hoặc thu linh kiện"
                  : "Linh kiện khung cố định"}
            </div>
          </div>
        </aside>
      )}


      {/* =====================================================
          STATUS
      ===================================================== */}

      <div className="pointer-events-none absolute left-1/2 top-[72px] z-20 w-[min(88vw,520px)] -translate-x-1/2 sm:top-6">

        <div
          className={`flex items-center justify-center gap-2 rounded-full border px-3 py-1.5 text-center text-[9px] font-semibold tracking-wide shadow-xl backdrop-blur-xl transition sm:text-[10px] ${
            mosquitoActive
              ? "border-violet-300/30 bg-violet-400/10 text-violet-100"
              : "border-white/8 bg-black/35 text-slate-400"
          }`}
        >
          {mosquitoActive
            ? (
              <Sparkles
                size={12}
              />
            )
            : (
              <Info
                size={12}
              />
            )}


          <span className="line-clamp-2">
            {status}
          </span>
        </div>
      </div>


      {/* =====================================================
          MOBILE TOUCH CONTROLS
      ===================================================== */}

      <div className="pointer-events-none absolute inset-x-0 bottom-[58px] z-30 flex justify-center px-3 sm:hidden">

        <div className="pointer-events-auto flex w-full max-w-[340px] items-center gap-2 rounded-2xl border border-white/10 bg-black/65 p-2 shadow-2xl backdrop-blur-xl">

          {/* RESET */}

          <button
            type="button"

            onClick={
              resetDevice
            }

            className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-sky-300/15 bg-sky-400/10 px-3 py-2.5 text-[11px] font-semibold text-sky-100 transition active:scale-[0.97]"
          >
            <RotateCcw
              size={15}

              className="shrink-0 text-sky-300"
            />

            Reset
          </button>


          {/* RELEASE */}

          <button
            type="button"

            disabled={
              mosquitoActive
            }

            onClick={
              releaseMosquitoes
            }

            className={`flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-[11px] font-semibold transition active:scale-[0.97] ${
              mosquitoActive
                ? "cursor-not-allowed border-white/5 bg-white/5 text-white/30"
                : "border-violet-300/20 bg-violet-400/10 text-violet-100"
            }`}
          >
            <Wind
              size={15}

              className={
                mosquitoActive
                  ? "shrink-0 text-white/30"
                  : "shrink-0 text-violet-300"
              }
            />

            {mosquitoActive
              ? "Đang chạy"
              : "Thả muỗi"}
          </button>
        </div>
      </div>


      {/* =====================================================
          DESKTOP INTERACTION GUIDE
      ===================================================== */}

      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 hidden justify-center px-4 sm:flex sm:bottom-6">

        <div className="flex max-w-full items-center gap-2 overflow-x-auto rounded-full border border-white/10 bg-black/55 p-1.5 px-2 text-[10px] font-medium text-slate-300 shadow-2xl backdrop-blur-xl">

          <span className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5">

            <MousePointer2
              size={12}

              className="text-emerald-300"
            />

            Trái · chọn linh kiện
          </span>


          <span className="h-4 w-px bg-white/10" />


          <span className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5">

            <RotateCcw
              size={12}

              className="text-sky-300"
            />

            Chuột phải thiết bị · reset
          </span>


          <span className="h-4 w-px bg-white/10" />


          <span className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5">

            <Wind
              size={12}

              className="text-violet-300"
            />

            Chuột phải nền · thả muỗi
          </span>
        </div>
      </div>


      {/* =====================================================
          MOBILE INTERACTION TIP
      ===================================================== */}

      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center px-3 sm:hidden">

        <div className="rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-[9px] font-medium text-slate-400 shadow-xl backdrop-blur-xl">

          Kéo để xoay · chụm để zoom · chạm linh kiện để tương tác
        </div>
      </div>


      {/* =====================================================
          HANDOFF
      ===================================================== */}

      {handoffMode && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-14 z-40 flex justify-center">

            <div className="rounded-full border border-cyan-300/20 bg-black/70 px-4 py-2 font-mono text-[10px] font-bold tracking-[0.14em] text-cyan-100 shadow-2xl backdrop-blur-xl">
              MGX_CAMERA · CAPTURE FRAME
            </div>
          </div>


          <div
            className={`mgx-shutter-flash pointer-events-none absolute inset-0 z-[100] bg-white ${
              flashActive
                ? "is-active"
                : ""
            }`}
          />
        </>
      )}


      {/* =====================================================
          STYLE
      ===================================================== */}

      <style jsx>{`
        .mgx-shutter-flash {
          opacity: 0;
        }

        .mgx-shutter-flash.is-active {
          animation:
            mgxShutterFlash
            760ms
            ease-out
            forwards;
        }

        @keyframes mgxShutterFlash {
          0% {
            opacity: 0;
          }

          10% {
            opacity: 0.98;
          }

          26% {
            opacity: 0.14;
          }

          42% {
            opacity: 0.85;
          }

          67% {
            opacity: 0.06;
          }

          100% {
            opacity: 0;
          }
        }
      `}</style>
    </main>
  );
}