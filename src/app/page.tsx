"use client";

import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import {
  ArrowRight,
  BarChart3,
  Bell,
  BrainCircuit,
  Building2,
  Camera,
  CheckCircle2,
  CircleDollarSign,
  Cpu,
  Database,
  Factory,
  FlaskConical,
  Globe2,
  Home,
  MapPinned,
  RadioTower,
  ScanLine,
  ShieldCheck,
  Sparkles,
  TestTube2,
  Users,
  Wifi,
  Wrench,
} from "lucide-react";

import PublicShell from "@/components/layout/public-shell";
import { useLanguage } from "@/components/i18n/language-context";

/* =========================================================
   TYPES
========================================================= */

type BilingualText = {
  vi: string;
  en: string;
};

type Card = {
  title: BilingualText;
  description: BilingualText;
  icon: LucideIcon;
  label?: string;
};

type PlatformSegment = {
  icon: LucideIcon;
  label: "B2C" | "B2B" | "B2G";
  status: "LIVE" | "COMING SOON" | "MVP";

  audience: BilingualText;
  title: BilingualText;
  tagline: BilingualText;
  description: BilingualText;

  features: BilingualText[];

  href: string;

  action: BilingualText;
};

/* =========================================================
   DATA
========================================================= */

const systemSteps: Card[] = [
  {
    icon: TestTube2,
    title: {
      vi: "Mồi dẫn dụ + CO₂",
      en: "Attractant + CO₂",
    },
    description: {
      vi: "Tạo tín hiệu thu hút mục tiêu",
      en: "Generate signals that attract target mosquitoes",
    },
  },
  {
    icon: Camera,
    title: {
      vi: "Camera + LED trắng",
      en: "Camera + white LED",
    },
    description: {
      vi: "Thu nhận ảnh trong khoang kiểm soát",
      en: "Capture images inside a controlled chamber",
    },
  },
  {
    icon: BrainCircuit,
    title: {
      vi: "AI nhận diện",
      en: "AI recognition",
    },
    description: {
      vi: "Phân loại, theo dõi và hạn chế đếm trùng",
      en: "Classify, track, and reduce duplicate counting",
    },
  },
  {
    icon: MapPinned,
    title: {
      vi: "Bản đồ cảnh báo",
      en: "Warning map",
    },
    description: {
      vi: "Tổng hợp mật độ theo không gian – thời gian",
      en: "Aggregate mosquito density across space and time",
    },
  },
];

const problems: Card[] = [
  {
    icon: Users,
    title: {
      vi: "Khảo sát phụ thuộc nhân lực",
      en: "Labor-intensive field surveys",
    },
    description: {
      vi:
        "Việc đặt bẫy, thu mẫu, đếm và tổng hợp thủ công khó duy trì liên tục trên một mạng lưới lớn.",
      en:
        "Manual trap deployment, sample collection, counting, and reporting are difficult to sustain continuously across a large network.",
    },
  },
  {
    icon: Database,
    title: {
      vi: "Dữ liệu rời rạc và có độ trễ",
      en: "Fragmented and delayed data",
    },
    description: {
      vi:
        "Kết quả ở nhiều địa điểm khó được chuẩn hóa và đối chiếu theo cùng một mốc thời gian.",
      en:
        "Results from different locations are difficult to standardize and compare using the same time reference.",
    },
  },
  {
    icon: Bell,
    title: {
      vi: "Khó ưu tiên đúng điểm nóng",
      en: "Hard to prioritize true hotspots",
    },
    description: {
      vi:
        "Thiếu một lớp trực quan chung để nhận biết khu vực có mật độ hoặc tốc độ gia tăng bất thường.",
      en:
        "There is no unified visual layer to identify areas with unusually high density or rapid increases.",
    },
  },
];

const productModules: Card[] = [
  {
    icon: TestTube2,
    title: {
      vi: "Khoang mồi dẫn dụ",
      en: "Attractant chamber",
    },
    description: {
      vi:
        "Sử dụng công thức được lựa chọn qua quá trình thực nghiệm.",
      en:
        "Uses an attractant formula selected through experimental testing.",
    },
  },
  {
    icon: Wifi,
    title: {
      vi: "Luồng khí và khoang giữ",
      en: "Airflow and holding chamber",
    },
    description: {
      vi:
        "Đưa mẫu qua vùng quan sát và hạn chế muỗi thoát ra ngoài.",
      en:
        "Moves specimens through the observation zone while limiting mosquito escape.",
    },
  },
  {
    icon: Camera,
    title: {
      vi: "Camera và LED trắng",
      en: "Camera and white LED",
    },
    description: {
      vi:
        "Tạo điều kiện hình ảnh ổn định cho nhận diện bằng AI.",
      en:
        "Provides stable imaging conditions for AI recognition.",
    },
  },
  {
    icon: Cpu,
    title: {
      vi: "Cảm biến và IoT",
      en: "Sensors and IoT",
    },
    description: {
      vi:
        "Theo dõi môi trường, nguồn điện, kết nối và lịch bảo trì.",
      en:
        "Monitors environmental conditions, power, connectivity, and maintenance schedules.",
    },
  },
];

const workflow = [
  {
    number: "01",
    icon: TestTube2,
    title: {
      vi: "Dẫn dụ",
      en: "Attract",
    },
    description: {
      vi:
        "Mồi dẫn dụ và CO₂ tạo tín hiệu thu hút mục tiêu.",
      en:
        "Attractants and CO₂ generate signals that draw mosquitoes toward the trap.",
    },
  },
  {
    number: "02",
    icon: ScanLine,
    title: {
      vi: "Thu nhận",
      en: "Capture",
    },
    description: {
      vi:
        "Luồng khí đưa mẫu qua vùng quan sát được tiêu chuẩn hóa.",
      en:
        "Airflow moves specimens through a standardized observation zone.",
    },
  },
  {
    number: "03",
    icon: BrainCircuit,
    title: {
      vi: "Phân tích",
      en: "Analyze",
    },
    description: {
      vi:
        "AI phát hiện, phân loại nhóm loài và theo dõi cá thể.",
      en:
        "AI detects specimens, classifies species groups, and tracks individuals.",
    },
  },
  {
    number: "04",
    icon: Database,
    title: {
      vi: "Đồng bộ",
      en: "Synchronize",
    },
    description: {
      vi:
        "Sự kiện được gắn thời gian, vị trí và dữ liệu môi trường.",
      en:
        "Each event is associated with time, location, and environmental data.",
    },
  },
  {
    number: "05",
    icon: Bell,
    title: {
      vi: "Cảnh báo",
      en: "Alert",
    },
    description: {
      vi:
        "Nền tảng tổng hợp xu hướng, điểm nóng và trạng thái thiết bị.",
      en:
        "The platform aggregates trends, hotspots, and device status.",
    },
  },
];

