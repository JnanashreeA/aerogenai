/**
 * Random Airfoil Generator
 * Generates completely unique airfoils with enforced variety
 * Each airfoil type uses a DIFFERENT mathematical formula
 */

import type { AeroPoint } from '@/types/aero';
import {
  generateNACA4Digit,
  generateNACA5Digit,
  generateNACA6Series,
  generateSelig,
  generateEppler,
  generateWortmannFX,
  generateThinSharp,
  generateReflexCamber,
  generateHighCamberUAV,
  generateRandomProcedural,
  type AirfoilParameters,
} from './airfoilShapeGenerators';

// Re-export for external use
export type { AirfoilParameters };

export interface GeneratedAirfoil {
  coordinates: AeroPoint[];
  latentVector: number[];
  parameters: AirfoilParameters;
  metadata: {
    generationTime: string;
    uniqueId: string;
    description: string;
    designNotes: string;
    pointCount: number;
  };
}

// Store previous latent vectors to enforce variety
const previousLatentVectors: number[][] = [];
const SIMILARITY_THRESHOLD = 0.75; // Stricter threshold for more diversity
const LATENT_DIM = 24; // Increased for more variation
const MIN_POINTS = 200;
const MAX_POINTS = 400;

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Check if a latent vector is too similar to previous ones
 */
function isTooSimilar(latent: number[]): boolean {
  for (const prev of previousLatentVectors) {
    const similarity = cosineSimilarity(latent, prev);
    if (similarity > SIMILARITY_THRESHOLD) {
      return true;
    }
  }
  return false;
}

/**
 * Generate a random latent vector
 */
function generateLatentVector(): number[] {
  const latent: number[] = [];
  for (let i = 0; i < LATENT_DIM; i++) {
    // Use normal distribution (Box-Muller transform)
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    latent.push(z);
  }
  return latent;
}

/**
 * Generate unique latent vector (retry if too similar)
 */
function generateUniqueLatentVector(maxAttempts = 10): number[] {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const latent = generateLatentVector();
    if (!isTooSimilar(latent)) {
      previousLatentVectors.push(latent);
      // Keep only last 20 vectors
      if (previousLatentVectors.length > 20) {
        previousLatentVectors.shift();
      }
      return latent;
    }
  }
  // If all attempts fail, return anyway but with warning
  const latent = generateLatentVector();
  previousLatentVectors.push(latent);
  return latent;
}

/**
 * Randomly select airfoil type
 */
function selectRandomAirfoilType(): { type: string; description: string; designNotes: string } {
  const types = [
    {
      type: 'NACA 4-digit',
      description: 'Classic NACA 4-digit series (e.g., 2412, 4415)',
      designNotes: 'General-purpose airfoil with moderate camber and thickness. Widely used in aviation for balanced lift and drag characteristics.'
    },
    {
      type: 'NACA 5-digit',
      description: 'NACA 5-digit series with refined camber',
      designNotes: 'Enhanced camber distribution for improved lift characteristics. The camber line is designed for specific lift coefficients with better stall behavior.'
    },
    {
      type: 'NACA 6-series',
      description: 'Laminar flow airfoil for low drag',
      designNotes: 'Designed for extended laminar flow regions. Features favorable pressure gradients to delay transition and minimize drag at cruise conditions.'
    },
    {
      type: 'Selig',
      description: 'Low Reynolds number airfoil',
      designNotes: 'Optimized for model aircraft and small UAVs operating at Re < 500,000. Features gentle stall characteristics and good low-speed performance.'
    },
    {
      type: 'Eppler',
      description: 'High-performance glider airfoil',
      designNotes: 'Designed for maximum L/D ratios in soaring applications. Features very low drag buckets and excellent off-design performance.'
    },
    {
      type: 'Wortmann FX',
      description: 'High-lift sailplane profile',
      designNotes: 'German-designed airfoil series for sailplanes. Combines high maximum lift with low drag and docile stall behavior. Popular in competition gliders.'
    },
    {
      type: 'Thin Sharp',
      description: 'Race-car aerodynamics profile',
      designNotes: 'Minimal thickness (6-8%) with sharp trailing edge. Designed for high-speed downforce generation with minimal drag penalty. Used in Formula 1 wings.'
    },
    {
      type: 'Reflex Camber',
      description: 'Flying wing stability airfoil',
      designNotes: 'Negative camber near trailing edge provides pitch stability without horizontal tail. Essential for tailless aircraft and flying wings.'
    },
    {
      type: 'High Camber UAV',
      description: 'High-lift UAV configuration',
      designNotes: 'Extreme camber (10-15%) for maximum lift at low speeds. Used in cargo drones and VTOL transitions. Trades efficiency for lift capability.'
    },
    {
      type: 'Random Procedural',
      description: 'Algorithmically generated profile',
      designNotes: 'Pure mathematical construction using Bezier curves and parametric functions. Explores unconventional geometries outside traditional families.'
    },
  ];
  
  return types[Math.floor(Math.random() * types.length)];
}

