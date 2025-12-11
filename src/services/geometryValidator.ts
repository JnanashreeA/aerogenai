/**
 * Geometry Validation Pipeline
 * Validates aerodynamic shapes for physical plausibility and manufacturability
 */

import type { AeroPoint } from '@/types/aero';

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  metrics: GeometryMetrics;
  score: number; // 0-1, overall quality score
}

export interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  type: string;
  message: string;
  location?: { x: number; y: number };
}

export interface GeometryMetrics {
  chordLength: number;
  maxThickness: number;
  maxThicknessLocation: number;
  maxCamber: number;
  maxCamberLocation: number;
  leadingEdgeRadius: number;
  trailingEdgeAngle: number;
  surfaceArea: number;
  continuityScore: number; // 0-1
  smoothnessScore: number; // 0-1
}

/**
 * Main validation pipeline
 */
export function validateGeometry(points: AeroPoint[]): ValidationResult {
  const issues: ValidationIssue[] = [];
  
  // Run all validation checks
  issues.push(...checkSelfIntersection(points));
  issues.push(...checkContinuity(points));
  issues.push(...checkPhysicalPlausibility(points));
  issues.push(...checkManufacturability(points));
  
  // Calculate metrics
  const metrics = calculateMetrics(points);
  
  // Determine if valid (no errors)
  const valid = !issues.some(issue => issue.severity === 'error');
  
  // Calculate overall quality score
  const score = calculateQualityScore(issues, metrics);
  
  return { valid, issues, metrics, score };
}

/**
 * Check for self-intersecting line segments
 */
function checkSelfIntersection(points: AeroPoint[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = i + 2; j < points.length - 1; j++) {
      // Skip adjacent segments
      if (Math.abs(i - j) <= 1) continue;
      
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[j];
      const p4 = points[j + 1];
      
      if (segmentsIntersect(p1, p2, p3, p4)) {
        issues.push({
          severity: 'error',
          type: 'self-intersection',
          message: `Self-intersection detected between segments ${i}-${i+1} and ${j}-${j+1}`,
          location: { x: (p1.x + p3.x) / 2, y: (p1.y + p3.y) / 2 },
        });
      }
    }
  }
  
  return issues;
}

/**
 * Check if two line segments intersect
 */
function segmentsIntersect(
  p1: AeroPoint,
  p2: AeroPoint,
  p3: AeroPoint,
  p4: AeroPoint
): boolean {
  const d1 = direction(p3, p4, p1);
  const d2 = direction(p3, p4, p2);
  const d3 = direction(p1, p2, p3);
  const d4 = direction(p1, p2, p4);
  
  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
      ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
    return true;
  }
  
  return false;
}

function direction(p1: AeroPoint, p2: AeroPoint, p3: AeroPoint): number {
  return (p3.x - p1.x) * (p2.y - p1.y) - (p2.x - p1.x) * (p3.y - p1.y);
}

/**
 * Check continuity and smoothness
 */
