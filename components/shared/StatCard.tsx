import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  className?: string;
}

export function StatCard({ label, value, sub, className }: StatCardProps) {
  return (
    <Card className={cn("transition-colors hover:border-[var(--border)]", className)}>
      <CardContent className="p-6">
        <p className="text-[12px] font-medium uppercase tracking-[0.05em] text-[var(--muted-foreground)]">
          {label}
        </p>
        <p className="mt-2 text-[22px] font-medium tracking-[-0.02em] text-[var(--foreground)] leading-tight">
          {value}
        </p>
        {sub && (
          <p className="mt-1 text-[12px] text-[var(--muted-foreground)] leading-relaxed">{sub}</p>
        )}
      </CardContent>
    </Card>
  );
}
