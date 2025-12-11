import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Award, Activity } from 'lucide-react';
import type { TrainingSession } from '@/services/mlTrainer';

interface TrainingProgressProps {
  session: TrainingSession | null;
}

export function TrainingProgress({ session }: TrainingProgressProps) {
  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Training Progress</CardTitle>
          <CardDescription>No active training session</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Configure parameters and start training to see progress
          </p>
        </CardContent>
      </Card>
    );
  }

  const progress = (session.results.length / session.config.maxIterations) * 100;
  const isRunning = session.status === 'running';

  const getStatusColor = () => {
    switch (session.status) {
      case 'running':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'stopped':
        return 'bg-yellow-500';
      default:
        return 'bg-muted';
    }
  };

  const getSuccessRateColor = () => {
    if (session.successRate >= 80) return 'text-green-600';
    if (session.successRate >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Training Progress</CardTitle>
            <CardDescription>
              {isRunning ? 'Training in progress...' : `Training ${session.status}`}
            </CardDescription>
          </div>
          <Badge className={getStatusColor()}>
            {session.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Iterations</span>
            <span className="font-medium">
              {session.results.length} / {session.config.maxIterations}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="h-4 w-4" />
              <span className="text-xs">Success Rate</span>
            </div>
            <p className={`text-2xl font-bold ${getSuccessRateColor()}`}>
              {session.successRate.toFixed(1)}%
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span className="text-xs">Avg L/D Ratio</span>
            </div>
            <p className="text-2xl font-bold">
              {session.averageLiftDragRatio.toFixed(2)}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Award className="h-4 w-4" />
              <span className="text-xs">Best L/D Ratio</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {session.bestResult?.liftDragRatio.toFixed(2) || 'N/A'}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Target L/D</span>
            </div>
            <p className="text-2xl font-bold">
              {session.config.targetLiftDragRatio}
            </p>
          </div>
        </div>

        {session.bestResult && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">Best Result Details</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Iteration:</span>
                <span className="ml-2 font-medium">{session.bestResult.iteration}</span>
              </div>
              <div>
                <span className="text-muted-foreground">L/D Ratio:</span>
                <span className="ml-2 font-medium text-green-600">
                  {session.bestResult.liftDragRatio.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Lift Coefficient:</span>
                <span className="ml-2 font-medium">{session.bestResult.liftCoefficient.toFixed(4)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Drag Coefficient:</span>
                <span className="ml-2 font-medium">{session.bestResult.dragCoefficient.toFixed(4)}</span>
              </div>
            </div>
          </div>
        )}

        {isRunning && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Training model... This may take several minutes</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
