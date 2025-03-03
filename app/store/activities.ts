'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Activity } from '@/app/types/hardware';

interface ActivitiesState {
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
  
  // Aktionen
  fetchActivities: () => Promise<void>;
  logActivity: (activity: Omit<Activity, 'id' | 'date'>) => Promise<void>;
  clearActivities: () => void;
}

export const useActivitiesStore = create<ActivitiesState>()(
  persist(
    (set, get) => ({
      activities: [],
      isLoading: false,
      error: null,

      fetchActivities: async () => {
        set({ isLoading: true, error: null });
        try {
          // In einer echten Anwendung würde hier ein API-Aufruf stehen
          // Für diese Demo verwenden wir die gespeicherten Daten aus dem persistierten Zustand
          const { activities } = get();
          set({ activities, isLoading: false });
        } catch (error) {
          set({ error: 'Fehler beim Laden der Aktivitäten', isLoading: false });
          console.error('Fehler beim Laden der Aktivitäten:', error);
        }
      },

      logActivity: async (activityData) => {
        set({ isLoading: true, error: null });
        try {
          const newActivity: Activity = {
            id: uuidv4(),
            date: new Date(),
            ...activityData
          };

          const { activities } = get();
          set({ 
            activities: [newActivity, ...activities].slice(0, 100), // Begrenze auf die letzten 100 Aktivitäten
            isLoading: false 
          });
          
          return Promise.resolve();
        } catch (error) {
          set({ error: 'Fehler beim Protokollieren der Aktivität', isLoading: false });
          console.error('Fehler beim Protokollieren der Aktivität:', error);
          return Promise.reject(error);
        }
      },

      clearActivities: () => {
        set({ activities: [] });
      }
    }),
    {
      name: 'activities-storage',
    }
  )
); 