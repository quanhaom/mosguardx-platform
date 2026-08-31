"use client";

import { useState } from "react";
import { Download, FileBarChart } from "lucide-react";
import PageIntro from "@/components/ui/page-intro";
import { useStations } from "@/hooks/use-stations";

export default function ReportsPage() {
  const [message, setMessage] = useState("");
  const { stations } = useStations();

  function exportCsv() {
    const header = "station,district,count,temperature_c,humidity_percent,risk,online,sensor_updated_at";
    const rows = stations.map((station) =>
      [
        station.id,
        station.district,
        station.mosquitoCount,
        station.temperature ?? "",
        station.humidity ?? "",
        station.risk,
        station.online,
        station.environmentUpdatedAt ?? "",
      ].join(","),
    );

    const blob = new Blob([[header, ...rows].join("\n")], {
      type: "text/csv;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "mosguardx-report.csv";
    anchor.click();
    URL.revokeObjectURL(url);

    setMessage("Đã xuất báo cáo CSV thành công.");
  }

  return (
    <div>
      <PageIntro
        eyebrow="BÁO CÁO VẬN HÀNH"
        title="Báo cáo và phân tích"
        description="Tổng hợp dữ liệu mạng lưới phục vụ báo cáo và thảo luận với nhóm."
      />

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-2xl border border-[#dce8e2] bg-white p-6">
          <FileBarChart className="text-emerald-700" />
          <h3 className="mt-4 font-bold">Báo cáo mật độ trạm</h3>
          <p className="mt-2 text-sm text-slate-500">
            Dữ liệu mật độ, khu vực, nguy cơ và trạng thái thiết bị.
          </p>
          <button
            onClick={exportCsv}
            className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white"
          >
            <Download size={17} />
            Xuất CSV
          </button>
        </article>
      </section>

      {message && (
        <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          {message}
        </div>
      )}
    </div>
  );
}
