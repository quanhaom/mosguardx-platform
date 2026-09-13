import Link from "next/link";

import {
  Activity,
  ArrowRight,
  BellRing,
  Building2,
  Cpu,
  Layers3,
  Wrench,
} from "lucide-react";

const stats = [
  {
    label: "Sites",
    value: "03",
    note: "Placeholder",
    icon: Layers3,
  },
  {
    label: "Devices",
    value: "12",
    note: "10 online",
    icon: Cpu,
  },
  {
    label: "Open alerts",
    value: "04",
    note: "2 need review",
    icon: BellRing,
  },
  {
    label: "Maintenance",
    value: "02",
    note: "Scheduled",
    icon: Wrench,
  },
];

const sites = [
  {
    name:
      "Office Building A",
    location:
      "Hanoi",
    devices: 4,
    activity:
      "Low",
  },
  {
    name:
      "Hotel Site B",
    location:
      "Hanoi",
    devices: 5,
    activity:
      "Medium",
  },
  {
    name:
      "Facility C",
    location:
      "Hanoi",
    devices: 3,
    activity:
      "Low",
  },
];

export default function EnterpriseOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Hero */}

      <section className="overflow-hidden rounded-[30px] bg-[#16352a] p-7 text-white md:p-9">
        <p className="text-xs font-bold tracking-[0.18em] text-emerald-300">
          MOSGUARDX ENTERPRISE · B2B
        </p>

        <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
          Multi-site mosquito
          monitoring operations.
        </h2>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
          Workspace dành cho doanh
          nghiệp và đơn vị vận hành
          nhiều địa điểm, tập trung
          vào sites, devices,
          alerts, maintenance và
          reports.
        </p>

        <span className="mt-6 inline-flex rounded-full bg-amber-300/10 px-3 py-2 text-[10px] font-bold text-amber-200">
          PLATFORM PLACEHOLDER
        </span>
      </section>

      {/* Stats */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(
          ({
            label,
            value,
            note,
            icon: Icon,
          }) => (
            <article
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Icon
                  size={19}
                />
              </span>

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

      {/* Sites */}

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[26px] border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
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
              className="text-sm font-bold text-emerald-700"
            >
              View sites
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {sites.map(
              (site) => (
                <div
                  key={
                    site.name
                  }
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-[#f8faf9] p-5 sm:flex-row sm:items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Building2
                        size={17}
                        className="text-emerald-700"
                      />

                      <strong className="text-sm text-[#16352a]">
                        {
                          site.name
                        }
                      </strong>
                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                      {
                        site.location
                      }
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[10px] text-slate-400">
                        Devices
                      </p>

                      <strong className="text-sm text-[#16352a]">
                        {
                          site.devices
                        }
                      </strong>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400">
                        Activity
                      </p>

                      <strong className="text-sm text-emerald-700">
                        {
                          site.activity
                        }
                      </strong>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </article>

        {/* Operations */}

        <aside className="rounded-[26px] bg-[#10251f] p-6 text-white">
          <Activity className="text-emerald-300" />

          <p className="mt-6 text-[10px] font-bold tracking-[0.16em] text-emerald-300">
            OPERATIONS
          </p>

          <h3 className="mt-2 text-xl font-bold">
            Enterprise workflow
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-300">
            Site → Device → Alert →
            Maintenance → Report.
          </p>

          <div className="mt-6 space-y-3">
            {[
              "Site management",
              "Fleet monitoring",
              "Maintenance jobs",
              "Operational reports",
            ].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-slate-300"
                >
                  {item}
                </div>
              ),
            )}
          </div>

          <Link
            href="/enterprise"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-300"
          >
            Enterprise landing

            <ArrowRight
              size={15}
            />
          </Link>
        </aside>
      </section>
    </div>
  );
}