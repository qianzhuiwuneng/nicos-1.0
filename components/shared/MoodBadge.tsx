import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MoodBadgeProps {
  moods: string[];
  className?: string;
}

export function MoodBadge({ moods, className }: MoodBadgeProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {moods.map((m) => (
        <Badge key={m} variant="soft" className="font-normal">
          {m}
        </Badge>
      ))}
    </div>
  );
}
