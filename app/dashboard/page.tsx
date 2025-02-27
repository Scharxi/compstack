'use client';

import { ComponentsTable } from "@/app/components/dashboard/components-table";
import { useComponentsStore } from "@/app/store/components";

export default function DashboardPage() {
  const components = useComponentsStore((state) => state.components);

  return (
    <div className="container mx-auto py-10">
      <ComponentsTable components={components} />
    </div>
  );
} 