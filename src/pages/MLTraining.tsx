import { useState, useEffect } from 'react';
import { TrainingControlPanel } from '@/components/training/TrainingControlPanel';
import { TrainingProgress } from '@/components/training/TrainingProgress';
import { TrainingChart } from '@/components/training/TrainingChart';
import { TrainingHistory } from '@/components/training/TrainingHistory';
import { ShapeVisualizer } from '@/components/aero/ShapeVisualizer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MLTrainer, type TrainingConfig, type TrainingResult } from '@/services/mlTrainer';
import { useToast } from '@/hooks/use-toast';
import { Brain, Download, Sparkles } from 'lucide-react';

export default function MLTraining() {
  const [currentSession, setCurrentSession] = useState(MLTrainer.getCurrentSession());
  const [allSessions, setAllSessions] = useState(MLTrainer.getAllSessions());
  const [isTraining, setIsTraining] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTraining) {
        setCurrentSession(MLTrainer.getCurrentSession());
        setAllSessions(MLTrainer.getAllSessions());
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isTraining]);

  const handleStartTraining = async (config: TrainingConfig) => {
    setIsTraining(true);
    
    toast({
      title: 'Training Started',
      description: `Training ${config.componentType} model with ${config.maxIterations} iterations`,
    });

    try {
      const session = await MLTrainer.startTraining(config, (result: TrainingResult) => {
        setCurrentSession(MLTrainer.getCurrentSession());
      });

      setCurrentSession(session);
      setAllSessions(MLTrainer.getAllSessions());
      
      const successCount = session.results.filter(r => r.success).length;
      
      toast({
        title: 'Training Completed',
        description: `${successCount}/${session.results.length} airfoils achieved L/D > ${config.targetLiftDragRatio}`,
      });
    } catch (error) {
      toast({
        title: 'Training Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsTraining(false);
    }
  };

  const handleStopTraining = () => {
    if (currentSession) {
      MLTrainer.stopTraining(currentSession.id);
      setIsTraining(false);
      
      toast({
        title: 'Training Stopped',
        description: 'Training session has been stopped',
      });
    }
  };

  const handleReset = () => {
    setCurrentSession(null);
    setSelectedSessionId(null);
  };

  const handleViewSession = (sessionId: string) => {
    const session = MLTrainer.getSession(sessionId);
    if (session) {
      setCurrentSession(session);
      setSelectedSessionId(sessionId);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    MLTrainer.clearSession(sessionId);
    setAllSessions(MLTrainer.getAllSessions());
    
    if (selectedSessionId === sessionId) {
      setCurrentSession(null);
      setSelectedSessionId(null);
    }

    toast({
      title: 'Session Deleted',
      description: 'Training session has been removed',
    });
  };

  const handleExportSession = (sessionId: string) => {
    try {
      const data = MLTrainer.exportSession(sessionId);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `training-session-${sessionId}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Session Exported',
        description: 'Training data has been downloaded',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: error instanceof Error ? error.message : 'Failed to export session',
        variant: 'destructive',
      });
    }
  };

  const handleExportReport = () => {
    if (!currentSession) return;

    try {
      const report = MLTrainer.generateTrainingReport(currentSession.id);
      const blob = new Blob([report], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `training-report-${currentSession.id}.md`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Report Exported',
        description: 'Training report has been downloaded',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: error instanceof Error ? error.message : 'Failed to export report',
        variant: 'destructive',
      });
    }
  };

  const displaySession = selectedSessionId 
    ? MLTrainer.getSession(selectedSessionId) 
    : currentSession;

  return (
    <div className="min-h-screen bg-background">
      <div className="@container">
        <div className="mx-auto max-w-[1600px] p-4 xl:p-8 space-y-8">
          <div className="flex flex-col @md:flex-row @md:items-center @md:justify-between gap-4">
            <div>
              <h1 className="text-3xl xl:text-4xl font-bold flex items-center gap-3">
                <Brain className="h-8 w-8 xl:h-10 xl:w-10 text-primary" />
                ML Training System
              </h1>
              <p className="text-muted-foreground mt-2">
                Train models to generate high-performance airfoils with L/D ratio &gt; 50
              </p>
            </div>
            {currentSession && (
              <Button onClick={handleExportReport} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            )}
          </div>

          <Tabs defaultValue="training" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="training" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <TrainingControlPanel
                  onStartTraining={handleStartTraining}
                  onStopTraining={handleStopTraining}
                  onReset={handleReset}
                  isTraining={isTraining}
                />
                <TrainingProgress session={displaySession} />
              </div>

              <TrainingChart session={displaySession} />

              {displaySession?.bestResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-yellow-500" />
                      Best Generated Airfoil
                    </CardTitle>
                    <CardDescription>
                      Highest performing airfoil from this training session
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ShapeVisualizer
                      shape={displaySession.bestResult.shape}
                    />
                    <div className="mt-4 grid grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Iteration:</span>
                        <span className="ml-2 font-medium">
                          {displaySession.bestResult.iteration}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">L/D Ratio:</span>
                        <span className="ml-2 font-medium text-green-600">
                          {displaySession.bestResult.liftDragRatio.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Lift Coefficient:</span>
                        <span className="ml-2 font-medium">
                          {displaySession.bestResult.liftCoefficient.toFixed(4)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Drag Coefficient:</span>
                        <span className="ml-2 font-medium">
                          {displaySession.bestResult.dragCoefficient.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              {displaySession ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Training Summary</CardTitle>
                      <CardDescription>
                        Performance analysis of training session
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Total Iterations</p>
                          <p className="text-2xl font-bold">{displaySession.results.length}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Success Rate</p>
                          <p className="text-2xl font-bold text-green-600">
                            {displaySession.successRate.toFixed(1)}%
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Average L/D</p>
                          <p className="text-2xl font-bold">
                            {displaySession.averageLiftDragRatio.toFixed(2)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Best L/D</p>
                          <p className="text-2xl font-bold text-green-600">
                            {displaySession.bestResult?.liftDragRatio.toFixed(2) || 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Configuration Used</h4>
                        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Component:</span>
                            <span className="ml-2 font-medium">{displaySession.config.componentType}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Complexity:</span>
                            <span className="ml-2 font-medium">{displaySession.config.complexity}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Camber:</span>
                            <span className="ml-2 font-medium">{displaySession.config.camber}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Thickness:</span>
                            <span className="ml-2 font-medium">{displaySession.config.thickness}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Latent Dim:</span>
                            <span className="ml-2 font-medium">{displaySession.config.latentDimension}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Smoothness:</span>
                            <span className="ml-2 font-medium">{displaySession.config.smoothness}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Temperature:</span>
                            <span className="ml-2 font-medium">{displaySession.config.temperature}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Target L/D:</span>
                            <span className="ml-2 font-medium">{displaySession.config.targetLiftDragRatio}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <TrainingChart session={displaySession} />
                </>
              ) : (
                <Card>
                  <CardContent className="py-12">
                    <p className="text-center text-muted-foreground">
                      No training results available. Start a training session to see results.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history">
              <TrainingHistory
                sessions={allSessions}
                onViewSession={handleViewSession}
                onDeleteSession={handleDeleteSession}
                onExportSession={handleExportSession}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
