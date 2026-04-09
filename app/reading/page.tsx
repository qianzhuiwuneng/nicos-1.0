"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  getReadingMonthSections,
  readingJourneyBooks,
  type ReadingJourneyBook,
} from "@/lib/reading-journey";
import { getWeeklyReviewPrompts, type WeeklyReviewPrompt } from "@/lib/weekly-review-prompts";
import { fetchWeeklyReviewCloud, mergeRemoteAndLocal } from "@/lib/weekly-review-cloud";
import { loadWeeklyReviewValues, type WeeklyReviewValues } from "@/lib/weekly-review-storage";

type SyncedReadingNote = {
  sectionTitle: string;
  excerpt: string;
};

function mergeWeeklyValues(remote: WeeklyReviewValues, local: WeeklyReviewValues): WeeklyReviewValues {
  const out: WeeklyReviewValues = { ...local };
  for (const [k, v] of Object.entries(remote)) {
    if (typeof v === "string" && v.trim().length > 0) out[k] = v;
  }
  return out;
}

function normalizeLabel(source: string): string {
  return source.replace(/[《》\s"'“”‘’:：—\-]/g, "").toLowerCase();
}

function extractExcerpt(text: string, maxChars = 120): string {
  const compact = text.replace(/\s+/g, " ").trim();
  if (compact.length <= maxChars) return compact;
  return `${compact.slice(0, maxChars).trimEnd()}…`;
}

function pickPromptForBook(book: ReadingJourneyBook, prompts: WeeklyReviewPrompt[]): WeeklyReviewPrompt | undefined {
  if (book.reflectionPromptId) {
    const exact = prompts.find((p) => p.id === book.reflectionPromptId);
    if (exact) return exact;
  }
  const normalizedTitle = normalizeLabel(book.title);
  return prompts.find((p) => normalizeLabel(p.label).includes(normalizedTitle));
}

export default function ReadingPage() {
  const monthSections = useMemo(() => getReadingMonthSections(), []);
  const [syncedNotes, setSyncedNotes] = useState<Record<string, SyncedReadingNote>>({});

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const weeks = Array.from(
        new Set(readingJourneyBooks.map((book) => book.reflectionWeek ?? book.week))
      );
      const weekValues = new Map<number, WeeklyReviewValues>();
      const weekPrompts = new Map<number, WeeklyReviewPrompt[]>();

      for (const week of weeks) {
        const prompts = getWeeklyReviewPrompts(week, "zh");
        weekPrompts.set(week, prompts);
        const local = loadWeeklyReviewValues(week);
        const remote = await fetchWeeklyReviewCloud(week);
        const promptIds = prompts.map((p) => p.id);
        // Keep known prompts merged the old way, then layer full remote/local keys
        // so reflectionPromptId entries are still readable even if prompt config changes.
        const promptMerged = prompts.length > 0 ? mergeRemoteAndLocal(remote, local, promptIds) : {};
        weekValues.set(week, { ...mergeWeeklyValues(remote, local), ...promptMerged });
      }

      const next: Record<string, SyncedReadingNote> = {};
      for (const book of readingJourneyBooks) {
        const sourceWeek = book.reflectionWeek ?? book.week;
        const prompts = weekPrompts.get(sourceWeek) ?? [];
        const values = weekValues.get(sourceWeek) ?? {};
        const prompt = pickPromptForBook(book, prompts);
        const promptId = prompt?.id ?? book.reflectionPromptId;
        if (!promptId) continue;
        const text = (values[promptId] ?? "").trim();
        if (!text) continue;
        next[book.id] = {
          sectionTitle: prompt?.label ?? `${book.title} 感受与触动`,
          excerpt: extractExcerpt(text),
        };
      }

      if (!cancelled) setSyncedNotes(next);
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppLayout
      title="Reading"
      description="Books that stayed with me through the weeks"
      narrow
    >
      <p className="mb-10 max-w-2xl text-[14px] leading-[1.9] text-[var(--muted-foreground)]">
        Books that stayed with me through the weeks.
      </p>

      <section className="rounded-[var(--radius)] border border-[var(--border-subtle)] bg-[var(--card)]/55 p-6 sm:p-8">
        <div className="mb-8 flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
            Books & Manuscripts
          </p>
          <p className="text-[11px] text-[var(--muted-foreground)]">{readingJourneyBooks.length} lots</p>
        </div>

        <div className="space-y-10">
          {monthSections.map((section) => (
            <section
              key={`month-${section.month}`}
              className="border-t border-[var(--border-subtle)] pt-7 first:border-t-0 first:pt-0"
            >
              <header className="mb-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                  Month {section.month}
                </p>
                <p className="mt-1 text-[12px] text-[var(--muted-foreground)]">
                  Weeks {section.firstWeek}-{section.lastWeek}
                </p>
              </header>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {section.lots.map((lot) => (
                  <article
                    key={lot.id}
                    id={`week-${lot.week}`}
                    className="rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--background)] p-4 sm:p-5"
                  >
                    <div className={`relative aspect-[3/4] w-full border border-[var(--border)] ${lot.coverTone}`}>
                      <div className="absolute inset-x-0 top-0 border-b border-[var(--border)] px-3 py-2">
                        <p className="text-[9px] uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                          Week {lot.week}
                        </p>
                      </div>
                      <div className="flex h-full items-center justify-center px-5 text-center">
                        <h3 className="text-[18px] font-medium tracking-[-0.01em] text-[var(--foreground)]">
                          {lot.title}
                        </h3>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
                      <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                        {lot.author}
                      </p>
                      <p className="mt-1.5 text-[15px] font-medium leading-snug text-[var(--foreground)]">
                        {lot.title}
                      </p>
                      <p className="mt-1.5 text-[12px] text-[var(--muted-foreground)]">{lot.publisherYear}</p>
                      <p className="mt-2 inline-flex rounded-[var(--radius-pill)] border border-[var(--border)] px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                        Week {lot.week}
                      </p>
                      <div className="mt-3 border-t border-[var(--border-subtle)] pt-3">
                        <p className="text-[11px] text-[var(--muted-foreground)]">
                          {syncedNotes[lot.id]?.sectionTitle ?? "No linked reading-notes section found yet."}
                        </p>
                        <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--foreground-soft)]">
                          {syncedNotes[lot.id]?.excerpt ?? "Save your weekly reading note, then it will appear here automatically."}
                        </p>
                      </div>
                      <p className="mt-3 text-[12px] leading-relaxed text-[var(--foreground-soft)]">
                        {lot.tagline}
                      </p>
                      <Link
                        href={`/weekly/week-${lot.week}`}
                        className="mt-4 inline-flex text-[12px] font-medium text-[var(--primary)] underline-offset-4 hover:underline"
                      >
                        View Week Reflection
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
