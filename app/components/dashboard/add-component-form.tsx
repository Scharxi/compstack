'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CATEGORIES, 
  LOCATIONS, 
  OWNERSHIPS, 
  STATUS, 
  INDICATORS,
  CATEGORY_INDICATORS,
  generateComponentId,
  type HardwareComponent,
  type Category,
  type Location,
  type Ownership,
  type Status,
  type Indicator
} from "@/app/types/hardware";
import { useComponentsStore } from "@/app/store/components";

interface AddComponentFormProps {
  lastRunningNumber: number;
  initialData?: HardwareComponent;
  mode?: 'create' | 'edit';
  onClose?: () => void;
}

interface Specifications {
  [key: string]: string;
}

interface Option {
  label: string;
  value: string;
}

interface SpecField {
  label: string;
  key: string;
  hint?: string;
  example?: string;
  unit?: string;
  type?: 'text' | 'select' | 'multiselect';
  options?: Option[];
  required?: boolean;
}

const SPEC_FIELDS: Record<Indicator, SpecField[]> = {
  PC: [
    { 
      label: "CPU", 
      key: "CPU",
      hint: "Processor model and generation",
      example: "Intel Core i7-12700K",
      type: "text"
    },
    { 
      label: "RAM", 
      key: "RAM",
      hint: "RAM size",
      type: "select",
      options: [
        { label: "8 GB", value: "8 GB" },
        { label: "16 GB", value: "16 GB" },
        { label: "32 GB", value: "32 GB" },
        { label: "64 GB", value: "64 GB" },
      ]
    },
    { 
      label: "Primary Storage", 
      key: "primaryStorage",
      hint: "Main system storage",
      type: "select",
      options: [
        { label: "256 GB NVMe SSD", value: "256 GB NVMe" },
        { label: "512 GB NVMe SSD", value: "512 GB NVMe" },
        { label: "1 TB NVMe SSD", value: "1 TB NVMe" },
        { label: "2 TB NVMe SSD", value: "2 TB NVMe" },
        { label: "256 GB SATA SSD", value: "256 GB SATA" },
        { label: "512 GB SATA SSD", value: "512 GB SATA" },
        { label: "1 TB SATA SSD", value: "1 TB SATA" },
        { label: "1 TB HDD", value: "1 TB HDD" },
        { label: "2 TB HDD", value: "2 TB HDD" },
        { label: "4 TB HDD", value: "4 TB HDD" },
      ]
    },
    { 
      label: "Secondary Storage", 
      key: "secondaryStorage",
      hint: "Additional storage (optional)",
      type: "select",
      options: [
        { label: "None", value: "none" },
        { label: "256 GB NVMe SSD", value: "256 GB NVMe" },
        { label: "512 GB NVMe SSD", value: "512 GB NVMe" },
        { label: "1 TB NVMe SSD", value: "1 TB NVMe" },
        { label: "2 TB NVMe SSD", value: "2 TB NVMe" },
        { label: "256 GB SATA SSD", value: "256 GB SATA" },
        { label: "512 GB SATA SSD", value: "512 GB SATA" },
        { label: "1 TB SATA SSD", value: "1 TB SATA" },
        { label: "1 TB HDD", value: "1 TB HDD" },
        { label: "2 TB HDD", value: "2 TB HDD" },
        { label: "4 TB HDD", value: "4 TB HDD" },
      ]
    },
    { 
      label: "Operating System", 
      key: "OS",
      hint: "Operating system name and version",
      type: "select",
      options: [
        { label: "Windows 11 Pro", value: "Windows 11 Pro" },
        { label: "Windows 11 Home", value: "Windows 11 Home" },
        { label: "Windows 10 Pro", value: "Windows 10 Pro" },
        { label: "Windows 10 Home", value: "Windows 10 Home" },
        { label: "macOS Sonoma", value: "macOS Sonoma" },
        { label: "macOS Ventura", value: "macOS Ventura" },
        { label: "Ubuntu 22.04 LTS", value: "Ubuntu 22.04" },
        { label: "Ubuntu 20.04 LTS", value: "Ubuntu 20.04" },
      ]
    },
    { 
      label: "Interfaces", 
      key: "interfaces",
      hint: "Available ports (multiple selection)",
      type: "multiselect",
      options: [
        { label: "USB 3.0", value: "USB 3.0" },
        { label: "USB-C", value: "USB-C" },
        { label: "Thunderbolt", value: "Thunderbolt" },
        { label: "HDMI", value: "HDMI" },
        { label: "DisplayPort", value: "DisplayPort" },
        { label: "VGA", value: "VGA" },
        { label: "DVI", value: "DVI" },
        { label: "RJ45 (LAN)", value: "RJ45" },
        { label: "Audio Jack", value: "Audio" },
        { label: "SD Card Reader", value: "SD" },
      ]
    },
  ],
  LT: [
    { 
      label: "CPU", 
      key: "CPU",
      hint: "Processor model and generation",
      example: "Intel Core i5-1240P",
      type: "text"
    },
    { 
      label: "RAM", 
      key: "RAM",
      hint: "RAM size",
      type: "select",
      options: [
        { label: "8 GB", value: "8 GB" },
        { label: "16 GB", value: "16 GB" },
        { label: "32 GB", value: "32 GB" },
        { label: "64 GB", value: "64 GB" },
      ]
    },
    { 
      label: "Storage", 
      key: "storage",
      hint: "Main system storage",
      type: "select",
      options: [
        { label: "256 GB NVMe SSD", value: "256 GB NVMe" },
        { label: "512 GB NVMe SSD", value: "512 GB NVMe" },
        { label: "1 TB NVMe SSD", value: "1 TB NVMe" },
        { label: "2 TB NVMe SSD", value: "2 TB NVMe" },
      ]
    },
    { 
      label: "Display", 
      key: "display",
      hint: "Screen size and resolution",
      type: "select",
      options: [
        { label: "13.3 inch (1920x1080)", value: "13.3 inch FHD" },
        { label: "13.3 inch (2560x1600)", value: "13.3 inch 2.5K" },
        { label: "14 inch (1920x1080)", value: "14 inch FHD" },
        { label: "14 inch (2560x1600)", value: "14 inch 2.5K" },
        { label: "15.6 inch (1920x1080)", value: "15.6 inch FHD" },
        { label: "15.6 inch (2560x1600)", value: "15.6 inch 2.5K" },
        { label: "16 inch (1920x1200)", value: "16 inch FHD+" },
        { label: "16 inch (2560x1600)", value: "16 inch 2.5K" },
      ]
    },
    { 
      label: "Operating System", 
      key: "OS",
      hint: "Operating system name and version",
      type: "select",
      options: [
        { label: "Windows 11 Pro", value: "Windows 11 Pro" },
        { label: "Windows 11 Home", value: "Windows 11 Home" },
        { label: "Windows 10 Pro", value: "Windows 10 Pro" },
        { label: "Windows 10 Home", value: "Windows 10 Home" },
        { label: "macOS Sonoma", value: "macOS Sonoma" },
        { label: "macOS Ventura", value: "macOS Ventura" },
        { label: "Ubuntu 22.04 LTS", value: "Ubuntu 22.04" },
        { label: "Ubuntu 20.04 LTS", value: "Ubuntu 20.04" },
      ]
    },
    { 
      label: "Interfaces", 
      key: "interfaces",
      hint: "Available ports (multiple selection)",
      type: "multiselect",
      options: [
        { label: "USB 3.0", value: "USB 3.0" },
        { label: "USB-C", value: "USB-C" },
        { label: "Thunderbolt", value: "Thunderbolt" },
        { label: "HDMI", value: "HDMI" },
        { label: "DisplayPort", value: "DisplayPort" },
        { label: "VGA", value: "VGA" },
        { label: "RJ45 (LAN)", value: "RJ45" },
        { label: "Audio Jack", value: "Audio" },
        { label: "SD Card Reader", value: "SD" },
      ]
    },
  ],
  MON: [
    { 
      label: "Screen Size", 
      key: "size",
      hint: "Screen diagonal",
      type: "select",
      options: [
        { label: "24 inch", value: "24 inch" },
        { label: "27 inch", value: "27 inch" },
        { label: "32 inch", value: "32 inch" },
        { label: "34 inch", value: "34 inch" },
      ]
    },
    {
      label: "Resolution",
      key: "resolution",
      hint: "Screen resolution",
      type: "select",
      options: [
        { label: "1920x1080 (FHD)", value: "1920x1080" },
        { label: "2560x1440 (QHD)", value: "2560x1440" },
        { label: "3440x1440 (UWQHD)", value: "3440x1440" },
        { label: "3840x2160 (4K)", value: "3840x2160" },
      ]
    },
    {
      label: "Panel Type",
      key: "panel",
      hint: "Display technology",
      type: "select",
      options: [
        { label: "IPS", value: "IPS" },
        { label: "VA", value: "VA" },
        { label: "TN", value: "TN" },
        { label: "OLED", value: "OLED" },
      ]
    },
    { 
      label: "Interfaces", 
      key: "interfaces",
      hint: "Available ports (multiple selection)",
      type: "multiselect",
      options: [
        { label: "HDMI", value: "HDMI" },
        { label: "DisplayPort", value: "DisplayPort" },
        { label: "VGA", value: "VGA" },
        { label: "DVI", value: "DVI" },
        { label: "USB-C", value: "USB-C" },
        { label: "USB Hub", value: "USB Hub" },
      ]
    },
  ],
  GR: [
    { 
      label: "Chip", 
      key: "chip",
      hint: "Graphics chip model",
      type: "select",
      options: [
        { label: "NVIDIA RTX 4090", value: "RTX 4090" },
        { label: "NVIDIA RTX 4080", value: "RTX 4080" },
        { label: "NVIDIA RTX 4070 Ti", value: "RTX 4070 Ti" },
        { label: "NVIDIA RTX 4070", value: "RTX 4070" },
        { label: "NVIDIA RTX 4060 Ti", value: "RTX 4060 Ti" },
        { label: "NVIDIA RTX 4060", value: "RTX 4060" },
        { label: "AMD RX 7900 XTX", value: "RX 7900 XTX" },
        { label: "AMD RX 7900 XT", value: "RX 7900 XT" },
        { label: "AMD RX 7800 XT", value: "RX 7800 XT" },
        { label: "AMD RX 7700 XT", value: "RX 7700 XT" },
      ]
    },
    {
      label: "Memory",
      key: "memory",
      hint: "Graphics memory",
      type: "select",
      options: [
        { label: "8 GB GDDR6", value: "8 GB GDDR6" },
        { label: "12 GB GDDR6X", value: "12 GB GDDR6X" },
        { label: "16 GB GDDR6", value: "16 GB GDDR6" },
        { label: "24 GB GDDR6X", value: "24 GB GDDR6X" },
      ]
    },
    { 
      label: "Interfaces", 
      key: "interfaces",
      hint: "Available ports (multiple selection)",
      type: "multiselect",
      options: [
        { label: "HDMI 2.1", value: "HDMI 2.1" },
        { label: "DisplayPort 1.4", value: "DP 1.4" },
        { label: "DisplayPort 2.1", value: "DP 2.1" },
      ]
    },
  ],
  CPU: [
    { 
      label: "Model", 
      key: "model",
      hint: "Complete model name",
      type: "select",
      options: [
        { label: "Intel Core i9-13900K", value: "i9-13900K" },
        { label: "Intel Core i7-13700K", value: "i7-13700K" },
        { label: "Intel Core i5-13600K", value: "i5-13600K" },
        { label: "AMD Ryzen 9 7950X", value: "Ryzen 9 7950X" },
        { label: "AMD Ryzen 7 7700X", value: "Ryzen 7 7700X" },
        { label: "AMD Ryzen 5 7600X", value: "Ryzen 5 7600X" },
      ]
    },
    {
      label: "Socket",
      key: "socket",
      hint: "CPU socket",
      type: "select",
      options: [
        { label: "Intel LGA 1700", value: "LGA 1700" },
        { label: "AMD AM5", value: "AM5" },
        { label: "AMD AM4", value: "AM4" },
      ]
    },
  ],
  RAM: [
    { 
      label: "Type", 
      key: "type",
      hint: "RAM technology and generation",
      type: "select",
      options: [
        { label: "DDR5-6000", value: "DDR5-6000" },
        { label: "DDR5-5600", value: "DDR5-5600" },
        { label: "DDR4-3600", value: "DDR4-3600" },
        { label: "DDR4-3200", value: "DDR4-3200" },
      ]
    },
    {
      label: "Capacity",
      key: "capacity",
      hint: "Memory capacity per module",
      type: "select",
      options: [
        { label: "8 GB", value: "8 GB" },
        { label: "16 GB", value: "16 GB" },
        { label: "32 GB", value: "32 GB" },
      ]
    },
  ],
  SSD: [
    { 
      label: "Type", 
      key: "type",
      hint: "SSD technology",
      type: "select",
      options: [
        { label: "NVMe PCIe 4.0", value: "NVMe PCIe 4.0" },
        { label: "NVMe PCIe 3.0", value: "NVMe PCIe 3.0" },
        { label: "SATA III", value: "SATA III" },
      ]
    },
    { 
      label: "Capacity", 
      key: "capacity",
      hint: "Storage capacity",
      type: "select",
      options: [
        { label: "256 GB", value: "256 GB" },
        { label: "512 GB", value: "512 GB" },
        { label: "1 TB", value: "1 TB" },
        { label: "2 TB", value: "2 TB" },
        { label: "4 TB", value: "4 TB" },
      ]
    },
    { 
      label: "Interface", 
      key: "interface",
      hint: "Physical connection",
      type: "select",
      options: [
        { label: "M.2", value: "M.2" },
        { label: "SATA", value: "SATA" },
      ]
    },
  ],
  HDD: [
    { 
      label: "Capacity", 
      key: "capacity",
      hint: "Storage capacity",
      type: "select",
      options: [
        { label: "1 TB", value: "1 TB" },
        { label: "2 TB", value: "2 TB" },
        { label: "4 TB", value: "4 TB" },
        { label: "8 TB", value: "8 TB" },
        { label: "16 TB", value: "16 TB" },
      ]
    },
    {
      label: "RPM",
      key: "rpm",
      hint: "Revolutions per minute",
      type: "select",
      options: [
        { label: "5400 RPM", value: "5400 RPM" },
        { label: "7200 RPM", value: "7200 RPM" },
      ]
    },
    { 
      label: "Interface", 
      key: "interface",
      hint: "Physical connection",
      type: "select",
      options: [
        { label: "SATA III", value: "SATA III" },
      ]
    },
  ],
  SW: [
    { 
      label: "Hersteller", 
      key: "manufacturer",
      hint: "Hersteller des Switches",
      type: "text",
      required: true
    },
    { 
      label: "Modell", 
      key: "model",
      hint: "Modellbezeichnung",
      type: "text",
      required: true
    },
    { 
      label: "Typ", 
      key: "type",
      hint: "Management-Level des Switches",
      type: "select",
      options: [
        { label: "Unmanaged", value: "Unmanaged" },
        { label: "Smart", value: "Smart" },
        { label: "Managed Layer 2", value: "Managed Layer 2" },
        { label: "Managed Layer 3", value: "Managed Layer 3" }
      ],
      required: true
    },
    { 
      label: "Ports", 
      key: "ports",
      hint: "Anzahl der Ports",
      type: "select",
      options: [
        { label: "8 Ports", value: "8 Ports" },
        { label: "12 Ports", value: "12 Ports" },
        { label: "16 Ports", value: "16 Ports" },
        { label: "24 Ports", value: "24 Ports" },
        { label: "48 Ports", value: "48 Ports" }
      ],
      required: true
    },
    { 
      label: "Geschwindigkeit", 
      key: "speed",
      hint: "Port-Geschwindigkeit",
      type: "select",
      options: [
        { label: "10/100 Mbps", value: "10/100 Mbps" },
        { label: "10/100/1000 Mbps", value: "10/100/1000 Mbps" },
        { label: "2.5 Gbps", value: "2.5 Gbps" },
        { label: "5 Gbps", value: "5 Gbps" },
        { label: "10 Gbps", value: "10 Gbps" }
      ],
      required: true
    },
    { 
      label: "Management-IP", 
      key: "management",
      hint: "IP-Adresse für Management-Zugriff",
      type: "text"
    },
    { 
      label: "Features", 
      key: "features",
      hint: "Unterstützte Features",
      type: "multiselect",
      options: [
        { label: "Basic", value: "Basic" },
        { label: "VLAN", value: "VLAN" },
        { label: "PoE", value: "PoE" },
        { label: "PoE+", value: "PoE+" },
        { label: "SFP", value: "SFP" },
        { label: "SFP+", value: "SFP+" }
      ],
      required: true
    }
  ],
  RT: [
    { 
      label: "Hersteller", 
      key: "manufacturer",
      hint: "Hersteller des Routers",
      type: "text",
      required: true
    },
    { 
      label: "Modell", 
      key: "model",
      hint: "Modellbezeichnung",
      type: "text",
      required: true
    },
    { 
      label: "Typ", 
      key: "type",
      hint: "Einsatzbereich des Routers",
      type: "select",
      options: [
        { label: "SOHO", value: "SOHO" },
        { label: "SMB", value: "SMB" },
        { label: "Enterprise", value: "Enterprise" },
        { label: "ISP-Grade", value: "ISP-Grade" }
      ],
      required: true
    },
    { 
      label: "LAN-Ports", 
      key: "ports",
      hint: "Anzahl der LAN-Ports",
      type: "select",
      options: [
        { label: "1 Port", value: "1 Port" },
        { label: "4 Ports", value: "4 Ports" },
        { label: "8 Ports", value: "8 Ports" },
        { label: "12 Ports", value: "12 Ports" }
      ],
      required: true
    },
    { 
      label: "WAN-Ports", 
      key: "wanPorts",
      hint: "Anzahl der WAN-Ports",
      type: "select",
      options: [
        { label: "1 Port", value: "1 Port" },
        { label: "2 Ports", value: "2 Ports" },
        { label: "4 Ports", value: "4 Ports" }
      ],
      required: true
    },
    { 
      label: "WLAN", 
      key: "wifi",
      hint: "WLAN-Standard",
      type: "select",
      options: [
        { label: "Nein", value: "Nein" },
        { label: "WiFi 5", value: "WiFi 5" },
        { label: "WiFi 6", value: "WiFi 6" },
        { label: "WiFi 6E", value: "WiFi 6E" }
      ],
      required: true
    },
    { 
      label: "Features", 
      key: "features",
      hint: "Unterstützte Features",
      type: "multiselect",
      options: [
        { label: "Basic", value: "Basic" },
        { label: "VPN", value: "VPN" },
        { label: "Firewall", value: "Firewall" },
        { label: "QoS", value: "QoS" },
        { label: "Advanced Security", value: "Advanced Security" }
      ],
      required: true
    },
    { 
      label: "Management-IP", 
      key: "management",
      hint: "IP-Adresse für Management-Zugriff",
      type: "text"
    }
  ],
  AP: [
    { 
      label: "Hersteller", 
      key: "manufacturer",
      hint: "Hersteller des Access Points",
      type: "text",
      required: true
    },
    { 
      label: "Modell", 
      key: "model",
      hint: "Modellbezeichnung",
      type: "text",
      required: true
    },
    { 
      label: "Typ", 
      key: "type",
      hint: "Einsatzbereich des Access Points",
      type: "select",
      options: [
        { label: "Indoor", value: "Indoor" },
        { label: "Outdoor", value: "Outdoor" },
        { label: "Industrial", value: "Industrial" }
      ],
      required: true
    },
    { 
      label: "WLAN-Standard", 
      key: "wifiStandard",
      hint: "Unterstützter WLAN-Standard",
      type: "select",
      options: [
        { label: "WiFi 5", value: "WiFi 5" },
        { label: "WiFi 6", value: "WiFi 6" },
        { label: "WiFi 6E", value: "WiFi 6E" }
      ],
      required: true
    },
    { 
      label: "Frequenzbänder", 
      key: "bands",
      hint: "Unterstützte Frequenzbänder",
      type: "select",
      options: [
        { label: "2.4 GHz", value: "2.4 GHz" },
        { label: "5 GHz", value: "5 GHz" },
        { label: "2.4 + 5 GHz", value: "2.4 + 5 GHz" },
        { label: "2.4 + 5 + 6 GHz", value: "2.4 + 5 + 6 GHz" }
      ],
      required: true
    },
    { 
      label: "Stromversorgung", 
      key: "powerSupply",
      hint: "Art der Stromversorgung",
      type: "select",
      options: [
        { label: "Netzteil", value: "Netzteil" },
        { label: "PoE", value: "PoE" },
        { label: "PoE+", value: "PoE+" }
      ],
      required: true
    },
    { 
      label: "Features", 
      key: "features",
      hint: "Unterstützte Features",
      type: "multiselect",
      options: [
        { label: "Basic", value: "Basic" },
        { label: "MIMO", value: "MIMO" },
        { label: "MU-MIMO", value: "MU-MIMO" },
        { label: "Mesh", value: "Mesh" }
      ],
      required: true
    },
    { 
      label: "Management-IP", 
      key: "management",
      hint: "IP-Adresse für Management-Zugriff",
      type: "text"
    }
  ],
  NIC: [
    { 
      label: "Hersteller", 
      key: "manufacturer",
      hint: "Hersteller der Netzwerkkarte",
      type: "text",
      required: true
    },
    { 
      label: "Modell", 
      key: "model",
      hint: "Modellbezeichnung",
      type: "text",
      required: true
    },
    { 
      label: "Typ", 
      key: "type",
      hint: "Anschlusstyp der Netzwerkkarte",
      type: "select",
      options: [
        { label: "PCIe", value: "PCIe" },
        { label: "USB", value: "USB" },
        { label: "M.2", value: "M.2" }
      ],
      required: true
    },
    { 
      label: "Geschwindigkeit", 
      key: "speed",
      hint: "Maximale Übertragungsgeschwindigkeit",
      type: "select",
      options: [
        { label: "100 Mbps", value: "100 Mbps" },
        { label: "1 Gbps", value: "1 Gbps" },
        { label: "2.5 Gbps", value: "2.5 Gbps" },
        { label: "5 Gbps", value: "5 Gbps" },
        { label: "10 Gbps", value: "10 Gbps" }
      ],
      required: true
    },
    { 
      label: "Features", 
      key: "features",
      hint: "Unterstützte Features",
      type: "multiselect",
      options: [
        { label: "Basic", value: "Basic" },
        { label: "Wake-on-LAN", value: "Wake-on-LAN" },
        { label: "SR-IOV", value: "SR-IOV" },
        { label: "iSCSI Boot", value: "iSCSI Boot" }
      ],
      required: true
    },
    { 
      label: "Anzahl Ports", 
      key: "ports",
      hint: "Anzahl der Netzwerkanschlüsse",
      type: "select",
      options: [
        { label: "1 Port", value: "1 Port" },
        { label: "2 Ports", value: "2 Ports" },
        { label: "4 Ports", value: "4 Ports" }
      ],
      required: true
    }
  ],
  SR: [
    { 
      label: "Hersteller", 
      key: "manufacturer",
      hint: "Hersteller des Servers",
      type: "text",
      required: true
    },
    { 
      label: "Modell", 
      key: "model",
      hint: "Modellbezeichnung",
      type: "text",
      required: true
    },
    { 
      label: "CPU", 
      key: "cpu",
      hint: "Prozessor(en)",
      type: "select",
      options: [
        { label: "Intel Xeon Silver 4310", value: "Xeon Silver 4310" },
        { label: "Intel Xeon Gold 6330", value: "Xeon Gold 6330" },
        { label: "Intel Xeon Platinum 8358", value: "Xeon Platinum 8358" },
        { label: "AMD EPYC 7443", value: "EPYC 7443" },
        { label: "AMD EPYC 7543", value: "EPYC 7543" },
        { label: "AMD EPYC 7643", value: "EPYC 7643" }
      ],
      required: true
    },
    { 
      label: "CPU Anzahl", 
      key: "cpuCount",
      hint: "Anzahl der installierten Prozessoren",
      type: "select",
      options: [
        { label: "1 CPU", value: "1" },
        { label: "2 CPUs", value: "2" },
        { label: "4 CPUs", value: "4" }
      ],
      required: true
    },
    { 
      label: "RAM", 
      key: "ram",
      hint: "Arbeitsspeicher",
      type: "select",
      options: [
        { label: "32 GB", value: "32 GB" },
        { label: "64 GB", value: "64 GB" },
        { label: "128 GB", value: "128 GB" },
        { label: "256 GB", value: "256 GB" },
        { label: "512 GB", value: "512 GB" },
        { label: "1 TB", value: "1 TB" }
      ],
      required: true
    },
    { 
      label: "RAM Typ", 
      key: "ramType",
      hint: "Speichertyp und Geschwindigkeit",
      type: "select",
      options: [
        { label: "DDR4-3200 ECC", value: "DDR4-3200 ECC" },
        { label: "DDR4-2933 ECC", value: "DDR4-2933 ECC" },
        { label: "DDR5-4800 ECC", value: "DDR5-4800 ECC" },
        { label: "DDR5-5600 ECC", value: "DDR5-5600 ECC" }
      ],
      required: true
    },
    { 
      label: "Primärspeicher", 
      key: "primaryStorage",
      hint: "Hauptspeicher-Konfiguration",
      type: "select",
      options: [
        { label: "2x 480GB SSD RAID1", value: "2x 480GB SSD RAID1" },
        { label: "2x 960GB SSD RAID1", value: "2x 960GB SSD RAID1" },
        { label: "2x 1.92TB SSD RAID1", value: "2x 1.92TB SSD RAID1" },
        { label: "4x 480GB SSD RAID10", value: "4x 480GB SSD RAID10" },
        { label: "4x 960GB SSD RAID10", value: "4x 960GB SSD RAID10" },
        { label: "4x 1.92TB SSD RAID10", value: "4x 1.92TB SSD RAID10" }
      ],
      required: true
    },
    { 
      label: "Sekundärspeicher", 
      key: "secondaryStorage",
      hint: "Zusätzliche Speicher-Konfiguration",
      type: "select",
      options: [
        { label: "Keine", value: "none" },
        { label: "4x 2TB HDD RAID5", value: "4x 2TB HDD RAID5" },
        { label: "4x 4TB HDD RAID5", value: "4x 4TB HDD RAID5" },
        { label: "6x 2TB HDD RAID6", value: "6x 2TB HDD RAID6" },
        { label: "6x 4TB HDD RAID6", value: "6x 4TB HDD RAID6" },
        { label: "8x 2TB HDD RAID6", value: "8x 2TB HDD RAID6" },
        { label: "8x 4TB HDD RAID6", value: "8x 4TB HDD RAID6" }
      ]
    },
    { 
      label: "RAID Controller", 
      key: "raidController",
      hint: "RAID Controller Modell",
      type: "select",
      options: [
        { label: "Onboard RAID", value: "Onboard RAID" },
        { label: "LSI MegaRAID 9460-16i", value: "LSI MegaRAID 9460-16i" },
        { label: "Broadcom MegaRAID 9560-8i", value: "Broadcom MegaRAID 9560-8i" },
        { label: "HPE Smart Array P408i-a", value: "HPE Smart Array P408i-a" }
      ],
      required: true
    },
    { 
      label: "Netzwerk", 
      key: "network",
      hint: "Netzwerkschnittstellen",
      type: "select",
      options: [
        { label: "2x 1GbE", value: "2x 1GbE" },
        { label: "4x 1GbE", value: "4x 1GbE" },
        { label: "2x 10GbE", value: "2x 10GbE" },
        { label: "4x 10GbE", value: "4x 10GbE" },
        { label: "2x 25GbE", value: "2x 25GbE" }
      ],
      required: true
    },
    { 
      label: "Betriebssystem", 
      key: "os",
      hint: "Installiertes Betriebssystem",
      type: "select",
      options: [
        { label: "Windows Server 2022 Standard", value: "Windows Server 2022 Standard" },
        { label: "Windows Server 2022 Datacenter", value: "Windows Server 2022 Datacenter" },
        { label: "VMware ESXi 8.0", value: "VMware ESXi 8.0" },
        { label: "VMware ESXi 7.0", value: "VMware ESXi 7.0" },
        { label: "Proxmox VE 8", value: "Proxmox VE 8" },
        { label: "Ubuntu Server 22.04 LTS", value: "Ubuntu Server 22.04 LTS" },
        { label: "Red Hat Enterprise Linux 9", value: "RHEL 9" }
      ],
      required: true
    },
    { 
      label: "Formfaktor", 
      key: "formFactor",
      hint: "Gehäusetyp",
      type: "select",
      options: [
        { label: "1U Rack", value: "1U" },
        { label: "2U Rack", value: "2U" },
        { label: "4U Rack", value: "4U" },
        { label: "Tower", value: "Tower" }
      ],
      required: true
    },
    { 
      label: "Remote Management", 
      key: "remoteManagement",
      hint: "Remote Management Interface",
      type: "text",
      required: true
    }
  ],
  PK: [
    { 
      label: "Kategorie", 
      key: "category",
      hint: "Kabelkategorie",
      type: "select",
      options: [
        { label: "CAT 5e", value: "CAT 5e" },
        { label: "CAT 6", value: "CAT 6" },
        { label: "CAT 6a", value: "CAT 6a" },
        { label: "CAT 7", value: "CAT 7" },
        { label: "CAT 8", value: "CAT 8" }
      ],
      required: true
    },
    { 
      label: "Länge", 
      key: "length",
      hint: "Kabellänge in Metern",
      type: "select",
      options: [
        { label: "0.5m", value: "0.5m" },
        { label: "1m", value: "1m" },
        { label: "2m", value: "2m" },
        { label: "3m", value: "3m" },
        { label: "5m", value: "5m" },
        { label: "7m", value: "7m" },
        { label: "10m", value: "10m" },
        { label: "15m", value: "15m" },
        { label: "20m", value: "20m" },
        { label: "30m", value: "30m" }
      ],
      required: true
    },
    { 
      label: "Farbe", 
      key: "color",
      hint: "Kabelfarbe",
      type: "select",
      options: [
        { label: "Grau", value: "Grau" },
        { label: "Schwarz", value: "Schwarz" },
        { label: "Blau", value: "Blau" },
        { label: "Rot", value: "Rot" },
        { label: "Gelb", value: "Gelb" },
        { label: "Grün", value: "Grün" },
        { label: "Orange", value: "Orange" },
        { label: "Weiß", value: "Weiß" }
      ],
      required: true
    },
    { 
      label: "Steckertyp A", 
      key: "connectorA",
      hint: "Steckertyp Ende A",
      type: "select",
      options: [
        { label: "RJ45", value: "RJ45" },
        { label: "SFP", value: "SFP" },
        { label: "SFP+", value: "SFP+" },
        { label: "LC", value: "LC" },
        { label: "SC", value: "SC" }
      ],
      required: true
    },
    { 
      label: "Steckertyp B", 
      key: "connectorB",
      hint: "Steckertyp Ende B",
      type: "select",
      options: [
        { label: "RJ45", value: "RJ45" },
        { label: "SFP", value: "SFP" },
        { label: "SFP+", value: "SFP+" },
        { label: "LC", value: "LC" },
        { label: "SC", value: "SC" }
      ],
      required: true
    },
    { 
      label: "Schirmung", 
      key: "shielding",
      hint: "Kabelschirmung",
      type: "select",
      options: [
        { label: "U/UTP (Ungeschirmt)", value: "U/UTP" },
        { label: "F/UTP (Foliengeschirmt)", value: "F/UTP" },
        { label: "SF/UTP (Geflecht- und Foliengeschirmt)", value: "SF/UTP" },
        { label: "S/FTP (Geflecht- und Paarfoliengeschirmt)", value: "S/FTP" }
      ],
      required: true
    },
    { 
      label: "Hersteller", 
      key: "manufacturer",
      hint: "Kabelhersteller",
      type: "text",
      required: true
    },
  ],
};

