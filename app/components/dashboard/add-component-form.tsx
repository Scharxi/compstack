'use client';

import { useState } from "react";
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
import { 
  CATEGORIES, 
  LOCATIONS, 
  OWNERSHIPS, 
  STATUS, 
  INDICATORS,
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
}

interface Specifications {
  [key: string]: string;
}

interface SpecField {
  label: string;
  key: string;
  hint?: string;
  example?: string;
  unit?: string;
  type?: 'text' | 'select';
  options?: Array<{
    label: string;
    value: string;
  }>;
}

const COMMON_VALUES = {
  ramSizes: [
    { label: "4 GB", value: "4" },
    { label: "8 GB", value: "8" },
    { label: "16 GB", value: "16" },
    { label: "32 GB", value: "32" },
    { label: "64 GB", value: "64" },
  ],
  storageTypes: [
    { label: "NVMe SSD", value: "nvme" },
    { label: "SATA SSD", value: "ssd" },
    { label: "HDD", value: "hdd" },
  ],
  storageSizes: [
    { label: "256 GB", value: "256" },
    { label: "512 GB", value: "512" },
    { label: "1 TB", value: "1000" },
    { label: "2 TB", value: "2000" },
    { label: "4 TB", value: "4000" },
  ],
  displaySizes: [
    { label: "13 Zoll", value: "13" },
    { label: "14 Zoll", value: "14" },
    { label: "15.6 Zoll", value: "15.6" },
    { label: "16 Zoll", value: "16" },
    { label: "17 Zoll", value: "17" },
  ],
  monitorSizes: [
    { label: "24 Zoll", value: "24" },
    { label: "27 Zoll", value: "27" },
    { label: "32 Zoll", value: "32" },
    { label: "34 Zoll", value: "34" },
  ],
  resolutions: [
    { label: "1920x1080 (Full HD)", value: "1920x1080" },
    { label: "2560x1440 (QHD)", value: "2560x1440" },
    { label: "3440x1440 (UWQHD)", value: "3440x1440" },
    { label: "3840x2160 (4K)", value: "3840x2160" },
  ],
  panelTypes: [
    { label: "IPS", value: "IPS" },
    { label: "VA", value: "VA" },
    { label: "TN", value: "TN" },
    { label: "OLED", value: "OLED" },
  ],
  formFactors: [
    { label: "2.5 Zoll", value: "2.5 Zoll" },
    { label: "3.5 Zoll", value: "3.5 Zoll" },
    { label: "M.2 2280", value: "M.2 2280" },
    { label: "M.2 2242", value: "M.2 2242" },
  ],
  interfaces: [
    { label: "SATA III", value: "SATA III" },
    { label: "PCIe 3.0 x4", value: "PCIe 3.0 x4" },
    { label: "PCIe 4.0 x4", value: "PCIe 4.0 x4" },
    { label: "PCIe 5.0 x4", value: "PCIe 5.0 x4" },
  ],
  operatingSystems: [
    { label: "Windows 11 Pro", value: "Windows 11 Pro" },
    { label: "Windows 11 Home", value: "Windows 11 Home" },
    { label: "Windows 10 Pro", value: "Windows 10 Pro" },
    { label: "Windows 10 Home", value: "Windows 10 Home" },
    { label: "macOS", value: "macOS" },
    { label: "Linux", value: "Linux" },
  ],
  storage: [
    { label: "256 GB NVMe SSD", value: "256GB NVMe" },
    { label: "512 GB NVMe SSD", value: "512GB NVMe" },
    { label: "1 TB NVMe SSD", value: "1TB NVMe" },
    { label: "2 TB NVMe SSD", value: "2TB NVMe" },
    { label: "256 GB SATA SSD", value: "256GB SATA" },
    { label: "512 GB SATA SSD", value: "512GB SATA" },
    { label: "1 TB SATA SSD", value: "1TB SATA" },
    { label: "1 TB HDD", value: "1TB HDD" },
    { label: "2 TB HDD", value: "2TB HDD" },
    { label: "4 TB HDD", value: "4TB HDD" },
  ],
};

