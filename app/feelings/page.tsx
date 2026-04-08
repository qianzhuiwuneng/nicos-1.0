"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { DetailModal } from "@/components/shared/DetailModal";
import { MoodBadge } from "@/components/shared/MoodBadge";
import { feelingEntries } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";
import type { FeelingEntry } from "@/lib/types";

const energyKeys: Record<number, string> = {
  1: "feelings.energyLow",
  2: "feelings.energyMediumLow",
  3: "feelings.energyMedium",
  4: "feelings.energyMediumHigh",
  5: "feelings.energyHigh",
};

export default function FeelingsPage() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<FeelingEntry | null>(null);

  return (
    <AppLayout
      title={t("feelings.title")}
      description={t("feelings.description")}
      narrow
    >
      <div className="mx-auto max-w-[var(--content-width)]">
        <p className="mb-10 text-[14px] text-[var(--muted-foreground)] leading-[var(--line-height-relaxed)]">
          {t("feelings.intro")}
        </p>

        <div className="space-y-3">
          {feelingEntries.map((entry) => (
            <Card
              key={entry.id}
              className="cursor-pointer border-[var(--border-subtle)] transition-colors hover:border-[var(--border)]"
              onClick={() => setSelected(entry)}
            >
              <CardContent className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-medium text-[var(--foreground)]">
                      {entry.title}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[var(--muted-foreground)]">
                      {entry.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MoodBadge moods={entry.mood} />
                    <span className="rounded-[var(--radius-sm)] bg-[var(--accent)] px-2.5 py-1 text-[11px] text-[var(--accent-foreground)]">
                      {t(energyKeys[entry.energy])} {t("feelings.energy")}
                    </span>
                  </div>
                </div>
                <p className="mt-4 line-clamp-2 text-[14px] text-[var(--foreground)]/90 leading-[var(--line-height-relaxed)]">
                  {entry.self_state}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <DetailModal
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        title={selected?.title ?? ""}
      >
        {selected && (
          <div className="space-y-5 text-[14px] leading-[var(--line-height-relaxed)]">
            <p className="text-[var(--muted-foreground)]">{selected.date}</p>
            <MoodBadge moods={selected.mood} />
            <p>
              <span className="font-medium text-[var(--muted-foreground)]">{t("feelings.energy")}:</span>{" "}
              {t(energyKeys[selected.energy])}
            </p>
            <p className="italic">&ldquo;{selected.self_state}&rdquo;</p>
            {selected.favorite_moment && (
              <p>
                <span className="font-medium text-[var(--muted-foreground)]">{t("feelings.favouriteMoment")}:</span>{" "}
                {selected.favorite_moment}
              </p>
            )}
            {selected.uncomfortable_moment && (
              <p>
                <span className="font-medium text-[var(--muted-foreground)]">{t("feelings.uncomfortable")}:</span>{" "}
                {selected.uncomfortable_moment}
              </p>
            )}
            {selected.touched_by && (
              <p>
                <span className="font-medium text-[var(--muted-foreground)]">{t("feelings.touchedBy")}:</span>{" "}
                {selected.touched_by}
              </p>
            )}
            {selected.confirmed && (
              <p>
                <span className="font-medium text-[var(--muted-foreground)]">{t("feelings.confirmed")}:</span>{" "}
                {selected.confirmed}
              </p>
            )}
            {selected.eliminated && (
              <p>
                <span className="font-medium text-[var(--muted-foreground)]">{t("feelings.eliminated")}:</span>{" "}
                {selected.eliminated}
              </p>
            )}
          </div>
        )}
      </DetailModal>
    </AppLayout>
  );
}
