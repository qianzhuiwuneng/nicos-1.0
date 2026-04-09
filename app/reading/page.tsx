"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { BookCover } from "@/components/reading/BookCover";
import {
  getReadingMonthSections,
  readingJourneyBooks
} from "@/lib/reading-journey";
import { buildSyncedReadingNotes, type SyncedReadingNote } from "@/lib/reading-note-sync";

export default function ReadingPage() {
  const monthSections = useMemo(() => getReadingMonthSections(), []);
  const [syncedNotes, setSyncedNotes] = useState<Record<string, SyncedReadingNote>>({});

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const next = await buildSyncedReadingNotes(readingJourneyBooks);
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
                    <BookCover
                      src={lot.coverImage}
                      title={lot.title}
                      author={lot.author}
                      toneClassName={lot.coverTone}
                      lotLabel={`Week ${lot.week}`}
                    />

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
                        {syncedNotes[lot.id] ? (
                          <>
                            <Link
                              href={`/reading/${lot.id}`}
                              className="text-[11px] text-[var(--muted-foreground)] underline-offset-4 hover:underline"
                            >
                              {syncedNotes[lot.id].sectionTitle}
                            </Link>
                            <Link
                              href={`/reading/${lot.id}`}
                              className="mt-1.5 block text-[12px] leading-relaxed text-[var(--foreground-soft)] underline-offset-4 hover:underline"
                            >
                              {syncedNotes[lot.id].excerpt}
                            </Link>
                          </>
                        ) : (
                          <>
                            <p className="text-[11px] text-[var(--muted-foreground)]">
                              No linked reading-notes section found yet.
                            </p>
                            <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--foreground-soft)]">
                              Save your weekly reading note, then it will appear here automatically.
                            </p>
                          </>
                        )}
                      </div>
                      <p className="mt-3 text-[12px] leading-relaxed text-[var(--foreground-soft)]">
                        {lot.tagline}
                      </p>
                      <Link
                        href={syncedNotes[lot.id] ? `/reading/${lot.id}` : `/weekly/week-${lot.week}`}
                        className="mt-4 inline-flex text-[12px] font-medium text-[var(--primary)] underline-offset-4 hover:underline"
                      >
                        {syncedNotes[lot.id] ? "Read Full Note" : "View Week Reflection"}
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
