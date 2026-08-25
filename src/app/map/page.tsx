"use client";

import dynamic from "next/dynamic";
import {
  useMemo,
  useState,
} from "react";
import {
  AlertTriangle,
  CalendarDays,
  Layers3,
  MapPin,
  Radio,
} from "lucide-react";

import PageIntro from "@/components/ui/page-intro";
import { stations } from "@/data/mock-data";
import type {
  RiskLevel,
} from "@/types";
import type {
  GeographicMapProps,
} from "../map/geographic-map";

const GeographicMap =
  dynamic<GeographicMapProps>(
    () =>
      import(
        "../map/geographic-map"
      ).then(
        (module) =>
          module.default,
      ),
    {
      ssr: false,

      loading: () => (
        <div className="flex h-full items-center justify-center bg-slate-100 text-sm font-semibold text-slate-500">
          Đang tải bản đồ địa lý...
        </div>
      ),
    },
  );

const periods = [
  "24 giờ",
  "7 ngày",
  "30 ngày",
] as const;

type Period =
  (typeof periods)[number];

type RiskStyle = {
  label: string;
  shortLabel: string;
  marker: string;
  text: string;
  soft: string;
  border: string;
};

const riskStyles: Record<
  RiskLevel,
  RiskStyle
> = {
  critical: {
    label: "Nguy cơ rất cao",
    shortLabel: "Rất cao",
    marker: "bg-red-700",
    text: "text-red-700",
    soft: "bg-red-50",
    border: "border-red-200",
  },

  high: {
    label: "Nguy cơ cao",
    shortLabel: "Cao",
    marker: "bg-orange-500",
    text: "text-orange-600",
    soft: "bg-orange-50",
    border: "border-orange-200",
  },

  medium: {
    label: "Nguy cơ trung bình",
    shortLabel: "Trung bình",
    marker: "bg-amber-400",
    text: "text-amber-600",
    soft: "bg-amber-50",
    border: "border-amber-200",
  },

  low: {
    label: "Nguy cơ thấp",
    shortLabel: "Thấp",
    marker: "bg-emerald-500",
    text: "text-emerald-600",
    soft: "bg-emerald-50",
    border: "border-emerald-200",
  },
};

function getMultiplier(
  period: Period,
) {
  if (period === "30 ngày") {
    return 1.25;
  }

  if (period === "7 ngày") {
    return 1.1;
  }

  return 1;
}

