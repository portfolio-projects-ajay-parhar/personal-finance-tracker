import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import Footer from "./Footer";

const getInitialTheme = () => {
  if (typeof window === "undefined") return false;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) return savedTheme === "dark";

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]">
      <Header
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((prev) => !prev)}
        sidebarOpen={sidebarOpen}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen((prev) => !prev)}
      />

      <div className="pt-16 lg:pl-72">
        <div className="flex min-h-[calc(100vh-4rem)] flex-col">
          <MainContent />
          <Footer />
        </div>
      </div>
    </div>
  );
}
