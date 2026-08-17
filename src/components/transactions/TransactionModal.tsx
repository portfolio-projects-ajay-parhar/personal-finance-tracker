import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Transaction, TransactionFormData, TransactionType } from "../../types";
import { useCategories } from "../../context/CategoryContext";
import { getCurrentDateString } from "../../utils/formatters";
import { Alert, Button, Modal, Select, TextInput, TypeToggle } from "../ui";

const transactionSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, "Enter an amount.")
    .refine((value) => {
      const parsed = Number(value.replace(/,/g, ""));
      return Number.isFinite(parsed) && parsed > 0;
    }, "Enter an amount greater than 0."),
  description: z
    .string()
    .trim()
    .min(1, "Enter a description.")
    .max(80, "Keep descriptions under 80 characters."),
  categoryId: z.string().min(1, "Choose a category."),
  type: z.enum(["income", "expense"]),
  date: z.string().min(1, "Choose a date."),
});

interface TransactionModalProps {
  open: boolean;
  transaction?: Transaction | null;
  defaultType: TransactionType;
  error?: string | null;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => void;
}

export default function TransactionModal({
  open,
  transaction,
  defaultType,
  error,
  onClose,
  onSubmit,
}: TransactionModalProps) {
  const { incomeCategories, expenseCategories } = useCategories();
  const isEditing = Boolean(transaction);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: "",
      description: "",
      categoryId: "",
      type: defaultType,
      date: getCurrentDateString(),
    },
  });

  const selectedType = watch("type");
  const categoryOptions = selectedType === "income" ? incomeCategories : expenseCategories;

  useEffect(() => {
    if (!open) return;

    if (transaction) {
      reset({
        amount: String(transaction.amount),
        description: transaction.description,
        categoryId: transaction.categoryId,
        type: transaction.type,
        date: transaction.date,
      });
      return;
    }

    const options = defaultType === "income" ? incomeCategories : expenseCategories;
    reset({
      amount: "",
      description: "",
      categoryId: options[0]?.id ?? "",
      type: defaultType,
      date: getCurrentDateString(),
    });
  }, [open, transaction, defaultType, incomeCategories, expenseCategories, reset]);

  const changeType = (type: TransactionType) => {
    setValue("type", type, { shouldValidate: true });
    const options = type === "income" ? incomeCategories : expenseCategories;
    const current = watch("categoryId");
    if (!options.some((category) => category.id === current)) {
      setValue("categoryId", options[0]?.id ?? "", { shouldValidate: true });
    }
  };

  return (
    <Modal
      open={open}
      title={isEditing ? "Edit transaction" : "New transaction"}
      description={
        isEditing
          ? "Update the amount, category, or date."
          : "Log income or an expense. It saves in this browser."
      }
      labelledBy="transaction-modal-title"
      className="max-h-[90vh] overflow-y-auto"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <TypeToggle value={selectedType} requiredMark onChange={changeType} />
        <input type="hidden" {...register("type")} />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            id="transaction-amount"
            label="Amount"
            requiredMark
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            autoFocus
            placeholder="0.00"
            error={errors.amount?.message}
            {...register("amount")}
          />
          <TextInput
            id="transaction-date"
            label="Date"
            requiredMark
            type="date"
            error={errors.date?.message}
            {...register("date")}
          />
        </div>

        <TextInput
          id="transaction-description"
          label="Description"
          requiredMark
          type="text"
          placeholder="e.g. Weekly groceries"
          error={errors.description?.message}
          {...register("description")}
        />

        {categoryOptions.length === 0 ? (
          <div>
            <p className="mb-1.5 text-sm font-medium">
              Category <span className="text-[var(--color-danger)]" aria-hidden="true">*</span>
            </p>
            <p className="rounded-xl bg-[var(--color-bg-secondary)] px-3 py-2.5 text-sm text-[var(--color-text-secondary)]">
              No {selectedType} categories yet.{" "}
              <Link to="/categories" className="font-medium text-[var(--color-primary)] hover:underline">
                Add one first
              </Link>
              .
            </p>
          </div>
        ) : (
          <Select
            id="transaction-category"
            label="Category"
            requiredMark
            error={errors.categoryId?.message}
            {...register("categoryId")}
          >
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        )}

        {error && <Alert>{error}</Alert>}

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={categoryOptions.length === 0}>
            {isEditing ? "Save changes" : "Add transaction"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
