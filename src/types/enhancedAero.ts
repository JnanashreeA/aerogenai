/**
 * Enhanced Aerodynamic Shape Types with Metadata
 */

import type { AeroPoint, ComponentType } from './aero';
import type { ValidationResult } from '@/services/geometryValidator';

/**
 * Enhanced shape output with complete metadata
 */
export interface EnhancedAeroShape {
  type: ComponentType;
  parameters: ShapeParameters;
  latentVector: number[];
  coordinates: AeroPoint[];
  metadata: ShapeMetadata;
}

/**
 * Complete parameter set for shape generation
 */
export interface ShapeParameters {
  temperature: number;
  camber: number;
  smoothness: number;
  latentDimension: number;
  thickness?: number;
  complexity?: number;
  [key: string]: number | undefined;
}

/**
 * Comprehensive shape metadata
 */
export interface ShapeMetadata {
  // Validation
  valid: boolean;
  validationResult: ValidationResult;
  
  // Diversity
  similarityScore: number;
  diversityAttempts: number;
  
  // Geometry
  chordLength: number;
  maxThickness: number;
  maxThicknessLocation: number;
  maxCamber: number;
  maxCamberLocation: number;
  
  // Generation info
  generationTime: number;
  timestamp: number;
  generatorVersion: string;
  
  // Documentation
  summary: string;
  aerodynamicCharacteristics: string;
  parameterEffects: string;
  cfdNotes: string;
  
  // Identification
  identifier: string;
  familyName?: string;
  sourceAirfoils?: string[];
}

/**
 * Generation result with success/failure info
 */
export interface GenerationResult {
  success: boolean;
  shape?: EnhancedAeroShape;
  error?: string;
  warnings: string[];
  attempts: number;
}

/**
 * Aerodynamic behavior prediction
 */
export interface AerodynamicPrediction {
  expectedLD: number;
  stallAngle: number;
  optimalAoA: number;
  dragCharacteristics: string;
  liftCharacteristics: string;
  reynoldsRange: [number, number];
  applications: string[];
}

/**
 * Parameter effect description
 */
export interface ParameterEffect {
  parameter: string;
  value: number;
  effect: string;
  impact: 'low' | 'medium' | 'high';
}

/**
 * Shape comparison result
 */
export interface ShapeComparison {
  shape1: string;
  shape2: string;
  geometricSimilarity: number;
  performanceDifference: number;
  differences: string[];
}

/**
 * Export format options
 */
export type ExportFormat = 'json' | 'csv' | 'dat' | 'svg';

/**
 * Export configuration
 */
export interface ExportConfig {
  format: ExportFormat;
  includeMetadata: boolean;
  includeValidation: boolean;
  precision: number;
  normalized: boolean;
}
