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
import { Pencil, Trash2, Eye, Wrench, ListPlus } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { AddComponentForm } from "./add-component-form";
import { DeleteComponentDialog } from "./delete-component-dialog";
import { MaintenanceDialog } from "@/app/components/maintenance/maintenance-dialog";
import { 
  CATEGORIES, 
  LOCATIONS, 
  STATUS, 
  INDICATORS,
  type HardwareComponent,
} from "@/app/types/hardware";
import { useComponentsStore } from "@/app/store/components";
import { useListsStore } from "@/app/store/lists";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MaintenanceForm } from "@/app/components/maintenance/maintenance-form";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
        <div className="w-[200px]">
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
        <div className="w-[200px]">
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
      return (
        <div className="w-[100px]">
          {LOCATIONS[location]}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof STATUS;
      return (
        <div className="w-[100px]">
          <Badge variant={getStatusVariant(status)}>
            {STATUS[status]}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "lastMaintenanceDate",
    header: "Letzte Wartung",
    cell: ({ row }) => {
      const date = row.getValue("lastMaintenanceDate");
      return (
        <div className="w-[120px] whitespace-nowrap">
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
  const [maintenanceComponent, setMaintenanceComponent] = React.useState<HardwareComponent | null>(null);
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = React.useState(false);
  const [addToListComponent, setAddToListComponent] = React.useState<HardwareComponent | null>(null);
  const [addToListDialogOpen, setAddToListDialogOpen] = React.useState(false);
  const { deleteComponent, updateComponent } = useComponentsStore();
  const { lists, fetchLists, updateList } = useListsStore();

  React.useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const handleRowClick = (id: string) => {
    const encodedId = encodeURIComponent(id);
    router.push(`/components/${encodedId}`);
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>, component: HardwareComponent) => {
    e.stopPropagation();
    setEditingComponent(component);
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>, component: HardwareComponent) => {
    e.stopPropagation();
    setDeletingComponent(component);
  };

  const handleMaintenanceClick = (e: React.MouseEvent<HTMLDivElement>, component: HardwareComponent) => {
    e.stopPropagation();
    setMaintenanceComponent(component);
    setMaintenanceDialogOpen(true);
  };

  const handleAddToListClick = (e: React.MouseEvent<HTMLDivElement>, component: HardwareComponent) => {
    e.stopPropagation();
    setAddToListComponent(component);
    setAddToListDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingComponent) {
      await deleteComponent(deletingComponent.id);
      setDeletingComponent(null);
    }
  };

  const handleSaveMaintenance = async (data: { completedTasks: string[], notes: string }) => {
    if (maintenanceComponent) {
      const newMaintenanceProtocol = {
        date: new Date(),
        completedTasks: data.completedTasks,
        notes: data.notes
      };

      try {
        const updatedComponent = {
          ...maintenanceComponent,
          newMaintenanceProtocol,
          maintenanceHistory: maintenanceComponent.maintenanceHistory || [],
          lastMaintenanceDate: new Date()
        };

        await updateComponent(updatedComponent);
        setMaintenanceComponent(null);
        setMaintenanceDialogOpen(false);
        toast.success('Wartungsprotokoll erfolgreich gespeichert');
      } catch (error) {
        console.error('Failed to save maintenance protocol:', error);
        toast.error('Fehler beim Speichern des Wartungsprotokolls');
      }
    }
  };

  const handleAddToList = async (listId: string) => {
    if (!addToListComponent) return;

    try {
      const list = lists.find(l => l.id === listId);
      if (!list) return;

      const updatedList = {
        ...list,
        components: [...list.components, addToListComponent.id]
      };

      await updateList(updatedList);
      setAddToListComponent(null);
      setAddToListDialogOpen(false);
      toast.success('Komponente zur Liste hinzugefügt');
    } catch (error) {
      console.error('Failed to add component to list:', error);
      toast.error('Fehler beim Hinzufügen zur Liste');
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey} className="whitespace-nowrap">
                  {column.header}
                </TableHead>
              ))}
              <TableHead className="w-[100px]">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {components.map((component) => (
              <ContextMenu key={component.id}>
                <ContextMenuTrigger asChild>
                  <TableRow 
                    onClick={() => handleRowClick(component.id)}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    {columns.map((column) => (
                      <TableCell key={column.accessorKey} className="whitespace-nowrap">
                        {column.cell({ 
                          row: { 
                            getValue: (key) => component[key as keyof HardwareComponent] 
                          } 
                        })}
                      </TableCell>
                    ))}
                    <TableCell className="w-[100px]">
                      <div className="flex gap-2 justify-end">
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
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => handleRowClick(component.id)} className="gap-2">
                    <Eye className="h-4 w-4" />
                    Details anzeigen
                  </ContextMenuItem>
                  <ContextMenuItem onClick={(e) => handleEditClick(e, component)} className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Bearbeiten
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={(e) => handleMaintenanceClick(e, component)} className="gap-2">
                    <Wrench className="h-4 w-4" />
                    Wartung durchführen
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={(e) => handleAddToListClick(e, component)} className="gap-2">
                    <ListPlus className="h-4 w-4" />
                    Zu Liste hinzufügen
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem 
                    onClick={(e) => handleDeleteClick(e, component)} 
                    className="gap-2 text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Löschen
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
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

      {maintenanceComponent && (
        <Dialog open={maintenanceDialogOpen} onOpenChange={setMaintenanceDialogOpen}>
          <DialogContent className="sm:max-w-[425px] p-0">
            <DialogTitle className="flex items-center gap-2 p-4">
              <Wrench className="h-5 w-5" />
              Wartung durchführen
            </DialogTitle>
            <div className="p-4 pt-0">
              <MaintenanceForm 
                onSave={handleSaveMaintenance}
                isLoading={false}
                onOpenChange={setMaintenanceDialogOpen}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {addToListComponent && (
        <Dialog open={addToListDialogOpen} onOpenChange={setAddToListDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogTitle className="flex items-center gap-2">
              <ListPlus className="h-5 w-5" />
              Zu Liste hinzufügen
            </DialogTitle>
            <ScrollArea className="max-h-[300px] pr-4">
              <div className="space-y-2">
                {lists.map((list) => (
                  <Card
                    key={list.id}
                    className={cn(
                      "hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer",
                      list.components.includes(addToListComponent.id) && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => {
                      if (!list.components.includes(addToListComponent.id)) {
                        handleAddToList(list.id);
                      }
                    }}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{list.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {list.itemCount} {list.itemCount === 1 ? 'Komponente' : 'Komponenten'}
                        </div>
                      </div>
                      {list.components.includes(addToListComponent.id) && (
                        <Badge variant="secondary">Bereits hinzugefügt</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {lists.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    Keine Listen verfügbar
                  </div>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
} 