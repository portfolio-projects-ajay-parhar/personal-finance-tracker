import { cn } from "../../utils/cn";

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-1",
        className,
      )}
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
            value === option
              ? "bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
              : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
