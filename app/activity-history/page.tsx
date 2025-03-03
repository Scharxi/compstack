'use client';

import { useEffect, useState } from 'react';
import { useActivitiesStore } from '@/app/store/activities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ActivityItem } from '@/app/components/activity/activity-item';

export default function ActivityHistoryPage() {
  const { activities, fetchActivities, isLoading } = useActivitiesStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Filtern der Aktivitäten basierend auf Suchbegriff und Typ
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.componentName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || activity.type === filterType;
    
    return matchesSearch && matchesType;
  });

  return (
    <main className="container mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Aktivitätshistorie</h1>
        <Link href="/dashboard">
          <Button variant="outline">Zurück zum Dashboard</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Suche nach Benutzer, Komponente oder Details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-64">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Alle Aktivitätstypen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Aktivitätstypen</SelectItem>
                  <SelectItem value="addition">Hinzufügung</SelectItem>
                  <SelectItem value="maintenance">Wartung</SelectItem>
                  <SelectItem value="assignment">Zuweisung</SelectItem>
                  <SelectItem value="retirement">Außerbetriebnahme</SelectItem>
                  <SelectItem value="update">Aktualisierung</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="h-full">
        <CardHeader>
          <CardTitle>Vollständige Aktivitätshistorie</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              Keine Aktivitäten gefunden
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-0 divide-y divide-border">
                {filteredActivities.map((activity) => (
                  <ActivityItem 
                    key={activity.id} 
                    activity={activity} 
                    className="p-4 border-b border-border"
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </main>
  );
} 