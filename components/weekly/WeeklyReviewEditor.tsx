"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { sanitizeRichHtml, toEditorHtml } from "@/lib/weekly-richtext";
import { updateSurfacedLinesForWeek } from "@/lib/surfaced-lines-storage";

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
  const [editorInitial, setEditorInitial] = useState<WeeklyReviewValues>({});
  const editorRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
    setEditorInitial(localNormalized);
    setIsEditing(!hasAnyValue(localNormalized, ids));

    (async () => {
      const remote = await fetchWeeklyReviewCloud(programWeek);
      if (cancelled) return;
      const merged = mergeRemoteAndLocal(remote, localNormalized, ids);
      setValues(merged);
      setEditorInitial(merged);
      setIsEditing(!hasAnyValue(merged, ids));
    })();

    return () => {
      cancelled = true;
    };
  }, [programWeek, prompts]);

  const setField = useCallback((id: string, value: string) => {
    setValues((v) => ({ ...v, [id]: value }));
  }, []);

  const applyFormat = useCallback((id: string, command: string, value?: string) => {
    const el = editorRefs.current[id];
    if (!el) return;
    el.focus();
    document.execCommand(command, false, value);
    setField(id, sanitizeRichHtml(el.innerHTML));
  }, [setField]);

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
      updateSurfacedLinesForWeek(programWeek, values, locale);
      setIsEditing(false);
      dispatchWeeklyReviewSaved();
    } catch {
      /* quota */
    }
  }, [values, programWeek, cloudEnabled, t, locale]);

  const rangeLabel = bounds ? formatProgramWeekRangeLabel(bounds.weekStart, bounds.weekEnd, locale) : "";
  const programLabel = locale === "zh" ? `第 ${programWeek} 周` : `Week ${programWeek}`;

  return (
    <div className={className}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 max-lg:flex-col max-lg:items-stretch max-lg:gap-4 max-lg:mb-8">
        <div className="max-lg:min-w-0">
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
          <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--muted-foreground)] max-lg:mt-2 max-lg:text-[13px]">
            {t("weekly.footerHint")}
          </p>
        </div>
        {showOpenFullLink && (
          <Link
            href="/weekly"
            className="text-[12px] font-medium text-[var(--muted-foreground)] underline-offset-4 transition-colors hover:text-[var(--foreground)] hover:underline max-lg:inline-flex max-lg:min-h-11 max-lg:items-center max-lg:text-[14px]"
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
        <div className="space-y-6 max-lg:space-y-8">
          {prompts.map((p) => (
            <div
              key={p.id}
              id={`weekly-prompt-${p.id}`}
              className="scroll-mt-[calc(4.25rem+0.75rem)] max-lg:scroll-mt-[calc(5rem+env(safe-area-inset-top))]"
            >
            <label className="block">
              <span className="text-[14px] font-medium leading-snug text-[var(--foreground)] max-lg:text-[15px]">
                {p.label}
              </span>
              <div className="mt-3 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--background)] max-lg:mt-4">
                <div className="flex items-center gap-1 border-b border-[var(--border-subtle)] px-2 py-1.5 max-lg:gap-0.5 max-lg:px-1.5 max-lg:py-2">
                  <button
                    type="button"
                    className="rounded px-2 py-1 text-[12px] text-[var(--muted-foreground)] hover:bg-[var(--muted)] max-lg:flex max-lg:min-h-10 max-lg:min-w-10 max-lg:items-center max-lg:justify-center max-lg:text-[13px]"
                    onClick={() => applyFormat(p.id, "bold")}
                  >
                    B
                  </button>
                  <button
                    type="button"
                    className="rounded px-2 py-1 text-[12px] text-[var(--muted-foreground)] hover:bg-[var(--muted)] max-lg:flex max-lg:min-h-10 max-lg:min-w-10 max-lg:items-center max-lg:justify-center max-lg:text-[13px]"
                    onClick={() => applyFormat(p.id, "formatBlock", "P")}
                  >
                    P
                  </button>
                  <button
                    type="button"
                    className="rounded px-2 py-1 text-[12px] text-[var(--muted-foreground)] hover:bg-[var(--muted)] max-lg:flex max-lg:min-h-10 max-lg:min-w-10 max-lg:items-center max-lg:justify-center max-lg:text-[13px]"
                    onClick={() => applyFormat(p.id, "formatBlock", "H3")}
                  >
                    H
                  </button>
                </div>
                <div
                  key={`${p.id}-${programWeek}-${isEditing ? "edit" : "view"}`}
                  ref={(el) => {
                    editorRefs.current[p.id] = el;
                    if (el && el.innerHTML.trim() === "") {
                      el.innerHTML = toEditorHtml(editorInitial[p.id] ?? "");
                    }
                  }}
                  contentEditable
                  suppressContentEditableWarning
                  className="min-h-[8.5rem] w-full px-3 py-3 text-[14px] leading-[1.75] text-[var(--foreground)] outline-none max-lg:min-h-[10rem] max-lg:px-4 max-lg:py-4 max-lg:text-[16px]"
                  onInput={(e) => {
                    const html = (e.currentTarget as HTMLDivElement).innerHTML;
                    setField(p.id, sanitizeRichHtml(html));
                  }}
                />
              </div>
            </label>
            </div>
          ))}
          <div className="pt-1 max-lg:pt-2">
            <button
              type="button"
              onClick={() => void handleSave()}
              className="notion-save-btn max-lg:min-h-11 max-lg:px-5 max-lg:text-[15px]"
            >
              {t("weekly.footerSave")}
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-[var(--radius)] border border-[var(--border-subtle)] bg-[var(--card)] p-6 shadow-[var(--shadow-card)] max-lg:bg-[var(--card)]/80">
          <div className="mb-6 flex justify-end border-b border-[var(--border-subtle)] pb-4">
            <button
              type="button"
              onClick={() => {
                setEditorInitial(values);
                setIsEditing(true);
              }}
              className="notion-edit-btn max-lg:min-h-11 max-lg:px-3 max-lg:text-[15px]"
            >
              {t("weekly.footerEdit")}
            </button>
          </div>
          <WeeklyReviewDisplay prompts={prompts} values={values} />
        </div>
      )}
    </div>
  );
}
