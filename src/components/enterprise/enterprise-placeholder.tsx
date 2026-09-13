import Link from "next/link";

import type { LucideIcon } from "lucide-react";

import {
  ArrowLeft,
  CheckCircle2,
  Construction,
} from "lucide-react";

type Feature = {
  title: string;
  description: string;
};

export default function EnterprisePlaceholder({
  icon: Icon,
  eyebrow,
  title,
  description,
  features,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  features: Feature[];
}) {
  return (
    <div className="space-y-6">
      {/* HEADER */}

      <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white p-7 md:p-9">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Icon size={23} />
            </span>

            <p className="mt-7 text-[10px] font-bold tracking-[0.18em] text-emerald-700">
              {eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#16352a] md:text-4xl">
              {title}
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              {description}
            </p>
          </div>

          <span className="inline-flex h-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-[10px] font-bold text-amber-700">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            PREVIEW
          </span>
        </div>
      </section>

      {/* FEATURES */}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-[24px] border border-slate-200 bg-white p-6"
          >
            <CheckCircle2
              size={20}
              className="text-emerald-600"
            />

            <h3 className="mt-5 font-bold text-[#16352a]">
              {feature.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {feature.description}
            </p>
          </article>
        ))}
      </section>

      {/* PLACEHOLDER */}

      <section className="flex min-h-[320px] items-center justify-center rounded-[30px] border border-dashed border-slate-300 bg-white p-8 text-center">
        <div className="max-w-lg">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
            <Construction size={25} />
          </span>

          <h3 className="mt-5 text-xl font-bold text-[#16352a]">
            Module chưa nối dữ liệu thật
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            Giao diện và routing đã sẵn sàng. API, database và
            workflow nghiệp vụ sẽ được tích hợp ở giai đoạn tiếp theo.
          </p>

          <Link
            href="/enterprise/app"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#16352a] transition hover:border-emerald-300"
          >
            <ArrowLeft size={16} />
            Enterprise Overview
          </Link>
        </div>
      </section>
    </div>
  );
}