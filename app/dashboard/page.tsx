import { Suspense } from 'react';
import { OverviewCards } from '@/app/components/dashboard/overview-cards';
import { ComponentsTable } from '@/app/components/dashboard/components-table';
import { DashboardStats, HardwareComponent, generateComponentId } from '@/app/types/hardware';

// Temporary mock data - replace with actual data fetching
const mockStats: DashboardStats = {
  totalComponents: 150,
  availableComponents: 45,
  inUseComponents: 95,
  maintenanceRequired: 10,
  recentActivities: [],
};

// Mock components data
const mockComponents: HardwareComponent[] = [
  {
    id: generateComponentId('IT', 'ZIT', 'LIE', 'F', 'LT', '001'),
    name: 'ThinkPad X1 Carbon',
    category: 'IT',
    location: 'ZIT',
    ownership: 'LIE',
    status: 'F',
    indicator: 'LT',
    runningNumber: '001',
    serialNumber: 'TP-X1-2023-001',
    purchaseDate: new Date('2023-01-15'),
    lastMaintenanceDate: new Date('2023-12-01'),
    assignedTo: 'Max Mustermann',
    specifications: {
      cpu: 'Intel i7-1165G7',
      ram: '16GB',
      storage: '512GB SSD',
    },
  },
  {
    id: generateComponentId('IT', 'SCHULUNGSZENTRUM', 'SZ', 'A', 'MON', '002'),
    name: 'Dell UltraSharp U2419H',
    category: 'IT',
    location: 'SCHULUNGSZENTRUM',
    ownership: 'SZ',
    status: 'A',
    indicator: 'MON',
    runningNumber: '002',
    serialNumber: 'DELL-U2419H-002',
    purchaseDate: new Date('2023-02-20'),
    specifications: {
      size: '24"',
      resolution: '1920x1080',
      ports: 'HDMI, DisplayPort',
    },
  },
  {
    id: generateComponentId('K', 'VIMI_RZ', 'ZIT', 'D', 'SER', '003'),
    name: 'HP ProLiant DL380',
    category: 'K',
    location: 'VIMI_RZ',
    ownership: 'ZIT',
    status: 'D',
    indicator: 'SER',
    runningNumber: '003',
    serialNumber: 'HP-DL380-003',
    purchaseDate: new Date('2022-11-30'),
    lastMaintenanceDate: new Date('2024-02-15'),
    specifications: {
      cpu: '2x Intel Xeon',
      ram: '128GB ECC',
      storage: '4x 2TB SSD RAID',
    },
  },
  {
    id: generateComponentId('K', 'ZIT', 'ZIT', 'F', 'SW', '004'),
    name: 'Cisco Catalyst 2960',
    category: 'K',
    location: 'ZIT',
    ownership: 'ZIT',
    status: 'F',
    indicator: 'SW',
    runningNumber: '004',
    serialNumber: 'CISCO-2960-004',
    purchaseDate: new Date('2022-08-15'),
    lastMaintenanceDate: new Date('2024-01-10'),
    specifications: {
      ports: '24x Gigabit',
      management: 'Managed',
      poe: 'Yes',
    },
  },
];

export default function DashboardPage() {
  return (
    <div className="h-full space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Hardware Inventar
        </h1>
      </div>

      <Suspense fallback={<div className="w-full h-20 animate-pulse bg-muted rounded-lg" />}>
        <OverviewCards stats={mockStats} />
      </Suspense>

      <div className="space-y-8">
        <div className="rounded-lg border shadow-sm">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">
              Defekte Komponenten
            </h2>
            <Suspense fallback={<div className="w-full h-32 animate-pulse bg-muted rounded-lg" />}>
              <ComponentsTable 
                components={mockComponents.filter(c => c.status === 'D')} 
                limit={5} 
              />
            </Suspense>
          </div>
        </div>

        <div className="rounded-lg border shadow-sm">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">
              Neueste Komponenten
            </h2>
            <Suspense fallback={<div className="w-full h-32 animate-pulse bg-muted rounded-lg" />}>
              <ComponentsTable 
                components={[...mockComponents].sort((a, b) => 
                  b.purchaseDate.getTime() - a.purchaseDate.getTime()
                )} 
                limit={5} 
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
} 