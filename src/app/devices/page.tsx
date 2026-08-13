"use client";

import { useState } from "react";
import { Cpu, Search } from "lucide-react";
import PageIntro from "@/components/ui/page-intro";
import { stations } from "@/data/mock-data";

export default function DevicesPage() {
  const [query, setQuery] = useState("");

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
            </div>

            <button className="mt-5 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600">
              Xem chi tiết
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
