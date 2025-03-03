export type Category = "IT" | "WZ" | "MB" | "SO" | "NW";

export const CATEGORIES: Record<Category, string> = {
  IT: "IT-Equipment",
  WZ: "Werkzeug",
  MB: "Mobile Geräte",
  SO: "Sonstiges",
  NW: "Netzwerk-Komponenten"
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

export type Indicator = 
  | "PC"  // Desktop Computer
  | "LT"  // Laptop
  | "MON" // Monitor
  | "GPU" // Graphics Card
  | "CPU" // Processor
  | "RAM" // Memory
  | "SSD" // SSD Storage
  | "HDD" // HDD Storage
  | "SW"  // Network Switch
  | "RT"  // Router
  | "AP"  // Access Point
  | "NIC" // Network Card
  | "SR"  // Server
  | "PK"  // Patch Cable
  | "VR"  // VR Headset
  | "ST"  // Smartphone
  | "HD"  // Headset
  | "SO"  // Sonstiges
  | "MM"  // Multimeter
  | "LK"  // Lötkolben
  | "NT"  // Netzwerktester
  | "EW"  // Elektrowerkzeug
  | "OZ"; // Oszilloskop

export const INDICATORS: Record<Indicator, string> = {
  PC: "Desktop Computer",
  LT: "Laptop",
  MON: "Monitor",
  GPU: "Grafikkarte",
  CPU: "Prozessor",
  RAM: "Arbeitsspeicher",
  SSD: "SSD-Speicher",
  HDD: "HDD-Speicher",
  SW: "Switch",
  RT: "Router",
  AP: "Access Point",
  NIC: "Netzwerkkarte",
  PK: "Patchkabel",
  SR: "Server",
  VR: "VR-Headset",
  ST: "Smartphone",
  HD: "Headset",
  SO: "Sonstiges",
  MM: "Multimeter",
  LK: "Lötkolben",
  NT: "Netzwerktester",
  EW: "Elektrowerkzeug",
  OZ: "Oszilloskop"
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
export const CATEGORY_INDICATORS: Record<Category, Indicator[]> = {
  IT: ["PC", "LT", "MON", "GPU", "CPU", "RAM", "SSD", "HDD", "VR"],
  NW: ["SW", "RT", "AP", "NIC", "PK", "SR"],
  WZ: ["MM", "LK", "NT", "EW", "OZ"],
  MB: ["ST", "HD"],
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
    VR: {
      manufacturer: { label: "Hersteller", type: "text", required: true },
      model: { label: "Modell", type: "text", required: true },
      type: { 
        label: "Typ", 
        type: "select", 
        options: ["Standalone", "Tethered", "Smartphone-basiert"],
        required: true 
      },
      displayResolution: { 
        label: "Display-Auflösung", 
        type: "select",
        options: ["1832 x 1920", "2160 x 2160", "2880 x 1600", "3664 x 1920"],
        required: true 
      },
      refreshRate: { 
        label: "Bildwiederholrate", 
        type: "select",
        options: ["60 Hz", "72 Hz", "90 Hz", "120 Hz", "144 Hz"],
        required: true 
      },
      fieldOfView: { 
        label: "Sichtfeld", 
        type: "select",
        options: ["90°", "100°", "110°", "120°"],
        required: true 
      },
      tracking: { 
        label: "Tracking", 
        type: "select",
        options: ["3DoF", "6DoF Inside-Out", "6DoF Outside-In"],
        required: true 
      },
      controllers: { 
        label: "Controller", 
        type: "select",
        options: ["Touch Controller", "Knuckles", "Wands", "Hand-Tracking"],
        required: true 
      },
      connectivity: { 
        label: "Konnektivität", 
        type: "select",
        options: ["USB-C", "DisplayPort", "HDMI", "Wireless"],
        required: true 
      },
      storage: { 
        label: "Speicher", 
        type: "select",
        options: ["64 GB", "128 GB", "256 GB", "512 GB"],
        required: true 
      },
      accessories: { 
        label: "Zubehör", 
        type: "text"
      }
    },
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
    },
    PK: {
      category: { 
        label: "Kategorie", 
        type: "select", 
        options: ["CAT 5e", "CAT 6", "CAT 6a", "CAT 7", "CAT 8"],
        required: true 
      },
      length: { 
        label: "Länge", 
        type: "select", 
        options: ["0.5m", "1m", "2m", "3m", "5m", "7m", "10m", "15m", "20m", "30m"],
        required: true 
      },
      color: { 
        label: "Farbe", 
        type: "select", 
        options: ["Grau", "Schwarz", "Blau", "Rot", "Gelb", "Grün", "Orange", "Weiß"],
        required: true 
      },
      connectorA: { 
        label: "Steckertyp A", 
        type: "select", 
        options: ["RJ45", "SFP", "SFP+", "LC", "SC"],
        required: true 
      },
      connectorB: { 
        label: "Steckertyp B", 
        type: "select", 
        options: ["RJ45", "SFP", "SFP+", "LC", "SC"],
        required: true 
      },
      shielding: { 
        label: "Schirmung", 
        type: "select", 
        options: ["U/UTP", "F/UTP", "SF/UTP", "S/FTP"],
        required: true 
      },
      manufacturer: { label: "Hersteller", type: "text", required: true },
      locationA: { label: "Standort A", type: "text", required: true },
      locationB: { label: "Standort B", type: "text", required: true }
    }
  },
  WZ: {
    MM: {
      manufacturer: { label: "Hersteller", type: "text", required: true },
      model: { label: "Modell", type: "text", required: true },
      displayType: { label: "Display-Typ", type: "select", options: ["Analog", "Digital", "Digital mit Hintergrundbeleuchtung"], required: true },
      accuracy: { label: "Genauigkeit", type: "text", required: true },
      functions: { label: "Funktionen", type: "text", required: true }
    },
    LK: {
      manufacturer: { label: "Hersteller", type: "text", required: true },
      model: { label: "Modell", type: "text", required: true },
      power: { label: "Leistung", type: "text", required: true },
      temperatureRange: { label: "Temperaturbereich", type: "text", required: true },
      tips: { label: "Spitzen", type: "text", required: false }
    },
    NT: {
      manufacturer: { label: "Hersteller", type: "text", required: true },
      model: { label: "Modell", type: "text", required: true },
      cableTypes: { label: "Kabeltypen", type: "text", required: true },
      features: { label: "Funktionen", type: "text", required: true }
    },
    EW: {
      manufacturer: { label: "Hersteller", type: "text", required: true },
      model: { label: "Modell", type: "text", required: true },
      type: { label: "Typ", type: "text", required: true },
      power: { label: "Leistung", type: "text", required: false },
      accessories: { label: "Zubehör", type: "text", required: false }
    },
    OZ: {
      manufacturer: { label: "Hersteller", type: "text", required: true },
      model: { label: "Modell", type: "text", required: true },
      bandwidth: { label: "Bandbreite", type: "text", required: true },
      channels: { label: "Kanäle", type: "select", options: ["1", "2", "4", "8"], required: true },
      sampleRate: { label: "Abtastrate", type: "text", required: true }
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
  },
  NW: {
    SW: {
      manufacturer: { label: "Hersteller", type: "text", required: true },
      model: { label: "Modell", type: "text", required: true },
      ports: { label: "Anzahl Ports", type: "text", required: true },
      manageable: { label: "Managebar", type: "select", options: ["Ja", "Nein"], required: true },
      poe: { label: "PoE-Unterstützung", type: "select", options: ["Keine", "PoE", "PoE+", "PoE++"], required: true },
      speed: { label: "Geschwindigkeit", type: "select", options: ["10/100 Mbps", "1 Gbps", "2.5 Gbps", "5 Gbps", "10 Gbps"], required: true }
    },
    RT: {
      manufacturer: { label: "Hersteller", type: "text", required: true },
      model: { label: "Modell", type: "text", required: true },
      lanPorts: { label: "LAN-Ports", type: "text", required: true },
      wanPorts: { label: "WAN-Ports", type: "text", required: true },
      wifi: { label: "WLAN", type: "select", options: ["Nein", "WiFi 5", "WiFi 6", "WiFi 6E"], required: true },
      features: { label: "Features", type: "text", required: false }
    },
    AP: {
      manufacturer: { label: "Hersteller", type: "text", required: true },
      model: { label: "Modell", type: "text", required: true },
      wifiStandard: { label: "WLAN-Standard", type: "select", options: ["WiFi 5", "WiFi 6", "WiFi 6E"], required: true },
      poe: { label: "PoE-Unterstützung", type: "select", options: ["Ja", "Nein"], required: true },
      features: { label: "Features", type: "text", required: false }
    },
    NIC: {
      manufacturer: { label: "Hersteller", type: "text", required: true },
      model: { label: "Modell", type: "text", required: true },
      interface: { label: "Schnittstelle", type: "select", options: ["PCIe", "USB", "M.2"], required: true },
      speed: { label: "Geschwindigkeit", type: "select", options: ["100 Mbps", "1 Gbps", "2.5 Gbps", "5 Gbps", "10 Gbps"], required: true },
      ports: { label: "Anzahl Ports", type: "text", required: true }
    },
    PK: {
      type: { label: "Typ", type: "select", options: ["Cat5e", "Cat6", "Cat6a", "Cat7", "Cat8", "Glasfaser"], required: true },
      length: { label: "Länge", type: "text", required: true },
      color: { label: "Farbe", type: "text", required: false }
    }
  }
}; 
