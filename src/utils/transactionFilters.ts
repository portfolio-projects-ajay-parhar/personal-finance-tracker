import type { FilterOptions, Transaction } from "../types";

export const defaultTransactionFilters: FilterOptions = {
  type: "all",
  categoryId: "",
  startDate: "",
  endDate: "",
  searchQuery: "",
  sortBy: "date",
  sortOrder: "desc",
};

export function applyTransactionFilters(
  transactions: Transaction[],
  filters: FilterOptions,
): Transaction[] {
  const query = filters.searchQuery.trim().toLowerCase();

  const filtered = transactions.filter((transaction) => {
    if (filters.type !== "all" && transaction.type !== filters.type) return false;
    if (filters.categoryId && transaction.categoryId !== filters.categoryId) return false;
    if (filters.startDate && transaction.date < filters.startDate) return false;
    if (filters.endDate && transaction.date > filters.endDate) return false;
    if (query && !transaction.description.toLowerCase().includes(query)) return false;
    return true;
  });

  const direction = filters.sortOrder === "asc" ? 1 : -1;

  return [...filtered].sort((a, b) => {
    let comparison = 0;

    if (filters.sortBy === "amount") {
      comparison = a.amount - b.amount;
    } else if (filters.sortBy === "description") {
      comparison = a.description.localeCompare(b.description);
    } else {
      comparison = a.date.localeCompare(b.date);
    }

    if (comparison === 0) {
      return b.createdAt.localeCompare(a.createdAt);
    }

    return comparison * direction;
  });
}

export function summarizeTransactions(transactions: Transaction[]) {
  let totalIncome = 0;
  let totalExpense = 0;

  for (const transaction of transactions) {
    if (transaction.type === "income") totalIncome += transaction.amount;
    else totalExpense += transaction.amount;
  }

  return {
    totalIncome,
    totalExpense,
    net: totalIncome - totalExpense,
    count: transactions.length,
  };
}

export function groupTransactionsByDate(transactions: Transaction[]) {
  const groups: { date: string; items: Transaction[] }[] = [];
  const indexByDate = new Map<string, number>();

  for (const transaction of transactions) {
    const existingIndex = indexByDate.get(transaction.date);

    if (existingIndex === undefined) {
      indexByDate.set(transaction.date, groups.length);
      groups.push({ date: transaction.date, items: [transaction] });
    } else {
      groups[existingIndex].items.push(transaction);
    }
  }

  return groups;
}
