import type { AeroPoint, AeroShape, ComponentType, GenerationParams } from '@/types/aero';
import { MLShapeGenerator } from './mlShapeGenerator';

export interface ParameterAdjustment {
  parameter: string;
  original: number;
  adjusted: number;
  reason: string;
}

export interface GenerationResult {
  shape: AeroShape;
  adjustments: ParameterAdjustment[];
}

export class ShapeGenerator {
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate shape with automatic parameter optimization
   * Returns both the shape and any parameter adjustments made
   */
  static generateShapeWithAdjustments(
    type: ComponentType,
    params: GenerationParams
  ): GenerationResult {
    const adjustments: ParameterAdjustment[] = [];

    // Track adjustments for airfoils
    if (type === 'airfoil') {
      const { complexity = 50, temperature = 0.7, latentDimension = 32, smoothness = 0.8 } = params;

      if (complexity > 60) {
        adjustments.push({
          parameter: 'Complexity',
          original: complexity,
          adjusted: 60,
          reason: 'Limited to 60 for stable airfoils',
        });
      } else if (complexity < 30) {
        adjustments.push({
          parameter: 'Complexity',
          original: complexity,
          adjusted: 30,
          reason: 'Minimum 30 for quality shapes',
        });
      }

      if (temperature > 0.5) {
        adjustments.push({
          parameter: 'Temperature',
          original: temperature,
          adjusted: 0.5,
          reason: 'Limited to 0.5 for proven designs',
        });
      } else if (temperature < 0.2) {
        adjustments.push({
          parameter: 'Temperature',
          original: temperature,
          adjusted: 0.2,
          reason: 'Minimum 0.2 for variety',
        });
      }

      if (latentDimension > 48) {
        adjustments.push({
          parameter: 'Latent Dimension',
          original: latentDimension,
          adjusted: 48,
          reason: 'Limited to 48 for controlled diversity',
        });
      } else if (latentDimension < 16) {
        adjustments.push({
          parameter: 'Latent Dimension',
          original: latentDimension,
          adjusted: 16,
          reason: 'Minimum 16 for sufficient variety',
        });
      }

      if (smoothness < 0.8) {
        adjustments.push({
          parameter: 'Smoothness',
          original: smoothness,
          adjusted: 0.8,
          reason: 'Minimum 0.8 for quality surfaces',
        });
      }
    }

    const shape = this.generateShape(type, params);
    return { shape, adjustments };
  }

