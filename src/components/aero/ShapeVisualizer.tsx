import { useMemo } from 'react';
import type { AeroShape } from '@/types/aero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ShapeVisualizerProps {
  shape: AeroShape | null;
  title?: string;
}

export function ShapeVisualizer({ shape, title = 'Shape Preview' }: ShapeVisualizerProps) {
  const svgPath = useMemo(() => {
    if (!shape || shape.points.length === 0) return '';

    const points = shape.points;
    const padding = 20;
    const width = 600;
    const height = 300;

    const xValues = points.map(p => p.x);
    const yValues = points.map(p => p.y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    const xRange = maxX - minX || 1;
    const yRange = maxY - minY || 1;

    const scaleX = (width - 2 * padding) / xRange;
    const scaleY = (height - 2 * padding) / yRange;
    const scale = Math.min(scaleX, scaleY);

    const centerX = width / 2;
    const centerY = height / 2;
    const shapeWidth = xRange * scale;
    const shapeHeight = yRange * scale;

    const transformedPoints = points.map(p => ({
      x: centerX - shapeWidth / 2 + (p.x - minX) * scale,
      y: centerY + shapeHeight / 2 - (p.y - minY) * scale,
    }));

    const pathData = transformedPoints
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(' ') + ' Z';

    return pathData;
  }, [shape]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {shape ? (
          <div className="w-full bg-muted rounded border border-border">
            <svg
              width="100%"
              height="300"
              viewBox="0 0 600 300"
              className="w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="shapeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              <g>
                <path
                  d={svgPath}
                  fill="url(#shapeGradient)"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
              </g>

              <line
                x1="50"
                y1="150"
                x2="550"
                y2="150"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1"
                strokeDasharray="5,5"
                opacity="0.3"
              />
            </svg>
          </div>
        ) : (
          <div className="w-full h-[300px] bg-muted rounded border border-border flex items-center justify-center">
            <p className="text-muted-foreground">No shape to display</p>
          </div>
        )}
        {shape && (
          <div className="mt-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{shape.name}</p>
            <p className="mt-1">
              Type: <span className="capitalize">{shape.type}</span>
            </p>
            <p>Points: {shape.points.length}</p>
            <p>Generated: {shape.isGenerated ? 'Yes' : 'No'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
