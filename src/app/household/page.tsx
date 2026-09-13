"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  BellRing,
  BrainCircuit,
  Camera,
  CheckCircle2,
  CloudRain,
  Droplets,
  Eye,
  Home,
  Layers3,
  LockKeyhole,
  MapPin,
  Radio,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wifi,
} from "lucide-react";

import PublicShell from "@/components/layout/public-shell";
import { useLanguage } from "@/components/i18n/language-context";

type Bilingual = {
  vi: string;
  en: string;
};

type Feature = {
  icon: LucideIcon;
  title: Bilingual;
  description: Bilingual;
};

const benefits: Feature[] = [
  {
    icon: Activity,
    title: {
      vi: "Biết khi nào muỗi đang hoạt động",
      en: "Know when mosquitoes are active",
    },
    description: {
      vi: "Theo dõi số lần ghi nhận, xu hướng theo ngày và khung giờ hoạt động nổi bật quanh nhà.",
      en: "Track detections, daily trends, and peak mosquito activity around your home.",
    },
  },
  {
    icon: BellRing,
    title: {
      vi: "Nhận cảnh báo đúng lúc",
      en: "Receive timely alerts",
    },
    description: {
      vi: "Kết hợp hoạt động muỗi, xu hướng và điều kiện môi trường để đưa ra thông tin dễ hành động.",
      en: "Combine mosquito activity, trends, and environmental context into practical alerts.",
    },
  },
  {
    icon: Smartphone,
    title: {
      vi: "Quản lý nhiều thiết bị",
      en: "Manage multiple devices",
    },
    description: {
      vi: "Theo dõi MosGuardX ở ban công, sân trước hoặc các vị trí khác trong cùng một ngôi nhà.",
      en: "Monitor MosGuardX units across balconies, yards, and other areas of the same home.",
    },
  },
];

const workflow = [
  {
    number: "01",
    icon: Camera,
    title: {
      vi: "Quan sát",
      en: "Observe",
    },
    description: {
      vi: "Camera quan sát vùng nhận diện bên trong thiết bị.",
      en: "The camera monitors the controlled detection chamber.",
    },
  },
  {
    number: "02",
    icon: ScanLine,
    title: {
      vi: "Phát hiện",
      en: "Detect",
    },
    description: {
      vi: "Hệ thống nhận biết thay đổi phù hợp và tạo mosquito event.",
      en: "The system detects relevant motion and creates a mosquito event.",
    },
  },
  {
    number: "03",
    icon: BrainCircuit,
    title: {
      vi: "Phân tích AI",
      en: "AI analysis",
    },
    description: {
      vi: "AI xử lý hình ảnh cần thiết để phát hiện và phân loại.",
      en: "AI processes selected images for detection and classification.",
    },
  },
  {
    number: "04",
    icon: BellRing,
    title: {
      vi: "Hiểu và hành động",
      en: "Understand & act",
    },
    description: {
      vi: "MosGuardX tổng hợp xu hướng, điều kiện môi trường và cảnh báo cho gia đình.",
      en: "MosGuardX combines trends, environmental context, and household alerts.",
    },
  },
];

export default function HouseholdPage() {
  return (
    <PublicShell>
      <HouseholdLanding />
    </PublicShell>
  );
}

