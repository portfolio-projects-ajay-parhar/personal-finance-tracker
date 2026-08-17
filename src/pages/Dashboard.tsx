import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDownLeft, ArrowUpRight, ChevronLeft, ChevronRight, Wallet } from "lucide-react";
import { useCategories } from "../context/CategoryContext";
import { useTransactions } from "../context/TransactionContext";
import IncomeExpenseChart from "../components/dashboard/IncomeExpenseChart";
import CategoryBreakdownChart from "../components/dashboard/CategoryBreakdownChart";
import { EmptyState, IconButton, PageHeader, StatCard } from "../components/ui";
import { getCategoryIcon } from "../data/categoryIcons";
import {
  formatCurrency,
  formatDate,
  formatMonth,
  formatPercentage,
  getCurrentMonthString,
} from "../utils/formatters";
import {
  applyTransactionFilters,
  summarizeTransactions,
} from "../utils/transactionFilters";
import {
  buildCategoryBreakdown,
  buildMonthlyTrend,
  shiftMonth,
  transactionsInMonth,
} from "../utils/dashboardStats";

export default function Dashboard() {
  const { transactions } = useTransactions();
  const { categories, getCategoryById } = useCategories();
  const currentMonth = getCurrentMonthString();
  const [month, setMonth] = useState(currentMonth);

  const monthTransactions = useMemo(
    () => transactionsInMonth(transactions, month),
    [transactions, month],
  );
  const summary = useMemo(
    () => summarizeTransactions(monthTransactions),
    [monthTransactions],
  );
  const trend = useMemo(
    () => buildMonthlyTrend(transactions, month),
    [transactions, month],
  );
  const expenseBreakdown = useMemo(
    () => buildCategoryBreakdown(monthTransactions, categories, "expense"),
    [monthTransactions, categories],
  );
  const recent = useMemo(
    () =>
      applyTransactionFilters(monthTransactions, {
        type: "all",
        categoryId: "",
        startDate: "",
        endDate: "",
        searchQuery: "",
        sortBy: "date",
        sortOrder: "desc",
      }).slice(0, 5),
    [monthTransactions],
  );

  const savingsRate = summary.totalIncome > 0 ? (summary.net / summary.totalIncome) * 100 : 0;
  const canGoNext = month < currentMonth;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="A month-by-month view of money in, money out, and where it went."
        action={
          <div className="flex w-full items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] sm:w-auto">
            <IconButton
              label="Previous month"
              className="h-10 w-10"
              onClick={() => setMonth((current) => shiftMonth(current, -1))}
            >
              <ChevronLeft className="h-5 w-5" />
            </IconButton>
            <p className="min-w-0 flex-1 px-2 text-center text-sm font-medium sm:min-w-36 sm:flex-none">
              {formatMonth(month)}
            </p>
            <IconButton
              label="Next month"
              className="h-10 w-10 disabled:opacity-40"
              disabled={!canGoNext}
              onClick={() => setMonth((current) => shiftMonth(current, 1))}
            >
              <ChevronRight className="h-5 w-5" />
            </IconButton>
          </div>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
          icon={Wallet}
        />
        <StatCard
          label="Saved of income"
          value={summary.totalIncome > 0 ? formatPercentage(savingsRate) : "—"}
          tone={savingsRate >= 0 ? "income" : "expense"}
        />
      </div>

      <div className="mb-6 grid gap-4 xl:grid-cols-2">
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4 sm:p-5">
          <h2 className="mb-1 text-sm font-semibold">Income vs expenses</h2>
          <p className="mb-4 text-xs text-[var(--color-text-secondary)]">
            Last six months through {formatMonth(month)}
          </p>
          <IncomeExpenseChart data={trend} />
        </section>

        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4 sm:p-5">
          <h2 className="mb-1 text-sm font-semibold">Spending by category</h2>
          <p className="mb-4 text-xs text-[var(--color-text-secondary)]">
            Expenses in {formatMonth(month)}
          </p>
          <CategoryBreakdownChart data={expenseBreakdown} />
        </section>
      </div>

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">Recent activity</h2>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Latest entries this month
            </p>
          </div>
          <Link
            to="/transactions"
            className="text-sm font-medium text-[var(--color-primary)] hover:underline"
          >
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <EmptyState
            className="py-8"
            message={`No transactions in ${formatMonth(month)}.`}
            action={
              <Link
                to="/transactions"
                className="text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                Add a transaction
              </Link>
            }
          />
        ) : (
          <ul className="space-y-2">
            {recent.map((transaction) => {
              const category = getCategoryById(transaction.categoryId);
              const Icon = getCategoryIcon(category?.icon ?? "MoreHorizontal");
              const isIncome = transaction.type === "income";

              return (
                <li key={transaction.id} className="flex items-center gap-3 rounded-xl px-1 py-1.5">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: category?.color ?? "#6b7280" }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{transaction.description}</p>
                    <p className="truncate text-xs text-[var(--color-text-secondary)]">
                      {category?.name ?? "Unknown category"} · {formatDate(transaction.date)}
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
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
