import type { ReactNode } from "react";

export function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">
      {children}
      {required && (
        <span className="text-[var(--color-danger)]" aria-hidden="true">
          {" "}
          *
        </span>
      )}
    </label>
  );
}

export function FieldLegend({
  required,
  children,
}: {
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <legend className="mb-1.5 text-sm font-medium">
      {children}
      {required && (
        <span className="text-[var(--color-danger)]" aria-hidden="true">
          {" "}
          *
        </span>
      )}
    </legend>
  );
}

export function FieldError({ id, children }: { id?: string; children?: ReactNode }) {
  if (!children) return null;

  return (
    <p id={id} className="mt-1 text-sm text-[var(--color-danger)]" role="alert">
      {children}
    </p>
  );
}
