"use client";

import { useState } from "react";

type BookCoverProps = {
  src: string;
  title: string;
  author: string;
  toneClassName?: string;
  className?: string;
};

export function BookCover({
  src,
  title,
  author,
  toneClassName = "bg-[var(--muted)]",
  className = "",
}: BookCoverProps) {
  const [missing, setMissing] = useState(false);

  return (
    <div className={`relative aspect-[3/4] w-full overflow-hidden border border-[var(--border)] ${toneClassName} ${className}`}>
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
