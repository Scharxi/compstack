'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CATEGORIES, 
  LOCATIONS, 
  OWNERSHIPS, 
  STATUS, 
  INDICATORS,
  type HardwareComponent,
  type Category,
  type Location,
  type Ownership,
  type Status,
  type Indicator
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
  const [editedComponent, setEditedComponent] = useState<HardwareComponent | null>(null);
  const { id } = use(params);

  useEffect(() => {
    // Decode the ID from the URL
    const decodedId = decodeURIComponent(id);
    
    // TODO: Hier werden wir später die Komponente aus dem globalen State oder einer API laden
    // Für jetzt verwenden wir Mock-Daten
    if (decodedId === mockComponent.id) {
      setComponent(mockComponent);
      setEditedComponent(mockComponent);
    }
  }, [id]);

  const handleSave = () => {
    if (editedComponent) {
      // TODO: Hier werden wir später die Änderungen im globalen State oder einer API speichern
      setComponent(editedComponent);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (component) {
      setEditedComponent(component);
      setIsEditing(false);
    }
  };

  const handleChange = (field: keyof HardwareComponent, value: string | Date | Record<string, string> | undefined) => {
    if (editedComponent) {
      setEditedComponent({ ...editedComponent, [field]: value });
    }
  };

  const handleSpecificationChange = (key: string, value: string) => {
    if (editedComponent) {
      setEditedComponent({
        ...editedComponent,
        specifications: {
          ...editedComponent.specifications,
          [key]: value
        }
      });
    }
  };
  
  if (!component || !editedComponent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Komponente nicht gefunden</p>
      </div>
    );
  }

  const renderValue = (field: keyof typeof component, isEditing: boolean) => {
    if (!isEditing) {
      if (field === 'purchaseDate' || field === 'lastMaintenanceDate') {
        return <p className="font-medium">{(component[field] as Date)?.toLocaleDateString('de-DE')}</p>;
      }
      return <p className="font-medium">{String(component[field])}</p>;
    }

    switch (field) {
      case 'category':
        return (
          <Select 
            value={editedComponent.category} 
            onValueChange={(value) => handleChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Wählen..." />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORIES).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'location':
        return (
          <Select 
            value={editedComponent.location} 
            onValueChange={(value) => handleChange('location', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Wählen..." />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LOCATIONS).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'ownership':
        return (
          <Select 
            value={editedComponent.ownership} 
            onValueChange={(value) => handleChange('ownership', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Wählen..." />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(OWNERSHIPS).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'status':
        return (
          <Select 
            value={editedComponent.status} 
            onValueChange={(value) => handleChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Wählen..." />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'indicator':
        return (
          <Select 
            value={editedComponent.indicator} 
            onValueChange={(value) => handleChange('indicator', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Wählen..." />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(INDICATORS).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            value={String(editedComponent[field])}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">
            {isEditing ? (
              <Input
                value={editedComponent.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="text-3xl font-bold h-auto py-0"
              />
            ) : (
              component.name
            )}
          </h1>
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
          {isEditing ? (
            <>
              <Button 
                variant="outline"
                onClick={handleCancel}
              >
                Abbrechen
              </Button>
              <Button 
                onClick={handleSave}
              >
                Speichern
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)}
            >
              Bearbeiten
            </Button>
          )}
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
                {renderValue('category', isEditing)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Typ</p>
                {renderValue('indicator', isEditing)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Standort</p>
                {renderValue('location', isEditing)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Besitzverhältnis</p>
                {renderValue('ownership', isEditing)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                {isEditing ? (
                  renderValue('status', isEditing)
                ) : (
                  <Badge>{STATUS[component.status]}</Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Seriennummer</p>
                {isEditing ? (
                  <Input
                    value={editedComponent.serialNumber}
                    onChange={(e) => handleChange('serialNumber', e.target.value)}
                  />
                ) : (
                  <p className="font-medium">{component.serialNumber}</p>
                )}
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
                  {isEditing ? (
                    <Input
                      value={editedComponent.specifications[key] || ''}
                      onChange={(e) => handleSpecificationChange(key, e.target.value)}
                    />
                  ) : (
                    <p className="font-medium">{value}</p>
                  )}
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
              {renderValue('purchaseDate', isEditing)}
            </div>
            {component.lastMaintenanceDate && (
              <div>
                <p className="text-sm text-muted-foreground">Letzte Wartung</p>
                {renderValue('lastMaintenanceDate', isEditing)}
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
              {isEditing ? (
                <Input
                  value={editedComponent.assignedTo || ''}
                  onChange={(e) => handleChange('assignedTo', e.target.value)}
                />
              ) : (
                <p className="font-medium">{component.assignedTo}</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 