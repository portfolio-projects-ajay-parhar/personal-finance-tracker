import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { CategoryProvider } from "./context/CategoryContext";
import { TransactionProvider } from "./context/TransactionContext";
import { ToastProvider } from "./components/ui";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";

export default function App() {
  return (
    <ThemeProvider>
      <CategoryProvider>
        <TransactionProvider>
          <ToastProvider>
            <HashRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="transactions" element={<Transactions />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </HashRouter>
          </ToastProvider>
        </TransactionProvider>
      </CategoryProvider>
    </ThemeProvider>
  );
}
