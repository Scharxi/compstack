import { Separator } from "@/components/ui/separator";
import { ListsHeader } from "./lists-header";
import { ListsTable } from "./lists-table";

export default function ListsPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
      <ListsHeader />
      <Separator />
      <ListsTable />
    </div>
  );
} 