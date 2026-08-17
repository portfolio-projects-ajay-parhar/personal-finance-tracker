import { NavLink } from "react-router-dom";
import { navItems } from "./navItems";

export default function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-bg-primary)]/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid h-16 grid-cols-3">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium transition ${
                    isActive
                      ? "text-[var(--color-primary)]"
                      : "text-[var(--color-text-tertiary)]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`inline-flex h-8 w-12 items-center justify-center rounded-full transition ${
                        isActive ? "bg-[var(--color-primary)]/12" : ""
                      }`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={isActive ? 2.25 : 1.75} />
                    </span>
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
