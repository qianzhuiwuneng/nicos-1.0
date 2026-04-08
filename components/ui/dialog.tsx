"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useLanguage } from "@/context/LanguageContext";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function Dialog({ open, onOpenChange, children, className }: DialogProps) {
  React.useEffect(() => {
    const onEscape = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    if (open) {
      document.addEventListener("keydown", onEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-[2px]"
        aria-hidden
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-50 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-[var(--radius)] border border-[var(--border-subtle)] bg-[var(--card)]",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-start justify-between gap-4 p-6 pb-2", className)} {...props} />
);

const DialogTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    className={cn(
      "text-[17px] font-medium tracking-[-0.02em] text-[var(--foreground)] leading-snug",
      className
    )}
    {...props}
  />
);

const DialogContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 pt-2 text-[14px] leading-[var(--line-height-relaxed)]", className)} {...props} />
);

function DialogClose({
  onOpenChange,
  className,
}: {
  onOpenChange: (open: boolean) => void;
  className?: string;
}) {
  const { t } = useLanguage();
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("absolute right-4 top-4 text-[var(--muted-foreground)]", className)}
      onClick={() => onOpenChange(false)}
      aria-label={t("common.close")}
    >
      <X className="h-4 w-4" strokeWidth={1.5} />
    </Button>
  );
}

export { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose };
