import {
  CheckCircle2,
  Crown,
  ShieldCheck,
  UserRound,
  Users,
  Wrench,
} from "lucide-react";

const members = [
  {
    id: "USR-001",
    name: "Nguyễn Minh Anh",
    email:
      "minhanh@enterprise.demo",
    role: "Owner",
    scope: "All sites",
    status: "Active",
  },
  {
    id: "USR-002",
    name: "Trần Đức Long",
    email:
      "duclong@enterprise.demo",
    role: "Manager",
    scope: "Hotel Site B",
    status: "Active",
  },
  {
    id: "USR-003",
    name: "Lê Ngọc Hà",
    email:
      "ngocha@enterprise.demo",
    role: "Manager",
    scope: "Facility C",
    status: "Active",
  },
  {
    id: "USR-004",
    name: "Phạm Minh Tú",
    email:
      "minhtu@enterprise.demo",
    role: "Technician",
    scope: "All sites",
    status: "Active",
  },
  {
    id: "USR-005",
    name: "Hoàng Nam",
    email:
      "hoangnam@enterprise.demo",
    role: "Viewer",
    scope: "Office Building A",
    status: "Active",
  },
];

const roles = [
  {
    icon: Crown,
    name: "Owner",
    description:
      "Toàn quyền với tổ chức và cấu hình Enterprise.",
  },
  {
    icon: ShieldCheck,
    name: "Manager",
    description:
      "Quản lý site, thiết bị, cảnh báo và báo cáo.",
  },
  {
    icon: Wrench,
    name: "Technician",
    description:
      "Xử lý bảo trì và công việc tại hiện trường.",
  },
  {
    icon: UserRound,
    name: "Viewer",
    description:
      "Theo dõi dữ liệu nhưng không thay đổi cấu hình.",
  },
];

export default function EnterpriseTeamPage() {
  return (
    <div className="space-y-6">
      {/* HERO */}

      <section className="rounded-[30px] bg-[#16352a] p-7 text-white md:p-9">
        <p className="text-[10px] font-bold tracking-[0.18em] text-emerald-300">
          ENTERPRISE · TEAM
        </p>

        <h2 className="mt-4 text-3xl font-bold md:text-4xl">
          Organization & Roles
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          Quản lý thành viên, phạm vi
          truy cập và vai trò vận hành
          trong tổ chức Enterprise.
        </p>
      </section>

      {/* KPI */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TeamMetric
          label="Members"
          value={`${members.length}`}
        />

        <TeamMetric
          label="Managers"
          value={`${
            members.filter(
              (member) =>
                member.role ===
                "Manager",
            ).length
          }`}
        />

        <TeamMetric
          label="Technicians"
          value={`${
            members.filter(
              (member) =>
                member.role ===
                "Technician",
            ).length
          }`}
        />

        <TeamMetric
          label="Active"
          value={`${
            members.filter(
              (member) =>
                member.status ===
                "Active",
            ).length
          }`}
        />
      </section>

      {/* ROLE MODEL */}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {roles.map(
          ({
            icon: Icon,
            name,
            description,
          }) => (
            <article
              key={name}
              className="rounded-[24px] border border-slate-200 bg-white p-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Icon size={18} />
              </span>

              <h3 className="mt-5 text-sm font-bold text-[#16352a]">
                {name}
              </h3>

              <p className="mt-2 text-xs leading-6 text-slate-500">
                {description}
              </p>
            </article>
          ),
        )}
      </section>

      {/* MEMBER TABLE */}

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] text-emerald-700">
              ORGANIZATION
            </p>

            <h3 className="mt-1 text-xl font-bold text-[#16352a]">
              Team members
            </h3>
          </div>

          <Users
            size={21}
            className="text-emerald-700"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-6 py-4">
                  Member
                </th>

                <th className="px-6 py-4">
                  Role
                </th>

                <th className="px-6 py-4">
                  Access
                </th>

                <th className="px-6 py-4">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {members.map(
                (member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                          {member.name
                            .split(" ")
                            .slice(-2)
                            .map(
                              (part) =>
                                part[0],
                            )
                            .join("")}
                        </span>

                        <div>
                          <strong className="block text-sm text-[#16352a]">
                            {member.name}
                          </strong>

                          <span className="mt-1 block text-[10px] text-slate-400">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                        {member.role}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {member.scope}
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700">
                        <CheckCircle2
                          size={14}
                        />

                        {member.status}
                      </span>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 text-xs leading-6 text-amber-800">
        Team management hiện là UI
        preview. Chưa có chức năng mời
        người dùng hoặc thay đổi quyền
        thật.
      </div>
    </div>
  );
}

function TeamMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-[22px] border border-slate-200 bg-white p-5">
      <p className="text-xs font-semibold text-slate-500">
        {label}
      </p>

      <strong className="mt-2 block text-3xl font-black text-[#16352a]">
        {value}
      </strong>
    </article>
  );
}