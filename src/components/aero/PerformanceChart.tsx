import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { PerformanceData } from '@/types/aero';

interface PerformanceChartProps {
  data: PerformanceData | null;
  title?: string;
}

export function PerformanceChart({ data, title = 'Performance Analysis' }: PerformanceChartProps) {
  const chartData = data
    ? data.angleOfAttack.map((aoa, index) => ({
        aoa: aoa.toFixed(1),
        lift: data.lift[index].toFixed(3),
        drag: data.drag[index].toFixed(3),
        efficiency: data.efficiency[index].toFixed(2),
      }))
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="aoa"
                label={{ value: 'Angle of Attack (°)', position: 'insideBottom', offset: -5 }}
                stroke="hsl(var(--foreground))"
              />
              <YAxis stroke="hsl(var(--foreground))" />
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
                dataKey="lift"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
                name="Lift Coefficient"
              />
              <Line
                type="monotone"
                dataKey="drag"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--destructive))' }}
                name="Drag Coefficient"
              />
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-2))' }}
                name="L/D Ratio"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-[300px] bg-muted rounded border border-border flex items-center justify-center">
            <p className="text-muted-foreground">No performance data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
