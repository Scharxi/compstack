'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  MAINTENANCE_TASKS,
  CATEGORY_INDICATORS,
  SPECIFICATIONS_CONFIG,
  type HardwareComponent,
  type Category,
  type Indicator
} from "@/app/types/hardware";
import { useComponentsStore } from "@/app/store/components";
import { fetchComponent } from '@/app/services/api';
import { ThemeToggle } from "@/app/components/theme-toggle";
import { MaintenanceForm } from "@/app/components/maintenance/maintenance-form";
import { MaintenanceHistory } from "@/app/components/maintenance/maintenance-history";

interface ComponentDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ComponentDetailsPage({ params }: ComponentDetailsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [maintenanceNotes, setMaintenanceNotes] = useState("");
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const updateComponent = useComponentsStore((state) => state.updateComponent);
  const [component, setComponent] = useState<HardwareComponent | null>(null);
  const [editedComponent, setEditedComponent] = useState<HardwareComponent | null>(null);

  useEffect(() => {
    async function loadComponent() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchComponent(id);
        setComponent(data);
        setEditedComponent(data);
      } catch (err) {
        setError('Failed to load component');
        console.error('Error loading component:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadComponent();
  }, [id]);

  const handleSave = () => {
    if (editedComponent) {
      updateComponent(editedComponent);
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

  // Funktion zum Filtern der verfügbaren Indikatoren basierend auf der Kategorie
  const getAvailableIndicators = (category: Category) => {
    return CATEGORY_INDICATORS[category] as Indicator[];
  };

  // Funktion zum Abrufen der verfügbaren Spezifikationen
  const getSpecificationFields = (category: string, indicator: string) => {
    return SPECIFICATIONS_CONFIG[category as Category]?.[indicator] || {};
  };

  // Aktualisierte handleChange Funktion
  const handleChange = (field: keyof HardwareComponent, value: string | Date | Record<string, string> | undefined) => {
    if (editedComponent) {
      if (field === 'category') {
        // Wenn die Kategorie geändert wird, setze den Indikator zurück und leere die Spezifikationen
        const newCategory = value as Category;
        const availableIndicators = getAvailableIndicators(newCategory);
        const defaultIndicator = availableIndicators[0] as Indicator;
        setEditedComponent({
          ...editedComponent,
          category: newCategory,
          indicator: defaultIndicator,
          specifications: {}
        });
      } else if (field === 'indicator') {
        // Wenn der Indikator geändert wird, initialisiere die Spezifikationen neu
        const newIndicator = value as Indicator;
        const specFields = getSpecificationFields(editedComponent.category, newIndicator);
        const newSpecs: Record<string, string> = {};
        Object.keys(specFields).forEach(key => {
          newSpecs[key] = editedComponent.specifications[key] || '';
        });
        setEditedComponent({
          ...editedComponent,
          indicator: newIndicator,
          specifications: newSpecs
        });
      } else {
        setEditedComponent({ ...editedComponent, [field]: value });
      }
    }
  };

  // Funktion zum Aktualisieren einer einzelnen Spezifikation
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

  const handleMaintenanceTaskToggle = (taskId: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleMaintenanceNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMaintenanceNotes(e.target.value);
  };

  const handleSaveMaintenance = async (data: { completedTasks: string[], notes: string }) => {
    if (component) {
      const newMaintenanceProtocol = {
        date: new Date(),
        completedTasks: data.completedTasks,
        notes: data.notes
      };

      const updatedComponent = {
        ...component,
        newMaintenanceProtocol,
        lastMaintenanceDate: new Date()
      };

      try {
        await updateComponent(updatedComponent);
        const refreshedData = await fetchComponent(id);
        setComponent(refreshedData);
        setEditedComponent(refreshedData);
      } catch (error) {
        console.error('Failed to save maintenance protocol:', error);
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

  if (error || !component || !editedComponent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">Component not found</p>
      </div>
    );
  }

  const renderValue = (field: keyof typeof component, isEditing: boolean) => {
    if (!isEditing) {
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
              <SelectItem value="AK">Aktiv</SelectItem>
              <SelectItem value="IN">Inaktiv</SelectItem>
              <SelectItem value="DE">Defekt</SelectItem>
            </SelectContent>
          </Select>
        );
      case 'indicator':
        return (
          <Select 
            value={editedComponent.indicator} 
            onValueChange={(value) => handleChange('indicator', value)}
            disabled={!editedComponent.category}
          >
            <SelectTrigger>
              <SelectValue placeholder="Wählen..." />
            </SelectTrigger>
            <SelectContent>
              {getAvailableIndicators(editedComponent.category as Category).map(indicator => (
                <SelectItem key={indicator} value={indicator}>{INDICATORS[indicator]}</SelectItem>
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

  const renderSpecificationValue = (key: string, value: string) => {
    if (key === 'interfaces') {
      return (
        <div className="flex flex-wrap gap-2">
          {value.split(", ").map((interface_, index) => (
            <Badge key={index} variant="outline">
              {interface_}
            </Badge>
          ))}
        </div>
      );
    }
    return <p className="font-medium">{value}</p>;
  };

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
        <div className="space-x-4 flex items-center">
          <ThemeToggle />
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
                {isEditing ? (
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
                ) : (
                  <p className="font-medium">{CATEGORIES[component.category as Category]}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Typ</p>
                {isEditing ? (
                  <Select 
                    value={editedComponent.indicator} 
                    onValueChange={(value) => handleChange('indicator', value)}
                    disabled={!editedComponent.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableIndicators(editedComponent.category as Category).map(indicator => (
                        <SelectItem key={indicator} value={indicator}>{INDICATORS[indicator]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="font-medium">{INDICATORS[component.indicator]}</p>
                )}
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
                  <Badge variant={getStatusVariant(component.status)}>
                    {STATUS[component.status]}
                  </Badge>
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
            <div className="space-y-4">
              {isEditing ? (
                Object.entries(getSpecificationFields(editedComponent.category, editedComponent.indicator)).map(([key, field]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key} className="text-sm text-muted-foreground">
                      {field.label}{field.required && ' *'}
                    </Label>
                    {field.type === 'select' ? (
                      <Select
                        value={editedComponent.specifications[key] || ''}
                        onValueChange={(value) => handleSpecificationChange(key, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Wählen..." />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={key}
                        value={editedComponent.specifications[key] || ''}
                        onChange={(e) => handleSpecificationChange(key, e.target.value)}
                        required={field.required}
                      />
                    )}
                  </div>
                ))
              ) : (
                Object.entries(component.specifications).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {getSpecificationFields(component.category, component.indicator)[key]?.label || key}
                    </p>
                    {renderSpecificationValue(key, value)}
                  </div>
                ))
              )}
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

        <div className="md:col-span-2 space-y-6">
          <MaintenanceForm 
            onSave={handleSaveMaintenance}
            isLoading={isLoading}
          />

          <MaintenanceHistory 
            protocols={component.maintenanceHistory || []}
          />
        </div>
      </div>
    </div>
  );
} 