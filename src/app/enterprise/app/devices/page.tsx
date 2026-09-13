import { Cpu } from "lucide-react";

import EnterprisePlaceholder from "@/components/enterprise/enterprise-placeholder";

export default function EnterpriseDevicesPage() {
  return (
    <EnterprisePlaceholder
      icon={Cpu}
      eyebrow="ENTERPRISE · DEVICES"
      title="Device Fleet"
      description="Theo dõi toàn bộ thiết bị MosGuardX thuộc tổ chức."
      features={[
        {
          title: "Device status",
          description:
            "Theo dõi online, offline và tình trạng vận hành.",
        },
        {
          title: "Device health",
          description:
            "Theo dõi kết nối, nguồn điện và các chỉ số thiết bị.",
        },
        {
          title: "Site assignment",
          description:
            "Quản lý thiết bị theo site hoặc khu vực triển khai.",
        },
      ]}
    />
  );
}