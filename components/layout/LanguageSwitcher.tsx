"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex shrink-0 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--muted)]/30 p-0.5">
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={cn(
          "rounded-[4px] px-2.5 py-1.5 text-[12px] font-medium transition-colors",
          locale === "en"
            ? "bg-[var(--card)] text-[var(--foreground)]"
            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        )}
      >
        En
      </button>
      <button
        type="button"
        onClick={() => setLocale("zh")}
        className={cn(
          "rounded-[4px] px-2.5 py-1.5 text-[12px] font-medium transition-colors",
          locale === "zh"
            ? "bg-[var(--card)] text-[var(--foreground)]"
            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        )}
      >
        中
      </button>
    </div>
  );
}
