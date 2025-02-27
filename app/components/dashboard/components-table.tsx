'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  HardwareComponent, 
  CATEGORIES,
  LOCATIONS,
  OWNERSHIPS,
  STATUS,
  INDICATORS
} from "@/app/types/hardware";
import { Badge } from "@/components/ui/badge";

interface ComponentsTableProps {
  components: HardwareComponent[];
  limit?: number;
}

const statusColors = {
  D: "bg-red-500/10 text-red-500 border-red-500/20",
  A: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  F: "bg-green-500/10 text-green-500 border-green-500/20",
};

export function ComponentsTable({ components, limit }: ComponentsTableProps) {
  const displayComponents = limit ? components.slice(0, limit) : components;

  if (displayComponents.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Keine Komponenten gefunden
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[300px]">ID/Name</TableHead>
            <TableHead>Kategorie</TableHead>
            <TableHead>Standort</TableHead>
            <TableHead>Besitzverhältnis</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Indikator</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayComponents.map((component) => (
            <TableRow key={component.id} className="group">
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{component.name}</div>
                  <div className="font-mono text-xs text-muted-foreground">
                    {component.id}
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {CATEGORIES[component.category]}
              </TableCell>
              <TableCell>{LOCATIONS[component.location]}</TableCell>
              <TableCell>{OWNERSHIPS[component.ownership]}</TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={statusColors[component.status]}
                >
                  {STATUS[component.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {INDICATORS[component.indicator]}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 