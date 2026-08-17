import { ChartBarStacked, IndianRupee, LayoutDashboard } from "lucide-react";

export const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard, end: true },
  { name: "Transactions", path: "/transactions", icon: IndianRupee, end: false },
  { name: "Categories", path: "/categories", icon: ChartBarStacked, end: false },
] as const;
