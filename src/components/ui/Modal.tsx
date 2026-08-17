import { useEffect, useId, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";
import { IconButton } from "./IconButton";

export function Modal({
  open,
  title,
  description,
  labelledBy,
  size = "lg",
  showClose = true,
  className,
  children,
  onClose,
}: {
  open: boolean;
  title?: string;
  description?: ReactNode;
  labelledBy?: string;
  size?: "md" | "lg";
  showClose?: boolean;
  className?: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const generatedTitleId = useId();
  const titleId = labelledBy ?? generatedTitleId;

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : labelledBy}
        className={cn(
          "relative z-10 w-full border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-5 shadow-xl",
          "rounded-t-2xl sm:rounded-2xl sm:p-6",
          size === "md" ? "max-w-md" : "max-w-lg",
          className,
        )}
      >
        {(title || showClose) && (
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              {title && (
                <h2 id={titleId} className="text-lg font-semibold">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{description}</p>
              )}
            </div>
            {showClose && (
              <IconButton label="Close" onClick={onClose}>
                <X className="h-5 w-5" />
              </IconButton>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
