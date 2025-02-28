'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { List } from "@/app/types/lists";
import { HardwareComponent } from "@/app/types/hardware";
import { STATUS } from "@/app/types/hardware";

interface ListDetailsDialogProps {
  list: List;
  components: HardwareComponent[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ListDetailsDialog({ list, components, open, onOpenChange }: ListDetailsDialogProps) {
  const listComponents = components.filter(component => 
    list.components.includes(component.id)
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'AK':
        return 'default';
      case 'IN':
        return 'secondary';
      case 'DE':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{list.name}</DialogTitle>
          <p className="text-muted-foreground">{list.description}</p>
        </DialogHeader>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground py-2">
          <div>
            {list.itemCount} {list.itemCount === 1 ? 'Komponente' : 'Komponenten'}
          </div>
          <div>
            Erstellt am {new Date(list.createdAt).toLocaleDateString('de-DE')}
          </div>
        </div>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-2 py-4">
            {listComponents.map((component) => (
              <Card key={component.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="font-medium">{component.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {component.serialNumber}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground">
                      {component.location}
                    </div>
                    <Badge variant={getStatusVariant(component.status)}>
                      {STATUS[component.status]}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            {listComponents.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                Keine Komponenten in dieser Liste
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 