'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, FileSpreadsheet } from "lucide-react";
import { useListsStore } from "@/app/store/lists";

export function ListsTable() {
  const router = useRouter();
  const { lists, isLoading, error, fetchLists, deleteList } = useListsStore();

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent row click when deleting
    await deleteList(id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8 text-destructive">
        {error}
      </div>
    );
  }

  if (lists.length === 0) {
    return (
      <div className="flex justify-center items-center py-8 text-muted-foreground">
        Keine Listen vorhanden. Erstellen Sie eine neue Liste.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Beschreibung</TableHead>
            <TableHead>Erstellt am</TableHead>
            <TableHead>Anzahl Einträge</TableHead>
            <TableHead className="text-right">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lists.map((list) => (
            <TableRow 
              key={list.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => router.push(`/lists/${list.id}`)}
            >
              <TableCell className="font-medium">{list.name}</TableCell>
              <TableCell>{list.description}</TableCell>
              <TableCell>{new Date(list.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{list.itemCount}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/lists/${list.id}`);
                    }}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement edit functionality
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive"
                    onClick={(e) => handleDelete(e, list.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 