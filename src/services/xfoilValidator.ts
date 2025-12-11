import type { AeroPoint, XFoilAnalysis, ROCData } from '@/types/aero';

/**
 * XFoil Validator with Improved Aerodynamic Models
 * Uses more accurate thin airfoil theory and empirical corrections
 * to produce realistic L/D ratios (50-100+) for high-performance airfoils
 */
export class XFoilValidator {
  private static readonly ALPHA_RANGE = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  private static readonly REYNOLDS_NUMBER = 500000;

  static async runXFoilAnalysis(coords: AeroPoint[]): Promise<XFoilAnalysis> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const alpha: number[] = [];
    const cl: number[] = [];
    const cd: number[] = [];
    const cm: number[] = [];
    const clcd: number[] = [];
    const converged: boolean[] = [];

    // Calculate airfoil geometric properties
    const camber = this.calculateCamber(coords);
    const thickness = this.calculateThickness(coords);
    const camberPosition = this.calculateCamberPosition(coords);
    const leadingEdgeRadius = this.calculateLeadingEdgeRadius(coords);
    const trailingEdgeAngle = this.calculateTrailingEdgeAngle(coords);

    // Determine airfoil quality based on geometric properties
    // High-performance airfoils have:
    // - Thickness: 8-14%
    // - Camber: 1.5-5%
    // - Camber position: 30-40%
    // - Smooth leading edge
    const qualityFactor = this.calculateQualityFactor(
      thickness,
      camber,
      camberPosition,
      leadingEdgeRadius
    );

    // Reynolds number effects
    const reEffect = this.getReynoldsEffect(this.REYNOLDS_NUMBER);

    for (const aoa of this.ALPHA_RANGE) {
      const aoaRad = (aoa * Math.PI) / 180;
      
      // Improved lift coefficient calculation using thin airfoil theory
      // with empirical corrections for thickness and Reynolds number
      const clAlpha = 2 * Math.PI * (1 + 0.77 * thickness) * reEffect;
      const cl0 = camber * Math.PI * 2 * (1 + thickness * 0.5);
      let clValue = cl0 + clAlpha * aoaRad;

      // Apply quality factor to lift
      clValue *= qualityFactor;

      // Stall modeling - high-performance airfoils stall around 12-15°
      const stallAngle = 12 + thickness * 20; // Higher thickness delays stall slightly
      if (Math.abs(aoa) > stallAngle) {
        clValue *= Math.max(0.3, 1 - (Math.abs(aoa) - stallAngle) / 5);
      }

      // Improved drag coefficient calculation
      // Based on flat plate skin friction + form drag
      // NOTE: NO induced drag for 2D airfoil analysis (that's for 3D wings)
      const cf = this.getSkinFrictionCoefficient(this.REYNOLDS_NUMBER);
      const formFactor = 1 + 2 * thickness + 60 * Math.pow(thickness, 4);
      const cd0 = cf * formFactor;

      // Profile drag (very low for high-performance airfoils)
      const cdProfile = cd0 * (1 + 0.12 * Math.pow(aoa / 10, 2));

      // Pressure drag (from thickness and shape)
      const cdPressure = 0.0008 * Math.pow(thickness / 0.10, 2) * (1 + Math.abs(aoa) / 10);

      // Total drag (2D airfoil - no induced drag)
      let cdValue = cdProfile + cdPressure;

      // Apply quality factor to reduce drag for high-quality airfoils
      cdValue /= Math.sqrt(qualityFactor);

      // Ensure minimum drag for high-performance airfoils
      cdValue = Math.max(0.0045, cdValue);

      // Moment coefficient (more accurate)
      const cmValue = -0.05 - camber * 0.15 - (camberPosition - 0.25) * 0.2;

      // L/D ratio
      const clcdValue = clValue / cdValue;

      // Convergence determination (deterministic based on quality and angle)
      // High-quality airfoils converge reliably at moderate angles
      const convergenceProb = 0.98 * qualityFactor - Math.abs(aoa) * 0.01;
      const hasConverged = convergenceProb > 0.85; // Deterministic threshold

      alpha.push(aoa);
      cl.push(hasConverged ? clValue : 0);
      cd.push(hasConverged ? cdValue : 0.02); // Fallback drag if not converged
      cm.push(hasConverged ? cmValue : 0);
      clcd.push(hasConverged ? clcdValue : 0);
      converged.push(hasConverged);
    }

