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
  Clock,
  Filter,
  Timer,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { format, formatDuration, intervalToDuration } from 'date-fns';
import { de } from 'date-fns/locale';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MaintenanceFormProps {
  onSave: (data: { completedTasks: string[], notes: string }) => void;
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

interface TaskTime {
  startTime: Date;
  endTime?: Date;
}

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

const formatTaskDuration = (startTime: Date, endTime: Date = new Date()) => {
  const duration = intervalToDuration({ start: startTime, end: endTime });
  return formatDuration(duration, {
    format: ['hours', 'minutes', 'seconds'],
    locale: de,
    zero: false,
    delimiter: ', '
  });
};

export function MaintenanceForm({ onSave, isLoading }: MaintenanceFormProps) {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'ALL'>('ALL');
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [taskTimes, setTaskTimes] = useState<Record<string, TaskTime>>({});
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second for active tasks
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
    setCompletedTasks(prev => {
      const newTasks = prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId];
      
      // Update task timing
      setTaskTimes(prevTimes => {
        const newTimes = { ...prevTimes };
        if (newTasks.includes(taskId)) {
          // Task started
          newTimes[taskId] = {
            startTime: new Date()
          };
        } else {
          // Task completed
          if (newTimes[taskId]) {
            newTimes[taskId] = {
              ...newTimes[taskId],
              endTime: new Date()
            };
          }
        }
        return newTimes;
      });

      // Show toast for task completion
      const task = MAINTENANCE_TASKS.find(t => t.id === taskId);
      if (task) {
        if (newTasks.includes(taskId)) {
          toast.success(`Aufgabe "${task.label}" gestartet`);
        } else {
          const taskTime = taskTimes[taskId];
          if (taskTime?.startTime) {
            const duration = formatTaskDuration(taskTime.startTime);
            toast.info(`Aufgabe "${task.label}" abgeschlossen (Dauer: ${duration})`);
          }
        }
      }
      
      return newTasks;
    });
  };

  const handleSubmit = async () => {
    try {
      setSaveStatus('saving');
      
      // Format task times for notes
      const taskTimesNotes = completedTasks
        .map(taskId => {
          const task = MAINTENANCE_TASKS.find(t => t.id === taskId);
          const time = taskTimes[taskId];
          if (task && time) {
            const duration = formatTaskDuration(time.startTime, time.endTime || new Date());
            return `${task.label}: ${duration}`;
          }
          return null;
        })
        .filter(Boolean)
        .join('\n');

      const totalDuration = formatTaskDuration(startTime);
      
      await onSave({
        completedTasks,
        notes: notes + '\n\nAufgewendete Zeit pro Aufgabe:\n' + taskTimesNotes + '\n\nGesamtdauer: ' + totalDuration
      });
      
      setSaveStatus('success');
      toast.success('Wartungsprotokoll erfolgreich gespeichert');
      
      // Reset form
      setCompletedTasks([]);
      setNotes("");
      setStartTime(new Date());
      setTaskTimes({});
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      toast.error('Fehler beim Speichern des Wartungsprotokolls');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const filteredTasks = MAINTENANCE_TASKS.filter(task =>
    selectedCategory === 'ALL' || getTaskCategory(task.id) === selectedCategory
  );

  const categoryProgress = Object.keys(TASK_CATEGORIES).reduce((acc, category) => {
    const categoryTasks = MAINTENANCE_TASKS.filter(task => getTaskCategory(task.id) === category);
    const completedCategoryTasks = categoryTasks.filter(task => completedTasks.includes(task.id));
    return {
      ...acc,
      [category]: {
        total: categoryTasks.length,
        completed: completedCategoryTasks.length,
        percentage: (completedCategoryTasks.length / categoryTasks.length) * 100
      }
    };
  }, {} as Record<string, { total: number; completed: number; percentage: number }>);

  return (
    <TooltipProvider>
      <Card className="relative overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                Wartung durchführen
                <AnimatePresence mode="wait">
                  {saveStatus === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="text-green-500"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </motion.div>
                  )}
                  {saveStatus === 'error' && (
                    <motion.div
                      key="error"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="text-red-500"
                    >
                      <AlertCircle className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Gestartet: {format(startTime, 'HH:mm:ss', { locale: de })} Uhr
                <span className="text-muted-foreground">
                  (Dauer: {formatTaskDuration(startTime, currentTime)})
                </span>
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {completedTasks.length} von {MAINTENANCE_TASKS.length} Aufgaben
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {selectedCategory === 'ALL' ? 'Alle Kategorien' : TASK_CATEGORIES[selectedCategory]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Nach Kategorie filtern</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setSelectedCategory('ALL')}
                    className="flex items-center justify-between"
                  >
                    Alle Kategorien
                    <Badge variant="secondary" className="ml-2">
                      {MAINTENANCE_TASKS.length}
                    </Badge>
                  </DropdownMenuItem>
                  {(Object.entries(TASK_CATEGORIES) as [TaskCategory, string][]).map(([key, label]) => (
                    <DropdownMenuItem 
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className="flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <span>{CATEGORY_ICONS[key]}</span>
                        {label}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary"
                          className={cn(
                            "bg-opacity-15",
                            `bg-${CATEGORY_COLORS[key]}-500`
                          )}
                        >
                          {categoryProgress[key].completed}/{categoryProgress[key].total}
                        </Badge>
                        {categoryProgress[key].completed === categoryProgress[key].total && (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Gesamtfortschritt</span>
              <span className="font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(Object.entries(TASK_CATEGORIES) as [TaskCategory, string][]).map(([key, label]) => (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span>{CATEGORY_ICONS[key]}</span>
                      {label}
                    </span>
                    <span>{Math.round(categoryProgress[key].percentage)}%</span>
                  </div>
                  <Progress 
                    value={categoryProgress[key].percentage} 
                    className="h-1"
                    style={{
                      '--progress-background': `var(--${CATEGORY_COLORS[key]}-500)`
                    } as React.CSSProperties}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {filteredTasks.map(task => {
                  const taskTime = taskTimes[task.id];
                  const isActive = completedTasks.includes(task.id) && !taskTime?.endTime;
                  const category = getTaskCategory(task.id);
                  
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      onHoverStart={() => setHoveredTask(task.id)}
                      onHoverEnd={() => setHoveredTask(null)}
                      className={cn(
                        "group relative p-4 rounded-lg border transition-all duration-200",
                        completedTasks.includes(task.id)
                          ? `border-${CATEGORY_COLORS[category]}-500 bg-${CATEGORY_COLORS[category]}-500/5 shadow-sm`
                          : hoveredTask === task.id
                          ? "border-primary/30 bg-accent/30 shadow-sm"
                          : "border-muted hover:border-primary/30"
                      )}
                    >
                      <div className="flex items-center space-x-4">
                        <Switch
                          id={task.id}
                          checked={completedTasks.includes(task.id)}
                          onCheckedChange={() => handleTaskToggle(task.id)}
                          disabled={isLoading || saveStatus === 'saving'}
                          className={cn(
                            "data-[state=checked]:bg-primary",
                            isActive && "animate-pulse"
                          )}
                        />
                        <div className="grid gap-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={task.id} className="text-base font-medium">
                              {task.label}
                            </Label>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs",
                                `border-${CATEGORY_COLORS[category]}-500/50 text-${CATEGORY_COLORS[category]}-500`
                              )}
                            >
                              {CATEGORY_ICONS[category]} {TASK_CATEGORIES[category]}
                            </Badge>
                            {isActive && (
                              <Badge variant="secondary" className="animate-pulse">
                                <Timer className="h-3 w-3 mr-1" />
                                {formatTaskDuration(taskTime.startTime, currentTime)}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                            {task.description}
                          </p>
                          {taskTime?.endTime && (
                            <p className="text-xs text-muted-foreground">
                              Abgeschlossen in {formatTaskDuration(taskTime.startTime, taskTime.endTime)}
                            </p>
                          )}
                        </div>
                        {completedTasks.includes(task.id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={cn(
                              "text-primary",
                              isActive && "animate-pulse"
                            )}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <StickyNote className="h-5 w-5 text-primary" />
                <h3 className="text-base font-medium">Anmerkungen</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Fügen Sie zusätzliche Informationen oder Beobachtungen zur durchgeführten Wartung hinzu.
                </p>
              </div>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Zusätzliche Anmerkungen zur Wartung..."
                className="min-h-[200px] resize-none"
                disabled={isLoading || saveStatus === 'saving'}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Drücken Sie <kbd className="px-2 py-1 rounded bg-muted">Strg</kbd> + <kbd className="px-2 py-1 rounded bg-muted">Enter</kbd> zum Speichern
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t bg-muted/10 mt-6 py-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {completedTasks.length === 0 
                ? "Wählen Sie mindestens eine Wartungsaufgabe aus"
                : `${completedTasks.length} Aufgabe${completedTasks.length === 1 ? '' : 'n'} ausgewählt`}
            </p>
            {completedTasks.some(taskId => !taskTimes[taskId]?.endTime) && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="gap-1 text-yellow-500">
                    <AlertTriangle className="h-3 w-3" />
                    Aktive Aufgaben
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  Es gibt noch aktive Aufgaben, die nicht abgeschlossen wurden
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={completedTasks.length === 0 || isLoading || saveStatus === 'saving'}
            className="min-w-[200px] relative"
          >
            {saveStatus === 'saving' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wird gespeichert...
              </>
            ) : saveStatus === 'success' ? (
              <>
                Erfolgreich gespeichert
                <CheckCircle2 className="ml-2 h-4 w-4" />
              </>
            ) : saveStatus === 'error' ? (
              <>
                Fehler beim Speichern
                <AlertCircle className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Wartung protokollieren
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
} 