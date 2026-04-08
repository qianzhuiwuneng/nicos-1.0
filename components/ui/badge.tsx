import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "soft" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-pill)] px-2.5 py-0.5 text-[11px] font-medium tracking-[0.02em] transition-colors",
        {
          "bg-[var(--whimsy-sky)] text-[var(--primary)] dark:bg-[var(--whimsy-sky)] dark:text-[var(--primary)]":
            variant === "default",
          "bg-[var(--muted)] text-[var(--muted-foreground)]": variant === "secondary",
          "bg-[var(--whimsy-peach)] text-[var(--foreground)] dark:bg-[var(--whimsy-peach)] dark:text-[var(--foreground)]":
            variant === "soft",
          "border border-[var(--border)] bg-transparent text-[var(--muted-foreground)]":
            variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
