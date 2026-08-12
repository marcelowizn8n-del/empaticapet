"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

type AppShellProps = {
  role: "tutor" | "vet" | "admin";
  children: React.ReactNode;
};

export default function AppShell({ role, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role={role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar role={role} onMenuToggle={() => setSidebarOpen(true)} />
      <main className="lg:ml-64 mt-16 p-4 lg:p-8">{children}</main>
    </div>
  );
}
