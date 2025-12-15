AeroGenAI

Real-Time Generative Aerodynamic Design Assistant

AeroGenAI is an AI-powered aerodynamic design system capable of generating and validating airfoils, winglets, sidepods, and diffusers. It integrates lightweight physics models and XFoil-based high-fidelity analysis into a single interactive environment, enabling students, engineers, and researchers to explore aerodynamic design in real time.

Overview

AeroGenAI provides automated shape generation, rapid performance evaluation, and intuitive visual analysis tools. It supports the complete design cycle: idea generation, parameter tuning, physical validation, and comparative assessment.

Key Features AI-Driven Shape Generation

The system can generate a wide range of aerodynamic components, including:

Airfoils for fixed wings, flaps, drones, and UAVs

Winglets for tip-vortex control

Sidepods for cooling and flow management in racing vehicles

Diffusers for underbody downforce

Each generated shape can be customized using six adjustable design parameters:

Complexity (20–80)

Smoothness (0.5–1.0)

Temperature (0.1–1.5) – controls creativity

Latent Dimension (8–128) – controls diversity

Thickness (5–25%)

Camber (0–8%)

Real-Time Design Validation

AeroGenAI includes physics-based validation tools for instant performance assessment:

Integration with XFoil for high-fidelity airfoil analysis

Lightweight physics models for rapid evaluation

The tool outputs performance metrics such as:

Lift coefficient (Cl)

Drag coefficient (Cd)

Lift-to-drag ratio (L/D)

Cooling efficiency (sidepods)

Downforce coefficient (diffusers)

Advanced Performance Analysis

The system supports comprehensive analysis tools, including:

Area Under Curve (AUC) evaluation for lift, drag, and efficiency

Peak performance indicator extraction

Automatically generated technical insights that describe:

Performance classification

Lift and drag behavior

Optimal operating regions

Recommended applications

Possible improvements

Interactive Dashboard

The user interface enables:

Uploading and analyzing external aerodynamic designs

Generating AI-suggested alternatives

Comparing real and generated performance curves

Adjusting parameters in real time

Exporting analytical output as JSON

Viewing performance charts and summaries

Applications Students

Explore aerodynamic concepts through experimentation

Visualize the effects of design parameters

Access a professional, engineering-grade analysis workflow

Engineers

Rapidly scan design spaces

Benchmark prototypes

Identify optimal design regions

Streamline iteration and refinement

Researchers

Generate diverse aerodynamic datasets

Test algorithmic variations

Validate hypotheses with quantitative metrics

Produce clean visualizations for publications

Technology Stack

Frontend: React 18, TypeScript

UI: shadcn/ui, Tailwind CSS

Build Tool: Vite 5

Charts: Recharts

Icons: Lucide React

Validation: XFoil integration

Physics: Custom lightweight aerodynamic models

Project Structure aerogenai/ ├── src/ │ ├── components/ │ │ ├── aero/ # Aerodynamic components │ │ │ ├── AUCCurveChart.tsx │ │ │ ├── AnalysisSummary.tsx │ │ │ ├── ComparisonView.tsx │ │ │ ├── ComponentSelector.tsx │ │ │ ├── FileUploadPanel.tsx │ │ │ ├── GenerationPanel.tsx │ │ │ ├── MetricsDisplay.tsx │ │ │ ├── PerformanceChart.tsx │ │ │ ├── ROCCurveChart.tsx │ │ │ ├── ShapeVisualizer.tsx │ │ │ ├── ValidationPanel.tsx │ │ │ └── XFoilPanel.tsx │ ├── services/ │ │ ├── aeroPhysics.ts │ │ ├── fileParser.ts │ │ ├── shapeGenerator.ts │ │ └── xfoilValidator.ts │ ├── types/ │ ├── pages/ │ │ └── Dashboard.tsx │ └── lib/ ├── docs/ │ ├── USER_GUIDE.md │ ├── FEATURE_SUMMARY.md │ ├── NEW_FEATURES.md │ └── prd.md ├── public/ └── package.json

Getting Started Requirements

Node.js 20 or higher

npm 10 or higher

Installation git clone https://github.com/JnanashreeA/aerogenai.git cd aerogenai

npm install npm run dev

The development server will run at http://localhost:5173.

Production Build npm run build npm run preview

Usage Workflow

Select a component type (airfoil, winglet, sidepod, diffuser).

Adjust design parameters to guide shape generation.

Generate the shape using the AI generator.

Validate the design with quick physics checks or full XFoil analysis.

Upload reference designs for comparison.

Review performance metrics, AUC charts, insights, and visualizations.

Detailed instructions are available in the documentation folder.

Performance Benchmarks

Shape generation: under 1 second

Standard validation: approximately 1 second

XFoil analysis: approximately 1.5 seconds

Runs efficiently on standard laptops without requiring GPU hardware

Design Approach

The interface is optimized for desktop workflows and engineering tasks. It emphasizes clarity, precision, and usability, offering a clean and professional environment for analysis and design iteration.

Documentation

All documentation is included in the docs/ directory:

User Guide

Feature Summary

New Features

Product Requirements Document

Contributing

Contributions are welcome. Open a pull request or issue on the repository if you would like to improve or extend functionality.

License

This project is released under the MIT License.
