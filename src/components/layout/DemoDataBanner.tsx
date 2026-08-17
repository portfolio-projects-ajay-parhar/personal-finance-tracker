import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useTransactions } from "../../context/TransactionContext";
import { Button, ConfirmDialog, useToast } from "../ui";

export default function DemoDataBanner() {
  const { hasDemoData, clearDemoData } = useTransactions();
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);

  if (!hasDemoData) return null;

  return (
    <>
      <div
        className="mb-4 flex flex-col gap-3 rounded-2xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        style={{
          borderColor: "var(--color-warning)",
          backgroundColor: "var(--color-warning-bg)",
        }}
        role="status"
      >
        <div className="flex gap-3">
          <AlertTriangle
            className="mt-0.5 h-5 w-5 shrink-0"
            style={{ color: "var(--color-warning)" }}
          />
          <div>
            <p className="text-sm font-semibold">Sample data is loaded</p>
            <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
              This is demo activity so you can explore the app. Clear it before tracking your own
              money.
            </p>
          </div>
        </div>
        <Button variant="inverse" className="shrink-0" onClick={() => setConfirming(true)}>
          Clear sample data
        </Button>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Clear sample data?"
        description="Sample transactions will be removed. Anything you added yourself stays, and the app will not reload the demo ledger."
        confirmLabel="Clear sample data"
        cancelLabel="Keep it"
        onConfirm={() => {
          clearDemoData();
          setConfirming(false);
          toast.success("Sample data cleared.");
        }}
        onClose={() => setConfirming(false)}
      />
    </>
  );
}
