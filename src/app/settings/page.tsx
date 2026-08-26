"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { useLanguage } from "@/components/i18n/language-context";
import PageIntro from "@/components/ui/page-intro";

export default function SettingsPage() {
  const { tr } = useLanguage();
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
        eyebrow={tr("THIẾT LẬP HỆ THỐNG", "SYSTEM SETTINGS")}
        title={tr("Cấu hình cảnh báo", "Alert configuration")}
        description={tr(
          "Thiết lập ngưỡng cảnh báo và phương thức nhận thông báo.",
          "Configure alert thresholds and notification methods.",
        )}
      />

      <section className="max-w-2xl rounded-2xl border border-[#dce8e2] bg-white p-6">
        <label className="block">
          <span className="text-sm font-bold text-[#16352a]">
            {tr("Ngưỡng chỉ số nguy cơ", "Risk index threshold")}
          </span>
          <p className="mt-1 text-xs text-slate-500">
            {tr(
              "Tạo cảnh báo khi chỉ số vượt quá giá trị này.",
              "Create an alert when the index exceeds this value.",
            )}
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
              {tr("Cảnh báo qua email", "Email alerts")}
            </span>
            <p className="mt-1 text-xs text-slate-500">
              {tr(
                "Gửi email khi phát sinh cảnh báo nghiêm trọng.",
                "Send an email when a critical alert is generated.",
              )}
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
          {tr("Lưu cấu hình", "Save settings")}
        </button>

        {saved && (
          <p className="mt-4 text-sm font-semibold text-emerald-700">
            {tr(
              "Đã lưu cấu hình trên trình duyệt.",
              "Settings were saved in this browser.",
            )}
          </p>
        )}
      </section>
    </div>
  );
}