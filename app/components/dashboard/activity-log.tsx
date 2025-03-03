'use client';

import { useEffect } from 'react';
import { useActivitiesStore } from '@/app/store/activities';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ActivityItem } from '@/app/components/activity/activity-item';

export function ActivityLog() {
  const { activities, fetchActivities, isLoading } = useActivitiesStore();
  
  // Nur die 5 neuesten Aktivitäten anzeigen
  const recentActivities = activities.slice(0, 5);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Aktivitätsprotokoll</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            Keine Aktivitäten vorhanden
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </CardContent>
      {activities.length > 5 && (
        <CardFooter>
          <Link href="/activity-history" className="w-full">
            <Button 
              variant="ghost" 
              className="w-full text-sm text-muted-foreground hover:text-primary"
            >
              Vollständige Historie anzeigen
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
} 