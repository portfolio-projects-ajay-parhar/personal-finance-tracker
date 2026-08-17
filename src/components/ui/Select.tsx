import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import { FieldError, FieldLabel } from "./Field";
import { controlClassName } from "./fieldStyles";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  requiredMark?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { id, label, error, requiredMark, className, required, children, ...props },
    ref,
  ) {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const errorId = `${selectId}-error`;

    return (
      <div className="min-w-0">
        {label && (
          <FieldLabel htmlFor={selectId} required={requiredMark ?? required}>
            {label}
          </FieldLabel>
        )}
        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(controlClassName, className)}
          {...props}
        >
          {children}
        </select>
        <FieldError id={errorId}>{error}</FieldError>
      </div>
    );
  },
);
