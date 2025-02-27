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
      unit: "GB",
      type: "text"
    },
    { 
      label: "Speicher", 
      key: "storage",
      hint: "Hauptspeicher des Systems",
      type: "text"
    },
    { 
      label: "Betriebssystem", 
      key: "os",
      hint: "Name und Version des Betriebssystems",
      type: "text"
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
    // ... Add other LT fields
  ],
  MON: [
    { 
      label: "Bildschirmgröße", 
      key: "size",
      hint: "Diagonale des Bildschirms",
      unit: "Zoll",
      type: "text"
    },
    // ... Add other MON fields
  ],
  GR: [
    { 
      label: "Chip", 
      key: "chip",
      hint: "Modell des Grafikchips",
      example: "NVIDIA RTX 4070",
      type: "text"
    },
    // ... Add other GR fields
  ],
  CPU: [
    { 
      label: "Modell", 
      key: "model",
      hint: "Vollständige Modellbezeichnung",
      example: "AMD Ryzen 7 7700X",
      type: "text"
    },
    // ... Add other CPU fields
  ],
  RAM: [
    { 
      label: "Typ", 
      key: "type",
      hint: "RAM-Technologie und Generation",
      example: "DDR5",
      type: "text"
    },
    // ... Add other RAM fields
  ],
  SSD: [
    { 
      label: "Kapazität", 
      key: "capacity",
      hint: "Speicherkapazität",
      example: "1000",
      unit: "GB",
      type: "text"
    },
    // ... Add other SSD fields
  ],
  HDD: [
    { 
      label: "Kapazität", 
      key: "capacity",
      hint: "Speicherkapazität",
      example: "2000",
      unit: "GB",
      type: "text"
    },
    // ... Add other HDD fields
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
  const [selectedInterfaces, setSelectedInterfaces] = useState<Record<string, string[]>>({});

  const addComponent = useComponentsStore((state) => state.addComponent);

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