"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Cpu,
  MapPinned,
  Radio,
  ShieldCheck,
} from "lucide-react";

import {
  alerts,
  stations,
} from "@/data/mock-data";

import {
  useLanguage,
} from "@/components/i18n/language-context";

import type {
  RiskLevel,
} from "@/types";

export default function DashboardPage() {
  const { tr } = useLanguage();

  const online =
    stations.filter(
      (station) => station.online,
    ).length;

  const total =
    stations.reduce(
      (sum, station) =>
        sum + station.mosquitoCount,
      0,
    );

  const openAlerts =
    alerts.filter(
      (alert) =>
        alert.status === "open",
    ).length;

  const riskLabels: Record<
    RiskLevel,
    string
  > = {
    critical: tr(
      "Rất cao",
      "Critical",
    ),

    high: tr(
      "Cao",
      "High",
    ),

    medium: tr(
      "Trung bình",
      "Medium",
    ),

    low: tr(
      "Thấp",
      "Low",
    ),
  };

  const riskStyles: Record<
    RiskLevel,
    string
  > = {
    critical:
      "bg-red-100 text-red-800",

    high:
      "bg-orange-50 text-orange-700",

    medium:
      "bg-amber-50 text-amber-700",

    low:
      "bg-emerald-50 text-emerald-700",
  };

  const cards = [
    {
      icon: Cpu,

      label: tr(
        "Trạm mẫu",
        "Sample stations",
      ),

      value: String(
        stations.length,
      ),

      note: tr(
        "Mạng lưới MVP",
        "MVP network",
      ),
    },
    {
      icon: Radio,

      label: tr(
        "Đang trực tuyến",
        "Online",
      ),

      value: `${online}/${stations.length}`,

      note: tr(
        "Trạng thái minh họa",
        "Illustrative status",
      ),
    },
    {
      icon: Activity,

      label: tr(
        "Lượt ghi nhận",
        "Detection records",
      ),

      value: String(total),

      note: tr(
        "Tổng dữ liệu mẫu",
        "Total sample data",
      ),
    },
    {
      icon: AlertTriangle,

      label: tr(
        "Cảnh báo mở",
        "Open alerts",
      ),

      value: String(openAlerts),

      note: tr(
        "Cần xác minh thực địa",
        "Field verification required",
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="rounded-3xl bg-[#10251f] p-7 text-white md:p-9">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-emerald-300">
              {tr(
                "TRUNG TÂM ĐIỀU HÀNH · HÀ NỘI",
                "OPERATIONS CENTRE · HANOI",
              )}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {tr(
                "Bức tranh nguy cơ theo khu vực",
                "Area-based risk overview",
              )}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              {tr(
                "Giao diện MVP phục vụ trình diễn luồng dữ liệu. Các chỉ số dưới đây là dữ liệu minh họa, chưa phải kết quả giám sát thực địa.",
                "This MVP interface demonstrates the data flow. The metrics below are illustrative and are not field-surveillance results.",
              )}
            </p>
          </div>

          <span className="h-fit rounded-full bg-amber-300/10 px-4 py-2 text-xs font-bold text-amber-200">
            {tr(
              "DỮ LIỆU MINH HỌA",
              "ILLUSTRATIVE DATA",
            )}
          </span>
        </div>
      </section>

      {/* Summary cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(
          ({
            icon: Icon,
            label,
            value,
            note,
          }) => (
            <article
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon size={20} />
                </span>

                <span className="text-[9px] font-bold tracking-wider text-slate-400">
                  {tr(
                    "MINH HỌA",
                    "SAMPLE",
                  )}
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
          ),
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        {/* Station table */}
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-wider text-emerald-700">
                {tr(
                  "MẠNG LƯỚI MẪU",
                  "SAMPLE NETWORK",
                )}
              </p>

              <h3 className="mt-1 text-xl font-bold text-[#16352a]">
                {tr(
                  "Tình trạng các trạm Hà Nội",
                  "Hanoi station status",
                )}
              </h3>
            </div>

            <Link
              href="/map"
              className="shrink-0 text-sm font-bold text-emerald-700"
            >
              {tr(
                "Mở bản đồ",
                "Open map",
              )}
            </Link>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs text-slate-400">
                <tr>
                  <th className="pb-3">
                    {tr(
                      "Trạm",
                      "Station",
                    )}
                  </th>

                  <th className="pb-3">
                    {tr(
                      "Khu vực",
                      "Area",
                    )}
                  </th>

                  <th className="pb-3">
                    {tr(
                      "Ghi nhận",
                      "Records",
                    )}
                  </th>

                  <th className="pb-3">
                    {tr(
                      "Mức nguy cơ",
                      "Risk level",
                    )}
                  </th>

                  <th className="pb-3">
                    {tr(
                      "Kết nối",
                      "Connection",
                    )}
                  </th>
                </tr>
              </thead>

              <tbody>
                {stations.map(
                  (station) => (
                    <tr
                      key={station.id}
                      className="border-b border-slate-100"
                    >
                      <td className="py-4 font-semibold">
                        {station.id}
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
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${riskStyles[station.risk]}`}
                        >
                          {
                            riskLabels[
                              station.risk
                            ]
                          }
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            station.online
                              ? "text-emerald-700"
                              : "text-red-600"
                          }
                        >
                          {station.online
                            ? tr(
                                "Trực tuyến",
                                "Online",
                              )
                            : tr(
                                "Mất kết nối",
                                "Offline",
                              )}
                        </span>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </article>

        {/* Side panels */}
        <aside className="space-y-5">
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald-700" />

              <h3 className="font-bold text-[#16352a]">
                {tr(
                  "Trạng thái triển khai",
                  "Implementation status",
                )}
              </h3>
            </div>

            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <strong>
                  {tr(
                    "Web:",
                    "Web:",
                  )}
                </strong>{" "}

                {tr(
                  "đã hoàn thành luồng MVP",
                  "MVP flow completed",
                )}
              </li>

              <li>
                <strong>AI:</strong>{" "}

                {tr(
                  "baseline/API thử nghiệm",
                  "baseline and test API",
                )}
              </li>

              <li>
                <strong>
                  {tr(
                    "Phần cứng:",
                    "Hardware:",
                  )}
                </strong>{" "}

                {tr(
                  "chờ lắp prototype",
                  "awaiting prototype assembly",
                )}
              </li>

              <li>
                <strong>
                  {tr(
                    "Thực địa:",
                    "Field trial:",
                  )}
                </strong>{" "}

                {tr(
                  "chưa thu thập",
                  "not yet collected",
                )}
              </li>
            </ul>

            <Link
              href="/#demo"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-700"
            >
              {tr(
                "Xem bằng chứng MVP",
                "View MVP evidence",
              )}

              <ArrowRight size={15} />
            </Link>
          </article>

          <article className="rounded-2xl bg-emerald-700 p-6 text-white">
            <MapPinned />

            <h3 className="mt-4 text-lg font-bold">
              {tr(
                "Hà Nội là điểm pilot",
                "Hanoi is the pilot location",
              )}
            </h3>

            <p className="mt-2 text-sm leading-6 text-emerald-50">
              {tr(
                "Các địa phương khác được trình bày theo trạng thái “Coming soon”, không ngụ ý đã triển khai.",
                "Other locations are marked “Coming soon” and do not imply completed deployment.",
              )}
            </p>

            <Link
              href="/expansion"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold"
            >
              {tr(
                "Xem lộ trình",
                "View roadmap",
              )}

              <ArrowRight size={15} />
            </Link>
          </article>
        </aside>
      </section>
    </div>
  );
}