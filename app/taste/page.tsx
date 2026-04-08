"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DetailModal } from "@/components/shared/DetailModal";
import { tasteEntries } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";
import type { TasteEntry } from "@/lib/types";

const typeKeys: Record<string, string> = {
  All: "taste.all",
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

const types = [
  "All",
  "Movie",
  "Book",
  "Exhibition",
  "Brand",
  "Space",
  "Person",
  "Music",
  "Restaurant",
  "City",
] as const;

export default function TastePage() {
  const { t } = useLanguage();
  const [tab, setTab] = useState("All");
  const [selected, setSelected] = useState<TasteEntry | null>(null);

  const filtered = tab === "All" ? tasteEntries : tasteEntries.filter((e) => e.type === tab);

  return (
    <AppLayout
      title={t("taste.title")}
      description={t("taste.description")}
    >
      <p className="mb-8 max-w-xl text-[14px] text-[var(--muted-foreground)] leading-[var(--line-height-relaxed)]">
        {t("taste.intro")}
      </p>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-8 flex-wrap">
          {types.map((type) => (
            <TabsTrigger key={type} value={type}>
              {t(typeKeys[type] ?? type)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={tab} className="mt-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((entry) => (
              <Card
                key={entry.id}
                className="cursor-pointer border-[var(--border-subtle)] transition-colors hover:border-[var(--border)]"
                onClick={() => setSelected(entry)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[15px] font-medium text-[var(--foreground)]">
                      {entry.title}
                    </h3>
                    <Badge variant="outline" className="shrink-0 text-[11px]">
                      {t(typeKeys[entry.type] ?? entry.type)}
                    </Badge>
                  </div>
                  <p className="mt-3 line-clamp-2 text-[13px] text-[var(--muted-foreground)] leading-relaxed">
                    {entry.whyILikeIt}
                  </p>
                  <p className="mt-2 text-[12px] text-[var(--primary)] line-clamp-1">
                    → {entry.translateToLife}
                  </p>
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
            <p className="text-[var(--muted-foreground)]">
              {t(typeKeys[selected.type] ?? selected.type)} · {selected.date}
            </p>
            {selected.tags && selected.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selected.tags.map((tag) => (
                  <Badge key={tag} variant="soft">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <p>
              <span className="font-medium text-[var(--muted-foreground)]">{t("taste.whyILikeIt")}:</span>{" "}
              {selected.whyILikeIt}
            </p>
            <p>
              <span className="font-medium text-[var(--muted-foreground)]">{t("taste.translateToLife")}:</span>{" "}
              {selected.translateToLife}
            </p>
          </div>
        )}
      </DetailModal>
    </AppLayout>
  );
}