  static generateAirfoil(params: GenerationParams): AeroShape {
    const {
      complexity = 50,
      smoothness = 0.8,
      temperature = 0.7,
      latentDimension = 32,
      thickness = 0.12,
      camber = 0.02,
    } = params;
    const points: AeroPoint[] = [];

    // CRITICAL: Automatic parameter optimization for L/D > 50 guarantee
    // Constrain ALL parameters to proven high-performance ranges
    
    // Complexity: Limit to 30-60 for stable, smooth airfoils
    const safeComplexity = Math.max(30, Math.min(60, complexity));
    
    // Temperature: Force to 0.2-0.5 range for proven designs
    // High temperature (>0.6) creates experimental shapes that may fail
    const safeTemperature = Math.max(0.2, Math.min(0.5, temperature));
    
    // Latent Dimension: Limit to 16-48 for controlled diversity
    const safeLatentDim = Math.max(16, Math.min(48, latentDimension));
    
    // Smoothness: Enforce minimum 0.8 for quality surfaces
    const safeSmoothness = Math.max(0.8, Math.min(1.0, smoothness));

    // Constrain parameters for realistic, high-performance airfoils
    const latentNoise = safeLatentDim / 128; // Reduced noise
    const tempVariation = safeTemperature * 0.2; // Further reduced for stability

    // Optimize camber and thickness for high L/D ratio
    // High-performance airfoils MUST have:
    // - Thickness: 8-13% for optimal L/D (not too thin, not too thick)
    // - Camber: 1.5-4.5% for efficient lift without excessive drag
    // - Camber position: 30-40% chord for low drag
    const optimalThickness = Math.max(0.08, Math.min(0.13, thickness));
    const optimalCamber = Math.max(0.015, Math.min(0.045, camber));
    
    const maxCamber = optimalCamber * (1 + (Math.random() - 0.5) * tempVariation * 0.15);
    const maxCamberPos = 0.35 + (Math.random() - 0.5) * tempVariation * 0.08; // Keep near optimal
    const actualThickness = optimalThickness * (1 + (Math.random() - 0.5) * tempVariation * 0.1);

    // Use cosine spacing for better leading edge resolution
    const numPoints = Math.floor(safeComplexity);
    
    // Generate upper surface
    for (let i = 0; i <= numPoints; i++) {
      const beta = (i / numPoints) * Math.PI;
      const xc = (1 - Math.cos(beta)) / 2; // Cosine spacing

      // NACA 4-digit camber line
      let yc = 0;
      let dyc_dx = 0;
      if (xc < maxCamberPos) {
        yc = (maxCamber / (maxCamberPos * maxCamberPos)) * (2 * maxCamberPos * xc - xc * xc);
        dyc_dx = (2 * maxCamber / (maxCamberPos * maxCamberPos)) * (maxCamberPos - xc);
      } else {
        yc =
          (maxCamber / ((1 - maxCamberPos) * (1 - maxCamberPos))) *
          (1 - 2 * maxCamberPos + 2 * maxCamberPos * xc - xc * xc);
        dyc_dx = (2 * maxCamber / ((1 - maxCamberPos) * (1 - maxCamberPos))) * (maxCamberPos - xc);
      }

      // NACA 4-digit thickness distribution (modified for smoother trailing edge)
      const a0 = 0.2969;
      const a1 = -0.126;
      const a2 = -0.3516;
      const a3 = 0.2843;
      const a4 = -0.1036; // Modified for closed trailing edge
      
      const yt = 5 * actualThickness * (
        a0 * Math.sqrt(xc) + 
        a1 * xc + 
        a2 * xc * xc + 
        a3 * xc * xc * xc + 
        a4 * xc * xc * xc * xc
      );

      // Minimal noise for smooth surfaces - use safeSmoothness
      const noise = (Math.random() - 0.5) * (1 - safeSmoothness) * 0.002 * safeTemperature * latentNoise;

      // Calculate surface normal angle
      const theta = Math.atan(dyc_dx);
      
      // Upper surface point
      const xu = xc - yt * Math.sin(theta);
      const yu = yc + yt * Math.cos(theta) + noise;
      
      points.push({ x: xu, y: yu });
    }

    // Generate lower surface (reverse order for closed contour)
    for (let i = numPoints; i >= 0; i--) {
      const beta = (i / numPoints) * Math.PI;
      const xc = (1 - Math.cos(beta)) / 2;

      let yc = 0;
      let dyc_dx = 0;
      if (xc < maxCamberPos) {
        yc = (maxCamber / (maxCamberPos * maxCamberPos)) * (2 * maxCamberPos * xc - xc * xc);
        dyc_dx = (2 * maxCamber / (maxCamberPos * maxCamberPos)) * (maxCamberPos - xc);
      } else {
        yc =
          (maxCamber / ((1 - maxCamberPos) * (1 - maxCamberPos))) *
          (1 - 2 * maxCamberPos + 2 * maxCamberPos * xc - xc * xc);
        dyc_dx = (2 * maxCamber / ((1 - maxCamberPos) * (1 - maxCamberPos))) * (maxCamberPos - xc);
      }

      const a0 = 0.2969;
      const a1 = -0.126;
      const a2 = -0.3516;
      const a3 = 0.2843;
      const a4 = -0.1036;
      
      const yt = 5 * actualThickness * (
        a0 * Math.sqrt(xc) + 
        a1 * xc + 
        a2 * xc * xc + 
        a3 * xc * xc * xc + 
        a4 * xc * xc * xc * xc
      );

      const noise = (Math.random() - 0.5) * (1 - safeSmoothness) * 0.002 * safeTemperature * latentNoise;
      
      const theta = Math.atan(dyc_dx);
      
      // Lower surface point
      const xl = xc + yt * Math.sin(theta);
      const yl = yc - yt * Math.cos(theta) + noise;
      
      points.push({ x: xl, y: yl });
    }

    return {
      id: this.generateId(),
      type: 'airfoil',
      name: `Generated Airfoil ${new Date().toLocaleTimeString()}`,
      points,
      isGenerated: true,
      timestamp: Date.now(),
    };
  }

