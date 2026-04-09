"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { BookCover } from "@/components/reading/BookCover";
import { useLanguage } from "@/context/LanguageContext";
import { useWeek52Nav } from "@/context/Week52Context";
import { getPhaseForWeek, getWeek52Entry } from "@/lib/week52-data";
import { WeeklyReviewEditor } from "@/components/weekly/WeeklyReviewEditor";
import { getCurrentProgramWeek } from "@/lib/program-week";
import { getWeeklyHubContent } from "@/lib/reading-journey";

export default function ThisWeekPage() {
  const { t, locale } = useLanguage();
  const { setFocusWeek } = useWeek52Nav();
  const currentWeek = getCurrentProgramWeek();
  const entry = getWeek52Entry(currentWeek);
  const phase = getPhaseForWeek(currentWeek);
  const weeklyHub = getWeeklyHubContent(currentWeek);
  const thisWeekReading = weeklyHub.reading[0];
  const thisWeekWatching = weeklyHub.watching[0];
  const weekLabel = locale === "zh" ? `第 ${currentWeek} 周` : `Week ${currentWeek}`;

  useEffect(() => {
    setFocusWeek(currentWeek);
  }, [currentWeek, setFocusWeek]);

  if (!entry) {
    return (
      <AppLayout title={t("thisWeekPage.title")} description={t("thisWeekPage.description")} narrow>
        <p className="text-[14px] text-[var(--muted-foreground)]">{t("program.notFound")}</p>
      </AppLayout>
    );
  }

  const title = locale === "zh" ? entry.titleZh : entry.titleEn;
  const phaseName = phase && (locale === "zh" ? phase.nameZh : phase.nameEn);

  return (
    <AppLayout title={t("thisWeekPage.title")} description={t("thisWeekPage.description")} narrow>
      <div className="mx-auto max-w-[42rem] pb-16 pt-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--muted-foreground)]">
          {t("thisWeekPage.phaseLabel")}
        </p>
        {phaseName && (
          <p className="mt-2 text-[13px] text-[var(--primary)]/90">{phaseName}</p>
        )}
        <h1 className="mt-5 text-[clamp(1.35rem,3vw,1.75rem)] font-medium tracking-tight text-[var(--foreground)] leading-[1.2]">
          {weekLabel}
          <span className="text-[var(--muted-foreground)]"> · </span>
          {title}
        </h1>

        <div className="mt-12 border-t border-[var(--border-subtle)] pt-10">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--muted-foreground)]">
            {t("program.coreGoal")}
          </h2>
          <p className="mt-4 text-[15px] leading-[1.9] text-[var(--foreground)]/92">
            {entry.goalZh}
          </p>
        </div>

        <div className="mt-12 border-t border-[var(--border-subtle)] pt-10">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--muted-foreground)]">
            {t("program.thisWeekTasks")}
          </h2>
          <ul className="mt-4 space-y-4">
            {entry.tasksZh.map((item, i) => (
              <li
                key={i}
                className="flex gap-3 text-[15px] leading-[1.85] text-[var(--foreground)]/92"
              >
                <span className="shrink-0 text-[var(--muted-foreground)]">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 border-t border-[var(--border-subtle)] pt-10">
          <div className="grid grid-cols-1 items-start gap-10 sm:grid-cols-2 sm:gap-8">
            <section>
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--muted-foreground)]">
                {locale === "zh" ? "本周阅读" : "This Week's Reading"}
              </h2>
              {thisWeekReading ? (
                <article className="mt-4 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--card)]/55 p-4">
                  <BookCover
                    src={thisWeekReading.coverImage}
                    title={thisWeekReading.title}
                    author={thisWeekReading.author}
                    toneClassName={thisWeekReading.coverTone}
                    className="max-w-[11rem]"
                  />
                  <p className="mt-4 text-[12px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                    {thisWeekReading.author}
                  </p>
                  <p className="mt-1 text-[14px] font-medium text-[var(--foreground)]">{thisWeekReading.title}</p>
                  <p className="mt-1 text-[12px] text-[var(--muted-foreground)]">{thisWeekReading.tagline}</p>
                  <Link
                    href={`/reading#week-${currentWeek}`}
                    className="mt-4 inline-flex text-[12px] font-medium text-[var(--primary)] underline-offset-4 hover:underline"
                  >
                    {locale === "zh" ? "在阅读中打开" : "Open in Reading"}
                  </Link>
                </article>
              ) : (
                <p className="mt-4 text-[14px] text-[var(--muted-foreground)]">
                  {locale === "zh" ? "本周暂无关联书目。" : "No linked reading for this week yet."}
                </p>
              )}
            </section>

            <section>
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--muted-foreground)]">
                {locale === "zh" ? "本周观影" : "This Week's Watching"}
              </h2>
              {thisWeekWatching ? (
                <article className="mt-4 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--card)]/55 p-4">
                  <BookCover
                    src={thisWeekWatching.coverImage}
                    title={thisWeekWatching.title}
                    author={thisWeekWatching.director}
                    toneClassName={thisWeekWatching.coverTone}
                    className="max-w-[11rem]"
                  />
                  {thisWeekWatching.director.trim() ? (
                    <p className="mt-4 text-[12px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                      {thisWeekWatching.director}
                    </p>
                  ) : null}
                  <p className="mt-1 text-[14px] font-medium text-[var(--foreground)]">{thisWeekWatching.title}</p>
                  <p className="mt-1 text-[12px] text-[var(--muted-foreground)]">
                    {locale === "zh" ? thisWeekWatching.taglineZh : thisWeekWatching.tagline}
                  </p>
                  <Link
                    href={`/watching#week-${currentWeek}`}
                    className="mt-4 inline-flex text-[12px] font-medium text-[var(--primary)] underline-offset-4 hover:underline"
                  >
                    {locale === "zh" ? "在观影档案中打开" : "Open in Watching archive"}
                  </Link>
                </article>
              ) : (
                <p className="mt-4 text-[14px] text-[var(--muted-foreground)]">
                  {locale === "zh" ? "本周暂无关联影片。" : "No linked film for this week yet."}
                </p>
              )}
            </section>
          </div>
        </div>

        <p className="mt-10 border-t border-[var(--border-subtle)] pt-8">
          <Link
            href={`/journey?week=${currentWeek}`}
            className="text-[13px] font-medium text-[var(--muted-foreground)] underline-offset-4 transition-colors hover:text-[var(--foreground)] hover:underline"
          >
            {t("thisWeekPage.openMap")}
          </Link>
        </p>

        <WeeklyReviewEditor
          programWeek={currentWeek}
          className="mt-14 border-t border-[var(--border-subtle)] pt-12"
          showOpenFullLink
        />
      </div>
    </AppLayout>
  );
}
