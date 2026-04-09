"use client";

import type { WeeklyReviewPrompt } from "@/lib/weekly-review-prompts";
import type { WeeklyReviewValues } from "@/lib/weekly-review-storage";
import { toDisplayHtml } from "@/lib/weekly-richtext";

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
    <div className="weekly-review-display space-y-12 sm:space-y-14 max-lg:space-y-14">
      {prompts.map((p) => {
        const raw = (values[p.id] ?? "").trim();
        const html = toDisplayHtml(raw);
        return (
          <article
            key={p.id}
            id={`weekly-prompt-${p.id}`}
            className="w-full scroll-mt-[calc(4.25rem+0.75rem)] max-lg:scroll-mt-[calc(5rem+env(safe-area-inset-top))]"
          >
            <h3 className="weekly-review-display__prompt text-[15px] font-semibold leading-snug tracking-[-0.022em] text-[var(--foreground)] sm:text-[16px] max-lg:text-[16px]">
              {p.label}
            </h3>
            <div
              className={`weekly-review-display__body prose prose-sm mt-2.5 max-w-none text-[13px] font-normal leading-[1.78] tracking-[-0.006em] text-[var(--foreground)] sm:text-[13.5px] sm:leading-[1.82] max-lg:mt-3 max-lg:text-[15px] max-lg:leading-[1.82] ${
                raw ? "" : "text-[var(--muted-foreground)]"
              }`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </article>
        );
      })}
    </div>
  );
}