const SPEC_FIELDS: { [key in Indicator]?: Array<SpecField> } = {
  PC: [
    { 
      label: "CPU", 
      key: "cpu",
      hint: "Prozessor-Modell und Generation",
      example: "Intel Core i7-12700K",
      type: "text"
    },
    { 
      label: "RAM", 
      key: "ram",
      hint: "Arbeitsspeicher-Größe",
      unit: "GB",
      type: "select",
      options: COMMON_VALUES.ramSizes
    },
    { 
      label: "Primärer Speicher", 
      key: "storage",
      hint: "Hauptspeicher des Systems",
      type: "select",
      options: COMMON_VALUES.storage
    },
    { 
      label: "Zusatzspeicher", 
      key: "additionalStorage",
      hint: "Optionaler zusätzlicher Speicher",
      type: "select",
      options: [
        { label: "Kein Zusatzspeicher", value: "none" },
        ...COMMON_VALUES.storage
      ]
    },
    { 
      label: "Betriebssystem", 
      key: "os",
      hint: "Name und Version des Betriebssystems",
      type: "select",
      options: COMMON_VALUES.operatingSystems
    },
    { 
      label: "Grafikkarte", 
      key: "gpu",
      hint: "Modell der Grafikkarte",
      example: "NVIDIA RTX 3060",
      type: "text"
    },
  ],
  LT: [
    { 
      label: "CPU", 
      key: "cpu",
      hint: "Prozessor-Modell und Generation",
      example: "Intel Core i5-1240P",
      type: "text"
    },
    { 
      label: "RAM", 
      key: "ram",
      hint: "Arbeitsspeicher-Größe",
      unit: "GB",
      type: "select",
      options: COMMON_VALUES.ramSizes
    },
    { 
      label: "Speicher", 
      key: "storage",
      hint: "Hauptspeicher des Systems",
      type: "select",
      options: COMMON_VALUES.storage.filter(s => !s.value.includes("HDD"))
    },
    { 
      label: "Display", 
      key: "display",
      hint: "Displaygröße",
      type: "select",
      options: COMMON_VALUES.displaySizes
    },
    { 
      label: "Betriebssystem", 
      key: "os",
      hint: "Name und Version des Betriebssystems",
      type: "select",
      options: COMMON_VALUES.operatingSystems
    },
    { 
      label: "Grafik", 
      key: "gpu",
      hint: "Grafikeinheit",
      example: "Intel Iris Xe",
      type: "text"
    },
  ],
  MON: [
    { 
      label: "Bildschirmgröße", 
      key: "size",
      hint: "Diagonale des Bildschirms",
      unit: "Zoll",
      type: "select",
      options: COMMON_VALUES.monitorSizes
    },
    { 
      label: "Auflösung", 
      key: "resolution",
      hint: "Horizontale x Vertikale Pixel",
      type: "select",
      options: COMMON_VALUES.resolutions
    },
    { 
      label: "Panel-Typ", 
      key: "panelType",
      hint: "Technologie des Displays",
      type: "select",
      options: COMMON_VALUES.panelTypes
    },
    { 
      label: "Anschlüsse", 
      key: "ports",
      hint: "Verfügbare Anschlüsse",
      example: "2x HDMI, 1x DisplayPort",
      type: "text"
    },
    { 
      label: "Helligkeit", 
      key: "brightness",
      hint: "Maximale Helligkeit",
      example: "400",
      unit: "cd/m²",
      type: "text"
    },
  ],
  GR: [
    { 
      label: "Chip", 
      key: "chip",
      hint: "Modell des Grafikchips",
      example: "NVIDIA RTX 4070"
    },
    { 
      label: "Speicher", 
      key: "memory",
      hint: "Größe des Grafikspeichers",
      example: "8 GB",
      unit: "GB"
    },
    { 
      label: "Taktrate", 
      key: "clockSpeed",
      hint: "Basis-Taktrate des Chips",
      example: "2310",
      unit: "MHz"
    },
    { 
      label: "Anschlüsse", 
      key: "ports",
      hint: "Verfügbare Anschlüsse",
      example: "3x DisplayPort, 1x HDMI"
    },
    { 
      label: "Stromverbrauch", 
      key: "powerConsumption",
      hint: "Maximale Leistungsaufnahme",
      example: "200",
      unit: "Watt"
    },
  ],
  CPU: [
    { 
      label: "Modell", 
      key: "model",
      hint: "Vollständige Modellbezeichnung",
      example: "AMD Ryzen 7 7700X"
    },
    { 
      label: "Kerne", 
      key: "cores",
      hint: "Anzahl physischer/logischer Kerne",
      example: "8/16"
    },
    { 
      label: "Taktrate", 
      key: "clockSpeed",
      hint: "Basis/Boost Taktrate",
      example: "4.5/5.4",
      unit: "GHz"
    },
    { 
      label: "Cache", 
      key: "cache",
      hint: "Größe des L3-Cache",
      example: "32",
      unit: "MB"
    },
    { 
      label: "Sockel", 
      key: "socket",
      hint: "Prozessorsockel",
      example: "AM5"
    },
  ],
  RAM: [
    { 
      label: "Typ", 
      key: "type",
      hint: "RAM-Technologie und Generation",
      example: "DDR5"
    },
    { 
      label: "Kapazität", 
      key: "capacity",
      hint: "Größe des Arbeitsspeichers",
      example: "32",
      unit: "GB"
    },
    { 
      label: "Taktrate", 
      key: "clockSpeed",
      hint: "Effektive Taktrate",
      example: "6000",
      unit: "MHz"
    },
    { 
      label: "Latenz", 
      key: "latency",
      hint: "CAS-Latenz",
      example: "CL36"
    },
  ],
  SSD: [
    { 
      label: "Kapazität", 
      key: "capacity",
      hint: "Speicherkapazität",
      example: "1000",
      unit: "GB"
    },
    { 
      label: "Formfaktor", 
      key: "formFactor",
      hint: "Bauform der SSD",
      example: "M.2 2280"
    },
    { 
      label: "Schnittstelle", 
      key: "interface",
      hint: "Anschlusstyp",
      example: "PCIe 4.0 x4"
    },
    { 
      label: "Lese-/Schreibgeschwindigkeit", 
      key: "speed",
      hint: "Sequentielle Lese-/Schreibrate",
      example: "7000/5000",
      unit: "MB/s"
    },
  ],
  HDD: [
    { 
      label: "Kapazität", 
      key: "capacity",
      hint: "Speicherkapazität",
      example: "2000",
      unit: "GB"
    },
    { 
      label: "Formfaktor", 
      key: "formFactor",
      hint: "Bauform der Festplatte",
      example: "3.5 Zoll"
    },
    { 
      label: "Drehzahl", 
      key: "rpm",
      hint: "Umdrehungen pro Minute",
      example: "7200",
      unit: "RPM"
    },
    { 
      label: "Cache", 
      key: "cache",
      hint: "Größe des Festplatten-Cache",
      example: "256",
      unit: "MB"
    },
  ],
};

