export type Category = "IT" | "WZ" | "MB" | "SO";

export const CATEGORIES: Record<Category, string> = {
  IT: "IT-Equipment",
  WZ: "Werkzeug",
  MB: "Mobile Geräte",
  SO: "Sonstiges"
};

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
  DE: "Defekt"
} as const;

export type Indicator = "PC" | "LT" | "TB" | "SR" | "PR" | "MO" | // IT
                       "GPU" | "RAM" | "SSD" | "HDD" | // IT Components
                       "SW" | "RT" | "AP" | "NIC" | // Network Components
                       "MM" | "LK" | "NT" | "EW" | "OZ" | // Werkzeug (Multimeter, Lötkolben, Netzwerktester, Elektrowerkzeug, Oszilloskop)
                       "ST" | "HD" | // Mobile
                       "SO"; // Sonstiges

export const INDICATORS: Record<Indicator, string> = {
  // IT-Equipment
  PC: "Desktop Computer",
  LT: "Laptop",
  TB: "Tablet",
  SR: "Server",
  PR: "Drucker",
  MO: "Monitor",
  // IT-Komponenten
  GPU: "Grafikkarte",
  RAM: "Arbeitsspeicher",
  SSD: "SSD-Festplatte",
  HDD: "HDD-Festplatte",
  // Netzwerk-Komponenten
  SW: "Switch",
  RT: "Router",
  AP: "Access Point",
  NIC: "Netzwerkkarte",
  // Werkzeug
  MM: "Multimeter",
  LK: "Lötkolben",
  NT: "Netzwerktester",
  EW: "Elektrowerkzeug",
  OZ: "Oszilloskop",
  // Mobile Geräte
  ST: "Smartphone",
  HD: "Headset",
  // Sonstiges
  SO: "Sonstiges"
};

export type Location = keyof typeof LOCATIONS;
export type Ownership = keyof typeof OWNERSHIPS;
export type Status = keyof typeof STATUS;

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

// Mapping von Kategorien zu erlaubten Indikatoren
export const CATEGORY_INDICATORS: Record<Category, string[]> = {
  IT: ["PC", "LT", "TB", "SR", "PR", "MO", "GPU", "RAM", "SSD", "HDD", "SW", "RT", "AP", "NIC"],
  WZ: ["MM", "LK", "NT", "EW", "OZ"],
  MB: ["TB", "ST", "HD"],
  SO: ["SO"]
};

// Spezifikationen pro Kategorie und Indikator
export interface SpecificationField {
  label: string;
  type: "text" | "select";
  options?: string[];
  required?: boolean;
}

export type SpecificationFields = Record<string, SpecificationField>;

