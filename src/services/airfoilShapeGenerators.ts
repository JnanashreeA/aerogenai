/**
 * Type-Specific Airfoil Shape Generators
 * Each function implements a UNIQUE mathematical formula for that airfoil family
 * This creates truly different shapes, not just parameter variations
 */

import type { AeroPoint } from '@/types/aero';

// AirfoilParameters interface
export interface AirfoilParameters {
  temperature: number;
  camber: number;
  smoothness: number;
  thickness_ratio: number;
  leading_edge_radius: number;
  trailing_edge_angle: number;
  airfoilType: string;
}

/**
 * NACA 4-digit: Classic general-purpose airfoil
 * Uses standard NACA thickness and camber distributions
 */
export function generateNACA4Digit(
  params: AirfoilParameters,
  latent: number[],
  numPoints: number
): AeroPoint[] {
  const coordinates: AeroPoint[] = [];
  const p = 0.4; // Max camber at 40% chord (classic NACA)
  
  // Upper surface
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = 1 - (i / (numPoints / 2));
    
    // Standard NACA thickness distribution
    const t = params.thickness_ratio;
    const yt = 5 * t * (
      0.2969 * Math.sqrt(x) -
      0.1260 * x -
      0.3516 * x * x +
      0.2843 * x * x * x -
      0.1015 * x * x * x * x
    );
    
    // Standard NACA camber line
    const m = params.camber;
    let yc: number;
    if (x < p) {
      yc = (m / (p * p)) * (2 * p * x - x * x);
    } else {
      yc = (m / ((1 - p) * (1 - p))) * ((1 - 2 * p) + 2 * p * x - x * x);
    }
    
    // Add latent variation
    let latentMod = 0;
    for (let j = 0; j < Math.min(8, latent.length); j++) {
      latentMod += latent[j] * Math.sin((j + 1) * Math.PI * x) * 0.02;
    }
    
    const y = yc + yt + latentMod;
    coordinates.push({ x, y });
  }
  
  // Lower surface
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = i / (numPoints / 2);
    
    const t = params.thickness_ratio;
    const yt = 5 * t * (
      0.2969 * Math.sqrt(x) -
      0.1260 * x -
      0.3516 * x * x +
      0.2843 * x * x * x -
      0.1015 * x * x * x * x
    );
    
    const m = params.camber;
    let yc: number;
    if (x < p) {
      yc = (m / (p * p)) * (2 * p * x - x * x);
    } else {
      yc = (m / ((1 - p) * (1 - p))) * ((1 - 2 * p) + 2 * p * x - x * x);
    }
    
    let latentMod = 0;
    for (let j = 0; j < Math.min(8, latent.length); j++) {
      latentMod += latent[j] * Math.cos((j + 1) * Math.PI * x) * 0.02;
    }
    
    const y = yc - yt + latentMod;
    coordinates.push({ x, y });
  }
  
  return coordinates;
}

/**
 * NACA 5-digit: Refined camber distribution
 * Uses modified camber line for better lift characteristics
 */
export function generateNACA5Digit(
  params: AirfoilParameters,
  latent: number[],
  numPoints: number
): AeroPoint[] {
  const coordinates: AeroPoint[] = [];
  const p = 0.2; // Max camber at 20% chord (forward-loaded)
  const k1 = 15.957; // NACA 5-digit constant
  
  // Upper surface
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = 1 - (i / (numPoints / 2));
    
    // Standard NACA thickness
    const t = params.thickness_ratio;
    const yt = 5 * t * (
      0.2969 * Math.sqrt(x) -
      0.1260 * x -
      0.3516 * x * x +
      0.2843 * x * x * x -
      0.1015 * x * x * x * x
    );
    
    // NACA 5-digit camber line (different formula!)
    const m = params.camber;
    let yc: number;
    if (x < p) {
      yc = (k1 / 6) * (x * x * x - 3 * p * x * x + p * p * (3 - p) * x) * m;
    } else {
      yc = (k1 * p * p * p / 6) * (1 - x) * m;
    }
    
    // Add latent variation with different pattern
    let latentMod = 0;
    for (let j = 0; j < Math.min(8, latent.length); j++) {
      latentMod += latent[j] * Math.sin((j + 2) * Math.PI * x + Math.PI / 4) * 0.025;
    }
    
    const y = yc + yt + latentMod;
    coordinates.push({ x, y });
  }
  
  // Lower surface
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = i / (numPoints / 2);
    
    const t = params.thickness_ratio;
    const yt = 5 * t * (
      0.2969 * Math.sqrt(x) -
      0.1260 * x -
      0.3516 * x * x +
      0.2843 * x * x * x -
      0.1015 * x * x * x * x
    );
    
    const m = params.camber;
    let yc: number;
    if (x < p) {
      yc = (k1 / 6) * (x * x * x - 3 * p * x * x + p * p * (3 - p) * x) * m;
    } else {
      yc = (k1 * p * p * p / 6) * (1 - x) * m;
    }
    
    let latentMod = 0;
    for (let j = 0; j < Math.min(8, latent.length); j++) {
      latentMod += latent[j] * Math.cos((j + 2) * Math.PI * x + Math.PI / 4) * 0.025;
    }
    
    const y = yc - yt + latentMod;
    coordinates.push({ x, y });
  }
  
  return coordinates;
}

