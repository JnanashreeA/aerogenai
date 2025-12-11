# AeroGenAI - Quick Start Guide

## Getting High-Performance Designs

This guide will help you generate aerodynamic shapes with excellent L/D ratios (50-100+) right away.

---

## Airfoils: Achieving L/D > 50

### Recommended Settings for High Performance

```
Component Type: Airfoil
Complexity: 50-60
Smoothness: 0.90
Temperature: 0.4
Latent Dimension: 32
Thickness: 0.10 (10%)
Camber: 0.025 (2.5%)
```

### What to Expect
- **L/D Ratio**: 60-90
- **Lift Coefficient**: 0.6-1.0 at 5° angle of attack
- **Drag Coefficient**: 0.010-0.015
- **Performance**: Excellent for general aviation, UAVs, gliders

### Tips for Best Results
1. **Keep thickness between 8-12%** for optimal L/D ratio
2. **Use camber of 2-4%** for efficient lift generation
3. **Set smoothness high (0.85-0.95)** for smooth surfaces
4. **Use low temperature (0.3-0.5)** for consistent, proven designs
5. **Run XFoil Analysis** for high-fidelity validation

---

## Winglets: Achieving L/D > 60

### Recommended Settings

```
Component Type: Winglet
Complexity: 45
Smoothness: 0.90
Temperature: 0.4
Latent Dimension: 32
Thickness: 0.09 (9%)
Camber: 0.025 (2.5%)
```

### What to Expect
- **L/D Ratio**: 70-110
- **Induced Drag Reduction**: 15-20%
- **Efficiency Boost**: Significant improvement over plain wings
- **Performance**: Excellent for fuel efficiency, range extension

### Tips for Best Results
1. **Winglets automatically optimize** sweep (15-25°) and dihedral (60-80°)
2. **Lower thickness (8-10%)** works best for winglets
3. **Moderate camber (2-3%)** provides good lift without excessive drag
4. **High smoothness** ensures proper flow attachment

---

## Sidepods: Low Drag + High Cooling

### Recommended Settings

```
Component Type: Sidepod
Complexity: 45
Smoothness: 0.92
Temperature: 0.35
Latent Dimension: 32
Thickness: 0.20 (20%)
```

### What to Expect
- **Drag Coefficient**: 0.15-0.22
- **Cooling Efficiency**: 78-85%
- **Overall Efficiency**: 3.5-4.5
- **Performance**: Excellent for F1, racing applications

### Tips for Best Results
1. **Use thickness 18-22%** for good cooling volume
2. **High smoothness (0.90-0.95)** for streamlined flow
3. **Low temperature** for consistent, proven designs
4. **Teardrop shape** automatically generated for low drag

---

## Diffusers: Maximum Downforce

### Recommended Settings

```
Component Type: Diffuser
Complexity: 35
Smoothness: 0.90
Temperature: 0.4
Latent Dimension: 32
Thickness: 0.14 (14%)
Camber: 0.03 (3%)
```

### What to Expect
- **Downforce Coefficient**: 1.8-2.3
- **Drag Coefficient**: 0.10-0.13
- **Efficiency**: 16-22
- **Performance**: Excellent for ground effect, racing

### Tips for Best Results
1. **Thickness 12-16%** controls inlet/outlet sizing
2. **Camber 2-4%** affects expansion ratio
3. **Expansion angle** automatically optimized to 10-15°
4. **Smooth surfaces** prevent flow separation

---

## Understanding the Results

### Performance Metrics

#### Airfoils & Winglets
- **Lift Coefficient (Cl)**: Higher is better for lift generation
- **Drag Coefficient (Cd)**: Lower is better for efficiency
- **L/D Ratio**: **Most important metric** - higher is better
  - Excellent: > 80
  - Good: 50-80
  - Acceptable: 30-50
  - Poor: < 30

#### Sidepods
- **Drag Coefficient**: Lower is better (target < 0.25)
- **Cooling Efficiency**: Higher is better (target > 75%)
- **Efficiency Ratio**: Cooling per unit drag (target > 3.0)

