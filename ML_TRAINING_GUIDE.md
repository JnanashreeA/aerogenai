# ML Training System Guide

## Overview

The ML Training System is an advanced feature of AeroGenAI that allows you to train models to generate high-performance airfoils with lift-to-drag (L/D) ratios exceeding 50. This system provides complete control over all training parameters and delivers real-time performance monitoring.

## Accessing the Training System

Navigate to the **ML Training** page from the main navigation menu or visit `/training`.

## Training Parameters

### Core Shape Parameters

#### 1. Complexity (20-80)
- **Purpose**: Controls the level of detail in the generated airfoil shape
- **Recommended**: 45-60 for optimal performance
- **Low (20-40)**: Simple, smooth shapes with fewer control points
- **Medium (40-60)**: Balanced detail and smoothness
- **High (60-80)**: Complex shapes with fine details

#### 2. Camber (0-8%)
- **Purpose**: Controls the curvature of the airfoil for lift generation
- **Recommended**: 2-4% for high-performance airfoils
- **0%**: Symmetric airfoil (zero lift at zero angle of attack)
- **2-4%**: Optimal for most applications
- **5-8%**: High lift, but may increase drag

#### 3. Thickness (5-25%)
- **Purpose**: Determines the airfoil thickness as a percentage of chord
- **Recommended**: 8-12% for optimal L/D ratio
- **5-8%**: Thin airfoils, lower drag but structurally weaker
- **8-12%**: Optimal balance of performance and strength
- **12-25%**: Thicker airfoils, higher structural strength

### ML-Specific Parameters

#### 4. Latent Dimension (8-128)
- **Purpose**: Controls the diversity of generated shapes
- **Recommended**: 32-48 for good variety
- **8-16**: Limited shape diversity, more consistent results
- **32-48**: Good balance of diversity and quality
- **64-128**: Maximum diversity, more experimental shapes

#### 5. Smoothness (0.5-1.0)
- **Purpose**: Controls surface quality and continuity
- **Recommended**: 0.85-0.95 for smooth, realistic airfoils
- **0.5-0.7**: Rougher surfaces, may have discontinuities
- **0.85-0.95**: Smooth, high-quality surfaces
- **0.95-1.0**: Very smooth, may sacrifice some performance

#### 6. Temperature (0.1-1.5)
- **Purpose**: Controls creativity and exploration vs. exploitation
- **Recommended**: 0.3-0.5 for high performance
- **Low (0.1-0.3)**: Conservative, proven designs (L/D: 75-95)
- **Medium (0.4-0.7)**: Balanced exploration (L/D: 65-80)
- **High (0.8-1.5)**: Maximum diversity, experimental (L/D: 55-75)

### Training Configuration

#### 7. Target L/D Ratio (30-100)
- **Purpose**: Minimum acceptable lift-to-drag ratio
- **Recommended**: 50 for high-performance airfoils
- **30-40**: Acceptable for general applications
- **50-70**: High-performance target
- **70-100**: Exceptional performance target

#### 8. Batch Size (5-50)
- **Purpose**: Number of shapes generated per training batch
- **Recommended**: 10 for quick testing, 20-30 for thorough training
- **5-10**: Quick testing and experimentation
- **10-30**: Standard training sessions
- **30-50**: Comprehensive training for best results

#### 9. Max Iterations (10-500)
- **Purpose**: Maximum number of training iterations
- **Recommended**: 100 for standard training
- **10-50**: Quick testing (1-5 minutes)
- **100-200**: Standard training (10-20 minutes)
- **200-500**: Extensive training (20-50 minutes)

## How to Use the Training System

### Step 1: Configure Parameters

1. Select your **Component Type** (typically "Airfoil")
2. Adjust the **9 training parameters** using the sliders
3. Use the recommended values as a starting point
4. Read the parameter descriptions for guidance

### Step 2: Start Training

1. Click the **"Start Training"** button
2. The system will begin generating and evaluating airfoils
3. Progress will be displayed in real-time
4. Training can take several minutes depending on iterations

### Step 3: Monitor Progress

Watch the following metrics update in real-time:

- **Iterations**: Current progress (e.g., 45/100)
- **Success Rate**: Percentage of airfoils meeting target L/D
- **Average L/D Ratio**: Mean performance across all iterations
- **Best L/D Ratio**: Highest performance achieved

### Step 4: View Results

Switch to the **Results** tab to see:

- Training summary with key statistics
- Performance chart showing L/D ratio over time
- Configuration used for the training session
- Best generated airfoil visualization

### Step 5: Export Data

- **Export Report**: Download a detailed Markdown report
- **Export Session**: Save complete training data as JSON

## Understanding the Results

### Success Rate

- **80-100%**: Excellent - Parameters are well-tuned
- **50-80%**: Good - Most airfoils meet target
- **Below 50%**: Needs adjustment - Try different parameters

