"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  clearWeeklyCloudEditKey,
  getCloudEnabled,
  getWeeklyCloudEditKey,
  setWeeklyCloudEditKey,
} from "@/lib/weekly-review-cloud";

export function WeeklyCloudSetup() {
  const { t } = useLanguage();
  const enabled = getCloudEnabled();
  const initial = useMemo(() => getWeeklyCloudEditKey(), []);
  const [key, setKey] = useState(initial);
  const [saved, setSaved] = useState(initial.length > 0);

  if (!enabled) {
    return (
      <p className="mb-8 rounded-[var(--radius)] border border-dashed border-[var(--border-subtle)] bg-[var(--muted)]/20 px-4 py-3 text-[12px] leading-relaxed text-[var(--muted-foreground)]">
        {t("weekly.cloudDisabledHint")}
      </p>
    );
  }

  return (
    <section className="mb-8 rounded-[var(--radius)] border border-[var(--border-subtle)] bg-[var(--card)] p-4">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
        {t("weekly.cloudTitle")}
      </h3>
      <p className="mt-2 text-[12px] leading-relaxed text-[var(--muted-foreground)]">
        {t("weekly.cloudHint")}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder={t("weekly.cloudKeyPlaceholder")}
          className="h-9 min-w-[16rem] rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--background)] px-3 text-[13px] text-[var(--foreground)] outline-none focus:shadow-[0_0_0_1px_var(--border)]"
        />
        <button
          type="button"
          className="notion-save-btn"
          onClick={() => {
            setWeeklyCloudEditKey(key);
            setSaved(key.trim().length > 0);
          }}
        >
          {t("weekly.cloudKeySave")}
        </button>
        {saved && (
          <button
            type="button"
            className="notion-edit-btn"
            onClick={() => {
              clearWeeklyCloudEditKey();
              setKey("");
              setSaved(false);
            }}
          >
            {t("weekly.cloudKeyForget")}
          </button>
        )}
      </div>
      {saved && (
        <p className="mt-2 text-[12px] text-[var(--muted-foreground)]">{t("weekly.cloudKeyOnDevice")}</p>
      )}
    </section>
  );
}
