import { BellRing } from "lucide-react";

import EnterprisePlaceholder from "@/components/enterprise/enterprise-placeholder";

export default function EnterpriseAlertsPage() {
  return (
    <EnterprisePlaceholder
      icon={BellRing}
      eyebrow="ENTERPRISE · ALERTS"
      title="Alerts"
      description="Tập trung các cảnh báo từ site, thiết bị và hoạt động muỗi."
      features={[
        {
          title: "Operational alerts",
          description:
            "Cảnh báo thiết bị offline, lỗi kết nối hoặc cần kiểm tra.",
        },
        {
          title: "Mosquito activity",
          description:
            "Cảnh báo khi hoạt động muỗi thay đổi đáng chú ý.",
        },
        {
          title: "Priority workflow",
          description:
            "Phân loại cảnh báo theo mức độ và trạng thái xử lý.",
        },
      ]}
    />
  );
}