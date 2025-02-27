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
  type HardwareComponent 
} from "@/app/types/hardware";

interface ComponentDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

// Temporäre Mock-Daten
const mockComponent: HardwareComponent = {
  id: "IT-HH-FI/AKLT/001",
  name: "ThinkPad X1 Carbon",
  category: "IT",
  location: "HH",
  ownership: "FI",
  status: "AK",
  indicator: "LT",
  runningNumber: "001",
  serialNumber: "PF2MXCZ",
  purchaseDate: new Date("2024-01-15"),
  specifications: {
    cpu: "Intel i7-1165G7",
    ram: "16GB",
    storage: "512GB SSD",
    display: "14 Zoll, 1920x1080",
    os: "Windows 11 Pro"
  }
};

export default function ComponentDetailsPage({ params }: ComponentDetailsProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [component, setComponent] = useState<HardwareComponent | null>(null);
  const { id } = use(params);

  useEffect(() => {
    // Decode the ID from the URL
    const decodedId = decodeURIComponent(id);
    
    // TODO: Hier werden wir später die Komponente aus dem globalen State oder einer API laden
    // Für jetzt verwenden wir Mock-Daten
    if (decodedId === mockComponent.id) {
      setComponent(mockComponent);
    }
  }, [id]);
  
  if (!component) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Komponente nicht gefunden</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{component.name}</h1>
          <p className="text-muted-foreground">
            ID: {component.id}
          </p>
        </div>
        <div className="space-x-4">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
          >
            Zurück
          </Button>
          <Button 
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Abbrechen' : 'Bearbeiten'}
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
                <p className="font-medium">{CATEGORIES[component.category]}</p>
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
                <Badge>{STATUS[component.status]}</Badge>
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
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(component.specifications).map(([key, value]) => (
                <div key={key}>
                  <p className="text-sm text-muted-foreground">{key}</p>
                  <p className="font-medium">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zeitliche Informationen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Kaufdatum</p>
              <p className="font-medium">
                {component.purchaseDate.toLocaleDateString('de-DE')}
              </p>
            </div>
            {component.lastMaintenanceDate && (
              <div>
                <p className="text-sm text-muted-foreground">Letzte Wartung</p>
                <p className="font-medium">
                  {component.lastMaintenanceDate.toLocaleDateString('de-DE')}
                </p>
              </div>
            )}
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
      </div>
    </div>
  );
} 