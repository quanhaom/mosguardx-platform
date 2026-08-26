"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowRight,
  CircleDot,
  Globe2,
  MapPinned,
  RadioTower,
} from "lucide-react";

import PublicShell from "../../components/layout/public-shell";
import { stations } from "../../data/mock-data";

import {
  useLanguage,
} from "../../components/i18n/language-context";

import type {
  GeographicMapProps,
} from "../map/geographic-map";

const ExpansionMap =
  dynamic<GeographicMapProps>(
    () =>
      import(
        "../map/geographic-map"
      ).then(
        (module) =>
          module.default,
      ),
    {
      ssr: false,

      loading: () => (
        <div className="flex h-full items-center justify-center bg-slate-100 text-sm font-semibold text-slate-500">
          Loading map...
        </div>
      ),
    },
  );

export default function ExpansionPage() {
  const { tr } = useLanguage();

  const locations = [
    {
      name: tr(
        "Hà Nội",
        "Hanoi",
      ),

      status: "Pilot",

      description: tr(
        "Địa bàn thí điểm đầu tiên của MosguardX.",
        "The first pilot area of MosguardX.",
      ),
    },
    {
      name: tr(
        "TP. Hồ Chí Minh",
        "Ho Chi Minh City",
      ),

      status: "Coming soon",

      description: tr(
        "Đánh giá đối tác và điều kiện triển khai.",
        "Evaluating partners and deployment conditions.",
      ),
    },
    {
      name: tr(
        "Bình Dương",
        "Binh Duong",
      ),

      status: "Coming soon",

      description: tr(
        "Định hướng mạng lưới khu công nghiệp.",
        "Planned industrial-zone network.",
      ),
    },
    {
      name: tr(
        "Đồng Nai",
        "Dong Nai",
      ),

      status: "Coming soon",

      description: tr(
        "Khảo sát nhu cầu và hạ tầng.",
        "Assessing local needs and infrastructure.",
      ),
    },
    {
      name: tr(
        "Gia Lai",
        "Gia Lai",
      ),

      status: "Coming soon",

      description: tr(
        "Nghiên cứu điều kiện địa hình.",
        "Studying local terrain conditions.",
      ),
    },
    {
      name: tr(
        "Kiên Giang",
        "Kien Giang",
      ),

      status: "Coming soon",

      description: tr(
        "Định hướng khu vực du lịch và biên giới.",
        "Planned coverage for tourism and border areas.",
      ),
    },
  ];

  const roadmap = [
    {
      number: "01",

      title: tr(
        "Pilot Hà Nội",
        "Hanoi pilot",
      ),

      description: tr(
        "Lắp đặt prototype, xác minh khả năng thu nhận ảnh và đánh giá dữ liệu AI.",
        "Assemble the prototype, verify image capture and evaluate AI data.",
      ),
    },
    {
      number: "02",

      title: tr(
        "Xác thực thực địa",
        "Field validation",
      ),

      description: tr(
        "So sánh tín hiệu MosguardX với kết quả kiểm tra chuyên môn tại địa phương.",
        "Compare MosguardX signals with professional local assessments.",
      ),
    },
    {
      number: "03",

      title: tr(
        "Chuẩn hóa hệ thống",
        "System standardisation",
      ),

      description: tr(
        "Chuẩn hóa thiết bị, API, mô hình dữ liệu và quy trình vận hành.",
        "Standardise devices, APIs, data models and operating procedures.",
      ),
    },
    {
      number: "04",

      title: tr(
        "Nhân rộng mạng lưới",
        "Network expansion",
      ),

      description: tr(
        "Triển khai theo tỉnh, khu vực và mạng lưới đối tác.",
        "Expand through provinces, regions and partner networks.",
      ),
    },
  ];

  return (
    <PublicShell>
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#0b211b] px-5 py-20 text-white md:px-8">
          <div className="landing-grid absolute inset-0 opacity-20" />

          <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/10 px-4 py-2 text-[10px] font-bold tracking-[0.18em] text-emerald-300">
              <Globe2 size={14} />

              {tr(
                "LỘ TRÌNH MỞ RỘNG",
                "EXPANSION ROADMAP",
              )}
            </span>

            <h1 className="mt-7 max-w-5xl text-4xl font-bold tracking-tight md:text-6xl">
              {tr(
                "Bắt đầu tại Hà Nội, hướng tới mạng lưới Việt Nam và Đông Dương.",
                "Starting in Hanoi, expanding toward a Vietnam and Indochina network.",
              )}
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300">
              {tr(
                "MosguardX được thiết kế theo mô hình dữ liệu đa cấp, từ trạm, quận huyện, tỉnh thành đến mạng lưới khu vực.",
                "MosguardX is designed around a multi-level data model, from individual stations and districts to provinces and regional networks.",
              )}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#vietnam-map"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-bold text-[#10251f]"
              >
                {tr(
                  "Xem bản đồ Việt Nam",
                  "View Vietnam map",
                )}

                <ArrowRight size={17} />
              </a>

              <Link
                href="/map"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3.5 text-sm font-bold text-white"
              >
                {tr(
                  "Mở bản đồ vận hành",
                  "Open operations map",
                )}
              </Link>
            </div>

            <p className="mt-7 max-w-3xl rounded-xl border border-amber-300/15 bg-amber-300/10 p-4 text-xs leading-6 text-amber-100">
              {tr(
                "Các địa phương có trạng thái “Coming soon” chỉ thể hiện định hướng nghiên cứu và mở rộng, không ngụ ý MosguardX đã triển khai thiết bị hoặc ký kết hợp đồng tại đó.",
                "Locations marked “Coming soon” represent research and expansion plans only. They do not imply that MosguardX has deployed devices or signed contracts there.",
              )}
            </p>
          </div>
        </section>

        {/* Geographic map */}
        <section
          id="vietnam-map"
          className="bg-white py-20"
        >
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <p className="text-xs font-bold tracking-[0.18em] text-emerald-700">
                  {tr(
                    "VIỆT NAM VÀ BIỂN ĐẢO",
                    "VIETNAM AND ITS ISLANDS",
                  )}
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#16352a] md:text-4xl">
                  {tr(
                    "Bản đồ địa lý cho lộ trình phát triển MosguardX.",
                    "A geographic map for the MosguardX expansion roadmap.",
                  )}
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {tr(
                    "Bản đồ hiển thị các trạm minh họa tại Hà Nội, các địa phương nằm trong định hướng mở rộng và vị trí hai quần đảo Hoàng Sa, Trường Sa của Việt Nam.",
                    "The map displays illustrative stations in Hanoi, planned expansion locations and the positions of Vietnam’s Hoang Sa and Truong Sa archipelagos.",
                  )}
                </p>
              </div>

              <Link
                href="/map"
                className="inline-flex h-fit items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                {tr(
                  "Xem dashboard bản đồ",
                  "Open map dashboard",
                )}

                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-xl">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <MapPinned size={21} />
                  </span>

                  <div>
                    <h3 className="text-sm font-bold text-[#16352a]">
                      MosguardX Expansion Map
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {tr(
                        "Kéo, phóng to hoặc sử dụng nút chuyển nhanh trên bản đồ",
                        "Drag, zoom or use the quick-navigation buttons",
                      )}
                    </p>
                  </div>
                </div>

                <span className="h-fit rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-bold text-amber-700">
                  {tr(
                    "LỘ TRÌNH MINH HỌA",
                    "ILLUSTRATIVE ROADMAP",
                  )}
                </span>
              </div>

              <div className="relative h-[680px]">
                <ExpansionMap
                  stations={stations}
                  selectedId=""
                  multiplier={1}
                  showDensity={false}
                  onSelect={() => {}}
                />

                <div className="pointer-events-none absolute bottom-7 right-4 z-[500] max-w-[280px] rounded-xl bg-[#10251f]/95 p-4 text-xs leading-5 text-white shadow-xl">
                  <strong className="text-emerald-300">
                    {tr(
                      "Phạm vi MVP",
                      "MVP scope",
                    )}
                  </strong>

                  <p className="mt-1 text-slate-300">
                    {tr(
                      "Hà Nội là điểm pilot. Các trạm và số liệu đang hiển thị là dữ liệu minh họa.",
                      "Hanoi is the pilot location. The displayed stations and metrics are illustrative.",
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs font-bold text-emerald-800">
                  {tr(
                    "Hoàng Sa và Trường Sa",
                    "Hoang Sa and Truong Sa",
                  )}
                </p>

                <p className="mt-2 text-xs leading-5 text-emerald-700">
                  {tr(
                    "Marker thể hiện vị trí tương đối của hai quần đảo Việt Nam, không đại diện cho đường biên giới hoặc ranh giới hàng hải.",
                    "Markers show the approximate positions of the two Vietnamese archipelagos and do not represent national or maritime boundaries.",
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-bold text-amber-800">
                  {tr(
                    "Trạng thái dữ liệu",
                    "Data status",
                  )}
                </p>

                <p className="mt-2 text-xs leading-5 text-amber-700">
                  {tr(
                    "Nền bản đồ và tọa độ là dữ liệu địa lý. Mạng lưới trạm và kế hoạch mở rộng hiện là dữ liệu trình diễn.",
                    "The basemap and coordinates are geographic data. The station network and expansion plan are currently illustrative.",
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Locations */}
        <section className="bg-[#f3f7f5] py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <MapPinned
                className="text-emerald-700"
                size={34}
              />

              <p className="mt-6 text-xs font-bold tracking-[0.18em] text-emerald-700">
                {tr(
                  "TRẠNG THÁI THEO ĐỊA PHƯƠNG",
                  "STATUS BY LOCATION",
                )}
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#16352a]">
                {tr(
                  "Một điểm pilot và năm địa phương định hướng.",
                  "One pilot and five planned locations.",
                )}
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                {tr(
                  "Mỗi địa phương cần được khảo sát về sinh thái, hạ tầng, đối tác y tế và điều kiện vận hành trước khi triển khai.",
                  "Each location requires ecological, infrastructure, healthcare-partner and operational assessments before deployment.",
                )}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {locations.map(
                (location) => {
                  const isPilot =
                    location.status ===
                    "Pilot";

                  return (
                    <article
                      key={location.name}
                      className="rounded-2xl border border-slate-200 bg-white p-5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-bold text-[#16352a]">
                          {location.name}
                        </h3>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            isPilot
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {location.status}
                        </span>
                      </div>

                      <p className="mt-3 text-xs leading-5 text-slate-500">
                        {
                          location.description
                        }
                      </p>
                    </article>
                  );
                },
              )}
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-bold tracking-[0.18em] text-emerald-700">
                {tr(
                  "LỘ TRÌNH NHÂN RỘNG",
                  "SCALING ROADMAP",
                )}
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#16352a] md:text-4xl">
                {tr(
                  "Phát triển theo bằng chứng, không mở rộng chỉ bằng giả định.",
                  "Evidence-led development, not assumption-led expansion.",
                )}
              </h2>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {roadmap.map(
                (step) => (
                  <article
                    key={step.number}
                    className="rounded-2xl border border-slate-200 bg-[#f7faf8] p-6"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-xs font-bold text-emerald-800">
                      {step.number}
                    </span>

                    <h3 className="mt-6 text-lg font-bold text-[#16352a]">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {
                        step.description
                      }
                    </p>
                  </article>
                ),
              )}
            </div>
          </div>
        </section>

        {/* Indochina */}
        <section className="bg-[#12352b] py-20 text-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-2 lg:items-center">
            <div>
              <Globe2
                size={40}
                className="text-emerald-300"
              />

              <p className="mt-6 text-xs font-bold tracking-[0.18em] text-emerald-300">
                INDOCHINA VISION
              </p>

              <h2 className="mt-3 text-4xl font-bold">
                {tr(
                  "Một chuẩn dữ liệu có thể thích nghi theo từng vùng.",
                  "A data standard adaptable to each region.",
                )}
              </h2>
            </div>

            <div className="space-y-5 text-sm leading-7 text-slate-300">
              <p>
                {tr(
                  "Sau giai đoạn xác thực tại Việt Nam, MosguardX định hướng hợp tác nghiên cứu và thí điểm tại Lào, Campuchia.",
                  "After validation in Vietnam, MosguardX aims to pursue research partnerships and pilots in Laos and Cambodia.",
                )}
              </p>

              <p>
                {tr(
                  "Mọi bước mở rộng phụ thuộc vào đối tác y tế, điều kiện sinh thái địa phương, khả năng vận hành thiết bị và bằng chứng thực địa.",
                  "Every expansion step depends on healthcare partners, local ecology, device-operating capacity and field evidence.",
                )}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold text-emerald-300">
                <span className="flex items-center gap-2">
                  <CircleDot size={15} />

                  Pilot
                </span>

                <ArrowRight size={15} />

                <span>
                  {tr(
                    "Xác thực",
                    "Validate",
                  )}
                </span>

                <ArrowRight size={15} />

                <span>
                  {tr(
                    "Chuẩn hóa",
                    "Standardise",
                  )}
                </span>

                <ArrowRight size={15} />

                <span>
                  {tr(
                    "Nhân rộng",
                    "Scale",
                  )}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-emerald-400 py-14">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 md:flex-row md:items-center md:px-8">
            <div>
              <div className="flex items-center gap-2 text-[#10251f]">
                <RadioTower size={21} />

                <p className="text-xs font-bold tracking-[0.16em]">
                  MOSGUARDX MVP
                </p>
              </div>

              <h2 className="mt-3 text-2xl font-bold text-[#10251f]">
                {tr(
                  "Khám phá trung tâm điều hành thí điểm tại Hà Nội.",
                  "Explore the pilot operations centre in Hanoi.",
                )}
              </h2>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex h-fit items-center gap-2 rounded-xl bg-[#10251f] px-5 py-3.5 text-sm font-bold text-white"
            >
              {tr(
                "Mở Dashboard",
                "Open Dashboard",
              )}

              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}