"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { BookCover } from "@/components/reading/BookCover";
import { useReadingWeekHashScroll } from "@/hooks/useReadingWeekHashScroll";
import { useLanguage } from "@/context/LanguageContext";
import { getReadingMonthSections, readingJourneyBooks } from "@/lib/reading-journey";

type ReadingMonthSection = ReturnType<typeof getReadingMonthSections>[number];
import { buildSyncedReadingNotes, type SyncedReadingNote } from "@/lib/reading-note-sync";

export default function ReadingPage() {
  const { locale } = useLanguage();
  const monthSections = useMemo(() => getReadingMonthSections(), []);
  const [syncedNotes, setSyncedNotes] = useState<Record<string, SyncedReadingNote>>({});

  useReadingWeekHashScroll();

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
      title={locale === "zh" ? "阅读" : "Reading"}
      description={
        locale === "zh"
          ? "这些书在不同周里留下了痕迹。"
          : "Books that stayed with me through the weeks"
      }
      narrow
    >
      {/* Desktop (lg+): self-contained layout; switches purely by viewport with Tailwind lg */}
      <div className="hidden lg:block">
        <p className="mb-10 max-w-2xl text-[14px] leading-[1.9] text-[var(--muted-foreground)]">
          {locale === "zh"
            ? "这些书在不同周里留下了痕迹。"
            : "Books that stayed with me through the weeks."}
        </p>

        <section className="rounded-[var(--radius)] border border-[var(--border-subtle)] bg-[var(--card)]/55 p-6 sm:p-8">
          <div className="mb-8 flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              {locale === "zh" ? "阅读档案" : "Books & Manuscripts"}
            </p>
            <p className="text-[11px] text-[var(--muted-foreground)]">
              {locale === "zh" ? `${readingJourneyBooks.length} 条` : `${readingJourneyBooks.length} lots`}
            </p>
          </div>

          <div className="space-y-10">
            {monthSections.map((section) => (
              <DesktopMonthSection
                key={`d-month-${section.month}`}
                section={section}
                locale={locale}
                syncedNotes={syncedNotes}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Mobile (below lg): separate markup; `#week-N` scroll via data-reading-week + hook */}
      <div className="lg:hidden">
        <p className="mb-10 max-w-2xl text-[15px] leading-[1.85] text-[var(--muted-foreground)]">
          {locale === "zh"
            ? "这些书在不同周里留下了痕迹。"
            : "Books that stayed with me through the weeks."}
        </p>

        <section className="rounded-[var(--radius)] border border-[var(--border-subtle)] bg-transparent p-0">
          <div className="mb-8 flex flex-col gap-2 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-center sm:justify-between sm:pb-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              {locale === "zh" ? "阅读档案" : "Books & Manuscripts"}
            </p>
            <p className="text-[12px] text-[var(--muted-foreground)]">
              {locale === "zh" ? `${readingJourneyBooks.length} 条` : `${readingJourneyBooks.length} lots`}
            </p>
          </div>

          <div className="space-y-12">
            {monthSections.map((section) => (
              <MobileMonthSection
                key={`m-month-${section.month}`}
                section={section}
                locale={locale}
                syncedNotes={syncedNotes}
              />
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function DesktopMonthSection({
  section,
  locale,
  syncedNotes,
}: {
  section: ReadingMonthSection;
  locale: "en" | "zh";
  syncedNotes: Record<string, SyncedReadingNote>;
}) {
  return (
    <section className="border-t border-[var(--border-subtle)] pt-7 first:border-t-0 first:pt-0">
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
              author={lot.author}
              toneClassName={lot.coverTone}
            />

            <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
              <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">{lot.author}</p>
              <p className="mt-1.5 text-[15px] font-medium leading-snug text-[var(--foreground)]">{lot.title}</p>
              <p className="mt-1.5 text-[12px] text-[var(--muted-foreground)]">{lot.publisherYear}</p>
              <p className="mt-2 inline-flex rounded-[var(--radius-pill)] border border-[var(--border)] px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                {locale === "zh" ? `第 ${lot.week} 周` : `Week ${lot.week}`}
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
                      {locale === "zh"
                        ? "还没有匹配到对应的阅读笔记条目。"
                        : "No linked reading-notes section found yet."}
                    </p>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--foreground-soft)]">
                      {locale === "zh"
                        ? "先在周复盘里保存阅读笔记，随后会自动显示在这里。"
                        : "Save your weekly reading note, then it will appear here automatically."}
                    </p>
                  </>
                )}
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-[var(--foreground-soft)]">{lot.tagline}</p>
              <Link
                href={syncedNotes[lot.id] ? `/reading/${lot.id}` : `/weekly/week-${lot.week}`}
                className="mt-4 inline-flex text-[12px] font-medium text-[var(--primary)] underline-offset-4 hover:underline"
              >
                {syncedNotes[lot.id]
                  ? locale === "zh"
                    ? "查看完整笔记"
                    : "Read Full Note"
                  : locale === "zh"
                    ? "查看周复盘"
                    : "View Week Reflection"}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MobileMonthSection({
  section,
  locale,
  syncedNotes,
}: {
  section: ReadingMonthSection;
  locale: "en" | "zh";
  syncedNotes: Record<string, SyncedReadingNote>;
}) {
  return (
    <section className="border-t border-[var(--border-subtle)] pt-10 first:border-t-0 first:pt-0">
      <header className="mb-6">
        <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
          {locale === "zh" ? `第 ${section.month} 月` : `Month ${section.month}`}
        </p>
        <p className="mt-1.5 text-[13px] text-[var(--muted-foreground)]">
          {locale === "zh"
            ? `第 ${section.firstWeek}-${section.lastWeek} 周`
            : `Weeks ${section.firstWeek}-${section.lastWeek}`}
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        {section.lots.map((lot) => (
          <article
            key={lot.id}
            data-reading-week={lot.week}
            className="scroll-mt-[calc(5rem+env(safe-area-inset-top))] rounded-[var(--radius)] border border-[var(--border-subtle)] bg-[var(--background)]/95 p-5 shadow-[var(--shadow-card)] sm:rounded-[var(--radius-sm)] sm:p-5"
          >
            <BookCover
              src={lot.coverImage}
              title={lot.title}
              author={lot.author}
              toneClassName={lot.coverTone}
              className="max-w-[11.5rem] sm:max-w-none"
            />

            <div className="mt-5 border-t border-[var(--border-subtle)] pt-5">
              <p className="text-[12px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">{lot.author}</p>
              <p className="mt-2 text-[16px] font-medium leading-snug text-[var(--foreground)]">{lot.title}</p>
              <p className="mt-2 text-[13px] text-[var(--muted-foreground)]">{lot.publisherYear}</p>
              <p className="mt-3 inline-flex rounded-[var(--radius-pill)] border border-[var(--border)] px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                {locale === "zh" ? `第 ${lot.week} 周` : `Week ${lot.week}`}
              </p>
              <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
                {syncedNotes[lot.id] ? (
                  <>
                    <Link
                      href={`/reading/${lot.id}`}
                      className="text-[13px] text-[var(--muted-foreground)] underline-offset-4 hover:underline"
                    >
                      {syncedNotes[lot.id].sectionTitle}
                    </Link>
                    <Link
                      href={`/reading/${lot.id}`}
                      className="mt-2 block text-[14px] leading-[1.65] text-[var(--foreground-soft)] underline-offset-4 hover:underline"
                    >
                      {syncedNotes[lot.id].excerpt}
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-[13px] text-[var(--muted-foreground)]">
                      {locale === "zh"
                        ? "还没有匹配到对应的阅读笔记条目。"
                        : "No linked reading-notes section found yet."}
                    </p>
                    <p className="mt-2 text-[14px] leading-[1.65] text-[var(--foreground-soft)]">
                      {locale === "zh"
                        ? "先在周复盘里保存阅读笔记，随后会自动显示在这里。"
                        : "Save your weekly reading note, then it will appear here automatically."}
                    </p>
                  </>
                )}
              </div>
              <p className="mt-4 text-[14px] leading-[1.65] text-[var(--foreground-soft)]">{lot.tagline}</p>
              <Link
                href={syncedNotes[lot.id] ? `/reading/${lot.id}` : `/weekly/week-${lot.week}`}
                className="mt-5 inline-flex min-h-11 items-center text-[14px] font-medium text-[var(--primary)] underline-offset-4 hover:underline"
              >
                {syncedNotes[lot.id]
                  ? locale === "zh"
                    ? "查看完整笔记"
                    : "Read Full Note"
                  : locale === "zh"
                    ? "查看周复盘"
                    : "View Week Reflection"}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