interface MultiSelectCheckboxesProps {
  options: Option[];
  selectedValues: string[];
  onValuesChange: (values: string[]) => void;
  label: string;
}

const MultiSelectCheckboxes = ({ 
  options, 
  selectedValues, 
  onValuesChange, 
  label 
}: MultiSelectCheckboxesProps) => {
  const handleCheckboxChange = (checked: boolean | "indeterminate", itemValue: string) => {
    if (checked === true) {
      onValuesChange([...selectedValues, itemValue]);
    } else if (checked === false) {
      onValuesChange(selectedValues.filter(v => v !== itemValue));
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {options.map((option: Option) => (
          <div key={option.value} className="flex items-center gap-2 hover:text-foreground transition-colors">
            <Checkbox
              id={option.value}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={(checked) => handleCheckboxChange(checked, option.value)}
              className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <label
              htmlFor={option.value}
              className="text-sm text-muted-foreground hover:text-foreground cursor-pointer select-none"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export function AddComponentForm({ lastRunningNumber, initialData, mode = 'create', onClose }: AddComponentFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialData?.name || "");
  const [category, setCategory] = useState<Category>(initialData?.category || "IT");
  const [location, setLocation] = useState<Location>(initialData?.location || "ZIT");
  const [ownership, setOwnership] = useState<Ownership>(initialData?.ownership || "ZIT");
  const [status, setStatus] = useState<Status>(initialData?.status || "AK");
  const [indicator, setIndicator] = useState<Indicator>(initialData?.indicator || "PC");
  const [serialNumber, setSerialNumber] = useState(initialData?.serialNumber || "");
  const [specifications, setSpecifications] = useState<Specifications>(initialData?.specifications || {});
  const [selectedInterfaces, setSelectedInterfaces] = useState<Record<string, string[]>>(() => {
    if (initialData?.specifications?.interfaces) {
      return { interfaces: initialData.specifications.interfaces.split(", ") };
    }
    return { interfaces: [] };
  });

  const addComponent = useComponentsStore((state) => state.addComponent);
  const updateComponent = useComponentsStore((state) => state.updateComponent);

  // Filtered indicators based on selected category
  const availableIndicators = CATEGORY_INDICATORS[category] as Indicator[];

  // Update indicator when category changes
  useEffect(() => {
    if (!availableIndicators.includes(indicator)) {
      setIndicator(availableIndicators[0] as Indicator);
      setSpecifications({});
    }
  }, [category, availableIndicators, indicator]);

  const handleSpecificationChange = (key: string, value: string) => {
    setSpecifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleMultiSelectChange = (key: string, values: string[]) => {
    setSelectedInterfaces(prev => ({
      ...prev,
      [key]: values
    }));
    setSpecifications(prev => ({
      ...prev,
      [key]: values.join(", ")
    }));
  };

  const handleSubmit = () => {
    const runningNumber = initialData?.runningNumber || String(lastRunningNumber + 1).padStart(3, '0');
    
    const componentData: HardwareComponent = {
      id: initialData?.id || generateComponentId(category, location, ownership, status, indicator, runningNumber),
      name,
      category,
      location,
      ownership,
      status,
      indicator,
      runningNumber,
      serialNumber,
      specifications: Object.fromEntries(
        Object.entries(specifications).filter(([, value]) => value !== "" && value !== "none")
      )
    };

    if (mode === 'edit' && initialData) {
      updateComponent(componentData);
    } else {
      addComponent(componentData);
    }

    setOpen(false);
    resetForm();
    onClose?.();
  };

  const resetForm = () => {
    setName("");
    setCategory("IT");
    setLocation("ZIT");
    setOwnership("ZIT");
    setStatus("AK");
    setIndicator("PC");
    setSerialNumber("");
    setSpecifications({});
    setSelectedInterfaces({});
  };

  const renderSpecificationFields = () => {
    const fields = SPEC_FIELDS[indicator];
    if (!fields) return null;

    return (
      <div className="border rounded-lg p-6 bg-muted/30">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Specifications for {INDICATORS[indicator]}</h3>
              <span className="text-sm text-muted-foreground">(Optional)</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter the technical details for {INDICATORS[indicator]}. All fields are optional.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {fields.map(({ label, key, hint, example, unit, type, options, required }) => (
              <div key={key} 
                className={`space-y-2 bg-background rounded-lg p-4 shadow-sm border ${
                  type === 'multiselect' ? 'sm:col-span-2' : ''
                }`}
              >
                <div className="space-y-1">
                  <label htmlFor={key} className="text-sm font-medium flex items-center gap-2">
                    {label}
                    {unit && <span className="text-xs text-muted-foreground">({unit})</span>}
                  </label>
                  {hint && (
                    <p className="text-xs text-muted-foreground">{hint}</p>
                  )}
                </div>
                {type === 'multiselect' && options ? (
                  <MultiSelectCheckboxes
                    options={options}
                    selectedValues={selectedInterfaces[key] || []}
                    onValuesChange={(values) => handleMultiSelectChange(key, values)}
                    label={label}
                  />
                ) : type === 'select' && options ? (
                  <Select
                    value={specifications[key] || ""}
                    onValueChange={(value) => handleSpecificationChange(key, value)}
                  >
                    <SelectTrigger className="bg-white/50">
                      <SelectValue placeholder={`${label} select...`} />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={key}
                    value={specifications[key] || ""}
                    onChange={(e) => handleSpecificationChange(key, e.target.value)}
                    placeholder={example || `${label} enter...`}
                    className="bg-white/50"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={mode === 'edit' ? true : open} onOpenChange={(value) => {
      setOpen(value);
      if (!value) onClose?.();
    }}>
      <DialogTrigger asChild>
        {mode === 'create' ? (
          <Button>Add Component</Button>
        ) : null}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add New Component' : 'Edit Component'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <label htmlFor="name">Name</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ThinkPad X1 Carbon"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="category">Category</label>
              <Select value={category} onValueChange={(value: Category) => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORIES).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="indicator">Type</label>
              <Select value={indicator} onValueChange={(value: Indicator) => {
                setIndicator(value);
                setSpecifications({});
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableIndicators.map((key) => (
                    <SelectItem key={key} value={key as Indicator}>{INDICATORS[key as Indicator]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="location">Location</label>
              <Select value={location} onValueChange={(value: Location) => setLocation(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LOCATIONS).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="ownership">Ownership</label>
              <Select value={ownership} onValueChange={(value: Ownership) => setOwnership(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(OWNERSHIPS).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="status">Status</label>
              <Select value={status} onValueChange={(value: Status) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="serialNumber">Serial Number</label>
              <Input
                id="serialNumber"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="e.g. XYZ123"
              />
            </div>
          </div>

          {renderSpecificationFields()}

          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setOpen(false);
                resetForm();
                onClose?.();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!name || !serialNumber}>
              {mode === 'create' ? 'Add' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 