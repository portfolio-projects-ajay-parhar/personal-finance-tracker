// src/components/layout/Header.jsx
import { Menu, Moon, Sun, Wallet, X } from "lucide-react";

export default function Header({
  onMenuClick,
  darkMode,
  onToggleTheme,
  sidebarOpen,
}: {
  onMenuClick: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  sidebarOpen: boolean;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/95 backdrop-blur">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-tertiary)] lg:hidden"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
              <Wallet className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Finance App
              </p>
              <h1 className="text-sm font-semibold sm:text-base">
                Dashboard Panel
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-tertiary)]"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
