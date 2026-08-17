import { format, setDate, subMonths } from "date-fns";
import type { Transaction, TransactionType } from "../types";

function toDateString(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function toTimestamp(date: Date, hour: number) {
  const copy = new Date(date);
  copy.setHours(hour, 20, 0, 0);
  return copy.toISOString();
}

interface SeedDraft {
  amount: number;
  description: string;
  categoryId: string;
  type: TransactionType;
  day: number;
  hour?: number;
  months?: number[];
}

const MONTHLY_SEEDS: SeedDraft[] = [
  { amount: 85000, description: "Monthly salary", categoryId: "income-salary", type: "income", day: 1, hour: 9 },
  { amount: 22000, description: "House rent", categoryId: "expense-housing", type: "expense", day: 2, hour: 10 },
  { amount: 2500, description: "Mutual fund dividend", categoryId: "income-investments", type: "income", day: 5, hour: 11, months: [0, 2, 4] },
  { amount: 18500, description: "Freelance invoice", categoryId: "income-freelance", type: "income", day: 12, hour: 14, months: [1, 3, 5] },
  { amount: 799, description: "Airtel broadband", categoryId: "expense-bills", type: "expense", day: 4, hour: 8 },
  { amount: 2140, description: "Electricity bill", categoryId: "expense-bills", type: "expense", day: 8, hour: 9 },
  { amount: 3280, description: "DMart groceries", categoryId: "expense-food", type: "expense", day: 6, hour: 18 },
  { amount: 540, description: "Swiggy lunch", categoryId: "expense-food", type: "expense", day: 9, hour: 13 },
  { amount: 670, description: "Zomato dinner", categoryId: "expense-food", type: "expense", day: 16, hour: 20 },
  { amount: 280, description: "Metro card recharge", categoryId: "expense-transport", type: "expense", day: 3, hour: 8 },
  { amount: 312, description: "Uber to office", categoryId: "expense-transport", type: "expense", day: 11, hour: 9 },
  { amount: 2100, description: "Petrol", categoryId: "expense-transport", type: "expense", day: 14, hour: 17 },
  { amount: 2499, description: "Amazon order", categoryId: "expense-shopping", type: "expense", day: 15, hour: 21, months: [0, 2, 4, 5] },
  { amount: 399, description: "BookMyShow tickets", categoryId: "expense-entertainment", type: "expense", day: 19, hour: 19, months: [1, 3, 5] },
  { amount: 199, description: "Hotstar subscription", categoryId: "expense-entertainment", type: "expense", day: 7, hour: 7 },
  { amount: 860, description: "Apollo Pharmacy", categoryId: "expense-healthcare", type: "expense", day: 17, hour: 11, months: [0, 2, 5] },
  { amount: 1499, description: "Online course", categoryId: "expense-education", type: "expense", day: 10, hour: 16, months: [1, 4] },
  { amount: 450, description: "UPI to friend", categoryId: "expense-other", type: "expense", day: 21, hour: 15, months: [0, 3] },
  { amount: 2000, description: "Birthday gift received", categoryId: "income-gift", type: "income", day: 22, hour: 12, months: [2] },
];

export function buildMockTransactions(now = new Date()): Transaction[] {
  const transactions: Transaction[] = [];
  let sequence = 0;

  for (let monthsAgo = 5; monthsAgo >= 0; monthsAgo -= 1) {
    const monthIndex = 5 - monthsAgo;
    const monthDate = subMonths(now, monthsAgo);

    for (const seed of MONTHLY_SEEDS) {
      if (seed.months && !seed.months.includes(monthIndex)) continue;

      const date = setDate(monthDate, seed.day);
      if (date > now) continue;

      sequence += 1;
      transactions.push({
        id: `seed-${sequence}`,
        amount: seed.amount,
        description: seed.description,
        categoryId: seed.categoryId,
        type: seed.type,
        date: toDateString(date),
        createdAt: toTimestamp(date, seed.hour ?? 10),
      });
    }
  }

  return transactions;
}

export function isSeedTransaction(transaction: { id: string }) {
  return transaction.id.startsWith("seed-");
}
