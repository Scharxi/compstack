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
  type HardwareComponent
} from "@/app/types/hardware";
import { useComponentsStore } from "@/app/store/components";
import { fetchComponent } from '@/app/services/api';
import { ThemeToggle } from "@/app/components/theme-toggle";

interface ComponentDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

// Spezifikations-Labels
const SPEC_LABELS: Record<string, string> = {
  CPU: "CPU",
  RAM: "RAM",
  Storage: "Storage",
  Display: "Display",
  OS: "Operating System",
  interfaces: "Interfaces",
  primaryStorage: "Primary Storage",
  secondaryStorage: "Secondary Storage",
  size: "Screen Size",
  resolution: "Resolution",
  panel: "Panel Type",
  chip: "Chip",
  memory: "Memory",
  model: "Model",
  socket: "Socket",
  type: "Type",
  capacity: "Capacity",
  interface: "Interface",
  rpm: "RPM"
};

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

  const handleChange = (field: keyof HardwareComponent, value: string | Date | Record<string, string> | undefined) => {
    if (editedComponent) {
      setEditedComponent({ ...editedComponent, [field]: value });
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

  const handleSaveMaintenance = async () => {
    if (component && completedTasks.length > 0) {
      const newMaintenanceProtocol = {
        date: new Date(),
        completedTasks,
        notes: maintenanceNotes || undefined
      };

      const updatedComponent = {
        ...component,
        newMaintenanceProtocol
      };

      try {
        await updateComponent(updatedComponent);
        const refreshedData = await fetchComponent(id);
        setComponent(refreshedData);
        setEditedComponent(refreshedData);
        setCompletedTasks([]);
        setMaintenanceNotes("");
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
              {Object.entries(component.specifications).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {SPEC_LABELS[key] || key}
                  </p>
                  {renderSpecificationValue(key, value)}
                </div>
              ))}
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

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Wartung durchführen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Wartungsaufgaben</h3>
                  {MAINTENANCE_TASKS.map(task => (
                    <div key={task.id} className="flex items-center space-x-4">
                      <Switch
                        id={task.id}
                        checked={completedTasks.includes(task.id)}
                        onCheckedChange={() => handleMaintenanceTaskToggle(task.id)}
                      />
                      <div className="grid gap-1.5">
                        <Label htmlFor={task.id}>{task.label}</Label>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Anmerkungen</h3>
                  <Textarea
                    value={maintenanceNotes}
                    onChange={handleMaintenanceNotesChange}
                    placeholder="Zusätzliche Anmerkungen zur Wartung..."
                    className="min-h-[200px]"
                  />
                </div>
              </div>

              <hr className="my-6 border-t border-border" />

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveMaintenance}
                  disabled={completedTasks.length === 0}
                >
                  Wartung protokollieren
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {component.maintenanceHistory && component.maintenanceHistory.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Wartungshistorie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[...component.maintenanceHistory]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((protocol, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-semibold">
                        Wartung vom {new Date(protocol.date).toLocaleDateString('de-DE')}
                      </h4>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium mb-2">Durchgeführte Aufgaben:</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {protocol.completedTasks.map(taskId => {
                            const task = MAINTENANCE_TASKS.find(t => t.id === taskId);
                            return task ? (
                              <li key={taskId}>{task.label}</li>
                            ) : null;
                          })}
                        </ul>
                      </div>
                      {protocol.notes && (
                        <div>
                          <h5 className="font-medium mb-2">Anmerkungen:</h5>
                          <p className="text-muted-foreground">{protocol.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 