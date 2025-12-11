/**
 * Parameter Specification System
 * Defines how each parameter affects aerodynamic geometry generation
 */

export interface ParameterSpec {
  name: string;
  min: number;
  max: number;
  default: number;
  recommended: [number, number];
  description: string;
  effect: string;
  warning?: string;
}

export interface ParameterSet {
  temperature: number;
  camber: number;
  smoothness: number;
  latentDimension: number;
  thickness?: number;
  complexity?: number;
}

/**
 * Complete parameter specifications for aerodynamic shape generation
 */
export const PARAMETER_SPECS: Record<string, ParameterSpec> = {
  temperature: {
    name: 'Temperature',
    min: 0.1,
    max: 1.5,
    default: 0.7,
    recommended: [0.5, 1.0],
    description: 'Controls randomness and creative diversity of generated shapes',
    effect: 'Low (0.1-0.3): Smooth, conservative shapes from top performers. ' +
            'Medium (0.4-0.7): Balanced blend of performance and diversity. ' +
            'High (0.8-1.5): Maximum creativity and exploration across families.',
    warning: 'Values > 1.2 may produce unconventional shapes requiring validation',
  },
  
  camber: {
    name: 'Camber',
    min: 0.0,
    max: 0.08,
    default: 0.02,
    recommended: [0.015, 0.04],
    description: 'Controls lift-generating curvature of the airfoil',
    effect: 'Low (0-0.01): Symmetric or near-symmetric (low lift, low drag). ' +
            'Medium (0.02-0.04): Optimal for general aviation (balanced L/D). ' +
            'High (0.05-0.08): High-lift configurations (flaps, landing).',
    warning: 'Values > 0.06 may increase drag significantly',
  },
  
  smoothness: {
    name: 'Smoothness',
    min: 0.0,
    max: 1.0,
    default: 0.8,
    recommended: [0.7, 0.95],
    description: 'Controls surface smoothness and high-frequency noise suppression',
    effect: 'Low (0-0.3): Rough, edgy surfaces (not recommended). ' +
            'Medium (0.4-0.7): Slight texture for turbulence control. ' +
            'High (0.8-1.0): Fully smooth laminar surfaces (optimal for most cases).',
    warning: 'Values < 0.5 may produce non-manufacturable shapes',
  },
  
  latentDimension: {
    name: 'Latent Dimension',
    min: 8,
    max: 128,
    default: 32,
    recommended: [24, 64],
    description: 'Sets expressive power and complexity of the latent space',
    effect: 'Low (8-16): Simple, constrained shapes (fast generation). ' +
            'Medium (24-48): Balanced complexity and diversity. ' +
            'High (64-128): Maximum geometric freedom (slower, more creative).',
    warning: 'Values > 96 may slow generation without significant quality gain',
  },
  
  thickness: {
    name: 'Thickness',
    min: 0.06,
    max: 0.18,
    default: 0.12,
    recommended: [0.08, 0.14],
    description: 'Maximum thickness as percentage of chord length',
    effect: 'Low (6-9%): Thin airfoils for high-speed, low drag. ' +
            'Medium (10-14%): Optimal balance of strength and performance. ' +
            'High (15-18%): Thick airfoils for structural strength.',
    warning: 'Values < 0.08 may compromise structural integrity',
  },
  
  complexity: {
    name: 'Complexity',
    min: 30,
    max: 100,
    default: 50,
    recommended: [40, 70],
    description: 'Number of coordinate points defining the shape',
    effect: 'Low (30-40): Coarse resolution (fast, simple shapes). ' +
            'Medium (50-70): Standard resolution for most applications. ' +
            'High (80-100): High resolution for detailed analysis.',
    warning: 'Values > 80 may slow rendering without visual improvement',
  },
};

/**
 * Validate parameter value against specification
 */
export function validateParameter(
  paramName: string,
  value: number
): { valid: boolean; warning?: string; clamped?: number } {
  const spec = PARAMETER_SPECS[paramName];
  if (!spec) {
    return { valid: false, warning: `Unknown parameter: ${paramName}` };
  }

  const clamped = Math.max(spec.min, Math.min(spec.max, value));
  const inRange = value >= spec.min && value <= spec.max;
  const inRecommended = value >= spec.recommended[0] && value <= spec.recommended[1];

  let warning: string | undefined;
  if (!inRange) {
    warning = `Value ${value} outside valid range [${spec.min}, ${spec.max}]. Clamped to ${clamped}.`;
  } else if (!inRecommended && spec.warning) {
    warning = spec.warning;
  }

  return { valid: inRange, warning, clamped: inRange ? undefined : clamped };
}

/**
 * Validate entire parameter set
 */
export function validateParameterSet(params: ParameterSet): {
  valid: boolean;
  warnings: string[];
  clamped: Partial<ParameterSet>;
} {
  const warnings: string[] = [];
  const clamped: Partial<ParameterSet> = {};

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'number') {
      const result = validateParameter(key, value);
      if (result.warning) {
        warnings.push(`${key}: ${result.warning}`);
      }
      if (result.clamped !== undefined) {
        clamped[key as keyof ParameterSet] = result.clamped;
      }
    }
  }

  return {
    valid: warnings.length === 0,
    warnings,
    clamped,
  };
}

/**
 * Get parameter description for UI display
 */
export function getParameterInfo(paramName: string): ParameterSpec | null {
  return PARAMETER_SPECS[paramName] || null;
}

/**
 * Get all parameter specifications
 */
export function getAllParameterSpecs(): Record<string, ParameterSpec> {
  return PARAMETER_SPECS;
}

/**
 * Generate parameter summary for documentation
 */
export function generateParameterSummary(params: ParameterSet): string {
  const lines: string[] = [];
  
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'number') {
      const spec = PARAMETER_SPECS[key];
      if (spec) {
        const inRecommended = value >= spec.recommended[0] && value <= spec.recommended[1];
        const status = inRecommended ? '✓' : '⚠';
        lines.push(`${status} ${spec.name}: ${value.toFixed(3)} (recommended: ${spec.recommended[0]}-${spec.recommended[1]})`);
      }
    }
  }
  
  return lines.join('\n');
}
