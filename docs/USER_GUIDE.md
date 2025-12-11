# AeroGenAI User Guide

## Overview
AeroGenAI is a real-time generative aerodynamic design assistant that enables you to generate, upload, analyze, and compare aerodynamic shapes including airfoils, winglets, sidepods, and diffusers.

## Key Features

### 1. Multi-Component Support
- **Airfoils**: Wing profiles for lift generation
- **Winglets**: Wingtip devices for drag reduction
- **Sidepods**: Cooling body aerodynamics
- **Diffusers**: Underbody downforce generators

### 2. File Upload & Import
Upload actual aerodynamic shapes in multiple formats:
- **.dat / .txt**: Space-separated coordinate files (UIUC airfoil format)
- **.csv**: Comma-separated values
- **.npy**: NumPy array format
- **.mat**: MATLAB data format

#### File Format Examples

**DAT/TXT Format:**
```
NACA 2412 Airfoil
1.000000 0.001260
0.950000 0.010260
...
```

**CSV Format:**
```
x,y
1.000000,0.001260
0.950000,0.010260
...
```

### 3. AI Shape Generation
Generate new aerodynamic shapes with customizable parameters:
- **Complexity**: Number of points defining the shape (10-100)
- **Smoothness**: Surface smoothness factor (0.0-1.0)

### 4. Advanced Physics Validation
- **XFoil Analysis**: High-fidelity aerodynamic simulation for airfoils
  - Angle of attack range: -2° to +10°
  - Reynolds number: 500,000
  - Calculates Cl, Cd, Cm coefficients
- **Lightweight Physics**: Fast approximation for all component types
- **Performance Classification**: Good (L/D > 50) vs Poor (L/D ≤ 50)

### 5. Comparison Tools
Compare actual vs generated shapes with:
- **Side-by-side visualization**
- **Performance metrics comparison**
- **Lift/Drag/Efficiency charts**
- **Shape overlay view**

### 6. Visualization & Analysis
- Real-time shape rendering
- Performance curves (Lift, Drag, Efficiency vs Angle of Attack)
- ROC/AUC curves for model evaluation
- Interactive charts with Recharts

### 7. Data Export
Export complete analysis data including:
- Shape coordinates
- Performance metrics
- Validation results
- Classification data

## How to Use

### Step 1: Select Component Type
Choose the aerodynamic component you want to work with from the sidebar:
- Airfoil
- Winglet
- Sidepod
- Diffuser

### Step 2: Upload Actual Shape (Optional)
1. Click the "Upload Actual Shape" panel
2. Drag and drop a file or click "Select File"
3. Supported formats: .dat, .txt, .csv, .npy, .mat
4. The file will be automatically parsed and normalized

### Step 3: Generate AI Shape
1. Adjust generation parameters:
   - **Complexity**: Number of points defining the shape (20-100)
     - Higher values create more detailed shapes with finer resolution
   - **Smoothness**: Surface smoothness factor (0.5-1.0)
     - Higher values create smoother surfaces with less noise
   - **Temperature**: Controls randomness and creativity (0.1-1.5)
     - Lower values: More conservative, predictable designs
     - Higher values: More creative, experimental designs
   - **Latent Dimension**: Latent space dimensionality (8-128)
     - Controls the complexity of the underlying generative model
     - Higher values allow more diverse shape variations
   - **Thickness**: Maximum thickness ratio (5%-25%)
     - Controls the overall thickness of the aerodynamic component
     - Critical for structural integrity and aerodynamic performance
   - **Camber**: Mean camber line curvature (0%-8%)
     - Controls the curvature of the mean line
     - Higher camber increases lift but may increase drag
2. Click "Generate Shape"
3. Wait for the AI to create a new design

### Step 4: Run Validation
1. Click "Validate Design" to analyze aerodynamic performance
2. For airfoils, optionally click "Run XFoil Analysis" for high-fidelity results
3. Review the comprehensive analysis:
   - **Metrics Display**: Key performance indicators (Lift, Drag, L/D ratio)
   - **Performance Charts**: Lift, Drag, and Efficiency curves vs angle of attack
   - **AUC Analysis**: Area Under Curve metrics showing total performance capacity
     - Lift AUC: Total lift generation capacity across operating range
     - Drag AUC: Total drag accumulation
     - Efficiency AUC: Overall performance metric
     - Peak performance indicators and optimal angle of attack
   - **Analysis Summary**: AI-generated paragraph with insights and recommendations
4. The system automatically classifies designs as "Good" or "Poor" based on L/D ratio

### Step 5: Compare Results
1. If you have both actual and generated shapes, click "Compare" button
2. Switch between tabs:
   - **Shapes**: Side-by-side visualization
   - **Metrics**: Performance metrics comparison
   - **Performance**: Lift/Drag/Efficiency charts
   - **Overlay**: Superimposed shape comparison

