"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BrainCircuit,
  Building2,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Cpu,
  Database,
  Factory,
  FlaskConical,
  Globe2,
  Home,
  MapPinned,
  Play,
  RadioTower,
  ScanLine,
  ShieldCheck,
  Sparkles,
  TestTube2,
  Users,
  Wifi,
  Wrench,
  X,
} from "lucide-react";

import PublicShell from "@/components/layout/public-shell";
import { useLanguage } from "@/components/i18n/language-context";

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

const presentationSections = [
  { id: "hero", vi: "Mở đầu", en: "Overview" },
  { id: "problem", vi: "Bài toán", en: "Problem" },
  { id: "product", vi: "Thiết bị", en: "Product" },
  { id: "solution", vi: "Giải pháp", en: "Solution" },
  { id: "ai", vi: "AI", en: "AI" },
  { id: "demo", vi: "Demo", en: "Demo" },
  { id: "experiment", vi: "Thực nghiệm", en: "Experiments" },
  { id: "segments", vi: "Khách hàng", en: "Customers" },
  { id: "business", vi: "Kinh doanh", en: "Business" },
  { id: "expansion", vi: "Mở rộng", en: "Expansion" },
  { id: "team", vi: "Đội ngũ", en: "Team" },
];

const systemSteps: Card[] = [
  {
    icon: TestTube2,
    title: { vi: "Mồi dẫn dụ + CO₂", en: "Attractant + CO₂" },
    description: {
      vi: "Tạo tín hiệu thu hút mục tiêu",
      en: "Generate signals that attract target mosquitoes",
    },
  },
  {
    icon: Camera,
    title: { vi: "Camera + LED trắng", en: "Camera + white LED" },
    description: {
      vi: "Thu nhận ảnh trong khoang kiểm soát",
      en: "Capture images inside a controlled chamber",
    },
  },
  {
    icon: BrainCircuit,
    title: { vi: "AI nhận diện", en: "AI recognition" },
    description: {
      vi: "Phân loại, theo dõi và hạn chế đếm trùng",
      en: "Classify, track, and reduce duplicate counting",
    },
  },
  {
    icon: MapPinned,
    title: { vi: "Bản đồ cảnh báo", en: "Warning map" },
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
      vi: "Việc đặt bẫy, thu mẫu, đếm và tổng hợp thủ công khó duy trì liên tục trên một mạng lưới lớn.",
      en: "Manual trap deployment, sample collection, counting, and reporting are difficult to sustain continuously across a large network.",
    },
  },
  {
    icon: Database,
    title: {
      vi: "Dữ liệu rời rạc và có độ trễ",
      en: "Fragmented and delayed data",
    },
    description: {
      vi: "Kết quả ở nhiều địa điểm khó được chuẩn hóa và đối chiếu theo cùng một mốc thời gian.",
      en: "Results from different locations are difficult to standardize and compare using the same time reference.",
    },
  },
  {
    icon: Bell,
    title: {
      vi: "Khó ưu tiên đúng điểm nóng",
      en: "Hard to prioritize true hotspots",
    },
    description: {
      vi: "Thiếu một lớp trực quan chung để nhận biết khu vực có mật độ hoặc tốc độ gia tăng bất thường.",
      en: "There is no unified visual layer to identify areas with unusually high density or rapid increases.",
    },
  },
];

const productModules: Card[] = [
  {
    icon: TestTube2,
    title: { vi: "Khoang mồi dẫn dụ", en: "Attractant chamber" },
    description: {
      vi: "Sử dụng công thức được lựa chọn qua quá trình thực nghiệm.",
      en: "Uses an attractant formula selected through experimental testing.",
    },
  },
  {
    icon: Wifi,
    title: {
      vi: "Luồng khí và khoang giữ",
      en: "Airflow and holding chamber",
    },
    description: {
      vi: "Đưa mẫu qua vùng quan sát và hạn chế muỗi thoát ra ngoài.",
      en: "Moves specimens through the observation zone while limiting mosquito escape.",
    },
  },
  {
    icon: Camera,
    title: {
      vi: "Camera và LED trắng",
      en: "Camera and white LED",
    },
    description: {
      vi: "Tạo điều kiện hình ảnh ổn định cho nhận diện bằng AI.",
      en: "Provides stable imaging conditions for AI recognition.",
    },
  },
  {
    icon: Cpu,
    title: { vi: "Cảm biến và IoT", en: "Sensors and IoT" },
    description: {
      vi: "Theo dõi môi trường, nguồn điện, kết nối và lịch bảo trì.",
      en: "Monitors environmental conditions, power, connectivity, and maintenance schedules.",
    },
  },
];

