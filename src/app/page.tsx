"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight, Building2, Camera, CheckCircle2, CircleDashed,
  Factory, Globe2, Home, MapPinned, Play, RadioTower, Sparkles, TestTube2,
} from "lucide-react";
import PublicShell from "@/components/layout/public-shell";

const copy = {
  vi: {
    eyebrow: "MẠNG LƯỚI GIÁM SÁT MUỖI THÔNG MINH",
    title: "Nhìn thấy rủi ro trước khi dịch bệnh lan rộng.",
    description: "MosguardX kết hợp bẫy IoT, hình ảnh và AI để tạo tín hiệu mật độ muỗi theo không gian - thời gian, hỗ trợ cảnh báo sớm và ra quyết định chủ động.",
    primary: "Khám phá giải pháp", secondary: "Mở dashboard", proof: "Bằng chứng MVP",
    proofText: "Website trình bày trung thực trạng thái phát triển. Video prototype thật sẽ được nhúng tại đây sau vòng lắp ráp và kiểm thử phần cứng.",
  },
  en: {
    eyebrow: "INTELLIGENT MOSQUITO SURVEILLANCE NETWORK",
    title: "See the risk before an outbreak spreads.",
    description: "MosguardX combines IoT traps, imaging and AI to generate spatio-temporal mosquito-density signals for early warning and proactive decisions.",
    primary: "Explore the solution", secondary: "Open dashboard", proof: "MVP evidence",
    proofText: "This website reports development status transparently. A real prototype video will be embedded here after hardware assembly and testing.",
  },
};

const statuses = [
  { name: "Nền tảng web vận hành", detail: "Dashboard, bản đồ, cảnh báo và báo cáo đã có", state: "Đã hoàn thành", tone: "done" },
  { name: "AI nhận diện ảnh", detail: "YOLO baseline đã đánh giá và tích hợp API thử nghiệm", state: "Đang cải thiện", tone: "progress" },
  { name: "Thiết kế thiết bị", detail: "Kiến trúc phần cứng, bản vẽ và BOM V1 đã hoàn thiện", state: "Sẵn sàng lắp", tone: "progress" },
  { name: "Prototype vật lý", detail: "Chờ linh kiện, lắp ráp và video kiểm thử thật", state: "Chưa có bằng chứng", tone: "pending" },
  { name: "Dữ liệu thực địa", detail: "Hiện dùng dữ liệu minh họa có gắn nhãn rõ ràng", state: "Chờ thử nghiệm", tone: "pending" },
];

const segments = [
  { icon: Building2, label: "B2G", title: "Cơ quan y tế & chính quyền", description: "Dashboard điểm nóng, giám sát mạng lưới và hỗ trợ phân bổ nguồn lực.", href: "/dashboard", action: "Mở trung tâm điều hành" },
  { icon: Factory, label: "B2B", title: "Doanh nghiệp & bảo hiểm", description: "Risk-score theo khu vực cho khách sạn, khu công nghiệp và đánh giá rủi ro.", href: "/risk-api", action: "Xem API risk-score" },
  { icon: Home, label: "B2C", title: "Hộ gia đình", description: "Cảnh báo dễ hiểu, khuyến nghị hành động và theo dõi nguy cơ quanh nơi ở.", href: "/household", action: "Xem cảnh báo hộ dân" },
];

