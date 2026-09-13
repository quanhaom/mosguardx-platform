"use client";

import Link from "next/link";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Cpu,
  Droplets,
  Landmark,
  MapPinned,
  Radio,
  ShieldCheck,
  Thermometer,
} from "lucide-react";

import {
  alerts,
} from "@/data/mock-data";

import {
  useStations,
} from "@/hooks/use-stations";

export default function DashboardPage() {
  const {
    stations,
    source,
  } = useStations();

  const online =
    stations.filter(
      (station) =>
        station.online,
    ).length;

  const total =
    stations.reduce(
      (
        sum,
        station,
      ) =>
        sum +
        station.mosquitoCount,
      0,
    );

  const temperatures =
    stations.flatMap(
      (station) =>
        station.temperature ==
        null
          ? []
          : [
              station.temperature,
            ],
    );

  const humidities =
    stations.flatMap(
      (station) =>
        station.humidity ==
        null
          ? []
          : [
              station.humidity,
            ],
    );

  const averageTemperature =
    temperatures.length
      ? temperatures.reduce(
          (
            sum,
            value,
          ) =>
            sum +
            value,
          0,
        ) /
        temperatures.length
      : null;

  const averageHumidity =
    humidities.length
      ? humidities.reduce(
          (
            sum,
            value,
          ) =>
            sum +
            value,
          0,
        ) /
        humidities.length
      : null;

  const openAlerts =
    alerts.filter(
      (alert) =>
        alert.status ===
        "open",
    ).length;

  return (
    <div className="space-y-6">
      {/* HERO */}

      <section className="overflow-hidden rounded-[30px] bg-[#10251f] p-7 text-white md:p-9">
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <div className="flex items-center gap-2">
              <Landmark
                size={18}
                className="text-emerald-300"
              />

              <p className="text-xs font-bold tracking-[0.18em] text-emerald-300">
                MOSGUARDX COMMAND CENTER
                · B2G
              </p>
            </div>

            <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
              Giám sát mạng lưới và hoạt
              động muỗi theo khu vực
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              Nền tảng B2G dành cho mạng
              lưới giám sát vector, tổng
              hợp dữ liệu trạm, cảnh báo,
              xu hướng và trạng thái triển
              khai theo khu vực.
            </p>

            <p className="mt-3 max-w-3xl text-xs leading-5 text-slate-400">
              Các chỉ số trong phiên bản
              hiện tại phục vụ trình diễn
              MVP và chưa đại diện cho kết
              quả giám sát thực địa.
            </p>
          </div>

          <span
            className={`h-fit rounded-full px-4 py-2 text-xs font-bold ${
              source === "live"
                ? "bg-emerald-300/10 text-emerald-200"
                : "bg-amber-300/10 text-amber-200"
            }`}
          >
            {source === "live"
              ? "DỮ LIỆU TRẠM THẬT"
              : "DỮ LIỆU MINH HỌA"}
          </span>
        </div>
      </section>

      {/* ENVIRONMENT */}

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
          <div className="flex items-center gap-3 text-orange-700">
            <Thermometer
              size={21}
            />

            <span className="text-xs font-bold tracking-wider">
              NHIỆT ĐỘ TRUNG BÌNH
            </span>
          </div>

          <strong className="mt-3 block text-3xl text-[#16352a]">
            {averageTemperature ==
            null
              ? "--"
              : `${averageTemperature.toFixed(
                  1,
                )} °C`}
          </strong>

          <p className="mt-2 text-xs text-slate-500">
            Từ{" "}
            {
              temperatures.length
            }{" "}
            trạm có dữ liệu
          </p>
        </article>

        <article className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex items-center gap-3 text-blue-700">
            <Droplets
              size={21}
            />

            <span className="text-xs font-bold tracking-wider">
              ĐỘ ẨM TRUNG BÌNH
            </span>
          </div>

          <strong className="mt-3 block text-3xl text-[#16352a]">
            {averageHumidity ==
            null
              ? "--"
              : `${averageHumidity.toFixed(
                  1,
                )}%`}
          </strong>

          <p className="mt-2 text-xs text-slate-500">
            Từ{" "}
            {
              humidities.length
            }{" "}
            trạm có dữ liệu
          </p>
        </article>
      </section>

      {/* NETWORK KPI */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Cpu}
          label="Trạm giám sát"
          value={String(
            stations.length,
          )}
          note="Mạng lưới MVP"
        />

        <MetricCard
          icon={Radio}
          label="Đang trực tuyến"
          value={`${online}/${stations.length}`}
          note="Trạng thái kết nối"
        />

        <MetricCard
          icon={Activity}
          label="Lượt ghi nhận"
          value={String(total)}
          note="Tổng dữ liệu hiện có"
        />

        <MetricCard
          icon={
            AlertTriangle
          }
          label="Cảnh báo mở"
          value={String(
            openAlerts,
          )}
          note="Cần theo dõi"
        />
      </section>

      {/* NETWORK */}

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <article className="rounded-[26px] border border-slate-200 bg-white p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold tracking-wider text-emerald-700">
                B2G NETWORK
              </p>

              <h3 className="mt-1 text-xl font-bold text-[#16352a]">
                Tình trạng các trạm
              </h3>
            </div>

            <Link
              href="/map"
              className="text-sm font-bold text-emerald-700"
            >
              Mở bản đồ
            </Link>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs text-slate-400">
                <tr>
                  <th className="pb-3">
                    Trạm
                  </th>

                  <th className="pb-3">
                    Khu vực
                  </th>

                  <th className="pb-3">
                    Ghi nhận
                  </th>

                  <th className="pb-3">
                    Nhiệt độ
                  </th>

                  <th className="pb-3">
                    Độ ẩm
                  </th>

                  <th className="pb-3">
                    Mức hoạt động
                  </th>

                  <th className="pb-3">
                    Kết nối
                  </th>
                </tr>
              </thead>

              <tbody>
                {stations.map(
                  (station) => (
                    <tr
                      key={
                        station.id
                      }
                      className="border-b border-slate-100"
                    >
                      <td className="py-4 font-semibold">
                        {
                          station.id
                        }
                      </td>

                      <td>
                        {
                          station.district
                        }
                      </td>

                      <td>
                        {
                          station.mosquitoCount
                        }
                      </td>

                      <td>
                        {station.temperature ==
                        null
                          ? "--"
                          : `${station.temperature.toFixed(
                              1,
                            )} °C`}
                      </td>

                      <td>
                        {station.humidity ==
                        null
                          ? "--"
                          : `${station.humidity.toFixed(
                              1,
                            )}%`}
                      </td>

                      <td>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            station.risk ===
                            "high"
                              ? "bg-red-50 text-red-700"
                              : station.risk ===
                                  "medium"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {
                            station.risk
                          }
                        </span>
                      </td>

                      <td>
                        {station.online
                          ? "Online"
                          : "Offline"}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </article>

        <aside className="space-y-5">
          <article className="rounded-[26px] border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald-700" />

              <h3 className="font-bold text-[#16352a]">
                Trạng thái MVP
              </h3>
            </div>

            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <StatusRow
                label="Platform"
                value="B2G MVP"
              />

              <StatusRow
                label="AI"
                value="Baseline / API thử nghiệm"
              />

              <StatusRow
                label="Phần cứng"
                value="Prototype"
              />

              <StatusRow
                label="Thực địa"
                value="Chưa xác nhận"
              />
            </div>

            <Link
              href="/#demo"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-700"
            >
              Xem bằng chứng MVP

              <ArrowRight
                size={15}
              />
            </Link>
          </article>

          <article className="rounded-[26px] bg-emerald-700 p-6 text-white">
            <MapPinned />

            <p className="mt-5 text-xs font-bold tracking-[0.14em] text-emerald-200">
              PILOT NETWORK
            </p>

            <h3 className="mt-2 text-lg font-bold">
              Hà Nội là khu vực pilot
            </h3>

            <p className="mt-3 text-sm leading-6 text-emerald-50">
              Các địa phương khác được
              trình bày theo trạng thái kế
              hoạch và không ngụ ý đã triển
              khai thực tế.
            </p>

            <Link
              href="/expansion"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold"
            >
              Xem lộ trình

              <ArrowRight
                size={15}
              />
            </Link>
          </article>
        </aside>
      </section>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: typeof Cpu;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Icon size={20} />
        </span>

        <span className="text-[9px] font-bold tracking-wider text-slate-400">
          B2G
        </span>
      </div>

      <p className="mt-5 text-sm text-slate-500">
        {label}
      </p>

      <strong className="mt-1 block text-3xl text-[#16352a]">
        {value}
      </strong>

      <p className="mt-2 text-xs text-slate-400">
        {note}
      </p>
    </article>
  );
}

function StatusRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-slate-400">
        {label}
      </span>

      <strong className="text-right text-[#16352a]">
        {value}
      </strong>
    </div>
  );
}