const workflow = [
  {
    number: "01",
    icon: TestTube2,
    title: { vi: "Dẫn dụ", en: "Attract" },
    description: {
      vi: "Mồi dẫn dụ và CO₂ tạo tín hiệu thu hút mục tiêu.",
      en: "Attractants and CO₂ generate signals that draw mosquitoes toward the trap.",
    },
  },
  {
    number: "02",
    icon: ScanLine,
    title: { vi: "Thu nhận", en: "Capture" },
    description: {
      vi: "Luồng khí đưa mẫu qua vùng quan sát được tiêu chuẩn hóa.",
      en: "Airflow moves specimens through a standardized observation zone.",
    },
  },
  {
    number: "03",
    icon: BrainCircuit,
    title: { vi: "Phân tích", en: "Analyze" },
    description: {
      vi: "AI phát hiện, phân loại nhóm loài và theo dõi cá thể.",
      en: "AI detects specimens, classifies species groups, and tracks individuals.",
    },
  },
  {
    number: "04",
    icon: Database,
    title: { vi: "Đồng bộ", en: "Synchronize" },
    description: {
      vi: "Sự kiện được gắn thời gian, vị trí và dữ liệu môi trường.",
      en: "Each event is associated with time, location, and environmental data.",
    },
  },
  {
    number: "05",
    icon: Bell,
    title: { vi: "Cảnh báo", en: "Alert" },
    description: {
      vi: "Nền tảng tổng hợp xu hướng, điểm nóng và trạng thái thiết bị.",
      en: "The platform aggregates trends, hotspots, and device status.",
    },
  },
];

const experimentStages: Card[] = [
  {
    icon: FlaskConical,
    label: "01",
    title: { vi: "Sàng lọc mồi", en: "Attractant screening" },
    description: {
      vi: "So sánh chuối, cỏ, ổi, mật ong và đối chứng theo thiết kế xoay vị trí.",
      en: "Compare banana, grass, guava, honey, and control treatments using a rotated-position design.",
    },
  },
  {
    icon: Wrench,
    label: "02",
    title: { vi: "Kiểm thử bẫy", en: "Trap testing" },
    description: {
      vi: "Đo khả năng giữ mẫu, độ ổn định của quạt, nguồn điện và truyền dữ liệu.",
      en: "Measure specimen retention, fan stability, power performance, and data transmission.",
    },
  },
  {
    icon: ShieldCheck,
    label: "03",
    title: { vi: "Xác nhận sinh học", en: "Biological validation" },
    description: {
      vi: "Mẫu được mã hóa, đếm độc lập và chuyển người có chuyên môn xác nhận.",
      en: "Samples are coded, independently counted, and reviewed by qualified specialists.",
    },
  },
  {
    icon: CheckCircle2,
    label: "04",
    title: { vi: "Đánh giá tích hợp", en: "Integrated evaluation" },
    description: {
      vi: "Đối chiếu số đếm thủ công với AI và kiểm tra bản ghi trên dashboard.",
      en: "Compare manual counts with AI results and verify records on the dashboard.",
    },
  },
];

const segments = [
  {
    icon: Building2,
    label: "B2G",
    title: {
      vi: "Cơ quan y tế và chính quyền",
      en: "Health authorities and government",
    },
    description: {
      vi: "Bản đồ điểm nóng, giám sát mạng lưới và hỗ trợ ưu tiên nguồn lực.",
      en: "Hotspot mapping, network monitoring, and support for resource prioritization.",
    },
    href: "/dashboard",
    action: {
      vi: "Mở trung tâm điều hành",
      en: "Open command center",
    },
  },
  {
    icon: Factory,
    label: "B2B",
    title: {
      vi: "Doanh nghiệp và đơn vị vận hành",
      en: "Businesses and operators",
    },
    description: {
      vi: "Theo dõi rủi ro tại trường học, khu công nghiệp, khách sạn và khu dân cư.",
      en: "Monitor risk at schools, industrial parks, hotels, and residential areas.",
    },
    href: "/risk-api",
    action: {
      vi: "Xem API risk-score",
      en: "View risk-score API",
    },
  },
  {
    icon: Home,
    label: "B2C",
    title: { vi: "Hộ gia đình", en: "Households" },
    description: {
      vi: "Cảnh báo theo khu vực và khuyến nghị hành động ngắn, dễ thực hiện.",
      en: "Area-based alerts and short, practical action recommendations.",
    },
    href: "/household",
    action: {
      vi: "Xem trải nghiệm di động",
      en: "View mobile experience",
    },
  },
];

