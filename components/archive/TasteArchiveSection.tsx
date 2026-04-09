"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DetailModal } from "@/components/shared/DetailModal";
import type { TasteEntry } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";

const typeKeys: Record<string, string> = {
  Movie: "taste.movie",
  Book: "taste.book",
  Exhibition: "taste.exhibition",
  Brand: "taste.brand",
  Space: "taste.space",
  Person: "taste.person",
  Music: "taste.music",
  Restaurant: "taste.restaurant",
  City: "taste.city",
};

export function TasteArchiveSection({
  entries,
  intro,
}: {
  entries: TasteEntry[];
  intro: string;
}) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<TasteEntry | null>(null);

  return (
    <>
      <p className="mb-10 max-w-xl text-[14px] leading-[var(--line-height-relaxed)] text-[var(--muted-foreground)]">
        {intro}
      </p>
      {entries.length === 0 ? (
        <p className="text-[14px] text-[var(--muted-foreground)]">{t("archive.emptyReadingWatching")}</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {entries.map((entry) => (
            <Card
              key={entry.id}
              className="cursor-pointer border-[var(--border-subtle)] transition-colors hover:border-[var(--border)]"
              onClick={() => setSelected(entry)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[15px] font-medium text-[var(--foreground)]">{entry.title}</h3>
                  <Badge variant="outline" className="shrink-0 text-[10px]">
                    {t(typeKeys[entry.type] ?? entry.type)}
                  </Badge>
                </div>
                <p className="mt-2 text-[12px] text-[var(--muted-foreground)]">{entry.date}</p>
                <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-[var(--foreground)]/85">
                  {entry.whyILikeIt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <DetailModal
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
        title={selected?.title ?? ""}
      >
        {selected && (
          <div className="space-y-4 text-[14px] leading-relaxed">
            <p className="text-[var(--muted-foreground)]">{selected.date}</p>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                {t("taste.whyILikeIt")}
              </p>
              <p className="mt-1">{selected.whyILikeIt}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                {t("taste.translateToLife")}
              </p>
              <p className="mt-1">{selected.translateToLife}</p>
            </div>
          </div>
        )}
      </DetailModal>
    </>
  );
}
