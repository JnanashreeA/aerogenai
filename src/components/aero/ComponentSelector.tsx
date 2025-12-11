import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, Zap, Box, TrendingDown } from 'lucide-react';
import type { ComponentType } from '@/types/aero';

interface ComponentSelectorProps {
  selectedType: ComponentType;
  onSelectType: (type: ComponentType) => void;
}

export function ComponentSelector({ selectedType, onSelectType }: ComponentSelectorProps) {
  const components = [
    {
      type: 'airfoil' as ComponentType,
      icon: Plane,
      label: 'Airfoil',
      description: 'Wing profiles for lift generation',
      color: 'text-primary',
    },
    {
      type: 'winglet' as ComponentType,
      icon: Zap,
      label: 'Winglet',
      description: 'Wingtip devices for drag reduction',
      color: 'text-orange-500',
    },
    {
      type: 'sidepod' as ComponentType,
      icon: Box,
      label: 'Sidepod',
      description: 'Cooling body aerodynamics',
      color: 'text-green-500',
    },
    {
      type: 'diffuser' as ComponentType,
      icon: TrendingDown,
      label: 'Diffuser',
      description: 'Underbody downforce generator',
      color: 'text-purple-500',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Component Type</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {components.map((component) => {
          const Icon = component.icon;
          const isSelected = selectedType === component.type;

          return (
            <Button
              key={component.type}
              variant={isSelected ? 'default' : 'outline'}
              className="w-full justify-start h-auto py-3 px-4 bg-[#b52528e6] bg-none"
              onClick={() => onSelectType(component.type)}
            >
              <div className="flex items-start gap-3 w-full">
                <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isSelected ? '' : component.color}`} />
                <div className="flex-1 text-left">
                  <div className="font-semibold">{component.label}</div>
                  <div className={`text-xs mt-0.5 ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {component.description}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
