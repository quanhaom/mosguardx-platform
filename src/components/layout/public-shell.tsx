"use client";

import type {
  ReactNode,
} from "react";

import PublicHeader from "@/components/layout/public-header";

export default function PublicShell({
  children,
}: {
  children:
    ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7faf8]">
      <PublicHeader />

      {children}
    </div>
  );
}