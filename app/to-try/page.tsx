"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toTryEntries } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";
import type { ToTryStatus } from "@/lib/types";

const statusKeys: Record<ToTryStatus, string> = {
  "Want to try": "toTry.wantToTry",
  Planned: "toTry.planned",
  Tried: "toTry.tried",
  Archived: "toTry.archived",
};

const statuses: ToTryStatus[] = ["Want to try", "Planned", "Tried", "Archived"];

export default function ToTryPage() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<ToTryStatus>("Want to try");

  const filtered = toTryEntries.filter((e) => e.status === tab);

  return (
    <AppLayout
      title={t("toTry.title")}
      description={t("toTry.description")}
    >
      <p className="mb-8 max-w-xl text-[14px] text-[var(--muted-foreground)] leading-[var(--line-height-relaxed)]">
        {t("toTry.intro")}
      </p>

      <Tabs value={tab} onValueChange={(v) => setTab(v as ToTryStatus)}>
        <TabsList className="mb-8">
          {statuses.map((s) => (
            <TabsTrigger key={s} value={s}>
              {t(statusKeys[s])}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={tab} className="mt-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((entry) => (
              <Card
                key={entry.id}
                className="border-[var(--border-subtle)] transition-colors hover:border-[var(--border)]"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[15px] font-medium text-[var(--foreground)] leading-snug">
                      {entry.title}
                    </h3>
                    <Badge
                      variant={
                        entry.priority === "High"
                          ? "default"
                          : entry.priority === "Low"
                            ? "secondary"
                            : "soft"
                      }
                      className="shrink-0 text-[11px]"
                    >
                      {entry.priority === "High" ? t("toTry.high") : entry.priority === "Low" ? t("toTry.low") : t("toTry.medium")}
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-[12px] text-[var(--muted-foreground)]">
                    {entry.type}
                  </p>
                  {entry.budget && (
                    <p className="mt-1 text-[12px] text-[var(--muted-foreground)]/80">
                      {t("toTry.budget")}: {entry.budget}
                    </p>
                  )}
                  <p className="mt-3 line-clamp-2 text-[13px] text-[var(--foreground)]/90 leading-relaxed">
                    {entry.whyWantToTry}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