function HouseholdLanding() {
  const { t } = useLanguage();

  return (
    <main className="overflow-hidden bg-[#f6f8f6]">
      {/* HERO */}
      <section
        id="home-hero"
        className="relative overflow-hidden bg-[#0b211b] text-white"
      >
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />

        <div className="relative mx-auto grid min-h-[720px] max-w-7xl gap-14 px-5 py-20 md:px-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-bold tracking-[0.12em] text-emerald-300">
              <Home size={15} />
              MOSGUARDX HOME
            </span>

            <h1 className="mt-7 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
              {t({
                vi: "Không chỉ bắt muỗi.",
                en: "Not just trapping mosquitoes.",
              })}
              <span className="mt-2 block text-emerald-300">
                {t({
                  vi: "Hiểu điều gì đang xảy ra quanh ngôi nhà của bạn.",
                  en: "Understand what is happening around your home.",
                })}
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              {t({
                vi: "MosGuardX Home kết hợp thiết bị giám sát muỗi, AI và dữ liệu môi trường để giúp gia đình theo dõi hoạt động muỗi và hành động đúng lúc.",
                en: "MosGuardX Home combines mosquito monitoring hardware, AI, and environmental data to help households understand mosquito activity and act at the right time.",
              })}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-bold text-[#10251f] transition hover:bg-emerald-300"
              >
                {t({
                  vi: "Khám phá MosGuardX Home",
                  en: "Explore MosGuardX Home",
                })}

                <ArrowRight size={17} />
              </Link>

              <Link
                href="/home"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <Smartphone size={17} />

                {t({
                  vi: "Xem Home Dashboard",
                  en: "View Home Dashboard",
                })}
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-xs text-slate-400">
              <HeroPoint
                icon={Eye}
                text={t({
                  vi: "Theo dõi hoạt động muỗi",
                  en: "Mosquito activity monitoring",
                })}
              />

              <HeroPoint
                icon={BellRing}
                text={t({
                  vi: "Cảnh báo theo ngữ cảnh",
                  en: "Contextual alerts",
                })}
              />

              <HeroPoint
                icon={LockKeyhole}
                text={t({
                  vi: "Privacy by design",
                  en: "Privacy by design",
                })}
              />
            </div>
          </div>

          <HomeDashboardPreview />
        </div>
      </section>

      {/* VALUE */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <SectionHeading
          eyebrow="MOSGUARDX HOME"
          title={t({
            vi: "Từ một chiếc bẫy thành một nguồn thông tin cho gia đình.",
            en: "From a mosquito trap to household intelligence.",
          })}
          description={t({
            vi: "Thay vì chỉ biết rằng có muỗi, MosGuardX giúp bạn nhìn thấy xu hướng, thời điểm hoạt động và tình trạng thiết bị ngay trên một giao diện.",
            en: "Instead of simply knowing mosquitoes exist, MosGuardX helps you see activity trends, peak periods, and device health in one place.",
          })}
        />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {benefits.map(
            ({
              icon: Icon,
              title,
              description,
            }) => (
              <article
                key={title.vi}
                className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-sm"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Icon size={22} />
                </span>

                <h3 className="mt-5 text-lg font-bold text-[#16352a]">
                  {t(title)}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {t(description)}
                </p>
              </article>
            ),
          )}
        </div>
      </section>

      {/* PRODUCT */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-8 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="DEVICE + AI + CLOUD"
              title={t({
                vi: "Một hệ thống, không chỉ một thiết bị.",
                en: "A system, not just a device.",
              })}
              description={t({
                vi: "Thiết bị MosGuardX thu nhận dữ liệu tại nhà. AI xử lý mosquito events. Nền tảng Home biến dữ liệu đó thành thông tin dễ hiểu.",
                en: "MosGuardX captures data at home. AI processes mosquito events. The Home platform turns them into understandable information.",
              })}
            />

            <div className="mt-8 space-y-4">
              <ProductPoint
                icon={Camera}
                title={t({
                  vi: "Camera trong vùng nhận diện",
                  en: "Controlled imaging chamber",
                })}
                text={t({
                  vi: "Quan sát vùng bên trong thiết bị thay vì không gian sinh hoạt của gia đình.",
                  en: "Observes the device's internal detection area rather than the household environment.",
                })}
              />

              <ProductPoint
                icon={BrainCircuit}
                title={t({
                  vi: "AI nhận diện mosquito event",
                  en: "AI mosquito-event analysis",
                })}
                text={t({
                  vi: "Không cần truyền video liên tục lên cloud.",
                  en: "Continuous cloud video streaming is not required.",
                })}
              />

              <ProductPoint
                icon={Wifi}
                title={t({
                  vi: "Đồng bộ trạng thái thiết bị",
                  en: "Device status synchronization",
                })}
                text={t({
                  vi: "Theo dõi kết nối, cartridge và trạng thái vận hành.",
                  en: "Track connectivity, cartridge status, and device operation.",
                })}
              />
            </div>
          </div>

          <div className="rounded-[36px] bg-[#edf5f1] p-6 sm:p-10">
            <div className="mx-auto max-w-md rounded-[32px] bg-[#16352a] p-7 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.15em] text-emerald-300">
                    MOSGUARDX HOME
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    {t({
                      vi: "Ban công tầng 3",
                      en: "Third-floor balcony",
                    })}
                  </h3>
                </div>

                <span className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <Metric
                  label={t({
                    vi: "Hôm nay",
                    en: "Today",
                  })}
                  value="7"
                  suffix={t({
                    vi: "lần ghi nhận",
                    en: "detections",
                  })}
                />

                <Metric
                  label={t({
                    vi: "Xu hướng",
                    en: "Trend",
                  })}
                  value="-18%"
                  suffix="7 days"
                />

                <Metric
                  label={t({
                    vi: "Độ ẩm",
                    en: "Humidity",
                  })}
                  value="81%"
                  suffix={t({
                    vi: "hiện tại",
                    en: "current",
                  })}
                />

                <Metric
                  label={t({
                    vi: "Cartridge",
                    en: "Cartridge",
                  })}
                  value="78%"
                  suffix={t({
                    vi: "còn lại",
                    en: "remaining",
                  })}
                />
              </div>

              <div className="mt-5 rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-slate-400">
                  {t({
                    vi: "Khung giờ hoạt động nổi bật",
                    en: "Peak activity period",
                  })}
                </p>

                <strong className="mt-1 block text-xl">
                  18:00–20:00
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-5 py-20 md:px-8"
      >
        <SectionHeading
          eyebrow="HOW IT WORKS"
          title={t({
            vi: "Từ mosquito event đến cảnh báo cho gia đình.",
            en: "From mosquito events to household alerts.",
          })}
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {workflow.map(
            ({
              number,
              icon: Icon,
              title,
              description,
            }) => (
              <article
                key={number}
                className="relative rounded-[26px] border border-[#dfe9e4] bg-white p-6"
              >
                <span className="absolute right-5 top-5 text-xs font-bold text-slate-300">
                  {number}
                </span>

                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Icon size={20} />
                </span>

                <h3 className="mt-5 font-bold text-[#16352a]">
                  {t(title)}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {t(description)}
                </p>
              </article>
            ),
          )}
        </div>
      </section>

      {/* MULTI DEVICE */}
      <section className="bg-[#10251f] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-emerald-300">
              MULTI-DEVICE HOME
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              {t({
                vi: "Một ngôi nhà có thể có nhiều điểm cần theo dõi.",
                en: "One home can have multiple monitoring points.",
              })}
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
              {t({
                vi: "MosGuardX Home cho phép quản lý nhiều thiết bị trong cùng một household và xem riêng tình trạng của từng vị trí.",
                en: "MosGuardX Home supports multiple devices within one household and lets you inspect each location individually.",
              })}
            </p>

            <Link
              href="/my-device"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-[#10251f]"
            >
              {t({
                vi: "Xem quản lý thiết bị",
                en: "View device management",
              })}

              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DeviceCard
              name={t({
                vi: "Ban công tầng 3",
                en: "Third-floor balcony",
              })}
              id="MGX-HOME-001"
              cartridge="78%"
              wifi={t({
                vi: "Tốt",
                en: "Good",
              })}
            />

            <DeviceCard
              name={t({
                vi: "Sân trước",
                en: "Front yard",
              })}
              id="MGX-HOME-002"
              cartridge="46%"
              wifi={t({
                vi: "Trung bình",
                en: "Medium",
              })}
            />
          </div>
        </div>
      </section>

      {/* WEATHER */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="grid gap-8 rounded-[34px] border border-[#dfe9e4] bg-white p-6 shadow-sm md:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
              <CloudRain size={23} />
            </span>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#16352a]">
              {t({
                vi: "Không chỉ nhìn số muỗi.",
                en: "More than mosquito counts.",
              })}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              {t({
                vi: "MosGuardX có thể đặt hoạt động muỗi trong bối cảnh nhiệt độ, độ ẩm và lượng mưa để giải thích điều kiện môi trường quanh khu vực.",
                en: "MosGuardX can place mosquito activity in the context of temperature, humidity, and rainfall to explain environmental conditions around the area.",
              })}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <WeatherMetric
              icon={Droplets}
              label={t({
                vi: "Độ ẩm",
                en: "Humidity",
              })}
              value="81%"
            />

            <WeatherMetric
              icon={CloudRain}
              label={t({
                vi: "Mưa 24h",
                en: "Rain 24h",
              })}
              value="12 mm"
            />

            <WeatherMetric
              icon={Activity}
              label={t({
                vi: "Hôm nay",
                en: "Today",
              })}
              value="7"
            />

            <WeatherMetric
              icon={Radio}
              label={t({
                vi: "Mức hoạt động",
                en: "Activity",
              })}
              value={t({
                vi: "Trung bình",
                en: "Medium",
              })}
            />
          </div>
        </div>
      </section>

      {/* PRIVACY */}
      <section className="bg-[#edf5f1]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:px-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-white text-emerald-700 shadow-sm">
              <ShieldCheck size={27} />
            </span>

            <p className="mt-6 text-xs font-bold tracking-[0.16em] text-emerald-700">
              PRIVACY BY DESIGN
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#16352a] md:text-4xl">
              {t({
                vi: "Camera quan sát con muỗi, không quan sát gia đình bạn.",
                en: "The camera observes mosquitoes, not your household.",
              })}
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
              {t({
                vi: "Camera được bố trí trong vùng nhận diện của thiết bị. MosGuardX không cần tải video liên tục lên cloud; chỉ những dữ liệu cần thiết của mosquito event được xử lý.",
                en: "The camera is positioned inside the device's controlled detection zone. MosGuardX does not require continuous cloud video uploads; only the necessary mosquito-event data is processed.",
              })}
            </p>
          </div>

          <div className="space-y-3">
            <PrivacyRow
              text={t({
                vi: "Không cần stream video liên tục",
                en: "No continuous video streaming required",
              })}
            />

            <PrivacyRow
              text={t({
                vi: "Xử lý theo mosquito event",
                en: "Mosquito-event based processing",
              })}
            />

            <PrivacyRow
              text={t({
                vi: "Theo dõi trạng thái thiết bị thay vì không gian sống",
                en: "Monitor device state rather than household spaces",
              })}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-[#16352a] px-6 py-12 text-center text-white md:px-12 md:py-16">
          <Sparkles
            size={28}
            className="mx-auto text-emerald-300"
          />

          <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
            {t({
              vi: "Xem MosGuardX Home hoạt động như một sản phẩm thực tế.",
              en: "See MosGuardX Home as a real product experience.",
            })}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300">
            {t({
              vi: "Khám phá dashboard dành cho hộ gia đình, hoạt động muỗi, thiết bị, cảnh báo và cài đặt.",
              en: "Explore the household dashboard, mosquito activity, devices, alerts, and settings.",
            })}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/home"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-bold text-[#10251f] transition hover:bg-emerald-300"
            >
              {t({
                vi: "Mở MosGuardX Home",
                en: "Open MosGuardX Home",
              })}

              <ArrowRight size={17} />
            </Link>

            <Link
              href="/my-device"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              {t({
                vi: "Xem thiết bị",
                en: "View devices",
              })}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-bold tracking-[0.16em] text-emerald-700">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#16352a] md:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mt-4 text-sm leading-7 text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

function HeroPoint({
  icon: Icon,
  text,
}: {
  icon: LucideIcon;
  text: string;
}) {
  return (
    <span className="flex items-center gap-2">
      <Icon size={15} className="text-emerald-300" />
      {text}
    </span>
  );
}

function ProductPoint({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
        <Icon size={20} />
      </span>

      <div>
        <p className="font-bold text-[#16352a]">
          {title}
        </p>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <strong className="mt-1 block text-2xl">
        {value}
      </strong>

      <p className="mt-1 text-[11px] text-slate-400">
        {suffix}
      </p>
    </div>
  );
}

function DeviceCard({
  name,
  id,
  cartridge,
  wifi,
}: {
  name: string;
  id: string;
  cartridge: string;
  wifi: string;
}) {
  return (
    <article className="rounded-[26px] border border-white/10 bg-white/[0.07] p-6 backdrop-blur">
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 text-[#10251f]">
          <Layers3 size={20} />
        </span>

        <span className="flex items-center gap-2 text-xs font-bold text-emerald-300">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          Online
        </span>
      </div>

      <h3 className="mt-6 text-xl font-bold">
        {name}
      </h3>

      <p className="mt-1 text-xs text-slate-400">
        {id}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/10 p-3">
          <p className="text-[10px] text-slate-400">
            Cartridge
          </p>

          <strong className="mt-1 block">
            {cartridge}
          </strong>
        </div>

        <div className="rounded-2xl bg-white/10 p-3">
          <p className="text-[10px] text-slate-400">
            Wi-Fi
          </p>

          <strong className="mt-1 block">
            {wifi}
          </strong>
        </div>
      </div>
    </article>
  );
}

function WeatherMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <Icon
        size={19}
        className="text-emerald-700"
      />

      <p className="mt-4 text-xs text-slate-400">
        {label}
      </p>

      <strong className="mt-1 block text-lg text-[#16352a]">
        {value}
      </strong>
    </div>
  );
}

function PrivacyRow({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-5 shadow-sm">
      <CheckCircle2
        size={20}
        className="shrink-0 text-emerald-600"
      />

      <p className="text-sm font-semibold text-[#16352a]">
        {text}
      </p>
    </div>
  );
}

function HomeDashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[470px]">
      <div className="absolute -inset-10 rounded-full bg-emerald-300/10 blur-3xl" />

      <div className="relative rounded-[36px] border border-white/10 bg-white/[0.07] p-4 shadow-2xl backdrop-blur-xl">
        <div className="rounded-[28px] bg-[#f6f8f6] p-5 text-[#16352a]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">
                MosGuardX Home
              </p>

              <h3 className="mt-1 font-bold">
                Nhà Hà Nội
              </h3>
            </div>

            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#16352a] text-emerald-300">
              <ShieldCheck size={20} />
            </span>
          </div>

          <div className="mt-5 rounded-[24px] bg-[#16352a] p-5 text-white">
            <p className="text-xs text-emerald-300">
              MOSQUITO ACTIVITY
            </p>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <strong className="text-3xl">
                  Trung bình
                </strong>

                <p className="mt-1 text-xs text-slate-400">
                  Hôm nay ghi nhận 7 events
                </p>
              </div>

              <Activity className="text-emerald-300" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs text-slate-400">
                Peak time
              </p>

              <strong className="mt-1 block">
                18:00–20:00
              </strong>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs text-slate-400">
                Weather
              </p>

              <strong className="mt-1 block">
                29°C · 81%
              </strong>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <div className="flex gap-3">
              <BellRing
                size={18}
                className="shrink-0 text-amber-700"
              />

              <div>
                <p className="text-sm font-bold">
                  Điều kiện thuận lợi cho muỗi
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Độ ẩm và lượng mưa gần đây đang tăng.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <MapPin size={15} />
            2 thiết bị đang hoạt động
          </div>
        </div>
      </div>
    </div>
  );
}