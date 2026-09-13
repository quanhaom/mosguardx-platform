import {
  Activity,
  BarChart3,
  Building2,
  CheckCircle2,
  Cpu,
  FileBarChart,
  TrendingUp,
} from "lucide-react";

import {
  enterpriseAlerts,
  enterpriseDevices,
  enterpriseSites,
} from "@/lib/enterprise/mock-data";

const weeklyActivity = [
  { day: "T2", value: 38 },
  { day: "T3", value: 44 },
  { day: "T4", value: 51 },
  { day: "T5", value: 46 },
  { day: "T6", value: 59 },
  { day: "T7", value: 72 },
  { day: "CN", value: 64 },
];

export default function EnterpriseReportsPage() {
  const totalDevices =
    enterpriseDevices.length;

  const onlineDevices =
    enterpriseDevices.filter(
      (device) =>
        device.status === "Online",
    ).length;

  const fleetAvailability =
    Math.round(
      (onlineDevices /
        totalDevices) *
        100,
    );

  const activeAlerts =
    enterpriseAlerts.filter(
      (alert) =>
        alert.status !== "Resolved",
    ).length;

  return (
    <div className="space-y-6">
      {/* HERO */}

      <section className="rounded-[30px] bg-[#16352a] p-7 text-white md:p-9">
        <p className="text-[10px] font-bold tracking-[0.18em] text-emerald-300">
          ENTERPRISE · REPORTS
        </p>

        <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          Operations & Insights
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          Tổng hợp hiệu quả vận hành,
          trạng thái thiết bị và xu
          hướng hoạt động tại các site
          Enterprise.
        </p>
      </section>

      {/* KPI */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ReportMetric
          icon={Building2}
          label="Sites"
          value={`${enterpriseSites.length}`}
          note="Managed locations"
        />

        <ReportMetric
          icon={Cpu}
          label="Fleet availability"
          value={`${fleetAvailability}%`}
          note={`${onlineDevices}/${totalDevices} online`}
        />

        <ReportMetric
          icon={Activity}
          label="Active alerts"
          value={`${activeAlerts}`}
          note="Require review"
        />

        <ReportMetric
          icon={TrendingUp}
          label="Network trend"
          value="+12%"
          note="Preview period"
        />
      </section>

      {/* MAIN */}

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        {/* TREND */}

        <article className="rounded-[28px] border border-slate-200 bg-white p-6 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] text-emerald-700">
                ACTIVITY TREND
              </p>

              <h3 className="mt-1 text-xl font-bold text-[#16352a]">
                Network activity
              </h3>

              <p className="mt-2 text-xs text-slate-400">
                Illustrative 7-day
                activity index.
              </p>
            </div>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <BarChart3 size={19} />
            </span>
          </div>

          <div className="mt-10 flex h-64 items-end gap-3 sm:gap-5">
            {weeklyActivity.map(
              (item) => (
                <div
                  key={item.day}
                  className="flex h-full flex-1 flex-col justify-end"
                >
                  <div className="flex flex-1 items-end">
                    <div
                      className="w-full rounded-t-xl bg-emerald-500/80 transition hover:bg-emerald-500"
                      style={{
                        height: `${item.value}%`,
                      }}
                    />
                  </div>

                  <div className="mt-3 text-center">
                    <p className="text-[10px] font-bold text-slate-500">
                      {item.day}
                    </p>

                    <p className="mt-1 text-[9px] text-slate-400">
                      {item.value}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </article>

        {/* SUMMARY */}

        <article className="rounded-[28px] bg-[#10251f] p-6 text-white md:p-7">
          <FileBarChart
            size={24}
            className="text-emerald-300"
          />

          <p className="mt-6 text-[10px] font-bold tracking-[0.15em] text-emerald-300">
            EXECUTIVE SUMMARY
          </p>

          <h3 className="mt-2 text-xl font-bold">
            Enterprise health
          </h3>

          <div className="mt-7 space-y-3">
            <SummaryRow
              label="Sites monitored"
              value={`${enterpriseSites.length}`}
            />

            <SummaryRow
              label="Devices deployed"
              value={`${totalDevices}`}
            />

            <SummaryRow
              label="Devices online"
              value={`${onlineDevices}`}
            />

            <SummaryRow
              label="Open alerts"
              value={`${activeAlerts}`}
            />
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.06] p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={16}
                className="text-emerald-300"
              />

              <strong className="text-xs">
                Overall network stable
              </strong>
            </div>

            <p className="mt-2 text-[11px] leading-5 text-slate-400">
              Đây là nhận định minh họa
              dựa trên bộ dữ liệu preview.
            </p>
          </div>
        </article>
      </section>

      {/* SITE REPORT */}

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-6 py-5">
          <p className="text-[10px] font-bold tracking-[0.15em] text-emerald-700">
            SITE PERFORMANCE
          </p>

          <h3 className="mt-1 text-xl font-bold text-[#16352a]">
            Location comparison
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-6 py-4">
                  Site
                </th>

                <th className="px-6 py-4">
                  Devices
                </th>

                <th className="px-6 py-4">
                  Online
                </th>

                <th className="px-6 py-4">
                  Activity
                </th>

                <th className="px-6 py-4">
                  Risk
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {enterpriseSites.map(
                (site) => (
                  <tr
                    key={site.id}
                    className="hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-5">
                      <strong className="text-sm text-[#16352a]">
                        {site.name}
                      </strong>

                      <p className="mt-1 text-[10px] text-slate-400">
                        {site.location}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {site.devices}
                    </td>

                    <td className="px-6 py-5 text-sm font-semibold text-emerald-700">
                      {site.onlineDevices}
                    </td>

                    <td className="px-6 py-5">
                      <div className="w-36">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400">
                            Index
                          </span>

                          <strong>
                            {site.activityIndex}%
                          </strong>
                        </div>

                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{
                              width: `${site.activityIndex}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          site.risk ===
                          "High"
                            ? "bg-red-50 text-red-700"
                            : site.risk ===
                                "Medium"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {site.risk}
                      </span>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-center text-[10px] text-slate-400">
        Report values currently use
        illustrative Enterprise preview
        data.
      </p>
    </div>
  );
}

function ReportMetric({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <article className="rounded-[22px] border border-slate-200 bg-white p-5">
      <Icon
        size={19}
        className="text-emerald-700"
      />

      <p className="mt-4 text-xs font-semibold text-slate-500">
        {label}
      </p>

      <strong className="mt-1 block text-3xl font-black text-[#16352a]">
        {value}
      </strong>

      <p className="mt-2 text-[10px] text-slate-400">
        {note}
      </p>
    </article>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3">
      <span className="text-xs text-slate-400">
        {label}
      </span>

      <strong className="text-sm">
        {value}
      </strong>
    </div>
  );
}