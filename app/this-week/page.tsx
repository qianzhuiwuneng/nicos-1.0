"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { useLanguage } from "@/context/LanguageContext";
import { useWeek52Nav } from "@/context/Week52Context";
import { getPhaseForWeek, getWeek52Entry } from "@/lib/week52-data";
import { WeeklyReviewEditor } from "@/components/weekly/WeeklyReviewEditor";

export default function ThisWeekPage() {
  const { t, locale } = useLanguage();
  const { focusWeek } = useWeek52Nav();
  const entry = getWeek52Entry(focusWeek);
  const phase = getPhaseForWeek(focusWeek);
  const weekLabel = locale === "zh" ? `第 ${focusWeek} 周` : `Week ${focusWeek}`;

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
      <div className="mx-auto max-w-[var(--content-width)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
          {t("thisWeekPage.phaseLabel")}
        </p>
        {phaseName && (
          <p className="mt-1 text-[13px] text-[var(--primary)]">{phaseName}</p>
        )}
        <h1 className="mt-4 text-[clamp(1.35rem,3vw,1.75rem)] font-medium tracking-tight text-[var(--foreground)] leading-tight">
          {weekLabel}
          <span className="text-[var(--muted-foreground)]"> · </span>
          {title}
        </h1>

        <div className="mt-10 rounded-[var(--radius)] border border-[var(--border-subtle)] bg-[var(--card)] p-6">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
            {t("program.coreGoal")}
          </h2>
          <p className="mt-4 text-[15px] leading-[var(--line-height-relaxed)] text-[var(--foreground)]">
            {entry.goalZh}
          </p>
        </div>

        <div className="mt-10">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
            {t("program.thisWeekTasks")}
          </h2>
          <ul className="mt-4 space-y-3">
            {entry.tasksZh.map((item, i) => (
              <li
                key={i}
                className="flex gap-3 text-[15px] leading-[var(--line-height-relaxed)] text-[var(--foreground)]"
              >
                <span className="shrink-0 text-[var(--muted-foreground)]">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8">
          <Link
            href={`/journey?week=${focusWeek}`}
            className="text-[13px] font-medium text-[var(--muted-foreground)] underline-offset-4 transition-colors hover:text-[var(--foreground)] hover:underline"
          >
            {t("thisWeekPage.openMap")}
          </Link>
        </p>

        <WeeklyReviewEditor
          programWeek={focusWeek}
          className="mt-16 border-t border-[var(--border-subtle)] pt-12"
          showOpenFullLink
        />
      </div>
    </AppLayout>
  );
}
