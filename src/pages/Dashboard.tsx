import { useState } from 'react';
import { ComponentSelector } from '@/components/aero/ComponentSelector';
import { GenerationPanel } from '@/components/aero/GenerationPanel';
import { ValidationPanel } from '@/components/aero/ValidationPanel';
import { XFoilPanel } from '@/components/aero/XFoilPanel';
import { FileUploadPanel } from '@/components/aero/FileUploadPanel';
import { ComparisonView } from '@/components/aero/ComparisonView';
import { ShapeVisualizer } from '@/components/aero/ShapeVisualizer';
import { MetricsDisplay } from '@/components/aero/MetricsDisplay';
import { PerformanceChart } from '@/components/aero/PerformanceChart';
import { ROCCurveChart } from '@/components/aero/ROCCurveChart';
import { AUCCurveChart } from '@/components/aero/AUCCurveChart';
import { AnalysisSummary } from '@/components/aero/AnalysisSummary';
import { ShapeGenerator } from '@/services/shapeGenerator';
import { AeroPhysicsEngine } from '@/services/aeroPhysics';
import { XFoilValidator } from '@/services/xfoilValidator';
import { FileParser } from '@/services/fileParser';
import type { ComponentType, AeroShape, AeroMetrics, PerformanceData, GenerationParams, ROCData } from '@/types/aero';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Download, GitCompare, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Dashboard() {
  const [selectedType, setSelectedType] = useState<ComponentType>('airfoil');
  const [currentShape, setCurrentShape] = useState<AeroShape | null>(null);
  const [actualShape, setActualShape] = useState<AeroShape | null>(null);
  const [metrics, setMetrics] = useState<AeroMetrics | null>(null);
  const [actualMetrics, setActualMetrics] = useState<AeroMetrics | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [actualPerformanceData, setActualPerformanceData] = useState<PerformanceData | null>(null);
  const [rocData, setRocData] = useState<ROCData | null>(null);
  const [classification, setClassification] = useState<'good' | 'poor' | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isRunningXFoil, setIsRunningXFoil] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [activeView, setActiveView] = useState<'single' | 'comparison'>('single');
  const { toast } = useToast();

  const handleTypeChange = (type: ComponentType) => {
    setSelectedType(type);
    setCurrentShape(null);
    setActualShape(null);
    setMetrics(null);
    setActualMetrics(null);
    setPerformanceData(null);
    setActualPerformanceData(null);
    setRocData(null);
    setClassification(null);
    setUploadedFileName('');
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const points = await FileParser.parseFile(file, selectedType);

      if (!FileParser.validatePoints(points)) {
        throw new Error('Invalid coordinate data in file');
      }

      const normalizedPoints = FileParser.normalizePoints(points);

      const shape: AeroShape = {
        id: `actual-${Date.now()}`,
        type: selectedType,
        name: `Actual ${selectedType} - ${file.name}`,
        points: normalizedPoints,
        isGenerated: false,
        timestamp: Date.now(),
      };

      setActualShape(shape);
      setUploadedFileName(file.name);
      setActualMetrics(null);
      setActualPerformanceData(null);

      toast({
        title: 'File Uploaded',
        description: `Successfully loaded ${file.name}`,
      });
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to parse file',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerate = async (params: GenerationParams) => {
    setIsGenerating(true);
    try {
      // Show loading message for ML-based generation
      toast({
        title: 'Generating Shape',
        description: 'Fetching real airfoil data from UIUC database...',
      });

      // Use ML-based generation with real airfoil data
      const shape = await ShapeGenerator.generateShapeML(selectedType, params);
      setCurrentShape(shape);
      setMetrics(null);
      setPerformanceData(null);
      setClassification(null);

      toast({
        title: 'Shape Generated',
        description: `Successfully generated ${selectedType} design using real aerodynamic data`,
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate shape. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleValidate = async () => {
    if (!currentShape && !actualShape) return;

    setIsValidating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (currentShape) {
        let calculatedMetrics: AeroMetrics;
        let perfData: PerformanceData;

        // For airfoils, ALWAYS use XFoil analysis for consistency
        if (currentShape.type === 'airfoil') {
          perfData = await AeroPhysicsEngine.generatePerformanceData(
            currentShape.points,
            currentShape.type,
            true // Use XFoil for airfoils
          );

          // Calculate metrics from XFoil performance data
          const avgLift = perfData.lift.reduce((a, b) => a + b, 0) / perfData.lift.length;
          const avgDrag = perfData.drag.reduce((a, b) => a + b, 0) / perfData.drag.length;
          const ldRatio = avgLift / avgDrag;

          calculatedMetrics = {
            lift: avgLift,
            drag: avgDrag,
            liftToDragRatio: ldRatio,
            efficiency: ldRatio / 10,
            momentCoefficient: perfData.moment?.[5] || 0,
          };
        } else {
          // For other components, use standard physics engine
          switch (currentShape.type) {
            case 'winglet':
              calculatedMetrics = AeroPhysicsEngine.analyzeWinglet(currentShape.points);
              break;
            case 'sidepod':
              calculatedMetrics = AeroPhysicsEngine.analyzeSidepod(currentShape.points);
              break;
            case 'diffuser':
              calculatedMetrics = AeroPhysicsEngine.analyzeDiffuser(currentShape.points);
              break;
            default:
              throw new Error('Unknown component type');
          }

          perfData = await AeroPhysicsEngine.generatePerformanceData(
            currentShape.points,
            currentShape.type,
            false
          );
        }

        const ldRatio = calculatedMetrics.liftToDragRatio || 0;
        const classif = XFoilValidator.classifyPerformance(ldRatio);

        setMetrics(calculatedMetrics);
        setPerformanceData(perfData);
        setClassification(classif);

        const mockRoc = XFoilValidator.generateMockROCData();
        setRocData(mockRoc);
      }

      if (actualShape) {
        let calculatedMetrics: AeroMetrics;
        let perfData: PerformanceData;

        // For airfoils, ALWAYS use XFoil analysis for consistency
        if (actualShape.type === 'airfoil') {
          perfData = await AeroPhysicsEngine.generatePerformanceData(
            actualShape.points,
            actualShape.type,
            true // Use XFoil for airfoils
          );

          // Calculate metrics from XFoil performance data
          const avgLift = perfData.lift.reduce((a, b) => a + b, 0) / perfData.lift.length;
          const avgDrag = perfData.drag.reduce((a, b) => a + b, 0) / perfData.drag.length;
          const ldRatio = avgLift / avgDrag;

          calculatedMetrics = {
            lift: avgLift,
            drag: avgDrag,
            liftToDragRatio: ldRatio,
            efficiency: ldRatio / 10,
            momentCoefficient: perfData.moment?.[5] || 0,
          };
        } else {
          // For other components, use standard physics engine
          switch (actualShape.type) {
            case 'winglet':
              calculatedMetrics = AeroPhysicsEngine.analyzeWinglet(actualShape.points);
              break;
            case 'sidepod':
              calculatedMetrics = AeroPhysicsEngine.analyzeSidepod(actualShape.points);
              break;
            case 'diffuser':
              calculatedMetrics = AeroPhysicsEngine.analyzeDiffuser(actualShape.points);
              break;
            default:
              throw new Error('Unknown component type');
          }

          perfData = await AeroPhysicsEngine.generatePerformanceData(
            actualShape.points,
            actualShape.type,
            false
          );
        }

        setActualMetrics(calculatedMetrics);
        setActualPerformanceData(perfData);
      }

      // Show appropriate toast message based on component type
      const isAirfoil = currentShape?.type === 'airfoil' || actualShape?.type === 'airfoil';
      toast({
        title: 'Validation Complete',
        description: isAirfoil 
          ? 'XFoil high-fidelity analysis completed successfully'
          : 'Aerodynamic analysis completed successfully',
      });
    } catch (error) {
      toast({
        title: 'Validation Failed',
        description: 'Failed to validate design. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleRunXFoil = async () => {
    if (!currentShape || currentShape.type !== 'airfoil') {
      toast({
        title: 'XFoil Analysis',
        description: 'XFoil analysis is only available for airfoils',
        variant: 'destructive',
      });
      return;
    }

    setIsRunningXFoil(true);
    try {
      const perfData = await AeroPhysicsEngine.generatePerformanceData(
        currentShape.points,
        currentShape.type,
        true
      );

      const avgLift = perfData.lift.reduce((a, b) => a + b, 0) / perfData.lift.length;
      const avgDrag = perfData.drag.reduce((a, b) => a + b, 0) / perfData.drag.length;
      const ldRatio = avgLift / avgDrag;

      const calculatedMetrics: AeroMetrics = {
        lift: avgLift,
        drag: avgDrag,
        liftToDragRatio: ldRatio,
        efficiency: ldRatio / 10,
        momentCoefficient: perfData.moment?.[5] || 0,
      };

      const classif = XFoilValidator.classifyPerformance(ldRatio);

      setMetrics(calculatedMetrics);
      setPerformanceData(perfData);
      setClassification(classif);

      toast({
        title: 'XFoil Analysis Complete',
        description: `High-fidelity analysis completed - ${classif === 'good' ? 'Good' : 'Poor'} performance`,
      });
    } catch (error) {
      toast({
        title: 'XFoil Analysis Failed',
        description: 'Failed to run XFoil analysis. Using fallback physics.',
        variant: 'destructive',
      });
    } finally {
      setIsRunningXFoil(false);
    }
  };

  const handleReset = () => {
    setCurrentShape(null);
    setActualShape(null);
    setMetrics(null);
    setActualMetrics(null);
    setPerformanceData(null);
    setActualPerformanceData(null);
    setRocData(null);
    setClassification(null);
    setUploadedFileName('');
    toast({
      title: 'Reset Complete',
      description: 'Analysis has been reset',
    });
  };

  const handleExport = () => {
    if (!currentShape) return;

    const dataStr = JSON.stringify(
      {
        shape: currentShape,
        metrics,
        performanceData,
        classification,
      },
      null,
      2
    );

    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentShape.name.replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Successful',
      description: 'Shape and analysis data exported',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-[#b61236ff]">AeroGenAI</h1>
                <p className="text-sm text-muted-foreground">
                  Real-Time Generative Aerodynamic Design Assistant
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {(actualShape || currentShape) && (
                <Button
                  onClick={() => setActiveView(activeView === 'single' ? 'comparison' : 'single')}
                  variant="outline"
                  size="lg"
                >
                  <GitCompare className="w-4 h-4 mr-2" />
                  {activeView === 'single' ? 'Compare' : 'Single View'}
                </Button>
              )}
              {currentShape && (
                <Button onClick={handleExport} variant="outline" size="lg">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {selectedType === 'airfoil' && (
          <></>
        )}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-3 space-y-6">
            <ComponentSelector selectedType={selectedType} onSelectType={handleTypeChange} />
            <FileUploadPanel
              selectedType={selectedType}
              onFileUpload={handleFileUpload}
              isUploading={isUploading}
              uploadedFileName={uploadedFileName}
            />
            <GenerationPanel
              selectedType={selectedType}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
            {selectedType === 'airfoil' && (
              <XFoilPanel
                onRunXFoil={handleRunXFoil}
                isRunning={isRunningXFoil}
                hasShape={!!currentShape}
                classification={classification}
                liftToDragRatio={metrics?.liftToDragRatio}
              />
            )}
            <ValidationPanel
              onValidate={handleValidate}
              onReset={handleReset}
              isValidating={isValidating}
              hasShape={!!(currentShape || actualShape)}
            />
          </div>

          <div className="xl:col-span-9 space-y-6">
            {activeView === 'comparison' ? (
              <ComparisonView
                actualShape={actualShape}
                generatedShape={currentShape}
                actualMetrics={actualMetrics}
                generatedMetrics={metrics}
                actualPerformance={actualPerformanceData}
                generatedPerformance={performanceData}
                type={selectedType}
              />
            ) : (
              <>
                <Tabs defaultValue="generated" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="generated" className="bg-[#25416aff] bg-none">Generated Shape</TabsTrigger>
                    <TabsTrigger value="actual">Actual Shape</TabsTrigger>
                  </TabsList>

                  <TabsContent value="generated" className="space-y-6 mt-6">
                    <ShapeVisualizer shape={currentShape} title="Generated Shape" />

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      <MetricsDisplay metrics={metrics} type={selectedType} />
                      <PerformanceChart data={performanceData} />
                    </div>

                    {performanceData && (
                      <AUCCurveChart data={performanceData} title="Generated Shape - Performance AUC" />
                    )}

                    {rocData && <ROCCurveChart data={rocData} />}

                    {metrics && performanceData && (
                      <AnalysisSummary
                        metrics={metrics}
                        performanceData={performanceData}
                        type={selectedType}
                        classification={classification}
                      />
                    )}
                  </TabsContent>

                  <TabsContent value="actual" className="space-y-6 mt-6">
                    <ShapeVisualizer shape={actualShape} title="Actual Shape" />

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      <MetricsDisplay metrics={actualMetrics} type={selectedType} />
                      <PerformanceChart data={actualPerformanceData} />
                    </div>

                    {actualPerformanceData && (
                      <AUCCurveChart data={actualPerformanceData} title="Actual Shape - Performance AUC" />
                    )}

                    {actualMetrics && actualPerformanceData && (
                      <AnalysisSummary
                        metrics={actualMetrics}
                        performanceData={actualPerformanceData}
                        type={selectedType}
                      />
                    )}
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </div>
      </main>
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            2025 AeroGenAI
          </p>
        </div>
      </footer>
    </div>
  );
}
