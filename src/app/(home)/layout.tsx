import type { Metadata } from "next";
import HomeShell from "@/components/home/home-shell";

export const metadata: Metadata = {
  title: {
    default: "MosGuardX Home",
    template: "%s | MosGuardX Home",
  },
  description:
    "Theo dõi hoạt động muỗi và điều kiện môi trường tại ngôi nhà của bạn.",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <HomeShell>
      {children}
    </HomeShell>
  );
}