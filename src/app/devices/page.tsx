"use client";

import { useState } from "react";
import { Cpu, Droplets, Search, Thermometer } from "lucide-react";
import PageIntro from "@/components/ui/page-intro";
import { useStations } from "@/hooks/use-stations";

export default function DevicesPage() {
  const [query, setQuery] = useState("");
  const { stations, source, loading } = useStations();

  const devices = stations.filter((station) =>
    `${station.id} ${station.name} ${station.district}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <div>
      <PageIntro
        eyebrow="MẠNG LƯỚI IOT"
        title="Quản lý thiết bị"
        description="Theo dõi trạng thái kết nối, pin và dữ liệu gần nhất của các trạm MosguardX."
        action={
          <button className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white">
            + Thêm thiết bị
          </button>
        }
      />

      <div className={`mb-5 rounded-xl border px-4 py-3 text-xs font-semibold ${source === "live" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
        {loading
          ? "Đang đồng bộ dữ liệu cảm biến..."
          : source === "live"
            ? "Dữ liệu trực tiếp từ các trạm · tự cập nhật mỗi 30 giây"
            : "Chưa kết nối được dữ liệu trạm thật; nhiệt độ và độ ẩm chưa khả dụng."}
      </div>

      <label className="mb-5 flex max-w-md items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <Search size={18} className="text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Tìm theo mã hoặc khu vực..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </label>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {devices.map((station) => (
          <article
            key={station.id}
            className="rounded-2xl border border-[#dce8e2] bg-white p-5"
          >
            <div className="flex items-start justify-between">
              <span className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                <Cpu />
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  station.online
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {station.online ? "Trực tuyến" : "Mất kết nối"}
              </span>
            </div>

            <h3 className="mt-5 font-bold text-[#16352a]">{station.id}</h3>
            <p className="text-sm text-slate-500">{station.name}</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Pin</p>
                <strong>{station.battery}%</strong>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Muỗi / 24h</p>
                <strong>{station.mosquitoCount}</strong>
              </div>
              <div className="rounded-xl bg-orange-50 p-3">
                <p className="flex items-center gap-1.5 text-xs text-orange-700"><Thermometer size={14} />Nhiệt độ</p>
                <strong>{station.temperature == null ? "--" : `${station.temperature.toFixed(1)} °C`}</strong>
              </div>
              <div className="rounded-xl bg-blue-50 p-3">
                <p className="flex items-center gap-1.5 text-xs text-blue-700"><Droplets size={14} />Độ ẩm</p>
                <strong>{station.humidity == null ? "--" : `${station.humidity.toFixed(1)}%`}</strong>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-slate-400">
              Cảm biến cập nhật: {station.environmentUpdatedAt ?? station.lastSeen}
            </p>

            <button className="mt-5 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600">
              Xem chi tiết
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
