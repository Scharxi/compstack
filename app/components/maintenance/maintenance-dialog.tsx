'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MaintenanceForm } from "./maintenance-form";
import { Wrench } from "lucide-react";

interface MaintenanceDialogProps {
  onSave: (data: { completedTasks: string[], notes: string }) => void;
  isLoading?: boolean;
}

export function MaintenanceDialog({ onSave, isLoading }: MaintenanceDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Wrench className="h-4 w-4" />
          Wartung durchführen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0">
        <div className="p-4">
          <MaintenanceForm 
            onSave={onSave} 
            isLoading={isLoading} 
            onOpenChange={setOpen}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 