/**
 * NACA 6-series: Laminar flow airfoil
 * Uses modified thickness distribution for extended laminar flow
 */
export function generateNACA6Series(
  params: AirfoilParameters,
  latent: number[],
  numPoints: number
): AeroPoint[] {
  const coordinates: AeroPoint[] = [];
  const p = 0.5; // Max camber at 50% chord (aft-loaded for laminar flow)
  
  // Upper surface
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = 1 - (i / (numPoints / 2));
    
    // Modified thickness distribution for laminar flow (sharper leading edge)
    const t = params.thickness_ratio;
    const yt = 5 * t * (
      0.2000 * Math.sqrt(x) -  // Reduced leading edge radius
      0.1000 * x -
      0.4000 * x * x +          // Increased mid-chord thickness
      0.3000 * x * x * x -
      0.1000 * x * x * x * x
    );
    
    // Aft-loaded camber for laminar flow
    const m = params.camber;
    const yc = m * x * x * (3 - 2 * x); // Cubic distribution
    
    // Add latent variation
    let latentMod = 0;
    for (let j = 0; j < Math.min(8, latent.length); j++) {
      latentMod += latent[j] * Math.sin((j + 1) * Math.PI * x + Math.PI / 2) * 0.015;
    }
    
    const y = yc + yt + latentMod;
    coordinates.push({ x, y });
  }
  
  // Lower surface
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = i / (numPoints / 2);
    
    const t = params.thickness_ratio;
    const yt = 5 * t * (
      0.2000 * Math.sqrt(x) -
      0.1000 * x -
      0.4000 * x * x +
      0.3000 * x * x * x -
      0.1000 * x * x * x * x
    );
    
    const m = params.camber;
    const yc = m * x * x * (3 - 2 * x);
    
    let latentMod = 0;
    for (let j = 0; j < Math.min(8, latent.length); j++) {
      latentMod += latent[j] * Math.cos((j + 1) * Math.PI * x + Math.PI / 2) * 0.015;
    }
    
    const y = yc - yt + latentMod;
    coordinates.push({ x, y });
  }
  
  return coordinates;
}

/**
 * Selig: Low Reynolds number airfoil
 * Thicker leading edge, rounded trailing edge
 */
export function generateSelig(
  params: AirfoilParameters,
  latent: number[],
  numPoints: number
): AeroPoint[] {
  const coordinates: AeroPoint[] = [];
  
  // Upper surface
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = 1 - (i / (numPoints / 2));
    
    // Thicker leading edge for low Re
    const t = params.thickness_ratio;
    const yt = 5 * t * (
      0.35 * Math.sqrt(x) -     // Much thicker leading edge
      0.08 * x -
      0.25 * x * x +
      0.20 * x * x * x -
      0.08 * x * x * x * x      // Rounded trailing edge
    );
    
    // Moderate camber
    const m = params.camber;
    const p = 0.35;
    let yc: number;
    if (x < p) {
      yc = (m / (p * p)) * (2 * p * x - x * x);
    } else {
      yc = (m / ((1 - p) * (1 - p))) * ((1 - 2 * p) + 2 * p * x - x * x);
    }
    
    // Add latent variation
    let latentMod = 0;
    for (let j = 0; j < Math.min(8, latent.length); j++) {
      latentMod += latent[j] * Math.sin((j + 1) * Math.PI * x) * 0.03;
    }
    
    const y = yc + yt + latentMod;
    coordinates.push({ x, y });
  }
  
  // Lower surface
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = i / (numPoints / 2);
    
    const t = params.thickness_ratio;
    const yt = 5 * t * (
      0.35 * Math.sqrt(x) -
      0.08 * x -
      0.25 * x * x +
      0.20 * x * x * x -
      0.08 * x * x * x * x
    );
    
    const m = params.camber;
    const p = 0.35;
    let yc: number;
    if (x < p) {
      yc = (m / (p * p)) * (2 * p * x - x * x);
    } else {
      yc = (m / ((1 - p) * (1 - p))) * ((1 - 2 * p) + 2 * p * x - x * x);
    }
    
    let latentMod = 0;
    for (let j = 0; j < Math.min(8, latent.length); j++) {
      latentMod += latent[j] * Math.cos((j + 1) * Math.PI * x) * 0.03;
    }
    
    const y = yc - yt + latentMod;
    coordinates.push({ x, y });
  }
  
  return coordinates;
}

