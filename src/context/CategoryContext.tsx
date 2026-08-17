import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";
import type { Category, CategoryFormData, TransactionType } from "../types";
import {
  getCategories,
  getTransactions,
  saveCategories,
} from "../utils/storage";

export type DeleteCategoryResult =
  | { ok: true }
  | { ok: false; reason: string };

interface CategoryContextType {
  categories: Category[];
  incomeCategories: Category[];
  expenseCategories: Category[];
  addCategory: (data: CategoryFormData) => { ok: true } | { ok: false; reason: string };
  updateCategory: (
    id: string,
    data: CategoryFormData,
  ) => { ok: true } | { ok: false; reason: string };
  deleteCategory: (id: string) => DeleteCategoryResult;
  getCategoryById: (id: string) => Category | undefined;
  isCategoryInUse: (id: string) => boolean;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

function hasDuplicateName(
  categories: Category[],
  name: string,
  type: TransactionType,
  excludeId?: string,
) {
  const normalized = normalizeName(name);
  return categories.some(
    (category) =>
      category.id !== excludeId &&
      category.type === type &&
      normalizeName(category.name) === normalized,
  );
}

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(getCategories);

  const persist = useCallback((next: Category[]) => {
    setCategories(next);
    saveCategories(next);
  }, []);

  const addCategory = useCallback(
    (data: CategoryFormData) => {
      const name = data.name.trim();
      if (!name) {
        return { ok: false as const, reason: "Enter a category name." };
      }
      if (hasDuplicateName(categories, name, data.type)) {
        return {
          ok: false as const,
          reason: `A ${data.type} category named "${name}" already exists.`,
        };
      }

      persist([
        ...categories,
        {
          id: uuidv4(),
          name,
          type: data.type,
          color: data.color,
          icon: data.icon,
        },
      ]);
      return { ok: true as const };
    },
    [categories, persist],
  );

  const updateCategory = useCallback(
    (id: string, data: CategoryFormData) => {
      const name = data.name.trim();
      if (!name) {
        return { ok: false as const, reason: "Enter a category name." };
      }
      if (hasDuplicateName(categories, name, data.type, id)) {
        return {
          ok: false as const,
          reason: `A ${data.type} category named "${name}" already exists.`,
        };
      }

      persist(
        categories.map((category) =>
          category.id === id
            ? { ...category, name, type: data.type, color: data.color, icon: data.icon }
            : category,
        ),
      );
      return { ok: true as const };
    },
    [categories, persist],
  );

  const isCategoryInUse = useCallback((id: string) => {
    return getTransactions().some((transaction) => transaction.categoryId === id);
  }, []);

  const deleteCategory = useCallback(
    (id: string): DeleteCategoryResult => {
      if (isCategoryInUse(id)) {
        return {
          ok: false,
          reason: "This category is used by existing transactions. Reassign those first.",
        };
      }
      persist(categories.filter((category) => category.id !== id));
      return { ok: true };
    },
    [categories, isCategoryInUse, persist],
  );

  const getCategoryById = useCallback(
    (id: string) => categories.find((category) => category.id === id),
    [categories],
  );

  const incomeCategories = useMemo(
    () => categories.filter((category) => category.type === "income"),
    [categories],
  );

  const expenseCategories = useMemo(
    () => categories.filter((category) => category.type === "expense"),
    [categories],
  );

  const value = useMemo(
    () => ({
      categories,
      incomeCategories,
      expenseCategories,
      addCategory,
      updateCategory,
      deleteCategory,
      getCategoryById,
      isCategoryInUse,
    }),
    [
      categories,
      incomeCategories,
      expenseCategories,
      addCategory,
      updateCategory,
      deleteCategory,
      getCategoryById,
      isCategoryInUse,
    ],
  );

  return (
    <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>
  );
}

export function useCategories(): CategoryContextType {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
}
