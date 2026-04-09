"use client";

import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { monthlyReflections } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";

const PROGRAM_START = new Date("2026-03-02T00:00:00");

function toMonthKey(d: Date) {
  return d.getFullYear() * 12 + d.getMonth();
}

function formatMonthLabel(date: Date, locale: "en" | "zh") {
  if (locale === "zh") {
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  }
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date);
}

export default function MonthlyPage() {
  const { t, locale } = useLanguage();

  const reflectionItems = useMemo(() => {
    return monthlyReflections
      .map((reflection, index) => {
        const monthDate = new Date(PROGRAM_START.getFullYear(), PROGRAM_START.getMonth() + index, 1);
        const monthNumber = index + 1;
        return {
          ...reflection,
          monthDate,
          monthNumber,
          programLabel:
            locale === "zh"
              ? `第 ${monthNumber} 个月 · ${formatMonthLabel(monthDate, "zh")}`
              : `Month ${monthNumber} · ${formatMonthLabel(monthDate, "en")}`,
        };
      })
      .sort((a, b) => b.monthDate.getTime() - a.monthDate.getTime());
  }, [locale]);

  const defaultSelectedId = useMemo(() => {
    if (!reflectionItems.length) return null;
    const nowKey = toMonthKey(new Date());
    const elapsedMonthCount = nowKey - toMonthKey(new Date(PROGRAM_START.getFullYear(), PROGRAM_START.getMonth(), 1));
    const clampedMonthNumber = Math.min(Math.max(elapsedMonthCount, 0), reflectionItems.length - 1) + 1;
    return (
      reflectionItems.find((item) => item.monthNumber === clampedMonthNumber)?.id ?? reflectionItems[0].id
    );
  }, [reflectionItems]);

  const [selectedId, setSelectedId] = useState<string | null>(defaultSelectedId);

  const selected = reflectionItems.find((m) => m.id === selectedId) ?? reflectionItems[0];

  return (
    <AppLayout
      title={t("monthly.title")}
      description={t("monthly.description")}
    >
      <p className="mb-5 text-[12px] text-[var(--muted-foreground)]">
        {locale === "zh" ? "项目开始于 2026.03.02" : "Program starts on 2026-03-02"}
      </p>
      <div className="mb-8 flex flex-wrap gap-2">
        {reflectionItems.map((m) => (
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
            {m.programLabel}
          </button>
        ))}
      </div>

      {selected && (
        <div className="mx-auto max-w-[var(--content-width-wide)] space-y-8">
          <Card className="border-[var(--border-subtle)]">
            <CardContent className="p-6">
              <h2 className="text-[17px] font-medium tracking-[-0.02em] text-[var(--foreground)]">
                {selected.programLabel}
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
                {locale === "zh" ? "本月片段" : "Monthly Highlights"}
              </h3>
              <p className="mt-2 text-[14px] text-[var(--foreground)] leading-[var(--line-height-relaxed)]">
                {locale === "zh" ? "观察" : "Observations"}: {selected.bestLooks.join("; ")}
              </p>
              <p className="mt-1 text-[14px] text-[var(--foreground)] leading-[var(--line-height-relaxed)]">
                {locale === "zh" ? "启发" : "Resonances"}: {selected.bestInspirations.join("; ")}
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
