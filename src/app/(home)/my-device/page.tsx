"use client";

import Link from "next/link";
import { useState } from "react";

import {
  BatteryMedium,
  Camera,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Cpu,
  Fan,
  Gauge,
  HardDrive,
  Info,
  Plus,
  Radio,
  Router,
  ScanLine,
  ShieldCheck,
  UploadCloud,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import {
  homeDevices,
} from "@/lib/home/mock-data";

export default function MyDevicePage() {
  const [
    selectedDeviceId,
    setSelectedDeviceId,
  ] = useState(
    homeDevices[0].id,
  );

  const selectedDevice =
    homeDevices.find(
      (device) =>
        device.id ===
        selectedDeviceId,
    ) ?? homeDevices[0];

  const hasWarning =
    selectedDevice.camera.status !==
      "normal" ||
    selectedDevice.motionEngine
      .status !== "normal" ||
    selectedDevice.aiConnection
      .status !== "normal" ||
    selectedDevice.fan.status !==
      "normal" ||
    selectedDevice.wifi.status !==
      "normal";

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-emerald-700">
            MOSGUARDX HOME
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#16352a] sm:text-4xl">
            Thiết bị của tôi
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Theo dõi tình trạng các thiết
            bị MosGuardX, kết nối, AI và
            cartridge tại ngôi nhà của bạn.
          </p>
        </div>

        <OnlineBadge
          online={
            selectedDevice.online
          }
        />
      </section>

      {/* Device selector */}
      <section>
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-slate-400">
              THIẾT BỊ TRONG NHÀ
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#16352a]">
              {homeDevices.length} thiết bị
            </h2>
          </div>

          <button
            type="button"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
          >
            <Plus size={17} />
            Thêm thiết bị
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {homeDevices.map(
            (device) => {
              const active =
                selectedDevice.id ===
                device.id;

              return (
                <button
                  key={device.id}
                  type="button"
                  onClick={() =>
                    setSelectedDeviceId(
                      device.id,
                    )
                  }
                  className={`flex items-center gap-4 rounded-[24px] border p-5 text-left transition ${
                    active
                      ? "border-emerald-500 bg-emerald-50 shadow-sm"
                      : "border-[#dfe9e4] bg-white hover:border-emerald-300"
                  }`}
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                      active
                        ? "bg-[#16352a] text-emerald-300"
                        : "bg-slate-50 text-slate-500"
                    }`}
                  >
                    <ShieldCheck
                      size={23}
                    />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-bold text-[#16352a]">
                        {device.name}
                      </p>

                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                          device.online
                            ? "bg-emerald-500"
                            : "bg-slate-300"
                        }`}
                      />
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      {device.id}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                        Cartridge{" "}
                        {
                          device
                            .cartridge
                            .percent
                        }
                        %
                      </span>

                      <span
                        className={`rounded-full bg-white px-2.5 py-1 text-[10px] font-bold ${
                          device.wifi
                            .status ===
                          "warning"
                            ? "text-amber-700"
                            : "text-slate-500"
                        }`}
                      >
                        Wi-Fi{" "}
                        {
                          device.wifi
                            .label
                        }
                      </span>

                      {device
                        .eventQueue
                        .pending >
                        0 && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-800">
                          {
                            device
                              .eventQueue
                              .pending
                          }{" "}
                          đang chờ
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight
                    size={18}
                    className={
                      active
                        ? "text-emerald-700"
                        : "text-slate-300"
                    }
                  />
                </button>
              );
            },
          )}
        </div>
      </section>

      {/* Device overview */}
      <section className="overflow-hidden rounded-[30px] bg-[#16352a] p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
          <div className="flex items-start gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-emerald-300 text-[#16352a]">
              <ShieldCheck size={31} />
            </span>

            <div>
              <p className="text-xs font-bold tracking-[0.15em] text-emerald-300">
                {
                  selectedDevice.model
                }
              </p>

              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                {
                  selectedDevice.name
                }
              </h2>

              <p className="mt-2 text-sm text-slate-300">
                {
                  selectedDevice
                    .household
                }
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Device ID:{" "}
                {selectedDevice.id}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <HeroMetric
              label="Trạng thái"
              value={
                selectedDevice.online
                  ? "Đang hoạt động"
                  : "Ngoại tuyến"
              }
            />

            <HeroMetric
              label="Đồng bộ"
              value={
                selectedDevice.lastSeen
              }
            />

            <HeroMetric
              label="Uptime"
              value={
                selectedDevice.uptime
              }
            />
          </div>
        </div>
      </section>

      {/* Device health */}
      <section>
        <div className="mb-4">
          <p className="text-xs font-bold tracking-[0.14em] text-slate-400">
            TÌNH TRẠNG THIẾT BỊ
          </p>

          <h2 className="mt-1 text-xl font-bold text-[#16352a]">
            {hasWarning
              ? "Có một số thông tin cần chú ý"
              : "Mọi thứ đang hoạt động bình thường"}
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <HealthCard
            icon={Camera}
            title="Camera"
            value={
              selectedDevice.camera
                .label
            }
            description={`${selectedDevice.camera.fps} FPS · đang quan sát`}
            status={
              selectedDevice.camera
                .status
            }
          />

          <HealthCard
            icon={ScanLine}
            title="Theo dõi chuyển động"
            value={
              selectedDevice
                .motionEngine.label
            }
            description="Frame difference đang hoạt động"
            status={
              selectedDevice
                .motionEngine.status
            }
          />

          <HealthCard
            icon={Cloud}
            title="AI Cloud"
            value={
              selectedDevice
                .aiConnection.label
            }
            description={`${selectedDevice.aiConnection.latencyMs} ms`}
            status={
              selectedDevice
                .aiConnection.status
            }
          />

          <HealthCard
            icon={Fan}
            title="Quạt"
            value={
              selectedDevice.fan
                .label
            }
            description="Luồng khí ổn định"
            status={
              selectedDevice.fan
                .status
            }
          />
        </div>
      </section>

      {/* Connectivity + cartridge */}
      <section className="grid gap-5 lg:grid-cols-2">
        {/* Wi-Fi */}
        <article className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.14em] text-slate-400">
                KẾT NỐI
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#16352a]">
                Wi-Fi
              </h2>
            </div>

            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Wifi size={22} />
            </span>
          </div>

          <div className="mt-6 flex items-end justify-between gap-5">
            <div>
              <strong
                className={`text-3xl ${
                  selectedDevice.wifi
                    .status ===
                  "warning"
                    ? "text-amber-700"
                    : "text-[#16352a]"
                }`}
              >
                {
                  selectedDevice.wifi
                    .label
                }
              </strong>

              <p className="mt-1 text-sm text-slate-500">
                {
                  selectedDevice.wifi
                    .signalDbm
                }{" "}
                dBm
              </p>
            </div>

            <SignalBars
              signalDbm={
                selectedDevice.wifi
                  .signalDbm
              }
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <InfoBox
              label="IP thiết bị"
              value={
                selectedDevice.ip
              }
            />

            <InfoBox
              label="Đồng bộ gần nhất"
              value={
                selectedDevice.lastSeen
              }
            />
          </div>

          {selectedDevice.wifi
            .status === "warning" ? (
            <div className="mt-5 flex gap-3 rounded-2xl bg-amber-50 p-4">
              <Info
                size={19}
                className="mt-0.5 shrink-0 text-amber-700"
              />

              <p className="text-sm leading-6 text-amber-900">
                Tín hiệu Wi-Fi đang ở mức
                trung bình. Nếu thiết bị
                thường xuyên mất kết nối,
                hãy thử đặt router gần hơn.
              </p>
            </div>
          ) : (
            <div className="mt-5 flex gap-3 rounded-2xl bg-emerald-50 p-4">
              <CheckCircle2
                size={19}
                className="mt-0.5 shrink-0 text-emerald-700"
              />

              <p className="text-sm leading-6 text-emerald-900">
                Kết nối hiện tại đủ ổn định
                để đồng bộ mosquito events
                với MosGuardX Cloud.
              </p>
            </div>
          )}
        </article>

        {/* Cartridge */}
        <article className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.14em] text-slate-400">
                CARTRIDGE
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#16352a]">
                Tình trạng cartridge
              </h2>
            </div>

            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
              <BatteryMedium size={22} />
            </span>
          </div>

          <div className="mt-6 flex items-end justify-between">
            <div>
              <strong className="text-4xl text-[#16352a]">
                {
                  selectedDevice
                    .cartridge.percent
                }
                %
              </strong>

              <p className="mt-1 text-sm text-slate-500">
                khoảng{" "}
                {
                  selectedDevice
                    .cartridge
                    .estimatedDays
                }{" "}
                ngày còn lại
              </p>
            </div>

            <CartridgeBadge
              percent={
                selectedDevice
                  .cartridge.percent
              }
            />
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${
                selectedDevice
                  .cartridge.percent <
                50
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{
                width: `${selectedDevice.cartridge.percent}%`,
              }}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <InfoBox
              label="Lắp đặt"
              value={
                selectedDevice
                  .cartridge
                  .installedAt
              }
            />

            <InfoBox
              label="Dự kiến thay"
              value={`~${selectedDevice.cartridge.estimatedDays} ngày`}
            />
          </div>

          <Link
            href="/home-settings"
            className="mt-5 flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-[#16352a] transition hover:bg-emerald-50"
          >
            Cài đặt cartridge

            <ChevronRight size={17} />
          </Link>
        </article>
      </section>

      {/* Monitoring pipeline */}
      <section className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-slate-400">
              SMART MONITORING
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#16352a]">
              Camera và AI
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Camera quan sát liên tục
              nhưng AI chỉ được gọi khi hệ
              thống phát hiện thay đổi phù
              hợp trong vùng quan sát.
            </p>
          </div>

          <span className="flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
            <Radio
              size={15}
              className="animate-pulse"
            />
            Đang theo dõi
          </span>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-4">
          <PipelineCard
            step="01"
            icon={Camera}
            title="Camera"
            description={`${selectedDevice.camera.fps} FPS`}
          />

          <PipelineCard
            step="02"
            icon={ScanLine}
            title="Frame Difference"
            description={`${selectedDevice.motionEngine.processingFps} FPS`}
          />

          <PipelineCard
            step="03"
            icon={UploadCloud}
            title="Mosquito Event"
            description="Chọn frame phù hợp"
          />

          <PipelineCard
            step="04"
            icon={Cloud}
            title="AI Cloud"
            description="Phát hiện và phân loại"
          />
        </div>

        <div className="mt-5 flex gap-3 rounded-2xl bg-slate-50 p-4">
          <Info
            size={18}
            className="mt-0.5 shrink-0 text-slate-500"
          />

          <p className="text-sm leading-6 text-slate-600">
            Video liên tục không cần tải
            lên cloud. Chỉ các frame cần
            thiết của mosquito event mới
            được gửi để phân tích.
          </p>
        </div>
      </section>

      {/* Queue + diagnostics */}
      <section className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        {/* Queue */}
        <article className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-sm">
          <p className="text-xs font-bold tracking-[0.14em] text-slate-400">
            ĐỒNG BỘ DỮ LIỆU
          </p>

          <h2 className="mt-1 text-xl font-bold text-[#16352a]">
            Event Queue
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <InfoBox
              label="Đang chờ"
              value={String(
                selectedDevice
                  .eventQueue.pending,
              )}
            />

            <InfoBox
              label="Đã đồng bộ"
              value={String(
                selectedDevice
                  .eventQueue.synced,
              )}
            />
          </div>

          {selectedDevice.eventQueue
            .pending > 0 ? (
            <div className="mt-5 flex gap-3 rounded-2xl bg-amber-50 p-4">
              <UploadCloud
                size={18}
                className="mt-0.5 shrink-0 text-amber-700"
              />

              <p className="text-sm leading-6 text-amber-900">
                Có{" "}
                {
                  selectedDevice
                    .eventQueue
                    .pending
                }{" "}
                sự kiện đang chờ đồng bộ
                lên cloud.
              </p>
            </div>
          ) : (
            <div className="mt-5 flex gap-3 rounded-2xl bg-emerald-50 p-4">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-emerald-700"
              />

              <p className="text-sm leading-6 text-emerald-900">
                Không có dữ liệu đang chờ
                đồng bộ.
              </p>
            </div>
          )}
        </article>

        {/* Diagnostics */}
        <article className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.14em] text-slate-400">
                CHẨN ĐOÁN
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#16352a]">
                Thông tin hệ thống
              </h2>
            </div>

            <Cpu
              size={23}
              className="text-emerald-700"
            />
          </div>

          <div className="mt-6 divide-y divide-slate-100">
            <DiagnosticRow
              icon={HardDrive}
              label="Firmware"
              value={
                selectedDevice.firmware
              }
            />

            <DiagnosticRow
              icon={Camera}
              label="Camera"
              value={`${selectedDevice.camera.fps} FPS`}
            />

            <DiagnosticRow
              icon={ScanLine}
              label="Motion engine"
              value={
                selectedDevice
                  .motionEngine.mode
              }
            />

            <DiagnosticRow
              icon={Gauge}
              label="ROI"
              value={
                selectedDevice
                  .motionEngine.roi
              }
            />

            <DiagnosticRow
              icon={Cloud}
              label="AI latency"
              value={`${selectedDevice.aiConnection.latencyMs} ms`}
            />

            <DiagnosticRow
              icon={Router}
              label="Wi-Fi signal"
              value={`${selectedDevice.wifi.signalDbm} dBm`}
            />
          </div>
        </article>
      </section>

      {/* Privacy */}
      <section className="flex gap-4 rounded-[28px] bg-emerald-50 p-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
          <ShieldCheck size={22} />
        </span>

        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-emerald-700">
            QUYỀN RIÊNG TƯ
          </p>

          <h2 className="mt-1 font-bold text-[#16352a]">
            Camera chỉ quan sát buồng
            nhận diện
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            MosGuardX không cần lưu video
            liên tục. Cloud chỉ nhận các dữ
            liệu cần thiết của mosquito
            event và trạng thái thiết bị.
          </p>
        </div>
      </section>
    </div>
  );
}

