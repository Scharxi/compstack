import { create } from 'zustand';
import { List } from '@/app/types/lists';

interface ListsState {
  lists: List[];
  isLoading: boolean;
  error: string | null;
  fetchLists: () => Promise<void>;
  addList: (list: Omit<List, 'id' | 'createdAt' | 'itemCount' | 'components'>) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  updateList: (updatedList: List) => Promise<void>;
}

export const useListsStore = create<ListsState>((set) => ({
  lists: [],
  isLoading: false,
  error: null,

  fetchLists: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/lists');
      if (!response.ok) {
        throw new Error('Failed to fetch lists');
      }
      const lists = await response.json();
      set({ lists, isLoading: false });
    } catch (error: unknown) {
      console.error('Failed to fetch lists:', error);
      set({ error: 'Failed to fetch lists', isLoading: false });
    }
  },

  addList: async (list) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(list),
      });
      if (!response.ok) {
        throw new Error('Failed to add list');
      }
      const newList = await response.json();
      set((state) => ({
        lists: [...state.lists, newList],
        isLoading: false
      }));
    } catch (error: unknown) {
      console.error('Failed to add list:', error);
      set({ error: 'Failed to add list', isLoading: false });
    }
  },

  deleteList: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/lists/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete list');
      }
      set((state) => ({
        lists: state.lists.filter(list => list.id !== id),
        isLoading: false
      }));
    } catch (error: unknown) {
      console.error('Failed to delete list:', error);
      set({ error: 'Failed to delete list', isLoading: false });
    }
  },

  updateList: async (updatedList) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/lists/${updatedList.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          components: updatedList.components
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update list');
      }
      const list = await response.json();
      set((state) => ({
        lists: state.lists.map(l => l.id === list.id ? list : l),
        isLoading: false
      }));
    } catch (error: unknown) {
      console.error('Failed to update list:', error);
      set({ error: 'Failed to update list', isLoading: false });
    }
  }
})); 