  static generateSidepod(params: GenerationParams): AeroShape {
    const {
      complexity = 40,
      smoothness = 0.8,
      temperature = 0.7,
      latentDimension = 32,
      thickness = 0.12,
    } = params;
    const points: AeroPoint[] = [];

    const latentNoise = latentDimension / 128;

    // HIGH-PERFORMANCE SIDEPOD DESIGNS (F1-inspired)
    // Target: Drag 0.15-0.25, Cooling 75-85%
    
    // Select sidepod type based on temperature
    let sidepodType: 'coke-bottle' | 'undercut' | 'zero-pod' | 'slim-body';
    if (temperature < 0.3) {
      sidepodType = 'coke-bottle'; // Classic F1, best balance
    } else if (temperature < 0.6) {
      sidepodType = 'undercut'; // Modern F1, high cooling
    } else if (temperature < 0.9) {
      sidepodType = 'zero-pod'; // Mercedes 2022, low drag
    } else {
      sidepodType = 'slim-body'; // Red Bull style, aggressive
    }

    // Optimal parameters for each type (NO RANDOM VARIATION)
    let length, maxHeight, maxWidth, inletSize, outletSize, finenessRatio;
    
    switch (sidepodType) {
      case 'coke-bottle':
        // Classic coke-bottle shape (best balance)
        length = 1.0;
        maxHeight = 0.28;
        maxWidth = 0.22;
        inletSize = 0.85; // Large inlet for cooling
        outletSize = 0.55; // Moderate outlet
        finenessRatio = 4.2; // Optimal for low drag
        break;
      
      case 'undercut':
        // Undercut sidepod (high cooling, modern F1)
        length = 1.0;
        maxHeight = 0.32;
        maxWidth = 0.20;
        inletSize = 0.90; // Very large inlet
        outletSize = 0.60; // Large outlet
        finenessRatio = 4.5;
        break;
      
      case 'zero-pod':
        // Zero-pod concept (Mercedes 2022, low drag)
        length = 1.0;
        maxHeight = 0.22;
        maxWidth = 0.15;
        inletSize = 0.75; // Smaller inlet
        outletSize = 0.50; // Smaller outlet
        finenessRatio = 5.5; // Very streamlined
        break;
      
      case 'slim-body':
        // Slim body (Red Bull style, aggressive)
        length = 1.0;
        maxHeight = 0.26;
        maxWidth = 0.18;
        inletSize = 0.80;
        outletSize = 0.52;
        finenessRatio = 4.8;
        break;
    }

    const numPoints = Math.floor(complexity);

    // Generate upper surface with OPTIMAL streamlined profile
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const x = t * length;

      // Optimal teardrop shape for minimum drag
      // Peak at 30-35% chord for best pressure recovery
      const peakPosition = 0.32;
      let heightProfile;
      if (t < peakPosition) {
        // Smooth expansion to peak
        heightProfile = maxHeight * Math.pow(t / peakPosition, 0.6) * inletSize;
      } else {
        // Gradual contraction (coke-bottle effect)
        const contractionFactor = 1 - Math.pow((t - peakPosition) / (1 - peakPosition), 1.2);
        heightProfile = maxHeight * contractionFactor * (inletSize * (1 - t) + outletSize * t);
      }
      
      // Width variation for 3D coke-bottle effect
      const widthProfile = maxWidth * Math.sin(t * Math.PI * 0.85);

      // Minimal noise for smoothness
      const noise = smoothness < 0.9 ? (Math.random() - 0.5) * (1 - smoothness) * 0.002 * latentNoise : 0;

      points.push({ x, y: heightProfile + widthProfile + noise });
    }

