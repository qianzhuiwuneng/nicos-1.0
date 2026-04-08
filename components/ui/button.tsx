import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "outline" | "soft";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-[var(--radius-sm)] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90": variant === "default",
            "bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)]": variant === "secondary",
            "text-[var(--muted-foreground)] hover:bg-[var(--muted)]/60 hover:text-[var(--foreground)]": variant === "ghost",
            "border border-[var(--border)] bg-transparent hover:bg-[var(--muted)]/50": variant === "outline",
            "bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90": variant === "soft",
          },
          {
            "h-8 px-2.5 text-[12px]": size === "sm",
            "h-9 px-3 text-[13px]": size === "md",
            "h-10 px-4 text-[14px]": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
