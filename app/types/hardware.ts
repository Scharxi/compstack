export interface HardwareComponent {
  id: string;
  name: string;
  category: keyof typeof CATEGORIES;
  location: keyof typeof LOCATIONS;
  ownership: keyof typeof OWNERSHIPS;
  status: keyof typeof STATUS;
  indicator: keyof typeof INDICATORS;
  serialNumber: string;
  runningNumber: string;
  purchaseDate: Date;
  lastMaintenanceDate?: Date;
  assignedTo?: string;
  specifications: Record<string, string>;
}

export interface DashboardStats {
  totalComponents: number;
  availableComponents: number;
  inUseComponents: number;
  maintenanceRequired: number;
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type: 'assignment' | 'maintenance' | 'addition' | 'retirement';
  componentId: string;
  componentName: string;
  date: Date;
  user: string;
  details: string;
}

export const CATEGORIES = {
  IT: 'IT-Gerät',
  WZG: 'Werkzeug',
  MS: 'Maschinen',
  K: 'Komponenten',
} as const;

export const LOCATIONS = {
  ZIT: 'ZIT',
  VIMI_RZ: 'ViMi-RZ',
  SCHULUNGSZENTRUM: 'Schulungszentrum',
} as const;

export const OWNERSHIPS = {
  LIE: 'LIESKE',
  ZIT: 'ZIT',
  SZ: 'Schulungszentrum',
} as const;

export const STATUS = {
  D: 'Defekt',
  A: 'Anschauungsmaterial',
  F: 'Funktional',
} as const;

export const INDICATORS = {
  LT: 'Laptop',
  PC: 'PC',
  MON: 'Monitor',
  SW: 'Switch',
  RT: 'Router',
  SER: 'Server',
} as const;

// Helper function to generate component ID
export function generateComponentId(
  category: keyof typeof CATEGORIES,
  location: keyof typeof LOCATIONS,
  ownership: keyof typeof OWNERSHIPS,
  status: keyof typeof STATUS,
  indicator: keyof typeof INDICATORS,
  runningNumber: string
): string {
  return `${category}-${location}-${ownership}/${status}${indicator}/${runningNumber}`;
} 