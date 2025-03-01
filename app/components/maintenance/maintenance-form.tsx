'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MAINTENANCE_TASKS } from "@/app/types/hardware";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MaintenanceFormProps {
  onSave: (data: { completedTasks: string[], notes: string }) => void;
  isLoading?: boolean;
}

export function MaintenanceForm({ onSave, isLoading }: MaintenanceFormProps) {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const handleTaskToggle = (taskId: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSubmit = () => {
    onSave({
      completedTasks,
      notes
    });
    // Reset form
    setCompletedTasks([]);
    setNotes("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wartung durchführen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Wartungsaufgaben</h3>
            {MAINTENANCE_TASKS.map(task => (
              <div key={task.id} className="flex items-center space-x-4">
                <Switch
                  id={task.id}
                  checked={completedTasks.includes(task.id)}
                  onCheckedChange={() => handleTaskToggle(task.id)}
                  disabled={isLoading}
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
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Zusätzliche Anmerkungen zur Wartung..."
              className="min-h-[200px]"
              disabled={isLoading}
            />
          </div>
        </div>

        <hr className="my-6 border-t border-border" />

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={completedTasks.length === 0 || isLoading}
          >
            {isLoading ? "Wird gespeichert..." : "Wartung protokollieren"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 