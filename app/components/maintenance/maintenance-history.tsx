'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MAINTENANCE_TASKS, type MaintenanceProtocol } from "@/app/types/hardware";
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

interface MaintenanceHistoryProps {
  protocols: MaintenanceProtocol[];
}

export function MaintenanceHistory({ protocols }: MaintenanceHistoryProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Wartungshistorie</CardTitle>
        <Badge variant="outline">
          {protocols.length} {protocols.length === 1 ? 'Eintrag' : 'Einträge'}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {protocols.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Noch keine Wartungen durchgeführt
            </p>
          ) : (
            [...protocols]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((protocol, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold">
                        Wartung vom {new Date(protocol.date).toLocaleDateString('de-DE')}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(protocol.date), { 
                          addSuffix: true,
                          locale: de 
                        })}
                      </p>
                    </div>
                    <Badge>
                      {protocol.completedTasks.length} {protocol.completedTasks.length === 1 ? 'Aufgabe' : 'Aufgaben'}
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">Durchgeführte Aufgaben:</h5>
                      <div className="flex flex-wrap gap-2">
                        {protocol.completedTasks.map(taskId => {
                          const task = MAINTENANCE_TASKS.find(t => t.id === taskId);
                          return task ? (
                            <Badge key={taskId} variant="secondary">
                              {task.label}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                    {protocol.notes && (
                      <div>
                        <h5 className="font-medium mb-2">Anmerkungen:</h5>
                        <p className="text-muted-foreground bg-muted/30 p-3 rounded-md">
                          {protocol.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 