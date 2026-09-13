import { Users } from "lucide-react";

import EnterprisePlaceholder from "@/components/enterprise/enterprise-placeholder";

export default function EnterpriseTeamPage() {
  return (
    <EnterprisePlaceholder
      icon={Users}
      eyebrow="ENTERPRISE · TEAM"
      title="Team"
      description="Quản lý người dùng và quyền truy cập trong tổ chức."
      features={[
        {
          title: "Owner",
          description:
            "Quản trị toàn bộ tài khoản Enterprise.",
        },
        {
          title: "Manager",
          description:
            "Quản lý site, thiết bị và báo cáo.",
        },
        {
          title: "Technician / Viewer",
          description:
            "Nhân viên kỹ thuật hoặc người dùng chỉ xem dữ liệu.",
        },
      ]}
    />
  );
}