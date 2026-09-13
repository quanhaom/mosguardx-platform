import type { Metadata } from "next";

import EnterpriseShell from "@/components/enterprise/enterprise-shell";

export const metadata: Metadata = {
  title:
    "MosGuardX Enterprise",

  description:
    "MosGuardX Enterprise B2B workspace.",
};

export default function EnterpriseAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EnterpriseShell>
      {children}
    </EnterpriseShell>
  );
}