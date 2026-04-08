"use client";

import { StatCard } from "@/components/shared/StatCard";
import { dashboardStats } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";

export function MonthlyOverview() {
  const { t } = useLanguage();
  const { monthlySpend, monthlyEntryCount, monthlyBestLookCount, monthlyHighEnergyDays } =
    dashboardStats;

  return (
    <section className="mb-12">
      <h2 className="mb-4 text-[12px] font-medium uppercase tracking-[0.05em] text-[var(--muted-foreground)]">
        {t("dashboard.monthlyOverview")}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("dashboard.totalSpend")} value={`¥${monthlySpend.toLocaleString()}`} />
        <StatCard
          label={t("dashboard.entries")}
          value={monthlyEntryCount}
          sub={t("dashboard.entriesSub")}
        />
        <StatCard
          label={t("dashboard.bestLooks")}
          value={monthlyBestLookCount}
          sub={t("dashboard.bestLooksSub")}
        />
        <StatCard
          label={t("dashboard.highEnergyDays")}
          value={monthlyHighEnergyDays}
          sub={t("dashboard.highEnergyDaysSub")}
        />
      </div>
    </section>
  );
}
