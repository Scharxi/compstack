'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from "@/app/components/dashboard/sidebar";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    // Überprüfe ob ein Auth Token existiert
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    // Auth Token entfernen
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  return (
    <div className="flex h-screen">
      <div className="fixed inset-y-0 w-72 border-r bg-background flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Inventarisierung</h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                title="Ausloggen"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex-1 py-4 overflow-y-auto">
          <Sidebar />
        </div>
      </div>
      <div className="pl-72 w-full">
        <div className="h-full overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
} 