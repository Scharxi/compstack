export const CATEGORIES = {
  IT: "IT-Equipment",
  WZG: "Werkzeug",
  MS: "Messmittel",
  K: "Kommunikation"
} as const;

export const LOCATIONS = {
  ZIT: "ZIT",
  LSK: "Lieske",
  SZ: "Schulungszentrum"
} as const;

export const OWNERSHIPS = {
  ZIT: "ZIT",
  LSK: "Lieske",
  SZ: "Schulungszentrum"
} as const;

export const STATUS = {
  AK: "Aktiv",
  IN: "Inaktiv",
  WA: "Wartung",
  DE: "Defekt"
} as const;

export const INDICATORS = {
  PC: "Computer",
  LT: "Laptop",
  MON: "Monitor",
  GR: "Grafikkarte",
  CPU: "Prozessor",
  RAM: "Arbeitsspeicher",
  SSD: "SSD-Festplatte",
  HDD: "HDD-Festplatte"
} as const;

export type Category = keyof typeof CATEGORIES;
export type Location = keyof typeof LOCATIONS;
export type Ownership = keyof typeof OWNERSHIPS;
export type Status = keyof typeof STATUS;
export type Indicator = keyof typeof INDICATORS;

export interface HardwareComponent {
  id: string;
  name: string;
  category: Category;
  location: Location;
  ownership: Ownership;
  status: Status;
  indicator: Indicator;
  runningNumber: string;
  serialNumber: string;
  purchaseDate: Date;
  lastMaintenanceDate?: Date;
  assignedTo?: string;
  specifications: Record<string, string>;
  maintenanceHistory?: MaintenanceProtocol[];
}

export function generateComponentId(
  category: Category,
  location: Location,
  ownership: Ownership,
  status: Status,
  indicator: Indicator,
  runningNumber: string
): string {
  return `${category}-${location}-${ownership}/${status}${indicator}/${runningNumber}`;
}

export interface DashboardStats {
  totalComponents: number;
  availableComponents: number;
  inUseComponents: number;
  maintenanceRequired: number;
  recentActivities: {
    id: string;
    type: 'added' | 'updated' | 'removed';
    component: HardwareComponent;
    timestamp: Date;
  }[];
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

export interface MaintenanceTask {
  id: string;
  label: string;
  description: string;
}

export interface MaintenanceProtocol {
  date: Date;
  completedTasks: string[];
  notes?: string;
}

export const MAINTENANCE_TASKS: MaintenanceTask[] = [
  {
    id: "visual",
    label: "Sichtprüfung",
    description: "Überprüfung auf äußere Schäden und Verschmutzungen"
  },
  {
    id: "cleaning",
    label: "Reinigung",
    description: "Gründliche Reinigung aller zugänglichen Komponenten"
  },
  {
    id: "updates",
    label: "Software Updates",
    description: "Installation verfügbarer System- und Treiber-Updates"
  },
  {
    id: "performance",
    label: "Leistungstest",
    description: "Überprüfung der System- und Komponentenleistung"
  },
  {
    id: "security",
    label: "Sicherheitsprüfung",
    description: "Überprüfung der Sicherheitseinstellungen und Antivirensoftware"
  }
]; 