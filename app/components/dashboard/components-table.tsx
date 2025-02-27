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
}

export function ComponentsTable({ components }: ComponentsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">ID/Name</TableHead>
            <TableHead>Kategorie</TableHead>
            <TableHead>Standort</TableHead>
            <TableHead>Besitz</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Typ</TableHead>
            <TableHead>Seriennummer</TableHead>
            <TableHead className="text-right">Kaufdatum</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {components.map((component) => (
            <TableRow key={component.id}>
              <TableCell className="font-medium">
                <div>
                  <div className="font-bold">{component.name}</div>
                  <div className="text-sm text-muted-foreground">{component.id}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {CATEGORIES[component.category]}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {LOCATIONS[component.location]}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {OWNERSHIPS[component.ownership]}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={
                    component.status === 'AK' ? 'default' :
                    component.status === 'IN' ? 'secondary' :
                    component.status === 'WA' ? 'warning' :
                    'destructive'
                  }
                >
                  {STATUS[component.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {INDICATORS[component.indicator]}
                </Badge>
              </TableCell>
              <TableCell>{component.serialNumber}</TableCell>
              <TableCell className="text-right">
                {component.purchaseDate.toLocaleDateString('de-DE')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 