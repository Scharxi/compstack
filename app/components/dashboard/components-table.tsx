'use client';

import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  CATEGORIES, 
  LOCATIONS, 
  STATUS, 
  INDICATORS,
  type HardwareComponent 
} from "@/app/types/hardware";

interface ComponentsTableProps {
  components: HardwareComponent[];
}

export function ComponentsTable({ components }: ComponentsTableProps) {
  const router = useRouter();

  const handleRowClick = (id: string) => {
    // Encode the ID to handle slashes and special characters
    const encodedId = encodeURIComponent(id);
    router.push(`/components/${encodedId}`);
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID/Name</TableHead>
            <TableHead>Kategorie</TableHead>
            <TableHead>Standort</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Letzte Wartung</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {components.map((component) => (
            <TableRow 
              key={component.id}
              onClick={() => handleRowClick(component.id)}
              className="cursor-pointer hover:bg-muted/50"
            >
              <TableCell>
                <div>
                  <div className="font-medium">{component.name}</div>
                  <div className="text-sm text-muted-foreground">{component.id}</div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div>{CATEGORIES[component.category]}</div>
                  <div className="text-sm text-muted-foreground">
                    {INDICATORS[component.indicator]}
                  </div>
                </div>
              </TableCell>
              <TableCell>{LOCATIONS[component.location]}</TableCell>
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
                {component.lastMaintenanceDate ? (
                  component.lastMaintenanceDate.toLocaleDateString('de-DE')
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 