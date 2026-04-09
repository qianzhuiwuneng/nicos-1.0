"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { BookCover } from "@/components/reading/BookCover";
import { useLanguage } from "@/context/LanguageContext";
import { getWatchingFilmById, watchingJourneyFilms } from "@/lib/watching-journey";
import { buildSyncedWatchingNotes, type SyncedWatchingNote } from "@/lib/watching-note-sync";
import { toDisplayHtml } from "@/lib/weekly-richtext";

export default function WatchingFilmDetailPage() {
  const { locale } = useLanguage();
  const params = useParams<{ filmId: string }>();
  const filmId = Array.isArray(params?.filmId) ? params.filmId[0] : params?.filmId;
  const film = filmId ? getWatchingFilmById(filmId) : undefined;

  const [syncedNotes, setSyncedNotes] = useState<Record<string, SyncedWatchingNote>>({});

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const notes = await buildSyncedWatchingNotes(watchingJourneyFilms);
      if (!cancelled) setSyncedNotes(notes);
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!film) {
    return (
      <AppLayout
        title={locale === "zh" ? "观影" : "Watching"}
        description={locale === "zh" ? "观影笔记" : "Film note"}
        narrow
      >
        <p className="text-[14px] text-[var(--muted-foreground)]">
          {locale === "zh" ? "未找到这部影片的条目。" : "Film entry not found."}
        </p>
        <Link
          href="/watching"
          className="mt-4 inline-flex text-[13px] font-medium text-[var(--primary)] underline-offset-4 hover:underline"
        >
          {locale === "zh" ? "返回观影页" : "Back to Watching"}
        </Link>
      </AppLayout>
    );
  }

  const note = syncedNotes[film.id];
  const sourceWeek = note?.sourceWeek ?? film.reflectionWeek ?? film.week;

  return (
    <AppLayout
      title={film.title}
      description={locale === "zh" ? "完整观影笔记" : "Full film note"}
      narrow
    >
      <div className="mx-auto max-w-[42rem] pb-16 pt-2">
        <article className="rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--background)] p-5 sm:p-6">
          <BookCover
            src={film.coverImage}
            title={film.title}
            author={film.director}
            toneClassName={film.coverTone}
            className="max-w-[14rem]"
          />

          <div className="mt-6 border-t border-[var(--border-subtle)] pt-5">
            {film.director.trim() ? (
              <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">{film.director}</p>
            ) : null}
            <p className="mt-1.5 text-[16px] font-medium text-[var(--foreground)]">{film.title}</p>
            {film.yearLine.trim() ? (
              <p className="mt-1.5 text-[13px] text-[var(--muted-foreground)]">{film.yearLine}</p>
            ) : null}
            <p className="mt-2 text-[12px] text-[var(--muted-foreground)]">
              {locale === "zh"
                ? `第 ${film.month} 月 · 第 ${film.week} 周`
                : `Month ${film.month} · Week ${film.week}`}
            </p>
          </div>
        </article>

        <section className="mt-10 border-t border-[var(--border-subtle)] pt-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
            {locale === "zh" ? "观影笔记" : "Film Note"}
          </p>
          <h2 className="mt-3 text-[16px] font-medium leading-snug text-[var(--foreground)]">
            {note?.sectionTitle ?? (locale === "zh" ? `${film.title} 电影观后感` : `${film.title} — reflections`)}
          </h2>
          <div
            className="prose prose-sm mt-4 max-w-none text-[14px] leading-[1.85] text-[var(--foreground)]/92"
            dangerouslySetInnerHTML={{
              __html: toDisplayHtml(
                note?.fullText ??
                  (locale === "zh"
                    ? "尚未同步到观影笔记。请先在对应周复盘「电影观后感」条目里填写并保存。"
                    : "No synced film note yet. Fill and save the movie section in that week’s reflection first.")
              ),
            }}
          />
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href={`/weekly/week-${sourceWeek}#weekly-prompt-${film.reflectionPromptId}`}
              className="text-[13px] font-medium text-[var(--primary)] underline-offset-4 hover:underline"
            >
              {locale === "zh" ? "在周复盘打开本条" : "Open in Week Reflection"}
            </Link>
            <Link
              href="/watching"
              className="text-[13px] font-medium text-[var(--muted-foreground)] underline-offset-4 hover:text-[var(--foreground)] hover:underline"
            >
              {locale === "zh" ? "返回观影档案" : "Back to Watching Archive"}
            </Link>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
