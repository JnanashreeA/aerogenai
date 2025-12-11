import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { ROCData } from '@/types/aero';

interface ROCCurveChartProps {
  data: ROCData | null;
  title?: string;
}

export function ROCCurveChart({ data, title = 'ROC Curve - Model Performance' }: ROCCurveChartProps) {
  const chartData = data
    ? data.fpr.map((fpr, index) => ({
        fpr: fpr.toFixed(3),
        tpr: data.tpr[index].toFixed(3),
      }))
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{title}</span>
          {data && (
            <span className="text-sm font-mono font-normal">
              AUC: <span className="font-bold text-primary">{data.auc.toFixed(3)}</span>
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="fpr"
                label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5 }}
                stroke="hsl(var(--foreground))"
              />
              <YAxis
                label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft' }}
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
                segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="5 5"
                label="Random Classifier"
              />
              <Line
                type="monotone"
                dataKey="tpr"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={false}
                name="ROC Curve"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-[300px] bg-muted rounded border border-border flex items-center justify-center">
            <p className="text-muted-foreground">No ROC data available</p>
          </div>
        )}
        {data && (
          <div className="mt-4 p-3 bg-muted/30 rounded border border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Model Quality:</span>{' '}
              {data.auc >= 0.9
                ? 'Excellent (AUC ≥ 0.9)'
                : data.auc >= 0.8
                ? 'Good (AUC ≥ 0.8)'
                : data.auc >= 0.7
                ? 'Fair (AUC ≥ 0.7)'
                : 'Poor (AUC < 0.7)'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
