'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  CATEGORIES, 
  LOCATIONS, 
  OWNERSHIPS, 
  STATUS, 
  INDICATORS,
  generateComponentId,
  type Indicator,
  type HardwareComponent,
  type Category,
  type Location,
  type Ownership,
  type Status,
} from "@/app/types/hardware";

// Spezifikationsfelder je nach Indikator
const INDICATOR_SPECIFICATIONS: Record<Indicator, Array<{
  key: string;
  label: string;
  placeholder?: string;
}>> = {
  PC: [
    { key: "cpu", label: "Prozessor", placeholder: "z.B. Intel i7-1165G7" },
    { key: "ram", label: "Arbeitsspeicher", placeholder: "z.B. 16GB" },
    { key: "storage", label: "Speicher", placeholder: "z.B. 512GB SSD" },
    { key: "gpu", label: "Grafikkarte", placeholder: "z.B. Intel Iris Xe / NVIDIA RTX 3050" },
    { key: "os", label: "Betriebssystem", placeholder: "z.B. Windows 11 Pro" },
  ],
  LT: [
    { key: "cpu", label: "Prozessor", placeholder: "z.B. Intel i7-1165G7" },
    { key: "ram", label: "Arbeitsspeicher", placeholder: "z.B. 16GB" },
    { key: "storage", label: "Speicher", placeholder: "z.B. 512GB SSD" },
    { key: "gpu", label: "Grafikkarte", placeholder: "z.B. Intel Iris Xe / NVIDIA RTX 3050" },
    { key: "display", label: "Display", placeholder: "z.B. 14 Zoll, 1920x1080" },
    { key: "battery", label: "Akku", placeholder: "z.B. 57Wh" },
    { key: "os", label: "Betriebssystem", placeholder: "z.B. Windows 11 Pro" },
  ],
  MON: [
    { key: "size", label: "Größe", placeholder: "z.B. 27 Zoll" },
    { key: "resolution", label: "Auflösung", placeholder: "z.B. 2560x1440" },
    { key: "panel", label: "Panel-Typ", placeholder: "z.B. IPS, VA, TN" },
    { key: "refreshRate", label: "Bildwiederholrate", placeholder: "z.B. 144Hz" },
    { key: "ports", label: "Anschlüsse", placeholder: "z.B. 2x HDMI, 1x DisplayPort" },
  ],
  GR: [
    { key: "chipset", label: "Chipset", placeholder: "z.B. NVIDIA RTX 4070" },
    { key: "vram", label: "Videospeicher", placeholder: "z.B. 12GB GDDR6X" },
    { key: "ports", label: "Anschlüsse", placeholder: "z.B. 3x DisplayPort, 1x HDMI" },
    { key: "power", label: "Stromverbrauch", placeholder: "z.B. 200W" },
  ],
  CPU: [
    { key: "model", label: "Modell", placeholder: "z.B. Intel i9-13900K" },
    { key: "cores", label: "Kerne", placeholder: "z.B. 24 (8P+16E)" },
    { key: "frequency", label: "Taktrate", placeholder: "z.B. 3.0-5.8 GHz" },
    { key: "socket", label: "Sockel", placeholder: "z.B. LGA 1700" },
  ],
  RAM: [
    { key: "capacity", label: "Kapazität", placeholder: "z.B. 32GB" },
    { key: "type", label: "Typ", placeholder: "z.B. DDR5" },
    { key: "speed", label: "Geschwindigkeit", placeholder: "z.B. 6000MHz" },
    { key: "timings", label: "Timings", placeholder: "z.B. CL36" },
  ],
  SSD: [
    { key: "capacity", label: "Kapazität", placeholder: "z.B. 1TB" },
    { key: "type", label: "Typ", placeholder: "z.B. NVMe PCIe 4.0" },
    { key: "readSpeed", label: "Lesegeschwindigkeit", placeholder: "z.B. 7000 MB/s" },
    { key: "writeSpeed", label: "Schreibgeschwindigkeit", placeholder: "z.B. 5000 MB/s" },
  ],
  HDD: [
    { key: "capacity", label: "Kapazität", placeholder: "z.B. 4TB" },
    { key: "rpm", label: "Drehzahl", placeholder: "z.B. 7200 RPM" },
    { key: "cacheSize", label: "Cache", placeholder: "z.B. 256MB" },
    { key: "interface", label: "Schnittstelle", placeholder: "z.B. SATA 6Gb/s" },
  ],
};

const formSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich"),
  category: z.custom<Category>(),
  location: z.custom<Location>(),
  ownership: z.custom<Ownership>(),
  status: z.custom<Status>(),
  indicator: z.custom<Indicator>(),
  serialNumber: z.string().min(1, "Seriennummer ist erforderlich"),
  specifications: z.record(z.string()).optional(),
});

interface AddComponentFormProps {
  onAddComponent: (component: HardwareComponent) => void;
  lastRunningNumber: number;
}

export function AddComponentForm({ onAddComponent, lastRunningNumber }: AddComponentFormProps) {
  const [open, setOpen] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);
  const [specifications, setSpecifications] = useState<Record<string, string>>({});
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      serialNumber: "",
      specifications: {},
    },
  });

  // Aktualisiere Spezifikationen, wenn sich der Indikator ändert
  useEffect(() => {
    if (selectedIndicator) {
      const newSpecs = INDICATOR_SPECIFICATIONS[selectedIndicator].reduce((acc, spec) => {
        acc[spec.key] = specifications[spec.key] || "";
        return acc;
      }, {} as Record<string, string>);
      setSpecifications(newSpecs);
    }
  }, [selectedIndicator]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newRunningNumber = (lastRunningNumber + 1).toString().padStart(3, '0');
    
    const newComponent: HardwareComponent = {
      id: generateComponentId(
        values.category,
        values.location,
        values.ownership,
        values.status,
        values.indicator,
        newRunningNumber
      ),
      name: values.name,
      category: values.category as Category,
      location: values.location as Location,
      ownership: values.ownership as Ownership,
      status: values.status as Status,
      indicator: values.indicator as Indicator,
      runningNumber: newRunningNumber,
      serialNumber: values.serialNumber,
      purchaseDate: new Date(),
      specifications: specifications,
    };

    onAddComponent(newComponent);
    form.reset();
    setSpecifications({});
    setSelectedIndicator(null);
    setOpen(false);
  }

  // Handler für Spezifikationsänderungen
  const handleSpecificationChange = (key: string, value: string) => {
    setSpecifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Neue Komponente</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Neue Komponente hinzufügen</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. ThinkPad X1 Carbon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategorie</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wählen..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(CATEGORIES).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="indicator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Typ</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value as Indicator);
                        setSelectedIndicator(value as Indicator);
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wählen..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(INDICATORS).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Standort</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wählen..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(LOCATIONS).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ownership"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Besitzverhältnis</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wählen..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(OWNERSHIPS).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(STATUS).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seriennummer</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dynamische Spezifikationsfelder */}
            {selectedIndicator && (
              <div className="space-y-4">
                <h3 className="font-medium">Spezifikationen</h3>
                <div className="grid grid-cols-2 gap-4">
                  {INDICATOR_SPECIFICATIONS[selectedIndicator].map((spec) => (
                    <FormItem key={spec.key}>
                      <FormLabel>
                        {spec.label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={spec.placeholder}
                          value={specifications[spec.key] || ""}
                          onChange={(e) => handleSpecificationChange(spec.key, e.target.value)}
                        />
                      </FormControl>
                    </FormItem>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Abbrechen
              </Button>
              <Button type="submit">Hinzufügen</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 