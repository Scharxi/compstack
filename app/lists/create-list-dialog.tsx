'use client';

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Loader2 } from "lucide-react";
import { useListsStore } from "@/app/store/lists";
import { toast } from "sonner";

interface CreateListDialogProps {
  onListCreated?: () => void;
}

export function CreateListDialog({ onListCreated }: CreateListDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addList = useListsStore(state => state.addList);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Bitte geben Sie einen Namen ein");
      return;
    }

    setIsSubmitting(true);
    try {
      await addList({
        name: name.trim(),
        description: description.trim()
      });
      toast.success("Liste erfolgreich erstellt");
      setOpen(false);
      setName("");
      setDescription("");
      onListCreated?.();
    } catch (error) {
      toast.error("Fehler beim Erstellen der Liste");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Neue Liste
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neue Liste erstellen</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
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
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird erstellt...
                </>
              ) : (
                'Liste erstellen'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 