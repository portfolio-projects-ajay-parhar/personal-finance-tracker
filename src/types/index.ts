export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  type: TransactionType;
  date: string; // ISO string format: 'YYYY-MM-DD'
  createdAt: string; // ISO timestamp
}

export interface CategoryFormData {
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
}

export interface TransactionFormData {
  amount: string;
  description: string;
  categoryId: string;
  type: TransactionType;
  date: string;
}

export interface FilterOptions {
  type: TransactionType | 'all';
  categoryId: string;
  startDate: string;
  endDate: string;
  searchQuery: string;
  sortBy: 'date' | 'amount' | 'description';
  sortOrder: 'asc' | 'desc';
}

export interface MonthlySummary {
  month: string;         // 'YYYY-MM'
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  transactionCount: number;
  categoryBreakdown: CategorySummary[];
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  total: number;
  percentage: number;
  color: string;
  count: number;
}

export interface ValidationErrors {
  [key: string]: string;
}

export type Theme = 'light' | 'dark';