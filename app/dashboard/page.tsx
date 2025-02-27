'use client';

import { useState } from 'react';
import { AddComponentForm } from "@/app/components/dashboard/add-component-form";
import { ComponentsTable } from "@/app/components/dashboard/components-table";
import { type HardwareComponent } from "@/app/types/hardware";

// Mock-Daten für initiale Komponenten
const initialComponents: HardwareComponent[] = [
  {
    id: "IT-HH-FI-AK-GR-001",
    name: "ThinkPad X1 Carbon",
    category: "IT",
    location: "HH",
    ownership: "FI",
    status: "AK",
    indicator: "GR",
    runningNumber: "001",
    serialNumber: "PF2MXCZ",
    purchaseDate: new Date("2024-01-15"),
    specifications: {
      cpu: "Intel i7-1165G7",
      ram: "16GB",
      storage: "512GB SSD"
    }
  }
];

export default function DashboardPage() {
  const [components, setComponents] = useState<HardwareComponent[]>(initialComponents);

  const handleAddComponent = (newComponent: HardwareComponent) => {
    setComponents(prev => [...prev, newComponent]);
  };

  // Berechne die höchste laufende Nummer
  const getLastRunningNumber = () => {
    if (components.length === 0) return 0;
    return Math.max(...components.map(c => parseInt(c.runningNumber, 10)));
  };

  return (
    <main className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <AddComponentForm 
          onAddComponent={handleAddComponent}
          lastRunningNumber={getLastRunningNumber()}
        />
      </div>

      <div className="grid gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Komponenten</h2>
          <ComponentsTable components={components} />
        </section>
      </div>
    </main>
  );
} 