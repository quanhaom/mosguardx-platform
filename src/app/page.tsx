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

type Card = {
  title: string;
  description: string;
  icon: LucideIcon;
  label?: string;
};

const presentationSections = [
  { id: "hero", label: "Mở đầu" },
  { id: "problem", label: "Bài toán" },
  { id: "product", label: "Thiết bị" },
  { id: "solution", label: "Giải pháp" },
  { id: "ai", label: "AI" },
  { id: "demo", label: "Demo" },
  { id: "experiment", label: "Thực nghiệm" },
  { id: "segments", label: "Khách hàng" },
  { id: "business", label: "Kinh doanh" },
  { id: "expansion", label: "Mở rộng" },
  { id: "team", label: "Đội ngũ" },
];

const systemSteps: Card[] = [
  {
    icon: TestTube2,
    title: "Mồi dẫn dụ + CO₂",
    description: "Tạo tín hiệu thu hút mục tiêu",
  },
  {
    icon: Camera,
    title: "Camera + LED trắng",
    description: "Thu nhận ảnh trong khoang kiểm soát",
  },
  {
    icon: BrainCircuit,
    title: "AI nhận diện",
    description: "Phân loại, theo dõi và hạn chế đếm trùng",
  },
  {
    icon: MapPinned,
    title: "Bản đồ cảnh báo",
    description: "Tổng hợp mật độ theo không gian – thời gian",
  },
];

const problems: Card[] = [
  {
    icon: Users,
    title: "Khảo sát phụ thuộc nhân lực",
    description:
      "Việc đặt bẫy, thu mẫu, đếm và tổng hợp thủ công khó duy trì liên tục trên một mạng lưới lớn.",
  },
  {
    icon: Database,
    title: "Dữ liệu rời rạc và có độ trễ",
    description:
      "Kết quả ở nhiều địa điểm khó được chuẩn hóa và đối chiếu theo cùng một mốc thời gian.",
  },
  {
    icon: Bell,
    title: "Khó ưu tiên đúng điểm nóng",
    description:
      "Thiếu một lớp trực quan chung để nhận biết khu vực có mật độ hoặc tốc độ gia tăng bất thường.",
  },
];

const productModules: Card[] = [
  {
    icon: TestTube2,
    title: "Khoang mồi dẫn dụ",
    description: "Sử dụng công thức được lựa chọn qua quá trình thực nghiệm.",
  },
  {
    icon: Wifi,
    title: "Luồng khí và khoang giữ",
    description: "Đưa mẫu qua vùng quan sát và hạn chế muỗi thoát ra ngoài.",
  },
  {
    icon: Camera,
    title: "Camera và LED trắng",
    description: "Tạo điều kiện hình ảnh ổn định cho nhận diện bằng AI.",
  },
  {
    icon: Cpu,
    title: "Cảm biến và IoT",
    description: "Theo dõi môi trường, nguồn điện, kết nối và lịch bảo trì.",
  },
];

const workflow = [
  {
    number: "01",
    icon: TestTube2,
    title: "Dẫn dụ",
    description: "Mồi dẫn dụ và CO₂ tạo tín hiệu thu hút mục tiêu.",
  },
  {
    number: "02",
    icon: ScanLine,
    title: "Thu nhận",
    description: "Luồng khí đưa mẫu qua vùng quan sát được tiêu chuẩn hóa.",
  },
  {
    number: "03",
    icon: BrainCircuit,
    title: "Phân tích",
    description: "AI phát hiện, phân loại nhóm loài và theo dõi cá thể.",
  },
  {
    number: "04",
    icon: Database,
    title: "Đồng bộ",
    description: "Sự kiện được gắn thời gian, vị trí và dữ liệu môi trường.",
  },
  {
    number: "05",
    icon: Bell,
    title: "Cảnh báo",
    description: "Nền tảng tổng hợp xu hướng, điểm nóng và trạng thái thiết bị.",
  },
];

