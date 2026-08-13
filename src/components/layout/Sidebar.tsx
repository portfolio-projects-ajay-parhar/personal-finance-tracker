import { NavLink } from "react-router-dom";
import { LayoutDashboard, IndianRupee, ChartBarStacked } from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard, end: true },
  { name: "categories", path: "/categories", icon: ChartBarStacked },
  { name: "Transactions", path: "/transactions", icon: IndianRupee },
];

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-16 z-50 w-72 border-r border-[var(--color-border)] bg-[var(--color-bg-primary)] transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <nav className="flex-1 space-y-2 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-[var(--color-primary)] text-white"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]"
                    }`
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
