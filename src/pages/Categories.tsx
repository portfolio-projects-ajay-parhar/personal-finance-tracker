import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCategories } from "../context/CategoryContext";
import { getCategoryIcon } from "../data/categoryIcons";
import CategoryModal from "../components/categories/CategoryModal";
import {
  Button,
  ConfirmDialog,
  EmptyState,
  IconButton,
  PageHeader,
  SegmentedControl,
  useToast,
} from "../components/ui";
import type { Category, CategoryFormData, TransactionType } from "../types";

type FilterTab = "all" | TransactionType;

export default function Categories() {
  const {
    incomeCategories,
    expenseCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    isCategoryInUse,
  } = useCategories();
  const toast = useToast();

  const [filter, setFilter] = useState<FilterTab>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const defaultType: TransactionType = filter === "income" ? "income" : "expense";

  const sections = useMemo(() => {
    const income = { title: "Income", items: incomeCategories };
    const expense = { title: "Expense", items: expenseCategories };

    if (filter === "income") return [income];
    if (filter === "expense") return [expense];
    return [income, expense];
  }, [filter, incomeCategories, expenseCategories]);

  const openCreate = () => {
    setEditing(null);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setFormError(null);
  };

  const handleSubmit = (data: CategoryFormData) => {
    const result = editing
      ? updateCategory(editing.id, data)
      : addCategory(data);

    if (!result.ok) {
      setFormError(result.reason);
      return;
    }

    toast.success(editing ? "Category updated." : "Category added.");
    closeModal();
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const result = deleteCategory(pendingDelete.id);
    if (!result.ok) {
      setDeleteError(result.reason);
      return;
    }
    toast.success("Category deleted.");
    setPendingDelete(null);
    setDeleteError(null);
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organize income and expenses. Changes save automatically in this browser."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add category
          </Button>
        }
      />

      <SegmentedControl
        options={["all", "income", "expense"] as const}
        value={filter}
        onChange={setFilter}
        className="mb-6 bg-[var(--color-bg-primary)]"
      />

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                {section.title}
              </h2>
              <span className="text-xs text-[var(--color-text-tertiary)]">
                {section.items.length} {section.items.length === 1 ? "category" : "categories"}
              </span>
            </div>

            {section.items.length === 0 ? (
              <EmptyState
                className="py-8"
                message={`No ${section.title.toLowerCase()} categories yet.`}
                action={
                  <button
                    type="button"
                    onClick={openCreate}
                    className="text-sm font-medium text-[var(--color-primary)] hover:underline"
                  >
                    Add one
                  </button>
                }
              />
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {section.items.map((category) => {
                  const Icon = getCategoryIcon(category.icon);

                  return (
                    <li
                      key={category.id}
                      className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-3"
                    >
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
                        style={{ backgroundColor: category.color }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{category.name}</p>
                        <p className="text-xs capitalize text-[var(--color-text-secondary)]">
                          {category.type}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <IconButton
                          label={`Edit ${category.name}`}
                          onClick={() => openEdit(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </IconButton>
                        <IconButton
                          label={`Delete ${category.name}`}
                          tone="danger"
                          onClick={() => {
                            setDeleteError(null);
                            setPendingDelete(category);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ))}
      </div>

      <CategoryModal
        open={modalOpen}
        category={editing}
        defaultType={defaultType}
        error={formError}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title={pendingDelete ? `Delete ${pendingDelete.name}?` : "Delete category?"}
        description={
          pendingDelete && isCategoryInUse(pendingDelete.id)
            ? "This category is used by existing transactions, so it cannot be removed yet."
            : "This removes the category from this browser. You can add it again later."
        }
        error={deleteError}
        confirmLabel="Delete"
        confirmDisabled={pendingDelete ? isCategoryInUse(pendingDelete.id) : false}
        onConfirm={confirmDelete}
        onClose={() => {
          setPendingDelete(null);
          setDeleteError(null);
        }}
      />
    </div>
  );
}
