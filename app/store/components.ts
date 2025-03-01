import { create } from 'zustand';
import { HardwareComponent } from '@/app/types/hardware';
import { fetchComponents, createComponent, updateComponent as updateComponentApi, deleteComponent as deleteComponentApi } from '@/app/services/api';

interface ComponentsState {
  components: HardwareComponent[];
  isLoading: boolean;
  error: string | null;
  fetchComponents: () => Promise<void>;
  setComponents: (components: HardwareComponent[]) => void;
  addComponent: (component: Omit<HardwareComponent, 'id'>) => Promise<void>;
  updateComponent: (component: HardwareComponent) => Promise<void>;
  deleteComponent: (id: string) => Promise<void>;
}

export const useComponentsStore = create<ComponentsState>((set) => ({
  components: [],
  isLoading: false,
  error: null,
  fetchComponents: async () => {
    set({ isLoading: true, error: null });
    try {
      const components = await fetchComponents();
      set({ components, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch components', isLoading: false });
    }
  },
  setComponents: (components) => set({ components }),
  addComponent: async (newComponent) => {
    set({ isLoading: true, error: null });
    try {
      const component = await createComponent(newComponent);
      set((state) => ({
        components: [...state.components, component],
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to add component', isLoading: false });
    }
  },
  updateComponent: async (updatedComponent) => {
    set({ isLoading: true, error: null });
    try {
      const component = await updateComponentApi(updatedComponent);
      set((state) => ({
        components: state.components.map((c) =>
          c.id === component.id ? {
            ...component,
            maintenanceHistory: component.maintenanceHistory || []
          } : c
        ),
        isLoading: false,
        error: null
      }));
    } catch (error) {
      console.error('Failed to update component:', error);
      set({ error: 'Failed to update component', isLoading: false });
      throw error; // Re-throw the error to handle it in the component
    }
  },
  deleteComponent: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteComponentApi(id);
      set((state) => ({
        components: state.components.filter((c) => c.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete component', isLoading: false });
    }
  },
})); 