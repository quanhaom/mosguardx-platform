import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  BellRing,
  Building2,
  CheckCircle2,
  Construction,
  FileBarChart,
  Layers3,
  Settings,
  Users,
  Wrench,
} from "lucide-react";

import PublicShell from "@/components/layout/public-shell";

const modules = [
  {
    icon: Layers3,
    title: "Sites",
    description:
      "Quản lý nhiều cơ sở và địa điểm triển khai MosGuardX.",
  },
  {
    icon: Building2,
    title: "Devices",
    description:
      "Theo dõi thiết bị, trạng thái kết nối và tình trạng vận hành.",
  },
  {
    icon: BellRing,
    title: "Alerts",
    description:
      "Cảnh báo theo site, thiết bị và mức độ ưu tiên.",
  },
  {
    icon: Wrench,
    title: "Maintenance",
    description:
      "Theo dõi cartridge, lịch bảo trì và công việc kỹ thuật.",
  },
  {
    icon: FileBarChart,
    title: "Reports",
    description:
      "Báo cáo hoạt động muỗi, thiết bị và hiệu quả vận hành.",
  },
  {
    icon: Users,
    title: "Team",
    description:
      "Quản lý manager, technician và viewer.",
  },
];

export default function EnterprisePage() {
  return (
    <PublicShell>
      <main className="min-h-[calc(100vh-72px)] bg-[#f4f8f6]">
        {/* HERO */}

        <section className="bg-[#0b211b] text-white">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 md:px-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-bold tracking-[0.14em] text-emerald-300">
                <Building2
                  size={15}
                />
                B2B · ENTERPRISE
              </span>

              <h1 className="mt-7 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
                MosGuardX
                <span className="block text-emerald-300">
                  Enterprise
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
                Nền tảng dành cho doanh
                nghiệp, PCO và đơn vị vận
                hành nhiều địa điểm hoặc
                nhiều thiết bị MosGuardX.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "Quản lý nhiều site",
                  "Quản lý nhiều thiết bị",
                  "Theo dõi cảnh báo và bảo trì",
                  "Báo cáo và quản lý đội ngũ",
                ].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm font-semibold text-slate-200"
                    >
                      <CheckCircle2
                        size={18}
                        className="text-emerald-300"
                      />

                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* PLACEHOLDER CARD */}

            <div className="rounded-[34px] border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur">
              <Construction
                size={36}
                className="text-emerald-300"
              />

              <p className="mt-7 text-xs font-bold tracking-[0.16em] text-emerald-300">
                PLATFORM PLACEHOLDER
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                Enterprise Platform
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                B2B platform đang được
                chuẩn bị. Giai đoạn hiện
                tại tập trung hoàn thiện
                MosGuardX Home và Command
                Center trước khi mở rộng
                workflow doanh nghiệp.
              </p>

              <div className="mt-7 flex items-center justify-between rounded-2xl bg-white/10 p-4">
                <div>
                  <p className="text-xs text-slate-400">
                    Status
                  </p>

                  <strong className="mt-1 block text-sm">
                    Coming soon
                  </strong>
                </div>

                <span className="h-3 w-3 rounded-full bg-amber-400" />
              </div>
            </div>
          </div>
        </section>

        {/* MODULES */}

        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <p className="text-xs font-bold tracking-[0.16em] text-emerald-700">
            PLANNED MODULES
          </p>

          <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-[#16352a] md:text-4xl">
            Nền tảng dành cho vận hành
            nhiều địa điểm.
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {modules.map(
              ({
                icon: Icon,
                title,
                description,
              }) => (
                <article
                  key={title}
                  className="rounded-[26px] border border-[#dfe9e4] bg-white p-6 shadow-sm"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Icon
                      size={20}
                    />
                  </span>

                  <h3 className="mt-5 font-bold text-[#16352a]">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {
                      description
                    }
                  </p>
                </article>
              ),
            )}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#16352a] transition hover:border-emerald-300"
            >
              <ArrowLeft
                size={16}
              />

              Website MosGuardX
            </Link>

            <Link
            href="/enterprise/app"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
            Xem Enterprise Preview

            <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}