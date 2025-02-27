'use client';

import { useRouter } from 'next/navigation';
import * as React from "react";
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
  type HardwareComponent,
  type Category,
  type Location,
  type Status,
  type Indicator
} from "@/app/types/hardware";

interface ComponentsTableProps {
  components: HardwareComponent[];
}

interface RowData {
  getValue: (key: keyof HardwareComponent) => unknown;
}

interface Column {
  accessorKey: keyof HardwareComponent;
  header: string;
  cell: (props: { row: RowData }) => JSX.Element;
}

const getStatusVariant = (status: Status) => {
  switch (status) {
    case 'AK':
      return 'success';
    case 'DE':
      return 'destructive';
    case 'IN':
      return 'warning';
    case 'WA':
      return 'secondary';
    default:
      return 'default';
  }
};

const columns: Column[] = [
  {
    accessorKey: "id",
    header: "ID/Name",
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      const name = row.getValue("name") as string;
      return (
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-muted-foreground">{id}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Kategorie",
    cell: ({ row }) => {
      const category = row.getValue("category") as Category;
      const indicator = row.getValue("indicator") as Indicator;
      return (
        <div>
          <div>{CATEGORIES[category]}</div>
          <div className="text-sm text-muted-foreground">
            {INDICATORS[indicator]}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Standort",
    cell: ({ row }) => {
      const location = row.getValue("location") as Location;
      return LOCATIONS[location];
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Status;
      return (
        <Badge variant={getStatusVariant(status)}>
          {STATUS[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "lastMaintenanceDate",
    header: "Letzte Wartung",
    cell: ({ row }) => {
      const date = row.getValue("lastMaintenanceDate") as Date | undefined;
      return date ? (
        <div className="font-medium">
          {date.toLocaleDateString('de-DE')}
        </div>
      ) : (
        <div className="text-muted-foreground">
          Keine Wartung
        </div>
      );
    },
  },
];

export function ComponentsTable({ components }: ComponentsTableProps) {
  const router = useRouter();

  const handleRowClick = (id: string) => {
    // Encode the ID to handle slashes and special characters
    const encodedId = encodeURIComponent(id);
    router.push(`/components/${encodedId}`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.accessorKey}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {components.map((component) => (
            <TableRow 
              key={component.id}
              onClick={() => handleRowClick(component.id)}
              className="cursor-pointer hover:bg-muted/50"
            >
              {columns.map((column) => (
                <TableCell key={column.accessorKey}>
                  {column.cell({ 
                    row: { 
                      getValue: (key) => component[key as keyof HardwareComponent] 
                    } 
                  })}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 