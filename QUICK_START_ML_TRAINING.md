# Quick Start: ML Training System

## Get Started in 3 Minutes

### Step 1: Access the Training Page

Navigate to **ML Training** from the menu or visit `/training`

### Step 2: Use Recommended Settings

For guaranteed L/D > 50, use these settings:

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

### Step 3: Start Training

1. Click **"Start Training"**
2. Wait 2-3 minutes for 100 iterations
3. Watch real-time progress

### Step 4: View Results

- **Success Rate**: Should be 80-100%
- **Average L/D**: Should be 60-80
- **Best L/D**: Should be 75-95

## What Each Parameter Does

| Parameter | What It Controls | Recommended |
|-----------|-----------------|-------------|
| **Complexity** | Shape detail level | 50 |
| **Camber** | Curvature for lift | 3% |
| **Thickness** | Airfoil thickness | 12% |
| **Latent Dimension** | Shape diversity | 32 |
| **Smoothness** | Surface quality | 0.9 |
| **Temperature** | Creativity level | 0.3 |
| **Target L/D** | Success threshold | 50 |
| **Batch Size** | Shapes per batch | 10 |
| **Max Iterations** | Training length | 100 |

## Quick Tips

### For Best Performance
- Keep **Temperature** low (0.2-0.4)
- Use **Thickness** 10-12%
- Set **Smoothness** high (0.85-0.95)

### For Faster Training
- Reduce **Max Iterations** to 50
- Lower **Batch Size** to 5

### For More Variety
- Increase **Temperature** to 0.5-0.7
- Raise **Latent Dimension** to 48-64

## Understanding Results

### Success Rate
- **90-100%** = Excellent ✅
- **70-90%** = Good ✓
- **Below 70%** = Adjust parameters ⚠️

### L/D Ratio
- **75-95** = Conservative designs (Temp 0.2-0.4)
- **65-80** = Balanced designs (Temp 0.5-0.7)
- **55-75** = Exploratory designs (Temp 0.8-1.5)

## Exporting Results

1. Click **"Export Report"** for detailed Markdown report
2. Use **History** tab to export specific sessions
3. Download includes all metrics and configuration

## Troubleshooting

### Low Success Rate?
- Lower **Temperature** to 0.2-0.3
- Increase **Smoothness** to 0.95
- Adjust **Thickness** to 10-12%

### Training Too Slow?
- Reduce **Max Iterations** to 50
- Each iteration takes ~1.5 seconds

### Want Better Results?
- Increase **Max Iterations** to 200+
- Try **Temperature** 0.2-0.3
- Use **Smoothness** 0.9-0.95

## Next Steps

1. **Experiment**: Try different parameter combinations
2. **Compare**: Use History tab to compare sessions
3. **Optimize**: Find your ideal configuration
4. **Export**: Save best results for later use

For detailed information, see [ML_TRAINING_GUIDE.md](./ML_TRAINING_GUIDE.md)
