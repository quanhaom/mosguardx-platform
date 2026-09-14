import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import DashboardShell from "@/components/layout/dashboard-shell";
import { LanguageProvider } from "@/components/i18n/language-context";
import SCNCController from "@/components/scnc/scnc-controller";

import "./globals.css";

const geistSans = Geist({
  variable:
    "--font-geist-sans",
  subsets: [
    "latin",
    "vietnamese",
  ],
});

const geistMono = Geist_Mono({
  variable:
    "--font-geist-mono",
  subsets: [
    "latin",
    "vietnamese",
  ],
});

export const metadata: Metadata = {
  title: {
    default:
      "MosguardX | Cảnh báo sớm nguy cơ dịch tễ",
    template:
      "%s | MosguardX",
  },

  description:
    "Nền tảng giám sát muỗi thông minh và cảnh báo sớm nguy cơ dịch tễ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <DashboardShell>
            {children}
          </DashboardShell>

          <SCNCController />
        </LanguageProvider>
      </body>
    </html>
  );
}