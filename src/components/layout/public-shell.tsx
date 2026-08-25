import PublicHeader from "@/components/layout/public-header";

export default function PublicShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f4f8f6]">
      <PublicHeader />

      {children}

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 py-8 text-xs text-slate-500 md:flex-row md:px-8">
          <p>© 2026 MosguardX · Startup BA 2026 prototype</p>
          <p>Dữ liệu minh họa không thay thế kết luận dịch tễ chính thức.</p>
        </div>
      </footer>
    </div>
  );
}