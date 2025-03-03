'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HardwareComponent, MAINTENANCE_TASKS, MaintenanceProtocol } from '@/app/types/hardware';
import { useComponentsStore } from '@/app/store/components';
import { useActivitiesStore } from '@/app/store/activities';

interface MaintenanceDialogProps {
  component: HardwareComponent;
  onComplete?: () => void;
}

export function MaintenanceDialog({ component, onComplete }: MaintenanceDialogProps) {
  const [open, setOpen] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { updateComponent } = useComponentsStore();
  const { logActivity } = useActivitiesStore();

  const handleTaskChange = (taskId: string, checked: boolean) => {
    if (checked) {
      setCompletedTasks(prev => [...prev, taskId]);
    } else {
      setCompletedTasks(prev => prev.filter(id => id !== taskId));
    }
  };

  const handleSubmit = async () => {
    if (completedTasks.length === 0) {
      alert('Bitte wählen Sie mindestens eine Wartungsaufgabe aus.');
      return;
    }

    setIsSubmitting(true);
    try {
      const maintenanceProtocol: MaintenanceProtocol = {
        date: new Date(),
        completedTasks,
        notes: notes.trim() || undefined
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
      
      // Protokolliere die Wartungsaktivität
      await logActivity({
        type: 'maintenance',
        componentId: component.id,
        componentName: component.name,
        user: 'System',
        details: `Wartung für Komponente "${component.name}" durchgeführt`
      });
      
      setOpen(false);
      setCompletedTasks([]);
      setNotes('');
      onComplete?.();
    } catch (error) {
      console.error('Fehler bei der Wartung:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Wartung durchführen</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Wartung durchführen</DialogTitle>
          <DialogDescription>
            Wählen Sie die durchgeführten Wartungsaufgaben aus und fügen Sie optional Notizen hinzu.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h4 className="font-medium">Wartungsaufgaben</h4>
            {MAINTENANCE_TASKS.map((task) => (
              <div key={task.id} className="flex items-start space-x-2">
                <Checkbox 
                  id={task.id} 
                  checked={completedTasks.includes(task.id)}
                  onCheckedChange={(checked) => 
                    handleTaskChange(task.id, checked === true)
                  }
                />
                <div className="grid gap-1.5">
                  <Label htmlFor={task.id} className="font-medium">
                    {task.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {task.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notizen</Label>
            <Textarea
              id="notes"
              placeholder="Optionale Notizen zur durchgeführten Wartung..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Abbrechen
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || completedTasks.length === 0}
          >
            {isSubmitting ? 'Wird gespeichert...' : 'Wartung speichern'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 