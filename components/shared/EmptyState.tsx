import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--muted)]/20 py-12 text-center",
        className
      )}
    >
      <p className="text-sm font-medium text-[var(--muted-foreground)]">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-xs text-[var(--muted-foreground)]">{description}</p>
      )}
    </div>
  );
}
