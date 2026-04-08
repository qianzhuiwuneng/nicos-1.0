"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { monthlyReflections } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";

export default function MonthlyPage() {
  const { t } = useLanguage();
  const [selectedId, setSelectedId] = useState<string | null>(monthlyReflections[0]?.id ?? null);

  const selected = monthlyReflections.find((m) => m.id === selectedId) ?? monthlyReflections[0];

  return (
    <AppLayout
      title={t("monthly.title")}
      description={t("monthly.description")}
    >
      <div className="mb-8 flex flex-wrap gap-2">
        {monthlyReflections.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setSelectedId(m.id)}
            className={`rounded-[var(--radius-sm)] border px-4 py-2 text-[13px] font-medium transition-colors ${
              selectedId === m.id
                ? "border-[var(--primary)]/30 bg-[var(--accent)] text-[var(--foreground)]"
                : "border-[var(--border-subtle)] bg-[var(--card)] text-[var(--muted-foreground)] hover:border-[var(--border)] hover:text-[var(--foreground)]"
            }`}
          >
            {m.month}
          </button>
        ))}
      </div>

      {selected && (
        <div className="mx-auto max-w-[var(--content-width-wide)] space-y-8">
          <Card className="border-[var(--border-subtle)]">
            <CardContent className="p-6">
              <h2 className="text-[17px] font-medium tracking-[-0.02em] text-[var(--foreground)]">
                {selected.month}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {selected.keyword.map((k) => (
                  <Badge key={k} variant="soft">
                    {k}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[var(--border-subtle)]">
            <CardContent className="space-y-2 p-6">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.05em] text-[var(--muted-foreground)]">
                {t("monthly.biggestChange")}
              </h3>
              <p className="text-[14px] text-[var(--foreground)] leading-[var(--line-height-relaxed)]">
                {selected.biggestChange}
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="border-[var(--border-subtle)]">
              <CardContent className="p-6">
                <h3 className="text-[11px] font-medium uppercase tracking-[0.05em] text-[var(--muted-foreground)]">
                  {t("monthly.top3WorthIt")}
                </h3>
                <ul className="mt-3 space-y-2 text-[14px] text-[var(--foreground)] leading-[var(--line-height-relaxed)]">
                  {selected.top3WorthIt.map((item, i) => (
                    <li key={i}>· {item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-[var(--border-subtle)]">
              <CardContent className="p-6">
                <h3 className="text-[11px] font-medium uppercase tracking-[0.05em] text-[var(--muted-foreground)]">
                  {t("monthly.top3NotWorthIt")}
                </h3>
                <ul className="mt-3 space-y-2 text-[14px] text-[var(--foreground)] leading-[var(--line-height-relaxed)]">
                  {selected.top3NotWorthIt.map((item, i) => (
                    <li key={i}>· {item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="border-[var(--border-subtle)]">
            <CardContent className="p-6">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.05em] text-[var(--muted-foreground)]">
                {t("monthly.bestLooksAndInspirations")}
              </h3>
              <p className="mt-2 text-[14px] text-[var(--foreground)] leading-[var(--line-height-relaxed)]">
                {t("monthly.looks")}: {selected.bestLooks.join("; ")}
              </p>
              <p className="mt-1 text-[14px] text-[var(--foreground)] leading-[var(--line-height-relaxed)]">
                {t("monthly.inspiration")}: {selected.bestInspirations.join("; ")}
              </p>
            </CardContent>
          </Card>

          <Card className="border-[var(--border-subtle)] bg-[var(--accent)]/20">
            <CardContent className="p-6">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.05em] text-[var(--muted-foreground)]">
                {t("monthly.nextMonthFocus")}
              </h3>
              <p className="mt-2 text-[14px] text-[var(--foreground)] leading-[var(--line-height-relaxed)]">
                {selected.nextMonthFocus}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </AppLayout>
  );
}
