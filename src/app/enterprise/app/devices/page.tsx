import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Radio,
  Settings2,
  Wifi,
  WifiOff,
} from "lucide-react";

import {
  enterpriseDevices,
} from "@/lib/enterprise/mock-data";

const statusStyle = {
  Online: {
    badge:
      "bg-emerald-50 text-emerald-700 border-emerald-100",

    dot:
      "bg-emerald-500",
  },

  Offline: {
    badge:
      "bg-red-50 text-red-700 border-red-100",

    dot:
      "bg-red-500",
  },

  Maintenance: {
    badge:
      "bg-amber-50 text-amber-700 border-amber-100",

    dot:
      "bg-amber-500",
  },
};

export default function EnterpriseDevicesPage() {
  const total =
    enterpriseDevices.length;

  const online =
    enterpriseDevices.filter(
      (device) =>
        device.status ===
        "Online",
    ).length;

  const offline =
    enterpriseDevices.filter(
      (device) =>
        device.status ===
        "Offline",
    ).length;

  const maintenance =
    enterpriseDevices.filter(
      (device) =>
        device.status ===
        "Maintenance",
    ).length;

  const devicesWithSignal =
    enterpriseDevices.filter(
      (device) =>
        device.signal > 0,
    );

  const averageSignal =
    Math.round(
      devicesWithSignal.reduce(
        (sum, device) =>
          sum + device.signal,
        0,
      ) /
        devicesWithSignal.length,
    );

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <section className="rounded-[30px] bg-[#16352a] p-7 text-white md:p-9">
        <p className="text-[10px] font-bold tracking-[0.18em] text-emerald-300">
          ENTERPRISE · DEVICE FLEET
        </p>

        <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          MosGuardX device network
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          Theo dõi trạng thái kết
          nối, site, cường độ tín
          hiệu và lần đồng bộ gần
          nhất của toàn bộ thiết
          bị doanh nghiệp.
        </p>
      </section>

      {/* KPIs */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <FleetMetric
          icon={Cpu}
          label="Total"
          value={String(
            total,
          ).padStart(2, "0")}
        />

        <FleetMetric
          icon={CheckCircle2}
          label="Online"
          value={String(
            online,
          ).padStart(2, "0")}
        />

        <FleetMetric
          icon={WifiOff}
          label="Offline"
          value={String(
            offline,
          ).padStart(2, "0")}
          warning
        />

        <FleetMetric
          icon={Settings2}
          label="Maintenance"
          value={String(
            maintenance,
          ).padStart(2, "0")}
          warning
        />

        <FleetMetric
          icon={Radio}
          label="Avg signal"
          value={`${averageSignal}%`}
        />
      </section>

      {/* HEALTH SUMMARY */}

      <section className="grid gap-6 xl:grid-cols-[0.65fr_1.35fr]">
        <article className="rounded-[28px] bg-[#10251f] p-6 text-white">
          <p className="text-[10px] font-bold tracking-[0.16em] text-emerald-300">
            FLEET AVAILABILITY
          </p>

          <div className="mt-7">
            <strong className="text-5xl font-black text-emerald-300">
              {Math.round(
                (online /
                  total) *
                  100,
              )}
              %
            </strong>

            <p className="mt-2 text-xs text-slate-400">
              Devices currently
              online
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <StatusRow
              label="Online"
              value={online}
              className="bg-emerald-500"
            />

            <StatusRow
              label="Maintenance"
              value={
                maintenance
              }
              className="bg-amber-500"
            />

            <StatusRow
              label="Offline"
              value={offline}
              className="bg-red-500"
            />
          </div>
        </article>

        {/* SIGNAL */}

        <article className="rounded-[28px] border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Wifi size={20} />
            </span>

            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] text-emerald-700">
                CONNECTIVITY
              </p>

              <h3 className="font-bold text-[#16352a]">
                Signal health
              </h3>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <SignalCard
              label="Healthy"
              value={
                enterpriseDevices.filter(
                  (device) =>
                    device.signal >=
                    75,
                ).length
              }
              note="≥ 75%"
            />

            <SignalCard
              label="Weak"
              value={
                enterpriseDevices.filter(
                  (device) =>
                    device.signal >
                      0 &&
                    device.signal <
                      75,
                ).length
              }
              note="< 75%"
            />

            <SignalCard
              label="No signal"
              value={offline}
              note="Offline"
            />
          </div>
        </article>
      </section>

      {/* DEVICE TABLE */}

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] text-emerald-700">
              DEVICE FLEET
            </p>

            <h3 className="mt-1 text-xl font-bold text-[#16352a]">
              All devices
            </h3>
          </div>

          <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-500">
            {total} DEVICES
          </span>
        </div>

        {/* DESKTOP TABLE */}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[800px] text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                <th className="px-6 py-4">
                  Device
                </th>

                <th className="px-6 py-4">
                  Site
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Signal
                </th>

                <th className="px-6 py-4">
                  Last sync
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {enterpriseDevices.map(
                (device) => (
                  <tr
                    key={
                      device.id
                    }
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                          <Cpu
                            size={
                              18
                            }
                          />
                        </span>

                        <div>
                          <strong className="block text-sm text-[#16352a]">
                            {
                              device.name
                            }
                          </strong>

                          <span className="mt-1 block text-[10px] text-slate-400">
                            {
                              device.id
                            }
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-slate-600">
                      {
                        device.siteName
                      }
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                          statusStyle[
                            device.status
                          ]
                            .badge
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            statusStyle[
                              device.status
                            ]
                              .dot
                          }`}
                        />

                        {
                          device.status
                        }
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      {device.signal >
                      0 ? (
                        <div className="w-32">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-400">
                              Signal
                            </span>

                            <strong className="text-[#16352a]">
                              {
                                device.signal
                              }
                              %
                            </strong>
                          </div>

                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${
                                device.signal >=
                                75
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                              }`}
                              style={{
                                width: `${device.signal}%`,
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-red-500">
                          No
                          signal
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-5 text-xs text-slate-400">
                      {
                        device.lastSync
                      }
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}

        <div className="divide-y divide-slate-100 md:hidden">
          {enterpriseDevices.map(
            (device) => (
              <article
                key={device.id}
                className="p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <strong className="text-sm text-[#16352a]">
                      {
                        device.name
                      }
                    </strong>

                    <p className="mt-1 text-[10px] text-slate-400">
                      {
                        device.id
                      }
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-2 py-1 text-[9px] font-bold ${
                      statusStyle[
                        device.status
                      ].badge
                    }`}
                  >
                    {
                      device.status
                    }
                  </span>
                </div>

                <p className="mt-4 text-xs text-slate-500">
                  {
                    device.siteName
                  }
                </p>

                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
                  <span>
                    Signal:{" "}
                    {
                      device.signal
                    }
                    %
                  </span>

                  <span>
                    {
                      device.lastSync
                    }
                  </span>
                </div>
              </article>
            ),
          )}
        </div>
      </section>

      {/* WARNING */}

      {(offline > 0 ||
        maintenance > 0) && (
        <section className="flex items-start gap-4 rounded-[24px] border border-amber-100 bg-amber-50 p-5">
          <AlertTriangle
            size={20}
            className="mt-0.5 shrink-0 text-amber-600"
          />

          <div>
            <h3 className="text-sm font-bold text-amber-900">
              Fleet attention
              required
            </h3>

            <p className="mt-1 text-xs leading-6 text-amber-700">
              {offline} thiết
              bị offline và{" "}
              {maintenance} thiết
              bị đang ở trạng thái
              maintenance.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

function FleetMetric({
  icon: Icon,
  label,
  value,
  warning = false,
}: {
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  label: string;
  value: string;
  warning?: boolean;
}) {
  return (
    <article className="rounded-[22px] border border-slate-200 bg-white p-5">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          warning
            ? "bg-amber-50 text-amber-700"
            : "bg-emerald-50 text-emerald-700"
        }`}
      >
        <Icon size={18} />
      </span>

      <p className="mt-4 text-xs font-semibold text-slate-500">
        {label}
      </p>

      <strong className="mt-1 block text-2xl font-black text-[#16352a]">
        {value}
      </strong>
    </article>
  );
}

function StatusRow({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3">
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${className}`}
        />

        <span className="text-sm text-slate-300">
          {label}
        </span>
      </div>

      <strong>
        {value}
      </strong>
    </div>
  );
}

function SignalCard({
  label,
  value,
  note,
}: {
  label: string;
  value: number;
  note: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <strong className="mt-2 block text-3xl font-black text-[#16352a]">
        {value}
      </strong>

      <p className="mt-1 text-[10px] text-slate-400">
        {note}
      </p>
    </div>
  );
}