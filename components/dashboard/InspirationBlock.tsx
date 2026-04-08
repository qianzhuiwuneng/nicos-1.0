"use client";

import Link from "next/link";
import { tasteEntries } from "@/lib/data";
import { SectionCard } from "@/components/shared/SectionCard";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

const recentTaste = tasteEntries.slice(0, 4);

export function InspirationBlock() {
  const { t } = useLanguage();

  return (
    <SectionCard
      title={t("dashboard.recentInspiration")}
      action={
        <Link
          href="/taste"
          className="text-[12px] font-medium text-[var(--primary)] hover:underline"
        >
          {t("dashboard.viewAll")}
        </Link>
      }
      className="mb-12"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {recentTaste.map((taste) => (
          <div
            key={taste.id}
            className="rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--muted)]/20 p-4 transition-colors hover:border-[var(--border)] hover:bg-[var(--muted)]/30"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[14px] font-medium text-[var(--foreground)]">{taste.title}</p>
              <Badge variant="outline" className="shrink-0 text-[11px] font-normal">
                {taste.type}
              </Badge>
            </div>
            <p className="mt-2 line-clamp-2 text-[13px] text-[var(--muted-foreground)] leading-relaxed">
              {taste.whyILikeIt}
            </p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
