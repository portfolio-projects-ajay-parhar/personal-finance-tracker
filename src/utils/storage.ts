import type { Transaction, Category, Theme } from '../types';
import { defaultCategories } from '../data/defaultCategoris';

const STORAGE_KEYS = {
  TRANSACTIONS: 'finance_tracker_transactions',
  CATEGORIES: 'finance_tracker_categories',
  THEME: 'finance_tracker_theme',
} as const;

// Generic localStorage helpers
function getItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return fallback;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing localStorage key "${key}":`, error);
  }
}

// Transactions
export function getTransactions(): Transaction[] {
  return getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
}

export function saveTransactions(transactions: Transaction[]): void {
  setItem(STORAGE_KEYS.TRANSACTIONS, transactions);
}

// Categories
export function getCategories(): Category[] {
  return getItem<Category[]>(STORAGE_KEYS.CATEGORIES, defaultCategories);
}

export function saveCategories(categories: Category[]): void {
  setItem(STORAGE_KEYS.CATEGORIES, categories);
}

// Theme
export function getTheme(): Theme {
  return getItem<Theme>(STORAGE_KEYS.THEME, 'light');
}

export function saveTheme(theme: Theme): void {
  setItem(STORAGE_KEYS.THEME, theme);
}

// Clear all data
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}