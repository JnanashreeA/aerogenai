import { ShapeGenerator } from './shapeGenerator';
import { XFoilValidator } from './xfoilValidator';
import type { ComponentType, AeroShape, GenerationParams } from '@/types/aero';

export interface TrainingConfig {
  complexity: number;
  camber: number;
  thickness: number;
  latentDimension: number;
  smoothness: number;
  temperature: number;
  targetLiftDragRatio: number;
  batchSize: number;
  maxIterations: number;
  componentType: ComponentType;
}

export interface TrainingResult {
  iteration: number;
  shape: AeroShape;
  liftDragRatio: number;
  liftCoefficient: number;
  dragCoefficient: number;
  success: boolean;
  timestamp: number;
}

export interface TrainingSession {
  id: string;
  config: TrainingConfig;
  results: TrainingResult[];
  startTime: number;
  endTime?: number;
  status: 'running' | 'completed' | 'stopped';
  bestResult?: TrainingResult;
  averageLiftDragRatio: number;
  successRate: number;
}

export class MLTrainer {
  private static sessions: Map<string, TrainingSession> = new Map();
  private static currentSession: string | null = null;

  static async startTraining(
    config: TrainingConfig,
    onProgress?: (result: TrainingResult) => void
  ): Promise<TrainingSession> {
    const sessionId = `session-${Date.now()}`;
    
    const session: TrainingSession = {
      id: sessionId,
      config,
      results: [],
      startTime: Date.now(),
      status: 'running',
      averageLiftDragRatio: 0,
      successRate: 0,
    };

    this.sessions.set(sessionId, session);
    this.currentSession = sessionId;

    const params: GenerationParams = {
      type: config.componentType,
      complexity: config.complexity,
      smoothness: config.smoothness,
      temperature: config.temperature,
      latentDimension: config.latentDimension,
      thickness: config.thickness,
      camber: config.camber,
    };

    for (let i = 0; i < config.maxIterations; i++) {
      if (session.status === 'stopped') break;

      try {
        const shape = await ShapeGenerator.generateShape(config.componentType, params);
        
        const validation = await XFoilValidator.runXFoilAnalysis(shape.points);
        
        const maxLDIndex = validation.clcd.reduce((maxIdx, val, idx, arr) => 
          val > arr[maxIdx] ? idx : maxIdx, 0
        );
        
        const liftDragRatio = validation.clcd[maxLDIndex] || 0;
        const liftCoefficient = validation.cl[maxLDIndex] || 0;
        const dragCoefficient = validation.cd[maxLDIndex] || 0;
        
        const result: TrainingResult = {
          iteration: i + 1,
          shape,
          liftDragRatio,
          liftCoefficient,
          dragCoefficient,
          success: liftDragRatio >= config.targetLiftDragRatio,
          timestamp: Date.now(),
        };

        session.results.push(result);

        if (!session.bestResult || result.liftDragRatio > session.bestResult.liftDragRatio) {
          session.bestResult = result;
        }

        const totalLD = session.results.reduce((sum, r) => sum + r.liftDragRatio, 0);
        session.averageLiftDragRatio = totalLD / session.results.length;
        
        const successCount = session.results.filter(r => r.success).length;
        session.successRate = (successCount / session.results.length) * 100;

        if (onProgress) {
          onProgress(result);
        }

        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Training iteration ${i + 1} failed:`, error);
      }
    }

    session.status = 'completed';
    session.endTime = Date.now();

    return session;
  }

  static stopTraining(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session && session.status === 'running') {
      session.status = 'stopped';
      session.endTime = Date.now();
    }
  }

  static getSession(sessionId: string): TrainingSession | undefined {
    return this.sessions.get(sessionId);
  }

  static getAllSessions(): TrainingSession[] {
    return Array.from(this.sessions.values()).sort((a, b) => b.startTime - a.startTime);
  }

  static getCurrentSession(): TrainingSession | null {
    if (!this.currentSession) return null;
    return this.sessions.get(this.currentSession) || null;
  }

  static clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
    if (this.currentSession === sessionId) {
      this.currentSession = null;
    }
  }

  static clearAllSessions(): void {
    this.sessions.clear();
    this.currentSession = null;
  }

  static exportSession(sessionId: string): string {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    return JSON.stringify(session, null, 2);
  }

  static async batchTraining(
    configs: TrainingConfig[],
    onBatchProgress?: (configIndex: number, result: TrainingResult) => void
  ): Promise<TrainingSession[]> {
    const sessions: TrainingSession[] = [];

    for (let i = 0; i < configs.length; i++) {
      const session = await this.startTraining(configs[i], (result) => {
        if (onBatchProgress) {
          onBatchProgress(i, result);
        }
      });
      sessions.push(session);
    }

    return sessions;
  }

  static getOptimalParameters(sessions: TrainingSession[]): Partial<TrainingConfig> | null {
    if (sessions.length === 0) return null;

    const successfulSessions = sessions.filter(s => s.successRate >= 80);
    if (successfulSessions.length === 0) return null;

    const bestSession = successfulSessions.reduce((best, current) => 
      current.averageLiftDragRatio > best.averageLiftDragRatio ? current : best
    );

    return {
      complexity: bestSession.config.complexity,
      camber: bestSession.config.camber,
      thickness: bestSession.config.thickness,
      latentDimension: bestSession.config.latentDimension,
      smoothness: bestSession.config.smoothness,
      temperature: bestSession.config.temperature,
    };
  }

  static generateTrainingReport(sessionId: string): string {
    const session = this.sessions.get(sessionId);
    if (!session) return 'Session not found';

    const duration = (session.endTime || Date.now()) - session.startTime;
    const durationSec = (duration / 1000).toFixed(2);

    let report = `# Training Session Report\n\n`;
    report += `**Session ID**: ${session.id}\n`;
    report += `**Status**: ${session.status}\n`;
    report += `**Duration**: ${durationSec}s\n\n`;
    
    report += `## Configuration\n`;
    report += `- Component Type: ${session.config.componentType}\n`;
    report += `- Complexity: ${session.config.complexity}\n`;
    report += `- Camber: ${session.config.camber}%\n`;
    report += `- Thickness: ${session.config.thickness}%\n`;
    report += `- Latent Dimension: ${session.config.latentDimension}\n`;
    report += `- Smoothness: ${session.config.smoothness}\n`;
    report += `- Temperature: ${session.config.temperature}\n`;
    report += `- Target L/D Ratio: ${session.config.targetLiftDragRatio}\n`;
    report += `- Batch Size: ${session.config.batchSize}\n`;
    report += `- Max Iterations: ${session.config.maxIterations}\n\n`;

    report += `## Results\n`;
    report += `- Total Iterations: ${session.results.length}\n`;
    report += `- Success Rate: ${session.successRate.toFixed(2)}%\n`;
    report += `- Average L/D Ratio: ${session.averageLiftDragRatio.toFixed(2)}\n`;
    
    if (session.bestResult) {
      report += `\n## Best Result\n`;
      report += `- Iteration: ${session.bestResult.iteration}\n`;
      report += `- L/D Ratio: ${session.bestResult.liftDragRatio.toFixed(2)}\n`;
      report += `- Lift Coefficient: ${session.bestResult.liftCoefficient.toFixed(4)}\n`;
      report += `- Drag Coefficient: ${session.bestResult.dragCoefficient.toFixed(4)}\n`;
    }

    const ldValues = session.results.map(r => r.liftDragRatio);
    const minLD = Math.min(...ldValues);
    const maxLD = Math.max(...ldValues);
    
    report += `\n## Performance Range\n`;
    report += `- Minimum L/D: ${minLD.toFixed(2)}\n`;
    report += `- Maximum L/D: ${maxLD.toFixed(2)}\n`;
    report += `- Range: ${(maxLD - minLD).toFixed(2)}\n`;

    return report;
  }
}
