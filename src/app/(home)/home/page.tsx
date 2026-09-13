import Link from "next/link";
import {
  Activity,
  ArrowDownRight,
  BatteryMedium,
  Bell,
  Bug,
  Camera,
  ChevronRight,
  CloudRain,
  Droplets,
  Fan,
  Gauge,
  MapPin,
  ShieldCheck,
  Signal,
  Sun,
  ThermometerSun,
  Wind,
} from "lucide-react";

const hourlyActivity = [
  22, 16, 13, 10, 12, 19,
  31, 44, 26, 18, 14, 17,
  20, 23, 28, 34, 47, 72,
  91, 78, 58, 41, 33, 27,
];

export default function HomePage() {
  const maxActivity = Math.max(
    ...hourlyActivity,
  );

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Thứ Bảy, 13 tháng 9
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#16352a] sm:text-4xl">
            Chào buổi sáng, Quân 👋
          </h1>

          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
            <MapPin
              size={16}
              className="text-emerald-700"
            />
            Nhà Hà Nội · Ban công tầng 3
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          MosGuardX đang hoạt động
        </div>
      </section>

      {/* Main status */}
      <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <article className="overflow-hidden rounded-[28px] bg-[#16352a] p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-emerald-300">
                HOẠT ĐỘNG MUỖI
              </p>

              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-300 text-[#2f2a10]">
                  <Gauge size={30} />
                </div>

                <div>
                  <p className="text-3xl font-bold">
                    Trung bình
                  </p>

                  <p className="mt-1 text-sm text-slate-300">
                    Trong phạm vi bình thường
                    của nhà bạn
                  </p>
                </div>
              </div>
            </div>

            <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
              Cập nhật vừa xong
            </span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl bg-white/8 p-4">
              <p className="text-xs text-slate-300">
                Hôm nay
              </p>

              <strong className="mt-1 block text-3xl">
                7
              </strong>

              <span className="text-xs text-slate-400">
                lần ghi nhận
              </span>
            </div>

            <div className="rounded-2xl bg-white/8 p-4">
              <p className="text-xs text-slate-300">
                Tuần này
              </p>

              <strong className="mt-1 block text-3xl">
                42
              </strong>

              <span className="text-xs text-slate-400">
                mosquito events
              </span>
            </div>

            <div className="rounded-2xl bg-white/8 p-4">
              <p className="text-xs text-slate-300">
                Xu hướng
              </p>

              <strong className="mt-1 flex items-center gap-1 text-2xl text-emerald-300">
                <ArrowDownRight size={22} />
                18%
              </strong>

              <span className="text-xs text-slate-400">
                so với tuần trước
              </span>
            </div>

            <div className="rounded-2xl bg-white/8 p-4">
              <p className="text-xs text-slate-300">
                Cao điểm
              </p>

              <strong className="mt-1 block text-xl">
                18:00–20:00
              </strong>

              <span className="text-xs text-slate-400">
                thường xuyên nhất
              </span>
            </div>
          </div>
        </article>

        {/* Weather suitability */}
        <article className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.14em] text-slate-400">
                THỜI TIẾT & MUỖI
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Điều kiện thuận lợi
              </h2>
            </div>

            <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800">
              CAO
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <WeatherItem
              icon={ThermometerSun}
              label="Nhiệt độ"
              value="29°C"
            />

            <WeatherItem
              icon={Droplets}
              label="Độ ẩm"
              value="81%"
            />

            <WeatherItem
              icon={CloudRain}
              label="Mưa 24h"
              value="12 mm"
            />

            <WeatherItem
              icon={Wind}
              label="Gió"
              value="6 km/h"
            />
          </div>

          <div className="mt-5 rounded-2xl bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">
              Khả năng có mưa tối nay
            </p>

            <p className="mt-1 text-xs leading-5 text-amber-800/80">
              Độ ẩm cao và mưa gần đây
              đang tạo điều kiện thuận
              lợi cho hoạt động của muỗi.
            </p>
          </div>
        </article>
      </section>

      {/* Activity + species */}
      <section className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
        <article className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.14em] text-slate-400">
                24 GIỜ QUA
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Hoạt động theo giờ
              </h2>
            </div>

            <Link
              href="/activity"
              className="flex items-center gap-1 text-sm font-semibold text-emerald-700"
            >
              Chi tiết
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="mt-8 flex h-44 items-end gap-1.5 sm:gap-2">
            {hourlyActivity.map(
              (value, index) => {
                const height =
                  (value / maxActivity) *
                  100;

                const active =
                  index >= 17 &&
                  index <= 19;

                return (
                  <div
                    key={index}
                    className="group relative flex h-full flex-1 items-end"
                  >
                    <div
                      className={`w-full rounded-t-md transition ${
                        active
                          ? "bg-emerald-500"
                          : "bg-emerald-100 group-hover:bg-emerald-200"
                      }`}
                      style={{
                        height: `${Math.max(
                          height,
                          7,
                        )}%`,
                      }}
                    />
                  </div>
                );
              },
            )}
          </div>

          <div className="mt-3 flex justify-between text-[10px] font-medium text-slate-400">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:00</span>
          </div>
        </article>

        <article className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <Bug size={22} />
            </span>

            <div>
              <p className="text-xs text-slate-400">
                GHI NHẬN NHIỀU NHẤT
              </p>

              <h2 className="font-bold">
                Aedes albopictus
              </h2>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-end justify-between">
              <div>
                <strong className="text-4xl">
                  54%
                </strong>

                <p className="mt-1 text-xs text-slate-500">
                  trong 30 ngày gần nhất
                </p>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                AI 92%
              </span>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[54%] rounded-full bg-violet-500" />
            </div>
          </div>

          <Link
            href="/activity"
            className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold"
          >
            Xem các loài ghi nhận

            <ChevronRight size={17} />
          </Link>
        </article>
      </section>

      {/* Recommendation + device */}
      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-[28px] bg-emerald-50 p-6">
          <div className="flex gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
              <ShieldCheck size={23} />
            </span>

            <div>
              <p className="text-xs font-bold tracking-[0.14em] text-emerald-700">
                GỢI Ý HÔM NAY
              </p>

              <h2 className="mt-1 text-lg font-bold">
                Kiểm tra các vị trí có
                khả năng đọng nước
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Có mưa trong 24 giờ qua
                và độ ẩm đang cao. Hoạt
                động muỗi tại nhà bạn
                thường tăng vào buổi tối.
              </p>

              <button
                type="button"
                className="mt-4 rounded-xl bg-[#16352a] px-4 py-2.5 text-sm font-semibold text-white"
              >
                Xem hướng dẫn
              </button>
            </div>
          </div>
        </article>

        <article className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.14em] text-slate-400">
                THIẾT BỊ
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Ban công tầng 3
              </h2>
            </div>

            <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Online
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <DeviceStatus
              icon={Camera}
              label="Camera"
              value="Bình thường"
            />

            <DeviceStatus
              icon={Fan}
              label="Quạt"
              value="Bình thường"
            />

            <DeviceStatus
              icon={Signal}
              label="Wi-Fi"
              value="Tốt"
            />

            <DeviceStatus
              icon={BatteryMedium}
              label="Cartridge"
              value="78%"
            />
          </div>

          <Link
            href="/my-device"
            className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-semibold text-emerald-700"
          >
            Quản lý thiết bị
            <ChevronRight size={17} />
          </Link>
        </article>
      </section>

      {/* Alert preview */}
      <section className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-slate-400">
              CẢNH BÁO GẦN ĐÂY
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Những điều cần chú ý
            </h2>
          </div>

          <Link
            href="/home-alerts"
            className="text-sm font-semibold text-emerald-700"
          >
            Xem tất cả
          </Link>
        </div>

        <div className="mt-5 flex gap-4 rounded-2xl bg-amber-50 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-700">
            <Bell size={19} />
          </span>

          <div>
            <p className="font-semibold text-amber-950">
              Điều kiện môi trường đang
              thuận lợi cho muỗi
            </p>

            <p className="mt-1 text-sm leading-6 text-amber-900/70">
              Mưa và độ ẩm cao trong 24
              giờ qua. MosGuardX sẽ tiếp
              tục theo dõi hoạt động tại
              nhà bạn.
            </p>

            <p className="mt-2 text-xs font-medium text-amber-700">
              35 phút trước
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function WeatherItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Sun;
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

      <strong className="mt-1 block text-lg">
        {value}
      </strong>
    </div>
  );
}

function DeviceStatus({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Camera;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <Icon
        size={18}
        className="text-emerald-700"
      />

      <p className="mt-3 text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-[#16352a]">
        {value}
      </p>
    </div>
  );
}