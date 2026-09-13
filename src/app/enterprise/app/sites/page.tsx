import { Layers3 } from "lucide-react";

import EnterprisePlaceholder from "@/components/enterprise/enterprise-placeholder";

export default function EnterpriseSitesPage() {
  return (
    <EnterprisePlaceholder
      icon={Layers3}
      eyebrow="ENTERPRISE · SITES"
      title="Sites"
      description="Quản lý các cơ sở và địa điểm đang triển khai MosGuardX."
      features={[
        {
          title: "Multi-site management",
          description:
            "Quản lý nhiều cơ sở trong cùng một tài khoản doanh nghiệp.",
        },
        {
          title: "Site information",
          description:
            "Theo dõi tên site, địa chỉ, người phụ trách và trạng thái.",
        },
        {
          title: "Device allocation",
          description:
            "Xác định các thiết bị MosGuardX thuộc từng địa điểm.",
        },
      ]}
    />
  );
}