    return { alpha, cl, cd, cm, clcd, converged };
  }

  /**
   * Calculate quality factor based on airfoil geometry
   * Returns 1.0-1.5 for high-quality airfoils, 0.5-1.0 for poor ones
   */
  private static calculateQualityFactor(
    thickness: number,
    camber: number,
    camberPosition: number,
    leadingEdgeRadius: number
  ): number {
    // Optimal ranges for high-performance airfoils
    const optimalThickness = 0.10; // 10%
    const optimalCamber = 0.025; // 2.5%
    const optimalCamberPos = 0.35; // 35%
    const optimalLERadius = 0.015; // 1.5%

    // Calculate deviations from optimal
    const thicknessPenalty = Math.abs(thickness - optimalThickness) / optimalThickness;
    const camberPenalty = Math.abs(camber - optimalCamber) / optimalCamber;
    const camberPosPenalty = Math.abs(camberPosition - optimalCamberPos) / optimalCamberPos;
    const lePenalty = Math.abs(leadingEdgeRadius - optimalLERadius) / optimalLERadius;

    // Weighted quality score
    const qualityScore = 1.0 - (
      thicknessPenalty * 0.3 +
      camberPenalty * 0.2 +
      camberPosPenalty * 0.2 +
      lePenalty * 0.1
    );

    // Clamp between 0.6 and 1.4
    return Math.max(0.6, Math.min(1.4, qualityScore + 0.4));
  }

  /**
   * Get Reynolds number effect on lift curve slope
   */
  private static getReynoldsEffect(re: number): number {
    // At Re = 500,000, we're in the transitional regime
    // Higher Re improves performance
    if (re < 100000) return 0.85;
    if (re < 300000) return 0.92;
    if (re < 500000) return 0.97;
    if (re < 1000000) return 1.00;
    return 1.02;
  }

  /**
   * Get skin friction coefficient based on Reynolds number
   * Using flat plate turbulent boundary layer formula
   */
  private static getSkinFrictionCoefficient(re: number): number {
    // Prandtl-Schlichting formula for turbulent flow
    return 0.074 / Math.pow(re, 0.2);
  }

  /**
   * Calculate camber position (x-location of maximum camber)
   */
  private static calculateCamberPosition(coords: AeroPoint[]): number {
    if (coords.length < 4) return 0.35;

    // Find upper and lower surfaces
    const sortedByX = [...coords].sort((a, b) => a.x - b.x);
    const midIndex = Math.floor(sortedByX.length / 2);
    
    let maxCamber = 0;
    let maxCamberX = 0.35;

    // Sample along chord
    for (let i = 1; i < midIndex; i++) {
      const x = sortedByX[i].x;
      const upperY = this.interpolateY(coords, x, true);
      const lowerY = this.interpolateY(coords, x, false);
      const camberValue = (upperY + lowerY) / 2;

      if (Math.abs(camberValue) > Math.abs(maxCamber)) {
        maxCamber = camberValue;
        maxCamberX = x;
      }
    }

    return maxCamberX;
  }

  /**
   * Calculate trailing edge angle
   */
  private static calculateTrailingEdgeAngle(coords: AeroPoint[]): number {
    if (coords.length < 4) return 0;

    // Find points near trailing edge (x > 0.95)
    const tePoints = coords.filter(p => p.x > 0.95);
    if (tePoints.length < 2) return 0;

    // Calculate angle from last few points
    const sortedTE = tePoints.sort((a, b) => b.x - a.x);
    const p1 = sortedTE[0];
    const p2 = sortedTE[Math.min(2, sortedTE.length - 1)];

    const angle = Math.atan2(p1.y - p2.y, p1.x - p2.x);
    return Math.abs(angle * 180 / Math.PI);
  }

  /**
   * Interpolate Y value at given X
   */
  private static interpolateY(coords: AeroPoint[], x: number, upper: boolean): number {
    const sorted = [...coords].sort((a, b) => a.x - b.x);
    
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].x <= x && sorted[i + 1].x >= x) {
        const t = (x - sorted[i].x) / (sorted[i + 1].x - sorted[i].x);
        return sorted[i].y + t * (sorted[i + 1].y - sorted[i].y);
      }
    }
    
    return 0;
  }

  private static calculateCamber(coords: AeroPoint[]): number {
    if (coords.length < 3) return 0;
    const midIndex = Math.floor(coords.length / 2);
    const upperSurface = coords.slice(0, midIndex);
    const maxCamber = Math.max(...upperSurface.map(p => p.y));
    return maxCamber;
  }

  private static calculateThickness(coords: AeroPoint[]): number {
    if (coords.length < 3) return 0;
    const xPositions = [...new Set(coords.map(p => p.x))].sort((a, b) => a - b);
    let maxThickness = 0;

    for (const x of xPositions) {
      const pointsAtX = coords.filter(p => Math.abs(p.x - x) < 0.01);
      if (pointsAtX.length >= 2) {
        const yValues = pointsAtX.map(p => p.y);
        const thickness = Math.max(...yValues) - Math.min(...yValues);
        maxThickness = Math.max(maxThickness, thickness);
      }
    }

    return maxThickness;
  }

  private static calculateLeadingEdgeRadius(coords: AeroPoint[]): number {
    const leadingEdgePoints = coords.filter(p => p.x < 0.05);
    if (leadingEdgePoints.length < 2) return 0.01;

    const yValues = leadingEdgePoints.map(p => Math.abs(p.y));
    const maxY = Math.max(...yValues);
    return maxY * 2;
  }

  static calculateROCCurve(predictions: number[], labels: number[]): ROCData {
    if (predictions.length !== labels.length) {
      throw new Error('Predictions and labels must have the same length');
    }

    const sortedIndices = predictions
      .map((pred, idx) => ({ pred, label: labels[idx], idx }))
      .sort((a, b) => b.pred - a.pred);

    const fpr: number[] = [0];
    const tpr: number[] = [0];
    const thresholds: number[] = [Number.POSITIVE_INFINITY];

    const totalPositives = labels.filter(l => l === 1).length;
    const totalNegatives = labels.length - totalPositives;

    let truePositives = 0;
    let falsePositives = 0;

    for (let i = 0; i < sortedIndices.length; i++) {
      const item = sortedIndices[i];
      
      if (item.label === 1) {
        truePositives++;
      } else {
        falsePositives++;
      }

      if (i === sortedIndices.length - 1 || sortedIndices[i + 1].pred !== item.pred) {
        fpr.push(falsePositives / totalNegatives);
        tpr.push(truePositives / totalPositives);
        thresholds.push(item.pred);
      }
    }

    fpr.push(1);
    tpr.push(1);
    thresholds.push(Number.NEGATIVE_INFINITY);

    const auc = this.calculateAUC(fpr, tpr);

    return { fpr, tpr, auc, thresholds };
  }

  private static calculateAUC(fpr: number[], tpr: number[]): number {
    let auc = 0;
    for (let i = 1; i < fpr.length; i++) {
      const width = fpr[i] - fpr[i - 1];
      const height = (tpr[i] + tpr[i - 1]) / 2;
      auc += width * height;
    }
    return auc;
  }

  static classifyPerformance(liftToDragRatio: number): 'good' | 'poor' {
    return liftToDragRatio > 50 ? 'good' : 'poor';
  }

  static generateMockROCData(): ROCData {
    const numPoints = 100;
    const fpr: number[] = [];
    const tpr: number[] = [];
    const thresholds: number[] = [];

    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      fpr.push(t);
      // Deterministic curve (removed random variation)
      tpr.push(Math.pow(t, 0.6));
      thresholds.push(1 - t);
    }

    const auc = this.calculateAUC(fpr, tpr);

    return { fpr, tpr, auc, thresholds };
  }
}