const experimentStages: Card[] = [
  {
    icon: FlaskConical,
    label: "01",
    title: {
      vi: "Sàng lọc mồi",
      en: "Attractant screening",
    },
    description: {
      vi:
        "So sánh chuối, cỏ, ổi, mật ong và đối chứng theo thiết kế xoay vị trí.",
      en:
        "Compare banana, grass, guava, honey, and control treatments using a rotated-position design.",
    },
  },
  {
    icon: Wrench,
    label: "02",
    title: {
      vi: "Kiểm thử bẫy",
      en: "Trap testing",
    },
    description: {
      vi:
        "Đo khả năng giữ mẫu, độ ổn định của quạt, nguồn điện và truyền dữ liệu.",
      en:
        "Measure specimen retention, fan stability, power performance, and data transmission.",
    },
  },
  {
    icon: ShieldCheck,
    label: "03",
    title: {
      vi: "Xác nhận sinh học",
      en: "Biological validation",
    },
    description: {
      vi:
        "Mẫu được mã hóa, đếm độc lập và chuyển người có chuyên môn xác nhận.",
      en:
        "Samples are coded, independently counted, and reviewed by qualified specialists.",
    },
  },
  {
    icon: CheckCircle2,
    label: "04",
    title: {
      vi: "Đánh giá tích hợp",
      en: "Integrated evaluation",
    },
    description: {
      vi:
        "Đối chiếu số đếm thủ công với AI và kiểm tra bản ghi trên nền tảng.",
      en:
        "Compare manual counts with AI results and verify records on the platform.",
    },
  },
];

const segments: PlatformSegment[] = [
  {
    icon: Home,
    label: "B2C",
    status: "LIVE",

    audience: {
      vi: "Hộ gia đình",
      en: "Households",
    },

    title: {
      vi: "MosGuardX Home",
      en: "MosGuardX Home",
    },

    tagline: {
      vi:
        "Hiểu hoạt động muỗi quanh chính ngôi nhà của bạn.",
      en:
        "Understand mosquito activity around your home.",
    },

    description: {
      vi:
        "Theo dõi hoạt động muỗi, xu hướng theo thời gian, cảnh báo và trạng thái các thiết bị MosGuardX trong gia đình.",
      en:
        "Monitor mosquito activity, trends, alerts, and household MosGuardX devices.",
    },

    features: [
      {
        vi: "Hoạt động muỗi theo ngày",
        en: "Daily mosquito activity",
      },
      {
        vi: "Thiết bị trong gia đình",
        en: "Household devices",
      },
      {
        vi: "Cảnh báo theo ngữ cảnh",
        en: "Contextual alerts",
      },
    ],

    href: "/household",

    action: {
      vi: "Khám phá MosGuardX Home",
      en: "Explore MosGuardX Home",
    },
  },

  {
    icon: Factory,
    label: "B2B",
    status: "COMING SOON",

    audience: {
      vi: "Doanh nghiệp & đơn vị vận hành",
      en: "Businesses & operators",
    },

    title: {
      vi: "MosGuardX Enterprise",
      en: "MosGuardX Enterprise",
    },

    tagline: {
      vi:
        "Một nền tảng cho nhiều địa điểm và nhiều thiết bị.",
      en:
        "One platform for multiple sites and devices.",
    },

    description: {
      vi:
        "Quản lý site, thiết bị, cảnh báo, bảo trì, báo cáo và hoạt động của đội ngũ vận hành.",
      en:
        "Manage sites, devices, alerts, maintenance, reports, and operational teams.",
    },

    features: [
      {
        vi: "Quản lý nhiều site",
        en: "Multi-site management",
      },
      {
        vi: "Bảo trì & vận hành",
        en: "Maintenance & operations",
      },
      {
        vi: "Reports & team",
        en: "Reports & team",
      },
    ],

    href: "/enterprise",

    action: {
      vi: "Khám phá Enterprise",
      en: "Explore Enterprise",
    },
  },

  {
    icon: Building2,
    label: "B2G",
    status: "MVP",

    audience: {
      vi: "Y tế công cộng & cơ quan quản lý",
      en: "Public health & government",
    },

    title: {
      vi: "MosGuardX Command Center",
      en: "MosGuardX Command Center",
    },

    tagline: {
      vi:
        "Quan sát toàn bộ mạng lưới từ một trung tâm điều hành.",
      en:
        "See the entire monitoring network from one command center.",
    },

    description: {
      vi:
        "Giám sát mạng lưới trạm, hotspot, xu hướng theo khu vực, cảnh báo và tình trạng triển khai.",
      en:
        "Monitor station networks, hotspots, regional trends, alerts, and deployment status.",
    },

    features: [
      {
        vi: "Bản đồ mạng lưới",
        en: "Network map",
      },
      {
        vi: "Hotspot & cảnh báo",
        en: "Hotspots & alerts",
      },
      {
        vi: "Phân tích theo khu vực",
        en: "Regional analytics",
      },
    ],

    href: "/dashboard",

    action: {
      vi: "Mở Command Center",
      en: "Open Command Center",
    },
  },
];

const businessModel: Card[] = [
  {
    icon: Cpu,
    title: {
      vi: "Thiết bị",
      en: "Hardware",
    },
    description: {
      vi:
        "Bán hoặc cho thuê trạm theo quy mô triển khai.",
      en:
        "Sell or lease stations based on deployment scale.",
    },
  },
  {
    icon: CircleDollarSign,
    title: {
      vi: "Nền tảng SaaS",
      en: "SaaS platform",
    },
    description: {
      vi:
        "Phí theo tháng, số lượng trạm và phạm vi chức năng.",
      en:
        "Subscription pricing based on station count and feature scope.",
    },
  },
  {
    icon: Wrench,
    title: {
      vi: "Vận hành và bảo trì",
      en: "Operations and maintenance",
    },
    description: {
      vi:
        "Lắp đặt, hiệu chuẩn, thay vật tư và bảo trì định kỳ.",
      en:
        "Installation, calibration, consumable replacement, and scheduled maintenance.",
    },
  },
  {
    icon: Database,
    title: {
      vi: "API và dữ liệu",
      en: "API and data",
    },
    description: {
      vi:
        "Tích hợp cho nghiên cứu hoặc hệ thống quản lý đối tác.",
      en:
        "Integration for research or partner management systems.",
    },
  },
];

