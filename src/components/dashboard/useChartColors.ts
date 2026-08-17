import { useTheme } from "../../context/ThemeContext";

export function useChartColors() {
  const { isDark } = useTheme();

  return {
    income: isDark ? "#34d399" : "#10b981",
    expense: isDark ? "#f87171" : "#ef4444",
    grid: isDark ? "#374151" : "#e5e7eb",
    text: isDark ? "#d1d5db" : "#6b7280",
    tooltipBg: isDark ? "#1f2937" : "#ffffff",
    tooltipBorder: isDark ? "#4b5563" : "#e5e7eb",
    tooltipText: isDark ? "#f9fafb" : "#111827",
  };
}