function checkContinuity(points: AeroPoint[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  for (let i = 1; i < points.length - 1; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    
    // Check for sudden jumps
    const dist1 = distance(p0, p1);
    const dist2 = distance(p1, p2);
    const avgDist = (dist1 + dist2) / 2;
    
    if (dist1 > avgDist * 3 || dist2 > avgDist * 3) {
      issues.push({
        severity: 'warning',
        type: 'discontinuity',
        message: `Large gap detected at point ${i}`,
        location: { x: p1.x, y: p1.y },
      });
    }
    
    // Check for sharp angles
    const angle = calculateAngle(p0, p1, p2);
    if (angle < 30) {
      issues.push({
        severity: 'warning',
        type: 'sharp-angle',
        message: `Sharp angle (${angle.toFixed(1)}°) at point ${i}`,
        location: { x: p1.x, y: p1.y },
      });
    }
  }
  
  return issues;
}

function distance(p1: AeroPoint, p2: AeroPoint): number {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

function calculateAngle(p0: AeroPoint, p1: AeroPoint, p2: AeroPoint): number {
  const v1 = { x: p0.x - p1.x, y: p0.y - p1.y };
  const v2 = { x: p2.x - p1.x, y: p2.y - p1.y };
  
  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
  const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);
  
  const cosAngle = dot / (mag1 * mag2);
  return Math.acos(Math.max(-1, Math.min(1, cosAngle))) * (180 / Math.PI);
}

/**
 * Check physical plausibility for aerodynamic shapes
 */
function checkPhysicalPlausibility(points: AeroPoint[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  // Check for closed trailing edge
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const teGap = distance(firstPoint, lastPoint);
  
  if (teGap > 0.01) {
    issues.push({
      severity: 'warning',
      type: 'open-trailing-edge',
      message: `Trailing edge not closed (gap: ${(teGap * 100).toFixed(2)}%)`,
      location: { x: lastPoint.x, y: lastPoint.y },
    });
  }
  
  // Check for reasonable thickness distribution
  const metrics = calculateMetrics(points);
  
  if (metrics.maxThickness < 0.04) {
    issues.push({
      severity: 'warning',
      type: 'too-thin',
      message: `Very thin airfoil (${(metrics.maxThickness * 100).toFixed(1)}%) may lack structural strength`,
    });
  }
  
  if (metrics.maxThickness > 0.20) {
    issues.push({
      severity: 'warning',
      type: 'too-thick',
      message: `Very thick airfoil (${(metrics.maxThickness * 100).toFixed(1)}%) may have high drag`,
    });
  }
  
  // Check leading edge radius
  if (metrics.leadingEdgeRadius < 0.001) {
    issues.push({
      severity: 'error',
      type: 'sharp-leading-edge',
      message: 'Leading edge too sharp - not physically realistic',
    });
  }
  
  return issues;
}

/**
 * Check manufacturability
 */
function checkManufacturability(points: AeroPoint[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  // Check for extreme curvature
  for (let i = 2; i < points.length - 2; i++) {
    const p0 = points[i - 2];
    const p1 = points[i - 1];
    const p2 = points[i];
    const p3 = points[i + 1];
    const p4 = points[i + 2];
    
    const curvature = estimateCurvature(p0, p1, p2, p3, p4);
    
    if (Math.abs(curvature) > 50) {
      issues.push({
        severity: 'warning',
        type: 'high-curvature',
        message: `High curvature at point ${i} may be difficult to manufacture`,
        location: { x: p2.x, y: p2.y },
      });
    }
  }
  
  return issues;
}

function estimateCurvature(
  p0: AeroPoint,
  p1: AeroPoint,
  p2: AeroPoint,
  p3: AeroPoint,
  p4: AeroPoint
): number {
  // Simple curvature estimation using 5-point stencil
  const dx = (p4.x - p0.x) / 4;
  const dy = (p4.y - p0.y) / 4;
  
  if (dx === 0) return 0;
  
  const d2y = (p0.y - 2 * p2.y + p4.y) / (dx * dx);
  return Math.abs(d2y);
}

/**
 * Calculate comprehensive geometry metrics
 */
function calculateMetrics(points: AeroPoint[]): GeometryMetrics {
  // Chord length (x-extent)
  const xValues = points.map(p => p.x);
  const chordLength = Math.max(...xValues) - Math.min(...xValues);
  
  // Find upper and lower surfaces
  const midIndex = Math.floor(points.length / 2);
  const upperSurface = points.slice(0, midIndex);
  const lowerSurface = points.slice(midIndex).reverse();
  
  // Calculate thickness distribution
  let maxThickness = 0;
  let maxThicknessLocation = 0;
  
  const minLength = Math.min(upperSurface.length, lowerSurface.length);
  for (let i = 0; i < minLength; i++) {
    const thickness = Math.abs(upperSurface[i].y - lowerSurface[i].y);
    if (thickness > maxThickness) {
      maxThickness = thickness;
      maxThicknessLocation = upperSurface[i].x;
    }
  }
  
  // Calculate camber line
  let maxCamber = 0;
  let maxCamberLocation = 0;
  
  for (let i = 0; i < minLength; i++) {
    const camber = (upperSurface[i].y + lowerSurface[i].y) / 2;
    if (Math.abs(camber) > Math.abs(maxCamber)) {
      maxCamber = camber;
      maxCamberLocation = upperSurface[i].x;
    }
  }
  
  // Leading edge radius (approximate)
  const leadingEdgeRadius = estimateLeadingEdgeRadius(points);
  
  // Trailing edge angle
  const trailingEdgeAngle = estimateTrailingEdgeAngle(points);
  
  // Surface area (approximate)
  let surfaceArea = 0;
  for (let i = 0; i < points.length - 1; i++) {
    surfaceArea += distance(points[i], points[i + 1]);
  }
  
  // Continuity score (based on segment length variation)
  const continuityScore = calculateContinuityScore(points);
  
  // Smoothness score (based on angle variation)
  const smoothnessScore = calculateSmoothnessScore(points);
  
  return {
    chordLength,
    maxThickness,
    maxThicknessLocation,
    maxCamber,
    maxCamberLocation,
    leadingEdgeRadius,
    trailingEdgeAngle,
    surfaceArea,
    continuityScore,
    smoothnessScore,
  };
}

function estimateLeadingEdgeRadius(points: AeroPoint[]): number {
  // Find point closest to x=0
  const lePoint = points.reduce((closest, p) => 
    Math.abs(p.x) < Math.abs(closest.x) ? p : closest
  );
  
  // Estimate radius from nearby points
  const nearbyPoints = points.filter(p => 
    Math.abs(p.x - lePoint.x) < 0.05
  );
  
  if (nearbyPoints.length < 3) return 0.01;
  
  // Simple radius estimation
  const avgDist = nearbyPoints.reduce((sum, p) => 
    sum + distance(p, lePoint), 0
  ) / nearbyPoints.length;
  
  return avgDist;
}

function estimateTrailingEdgeAngle(points: AeroPoint[]): number {
  const n = points.length;
  if (n < 4) return 0;
  
  // Get last few points on upper and lower surfaces
  const p1 = points[1];
  const p2 = points[2];
  const pn1 = points[n - 2];
  const pn2 = points[n - 3];
  
  // Calculate slopes
  const upperSlope = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  const lowerSlope = Math.atan2(pn2.y - pn1.y, pn2.x - pn1.x);
  
  return Math.abs(upperSlope - lowerSlope) * (180 / Math.PI);
}

function calculateContinuityScore(points: AeroPoint[]): number {
  if (points.length < 3) return 1.0;
  
  const distances: number[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    distances.push(distance(points[i], points[i + 1]));
  }
  
  const avgDist = distances.reduce((a, b) => a + b, 0) / distances.length;
  const variance = distances.reduce((sum, d) => 
    sum + (d - avgDist) ** 2, 0
  ) / distances.length;
  
  const stdDev = Math.sqrt(variance);
  const cv = stdDev / avgDist; // Coefficient of variation
  
  // Score: 1.0 for perfect uniformity, decreases with variation
  return Math.max(0, 1 - cv * 2);
}

function calculateSmoothnessScore(points: AeroPoint[]): number {
  if (points.length < 3) return 1.0;
  
  const angles: number[] = [];
  for (let i = 1; i < points.length - 1; i++) {
    angles.push(calculateAngle(points[i - 1], points[i], points[i + 1]));
  }
  
  const avgAngle = angles.reduce((a, b) => a + b, 0) / angles.length;
  const variance = angles.reduce((sum, a) => 
    sum + (a - avgAngle) ** 2, 0
  ) / angles.length;
  
  const stdDev = Math.sqrt(variance);
  
  // Score: 1.0 for smooth curves, decreases with angle variation
  return Math.max(0, 1 - stdDev / 90);
}

/**
 * Calculate overall quality score
 */
function calculateQualityScore(
  issues: ValidationIssue[],
  metrics: GeometryMetrics
): number {
  let score = 1.0;
  
  // Deduct for issues
  for (const issue of issues) {
    if (issue.severity === 'error') score -= 0.3;
    else if (issue.severity === 'warning') score -= 0.1;
  }
  
  // Bonus for good metrics
  score *= (metrics.continuityScore + metrics.smoothnessScore) / 2;
  
  return Math.max(0, Math.min(1, score));
}
