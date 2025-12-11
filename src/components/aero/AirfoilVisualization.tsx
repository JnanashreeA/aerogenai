/**
 * Airfoil Visualization Component
 * Renders airfoil coordinates as SVG
 */

import type { AeroPoint } from '@/types/aero';

interface AirfoilVisualizationProps {
  coordinates: AeroPoint[];
  width?: number;
  height?: number;
  showGrid?: boolean;
  showAxis?: boolean;
}

export function AirfoilVisualization({
  coordinates,
  width = 800,
  height = 300,
  showGrid = true,
  showAxis = true,
}: AirfoilVisualizationProps) {
  if (!coordinates || coordinates.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-muted/20 rounded"
        style={{ width, height }}
      >
        <p className="text-muted-foreground">No coordinates to display</p>
      </div>
    );
  }

  // Calculate bounds
  const xValues = coordinates.map(p => p.x);
  const yValues = coordinates.map(p => p.y);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  // Add padding
  const padding = 40;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  // Scale functions
  const xRange = maxX - minX;
  const yRange = maxY - minY;
  const scale = Math.min(plotWidth / xRange, plotHeight / yRange);

  const scaleX = (x: number) => padding + (x - minX) * scale;
  const scaleY = (y: number) => height - padding - (y - minY) * scale;

  // Generate path
  const pathData = coordinates
    .map((p, i) => {
      const x = scaleX(p.x);
      const y = scaleY(p.y);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ') + ' Z';

  // Grid lines
  const gridLines: React.ReactElement[] = [];
  if (showGrid) {
    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = padding + (plotWidth * i) / 10;
      gridLines.push(
        <line
          key={`v-${i}`}
          x1={x}
          y1={padding}
          x2={x}
          y2={height - padding}
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.1"
        />
      );
    }

    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
      const y = padding + (plotHeight * i) / 10;
      gridLines.push(
        <line
          key={`h-${i}`}
          x1={padding}
          y1={y}
          x2={width - padding}
          y2={y}
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.1"
        />
      );
    }
  }

  // Axis lines
  const axisLines: React.ReactElement[] = [];
  if (showAxis) {
    // X-axis (y=0)
    const y0 = scaleY(0);
    if (y0 >= padding && y0 <= height - padding) {
      axisLines.push(
        <line
          key="x-axis"
          x1={padding}
          y1={y0}
          x2={width - padding}
          y2={y0}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.3"
        />
      );
    }

    // Y-axis (x=0)
    const x0 = scaleX(0);
    if (x0 >= padding && x0 <= width - padding) {
      axisLines.push(
        <line
          key="y-axis"
          x1={x0}
          y1={padding}
          x2={x0}
          y2={height - padding}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.3"
        />
      );
    }
  }

  return (
    <svg
      width={width}
      height={height}
      className="w-full h-auto"
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* Background */}
      <rect width={width} height={height} fill="transparent" />

      {/* Grid */}
      {gridLines}

      {/* Axis */}
      {axisLines}

      {/* Airfoil shape */}
      <path
        d={pathData}
        fill="hsl(var(--primary) / 0.1)"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Leading edge marker */}
      {coordinates.length > 0 && (
        <circle
          cx={scaleX(coordinates[0].x)}
          cy={scaleY(coordinates[0].y)}
          r="4"
          fill="hsl(var(--primary))"
        />
      )}

      {/* Axis labels */}
      <text
        x={width - padding + 5}
        y={scaleY(0) + 5}
        fontSize="12"
        fill="currentColor"
        opacity="0.5"
      >
        x
      </text>
      <text
        x={scaleX(0) - 5}
        y={padding - 5}
        fontSize="12"
        fill="currentColor"
        opacity="0.5"
      >
        y
      </text>
    </svg>
  );
}
