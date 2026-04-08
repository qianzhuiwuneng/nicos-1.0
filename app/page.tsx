"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { WeeklyFocus } from "@/components/dashboard/WeeklyFocus";
import { MonthlyOverview } from "@/components/dashboard/MonthlyOverview";
import { RecentEntries } from "@/components/dashboard/RecentEntries";
import { InspirationBlock } from "@/components/dashboard/InspirationBlock";
import { QuickLinks } from "@/components/dashboard/QuickLinks";
import { useLanguage } from "@/context/LanguageContext";

export default function DashboardPage() {
  const { t } = useLanguage();

  return (
    <AppLayout
      title={t("dashboard.title")}
      description={t("dashboard.description")}
    >
      <WelcomeSection />
      <QuickActions />
      <div className="mb-12 grid gap-8 lg:grid-cols-2">
        <WeeklyFocus />
        <div className="rounded-[var(--radius)] border border-[var(--border-subtle)] bg-[var(--card)] p-6 shadow-[var(--shadow-card)]">
          <h2 className="text-[12px] font-medium uppercase tracking-[0.06em] text-[var(--muted-foreground)]">
            {t("dashboard.monthlyKeywords")}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-[var(--radius-pill)] bg-[var(--whimsy-peach)] px-3 py-1.5 text-[13px] font-medium text-[var(--foreground)]">
              Restraint
            </span>
            <span className="rounded-[var(--radius-pill)] bg-[var(--whimsy-sky)] px-3 py-1.5 text-[13px] font-medium text-[var(--foreground)]">
              Quiet
            </span>
            <span className="rounded-[var(--radius-pill)] bg-[var(--whimsy-mint)] px-3 py-1.5 text-[13px] font-medium text-[var(--foreground)]">
              Palette
            </span>
          </div>
        </div>
      </div>
      <MonthlyOverview />
      <RecentEntries />
      <InspirationBlock />
      <QuickLinks />
    </AppLayout>
  );
}
