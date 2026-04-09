"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { getReadingWeekSections, readingJourneyBooks } from "@/lib/reading-journey";

export default function ReadingPage() {
  const weeklySections = getReadingWeekSections();

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
          {weeklySections.map((section) => (
            <section
              key={`week-${section.week}`}
              id={`week-${section.week}`}
              className="border-t border-[var(--border-subtle)] pt-7 first:border-t-0 first:pt-0"
            >
              <header className="mb-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                  Month {section.month} · Week {section.week}
                </p>
                <p className="mt-1 text-[12px] text-[var(--muted-foreground)]">
                  {section.weekStart} - {section.weekEnd}
                </p>
              </header>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-12">
                {section.lots.map((lot) => (
                  <article
                    key={lot.id}
                    className="rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--background)] p-4 sm:p-5 lg:col-span-5"
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
                {section.lots.length === 1 && <div className="hidden lg:block lg:col-span-7" aria-hidden="true" />}
              </div>
            </section>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
