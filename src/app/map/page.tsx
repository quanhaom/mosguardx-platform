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

import { useLanguage } from "@/components/i18n/language-context";
import PageIntro from "@/components/ui/page-intro";
import { stations } from "@/data/mock-data";
import type {
  RiskLevel,
} from "@/types";
import type {
  GeographicMapProps,
} from "../map/geographic-map";

function MapLoading() {
  const { tr } = useLanguage();

  return (
    <div className="flex h-full items-center justify-center bg-slate-100 text-sm font-semibold text-slate-500">
      {tr("Đang tải bản đồ địa lý...", "Loading geographic map...")}
    </div>
  );
}

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

      loading: () => <MapLoading />,
    },
  );

const periods = [
  { id: "24h", vi: "24 giờ", en: "24 hours" },
  { id: "7d", vi: "7 ngày", en: "7 days" },
  { id: "30d", vi: "30 ngày", en: "30 days" },
] as const;

type Period = (typeof periods)[number]["id"];

type RiskStyle = {
  labelVi: string;
  labelEn: string;
  shortLabelVi: string;
  shortLabelEn: string;
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
    labelVi: "Nguy cơ rất cao",
    labelEn: "Critical risk",
    shortLabelVi: "Rất cao",
    shortLabelEn: "Critical",
    marker: "bg-red-700",
    text: "text-red-700",
    soft: "bg-red-50",
    border: "border-red-200",
  },

  high: {
    labelVi: "Nguy cơ cao",
    labelEn: "High risk",
    shortLabelVi: "Cao",
    shortLabelEn: "High",
    marker: "bg-orange-500",
    text: "text-orange-600",
    soft: "bg-orange-50",
    border: "border-orange-200",
  },

  medium: {
    labelVi: "Nguy cơ trung bình",
    labelEn: "Medium risk",
    shortLabelVi: "Trung bình",
    shortLabelEn: "Medium",
    marker: "bg-amber-400",
    text: "text-amber-600",
    soft: "bg-amber-50",
    border: "border-amber-200",
  },

  low: {
    labelVi: "Nguy cơ thấp",
    labelEn: "Low risk",
    shortLabelVi: "Thấp",
    shortLabelEn: "Low",
    marker: "bg-emerald-500",
    text: "text-emerald-600",
    soft: "bg-emerald-50",
    border: "border-emerald-200",
  },
};

function getMultiplier(
  period: Period,
) {
  if (period === "30d") {
    return 1.25;
  }

  if (period === "7d") {
    return 1.1;
  }

  return 1;
}

function localizeStationName(name: string, language: "vi" | "en") {
  if (language === "vi") {
    return name;
  }

  return name.replace(/^Trạm\s+/, "") + " Station";
}

function localizeRelativeTime(value: string, language: "vi" | "en") {
  if (language === "vi") {
    return value;
  }

  if (value === "Vừa xong") {
    return "Just now";
  }

  const minuteMatch = value.match(/^(\d+)\s+phút trước$/);
  if (minuteMatch) {
    return `${minuteMatch[1]} minutes ago`;
  }

  const hourMatch = value.match(/^(\d+)\s+giờ trước$/);
  if (hourMatch) {
    return `${hourMatch[1]} hours ago`;
  }

  return value;
}

