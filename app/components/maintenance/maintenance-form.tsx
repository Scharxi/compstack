'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MAINTENANCE_TASKS } from "@/app/types/hardware";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ClipboardList, 
  StickyNote, 
  ArrowRight,
  Filter,
  Save
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

interface MaintenanceFormProps {
  onSave: (data: { completedTasks: string[], notes: string }) => void;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
}

// Gruppiere Wartungsaufgaben nach Kategorie
const TASK_CATEGORIES = {
  "INSPECTION": "Sichtprüfung",
  "CLEANING": "Reinigung",
  "SOFTWARE": "Software",
  "PERFORMANCE": "Leistung",
  "SAFETY": "Sicherheit"
} as const;

type TaskCategory = keyof typeof TASK_CATEGORIES;

const CATEGORY_COLORS = {
  INSPECTION: "blue",
  CLEANING: "green",
  SOFTWARE: "purple",
  PERFORMANCE: "orange",
  SAFETY: "red"
} as const;

const CATEGORY_ICONS = {
  INSPECTION: "👁️",
  CLEANING: "🧹",
  SOFTWARE: "💻",
  PERFORMANCE: "📊",
  SAFETY: "🛡️"
} as const;

const getTaskCategory = (taskId: string): TaskCategory => {
  const task = MAINTENANCE_TASKS.find(t => t.id === taskId);
  if (!task) return 'INSPECTION';

  const label = task.label.toLowerCase();
  
  if (label.includes('sichtprüfung') || 
      label.includes('überprüfung') || 
      label.includes('inspektion')) {
    return 'INSPECTION';
  }
  
  if (label.includes('reinigung') || 
      label.includes('säuberung') || 
      label.includes('putzen')) {
    return 'CLEANING';
  }
  
  if (label.includes('software') || 
      label.includes('update') || 
      label.includes('installation')) {
    return 'SOFTWARE';
  }
  
  if (label.includes('leistung') || 
      label.includes('test') || 
      label.includes('performance')) {
    return 'PERFORMANCE';
  }
  
  if (label.includes('sicherheit') || 
      label.includes('schutz') || 
      label.includes('antivirus')) {
    return 'SAFETY';
  }
  
  return 'INSPECTION';
};

export function MaintenanceForm({ onSave, onOpenChange, isLoading }: MaintenanceFormProps) {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const progressPercentage = (completedTasks.length / MAINTENANCE_TASKS.length) * 100;

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        if (completedTasks.length > 0) {
          handleSubmit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [completedTasks]);

  const handleTaskToggle = (taskId: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSubmit = async () => {
    try {
      setSaveStatus('saving');
      
      await onSave({
        completedTasks,
        notes
      });
      
      setSaveStatus('success');
      toast.success('Wartungsprotokoll erfolgreich gespeichert');
      
      // Reset form and close dialog
      setCompletedTasks([]);
      setNotes("");
      onOpenChange(false);
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      toast.error('Fehler beim Speichern des Wartungsprotokolls');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <ClipboardList className="h-5 w-5" />
            </motion.div>
            <CardTitle>Wartungsaufgaben</CardTitle>
          </div>
          <motion.div 
            className="text-sm text-muted-foreground"
            animate={{ 
              scale: completedTasks.length > 0 ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {completedTasks.length} von {MAINTENANCE_TASKS.length} Aufgaben
          </motion.div>
        </div>
        <Progress 
          value={progressPercentage} 
          className={cn(
            "h-1 transition-all duration-300",
            progressPercentage === 100 && "!bg-green-500/20 [--progress-background:hsl(var(--green-500))]"
          )}
        />
      </CardHeader>

      <CardContent className="px-0 space-y-6">
        <div className="space-y-2">
          <AnimatePresence>
            {MAINTENANCE_TASKS.map((task) => {
              const category = getTaskCategory(task.id);
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="bg-background rounded-lg border shadow-sm"
                >
                  <div className="flex items-start gap-4 p-4">
                    <Checkbox
                      id={task.id}
                      checked={completedTasks.includes(task.id)}
                      onCheckedChange={() => handleTaskToggle(task.id)}
                      className="mt-1"
                    />
                    <div className="grid gap-1.5 flex-1 min-w-0">
                      <label
                        htmlFor={task.id}
                        className={cn(
                          "text-sm font-medium leading-none",
                          completedTasks.includes(task.id) && "line-through text-muted-foreground"
                        )}
                      >
                        {task.label}
                      </label>
                      {task.description && (
                        <p className={cn(
                          "text-sm text-muted-foreground",
                          completedTasks.includes(task.id) && "line-through"
                        )}>
                          {task.description}
                        </p>
                      )}
                    </div>
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-lg shrink-0"
                    >
                      {CATEGORY_ICONS[category]}
                    </motion.span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="notes" className="text-muted-foreground flex items-center gap-2">
              <StickyNote className="h-4 w-4" />
              Notizen
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Zusätzliche Anmerkungen zur Wartung..."
              className="mt-1.5 resize-none"
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-0 flex justify-end">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleSubmit}
            disabled={completedTasks.length === 0 || saveStatus === 'saving'}
            className="gap-2"
          >
            {saveStatus === 'saving' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Speichern...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Speichern
              </>
            )}
          </Button>
        </motion.div>
      </CardFooter>
    </Card>
  );
} 