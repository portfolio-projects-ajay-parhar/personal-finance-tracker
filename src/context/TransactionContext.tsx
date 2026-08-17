import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";
import type { Transaction, TransactionFormData } from "../types";
import { isSeedTransaction } from "../data/mockTransactions";
import { getCategories, getTransactions, markMockSeedComplete, saveTransactions } from "../utils/storage";

type MutationResult = { ok: true } | { ok: false; reason: string };
type ValidationResult = { ok: true; amount: number } | { ok: false; reason: string };

interface TransactionContextType {
  transactions: Transaction[];
  hasDemoData: boolean;
  addTransaction: (data: TransactionFormData) => MutationResult;
  updateTransaction: (id: string, data: TransactionFormData) => MutationResult;
  deleteTransaction: (id: string) => void;
  clearDemoData: () => void;
  getTransactionById: (id: string) => Transaction | undefined;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

function parseAmount(value: string): number | null {
  const parsed = Number(value.replace(/,/g, "").trim());
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.round(parsed * 100) / 100;
}

function validateTransaction(data: TransactionFormData): ValidationResult {
  const description = data.description.trim();
  if (!description) {
    return { ok: false, reason: "Enter a description." };
  }

  const amount = parseAmount(data.amount);
  if (amount === null) {
    return { ok: false, reason: "Enter an amount greater than 0." };
  }

  if (!data.date) {
    return { ok: false, reason: "Choose a date." };
  }

  const category = getCategories().find((item) => item.id === data.categoryId);
  if (!category) {
    return { ok: false, reason: "Choose a category." };
  }

  if (category.type !== data.type) {
    return { ok: false, reason: "That category does not match this transaction type." };
  }

  return { ok: true, amount };
}

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(getTransactions);

  const persist = useCallback((next: Transaction[]) => {
    setTransactions(next);
    saveTransactions(next);
  }, []);

  const addTransaction = useCallback(
    (data: TransactionFormData): MutationResult => {
      const result = validateTransaction(data);
      if (!result.ok) return result;

      persist([
        {
          id: uuidv4(),
          amount: result.amount,
          description: data.description.trim(),
          categoryId: data.categoryId,
          type: data.type,
          date: data.date,
          createdAt: new Date().toISOString(),
        },
        ...transactions,
      ]);

      return { ok: true };
    },
    [persist, transactions],
  );

  const updateTransaction = useCallback(
    (id: string, data: TransactionFormData): MutationResult => {
      const result = validateTransaction(data);
      if (!result.ok) return result;

      const exists = transactions.some((transaction) => transaction.id === id);
      if (!exists) {
        return { ok: false, reason: "That transaction is no longer in this browser." };
      }

      persist(
        transactions.map((transaction) =>
          transaction.id === id
            ? {
                ...transaction,
                amount: result.amount,
                description: data.description.trim(),
                categoryId: data.categoryId,
                type: data.type,
                date: data.date,
              }
            : transaction,
        ),
      );

      return { ok: true };
    },
    [persist, transactions],
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      persist(transactions.filter((transaction) => transaction.id !== id));
    },
    [persist, transactions],
  );

  const getTransactionById = useCallback(
    (id: string) => transactions.find((transaction) => transaction.id === id),
    [transactions],
  );

  const hasDemoData = useMemo(
    () => transactions.some(isSeedTransaction),
    [transactions],
  );

  const clearDemoData = useCallback(() => {
    persist(transactions.filter((transaction) => !isSeedTransaction(transaction)));
    markMockSeedComplete();
  }, [persist, transactions]);

  const value = useMemo(
    () => ({
      transactions,
      hasDemoData,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      clearDemoData,
      getTransactionById,
    }),
    [
      transactions,
      hasDemoData,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      clearDemoData,
      getTransactionById,
    ],
  );

  return (
    <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>
  );
}

export function useTransactions(): TransactionContextType {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
}
