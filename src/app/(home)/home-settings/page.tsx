"use client";

import {
  Bell,
  BellRing,
  Check,
  ChevronRight,
  CloudRain,
  Home,
  LockKeyhole,
  Moon,
  ShieldCheck,
  Smartphone,
  UserRound,
  Wifi,
} from "lucide-react";
import { useState } from "react";

import {
  homeDevice,
  homeSummary,
} from "@/lib/home/mock-data";

export default function HomeSettingsPage() {
  const [householdName, setHouseholdName] =
    useState(homeSummary.householdName);

  const [deviceName, setDeviceName] =
    useState(homeDevice.name);

  const [
    mosquitoAlerts,
    setMosquitoAlerts,
  ] = useState(true);

  const [
    weatherAlerts,
    setWeatherAlerts,
  ] = useState(true);

  const [
    deviceAlerts,
    setDeviceAlerts,
  ] = useState(true);

  const [
    cartridgeAlerts,
    setCartridgeAlerts,
  ] = useState(true);

  const [
    quietHours,
    setQuietHours,
  ] = useState(true);

  const [
    eventImages,
    setEventImages,
  ] = useState(true);

  const [
    analyticsSharing,
    setAnalyticsSharing,
  ] = useState(false);

  const [saved, setSaved] =
    useState(false);

  const handleSave = () => {
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-emerald-700">
            MOSGUARDX HOME
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#16352a] sm:text-4xl">
            Cài đặt
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Quản lý ngôi nhà, thiết bị,
            cảnh báo và quyền riêng tư của
            tài khoản MosGuardX Home.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#16352a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#214c3d]"
        >
          {saved ? (
            <>
              <Check size={17} />
              Đã lưu
            </>
          ) : (
            "Lưu thay đổi"
          )}
        </button>
      </section>

      {/* Household */}
      <section className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-sm">
        <SectionHeader
          icon={Home}
          eyebrow="NGÔI NHÀ"
          title="Thông tin nhà của bạn"
          description="Tên này được dùng để phân biệt khi bạn quản lý nhiều địa điểm."
        />

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field
            label="Tên ngôi nhà"
            value={householdName}
            onChange={setHouseholdName}
            placeholder="Ví dụ: Nhà Hà Nội"
          />

          <div>
            <label className="text-sm font-semibold text-[#16352a]">
              Khu vực
            </label>

            <div className="mt-2 flex min-h-[48px] items-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500">
              Hà Nội
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Được dùng để lấy dữ liệu thời
              tiết khu vực và bối cảnh môi
              trường.
            </p>
          </div>
        </div>
      </section>

      {/* Device */}
      <section className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-sm">
        <SectionHeader
          icon={Smartphone}
          eyebrow="THIẾT BỊ"
          title="MosGuardX của bạn"
          description="Đặt tên dễ nhớ cho thiết bị theo vị trí lắp đặt."
        />

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field
            label="Tên thiết bị"
            value={deviceName}
            onChange={setDeviceName}
            placeholder="Ví dụ: Ban công tầng 3"
          />

          <div>
            <label className="text-sm font-semibold text-[#16352a]">
              Device ID
            </label>

            <div className="mt-2 flex min-h-[48px] items-center rounded-xl border border-slate-200 bg-slate-50 px-4 font-mono text-sm text-slate-500">
              {homeDevice.id}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <SettingsAction
            icon={Wifi}
            title="Cấu hình Wi-Fi"
            description="Thay đổi mạng mà thiết bị đang kết nối"
          />

          <SettingsAction
            icon={Smartphone}
            title="Thêm thiết bị mới"
            description="Ghép một MosGuardX khác vào ngôi nhà"
          />
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-sm">
        <SectionHeader
          icon={BellRing}
          eyebrow="THÔNG BÁO"
          title="Bạn muốn được cảnh báo khi nào?"
          description="MosGuardX chỉ gửi những thông báo có ý nghĩa đối với nhà của bạn."
        />

        <div className="mt-6 divide-y divide-slate-100">
          <SettingToggle
            icon={Bell}
            title="Hoạt động muỗi bất thường"
            description="Thông báo khi số lần ghi nhận tăng đáng kể so với mức thường thấy tại nhà bạn."
            checked={mosquitoAlerts}
            onChange={setMosquitoAlerts}
          />

          <SettingToggle
            icon={CloudRain}
            title="Thời tiết thuận lợi cho muỗi"
            description="Cảnh báo khi mưa, độ ẩm và các điều kiện môi trường có xu hướng thuận lợi."
            checked={weatherAlerts}
            onChange={setWeatherAlerts}
          />

          <SettingToggle
            icon={Wifi}
            title="Sự cố thiết bị"
            description="Thông báo khi MosGuardX mất kết nối hoặc một thành phần cần kiểm tra."
            checked={deviceAlerts}
            onChange={setDeviceAlerts}
          />

          <SettingToggle
            icon={Smartphone}
            title="Cartridge sắp hết"
            description="Nhắc trước khi cartridge cần được thay."
            checked={cartridgeAlerts}
            onChange={setCartridgeAlerts}
          />
        </div>
      </section>

      {/* Quiet hours */}
      <section className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <SectionHeader
            icon={Moon}
            eyebrow="QUIET HOURS"
            title="Không làm phiền"
            description="Hạn chế các thông báo không khẩn cấp vào ban đêm."
          />

          <Toggle
            checked={quietHours}
            onChange={setQuietHours}
            label="Bật giờ yên tĩnh"
          />
        </div>

        {quietHours && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <TimeBox
              label="Bắt đầu"
              value="22:00"
            />

            <TimeBox
              label="Kết thúc"
              value="07:00"
            />
          </div>
        )}

        <p className="mt-4 text-xs leading-5 text-slate-400">
          Cảnh báo quan trọng về sự cố thiết
          bị vẫn có thể được gửi trong khoảng
          thời gian này.
        </p>
      </section>

      {/* Privacy */}
      <section className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-sm">
        <SectionHeader
          icon={LockKeyhole}
          eyebrow="QUYỀN RIÊNG TƯ"
          title="Dữ liệu camera"
          description="Kiểm soát cách dữ liệu mosquito event được lưu và sử dụng."
        />

        <div className="mt-6 divide-y divide-slate-100">
          <SettingToggle
            icon={ShieldCheck}
            title="Lưu ảnh mosquito event"
            description="Lưu ảnh đại diện của sự kiện để xem lại lịch sử phát hiện."
            checked={eventImages}
            onChange={setEventImages}
          />

          <SettingToggle
            icon={LockKeyhole}
            title="Chia sẻ dữ liệu ẩn danh"
            description="Cho phép sử dụng dữ liệu đã loại bỏ thông tin tài khoản để cải thiện hệ thống."
            checked={analyticsSharing}
            onChange={setAnalyticsSharing}
          />
        </div>

        <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
          <div className="flex gap-3">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-emerald-700"
            />

            <div>
              <p className="text-sm font-bold text-emerald-900">
                Privacy by design
              </p>

              <p className="mt-1 text-xs leading-5 text-emerald-900/70">
                Camera MosGuardX được bố trí
                trong buồng nhận diện và không
                cần truyền video liên tục lên
                cloud.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Account */}
      <section className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-sm">
        <SectionHeader
          icon={UserRound}
          eyebrow="TÀI KHOẢN"
          title="Tài khoản MosGuardX"
          description="Thông tin đăng nhập và quyền truy cập của gia đình."
        />

        <div className="mt-6 space-y-3">
          <SettingsAction
            icon={UserRound}
            title="Thông tin cá nhân"
            description="Tên, email và thông tin tài khoản"
          />

          <SettingsAction
            icon={LockKeyhole}
            title="Bảo mật"
            description="Mật khẩu và các phiên đăng nhập"
          />
        </div>
      </section>

      {/* App status */}
      <section className="flex flex-col justify-between gap-3 rounded-[24px] bg-slate-50 p-5 text-sm sm:flex-row sm:items-center">
        <div>
          <p className="font-semibold text-[#16352a]">
            MosGuardX Home
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Phiên bản B2C MVP
          </p>
        </div>

        <span className="text-xs text-slate-400">
          Dữ liệu hiện tại đang sử dụng mock
          data
        </span>
      </section>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: typeof Home;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
        <Icon size={21} />
      </span>

      <div>
        <p className="text-xs font-bold tracking-[0.14em] text-emerald-700">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-xl font-bold text-[#16352a]">
          {title}
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-[#16352a]">
        {label}
      </label>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#16352a] outline-none transition placeholder:text-slate-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
      />
    </div>
  );
}

function SettingToggle({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: typeof Bell;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-4 py-5 first:pt-0 last:pb-0">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
        <Icon size={18} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-[#16352a]">
          {title}
        </p>

        <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <Toggle
        checked={checked}
        onChange={onChange}
        label={title}
      />
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition ${
        checked
          ? "bg-emerald-500"
          : "bg-slate-200"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
          checked
            ? "left-6"
            : "left-1"
        }`}
      />
    </button>
  );
}

function TimeBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-[#16352a]">
        {value}
      </p>
    </div>
  );
}

function SettingsAction({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Home;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
        <Icon size={18} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-[#16352a]">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>

      <ChevronRight
        size={17}
        className="shrink-0 text-slate-400"
      />
    </button>
  );
}