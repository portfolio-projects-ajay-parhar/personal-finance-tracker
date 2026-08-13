// src/components/layout/MainContent.jsx
import { Outlet } from "react-router-dom";

export default function MainContent() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <Outlet />
      </div>
    </main>
  );
}
