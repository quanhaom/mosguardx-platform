import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b211b]/90 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-[#10251f]">
            <ShieldCheck size={23} />
          </span>
          <span>
            <strong className="block text-lg leading-none">MosguardX</strong>
            <small className="text-[9px] font-bold tracking-[0.2em] text-emerald-300">
              EARLY WARNING NETWORK
            </small>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link href="/#solution" className="hover:text-white">Giải pháp</Link>
          <Link href="/#demo" className="hover:text-white">Demo</Link>
          <Link
            href="/product-3d"
            className="rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 font-semibold text-emerald-300 transition hover:border-emerald-300/45 hover:bg-emerald-300/15 hover:text-emerald-200"
          >
            Mô hình 3D
          </Link>
          <Link href="/#segments" className="hover:text-white">Phân khúc</Link>
          <Link href="/expansion" className="hover:text-white">Mở rộng</Link>
        </nav>
        <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-bold text-[#10251f]">
          Dashboard <ArrowRight size={15} />
        </Link>
      </div>
    </header>
  );
}