/**
 * Generate random parameters within valid ranges
 */
function generateRandomParameters(airfoilType: string): AirfoilParameters {
  // Temperature: 0.1 (stable) to 5.0 (wild)
  const temperature = 0.1 + Math.random() * 4.9;
  
  // Camber: -0.1 (reflex) to 0.15 (high lift) - INCREASED VARIATION
  let camber: number;
  if (airfoilType === 'Reflex Camber') {
    camber = -0.10 + Math.random() * 0.06; // More negative: -10% to -4%
  } else if (airfoilType === 'High Camber UAV') {
    camber = 0.10 + Math.random() * 0.08; // Higher positive: 10-18%
  } else if (airfoilType === 'Thin Sharp') {
    camber = -0.03 + Math.random() * 0.06; // Near-symmetric: -3% to +3%
  } else if (airfoilType === 'Wortmann FX') {
    camber = 0.05 + Math.random() * 0.08; // Moderate to high: 5-13%
  } else if (airfoilType === 'Random Procedural') {
    camber = -0.12 + Math.random() * 0.30; // Full range: -12% to +18%
  } else {
    camber = -0.06 + Math.random() * 0.18; // General range: -6% to +12%
  }
  
  // Smoothness: 0 (rough) to 1 (smooth)
  let smoothness: number;
  if (airfoilType === 'Random Procedural') {
    smoothness = Math.random(); // Full range
  } else if (airfoilType === 'Thin Sharp') {
    smoothness = 0.7 + Math.random() * 0.3; // Very smooth
  } else {
    smoothness = 0.3 + Math.random() * 0.7; // Moderate to smooth
  }
  
  // Thickness ratio: 0.06 to 0.20 - INCREASED VARIATION
  let thickness_ratio: number;
  if (airfoilType === 'Thin Sharp') {
    thickness_ratio = 0.05 + Math.random() * 0.05; // Very thin: 5-10%
  } else if (airfoilType === 'NACA 6-series') {
    thickness_ratio = 0.08 + Math.random() * 0.08; // Moderate: 8-16%
  } else if (airfoilType === 'Wortmann FX') {
    thickness_ratio = 0.13 + Math.random() * 0.07; // Thick: 13-20%
  } else if (airfoilType === 'Random Procedural') {
    thickness_ratio = 0.05 + Math.random() * 0.18; // Full range: 5-23%
  } else if (airfoilType === 'High Camber UAV') {
    thickness_ratio = 0.14 + Math.random() * 0.08; // Thick: 14-22%
  } else {
    thickness_ratio = 0.07 + Math.random() * 0.14; // General: 7-21%
  }
  
  // Leading edge radius: 0.005 to 0.025
  let leading_edge_radius: number;
  if (airfoilType === 'Thin Sharp') {
    leading_edge_radius = 0.005 + Math.random() * 0.005; // Sharp
  } else if (airfoilType === 'Selig') {
    leading_edge_radius = 0.012 + Math.random() * 0.013; // Rounded
  } else if (airfoilType === 'Random Procedural') {
    leading_edge_radius = 0.005 + Math.random() * 0.020; // Full range
  } else {
    leading_edge_radius = 0.008 + Math.random() * 0.017; // General range
  }
  
  // Trailing edge angle: 5 to 25 degrees
  let trailing_edge_angle: number;
  if (airfoilType === 'Thin Sharp') {
    trailing_edge_angle = 5 + Math.random() * 8; // Sharp trailing edge
  } else if (airfoilType === 'Reflex Camber') {
    trailing_edge_angle = 8 + Math.random() * 7; // Moderate
  } else if (airfoilType === 'Random Procedural') {
    trailing_edge_angle = 5 + Math.random() * 20; // Full range
  } else {
    trailing_edge_angle = 10 + Math.random() * 12; // General range
  }
  
  return {
    temperature,
    camber,
    smoothness,
    thickness_ratio,
    leading_edge_radius,
    trailing_edge_angle,
    airfoilType,
  };
}

/**
 * Generate airfoil coordinates from parameters and latent vector
 * Each airfoil type uses a COMPLETELY DIFFERENT mathematical formula
 */