const businessModel: Card[] = [
  {
    icon: Cpu,
    title: { vi: "Thiết bị", en: "Hardware" },
    description: {
      vi: "Bán hoặc cho thuê trạm theo quy mô triển khai.",
      en: "Sell or lease stations based on deployment scale.",
    },
  },
  {
    icon: CircleDollarSign,
    title: { vi: "Nền tảng SaaS", en: "SaaS platform" },
    description: {
      vi: "Phí theo tháng, số lượng trạm và phạm vi chức năng.",
      en: "Subscription pricing based on station count and feature scope.",
    },
  },
  {
    icon: Wrench,
    title: { vi: "Vận hành và bảo trì", en: "Operations and maintenance" },
    description: {
      vi: "Lắp đặt, hiệu chuẩn, thay vật tư và bảo trì định kỳ.",
      en: "Installation, calibration, consumable replacement, and scheduled maintenance.",
    },
  },
  {
    icon: Database,
    title: { vi: "API và dữ liệu", en: "API and data" },
    description: {
      vi: "Tích hợp cho nghiên cứu hoặc hệ thống quản lý đối tác.",
      en: "Integration for research or partner management systems.",
    },
  },
];

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
          inverted ? "text-emerald-300" : "text-emerald-700"
        }`}
      >
        {eyebrow}
      </p>

      <h2
        className={`mt-3 text-3xl font-bold tracking-tight md:text-4xl ${
          inverted ? "text-white" : "text-[#16352a]"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-4 text-sm leading-7 md:text-base ${
            inverted ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function LandingContent() {
  const { language, t } = useLanguage();

  const [presentationMode, setPresentationMode] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  function goToSection(index: number) {
    const nextIndex = Math.min(
      Math.max(index, 0),
      presentationSections.length - 1,
    );

    setActiveSection(nextIndex);

    document
      .getElementById(presentationSections[nextIndex].id)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              second.intersectionRatio - first.intersectionRatio,
          )[0];

        if (!visibleEntry) return;

        const index = presentationSections.findIndex(
          (section) => section.id === visibleEntry.target.id,
        );

        if (index >= 0) {
          setActiveSection(index);
        }
      },
      {
        threshold: [0.35, 0.55, 0.75],
      },
    );

    presentationSections.forEach(({ id }) => {
      const section = document.getElementById(id);

      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!presentationMode) return;

    function handleKeyboard(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;

      if (
        target?.closest(
          "button, a, input, textarea, select",
        )
      ) {
        return;
      }

      if (
        [
          "ArrowRight",
          "ArrowDown",
          "PageDown",
          " ",
        ].includes(event.key)
      ) {
        event.preventDefault();
        goToSection(activeSection + 1);
      }

      if (
        [
          "ArrowLeft",
          "ArrowUp",
          "PageUp",
        ].includes(event.key)
      ) {
        event.preventDefault();
        goToSection(activeSection - 1);
      }

      if (event.key === "Escape") {
        setPresentationMode(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyboard,
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyboard,
      );
  }, [activeSection, presentationMode]);

  return (
    <>
      <main>
        {/* HERO */}
        <section
          id="hero"
          className="relative scroll-mt-20 overflow-hidden bg-[#0b211b] text-white"
        >
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "linear-gradient(rgba(110,231,183,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(110,231,183,.08) 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative mx-auto grid min-h-[740px] max-w-7xl items-center gap-14 px-5 py-20 md:px-8 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] text-emerald-300">
                {t(
                  "HỆ SINH THÁI GIÁM SÁT MUỖI THÔNG MINH",
                  "SMART MOSQUITO MONITORING ECOSYSTEM",
                )}
              </span>

              <p className="mt-8 text-xs font-bold tracking-[0.2em] text-emerald-300">
                {t(
                  "TỪ THIẾT BỊ NGOÀI THỰC ĐỊA ĐẾN BẢN ĐỒ CẢNH BÁO",
                  "FROM FIELD DEVICES TO EARLY-WARNING MAPS",
                )}
              </p>

              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-7xl">
                {t(
                  "Nhìn thấy rủi ro trước khi dịch bệnh lan rộng.",
                  "See the risk before an outbreak spreads.",
                )}
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                {t(
                  "MosguardX kết hợp bẫy IoT, hình ảnh và AI để ghi nhận tín hiệu mật độ muỗi theo không gian – thời gian, hỗ trợ giám sát liên tục và ra quyết định chủ động.",
                  "MosguardX combines IoT traps, imaging, and AI to capture mosquito-density signals across space and time, enabling continuous monitoring and proactive decision-making.",
                )}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="#product"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-bold text-[#10251f] transition hover:bg-emerald-300"
                >
                  {t("Khám phá sản phẩm", "Explore the product")}
                  <ArrowRight size={17} />
                </Link>

                <Link
                  href="/dashboard"
                  className="rounded-xl border border-white/20 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  {t("Mở dashboard", "Open dashboard")}
                </Link>
              </div>

              <div className="mt-12 grid max-w-xl grid-cols-3 gap-3 border-t border-white/10 pt-7">
                {[
                  ["24/7", t("Giám sát liên tục", "Continuous monitoring")],
                  ["AI", t("Phân loại và đếm", "Classification and counting")],
                  ["01", t("Nền tảng tập trung", "Unified platform")],
                ].map(([value, label]) => (
                  <div key={label}>
                    <strong className="text-2xl text-emerald-300">
                      {value}
                    </strong>
                    <p className="mt-1 text-xs text-slate-400">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-5 rounded-[36px] border border-emerald-300/10" />

              <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.18em] text-emerald-300">
                      MOSGUARDX SYSTEM
                    </p>
                    <h2 className="mt-1 text-xl font-bold">
                      {t("Từ bẫy đến cảnh báo", "From trap to alert")}
                    </h2>
                  </div>

                  <RadioTower className="text-emerald-300" />
                </div>

                <div className="mt-6 space-y-3">
                  {systemSteps.map(
                    ({ icon: Icon, title, description }, index) => (
                      <div
                        key={title.vi}
                        className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/10 p-4"
                      >
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-300">
                          <Icon size={21} />
                        </span>

                        <div className="flex-1">
                          <p className="font-bold">
                            {title[language]}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {description[language]}
                          </p>
                        </div>

                        <span className="text-xs font-bold text-slate-500">
                          0{index + 1}
                        </span>
                      </div>
                    ),
                  )}
                </div>

                <p className="mt-5 rounded-xl bg-amber-300/10 p-3 text-xs leading-5 text-amber-100">
                  {t(
                    "Hoạt chất kiểm soát, nếu có, là module độc lập và chỉ triển khai sau đánh giá an toàn, chuyên môn và pháp lý.",
                    "Any control agent, if used, is treated as an independent module and is deployed only after safety, technical, and regulatory review.",
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section
          id="problem"
          className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 md:px-8"
        >
          <SectionHeading
            eyebrow={t("BÀI TOÁN", "THE PROBLEM")}
            title={t(
              "Dữ liệu muỗi thường đến sau khi nguy cơ đã hình thành.",
              "Mosquito data often arrives after the risk has already developed.",
            )}
            description={t(
              "MosguardX tập trung giải quyết khoảng trống giữa việc thu mẫu ngoài thực địa và khả năng nhìn thấy biến động theo khu vực.",
              "MosguardX focuses on closing the gap between field sampling and the ability to see location-based changes in near real time.",
            )}
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {problems.map((card) => (
              <article
                key={card.title.vi}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <card.icon size={21} />
                </span>

                <h3 className="mt-5 text-lg font-bold text-[#16352a]">
                  {card.title[language]}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {card.description[language]}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* PRODUCT */}
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
              <div className="relative flex min-h-[520px] items-center justify-center overflow-hidden rounded-[32px] border border-dashed border-emerald-700/30 bg-[#eaf3ee] p-8 text-center">
                <div className="absolute left-8 top-8 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[10px] font-bold tracking-[0.14em] text-emerald-800 shadow-sm">
                  <Camera size={14} />
                  PLACEHOLDER · PRODUCT PHOTO
                </div>

                <div className="max-w-md">
                  <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] border border-emerald-700/15 bg-white text-emerald-700 shadow-xl">
                    <RadioTower size={42} />
                  </span>

                  <h3 className="mt-7 text-2xl font-bold text-[#16352a]">
                    {t(
                      "HÌNH ẢNH THIẾT BỊ HOÀN THIỆN",
                      "FINAL DEVICE IMAGE",
                    )}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {t(
                      "Thay khung này bằng ảnh prototype nền sạch hoặc ảnh render sản phẩm sau khi hoàn thành lắp ráp.",
                      "Replace this placeholder with a clean-background prototype photo or a product render after assembly is complete.",
                    )}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {productModules.map((card) => (
                  <article
                    key={card.title.vi}
                    className="rounded-2xl border border-slate-200 bg-white p-6"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <card.icon size={21} />
                    </span>

                    <h3 className="mt-5 text-lg font-bold text-[#16352a]">
                      {card.title[language]}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {card.description[language]}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SOLUTION */}
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
              ({ number, icon: Icon, title, description }) => (
                <article
                  key={number}
                  className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <span className="absolute right-4 top-3 text-4xl font-black text-emerald-950/[0.04]">
                    {number}
                  </span>

                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Icon size={21} />
                  </span>

                  <p className="mt-5 text-xs font-bold text-emerald-700">
                    {number}
                  </p>

                  <h3 className="mt-2 text-lg font-bold text-[#16352a]">
                    {title[language]}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {description[language]}
                  </p>
                </article>
              ),
            )}
          </div>
        </section>

        {/* AI */}
        <section
          id="ai"
          className="scroll-mt-20 bg-[#0f2c24] py-20 text-white"
        >
          <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <SectionHeading
                eyebrow={t("AI NHẬN DIỆN", "AI RECOGNITION")}
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
                    "API tích hợp với dashboard và hệ thống đối tác",
                    "API integration with dashboards and partner systems",
                  ),
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 text-sm text-slate-200"
                  >
                    <CheckCircle2
                      className="mt-0.5 shrink-0 text-emerald-300"
                      size={18}
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <p className="mt-7 rounded-2xl border border-amber-300/15 bg-amber-300/10 p-4 text-xs leading-6 text-amber-100">
                {t(
                  "AI hỗ trợ giám sát côn trùng; kết quả không phải chẩn đoán bệnh hoặc kết luận dịch tễ độc lập.",
                  "AI supports insect monitoring; its output is not a medical diagnosis or an independent epidemiological conclusion.",
                )}
              </p>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-black/20 p-4 shadow-2xl">
              <div className="flex items-center justify-between px-2 pb-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <BrainCircuit size={17} />
                  AI INFERENCE VIEW
                </div>

                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#071813]">
                <div className="absolute inset-[18%_20%_20%_16%] border-2 border-emerald-300">
                  <span className="absolute -top-7 left-[-2px] bg-emerald-300 px-2 py-1 text-[10px] font-bold text-[#10251f]">
                    {t(
                      "Nhóm loài · độ tin cậy",
                      "Species group · confidence",
                    )}
                  </span>

                  <span className="absolute -bottom-7 right-[-2px] bg-white/10 px-2 py-1 text-[9px] font-bold text-emerald-100">
                    TRACK ID · —
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-6 text-center">
                  <span className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-slate-300">
                    {t(
                      "THAY BẰNG ẢNH INFERENCE THỰC TẾ",
                      "REPLACE WITH REAL INFERENCE IMAGE",
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DEMO */}
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
              "Trong phần thuyết trình, video thiết bị là bằng chứng vật lý; các nút bên cạnh mở trực tiếp những chức năng đang được trình diễn.",
              "During the presentation, the device video provides physical evidence while the adjacent buttons open the live functions being demonstrated.",
            )}
          />

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex min-h-[450px] flex-col items-center justify-center rounded-[30px] border border-dashed border-emerald-300/30 bg-[#10251f] p-8 text-center text-white shadow-xl">
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-300/10 text-emerald-300">
                <Play size={30} fill="currentColor" />
              </span>

              <h3 className="mt-6 text-2xl font-bold">
                {t(
                  "VIDEO SẢN PHẨM HOẠT ĐỘNG",
                  "PRODUCT DEMO VIDEO",
                )}
              </h3>

              <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
                {t(
                  "Thay placeholder bằng video 30–45 giây: muỗi vào bẫy → camera ghi nhận → AI xử lý → dashboard cập nhật.",
                  "Replace this placeholder with a 30–45 second video: mosquito enters trap → camera captures image → AI processes it → dashboard updates.",
                )}
              </p>

              <span className="mt-6 rounded-full bg-amber-300/10 px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-amber-200">
                PLACEHOLDER · DEMO VIDEO
              </span>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: BarChart3,
                  title: t(
                    "Trung tâm điều hành",
                    "Command center",
                  ),
                  description: t(
                    "Tổng quan mạng lưới, chỉ số và xu hướng.",
                    "Network overview, metrics, and trends.",
                  ),
                  action: t(
                    "Mở dashboard",
                    "Open dashboard",
                  ),
                  href: "/dashboard",
                },
                {
                  icon: MapPinned,
                  title: t(
                    "Bản đồ mật độ",
                    "Density map",
                  ),
                  description: t(
                    "Trạm, lớp mật độ và khu vực cảnh báo.",
                    "Stations, density layers, and warning areas.",
                  ),
                  action: t(
                    "Mở bản đồ",
                    "Open map",
                  ),
                  href: "/map",
                },
                {
                  icon: BrainCircuit,
                  title: t(
                    "AI và API",
                    "AI and API",
                  ),
                  description: t(
                    "Tải ảnh, xem bounding box và phản hồi mô hình.",
                    "Upload images, inspect bounding boxes, and review model output.",
                  ),
                  action: t(
                    "Mở AI/API",
                    "Open AI/API",
                  ),
                  href: "/ai-api",
                },
              ].map(({ icon: Icon, ...item }) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Icon size={22} />
                  </span>

                  <div className="flex-1">
                    <h3 className="font-bold text-[#16352a]">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {item.description}
                    </p>

                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                      {item.action}
                      <ArrowRight
                        size={14}
                        className="transition group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIMENT */}
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
                "Sản phẩm được hoàn thiện qua dữ liệu thực địa, không dựa trên giả định.",
                "The product is refined through field data, not assumptions.",
              )}
              description={t(
                "Quá trình thực nghiệm là một phần chính của sản phẩm: sàng lọc mồi, kiểm tra bẫy, xác nhận mẫu và đánh giá toàn hệ thống.",
                "Experimentation is a core part of the product: attractant screening, trap testing, sample validation, and end-to-end system evaluation.",
              )}
            />

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {experimentStages.map((card) => (
                <article
                  key={card.title.vi}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <card.icon size={21} />
                    </span>

                    <span className="rounded-full bg-[#10251f] px-3 py-1 text-[10px] font-bold text-emerald-300">
                      {card.label}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-[#16352a]">
                    {card.title[language]}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {card.description[language]}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-12 rounded-[30px] border border-amber-300/40 bg-amber-50 p-6 md:p-8">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-2 text-amber-800">
                    <FlaskConical size={20} />
                    <p className="text-xs font-bold tracking-[0.16em]">
                      EXPERIMENT EVIDENCE
                    </p>
                  </div>

                  <h3 className="mt-3 text-2xl font-bold text-[#4a3510]">
                    {t(
                      "Bằng chứng sẽ bổ sung sau thực nghiệm",
                      "Evidence will be added after experiments",
                    )}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-amber-950/70">
                    {t(
                      "Các ô dưới đây cố ý để trống. Chỉ thay bằng dữ liệu, ảnh và video do nhóm thực hiện, có ngày thử nghiệm và điều kiện đi kèm.",
                      "The fields below are intentionally left blank. Replace them only with data, images, and videos produced by the team, including the test date and conditions.",
                    )}
                  </p>
                </div>

                <span className="h-fit rounded-full bg-amber-200 px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-amber-900">
                  {t(
                    "CHỜ DỮ LIỆU THỰC NGHIỆM",
                    "AWAITING EXPERIMENT DATA",
                  )}
                </span>
              </div>

              <div className="mt-7 grid gap-4 md:grid-cols-3">
                {[
                  {
                    icon: Camera,
                    title: t(
                      "Ảnh hiện trường",
                      "Field images",
                    ),
                    description: t(
                      "Ảnh bố trí bẫy, mã trạm và điều kiện thử nghiệm.",
                      "Trap setup images, station ID, and experimental conditions.",
                    ),
                  },
                  {
                    icon: Database,
                    title: t(
                      "Dữ liệu thô",
                      "Raw data",
                    ),
                    description: t(
                      "Số trap-night, mẫu hợp lệ, số mẫu và biên bản đếm.",
                      "Trap-nights, valid samples, specimen counts, and counting records.",
                    ),
                  },
                  {
                    icon: ShieldCheck,
                    title: t(
                      "Kết quả xác minh",
                      "Validation results",
                    ),
                    description: t(
                      "Loài, giới tính hoặc nhóm loài do chuyên gia xác nhận.",
                      "Species, sex, or species group confirmed by specialists.",
                    ),
                  },
                ].map(
                  ({ icon: Icon, title, description }) => (
                    <article
                      key={title}
                      className="min-h-44 rounded-2xl border border-dashed border-amber-400/70 bg-white/70 p-5"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                        <Icon size={19} />
                      </span>

                      <h4 className="mt-4 font-bold text-[#4a3510]">
                        {title}
                      </h4>

                      <p className="mt-2 text-xs leading-5 text-amber-950/65">
                        {description}
                      </p>
                    </article>
                  ),
                )}
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Precision / Recall / mAP50",
                t(
                  "Sai số đếm so với thủ công",
                  "Counting error versus manual counting",
                ),
                t(
                  "Tỷ lệ truyền dữ liệu thành công",
                  "Successful data transmission rate",
                ),
                t(
                  "Thời gian vận hành và bảo trì",
                  "Operating and maintenance time",
                ),
              ].map((label) => (
                <article
                  key={label}
                  className="rounded-2xl border border-slate-200 bg-[#f7faf8] p-5"
                >
                  <strong className="text-3xl text-slate-300">
                    —
                  </strong>

                  <p className="mt-3 text-xs font-bold leading-5 text-slate-600">
                    {label}
                  </p>

                  <p className="mt-2 text-[9px] font-bold tracking-[0.12em] text-amber-700">
                    {t(
                      "CHỜ DỮ LIỆU THỰC NGHIỆM",
                      "AWAITING EXPERIMENT DATA",
                    )}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CUSTOMERS */}
        <section
          id="segments"
          className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 md:px-8"
        >
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <SectionHeading
              eyebrow={t(
                "MỘT HẠ TẦNG · BA TRẢI NGHIỆM",
                "ONE INFRASTRUCTURE · THREE EXPERIENCES",
              )}
              title={t(
                "Đúng thông tin cho đúng người dùng.",
                "The right information for the right user.",
              )}
              description={t(
                "MosguardX ưu tiên triển khai B2G và B2B, đồng thời chuyển hóa cảnh báo thành hướng dẫn dễ hiểu cho hộ gia đình.",
                "MosguardX prioritizes B2G and B2B deployments while translating alerts into understandable guidance for households.",
              )}
            />

            <Link
              href="/expansion"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700"
            >
              {t(
                "Xem lộ trình mở rộng",
                "View expansion roadmap",
              )}
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {segments.map(({ icon: Icon, ...segment }) => (
              <article
                key={segment.label}
                className="group rounded-3xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Icon />
                  </span>

                  <span className="rounded-full bg-[#10251f] px-3 py-1 text-[10px] font-bold text-emerald-300">
                    {segment.label}
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-bold text-[#16352a]">
                  {segment.title[language]}
                </h3>

                <p className="mt-3 min-h-18 text-sm leading-6 text-slate-600">
                  {segment.description[language]}
                </p>

                <Link
                  href={segment.href}
                  className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-emerald-700"
                >
                  {segment.action[language]}
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* BUSINESS */}
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
              {businessModel.map((card) => (
                <article
                  key={card.title.vi}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-300">
                    <card.icon size={21} />
                  </span>

                  <h3 className="mt-5 text-lg font-bold text-white">
                    {card.title[language]}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {card.description[language]}
                  </p>
                </article>
              ))}
            </div>

            <p className="mt-6 rounded-2xl border border-dashed border-amber-300/30 bg-amber-300/10 p-5 text-sm leading-6 text-amber-100">
              {t(
                "PLACEHOLDER · Bổ sung giá BOM, giá bán hoặc thuê, chi phí vận hành và biên lợi nhuận sau khi chốt prototype.",
                "PLACEHOLDER · Add BOM cost, selling or leasing price, operating cost, and profit margin after the prototype is finalized.",
              )}
            </p>
          </div>
        </section>

        {/* EXPANSION */}
        <section
          id="expansion"
          className="scroll-mt-20 bg-[#edf5f1] py-20"
        >
          <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <div className="flex items-center gap-3 text-emerald-700">
                <Globe2 size={28} />
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
                <ArrowRight size={17} />
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
              ].map((stage, index) => (
                <div
                  key={stage}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#10251f] text-sm font-bold text-emerald-300">
                    0{index + 1}
                  </span>

                  <strong className="text-sm text-[#16352a]">
                    {stage}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section
          id="team"
          className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 md:px-8"
        >
          <SectionHeading
            eyebrow={t("ĐỘI NGŨ", "TEAM")}
            title={t(
              "Một nhóm liên ngành kết nối sản phẩm, kỹ thuật và thị trường.",
              "A multidisciplinary team connecting product, technology, and market.",
            )}
            description={t(
              "Thông tin thành viên chưa cung cấp được giữ dưới dạng placeholder để nhóm bổ sung trước ngày thuyết trình.",
              "Missing member information is kept as a placeholder for the team to complete before the presentation.",
            )}
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              [
                "Trần Thị Cẩm Vân <3 ",
                t(
                  "AI, IoT và nền tảng",
                  "AI, IoT, and platform",
                ),
              ],
              [
                t("Nguyễn Ngọc Vũ"),
                t(
                  "Phần cứng và vi điều khiển",
                  "Hardware and microcontrollers",
                ),
              ],
              [
                t("Trần Thị Lương"),
                t(
                  "Mô hình kinh doanh",
                  "Business model",
                ),
              ],
              [
                t("Nguyễn Thị Thu Trang"),
                t(
                  "Vận hành và đối tác",
                  "Operations and partnerships",
                ),
              ],
                          [
                t("Phan Hoàng Quân"),
                t(
                  "AI, IoT và nền tảng",
                  "AI, IoT, and platform",
                ),
              ],
            ].map(([name, role], index) => (
              <article
                key={`${name}-${index}`}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
                  {index + 1}
                </span>

                <h3 className="mt-5 font-bold text-[#16352a]">
                  {name}
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {role}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-12 overflow-hidden rounded-[32px] bg-[#12352b] p-8 text-white md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Sparkles size={20} />
                  <span className="text-xs font-bold tracking-[0.16em]">
                    MOSGUARDX
                  </span>
                </div>

                <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                  {t(
                    "Cùng MosguardX xây dựng mạng lưới giám sát dựa trên dữ liệu.",
                    "Build a data-driven mosquito monitoring network with MosguardX.",
                  )}
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {t(
                    "Nhóm tìm kiếm đối tác chuyên môn côn trùng học, địa điểm thực nghiệm và đơn vị đồng hành cho cụm triển khai đầu tiên.",
                    "The team is seeking entomology partners, experimental sites, and organizations to support the first deployment cluster.",
                  )}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-bold text-[#10251f]"
                >
                  {t(
                    "Mở dashboard",
                    "Open dashboard",
                  )}
                </Link>

                <Link
                  href="/expansion"
                  className="rounded-xl border border-white/20 px-5 py-3.5 text-sm font-bold text-white"
                >
                  {t(
                    "Xem lộ trình",
                    "View roadmap",
                  )}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* PRESENTATION MODE */}
      {!presentationMode && (
        <button
          type="button"
          onClick={() => {
            setPresentationMode(true);
            goToSection(0);
          }}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#10251f] px-4 py-3 text-xs font-bold text-white shadow-2xl ring-1 ring-white/10 transition hover:-translate-y-0.5"
        >
          <Play size={15} fill="currentColor" />
          {t(
            "Bắt đầu thuyết trình",
            "Start presentation",
          )}
        </button>
      )}

      {presentationMode && (
        <div className="fixed inset-x-0 bottom-5 z-[70] mx-auto flex w-[calc(100%-2rem)] max-w-3xl items-center gap-3 rounded-2xl border border-white/10 bg-[#071813]/95 p-3 text-white shadow-2xl backdrop-blur-xl">
          <button
            type="button"
            aria-label={t(
              "Phần trước",
              "Previous section",
            )}
            disabled={activeSection === 0}
            onClick={() =>
              goToSection(activeSection - 1)
            }
            className="rounded-xl border border-white/10 p-2.5 text-slate-200 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3 text-[10px] font-bold tracking-[0.1em] text-emerald-300">
              <span className="truncate">
                {
                  presentationSections[
                    activeSection
                  ][language]
                }
              </span>

              <span>
                {activeSection + 1}/
                {presentationSections.length}
              </span>
            </div>

            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all"
                style={{
                  width: `${
                    ((activeSection + 1) /
                      presentationSections.length) *
                    100
                  }%`,
                }}
              />
            </div>

            <p className="mt-1.5 hidden text-[9px] text-slate-500 sm:block">
              {t(
                "Dùng ← → để chuyển phần · Esc để thoát",
                "Use ← → to navigate · Esc to exit",
              )}
            </p>
          </div>

          <button
            type="button"
            aria-label={t(
              "Phần sau",
              "Next section",
            )}
            disabled={
              activeSection ===
              presentationSections.length - 1
            }
            onClick={() =>
              goToSection(activeSection + 1)
            }
            className="rounded-xl border border-white/10 p-2.5 text-slate-200 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>

          <button
            type="button"
            aria-label={t(
              "Thoát chế độ thuyết trình",
              "Exit presentation mode",
            )}
            onClick={() =>
              setPresentationMode(false)
            }
            className="rounded-xl bg-white/10 p-2.5 text-white"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </>
  );
}

export default function LandingPage() {
  return (
    <PublicShell>
      <LandingContent />
    </PublicShell>
  );
}
