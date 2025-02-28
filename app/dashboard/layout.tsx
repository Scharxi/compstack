'use client';

import { ReactNode } from 'react';
import { Sidebar } from "@/app/components/dashboard/sidebar";
import { ThemeToggle } from "@/app/components/theme-toggle";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen">
      <div className="fixed inset-y-0 w-64 border-r bg-background">
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold">CompStack</h1>
          <ThemeToggle />
        </div>
        <Sidebar />
      </div>
      <div className="pl-64 w-full">
        <div className="h-full overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
} 