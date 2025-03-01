'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Sidebar } from "@/app/components/dashboard/sidebar";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="fixed inset-y-0 w-72 border-r bg-background flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">CompStack</h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => signOut({ callbackUrl: '/login' })}
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