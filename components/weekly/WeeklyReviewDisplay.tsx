"use client";

import type { WeeklyReviewPrompt } from "@/lib/weekly-review-prompts";
import type { WeeklyReviewValues } from "@/lib/weekly-review-storage";

/**
 * Notion-ish hierarchy: prompt line slightly larger & tighter tracking;
 * body slightly smaller, relaxed leading, subtle letter-spacing.
 */
export function WeeklyReviewDisplay({
  prompts,
  values,
}: {
  prompts: WeeklyReviewPrompt[];
  values: WeeklyReviewValues;
}) {
  return (
    <div className="weekly-review-display space-y-12 sm:space-y-14">
      {prompts.map((p) => {
        const text = (values[p.id] ?? "").trim();
        return (
          <article key={p.id} className="w-full">
            <h3 className="weekly-review-display__prompt text-[15px] font-semibold leading-snug tracking-[-0.022em] text-[var(--foreground)] sm:text-[16px]">
              {p.label}
            </h3>
            <div
              className={`weekly-review-display__body mt-2.5 w-full whitespace-pre-wrap text-[13px] font-normal leading-[1.78] tracking-[-0.006em] text-[var(--foreground)] sm:text-[13.5px] sm:leading-[1.82] ${
                text ? "" : "text-[var(--muted-foreground)]"
              }`}
            >
              {text || "—"}
            </div>
          </article>
        );
      })}
    </div>
  );
}
