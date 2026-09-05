"use client";

import dynamic from "next/dynamic";

const Demo3DataCanvas = dynamic(
  () => import("@/components/product-3d/demo3-data-canvas"),
  {
    ssr: false,
    loading: () => (
      <main className="grid min-h-screen place-items-center bg-[#030807] text-white">
        <div className="rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-emerald-300 backdrop-blur-xl">
          ĐANG KHỞI TẠO DATA CANVAS
        </div>
      </main>
    ),
  },
);

export default function ImageFlowPage() {
  return <Demo3DataCanvas />;
}
