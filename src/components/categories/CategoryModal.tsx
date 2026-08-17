import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Category, CategoryFormData, TransactionType } from "../../types";
import {
  CATEGORY_COLORS,
  CATEGORY_ICON_NAMES,
  getCategoryIcon,
} from "../../data/categoryIcons";
import { Alert, Button, FieldLegend, Modal, TextInput, TypeToggle } from "../ui";
import { cn } from "../../utils/cn";

const categorySchema = z.object({
  name: z.string().trim().min(1, "Enter a category name.").max(40, "Keep names under 40 characters."),
  type: z.enum(["income", "expense"]),
  color: z.string().min(1),
  icon: z.string().min(1),
});

interface CategoryModalProps {
  open: boolean;
  category?: Category | null;
  defaultType: TransactionType;
  error?: string | null;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
}

export default function CategoryModal({
  open,
  category,
  defaultType,
  error,
  onClose,
  onSubmit,
}: CategoryModalProps) {
  const isEditing = Boolean(category);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      type: defaultType,
      color: CATEGORY_COLORS[0],
      icon: "Wallet",
    },
  });

  const selectedColor = watch("color");
  const selectedIcon = watch("icon");
  const selectedType = watch("type");

  useEffect(() => {
    if (!open) return;

    if (category) {
      reset({
        name: category.name,
        type: category.type,
        color: category.color,
        icon: category.icon,
      });
    } else {
      reset({
        name: "",
        type: defaultType,
        color: defaultType === "income" ? "#10b981" : "#ef4444",
        icon: defaultType === "income" ? "Briefcase" : "UtensilsCrossed",
      });
    }
  }, [open, category, defaultType, reset]);

  return (
    <Modal
      open={open}
      title={isEditing ? "Edit category" : "New category"}
      description={
        isEditing
          ? "Update how this category looks in your ledger."
          : "Name it, pick a type, then choose a color and icon."
      }
      labelledBy="category-modal-title"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <TextInput
          id="category-name"
          label="Name"
          requiredMark
          autoFocus
          placeholder="e.g. Groceries"
          error={errors.name?.message}
          {...register("name")}
        />

        <TypeToggle
          value={selectedType}
          requiredMark
          onChange={(type) => setValue("type", type, { shouldValidate: true })}
        />
        <input type="hidden" {...register("type")} />

        <fieldset>
          <FieldLegend required>Color</FieldLegend>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`Select color ${color}`}
                onClick={() => setValue("color", color, { shouldValidate: true })}
                className={cn(
                  "h-8 w-8 rounded-full border-2 transition",
                  selectedColor === color
                    ? "scale-110 border-[var(--color-text-primary)]"
                    : "border-transparent",
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <input type="hidden" {...register("color")} />
        </fieldset>

        <fieldset>
          <FieldLegend required>Icon</FieldLegend>
          <div className="grid max-h-40 grid-cols-6 gap-2 overflow-y-auto sm:grid-cols-8">
            {CATEGORY_ICON_NAMES.map((iconName) => {
              const Icon = getCategoryIcon(iconName);
              const isSelected = selectedIcon === iconName;

              return (
                <button
                  key={iconName}
                  type="button"
                  title={iconName}
                  aria-label={`Select ${iconName} icon`}
                  onClick={() => setValue("icon", iconName, { shouldValidate: true })}
                  className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-xl border transition",
                    isSelected
                      ? "border-transparent text-white"
                      : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]",
                  )}
                  style={isSelected ? { backgroundColor: selectedColor } : undefined}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
          <input type="hidden" {...register("icon")} />
        </fieldset>

        {error && <Alert>{error}</Alert>}

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Save changes" : "Add category"}</Button>
        </div>
      </form>
    </Modal>
  );
}
