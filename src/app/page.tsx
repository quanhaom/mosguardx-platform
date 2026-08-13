"use client";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  ChevronRight,
  Cloud,
  Cpu,
  Gauge,
  LayoutDashboard,
  Map,
  Radio,
  Settings,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wifi,
} from "lucide-react";

import { alerts, hourlyTrend, stations } from "@/data/mock-data";
import type { RiskLevel } from "@/types";

const navigation = [
  { label: "Tổng quan", icon: LayoutDashboard, active: true },
  { label: "Bản đồ dịch tễ", icon: Map },
  { label: "Cảnh báo", icon: Bell, badge: 2 },
  { label: "Thiết bị", icon: Cpu },
  { label: "Báo cáo", icon: BarChart3 },
  { label: "Cấu hình", icon: Settings },
];

const riskStyle: Record<RiskLevel, string> = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  critical: "bg-red-50 text-red-700 border-red-200",
};

const riskLabel: Record<RiskLevel, string> = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
  critical: "Nghiêm trọng",
};

const stationPositions = [
  { left: "31%", top: "27%" },
  { left: "61%", top: "38%" },
  { left: "22%", top: "61%" },
  { left: "68%", top: "68%" },
  { left: "46%", top: "67%" },
];

function StatCard({
  label,
  value,
  note,
  positive,
  icon: Icon,
}: {
  label: string;
  value: string;
  note: string;
  positive?: boolean;
  icon: typeof Activity;
}) {
  return (
    <article className="rounded-2xl border border-[#dce8e2] bg-white p-5 shadow-[0_8px_30px_rgba(15,60,45,0.05)]">
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-bold tracking-[0.14em] text-slate-500">
          {label}
        </span>

        <span className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
          <Icon size={18} />
        </span>
      </div>

      <strong className="mt-4 block text-3xl tracking-tight text-[#16352a]">
        {value}
      </strong>

      <div
        className={`mt-2 flex items-center gap-1 text-xs ${
          positive === false ? "text-red-600" : "text-emerald-700"
        }`}
      >
        {positive === false ? (
          <AlertTriangle size={13} />
        ) : (
          <TrendingUp size={13} />
        )}
        {note}
      </div>
    </article>
  );
}

