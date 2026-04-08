"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuickActionButtonProps {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  className?: string;
  /** Soft pastel behind icon — tiny playful cue */
  tint?: "sky" | "peach" | "mint";
}

export function QuickActionButton({
  label,
  icon,
  onClick,
  className,
  tint = "sky",
}: QuickActionButtonProps) {
  const tintClass =
    tint === "peach"
      ? "bg-[var(--whimsy-peach)]"
      : tint === "mint"
        ? "bg-[var(--whimsy-mint)]"
        : "bg-[var(--whimsy-sky)]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left transition-transform hover:scale-[1.01] active:scale-[0.99]",
        className
      )}
    >
      <Card className="transition-shadow hover:shadow-[var(--shadow-float)]">
        <CardContent className="flex items-center gap-3 p-4">
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius)] text-[var(--foreground)]",
              tintClass
            )}
          >
            {icon}
          </span>
          <span className="text-[13px] font-medium text-[var(--foreground)]">{label}</span>
        </CardContent>
      </Card>
    </button>
  );
}
