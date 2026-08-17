import { createElement, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useCategories } from "../context/CategoryContext";
import { useTransactions } from "../context/TransactionContext";
import TransactionModal from "../components/transactions/TransactionModal";
import { getCategoryIcon } from "../data/categoryIcons";
import {
  Button,
  ConfirmDialog,
  EmptyState,
  IconButton,
  PageHeader,
  SegmentedControl,
  Select,
  StatCard,
  TextInput,
  useToast,
} from "../components/ui";
import {
  formatCurrency,
  formatDate,
} from "../utils/formatters";
import {
  applyTransactionFilters,
  defaultTransactionFilters,
  groupTransactionsByDate,
  summarizeTransactions,
} from "../utils/transactionFilters";
import type {
  Category,
  FilterOptions,
  Transaction,
  TransactionFormData,
  TransactionType,
} from "../types";

const PAGE_SIZE = 15;

export default function Transactions() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { categories, getCategoryById } = useCategories();
  const toast = useToast();

  const [filters, setFilters] = useState<FilterOptions>(defaultTransactionFilters);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const defaultType: TransactionType = filters.type === "income" ? "income" : "expense";
  const categoryChoices = categories.filter(
    (category) => filters.type === "all" || category.type === filters.type,
  );

  const filtered = useMemo(
    () => applyTransactionFilters(transactions, filters),
    [transactions, filters],
  );
  const summary = useMemo(() => summarizeTransactions(filtered), [filtered]);
  const visibleTransactions = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );
  const grouped = useMemo(
    () => groupTransactionsByDate(visibleTransactions),
    [visibleTransactions],
  );
  const showGroups = filters.sortBy === "date";
  const hasMore = visibleCount < filtered.length;

  const updateFilter = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    setVisibleCount(PAGE_SIZE);
    setFilters((current) => {
      const next = { ...current, [key]: value };
      if (key === "type") {
        const type = value as FilterOptions["type"];
        const stillValid = categories.some(
          (category) =>
            category.id === current.categoryId && (type === "all" || category.type === type),
        );
        if (!stillValid) next.categoryId = "";
      }
      return next;
    });
  };

  const openCreate = () => {
    setEditing(null);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (transaction: Transaction) => {
    setEditing(transaction);
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setFormError(null);
  };

  const handleSubmit = (data: TransactionFormData) => {
    const result = editing
      ? updateTransaction(editing.id, data)
      : addTransaction(data);

    if (!result.ok) {
      setFormError(result.reason);
      return;
    }

    toast.success(editing ? "Transaction updated." : "Transaction added.");
    closeModal();
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    deleteTransaction(pendingDelete.id);
    toast.success("Transaction deleted.");
    setPendingDelete(null);
  };

  const hasActiveFilters =
    filters.type !== "all" ||
    Boolean(filters.categoryId) ||
    Boolean(filters.startDate) ||
    Boolean(filters.endDate) ||
    Boolean(filters.searchQuery.trim());

  return (
    <div>
      <PageHeader
        title="Transactions"
        description="Log income and expenses. Changes save automatically in this browser."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add transaction
          </Button>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Income"
          value={formatCurrency(summary.totalIncome)}
          tone="income"
          icon={ArrowDownLeft}
        />
        <StatCard
          label="Expenses"
          value={formatCurrency(summary.totalExpense)}
          tone="expense"
          icon={ArrowUpRight}
        />
        <StatCard
          label="Net"
          value={formatCurrency(summary.net)}
          tone={summary.net >= 0 ? "income" : "expense"}
        />
      </div>

      <div className="mb-6 space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
        <SegmentedControl
          options={["all", "income", "expense"] as const}
          value={filters.type}
          onChange={(tab) => updateFilter("type", tab)}
        />

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <TextInput
            type="search"
            value={filters.searchQuery}
            onChange={(event) => updateFilter("searchQuery", event.target.value)}
            placeholder="Search descriptions"
            leadingIcon={<Search className="h-4 w-4" />}
          />

          <Select
            value={filters.categoryId}
            onChange={(event) => updateFilter("categoryId", event.target.value)}
            aria-label="Category"
          >
            <option value="">All categories</option>
            {categoryChoices.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>

          <TextInput
            type="date"
            value={filters.startDate}
            onChange={(event) => updateFilter("startDate", event.target.value)}
            aria-label="Start date"
          />
          <TextInput
            type="date"
            value={filters.endDate}
            onChange={(event) => updateFilter("endDate", event.target.value)}
            aria-label="End date"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filters.sortBy}
            onChange={(event) =>
              updateFilter("sortBy", event.target.value as FilterOptions["sortBy"])
            }
            aria-label="Sort by"
            className="w-auto"
          >
            <option value="date">Sort by date</option>
            <option value="amount">Sort by amount</option>
            <option value="description">Sort by description</option>
          </Select>
          <Button
            variant="outline"
            className="py-2"
            onClick={() =>
              updateFilter("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc")
            }
          >
            {filters.sortOrder === "asc" ? "Ascending" : "Descending"}
          </Button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setFilters(defaultTransactionFilters);
                setVisibleCount(PAGE_SIZE);
              }}
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          message={
            transactions.length === 0
              ? "No transactions yet."
              : "No transactions match these filters."
          }
          action={
            transactions.length === 0 ? (
              <button
                type="button"
                onClick={openCreate}
                className="text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                Add one
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setFilters(defaultTransactionFilters);
                  setVisibleCount(PAGE_SIZE);
                }}
                className="text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                Clear filters
              </button>
            )
          }
        />
      ) : showGroups ? (
        <div className="space-y-6">
          {grouped.map((group) => (
            <section key={group.date}>
              <h2 className="mb-2 text-sm font-semibold text-[var(--color-text-secondary)]">
                {formatDate(group.date)}
              </h2>
              <ul className="space-y-2">
                {group.items.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                    category={getCategoryById(transaction.categoryId)}
                    onEdit={() => openEdit(transaction)}
                    onDelete={() => setPendingDelete(transaction)}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {visibleTransactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              category={getCategoryById(transaction.categoryId)}
              onEdit={() => openEdit(transaction)}
              onDelete={() => setPendingDelete(transaction)}
              showDate
            />
          ))}
        </ul>
      )}

      {filtered.length > 0 && (
        <div className="mt-4 flex flex-col items-center gap-3">
          <p className="text-xs text-[var(--color-text-tertiary)]">
            Showing {visibleTransactions.length} of {filtered.length}{" "}
            {filtered.length === 1 ? "transaction" : "transactions"}
          </p>
          {hasMore && (
            <Button
              variant="outline"
              onClick={() =>
                setVisibleCount((count) => Math.min(count + PAGE_SIZE, filtered.length))
              }
            >
              Load more
            </Button>
          )}
        </div>
      )}

      <TransactionModal
        open={modalOpen}
        transaction={editing}
        defaultType={defaultType}
        error={formError}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this transaction?"
        description={
          pendingDelete
            ? `${pendingDelete.description} (${formatCurrency(pendingDelete.amount)}) will be removed from this browser.`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}

function TransactionRow({
  transaction,
  category,
  onEdit,
  onDelete,
  showDate = false,
}: {
  transaction: Transaction;
  category: Category | undefined;
  onEdit: () => void;
  onDelete: () => void;
  showDate?: boolean;
}) {
  const isIncome = transaction.type === "income";

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-3">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
        style={{ backgroundColor: category?.color ?? "#6b7280" }}
      >
        {createElement(getCategoryIcon(category?.icon ?? "MoreHorizontal"), {
          className: "h-5 w-5",
        })}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{transaction.description}</p>
        <p className="truncate text-xs text-[var(--color-text-secondary)]">
          {category?.name ?? "Unknown category"}
          {showDate ? ` · ${formatDate(transaction.date)}` : ""}
        </p>
      </div>
      <p
        className="shrink-0 text-sm font-semibold"
        style={{
          color: isIncome ? "var(--color-income)" : "var(--color-expense)",
        }}
      >
        {isIncome ? "+" : "−"}
        {formatCurrency(transaction.amount)}
      </p>
      <div className="flex shrink-0 gap-1">
        <IconButton label={`Edit ${transaction.description}`} onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </IconButton>
        <IconButton label={`Delete ${transaction.description}`} tone="danger" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </IconButton>
      </div>
    </li>
  );
}