/* =========================
   COMPONENTS
========================= */

function OnlineBadge({
  online,
}: {
  online: boolean;
}) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ${
        online
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-slate-200 bg-slate-50 text-slate-500"
      }`}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          online
            ? "animate-pulse bg-emerald-500"
            : "bg-slate-300"
        }`}
      />

      {online
        ? "Online"
        : "Offline"}
    </span>
  );
}

function HeroMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function HealthCard({
  icon: Icon,
  title,
  value,
  description,
  status,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  status:
    | "normal"
    | "warning"
    | "offline";
}) {
  const statusClass =
    status === "normal"
      ? "bg-emerald-500"
      : status === "warning"
        ? "bg-amber-500"
        : "bg-slate-300";

  return (
    <article className="rounded-[24px] border border-[#dfe9e4] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Icon size={21} />
        </span>

        <span
          className={`h-2.5 w-2.5 rounded-full ${statusClass}`}
        />
      </div>

      <p className="mt-5 text-sm font-semibold text-slate-500">
        {title}
      </p>

      <p className="mt-1 font-bold text-[#16352a]">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-400">
        {description}
      </p>
    </article>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-[#16352a]">
        {value}
      </p>
    </div>
  );
}

function SignalBars({
  signalDbm,
}: {
  signalDbm: number;
}) {
  const activeBars =
    signalDbm >= -55
      ? 4
      : signalDbm >= -65
        ? 3
        : signalDbm >= -75
          ? 2
          : 1;

  const heights = [
    12,
    20,
    28,
    36,
  ];

  return (
    <div
      className="flex h-10 items-end gap-1"
      aria-label={`Wi-Fi ${signalDbm} dBm`}
    >
      {heights.map(
        (height, index) => (
          <span
            key={height}
            className={`w-2 rounded-sm ${
              index < activeBars
                ? activeBars <= 2
                  ? "bg-amber-500"
                  : "bg-emerald-500"
                : "bg-slate-200"
            }`}
            style={{
              height: `${height}px`,
            }}
          />
        ),
      )}
    </div>
  );
}

function CartridgeBadge({
  percent,
}: {
  percent: number;
}) {
  if (percent < 25) {
    return (
      <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">
        Cần thay sớm
      </span>
    );
  }

  if (percent < 50) {
    return (
      <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
        Cần chú ý
      </span>
    );
  }

  return (
    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
      Tốt
    </span>
  );
}

function PipelineCard({
  step,
  icon: Icon,
  title,
  description,
}: {
  step: string;
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-2xl bg-slate-50 p-5">
      <span className="absolute right-4 top-4 text-xs font-bold text-slate-300">
        {step}
      </span>

      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
        <Icon size={19} />
      </span>

      <h3 className="mt-4 font-bold text-[#16352a]">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function DiagnosticRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
        <Icon size={17} />
      </span>

      <p className="flex-1 text-sm text-slate-500">
        {label}
      </p>

      <strong className="text-right text-sm text-[#16352a]">
        {value}
      </strong>
    </div>
  );
}