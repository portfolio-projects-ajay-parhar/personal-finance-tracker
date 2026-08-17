import { NavLink } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen, Wallet } from "lucide-react";
import { navItems } from "./navItems";

export default function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={`fixed bottom-0 left-0 top-0 z-50 hidden flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-primary)] transition-[width] duration-300 ease-out lg:flex ${
        collapsed ? "w-[4.5rem]" : "w-64"
      }`}
    >
      <div
        className={`flex h-16 items-center border-b border-[var(--color-border)] ${
          collapsed ? "justify-center px-2" : "gap-3 px-4"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
          <Wallet className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-xs text-[var(--color-text-secondary)]">Finance App</p>
            <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
              Ledger
            </p>
          </div>
        )}
      </div>

      <nav className={`flex-1 space-y-1 py-4 ${collapsed ? "px-2" : "px-3"}`}>
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              title={collapsed ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center rounded-xl text-sm font-medium transition ${
                  collapsed ? "justify-center px-0 py-3" : "gap-3 px-3 py-2.5"
                } ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]"
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div
        className={`border-t border-[var(--color-border)] py-3 ${
          collapsed ? "px-2" : "px-3"
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`flex w-full items-center rounded-xl py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] ${
            collapsed ? "justify-center" : "gap-3 px-3"
          }`}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <>
              <PanelLeftClose className="h-5 w-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
