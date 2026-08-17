import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

const variants = {
  error:
    "bg-[var(--color-expense-bg)] text-[var(--color-danger)]",
  warning:
    "border-[var(--color-warning)] bg-[var(--color-warning-bg)] text-[var(--color-text-primary)]",
} as const;

export function Alert({
  variant = "error",
  className,
  children,
}: {
  variant?: keyof typeof variants;
  className?: string;
  children: ReactNode;
}) {
  return (
    <p
      role={variant === "error" ? "alert" : "status"}
      className={cn("rounded-xl px-3 py-2 text-sm", variants[variant], className)}
    >
      {children}
    </p>
  );
}
