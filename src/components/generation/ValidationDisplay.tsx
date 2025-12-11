/**
 * Validation Display Component
 * Shows geometry validation results and quality metrics
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import type { ValidationResult } from '@/services/geometryValidator';

interface ValidationDisplayProps {
  validation: ValidationResult;
  compact?: boolean;
}

export function ValidationDisplay({ validation, compact = false }: ValidationDisplayProps) {
  const { valid, issues, metrics, score } = validation;

  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');
  const infos = issues.filter(i => i.severity === 'info');

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {valid ? (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Valid
          </Badge>
        ) : (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Invalid
          </Badge>
        )}
        <span className="text-sm text-muted-foreground">
          Quality: {(score * 100).toFixed(0)}%
        </span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              {valid ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Geometry Validation
            </CardTitle>
            <CardDescription className="mt-1">
              {valid ? 'Shape passed all validation checks' : 'Shape has validation issues'}
            </CardDescription>
          </div>
          <Badge variant={valid ? 'default' : 'destructive'} className="text-sm">
            {valid ? 'Valid' : 'Invalid'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Quality Score</span>
            <span className="font-mono font-medium">{(score * 100).toFixed(1)}%</span>
          </div>
          <Progress value={score * 100} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Continuity</p>
            <div className="flex items-center gap-2">
              <Progress value={metrics.continuityScore * 100} className="h-1.5 flex-1" />
              <span className="text-xs font-mono">{(metrics.continuityScore * 100).toFixed(0)}%</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Smoothness</p>
            <div className="flex items-center gap-2">
              <Progress value={metrics.smoothnessScore * 100} className="h-1.5 flex-1" />
              <span className="text-xs font-mono">{(metrics.smoothnessScore * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-red-500">Errors ({errors.length})</p>
            {errors.map((issue, idx) => (
              <Alert key={idx} variant="destructive" className="py-2">
                <XCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{issue.message}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {warnings.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-yellow-600">Warnings ({warnings.length})</p>
            {warnings.map((issue, idx) => (
              <Alert key={idx} variant="default" className="py-2 border-yellow-500/50 bg-yellow-500/10">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <AlertDescription className="text-sm">{issue.message}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {infos.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-blue-600">Information ({infos.length})</p>
            {infos.map((issue, idx) => (
              <Alert key={idx} variant="default" className="py-2 border-blue-500/50 bg-blue-500/10">
                <Info className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-sm">{issue.message}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Geometry Metrics Display
 */
interface MetricsDisplayProps {
  metrics: ValidationResult['metrics'];
}

export function MetricsDisplay({ metrics }: MetricsDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Geometry Metrics</CardTitle>
        <CardDescription>Detailed shape measurements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <MetricItem label="Chord Length" value={metrics.chordLength.toFixed(4)} />
          <MetricItem label="Max Thickness" value={`${(metrics.maxThickness * 100).toFixed(2)}%`} />
          <MetricItem label="Thickness Location" value={`${(metrics.maxThicknessLocation * 100).toFixed(1)}%`} />
          <MetricItem label="Max Camber" value={`${(Math.abs(metrics.maxCamber) * 100).toFixed(2)}%`} />
          <MetricItem label="Camber Location" value={`${(metrics.maxCamberLocation * 100).toFixed(1)}%`} />
          <MetricItem label="LE Radius" value={metrics.leadingEdgeRadius.toFixed(4)} />
          <MetricItem label="TE Angle" value={`${metrics.trailingEdgeAngle.toFixed(1)}°`} />
          <MetricItem label="Surface Area" value={metrics.surfaceArea.toFixed(4)} />
        </div>
      </CardContent>
    </Card>
  );
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-mono text-sm font-medium">{value}</p>
    </div>
  );
}
