import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AeroMetrics, ComponentType } from '@/types/aero';
import { Wind, TrendingUp, Gauge, Zap } from 'lucide-react';

interface MetricsDisplayProps {
  metrics: AeroMetrics | null;
  type: ComponentType;
  title?: string;
}

export function MetricsDisplay({ metrics, type, title = 'Aerodynamic Metrics' }: MetricsDisplayProps) {
  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            No metrics available. Generate or validate a shape first.
          </div>
        </CardContent>
      </Card>
    );
  }

  const getMetricItems = () => {
    switch (type) {
      case 'airfoil':
        return [
          {
            label: 'Lift Coefficient',
            value: metrics.lift?.toFixed(4) || 'N/A',
            icon: TrendingUp,
            color: 'text-primary',
          },
          {
            label: 'Drag Coefficient',
            value: metrics.drag?.toFixed(4) || 'N/A',
            icon: Wind,
            color: 'text-destructive',
          },
          {
            label: 'L/D Ratio',
            value: metrics.liftToDragRatio?.toFixed(2) || 'N/A',
            icon: Gauge,
            color: 'text-chart-2',
          },
          {
            label: 'Efficiency Score',
            value: metrics.efficiency?.toFixed(2) || 'N/A',
            icon: Zap,
            color: 'text-chart-5',
          },
        ];
      case 'winglet':
        return [
          {
            label: 'Lift Coefficient',
            value: metrics.lift?.toFixed(4) || 'N/A',
            icon: TrendingUp,
            color: 'text-orange-500',
          },
          {
            label: 'Drag Coefficient',
            value: metrics.drag?.toFixed(4) || 'N/A',
            icon: Wind,
            color: 'text-destructive',
          },
          {
            label: 'L/D Ratio',
            value: metrics.liftToDragRatio?.toFixed(2) || 'N/A',
            icon: Gauge,
            color: 'text-chart-2',
          },
          {
            label: 'Efficiency Score',
            value: metrics.efficiency?.toFixed(2) || 'N/A',
            icon: Zap,
            color: 'text-chart-5',
          },
        ];
      case 'sidepod':
        return [
          {
            label: 'Drag Coefficient',
            value: metrics.drag?.toFixed(4) || 'N/A',
            icon: Wind,
            color: 'text-destructive',
          },
          {
            label: 'Cooling Efficiency',
            value: metrics.coolingEfficiency?.toFixed(3) || 'N/A',
            icon: Gauge,
            color: 'text-green-500',
          },
          {
            label: 'Efficiency Score',
            value: metrics.efficiency?.toFixed(2) || 'N/A',
            icon: Zap,
            color: 'text-chart-5',
          },
        ];
      case 'diffuser':
        return [
          {
            label: 'Downforce Coefficient',
            value: metrics.downforce?.toFixed(4) || 'N/A',
            icon: TrendingUp,
            color: 'text-purple-500',
          },
          {
            label: 'Drag Coefficient',
            value: metrics.drag?.toFixed(4) || 'N/A',
            icon: Wind,
            color: 'text-destructive',
          },
          {
            label: 'Efficiency Score',
            value: metrics.efficiency?.toFixed(2) || 'N/A',
            icon: Zap,
            color: 'text-chart-5',
          },
        ];
      default:
        return [];
    }
  };

  const metricItems = getMetricItems();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {metricItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded border border-border bg-muted/30"
              >
                <div className={`${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-xl font-mono font-semibold">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
