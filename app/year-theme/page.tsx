"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useLanguage } from "@/context/LanguageContext";
import { loadYearTheme, saveYearTheme } from "@/lib/yearThemeStorage";

export default function YearThemePage() {
  const { t } = useLanguage();
  const [value, setValue] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setValue(loadYearTheme());
  }, []);

  const onSave = () => {
    saveYearTheme(value);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2000);
  };

  return (
    <AppLayout title={t("yearTheme.title")} description={t("yearTheme.description")} narrow>
      <div className="max-w-xl">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
            {t("yearTheme.label")}
          </span>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={4}
            placeholder={t("yearTheme.placeholder")}
            className="mt-3 w-full resize-y rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-3 text-[15px] leading-relaxed text-[var(--foreground)] outline-none focus:shadow-[0_0_0_1px_var(--border)]"
          />
        </label>
        <div className="mt-4 flex items-center gap-3">
          <button type="button" onClick={onSave} className="notion-save-btn">
            {t("yearTheme.save")}
          </button>
          {savedFlash && (
            <span className="text-[12px] text-[var(--muted-foreground)]">{t("yearTheme.saved")}</span>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
