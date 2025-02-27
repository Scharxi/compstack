'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { List } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Components', href: '/dashboard/components', icon: List },
    { name: 'Listen', href: '/dashboard/lists', icon: List },
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0">
          <div className="flex flex-col flex-grow border-r border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-6">
            <div className="flex items-center h-16 flex-shrink-0 px-4">
              <h1 className="text-xl font-semibold text-[hsl(var(--foreground))]">
                CompStack
              </h1>
            </div>
            <div className="mt-8 flex-1 flex flex-col">
              <nav className="flex-1 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors
                        ${isActive 
                          ? 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]' 
                          : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]'
                        }`}
                    >
                      <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-[hsl(var(--accent-foreground))]' : 'text-[hsl(var(--muted-foreground))]'}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="md:pl-64 flex flex-col flex-1 w-full">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 