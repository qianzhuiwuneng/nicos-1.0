"use client";

import { cn } from "@/lib/utils";

interface TopbarProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function Topbar({ title, description, children, className }: TopbarProps) {
  return (
    <header
      className={cn(
        "flex min-h-[3.25rem] flex-col justify-center border-b border-[var(--border-subtle)] bg-[var(--background)] px-8 py-3",
        className
      )}
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[15px] font-semibold tracking-tight text-[var(--foreground)]">
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)] leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </header>
  );
}
