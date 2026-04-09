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
        "flex min-h-[4rem] flex-col justify-center border-b border-[var(--border-subtle)] bg-[var(--background)]/85 px-10 py-4 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[17px] font-medium tracking-[-0.01em] text-[var(--foreground)]">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-[13px] text-[var(--muted-foreground)] leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </header>
  );
}
