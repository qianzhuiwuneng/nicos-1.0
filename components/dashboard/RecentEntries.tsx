"use client";

import Link from "next/link";
import { feelingEntries, ledgerEntries, lookEntries } from "@/lib/data";
import { SectionCard } from "@/components/shared/SectionCard";
import { EntryCard } from "@/components/shared/EntryCard";
import { LookCard } from "@/components/shared/LookCard";
import { useLanguage } from "@/context/LanguageContext";

const recentFeelings = feelingEntries.slice(0, 3);
const recentLedger = ledgerEntries.slice(0, 3);
const recentLooks = lookEntries.slice(0, 3);

export function RecentEntries() {
  const { t } = useLanguage();

  return (
    <section className="mb-12">
      <h2 className="mb-4 text-[12px] font-medium uppercase tracking-[0.05em] text-[var(--muted-foreground)]">
        {t("dashboard.recentEntries")}
      </h2>
      <div className="grid gap-8 lg:grid-cols-3">
        <SectionCard
          title={t("dashboard.recentFeelings")}
          action={
            <Link
              href="/feelings"
              className="text-[12px] font-medium text-[var(--primary)] hover:underline"
            >
              {t("dashboard.viewAll")}
            </Link>
          }
        >
          <div className="space-y-2">
            {recentFeelings.map((f) => (
              <EntryCard
                key={f.id}
                title={f.title}
                date={f.date}
                excerpt={f.self_state}
                meta={f.mood.join(" · ")}
              />
            ))}
          </div>
        </SectionCard>
        <SectionCard
          title={t("dashboard.recentLedger")}
          action={
            <Link
              href="/ledger"
              className="text-[12px] font-medium text-[var(--primary)] hover:underline"
            >
              {t("dashboard.viewAll")}
            </Link>
          }
        >
          <div className="space-y-2">
            {recentLedger.map((l) => (
              <EntryCard
                key={l.id}
                title={l.title}
                date={l.date}
                excerpt={l.purpose}
                meta={`¥${l.amount} · ${l.category}`}
              />
            ))}
          </div>
        </SectionCard>
        <SectionCard
          title={t("dashboard.recentLooks")}
          action={
            <Link
              href="/looks"
              className="text-[12px] font-medium text-[var(--primary)] hover:underline"
            >
              {t("dashboard.viewAll")}
            </Link>
          }
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {recentLooks.map((look) => (
              <LookCard key={look.id} look={look} />
            ))}
          </div>
        </SectionCard>
      </div>
    </section>
  );
}