const experimentStages: Card[] = [
  {
    icon: FlaskConical,
    label: "01",
    title: "Sàng lọc mồi",
    description:
      "So sánh chuối, cỏ, ổi, mật ong và đối chứng theo thiết kế xoay vị trí.",
  },
  {
    icon: Wrench,
    label: "02",
    title: "Kiểm thử bẫy",
    description:
      "Đo khả năng giữ mẫu, độ ổn định của quạt, nguồn điện và truyền dữ liệu.",
  },
  {
    icon: ShieldCheck,
    label: "03",
    title: "Xác nhận sinh học",
    description:
      "Mẫu được mã hóa, đếm độc lập và chuyển người có chuyên môn xác nhận.",
  },
  {
    icon: CheckCircle2,
    label: "04",
    title: "Đánh giá tích hợp",
    description:
      "Đối chiếu số đếm thủ công với AI và kiểm tra bản ghi trên dashboard.",
  },
];

const segments = [
  {
    icon: Building2,
    label: "B2G",
    title: "Cơ quan y tế và chính quyền",
    description:
      "Bản đồ điểm nóng, giám sát mạng lưới và hỗ trợ ưu tiên nguồn lực.",
    href: "/dashboard",
    action: "Mở trung tâm điều hành",
  },
  {
    icon: Factory,
    label: "B2B",
    title: "Doanh nghiệp và đơn vị vận hành",
    description:
      "Theo dõi rủi ro tại trường học, khu công nghiệp, khách sạn và khu dân cư.",
    href: "/risk-api",
    action: "Xem API risk-score",
  },
  {
    icon: Home,
    label: "B2C",
    title: "Hộ gia đình",
    description:
      "Cảnh báo theo khu vực và khuyến nghị hành động ngắn, dễ thực hiện.",
    href: "/household",
    action: "Xem trải nghiệm di động",
  },
];

const businessModel: Card[] = [
  {
    icon: Cpu,
    title: "Thiết bị",
    description: "Bán hoặc cho thuê trạm theo quy mô triển khai.",
  },
  {
    icon: CircleDollarSign,
    title: "Nền tảng SaaS",
    description: "Phí theo tháng, số lượng trạm và phạm vi chức năng.",
  },
  {
    icon: Wrench,
    title: "Vận hành và bảo trì",
    description: "Lắp đặt, hiệu chuẩn, thay vật tư và bảo trì định kỳ.",
  },
  {
    icon: Database,
    title: "API và dữ liệu",
    description: "Tích hợp cho nghiên cứu hoặc hệ thống quản lý đối tác.",
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

function InfoCard({ card, inverted = false }: { card: Card; inverted?: boolean }) {
  const Icon = card.icon;

  return (
    <article
      className={`rounded-2xl border p-6 ${
        inverted
          ? "border-white/10 bg-white/[0.05]"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            inverted
              ? "bg-emerald-300/10 text-emerald-300"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          <Icon size={21} />
        </span>
        {card.label && (
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-bold ${
              inverted
                ? "bg-white/10 text-emerald-200"
                : "bg-[#10251f] text-emerald-300"
            }`}
          >
            {card.label}
          </span>
        )}
      </div>
      <h3
        className={`mt-5 text-lg font-bold ${
          inverted ? "text-white" : "text-[#16352a]"
        }`}
      >
        {card.title}
      </h3>
      <p
        className={`mt-3 text-sm leading-6 ${
          inverted ? "text-slate-300" : "text-slate-600"
        }`}
      >
        {card.description}
      </p>
    </article>
  );
}

