"use client";

import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useMobileMenu } from "@/context/MobileMenuContext";

interface TopbarProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function Topbar({ title, description, children, className }: TopbarProps) {
  const { setOpen } = useMobileMenu();
  const { t } = useLanguage();

  return (
    <header
      className={cn(
        "flex flex-col justify-center border-b border-[var(--border-subtle)] bg-[var(--background)]/85 backdrop-blur-sm",
        "sticky top-0 z-30 min-h-[3.75rem] px-5 py-3 sm:px-8",
        "lg:static lg:z-auto lg:min-h-[4rem] lg:px-10 lg:py-4",
        className
      )}
    >
      <div className="flex items-end justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-2 sm:gap-3 lg:block lg:flex-none">
          <button
            type="button"
            className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)]/55 hover:text-[var(--foreground)] lg:hidden"
            aria-label={t("mobile.openMenu")}
            onClick={() => setOpen(true)}
          >
            <Menu className="h-[22px] w-[22px]" strokeWidth={1.5} />
          </button>
          <div className="min-w-0">
            {title ? (
              <h1 className="text-[17px] font-medium tracking-[-0.01em] text-[var(--foreground)] max-lg:text-[1.0625rem] max-lg:leading-snug">
                {title}
              </h1>
            ) : null}
            {description ? (
              <p className="mt-1 text-[13px] leading-relaxed text-[var(--muted-foreground)] max-lg:text-[15px]">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {children ? (
          <div className="flex shrink-0 items-center gap-2 max-lg:pb-0.5">{children}</div>
        ) : null}
      </div>
    </header>
  );
}