export default function MapPage() {
  const { language, tr } = useLanguage();
  const [period, setPeriod] =
    useState<Period>("24h");

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
        {tr(
          "Chưa có dữ liệu trạm để hiển thị trên bản đồ.",
          "No station data is available for the map.",
        )}
      </div>
    );
  }

  const selectedRisk =
    riskStyles[selected.risk];

  return (
    <div>
      <PageIntro
        eyebrow={tr(
          "BẢN ĐỒ ĐỊA LÝ · OPENSTREETMAP",
          "GEOGRAPHIC MAP · OPENSTREETMAP",
        )}
        title={tr(
          "Bản đồ phân bố mật độ muỗi",
          "Mosquito density distribution map",
        )}
        description={tr(
          "Bản đồ địa lý tương tác sử dụng tọa độ thật của từng trạm. Số liệu mật độ hiện vẫn là dữ liệu minh họa.",
          "An interactive geographic map using the real coordinates of each station. Density values are still demonstration data.",
        )}
        action={
          <div className="flex rounded-xl border border-slate-200 bg-white p-1">
            {periods.map(
              (item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setPeriod(
                      item.id,
                    )
                  }
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition sm:px-4 ${
                    period === item.id
                      ? "bg-emerald-600 text-white"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {tr(item.vi, item.en)}
                </button>
              ),
            )}
          </div>
        }
      />

      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={MapPin}
          label={tr("Trạm hiển thị", "Visible stations")}
          value={String(
            stations.length,
          )}
          color="text-emerald-700"
        />

        <SummaryCard
          icon={AlertTriangle}
          label={tr("Nguy cơ cao", "High-risk stations")}
          value={String(
            highRiskCount,
          )}
          color="text-red-600"
        />

        <SummaryCard
          icon={Layers3}
          label={tr("Mật độ trung bình", "Average density")}
          value={String(
            averageDensity,
          )}
          color="text-amber-600"
        />

        <SummaryCard
          icon={Radio}
          label={tr("Trạm trực tuyến", "Online stations")}
          value={`${onlineCount}/${stations.length}`}
          color="text-blue-600"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <article className="overflow-hidden rounded-2xl border border-[#dce8e2] bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-bold text-[#16352a]">
                {tr(
                  "Mạng lưới MosguardX · Hà Nội",
                  "MosguardX Network · Hanoi",
                )}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {tr(
                  "Kéo, phóng to hoặc chọn marker để xem thông tin trạm.",
                  "Pan, zoom, or select a marker to view station information.",
                )}
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

              {tr("Hiển thị vùng mật độ", "Show density areas")}
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
                stationId: string,
              ) =>
                setSelectedId(
                  stationId,
                )
              }
            />

            <div className="pointer-events-none absolute right-4 top-4 z-[500] rounded-lg bg-amber-50/95 px-3 py-2 text-[10px] font-bold text-amber-700 shadow">
              {tr("MẬT ĐỘ MINH HỌA", "DEMO DENSITY")}
            </div>

            <div className="absolute bottom-7 left-4 z-[500] rounded-xl bg-white/95 p-3 text-[10px] font-semibold text-slate-600 shadow-lg">
              <p className="mb-2 font-bold text-[#16352a]">
                {tr("Mức nguy cơ", "Risk level")}
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
                        language === "vi"
                          ? riskStyles[risk].shortLabelVi
                          : riskStyles[risk].shortLabelEn
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
                language === "vi"
                  ? selectedRisk.labelVi
                  : selectedRisk.labelEn
              }
            </span>
          </div>

          <p className="mt-5 text-xs font-bold text-emerald-700">
            {selected.id}
          </p>

          <h3 className="mt-1 text-xl font-bold text-[#16352a]">
            {localizeStationName(selected.name, language)}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {selected.district},{" "}
            {tr("Hà Nội", "Hanoi")}
          </p>

          <div className="mt-6 space-y-3">
            <InfoRow
              label={tr("Khoảng thời gian", "Time period")}
              value={tr(
                periods.find((item) => item.id === period)?.vi ?? "24 giờ",
                periods.find((item) => item.id === period)?.en ?? "24 hours",
              )}
              icon={
                <CalendarDays
                  size={16}
                />
              }
            />

            <InfoRow
              label={tr("Mật độ", "Density")}
              value={String(
                Math.round(
                  selected.mosquitoCount *
                    multiplier,
                ),
              )}
            />

            <InfoRow
              label={tr("Tọa độ", "Coordinates")}
              value={`${selected.latitude.toFixed(
                4,
              )}, ${selected.longitude.toFixed(
                4,
              )}`}
            />

            <InfoRow
              label={tr("Pin", "Battery")}
              value={`${selected.battery}%`}
            />

            <InfoRow
              label={tr("Cập nhật", "Last update")}
              value={
                localizeRelativeTime(selected.lastSeen, language)
              }
            />

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <span className="text-sm text-slate-500">
                {tr("Trạng thái", "Status")}
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
                  ? tr("Trực tuyến", "Online")
                  : tr("Mất kết nối", "Offline")}
              </strong>
            </div>
          </div>
        </aside>
      </section>

      <p className="mt-4 text-xs leading-5 text-slate-400">
        {tr(
          "Nền bản đồ và tọa độ là dữ liệu địa lý thật. Mật độ, cảnh báo và trạng thái trạm hiện là dữ liệu minh họa, chưa phải kết luận dịch tễ chính thức.",
          "The basemap and coordinates use real geographic data. Station density, alerts, and status are demonstration data and are not official epidemiological conclusions.",
        )}
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