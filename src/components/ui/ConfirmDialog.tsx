import type { ReactNode } from "react";
import { Alert } from "./Alert";
import { Button } from "./Button";
import { Modal } from "./Modal";

export function ConfirmDialog({
  open,
  title,
  description,
  error,
  confirmLabel,
  cancelLabel = "Cancel",
  variant = "danger",
  confirmDisabled,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description: ReactNode;
  error?: string | null;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  confirmDisabled?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      title={title}
      description={description}
      size="md"
      showClose={false}
      onClose={onClose}
    >
      {error && <Alert className="mb-5">{error}</Alert>}
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button
          variant={variant === "danger" ? "danger" : "primary"}
          disabled={confirmDisabled}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
