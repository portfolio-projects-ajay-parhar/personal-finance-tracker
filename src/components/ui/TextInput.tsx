import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import { FieldError, FieldLabel } from "./Field";
import { controlClassName } from "./fieldStyles";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  requiredMark?: boolean;
  leadingIcon?: ReactNode;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    {
      id,
      label,
      error,
      requiredMark,
      leadingIcon,
      className,
      required,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="min-w-0">
        {label && (
          <FieldLabel htmlFor={inputId} required={requiredMark ?? required}>
            {label}
          </FieldLabel>
        )}
        <div className="relative">
          {leadingIcon && (
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--color-text-tertiary)]">
              {leadingIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(controlClassName, leadingIcon && "pr-3 pl-9", className)}
            {...props}
          />
        </div>
        <FieldError id={errorId}>{error}</FieldError>
      </div>
    );
  },
);
