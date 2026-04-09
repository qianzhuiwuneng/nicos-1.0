"use client";

import { useState } from "react";

type BookCoverProps = {
  src: string;
  title: string;
  author: string;
  toneClassName?: string;
  className?: string;
  lotLabel?: string;
};

export function BookCover({
  src,
  title,
  author,
  toneClassName = "bg-[var(--muted)]",
  className = "",
  lotLabel,
}: BookCoverProps) {
  const [missing, setMissing] = useState(false);

  return (
    <div className={`relative aspect-[3/4] w-full overflow-hidden border border-[var(--border)] ${toneClassName} ${className}`}>
      {lotLabel && (
        <div className="absolute inset-x-0 top-0 z-10 border-b border-[var(--border)] bg-[var(--background)]/75 px-3 py-2 backdrop-blur-sm">
          <p className="text-[9px] uppercase tracking-[0.12em] text-[var(--muted-foreground)]">{lotLabel}</p>
        </div>
      )}

      {!missing ? (
        <img
          src={src}
          alt={`${title} cover`}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setMissing(true)}
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center px-5 text-center">
          <p className="text-[16px] font-medium leading-snug text-[var(--foreground)]">{title}</p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">{author}</p>
        </div>
      )}
    </div>
  );
}
