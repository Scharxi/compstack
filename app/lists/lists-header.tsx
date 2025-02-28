'use client';

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function ListsHeader() {
  return (
    <div className="flex items-center justify-between space-y-2">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Listen</h2>
        <p className="text-muted-foreground">
          Verwalten Sie hier Ihre Listen für die Inventarisierung
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Neue Liste
        </Button>
      </div>
    </div>
  );
} 