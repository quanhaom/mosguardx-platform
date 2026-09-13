import { Wrench } from "lucide-react";

import EnterprisePlaceholder from "@/components/enterprise/enterprise-placeholder";

export default function EnterpriseMaintenancePage() {
  return (
    <EnterprisePlaceholder
      icon={Wrench}
      eyebrow="ENTERPRISE · MAINTENANCE"
      title="Maintenance"
      description="Quản lý lịch kiểm tra, bảo trì và thay vật tư của hệ thống."
      features={[
        {
          title: "Maintenance schedule",
          description:
            "Theo dõi lịch bảo trì định kỳ của từng thiết bị.",
        },
        {
          title: "Consumables",
          description:
            "Theo dõi cartridge và vật tư cần thay thế.",
        },
        {
          title: "Technician workflow",
          description:
            "Giao việc và theo dõi trạng thái công việc kỹ thuật.",
        },
      ]}
    />
  );
}