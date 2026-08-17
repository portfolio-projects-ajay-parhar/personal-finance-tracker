import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  tone: "income" | "expense";
  icon?: LucideIcon;
}) {
  const color = tone === "income" ? "var(--color-income)" : "var(--color-expense)";

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-secondary)]">{label}</p>
        {Icon && <Icon className="h-4 w-4" style={{ color }} />}
      </div>
      <p className="mt-2 text-xl font-semibold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
