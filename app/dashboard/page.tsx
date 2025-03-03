'use client';

import { useEffect, useMemo } from 'react';
import { ComponentsTable } from "@/app/components/dashboard/components-table";
import { AddComponentForm } from "@/app/components/dashboard/add-component-form";
import { OverviewCards } from "@/app/components/dashboard/overview-cards";
import { useComponentsStore } from "@/app/store/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieLabelRenderProps } from 'recharts';
import { CATEGORIES, LOCATIONS, STATUS, DashboardStats } from "@/app/types/hardware";

export default function DashboardPage() {
  const { components, fetchComponents, isLoading, error } = useComponentsStore();

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  // Berechne die höchste laufende Nummer
  const getLastRunningNumber = () => {
    if (components.length === 0) return 0;
    return Math.max(...components.map(c => parseInt(c.runningNumber, 10)));
  };

  // Berechne Dashboard-Statistiken
  const stats: DashboardStats = useMemo(() => {
    const now = new Date();
    
    return {
      totalComponents: components.length,
      availableComponents: components.filter(c => c.status === 'AK' && !c.assignedTo).length,
      inUseComponents: components.filter(c => c.status === 'AK' && c.assignedTo).length,
      maintenanceRequired: components.filter(c => {
        // Komponenten ohne Wartungsdatum gelten als wartungsfällig
        if (!c.lastMaintenanceDate) return true;
        
        // Komponenten mit Wartungsdatum älter als 180 Tage gelten als wartungsfällig
        const lastMaintenance = new Date(c.lastMaintenanceDate);
        return now.getTime() - lastMaintenance.getTime() > 180 * 24 * 60 * 60 * 1000; // 180 Tage
      }).length,
      recentActivities: [] // Würde in einer echten Anwendung befüllt werden
    };
  }, [components]);

  // Daten für Kategorieverteilung
  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    
    components.forEach(component => {
      const category = component.category;
      data[category] = (data[category] || 0) + 1;
    });
    
    return Object.entries(data).map(([name, value]) => ({
      name: CATEGORIES[name as keyof typeof CATEGORIES],
      value
    }));
  }, [components]);

  // Daten für Standortverteilung
  const locationData = useMemo(() => {
    const data: Record<string, number> = {};
    
    components.forEach(component => {
      const location = component.location;
      data[location] = (data[location] || 0) + 1;
    });
    
    return Object.entries(data).map(([name, value]) => ({
      name: LOCATIONS[name as keyof typeof LOCATIONS],
      value
    }));
  }, [components]);

  // Daten für Statusverteilung
  const statusData = useMemo(() => {
    const data: Record<string, number> = {};
    
    components.forEach(component => {
      const status = component.status;
      data[status] = (data[status] || 0) + 1;
    });
    
    return Object.entries(data).map(([name, value]) => ({
      name: STATUS[name as keyof typeof STATUS],
      value
    }));
  }, [components]);

  // Farben für Charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Benutzerdefinierte Label-Funktion für Pie-Charts
  const renderCustomizedLabel = ({ name, percent }: PieLabelRenderProps) => {
    return `${name} ${(percent ? (percent * 100).toFixed(0) : 0)}%`;
  };

  if (isLoading) {
    return (
      <main className="container mx-auto p-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto p-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-destructive">Error loading components. Please try again later.</div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <AddComponentForm lastRunningNumber={getLastRunningNumber()} />
      </div>

      {/* Übersichtskarten */}
      <OverviewCards stats={stats} />

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kategorieverteilung */}
        <Card>
          <CardHeader>
            <CardTitle>Kategorieverteilung</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={renderCustomizedLabel}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Standortverteilung */}
        <Card>
          <CardHeader>
            <CardTitle>Standortverteilung</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={locationData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Anzahl" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Statusverteilung */}
        <Card>
          <CardHeader>
            <CardTitle>Statusverteilung</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Letzte Komponenten */}
        <Card>
          <CardHeader>
            <CardTitle>Zuletzt hinzugefügt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {components.slice(-5).reverse().map(component => (
                <div key={component.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">{component.name}</div>
                    <div className="text-sm text-muted-foreground">{component.id}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {CATEGORIES[component.category]}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Komponententabelle */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Alle Komponenten</TabsTrigger>
          <TabsTrigger value="active">Aktiv</TabsTrigger>
          <TabsTrigger value="maintenance">Wartung fällig</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ComponentsTable components={components} />
        </TabsContent>
        <TabsContent value="active">
          <ComponentsTable components={components.filter(c => c.status === 'AK')} />
        </TabsContent>
        <TabsContent value="maintenance">
          <ComponentsTable components={components.filter(c => {
            // Komponenten ohne Wartungsdatum gelten als wartungsfällig
            if (!c.lastMaintenanceDate) return true;
            
            // Komponenten mit Wartungsdatum älter als 180 Tage gelten als wartungsfällig
            const lastMaintenance = new Date(c.lastMaintenanceDate);
            const now = new Date();
            return now.getTime() - lastMaintenance.getTime() > 180 * 24 * 60 * 60 * 1000; // 180 Tage
          })} />
        </TabsContent>
      </Tabs>
    </main>
  );
} 