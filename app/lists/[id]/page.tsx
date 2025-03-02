'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Search, X, Save } from "lucide-react";
import { useListsStore } from "@/app/store/lists";
import { useComponentsStore } from '@/app/store/components';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";
import { STATUS } from '@/app/types/hardware';

export default function ListDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { lists, fetchLists, updateList } = useListsStore();
  const { components, fetchComponents, isLoading } = useComponentsStore();
  const list = lists.find(l => l.id === params.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchLists();
    fetchComponents();
  }, [fetchLists, fetchComponents]);

  // Set initial selected components when list is loaded
  useEffect(() => {
    if (list) {
      setSelectedComponents(list.components);
    }
  }, [list]);

  const filteredComponents = components.filter(component => 
    (component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     component.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddComponent = (componentId: string) => {
    if (!selectedComponents.includes(componentId)) {
      setSelectedComponents(prev => [...prev, componentId]);
    }
  };

  const handleRemoveComponent = (componentId: string) => {
    setSelectedComponents(prev => prev.filter(id => id !== componentId));
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'AK':
        return 'success'; // Aktiv - Grün
      case 'IN':
        return 'warning'; // In Reparatur - Orange/Gelb
      case 'DE':
        return 'destructive'; // Defekt - Rot
      default:
        return 'secondary';
    }
  };

  const handleSave = async () => {
    if (!list) return;
    
    setIsSaving(true);
    try {
      await updateList({
        ...list,
        components: selectedComponents
      });
      toast.success("Liste erfolgreich gespeichert");
      router.refresh();
    } catch (error) {
      toast.error("Fehler beim Speichern der Liste");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!list) {
    return (
      <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück
          </Button>
        </div>
        <div className="flex justify-center items-center h-full">
          Liste nicht gefunden
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück
          </Button>
        </div>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Wird gespeichert..." : "Liste speichern"}
          </Button>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{list.name}</h1>
          <p className="text-muted-foreground">{list.description}</p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Available Components */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Komponenten suchen..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
            
            <div className="h-[600px] overflow-y-auto rounded-md border">
              <div className="p-4 space-y-2">
                {filteredComponents.map((component) => {
                  const isSelected = selectedComponents.includes(component.id);
                  return (
                    <Card 
                      key={component.id}
                      className={`${
                        isSelected
                          ? 'opacity-50' 
                          : 'hover:bg-accent hover:text-accent-foreground'
                      } transition-colors`}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex-1">
                          <div className="font-medium">{component.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {component.id}
                          </div>
                        </div>
                        <Badge variant={getStatusVariant(component.status)}>
                          {STATUS[component.status]}
                        </Badge>
                        {!isSelected && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleAddComponent(component.id)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
                {filteredComponents.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    Keine Komponenten gefunden
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Selected Components */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              Ausgewählte Komponenten ({selectedComponents.length})
            </h2>
            <div className="h-[600px] overflow-y-auto rounded-md border">
              <div className="p-4 space-y-2">
                {selectedComponents.map((componentId) => {
                  const component = components.find(c => c.id === componentId);
                  if (!component) return null;
                  
                  return (
                    <Card key={component.id}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex-1">
                          <div className="font-medium">{component.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {component.id}
                          </div>
                        </div>
                        <Badge variant={getStatusVariant(component.status)}>
                          {STATUS[component.status]}
                        </Badge>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveComponent(component.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
                {selectedComponents.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    Noch keine Komponenten ausgewählt
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 