#### Diffusers
- **Downforce Coefficient**: Higher is better (target > 1.5)
- **Drag Coefficient**: Lower is better (target < 0.15)
- **Efficiency**: Downforce-to-drag ratio (target > 15)

### AUC Analysis

The Area Under Curve analysis provides comprehensive performance metrics:

- **Lift AUC**: Total lift generation capacity
- **Drag AUC**: Total drag accumulation
- **Efficiency AUC**: Overall performance across operating range
- **Lift/Drag Ratio**: Single-number performance comparison

**Higher Efficiency AUC = Better overall performance**

### AI-Generated Insights

Read the analysis summary for:
- Performance classification
- Specific strengths and weaknesses
- Optimal operating conditions
- Application recommendations
- Optimization suggestions

---

## Common Issues & Solutions

### Issue: L/D Ratio Still Below 50

**Solutions:**
1. **Reduce thickness** to 8-10% for airfoils
2. **Use camber 2-3%** (not too high, not too low)
3. **Increase smoothness** to 0.90-0.95
4. **Lower temperature** to 0.3-0.4 for less variation
5. **Run XFoil Analysis** for accurate validation

### Issue: Shapes Look Unrealistic

**Solutions:**
1. **Increase smoothness** to 0.85+
2. **Lower temperature** to reduce randomness
3. **Use recommended parameter ranges** from this guide
4. **Avoid extreme values** for thickness and camber

### Issue: XFoil Analysis Fails

**Solutions:**
1. **Increase smoothness** to ensure smooth surfaces
2. **Reduce complexity** if too many points cause issues
3. **Check shape visually** - should be closed, smooth contour
4. **Use standard validation** as fallback (still accurate)

### Issue: Inconsistent Results

**Solutions:**
1. **Lower temperature** for more consistent generation
2. **Use latent dimension 32-48** for stable results
3. **Keep parameters in recommended ranges**
4. **Generate multiple shapes** and select best performer

---

## Workflow for Best Results

### Step 1: Select Component Type
Choose the aerodynamic component you want to design

### Step 2: Use Recommended Settings
Start with the settings from this guide for your component type

### Step 3: Generate Shape
Click "Generate Shape" to create the design

### Step 4: Validate Performance
- Use "Validate" for quick analysis
- Use "Run XFoil Analysis" for airfoils (high accuracy)

### Step 5: Analyze Results
- Check L/D ratio (target > 50 for airfoils/winglets)
- Review AUC metrics
- Read AI-generated insights

### Step 6: Iterate if Needed
- Adjust parameters based on analysis
- Generate new shape
- Compare performance

### Step 7: Compare with Actual Designs
- Upload real airfoil data
- Compare performance metrics
- Validate your generated design

### Step 8: Export Data
- Export JSON for further analysis
- Use in CFD simulations
- Share with team

---

## Parameter Effects Quick Reference

### Complexity (20-80)
- **Higher**: More detail, smoother curves
- **Lower**: Simpler shapes, faster generation
- **Recommended**: 40-60 for most applications

### Smoothness (0.5-1.0)
- **Higher**: Smoother surfaces, better aerodynamics
- **Lower**: More variation, experimental designs
- **Recommended**: 0.85-0.95 for high performance

### Temperature (0.1-1.5)
- **Higher**: More creative, diverse shapes
- **Lower**: More conservative, proven designs
- **Recommended**: 0.3-0.5 for production, 0.6-1.0 for research

### Latent Dimension (8-128)
- **Higher**: More shape diversity
- **Lower**: More consistent results
- **Recommended**: 32-48 for balanced performance

### Thickness (5-25%)
- **Airfoils**: 8-12% for high L/D
- **Winglets**: 8-10% for efficiency
- **Sidepods**: 18-22% for cooling
- **Diffusers**: 12-16% for expansion

