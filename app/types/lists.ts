export interface List {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  itemCount: number;
  components: string[];
}

export interface ListItem {
  id: string;
  listId: string;
  componentId: string;
  addedAt: Date;
  notes?: string;
} 