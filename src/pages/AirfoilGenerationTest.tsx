import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { MLShapeGenerator } from '@/services/mlShapeGenerator';
import { XFoilValidator } from '@/services/xfoilValidator';
import type { AeroShape, GenerationParams } from '@/types/aero';

interface TestResult {
  id: string;
  name: string;
  params: GenerationParams;
  shape: AeroShape;
  performance: {
    maxLD: number;
    avgLD: number;
    minLD: number;
    maxCl: number;
    minCd: number;
  };
  success: boolean;
}

export default function AirfoilGenerationTest() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const testConfigurations: Array<{ name: string; params: GenerationParams }> = [
    // Conservative High-Performance Designs
    {
      name: 'Ultra-Efficient (Low Temp)',
      params: { type: 'airfoil', temperature: 0.2, thickness: 0.10, camber: 0.025, smoothness: 0.95, complexity: 60, latentDimension: 128 },
    },
    {
      name: 'High-Performance (Low Temp)',
      params: { type: 'airfoil', temperature: 0.35, thickness: 0.105, camber: 0.027, smoothness: 0.92, complexity: 55, latentDimension: 128 },
    },
    {
      name: 'Optimized Thin (Low Temp)',
      params: { type: 'airfoil', temperature: 0.25, thickness: 0.095, camber: 0.023, smoothness: 0.94, complexity: 58, latentDimension: 128 },
    },

    // Balanced Performance Designs
    {
      name: 'Balanced Standard',
      params: { type: 'airfoil', temperature: 0.55, thickness: 0.11, camber: 0.028, smoothness: 0.88, complexity: 52, latentDimension: 128 },
    },
    {
      name: 'Balanced Moderate',
      params: { type: 'airfoil', temperature: 0.65, thickness: 0.12, camber: 0.030, smoothness: 0.86, complexity: 50, latentDimension: 128 },
    },
    {
      name: 'Balanced Thick',
      params: { type: 'airfoil', temperature: 0.60, thickness: 0.125, camber: 0.032, smoothness: 0.87, complexity: 51, latentDimension: 128 },
    },

    // Robust High-Variety Designs
    {
      name: 'Robust Standard',
      params: { type: 'airfoil', temperature: 0.75, thickness: 0.12, camber: 0.032, smoothness: 0.84, complexity: 50, latentDimension: 128 },
    },
    {
      name: 'Robust High-Lift',
      params: { type: 'airfoil', temperature: 0.82, thickness: 0.13, camber: 0.035, smoothness: 0.82, complexity: 48, latentDimension: 128 },
    },
    {
      name: 'Robust Thick',
      params: { type: 'airfoil', temperature: 0.88, thickness: 0.14, camber: 0.038, smoothness: 0.80, complexity: 50, latentDimension: 128 },
    },

    // Extreme Performance Tests
    {
      name: 'Maximum Efficiency',
      params: { type: 'airfoil', temperature: 0.15, thickness: 0.098, camber: 0.024, smoothness: 0.97, complexity: 65, latentDimension: 128 },
    },
    {
      name: 'High Camber Test',
      params: { type: 'airfoil', temperature: 0.70, thickness: 0.115, camber: 0.040, smoothness: 0.85, complexity: 52, latentDimension: 128 },
    },
    {
      name: 'Thin Airfoil Test',
      params: { type: 'airfoil', temperature: 0.40, thickness: 0.085, camber: 0.020, smoothness: 0.90, complexity: 55, latentDimension: 128 },
    },
  ];

  const generateAllAirfoils = async () => {
    setIsGenerating(true);
    setResults([]);
    setProgress({ current: 0, total: testConfigurations.length });

    const newResults: TestResult[] = [];

    for (let i = 0; i < testConfigurations.length; i++) {
      const config = testConfigurations[i];
      setProgress({ current: i + 1, total: testConfigurations.length });

      try {
        // Generate airfoil
        const shape = await MLShapeGenerator.generateAirfoilFromRealData(config.params);

        // Analyze with XFoil
        const analysis = await XFoilValidator.runXFoilAnalysis(shape.points);

        // Extract performance metrics
        const ldRatios = analysis.clcd;
        const clValues = analysis.cl;
        const cdValues = analysis.cd;

        const performance = {
          maxLD: Math.max(...ldRatios),
          avgLD: ldRatios.reduce((a, b) => a + b, 0) / ldRatios.length,
          minLD: Math.min(...ldRatios),
          maxCl: Math.max(...clValues),
          minCd: Math.min(...cdValues),
        };

        const success = performance.minLD > 50;

        newResults.push({
          id: shape.id,
          name: config.name,
          params: config.params,
          shape,
          performance,
          success,
        });
      } catch (error) {
        console.error(`Failed to generate ${config.name}:`, error);
        newResults.push({
          id: `error-${i}`,
          name: config.name,
          params: config.params,
          shape: {} as AeroShape,
          performance: {
            maxLD: 0,
            avgLD: 0,
            minLD: 0,
            maxCl: 0,
            minCd: 0,
          },
          success: false,
        });
      }
    }

    setResults(newResults);
    setIsGenerating(false);
  };

  const successCount = results.filter(r => r.success).length;
  const successRate = results.length > 0 ? (successCount / results.length) * 100 : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">High-Performance Airfoil Generation Test</h1>
          <p className="text-muted-foreground mt-2">
            Generate multiple airfoil designs with guaranteed L/D &gt; 50
          </p>
        </div>
        <Button
          onClick={generateAllAirfoils}
          disabled={isGenerating}
          size="lg"
          className="gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating {progress.current}/{progress.total}
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Generate All Airfoils
            </>
          )}
        </Button>
      </div>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Summary</CardTitle>
            <CardDescription>
              Overall performance across all generated airfoils
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{results.length}</div>
                <div className="text-sm text-muted-foreground">Total Designs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{successCount}</div>
                <div className="text-sm text-muted-foreground">L/D &gt; 50</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {successRate.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {results.length > 0
                    ? (results.reduce((sum, r) => sum + r.performance.avgLD, 0) / results.length).toFixed(1)
                    : '0'}
                </div>
                <div className="text-sm text-muted-foreground">Avg L/D</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {results.map((result, index) => (
          <Card key={result.id} className={result.success ? 'border-green-500' : 'border-red-500'}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {result.success ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  )}
                  <div>
                    <CardTitle className="text-lg">
                      {index + 1}. {result.name}
                    </CardTitle>
                    <CardDescription>
                      Temperature: {result.params.temperature?.toFixed(2)} | Thickness:{' '}
                      {((result.params.thickness || 0) * 100).toFixed(1)}% | Camber:{' '}
                      {((result.params.camber || 0) * 100).toFixed(1)}%
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={result.success ? 'default' : 'destructive'} className="text-lg px-4 py-1">
                  {result.success ? '✓ PASS' : '✗ FAIL'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {result.performance.maxLD.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Max L/D</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {result.performance.avgLD.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Avg L/D</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {result.performance.minLD.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Min L/D</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {result.performance.maxCl.toFixed(3)}
                  </div>
                  <div className="text-xs text-muted-foreground">Max Cl</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-pink-600">
                    {result.performance.minCd.toFixed(4)}
                  </div>
                  <div className="text-xs text-muted-foreground">Min Cd</div>
                </div>
              </div>

              {result.success && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✓ This design meets the L/D &gt; 50 requirement across all tested conditions
                    (AoA: -2° to 8°)
                  </p>
                </div>
              )}

              {!result.success && result.performance.minLD > 0 && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    ✗ Minimum L/D ({result.performance.minLD.toFixed(1)}) is below the required
                    threshold of 50
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {isGenerating && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Generating Airfoils...</CardTitle>
              <CardDescription>
                Progress: {progress.current} / {progress.total}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {progress.current > 0 && testConfigurations[progress.current - 1]?.name}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
