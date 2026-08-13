"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import PageIntro from "@/components/ui/page-intro";

export default function SettingsPage() {
  const [threshold, setThreshold] = useState(70);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  function saveSettings() {
    localStorage.setItem(
      "mosguardx-settings",
      JSON.stringify({ threshold, emailAlerts }),
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div>
      <PageIntro
        eyebrow="THIẾT LẬP HỆ THỐNG"
        title="Cấu hình cảnh báo"
        description="Thiết lập ngưỡng cảnh báo và phương thức nhận thông báo."
      />

      <section className="max-w-2xl rounded-2xl border border-[#dce8e2] bg-white p-6">
        <label className="block">
          <span className="text-sm font-bold text-[#16352a]">
            Ngưỡng chỉ số nguy cơ
          </span>
          <p className="mt-1 text-xs text-slate-500">
            Tạo cảnh báo khi chỉ số vượt quá giá trị này.
          </p>

          <div className="mt-4 flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="100"
              value={threshold}
              onChange={(event) => setThreshold(Number(event.target.value))}
              className="flex-1 accent-emerald-600"
            />
            <strong className="w-12 text-center text-xl">{threshold}</strong>
          </div>
        </label>

        <div className="my-6 border-t border-slate-100" />

        <label className="flex items-center justify-between gap-4">
          <div>
            <span className="text-sm font-bold text-[#16352a]">
              Cảnh báo qua email
            </span>
            <p className="mt-1 text-xs text-slate-500">
              Gửi email khi phát sinh cảnh báo nghiêm trọng.
            </p>
          </div>

          <input
            type="checkbox"
            checked={emailAlerts}
            onChange={(event) => setEmailAlerts(event.target.checked)}
            className="h-5 w-5 accent-emerald-600"
          />
        </label>

        <button
          onClick={saveSettings}
          className="mt-8 flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white"
        >
          <Save size={17} />
          Lưu cấu hình
        </button>

        {saved && (
          <p className="mt-4 text-sm font-semibold text-emerald-700">
            Đã lưu cấu hình trên trình duyệt.
          </p>
        )}
      </section>
    </div>
  );
}
