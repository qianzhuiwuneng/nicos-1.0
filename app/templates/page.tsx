"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TemplateCard } from "@/components/shared/TemplateCard";
import { DetailModal } from "@/components/shared/DetailModal";
import { stableTemplates } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";
import type { StableTemplate } from "@/lib/types";

export default function TemplatesPage() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<StableTemplate | null>(null);

  return (
    <AppLayout
      title={t("templates.title")}
      description={t("templates.description")}
    >
      <p className="mb-8 max-w-xl text-[14px] text-[var(--muted-foreground)] leading-[var(--line-height-relaxed)]">
        {t("templates.intro")}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stableTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} onClick={() => setSelected(template)} />
        ))}
      </div>

      <DetailModal
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        title={selected?.name ?? ""}
      >
        {selected && (
          <div className="space-y-4 text-[14px] leading-[var(--line-height-relaxed)]">
            <p className="text-[var(--muted-foreground)]">{selected.scenario}</p>
            <div>
              <h4 className="text-[11px] font-medium uppercase tracking-[0.05em] text-[var(--muted-foreground)]">
                {t("templates.keyPieces")}
              </h4>
              <p className="mt-1.5 text-[var(--foreground)]">{selected.keyPieces}</p>
            </div>
            <div>
              <h4 className="text-[11px] font-medium uppercase tracking-[0.05em] text-[var(--muted-foreground)]">
                {t("templates.whyItWorks")}
              </h4>
              <p className="mt-1.5 text-[var(--foreground)]">{selected.whyItWorks}</p>
            </div>
            {selected.usageCount != null && (
              <p className="text-[var(--muted-foreground)]">{t("templates.used")} {selected.usageCount}×</p>
            )}
          </div>
        )}
      </DetailModal>
    </AppLayout>
  );
}
