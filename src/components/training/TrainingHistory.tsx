import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Trash2, Eye } from 'lucide-react';
import type { TrainingSession } from '@/services/mlTrainer';

interface TrainingHistoryProps {
  sessions: TrainingSession[];
  onViewSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onExportSession: (sessionId: string) => void;
}

export function TrainingHistory({
  sessions,
  onViewSession,
  onDeleteSession,
  onExportSession,
}: TrainingHistoryProps) {
  const formatDuration = (startTime: number, endTime?: number) => {
    const duration = (endTime || Date.now()) - startTime;
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-blue-500">Running</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'stopped':
        return <Badge className="bg-yellow-500">Stopped</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Training History</CardTitle>
          <CardDescription>Past training sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No training history available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Training History</CardTitle>
        <CardDescription>{sessions.length} training session(s)</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{session.config.componentType}</h4>
                      {getStatusBadge(session.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(session.startTime)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onViewSession(session.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onExportSession(session.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteSession(session.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="ml-2 font-medium">
                      {formatDuration(session.startTime, session.endTime)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Iterations:</span>
                    <span className="ml-2 font-medium">{session.results.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Success Rate:</span>
                    <span className="ml-2 font-medium">{session.successRate.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Avg L/D:</span>
                    <span className="ml-2 font-medium">
                      {session.averageLiftDragRatio.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline">Temp: {session.config.temperature}</Badge>
                  <Badge variant="outline">Complex: {session.config.complexity}</Badge>
                  <Badge variant="outline">Camber: {session.config.camber}%</Badge>
                  <Badge variant="outline">Thick: {session.config.thickness}%</Badge>
                  <Badge variant="outline">Latent: {session.config.latentDimension}</Badge>
                </div>

                {session.bestResult && (
                  <div className="text-xs text-muted-foreground">
                    Best L/D: <span className="text-green-600 font-medium">
                      {session.bestResult.liftDragRatio.toFixed(2)}
                    </span> (Iteration {session.bestResult.iteration})
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
