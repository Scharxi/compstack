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
import { Checkbox } from "@/components/ui/checkbox";
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
}

const SPEC_FIELDS: Record<Indicator, SpecField[]> = {
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
      type: "select",
      options: [
        { label: "8 GB", value: "8 GB" },
        { label: "16 GB", value: "16 GB" },
        { label: "32 GB", value: "32 GB" },
        { label: "64 GB", value: "64 GB" },
      ]
    },
    { 
      label: "Primärspeicher", 
      key: "primaryStorage",
      hint: "Hauptspeicher des Systems",
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
      label: "Sekundärspeicher", 
      key: "secondaryStorage",
      hint: "Zusätzlicher Speicher (optional)",
      type: "select",
      options: [
        { label: "Keiner", value: "none" },
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
      label: "Betriebssystem", 
      key: "os",
      hint: "Name und Version des Betriebssystems",
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
      label: "Anschlüsse", 
      key: "interfaces",
      hint: "Verfügbare Anschlüsse (mehrere auswählbar)",
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
      key: "cpu",
      hint: "Prozessor-Modell und Generation",
      example: "Intel Core i5-1240P",
      type: "text"
    },
    { 
      label: "RAM", 
      key: "ram",
      hint: "Arbeitsspeicher-Größe",
      type: "select",
      options: [
        { label: "8 GB", value: "8 GB" },
        { label: "16 GB", value: "16 GB" },
        { label: "32 GB", value: "32 GB" },
        { label: "64 GB", value: "64 GB" },
      ]
    },
    { 
      label: "Speicher", 
      key: "storage",
      hint: "Hauptspeicher des Systems",
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
      hint: "Bildschirmgröße und Auflösung",
      type: "select",
      options: [
        { label: "13,3 Zoll (1920x1080)", value: "13,3 Zoll FHD" },
        { label: "13,3 Zoll (2560x1600)", value: "13,3 Zoll 2.5K" },
        { label: "14 Zoll (1920x1080)", value: "14 Zoll FHD" },
        { label: "14 Zoll (2560x1600)", value: "14 Zoll 2.5K" },
        { label: "15,6 Zoll (1920x1080)", value: "15,6 Zoll FHD" },
        { label: "15,6 Zoll (2560x1600)", value: "15,6 Zoll 2.5K" },
        { label: "16 Zoll (1920x1200)", value: "16 Zoll FHD+" },
        { label: "16 Zoll (2560x1600)", value: "16 Zoll 2.5K" },
      ]
    },
    { 
      label: "Betriebssystem", 
      key: "os",
      hint: "Name und Version des Betriebssystems",
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
      label: "Anschlüsse", 
      key: "interfaces",
      hint: "Verfügbare Anschlüsse (mehrere auswählbar)",
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
      label: "Bildschirmgröße", 
      key: "size",
      hint: "Diagonale des Bildschirms",
      type: "select",
      options: [
        { label: "24 Zoll", value: "24 Zoll" },
        { label: "27 Zoll", value: "27 Zoll" },
        { label: "32 Zoll", value: "32 Zoll" },
        { label: "34 Zoll", value: "34 Zoll" },
      ]
    },
    {
      label: "Auflösung",
      key: "resolution",
      hint: "Bildschirmauflösung",
      type: "select",
      options: [
        { label: "1920x1080 (FHD)", value: "1920x1080" },
        { label: "2560x1440 (QHD)", value: "2560x1440" },
        { label: "3440x1440 (UWQHD)", value: "3440x1440" },
        { label: "3840x2160 (4K)", value: "3840x2160" },
      ]
    },
    {
      label: "Panel-Typ",
      key: "panel",
      hint: "Display-Technologie",
      type: "select",
      options: [
        { label: "IPS", value: "IPS" },
        { label: "VA", value: "VA" },
        { label: "TN", value: "TN" },
        { label: "OLED", value: "OLED" },
      ]
    },
    { 
      label: "Anschlüsse", 
      key: "interfaces",
      hint: "Verfügbare Anschlüsse (mehrere auswählbar)",
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
      hint: "Modell des Grafikchips",
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
      label: "Speicher",
      key: "memory",
      hint: "Grafikspeicher",
      type: "select",
      options: [
        { label: "8 GB GDDR6", value: "8 GB GDDR6" },
        { label: "12 GB GDDR6X", value: "12 GB GDDR6X" },
        { label: "16 GB GDDR6", value: "16 GB GDDR6" },
        { label: "24 GB GDDR6X", value: "24 GB GDDR6X" },
      ]
    },
    { 
      label: "Anschlüsse", 
      key: "interfaces",
      hint: "Verfügbare Anschlüsse (mehrere auswählbar)",
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
      label: "Modell", 
      key: "model",
      hint: "Vollständige Modellbezeichnung",
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
      label: "Sockel",
      key: "socket",
      hint: "CPU-Sockel",
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
      label: "Typ", 
      key: "type",
      hint: "RAM-Technologie und Generation",
      type: "select",
      options: [
        { label: "DDR5-6000", value: "DDR5-6000" },
        { label: "DDR5-5600", value: "DDR5-5600" },
        { label: "DDR4-3600", value: "DDR4-3600" },
        { label: "DDR4-3200", value: "DDR4-3200" },
      ]
    },
    {
      label: "Kapazität",
      key: "capacity",
      hint: "Speicherkapazität pro Modul",
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
      label: "Typ", 
      key: "type",
      hint: "SSD-Technologie",
      type: "select",
      options: [
        { label: "NVMe PCIe 4.0", value: "NVMe PCIe 4.0" },
        { label: "NVMe PCIe 3.0", value: "NVMe PCIe 3.0" },
        { label: "SATA III", value: "SATA III" },
      ]
    },
    { 
      label: "Kapazität", 
      key: "capacity",
      hint: "Speicherkapazität",
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
      label: "Anschluss", 
      key: "interface",
      hint: "Physischer Anschluss",
      type: "select",
      options: [
        { label: "M.2", value: "M.2" },
        { label: "SATA", value: "SATA" },
      ]
    },
  ],
  HDD: [
    { 
      label: "Kapazität", 
      key: "capacity",
      hint: "Speicherkapazität",
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
      label: "Drehzahl",
      key: "rpm",
      hint: "Umdrehungen pro Minute",
      type: "select",
      options: [
        { label: "5400 RPM", value: "5400 RPM" },
        { label: "7200 RPM", value: "7200 RPM" },
      ]
    },
    { 
      label: "Anschluss", 
      key: "interface",
      hint: "Physischer Anschluss",
      type: "select",
      options: [
        { label: "SATA III", value: "SATA III" },
      ]
    },
  ]
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
  const [location, setLocation] = useState<Location>(initialData?.location || "HH");
  const [ownership, setOwnership] = useState<Ownership>(initialData?.ownership || "FI");
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
      purchaseDate: initialData?.purchaseDate || new Date(),
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
    setLocation("HH");
    setOwnership("FI");
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
              <h3 className="text-lg font-semibold">Spezifikationen für {INDICATORS[indicator]}</h3>
              <span className="text-sm text-muted-foreground">(Optional)</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Geben Sie die technischen Details für {INDICATORS[indicator]} ein. Alle Felder sind optional.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {fields.map(({ label, key, hint, example, unit, type, options }) => (
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
    <Dialog open={mode === 'edit' ? true : open} onOpenChange={(value) => {
      setOpen(value);
      if (!value) onClose?.();
    }}>
      <DialogTrigger asChild>
        {mode === 'create' ? (
          <Button>Komponente hinzufügen</Button>
        ) : null}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Neue Komponente hinzufügen' : 'Komponente bearbeiten'}</DialogTitle>
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