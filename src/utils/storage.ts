import type { Transaction, Category, Theme } from '../types';
import { defaultCategories } from '../data/defaultCategoris';
import { buildMockTransactions } from '../data/mockTransactions';

const STORAGE_KEYS = {
  TRANSACTIONS: 'finance_tracker_transactions',
  CATEGORIES: 'finance_tracker_categories',
  THEME: 'finance_tracker_theme',
  SIDEBAR_COLLAPSED: 'finance_tracker_sidebar_collapsed',
  MOCK_SEEDED: 'finance_tracker_mock_seeded',
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

// Transactions — seed demo ledger once when storage is empty
export function getTransactions(): Transaction[] {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const alreadySeeded = localStorage.getItem(STORAGE_KEYS.MOCK_SEEDED) === '1';
    const parsed = item === null ? null : (JSON.parse(item) as Transaction[]);
    const isEmpty = parsed === null || (Array.isArray(parsed) && parsed.length === 0);

    if (!alreadySeeded && isEmpty) {
      const seeded = buildMockTransactions();
      setItem(STORAGE_KEYS.TRANSACTIONS, seeded);
      localStorage.setItem(STORAGE_KEYS.MOCK_SEEDED, '1');
      return seeded;
    }

    if (parsed === null || !Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    console.error(`Error reading localStorage key "${STORAGE_KEYS.TRANSACTIONS}":`, error);
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  setItem(STORAGE_KEYS.TRANSACTIONS, transactions);
}

export function markMockSeedComplete(): void {
  localStorage.setItem(STORAGE_KEYS.MOCK_SEEDED, '1');
}

// Categories — seed defaults once so IDs stay stable across reloads
export function getCategories(): Category[] {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (item === null) {
      setItem(STORAGE_KEYS.CATEGORIES, defaultCategories);
      return defaultCategories;
    }
    const parsed = JSON.parse(item) as Category[];
    return Array.isArray(parsed) ? parsed : defaultCategories;
  } catch (error) {
    console.error(`Error reading localStorage key "${STORAGE_KEYS.CATEGORIES}":`, error);
    return defaultCategories;
  }
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

export function getSidebarCollapsed(): boolean {
  return getItem<boolean>(STORAGE_KEYS.SIDEBAR_COLLAPSED, false);
}

export function saveSidebarCollapsed(collapsed: boolean): void {
  setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, collapsed);
}

// Clear all data
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}