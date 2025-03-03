'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CATEGORIES, 
  LOCATIONS, 
  OWNERSHIPS, 
  STATUS, 
  INDICATORS,
  SPECIFICATIONS_CONFIG,
  type HardwareComponent,
  type Category,
  type MaintenanceProtocol
} from "@/app/types/hardware";
import { useComponentsStore } from "@/app/store/components";
import { fetchComponent } from '@/app/services/api';
import { ThemeToggle } from "@/app/components/theme-toggle";
import { MaintenanceHistory } from "@/app/components/maintenance/maintenance-history";
import { toast } from "sonner";
import { useActivitiesStore } from '@/app/store/activities';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface ComponentDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ComponentDetailsPage({ params }: ComponentDetailsProps) {
  const router = useRouter();
  const { updateComponent } = useComponentsStore();
  const { logActivity } = useActivitiesStore();
  
  // Komponenten-Zustand
  const [component, setComponent] = useState<HardwareComponent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Formular-Zustände
  const [assignedTo, setAssignedTo] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [maintenanceNotes, setMaintenanceNotes] = useState('');
  const [isPerformingMaintenance, setIsPerformingMaintenance] = useState(false);
  
  // Parameter auflösen
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  // Komponente laden
  useEffect(() => {
    async function loadComponent() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchComponent(id);
        
        // Korrektur für VR-Brillen, die in der falschen Kategorie gespeichert sind
        if (data.indicator === 'VR' && data.category !== 'IT') {
          console.log('Korrigiere Kategorie für VR-Brille von', data.category, 'zu IT');
          data.category = 'IT';
        }
        
        setComponent(data);
      } catch (err) {
        setError('Failed to load component');
        console.error('Error loading component:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadComponent();
  }, [id]);

  // Wartung speichern
  const handleMaintenanceSave = async (data: { completedTasks: string[], notes: string }) => {
    if (component) {
      const newMaintenanceProtocol: MaintenanceProtocol = {
        date: new Date(),
        completedTasks: data.completedTasks,
        notes: data.notes || undefined
      };

      try {
        const updatedComponent = {
          ...component,
          lastMaintenanceDate: new Date(),
          maintenanceHistory: [
            ...(component.maintenanceHistory || []),
            newMaintenanceProtocol
          ]
        };

        await updateComponent(updatedComponent);
        setComponent(updatedComponent);
        
        // Protokolliere die Wartungsaktivität
        await logActivity({
          type: 'maintenance',
          componentId: component.id,
          componentName: component.name,
          user: 'System',
          details: `Wartung für Komponente "${component.name}" durchgeführt`
        });
        
        toast.success('Wartung erfolgreich gespeichert');
      } catch (error) {
        console.error('Fehler beim Speichern der Wartung:', error);
        toast.error('Fehler beim Speichern der Wartung');
      }
    }
  };

  // Zuweisung speichern
  const handleAssign = async () => {
    if (!component) return;
    
    setIsAssigning(true);
    try {
      const updatedComponent = {
        ...component,
        assignedTo: assignedTo.trim() || undefined
      };
      
      await updateComponent(updatedComponent);
      setComponent(updatedComponent);
      
      // Protokolliere die Zuweisungsaktivität
      await logActivity({
        type: 'assignment',
        componentId: component.id,
        componentName: component.name,
        user: 'System',
        details: assignedTo.trim() 
          ? `Komponente "${component.name}" wurde ${assignedTo} zugewiesen` 
          : `Zuweisung für Komponente "${component.name}" wurde entfernt`
      });
      
      setAssignedTo('');
      toast.success(assignedTo.trim() 
        ? `Komponente wurde ${assignedTo} zugewiesen` 
        : 'Zuweisung wurde entfernt'
      );
    } catch (error) {
      console.error('Fehler bei der Zuweisung:', error);
      toast.error('Fehler bei der Zuweisung');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleMaintenance = async () => {
    if (!component) return;
    
    setIsPerformingMaintenance(true);
    try {
      const maintenanceProtocol = {
        date: new Date(),
        completedTasks,
        notes: maintenanceNotes.trim() || undefined
      };
      
      const updatedComponent = {
        ...component,
        lastMaintenanceDate: new Date(),
        maintenanceHistory: [
          ...(component.maintenanceHistory || []),
          maintenanceProtocol
        ]
      };
      
      await updateComponent(updatedComponent);
      setComponent(updatedComponent);
      
      // Protokolliere die Wartungsaktivität
      await logActivity({
        type: 'maintenance',
        componentId: component.id,
        componentName: component.name,
        user: 'System',
        details: `Wartung für Komponente "${component.name}" durchgeführt`
      });
      
      setCompletedTasks([]);
      setMaintenanceNotes('');
    } catch (error) {
      console.error('Fehler bei der Wartung:', error);
    } finally {
      setIsPerformingMaintenance(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !component) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">Component not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{component.name}</h1>
          <p className="text-muted-foreground">ID: {component.id}</p>
        </div>
        <div className="space-x-4 flex items-center">
          <ThemeToggle />
          <Button 
            variant="outline" 
            onClick={() => router.back()}
          >
            Zurück
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Allgemeine Informationen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Kategorie</p>
                <p className="font-medium">{CATEGORIES[component.category as Category]}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Typ</p>
                <p className="font-medium">{INDICATORS[component.indicator]}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Standort</p>
                <p className="font-medium">{LOCATIONS[component.location]}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Besitzverhältnis</p>
                <p className="font-medium">{OWNERSHIPS[component.ownership]}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={component.status === 'AK' ? 'success' : component.status === 'DE' ? 'destructive' : 'warning'}>
                  {STATUS[component.status]}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Seriennummer</p>
                <p className="font-medium">{component.serialNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spezifikationen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(component.specifications).map(([key, value]) => {
                // Skip notes as they will be displayed separately
                if (key === 'notes') return null;
                
                const specFields = SPECIFICATIONS_CONFIG[component.category as Category]?.[component.indicator];
                const label = specFields?.[key]?.label || key;
                
                console.log(`Spec key: ${key}, Category: ${component.category}, Indicator: ${component.indicator}`);
                console.log(`Label found: ${label}, Config exists: ${specFields ? 'Yes' : 'No'}`);
                
                return (
                  <div key={key} className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      {label}
                    </div>
                    {key === 'interfaces' ? (
                      <div className="flex flex-wrap gap-2">
                        {value.split(", ").map((interface_, index) => (
                          <Badge key={index} variant="outline">
                            {interface_}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm font-medium">
                        {value}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {component.assignedTo && (
          <Card>
            <CardHeader>
              <CardTitle>Zuordnung</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Zugewiesen an</p>
              <p className="font-medium">{component.assignedTo}</p>
            </CardContent>
          </Card>
        )}

        {component.specifications?.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Anmerkungen</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{component.specifications.notes}</p>
            </CardContent>
          </Card>
        )}

        <div className="md:col-span-2 space-y-6">
          <MaintenanceHistory 
            protocols={component.maintenanceHistory || []}
            isLoading={isLoading}
            onSave={handleMaintenanceSave}
          />
        </div>
      </div>
    </div>
  );
} 