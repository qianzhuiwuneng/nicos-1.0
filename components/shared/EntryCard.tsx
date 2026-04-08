import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EntryCardProps {
  title: string;
  date?: string;
  excerpt?: string;
  meta?: string;
  onClick?: () => void;
  className?: string;
}

export function EntryCard({ title, date, excerpt, meta, onClick, className }: EntryCardProps) {
  return (
    <Card
      className={cn(
        "border-[var(--border-subtle)] transition-colors hover:border-[var(--border)]",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[14px] font-medium text-[var(--foreground)] line-clamp-1 leading-snug">
            {title}
          </p>
          {date && (
            <span className="shrink-0 text-[12px] text-[var(--muted-foreground)]">{date}</span>
          )}
        </div>
        {excerpt && (
          <p className="mt-1.5 line-clamp-2 text-[13px] text-[var(--muted-foreground)] leading-relaxed">
            {excerpt}
          </p>
        )}
        {meta && (
          <p className="mt-1 text-[11px] text-[var(--muted-foreground)]/80">{meta}</p>
        )}
      </CardContent>
    </Card>
  );
}
