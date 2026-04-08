"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { useLanguage } from "@/context/LanguageContext";
import { useWeek52Nav } from "@/context/Week52Context";
import { getPhaseForWeek, getWeek52Entry } from "@/lib/week52-data";

function ProgramContent() {
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
  const phaseName =
    phase && (locale === "zh" ? phase.nameZh : phase.nameEn);

  return (
    <div className="max-w-2xl">
      {phaseName && (
        <p className="text-[12px] font-medium text-[var(--primary)]">{phaseName}</p>
      )}
      <h2 className="mt-1 text-[20px] font-semibold tracking-tight text-[var(--foreground)]">
        {weekLabel}
        <span className="text-[var(--muted-foreground)]"> · </span>
        {title}
      </h2>
      <div className="mt-6 rounded-[var(--radius)] border border-[var(--border-subtle)] bg-[var(--card)] p-5 shadow-[var(--shadow-card)]">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--muted-foreground)]">
          {t("program.coreGoal")}
        </h3>
        <p className="mt-2 text-[14px] leading-[var(--line-height-relaxed)] text-[var(--foreground)]">
          {goal}
        </p>
      </div>
      <div className="mt-6">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--muted-foreground)]">
          {t("program.thisWeekTasks")}
        </h3>
        <ul className="mt-3 space-y-2">
          {tasks.map((item, i) => (
            <li
              key={i}
              className="flex gap-2 text-[14px] leading-[var(--line-height-relaxed)] text-[var(--foreground)]"
            >
              <span className="shrink-0 text-[var(--primary)]">·</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-8 text-[12px] text-[var(--muted-foreground)] leading-relaxed">
        {t("program.disclaimer")}
      </p>
    </div>
  );
}

export default function ProgramPage() {
  const { t } = useLanguage();

  return (
    <AppLayout title={t("program.pageTitle")} description={t("program.pageDescription")}>
      <Suspense
        fallback={
          <p className="text-[14px] text-[var(--muted-foreground)]">{t("program.loading")}</p>
        }
      >
        <ProgramContent />
      </Suspense>
    </AppLayout>
  );
}
