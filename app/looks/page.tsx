"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LookCard } from "@/components/shared/LookCard";
import { DetailModal } from "@/components/shared/DetailModal";
import { lookEntries } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";
import type { LookEntry } from "@/lib/types";

const occasionKeys: Record<string, string> = {
  All: "looks.all",
  Work: "looks.work",
  Daily: "looks.daily",
  Social: "looks.social",
  Event: "looks.event",
  Travel: "looks.travel",
};

const occasions = ["All", "Work", "Daily", "Social", "Event", "Travel"] as const;

export default function LooksPage() {
  const { t } = useLanguage();
  const [tab, setTab] = useState("All");
  const [selected, setSelected] = useState<LookEntry | null>(null);

  const filtered =
    tab === "All" ? lookEntries : lookEntries.filter((e) => e.occasion === tab);

  return (
    <AppLayout
      title={t("looks.title")}
      description={t("looks.description")}
    >
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-8">
          {occasions.map((o) => (
            <TabsTrigger key={o} value={o}>
              {t(occasionKeys[o])}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={tab} className="mt-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((look) => (
              <LookCard key={look.id} look={look} onClick={() => setSelected(look)} />
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
            <p className="text-[var(--muted-foreground)]">
              {selected.date} · {t(occasionKeys[selected.occasion] ?? selected.occasion)}
            </p>
            <div className="flex flex-wrap gap-2">
              {selected.styleTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[var(--radius-sm)] bg-[var(--muted)] px-2.5 py-0.5 text-[11px] text-[var(--muted-foreground)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p>
              <span className="font-medium text-[var(--muted-foreground)]">{t("looks.colour")}:</span>{" "}
              {selected.colorPalette}
            </p>
            <p>
              <span className="font-medium text-[var(--muted-foreground)]">{t("looks.selfRating")}:</span> ★{" "}
              {selected.selfRating}/5 · {t("looks.photogenic")}: {selected.photogenicRating}
            </p>
            {selected.hairstyle && (
              <p>
                <span className="font-medium text-[var(--muted-foreground)]">{t("looks.hair")}:</span>{" "}
                {selected.hairstyle}
              </p>
            )}
            {selected.makeup && (
              <p>
                <span className="font-medium text-[var(--muted-foreground)]">{t("looks.makeup")}:</span>{" "}
                {selected.makeup}
              </p>
            )}
            {selected.notes && (
              <p>
                <span className="font-medium text-[var(--muted-foreground)]">{t("ledger.notes")}:</span>{" "}
                {selected.notes}
              </p>
            )}
            {selected.feedback && (
              <p>
                <span className="font-medium text-[var(--muted-foreground)]">{t("looks.feedback")}:</span>{" "}
                {selected.feedback}
              </p>
            )}
            {selected.nextAdjustment && (
              <p>
                <span className="font-medium text-[var(--muted-foreground)]">{t("looks.nextAdjustment")}:</span>{" "}
                {selected.nextAdjustment}
              </p>
            )}
          </div>
        )}
      </DetailModal>
    </AppLayout>
  );
}
