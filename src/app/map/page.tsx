"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Layers3,
  MapPin,
} from "lucide-react";

import PageIntro from "@/components/ui/page-intro";
import { stations } from "@/data/mock-data";

const periods = ["24 giờ", "7 ngày", "30 ngày"];

const positions = [
  { left: "31%", top: "27%" },
  { left: "61%", top: "38%" },
  { left: "22%", top: "61%" },
  { left: "68%", top: "68%" },
  { left: "46%", top: "67%" },
  { left: "54%", top: "18%" },
];

export default function MapPage() {
  const [period, setPeriod] = useState("24 giờ");
  const [selectedId, setSelectedId] = useState(stations[0].id);
  const [showHeatmap, setShowHeatmap] = useState(true);

  const multiplier =
    period === "30 ngày" ? 1.25 : period === "7 ngày" ? 1.1 : 1;

  const selected =
    stations.find((station) => station.id === selectedId) ?? stations[0];

  const averageDensity = useMemo(() => {
    const total = stations.reduce(
      (sum, station) => sum + station.mosquitoCount,
      0,
    );

    return Math.round((total / stations.length) * multiplier);
  }, [multiplier]);

  const highRiskCount = stations.filter(
    (station) => station.risk === "high",
  ).length;

  return (
    <div>
      <PageIntro
        eyebrow="PHÂN TÍCH KHÔNG GIAN VÀ THỜI GIAN"
        title="Bản đồ phân bố mật độ muỗi"
        description="Heatmap mô phỏng sự phân bố mật độ tương đối từ các trạm MosguardX theo khu vực và thời gian."
        action={
          <div className="flex rounded-xl border border-slate-200 bg-white p-1">
            {periods.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPeriod(item)}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                  period === item
                    ? "bg-emerald-600 text-white"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        }
      />

      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-[#dce8e2] bg-white p-5">
          <div className="flex items-center gap-3">
            <MapPin className="text-emerald-700" size={20} />
            <span className="text-xs font-bold text-slate-500">
              TRẠM HIỂN THỊ
            </span>
          </div>

          <strong className="mt-3 block text-2xl text-[#16352a]">
            {stations.length}
          </strong>
        </article>

        <article className="rounded-2xl border border-[#dce8e2] bg-white p-5">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-600" size={20} />
            <span className="text-xs font-bold text-slate-500">
              KHU VỰC NGUY CƠ CAO
            </span>
          </div>

          <strong className="mt-3 block text-2xl text-[#16352a]">
            {highRiskCount}
          </strong>
        </article>

        <article className="rounded-2xl border border-[#dce8e2] bg-white p-5">
          <div className="flex items-center gap-3">
            <Layers3 className="text-amber-600" size={20} />
            <span className="text-xs font-bold text-slate-500">
              MẬT ĐỘ TRUNG BÌNH
            </span>
          </div>

          <strong className="mt-3 block text-2xl text-[#16352a]">
            {averageDensity}
          </strong>
        </article>

        <article className="rounded-2xl border border-[#dce8e2] bg-white p-5">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-blue-600" size={20} />
            <span className="text-xs font-bold text-slate-500">
              KHOẢNG THỜI GIAN
            </span>
          </div>

          <strong className="mt-3 block text-2xl text-[#16352a]">
            {period}
          </strong>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <article className="overflow-hidden rounded-2xl border border-[#dce8e2] bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-bold text-[#16352a]">
                Heatmap nguy cơ dịch tễ
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Chọn một điểm trên bản đồ để xem thông tin trạm.
              </p>
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={(event) =>
                  setShowHeatmap(event.target.checked)
                }
                className="h-4 w-4 accent-emerald-600"
              />
              Hiển thị heatmap
            </label>
          </div>

          <div className="map-grid relative h-[650px] overflow-hidden">
            <div className="absolute left-[10%] top-[15%] h-[3px] w-[80%] rotate-12 bg-white/80" />
            <div className="absolute left-[5%] top-[58%] h-[3px] w-[92%] -rotate-6 bg-white/90" />
            <div className="absolute left-[38%] top-[-5%] h-[115%] w-[3px] rotate-12 bg-white/80" />

            <div className="absolute left-[8%] top-[22%] h-24 w-48 rounded-[50%] border border-emerald-900/5 bg-emerald-700/5" />
            <div className="absolute bottom-[10%] right-[5%] h-36 w-64 rounded-[50%] border border-emerald-900/5 bg-emerald-700/5" />

            {showHeatmap &&
              stations.map((station, index) => {
                const selectedStation = selectedId === station.id;
                const value = Math.round(
                  station.mosquitoCount * multiplier,
                );

                const color =
                  station.risk === "high"
                    ? "text-red-500"
                    : station.risk === "medium"
                      ? "text-amber-500"
                      : "text-emerald-500";

                return (
                  <button
                    key={station.id}
                    type="button"
                    aria-label={`Chọn ${station.name}`}
                    onClick={() => setSelectedId(station.id)}
                    style={positions[index]}
                    className={`heat-point absolute z-10 -translate-x-1/2 -translate-y-1/2 ${color}`}
                  >
                    <span
                      className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 bg-current shadow-xl transition hover:scale-110 ${
                        selectedStation
                          ? "scale-110 border-[#173d31]"
                          : "border-white"
                      }`}
                    >
                      <span className="text-xs font-bold text-white">
                        {value}
                      </span>
                    </span>

                    <span className="absolute left-1/2 top-14 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#173d31] px-2 py-1 text-[10px] font-semibold text-white shadow">
                      {station.district}
                    </span>
                  </button>
                );
              })}

            {!showHeatmap && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm">
                <div className="text-center text-slate-500">
                  <Layers3 className="mx-auto" size={32} />
                  <p className="mt-3 text-sm">
                    Heatmap đang được ẩn
                  </p>
                </div>
              </div>
            )}

            <div className="absolute bottom-4 left-4 z-30 flex flex-wrap gap-3 rounded-xl bg-white/90 p-3 text-[10px] font-semibold text-slate-600 shadow-lg backdrop-blur">
              <span className="flex items-center gap-1">
                <i className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Thấp
              </span>

              <span className="flex items-center gap-1">
                <i className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                Trung bình
              </span>

              <span className="flex items-center gap-1">
                <i className="h-2.5 w-2.5 rounded-full bg-red-500" />
                Cao
              </span>
            </div>
          </div>
        </article>

        <aside className="h-fit rounded-2xl border border-[#dce8e2] bg-white p-6 shadow-sm">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <MapPin size={22} />
          </span>

          <p className="mt-5 text-xs font-bold text-emerald-700">
            {selected.id}
          </p>

          <h3 className="mt-1 text-xl font-bold text-[#16352a]">
            {selected.name}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {selected.district}, Hà Nội
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between rounded-xl bg-slate-50 p-4">
              <span className="text-sm text-slate-500">
                Khoảng thời gian
              </span>
              <strong className="text-sm">{period}</strong>
            </div>

            <div className="flex justify-between rounded-xl bg-slate-50 p-4">
              <span className="text-sm text-slate-500">
                Mật độ
              </span>
              <strong>
                {Math.round(selected.mosquitoCount * multiplier)}
              </strong>
            </div>

            <div className="flex justify-between rounded-xl bg-slate-50 p-4">
              <span className="text-sm text-slate-500">
                Pin
              </span>
              <strong>{selected.battery}%</strong>
            </div>

            <div className="flex justify-between rounded-xl bg-slate-50 p-4">
              <span className="text-sm text-slate-500">
                Trạng thái
              </span>
              <strong
                className={
                  selected.online
                    ? "text-emerald-700"
                    : "text-red-600"
                }
              >
                {selected.online
                  ? "Trực tuyến"
                  : "Mất kết nối"}
              </strong>
            </div>
          </div>
        </aside>
      </section>

      <p className="mt-4 text-xs leading-5 text-slate-400">
        Dữ liệu hiện tại là dữ liệu mô phỏng phục vụ phát triển và trình diễn,
        chưa phải kết luận dịch tễ chính thức.
      </p>
    </div>
  );
}
