/**
 * Enhanced Aerodynamic Shape Generator
 * Integrates parameter validation, diversity enforcement, and geometry validation
 */

import type { ComponentType, AeroPoint } from '@/types/aero';
import type {
  EnhancedAeroShape,
  ShapeParameters,
  ShapeMetadata,
  GenerationResult,
  AerodynamicPrediction,
} from '@/types/enhancedAero';
import { validateParameterSet, generateParameterSummary, PARAMETER_SPECS } from './parameterSpec';
import { validateGeometry } from './geometryValidator';
import { diversityTracker } from './diversityTracker';
import { MLShapeGenerator } from './mlShapeGenerator';

const GENERATOR_VERSION = '2.0.0';
const MAX_GENERATION_ATTEMPTS = 3;

/**
 * Enhanced Shape Generator with full validation and metadata
 */
export class EnhancedShapeGenerator {
  /**
   * Generate enhanced aerodynamic shape with complete validation and metadata
   */
  static async generateShape(
    type: ComponentType,
    params: ShapeParameters
  ): Promise<GenerationResult> {
    const startTime = performance.now();
    const warnings: string[] = [];
    let attempts = 0;

    // Step 1: Validate parameters
    const paramValidation = validateParameterSet(params);
    if (!paramValidation.valid) {
      warnings.push(...paramValidation.warnings);
    }

    // Apply clamped values if needed
    const finalParams = { ...params, ...paramValidation.clamped };

    // Step 2: Generate shape with diversity enforcement
    let shape: EnhancedAeroShape | null = null;
    let lastError: string | undefined;

    while (attempts < MAX_GENERATION_ATTEMPTS && !shape) {
      attempts++;

      try {
        // Generate diverse latent vector
        const diversityResult = diversityTracker.generateDiverseLatent(
          finalParams.latentDimension,
          finalParams.temperature,
          type,
          finalParams
        );

        if (!diversityResult.isDiverse && attempts === 1) {
          warnings.push(
            `Shape may be similar to recent generations (similarity: ${(diversityResult.similarityScore * 100).toFixed(1)}%)`
          );
        }

        // Generate base shape
        const baseShape = await this.generateBaseShape(type, finalParams, diversityResult.latentVector);

        // Step 3: Validate geometry
        const validation = validateGeometry(baseShape.points);

        // If validation fails with errors, regenerate
        if (!validation.valid && attempts < MAX_GENERATION_ATTEMPTS) {
          lastError = `Validation failed: ${validation.issues.filter(i => i.severity === 'error').map(i => i.message).join(', ')}`;
          console.warn(`Attempt ${attempts} failed validation, regenerating...`);
          continue;
        }

        // Add validation warnings
        validation.issues
          .filter(i => i.severity === 'warning')
          .forEach(i => warnings.push(i.message));

        // Step 4: Generate metadata
        const metadata = this.generateMetadata(
          baseShape,
          finalParams,
          diversityResult.latentVector,
          validation,
          diversityResult.similarityScore,
          diversityResult.attempts,
          performance.now() - startTime
        );

        // Step 5: Create enhanced shape
        shape = {
          type,
          parameters: finalParams,
          latentVector: diversityResult.latentVector,
          coordinates: baseShape.points,
          metadata,
        };

      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Generation attempt ${attempts} failed:`, error);
      }
    }

    if (!shape) {
      return {
        success: false,
        error: lastError || 'Failed to generate valid shape',
        warnings,
        attempts,
      };
    }

    return {
      success: true,
      shape,
      warnings,
      attempts,
    };
  }

  /**
   * Generate base shape using ML generator
   */
  private static async generateBaseShape(
    type: ComponentType,
    params: ShapeParameters,
    latentVector: number[]
  ): Promise<{ points: AeroPoint[]; name: string; familyName?: string; sourceAirfoils?: string[] }> {
    // Convert to legacy format for ML generator
    const legacyParams = {
      type,
      complexity: params.complexity || 50,
      smoothness: params.smoothness,
      temperature: params.temperature,
      latentDimension: params.latentDimension,
      thickness: params.thickness || 0.12,
      camber: params.camber,
    };

    // Use ML generator for airfoils
    if (type === 'airfoil') {
      const mlShape = await MLShapeGenerator.generateAirfoil(legacyParams);
      
      // Extract family info from name
      const nameMatch = mlShape.name.match(/^(.+?) Blend \((.+?)\)$/);
      const familyName = nameMatch ? nameMatch[1] : undefined;
      const sourceAirfoils = nameMatch ? nameMatch[2].split('+') : undefined;

      return {
        points: mlShape.points,
        name: mlShape.name,
        familyName,
        sourceAirfoils,
      };
    }

    // For other types, use basic generation (to be enhanced later)
    throw new Error(`Enhanced generation not yet implemented for type: ${type}`);
  }

  /**
   * Generate comprehensive metadata
   */
  private static generateMetadata(
    baseShape: { points: AeroPoint[]; name: string; familyName?: string; sourceAirfoils?: string[] },
    params: ShapeParameters,
    latentVector: number[],
    validation: any,
    similarityScore: number,
    diversityAttempts: number,
    generationTime: number
  ): ShapeMetadata {
    const metrics = validation.metrics;

    // Generate human-readable summary
    const summary = this.generateSummary(baseShape, params, metrics);

    // Generate aerodynamic characteristics
    const aeroCharacteristics = this.generateAerodynamicCharacteristics(params, metrics);

    // Generate parameter effects
    const paramEffects = this.generateParameterEffects(params);

    // Generate CFD notes
    const cfdNotes = this.generateCFDNotes(params, metrics);

    // Generate file-safe identifier
    const identifier = this.generateIdentifier(baseShape.name, params);

    return {
      valid: validation.valid,
      validationResult: validation,
      similarityScore,
      diversityAttempts,
      chordLength: metrics.chordLength,
      maxThickness: metrics.maxThickness,
      maxThicknessLocation: metrics.maxThicknessLocation,
      maxCamber: metrics.maxCamber,
      maxCamberLocation: metrics.maxCamberLocation,
      generationTime,
      timestamp: Date.now(),
      generatorVersion: GENERATOR_VERSION,
      summary,
      aerodynamicCharacteristics: aeroCharacteristics,
      parameterEffects: paramEffects,
      cfdNotes,
      identifier,
      familyName: baseShape.familyName,
      sourceAirfoils: baseShape.sourceAirfoils,
    };
  }

  /**
   * Generate human-readable summary
   */
  private static generateSummary(
    baseShape: { name: string; familyName?: string },
    params: ShapeParameters,
    metrics: any
  ): string {
    const thicknessPercent = (metrics.maxThickness * 100).toFixed(1);
    const camberPercent = (Math.abs(metrics.maxCamber) * 100).toFixed(1);
    
    let summary = `${baseShape.name} - `;
    
    if (params.camber < 0.01) {
      summary += `Symmetric airfoil with ${thicknessPercent}% thickness. `;
    } else {
      summary += `Cambered airfoil with ${thicknessPercent}% thickness and ${camberPercent}% camber. `;
    }

    if (params.temperature < 0.4) {
      summary += 'Conservative design optimized for high performance.';
    } else if (params.temperature < 0.8) {
      summary += 'Balanced design blending performance and innovation.';
    } else {
      summary += 'Exploratory design with creative geometric features.';
    }

    return summary;
  }

  /**
   * Generate aerodynamic characteristics description
   */
  private static generateAerodynamicCharacteristics(
    params: ShapeParameters,
    metrics: any
  ): string {
    const characteristics: string[] = [];

    // Lift characteristics
    if (params.camber < 0.01) {
      characteristics.push('Zero lift at zero angle of attack (symmetric)');
    } else if (params.camber < 0.03) {
      characteristics.push('Moderate positive lift at zero AoA');
    } else {
      characteristics.push('High positive lift at zero AoA');
    }

    // Drag characteristics
    const thickness = params.thickness || 0.12;
    if (thickness < 0.09) {
      characteristics.push('Low profile drag (thin airfoil)');
    } else if (thickness < 0.14) {
      characteristics.push('Balanced drag characteristics');
    } else {
      characteristics.push('Higher profile drag (thick airfoil)');
    }

    // Stall characteristics
    if (metrics.leadingEdgeRadius > 0.015) {
      characteristics.push('Gentle stall behavior');
    } else {
      characteristics.push('Sharp stall possible at high AoA');
    }

    // Performance prediction
    const expectedLD = this.predictLD(params, metrics);
    characteristics.push(`Expected L/D: ${expectedLD.toFixed(0)} at optimal conditions`);

    return characteristics.join('. ') + '.';
  }

  /**
   * Predict L/D ratio
   */
  private static predictLD(params: ShapeParameters, metrics: any): number {
    let baseLD = 80;

    // Thickness effect
    const thickness = params.thickness || 0.12;
    if (thickness < 0.09) baseLD += 10;
    else if (thickness > 0.14) baseLD -= 10;

    // Camber effect
    if (params.camber > 0.04) baseLD -= 5;

    // Smoothness effect
    baseLD *= params.smoothness;

    // Temperature effect (higher temp = more experimental = potentially lower L/D)
    if (params.temperature > 1.0) baseLD *= 0.9;

    return Math.max(50, baseLD);
  }

  /**
   * Generate parameter effects description
   */
  private static generateParameterEffects(params: ShapeParameters): string {
    const effects: string[] = [];

    for (const [key, value] of Object.entries(params)) {
      if (typeof value === 'number') {
        const spec = PARAMETER_SPECS[key];
        if (spec) {
          const inRecommended = value >= spec.recommended[0] && value <= spec.recommended[1];
          const status = inRecommended ? '✓' : '⚠';
          
          let effect = `${status} ${spec.name} (${value.toFixed(3)}): `;
          
          if (value < spec.recommended[0]) {
            effect += 'Below recommended range - ';
          } else if (value > spec.recommended[1]) {
            effect += 'Above recommended range - ';
          }
          
          // Add specific effect based on value
          if (key === 'temperature') {
            if (value < 0.4) effect += 'Conservative, high-performance focus';
            else if (value < 0.8) effect += 'Balanced exploration';
            else effect += 'Maximum creativity and diversity';
          } else if (key === 'camber') {
            if (value < 0.01) effect += 'Symmetric, zero lift at 0° AoA';
            else if (value < 0.03) effect += 'Moderate lift generation';
            else effect += 'High lift, increased drag';
          } else if (key === 'smoothness') {
            if (value < 0.5) effect += 'Rough surface, not recommended';
            else if (value < 0.8) effect += 'Slight texture';
            else effect += 'Smooth laminar surface';
          }
          
          effects.push(effect);
        }
      }
    }

    return effects.join('\n');
  }

  /**
   * Generate CFD usage notes
   */
  private static generateCFDNotes(params: ShapeParameters, metrics: any): string {
    const notes: string[] = [];

    notes.push('CFD Simulation Recommendations:');
    
    // Reynolds number
    const thickness = params.thickness || 0.12;
    if (thickness < 0.09) {
      notes.push('- Recommended Re: 1e6 - 5e6 (high-speed regime)');
    } else {
      notes.push('- Recommended Re: 5e5 - 2e6 (general aviation)');
    }

    // Turbulence model
    if (params.smoothness > 0.85) {
      notes.push('- Consider transition models (laminar-turbulent)');
    } else {
      notes.push('- Fully turbulent model recommended');
    }

    // Mesh requirements
    if (metrics.leadingEdgeRadius < 0.01) {
      notes.push('- Fine mesh required at leading edge (sharp radius)');
    }
    
    notes.push(`- Trailing edge gap: ${(metrics.chordLength * 0.001).toFixed(4)} (closed)`);
    
    // AoA sweep
    if (params.camber < 0.01) {
      notes.push('- Suggested AoA sweep: -10° to +10° (symmetric)');
    } else {
      notes.push('- Suggested AoA sweep: -5° to +15° (cambered)');
    }

    return notes.join('\n');
  }

  /**
   * Generate file-safe identifier
   */
  private static generateIdentifier(name: string, params: ShapeParameters): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const tempStr = `T${(params.temperature * 100).toFixed(0)}`;
    const camberStr = `C${(params.camber * 100).toFixed(0)}`;
    const smoothStr = `S${(params.smoothness * 100).toFixed(0)}`;
    
    const safeName = name
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .slice(0, 30);
    
    return `${safeName}_${tempStr}_${camberStr}_${smoothStr}_${timestamp}`;
  }

  /**
   * Predict aerodynamic performance
   */
  static predictPerformance(shape: EnhancedAeroShape): AerodynamicPrediction {
    const { parameters, metadata } = shape;
    
    const expectedLD = this.predictLD(parameters, metadata.validationResult.metrics);
    
    // Stall angle prediction
    let stallAngle = 12;
    if (parameters.camber > 0.03) stallAngle += 2;
    if (metadata.maxThickness > 0.14) stallAngle += 1;
    
    // Optimal AoA
    const optimalAoA = parameters.camber < 0.01 ? 0 : 4 + parameters.camber * 100;
    
    // Applications
    const applications: string[] = [];
    if (parameters.camber < 0.01) applications.push('Vertical stabilizers', 'Symmetric flight');
    if (parameters.thickness && parameters.thickness > 0.14) applications.push('Structural wings', 'UAVs');
    if (expectedLD > 90) applications.push('Gliders', 'Efficient cruise');
    if (parameters.camber > 0.03) applications.push('High-lift devices', 'Slow flight');
    
    return {
      expectedLD,
      stallAngle,
      optimalAoA,
      dragCharacteristics: this.getDragCharacteristics(parameters),
      liftCharacteristics: this.getLiftCharacteristics(parameters),
      reynoldsRange: this.getReynoldsRange(parameters),
      applications,
    };
  }

  private static getDragCharacteristics(params: ShapeParameters): string {
    const thickness = params.thickness || 0.12;
    if (thickness < 0.09) return 'Low drag, suitable for high-speed applications';
    if (thickness > 0.14) return 'Moderate drag, prioritizes structural strength';
    return 'Balanced drag characteristics for general use';
  }

  private static getLiftCharacteristics(params: ShapeParameters): string {
    if (params.camber < 0.01) return 'Symmetric lift distribution, zero lift at 0° AoA';
    if (params.camber < 0.03) return 'Moderate lift generation with good efficiency';
    return 'High lift capability, suitable for low-speed flight';
  }

  private static getReynoldsRange(params: ShapeParameters): [number, number] {
    const thickness = params.thickness || 0.12;
    if (thickness < 0.09) return [1e6, 5e6];
    if (thickness > 0.14) return [2e5, 1e6];
    return [5e5, 2e6];
  }
}
