import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import DashboardShell from "@/components/layout/dashboard-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "vietnamese"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: {
    default: "MosguardX Operations",
    template: "%s | MosguardX",
  },
  description:
    "NÃƒÂ¡Ã‚Â»Ã‚Ân tÃƒÂ¡Ã‚ÂºÃ‚Â£ng giÃƒÆ’Ã‚Â¡m sÃƒÆ’Ã‚Â¡t muÃƒÂ¡Ã‚Â»Ã¢â‚¬â€i thÃƒÆ’Ã‚Â´ng minh vÃƒÆ’Ã‚Â  cÃƒÂ¡Ã‚ÂºÃ‚Â£nh bÃƒÆ’Ã‚Â¡o dÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¹ch tÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¦ sÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