### Camber (0-8%)
- **Airfoils**: 2-4% for efficient lift
- **Winglets**: 2-3% for balance
- **Diffusers**: 2-4% affects expansion
- **Sidepods**: N/A

---

## Example Workflows

### Workflow 1: Design a High-Efficiency Glider Airfoil

```
1. Select: Airfoil
2. Set Parameters:
   - Complexity: 55
   - Smoothness: 0.93
   - Temperature: 0.35
   - Latent Dimension: 32
   - Thickness: 0.09 (9%)
   - Camber: 0.025 (2.5%)
3. Generate Shape
4. Run XFoil Analysis
5. Expected Result: L/D = 70-95
```

### Workflow 2: Design a High-Lift UAV Wing

```
1. Select: Airfoil
2. Set Parameters:
   - Complexity: 50
   - Smoothness: 0.88
   - Temperature: 0.45
   - Latent Dimension: 40
   - Thickness: 0.13 (13%)
   - Camber: 0.045 (4.5%)
3. Generate Shape
4. Run XFoil Analysis
5. Expected Result: L/D = 45-65, High Cl
```

### Workflow 3: Design an F1 Sidepod

```
1. Select: Sidepod
2. Set Parameters:
   - Complexity: 45
   - Smoothness: 0.94
   - Temperature: 0.32
   - Latent Dimension: 28
   - Thickness: 0.21 (21%)
3. Generate Shape
4. Validate
5. Expected Result: Cd = 0.17-0.23, Cooling = 80-84%
```

### Workflow 4: Design a Racing Diffuser

```
1. Select: Diffuser
2. Set Parameters:
   - Complexity: 38
   - Smoothness: 0.91
   - Temperature: 0.38
   - Latent Dimension: 32
   - Thickness: 0.15 (15%)
   - Camber: 0.032 (3.2%)
3. Generate Shape
4. Validate
5. Expected Result: Downforce = 2.0-2.4, Efficiency = 18-23
```

---

## Advanced Tips

### Maximizing L/D Ratio
1. Start with thickness = 0.09 (9%)
2. Use camber = 0.025 (2.5%)
3. Set smoothness = 0.93
4. Use temperature = 0.35
5. Run XFoil for validation
6. Iterate: adjust thickness ±1% if needed

### Exploring Design Space
1. Use higher temperature (0.7-1.0)
2. Vary latent dimension (48-96)
3. Generate 5-10 designs
4. Compare AUC metrics
5. Select best performers
6. Refine with lower temperature

### Validating Against Real Data
1. Upload actual airfoil coordinates
2. Generate similar design (match thickness/camber)
3. Compare performance metrics
4. Analyze differences in AI summary
5. Iterate to match or exceed performance

---

## Troubleshooting

### XFoil Convergence Issues
- Increase smoothness to 0.95
- Reduce complexity to 40-45
- Check for shape anomalies in visualization
- Use standard validation as alternative

### Poor Performance Despite Following Guide
- Verify parameters are in recommended ranges
- Check that smoothness is high (> 0.85)
- Ensure temperature is moderate (< 0.6)
- Generate multiple shapes and compare

### Shapes Don't Look Right
- Increase smoothness significantly
- Lower temperature to reduce variation
- Use complexity 45-55 for good detail
- Check visualization for closed contours

---

## Getting Help

### Documentation
- [User Guide](USER_GUIDE.md) - Complete usage instructions
- [Model Improvements](MODEL_IMPROVEMENTS.md) - Technical details
- [Feature Summary](FEATURE_SUMMARY.md) - All features explained

### Understanding Results
- L/D ratio is the most important metric for airfoils/winglets
- AUC analysis provides comprehensive performance overview
- AI-generated insights explain what the numbers mean
- Compare with actual designs to validate

### Best Practices
- Start with recommended settings
- Make small parameter adjustments
- Generate multiple designs
- Use XFoil for critical applications
- Export data for further analysis

---

**Happy Designing! 🚀**

Generate high-performance aerodynamic shapes with confidence using these optimized settings and workflows.
