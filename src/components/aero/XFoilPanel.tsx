import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle2, XCircle } from 'lucide-react';

interface XFoilPanelProps {
  onRunXFoil: () => void;
  isRunning?: boolean;
  hasShape: boolean;
  classification?: 'good' | 'poor' | null;
  liftToDragRatio?: number;
}

export function XFoilPanel({
  onRunXFoil,
  isRunning = false,
  hasShape,
  classification,
  liftToDragRatio,
}: XFoilPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          XFoil Analysis
          {classification && (
            <Badge
              variant={classification === 'good' ? 'default' : 'destructive'}
              className="ml-auto"
            >
              {classification === 'good' ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Good
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 mr-1" />
                  Poor
                </>
              )}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 border-solid border-[#e5dcdeff] border-[0px] border-[#f01f4dff]">
        <div className="text-sm text-muted-foreground">
          <p>Run advanced XFoil analysis for high-fidelity aerodynamic validation.</p>

        </div>

        {liftToDragRatio !== undefined && (
          <div className="p-3 bg-muted/30 rounded border border-border">
            <p className="text-sm font-semibold text-foreground">Performance Classification</p>
            <p className="text-lg font-mono font-bold mt-1">
              L/D Ratio: {liftToDragRatio.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Threshold: L/D {'>'} 50 = Good, L/D ≤ 50 = Poor
            </p>
          </div>
        )}

        <Button
          onClick={onRunXFoil}
          disabled={!hasShape || isRunning}
          className="w-full bg-[#bc124de6] bg-none"
          size="lg"
        >
          {isRunning ? (
            <>
              <Play className="w-4 h-4 mr-2 animate-pulse" />
              Running XFoil...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Run XFoil Analysis
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