/**
 * Eppler: High-performance glider airfoil
 * Optimized for maximum L/D ratio
 */
export function generateEppler(
  params: AirfoilParameters,
  latent: number[],
  numPoints: number
): AeroPoint[] {
  const coordinates: AeroPoint[] = [];
  
  // Upper surface
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = 1 - (i / (numPoints / 2));
    
    // Optimized thickness distribution for gliders
    const t = params.thickness_ratio;
    const yt = 5 * t * (
      0.25 * Math.sqrt(x) -
      0.12 * x -
      0.30 * x * x +
      0.25 * x * x * x -
      0.12 * x * x * x * x      // Thin trailing edge
    );
    
    // Forward-loaded camber for good L/D
    const m = params.camber;
    const yc = m * Math.sqrt(x) * (1 - x);
    
    // Add latent variation
    let latentMod = 0;
    for (let j = 0; j < Math.min(8, latent.length); j++) {
      latentMod += latent[j] * Math.sin((j + 1.5) * Math.PI * x) * 0.02;
    }
    
    const y = yc + yt + latentMod;
    coordinates.push({ x, y });
  }
  
  // Lower surface
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = i / (numPoints / 2);
    
    const t = params.thickness_ratio;
    const yt = 5 * t * (
      0.25 * Math.sqrt(x) -
      0.12 * x -
      0.30 * x * x +
      0.25 * x * x * x -
      0.12 * x * x * x * x
    );
    
    const m = params.camber;
    const yc = m * Math.sqrt(x) * (1 - x);
    
    let latentMod = 0;
    for (let j = 0; j < Math.min(8, latent.length); j++) {
      latentMod += latent[j] * Math.cos((j + 1.5) * Math.PI * x) * 0.02;
    }
    
    const y = yc - yt + latentMod;
    coordinates.push({ x, y });
  }
  
  return coordinates;
}

/**
 * Wortmann FX: High-lift sailplane profile
 * German-designed with thick profile and high camber
 */
export function generateWortmannFX(
  params: AirfoilParameters,
  latent: number[],
  numPoints: number
): AeroPoint[] {
  const coordinates: AeroPoint[] = [];
  
  // Upper surface
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = 1 - (i / (numPoints / 2));
    
    // Thick profile for high lift
    const t = params.thickness_ratio;
    const yt = 5 * t * (
      0.32 * Math.sqrt(x) -     // Thick leading edge
      0.10 * x -
      0.28 * x * x +
      0.22 * x * x * x -
      0.09 * x * x * x * x
    );
    
    // High camber distribution
    const m = params.camber;
    const p = 0.3;
    let yc: number;
    if (x < p) {
      yc = (m / (p * p)) * (2 * p * x - x * x) * 1.2; // 20% more camber
    } else {
      yc = (m / ((1 - p) * (1 - p))) * ((1 - 2 * p) + 2 * p * x - x * x) * 1.2;
    }
    
    // Add latent variation
    let latentMod = 0;
    for (let j = 0; j < Math.min(8, latent.length); j++) {
      latentMod += latent[j] * Math.sin((j + 0.5) * Math.PI * x) * 0.025;
    }
    
    const y = yc + yt + latentMod;
    coordinates.push({ x, y });
  }
  
  // Lower surface
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = i / (numPoints / 2);
    
    const t = params.thickness_ratio;
    const yt = 5 * t * (
      0.32 * Math.sqrt(x) -
      0.10 * x -
      0.28 * x * x +
      0.22 * x * x * x -
      0.09 * x * x * x * x
    );
    
    const m = params.camber;
    const p = 0.3;
    let yc: number;
    if (x < p) {
      yc = (m / (p * p)) * (2 * p * x - x * x) * 1.2;
    } else {
      yc = (m / ((1 - p) * (1 - p))) * ((1 - 2 * p) + 2 * p * x - x * x) * 1.2;
    }
    
    let latentMod = 0;
    for (let j = 0; j < Math.min(8, latent.length); j++) {
      latentMod += latent[j] * Math.cos((j + 0.5) * Math.PI * x) * 0.025;
    }
    
    const y = yc - yt + latentMod;
    coordinates.push({ x, y });
  }
  
  return coordinates;
}

