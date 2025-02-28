'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { List } from "@/app/types/lists";
import { HardwareComponent } from "@/app/types/hardware";
import { STATUS, CATEGORIES, LOCATIONS, INDICATORS } from "@/app/types/hardware";
import { Cpu, MapPin, Package, Calendar, Computer, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface ListDetailsDialogProps {
  list: List;
  components: HardwareComponent[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ListDetailsDialog({ list, components, open, onOpenChange }: ListDetailsDialogProps) {
  const router = useRouter();
  const listComponents = components.filter(component => 
    list.components.includes(component.id)
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'AK':
        return 'success'; // Aktiv - Grün
      case 'IN':
        return 'warning'; // In Reparatur - Orange/Gelb
      case 'DE':
        return 'destructive'; // Defekt - Rot
      default:
        return 'secondary';
    }
  };

  const handleNavigateToComponent = (componentId: string) => {
    router.push(`/components/${encodeURIComponent(componentId)}`);
    onOpenChange(false); // Dialog schließen
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
            <Accordion type="multiple" className="space-y-2">
              {listComponents.map((component) => (
                <AccordionItem 
                  key={component.id} 
                  value={component.id} 
                  className="border rounded-lg px-4 data-[state=open]:bg-accent/5 transition-colors"
                >
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <div className="flex items-center gap-4 w-full">
                      <Computer className="h-5 w-5 text-muted-foreground shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-left">{component.name}</div>
                        <div className="text-sm text-muted-foreground text-left">
                          {component.serialNumber}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-sm text-muted-foreground">
                          {LOCATIONS[component.location]}
                        </div>
                        <Badge variant={getStatusVariant(component.status)}>
                          {STATUS[component.status]}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-2">
                    <div className="space-y-6 px-9">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div>
                              <div className="text-sm text-muted-foreground">Kategorie</div>
                              <div className="font-medium">{CATEGORIES[component.category]}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Cpu className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div>
                              <div className="text-sm text-muted-foreground">Typ</div>
                              <div className="font-medium">{INDICATORS[component.indicator]}</div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div>
                              <div className="text-sm text-muted-foreground">Standort</div>
                              <div className="font-medium">{LOCATIONS[component.location]}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div>
                              <div className="text-sm text-muted-foreground">Letzte Wartung</div>
                              <div className="font-medium">
                                {component.lastMaintenanceDate 
                                  ? new Date(component.lastMaintenanceDate).toLocaleDateString('de-DE')
                                  : 'Keine Wartung'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleNavigateToComponent(component.id)}
                        >
                          Mehr erfahren
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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