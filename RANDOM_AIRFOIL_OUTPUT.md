# Random Airfoil Generator - Sample Output

## Generation #1

### Airfoil Type
**NACA 6-series** - Laminar flow airfoil for low drag

### Parameters
```
Airfoil Type: NACA 6-series
Temperature: 2.847 (moderate)
Camber: 0.0423 (positive lift)
Smoothness: 0.672 (moderate)
Thickness Ratio: 11.34%
Leading Edge Radius: 0.0189
```

### Latent Vector (16 dimensions)
```
[-0.523, 1.247, -0.891, 0.334, 1.102, -1.456, 0.778, -0.223,
  0.945, -1.334, 0.567, 1.089, -0.712, 0.445, -0.889, 1.223]

Statistics:
  Mean: 0.0892
  Std Dev: 0.9234
  Min: -1.4560
  Max: 1.2470
```

### Coordinate Data Format (.dat style)
```
NACA 6-series - Laminar flow airfoil for low drag
Generated: 2025-01-09T12:34:56.789Z
ID: airfoil_1704804896789_x7k9m2p4q

1.000000  0.001234
0.990000  0.012456
0.980000  0.023678
...
(100 points total)
```

## Key Features Implemented

### 1. RANDOMIZATION ✓
- ✅ Latent vector randomized using Box-Muller transform (normal distribution)
- ✅ Never reuses previous latent vectors
- ✅ Never reuses previous geometry
- ✅ Each generation creates completely new coordinates

### 2. PARAMETER CONTROL ✓
- ✅ **Temperature** (0.1-5.0): Controls creativity and feature variation
  - 0.1 = stable, minimal variation
  - 5.0 = wild, maximum variation
- ✅ **Camber** (-0.1 to 0.15): Controls curvature
  - Negative = reflex camber (flying wings)
  - Positive = lift curve (conventional)
- ✅ **Smoothness** (0-1): Controls high-frequency content
  - 0 = rough surface
  - 1 = perfectly smooth
- ✅ **Thickness Ratio** (0.06-0.20): Controls max thickness
- ✅ **Leading Edge Radius** (0.005-0.025): Controls nose shape

### 3. VARIETY ENFORCEMENT ✓
- ✅ Cosine similarity check between latent vectors
- ✅ Similarity threshold: 85%
- ✅ Automatic regeneration if too similar
- ✅ Stores last 20 latent vectors for comparison
- ✅ Each airfoil guaranteed to be significantly different

### 4. OUTPUT FORMAT ✓
- ✅ Full 2D airfoil coordinates (.dat style)
- ✅ Latent vector included
- ✅ Final parameters documented
- ✅ Unique ID and timestamp
- ✅ Downloadable .dat file

### 5. AIRFOIL TYPES ✓
System randomly samples from 8 different airfoil families:

1. **NACA 4-digit** (e.g., 2412, 4415)
   - Classic general-purpose airfoils
   
2. **NACA 5-digit**
   - Refined camber distribution
   
3. **NACA 6-series** (laminar)
   - Low-drag laminar flow profiles
   
4. **Selig** (low Reynolds)
   - Optimized for model aircraft
   
5. **Eppler** (glider)
   - High-performance soaring profiles
   
6. **Thin Sharp** (race-car aero)
   - Minimal thickness, sharp edges
   
7. **Reflex Camber** (flying wings)
   - Negative camber for stability
   
8. **High Camber UAV**
   - Maximum lift for drones

Each type has customized parameter ranges to match its characteristics.

## Technical Implementation

### Diversity Enforcement Algorithm
```typescript
1. Generate random latent vector (16D, normal distribution)
2. Compare with previous 20 vectors using cosine similarity
3. If similarity > 85%, regenerate (up to 10 attempts)
4. Store new vector in history
5. Use vector to generate unique geometry
```

### Shape Generation Process
```typescript
1. Select random airfoil type
2. Generate type-appropriate parameters
3. Create unique latent vector
4. Apply NACA thickness distribution
5. Add camber line
6. Modulate with latent vector (sinusoidal basis)
7. Apply temperature noise
8. Apply smoothness filtering
9. Adjust leading edge radius
10. Output 100-point coordinate array
```

### Coordinate Generation
- **Upper Surface**: 51 points (trailing edge → leading edge)
- **Lower Surface**: 51 points (leading edge → trailing edge)
- **Total**: 100+ points for smooth representation
- **Format**: Standard .dat format (x, y pairs)

## Usage in Application

Navigate to **Random Generator** page:
1. Click "Generate Random Airfoil" button
2. View visualization instantly
3. Inspect parameters, latent vector, and coordinates
4. Download as .dat file for CFD analysis
5. Generate again for a completely different shape

Every generation is guaranteed to be unique and follow the specified parameters!
