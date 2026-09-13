import {
  Bell,
  Bug,
  CheckCircle2,
  ChevronRight,
  CloudRain,
  Droplets,
  Fan,
  Info,
  ShieldAlert,
  Sun,
  ThermometerSun,
  Wind,
  type LucideIcon,
} from "lucide-react";

import {
  homeAlerts,
  homeSummary,
  mosquitoWeatherForecast,
  weatherSnapshot,
  type HomeAlert,
  type HomeAlertCategory,
  type HomeAlertSeverity,
} from "@/lib/home/mock-data";

export default function HomeAlertsPage() {
  const unreadCount =
    homeAlerts.filter(
      (alert) => !alert.read,
    ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-emerald-700">
            MOSGUARDX HOME
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#16352a] sm:text-4xl">
            Cảnh báo
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            MosGuardX kết hợp dữ liệu
            hoạt động muỗi, điều kiện môi
            trường và trạng thái thiết bị
            để đưa ra những thông tin cần
            chú ý tại nhà bạn.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800">
          <Bell size={15} />
          {unreadCount} cảnh báo mới
        </span>
      </section>

      {/* Risk overview */}
      <section className="overflow-hidden rounded-[30px] bg-[#16352a] p-6 text-white shadow-sm sm:p-8">
        <div className="grid gap-7 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.15em] text-emerald-300">
              MOSQUITO ACTIVITY RISK
            </p>

            <div className="mt-5 flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-amber-300 text-amber-950">
                <ShieldAlert size={30} />
              </span>

              <div>
                <h2 className="text-3xl font-bold">
                  Trung bình
                </h2>

                <p className="mt-1 text-sm text-slate-300">
                  Cần chú ý vào đầu buổi tối
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-xl text-sm leading-6 text-slate-300">
              Điều kiện thời tiết hiện tại
              thuận lợi cho hoạt động của
              muỗi, nhưng số lần ghi nhận
              trong tuần vẫn thấp hơn tuần
              trước.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <RiskMetric
              label="Hôm nay"
              value={`${homeSummary.todayCount}`}
              suffix="lần"
            />

            <RiskMetric
              label="Xu hướng"
              value="↓ 18%"
              suffix="7 ngày"
            />

            <RiskMetric
              label="Độ ẩm"
              value={`${weatherSnapshot.humidity}%`}
              suffix="hiện tại"
            />

            <RiskMetric
              label="Mưa 24h"
              value={`${weatherSnapshot.rainfall24h}`}
              suffix="mm"
            />
          </div>
        </div>
      </section>

      {/* Weather intelligence */}
      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <article className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.14em] text-slate-400">
                WEATHER INTELLIGENCE
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#16352a]">
                Điều kiện cho muỗi
              </h2>
            </div>

            <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800">
              THUẬN LỢI
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <WeatherCard
              icon={ThermometerSun}
              label="Nhiệt độ"
              value={`${weatherSnapshot.temperature}°C`}
            />

            <WeatherCard
              icon={Droplets}
              label="Độ ẩm"
              value={`${weatherSnapshot.humidity}%`}
            />

            <WeatherCard
              icon={CloudRain}
              label="Mưa 24h"
              value={`${weatherSnapshot.rainfall24h} mm`}
            />

            <WeatherCard
              icon={Wind}
              label="Gió"
              value={`${weatherSnapshot.windSpeed} km/h`}
            />
          </div>

          <div className="mt-5 rounded-2xl bg-amber-50 p-4">
            <p className="font-semibold text-amber-950">
              Vì sao mức này đang cao?
            </p>

            <p className="mt-2 text-sm leading-6 text-amber-900/75">
              Độ ẩm cao, mưa gần đây và
              khả năng tiếp tục có mưa
              đang tạo môi trường thuận
              lợi hơn cho hoạt động của
              muỗi.
            </p>
          </div>
        </article>

        <article className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-slate-400">
              4 NGÀY TỚI
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#16352a]">
              Mosquito Weather
            </h2>
          </div>

          <div className="mt-6 space-y-3">
            {mosquitoWeatherForecast.map(
              (day) => (
                <div
                  key={day.day}
                  className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600">
                    <Sun size={19} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#16352a]">
                      {day.day}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {day.temperature}°C ·{" "}
                      {day.humidity}% ẩm ·{" "}
                      {day.rainProbability}% mưa
                    </p>
                  </div>

                  <SuitabilityBadge
                    level={day.suitability}
                  />
                </div>
              ),
            )}
          </div>
        </article>
      </section>

      {/* Alerts */}
      <section className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-slate-400">
              GẦN ĐÂY
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#16352a]">
              Cảnh báo của bạn
            </h2>
          </div>

          <button
            type="button"
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 transition hover:border-emerald-300 hover:text-emerald-700"
          >
            Đánh dấu tất cả đã đọc
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {homeAlerts.map(
            (alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
              />
            ),
          )}
        </div>
      </section>

      {/* Recommendation */}
      <section className="flex gap-4 rounded-[28px] bg-emerald-50 p-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
          <CheckCircle2 size={22} />
        </span>

        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-emerald-700">
            GỢI Ý CHO NHÀ BẠN
          </p>

          <h2 className="mt-1 font-bold text-[#16352a]">
            Kiểm tra các vị trí có khả
            năng đọng nước sau mưa
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Hoạt động muỗi tại nhà bạn
            thường tăng vào khoảng
            18:00–20:00. Sau những ngày
            mưa, nên kiểm tra chậu cây,
            máng nước và các vật dụng có
            thể giữ nước.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <Info
          size={18}
          className="mt-0.5 shrink-0 text-slate-400"
        />

        <p className="text-xs leading-5 text-slate-500">
          Mức cảnh báo MosGuardX phản ánh
          hoạt động muỗi và điều kiện môi
          trường tại khu vực của bạn.
          Đây không phải dự báo hoặc chẩn
          đoán dịch bệnh.
        </p>
      </section>
    </div>
  );
}

