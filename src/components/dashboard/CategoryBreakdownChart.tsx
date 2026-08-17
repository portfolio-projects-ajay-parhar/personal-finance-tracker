import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import ChartTooltip from "./ChartTooltip";
import { Skeleton } from "../ui";
import { formatCurrency, formatPercentage } from "../../utils/formatters";
import type { CategorySummary } from "../../types";

export default function CategoryBreakdownChart({ data }: { data: CategorySummary[] }) {
  if (data.length === 0) {
    return (
      <div className="relative flex h-72 items-center justify-center">
        <Skeleton className="absolute h-48 w-48 rounded-full opacity-40" />
        <div className="absolute h-28 w-28 rounded-full bg-[var(--color-bg-primary)]" />
        <p className="relative z-10 text-sm text-[var(--color-text-secondary)]">
          No expenses this month to chart.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_14rem]">
      <ResponsiveContainer width="100%" height={288}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="categoryName"
            innerRadius={62}
            outerRadius={96}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((entry) => (
              <Cell key={entry.categoryId} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <ul className="space-y-2 self-center">
        {data.slice(0, 6).map((entry) => (
          <li key={entry.categoryId} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="min-w-0 flex-1 truncate text-[var(--color-text-secondary)]">
              {entry.categoryName}
            </span>
            <span className="shrink-0 font-medium">{formatPercentage(entry.percentage)}</span>
          </li>
        ))}
      </ul>

      <p className="sr-only">
        {data
          .map(
            (entry) =>
              `${entry.categoryName} ${formatCurrency(entry.total)} (${formatPercentage(entry.percentage)})`,
          )
          .join(", ")}
      </p>
    </div>
  );
}
