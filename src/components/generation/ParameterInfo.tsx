/**
 * Parameter Information Component
 * Displays parameter specifications, recommendations, and warnings
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getParameterInfo, type ParameterSpec } from '@/services/parameterSpec';

interface ParameterInfoProps {
  parameterName: string;
  currentValue: number;
  compact?: boolean;
}

export function ParameterInfo({ parameterName, currentValue, compact = false }: ParameterInfoProps) {
  const spec = getParameterInfo(parameterName);

  if (!spec) {
    return null;
  }

  const inRange = currentValue >= spec.min && currentValue <= spec.max;
  const inRecommended = currentValue >= spec.recommended[0] && currentValue <= spec.recommended[1];

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        {inRecommended ? (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        )}
        <span className="text-muted-foreground">
          Recommended: {spec.recommended[0]} - {spec.recommended[1]}
        </span>
      </div>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              {spec.name}
            </CardTitle>
            <CardDescription className="mt-1">{spec.description}</CardDescription>
          </div>
          <Badge variant={inRecommended ? 'default' : 'secondary'}>
            {currentValue.toFixed(3)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Valid Range:</span>
            <span className="font-mono">
              {spec.min} - {spec.max}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Recommended:</span>
            <span className="font-mono">
              {spec.recommended[0]} - {spec.recommended[1]}
            </span>
          </div>
        </div>

        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-primary/30"
            style={{
              left: `${((spec.recommended[0] - spec.min) / (spec.max - spec.min)) * 100}%`,
              width: `${((spec.recommended[1] - spec.recommended[0]) / (spec.max - spec.min)) * 100}%`,
            }}
          />
          <div
            className="absolute h-full w-1 bg-primary"
            style={{
              left: `${((currentValue - spec.min) / (spec.max - spec.min)) * 100}%`,
            }}
          />
        </div>

        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
          <p className="font-medium mb-1">Effect:</p>
          <p>{spec.effect}</p>
        </div>

        {!inRecommended && spec.warning && (
          <Alert variant="default" className="border-yellow-500/50 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-sm">{spec.warning}</AlertDescription>
          </Alert>
        )}

        {!inRange && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Value outside valid range. Will be clamped to [{spec.min}, {spec.max}].
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Parameter Summary Component
 * Shows all parameters with status indicators
 */
interface ParameterSummaryProps {
  parameters: Record<string, number>;
}

export function ParameterSummary({ parameters }: ParameterSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Parameter Summary</CardTitle>
        <CardDescription>Current generation parameters and their status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(parameters).map(([key, value]) => {
            const spec = getParameterInfo(key);
            if (!spec) return null;

            const inRecommended = value >= spec.recommended[0] && value <= spec.recommended[1];

            return (
              <div key={key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-2">
                  {inRecommended ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className="text-sm font-medium">{spec.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    ({spec.recommended[0]} - {spec.recommended[1]})
                  </span>
                  <span className="font-mono text-sm">{value.toFixed(3)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
