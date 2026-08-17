import type { TransactionType } from "../../types";
import { FieldLegend } from "./Field";
import { cn } from "../../utils/cn";

export function TypeToggle({
  value,
  onChange,
  requiredMark,
}: {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
  requiredMark?: boolean;
}) {
  return (
    <fieldset>
      <FieldLegend required={requiredMark}>Type</FieldLegend>
      <div className="grid grid-cols-2 gap-2">
        {(["income", "expense"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={cn(
              "rounded-xl border px-3 py-2.5 text-sm font-medium capitalize transition",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
              value === type
                ? type === "income"
                  ? "border-[var(--color-income)] bg-[var(--color-income-bg)] text-[var(--color-income)]"
                  : "border-[var(--color-expense)] bg-[var(--color-expense-bg)] text-[var(--color-expense)]"
                : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]",
            )}
          >
            {type}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
