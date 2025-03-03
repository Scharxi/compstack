import { Activity } from '@/app/types/hardware';

export async function fetchActivities(): Promise<Activity[]> {
  const response = await fetch('/api/activities');
  if (!response.ok) {
    throw new Error('Failed to fetch activities');
  }
  return response.json();
}

export async function createActivity(activity: Omit<Activity, 'id' | 'date'>): Promise<Activity> {
  const response = await fetch('/api/activities', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(activity),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create activity');
  }
  
  return response.json();
} 