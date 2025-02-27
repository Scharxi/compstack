import { create } from 'zustand';
import { type HardwareComponent } from '@/app/types/hardware';

interface ComponentsState {
  components: HardwareComponent[];
  setComponents: (components: HardwareComponent[]) => void;
  updateComponent: (updatedComponent: HardwareComponent) => void;
  addComponent: (newComponent: HardwareComponent) => void;
}

// Initial mock data
const initialComponents: HardwareComponent[] = [
  {
    id: "IT-HH-FI/AKLT/001",
    name: "ThinkPad X1 Carbon",
    category: "IT",
    location: "HH",
    ownership: "FI",
    status: "AK",
    indicator: "LT",
    runningNumber: "001",
    serialNumber: "PF2MXCZ",
    purchaseDate: new Date("2024-01-15"),
    specifications: {
      CPU: "Intel i7-1165G7",
      RAM: "16GB",
      Storage: "512GB SSD",
      Display: "14 Zoll, 1920x1080",
      OS: "Windows 11 Pro"
    }
  }
];

export const useComponentsStore = create<ComponentsState>((set) => ({
  components: initialComponents,
  setComponents: (components) => set({ components }),
  updateComponent: (updatedComponent) => 
    set((state) => ({
      components: state.components.map((component) =>
        component.id === updatedComponent.id ? updatedComponent : component
      ),
    })),
  addComponent: (newComponent) =>
    set((state) => ({
      components: [...state.components, newComponent],
    })),
})); 