import { Moon, Sun, Wallet } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { IconButton } from "../ui";

export default function Header({ sidebarCollapsed }: { sidebarCollapsed: boolean }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 h-16 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/95 backdrop-blur transition-[left] duration-300 ease-out ${
        sidebarCollapsed ? "lg:left-[4.5rem]" : "lg:left-64"
      }`}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-secondary)]">Finance App</p>
            <h1 className="text-sm font-semibold">Ledger</h1>
          </div>
        </div>

        <div className="hidden lg:block">
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            Personal finance
          </p>
        </div>

        <IconButton
          label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="ml-auto h-10 w-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)]"
          onClick={toggleTheme}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </IconButton>
      </div>
    </header>
  );
}
