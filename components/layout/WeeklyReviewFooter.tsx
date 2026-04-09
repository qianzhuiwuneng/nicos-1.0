"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useWeek52Nav } from "@/context/Week52Context";
import { WeeklyReviewDisplay } from "@/components/weekly/WeeklyReviewDisplay";
import { weeklyReviews } from "@/lib/data";
import { formatProgramWeekRangeLabel } from "@/lib/program-week";
import { getWeeklyReviewPrompts } from "@/lib/weekly-review-prompts";
import {
  hasAnyValue,
  loadWeeklyReviewValues,
  saveWeeklyReviewValues,
  type WeeklyReviewValues,
} from "@/lib/weekly-review-storage";

function dispatchWeeklyReviewSaved() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("nicos-weekly-review-saved"));
  }
}

/** 仅在 52 周方案页展示（仪表盘与其他模块不显示复盘表单）。 */
const WEEKLY_FOOTER_PATHS = new Set<string>(["/program"]);

export function WeeklyReviewFooter() {
  const pathname = usePathname();
  const { t, locale } = useLanguage();
  const { focusWeek } = useWeek52Nav();
  const prompts = useMemo(() => getWeeklyReviewPrompts(focusWeek, locale), [focusWeek, locale]);

  const [values, setValues] = useState<WeeklyReviewValues>({});
  const [isEditing, setIsEditing] = useState(true);

  const base = useMemo(
    () => weeklyReviews.find((w) => w.programWeek === focusWeek),
    [focusWeek]
  );

  const bounds = base ? { weekStart: base.weekStart, weekEnd: base.weekEnd } : null;

  useEffect(() => {
    const loaded = loadWeeklyReviewValues(focusWeek);
    const ids = prompts.map((p) => p.id);
    const next: WeeklyReviewValues = {};
    for (const p of prompts) {
      next[p.id] = loaded[p.id] ?? "";
    }
    setValues(next);
    setIsEditing(!hasAnyValue(loaded, ids));
  }, [focusWeek, prompts]);

  const setField = useCallback((id: string, value: string) => {
    setValues((v) => ({ ...v, [id]: value }));
  }, []);

  const handleSave = useCallback(() => {
    try {
      saveWeeklyReviewValues(focusWeek, values);
      setIsEditing(false);
      dispatchWeeklyReviewSaved();
    } catch {
      /* quota */
    }
  }, [values, focusWeek]);

  const rangeLabel = bounds ? formatProgramWeekRangeLabel(bounds.weekStart, bounds.weekEnd, locale) : "";
  const programLabel = locale === "zh" ? `第 ${focusWeek} 周` : `Week ${focusWeek}`;

  if (pathname === "/weekly") return null;
  if (!WEEKLY_FOOTER_PATHS.has(pathname)) return null;

  return (
    <section
      className="mt-14 border-t border-[var(--border-subtle)] pt-10"
      aria-labelledby="weekly-review-footer-heading"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="weekly-review-footer-heading"
            className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--muted-foreground)]"
          >
            {t("weekly.footerTitle")}
          </h2>
          <p className="mt-1 text-[14px] font-medium text-[var(--foreground)]">
            <span className="text-[var(--foreground)]">{rangeLabel}</span>
            <span className="text-[var(--muted-foreground)]"> · </span>
            {t("weekly.footerProgramWeek")}
            <span className="text-[var(--muted-foreground)]"> · </span>
            {programLabel}
          </p>
          <p className="mt-1 text-[12px] text-[var(--muted-foreground)]">{t("weekly.footerHint")}</p>
        </div>
        <Link
          href="/weekly"
          className="text-[13px] font-medium text-[var(--muted-foreground)] underline-offset-4 hover:text-[var(--foreground)] hover:underline"
        >
          {t("weekly.footerOpenFull")}
        </Link>
      </div>

      {prompts.length === 0 ? (
        <p className="text-[14px] leading-relaxed text-[var(--muted-foreground)]">
          {t("weekly.footerNoPromptsThisWeek")}
        </p>
      ) : isEditing ? (
        <div className="space-y-5">
          {prompts.map((p) => (
            <label key={p.id} className="block">
              <span className="text-[15px] font-semibold leading-snug tracking-[-0.022em] text-[var(--foreground)] sm:text-[16px]">
                {p.label}
              </span>
              <textarea
                value={values[p.id] ?? ""}
                onChange={(e) => setField(p.id, e.target.value)}
                rows={4}
                className="mt-2.5 w-full resize-y rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2.5 text-[13px] leading-[1.78] tracking-[-0.006em] text-[var(--foreground)] outline-none transition-shadow placeholder:text-[var(--muted-foreground)] focus:border-[var(--border-subtle)] focus:shadow-[0_0_0_2px_var(--muted)] sm:text-[13.5px]"
              />
            </label>
          ))}
          <div className="pt-1">
            <button type="button" onClick={handleSave} className="notion-save-btn">
              {t("weekly.footerSave")}
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-[var(--radius)] border border-[var(--border-subtle)] bg-[var(--card)] p-6 shadow-[var(--shadow-card)]">
          <div className="mb-6 flex justify-end border-b border-[var(--border-subtle)] pb-4">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="notion-edit-btn"
            >
              {t("weekly.footerEdit")}
            </button>
          </div>
          <WeeklyReviewDisplay prompts={prompts} values={values} />
        </div>
      )}
    </section>
  );
}
