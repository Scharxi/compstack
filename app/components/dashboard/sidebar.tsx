'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, List } from 'lucide-react';

const navigation = [
  {
    name: 'Komponenten',
    href: '/dashboard',
    icon: LayoutGrid,
  },
  {
    name: 'Listen',
    href: '/lists',
    icon: List,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1 px-2">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors
              ${isActive 
                ? 'bg-accent text-accent-foreground' 
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
          >
            <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-accent-foreground' : 'text-muted-foreground'}`} />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
} 