export default function LandingPage() {
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
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (!visibleEntry) return;

        const index = presentationSections.findIndex(
          (section) => section.id === visibleEntry.target.id,
        );

        if (index >= 0) setActiveSection(index);
      },
      { threshold: [0.35, 0.55, 0.75] },
    );

    presentationSections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!presentationMode) return;

    function handleKeyboard(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.closest("button, a, input, textarea, select")) return;

      if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        goToSection(activeSection + 1);
      }

      if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        goToSection(activeSection - 1);
      }

      if (event.key === "Escape") setPresentationMode(false);
    }

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [activeSection, presentationMode]);

  return (
    <PublicShell>
      <main>
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
                HỆ SINH THÁI GIÁM SÁT MUỖI THÔNG MINH
              </span>

              <p className="mt-8 text-xs font-bold tracking-[0.2em] text-emerald-300">
                TỪ THIẾT BỊ NGOÀI THỰC ĐỊA ĐẾN BẢN ĐỒ CẢNH BÁO
              </p>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-7xl">
                Nhìn thấy rủi ro trước khi dịch bệnh lan rộng.
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                MosguardX kết hợp bẫy IoT, hình ảnh và AI để ghi nhận tín hiệu
                mật độ muỗi theo không gian – thời gian, hỗ trợ giám sát liên tục
                và ra quyết định chủ động.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="#product"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-bold text-[#10251f] transition hover:bg-emerald-300"
                >
                  Khám phá sản phẩm
                  <ArrowRight size={17} />
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-white/20 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Mở dashboard
                </Link>
              </div>

              <div className="mt-12 grid max-w-xl grid-cols-3 gap-3 border-t border-white/10 pt-7">
                {[
                  ["24/7", "Giám sát liên tục"],
                  ["AI", "Phân loại và đếm"],
                  ["01", "Nền tảng tập trung"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <strong className="text-2xl text-emerald-300">{value}</strong>
                    <p className="mt-1 text-xs text-slate-400">{label}</p>
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
                    <h2 className="mt-1 text-xl font-bold">Từ bẫy đến cảnh báo</h2>
                  </div>
                  <RadioTower className="text-emerald-300" />
                </div>

                <div className="mt-6 space-y-3">
                  {systemSteps.map(({ icon: Icon, title, description }, index) => (
                    <div
                      key={title}
                      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/10 p-4"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-300">
                        <Icon size={21} />
                      </span>
                      <div className="flex-1">
                        <p className="font-bold">{title}</p>
                        <p className="mt-1 text-xs text-slate-400">{description}</p>
                      </div>
                      <span className="text-xs font-bold text-slate-500">
                        0{index + 1}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-5 rounded-xl bg-amber-300/10 p-3 text-xs leading-5 text-amber-100">
                  Hoạt chất kiểm soát, nếu có, là module độc lập và chỉ triển khai
                  sau đánh giá an toàn, chuyên môn và pháp lý.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="problem"
          className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 md:px-8"
        >
          <SectionHeading
            eyebrow="BÀI TOÁN"
            title="Dữ liệu muỗi thường đến sau khi nguy cơ đã hình thành."
            description="MosguardX tập trung giải quyết khoảng trống giữa việc thu mẫu ngoài thực địa và khả năng nhìn thấy biến động theo khu vực."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {problems.map((card) => (
              <InfoCard key={card.title} card={card} />
            ))}
          </div>
        </section>

        <section
          id="product"
          className="scroll-mt-20 border-y border-slate-200 bg-white py-20"
        >
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <SectionHeading
              eyebrow="THIẾT BỊ MOSGUARDX"
              title="Một trạm giám sát dạng module, thiết kế cho vận hành thực địa."
              description="Thiết bị đưa mẫu qua một chuỗi có kiểm soát: dẫn dụ, hút giữ, ghi nhận hình ảnh, đo môi trường và đồng bộ dữ liệu."
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
                    HÌNH ẢNH THIẾT BỊ HOÀN THIỆN
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Thay khung này bằng ảnh prototype nền sạch hoặc ảnh render sản
                    phẩm sau khi hoàn thành lắp ráp.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {productModules.map((card) => (
                  <InfoCard key={card.title} card={card} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="solution"
          className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 md:px-8"
        >
          <SectionHeading
            eyebrow="CƠ CHẾ GIẢI PHÁP"
            title="Một chuỗi dữ liệu từ tín hiệu sinh học đến quyết định."
            description="Mỗi bước tạo ra một lớp dữ liệu có thể kiểm tra lại, thay vì chỉ trả về một con số tổng hợp."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {workflow.map(({ number, icon: Icon, title, description }) => (
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
                <p className="mt-5 text-xs font-bold text-emerald-700">{number}</p>
                <h3 className="mt-2 text-lg font-bold text-[#16352a]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="ai" className="scroll-mt-20 bg-[#0f2c24] py-20 text-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <SectionHeading
                eyebrow="AI NHẬN DIỆN"
                title="Không chỉ tìm bounding box, mà còn tạo một bản ghi có thể xác minh."
                description="Mỗi phát hiện đi kèm nhóm loài, độ tin cậy, thời gian, trạm và mã theo dõi. Trường hợp dưới ngưỡng được đưa vào hàng chờ kiểm tra thủ công."
                inverted
              />

              <div className="mt-7 space-y-3">
                {[
                  "Bounding box và phân loại nhóm loài",
                  "Theo dõi cá thể để hạn chế đếm trùng",
                  "Lưu ảnh gốc phục vụ quá trình xác minh",
                  "API tích hợp với dashboard và hệ thống đối tác",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-slate-200">
                    <CheckCircle2
                      className="mt-0.5 shrink-0 text-emerald-300"
                      size={18}
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <p className="mt-7 rounded-2xl border border-amber-300/15 bg-amber-300/10 p-4 text-xs leading-6 text-amber-100">
                AI hỗ trợ giám sát côn trùng; kết quả không phải chẩn đoán bệnh
                hoặc kết luận dịch tễ độc lập.
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
                    Nhóm loài · độ tin cậy
                  </span>
                  <span className="absolute -bottom-7 right-[-2px] bg-white/10 px-2 py-1 text-[9px] font-bold text-emerald-100">
                    TRACK ID · —
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-6 text-center">
                  <span className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-slate-300">
                    THAY BẰNG ẢNH INFERENCE THỰC TẾ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="demo"
          className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 md:px-8"
        >
          <SectionHeading
            eyebrow="TRÌNH DIỄN SẢN PHẨM"
            title="Đi từ một sự kiện tại bẫy đến hành động trên nền tảng."
            description="Trong phần thuyết trình, video thiết bị là bằng chứng vật lý; các nút bên cạnh mở trực tiếp những chức năng đang được trình diễn."
          />

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex min-h-[450px] flex-col items-center justify-center rounded-[30px] border border-dashed border-emerald-300/30 bg-[#10251f] p-8 text-center text-white shadow-xl">
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-300/10 text-emerald-300">
                <Play size={30} fill="currentColor" />
              </span>
              <h3 className="mt-6 text-2xl font-bold">VIDEO SẢN PHẨM HOẠT ĐỘNG</h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
                Thay placeholder bằng video 30–45 giây: muỗi vào bẫy → camera
                ghi nhận → AI xử lý → dashboard cập nhật.
              </p>
              <span className="mt-6 rounded-full bg-amber-300/10 px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-amber-200">
                PLACEHOLDER · DEMO VIDEO
              </span>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: BarChart3,
                  title: "Trung tâm điều hành",
                  description: "Tổng quan mạng lưới, chỉ số và xu hướng.",
                  action: "Mở dashboard",
                  href: "/dashboard",
                },
                {
                  icon: MapPinned,
                  title: "Bản đồ mật độ",
                  description: "Trạm, lớp mật độ và khu vực cảnh báo.",
                  action: "Mở bản đồ",
                  href: "/map",
                },
                {
                  icon: BrainCircuit,
                  title: "AI và API",
                  description: "Tải ảnh, xem bounding box và phản hồi mô hình.",
                  action: "Mở AI/API",
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
                    <h3 className="font-bold text-[#16352a]">{item.title}</h3>
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

        <section
          id="experiment"
          className="scroll-mt-20 border-y border-slate-200 bg-white py-20"
        >
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <SectionHeading
              eyebrow="THỰC NGHIỆM VÀ XÁC THỰC"
              title="Sản phẩm được hoàn thiện qua dữ liệu thực địa, không dựa trên giả định."
              description="Quá trình thực nghiệm là một phần chính của sản phẩm: sàng lọc mồi, kiểm tra bẫy, xác nhận mẫu và đánh giá toàn hệ thống."
            />

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {experimentStages.map((card) => (
                <InfoCard key={card.title} card={card} />
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
                    Bằng chứng sẽ bổ sung sau thực nghiệm
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-amber-950/70">
                    Các ô dưới đây cố ý để trống. Chỉ thay bằng dữ liệu, ảnh và
                    video do nhóm thực hiện, có ngày thử nghiệm và điều kiện đi
                    kèm.
                  </p>
                </div>
                <span className="h-fit rounded-full bg-amber-200 px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-amber-900">
                  CHỜ DỮ LIỆU THỰC NGHIỆM
                </span>
              </div>

              <div className="mt-7 grid gap-4 md:grid-cols-3">
                {[
                  {
                    icon: Camera,
                    title: "Ảnh hiện trường",
                    description: "Ảnh bố trí bẫy, mã trạm và điều kiện thử nghiệm.",
                  },
                  {
                    icon: Database,
                    title: "Dữ liệu thô",
                    description:
                      "Số trap-night, mẫu hợp lệ, số mẫu và biên bản đếm.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Kết quả xác minh",
                    description:
                      "Loài, giới tính hoặc nhóm loài do chuyên gia xác nhận.",
                  },
                ].map(({ icon: Icon, title, description }) => (
                  <article
                    key={title}
                    className="min-h-44 rounded-2xl border border-dashed border-amber-400/70 bg-white/70 p-5"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                      <Icon size={19} />
                    </span>
                    <h4 className="mt-4 font-bold text-[#4a3510]">{title}</h4>
                    <p className="mt-2 text-xs leading-5 text-amber-950/65">
                      {description}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Precision / Recall / mAP50",
                "Sai số đếm so với thủ công",
                "Tỷ lệ truyền dữ liệu thành công",
                "Thời gian vận hành và bảo trì",
              ].map((label) => (
                <article
                  key={label}
                  className="rounded-2xl border border-slate-200 bg-[#f7faf8] p-5"
                >
                  <strong className="text-3xl text-slate-300">—</strong>
                  <p className="mt-3 text-xs font-bold leading-5 text-slate-600">
                    {label}
                  </p>
                  <p className="mt-2 text-[9px] font-bold tracking-[0.12em] text-amber-700">
                    CHỜ DỮ LIỆU THỰC NGHIỆM
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="segments"
          className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 md:px-8"
        >
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="MỘT HẠ TẦNG · BA TRẢI NGHIỆM"
              title="Đúng thông tin cho đúng người dùng."
              description="MosguardX ưu tiên triển khai B2G và B2B, đồng thời chuyển hóa cảnh báo thành hướng dẫn dễ hiểu cho hộ gia đình."
            />
            <Link
              href="/expansion"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700"
            >
              Xem lộ trình mở rộng
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
                  {segment.title}
                </h3>
                <p className="mt-3 min-h-18 text-sm leading-6 text-slate-600">
                  {segment.description}
                </p>
                <Link
                  href={segment.href}
                  className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-emerald-700"
                >
                  {segment.action}
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section
          id="business"
          className="scroll-mt-20 bg-[#0f2c24] py-20 text-white"
        >
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <SectionHeading
              eyebrow="MÔ HÌNH KINH DOANH"
              title="Phần cứng tạo điểm dữ liệu, phần mềm tạo giá trị dài hạn."
              inverted
            />
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {businessModel.map((card) => (
                <InfoCard key={card.title} card={card} inverted />
              ))}
            </div>
            <p className="mt-6 rounded-2xl border border-dashed border-amber-300/30 bg-amber-300/10 p-5 text-sm leading-6 text-amber-100">
              PLACEHOLDER · Bổ sung giá BOM, giá bán hoặc thuê, chi phí vận hành
              và biên lợi nhuận sau khi chốt prototype.
            </p>
          </div>
        </section>

        <section
          id="expansion"
          className="scroll-mt-20 bg-[#edf5f1] py-20"
        >
          <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <div className="flex items-center gap-3 text-emerald-700">
                <Globe2 size={28} />
                <span className="text-xs font-bold tracking-[0.18em]">
                  HÀ NỘI → VIỆT NAM → KHU VỰC
                </span>
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#16352a] md:text-4xl">
                Bắt đầu bằng một cụm trạm đủ nhỏ để kiểm chứng, đủ lớn để nhìn
                thấy xu hướng.
              </h2>
              <p className="mt-5 text-sm leading-7 text-slate-600 md:text-base">
                Mỗi giai đoạn mở rộng phải đi sau dữ liệu thực nghiệm, đối tác
                chuyên môn và khả năng vận hành thực tế.
              </p>
              <Link
                href="/expansion"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white"
              >
                Xem bản đồ lộ trình
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="space-y-4">
              {[
                "Cụm thử nghiệm tại Hà Nội",
                "Mạng lưới theo tỉnh và khu vực",
                "Hợp tác nghiên cứu trong khu vực",
              ].map((stage, index) => (
                <div
                  key={stage}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#10251f] text-sm font-bold text-emerald-300">
                    0{index + 1}
                  </span>
                  <strong className="text-sm text-[#16352a]">{stage}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="team"
          className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 md:px-8"
        >
          <SectionHeading
            eyebrow="ĐỘI NGŨ"
            title="Một nhóm liên ngành kết nối sản phẩm, kỹ thuật và thị trường."
            description="Thông tin thành viên chưa cung cấp được giữ dưới dạng placeholder để nhóm bổ sung trước ngày thuyết trình."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["Phan Hoàng Quân", "AI, IoT và nền tảng"],
              ["Bổ sung tên", "Phần cứng và vi điều khiển"],
              ["Bổ sung tên", "Nghiên cứu thị trường"],
              ["Bổ sung tên", "Mô hình kinh doanh"],
              ["Bổ sung tên", "Vận hành và đối tác"],
            ].map(([name, role], index) => (
              <article
                key={`${name}-${index}`}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
                  {index + 1}
                </span>
                <h3 className="mt-5 font-bold text-[#16352a]">{name}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">{role}</p>
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
                  Cùng MosguardX xây dựng mạng lưới giám sát dựa trên dữ liệu.
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Nhóm tìm kiếm đối tác chuyên môn côn trùng học, địa điểm thực
                  nghiệm và đơn vị đồng hành cho cụm triển khai đầu tiên.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-bold text-[#10251f]"
                >
                  Mở dashboard
                </Link>
                <Link
                  href="/expansion"
                  className="rounded-xl border border-white/20 px-5 py-3.5 text-sm font-bold text-white"
                >
                  Xem lộ trình
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

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
          Bắt đầu thuyết trình
        </button>
      )}

      {presentationMode && (
        <div className="fixed inset-x-0 bottom-5 z-[70] mx-auto flex w-[calc(100%-2rem)] max-w-3xl items-center gap-3 rounded-2xl border border-white/10 bg-[#071813]/95 p-3 text-white shadow-2xl backdrop-blur-xl">
          <button
            type="button"
            aria-label="Phần trước"
            disabled={activeSection === 0}
            onClick={() => goToSection(activeSection - 1)}
            className="rounded-xl border border-white/10 p-2.5 text-slate-200 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3 text-[10px] font-bold tracking-[0.1em] text-emerald-300">
              <span className="truncate">
                {presentationSections[activeSection].label}
              </span>
              <span>
                {activeSection + 1}/{presentationSections.length}
              </span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all"
                style={{
                  width: `${
                    ((activeSection + 1) / presentationSections.length) * 100
                  }%`,
                }}
              />
            </div>
            <p className="mt-1.5 hidden text-[9px] text-slate-500 sm:block">
              Dùng ← → để chuyển phần · Esc để thoát
            </p>
          </div>

          <button
            type="button"
            aria-label="Phần sau"
            disabled={activeSection === presentationSections.length - 1}
            onClick={() => goToSection(activeSection + 1)}
            className="rounded-xl border border-white/10 p-2.5 text-slate-200 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>

          <button
            type="button"
            aria-label="Thoát chế độ thuyết trình"
            onClick={() => setPresentationMode(false)}
            className="rounded-xl bg-white/10 p-2.5 text-white"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </PublicShell>
  );
}