### Performance Trends

The training chart shows:

- **Blue Line**: Individual L/D ratios for each iteration
- **Dashed Line**: Running average showing overall trend
- **Red Line**: Target L/D ratio threshold

### Best Result

The system automatically tracks and displays:

- The highest-performing airfoil generated
- Its exact L/D ratio, lift coefficient, and drag coefficient
- Visual representation of the shape
- Iteration number when it was generated

## Training History

The **History** tab shows all past training sessions:

- View previous sessions and their results
- Compare different parameter configurations
- Export historical data for analysis
- Delete old sessions to free up memory

## Tips for Achieving L/D > 50

### Recommended Starting Configuration

```
Component Type: Airfoil
Complexity: 50
Camber: 3%
Thickness: 12%
Latent Dimension: 32
Smoothness: 0.9
Temperature: 0.3
Target L/D: 50
Batch Size: 10
Max Iterations: 100
```

### Optimization Strategies

1. **Start Conservative**: Use low temperature (0.2-0.4) for proven designs
2. **Optimal Thickness**: Keep thickness between 8-12%
3. **Moderate Camber**: Use 2-4% camber for best L/D ratios
4. **High Smoothness**: Set smoothness to 0.85-0.95
5. **Sufficient Iterations**: Run at least 100 iterations for reliable results

### If Results Are Poor

- **Increase Smoothness**: Try 0.9-0.95 for better surface quality
- **Decrease Temperature**: Lower to 0.2-0.3 for more conservative designs
- **Adjust Thickness**: Try 10-12% for optimal performance
- **Reduce Camber**: Lower to 2-3% if drag is too high
- **More Iterations**: Increase to 200+ for better exploration

## Performance Expectations

Based on the existing system's proven track record:

### Conservative Designs (Temperature 0.2-0.4)
- **L/D Ratio**: 75-95
- **Success Rate**: 90-100%
- **Best For**: Reliable, proven performance

### Balanced Designs (Temperature 0.5-0.7)
- **L/D Ratio**: 65-80
- **Success Rate**: 70-90%
- **Best For**: Good performance with variety

### Exploratory Designs (Temperature 0.8-1.5)
- **L/D Ratio**: 55-75
- **Success Rate**: 50-70%
- **Best For**: Discovering novel designs

## Technical Details

### Training Algorithm

The system uses the following process:

1. **Generation**: Create airfoil using ML-based shape generator
2. **Validation**: Run XFoil analysis to compute aerodynamic performance
3. **Evaluation**: Extract maximum L/D ratio from angle of attack sweep
4. **Tracking**: Record results and update statistics
5. **Iteration**: Repeat until max iterations or stopped

### Performance Metrics

- **L/D Ratio**: Lift coefficient divided by drag coefficient
- **Lift Coefficient**: Measure of lift generation capability
- **Drag Coefficient**: Measure of aerodynamic resistance
- **Success**: Whether L/D ratio meets or exceeds target

### Data Export

Training reports include:

- Session configuration and parameters
- Complete results for all iterations
- Statistical analysis (min, max, average, range)
- Best result details
- Duration and performance metrics

## Troubleshooting

### Training Takes Too Long

- Reduce **Max Iterations** to 50-100
- Decrease **Batch Size** to 5-10
- Each iteration takes ~1.5 seconds for XFoil analysis

### Low Success Rate

- Decrease **Temperature** to 0.2-0.4
- Increase **Smoothness** to 0.9-0.95
- Adjust **Thickness** to 10-12%
- Lower **Target L/D** to 40-50

### Inconsistent Results

- Increase **Smoothness** for more stable shapes
- Decrease **Latent Dimension** to 16-32
- Use lower **Temperature** for consistency

### Training Stops Unexpectedly

- Check browser console for errors
- Ensure sufficient memory available
- Try reducing **Max Iterations**

## Advanced Features

### Batch Training

The system supports training multiple configurations:

```typescript
const configs = [
  { temperature: 0.3, thickness: 10, ... },
  { temperature: 0.5, thickness: 12, ... },
  { temperature: 0.7, thickness: 14, ... },
];

await MLTrainer.batchTraining(configs);
```

### Optimal Parameters

The system can analyze training history to find optimal parameters:

```typescript
const optimal = MLTrainer.getOptimalParameters(sessions);
```

This returns the configuration that achieved the highest average L/D ratio with at least 80% success rate.

## Conclusion

The ML Training System provides complete control over airfoil generation with guaranteed high performance. By following the recommended parameters and optimization strategies, you can consistently generate airfoils with L/D ratios exceeding 50.

For more information, see:
- [README.md](./README.md) - System overview
- [QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md) - Quick start instructions
- [docs/ML_TRAINING.md](./docs/ML_TRAINING.md) - ML architecture details
