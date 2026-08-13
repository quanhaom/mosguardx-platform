import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Bell,
  Cpu,
  ExternalLink,
  Wifi,
} from "lucide-react";
import { alerts, stations } from "@/data/mock-data";

export default function Home() {
  const total = stations.reduce(
    (sum, station) => sum + station.mosquitoCount,
    0,
  );
  const online = stations.filter((station) => station.online).length;

  const cards = [
    {
      label: "MUỖI GHI NHẬN / 24H",
      value: total.toString(),
      note: "Tăng 18,4% so với hôm qua",
      icon: Activity,
    },
    {
      label: "TRẠM HOẠT ĐỘNG",
      value: `${online} / ${stations.length}`,
      note: "Mạng lưới đang hoạt động",
      icon: Wifi,
    },
    {
      label: "CẢNH BÁO ĐANG MỞ",
      value: alerts.filter((alert) => alert.status === "open").length.toString(),
      note: "Cần được xác nhận xử lý",
      icon: Bell,
    },
    {
      label: "CHỈ SỐ NGUY CƠ",
      value: "68 / 100",
      note: "Mức cảnh báo cao",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-[#173d31] p-8 text-white shadow-xl md:p-10">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[50px] border-emerald-300/10" />

        <div className="relative">
          <p className="text-[10px] font-bold tracking-[0.2em] text-emerald-300">
            TỔNG QUAN DỊCH TỄ · HÀ NỘI
          </p>

          <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">
            Giám sát chủ động.
            <br />
            <span className="text-emerald-300">Cảnh báo sớm.</span>
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
            Dashboard đang sử dụng dữ liệu mô phỏng trước khi kết nối trạm
            MosguardX và cơ sở dữ liệu sản xuất.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/map"
              className="flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-[#10251f]"
            >
              Xem bản đồ
              <ExternalLink size={16} />
            </Link>

            <Link
              href="/alerts"
              className="rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold"
            >
              Kiểm tra cảnh báo
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, note, icon: Icon }) => (
          <article
            key={label}
            className="rounded-2xl border border-[#dce8e2] bg-white p-5 shadow-sm"
          >
            <div className="flex justify-between">
              <span className="text-[10px] font-bold tracking-[0.14em] text-slate-500">
                {label}
              </span>
              <span className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
                <Icon size={18} />
              </span>
            </div>

            <strong className="mt-4 block text-3xl text-[#16352a]">
              {value}
            </strong>
            <p className="mt-2 text-xs text-slate-500">{note}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <article className="rounded-2xl border border-[#dce8e2] bg-white p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.16em] text-emerald-700">
                MẠNG LƯỚI
              </p>
              <h3 className="mt-1 text-lg font-bold text-[#16352a]">
                Trạm giám sát gần đây
              </h3>
            </div>

            <Link
              href="/devices"
              className="text-xs font-bold text-emerald-700"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="mt-5 divide-y divide-slate-100">
            {stations.slice(0, 4).map((station) => (
              <div
                key={station.id}
                className="flex items-center gap-4 py-4"
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    station.online ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                />

                <div className="flex-1">
                  <p className="text-sm font-bold text-[#16352a]">
                    {station.id}
                  </p>
                  <p className="text-xs text-slate-500">{station.district}</p>
                </div>

                <strong className="text-sm">
                  {station.mosquitoCount} cá thể
                </strong>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-[#dce8e2] bg-white p-6">
          <div className="flex items-center gap-3">
            <Cpu className="text-emerald-700" />
            <div>
              <h3 className="font-bold text-[#16352a]">
                Môi trường mô phỏng
              </h3>
              <p className="text-xs text-slate-500">
                Chưa kết nối thiết bị thật
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {[
              ["Giao diện vận hành", "Sẵn sàng"],
              ["Điều hướng chức năng", "Sẵn sàng"],
              ["Dữ liệu thiết bị", "Mô phỏng"],
              ["Supabase", "Chưa kết nối"],
              ["Mô hình AI", "Chờ huấn luyện"],
            ].map(([name, status]) => (
              <div
                key={name}
                className="flex justify-between rounded-xl bg-[#f5f9f7] p-4 text-sm"
              >
                <span className="font-medium">{name}</span>
                <span className="text-slate-500">{status}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
