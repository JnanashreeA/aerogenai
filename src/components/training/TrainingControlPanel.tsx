import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Square, RotateCcw } from 'lucide-react';
import type { TrainingConfig } from '@/services/mlTrainer';
import type { ComponentType } from '@/types/aero';

interface TrainingControlPanelProps {
  onStartTraining: (config: TrainingConfig) => void;
  onStopTraining: () => void;
  onReset: () => void;
  isTraining: boolean;
}

export function TrainingControlPanel({
  onStartTraining,
  onStopTraining,
  onReset,
  isTraining,
}: TrainingControlPanelProps) {
  const [componentType, setComponentType] = useState<ComponentType>('airfoil');
  const [complexity, setComplexity] = useState(50);
  const [camber, setCamber] = useState(3);
  const [thickness, setThickness] = useState(12);
  const [latentDimension, setLatentDimension] = useState(32);
  const [smoothness, setSmoothness] = useState(0.9);
  const [temperature, setTemperature] = useState(0.3);
  const [targetLiftDragRatio, setTargetLiftDragRatio] = useState(50);
  const [batchSize, setBatchSize] = useState(10);
  const [maxIterations, setMaxIterations] = useState(100);

  const handleStart = () => {
    const config: TrainingConfig = {
      componentType,
      complexity,
      camber,
      thickness,
      latentDimension,
      smoothness,
      temperature,
      targetLiftDragRatio,
      batchSize,
      maxIterations,
    };
    onStartTraining(config);
  };

  const handleReset = () => {
    setComplexity(50);
    setCamber(3);
    setThickness(12);
    setLatentDimension(32);
    setSmoothness(0.9);
    setTemperature(0.3);
    setTargetLiftDragRatio(50);
    setBatchSize(10);
    setMaxIterations(100);
    onReset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Configuration</CardTitle>
        <CardDescription>
          Configure parameters to train models that generate airfoils with L/D ratio &gt; 50
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Component Type</Label>
          <Select
            value={componentType}
            onValueChange={(value) => setComponentType(value as ComponentType)}
            disabled={isTraining}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="airfoil">Airfoil</SelectItem>
              <SelectItem value="winglet">Winglet</SelectItem>
              <SelectItem value="sidepod">Sidepod</SelectItem>
              <SelectItem value="diffuser">Diffuser</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Complexity</Label>
              <span className="text-sm text-muted-foreground">{complexity}</span>
            </div>
            <Slider
              value={[complexity]}
              onValueChange={([v]) => setComplexity(v)}
              min={20}
              max={80}
              step={1}
              disabled={isTraining}
            />
            <p className="text-xs text-muted-foreground">
              Controls shape detail level (20-80, recommended: 45-60)
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Camber (%)</Label>
              <span className="text-sm text-muted-foreground">{camber}</span>
            </div>
            <Slider
              value={[camber]}
              onValueChange={([v]) => setCamber(v)}
              min={0}
              max={8}
              step={0.1}
              disabled={isTraining}
            />
            <p className="text-xs text-muted-foreground">
              Curvature for lift generation (0-8%, optimal: 2-4%)
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Thickness (%)</Label>
              <span className="text-sm text-muted-foreground">{thickness}</span>
            </div>
            <Slider
              value={[thickness]}
              onValueChange={([v]) => setThickness(v)}
              min={5}
              max={25}
              step={0.1}
              disabled={isTraining}
            />
            <p className="text-xs text-muted-foreground">
              Airfoil thickness (5-25%, optimal: 8-12%)
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Latent Dimension</Label>
              <span className="text-sm text-muted-foreground">{latentDimension}</span>
            </div>
            <Slider
              value={[latentDimension]}
              onValueChange={([v]) => setLatentDimension(v)}
              min={8}
              max={128}
              step={8}
              disabled={isTraining}
            />
            <p className="text-xs text-muted-foreground">
              Shape diversity control (8-128, recommended: 32-48)
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Smoothness</Label>
              <span className="text-sm text-muted-foreground">{smoothness.toFixed(2)}</span>
            </div>
            <Slider
              value={[smoothness * 100]}
              onValueChange={([v]) => setSmoothness(v / 100)}
              min={50}
              max={100}
              step={1}
              disabled={isTraining}
            />
            <p className="text-xs text-muted-foreground">
              Surface quality (0.5-1.0, recommended: 0.85-0.95)
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Temperature</Label>
              <span className="text-sm text-muted-foreground">{temperature.toFixed(2)}</span>
            </div>
            <Slider
              value={[temperature * 100]}
              onValueChange={([v]) => setTemperature(v / 100)}
              min={10}
              max={150}
              step={1}
              disabled={isTraining}
            />
            <p className="text-xs text-muted-foreground">
              Creativity level (0.1-1.5, low: high performance, high: exploration)
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Target L/D Ratio</Label>
              <span className="text-sm text-muted-foreground">{targetLiftDragRatio}</span>
            </div>
            <Slider
              value={[targetLiftDragRatio]}
              onValueChange={([v]) => setTargetLiftDragRatio(v)}
              min={30}
              max={100}
              step={5}
              disabled={isTraining}
            />
            <p className="text-xs text-muted-foreground">
              Minimum acceptable lift-to-drag ratio
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Batch Size</Label>
              <span className="text-sm text-muted-foreground">{batchSize}</span>
            </div>
            <Slider
              value={[batchSize]}
              onValueChange={([v]) => setBatchSize(v)}
              min={5}
              max={50}
              step={5}
              disabled={isTraining}
            />
            <p className="text-xs text-muted-foreground">
              Number of shapes per training batch
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Max Iterations</Label>
              <span className="text-sm text-muted-foreground">{maxIterations}</span>
            </div>
            <Slider
              value={[maxIterations]}
              onValueChange={([v]) => setMaxIterations(v)}
              min={10}
              max={500}
              step={10}
              disabled={isTraining}
            />
            <p className="text-xs text-muted-foreground">
              Maximum training iterations
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          {!isTraining ? (
            <>
              <Button onClick={handleStart} className="flex-1">
                <Play className="mr-2 h-4 w-4" />
                Start Training
              </Button>
              <Button onClick={handleReset} variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </>
          ) : (
            <Button onClick={onStopTraining} variant="destructive" className="flex-1">
              <Square className="mr-2 h-4 w-4" />
              Stop Training
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
