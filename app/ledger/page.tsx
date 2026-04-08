"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DetailModal } from "@/components/shared/DetailModal";
import { StatCard } from "@/components/shared/StatCard";
import { ledgerEntries } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";
import type { LedgerEntry as LedgerType, LedgerCategory } from "@/lib/types";

const categoryKeys: Record<string, string> = {
  All: "ledger.all",
  Fashion: "ledger.fashion",
  Skincare: "ledger.skincare",
  Aesthetic: "ledger.aesthetic",
  Hair: "ledger.hair",
  Experience: "ledger.experience",
  Wellness: "ledger.wellness",
  Other: "ledger.other",
};

const categories: LedgerCategory[] = [
  "Fashion",
  "Skincare",
  "Aesthetic",
  "Hair",
  "Experience",
  "Wellness",
  "Other",
];

export default function LedgerPage() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<string>("All");
  const [selected, setSelected] = useState<LedgerType | null>(null);

  const filtered =
    tab === "All" ? ledgerEntries : ledgerEntries.filter((e) => e.category === tab);

  const monthlySpend = ledgerEntries.reduce((s, e) => s + e.amount, 0);
  const highEffect = ledgerEntries.filter((e) => e.effectiveness === "High").length;
  const repurchaseRate = Math.round(
    (ledgerEntries.filter((e) => e.repurchase === "Yes").length / ledgerEntries.length) * 100
  );

  return (
    <AppLayout
      title={t("ledger.title")}
      description={t("ledger.description")}
    >
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-8 flex-wrap">
          <TabsTrigger value="All">{t("ledger.all")}</TabsTrigger>
          {categories.map((c) => (
            <TabsTrigger key={c} value={c}>
              {t(categoryKeys[c])}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatCard label={t("ledger.thisMonthSpend")} value={`¥${monthlySpend.toLocaleString()}`} />
          <StatCard label={t("ledger.highEffectiveness")} value={highEffect} sub={t("ledger.entries")} />
          <StatCard label={t("ledger.wouldRepurchase")} value={`${repurchaseRate}%`} />
        </div>

        <TabsContent value={tab} className="mt-0">
          <div className="space-y-2">
            {filtered.map((entry) => (
              <Card
                key={entry.id}
                className="cursor-pointer border-[var(--border-subtle)] transition-colors hover:border-[var(--border)]"
                onClick={() => setSelected(entry)}
              >
                <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                  <div>
                    <p className="text-[14px] font-medium text-[var(--foreground)]">
                      {entry.title}
                    </p>
                    <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)] leading-relaxed">
                      {entry.purpose}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="soft">{t(categoryKeys[entry.category] ?? "ledger.other")}</Badge>
                    <span className="text-[14px] font-medium text-[var(--foreground)]">
                      ¥{entry.amount.toLocaleString()}
                    </span>
                    <Badge
                      variant={entry.effectiveness === "High" ? "default" : "secondary"}
                      className="text-[11px]"
                    >
                      {entry.effectiveness}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <DetailModal
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        title={selected?.title ?? ""}
      >
        {selected && (
          <div className="space-y-4 text-[14px] leading-[var(--line-height-relaxed)]">
            <div className="flex flex-wrap gap-2">
              <Badge variant="soft">{t(categoryKeys[selected.category] ?? "ledger.other")}</Badge>
              <Badge variant="outline">{selected.effectiveness} {t("ledger.effect")}</Badge>
              <Badge variant="outline">{t("ledger.repurchase")}: {selected.repurchase}</Badge>
            </div>
            <p>
              <span className="font-medium text-[var(--muted-foreground)]">{t("ledger.date")}:</span> {selected.date}
            </p>
            <p>
              <span className="font-medium text-[var(--muted-foreground)]">{t("ledger.amount")}:</span> ¥
              {selected.amount.toLocaleString()}
            </p>
            <p>
              <span className="font-medium text-[var(--muted-foreground)]">{t("ledger.why")}:</span> {selected.purpose}
            </p>
            {selected.notes && (
              <p>
                <span className="font-medium text-[var(--muted-foreground)]">{t("ledger.notes")}:</span>{" "}
                {selected.notes}
              </p>
            )}
          </div>
        )}
      </DetailModal>
    </AppLayout>
  );
}