export default function MapPage() {
  const [period, setPeriod] =
    useState<Period>("24 giờ");

  const [
    selectedId,
    setSelectedId,
  ] = useState(
    stations[0]?.id ?? "",
  );

  const [
    showDensity,
    setShowDensity,
  ] = useState(true);

  const multiplier =
    getMultiplier(period);

  const selected =
    stations.find(
      (station) =>
        station.id === selectedId,
    ) ?? stations[0];

  const averageDensity =
    useMemo(() => {
      if (!stations.length) {
        return 0;
      }

      const total =
        stations.reduce(
          (sum, station) =>
            sum +
            station.mosquitoCount,
          0,
        );

      return Math.round(
        (total /
          stations.length) *
          multiplier,
      );
    }, [multiplier]);

  const highRiskCount =
    stations.filter(
      (station) =>
        station.risk === "high" ||
        station.risk ===
          "critical",
    ).length;

  const onlineCount =
    stations.filter(
      (station) =>
        station.online,
    ).length;

  if (!selected) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-700">
        Chưa có dữ liệu trạm để
        hiển thị trên bản đồ.
      </div>
    );
  }

  const selectedRisk =
    riskStyles[selected.risk];

  return (
    <div>
      <PageIntro
        eyebrow="BẢN ĐỒ ĐỊA LÝ · OPENSTREETMAP"
        title="Bản đồ phân bố mật độ muỗi"
        description="Bản đồ địa lý tương tác sử dụng tọa độ thật của từng trạm. Số liệu mật độ hiện vẫn là dữ liệu minh họa."
        action={
          <div className="flex rounded-xl border border-slate-200 bg-white p-1">
            {periods.map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setPeriod(
                      item,
                    )
                  }
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition sm:px-4 ${
                    period === item
                      ? "bg-emerald-600 text-white"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {item}
                </button>
              ),
            )}
          </div>
        }
      />

      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={MapPin}
          label="Trạm hiển thị"
          value={String(
            stations.length,
          )}
          color="text-emerald-700"
        />

        <SummaryCard
          icon={AlertTriangle}
          label="Nguy cơ cao"
          value={String(
            highRiskCount,
          )}
          color="text-red-600"
        />

        <SummaryCard
          icon={Layers3}
          label="Mật độ trung bình"
          value={String(
            averageDensity,
          )}
          color="text-amber-600"
        />

        <SummaryCard
          icon={Radio}
          label="Trạm trực tuyến"
          value={`${onlineCount}/${stations.length}`}
          color="text-blue-600"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <article className="overflow-hidden rounded-2xl border border-[#dce8e2] bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-bold text-[#16352a]">
                Mạng lưới MosguardX ·
                Hà Nội
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Kéo, phóng to hoặc
                chọn marker để xem
                thông tin trạm.
              </p>
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={
                  showDensity
                }
                onChange={(
                  event,
                ) =>
                  setShowDensity(
                    event.target
                      .checked,
                  )
                }
                className="h-4 w-4 accent-emerald-600"
              />

              Hiển thị vùng mật độ
            </label>
          </div>

          <div className="relative h-[650px]">
            <GeographicMap
              stations={stations}
              selectedId={
                selectedId
              }
              multiplier={
                multiplier
              }
              showDensity={
                showDensity
              }
              onSelect={(
                stationId,
              ) =>
                setSelectedId(
                  stationId,
                )
              }
            />

            <div className="pointer-events-none absolute right-4 top-4 z-[500] rounded-lg bg-amber-50/95 px-3 py-2 text-[10px] font-bold text-amber-700 shadow">
              MẬT ĐỘ MINH HỌA
            </div>

            <div className="absolute bottom-7 left-4 z-[500] rounded-xl bg-white/95 p-3 text-[10px] font-semibold text-slate-600 shadow-lg">
              <p className="mb-2 font-bold text-[#16352a]">
                Mức nguy cơ
              </p>

              <div className="flex flex-wrap gap-3">
                {(
                  [
                    "low",
                    "medium",
                    "high",
                    "critical",
                  ] as RiskLevel[]
                ).map(
                  (risk) => (
                    <span
                      key={
                        risk
                      }
                      className="flex items-center gap-1.5"
                    >
                      <i
                        className={`h-2.5 w-2.5 rounded-full ${riskStyles[risk].marker}`}
                      />

                      {
                        riskStyles[
                          risk
                        ]
                          .shortLabel
                      }
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </article>

        <aside className="h-fit rounded-2xl border border-[#dce8e2] bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <MapPin
                size={22}
              />
            </span>

            <span
              className={`rounded-full border px-3 py-1.5 text-[10px] font-bold ${selectedRisk.soft} ${selectedRisk.text} ${selectedRisk.border}`}
            >
              {
                selectedRisk.label
              }
            </span>
          </div>

          <p className="mt-5 text-xs font-bold text-emerald-700">
            {selected.id}
          </p>

          <h3 className="mt-1 text-xl font-bold text-[#16352a]">
            {selected.name}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {selected.district},
            Hà Nội
          </p>

          <div className="mt-6 space-y-3">
            <InfoRow
              label="Khoảng thời gian"
              value={period}
              icon={
                <CalendarDays
                  size={16}
                />
              }
            />

            <InfoRow
              label="Mật độ"
              value={String(
                Math.round(
                  selected.mosquitoCount *
                    multiplier,
                ),
              )}
            />

            <InfoRow
              label="Tọa độ"
              value={`${selected.latitude.toFixed(
                4,
              )}, ${selected.longitude.toFixed(
                4,
              )}`}
            />

            <InfoRow
              label="Pin"
              value={`${selected.battery}%`}
            />

            <InfoRow
              label="Cập nhật"
              value={
                selected.lastSeen
              }
            />

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <span className="text-sm text-slate-500">
                Trạng thái
              </span>

              <strong
                className={`flex items-center gap-2 text-sm ${
                  selected.online
                    ? "text-emerald-700"
                    : "text-red-600"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    selected.online
                      ? "animate-pulse bg-emerald-500"
                      : "bg-red-500"
                  }`}
                />

                {selected.online
                  ? "Trực tuyến"
                  : "Mất kết nối"}
              </strong>
            </div>
          </div>
        </aside>
      </section>

      <p className="mt-4 text-xs leading-5 text-slate-400">
        Nền bản đồ và tọa độ là
        dữ liệu địa lý thật. Mật
        độ, cảnh báo và trạng thái
        trạm hiện là dữ liệu minh
        họa, chưa phải kết luận dịch
        tễ chính thức.
      </p>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <article className="rounded-2xl border border-[#dce8e2] bg-white p-5">
      <div className="flex items-center gap-3">
        <Icon
          className={color}
          size={20}
        />

        <span className="text-xs font-bold text-slate-500">
          {label.toUpperCase()}
        </span>
      </div>

      <strong className="mt-3 block text-2xl text-[#16352a]">
        {value}
      </strong>
    </article>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4">
      <span className="flex items-center gap-2 text-sm text-slate-500">
        {icon}
        {label}
      </span>

      <strong className="text-right text-sm text-[#16352a]">
        {value}
      </strong>
    </div>
  );
}