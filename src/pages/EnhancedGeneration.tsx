/**
 * Enhanced Generation Page
 * Demonstrates the new enhanced shape generation pipeline with full validation and metadata
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Download, RefreshCw, Info } from 'lucide-react';
import { ShapeVisualizer } from '@/components/aero/ShapeVisualizer';
import { ParameterInfo, ParameterSummary } from '@/components/generation/ParameterInfo';
import { ValidationDisplay, MetricsDisplay } from '@/components/generation/ValidationDisplay';
import { MetadataDisplay, MetadataBadge } from '@/components/generation/MetadataDisplay';
import { EnhancedShapeGenerator } from '@/services/enhancedShapeGenerator';
import { diversityTracker } from '@/services/diversityTracker';
import { PARAMETER_SPECS } from '@/services/parameterSpec';
import type { EnhancedAeroShape, ShapeParameters } from '@/types/enhancedAero';
import { useToast } from '@/hooks/use-toast';

export default function EnhancedGeneration() {
  const [parameters, setParameters] = useState<ShapeParameters>({
    temperature: 0.7,
    camber: 0.02,
    smoothness: 0.8,
    latentDimension: 32,
    thickness: 0.12,
    complexity: 50,
  });

  const [shape, setShape] = useState<EnhancedAeroShape | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [selectedParam, setSelectedParam] = useState<string | null>(null);

  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setWarnings([]);

    try {
      toast({
        title: 'Generating Shape',
        description: 'Creating diverse aerodynamic design with full validation...',
      });

      const result = await EnhancedShapeGenerator.generateShape('airfoil', parameters);

      if (!result.success) {
        throw new Error(result.error || 'Generation failed');
      }

      if (result.warnings.length > 0) {
        setWarnings(result.warnings);
      }

      setShape(result.shape!);

      toast({
        title: 'Shape Generated Successfully',
        description: `Generated in ${result.shape!.metadata.generationTime.toFixed(0)}ms with ${result.attempts} attempt(s)`,
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleParameterChange = (key: keyof ShapeParameters, value: number) => {
    setParameters(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = () => {
    if (!shape) return;

    const exportData = {
      type: shape.type,
      parameters: shape.parameters,
      latentVector: shape.latentVector,
      coordinates: shape.coordinates.map(p => [p.x, p.y]),
      metadata: shape.metadata,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${shape.metadata.identifier}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Exported Successfully',
      description: 'Shape data exported with complete metadata',
    });
  };

  const handleReset = () => {
    setShape(null);
    setWarnings([]);
    diversityTracker.clearHistory();
    toast({
      title: 'Reset Complete',
      description: 'Cleared shape and diversity history',
    });
  };

  const stats = diversityTracker.getStatistics();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Enhanced Shape Generation</h1>
            <p className="text-muted-foreground mt-1">
              Advanced aerodynamic design with validation, diversity enforcement, and comprehensive metadata
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            {shape && (
              <Button onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>

        {warnings.length > 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium mb-1">Warnings:</p>
              <ul className="list-disc list-inside space-y-1">
                {warnings.map((warning, idx) => (
                  <li key={idx} className="text-sm">
                    {warning}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generation Parameters</CardTitle>
                <CardDescription>Configure shape generation settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(parameters).map(([key, value]) => {
                  const spec = PARAMETER_SPECS[key];
                  if (!spec) return null;

                  const inRecommended = value >= spec.recommended[0] && value <= spec.recommended[1];

                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">{spec.name}</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono">{value.toFixed(3)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => setSelectedParam(selectedParam === key ? null : key)}
                          >
                            <Info className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <Slider
                        value={[value]}
                        min={spec.min}
                        max={spec.max}
                        step={(spec.max - spec.min) / 100}
                        onValueChange={([v]) => handleParameterChange(key as keyof ShapeParameters, v)}
                        className={inRecommended ? '' : 'opacity-70'}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{spec.min}</span>
                        <span className="text-primary">
                          {spec.recommended[0]} - {spec.recommended[1]}
                        </span>
                        <span>{spec.max}</span>
                      </div>
                    </div>
                  );
                })}

                <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate Shape'}
                </Button>
              </CardContent>
            </Card>

            {selectedParam && (
              <ParameterInfo parameterName={selectedParam} currentValue={parameters[selectedParam as keyof ShapeParameters] as number} />
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Diversity Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Generated:</span>
                  <span className="font-mono">{stats.totalGenerated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Similarity:</span>
                  <span className="font-mono">{(stats.averageSimilarity * 100).toFixed(1)}%</span>
                </div>
                {Object.entries(stats.byType).map(([type, count]) => (
                  <div key={type} className="flex justify-between">
                    <span className="text-muted-foreground capitalize">{type}:</span>
                    <span className="font-mono">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="xl:col-span-2 space-y-6">
            {shape ? (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{shape.metadata.familyName || 'Generated Airfoil'}</CardTitle>
                        <CardDescription className="mt-1">{shape.metadata.summary}</CardDescription>
                      </div>
                      <MetadataBadge metadata={shape.metadata} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/30 rounded-lg p-6">
                      <ShapeVisualizer
                        shape={{
                          id: 'enhanced',
                          type: shape.type,
                          name: shape.metadata.familyName || 'Generated',
                          points: shape.coordinates,
                          isGenerated: true,
                          timestamp: shape.metadata.timestamp,
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Tabs defaultValue="validation" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="validation">Validation</TabsTrigger>
                    <TabsTrigger value="metrics">Metrics</TabsTrigger>
                    <TabsTrigger value="metadata">Metadata</TabsTrigger>
                    <TabsTrigger value="parameters">Parameters</TabsTrigger>
                  </TabsList>

                  <TabsContent value="validation" className="mt-6">
                    <ValidationDisplay validation={shape.metadata.validationResult} />
                  </TabsContent>

                  <TabsContent value="metrics" className="mt-6">
                    <MetricsDisplay metrics={shape.metadata.validationResult.metrics} />
                  </TabsContent>

                  <TabsContent value="metadata" className="mt-6">
                    <MetadataDisplay metadata={shape.metadata} />
                  </TabsContent>

                  <TabsContent value="parameters" className="mt-6">
                    <ParameterSummary parameters={shape.parameters} />
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Sparkles className="h-16 w-16 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-medium">No Shape Generated</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Configure parameters and click "Generate Shape" to begin
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
