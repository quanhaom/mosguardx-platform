import Link from "next/link";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Cpu,
  MapPin,
  UserRound,
} from "lucide-react";

import {
  enterpriseAlerts,
  enterpriseSites,
} from "@/lib/enterprise/mock-data";

const riskClass = {
  Low: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Medium: "bg-amber-50 text-amber-700 border-amber-100",
  High: "bg-red-50 text-red-700 border-red-100",
};

export default function EnterpriseSitesPage() {
  const totalDevices =
    enterpriseSites.reduce(
      (sum, site) =>
        sum + site.devices,
      0,
    );

  const onlineDevices =
    enterpriseSites.reduce(
      (sum, site) =>
        sum + site.onlineDevices,
      0,
    );

  const attentionSites =
    enterpriseSites.filter(
      (site) =>
        site.risk !== "Low",
    ).length;

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <section className="rounded-[30px] bg-[#16352a] p-7 text-white md:p-9">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] text-emerald-300">
              ENTERPRISE · SITES
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Managed locations
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Theo dõi từng cơ sở,
              thiết bị được phân bổ,
              hoạt động muỗi và mức
              độ cần chú ý.
            </p>
          </div>

          <span className="inline-flex h-fit rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[10px] font-bold text-slate-300">
            PREVIEW DATA
          </span>
        </div>
      </section>

      {/* KPIs */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={Building2}
          label="Sites"
          value={String(
            enterpriseSites.length,
          ).padStart(2, "0")}
          note="Managed locations"
        />

        <Metric
          icon={Cpu}
          label="Devices"
          value={String(
            totalDevices,
          ).padStart(2, "0")}
          note="Across all sites"
        />

        <Metric
          icon={CheckCircle2}
          label="Online"
          value={`${onlineDevices}/${totalDevices}`}
          note="Active devices"
        />

        <Metric
          icon={AlertTriangle}
          label="Need attention"
          value={String(
            attentionSites,
          ).padStart(2, "0")}
          note="Medium or high risk"
          attention
        />
      </section>

      {/* SITE LIST */}

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-6 py-5">
          <p className="text-[10px] font-bold tracking-[0.15em] text-emerald-700">
            SITE DIRECTORY
          </p>

          <h3 className="mt-1 text-xl font-bold text-[#16352a]">
            Enterprise sites
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {enterpriseSites.map(
            (site) => {
              const alerts =
                enterpriseAlerts.filter(
                  (alert) =>
                    alert.site ===
                      site.name &&
                    alert.status !==
                      "Resolved",
                ).length;

              const availability =
                Math.round(
                  (site.onlineDevices /
                    site.devices) *
                    100,
                );

              return (
                <article
                  key={site.id}
                  className="p-6 transition hover:bg-slate-50/70"
                >
                  <div className="grid gap-6 xl:grid-cols-[1.3fr_0.8fr_0.8fr_1fr_0.5fr] xl:items-center">
                    {/* SITE */}

                    <div>
                      <div className="flex items-start gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                          <Building2
                            size={20}
                          />
                        </span>

                        <div>
                          <h4 className="font-bold text-[#16352a]">
                            {
                              site.name
                            }
                          </h4>

                          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                            <MapPin
                              size={13}
                            />

                            {
                              site.location
                            }
                          </div>

                          <p className="mt-2 text-[10px] font-semibold text-slate-400">
                            {site.id}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* MANAGER */}

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Manager
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#16352a]">
                        <UserRound
                          size={15}
                          className="text-emerald-700"
                        />

                        {
                          site.manager
                        }
                      </div>
                    </div>

                    {/* DEVICES */}

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Devices
                      </p>

                      <strong className="mt-2 block text-sm text-[#16352a]">
                        {
                          site.onlineDevices
                        }
                        /
                        {
                          site.devices
                        }{" "}
                        online
                      </strong>

                      <p className="mt-1 text-[10px] text-slate-400">
                        {
                          availability
                        }
                        % available
                      </p>
                    </div>

                    {/* ACTIVITY */}

                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Activity
                        </p>

                        <strong className="text-xs text-[#16352a]">
                          {
                            site.activityIndex
                          }
                          %
                        </strong>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${
                            site.risk ===
                            "High"
                              ? "bg-red-500"
                              : site.risk ===
                                  "Medium"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                          }`}
                          style={{
                            width: `${site.activityIndex}%`,
                          }}
                        />
                      </div>

                      <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-400">
                        <Activity
                          size={12}
                        />

                        {
                          alerts
                        }{" "}
                        active alerts
                      </div>
                    </div>

                    {/* RISK */}

                    <div className="xl:text-right">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold ${
                          riskClass[
                            site.risk
                          ]
                        }`}
                      >
                        {
                          site.risk
                        }
                      </span>
                    </div>
                  </div>
                </article>
              );
            },
          )}
        </div>
      </section>

      {/* FOOTER ACTION */}

      <section className="flex flex-col justify-between gap-5 rounded-[26px] border border-emerald-100 bg-emerald-50/70 p-6 md:flex-row md:items-center">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-emerald-700">
            DEVICE ALLOCATION
          </p>

          <h3 className="mt-2 font-bold text-[#16352a]">
            Xem toàn bộ thiết bị
            trong các site
          </h3>
        </div>

        <Link
          href="/enterprise/app/devices"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16352a] px-5 py-3 text-sm font-bold text-white"
        >
          Device Fleet

          <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  note,
  attention = false,
}: {
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  label: string;
  value: string;
  note: string;
  attention?: boolean;
}) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          attention
            ? "bg-amber-50 text-amber-700"
            : "bg-emerald-50 text-emerald-700"
        }`}
      >
        <Icon size={19} />
      </span>

      <p className="mt-5 text-xs font-semibold text-slate-500">
        {label}
      </p>

      <strong className="mt-1 block text-3xl font-black text-[#16352a]">
        {value}
      </strong>

      <p className="mt-2 text-[11px] text-slate-400">
        {note}
      </p>
    </article>
  );
}