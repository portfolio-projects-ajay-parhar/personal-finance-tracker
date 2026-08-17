import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import { getSidebarCollapsed, saveSidebarCollapsed } from "../../utils/storage";

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(getSidebarCollapsed);

  useEffect(() => {
    saveSidebarCollapsed(sidebarCollapsed);
  }, [sidebarCollapsed]);

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]">
      <Header sidebarCollapsed={sidebarCollapsed} />

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      <div
        className={`pt-16 pb-[calc(4rem+env(safe-area-inset-bottom))] transition-[padding] duration-300 ease-out lg:pb-0 ${
          sidebarCollapsed ? "lg:pl-[4.5rem]" : "lg:pl-64"
        }`}
      >
        <div className="flex min-h-[calc(100vh-4rem)] flex-col">
          <MainContent />
          <Footer />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
