"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import type { StableTemplate } from "@/lib/types";

interface TemplateCardProps {
  template: StableTemplate;
  onClick?: () => void;
  className?: string;
}

export function TemplateCard({ template, onClick, className }: TemplateCardProps) {
  const { t } = useLanguage();

  return (
    <Card
      className={cn(
        "border-[var(--border-subtle)] transition-colors hover:border-[var(--border)]",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-medium text-[var(--foreground)] leading-snug">
            {template.name}
          </h3>
          {template.usageCount != null && (
            <Badge variant="soft" className="shrink-0 text-[11px] font-normal">
              {t("templates.used")} {template.usageCount}×
            </Badge>
          )}
        </div>
        <p className="mt-1.5 text-[12px] text-[var(--muted-foreground)] leading-relaxed">
          {template.scenario}
        </p>
        <p className="mt-3 line-clamp-2 text-[13px] text-[var(--foreground)]/90 leading-relaxed">
          {template.keyPieces}
        </p>
      </CardContent>
    </Card>
  );
}