function RiskMetric({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <strong className="mt-1 block text-2xl">
        {value}
      </strong>

      <p className="mt-1 text-xs text-slate-400">
        {suffix}
      </p>
    </div>
  );
}

function WeatherCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <Icon
        size={19}
        className="text-emerald-700"
      />

      <p className="mt-3 text-xs text-slate-400">
        {label}
      </p>

      <strong className="mt-1 block text-lg text-[#16352a]">
        {value}
      </strong>
    </div>
  );
}

function SuitabilityBadge({
  level,
}: {
  level: "low" | "medium" | "high";
}) {
  const config = {
    low: {
      label: "Thấp",
      className:
        "bg-emerald-100 text-emerald-700",
    },
    medium: {
      label: "TB",
      className:
        "bg-amber-100 text-amber-800",
    },
    high: {
      label: "Cao",
      className:
        "bg-orange-100 text-orange-800",
    },
  };

  const item = config[level];

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-bold ${item.className}`}
    >
      {item.label}
    </span>
  );
}

function AlertCard({
  alert,
}: {
  alert: HomeAlert;
}) {
  const appearance =
    getAlertAppearance(
      alert.category,
      alert.severity,
    );

  const Icon = appearance.icon;

  return (
    <article
      className={`flex gap-4 rounded-2xl border p-4 ${appearance.container}`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white ${appearance.iconColor}`}
      >
        <Icon size={20} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-[#16352a]">
                {alert.title}
              </p>

              {!alert.read && (
                <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />
              )}
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {alert.description}
            </p>
          </div>

          <span className="shrink-0 text-xs text-slate-400">
            {alert.createdAt}
          </span>
        </div>

        <button
          type="button"
          className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-700"
        >
          Xem chi tiết
          <ChevronRight size={14} />
        </button>
      </div>
    </article>
  );
}

function getAlertAppearance(
  category: HomeAlertCategory,
  severity: HomeAlertSeverity,
): {
  icon: LucideIcon;
  container: string;
  iconColor: string;
} {
  if (category === "weather") {
    return {
      icon: CloudRain,
      container:
        "border-amber-100 bg-amber-50/60",
      iconColor: "text-amber-700",
    };
  }

  if (category === "mosquito") {
    return {
      icon: Bug,
      container:
        severity === "critical"
          ? "border-red-100 bg-red-50/60"
          : "border-orange-100 bg-orange-50/60",
      iconColor:
        severity === "critical"
          ? "text-red-700"
          : "text-orange-700",
    };
  }

  if (category === "device") {
    return {
      icon: Fan,
      container:
        "border-emerald-100 bg-emerald-50/40",
      iconColor: "text-emerald-700",
    };
  }

  return {
    icon: Bell,
    container:
      "border-violet-100 bg-violet-50/40",
    iconColor: "text-violet-700",
  };
}