export function AddComponentForm({ lastRunningNumber }: AddComponentFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("IT");
  const [location, setLocation] = useState<Location>("HH");
  const [ownership, setOwnership] = useState<Ownership>("FI");
  const [status, setStatus] = useState<Status>("AK");
  const [indicator, setIndicator] = useState<Indicator>("PC");
  const [serialNumber, setSerialNumber] = useState("");
  const [specifications, setSpecifications] = useState<Specifications>({});

  const addComponent = useComponentsStore((state) => state.addComponent);

  const handleSpecificationChange = (key: string, value: string) => {
    setSpecifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = () => {
    const runningNumber = String(lastRunningNumber + 1).padStart(3, '0');
    
    const newComponent: HardwareComponent = {
      id: generateComponentId(category, location, ownership, status, indicator, runningNumber),
      name,
      category,
      location,
      ownership,
      status,
      indicator,
      runningNumber,
      serialNumber,
      purchaseDate: new Date(),
      specifications: Object.fromEntries(
        Object.entries(specifications).filter(([, value]) => value !== "" && value !== "none")
      )
    };

    addComponent(newComponent);
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setCategory("IT");
    setLocation("HH");
    setOwnership("FI");
    setStatus("AK");
    setIndicator("PC");
    setSerialNumber("");
    setSpecifications({});
  };

  const renderSpecificationFields = () => {
    const fields = SPEC_FIELDS[indicator];
    if (!fields) return null;

    return (
      <div className="border rounded-lg p-6 bg-muted/30">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Spezifikationen für {INDICATORS[indicator]}</h3>
              <span className="text-sm text-muted-foreground">(Optional)</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Geben Sie die technischen Details für {INDICATORS[indicator]} ein. Alle Felder sind optional.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {fields.map(({ label, key, hint, example, unit, type, options }) => (
              <div key={key} className="space-y-2 bg-background rounded-lg p-4 shadow-sm border">
                <div className="space-y-1">
                  <label htmlFor={key} className="text-sm font-medium flex items-center gap-2">
                    {label}
                    {unit && <span className="text-xs text-muted-foreground">({unit})</span>}
                  </label>
                  {hint && (
                    <p className="text-xs text-muted-foreground">{hint}</p>
                  )}
                </div>
                {type === 'select' && options ? (
                  <Select
                    value={specifications[key] || ""}
                    onValueChange={(value) => handleSpecificationChange(key, value)}
                  >
                    <SelectTrigger className="bg-white/50">
                      <SelectValue placeholder={`${label} auswählen...`} />
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
                    placeholder={example || `${label} eingeben...`}
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Komponente hinzufügen</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Neue Komponente hinzufügen</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <label htmlFor="name">Name</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. ThinkPad X1 Carbon"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="category">Kategorie</label>
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
              <label htmlFor="indicator">Typ</label>
              <Select value={indicator} onValueChange={(value: Indicator) => {
                setIndicator(value);
                setSpecifications({});
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(INDICATORS).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="location">Standort</label>
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
              <label htmlFor="ownership">Besitzverhältnis</label>
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
              <label htmlFor="serialNumber">Seriennummer</label>
              <Input
                id="serialNumber"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="z.B. XYZ123"
              />
            </div>
          </div>

          {renderSpecificationFields()}

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSubmit} disabled={!name || !serialNumber}>
              Hinzufügen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 