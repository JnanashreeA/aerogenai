export type ComponentType = 'airfoil' | 'winglet' | 'sidepod' | 'diffuser';

export interface AeroPoint {
  x: number;
  y: number;
  z?: number;
}

export interface AeroShape {
  id: string;
  type: ComponentType;
  name: string;
  points: AeroPoint[];
  isGenerated: boolean;
  timestamp: number;
}

export interface ValidationResult {
  shapeId: string;
  shapeName: string;
  type: ComponentType;
  metrics: AeroMetrics;
  performanceData: PerformanceData;
  xfoilData?: XFoilAnalysis;
  classification: 'good' | 'poor';
  timestamp: number;
}

export interface AeroMetrics {
  lift?: number;
  drag?: number;
  liftToDragRatio?: number;
  coolingEfficiency?: number;
  downforce?: number;
  efficiency?: number;
  pressureCoefficient?: number;
  momentCoefficient?: number;
}

export interface PerformanceData {
  angleOfAttack: number[];
  lift: number[];
  drag: number[];
  efficiency: number[];
  moment?: number[];
}

export interface XFoilAnalysis {
  alpha: number[];
  cl: number[];
  cd: number[];
  cm: number[];
  clcd: number[];
  converged: boolean[];
}

export interface ROCData {
  fpr: number[];
  tpr: number[];
  auc: number;
  thresholds: number[];
}

export interface GenerationParams {
  type: ComponentType;
  complexity: number;
  smoothness: number;
  temperature: number;
  latentDimension: number;
  thickness: number;
  camber: number;
  targetPerformance?: Partial<AeroMetrics>;
  batchSize?: number;
}

export interface ComparisonData {
  real: ValidationResult;
  generated: ValidationResult;
}
