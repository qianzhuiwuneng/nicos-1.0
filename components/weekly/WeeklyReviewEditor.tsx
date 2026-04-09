"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
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
import {
  fetchWeeklyReviewCloud,
  getCloudEnabled,
  getWeeklyCloudEditKey,
  mergeRemoteAndLocal,
  saveWeeklyReviewCloud,
} from "@/lib/weekly-review-cloud";

function dispatchWeeklyReviewSaved() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("nicos-weekly-review-saved"));
  }
}

interface WeeklyReviewEditorProps {
  programWeek: number;
  showOpenFullLink?: boolean;
  className?: string;
  /** For aria-labelledby on wrapping section */
  headingId?: string;
}

export function WeeklyReviewEditor({
  programWeek,
  showOpenFullLink = true,
  className = "",
  headingId,
}: WeeklyReviewEditorProps) {
  const { t, locale } = useLanguage();
  const cloudEnabled = getCloudEnabled();
  const prompts = useMemo(
    () => getWeeklyReviewPrompts(programWeek, locale),
    [programWeek, locale]
  );

  const [values, setValues] = useState<WeeklyReviewValues>({});
  const [isEditing, setIsEditing] = useState(true);

  const base = useMemo(
    () => weeklyReviews.find((w) => w.programWeek === programWeek),
    [programWeek]
  );
  const bounds = base ? { weekStart: base.weekStart, weekEnd: base.weekEnd } : null;

  useEffect(() => {
    let cancelled = false;
    const ids = prompts.map((p) => p.id);
    const local = loadWeeklyReviewValues(programWeek);
    const localNormalized: WeeklyReviewValues = {};
    for (const p of prompts) {
      localNormalized[p.id] = local[p.id] ?? "";
    }
    setValues(localNormalized);
    setIsEditing(!hasAnyValue(localNormalized, ids));

    (async () => {
      const remote = await fetchWeeklyReviewCloud(programWeek);
      if (cancelled) return;
      const merged = mergeRemoteAndLocal(remote, localNormalized, ids);
      setValues(merged);
      setIsEditing(!hasAnyValue(merged, ids));
    })();

    return () => {
      cancelled = true;
    };
  }, [programWeek, prompts]);

  const setField = useCallback((id: string, value: string) => {
    setValues((v) => ({ ...v, [id]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    try {
      saveWeeklyReviewValues(programWeek, values);
      if (cloudEnabled) {
        const key = getWeeklyCloudEditKey();
        const result = await saveWeeklyReviewCloud(programWeek, values, key);
        if (!result.ok) {
          if (result.code === "no_key") {
            window.alert(t("weekly.cloudSaveNeedKey"));
            return;
          }
          if (result.code === "bad_key") {
            window.alert(t("weekly.cloudSaveBadKey"));
            return;
          }
          if (result.code === "failed") {
            window.alert(t("weekly.cloudSaveFailed"));
            return;
          }
        }
      }
      setIsEditing(false);
      dispatchWeeklyReviewSaved();
    } catch {
      /* quota */
    }
  }, [values, programWeek, cloudEnabled, t]);

  const rangeLabel = bounds ? formatProgramWeekRangeLabel(bounds.weekStart, bounds.weekEnd, locale) : "";
  const programLabel = locale === "zh" ? `第 ${programWeek} 周` : `Week ${programWeek}`;

  return (
    <div className={className}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id={headingId}
            className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]"
          >
            {t("weekly.footerTitle")}
          </h2>
          <p className="mt-2 text-[15px] font-normal leading-snug text-[var(--foreground)]">
            <span>{rangeLabel}</span>
            <span className="text-[var(--muted-foreground)]"> · </span>
            {t("weekly.footerProgramWeek")}
            <span className="text-[var(--muted-foreground)]"> · </span>
            {programLabel}
          </p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--muted-foreground)]">
            {t("weekly.footerHint")}
          </p>
        </div>
        {showOpenFullLink && (
          <Link
            href="/weekly"
            className="text-[12px] font-medium text-[var(--muted-foreground)] underline-offset-4 transition-colors hover:text-[var(--foreground)] hover:underline"
          >
            {t("weekly.footerOpenFull")}
          </Link>
        )}
      </div>

      {prompts.length === 0 ? (
        <p className="text-[14px] leading-relaxed text-[var(--muted-foreground)]">
          {t("weekly.footerNoPromptsThisWeek")}
        </p>
      ) : isEditing ? (
        <div className="space-y-6">
          {prompts.map((p) => (
            <label key={p.id} className="block">
              <span className="text-[14px] font-medium leading-snug text-[var(--foreground)]">
                {p.label}
              </span>
              <textarea
                value={values[p.id] ?? ""}
                onChange={(e) => setField(p.id, e.target.value)}
                rows={5}
                className="mt-3 w-full resize-y rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-3 text-[14px] leading-[1.75] text-[var(--foreground)] outline-none transition-shadow placeholder:text-[var(--muted-foreground)] focus:shadow-[0_0_0_1px_var(--border)]"
              />
            </label>
          ))}
          <div className="pt-1">
            <button type="button" onClick={() => void handleSave()} className="notion-save-btn">
              {t("weekly.footerSave")}
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-[var(--radius)] border border-[var(--border-subtle)] bg-[var(--card)] p-6 shadow-[var(--shadow-card)]">
          <div className="mb-6 flex justify-end border-b border-[var(--border-subtle)] pb-4">
            <button type="button" onClick={() => setIsEditing(true)} className="notion-edit-btn">
              {t("weekly.footerEdit")}
            </button>
          </div>
          <WeeklyReviewDisplay prompts={prompts} values={values} />
        </div>
      )}
    </div>
  );
}
