'use client';

import { CreateListDialog } from "./create-list-dialog";

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
        <CreateListDialog onListCreated={() => {
          // TODO: Implement refresh of lists
          console.log("List created, refreshing...");
        }} />
      </div>
    </div>
  );
} 