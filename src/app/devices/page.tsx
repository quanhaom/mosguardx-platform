"use client";

import { useState } from "react";
import { Cpu, Search } from "lucide-react";
import { useLanguage } from "@/components/i18n/language-context";
import PageIntro from "@/components/ui/page-intro";
import { stations } from "@/data/mock-data";

export default function DevicesPage() {
  const { language, tr } = useLanguage();
  const [query, setQuery] = useState("");

  const devices = stations.filter((station) =>
    `${station.id} ${station.name} ${station.district}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <div>
      <PageIntro
        eyebrow={tr("MẠNG LƯỚI IOT", "IOT NETWORK")}
        title={tr("Quản lý thiết bị", "Device management")}
        description={tr(
          "Theo dõi trạng thái kết nối, pin và dữ liệu gần nhất của các trạm MosguardX.",
          "Monitor connectivity, battery levels, and the latest data from MosguardX stations.",
        )}
        action={
          <button className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white">
            {tr("+ Thêm thiết bị", "+ Add device")}
          </button>
        }
      />

      <label className="mb-5 flex max-w-md items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <Search size={18} className="text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={tr(
            "Tìm theo mã hoặc khu vực...",
            "Search by ID or area...",
          )}
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
                {station.online
                  ? tr("Trực tuyến", "Online")
                  : tr("Mất kết nối", "Offline")}
              </span>
            </div>

            <h3 className="mt-5 font-bold text-[#16352a]">{station.id}</h3>
            <p className="text-sm text-slate-500">
              {language === "en"
                ? station.name.replace(/^Trạm\s+/, "") + " Station"
                : station.name}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">
                  {tr("Pin", "Battery")}
                </p>
                <strong>{station.battery}%</strong>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">
                  {tr("Muỗi / 24h", "Mosquitoes / 24h")}
                </p>
                <strong>{station.mosquitoCount}</strong>
              </div>
            </div>

            <button className="mt-5 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600">
              {tr("Xem chi tiết", "View details")}
            </button>
          </article>
        ))}
      </section>

      {devices.length === 0 && (
        <div className="rounded-2xl border border-[#dce8e2] bg-white p-12 text-center text-sm text-slate-500">
          {tr("Không tìm thấy thiết bị.", "No devices found.")}
        </div>
      )}
    </div>
  );
}