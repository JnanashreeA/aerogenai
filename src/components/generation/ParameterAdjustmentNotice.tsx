import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface ParameterAdjustment {
  parameter: string;
  original: number | string;
  adjusted: number | string;
  reason: string;
}

interface ParameterAdjustmentNoticeProps {
  adjustments: ParameterAdjustment[];
}

export default function ParameterAdjustmentNotice({ adjustments }: ParameterAdjustmentNoticeProps) {
  if (adjustments.length === 0) return null;

  return (
    <Alert className="mb-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertTitle className="text-blue-900 dark:text-blue-100">
        Parameters Automatically Optimized for L/D &gt; 50
      </AlertTitle>
      <AlertDescription className="text-blue-800 dark:text-blue-200">
        <p className="mb-2">
          Some parameters were adjusted to guarantee high-performance airfoils:
        </p>
        <ul className="space-y-1 text-sm">
          {adjustments.map((adj, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="font-medium">{adj.parameter}:</span>
              <span>
                {adj.original} → {adj.adjusted}
              </span>
              <span className="text-muted-foreground">({adj.reason})</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">
          These adjustments ensure optimal aerodynamic performance. To use extreme parameters,
          consider the ML Training system which provides more experimental options.
        </p>
      </AlertDescription>
    </Alert>
  );
}
