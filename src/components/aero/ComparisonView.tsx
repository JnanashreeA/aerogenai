import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShapeVisualizer } from './ShapeVisualizer';
import { MetricsDisplay } from './MetricsDisplay';
import { PerformanceChart } from './PerformanceChart';
import type { AeroShape, AeroMetrics, PerformanceData, ComponentType } from '@/types/aero';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ComparisonViewProps {
  actualShape: AeroShape | null;
  generatedShape: AeroShape | null;
  actualMetrics: AeroMetrics | null;
  generatedMetrics: AeroMetrics | null;
  actualPerformance: PerformanceData | null;
  generatedPerformance: PerformanceData | null;
  type: ComponentType;
}

export function ComparisonView({
  actualShape,
  generatedShape,
  actualMetrics,
  generatedMetrics,
  actualPerformance,
  generatedPerformance,
  type,
}: ComparisonViewProps) {
  if (!actualShape && !generatedShape) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comparison View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-muted rounded border border-border flex items-center justify-center">
            <p className="text-muted-foreground">
              Upload an actual shape and generate a shape to compare
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const comparisonData = actualPerformance && generatedPerformance
    ? actualPerformance.angleOfAttack.map((aoa, index) => ({
        aoa,
        actualLift: actualPerformance.lift[index],
        generatedLift: generatedPerformance.lift[index],
        actualDrag: actualPerformance.drag[index],
        generatedDrag: generatedPerformance.drag[index],
        actualEfficiency: actualPerformance.efficiency[index],
        generatedEfficiency: generatedPerformance.efficiency[index],
      }))
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actual vs Generated Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="shapes" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="shapes">Shapes</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="overlay">Overlay</TabsTrigger>
          </TabsList>

          <TabsContent value="shapes" className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <ShapeVisualizer shape={actualShape} title="Actual Shape" />
              <ShapeVisualizer shape={generatedShape} title="Generated Shape" />
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <MetricsDisplay metrics={actualMetrics} type={type} title="Actual Metrics" />
              <MetricsDisplay metrics={generatedMetrics} type={type} title="Generated Metrics" />
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            {comparisonData.length > 0 ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Lift Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="aoa"
                          label={{ value: 'Angle of Attack (°)', position: 'insideBottom', offset: -5 }}
                          stroke="hsl(var(--foreground))"
                        />
                        <YAxis
                          label={{ value: 'Lift Coefficient', angle: -90, position: 'insideLeft' }}
                          stroke="hsl(var(--foreground))"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '4px',
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="actualLift"
                          stroke="hsl(var(--chart-2))"
                          strokeWidth={2}
                          dot={false}
                          name="Actual"
                        />
                        <Line
                          type="monotone"
                          dataKey="generatedLift"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={false}
                          name="Generated"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Drag Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="aoa"
                          label={{ value: 'Angle of Attack (°)', position: 'insideBottom', offset: -5 }}
                          stroke="hsl(var(--foreground))"
                        />
                        <YAxis
                          label={{ value: 'Drag Coefficient', angle: -90, position: 'insideLeft' }}
                          stroke="hsl(var(--foreground))"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '4px',
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="actualDrag"
                          stroke="hsl(var(--chart-2))"
                          strokeWidth={2}
                          dot={false}
                          name="Actual"
                        />
                        <Line
                          type="monotone"
                          dataKey="generatedDrag"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={false}
                          name="Generated"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Efficiency Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="aoa"
                          label={{ value: 'Angle of Attack (°)', position: 'insideBottom', offset: -5 }}
                          stroke="hsl(var(--foreground))"
                        />
                        <YAxis
                          label={{ value: 'L/D Ratio', angle: -90, position: 'insideLeft' }}
                          stroke="hsl(var(--foreground))"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '4px',
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="actualEfficiency"
                          stroke="hsl(var(--chart-2))"
                          strokeWidth={2}
                          dot={false}
                          name="Actual"
                        />
                        <Line
                          type="monotone"
                          dataKey="generatedEfficiency"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={false}
                          name="Generated"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="h-[400px] bg-muted rounded border border-border flex items-center justify-center">
                <p className="text-muted-foreground">
                  Run validation on both shapes to see performance comparison
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="overlay" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Shape Overlay</CardTitle>
              </CardHeader>
              <CardContent>
                {actualShape && generatedShape ? (
                  <div className="relative w-full h-[400px] bg-muted rounded border border-border">
                    <svg
                      viewBox="-0.1 -0.3 1.2 0.6"
                      className="w-full h-full"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <g>
                        <polyline
                          points={actualShape.points.map(p => `${p.x},${-p.y}`).join(' ')}
                          fill="none"
                          stroke="hsl(var(--chart-2))"
                          strokeWidth="0.004"
                          opacity="0.7"
                        />
                        <text x="0.05" y="-0.25" fontSize="0.03" fill="hsl(var(--chart-2))">
                          Actual
                        </text>
                      </g>
                      <g>
                        <polyline
                          points={generatedShape.points.map(p => `${p.x},${-p.y}`).join(' ')}
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="0.004"
                          opacity="0.7"
                        />
                        <text x="0.05" y="-0.22" fontSize="0.03" fill="hsl(var(--primary))">
                          Generated
                        </text>
                      </g>
                    </svg>
                  </div>
                ) : (
                  <div className="h-[400px] bg-muted rounded border border-border flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Both shapes required for overlay view
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
