"use client";

import type { ReactNode } from "react";
import PublicHeader from "@/components/layout/public-header";
import { LanguageProvider } from "@/components/i18n/language-context";

export default function PublicShell({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#f7faf8]">
        <PublicHeader />
        {children}
      </div>
    </LanguageProvider>
  );
}
