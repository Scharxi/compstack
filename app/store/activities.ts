'use client';

import { create } from 'zustand';
import { Activity } from '@/app/types/hardware';
import { fetchActivities, createActivity } from '@/app/services/activities';

interface ActivitiesState {
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
  
  // Aktionen
  fetchActivities: () => Promise<void>;
  logActivity: (activity: Omit<Activity, 'id' | 'date'>) => Promise<void>;
  clearActivities: () => void;
}

export const useActivitiesStore = create<ActivitiesState>()((set) => ({
  activities: [],
  isLoading: false,
  error: null,

  fetchActivities: async () => {
    set({ isLoading: true, error: null });
    try {
      const activities = await fetchActivities();
      set({ activities, isLoading: false });
    } catch (error) {
      set({ error: 'Fehler beim Laden der Aktivitäten', isLoading: false });
      console.error('Fehler beim Laden der Aktivitäten:', error);
    }
  },

  logActivity: async (activityData) => {
    set({ isLoading: true, error: null });
    try {
      const newActivity = await createActivity(activityData);
      
      set((state) => ({ 
        activities: [newActivity, ...state.activities],
        isLoading: false 
      }));
      
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
})); 