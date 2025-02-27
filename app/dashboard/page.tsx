'use client';

import { useEffect } from 'react';
import { ComponentsTable } from "@/app/components/dashboard/components-table";
import { AddComponentForm } from "@/app/components/dashboard/add-component-form";
import { useComponentsStore } from "@/app/store/components";

export default function DashboardPage() {
  const { components, fetchComponents, isLoading, error } = useComponentsStore();

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  // Berechne die höchste laufende Nummer
  const getLastRunningNumber = () => {
    if (components.length === 0) return 0;
    return Math.max(...components.map(c => parseInt(c.runningNumber, 10)));
  };

  if (isLoading) {
    return (
      <main className="container mx-auto p-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto p-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-destructive">Error loading components. Please try again later.</div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <AddComponentForm lastRunningNumber={getLastRunningNumber()} />
      </div>

      <div className="grid gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Components</h2>
          <ComponentsTable components={components} />
        </section>
      </div>
    </main>
  );
} 