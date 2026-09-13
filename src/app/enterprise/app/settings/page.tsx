import { Settings } from "lucide-react";

import EnterprisePlaceholder from "@/components/enterprise/enterprise-placeholder";

export default function EnterpriseSettingsPage() {
  return (
    <EnterprisePlaceholder
      icon={Settings}
      eyebrow="ENTERPRISE · SETTINGS"
      title="Enterprise Settings"
      description="Cấu hình tổ chức, thông báo và các tùy chọn nền tảng."
      features={[
        {
          title: "Organization",
          description:
            "Tên doanh nghiệp, thông tin liên hệ và cấu hình tổ chức.",
        },
        {
          title: "Notifications",
          description:
            "Thiết lập các loại cảnh báo được gửi tới người dùng.",
        },
        {
          title: "Integrations",
          description:
            "Chuẩn bị cho API và tích hợp hệ thống bên ngoài.",
        },
      ]}
    />
  );
}