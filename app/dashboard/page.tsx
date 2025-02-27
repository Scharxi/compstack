'use client';

import { ComponentsTable } from "@/app/components/dashboard/components-table";
import { AddComponentForm } from "@/app/components/dashboard/add-component-form";
import { useComponentsStore } from "@/app/store/components";

export default function DashboardPage() {
  const components = useComponentsStore((state) => state.components);

  // Berechne die höchste laufende Nummer
  const getLastRunningNumber = () => {
    if (components.length === 0) return 0;
    return Math.max(...components.map(c => parseInt(c.runningNumber, 10)));
  };

  return (
    <main className="container mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <AddComponentForm lastRunningNumber={getLastRunningNumber()} />
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