import { createElement, useCallback, useMemo, useState, type ReactNode } from "react";
import { AlertCircle, Check, Info, X } from "lucide-react";
import { cn } from "../../utils/cn";
import { IconButton } from "./IconButton";
import { ToastContext, type ToastVariant } from "./useToast";

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

const TOAST_DURATION_MS = 3500;

const variantStyles: Record<ToastVariant, string> = {
  success: "border-[var(--color-income)]/40",
  error: "border-[var(--color-danger)]/40",
  info: "border-[var(--color-border)]",
};

const variantIcons = {
  success: Check,
  error: AlertCircle,
  info: Info,
} as const;

const variantIconColor: Record<ToastVariant, string> = {
  success: "text-[var(--color-income)]",
  error: "text-[var(--color-danger)]",
  info: "text-[var(--color-primary)]",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message: string, variant: ToastVariant) => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { id, message, variant }]);
      window.setTimeout(() => dismiss(id), TOAST_DURATION_MS);
    },
    [dismiss],
  );

  const toast = useMemo(
    () => ({
      success: (message: string) => push(message, "success"),
      error: (message: string) => push(message, "error"),
      info: (message: string) => push(message, "info"),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-[90] flex flex-col items-center gap-2 px-4 lg:inset-x-auto lg:right-6 lg:bottom-6 lg:items-end"
        aria-live="polite"
        aria-relevant="additions"
      >
        {toasts.map((item) => (
            <div
              key={item.id}
              role={item.variant === "error" ? "alert" : "status"}
              className={cn(
                "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border bg-[var(--color-bg-primary)] px-4 py-3 shadow-lg",
                variantStyles[item.variant],
              )}
            >
              {createElement(variantIcons[item.variant], {
                className: cn("mt-0.5 h-4 w-4 shrink-0", variantIconColor[item.variant]),
              })}
              <p className="flex-1 text-sm">{item.message}</p>
              <IconButton
                label="Dismiss notification"
                className="h-7 w-7"
                onClick={() => dismiss(item.id)}
              >
                <X className="h-4 w-4" />
              </IconButton>
            </div>
          ))}
      </div>
    </ToastContext.Provider>
  );
}
