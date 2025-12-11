import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sparkles, RefreshCw } from 'lucide-react';
import type { ComponentType, GenerationParams } from '@/types/aero';

interface GenerationPanelProps {
  selectedType: ComponentType;
  onGenerate: (params: GenerationParams) => void;
  isGenerating?: boolean;
}

export function GenerationPanel({ selectedType, onGenerate, isGenerating = false }: GenerationPanelProps) {
  const [complexity, setComplexity] = useState(50);
  const [smoothness, setSmoothness] = useState(0.8);
  const [temperature, setTemperature] = useState(0.7);
  const [latentDimension, setLatentDimension] = useState(32);
  const [thickness, setThickness] = useState(0.12);
  const [camber, setCamber] = useState(0.02);

  const handleGenerate = () => {
    onGenerate({
      type: selectedType,
      complexity,
      smoothness,
      temperature,
      latentDimension,
      thickness,
      camber,
    });
  };

  const getTypeDescription = () => {
    switch (selectedType) {
      case 'airfoil':
        return 'Generate wing profiles optimized for lift and efficiency';
      case 'winglet':
        return 'Generate wingtip devices for induced drag reduction';
      case 'sidepod':
        return 'Generate cooling bodies balancing drag and airflow';
      case 'diffuser':
        return 'Generate underbody components for downforce generation';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Shape Generation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-4">{getTypeDescription()}</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="complexity">Complexity</Label>
              <span className="text-sm font-mono text-muted-foreground">{complexity}</span>
            </div>
            <Slider
              id="complexity"
              min={20}
              max={100}
              step={5}
              value={[complexity]}
              onValueChange={(value) => setComplexity(value[0])}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Number of points defining the shape
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="smoothness">Smoothness</Label>
              <span className="text-sm font-mono text-muted-foreground">
                {smoothness.toFixed(2)}
              </span>
            </div>
            <Slider
              id="smoothness"
              min={0.5}
              max={1}
              step={0.05}
              value={[smoothness]}
              onValueChange={(value) => setSmoothness(value[0])}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Surface smoothness factor
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature">Temperature</Label>
              <span className="text-sm font-mono text-muted-foreground">
                {temperature.toFixed(2)}
              </span>
            </div>
            <Slider
              id="temperature"
              min={0.1}
              max={1.5}
              step={0.1}
              value={[temperature]}
              onValueChange={(value) => setTemperature(value[0])}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Controls randomness and creativity
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="latentDimension">Latent Dimension</Label>
              <span className="text-sm font-mono text-muted-foreground">{latentDimension}</span>
            </div>
            <Slider
              id="latentDimension"
              min={8}
              max={128}
              step={8}
              value={[latentDimension]}
              onValueChange={(value) => setLatentDimension(value[0])}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Latent space dimensionality
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="thickness">Thickness</Label>
              <span className="text-sm font-mono text-muted-foreground">
                {(thickness * 100).toFixed(1)}%
              </span>
            </div>
            <Slider
              id="thickness"
              min={0.05}
              max={0.25}
              step={0.01}
              value={[thickness]}
              onValueChange={(value) => setThickness(value[0])}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Maximum thickness ratio
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="camber">Camber</Label>
              <span className="text-sm font-mono text-muted-foreground">
                {(camber * 100).toFixed(1)}%
              </span>
            </div>
            <Slider
              id="camber"
              min={0}
              max={0.08}
              step={0.005}
              value={[camber]}
              onValueChange={(value) => setCamber(value[0])}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Mean camber line curvature
            </p>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-[#c5134be6] bg-none"
          size="lg"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Shape
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
