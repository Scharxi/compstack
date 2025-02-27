import { HardwareComponent } from '@/app/types/hardware';

export async function fetchComponents(): Promise<HardwareComponent[]> {
  const response = await fetch('/api/components');
  if (!response.ok) {
    throw new Error('Failed to fetch components');
  }
  return response.json();
}

export async function fetchComponent(id: string): Promise<HardwareComponent> {
  const encodedId = encodeURIComponent(id);
  const response = await fetch(`/api/components/${encodedId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch component');
  }
  return response.json();
}

export async function createComponent(component: Omit<HardwareComponent, 'id'>): Promise<HardwareComponent> {
  const response = await fetch('/api/components', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(component),
  });
  if (!response.ok) {
    throw new Error('Failed to create component');
  }
  return response.json();
}

export async function updateComponent(component: HardwareComponent & { newMaintenanceProtocol?: { date: Date; completedTasks: string[]; notes?: string } }): Promise<HardwareComponent> {
  const encodedId = encodeURIComponent(component.id);
  const response = await fetch(`/api/components/${encodedId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(component),
  });
  if (!response.ok) {
    throw new Error('Failed to update component');
  }
  return response.json();
}

export async function deleteComponent(id: string): Promise<void> {
  const response = await fetch(`/api/components/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete component');
  }
} 