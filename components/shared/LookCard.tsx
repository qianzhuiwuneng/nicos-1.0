import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LookEntry } from "@/lib/types";

interface LookCardProps {
  look: LookEntry;
  onClick?: () => void;
  className?: string;
}

export function LookCard({ look, onClick, className }: LookCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden border-[var(--border-subtle)] transition-colors hover:border-[var(--border)]",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] w-full bg-[var(--muted)]">
        <Image
          src={look.imageUrl}
          alt={look.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 280px"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-3">
          <p className="text-[13px] font-medium text-white drop-shadow-sm">{look.title}</p>
          <p className="text-[11px] text-white/90">{look.date}</p>
        </div>
      </div>
      <CardContent className="p-3">
        <div className="flex flex-wrap gap-1.5">
          {look.styleTags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[11px] font-normal">
              {tag}
            </Badge>
          ))}
        </div>
        <p className="mt-2 text-[12px] text-[var(--muted-foreground)]">
          {look.occasion} · ★ {look.selfRating}/5
        </p>
      </CardContent>
    </Card>
  );
}