/**
 * Thin Sharp: Race-car aerodynamics
 * Minimal thickness, sharp edges, flat surfaces
 */
export function generateThinSharp(
  params: AirfoilParameters,
  latent: number[],
  numPoints: number
): AeroPoint[] {
  const coordinates: AeroPoint[] = [];
  
  // Upper surface
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = 1 - (i / (numPoints / 2));
    
    // Very thin, sharp profile
    const t = params.thickness_ratio;
    const yt = 5 * t * (
      0.15 * Math.sqrt(x) -     // Sharp leading edge
      0.15 * x -
      0.40 * x * x +            // Flat mid-section
      0.30 * x * x * x -
      0.15 * x * x * x * x      // Sharp trailing edge
    );
    
    // Minimal camber
    const m = params.camber * 0.5; // Reduce camber for race cars
    const yc = m * x * (1 - x);
    
    // Add latent variation (minimal)
    let latentMod = 0;
    for (let j = 0; j < Math.min(4, latent.length); j++) {
      latentMod += latent[j] * Math.sin((j + 1) * Math.PI * x) * 0.01;
    }
    
    const y = yc + yt + latentMod;
    coordinates.push({ x, y });
  }
  
  // Lower surface
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = i / (numPoints / 2);
    
    const t = params.thickness_ratio;
    const yt = 5 * t * (
      0.15 * Math.sqrt(x) -
      0.15 * x -
      0.40 * x * x +
      0.30 * x * x * x -
      0.15 * x * x * x * x
    );
    
    const m = params.camber * 0.5;
    const yc = m * x * (1 - x);
    
    let latentMod = 0;
    for (let j = 0; j < Math.min(4, latent.length); j++) {
      latentMod += latent[j] * Math.cos((j + 1) * Math.PI * x) * 0.01;
    }
    
    const y = yc - yt + latentMod;
    coordinates.push({ x, y });
  }
  
  return coordinates;
}

/**
 * Reflex Camber: Flying wing stability
 * S-shaped camber line with upswept trailing edge
 */
export function generateReflexCamber(
  params: AirfoilParameters,
  latent: number[],
  numPoints: number
): AeroPoint[] {
  const coordinates: AeroPoint[] = [];
  
  // Upper surface
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = 1 - (i / (numPoints / 2));
    
    // Standard thickness
    const t = params.thickness_ratio;
    const yt = 5 * t * (
      0.2969 * Math.sqrt(x) -
      0.1260 * x -
      0.3516 * x * x +
      0.2843 * x * x * x -
      0.1015 * x * x * x * x
    );
    
    // S-shaped reflex camber line
    const m = params.camber;
    const yc = m * (
      Math.sin(Math.PI * x) -           // Positive camber forward
      0.5 * Math.sin(2 * Math.PI * x)   // Negative camber aft (reflex)
    );
    
    // Add latent variation
    let latentMod = 0;
    for (let j = 0; j < Math.min(8, latent.length); j++) {
      latentMod += latent[j] * Math.sin((j + 1) * Math.PI * x) * 0.02;
    }
    
    const y = yc + yt + latentMod;
    coordinates.push({ x, y });
  }
  
  // Lower surface
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = i / (numPoints / 2);
    
    const t = params.thickness_ratio;
    const yt = 5 * t * (
      0.2969 * Math.sqrt(x) -
      0.1260 * x -
      0.3516 * x * x +
      0.2843 * x * x * x -
      0.1015 * x * x * x * x
    );
    
    const m = params.camber;
    const yc = m * (
      Math.sin(Math.PI * x) -
      0.5 * Math.sin(2 * Math.PI * x)
    );
    
    let latentMod = 0;
    for (let j = 0; j < Math.min(8, latent.length); j++) {
      latentMod += latent[j] * Math.cos((j + 1) * Math.PI * x) * 0.02;
    }
    
    const y = yc - yt + latentMod;
    coordinates.push({ x, y });
  }
  
  return coordinates;
}

