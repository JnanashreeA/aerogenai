import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { PerformanceData } from '@/types/aero';

interface AUCCurveChartProps {
  data: PerformanceData | null;
  title?: string;
}

export function AUCCurveChart({ data, title = 'Performance AUC Analysis' }: AUCCurveChartProps) {
  if (!data || data.lift.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted rounded border border-border flex items-center justify-center">
            <p className="text-muted-foreground">No performance data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.angleOfAttack.map((aoa, index) => ({
    aoa,
    lift: data.lift[index],
    drag: data.drag[index],
    efficiency: data.efficiency[index],
  }));

  const calculateAUC = (xValues: number[], yValues: number[]): number => {
    let auc = 0;
    for (let i = 1; i < xValues.length; i++) {
      const dx = xValues[i] - xValues[i - 1];
      const avgY = (yValues[i] + yValues[i - 1]) / 2;
      auc += dx * avgY;
    }
    return auc;
  };

  const liftAUC = calculateAUC(data.angleOfAttack, data.lift);
  const dragAUC = calculateAUC(data.angleOfAttack, data.drag);
  const efficiencyAUC = calculateAUC(data.angleOfAttack, data.efficiency);

  const maxLift = Math.max(...data.lift);
  const maxEfficiency = Math.max(...data.efficiency);
  const optimalAoA = data.angleOfAttack[data.efficiency.indexOf(maxEfficiency)];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="p-4 rounded border border-border bg-muted/30">
            <p className="text-sm text-muted-foreground">Lift AUC</p>
            <p className="text-2xl font-mono font-semibold text-primary">
              {liftAUC.toFixed(3)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Total lift generation capacity
            </p>
          </div>

          <div className="p-4 rounded border border-border bg-muted/30">
            <p className="text-sm text-muted-foreground">Drag AUC</p>
            <p className="text-2xl font-mono font-semibold text-chart-3">
              {dragAUC.toFixed(3)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Total drag accumulation
            </p>
          </div>

          <div className="p-4 rounded border border-border bg-muted/30">
            <p className="text-sm text-muted-foreground">Efficiency AUC</p>
            <p className="text-2xl font-mono font-semibold text-chart-1">
              {efficiencyAUC.toFixed(3)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Overall performance metric
            </p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="aoa"
              label={{ value: 'Angle of Attack (°)', position: 'insideBottom', offset: -5 }}
              stroke="hsl(var(--foreground))"
            />
            <YAxis
              label={{ value: 'Coefficient', angle: -90, position: 'insideLeft' }}
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
            <ReferenceLine
              x={optimalAoA}
              stroke="hsl(var(--chart-4))"
              strokeDasharray="5 5"
              label={{ value: 'Optimal', position: 'top' }}
            />
            <Line
              type="monotone"
              dataKey="lift"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              name="Lift"
            />
            <Line
              type="monotone"
              dataKey="drag"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              dot={false}
              name="Drag"
            />
            <Line
              type="monotone"
              dataKey="efficiency"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
              name="L/D Ratio"
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 text-sm">
          <div className="p-3 rounded border border-border bg-muted/20">
            <p className="font-semibold text-foreground">Peak Performance</p>
            <p className="text-muted-foreground mt-1">
              Max Lift: <span className="font-mono text-primary">{maxLift.toFixed(3)}</span>
            </p>
            <p className="text-muted-foreground">
              Max L/D: <span className="font-mono text-chart-1">{maxEfficiency.toFixed(2)}</span>
            </p>
            <p className="text-muted-foreground">
              Optimal AoA: <span className="font-mono text-chart-4">{optimalAoA.toFixed(1)}°</span>
            </p>
          </div>

          <div className="p-3 rounded border border-border bg-muted/20">
            <p className="font-semibold text-foreground">Performance Metrics</p>
            <p className="text-muted-foreground mt-1">
              Lift/Drag Ratio: <span className="font-mono">{(liftAUC / dragAUC).toFixed(2)}</span>
            </p>
            <p className="text-muted-foreground">
              Operating Range: <span className="font-mono">{data.angleOfAttack[0]}° to {data.angleOfAttack[data.angleOfAttack.length - 1]}°</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