export const SPECIFICATIONS_CONFIG: Record<Category, Record<string, SpecificationFields>> = {
  IT: {
    PC: {
      CPU: { label: "Prozessor", type: "text", required: true },
      RAM: { label: "Arbeitsspeicher", type: "text", required: true },
      primaryStorage: { label: "Primärspeicher", type: "text", required: true },
      secondaryStorage: { label: "Sekundärspeicher", type: "text" },
      OS: { label: "Betriebssystem", type: "text", required: true }
    },
    LT: {
      CPU: { label: "Prozessor", type: "text", required: true },
      RAM: { label: "Arbeitsspeicher", type: "text", required: true },
      Storage: { label: "Speicher", type: "text", required: true },
      Display: { label: "Display", type: "text", required: true },
      OS: { label: "Betriebssystem", type: "text", required: true }
    },
    TB: {
      chip: { label: "Chip", type: "text", required: true },
      memory: { label: "Speicher", type: "text", required: true },
      display: { label: "Display", type: "text", required: true },
      OS: { label: "Betriebssystem", type: "text", required: true }
    },
    SR: {
      CPU: { label: "Prozessor", type: "text", required: true },
      RAM: { label: "Arbeitsspeicher", type: "text", required: true },
      Storage: { label: "Speicher", type: "text", required: true },
      OS: { label: "Betriebssystem", type: "text", required: true }
    },
    PR: {
      type: { label: "Druckertyp", type: "select", options: ["Laser", "Tintenstrahl", "3D"], required: true },
      resolution: { label: "Auflösung", type: "text" },
      interfaces: { label: "Schnittstellen", type: "text" }
    },
    MO: {
      size: { label: "Bildschirmgröße", type: "text", required: true },
      resolution: { label: "Auflösung", type: "text", required: true },
      panel: { label: "Panel-Typ", type: "text" }
    },
    GPU: {
      manufacturer: { label: "Hersteller", type: "text", required: true },
      model: { label: "Modell", type: "text", required: true },
      memory: { 
        label: "Speicher", 
        type: "select", 
        options: ["4 GB", "6 GB", "8 GB", "12 GB", "16 GB", "24 GB"],
        required: true 
      },
      interface: { 
        label: "Schnittstelle", 
        type: "select", 
        options: ["PCIe 3.0", "PCIe 4.0", "PCIe 5.0"],
        required: true 
      },
      ports: { 
        label: "Anschlüsse", 
        type: "text",
        required: true 
      }
    },
    RAM: {
      manufacturer: { label: "Hersteller", type: "text", required: true },
      type: { 
        label: "Typ", 
        type: "select", 
        options: ["DDR4", "DDR5"],
        required: true 
      },
      capacity: { 
        label: "Kapazität", 
        type: "select", 
        options: ["4 GB", "8 GB", "16 GB", "32 GB", "64 GB"],
        required: true 
      },
      speed: { 
        label: "Geschwindigkeit", 
        type: "select", 
        options: ["2666 MHz", "3000 MHz", "3200 MHz", "3600 MHz", "4000 MHz", "4800 MHz", "5200 MHz", "5600 MHz", "6000 MHz"],
        required: true 
      }
    },
    SSD: {
      manufacturer: { label: "Hersteller", type: "text", required: true },
      model: { label: "Modell", type: "text", required: true },
      capacity: { 
        label: "Kapazität", 
        type: "select", 
        options: ["128 GB", "256 GB", "512 GB", "1 TB", "2 TB", "4 TB"],
        required: true 
      },
      type: { 
        label: "Typ", 
        type: "select", 
        options: ["SATA", "NVMe PCIe 3.0", "NVMe PCIe 4.0"],
        required: true 
      },
      formFactor: { 
        label: "Formfaktor", 
        type: "select", 
        options: ["2.5\"", "M.2"],
        required: true 
      }
    },
    HDD: {
      manufacturer: { label: "Hersteller", type: "text", required: true },
      model: { label: "Modell", type: "text", required: true },
      capacity: { 
        label: "Kapazität", 
        type: "select", 
        options: ["500 GB", "1 TB", "2 TB", "4 TB", "6 TB", "8 TB", "10 TB", "12 TB", "14 TB", "16 TB", "18 TB", "20 TB"],
        required: true 
      },
      formFactor: { 
        label: "Formfaktor", 
        type: "select", 
        options: ["2.5\"", "3.5\""],
        required: true 
      },
      rpm: { 
        label: "Drehzahl", 
        type: "select", 
        options: ["5400 RPM", "7200 RPM"],
        required: true 
      }
    },
    SW: {
      manufacturer: { label: "Hersteller", type: "text", required: true },
      model: { label: "Modell", type: "text", required: true },
      type: { 
        label: "Typ", 
        type: "select", 
        options: ["Unmanaged", "Smart", "Managed Layer 2", "Managed Layer 3"],
        required: true 
      },
      ports: { 
        label: "Ports", 
        type: "select", 
        options: ["8 Ports", "12 Ports", "16 Ports", "24 Ports", "48 Ports"],
        required: true 
      },
      speed: { 
        label: "Geschwindigkeit", 
        type: "select", 
        options: ["10/100 Mbps", "10/100/1000 Mbps", "2.5 Gbps", "5 Gbps", "10 Gbps"],
        required: true 
      },
      features: { 
        label: "Features", 
        type: "select", 
        options: ["Basic", "VLAN", "PoE", "PoE+", "SFP", "SFP+"],
        required: true 
      },
      management: { label: "Management-IP", type: "text" }
    },
    RT: {
      manufacturer: { label: "Hersteller", type: "text", required: true },
      model: { label: "Modell", type: "text", required: true },
      type: { 
        label: "Typ", 
        type: "select", 
        options: ["SOHO", "SMB", "Enterprise", "ISP-Grade"],
        required: true 
      },
      ports: { 
        label: "LAN-Ports", 
        type: "select", 
        options: ["1 Port", "4 Ports", "8 Ports", "12 Ports"],
        required: true 
      },
      wanPorts: { 
        label: "WAN-Ports", 
        type: "select", 
        options: ["1 Port", "2 Ports", "4 Ports"],
        required: true 
      },
      wifi: { 
        label: "WLAN", 
        type: "select", 
        options: ["Nein", "WiFi 5", "WiFi 6", "WiFi 6E"],
        required: true 
      },
      features: { 
        label: "Features", 
        type: "select", 
        options: ["Basic", "VPN", "Firewall", "QoS", "Advanced Security"],
        required: true 
      },
      management: { label: "Management-IP", type: "text" }
    },
    AP: {
      manufacturer: { label: "Hersteller", type: "text", required: true },
      model: { label: "Modell", type: "text", required: true },
      type: { 
        label: "Typ", 
        type: "select", 
        options: ["Indoor", "Outdoor", "Industrial"],
        required: true 
      },
      wifiStandard: { 
        label: "WLAN-Standard", 
        type: "select", 
        options: ["WiFi 5", "WiFi 6", "WiFi 6E"],
        required: true 
      },
      bands: { 
        label: "Frequenzbänder", 
        type: "select", 
        options: ["2.4 GHz", "5 GHz", "2.4 + 5 GHz", "2.4 + 5 + 6 GHz"],
        required: true 
      },
      powerSupply: { 
        label: "Stromversorgung", 
        type: "select", 
        options: ["Netzteil", "PoE", "PoE+"],
        required: true 
      },
      features: { 
        label: "Features", 
        type: "select", 
        options: ["Basic", "MIMO", "MU-MIMO", "Mesh"],
        required: true 
      },
      management: { label: "Management-IP", type: "text" }
    },
    NIC: {
      manufacturer: { label: "Hersteller", type: "text", required: true },
      model: { label: "Modell", type: "text", required: true },
      type: { 
        label: "Typ", 
        type: "select", 
        options: ["PCIe", "USB", "M.2"],
        required: true 
      },
      speed: { 
        label: "Geschwindigkeit", 
        type: "select", 
        options: ["100 Mbps", "1 Gbps", "2.5 Gbps", "5 Gbps", "10 Gbps"],
        required: true 
      },
      features: { 
        label: "Features", 
        type: "select", 
        options: ["Basic", "Wake-on-LAN", "SR-IOV", "iSCSI Boot"],
        required: true 
      },
      ports: { 
        label: "Anzahl Ports", 
        type: "select", 
        options: ["1 Port", "2 Ports", "4 Ports"],
        required: true 
      }
    }
  },
  WZ: {
    MM: {
      type: { 
        label: "Gerätetyp", 
        type: "select", 
        options: ["Digital", "Analog", "True RMS"], 
        required: true 
      },
      manufacturer: { label: "Hersteller", type: "text", required: true },
      model: { label: "Modell", type: "text", required: true },
      measuringRange: { 
        label: "Messbereich", 
        type: "select", 
        options: ["Basis", "Erweitert", "Professional"], 
        required: true 
      },
      accuracy: { label: "Genauigkeit", type: "text", required: true },
      calibrationDate: { label: "Letzte Kalibrierung", type: "text" }
    },
    LK: {
      type: { 
        label: "Typ", 
        type: "select", 
        options: ["Temperaturgeregelt", "Einfach"], 
        required: true 
      },
      power: { label: "Leistung (Watt)", type: "text", required: true },
      temperature: { label: "Temperaturbereich", type: "text" },
      tips: { label: "Verfügbare Spitzen", type: "text" }
    },
    NT: {
      type: { 
        label: "Gerätetyp", 
        type: "select", 
        options: ["Kabeltester", "Netzwerkanalysator", "PoE-Tester"], 
        required: true 
      },
      features: { 
        label: "Funktionen", 
        type: "select", 
        options: ["Basis (Durchgang)", "Erweitert (Länge/Fehlerort)", "Professional (Zertifizierung)"], 
        required: true 
      },
      supportedStandards: { label: "Unterstützte Standards", type: "text", required: true },
      maxSpeed: { label: "Max. Testgeschwindigkeit", type: "text" }
    },
    EW: {
      type: { 
        label: "Gerätetyp", 
        type: "select", 
        options: ["Schraubendreher", "Crimpzange", "Abisolierzange", "Seitenschneider"], 
        required: true 
      },
      manufacturer: { label: "Hersteller", type: "text", required: true },
      model: { label: "Modell", type: "text", required: true },
      features: { label: "Besondere Merkmale", type: "text" }
    },
    OZ: {
      type: { 
        label: "Gerätetyp", 
        type: "select", 
        options: ["Digital", "Mixed-Signal", "Handheld"], 
        required: true 
      },
      bandwidth: { label: "Bandbreite", type: "text", required: true },
      channels: { label: "Anzahl Kanäle", type: "text", required: true },
      sampleRate: { label: "Abtastrate", type: "text", required: true },
      features: { label: "Besondere Funktionen", type: "text" }
    }
  },
  MB: {
    TB: {
      model: { label: "Modell", type: "text", required: true },
      storage: { label: "Speicher", type: "text", required: true },
      display: { label: "Display", type: "text", required: true }
    },
    ST: {
      model: { label: "Modell", type: "text", required: true },
      storage: { label: "Speicher", type: "text", required: true },
      display: { label: "Display", type: "text", required: true }
    },
    HD: {
      type: { label: "Typ", type: "text", required: true },
      connection: { label: "Anschluss", type: "text", required: true }
    }
  },
  SO: {
    SO: {
      type: { label: "Typ", type: "text", required: true },
      description: { label: "Beschreibung", type: "text", required: true }
    }
  }
}; 
