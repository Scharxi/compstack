'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2, Trash2, Loader2, Component } from "lucide-react";
import { useListsStore } from "@/app/store/lists";
import { toast } from "sonner";

export function ListsTable() {
  const router = useRouter();
  const { lists, isLoading, error, fetchLists, deleteList } = useListsStore();

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    try {
      await deleteList(id);
      toast.success("Liste erfolgreich gelöscht");
    } catch (error) {
      toast.error("Fehler beim Löschen der Liste");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => fetchLists()} variant="outline">
          Erneut versuchen
        </Button>
      </div>
    );
  }

  if (lists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <p className="text-muted-foreground">
          Keine Listen vorhanden
        </p>
        <p className="text-sm text-muted-foreground">
          Erstellen Sie eine neue Liste, um Komponenten zu gruppieren
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {lists.map((list) => (
        <Card 
          key={list.id}
          className="hover:bg-accent/5 transition-colors cursor-pointer"
          onClick={() => router.push(`/lists/${list.id}`)}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-start justify-between">
              <span className="truncate text-xl">{list.name}</span>
              <div className="flex items-center gap-1 ml-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-9 w-9"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/lists/${list.id}/edit`);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-9 w-9 text-destructive hover:text-destructive"
                  onClick={(e) => handleDelete(e, list.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
              {list.description || "Keine Beschreibung"}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-muted-foreground pt-3 border-t">
            <div className="flex items-center gap-2">
              <Component className="h-4 w-4" />
              {list.itemCount} {list.itemCount === 1 ? 'Komponente' : 'Komponenten'}
            </div>
            <div>
              {new Date(list.createdAt).toLocaleDateString('de-DE')}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 