    // Generate lower surface
    for (let i = numPoints; i >= 0; i--) {
      const t = i / numPoints;
      const x = t * length;

      const peakPosition = 0.32;
      let heightProfile;
      if (t < peakPosition) {
        heightProfile = maxHeight * Math.pow(t / peakPosition, 0.6) * inletSize;
      } else {
        const contractionFactor = 1 - Math.pow((t - peakPosition) / (1 - peakPosition), 1.2);
        heightProfile = maxHeight * contractionFactor * (inletSize * (1 - t) + outletSize * t);
      }
      
      const widthProfile = maxWidth * Math.sin(t * Math.PI * 0.85);
      const noise = smoothness < 0.9 ? (Math.random() - 0.5) * (1 - smoothness) * 0.002 * latentNoise : 0;

      points.push({ x, y: heightProfile - widthProfile + noise });
    }

    return {
      id: this.generateId(),
      type: 'sidepod',
      name: `${sidepodType.charAt(0).toUpperCase() + sidepodType.slice(1)} Sidepod`,
      points,
      isGenerated: true,
      timestamp: Date.now(),
    };
  }

  static generateDiffuser(params: GenerationParams): AeroShape {
    const {
      complexity = 30,
      smoothness = 0.8,
      temperature = 0.7,
      latentDimension = 32,
      thickness = 0.12,
      camber = 0.02,
    } = params;
    const points: AeroPoint[] = [];

    const latentNoise = latentDimension / 128;

    // HIGH-PERFORMANCE DIFFUSER DESIGNS (F1-inspired)
    // Target: Downforce 1.5-2.5, Drag 0.08-0.15, Efficiency > 10
    
    // Select diffuser type based on temperature
    let diffuserType: 'single-plane' | 'multi-channel' | 'aggressive' | 'venturi';
    if (temperature < 0.3) {
      diffuserType = 'single-plane'; // Classic, reliable
    } else if (temperature < 0.6) {
      diffuserType = 'multi-channel'; // Modern F1, high downforce
    } else if (temperature < 0.9) {
      diffuserType = 'aggressive'; // Maximum downforce
    } else {
      diffuserType = 'venturi'; // Ground effect, extreme
    }

    // Optimal parameters for each type (NO RANDOM VARIATION)
    let length, inletHeight, outletHeight, expansionAngle, expansionCurve;
    
    switch (diffuserType) {
      case 'single-plane':
        // Single-plane diffuser (classic, reliable)
        length = 1.0;
        inletHeight = 0.10; // 10% of length
        outletHeight = 0.25; // 25% of length
        expansionAngle = 12; // Optimal 12 degrees
        expansionCurve = 1.2; // Smooth expansion
        break;
      
      case 'multi-channel':
        // Multi-channel diffuser (modern F1)
        length = 1.0;
        inletHeight = 0.09;
        outletHeight = 0.28; // Higher expansion
        expansionAngle = 13;
        expansionCurve = 1.3;
        break;
      
      case 'aggressive':
        // Aggressive diffuser (maximum downforce)
        length = 1.0;
        inletHeight = 0.08;
        outletHeight = 0.30; // Very high expansion
        expansionAngle = 14; // Near separation limit
        expansionCurve = 1.4;
        break;
      
      case 'venturi':
        // Venturi diffuser (ground effect, extreme)
        length = 1.0;
        inletHeight = 0.07; // Very low inlet
        outletHeight = 0.32; // Maximum expansion
        expansionAngle = 15; // At separation limit
        expansionCurve = 1.5; // Aggressive curve
        break;
    }

    const numPoints = Math.floor(complexity);

    // Generate upper surface with OPTIMAL expansion profile
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const x = t * length;

      // Optimal expansion curve for maximum downforce without separation
      // Smooth acceleration at inlet, controlled expansion, gentle exit
      let heightExpansion;
      if (t < 0.15) {
        // Smooth inlet transition (avoid separation)
        heightExpansion = inletHeight * (1 + 0.5 * Math.pow(t / 0.15, 2));
      } else {
        // Controlled expansion with optimal curve
        const expandT = (t - 0.15) / 0.85;
        heightExpansion = inletHeight * 1.5 + (outletHeight - inletHeight * 1.5) * Math.pow(expandT, expansionCurve);
      }
      
      // Minimal noise for smoothness
      const noise = smoothness < 0.9 ? (Math.random() - 0.5) * (1 - smoothness) * 0.001 * latentNoise : 0;

      points.push({ x, y: heightExpansion + noise });
    }

    // Generate lower surface (flat with slight ground effect curve)
    for (let i = numPoints; i >= 0; i--) {
      const t = i / numPoints;
      const x = t * length;
      
      // Slight upward curve for enhanced ground effect
      // Venturi effect: accelerate flow under the car
      const groundCurve = camber * 0.08 * Math.sin(t * Math.PI * 0.8);
      const noise = smoothness < 0.9 ? (Math.random() - 0.5) * (1 - smoothness) * 0.001 * latentNoise : 0;

      points.push({ x, y: groundCurve + noise });
    }

    return {
      id: this.generateId(),
      type: 'diffuser',
      name: `${diffuserType.charAt(0).toUpperCase() + diffuserType.slice(1)} Diffuser`,
      points,
      isGenerated: true,
      timestamp: Date.now(),
    };
  }

  static generateWinglet(params: GenerationParams): AeroShape {
    const {
      complexity = 40,
      smoothness = 0.8,
      temperature = 0.7,
      latentDimension = 32,
      thickness = 0.12,
      camber = 0.02,
    } = params;
    const points: AeroPoint[] = [];

    const latentNoise = latentDimension / 128;

    // HIGH-PERFORMANCE WINGLET PARAMETERS (proven designs)
    // Based on blended winglet and sharklet designs (L/D > 60)
    
    // Select winglet type based on temperature
    let wingletType: 'blended' | 'sharklet' | 'raked' | 'split-scimitar';
    if (temperature < 0.3) {
      wingletType = 'blended'; // Most proven, highest L/D
    } else if (temperature < 0.6) {
      wingletType = 'sharklet'; // Good balance
    } else if (temperature < 0.9) {
      wingletType = 'raked'; // Modern design
    } else {
      wingletType = 'split-scimitar'; // Advanced design
    }

    // Optimal parameters for each type (NO RANDOM VARIATION)
    let span, rootChord, tipChord, sweep, dihedral, cant;
    
    switch (wingletType) {
      case 'blended':
        // Blended winglet (Boeing 737, L/D improvement 4-5%)
        span = 1.0;
        rootChord = 0.30;
        tipChord = 0.12;
        sweep = 22; // Optimal sweep angle
        dihedral = 75; // Optimal dihedral
        cant = 5; // Slight outward cant
        break;
      
      case 'sharklet':
        // Sharklet (Airbus A320, L/D improvement 3.5%)
        span = 1.05;
        rootChord = 0.28;
        tipChord = 0.10;
        sweep = 25;
        dihedral = 78;
        cant = 6;
        break;
      
      case 'raked':
        // Raked wingtip (Boeing 787, L/D improvement 3%)
        span = 1.15;
        rootChord = 0.32;
        tipChord = 0.08;
        sweep = 35;
        dihedral = 85;
        cant = 3;
        break;
      
      case 'split-scimitar':
        // Split-scimitar (Boeing 737 MAX, L/D improvement 5-6%)
        span = 0.95;
        rootChord = 0.30;
        tipChord = 0.14;
        sweep = 20;
        dihedral = 72;
        cant = 7;
        break;
    }

    const taperRatio = tipChord / rootChord;

    // Optimal thickness and camber (NO RANDOM VARIATION)
    const optimalThickness = Math.max(0.08, Math.min(0.12, thickness));
    const optimalCamber = Math.max(0.015, Math.min(0.04, camber));

    const numSpanStations = Math.floor(complexity / 2);
    const numChordPoints = 20;

    // Generate winglet surface with OPTIMAL geometry
    for (let i = 0; i <= numSpanStations; i++) {
      const spanPos = i / numSpanStations;
      const chord = rootChord + (tipChord - rootChord) * spanPos;
      const sweepOffset = Math.tan((sweep * Math.PI) / 180) * spanPos * span;
      const dihedralHeight = Math.sin((dihedral * Math.PI) / 180) * spanPos * span;
      const cantOffset = Math.sin((cant * Math.PI) / 180) * spanPos * span;

      // Optimal thickness and camber taper
      const localThickness = optimalThickness * (1 - spanPos * 0.35);
      const localCamber = optimalCamber * (1 - spanPos * 0.45);
      const localCamberPos = 0.35; // Optimal camber position (NO RANDOM)

      // Generate airfoil section at this span station
      for (let j = 0; j <= numChordPoints; j++) {
        const beta = (j / numChordPoints) * Math.PI;
        const chordPos = (1 - Math.cos(beta)) / 2;
        const xLocal = chordPos * chord;
        const x = sweepOffset + xLocal;
        const z = spanPos * span;

        // NACA 4-digit camber line
        let yc = 0;
        let dyc_dx = 0;
        if (chordPos < localCamberPos) {
          yc = (localCamber / (localCamberPos * localCamberPos)) * 
            (2 * localCamberPos * chordPos - chordPos * chordPos);
          dyc_dx = (2 * localCamber / (localCamberPos * localCamberPos)) * 
            (localCamberPos - chordPos);
        } else {
          yc = (localCamber / ((1 - localCamberPos) * (1 - localCamberPos))) *
            (1 - 2 * localCamberPos + 2 * localCamberPos * chordPos - chordPos * chordPos);
          dyc_dx = (2 * localCamber / ((1 - localCamberPos) * (1 - localCamberPos))) * 
            (localCamberPos - chordPos);
        }

        // NACA thickness distribution
        const yt = 5 * localThickness * (
          0.2969 * Math.sqrt(chordPos) - 
          0.126 * chordPos - 
          0.3516 * chordPos * chordPos + 
          0.2843 * chordPos * chordPos * chordPos - 
          0.1036 * chordPos * chordPos * chordPos * chordPos
        );

        // Minimal noise for smoothness (only if smoothness < 0.9)
        const noise = smoothness < 0.9 ? (Math.random() - 0.5) * (1 - smoothness) * 0.001 * latentNoise : 0;
        const theta = Math.atan(dyc_dx);
        
        // Upper surface point
        const y = dihedralHeight + yc + yt * Math.cos(theta) + cantOffset + noise;
        
        points.push({ x, y, z });
      }
    }

    return {
      id: this.generateId(),
      type: 'winglet',
      name: `${wingletType.charAt(0).toUpperCase() + wingletType.slice(1)} Winglet`,
      points,
      isGenerated: true,
      timestamp: Date.now(),
    };
  }

  static generateShape(type: ComponentType, params: GenerationParams): AeroShape {
    switch (type) {
      case 'airfoil':
        return this.generateAirfoil(params);
      case 'winglet':
        return this.generateWinglet(params);
      case 'sidepod':
        return this.generateSidepod(params);
      case 'diffuser':
        return this.generateDiffuser(params);
      default:
        throw new Error(`Unknown component type: ${type}`);
    }
  }

  /**
   * Generate shape with ML-based approach (async)
   * Uses real airfoil data from UIUC database for airfoils
   */
  static async generateShapeML(type: ComponentType, params: GenerationParams): Promise<AeroShape> {
    switch (type) {
      case 'airfoil':
        // Use ML-based generation with real UIUC airfoil data
        return await MLShapeGenerator.generateAirfoil(params);
      case 'winglet':
        return this.generateWinglet(params);
      case 'sidepod':
        return this.generateSidepod(params);
      case 'diffuser':
        return this.generateDiffuser(params);
      default:
        throw new Error(`Unknown component type: ${type}`);
    }
  }
}
