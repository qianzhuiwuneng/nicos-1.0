"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex shrink-0 rounded-[var(--radius-pill)] bg-[var(--muted)] p-0.5">
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={cn(
          "rounded-[var(--radius-pill)] px-2 py-1 text-[12px] font-medium transition-all",
          locale === "en"
            ? "bg-[var(--card)] text-[var(--foreground)] shadow-[var(--shadow-card)]"
            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        )}
      >
        En
      </button>
      <button
        type="button"
        onClick={() => setLocale("zh")}
        className={cn(
          "rounded-[var(--radius-pill)] px-2 py-1 text-[12px] font-medium transition-all",
          locale === "zh"
            ? "bg-[var(--card)] text-[var(--foreground)] shadow-[var(--shadow-card)]"
            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        )}
      >
        中
      </button>
    </div>
  );
}
