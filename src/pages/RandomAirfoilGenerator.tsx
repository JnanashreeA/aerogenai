/**
 * Random Airfoil Generator Page
 * Generates completely unique airfoils with enforced variety
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Download, Info, Zap, Code } from 'lucide-react';
import {
  generateRandomAirfoil,
  formatAirfoilDat,
  getParameterSummary,
  getLatentVectorSummary,
} from '@/services/randomAirfoilGenerator';
import type { GeneratedAirfoil } from '@/services/randomAirfoilGenerator';
import { AirfoilVisualization } from '@/components/aero/AirfoilVisualization';

export default function RandomAirfoilGenerator() {
  const [currentAirfoil, setCurrentAirfoil] = useState<GeneratedAirfoil | null>(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    console.log('🔄 Generate button clicked');
    setIsGenerating(true);
    
    // Force immediate generation with no caching
    setTimeout(() => {
      console.log('⚡ Calling generateRandomAirfoil()...');
      const airfoil = generateRandomAirfoil();
      console.log(`✨ New airfoil: ${airfoil.metadata.description}`);
      console.log(`📏 Points: ${airfoil.coordinates.length}, Type: ${airfoil.parameters.airfoilType}`);
      setCurrentAirfoil(airfoil);
      setGenerationCount(prev => prev + 1);
      setIsGenerating(false);
    }, 300);
  };

  const handleDownload = () => {
    if (!currentAirfoil) return;

    const datContent = formatAirfoilDat(currentAirfoil);
    const blob = new Blob([datContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentAirfoil.metadata.uniqueId}.dat`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Random Airfoil Generator
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Generate completely unique airfoil shapes with enforced variety and randomization
          </p>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6 border-primary/20 bg-primary/5">
          <Info className="h-4 w-4" />
          <AlertTitle>🎨 Truly Different Shapes - Each Type Uses Unique Mathematical Formula</AlertTitle>
          <AlertDescription>
            Each airfoil family uses a COMPLETELY DIFFERENT mathematical formula, not just parameter variations.
            NACA 4-digit uses standard thickness distribution, NACA 6-series uses laminar flow optimization,
            Selig has thick leading edges, Thin Sharp has minimal thickness, Reflex Camber has S-shaped profiles,
            and more. Expect dramatically different shapes: thin vs thick, sharp vs rounded, straight vs curved.
            High-resolution output: 200-400 points per airfoil.
          </AlertDescription>
        </Alert>

        {/* Generation Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Generated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{generationCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">
                {currentAirfoil ? currentAirfoil.parameters.airfoilType : 'None'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Uniqueness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="default" className="text-sm">
                <Zap className="w-3 h-3 mr-1" />
                Guaranteed Unique
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Generation Control */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Generate New Airfoil</CardTitle>
            <CardDescription>
              Click to generate a completely new, unique airfoil shape
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                size="lg"
                className="flex-1"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate Random Airfoil'}
              </Button>
              
              {currentAirfoil && (
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download .dat
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {currentAirfoil && (
          <div className="space-y-6">
            {/* Visualization */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Airfoil Visualization</CardTitle>
                    <CardDescription>
                      {currentAirfoil.metadata.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {currentAirfoil.parameters.airfoilType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-4">
                  <AirfoilVisualization
                    key={currentAirfoil.metadata.uniqueId}
                    coordinates={currentAirfoil.coordinates}
                    width={800}
                    height={300}
                  />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Code className="w-4 h-4" />
                  <span>ID: {currentAirfoil.metadata.uniqueId}</span>
                  <span className="mx-2">•</span>
                  <span>{currentAirfoil.metadata.pointCount} points</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(currentAirfoil.metadata.generationTime).toLocaleString()}</span>
                </div>
                
                {/* Design Notes */}
                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Design Notes</AlertTitle>
                  <AlertDescription className="text-sm">
                    {currentAirfoil.metadata.designNotes}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Details Tabs */}
            <Card>
              <CardHeader>
                <CardTitle>Generation Details</CardTitle>
                <CardDescription>
                  Parameters, latent vector, and coordinate data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="parameters" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="parameters">Parameters</TabsTrigger>
                    <TabsTrigger value="latent">Latent Vector</TabsTrigger>
                    <TabsTrigger value="coordinates">Coordinates</TabsTrigger>
                  </TabsList>

                  <TabsContent value="parameters" className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <pre className="text-sm font-mono whitespace-pre-wrap">
                        {getParameterSummary(currentAirfoil.parameters)}
                      </pre>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Temperature</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${(currentAirfoil.parameters.temperature / 5) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-mono">
                            {currentAirfoil.parameters.temperature.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Smoothness</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${currentAirfoil.parameters.smoothness * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-mono">
                            {currentAirfoil.parameters.smoothness.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Camber</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${((currentAirfoil.parameters.camber + 0.1) / 0.25) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-mono">
                            {currentAirfoil.parameters.camber.toFixed(3)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Thickness Ratio</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${((currentAirfoil.parameters.thickness_ratio - 0.06) / 0.14) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-mono">
                            {(currentAirfoil.parameters.thickness_ratio * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Leading Edge Radius</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${((currentAirfoil.parameters.leading_edge_radius - 0.005) / 0.02) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-mono">
                            {currentAirfoil.parameters.leading_edge_radius.toFixed(4)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Trailing Edge Angle</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${((currentAirfoil.parameters.trailing_edge_angle - 5) / 20) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-mono">
                            {currentAirfoil.parameters.trailing_edge_angle.toFixed(2)}°
                          </span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="latent" className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <pre className="text-sm font-mono whitespace-pre-wrap">
                        {getLatentVectorSummary(currentAirfoil.latentVector)}
                      </pre>
                    </div>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Latent Space Representation</AlertTitle>
                      <AlertDescription>
                        This 24-dimensional vector encodes the unique characteristics of the airfoil
                        in a compressed latent space. Each dimension influences different geometric
                        features through sinusoidal basis functions with random frequencies and phases.
                      </AlertDescription>
                    </Alert>
                  </TabsContent>

                  <TabsContent value="coordinates" className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="text-xs font-mono">
                        {currentAirfoil.coordinates
                          .map(p => `${p.x.toFixed(6)}  ${p.y.toFixed(6)}`)
                          .join('\n')}
                      </pre>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{currentAirfoil.coordinates.length} points</span>
                      <Button onClick={handleDownload} variant="outline" size="sm">
                        <Download className="w-3 h-3 mr-2" />
                        Export as .dat
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Initial State */}
        {!currentAirfoil && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Sparkles className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Airfoil Generated Yet</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Click the "Generate Random Airfoil" button above to create your first unique airfoil shape
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