### Step 6: Export Data
Click "Export Data" to download complete analysis results as JSON

## Understanding the Metrics

### Airfoil & Winglet Metrics
- **Lift Coefficient (Cl)**: Measure of lift force generation
- **Drag Coefficient (Cd)**: Measure of drag resistance
- **L/D Ratio**: Lift-to-drag ratio (efficiency indicator)
- **Efficiency Score**: Normalized performance metric

### Sidepod Metrics
- **Drag Coefficient**: Aerodynamic resistance
- **Cooling Efficiency**: Airflow effectiveness
- **Efficiency Score**: Overall performance

### Diffuser Metrics
- **Downforce Coefficient**: Downward force generation
- **Drag Coefficient**: Aerodynamic resistance
- **Efficiency Score**: Downforce-to-drag ratio

### AUC (Area Under Curve) Metrics
- **Lift AUC**: Integral of lift coefficient over angle of attack range
  - Higher values indicate greater total lift generation capacity
  - Useful for comparing overall lift performance across designs
- **Drag AUC**: Integral of drag coefficient over angle of attack range
  - Lower values indicate better drag characteristics
  - Helps identify designs with minimal drag penalties
- **Efficiency AUC**: Integral of L/D ratio over angle of attack range
  - Higher values indicate superior overall efficiency
  - Best metric for comparing aerodynamic effectiveness
- **Lift/Drag Ratio**: Ratio of Lift AUC to Drag AUC
  - Provides single-number performance comparison
  - Higher values indicate more efficient designs

### Analysis Summary
The AI-generated analysis summary provides:
- **Performance Assessment**: Overall design quality evaluation
- **Lift Characteristics**: Analysis of lift generation capabilities
- **Drag Analysis**: Evaluation of drag characteristics and flow behavior
- **Efficiency Insights**: Optimal operating conditions and L/D performance
- **Application Recommendations**: Suitability for specific use cases
- **Optimization Suggestions**: Areas for potential improvement

## Performance Classification

The system automatically classifies designs based on L/D ratio:
- **Good**: L/D > 50 (High efficiency)
- **Poor**: L/D ≤ 50 (Low efficiency)

## Tips for Best Results

1. **File Upload**: Ensure coordinate files are properly formatted with x, y (and optionally z) values
2. **Normalization**: Files are automatically normalized to 0-1 range
3. **Complexity**: Start with medium complexity (40-60) for balanced results
4. **Smoothness**: Use higher smoothness (0.7-0.9) for realistic aerodynamic shapes
5. **Temperature**: 
   - Use 0.3-0.5 for conservative, production-ready designs
   - Use 0.7-1.0 for exploratory, innovative designs
   - Use 1.0+ for highly experimental concepts
6. **Latent Dimension**:
   - Use 16-32 for standard designs
   - Use 64-128 for maximum shape diversity
7. **Thickness**:
   - Airfoils: 8-15% for general aviation, 5-8% for high-speed applications
   - Sidepods: 15-25% for adequate cooling volume
   - Diffusers: 10-20% for optimal expansion
8. **Camber**:
   - 0-2% for symmetric or low-lift applications
   - 2-4% for moderate lift requirements
   - 4-8% for high-lift configurations
9. **Validation**: Always run validation after generating shapes to see performance
10. **Comparison**: Upload actual shapes to benchmark AI-generated designs

## Sample Files

Sample airfoil files are provided in the `docs/` folder:
- `sample-airfoil.dat`: NACA 2412 airfoil in DAT format
- `sample-airfoil.csv`: NACA 2412 airfoil in CSV format

## Troubleshooting

### File Upload Issues
- **Error: "Invalid coordinate data"**: Check that your file contains numeric x, y coordinates
- **Error: "Unsupported file format"**: Ensure file extension is .dat, .txt, .csv, .npy, or .mat

### Generation Issues
- **Shape looks unrealistic**: Increase smoothness parameter
- **Not enough detail**: Increase complexity parameter

### Validation Issues
- **No metrics shown**: Ensure you've generated or uploaded a shape first
- **XFoil not available**: Use standard validation instead

## Technical Details

### Color Scheme
- **Primary**: Blue (#3B82F6) - Professional aerospace aesthetic
- **Background**: Light blue gradient for clean, technical appearance
- **Component Colors**:
  - Airfoils: Primary blue
  - Winglets: Orange
  - Sidepods: Green
  - Diffusers: Purple

### Performance
- Shape generation: < 1 second
- Standard validation: ~1 second
- XFoil analysis: ~1.5 seconds
- File parsing: < 500ms

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile: Responsive design with touch support