/**
 * High Camber UAV: Maximum lift for drones
 * Extreme curvature, thick profile
 */
export function generateHighCamberUAV(
  params: AirfoilParameters,
  latent: number[],
  numPoints: number
): AeroPoint[] {
  const coordinates: AeroPoint[] = [];
  
  // Upper surface
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = 1 - (i / (numPoints / 2));
    
    // Thick profile
    const t = params.thickness_ratio;
    const yt = 5 * t * (
      0.35 * Math.sqrt(x) -     // Very thick leading edge
      0.08 * x -
      0.25 * x * x +
      0.20 * x * x * x -
      0.08 * x * x * x * x
    );
    
    // Extreme camber
    const m = params.camber * 1.5; // 50% more camber
    const p = 0.25; // Forward-loaded
    let yc: number;
    if (x < p) {
      yc = (m / (p * p)) * (2 * p * x - x * x);
    } else {
      yc = (m / ((1 - p) * (1 - p))) * ((1 - 2 * p) + 2 * p * x - x * x);
    }
    
    // Add latent variation
    let latentMod = 0;
    for (let j = 0; j < Math.min(8, latent.length); j++) {
      latentMod += latent[j] * Math.sin((j + 1) * Math.PI * x) * 0.03;
    }
    
    const y = yc + yt + latentMod;
    coordinates.push({ x, y });
  }
  
  // Lower surface
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = i / (numPoints / 2);
    
    const t = params.thickness_ratio;
    const yt = 5 * t * (
      0.35 * Math.sqrt(x) -
      0.08 * x -
      0.25 * x * x +
      0.20 * x * x * x -
      0.08 * x * x * x * x
    );
    
    const m = params.camber * 1.5;
    const p = 0.25;
    let yc: number;
    if (x < p) {
      yc = (m / (p * p)) * (2 * p * x - x * x);
    } else {
      yc = (m / ((1 - p) * (1 - p))) * ((1 - 2 * p) + 2 * p * x - x * x);
    }
    
    let latentMod = 0;
    for (let j = 0; j < Math.min(8, latent.length); j++) {
      latentMod += latent[j] * Math.cos((j + 1) * Math.PI * x) * 0.03;
    }
    
    const y = yc - yt + latentMod;
    coordinates.push({ x, y });
  }
  
  return coordinates;
}

/**
 * Random Procedural: Pure algorithmic generation
 * Uses Bezier curves and Fourier series for unconventional shapes
 */
export function generateRandomProcedural(
  params: AirfoilParameters,
  latent: number[],
  numPoints: number
): AeroPoint[] {
  const coordinates: AeroPoint[] = [];
  
  // Upper surface
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = 1 - (i / (numPoints / 2));
    
    // Fourier series for thickness
    const t = params.thickness_ratio;
    let yt = 0;
    for (let j = 0; j < Math.min(12, latent.length); j++) {
      yt += latent[j] * Math.sin((j + 1) * Math.PI * x) * t * 0.5;
    }
    yt = Math.abs(yt); // Ensure positive thickness
    
    // Bezier curve for camber
    const m = params.camber;
    const t1 = x;
    const t2 = 1 - x;
    const yc = m * (
      latent[0] * t1 * t2 * t2 * t2 +
      latent[1] * t1 * t1 * t2 * t2 +
      latent[2] * t1 * t1 * t1 * t2
    ) * 4;
    
    const y = yc + yt;
    coordinates.push({ x, y });
  }
  
  // Lower surface
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = i / (numPoints / 2);
    
    const t = params.thickness_ratio;
    let yt = 0;
    for (let j = 0; j < Math.min(12, latent.length); j++) {
      yt += latent[j] * Math.cos((j + 1) * Math.PI * x) * t * 0.5;
    }
    yt = Math.abs(yt);
    
    const m = params.camber;
    const t1 = x;
    const t2 = 1 - x;
    const yc = m * (
      latent[3] * t1 * t2 * t2 * t2 +
      latent[4] * t1 * t1 * t2 * t2 +
      latent[5] * t1 * t1 * t1 * t2
    ) * 4;
    
    const y = yc - yt;
    coordinates.push({ x, y });
  }
  
  return coordinates;
}