/* =========================================================
   COMPONENTS
========================================================= */

function SectionHeading({
  eyebrow,
  title,
  description,
  inverted = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  inverted?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p
        className={`text-xs font-bold tracking-[0.18em] ${
          inverted
            ? "text-emerald-300"
            : "text-emerald-700"
        }`}
      >
        {eyebrow}
      </p>

      <h2
        className={`mt-3 text-3xl font-bold tracking-tight md:text-4xl ${
          inverted
            ? "text-white"
            : "text-[#16352a]"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-4 text-sm leading-7 md:text-base ${
            inverted
              ? "text-slate-300"
              : "text-slate-600"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   LANDING
========================================================= */

function LandingContent() {
  const {
    language,
    t,
  } = useLanguage();

  return (
    <main>
      {/* ===================================================
          HERO
      =================================================== */}

      <section
        id="hero"
        className="relative scroll-mt-20 overflow-hidden bg-[#0b211b] text-white"
      >
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(rgba(110,231,183,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(110,231,183,.08) 1px,transparent 1px)",
            backgroundSize:
              "48px 48px",
          }}
        />

        <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />

        <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-14 px-5 py-20 md:px-8 lg:grid-cols-[1.05fr_0.95fr]">
          {/* LEFT */}

          <div>
            <span className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] text-emerald-300">
              MOSGUARDX · ONE NETWORK · THREE PLATFORMS
            </span>

            <p className="mt-8 text-xs font-bold tracking-[0.2em] text-emerald-300">
              {t(
                "HỆ SINH THÁI GIÁM SÁT MUỖI THÔNG MINH",
                "SMART MOSQUITO INTELLIGENCE ECOSYSTEM",
              )}
            </p>

            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl lg:text-7xl">
              {t(
                "Một lõi dữ liệu.",
                "One intelligence core.",
              )}

              <span className="mt-2 block text-emerald-300">
                {t(
                  "Ba nền tảng chuyên biệt.",
                  "Three dedicated platforms.",
                )}
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              {t(
                "MosGuardX kết nối thiết bị IoT, AI, sự kiện muỗi, dữ liệu môi trường và cảnh báo trong một hạ tầng chung — sau đó cung cấp trải nghiệm riêng cho hộ gia đình, doanh nghiệp và mạng lưới y tế công cộng.",
                "MosGuardX connects IoT devices, AI, mosquito events, environmental data, and alerts through one shared infrastructure — with dedicated experiences for households, enterprises, and public-health networks.",
              )}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="#segments"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-bold text-[#10251f] transition hover:bg-emerald-300"
              >
                {t(
                  "Khám phá 3 nền tảng",
                  "Explore the platforms",
                )}

                <ArrowRight
                  size={17}
                />
              </Link>

              <Link
                href="#product"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                {t(
                  "Xem thiết bị MosGuardX",
                  "Explore MosGuardX device",
                )}
              </Link>
            </div>

            {/* Quick links */}

            <div className="mt-10 flex flex-wrap gap-2">
              <Link
                href="/household"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-emerald-300/30 hover:text-emerald-300"
              >
                <Home size={14} />

                Home · B2C
              </Link>

              <Link
                href="/enterprise"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-emerald-300/30 hover:text-emerald-300"
              >
                <Factory
                  size={14}
                />

                Enterprise · B2B
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-emerald-300/30 hover:text-emerald-300"
              >
                <Building2
                  size={14}
                />

                Command Center · B2G
              </Link>
            </div>

            {/* Core stats */}

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 border-t border-white/10 pt-7">
              {[
                [
                  "03",
                  t(
                    "Nền tảng",
                    "Platforms",
                  ),
                ],
                [
                  "01",
                  "MosGuardX Core",
                ],
                [
                  "AI",
                  t(
                    "Phân tích sự kiện",
                    "Event intelligence",
                  ),
                ],
              ].map(
                ([
                  value,
                  label,
                ]) => (
                  <div
                    key={label}
                  >
                    <strong className="text-2xl text-emerald-300">
                      {
                        value
                      }
                    </strong>

                    <p className="mt-1 text-xs text-slate-400">
                      {
                        label
                      }
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* RIGHT */}

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-5 rounded-[38px] border border-emerald-300/10" />

            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur">
              {/* Core */}

              <div className="rounded-[24px] border border-emerald-300/20 bg-emerald-300/10 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.18em] text-emerald-300">
                      SHARED INTELLIGENCE LAYER
                    </p>

                    <h2 className="mt-2 text-xl font-bold">
                      MosGuardX
                      Core
                    </h2>

                    <p className="mt-2 text-xs leading-5 text-slate-300">
                      Device Network
                      · AI · Events
                      · Weather ·
                      Alerts · Data
                    </p>
                  </div>

                  <BrainCircuit className="shrink-0 text-emerald-300" />
                </div>
              </div>

              <div className="mx-auto h-7 w-px bg-emerald-300/30" />

              {/* Home */}

              <Link
                href="/household"
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-black/10 p-4 transition hover:border-emerald-300/30 hover:bg-white/[0.08]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-[#10251f]">
                  <Home
                    size={20}
                  />
                </span>

                <div className="flex-1">
                  <p className="font-bold">
                    MosGuardX
                    Home
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    B2C ·
                    Household
                  </p>
                </div>

                <ArrowRight
                  size={16}
                  className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-emerald-300"
                />
              </Link>

              {/* Enterprise */}

              <Link
                href="/enterprise"
                className="group mt-3 flex items-center gap-4 rounded-2xl border border-white/10 bg-black/10 p-4 transition hover:border-emerald-300/30 hover:bg-white/[0.08]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-emerald-300">
                  <Factory
                    size={20}
                  />
                </span>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold">
                      MosGuardX
                      Enterprise
                    </p>

                    <span className="rounded-full bg-amber-300/10 px-2 py-0.5 text-[8px] font-bold text-amber-200">
                      SOON
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    B2B ·
                    Business &
                    Operators
                  </p>
                </div>

                <ArrowRight
                  size={16}
                  className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-emerald-300"
                />
              </Link>

              {/* Command Center */}

              <Link
                href="/dashboard"
                className="group mt-3 flex items-center gap-4 rounded-2xl border border-white/10 bg-black/10 p-4 transition hover:border-emerald-300/30 hover:bg-white/[0.08]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-emerald-300">
                  <Building2
                    size={20}
                  />
                </span>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold">
                      MosGuardX
                      Command
                      Center
                    </p>

                    <span className="rounded-full bg-sky-300/10 px-2 py-0.5 text-[8px] font-bold text-sky-200">
                      MVP
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    B2G · Public
                    Health
                  </p>
                </div>

                <ArrowRight
                  size={16}
                  className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-emerald-300"
                />
              </Link>

              <div className="mt-5 rounded-2xl border border-dashed border-white/10 px-4 py-3">
                <p className="text-[11px] leading-5 text-slate-400">
                  {t(
                    "Ba trải nghiệm frontend khác nhau, cùng sử dụng một hạ tầng dữ liệu và AI.",
                    "Three dedicated frontend experiences, powered by one shared data and AI infrastructure.",
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          PROBLEM
      =================================================== */}

      <section
        id="problem"
        className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 md:px-8"
      >
        <SectionHeading
          eyebrow={t(
            "BÀI TOÁN",
            "THE PROBLEM",
          )}
          title={t(
            "Dữ liệu muỗi thường đến sau khi nguy cơ đã hình thành.",
            "Mosquito data often arrives after the risk has already developed.",
          )}
          description={t(
            "MosGuardX tập trung giải quyết khoảng trống giữa việc thu mẫu ngoài thực địa và khả năng nhìn thấy biến động theo khu vực.",
            "MosGuardX focuses on closing the gap between field sampling and the ability to see location-based changes.",
          )}
        />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {problems.map(
            ({
              icon: Icon,
              title,
              description,
            }) => (
              <article
                key={title.vi}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon
                    size={21}
                  />
                </span>

                <h3 className="mt-5 text-lg font-bold text-[#16352a]">
                  {
                    title[
                      language
                    ]
                  }
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {
                    description[
                      language
                    ]
                  }
                </p>
              </article>
            ),
          )}
        </div>
      </section>

      {/* ===================================================
          PRODUCT
      =================================================== */}

      <section
        id="product"
        className="scroll-mt-20 border-y border-slate-200 bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading
            eyebrow={t(
              "THIẾT BỊ MOSGUARDX",
              "MOSGUARDX DEVICE",
            )}
            title={t(
              "Một trạm giám sát dạng module, thiết kế cho vận hành thực địa.",
              "A modular monitoring station designed for field operation.",
            )}
            description={t(
              "Thiết bị đưa mẫu qua một chuỗi có kiểm soát: dẫn dụ, hút giữ, ghi nhận hình ảnh, đo môi trường và đồng bộ dữ liệu.",
              "The device moves specimens through a controlled pipeline: attraction, capture, imaging, environmental sensing, and data synchronization.",
            )}
          />

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Product image */}

            <div className="relative flex min-h-[520px] items-center justify-center overflow-hidden rounded-[32px] border border-dashed border-emerald-700/30 bg-[#eaf3ee] p-8 text-center">
              <div className="max-w-md">
                <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] border border-emerald-700/15 bg-white text-emerald-700 shadow-xl">
                  <RadioTower
                    size={42}
                  />
                </span>

                <h3 className="mt-7 text-2xl font-bold text-[#16352a]">
                  {t(
                    "THIẾT BỊ MOSGUARDX",
                    "MOSGUARDX DEVICE",
                  )}
                </h3>

                <div className="relative mt-5 aspect-[4/3] w-full overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-lg">
                  <Image
                    src="/images/product.jpg"
                    alt={t(
                      "Thiết bị MosGuardX",
                      "MosGuardX device",
                    )}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 900px"
                    className="object-contain p-4"
                  />
                </div>

                <Link
                  href="/product-3d"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#16352a] px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-xl"
                >
                  <ScanLine
                    size={17}
                  />

                  {t(
                    "Xem mô hình sản phẩm 3D",
                    "View the interactive 3D product",
                  )}

                  <ArrowRight
                    size={16}
                  />
                </Link>
              </div>
            </div>

            {/* Modules */}

            <div className="grid gap-4 sm:grid-cols-2">
              {productModules.map(
                ({
                  icon: Icon,
                  title,
                  description,
                }) => (
                  <article
                    key={
                      title.vi
                    }
                    className="rounded-2xl border border-slate-200 bg-white p-6"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <Icon
                        size={
                          21
                        }
                      />
                    </span>

                    <h3 className="mt-5 text-lg font-bold text-[#16352a]">
                      {
                        title[
                          language
                        ]
                      }
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {
                        description[
                          language
                        ]
                      }
                    </p>
                  </article>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          SOLUTION
      =================================================== */}

      <section
        id="solution"
        className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 md:px-8"
      >
        <SectionHeading
          eyebrow={t(
            "CƠ CHẾ GIẢI PHÁP",
            "HOW THE SOLUTION WORKS",
          )}
          title={t(
            "Một chuỗi dữ liệu từ tín hiệu sinh học đến quyết định.",
            "A data pipeline from biological signals to decisions.",
          )}
          description={t(
            "Mỗi bước tạo ra một lớp dữ liệu có thể kiểm tra lại, thay vì chỉ trả về một con số tổng hợp.",
            "Each stage produces a verifiable data layer instead of returning only a single aggregated number.",
          )}
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {workflow.map(
            ({
              number,
              icon: Icon,
              title,
              description,
            }) => (
              <article
                key={number}
                className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6"
              >
                <span className="absolute right-4 top-3 text-4xl font-black text-emerald-950/[0.04]">
                  {number}
                </span>

                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon
                    size={21}
                  />
                </span>

                <p className="mt-5 text-xs font-bold text-emerald-700">
                  {number}
                </p>

                <h3 className="mt-2 text-lg font-bold text-[#16352a]">
                  {
                    title[
                      language
                    ]
                  }
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {
                    description[
                      language
                    ]
                  }
                </p>
              </article>
            ),
          )}
        </div>
      </section>

      {/* ===================================================
          AI
      =================================================== */}

      <section
        id="ai"
        className="scroll-mt-32 bg-[#0f2c24] py-20 text-white"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow={t(
                "AI NHẬN DIỆN",
                "AI RECOGNITION",
              )}
              title={t(
                "Không chỉ tìm bounding box, mà còn tạo một bản ghi có thể xác minh.",
                "Not just bounding boxes, but verifiable records.",
              )}
              description={t(
                "Mỗi phát hiện đi kèm nhóm loài, độ tin cậy, thời gian, trạm và mã theo dõi. Trường hợp dưới ngưỡng được đưa vào hàng chờ kiểm tra thủ công.",
                "Each detection includes species group, confidence score, timestamp, station, and tracking ID. Low-confidence cases are queued for manual review.",
              )}
              inverted
            />

            <div className="mt-7 space-y-3">
              {[
                t(
                  "Bounding box và phân loại nhóm loài",
                  "Bounding boxes and species-group classification",
                ),
                t(
                  "Theo dõi cá thể để hạn chế đếm trùng",
                  "Individual tracking to reduce duplicate counting",
                ),
                t(
                  "Lưu ảnh gốc phục vụ quá trình xác minh",
                  "Original image storage for verification",
                ),
                t(
                  "API tích hợp với các platform và hệ thống đối tác",
                  "API integration with MosGuardX platforms and partner systems",
                ),
              ].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 text-sm text-slate-200"
                  >
                    <CheckCircle2
                      className="mt-0.5 shrink-0 text-emerald-300"
                      size={
                        18
                      }
                    />

                    <span>
                      {
                        item
                      }
                    </span>
                  </div>
                ),
              )}
            </div>

            <p className="mt-7 rounded-2xl border border-amber-300/15 bg-amber-300/10 p-4 text-xs leading-6 text-amber-100">
              {t(
                "AI hỗ trợ giám sát côn trùng; kết quả không phải chẩn đoán bệnh hoặc kết luận dịch tễ độc lập.",
                "AI supports insect monitoring; its output is not a medical diagnosis or an independent epidemiological conclusion.",
              )}
            </p>
          </div>

          {/* AI image */}

          <div className="rounded-[30px] border border-white/10 bg-black/20 p-4 shadow-2xl">
            <div className="flex items-center justify-between px-2 pb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <BrainCircuit
                  size={17}
                />

                AI INFERENCE
                VIEW
              </div>

              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#071813]">
              <Image
                src="/images/ai-inference-result.png"
                alt={t(
                  "Kết quả AI nhận diện và phân loại muỗi của MosGuardX",
                  "MosGuardX AI mosquito detection and classification result",
                )}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
              />

              <div className="absolute inset-x-0 bottom-4 flex justify-center px-4">
                <span className="rounded-full border border-white/10 bg-[#071813]/85 px-4 py-2 text-[10px] font-bold tracking-[0.1em] text-emerald-200 shadow-lg backdrop-blur">
                  {t(
                    "KẾT QUẢ INFERENCE THỰC TẾ",
                    "REAL INFERENCE RESULT",
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          DEMO
      =================================================== */}

      <section
        id="demo"
        className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 md:px-8"
      >
        <SectionHeading
          eyebrow={t(
            "TRÌNH DIỄN SẢN PHẨM",
            "PRODUCT DEMONSTRATION",
          )}
          title={t(
            "Đi từ một sự kiện tại bẫy đến hành động trên nền tảng.",
            "From a trap event to an action on the platform.",
          )}
          description={t(
            "Video thiết bị cung cấp bằng chứng vật lý, trong khi các chức năng bên cạnh trình diễn lớp phần mềm và dữ liệu.",
            "The device video provides physical evidence while adjacent tools demonstrate the software and data layer.",
          )}
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-[30px] border border-emerald-300/20 bg-[#07110e] shadow-xl">
            <video
              className="aspect-video w-full bg-black object-contain"
              src="/videos/mosguardx-mvp-demo.mp4"
              controls
              playsInline
              preload="metadata"
            >
              Trình duyệt của
              bạn không hỗ trợ
              video.
            </video>
          </div>

          <div className="space-y-4">
            {[
              {
                icon:
                  BarChart3,

                title: t(
                  "MosGuardX Command Center",
                  "MosGuardX Command Center",
                ),

                description:
                  t(
                    "Tổng quan mạng lưới, chỉ số, trạm và xu hướng khu vực.",
                    "Network overview, stations, metrics, and regional trends.",
                  ),

                action: t(
                  "Mở Command Center",
                  "Open Command Center",
                ),

                href:
                  "/dashboard",
              },
              {
                icon:
                  MapPinned,

                title: t(
                  "Bản đồ mạng lưới",
                  "Network map",
                ),

                description:
                  t(
                    "Trạm, lớp dữ liệu và khu vực cần theo dõi.",
                    "Stations, data layers, and monitoring areas.",
                  ),

                action: t(
                  "Mở bản đồ",
                  "Open map",
                ),

                href:
                  "/map",
              },
              {
                icon:
                  BrainCircuit,

                title: t(
                  "AI và API",
                  "AI and API",
                ),

                description:
                  t(
                    "Tải ảnh, xem kết quả nhận diện và phản hồi mô hình.",
                    "Upload images, inspect detections, and review model output.",
                  ),

                action: t(
                  "Mở AI/API",
                  "Open AI/API",
                ),

                href:
                  "/ai-api",
              },
            ].map(
              ({
                icon: Icon,
                ...item
              }) => (
                <Link
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Icon
                      size={
                        22
                      }
                    />
                  </span>

                  <div className="flex-1">
                    <h3 className="font-bold text-[#16352a]">
                      {
                        item.title
                      }
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {
                        item.description
                      }
                    </p>

                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                      {
                        item.action
                      }

                      <ArrowRight
                        size={
                          14
                        }
                        className="transition group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ===================================================
          EXPERIMENT
      =================================================== */}

      <section
        id="experiment"
        className="scroll-mt-20 border-y border-slate-200 bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading
            eyebrow={t(
              "THỰC NGHIỆM VÀ XÁC THỰC",
              "EXPERIMENTATION AND VALIDATION",
            )}
            title={t(
              "Sản phẩm được hoàn thiện qua dữ liệu thực nghiệm, không dựa trên giả định.",
              "The product is refined through experimental data, not assumptions.",
            )}
            description={t(
              "Quá trình thực nghiệm là một phần chính của sản phẩm: sàng lọc mồi, kiểm tra bẫy, xác nhận mẫu và đánh giá toàn hệ thống.",
              "Experimentation is a core part of the product: attractant screening, trap testing, sample validation, and end-to-end system evaluation.",
            )}
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {experimentStages.map(
              ({
                icon: Icon,
                ...card
              }) => (
                <article
                  key={
                    card.title
                      .vi
                  }
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <Icon
                        size={
                          21
                        }
                      />
                    </span>

                    <span className="rounded-full bg-[#10251f] px-3 py-1 text-[10px] font-bold text-emerald-300">
                      {
                        card.label
                      }
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-[#16352a]">
                    {
                      card.title[
                        language
                      ]
                    }
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {
                      card.description[
                        language
                      ]
                    }
                  </p>
                </article>
              ),
            )}
          </div>

          {/* Evidence */}

          <div className="mt-12 rounded-[30px] border border-amber-300/40 bg-amber-50 p-6 md:p-8">
            <div className="flex items-center gap-2 text-amber-800">
              <FlaskConical
                size={20}
              />

              <p className="text-xs font-bold tracking-[0.16em]">
                EXPERIMENT EVIDENCE
              </p>
            </div>

            <h3 className="mt-3 text-2xl font-bold text-[#4a3510]">
              {t(
                "Hình ảnh và dữ liệu minh chứng thực nghiệm",
                "Experiment evidence and records",
              )}
            </h3>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-amber-950/70">
              {t(
                "Các hình ảnh dưới đây ghi lại bố trí hiện trường, dữ liệu thô và kết quả xác minh trong quá trình đánh giá.",
                "The images below document field setup, raw data, and validation results collected during evaluation.",
              )}
            </p>

            <figure className="mt-7 overflow-hidden rounded-2xl border border-amber-300/50 bg-white shadow-sm">
              <div className="relative aspect-video w-full bg-amber-100">
                <Image
                  src="/images/experiment-session-01.jpg"
                  alt={t(
                    "Bố trí thực nghiệm MosGuardX",
                    "MosGuardX experiment setup",
                  )}
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-cover"
                />

                <span className="absolute left-4 top-4 rounded-full bg-black/65 px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-white backdrop-blur">
                  {t(
                    "ẢNH THỰC NGHIỆM",
                    "EXPERIMENT PHOTO",
                  )}
                </span>
              </div>
            </figure>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon:
                    Camera,

                  image:
                    "/images/real.jpg",

                  title: t(
                    "Ảnh hiện trường",
                    "Field images",
                  ),

                  description:
                    t(
                      "Bố trí thiết bị, camera, vị trí mồi và điều kiện trong phiên thực nghiệm.",
                      "Device, camera, attractant position, and conditions during the experiment.",
                    ),
                },
                {
                  icon:
                    Database,

                  image:
                    "/images/data.jpg",

                  title: t(
                    "Dữ liệu thô",
                    "Raw data",
                  ),

                  description:
                    t(
                      "Số cá thể ghi nhận, thời điểm xuất hiện và kết quả đếm theo từng loại mồi.",
                      "Recorded individuals, appearance times, and counts for each attractant.",
                    ),
                },
                {
                  icon:
                    ShieldCheck,

                  image:
                    "/images/sample.png",

                  title: t(
                    "Kết quả xác minh",
                    "Validation results",
                  ),

                  description:
                    t(
                      "Ảnh mẫu và nhóm loài được đối chiếu với kết quả nhận diện của AI.",
                      "Specimen images and species groups compared with AI recognition results.",
                    ),
                },
              ].map(
                ({
                  icon: Icon,
                  image,
                  title,
                  description,
                }) => (
                  <article
                    key={
                      title
                    }
                    className="overflow-hidden rounded-2xl border border-amber-300/60 bg-white shadow-sm"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-amber-100">
                      <Image
                        src={
                          image
                        }
                        alt={
                          title
                        }
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />

                      <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-black/60 text-amber-200 backdrop-blur">
                        <Icon
                          size={
                            18
                          }
                        />
                      </span>
                    </div>

                    <div className="p-5">
                      <h4 className="font-bold text-[#4a3510]">
                        {
                          title
                        }
                      </h4>

                      <p className="mt-2 text-xs leading-5 text-amber-950/65">
                        {
                          description
                        }
                      </p>
                    </div>
                  </article>
                ),
              )}
            </div>

            {/* Metrics */}

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  value:
                    "70.1%",

                  label:
                    "Precision",

                  detail:
                    "Recall 47.6% · mAP50 43.3%",

                  status: t(
                    "BASELINE AI · VALIDATION",
                    "AI BASELINE · VALIDATION",
                  ),

                  statusClass:
                    "text-emerald-700",
                },
                {
                  value:
                    "3%",

                  label: t(
                    "Sai số đếm so với thủ công",
                    "Counting error versus manual counting",
                  ),

                  detail: t(
                    "Đối chiếu số muỗi hệ thống ghi nhận với kiểm đếm thủ công trên cùng mẫu thử.",
                    "Compare system mosquito counts with manual counts on the same test samples.",
                  ),

                  status: t(
                    "ĐÃ BENCHMARK THỰC NGHIỆM",
                    "EXPERIMENTALLY BENCHMARKED",
                  ),

                  statusClass:
                    "text-emerald-700",
                },
                {
                  value:
                    "E2E ✓",

                  label: t(
                    "Luồng truyền dữ liệu",
                    "Data transmission flow",
                  ),

                  detail:
                    "Camera → metadata → detection event → backend simulation → platform.",

                  status: t(
                    "ĐÃ XÁC THỰC TRÊN MVP MÔ PHỎNG",
                    "VERIFIED IN MVP SIMULATION",
                  ),

                  statusClass:
                    "text-cyan-700",
                },
                {
                  value:
                    "—",

                  label: t(
                    "Thời gian vận hành và bảo trì",
                    "Operating and maintenance time",
                  ),

                  detail: t(
                    "Đo thời gian hoạt động liên tục và thời gian cần thiết cho vệ sinh, kiểm tra và thay vật tư.",
                    "Measure continuous operating time and the time required for cleaning, inspection, and consumable replacement.",
                  ),

                  status: t(
                    "CHỜ HARDWARE VALIDATION",
                    "AWAITING HARDWARE VALIDATION",
                  ),

                  statusClass:
                    "text-amber-700",
                },
              ].map(
                (metric) => (
                  <article
                    key={
                      metric.label
                    }
                    className="flex min-h-[190px] flex-col rounded-2xl border border-slate-200 bg-[#f7faf8] p-5"
                  >
                    <strong
                      className={`text-3xl font-black ${
                        metric.value ===
                        "—"
                          ? "text-slate-300"
                          : "text-slate-900"
                      }`}
                    >
                      {
                        metric.value
                      }
                    </strong>

                    <p className="mt-3 text-xs font-bold leading-5 text-slate-700">
                      {
                        metric.label
                      }
                    </p>

                    <p className="mt-2 text-[11px] leading-5 text-slate-500">
                      {
                        metric.detail
                      }
                    </p>

                    <p
                      className={`mt-auto pt-4 text-[9px] font-bold tracking-[0.12em] ${metric.statusClass}`}
                    >
                      {
                        metric.status
                      }
                    </p>
                  </article>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          THREE PLATFORMS
      =================================================== */}

      <section
        id="segments"
        className="scroll-mt-24 overflow-hidden bg-[#0b211b] py-20 text-white md:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-emerald-300">
                ONE NETWORK · THREE
                PLATFORMS
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
                {t(
                  "Một hệ sinh thái. Ba trải nghiệm.",
                  "One ecosystem. Three experiences.",
                )}
              </h2>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              {t(
                "MosGuardX sử dụng cùng nền tảng dữ liệu, AI và hạ tầng thiết bị nhưng cung cấp giao diện và workflow riêng cho hộ gia đình, doanh nghiệp và mạng lưới y tế công cộng.",
                "MosGuardX shares the same device, AI, and data infrastructure while providing dedicated workflows for households, enterprises, and public-health networks.",
              )}
            </p>
          </div>

          {/* Shared core */}

          <div className="mt-12 rounded-[30px] border border-white/10 bg-white/[0.05] px-5 py-5 md:px-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-[0.18em] text-emerald-300">
                  SHARED
                  MOSGUARDX CORE
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  Device Network ·
                  AI · Events ·
                  Weather · Alerts
                  · Data Platform
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  "IoT",
                  "AI",
                  "Cloud",
                  "Weather",
                  "Alerts",
                ].map(
                  (item) => (
                    <span
                      key={
                        item
                      }
                      className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold text-slate-300"
                    >
                      {
                        item
                      }
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="mx-auto hidden h-10 w-px bg-gradient-to-b from-emerald-400/70 to-white/10 lg:block" />

          {/* Platforms */}

          <div className="mt-5 grid gap-5 lg:mt-0 lg:grid-cols-3">
            {segments.map(
              ({
                icon: Icon,
                ...segment
              }) => (
                <article
                  key={
                    segment.label
                  }
                  className="group relative flex min-h-[520px] flex-col overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.06] p-7 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.08]"
                >
                  <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />

                  <div className="relative flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-[#10251f]">
                      <Icon
                        size={
                          22
                        }
                      />
                    </span>

                    <div className="flex flex-col items-end gap-2">
                      <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[9px] font-bold tracking-[0.14em] text-emerald-300">
                        {
                          segment.label
                        }
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[8px] font-bold tracking-[0.12em] ${
                          segment.status ===
                          "LIVE"
                            ? "bg-emerald-400 text-[#10251f]"
                            : segment.status ===
                                "MVP"
                              ? "bg-sky-400/15 text-sky-200"
                              : "bg-amber-400/15 text-amber-200"
                        }`}
                      >
                        {
                          segment.status
                        }
                      </span>
                    </div>
                  </div>

                  <p className="relative mt-7 text-[10px] font-bold tracking-[0.16em] text-emerald-300">
                    {
                      segment
                        .audience[
                        language
                      ]
                    }
                  </p>

                  <h3 className="relative mt-3 text-2xl font-bold tracking-tight">
                    {
                      segment
                        .title[
                        language
                      ]
                    }
                  </h3>

                  <p className="relative mt-3 text-lg font-semibold leading-7 text-slate-200">
                    {
                      segment
                        .tagline[
                        language
                      ]
                    }
                  </p>

                  <p className="relative mt-4 text-sm leading-7 text-slate-400">
                    {
                      segment
                        .description[
                        language
                      ]
                    }
                  </p>

                  <div className="relative mt-7 space-y-3">
                    {segment.features.map(
                      (
                        feature,
                      ) => (
                        <div
                          key={
                            feature.vi
                          }
                          className="flex items-center gap-3 text-sm text-slate-300"
                        >
                          <CheckCircle2
                            size={
                              17
                            }
                            className="shrink-0 text-emerald-300"
                          />

                          {
                            feature[
                              language
                            ]
                          }
                        </div>
                      ),
                    )}
                  </div>

                  <div className="relative mt-auto pt-8">
                    <Link
                      href={
                        segment.href
                      }
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-sm font-bold text-white transition hover:border-emerald-400/30 hover:bg-emerald-400 hover:text-[#10251f]"
                    >
                      <span>
                        {
                          segment
                            .action[
                            language
                          ]
                        }
                      </span>

                      <ArrowRight
                        size={
                          17
                        }
                      />
                    </Link>
                  </div>
                </article>
              ),
            )}
          </div>

          <div className="mt-8 rounded-[26px] border border-white/10 bg-black/10 p-6 md:p-7">
            <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
              <div>
                <p className="text-[10px] font-bold tracking-[0.16em] text-emerald-300">
                  SAME
                  INFRASTRUCTURE
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  {t(
                    "Không phải ba hệ thống tách biệt.",
                    "Not three separate systems.",
                  )}
                </h3>
              </div>

              <p className="text-sm leading-7 text-slate-400">
                {t(
                  "Home, Enterprise và Command Center cùng sử dụng một MosGuardX Core. Khác biệt nằm ở phạm vi dữ liệu, quyền truy cập và cách người dùng tương tác với hệ thống.",
                  "Home, Enterprise, and Command Center share one MosGuardX Core. They differ in data scope, permissions, and user workflows.",
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          BUSINESS
      =================================================== */}

      <section
        id="business"
        className="scroll-mt-20 bg-[#0f2c24] py-20 text-white"
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading
            eyebrow={t(
              "MÔ HÌNH KINH DOANH",
              "BUSINESS MODEL",
            )}
            title={t(
              "Phần cứng tạo điểm dữ liệu, phần mềm tạo giá trị dài hạn.",
              "Hardware creates data points; software creates long-term value.",
            )}
            inverted
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {businessModel.map(
              ({
                icon: Icon,
                ...card
              }) => (
                <article
                  key={
                    card.title
                      .vi
                  }
                  className="rounded-2xl border border-white/10 bg-white/[0.05] p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-300">
                    <Icon
                      size={
                        21
                      }
                    />
                  </span>

                  <h3 className="mt-5 text-lg font-bold text-white">
                    {
                      card.title[
                        language
                      ]
                    }
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {
                      card.description[
                        language
                      ]
                    }
                  </p>
                </article>
              ),
            )}
          </div>

          <p className="mt-6 rounded-2xl border border-dashed border-amber-300/30 bg-amber-300/10 p-5 text-sm leading-6 text-amber-100">
            {t(
              "PLACEHOLDER · Bổ sung giá BOM, giá bán hoặc thuê, chi phí vận hành và biên lợi nhuận sau khi chốt prototype.",
              "PLACEHOLDER · Add BOM cost, selling or leasing price, operating cost, and profit margin after the prototype is finalized.",
            )}
          </p>
        </div>
      </section>

      {/* ===================================================
          EXPANSION
      =================================================== */}

      <section
        id="expansion"
        className="scroll-mt-20 bg-[#edf5f1] py-20"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <div className="flex items-center gap-3 text-emerald-700">
              <Globe2
                size={28}
              />

              <span className="text-xs font-bold tracking-[0.18em]">
                {t(
                  "HÀ NỘI → VIỆT NAM → KHU VỰC",
                  "HANOI → VIETNAM → REGION",
                )}
              </span>
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#16352a] md:text-4xl">
              {t(
                "Bắt đầu bằng một cụm trạm đủ nhỏ để kiểm chứng, đủ lớn để nhìn thấy xu hướng.",
                "Start with a station cluster small enough to validate, yet large enough to reveal trends.",
              )}
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600 md:text-base">
              {t(
                "Mỗi giai đoạn mở rộng phải đi sau dữ liệu thực nghiệm, đối tác chuyên môn và khả năng vận hành thực tế.",
                "Each expansion stage should follow experimental evidence, specialist partnerships, and demonstrated operational capability.",
              )}
            </p>

            <Link
              href="/expansion"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white"
            >
              {t(
                "Xem bản đồ lộ trình",
                "View expansion map",
              )}

              <ArrowRight
                size={17}
              />
            </Link>
          </div>

          <div className="space-y-4">
            {[
              t(
                "Cụm thử nghiệm tại Hà Nội",
                "Pilot cluster in Hanoi",
              ),
              t(
                "Mạng lưới theo tỉnh và khu vực",
                "Provincial and regional network",
              ),
              t(
                "Hợp tác nghiên cứu trong khu vực",
                "Regional research collaboration",
              ),
            ].map(
              (
                stage,
                index,
              ) => (
                <div
                  key={
                    stage
                  }
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#10251f] text-sm font-bold text-emerald-300">
                    0
                    {index +
                      1}
                  </span>

                  <strong className="text-sm text-[#16352a]">
                    {
                      stage
                    }
                  </strong>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ===================================================
          TEAM
      =================================================== */}

      <section
        id="team"
        className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 md:px-8"
      >
        <SectionHeading
          eyebrow={t(
            "ĐỘI NGŨ",
            "TEAM",
          )}
          title={t(
            "Một nhóm liên ngành kết nối sản phẩm, kỹ thuật và thị trường.",
            "A multidisciplinary team connecting product, technology, and market.",
          )}
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            [
              "Trần Thị Cẩm Vân",
              t(
                "Điều phối & Nghiên cứu",
                "Coordination & Research",
              ),
            ],
            [
              "Nguyễn Ngọc Vũ",
              t(
                "Phần cứng và vi điều khiển",
                "Hardware and microcontrollers",
              ),
            ],
            [
              "Trần Thị Lương",
              t(
                "Kinh doanh & Thị trường",
                "Business & Market",
              ),
            ],
            [
              "Nguyễn Thị Thu Trang",
              t(
                "Kinh doanh & Dữ liệu",
                "Business & Data",
              ),
            ],
            [
              "Phan Hoàng Quân",
              t(
                "AI, IoT & nền tảng",
                "AI, IoT, and platform",
              ),
            ],
          ].map(
            (
              [
                name,
                role,
              ],
              index,
            ) => (
              <article
                key={name}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
                  {index +
                    1}
                </span>

                <h3 className="mt-5 font-bold text-[#16352a]">
                  {name}
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {role}
                </p>
              </article>
            ),
          )}
        </div>

        {/* FINAL CTA */}

        <div className="mt-12 overflow-hidden rounded-[32px] bg-[#12352b] p-8 text-white md:p-12">
          <div className="grid gap-9 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-emerald-300">
                <Sparkles
                  size={20}
                />

                <span className="text-xs font-bold tracking-[0.16em]">
                  MOSGUARDX
                  PLATFORM
                </span>
              </div>

              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                {t(
                  "Một mạng lưới dữ liệu. Ba cách để sử dụng.",
                  "One intelligence network. Three ways to use it.",
                )}
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                {t(
                  "Từ một thiết bị tại gia đình đến nhiều site doanh nghiệp và mạng lưới giám sát quy mô khu vực, MosGuardX được thiết kế để chia sẻ cùng một hạ tầng dữ liệu nhưng phục vụ những workflow khác nhau.",
                  "From a single household device to multi-site enterprise deployments and regional monitoring networks, MosGuardX shares one data infrastructure while supporting different workflows.",
                )}
              </p>
            </div>

            <div className="grid gap-3">
              <Link
                href="/household"
                className="group flex items-center gap-4 rounded-2xl bg-emerald-400 p-4 text-[#10251f] transition hover:bg-emerald-300"
              >
                <Home
                  size={21}
                />

                <div className="flex-1">
                  <strong className="block">
                    MosGuardX
                    Home
                  </strong>

                  <span className="text-xs opacity-70">
                    B2C ·
                    Household
                  </span>
                </div>

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/enterprise"
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-white transition hover:bg-white/10"
              >
                <Factory
                  size={21}
                />

                <div className="flex-1">
                  <strong className="block">
                    MosGuardX
                    Enterprise
                  </strong>

                  <span className="text-xs text-slate-400">
                    B2B ·
                    Coming soon
                  </span>
                </div>

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/dashboard"
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-white transition hover:bg-white/10"
              >
                <Building2
                  size={21}
                />

                <div className="flex-1">
                  <strong className="block">
                    MosGuardX
                    Command Center
                  </strong>

                  <span className="text-xs text-slate-400">
                    B2G · MVP
                  </span>
                </div>

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function LandingPage() {
  return (
    <PublicShell>
      <LandingContent />
    </PublicShell>
  );
}