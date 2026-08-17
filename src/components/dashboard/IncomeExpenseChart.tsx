import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "./ChartTooltip";
import { useChartColors } from "./useChartColors";
import { Skeleton } from "../ui";
import { formatCompactCurrency } from "../../utils/formatters";
import type { MonthTrendPoint } from "../../utils/dashboardStats";

export default function IncomeExpenseChart({ data }: { data: MonthTrendPoint[] }) {
  const colors = useChartColors();
  const hasValues = data.some((point) => point.income > 0 || point.expense > 0);

  if (!hasValues) {
    return (
      <div className="relative flex h-72 items-center justify-center">
        <div className="absolute inset-x-8 inset-y-10 flex items-end gap-3 opacity-50">
          {[42, 68, 51, 78, 44, 60].map((height) => (
            <Skeleton key={height} className="flex-1 rounded-t-lg rounded-b-none" style={{ height: `${height}%` }} />
          ))}
        </div>
        <p className="relative text-sm text-[var(--color-text-secondary)]">
          No income or expenses in this 6-month window.
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={288}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
        <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: colors.text, fontSize: 12 }}
          axisLine={{ stroke: colors.grid }}
          tickLine={false}
        />
        <YAxis
          width={56}
          tickFormatter={formatCompactCurrency}
          tick={{ fill: colors.text, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: colors.grid, opacity: 0.35 }} />
        <Legend
          wrapperStyle={{ color: colors.text, fontSize: 12 }}
        />
        <Bar dataKey="income" name="Income" fill={colors.income} radius={[6, 6, 0, 0]} maxBarSize={28} />
        <Bar dataKey="expense" name="Expense" fill={colors.expense} radius={[6, 6, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
