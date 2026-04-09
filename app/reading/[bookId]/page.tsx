"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { BookCover } from "@/components/reading/BookCover";
import { useLanguage } from "@/context/LanguageContext";
import { getReadingBookById, readingJourneyBooks } from "@/lib/reading-journey";
import { buildSyncedReadingNotes, type SyncedReadingNote } from "@/lib/reading-note-sync";
import { toDisplayHtml } from "@/lib/weekly-richtext";

export default function ReadingBookDetailPage() {
  const { locale } = useLanguage();
  const params = useParams<{ bookId: string }>();
  const bookId = Array.isArray(params?.bookId) ? params.bookId[0] : params?.bookId;
  const book = bookId ? getReadingBookById(bookId) : undefined;

  const [syncedNotes, setSyncedNotes] = useState<Record<string, SyncedReadingNote>>({});

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const notes = await buildSyncedReadingNotes(readingJourneyBooks);
      if (!cancelled) setSyncedNotes(notes);
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!book) {
    return (
      <AppLayout
        title={locale === "zh" ? "阅读" : "Reading"}
        description={locale === "zh" ? "书籍笔记" : "Book note"}
        narrow
      >
        <p className="text-[14px] text-[var(--muted-foreground)]">
          {locale === "zh" ? "未找到这本书的笔记。" : "Book note not found."}
        </p>
        <Link
          href="/reading"
          className="mt-4 inline-flex text-[13px] font-medium text-[var(--primary)] underline-offset-4 hover:underline"
        >
          {locale === "zh" ? "返回阅读页" : "Back to Reading"}
        </Link>
      </AppLayout>
    );
  }

  const note = syncedNotes[book.id];
  const sourceWeek = note?.sourceWeek ?? book.reflectionWeek ?? book.week;

  return (
    <AppLayout
      title={book.title}
      description={locale === "zh" ? "完整阅读笔记" : "Full reading note"}
      narrow
    >
      <div className="mx-auto max-w-[42rem] pb-16 pt-2">
        <article className="rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--background)] p-5 sm:p-6">
          <BookCover
            src={book.coverImage}
            title={book.title}
            author={book.author}
            toneClassName={book.coverTone}
            className="max-w-[14rem]"
          />

          <div className="mt-6 border-t border-[var(--border-subtle)] pt-5">
            <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">{book.author}</p>
            <p className="mt-1.5 text-[16px] font-medium text-[var(--foreground)]">{book.title}</p>
            <p className="mt-1.5 text-[13px] text-[var(--muted-foreground)]">{book.publisherYear}</p>
            <p className="mt-2 text-[12px] text-[var(--muted-foreground)]">
              {locale === "zh"
                ? `第 ${book.month} 月 · 第 ${book.week} 周`
                : `Month ${book.month} · Week ${book.week}`}
            </p>
          </div>
        </article>

        <section className="mt-10 border-t border-[var(--border-subtle)] pt-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
            {locale === "zh" ? "阅读笔记" : "Reading Note"}
          </p>
          <h2 className="mt-3 text-[16px] font-medium leading-snug text-[var(--foreground)]">
            {note?.sectionTitle ?? `${book.title} 感受与触动`}
          </h2>
          <div
            className="prose prose-sm mt-4 max-w-none text-[14px] leading-[1.85] text-[var(--foreground)]/92"
            dangerouslySetInnerHTML={{
              __html: toDisplayHtml(
                note?.fullText ??
                  (locale === "zh"
                    ? "尚未同步到阅读笔记。请先在对应周复盘条目里填写并保存。"
                    : "No synced reading note yet. Fill and save the corresponding weekly reflection section first.")
              ),
            }}
          />
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href={`/weekly/week-${sourceWeek}`}
              className="text-[13px] font-medium text-[var(--primary)] underline-offset-4 hover:underline"
            >
              {locale === "zh" ? "查看周复盘" : "View Week Reflection"}
            </Link>
            <Link
              href="/reading"
              className="text-[13px] font-medium text-[var(--muted-foreground)] underline-offset-4 hover:text-[var(--foreground)] hover:underline"
            >
              {locale === "zh" ? "返回阅读档案" : "Back to Reading Archive"}
            </Link>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
