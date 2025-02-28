'use client';

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

interface List {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  itemCount: number;
}

// Beispieldaten - später durch echte Daten ersetzen
const lists: List[] = [
  {
    id: "1",
    name: "Jahresinventur 2024",
    description: "Komplette Inventur aller IT-Komponenten",
    createdAt: new Date("2024-01-15"),
    itemCount: 150
  },
  {
    id: "2",
    name: "Netzwerk-Audit",
    description: "Überprüfung der Netzwerkkomponenten",
    createdAt: new Date("2024-02-20"),
    itemCount: 45
  }
];

export function ListsTable() {
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
            <TableRow key={list.id}>
              <TableCell className="font-medium">{list.name}</TableCell>
              <TableCell>{list.description}</TableCell>
              <TableCell>{list.createdAt.toLocaleDateString()}</TableCell>
              <TableCell>{list.itemCount}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <FileSpreadsheet className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive">
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