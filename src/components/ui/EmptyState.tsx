import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export function EmptyState({
  message,
  action,
  className,
}: {
  message: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-12 text-center",
        className,
      )}
    >
      <p className="text-sm text-[var(--color-text-secondary)]">{message}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
