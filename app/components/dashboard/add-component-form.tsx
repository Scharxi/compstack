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

const SPEC_FIELDS: { [key in Indicator]?: Array<{ 
  label: string; 
  key: string; 
  hint?: string;
  example?: string;
  unit?: string;
}> } = {
  PC: [
    { 
      label: "CPU", 
      key: "cpu",
      hint: "Prozessor-Modell und Generation",
      example: "Intel Core i7-12700K"
    },
    { 
      label: "RAM", 
      key: "ram",
      hint: "Arbeitsspeicher-Größe",
      example: "16 GB",
      unit: "GB"
    },
    { 
      label: "Speicher", 
      key: "storage",
      hint: "Art und Größe des Speichers",
      example: "1 TB SSD + 2 TB HDD"
    },
    { 
      label: "Betriebssystem", 
      key: "os",
      hint: "Name und Version des Betriebssystems",
      example: "Windows 11 Pro"
    },
    { 
      label: "Grafikkarte", 
      key: "gpu",
      hint: "Modell der Grafikkarte",
      example: "NVIDIA RTX 3060"
    },
  ],
  LT: [
    { 
      label: "CPU", 
      key: "cpu",
      hint: "Prozessor-Modell und Generation",
      example: "Intel Core i5-1240P"
    },
    { 
      label: "RAM", 
      key: "ram",
      hint: "Arbeitsspeicher-Größe",
      example: "16 GB",
      unit: "GB"
    },
    { 
      label: "Speicher", 
      key: "storage",
      hint: "Art und Größe des Speichers",
      example: "512 GB SSD"
    },
    { 
      label: "Display", 
      key: "display",
      hint: "Displaygröße und Auflösung",
      example: "14 Zoll, 2560x1600"
    },
    { 
      label: "Betriebssystem", 
      key: "os",
      hint: "Name und Version des Betriebssystems",
      example: "Windows 11 Pro"
    },
    { 
      label: "Grafikkarte", 
      key: "gpu",
      hint: "Modell der Grafikkarte",
      example: "Intel Iris Xe"
    },
  ],
  MON: [
    { 
      label: "Bildschirmgröße", 
      key: "size",
      hint: "Diagonale des Bildschirms",
      example: "27 Zoll",
      unit: "Zoll"
    },
    { 
      label: "Auflösung", 
      key: "resolution",
      hint: "Horizontale x Vertikale Pixel",
      example: "2560x1440"
    },
    { 
      label: "Panel-Typ", 
      key: "panelType",
      hint: "Technologie des Displays",
      example: "IPS, VA, oder TN"
    },
    { 
      label: "Anschlüsse", 
      key: "ports",
      hint: "Verfügbare Anschlüsse",
      example: "2x HDMI, 1x DisplayPort"
    },
    { 
      label: "Helligkeit", 
      key: "brightness",
      hint: "Maximale Helligkeit",
      example: "400",
      unit: "cd/m²"
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

  const updateComponent = useComponentsStore((state) => state.updateComponent);

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
        Object.entries(specifications).filter(([_, value]) => value !== "")
      )
    };

    updateComponent(newComponent);
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
            {fields.map(({ label, key, hint, example, unit }) => (
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
                <Input
                  id={key}
                  value={specifications[key] || ""}
                  onChange={(e) => handleSpecificationChange(key, e.target.value)}
                  placeholder={example || `${label} eingeben...`}
                  className="bg-white/50"
                />
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