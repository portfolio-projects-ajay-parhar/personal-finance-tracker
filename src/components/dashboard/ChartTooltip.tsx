import { formatCurrency } from "../../utils/formatters";
import { useChartColors } from "./useChartColors";

interface TooltipEntry {
  name?: string;
  value?: number;
  color?: string;
}

export default function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) {
  const colors = useChartColors();

  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-xl border px-3 py-2 text-sm shadow-md"
      style={{
        backgroundColor: colors.tooltipBg,
        borderColor: colors.tooltipBorder,
        color: colors.tooltipText,
      }}
    >
      {label && <p className="mb-1 font-medium">{label}</p>}
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(Number(entry.value ?? 0))}
        </p>
      ))}
    </div>
  );
}
