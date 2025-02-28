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
import { PlusCircle } from "lucide-react";
import { useListsStore } from "@/app/store/lists";

interface CreateListDialogProps {
  onListCreated?: () => void;
}

export function CreateListDialog({ onListCreated }: CreateListDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const addList = useListsStore(state => state.addList);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    const newList = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      createdAt: new Date(),
      itemCount: 0
    };

    await addList(newList);

    setOpen(false);
    setName("");
    setDescription("");
    onListCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Neue Liste
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Neue Liste erstellen</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Jahresinventur 2024"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Beschreibung
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beschreiben Sie den Zweck dieser Liste..."
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            Liste erstellen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 