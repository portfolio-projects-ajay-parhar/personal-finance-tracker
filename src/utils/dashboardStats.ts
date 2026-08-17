import { addMonths, format, parseISO, subMonths } from "date-fns";
import type { Category, CategorySummary, Transaction } from "../types";
import { summarizeTransactions } from "./transactionFilters";

export interface MonthTrendPoint {
  month: string;
  label: string;
  income: number;
  expense: number;
  net: number;
}

export function shiftMonth(month: string, delta: number): string {
  return format(addMonths(parseISO(`${month}-01`), delta), "yyyy-MM");
}

export function transactionsInMonth(transactions: Transaction[], month: string) {
  return transactions.filter((transaction) => transaction.date.startsWith(month));
}

export function buildMonthlyTrend(
  transactions: Transaction[],
  endMonth: string,
  count = 6,
): MonthTrendPoint[] {
  const end = parseISO(`${endMonth}-01`);

  return Array.from({ length: count }, (_, index) => {
    const month = format(subMonths(end, count - 1 - index), "yyyy-MM");
    const summary = summarizeTransactions(transactionsInMonth(transactions, month));

    return {
      month,
      label: format(parseISO(`${month}-01`), "MMM"),
      income: summary.totalIncome,
      expense: summary.totalExpense,
      net: summary.net,
    };
  });
}

export function buildCategoryBreakdown(
  transactions: Transaction[],
  categories: Category[],
  type: "income" | "expense",
): CategorySummary[] {
  const relevant = transactions.filter((transaction) => transaction.type === type);
  const total = relevant.reduce((sum, transaction) => sum + transaction.amount, 0);
  const byCategory = new Map<string, { total: number; count: number }>();

  for (const transaction of relevant) {
    const current = byCategory.get(transaction.categoryId) ?? { total: 0, count: 0 };
    current.total += transaction.amount;
    current.count += 1;
    byCategory.set(transaction.categoryId, current);
  }

  const categoryById = new Map(categories.map((category) => [category.id, category]));

  return [...byCategory.entries()]
    .map(([categoryId, stats]) => {
      const category = categoryById.get(categoryId);

      return {
        categoryId,
        categoryName: category?.name ?? "Unknown",
        total: stats.total,
        percentage: total > 0 ? (stats.total / total) * 100 : 0,
        color: category?.color ?? "#6b7280",
        count: stats.count,
      };
    })
    .sort((a, b) => b.total - a.total);
}