function generateAirfoilCoordinates(
  params: AirfoilParameters,
  latent: number[]
): AeroPoint[] {
  // Random high resolution: 200-400 points
  const numPoints = MIN_POINTS + Math.floor(Math.random() * (MAX_POINTS - MIN_POINTS + 1));
  
  // Route to type-specific generation function
  switch (params.airfoilType) {
    case 'NACA 4-digit':
      return generateNACA4Digit(params, latent, numPoints);
    case 'NACA 5-digit':
      return generateNACA5Digit(params, latent, numPoints);
    case 'NACA 6-series':
      return generateNACA6Series(params, latent, numPoints);
    case 'Selig':
      return generateSelig(params, latent, numPoints);
    case 'Eppler':
      return generateEppler(params, latent, numPoints);
    case 'Wortmann FX':
      return generateWortmannFX(params, latent, numPoints);
    case 'Thin Sharp':
      return generateThinSharp(params, latent, numPoints);
    case 'Reflex Camber':
      return generateReflexCamber(params, latent, numPoints);
    case 'High Camber UAV':
      return generateHighCamberUAV(params, latent, numPoints);
    case 'Random Procedural':
      return generateRandomProcedural(params, latent, numPoints);
    default:
      return generateNACA4Digit(params, latent, numPoints);
  }
}

/**
 * TYPE-SPECIFIC GENERATION FUNCTIONS
 * Each function implements a unique mathematical formula for that airfoil family
 * Imported from airfoilShapeGenerators.ts
 */

/**
 * Generate a completely new, unique airfoil
 */
export function generateRandomAirfoil(): GeneratedAirfoil {
  // Select random airfoil type - FORCE NEW SELECTION EACH TIME
  const { type, description, designNotes } = selectRandomAirfoilType();
  console.log(`🎲 Generated airfoil type: ${type}`);
  
  // Generate random parameters - FORCE NEW PARAMETERS EACH TIME
  const parameters = generateRandomParameters(type);
  console.log(`📊 Parameters: thickness=${(parameters.thickness_ratio*100).toFixed(1)}%, camber=${(parameters.camber*100).toFixed(1)}%`);
  
  // Generate unique latent vector - FORCE NEW VECTOR EACH TIME
  const latentVector = generateUniqueLatentVector();
  console.log(`🧬 Latent vector generated: ${latentVector.length} dimensions`);
  
  // Generate coordinates - FORCE NEW COORDINATES EACH TIME
  const coordinates = generateAirfoilCoordinates(parameters, latentVector);
  console.log(`✅ Generated ${coordinates.length} coordinate points`);
  
  // Create metadata
  const metadata = {
    generationTime: new Date().toISOString(),
    uniqueId: `airfoil_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    description: `${type} - ${description}`,
    designNotes,
    pointCount: coordinates.length,
  };
  
  console.log(`🎨 Airfoil generated: ${metadata.uniqueId}`);
  
  return {
    coordinates,
    latentVector,
    parameters,
    metadata,
  };
}

/**
 * Format airfoil as .dat file content
 */
export function formatAirfoilDat(airfoil: GeneratedAirfoil): string {
  let output = `${airfoil.metadata.description}\n`;
  output += `Generated: ${airfoil.metadata.generationTime}\n`;
  output += `ID: ${airfoil.metadata.uniqueId}\n`;
  output += `\n`;
  
  for (const point of airfoil.coordinates) {
    output += `${point.x.toFixed(6)}  ${point.y.toFixed(6)}\n`;
  }
  
  return output;
}

/**
 * Get parameter summary
 */
export function getParameterSummary(params: AirfoilParameters): string {
  return `
Airfoil Type: ${params.airfoilType}
Temperature: ${params.temperature.toFixed(3)} (${params.temperature < 1 ? 'stable' : params.temperature < 3 ? 'moderate' : 'wild'})
Camber: ${params.camber.toFixed(4)} (${params.camber < 0 ? 'reflex' : 'positive lift'})
Smoothness: ${params.smoothness.toFixed(3)} (${params.smoothness < 0.3 ? 'rough' : params.smoothness < 0.7 ? 'moderate' : 'smooth'})
Thickness Ratio: ${(params.thickness_ratio * 100).toFixed(2)}%
Leading Edge Radius: ${params.leading_edge_radius.toFixed(4)}
Trailing Edge Angle: ${params.trailing_edge_angle.toFixed(2)}°
  `.trim();
}

/**
 * Get latent vector summary
 */
export function getLatentVectorSummary(latent: number[]): string {
  const mean = latent.reduce((a, b) => a + b, 0) / latent.length;
  const variance = latent.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / latent.length;
  const stdDev = Math.sqrt(variance);
  
  return `
Latent Vector (${latent.length} dimensions):
[${latent.map(v => v.toFixed(3)).join(', ')}]

Statistics:
  Mean: ${mean.toFixed(4)}
  Std Dev: ${stdDev.toFixed(4)}
  Min: ${Math.min(...latent).toFixed(4)}
  Max: ${Math.max(...latent).toFixed(4)}
  `.trim();
}
