import type {
  LucideIcon,
} from "lucide-react";

import Link from "next/link";

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
  Low:
    "bg-emerald-50 text-emerald-700",
  Medium:
    "bg-amber-50 text-amber-700",
  High:
    "bg-red-50 text-red-700",
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
      <section className="relative overflow-hidden rounded-[30px] bg-[#16352a] p-7 text-white md:p-9">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] text-emerald-300">
                MOSGUARDX ENTERPRISE ·
                B2B
              </p>

              <h2 className="mt-4 max-w-3xl text-3xl font-bold md:text-4xl">
                Multi-site mosquito
                monitoring operations.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Theo dõi site, thiết
                bị, cảnh báo và bảo trì
                trong một workspace.
              </p>
            </div>

            <Link
              href="/enterprise/app/sites"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-[#10251f]"
            >
              View sites
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

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
          note={`${fleetAvailability}% availability`}
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
              className="text-xs font-bold text-emerald-700"
            >
              All sites
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {enterpriseSites.map(
              (site) => (
                <div
                  key={site.id}
                  className="grid gap-5 px-6 py-5 lg:grid-cols-[1fr_110px_160px_80px] lg:items-center"
                >
                  <div>
                    <strong className="text-sm text-[#16352a]">
                      {site.name}
                    </strong>

                    <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                      <MapPin size={12} />
                      {site.location}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400">
                      Devices
                    </p>

                    <strong className="text-sm">
                      {site.onlineDevices}/
                      {site.devices}
                    </strong>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">
                        Activity
                      </span>

                      <strong>
                        {site.activityIndex}%
                      </strong>
                    </div>

                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{
                          width: `${site.activityIndex}%`,
                        }}
                      />
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      riskClass[
                        site.risk
                      ]
                    }`}
                  >
                    {site.risk}
                  </span>
                </div>
              ),
            )}
          </div>
        </article>

        <article className="rounded-[28px] bg-[#10251f] p-6 text-white">
          <Radio className="text-emerald-300" />

          <p className="mt-6 text-[10px] font-bold tracking-[0.15em] text-emerald-300">
            FLEET HEALTH
          </p>

          <strong className="mt-3 block text-5xl font-black text-emerald-300">
            {fleetAvailability}%
          </strong>

          <p className="mt-2 text-xs text-slate-400">
            Fleet availability
          </p>

          <div className="mt-7 space-y-3">
            <FleetRow
              label="Online"
              value={
                onlineDevices
              }
              dot="bg-emerald-500"
            />

            <FleetRow
              label="Maintenance"
              value={
                enterpriseDevices.filter(
                  (d) =>
                    d.status ===
                    "Maintenance",
                ).length
              }
              dot="bg-amber-500"
            />

            <FleetRow
              label="Offline"
              value={
                enterpriseDevices.filter(
                  (d) =>
                    d.status ===
                    "Offline",
                ).length
              }
              dot="bg-red-500"
            />
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-[28px] border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <AlertTriangle
              size={20}
              className="text-amber-500"
            />

            <h3 className="font-bold text-[#16352a]">
              Alert Queue
            </h3>
          </div>

          <div className="mt-5 space-y-3">
            {enterpriseAlerts
              .filter(
                (alert) =>
                  alert.status !==
                  "Resolved",
              )
              .map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-2xl bg-slate-50 p-4"
                >
                  <strong className="text-sm text-[#16352a]">
                    {alert.title}
                  </strong>

                  <p className="mt-1 text-xs text-slate-400">
                    {alert.site} ·{" "}
                    {alert.time}
                  </p>
                </div>
              ))}
          </div>

          <Link
            href="/enterprise/app/alerts"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-700"
          >
            View alerts
            <ArrowRight size={15} />
          </Link>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <Wrench
              size={20}
              className="text-emerald-700"
            />

            <h3 className="font-bold text-[#16352a]">
              Maintenance Queue
            </h3>
          </div>

          <div className="mt-5 space-y-3">
            {enterpriseMaintenance.map(
              (job) => (
                <div
                  key={job.id}
                  className="rounded-2xl bg-slate-50 p-4"
                >
                  <strong className="text-sm text-[#16352a]">
                    {job.task}
                  </strong>

                  <p className="mt-1 text-xs text-slate-400">
                    {job.device} ·{" "}
                    {job.site}
                  </p>
                </div>
              ),
            )}
          </div>

          <Link
            href="/enterprise/app/maintenance"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-700"
          >
            Maintenance
            <ArrowRight size={15} />
          </Link>
        </article>
      </section>

      <section className="rounded-[28px] border border-emerald-100 bg-emerald-50/60 p-6">
        <div className="flex items-center gap-2 text-emerald-700">
          <Activity size={20} />

          <strong className="text-sm">
            Enterprise workflow
          </strong>
        </div>

        <p className="mt-2 text-sm text-slate-600">
          Site → Device → Detection →
          Alert → Maintenance → Report
        </p>

        <CheckCircle2
          size={18}
          className="mt-4 text-emerald-600"
        />
      </section>
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
  icon: LucideIcon;
  label: string;
  value: string;
  note: string;
  attention?: boolean;
}) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5">
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
          attention
            ? "bg-amber-50 text-amber-700"
            : "bg-emerald-50 text-emerald-700"
        }`}
      >
        <Icon size={20} />
      </span>

      <p className="mt-5 text-xs text-slate-500">
        {label}
      </p>

      <strong className="mt-1 block text-3xl text-[#16352a]">
        {value}
      </strong>

      <p className="mt-2 text-[11px] text-slate-400">
        {note}
      </p>
    </article>
  );
}

function FleetRow({
  label,
  value,
  dot,
}: {
  label: string;
  value: number;
  dot: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3">
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${dot}`}
        />

        <span className="text-sm text-slate-300">
          {label}
        </span>
      </div>

      <strong>{value}</strong>
    </div>
  );
}