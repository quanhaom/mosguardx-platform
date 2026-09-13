import {
  Activity,
  ArrowDownRight,
  Bug,
  ChevronRight,
  Clock3,
  MapPin,
  Sparkles,
} from "lucide-react";

import {
  homeSummary,
  hourlyActivity,
  recentEvents,
  speciesBreakdown,
  weeklyActivity,
} from "@/lib/home/mock-data";

export default function ActivityPage() {
  const maxWeek = Math.max(
    ...weeklyActivity.map(
      (item) => item.count,
    ),
  );

  const maxHour = Math.max(
    ...hourlyActivity,
  );

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-bold tracking-[0.16em] text-emerald-700">
          MOSGUARDX HOME
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#16352a] sm:text-4xl">
          Hoạt động muỗi
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Theo dõi số lần MosGuardX ghi nhận
          muỗi, thời điểm hoạt động và các
          loài xuất hiện quanh nhà bạn.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Hôm nay"
          value={String(
            homeSummary.todayCount,
          )}
          description="lần ghi nhận"
        />

        <SummaryCard
          label="7 ngày"
          value={String(
            homeSummary.weekCount,
          )}
          description="mosquito events"
        />

        <SummaryCard
          label="Xu hướng"
          value={`${Math.abs(
            homeSummary.trendPercent,
          )}%`}
          description="so với tuần trước"
          icon
        />

        <SummaryCard
          label="Cao điểm"
          value={homeSummary.peakTime}
          description="khung giờ thường gặp"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <article className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.14em] text-slate-400">
                7 NGÀY GẦN NHẤT
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#16352a]">
                Xu hướng hoạt động
              </h2>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              <ArrowDownRight
                size={15}
              />
              Giảm 18%
            </span>
          </div>

          <div className="mt-8 flex h-64 items-end gap-3 sm:gap-5">
            {weeklyActivity.map(
              (item) => {
                const height =
                  (item.count /
                    maxWeek) *
                  100;

                return (
                  <div
                    key={item.date}
                    className="flex h-full flex-1 flex-col justify-end"
                  >
                    <div className="mb-2 text-center text-xs font-bold text-[#16352a]">
                      {item.count}
                    </div>

                    <div className="flex h-[190px] items-end">
                      <div
                        className="w-full rounded-t-xl bg-emerald-200 transition hover:bg-emerald-400"
                        style={{
                          height: `${Math.max(
                            height,
                            10,
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="mt-3 text-center">
                      <p className="text-xs font-bold text-slate-600">
                        {item.day}
                      </p>

                      <p className="mt-1 hidden text-[10px] text-slate-400 sm:block">
                        {item.date}
                      </p>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </article>

        <article className="rounded-[28px] border border-[#dfe9e4] bg-[#16352a] p-6 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-emerald-300">
              <Clock3 size={21} />
            </span>

            <div>
              <p className="text-xs text-slate-400">
                KHUNG GIỜ CAO ĐIỂM
              </p>

              <h2 className="font-bold">
                {homeSummary.peakTime}
              </h2>
            </div>
          </div>

          <p className="mt-6 text-sm leading-6 text-slate-300">
            MosGuardX ghi nhận hoạt động
            muỗi cao nhất tại nhà bạn vào
            đầu buổi tối.
          </p>

          <div className="mt-7 rounded-2xl bg-white/8 p-4">
            <p className="text-xs font-semibold text-emerald-300">
              Gợi ý cá nhân hóa
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-200">
              Hạn chế mở cửa lâu trong
              khoảng 18:00–20:00 nếu không
              cần thiết.
            </p>
          </div>
        </article>
      </section>

      <section className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-slate-400">
            24 GIỜ QUA
          </p>

          <h2 className="mt-1 text-xl font-bold text-[#16352a]">
            Hoạt động theo giờ
          </h2>
        </div>

        <div className="mt-8 flex h-44 items-end gap-1.5 sm:gap-2">
          {hourlyActivity.map(
            (value, index) => {
              const height =
                maxHour === 0
                  ? 0
                  : (value /
                      maxHour) *
                    100;

              const peak =
                index >= 17 &&
                index <= 20;

              return (
                <div
                  key={index}
                  className="group relative flex h-full flex-1 items-end"
                  title={`${String(
                    index,
                  ).padStart(
                    2,
                    "0",
                  )}:00 · ${value} lần`}
                >
                  <div
                    className={`w-full rounded-t-md transition ${
                      peak
                        ? "bg-emerald-500"
                        : "bg-emerald-100 group-hover:bg-emerald-300"
                    }`}
                    style={{
                      height: `${Math.max(
                        height,
                        5,
                      )}%`,
                    }}
                  />
                </div>
              );
            },
          )}
        </div>

        <div className="mt-3 flex justify-between text-[10px] font-semibold text-slate-400">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>23:00</span>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <Bug size={21} />
            </span>

            <div>
              <p className="text-xs text-slate-400">
                PHÂN BỐ
              </p>

              <h2 className="font-bold">
                Loài được ghi nhận
              </h2>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {speciesBreakdown.map(
              (item) => (
                <div
                  key={item.species}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {item.species}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {item.count} lần
                        ghi nhận
                      </p>
                    </div>

                    <strong className="text-sm text-[#16352a]">
                      {item.percentage}%
                    </strong>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{
                        width: `${item.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        </article>

        <article className="rounded-[28px] border border-[#dfe9e4] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.14em] text-slate-400">
                GẦN ĐÂY
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#16352a]">
                Lần ghi nhận mới
              </h2>
            </div>

            <Activity
              size={22}
              className="text-emerald-700"
            />
          </div>

          <div className="mt-5 divide-y divide-slate-100">
            {recentEvents.map(
              (event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-4 py-4 first:pt-0"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Bug size={18} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#16352a]">
                      {event.species}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                      <span>
                        {event.time}
                      </span>

                      <span className="flex items-center gap-1">
                        <MapPin
                          size={12}
                        />
                        {
                          event.location
                        }
                      </span>
                    </div>
                  </div>

                  <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    {Math.round(
                      event.confidence *
                        100,
                    )}
                    %
                  </span>
                </div>
              ),
            )}
          </div>

          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-1 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
          >
            Xem toàn bộ lịch sử
            <ChevronRight size={16} />
          </button>
        </article>
      </section>

      <section className="flex gap-4 rounded-[28px] bg-emerald-50 p-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
          <Sparkles size={21} />
        </span>

        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-emerald-700">
            MOSGUARDX INSIGHT
          </p>

          <h2 className="mt-1 font-bold text-[#16352a]">
            Hoạt động đang thấp hơn tuần trước
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Số lần ghi nhận trong 7 ngày
            gần nhất giảm 18%. Tuy nhiên,
            hoạt động vẫn tập trung rõ vào
            khoảng 18:00–20:00.
          </p>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  description,
  icon = false,
}: {
  label: string;
  value: string;
  description: string;
  icon?: boolean;
}) {
  return (
    <article className="rounded-[24px] border border-[#dfe9e4] bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold text-slate-400">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-2">
        {icon && (
          <ArrowDownRight
            size={21}
            className="text-emerald-600"
          />
        )}

        <strong className="text-2xl font-bold text-[#16352a]">
          {value}
        </strong>
      </div>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </article>
  );
}