export default function LandingPage() {
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const text = copy[language];

  return (
    <PublicShell>
      <main>
        <section
          id="overview"
          className="relative scroll-mt-20 overflow-hidden bg-[#0b211b] text-white"
        >
          <div className="absolute inset-0 landing-grid opacity-25" />
          <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="relative mx-auto grid min-h-[740px] max-w-7xl items-center gap-14 px-5 py-20 md:px-8 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <div className="mb-8 flex items-center gap-4">
                <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.18em] text-emerald-300">STARTUP BA 2026 · MVP</span>
                <div className="flex rounded-full border border-white/15 p-1 text-xs">
                  {(["vi", "en"] as const).map((item) => (
                    <button key={item} type="button" onClick={() => setLanguage(item)} className={`rounded-full px-3 py-1.5 font-bold ${language === item ? "bg-white text-[#10251f]" : "text-slate-300"}`}>{item.toUpperCase()}</button>
                  ))}
                </div>
              </div>
              <p className="text-xs font-bold tracking-[0.2em] text-emerald-300">{text.eyebrow}</p>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-7xl">{text.title}</h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">{text.description}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="#solution" className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-bold text-[#10251f]">{text.primary}<ArrowRight size={17} /></Link>
                <Link href="/dashboard" className="rounded-xl border border-white/20 px-5 py-3.5 text-sm font-bold text-white">{text.secondary}</Link>
              </div>
              <div className="mt-12 grid max-w-xl grid-cols-3 gap-3 border-t border-white/10 pt-7">
                {[["3", "Phân khúc"], ["5", "Khối MVP"], ["01", "Nền tảng chung"]].map(([value, label]) => <div key={label}><strong className="text-2xl text-emerald-300">{value}</strong><p className="mt-1 text-xs text-slate-400">{label}</p></div>)}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-5 rounded-[36px] border border-emerald-300/10" />
              <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur">
                <div className="flex items-center justify-between border-b border-white/10 pb-5"><div><p className="text-[10px] font-bold tracking-[0.18em] text-emerald-300">LIVE CONCEPT</p><h2 className="mt-1 text-xl font-bold">Từ bẫy đến cảnh báo</h2></div><RadioTower className="text-emerald-300" /></div>
                <div className="mt-6 space-y-3">
                  {[[TestTube2, "ATSB + CO₂", "Tín hiệu dẫn dụ chính"], [Camera, "Camera + LED trắng", "Thu nhận ảnh có kiểm soát"], [Sparkles, "AI inference", "Phát hiện và ước lượng mật độ"], [MapPinned, "Risk map", "Cảnh báo theo không gian - thời gian"]].map(([Icon, title, note], index) => {
                    const StepIcon = Icon as typeof Camera;
                    return <div key={String(title)} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/10 p-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-300"><StepIcon size={21} /></span><div className="flex-1"><p className="font-bold">{String(title)}</p><p className="mt-1 text-xs text-slate-400">{String(note)}</p></div><span className="text-xs font-bold text-slate-500">0{index + 1}</span></div>;
                  })}
                </div>
                <p className="mt-5 rounded-xl bg-amber-300/10 p-3 text-xs leading-5 text-amber-100">LED UV là tín hiệu phụ trợ chi phí thấp, không phải cơ chế dẫn dụ trung tâm.</p>
              </div>
            </div>
          </div>
        </section>

    <section
      id="demo"
      className="scroll-mt-20 bg-[#f4f8f6] py-20"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="flex min-h-[430px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-[#10251f] p-8 text-center text-white shadow-xl">
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-300/10 text-emerald-300"><Play size={30} fill="currentColor" /></span>
              <h2 className="mt-6 text-2xl font-bold">{text.proof}</h2><p className="mt-3 max-w-md text-sm leading-6 text-slate-300">{text.proofText}</p>
              <span className="mt-6 rounded-full bg-amber-300/10 px-4 py-2 text-xs font-bold text-amber-200">VIDEO PROTOTYPE · CHỜ NHÓM CUNG CẤP</span>
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-emerald-700">TRẠNG THÁI TRIỂN KHAI</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#16352a]">Một MVP có lộ trình, không phải một dashboard giả lập.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">Mỗi hạng mục được công bố đúng trạng thái để phân biệt phần đã hoàn thành, đang phát triển và bằng chứng còn thiếu.</p>
              <div className="mt-7 space-y-3">
                {statuses.map((item) => <article key={item.name} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">{item.tone === "done" ? <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={20} /> : <CircleDashed className={`mt-0.5 shrink-0 ${item.tone === "progress" ? "text-amber-500" : "text-slate-400"}`} size={20} />}<div className="flex-1"><h3 className="text-sm font-bold text-[#16352a]">{item.name}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p></div><span className="hidden h-fit rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 sm:block">{item.state}</span></article>)}
              </div>
            </div>
          </div>
          </div>
        </section>

        <section id="solution" className="scroll-mt-20 bg-white py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="max-w-3xl"><p className="text-xs font-bold tracking-[0.18em] text-emerald-700">CƠ CHẾ GIẢI PHÁP</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-[#16352a] md:text-4xl">Một chuỗi dữ liệu từ tín hiệu sinh học đến quyết định.</h2></div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[["01", "Dẫn dụ", "ATSB mùi đường - trái cây lên men và CO₂ là tín hiệu chính; UV chỉ hỗ trợ."], ["02", "Thu nhận", "Luồng khí đưa mẫu qua vùng quan sát có nền và ánh sáng trắng ổn định."], ["03", "Phân tích", "AI phát hiện đối tượng, ước lượng mật độ và ghi nhận tín hiệu theo thời gian."], ["04", "Cảnh báo", "Dữ liệu tổng hợp thành điểm nóng và mức nguy cơ phục vụ từng nhóm người dùng."]].map(([number, title, description]) => <article key={number} className="rounded-2xl border border-slate-200 bg-[#f7faf8] p-6"><span className="text-xs font-bold text-emerald-700">{number}</span><h3 className="mt-5 text-lg font-bold text-[#16352a]">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{description}</p></article>)}
            </div>
          </div>
        </section>

        <section id="segments" className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div className="max-w-3xl"><p className="text-xs font-bold tracking-[0.18em] text-emerald-700">MỘT HẠ TẦNG · BA TRẢI NGHIỆM</p><h2 className="mt-3 text-3xl font-bold text-[#16352a] md:text-4xl">Đúng sản phẩm cho đúng người dùng.</h2></div><Link href="/expansion" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700">Xem lộ trình mở rộng <ArrowRight size={16} /></Link></div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {segments.map(({ icon: Icon, ...segment }) => <article key={segment.label} className="group rounded-3xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl"><div className="flex items-start justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Icon /></span><span className="rounded-full bg-[#10251f] px-3 py-1 text-[10px] font-bold text-emerald-300">{segment.label}</span></div><h3 className="mt-7 text-xl font-bold text-[#16352a]">{segment.title}</h3><p className="mt-3 min-h-18 text-sm leading-6 text-slate-600">{segment.description}</p><Link href={segment.href} className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">{segment.action}<ArrowRight size={16} className="transition group-hover:translate-x-1" /></Link></article>)}
          </div>
        </section>

        <section className="bg-[#12352b] py-16 text-white">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 md:flex-row md:items-center md:px-8"><div className="max-w-2xl"><div className="flex items-center gap-3 text-emerald-300"><Globe2 /><span className="text-xs font-bold tracking-[0.18em]">VIỆT NAM → ĐÔNG DƯƠNG</span></div><h2 className="mt-4 text-3xl font-bold">Thí điểm tại Hà Nội, thiết kế để nhân rộng theo vùng.</h2><p className="mt-3 text-sm leading-6 text-slate-300">Cấu trúc dữ liệu đa cấp hỗ trợ tỉnh, khu vực và mạng lưới đối tác trong lộ trình mở rộng.</p></div><Link href="/expansion" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-bold text-[#10251f]">Xem bản đồ lộ trình <ArrowRight size={17} /></Link></div>
        </section>
      </main>
    </PublicShell>
  );
}