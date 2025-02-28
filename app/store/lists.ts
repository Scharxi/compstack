import { create } from 'zustand';
import { List } from '@/app/types/lists';

interface ListsState {
  lists: List[];
  isLoading: boolean;
  error: string | null;
  fetchLists: () => Promise<void>;
  addList: (list: List) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
}

export const useListsStore = create<ListsState>((set, get) => ({
  lists: [],
  isLoading: false,
  error: null,

  fetchLists: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call
      const storedLists = localStorage.getItem('lists');
      const lists = storedLists ? JSON.parse(storedLists) : [];
      set({ lists, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch lists', isLoading: false });
    }
  },

  addList: async (list: List) => {
    set({ isLoading: true, error: null });
    try {
      const { lists } = get();
      const updatedLists = [...lists, list];
      // TODO: Replace with actual API call
      localStorage.setItem('lists', JSON.stringify(updatedLists));
      set({ lists: updatedLists, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to add list', isLoading: false });
    }
  },

  deleteList: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { lists } = get();
      const updatedLists = lists.filter(list => list.id !== id);
      // TODO: Replace with actual API call
      localStorage.setItem('lists', JSON.stringify(updatedLists));
      set({ lists: updatedLists, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to delete list', isLoading: false });
    }
  }
})); 