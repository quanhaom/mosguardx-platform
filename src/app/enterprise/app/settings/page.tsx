import {
  Bell,
  Building2,
  CheckCircle2,
  Cloud,
  LockKeyhole,
  Radio,
  Settings,
  ShieldCheck,
} from "lucide-react";

export default function EnterpriseSettingsPage() {
  return (
    <div className="space-y-6">
      {/* HERO */}

      <section className="rounded-[30px] bg-[#16352a] p-7 text-white md:p-9">
        <p className="text-[10px] font-bold tracking-[0.18em] text-emerald-300">
          ENTERPRISE · SETTINGS
        </p>

        <h2 className="mt-4 text-3xl font-bold md:text-4xl">
          Enterprise Settings
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          Cấu hình tổ chức, cảnh báo,
          bảo mật và tích hợp nền tảng
          Enterprise.
        </p>
      </section>

      {/* ORGANIZATION */}

      <SettingsSection
        icon={Building2}
        eyebrow="ORGANIZATION"
        title="Organization profile"
        description="Thông tin đại diện cho tài khoản Enterprise."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Organization name"
            value="MosGuardX Demo Enterprise"
          />

          <Field
            label="Workspace ID"
            value="MGX-ENT-DEMO"
          />

          <Field
            label="Country"
            value="Vietnam"
          />

          <Field
            label="Timezone"
            value="Asia/Ho_Chi_Minh"
          />
        </div>
      </SettingsSection>

      {/* ALERTS */}

      <SettingsSection
        icon={Bell}
        eyebrow="NOTIFICATIONS"
        title="Alert preferences"
        description="Những loại sự kiện dự kiến được gửi tới đội vận hành."
      >
        <div className="space-y-3">
          <Preference
            title="High mosquito activity"
            description="Cảnh báo khi activity index vượt ngưỡng."
            enabled
          />

          <Preference
            title="Device offline"
            description="Thông báo khi một station ngừng đồng bộ dữ liệu."
            enabled
          />

          <Preference
            title="Maintenance due"
            description="Nhắc lịch kiểm tra và bảo trì thiết bị."
            enabled
          />

          <Preference
            title="Weekly summary"
            description="Tổng hợp hoạt động toàn bộ Enterprise network."
          />
        </div>
      </SettingsSection>

      {/* SECURITY */}

      <SettingsSection
        icon={LockKeyhole}
        eyebrow="ACCESS & SECURITY"
        title="Workspace security"
        description="Cấu hình kiểm soát quyền truy cập Enterprise."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <StatusCard
            icon={ShieldCheck}
            title="Role-based access"
            text="Owner, Manager, Technician và Viewer."
            status="Planned"
          />

          <StatusCard
            icon={LockKeyhole}
            title="Two-factor authentication"
            text="Tăng cường xác thực cho tài khoản tổ chức."
            status="Planned"
          />
        </div>
      </SettingsSection>

      {/* INTEGRATIONS */}

      <SettingsSection
        icon={Cloud}
        eyebrow="INTEGRATIONS"
        title="External integrations"
        description="Chuẩn bị kết nối Enterprise với các hệ thống bên ngoài."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Integration
            icon={Radio}
            title="MosGuardX API"
            description="Device, event và alert API."
          />

          <Integration
            icon={Cloud}
            title="Cloud export"
            description="Đồng bộ dữ liệu báo cáo."
          />

          <Integration
            icon={Bell}
            title="Notification channel"
            description="Email hoặc webhook."
          />
        </div>
      </SettingsSection>

      <div className="rounded-[24px] border border-amber-100 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <Settings
            size={19}
            className="mt-0.5 shrink-0 text-amber-700"
          />

          <div>
            <h3 className="text-sm font-bold text-amber-900">
              Configuration Preview
            </h3>

            <p className="mt-1 text-xs leading-6 text-amber-700">
              Các giá trị trên chưa được
              lưu vào backend. Khi có
              authentication và database,
              phần này sẽ được nối vào
              organization settings thật.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({
  icon: Icon,
  eyebrow,
  title,
  description,
  children,
}: {
  icon: typeof Building2;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 md:p-7">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Icon size={20} />
        </span>

        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-emerald-700">
            {eyebrow}
          </p>

          <h3 className="mt-1 text-lg font-bold text-[#16352a]">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-6">
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </label>

      <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-[#16352a]">
        {value}
      </div>
    </div>
  );
}

function Preference({
  title,
  description,
  enabled = false,
}: {
  title: string;
  description: string;
  enabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
      <div>
        <p className="text-sm font-bold text-[#16352a]">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <span
        className={`flex h-7 w-12 shrink-0 items-center rounded-full p-1 ${
          enabled
            ? "justify-end bg-emerald-500"
            : "justify-start bg-slate-300"
        }`}
      >
        <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
      </span>
    </div>
  );
}

function StatusCard({
  icon: Icon,
  title,
  text,
  status,
}: {
  icon: typeof ShieldCheck;
  title: string;
  text: string;
  status: string;
}) {
  return (
    <article className="rounded-2xl bg-slate-50 p-5">
      <Icon
        size={20}
        className="text-emerald-700"
      />

      <h4 className="mt-4 text-sm font-bold text-[#16352a]">
        {title}
      </h4>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {text}
      </p>

      <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-bold text-amber-700">
        {status}
      </span>
    </article>
  );
}

function Integration({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Radio;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
        <Icon size={17} />
      </span>

      <h4 className="mt-4 text-sm font-bold text-[#16352a]">
        {title}
      </h4>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

      <div className="mt-4 flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
        <CheckCircle2 size={12} />
        READY FOR INTEGRATION
      </div>
    </article>
  );
}