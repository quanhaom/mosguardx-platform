import { FileBarChart } from "lucide-react";

import EnterprisePlaceholder from "@/components/enterprise/enterprise-placeholder";

export default function EnterpriseReportsPage() {
  return (
    <EnterprisePlaceholder
      icon={FileBarChart}
      eyebrow="ENTERPRISE · REPORTS"
      title="Reports"
      description="Tổng hợp dữ liệu vận hành, thiết bị và hoạt động muỗi theo doanh nghiệp."
      features={[
        {
          title: "Site reports",
          description:
            "So sánh hoạt động giữa các địa điểm triển khai.",
        },
        {
          title: "Device reports",
          description:
            "Theo dõi uptime, trạng thái và lịch sử vận hành.",
        },
        {
          title: "Export",
          description:
            "Chuẩn bị báo cáo phục vụ nội bộ và đối tác.",
        },
      ]}
    />
  );
}