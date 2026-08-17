import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";

const variants = {
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]",
  secondary:
    "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]",
  outline:
    "border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]",
  danger:
    "bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger-hover)]",
  inverse:
    "bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] hover:opacity-90",
} as const;

export type ButtonVariant = keyof typeof variants;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = "primary", className, type = "button", ...props }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          className,
        )}
        {...props}
      />
    );
  },
);
