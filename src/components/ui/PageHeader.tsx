import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{title}</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{description}</p>
      </div>
      {action}
    </div>
  );
}
