import Link from "next/link";

import {
  ArrowRight,
  BarChart3,
  BellRing,
  Building2,
  CheckCircle2,
  Cpu,
  Gauge,
  Layers3,
  MapPinned,
  Network,
  Radio,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";

import PublicShell from "@/components/layout/public-shell";

const capabilities = [
  {
    icon: Layers3,
    title: "Multi-site operations",
    description:
      "Quản lý nhiều cơ sở, khu vực và điểm triển khai trong cùng một workspace.",
  },
  {
    icon: Cpu,
    title: "Device fleet",
    description:
      "Theo dõi trạng thái kết nối, sức khỏe và hoạt động của toàn bộ thiết bị.",
  },
  {
    icon: BellRing,
    title: "Alert workflow",
    description:
      "Tập trung cảnh báo từ hoạt động muỗi, thiết bị và vận hành.",
  },
  {
    icon: Wrench,
    title: "Maintenance",
    description:
      "Quản lý lịch kiểm tra, bảo trì và công việc kỹ thuật theo site.",
  },
  {
    icon: BarChart3,
    title: "Operational reports",
    description:
      "Tổng hợp dữ liệu và hiệu quả vận hành theo site, thiết bị và thời gian.",
  },
  {
    icon: Users,
    title: "Team & roles",
    description:
      "Phân quyền Owner, Manager, Technician và Viewer cho từng tổ chức.",
  },
];

const workflow = [
  {
    number: "01",
    title: "Site",
    description:
      "Tổ chức địa điểm triển khai.",
  },
  {
    number: "02",
    title: "Device",
    description:
      "Thu thập dữ liệu tại hiện trường.",
  },
  {
    number: "03",
    title: "Alert",
    description:
      "Phát hiện sự kiện cần chú ý.",
  },
  {
    number: "04",
    title: "Action",
    description:
      "Điều phối xử lý và bảo trì.",
  },
];

const audiences = [
  "Doanh nghiệp nhiều cơ sở",
  "Khách sạn & khu nghỉ dưỡng",
  "Nhà máy & khu công nghiệp",
  "PCO / đơn vị vận hành",
];

export default function EnterprisePage() {
  return (
    <PublicShell>
      <main className="overflow-hidden bg-[#f4f8f6] text-[#16352a]">
        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="relative overflow-hidden bg-[#0b211b] text-white">
          {/* Background */}

          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-emerald-400/[0.07] blur-3xl" />

            <div className="absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-teal-300/[0.08] blur-3xl" />

            <div
              className="absolute inset-0 opacity-[0.045]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)",
                backgroundSize:
                  "48px 48px",
              }}
            />
          </div>

          <div className="relative mx-auto grid min-h-[720px] max-w-7xl gap-16 px-5 py-20 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
            {/* LEFT */}

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.08] px-4 py-2">
                <Building2
                  size={15}
                  className="text-emerald-300"
                />

                <span className="text-[10px] font-bold tracking-[0.18em] text-emerald-300">
                  MOSGUARDX ENTERPRISE · B2B
                </span>
              </div>

              <h1 className="mt-8 max-w-3xl text-4xl font-bold leading-[1.04] tracking-[-0.04em] sm:text-5xl lg:text-[64px]">
                Một mạng lưới.
                <span className="block text-emerald-300">
                  Nhiều địa điểm.
                </span>
                Một trung tâm vận hành.
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                MosGuardX Enterprise giúp doanh nghiệp
                quản lý nhiều site, thiết bị, cảnh báo và
                hoạt động bảo trì trong một nền tảng duy nhất.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/enterprise/app"
                  className="group inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-bold text-[#10251f] transition hover:bg-emerald-300"
                >
                  Mở Enterprise Preview

                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-0.5"
                  />
                </Link>

                <Link
                  href="#capabilities"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/[0.08]"
                >
                  Khám phá nền tảng
                </Link>
              </div>

              <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-2">
                {[
                  "Quản lý nhiều site",
                  "Theo dõi device fleet",
                  "Alert & maintenance workflow",
                  "Báo cáo vận hành tập trung",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-slate-300"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/10">
                      <CheckCircle2
                        size={14}
                        className="text-emerald-300"
                      />
                    </span>

                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT / PRODUCT PREVIEW */}

            <div className="relative">
              <div className="absolute -inset-8 rounded-full bg-emerald-400/[0.05] blur-3xl" />

              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#102a22]/90 shadow-2xl shadow-black/30 backdrop-blur-xl">
                {/* Top */}

                <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-[#10251f]">
                      <Network size={20} />
                    </span>

                    <div>
                      <p className="text-sm font-bold">
                        Enterprise Network
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Operations overview
                      </p>
                    </div>
                  </div>

                  <span className="flex items-center gap-2 rounded-full bg-emerald-300/10 px-3 py-1.5 text-[9px] font-bold text-emerald-300">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
                    LIVE PREVIEW
                  </span>
                </div>

                {/* KPI */}

                <div className="grid grid-cols-3 gap-px bg-white/10">
                  <PreviewMetric
                    value="03"
                    label="Sites"
                  />

                  <PreviewMetric
                    value="12"
                    label="Devices"
                  />

                  <PreviewMetric
                    value="03"
                    label="Alerts"
                  />
                </div>

                {/* Sites */}

                <div className="p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold tracking-[0.15em] text-emerald-300">
                        SITE NETWORK
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        Managed locations
                      </p>
                    </div>

                    <Radio
                      size={18}
                      className="text-emerald-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <SitePreview
                      name="Office Building A"
                      devices="4 / 4"
                      risk="LOW"
                      progress={28}
                    />

                    <SitePreview
                      name="Hotel Site B"
                      devices="4 / 5"
                      risk="MEDIUM"
                      progress={63}
                    />

                    <SitePreview
                      name="Facility C"
                      devices="2 / 3"
                      risk="HIGH"
                      progress={81}
                    />
                  </div>
                </div>

                {/* Alert */}

                <div className="mx-5 mb-5 flex items-start gap-3 rounded-2xl border border-amber-300/15 bg-amber-300/[0.07] p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-300/10 text-amber-300">
                    <BellRing size={17} />
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-amber-300">
                        ATTENTION
                      </span>

                      <span className="text-[9px] text-slate-500">
                        12 min ago
                      </span>
                    </div>

                    <p className="mt-1 text-xs font-semibold text-slate-200">
                      Mosquito activity increased
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Facility C
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating cards */}

              <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-white/10 bg-[#173a2f] p-4 shadow-xl lg:block">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                    <Gauge size={18} />
                  </span>

                  <div>
                    <p className="text-[9px] text-slate-400">
                      Fleet availability
                    </p>

                    <strong className="text-lg text-white">
                      83%
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            VALUE STRIP
        ===================================================== */}

        <section className="border-b border-[#dce8e2] bg-white">
          <div className="mx-auto grid max-w-7xl md:grid-cols-4">
            {[
              {
                icon: Building2,
                title: "Multi-site",
                text: "Một workspace cho nhiều địa điểm",
              },
              {
                icon: Cpu,
                title: "Fleet visibility",
                text: "Theo dõi toàn bộ thiết bị",
              },
              {
                icon: BellRing,
                title: "Operational alerts",
                text: "Tập trung sự kiện cần xử lý",
              },
              {
                icon: BarChart3,
                title: "Reports",
                text: "Dữ liệu phục vụ quyết định",
              },
            ].map(
              ({
                icon: Icon,
                title,
                text,
              }) => (
                <div
                  key={title}
                  className="flex gap-4 border-b border-[#e6eeea] px-6 py-7 md:border-b-0 md:border-r last:md:border-r-0"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Icon size={18} />
                  </span>

                  <div>
                    <p className="text-sm font-bold text-[#16352a]">
                      {title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {text}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>

        {/* =====================================================
            CAPABILITIES
        ===================================================== */}

        <section
          id="capabilities"
          className="mx-auto max-w-7xl px-5 py-24 md:px-8"
        >
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-emerald-700">
                ENTERPRISE OPERATIONS
              </p>

              <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-[-0.03em] text-[#16352a] md:text-5xl">
                Không chỉ là một
                dashboard theo dõi.
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600">
                Enterprise được thiết kế như một
                workspace vận hành: từ địa điểm,
                thiết bị và cảnh báo cho đến công việc
                bảo trì và báo cáo.
              </p>

              <Link
                href="/enterprise/app"
                className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-emerald-700"
              >
                Xem workspace

                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {capabilities.map(
                ({
                  icon: Icon,
                  title,
                  description,
                }) => (
                  <article
                    key={title}
                    className="group rounded-[26px] border border-[#dce8e2] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-950/[0.05]"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef8f3] text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
                      <Icon size={20} />
                    </span>

                    <h3 className="mt-6 text-base font-bold text-[#16352a]">
                      {title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {description}
                    </p>
                  </article>
                ),
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            WORKFLOW
        ===================================================== */}

        <section className="bg-[#eaf3ee]">
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-8">
            <div className="max-w-3xl">
              <p className="text-[10px] font-bold tracking-[0.2em] text-emerald-700">
                FROM SIGNAL TO ACTION
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-[#16352a] md:text-5xl">
                Một luồng vận hành
                xuyên suốt.
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                Dữ liệu không dừng lại ở việc hiển thị.
                Enterprise kết nối dữ liệu hiện trường
                với hành động của đội vận hành.
              </p>
            </div>

            <div className="relative mt-12 grid gap-4 md:grid-cols-4">
              <div className="absolute left-[12%] right-[12%] top-9 hidden h-px bg-emerald-200 md:block" />

              {workflow.map(
                ({
                  number,
                  title,
                  description,
                }) => (
                  <article
                    key={number}
                    className="relative rounded-[24px] border border-white/70 bg-white/80 p-6 backdrop-blur"
                  >
                    <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#16352a] text-xs font-black text-emerald-300">
                      {number}
                    </span>

                    <h3 className="mt-6 text-lg font-bold text-[#16352a]">
                      {title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {description}
                    </p>
                  </article>
                ),
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            DEPLOYMENTS
        ===================================================== */}

        <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
          <div className="grid gap-10 rounded-[34px] bg-[#10251f] p-7 text-white md:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:p-12">
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-[#10251f]">
                <MapPinned size={22} />
              </span>

              <p className="mt-7 text-[10px] font-bold tracking-[0.18em] text-emerald-300">
                BUILT FOR DISTRIBUTED OPERATIONS
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                Phù hợp với mô hình
                nhiều cơ sở.
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
                Khi số site và thiết bị tăng lên,
                dữ liệu và công việc vận hành vẫn
                được tổ chức trong cùng một hệ thống.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {audiences.map((item) => (
                <div
                  key={item}
                  className="flex min-h-24 items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-300/10">
                    <CheckCircle2
                      size={17}
                      className="text-emerald-300"
                    />
                  </span>

                  <p className="text-sm font-semibold text-slate-200">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            ARCHITECTURE
        ===================================================== */}

        <section className="border-y border-[#dce8e2] bg-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] text-emerald-700">
                ONE MOSGUARDX CORE
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#16352a] md:text-4xl">
                Enterprise dùng chung
                một lõi dữ liệu MosGuardX.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
                Thiết bị, AI, events và cảnh báo được
                xử lý trên cùng nền tảng lõi; Enterprise
                chỉ cung cấp trải nghiệm và workflow
                phù hợp cho tổ chức B2B.
              </p>
            </div>

            <div className="rounded-[28px] border border-[#dce8e2] bg-[#f7faf8] p-6">
              <div className="rounded-2xl bg-[#16352a] p-5 text-white">
                <div className="flex items-center gap-3">
                  <ShieldCheck
                    size={20}
                    className="text-emerald-300"
                  />

                  <strong>
                    MosGuardX Core
                  </strong>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    "Devices",
                    "AI",
                    "Events",
                    "Alerts",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-xl bg-white/[0.06] px-3 py-3 text-center text-[10px] font-bold text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mx-auto h-8 w-px bg-emerald-200" />

              <div className="grid gap-3 sm:grid-cols-3">
                <PlatformBlock
                  title="Home"
                  segment="B2C"
                />

                <PlatformBlock
                  title="Enterprise"
                  segment="B2B"
                  active
                />

                <PlatformBlock
                  title="Command Center"
                  segment="B2G"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CTA
        ===================================================== */}

        <section className="px-5 py-24 md:px-8">
          <div className="mx-auto max-w-5xl rounded-[36px] bg-gradient-to-br from-emerald-600 to-[#12372c] px-6 py-14 text-center text-white shadow-2xl shadow-emerald-900/10 md:px-12">
            <p className="text-[10px] font-bold tracking-[0.2em] text-emerald-200">
              MOSGUARDX ENTERPRISE
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
              Từ nhiều điểm triển khai
              đến một trung tâm vận hành.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-emerald-50/80">
              Trải nghiệm workspace Enterprise hiện tại
              với dữ liệu preview trước khi tích hợp
              backend và dữ liệu hiện trường.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/enterprise/app"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50"
              >
                Open Enterprise

                <ArrowRight size={16} />
              </Link>

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                MosGuardX ecosystem
              </Link>
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}

/* ============================================================
   SMALL COMPONENTS
============================================================ */

function PreviewMetric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="bg-[#102a22] px-4 py-5 text-center">
      <strong className="block text-xl font-black text-white">
        {value}
      </strong>

      <span className="mt-1 block text-[9px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </span>
    </div>
  );
}

function SitePreview({
  name,
  devices,
  risk,
  progress,
}: {
  name: string;
  devices: string;
  risk:
    | "LOW"
    | "MEDIUM"
    | "HIGH";
  progress: number;
}) {
  const riskStyle =
    risk === "HIGH"
      ? "text-red-300 bg-red-300/10"
      : risk === "MEDIUM"
        ? "text-amber-300 bg-amber-300/10"
        : "text-emerald-300 bg-emerald-300/10";

  const progressStyle =
    risk === "HIGH"
      ? "bg-red-400"
      : risk === "MEDIUM"
        ? "bg-amber-400"
        : "bg-emerald-400";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-bold text-white">
            {name}
          </p>

          <p className="mt-1 text-[9px] text-slate-500">
            {devices} devices online
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[8px] font-bold ${riskStyle}`}
        >
          {risk}
        </span>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${progressStyle}`}
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}

function PlatformBlock({
  title,
  segment,
  active = false,
}: {
  title: string;
  segment: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 text-center ${
        active
          ? "border-emerald-300 bg-emerald-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <span
        className={`text-[9px] font-bold ${
          active
            ? "text-emerald-700"
            : "text-slate-400"
        }`}
      >
        {segment}
      </span>

      <p className="mt-1 text-xs font-bold text-[#16352a]">
        {title}
      </p>
    </div>
  );
}