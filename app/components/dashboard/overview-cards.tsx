'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/app/types/hardware";
import { Activity, Computer, Wrench, Package } from "lucide-react";

interface OverviewCardsProps {
  stats: DashboardStats;
}

export function OverviewCards({ stats }: OverviewCardsProps) {
  const cards = [
    {
      title: "Total Components",
      value: stats.totalComponents,
      icon: Package,
      className: "text-blue-500",
    },
    {
      title: "Available",
      value: stats.availableComponents,
      icon: Computer,
      className: "text-green-500",
    },
    {
      title: "In Use",
      value: stats.inUseComponents,
      icon: Activity,
      className: "text-yellow-500",
    },
    {
      title: "Maintenance Required",
      value: stats.maintenanceRequired,
      icon: Wrench,
      className: "text-red-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.className}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 