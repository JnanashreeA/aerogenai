# 🚀 Quick Start: Random Airfoil Generator

## What It Does

Generates **completely unique airfoil shapes** with **enforced variety** on every click. Never repeats the same design.

## How to Access

1. Run the application
2. Click **"Random Generator"** in the navigation menu
3. Or navigate directly to `/random`

## How to Use

### Step 1: Generate
Click the **"Generate Random Airfoil"** button

### Step 2: View
See your unique airfoil instantly:
- Visual plot with grid
- Airfoil type (e.g., "NACA 6-series")
- Generation statistics

### Step 3: Explore
Click through the tabs:
- **Parameters**: See all 5 control parameters with visual bars
- **Latent Vector**: View the 16D vector that makes this airfoil unique
- **Coordinates**: Browse all 100+ coordinate points

### Step 4: Download
Click **"Download .dat"** to export for CFD analysis

### Step 5: Generate Again
Click generate again for a **completely different** airfoil!

## What Makes Each Airfoil Unique?

### 1. Random Airfoil Type
System picks from 8 families:
- NACA 4-digit, 5-digit, 6-series
- Selig, Eppler
- Thin sharp, Reflex camber, High camber UAV

### 2. Random Parameters
- **Temperature**: 0.1-5.0 (creativity level)
- **Camber**: -0.1 to 0.15 (curvature)
- **Smoothness**: 0-1 (surface quality)
- **Thickness**: 6-20% (profile thickness)
- **Leading Edge**: 0.005-0.025 (nose shape)

### 3. Unique Latent Vector
- 16-dimensional vector
- Normal distribution
- Never repeats (similarity check)
- Modulates shape through sinusoidal basis functions

## Variety Guarantee

✅ **Similarity Detection**: Compares each new latent vector with previous 20
✅ **85% Threshold**: If similarity > 85%, automatically regenerates
✅ **Guaranteed Unique**: Every airfoil is significantly different

## Output Format

### Visual
- SVG plot with automatic scaling
- Grid and axis for reference
- Leading edge marker (blue dot)

### Data
- Full coordinate list (100+ points)
- Standard .dat file format
- Unique ID and timestamp
- Complete parameter set
- Full latent vector

## Example Use Cases

### For Students
- Learn about airfoil variety
- Understand parameter effects
- Explore design space

### For Engineers
- Rapid prototyping
- Design space exploration
- CFD input generation

### For Researchers
- Dataset generation
- ML training data
- Parametric studies

## Tips

💡 **Generate Multiple**: Create 10-20 airfoils to see the full variety
💡 **Compare Types**: Notice how NACA 6-series differs from Reflex Camber
💡 **Watch Parameters**: See how temperature affects shape complexity
💡 **Download All**: Save interesting designs for later analysis

## Technical Details

- **Algorithm**: Physics-based + ML-inspired
- **Basis**: NACA formulas + latent modulation
- **Points**: 100+ for smooth representation
- **Format**: Standard .dat (compatible with XFoil, ANSYS, etc.)
- **Uniqueness**: Enforced by cosine similarity check

## What You Get

Every generation provides:
1. ✅ Unique airfoil shape
2. ✅ Visual plot
3. ✅ All parameters
4. ✅ Latent vector
5. ✅ Coordinate data
6. ✅ Downloadable .dat file
7. ✅ Unique ID
8. ✅ Timestamp

## Ready to Start?

Just click **"Generate Random Airfoil"** and watch the magic happen! 🎨✨

---

**Every click = A brand new airfoil that has never existed before!**