export default function Home() {
  const totalMosquitoes = stations.reduce(
    (total, station) => total + station.mosquitoCount,
    0,
  );

  const onlineStations = stations.filter((station) => station.online).length;

  const chartPoints = hourlyTrend
    .map((value, index) => {
      const x = (index / (hourlyTrend.length - 1)) * 100;
      const y = 92 - value;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="min-h-screen bg-[#f3f7f5] lg:flex">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[#10251f] text-white lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-[#10251f]">
            <ShieldCheck size={24} />
          </div>

          <div>
            <div className="text-lg font-bold tracking-tight">MosguardX</div>
            <div className="text-[10px] font-semibold tracking-[0.2em] text-emerald-300">
              OPERATIONS
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6">
          {navigation.map(({ label, icon: Icon, active, badge }) => (
            <button
              key={label}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                active
                  ? "bg-emerald-400 text-[#10251f]"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={19} />
              <span className="flex-1 font-medium">{label}</span>

              {badge && (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mx-4 mb-4 rounded-xl border border-emerald-300/15 bg-emerald-300/5 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Hệ thống hoạt động
          </div>

          <p className="mt-1 text-xs text-slate-400">
            Cập nhật dữ liệu 1 phút trước
          </p>
        </div>

        <div className="flex items-center gap-3 border-t border-white/10 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800">
            HQ
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">Hòn Quôn</div>
            <div className="text-xs text-slate-400">Quản trị viên</div>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[#dce8e2] bg-white/90 px-5 backdrop-blur-xl md:px-8">
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] text-emerald-700">
              TRUNG TÂM ĐIỀU HÀNH
            </p>
            <h1 className="text-xl font-bold text-[#16352a]">
              Tổng quan hệ thống
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 sm:flex">
              <Radio size={14} className="animate-pulse" />
              Dữ liệu trực tiếp
            </span>

            <button
              aria-label="Thông báo"
              className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] space-y-6 p-5 md:p-8">
          <section className="relative overflow-hidden rounded-3xl bg-[#173d31] p-7 text-white shadow-xl md:p-10">
            <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full border-[55px] border-emerald-300/10" />
            <div className="absolute bottom-[-100px] right-[25%] h-64 w-64 rounded-full bg-emerald-300/5" />

            <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-300">
                  TỔNG QUAN DỊCH TỄ · HÀ NỘI
                </span>

                <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">
                  Giám sát chủ động.
                  <br />
                  <span className="text-emerald-300">Cảnh báo sớm.</span>
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
                  Hệ thống hiện sử dụng dữ liệu mô phỏng để thiết kế, trình diễn
                  và kiểm thử trước khi kết nối các trạm MosguardX thực tế.
                </p>
              </div>

              <div className="min-w-52 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-[10px] font-bold tracking-[0.16em] text-slate-300">
                  CHỈ SỐ NGUY CƠ
                </p>

                <div className="mt-2">
                  <strong className="text-5xl">68</strong>
                  <span className="text-slate-400"> / 100</span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-orange-300">
                  <AlertTriangle size={14} />
                  Mức cảnh báo cao
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="MUỖI GHI NHẬN / 24H"
              value={totalMosquitoes.toLocaleString("vi-VN")}
              note="Tăng 18,4% so với hôm qua"
              icon={Activity}
            />

            <StatCard
              label="TRẠM HOẠT ĐỘNG"
              value={`${onlineStations} / ${stations.length}`}
              note={`${Math.round(
                (onlineStations / stations.length) * 100,
              )}% đang trực tuyến`}
              icon={Wifi}
            />

            <StatCard
              label="CẢNH BÁO ĐANG MỞ"
              value="2"
              note="Có 1 cảnh báo nghiêm trọng"
              positive={false}
              icon={Bell}
            />

            <StatCard
              label="THỜI GIAN PHẢN HỒI"
              value="4m 32s"
              note="Nhanh hơn mục tiêu 12%"
              icon={Gauge}
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
            <article className="overflow-hidden rounded-2xl border border-[#dce8e2] bg-white shadow-[0_8px_30px_rgba(15,60,45,0.05)]">
              <div className="flex items-center justify-between border-b border-[#e5eee9] p-5 md:p-6">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.16em] text-emerald-700">
                    PHÂN BỐ KHÔNG GIAN
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-[#16352a]">
                    Bản đồ mật độ muỗi
                  </h3>
                </div>

                <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600">
                  24 giờ
                </button>
              </div>

              <div className="map-grid relative h-[420px] overflow-hidden">
                <div className="absolute left-[10%] top-[15%] h-[2px] w-[80%] rotate-12 bg-white/80" />
                <div className="absolute left-[5%] top-[58%] h-[3px] w-[92%] -rotate-6 bg-white/90" />
                <div className="absolute left-[38%] top-[-5%] h-[115%] w-[3px] rotate-12 bg-white/80" />

                {stations.slice(0, 5).map((station, index) => {
                  const color =
                    station.risk === "high"
                      ? "text-red-500"
                      : station.risk === "medium"
                        ? "text-amber-500"
                        : "text-emerald-500";

                  return (
                    <div
                      key={station.id}
                      className={`heat-point absolute z-10 ${color}`}
                      style={stationPositions[index]}
                    >
                      <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-current shadow-lg">
                        <span className="text-xs font-bold text-white">
                          {station.mosquitoCount}
                        </span>
                      </span>

                      <span className="absolute left-1/2 top-12 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#173d31] px-2 py-1 text-[10px] font-semibold text-white shadow">
                        {station.district}
                      </span>
                    </div>
                  );
                })}

                <div className="absolute bottom-4 left-4 flex gap-3 rounded-xl bg-white/90 p-3 text-[10px] font-semibold text-slate-600 shadow-lg backdrop-blur">
                  <span className="flex items-center gap-1">
                    <i className="h-2 w-2 rounded-full bg-emerald-500" />
                    Thấp
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="h-2 w-2 rounded-full bg-amber-500" />
                    Trung bình
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="h-2 w-2 rounded-full bg-red-500" />
                    Cao
                  </span>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-[#dce8e2] bg-white shadow-[0_8px_30px_rgba(15,60,45,0.05)]">
              <div className="flex items-center justify-between border-b border-[#e5eee9] p-5 md:p-6">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.16em] text-red-600">
                    CẦN XỬ LÝ
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-[#16352a]">
                    Cảnh báo mới nhất
                  </h3>
                </div>

                <button className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                  Xem tất cả
                  <ChevronRight size={15} />
                </button>
              </div>

              <div className="divide-y divide-[#e5eee9]">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex gap-3 p-5">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${riskStyle[alert.level]}`}
                    >
                      <Bell size={17} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-[#16352a]">
                        {alert.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-500">
                        {alert.station} · {alert.location}
                      </p>
                      <p className="mt-2 text-[10px] text-slate-400">
                        {alert.createdAt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="m-5 rounded-2xl bg-[#173d31] p-5 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="text-emerald-300" size={22} />
                    <div>
                      <p className="text-sm font-bold">Early Warning Index</p>
                      <p className="text-[10px] text-slate-400">
                        Tổng hợp mật độ, xu hướng và thời tiết
                      </p>
                    </div>
                  </div>

                  <strong className="text-2xl">
                    68
                    <span className="text-xs font-normal text-slate-400">
                      /100
                    </span>
                  </strong>
                </div>
              </div>
            </article>
          </section>

          <section className="rounded-2xl border border-[#dce8e2] bg-white shadow-[0_8px_30px_rgba(15,60,45,0.05)]">
            <div className="flex flex-col justify-between gap-4 border-b border-[#e5eee9] p-5 md:flex-row md:items-center md:p-6">
              <div>
                <p className="text-[10px] font-bold tracking-[0.16em] text-emerald-700">
                  MẠNG LƯỚI THIẾT BỊ
                </p>
                <h3 className="mt-1 text-lg font-bold text-[#16352a]">
                  Tình trạng trạm giám sát
                </h3>
              </div>

              <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600">
                <Cpu size={16} />
                Quản lý thiết bị
              </button>
            </div>

            <div className="mgx-scrollbar overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="bg-[#f7faf8] text-[10px] tracking-[0.12em] text-slate-500">
                    <th className="px-6 py-4">TRẠM</th>
                    <th className="px-6 py-4">KHU VỰC</th>
                    <th className="px-6 py-4">MẬT ĐỘ / 24H</th>
                    <th className="px-6 py-4">NGUY CƠ</th>
                    <th className="px-6 py-4">TRẠNG THÁI</th>
                    <th className="px-6 py-4">PIN</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#e5eee9]">
                  {stations.map((station) => (
                    <tr key={station.id} className="text-sm hover:bg-[#f8fbf9]">
                      <td className="px-6 py-4 font-bold text-[#16352a]">
                        {station.id}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {station.district}, Hà Nội
                      </td>
                      <td className="px-6 py-4">
                        <strong>{station.mosquitoCount}</strong>
                        <span className="ml-1 text-xs text-slate-400">
                          cá thể
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${riskStyle[station.risk]}`}
                        >
                          {riskLabel[station.risk]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`flex items-center gap-2 text-xs font-semibold ${
                            station.online
                              ? "text-emerald-700"
                              : "text-slate-400"
                          }`}
                        >
                          <i
                            className={`h-2 w-2 rounded-full ${
                              station.online ? "bg-emerald-500" : "bg-slate-300"
                            }`}
                          />
                          {station.online ? "Trực tuyến" : "Mất kết nối"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                        {station.battery}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-[#dce8e2] bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.16em] text-emerald-700">
                    BIẾN ĐỘNG 24 GIỜ
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-[#16352a]">
                    Xu hướng mật độ
                  </h3>
                </div>

                <TrendingUp className="text-emerald-600" />
              </div>

              <svg
                className="mt-6 h-40 w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <path
                  d={`M 0,100 L ${chartPoints} L 100,100 Z`}
                  fill="url(#chartFill)"
                />

                <polyline
                  points={chartPoints}
                  fill="none"
                  stroke="#0f9f74"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </article>

            <article className="rounded-2xl border border-[#dce8e2] bg-white p-6">
              <p className="text-[10px] font-bold tracking-[0.16em] text-emerald-700">
                TRẠNG THÁI DỮ LIỆU
              </p>
              <h3 className="mt-1 text-lg font-bold text-[#16352a]">
                Hạ tầng mô phỏng
              </h3>

              <div className="mt-6 space-y-4">
                {[
                  ["Giao diện vận hành", "Sẵn sàng", ShieldCheck],
                  ["Dữ liệu thiết bị", "Mô phỏng", Cpu],
                  ["Đồng bộ cloud", "Chưa cấu hình", Cloud],
                  ["Mô hình nhận diện AI", "Chờ huấn luyện", Activity],
                ].map(([name, status, Icon]) => {
                  const StatusIcon = Icon as typeof Activity;

                  return (
                    <div
                      key={name as string}
                      className="flex items-center gap-3 rounded-xl bg-[#f7faf8] p-4"
                    >
                      <StatusIcon size={19} className="text-emerald-700" />
                      <span className="flex-1 text-sm font-semibold text-slate-700">
                        {name as string}
                      </span>
                      <span className="text-xs text-slate-500">
                        {status as string}
                      </span>
                    </div>
                  );
                })}
              </div>
            </article>
          </section>

          <footer className="flex flex-col justify-between gap-2 border-t border-[#dce8e2] py-5 text-xs text-slate-500 sm:flex-row">
            <span>MosguardX Operations · Môi trường mô phỏng</span>

            <span className="flex items-center gap-2">
              <Cloud size={14} />
              Chưa kết nối cơ sở dữ liệu thật
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
