"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { BookCover } from "@/components/reading/BookCover";
import { useLanguage } from "@/context/LanguageContext";
import { getWatchingMonthSections, watchingJourneyFilms } from "@/lib/watching-journey";

export default function WatchingPage() {
  const { locale } = useLanguage();
  const monthSections = useMemo(() => getWatchingMonthSections(), []);

  return (
    <AppLayout
      title={locale === "zh" ? "观影" : "Watching"}
      description={
        locale === "zh"
          ? "这些影像在不同周里留下了痕迹。"
          : "Films that stayed with me through the weeks"
      }
      narrow
    >
      <p className="mb-10 max-w-2xl text-[14px] leading-[1.9] text-[var(--muted-foreground)]">
        {locale === "zh"
          ? "这些影像在不同周里留下了痕迹。"
          : "Films that stayed with me through the weeks."}
      </p>

      <section className="rounded-[var(--radius)] border border-[var(--border-subtle)] bg-[var(--card)]/55 p-6 sm:p-8">
        <div className="mb-8 flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
            {locale === "zh" ? "观影档案" : "Films & Screenings"}
          </p>
          <p className="text-[11px] text-[var(--muted-foreground)]">
            {locale === "zh" ? `${watchingJourneyFilms.length} 条` : `${watchingJourneyFilms.length} lots`}
          </p>
        </div>

        <div className="space-y-10">
          {monthSections.map((section) => (
            <section
              key={`watch-month-${section.month}`}
              className="border-t border-[var(--border-subtle)] pt-7 first:border-t-0 first:pt-0"
            >
              <header className="mb-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                  {locale === "zh" ? `第 ${section.month} 月` : `Month ${section.month}`}
                </p>
                <p className="mt-1 text-[12px] text-[var(--muted-foreground)]">
                  {locale === "zh"
                    ? `第 ${section.firstWeek}-${section.lastWeek} 周`
                    : `Weeks ${section.firstWeek}-${section.lastWeek}`}
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
                      author={lot.director}
                      toneClassName={lot.coverTone}
                    />

                    <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
                      {lot.director.trim() ? (
                        <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                          {lot.director}
                        </p>
                      ) : null}
                      <p className="mt-1.5 text-[15px] font-medium leading-snug text-[var(--foreground)]">
                        {lot.title}
                      </p>
                      {lot.yearLine.trim() ? (
                        <p className="mt-1.5 text-[12px] text-[var(--muted-foreground)]">{lot.yearLine}</p>
                      ) : null}
                      <p className="mt-2 inline-flex rounded-[var(--radius-pill)] border border-[var(--border)] px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                        {locale === "zh" ? `第 ${lot.week} 周` : `Week ${lot.week}`}
                      </p>
                      <div className="mt-3 border-t border-[var(--border-subtle)] pt-3">
                        <p className="text-[11px] text-[var(--muted-foreground)]">
                          {locale === "zh"
                            ? "观影感受可写在当周周复盘里。"
                            : "Note what stayed in that week’s reflection."}
                        </p>
                      </div>
                      <p className="mt-3 text-[12px] leading-relaxed text-[var(--foreground-soft)]">
                        {locale === "zh" ? lot.taglineZh : lot.tagline}
                      </p>
                      <Link
                        href={`/weekly/week-${lot.week}`}
                        className="mt-4 inline-flex text-[12px] font-medium text-[var(--primary)] underline-offset-4 hover:underline"
                      >
                        {locale === "zh" ? "查看周复盘" : "View Week Reflection"}
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
