'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useListsStore } from "@/app/store/lists";
import { toast } from "sonner";

export default function EditListPage() {
  const params = useParams();
  const router = useRouter();
  const { lists, isLoading, error, fetchLists, updateList } = useListsStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  useEffect(() => {
    const list = lists.find(l => l.id === params.id);
    if (list) {
      setName(list.name);
      setDescription(list.description);
    }
  }, [lists, params.id]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Bitte geben Sie einen Namen ein");
      return;
    }

    setIsSaving(true);
    try {
      const list = lists.find(l => l.id === params.id);
      if (!list) throw new Error("Liste nicht gefunden");

      await updateList({
        ...list,
        name: name.trim(),
        description: description.trim()
      });

      toast.success("Liste erfolgreich aktualisiert");
      router.push('/lists');
    } catch (error) {
      toast.error("Fehler beim Aktualisieren der Liste");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => fetchLists()} variant="outline">
            Erneut versuchen
          </Button>
        </div>
      </div>
    );
  }

  const list = lists.find(l => l.id === params.id);
  if (!list) {
    return (
      <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
        <div className="flex items-center justify-center h-full">
          Liste nicht gefunden
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSaving || !name.trim()}
          className="gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Wird gespeichert...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Speichern
            </>
          )}
        </Button>
      </div>

      <div className="space-y-4 max-w-2xl">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name der Liste"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Beschreibung
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beschreibung der Liste (optional)"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
} 