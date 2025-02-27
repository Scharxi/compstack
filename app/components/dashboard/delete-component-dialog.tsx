'use client';

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteComponentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  componentName: string;
}

export function DeleteComponentDialog({
  isOpen,
  onClose,
  onConfirm,
  componentName,
}: DeleteComponentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Komponente löschen</DialogTitle>
          <DialogDescription>
            Sind Sie sicher, dass Sie die Komponente &ldquo;{componentName}&rdquo; löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              Löschen
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 