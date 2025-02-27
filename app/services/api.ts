import { HardwareComponent } from '@/app/types/hardware';

export async function fetchComponents(): Promise<HardwareComponent[]> {
  const response = await fetch('/api/components');
  if (!response.ok) {
    throw new Error('Failed to fetch components');
  }
  return response.json();
}

export async function fetchComponent(id: string): Promise<HardwareComponent> {
  const response = await fetch(`/api/components/${id}`);
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

export async function updateComponent(component: HardwareComponent): Promise<HardwareComponent> {
  const response = await fetch(`/api/components/${component.id}`, {
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