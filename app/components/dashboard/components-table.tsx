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
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { AddComponentForm } from "./add-component-form";
import { DeleteComponentDialog } from "./delete-component-dialog";
import { 
  CATEGORIES, 
  LOCATIONS, 
  STATUS, 
  INDICATORS,
  type HardwareComponent,
} from "@/app/types/hardware";
import { useComponentsStore } from "@/app/store/components";

// Hilfsfunktion für einheitliche Datumsformatierung
function formatDate(date: Date | string | undefined): string {
  if (!date) return 'Keine Wartung';
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
}

interface ComponentsTableProps {
  components: HardwareComponent[];
}

interface RowData {
  getValue: (key: keyof HardwareComponent) => unknown;
}

interface Column {
  accessorKey: string;
  header: string;
  cell: ({ row }: { row: RowData }) => React.ReactNode;
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'AK':
      return 'success';
    case 'DE':
      return 'destructive';
    case 'IN':
      return 'warning';
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
      const category = row.getValue("category") as keyof typeof CATEGORIES;
      const indicator = row.getValue("indicator") as keyof typeof INDICATORS;
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
      const location = row.getValue("location") as keyof typeof LOCATIONS;
      return LOCATIONS[location];
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof STATUS;
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
      const date = row.getValue("lastMaintenanceDate");
      return (
        <div className={date ? "font-medium" : "text-muted-foreground"}>
          {formatDate(date as Date | undefined)}
        </div>
      );
    },
  },
];

export function ComponentsTable({ components }: ComponentsTableProps) {
  const router = useRouter();
  const [editingComponent, setEditingComponent] = React.useState<HardwareComponent | null>(null);
  const [deletingComponent, setDeletingComponent] = React.useState<HardwareComponent | null>(null);
  const deleteComponent = useComponentsStore((state) => state.deleteComponent);

  const handleRowClick = (id: string) => {
    const encodedId = encodeURIComponent(id);
    router.push(`/components/${encodedId}`);
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>, component: HardwareComponent) => {
    e.stopPropagation();
    setEditingComponent(component);
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>, component: HardwareComponent) => {
    e.stopPropagation();
    setDeletingComponent(component);
  };

  const handleConfirmDelete = async () => {
    if (deletingComponent) {
      await deleteComponent(deletingComponent.id);
      setDeletingComponent(null);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>
                  {column.header}
                </TableHead>
              ))}
              <TableHead>Aktionen</TableHead>
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
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleEditClick(e, component)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDeleteClick(e, component)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingComponent && (
        <AddComponentForm
          lastRunningNumber={0}
          mode="edit"
          initialData={editingComponent}
          onClose={() => setEditingComponent(null)}
        />
      )}

      {deletingComponent && (
        <DeleteComponentDialog
          isOpen={true}
          onClose={() => setDeletingComponent(null)}
          onConfirm={handleConfirmDelete}
          componentName={deletingComponent.name}
        />
      )}
    </>
  );
} 