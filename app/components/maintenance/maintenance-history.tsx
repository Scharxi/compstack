'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MAINTENANCE_TASKS, type MaintenanceProtocol } from "@/app/types/hardware";
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { motion } from "framer-motion";
import { Wrench, CalendarDays, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";

interface MaintenanceHistoryProps {
  protocols: MaintenanceProtocol[];
}

export function MaintenanceHistory({ protocols }: MaintenanceHistoryProps) {
  const sortedProtocols = [...protocols].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Wartungshistorie
            </CardTitle>
            <CardDescription>
              Übersicht aller durchgeführten Wartungen
            </CardDescription>
          </div>
          <Badge variant="outline" className="h-7">
            {protocols.length} {protocols.length === 1 ? 'Eintrag' : 'Einträge'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {protocols.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Wrench className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium mb-2">Keine Wartungseinträge</p>
            <p className="text-sm text-muted-foreground">
              Es wurden noch keine Wartungen für diese Komponente durchgeführt.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedProtocols.map((protocol, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="relative pl-6 before:absolute before:left-0 before:top-[24px] before:bottom-[-24px] before:w-px before:bg-border last:before:hidden">
                  <div className="absolute left-[-4px] top-[18px] h-2 w-2 rounded-full bg-primary" />
                  <div className={cn(
                    "group rounded-lg border bg-card p-4 transition-all duration-200 hover:shadow-md",
                    "hover:border-primary/50 hover:bg-accent/50"
                  )}>
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                            {new Date(protocol.date).toLocaleDateString('de-DE')}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(protocol.date), { 
                              addSuffix: true, 
                              locale: de 
                            })}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {protocol.completedTasks.length} {protocol.completedTasks.length === 1 ? 'Aufgabe' : 'Aufgaben'}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                            <Wrench className="h-4 w-4" />
                            Durchgeführte Aufgaben
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {protocol.completedTasks.map(taskId => {
                              const task = MAINTENANCE_TASKS.find(t => t.id === taskId);
                              return task ? (
                                <Badge 
                                  key={taskId} 
                                  variant="outline"
                                  className="bg-primary/5 hover:bg-primary/10 transition-colors"
                                >
                                  {task.label}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>

                        {protocol.notes && (
                          <div>
                            <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                              <ScrollText className="h-4 w-4" />
                              Anmerkungen
                            </div>
                            <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                              {protocol.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 