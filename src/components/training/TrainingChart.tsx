import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { TrainingSession } from '@/services/mlTrainer';

interface TrainingChartProps {
  session: TrainingSession | null;
}

export function TrainingChart({ session }: TrainingChartProps) {
  if (!session || session.results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Over Time</CardTitle>
          <CardDescription>L/D ratio progression during training</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            No training data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = session.results.map((result) => ({
    iteration: result.iteration,
    liftDragRatio: result.liftDragRatio,
    liftCoefficient: result.liftCoefficient * 100,
    dragCoefficient: result.dragCoefficient * 1000,
  }));

  const runningAverage = chartData.map((_, index) => {
    const slice = chartData.slice(0, index + 1);
    const avg = slice.reduce((sum, d) => sum + d.liftDragRatio, 0) / slice.length;
    return {
      iteration: chartData[index].iteration,
      average: avg,
    };
  });

  const combinedData = chartData.map((d, i) => ({
    ...d,
    average: runningAverage[i].average,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Over Time</CardTitle>
        <CardDescription>
          L/D ratio progression during training (Target: {session.config.targetLiftDragRatio})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="iteration"
              label={{ value: 'Iteration', position: 'insideBottom', offset: -5 }}
              className="text-xs"
            />
            <YAxis
              label={{ value: 'L/D Ratio', angle: -90, position: 'insideLeft' }}
              className="text-xs"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Legend />
            <ReferenceLine
              y={session.config.targetLiftDragRatio}
              stroke="hsl(var(--destructive))"
              strokeDasharray="5 5"
              label="Target"
            />
            <Line
              type="monotone"
              dataKey="liftDragRatio"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="L/D Ratio"
            />
            <Line
              type="monotone"
              dataKey="average"
              stroke="hsl(var(--secondary))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Running Average"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
