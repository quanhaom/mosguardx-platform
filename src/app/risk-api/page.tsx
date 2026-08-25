import { Building2, Check, Code2, Gauge, ShieldAlert } from "lucide-react";
import PublicShell from "../../components/layout/public-shell";

const response = `{
  "area_id": "HN-BD-01",
  "risk_score": 78,
  "risk_level": "high",
  "confidence": 0.71,
  "signals": {
    "mosquito_density_index": 0.82,
    "trend_24h": "+18%",
    "active_stations": 3
  },
  "data_status": "illustrative"
}`;

export default function RiskApiPage() {
  return <PublicShell><main>
    <section className="bg-[#0b211b] px-5 py-20 text-white md:px-8"><div className="mx-auto max-w-7xl"><span className="rounded-full bg-amber-300/10 px-3 py-1.5 text-[10px] font-bold tracking-wider text-amber-200">B2B · STATIC API DEMO · DỮ LIỆU MINH HỌA</span><div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-end"><div><p className="text-xs font-bold tracking-[0.18em] text-emerald-300">MOSGUARDX RISK INTELLIGENCE</p><h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">Một risk-score dễ tích hợp vào quyết định kinh doanh.</h1><p className="mt-6 max-w-2xl leading-7 text-slate-300">Bản demo cho thấy cấu trúc sản phẩm dành cho khách sạn, khu công nghiệp và bảo hiểm. API thật sẽ chỉ mở khi có dữ liệu thực địa và quy trình hiệu chỉnh.</p></div><div className="rounded-3xl border border-white/10 bg-white/5 p-6"><div className="flex items-center justify-between"><div><p className="text-xs text-slate-400">Ba Đình · 14:00</p><p className="mt-1 font-bold">Risk score minh họa</p></div><Gauge className="text-amber-300" /></div><strong className="mt-8 block text-7xl text-amber-300">78</strong><div className="mt-5 h-2 rounded-full bg-white/10"><div className="h-full w-[78%] rounded-full bg-amber-300" /></div><p className="mt-4 text-sm text-slate-300">Nguy cơ cao · xu hướng tăng 18%/24h</p></div></div></div></section>
    <section className="mx-auto grid max-w-7xl gap-8 px-5 py-20 md:px-8 lg:grid-cols-[0.8fr_1.2fr]"><div><Code2 className="text-emerald-700" size={32} /><h2 className="mt-5 text-3xl font-bold text-[#16352a]">Response mẫu</h2><p className="mt-4 text-sm leading-7 text-slate-600">Cấu trúc tối giản để hệ thống đối tác đọc mức nguy cơ, độ tin cậy và các tín hiệu đóng góp. Trường <code>data_status</code> ngăn dữ liệu demo bị hiểu nhầm là dữ liệu vận hành.</p><div className="mt-7 space-y-3">{["Xác thực theo API key", "Phân vùng theo địa bàn", "Công bố thời điểm cập nhật", "Gắn nhãn chất lượng dữ liệu"].map(item => <div key={item} className="flex items-center gap-3 text-sm"><span className="rounded-full bg-emerald-50 p-1 text-emerald-700"><Check size={14} /></span>{item}</div>)}</div></div><pre className="overflow-x-auto rounded-3xl bg-[#10251f] p-6 text-sm leading-7 text-emerald-100 shadow-xl"><code>{response}</code></pre></section>
    <section className="bg-white py-20"><div className="mx-auto max-w-7xl px-5 md:px-8"><h2 className="text-3xl font-bold text-[#16352a]">Ba kịch bản sử dụng</h2><div className="mt-9 grid gap-5 md:grid-cols-3">{[[Building2,"Khách sạn & nghỉ dưỡng","Chủ động tăng biện pháp kiểm soát tại khu vực có nguy cơ."],[ShieldAlert,"Bảo hiểm","Bổ sung tín hiệu khu vực cho mô hình đánh giá, không dùng như kết luận độc lập."],[Gauge,"Khu công nghiệp","Theo dõi xu hướng tại nhiều điểm và ưu tiên lịch xử lý."]].map(([Icon,title,body])=>{const ItemIcon=Icon as typeof Gauge; return <article key={String(title)} className="rounded-2xl border border-slate-200 p-6"><ItemIcon className="text-emerald-700"/><h3 className="mt-5 font-bold text-[#16352a]">{String(title)}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{String(body)}</p></article>})}</div></div></section>
  </main></PublicShell>;
}