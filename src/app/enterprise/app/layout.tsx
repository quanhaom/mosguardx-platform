import type {
  Metadata,
} from "next";

import EnterpriseShell from "@/components/enterprise/enterprise-shell";

export const metadata: Metadata = {
  title: {
    default:
      "MosGuardX Enterprise",
    template:
      "%s | MosGuardX Enterprise",
  },

  description:
    "MosGuardX Enterprise multi-site mosquito monitoring platform.",
};

export default function EnterpriseAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <EnterpriseShell>
      {children}
    </EnterpriseShell>
  );
}