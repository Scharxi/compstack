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
} from "@/app/types/hardware";
import { useComponentsStore } from "@/app/store/components";
import { fetchComponent } from '@/app/services/api';
import { ThemeToggle } from "@/app/components/theme-toggle";
import { MaintenanceHistory } from "@/app/components/maintenance/maintenance-history";
import { toast } from "sonner";

interface ComponentDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ComponentDetailsPage({ params }: ComponentDetailsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [component, setComponent] = useState<HardwareComponent | null>(null);
  const updateComponent = useComponentsStore((state) => state.updateComponent);
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  useEffect(() => {
    async function loadComponent() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchComponent(id);
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

  const handleMaintenanceSave = async (data: { completedTasks: string[], notes: string }) => {
    if (component) {
      const newMaintenanceProtocol = {
        date: new Date(),
        completedTasks: data.completedTasks,
        notes: data.notes
      };

      const updatedComponent = {
        ...component,
        newMaintenanceProtocol,
        maintenanceHistory: [...(component.maintenanceHistory || [])],
        lastMaintenanceDate: new Date()
      };

      try {
        await updateComponent(updatedComponent);
        const refreshedData = await fetchComponent(id);
        setComponent(refreshedData);
        toast.success('Wartungsprotokoll erfolgreich gespeichert');
      } catch (error) {
        console.error('Failed to save maintenance protocol:', error);
        toast.error('Fehler beim Speichern des Wartungsprotokolls');
      }
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
                const specFields = SPECIFICATIONS_CONFIG[component.category]?.[component.indicator];
                const label = specFields?.[key]?.label || key;
                
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