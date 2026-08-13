// src/components/layout/Footer.jsx
export default function Footer() {
  return (
    <footer className="text-center text-sm border-t border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-4 sm:px-6 lg:px-8 w-full">
      © {new Date().getFullYear()} FinanceApp. All rights reserved.
    </footer>
  );
}
