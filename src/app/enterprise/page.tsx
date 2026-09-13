import Link from "next/link";
import type { ComponentType } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BellRing,
  Building2,
  CheckCircle2,
  Cpu,
  MapPin,
  Radio,
  Wrench,
} from "lucide-react";

import {
  enterpriseAlerts,
  enterpriseDevices,
  enterpriseMaintenance,
  enterpriseSites,
} from "@/lib/enterprise/mock-data";

const riskClass = {
  Low: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  High: "bg-red-50 text-red-700",
};

const severityClass = {
  High: "bg-red-50 text-red-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-sky-50 text-sky-700",
};

const deviceStatusClass = {
  Online: "bg-emerald-500",
  Offline: "bg-red-500",
  Maintenance: "bg-amber-500",
};

export default function EnterpriseOverviewPage() {
  const totalDevices =
    enterpriseDevices.length;

  const onlineDevices =
    enterpriseDevices.filter(
      (device) =>
        device.status === "Online",
    ).length;

  const openAlerts =
    enterpriseAlerts.filter(
      (alert) =>
        alert.status !== "Resolved",
    ).length;

  const pendingMaintenance =
    enterpriseMaintenance.filter(
      (job) =>
        job.status !== "Completed",
    ).length;

  const fleetAvailability =
    Math.round(
      (onlineDevices /
        totalDevices) *
        100,
    );

  return (
    <div className="space-y-6">
      {/* HERO */}

      <section className="relative overflow-hidden rounded-[30px] bg-[#16352a] p-7 text-white md:p-9">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] text-emerald-300">
                MOSGUARDX ENTERPRISE · B2B
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
                Multi-site mosquito
                monitoring operations.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Theo dõi toàn bộ site,
                thiết bị, cảnh báo và
                hoạt động bảo trì từ một
                workspace chung.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/enterprise/app/sites"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-[#10251f] transition hover:bg-emerald-300"
              >
                View sites

                <ArrowRight size={16} />
              </Link>

              <Link
                href="/enterprise/app/alerts"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Alert queue
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold text-slate-300">
              PREVIEW DATA
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold text-slate-300">
              3 SITES
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold text-slate-300">
              12 DEVICES
            </span>
          </div>
        </div>
      </section>

      {/* KPI */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Building2}
          label="Managed sites"
          value={String(
            enterpriseSites.length,
          ).padStart(2, "0")}
          note="Enterprise locations"
        />

        <MetricCard
          icon={Cpu}
          label="Devices online"
          value={`${onlineDevices}/${totalDevices}`}
          note={`${fleetAvailability}% fleet availability`}
        />

        <MetricCard
          icon={BellRing}
          label="Active alerts"
          value={String(
            openAlerts,
          ).padStart(2, "0")}
          note="Need review"
          attention
        />

        <MetricCard
          icon={Wrench}
          label="Maintenance"
          value={String(
            pendingMaintenance,
          ).padStart(2, "0")}
          note="Scheduled jobs"
        />
      </section>

      {/* SITES + FLEET */}

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] text-emerald-700">
                SITE OVERVIEW
              </p>

              <h3 className="mt-1 text-xl font-bold text-[#16352a]">
                Managed locations
              </h3>
            </div>

            <Link
              href="/enterprise/app/sites"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700"
            >
              All sites
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {enterpriseSites.map(
              (site) => (
                <div
                  key={site.id}
                  className="grid gap-5 px-6 py-5 transition hover:bg-slate-50/70 lg:grid-cols-[1fr_120px_170px_90px] lg:items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Building2
                        size={17}
                        className="text-emerald-700"
                      />

                      <strong className="text-sm text-[#16352a]">
                        {site.name}
                      </strong>
                    </div>

                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin size={13} />
                      {site.location}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Devices
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#16352a]">
                      {site.onlineDevices}/
                      {site.devices} online
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-slate-400">
                        Activity index
                      </span>

                      <strong className="text-[#16352a]">
                        {site.activityIndex}%
                      </strong>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{
                          width: `${site.activityIndex}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="lg:text-right">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        riskClass[
                          site.risk
                        ]
                      }`}
                    >
                      {site.risk}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        </article>

        {/* FLEET HEALTH */}

        <article className="rounded-[28px] bg-[#10251f] p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] text-emerald-300">
                FLEET HEALTH
              </p>

              <h3 className="mt-1 text-xl font-bold">
                Device network
              </h3>
            </div>

            <Radio
              size={21}
              className="text-emerald-300"
            />
          </div>

          <div className="mt-8 text-center">
            <strong className="text-5xl font-black text-emerald-300">
              {fleetAvailability}%
            </strong>

            <p className="mt-2 text-xs text-slate-400">
              Fleet availability
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {[
              {
                label: "Online",
                value:
                  enterpriseDevices.filter(
                    (device) =>
                      device.status ===
                      "Online",
                  ).length,
                status: "Online" as const,
              },
              {
                label: "Maintenance",
                value:
                  enterpriseDevices.filter(
                    (device) =>
                      device.status ===
                      "Maintenance",
                  ).length,
                status:
                  "Maintenance" as const,
              },
              {
                label: "Offline",
                value:
                  enterpriseDevices.filter(
                    (device) =>
                      device.status ===
                      "Offline",
                  ).length,
                status:
                  "Offline" as const,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      deviceStatusClass[
                        item.status
                      ]
                    }`}
                  />

                  <span className="text-sm text-slate-300">
                    {item.label}
                  </span>
                </div>

                <strong>
                  {item.value}
                </strong>
              </div>
            ))}
          </div>

          <Link
            href="/enterprise/app/devices"
            className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-white/[0.07] px-4 py-3 text-sm font-bold text-emerald-300 transition hover:bg-white/10"
          >
            Device fleet
            <ArrowRight size={15} />
          </Link>
        </article>
      </section>

      {/* ALERTS + MAINTENANCE */}

      <section className="grid gap-6 xl:grid-cols-2">
        {/* ALERT QUEUE */}

        <article className="rounded-[28px] border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] text-emerald-700">
                ALERT QUEUE
              </p>

              <h3 className="mt-1 text-xl font-bold text-[#16352a]">
                Needs attention
              </h3>
            </div>

            <AlertTriangle
              size={20}
              className="text-amber-500"
            />
          </div>

          <div className="divide-y divide-slate-100">
            {enterpriseAlerts
              .filter(
                (alert) =>
                  alert.status !==
                  "Resolved",
              )
              .slice(0, 3)
              .map((alert) => (
                <div
                  key={alert.id}
                  className="px-6 py-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-[9px] font-bold ${
                            severityClass[
                              alert.severity
                            ]
                          }`}
                        >
                          {alert.severity}
                        </span>

                        <span className="text-[10px] font-semibold text-slate-400">
                          {alert.id}
                        </span>
                      </div>

                      <p className="mt-3 text-sm font-bold text-[#16352a]">
                        {alert.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {alert.site} ·{" "}
                        {alert.time}
                      </p>
                    </div>

                    <span className="shrink-0 text-[10px] font-bold text-emerald-700">
                      {alert.status}
                    </span>
                  </div>
                </div>
              ))}
          </div>

          <div className="border-t border-slate-100 p-4">
            <Link
              href="/enterprise/app/alerts"
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-[#16352a] transition hover:bg-emerald-50 hover:text-emerald-700"
            >
              View all alerts
              <ArrowRight size={15} />
            </Link>
          </div>
        </article>

        {/* MAINTENANCE */}

        <article className="rounded-[28px] border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] text-emerald-700">
                MAINTENANCE
              </p>

              <h3 className="mt-1 text-xl font-bold text-[#16352a]">
                Upcoming work
              </h3>
            </div>

            <Wrench
              size={20}
              className="text-emerald-700"
            />
          </div>

          <div className="divide-y divide-slate-100">
            {enterpriseMaintenance.map(
              (job) => (
                <div
                  key={job.id}
                  className="px-6 py-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-[#16352a]">
                        {job.task}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {job.device} ·{" "}
                        {job.site}
                      </p>

                      <p className="mt-2 text-[10px] font-semibold text-slate-500">
                        Due: {job.due}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-bold ${
                        job.status ===
                        "Due soon"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-sky-50 text-sky-700"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="border-t border-slate-100 p-4">
            <Link
              href="/enterprise/app/maintenance"
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-[#16352a] transition hover:bg-emerald-50 hover:text-emerald-700"
            >
              Maintenance queue
              <ArrowRight size={15} />
            </Link>
          </div>
        </article>
      </section>

      {/* OPERATIONS FLOW */}

      <section className="rounded-[28px] border border-emerald-100 bg-emerald-50/60 p-6 md:p-7">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-emerald-700">
              <Activity size={20} />

              <p className="text-[10px] font-bold tracking-[0.16em]">
                ENTERPRISE OPERATIONS
              </p>
            </div>

            <h3 className="mt-3 text-xl font-bold text-[#16352a]">
              One operational workflow
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Từ site đến thiết bị,
              cảnh báo, bảo trì và báo
              cáo.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            {[
              "Site",
              "Device",
              "Alert",
              "Maintenance",
            ].map((item, index) => (
              <div
                key={item}
                className="rounded-2xl border border-emerald-100 bg-white p-4"
              >
                <span className="text-[10px] font-black text-emerald-600">
                  0{index + 1}
                </span>

                <p className="mt-2 text-sm font-bold text-[#16352a]">
                  {item}
                </p>

                {index === 3 && (
                  <CheckCircle2
                    size={15}
                    className="mt-3 text-emerald-600"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <p className="text-center text-[10px] font-semibold text-slate-400">
        Enterprise dashboard currently
        uses illustrative preview data.
      </p>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  note,
  attention = false,
}: {
  icon: ComponentType<{
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
      <div className="flex items-start justify-between">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            attention
              ? "bg-amber-50 text-amber-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          <Icon size={20} />
        </span>

        {attention && (
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
        )}
      </div>

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