"use client";

import { useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import PageIntro from "@/components/ui/page-intro";
import { alerts as initialAlerts } from "@/data/mock-data";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState("all");

  const visibleAlerts = alerts.filter(
    (alert) => filter === "all" || alert.status === filter,
  );

  function resolveAlert(id: string) {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === id ? { ...alert, status: "resolved" } : alert,
      ),
    );
  }

  return (
    <div>
      <PageIntro
        eyebrow="TRUNG TÂM CẢNH BÁO"
        title="Quản lý và xử lý cảnh báo"
        description="Xác nhận, theo dõi và đóng các cảnh báo phát sinh từ mạng lưới giám sát."
      />

      <div className="mb-5 flex gap-2">
        {[
          ["all", "Tất cả"],
          ["open", "Đang mở"],
          ["resolved", "Đã xử lý"],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`rounded-xl px-4 py-2 text-xs font-bold ${
              filter === value
                ? "bg-emerald-600 text-white"
                : "border border-slate-200 bg-white text-slate-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <section className="space-y-4">
        {visibleAlerts.map((alert) => (
          <article
            key={alert.id}
            className="flex flex-col gap-4 rounded-2xl border border-[#dce8e2] bg-white p-5 md:flex-row md:items-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              {alert.status === "resolved" ? (
                <CheckCircle2 />
              ) : (
                <Bell />
              )}
            </span>

            <div className="flex-1">
              <p className="text-xs font-bold text-emerald-700">{alert.id}</p>
              <h3 className="mt-1 font-bold text-[#16352a]">{alert.title}</h3>
              <p className="mt-1 text-sm text-slate-500">
                {alert.station} · {alert.location} · {alert.createdAt}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                alert.status === "resolved"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {alert.status === "resolved" ? "Đã xử lý" : "Đang mở"}
            </span>

            {alert.status !== "resolved" && (
              <button
                onClick={() => resolveAlert(alert.id)}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white"
              >
                Đánh dấu đã xử lý
              </button>
            )}
          </article>
        ))}

        {visibleAlerts.length === 0 && (
          <div className="rounded-2xl border border-[#dce8e2] bg-white p-12 text-center text-sm text-slate-500">
            Không có cảnh báo phù hợp.
          </div>
        )}
      </section>
    </div>
  );
}
