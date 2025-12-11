import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, RotateCw } from 'lucide-react';

interface ValidationPanelProps {
  onValidate: () => void;
  onReset: () => void;
  isValidating?: boolean;
  hasShape: boolean;
}

export function ValidationPanel({ onValidate, onReset, isValidating = false, hasShape }: ValidationPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={onValidate}
          disabled={!hasShape || isValidating}
          className="w-full bg-[#eb0d61e6] bg-none"
          size="lg"
        >
          {isValidating ? (
            <>
              <RotateCw className="w-4 h-4 mr-2 animate-spin" />
              Validating...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Validate Design
            </>
          )}
        </Button>

        <Button
          onClick={onReset}
          variant="outline"
          className="w-full bg-[#e8194ce6] bg-none"
          size="lg"
        >
          <RotateCw className="w-4 h-4 mr-2" />
          Reset Analysis
        </Button>
      </CardContent>
    </Card>
  );
}
