'use client';

import { useDraggable } from '@dnd-kit/core';
import { HardwareComponent } from '@/app/types/hardware';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Computer } from 'lucide-react';

interface DraggableComponentProps {
  component: HardwareComponent;
}

function DraggableComponent({ component }: DraggableComponentProps) {
  const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
    id: component.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Card 
        className={`cursor-move hover:bg-accent hover:text-accent-foreground transition-colors ${
          isDragging ? 'opacity-50' : ''
        }`}
      >
        <CardContent className="p-4 flex items-center gap-4">
          <Computer className="h-8 w-8 text-muted-foreground" />
          <div className="flex-1">
            <div className="font-medium">{component.name}</div>
            <div className="text-sm text-muted-foreground">{component.serialNumber}</div>
          </div>
          <Badge>{component.status}</Badge>
        </CardContent>
      </Card>
    </div>
  );
}

interface ComponentsGridProps {
  components: HardwareComponent[];
}

export function ComponentsGrid({ components }: ComponentsGridProps) {
  if (components.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Keine Komponenten verfügbar
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 min-w-[350px]">
      {components.map((component) => (
        <DraggableComponent key={component.id} component={component} />
      ))}
    </div>
  );
} 