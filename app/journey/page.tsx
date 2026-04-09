"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { useLanguage } from "@/context/LanguageContext";
import { useWeek52Nav } from "@/context/Week52Context";
import { getPhaseForWeek, getWeek52Entry } from "@/lib/week52-data";
import { YearJourneyTimeline, YearJourneyUrlSync } from "@/components/journey/YearJourneyTimeline";

function JourneyContent() {
  const { t, locale } = useLanguage();
  const searchParams = useSearchParams();
  const { focusWeek } = useWeek52Nav();

  const fromUrl = parseInt(searchParams.get("week") ?? "", 10);
  const week =
    !Number.isNaN(fromUrl) && fromUrl >= 1 && fromUrl <= 52 ? fromUrl : focusWeek;
  const entry = getWeek52Entry(week);
  const phase = getPhaseForWeek(week);

  const weekLabel = locale === "zh" ? `第 ${week} 周` : `Week ${week}`;

  if (!entry) {
    return (
      <p className="text-[14px] text-[var(--muted-foreground)]">{t("program.notFound")}</p>
    );
  }

  const title = locale === "zh" ? entry.titleZh : entry.titleEn;
  const goal = entry.goalZh;
  const tasks = entry.tasksZh;
  const phaseName = phase && (locale === "zh" ? phase.nameZh : phase.nameEn);

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
      <aside className="order-2 w-full shrink-0 border-t border-[var(--border-subtle)] pt-8 lg:order-1 lg:w-56 lg:border-t-0 lg:border-r lg:pr-6 lg:pt-0">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
          {t("journey.timelineLabel")}
        </p>
        <YearJourneyUrlSync />
        <YearJourneyTimeline />
      </aside>
      <div className="order-1 min-w-0 flex-1 lg:order-2">
        {phaseName && (
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--primary)]">
            {phaseName}
          </p>
        )}
        <h2 className="mt-2 text-[clamp(1.25rem,2.5vw,1.5rem)] font-medium tracking-tight text-[var(--foreground)] leading-tight">
          {weekLabel}
          <span className="text-[var(--muted-foreground)]"> · </span>
          {title}
        </h2>
        <div className="mt-8 rounded-[var(--radius)] border border-[var(--border-subtle)] bg-[var(--card)] p-6">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
            {t("program.coreGoal")}
          </h3>
          <p className="mt-3 text-[15px] leading-[var(--line-height-relaxed)] text-[var(--foreground)]">
            {goal}
          </p>
        </div>
        <div className="mt-8">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
            {t("program.thisWeekTasks")}
          </h3>
          <ul className="mt-4 space-y-3">
            {tasks.map((item, i) => (
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
        <p className="mt-10 text-[12px] leading-relaxed text-[var(--muted-foreground)]">
          {t("program.disclaimer")}
        </p>
      </div>
    </div>
  );
}

export default function JourneyPage() {
  const { t } = useLanguage();

  return (
    <AppLayout title={t("journey.title")} description={t("journey.description")} narrow>
      <Suspense
        fallback={
          <p className="text-[14px] text-[var(--muted-foreground)]">{t("program.loading")}</p>
        }
      >
        <JourneyContent />
      </Suspense>
    </AppLayout>
  );
}
