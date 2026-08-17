import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  tone?: "default" | "danger";
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { label, tone = "default", className, type = "button", children, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          tone === "danger"
            ? "hover:bg-[var(--color-expense-bg)] hover:text-[var(--color-danger)]"
            : "hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
