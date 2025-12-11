/**
 * Diversity Enforcement System
 * Tracks generated shapes and ensures diversity through latent vector management
 */

import type { AeroPoint } from '@/types/aero';

export interface LatentVector {
  id: string;
  vector: number[];
  timestamp: number;
  shapeType: string;
  parameters: Record<string, number>;
}

export interface DiversityResult {
  latentVector: number[];
  similarityScore: number;
  isDiverse: boolean;
  attempts: number;
}

/**
 * Diversity Tracker - manages latent vectors and ensures shape diversity
 */
export class DiversityTracker {
  private static instance: DiversityTracker;
  private latentHistory: LatentVector[] = [];
  private maxHistorySize = 50;
  private similarityThreshold = 0.85;
  private maxAttempts = 5;

  private constructor() {}

  static getInstance(): DiversityTracker {
    if (!DiversityTracker.instance) {
      DiversityTracker.instance = new DiversityTracker();
    }
    return DiversityTracker.instance;
  }

  /**
   * Generate a diverse latent vector
   * Ensures the new vector is sufficiently different from recent generations
   */
  generateDiverseLatent(
    dimension: number,
    temperature: number,
    shapeType: string,
    parameters: Record<string, number>
  ): DiversityResult {
    let attempts = 0;
    let bestVector: number[] = [];
    let bestSimilarity = 1.0;

    while (attempts < this.maxAttempts) {
      attempts++;
      
      // Generate new latent vector
      const latentVector = this.sampleLatentVector(dimension, temperature);
      
      // Calculate similarity to recent vectors
      const similarity = this.calculateMaxSimilarity(latentVector, shapeType);
      
      // Keep track of best (most diverse) vector
      if (similarity < bestSimilarity) {
        bestSimilarity = similarity;
        bestVector = latentVector;
      }
      
      // If diverse enough, use it
      if (similarity < this.similarityThreshold) {
        this.addToHistory({
          id: this.generateId(),
          vector: latentVector,
          timestamp: Date.now(),
          shapeType,
          parameters,
        });
        
        return {
          latentVector,
          similarityScore: similarity,
          isDiverse: true,
          attempts,
        };
      }
      
      // Increase temperature for next attempt to encourage diversity
      temperature *= 1.2;
    }

    // If we couldn't find a diverse vector, use the best one we found
    console.warn(`Could not find diverse vector after ${attempts} attempts. Using best found (similarity: ${bestSimilarity.toFixed(3)})`);
    
    this.addToHistory({
      id: this.generateId(),
      vector: bestVector,
      timestamp: Date.now(),
      shapeType,
      parameters,
    });

    return {
      latentVector: bestVector,
      similarityScore: bestSimilarity,
      isDiverse: bestSimilarity < this.similarityThreshold,
      attempts,
    };
  }

  /**
   * Sample a new latent vector using Gaussian distribution
   */
  private sampleLatentVector(dimension: number, temperature: number): number[] {
    const vector: number[] = [];
    
    for (let i = 0; i < dimension; i++) {
      // Box-Muller transform for Gaussian sampling
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      
      // Scale by temperature
      vector.push(z * temperature);
    }
    
    return vector;
  }

  /**
   * Calculate maximum similarity to recent vectors of the same type
   */
  private calculateMaxSimilarity(vector: number[], shapeType: string): number {
    const recentVectors = this.latentHistory
      .filter(h => h.shapeType === shapeType)
      .slice(-10); // Only compare with last 10 of same type

    if (recentVectors.length === 0) {
      return 0; // No history, completely diverse
    }

    let maxSimilarity = 0;
    for (const history of recentVectors) {
      const similarity = this.cosineSimilarity(vector, history.vector);
      maxSimilarity = Math.max(maxSimilarity, similarity);
    }

    return maxSimilarity;
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(v1: number[], v2: number[]): number {
    if (v1.length !== v2.length) {
      console.warn('Vector dimension mismatch in similarity calculation');
      return 0;
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < v1.length; i++) {
      dotProduct += v1[i] * v2[i];
      norm1 += v1[i] * v1[i];
      norm2 += v2[i] * v2[i];
    }

    norm1 = Math.sqrt(norm1);
    norm2 = Math.sqrt(norm2);

    if (norm1 === 0 || norm2 === 0) return 0;

    return dotProduct / (norm1 * norm2);
  }

  /**
   * Add latent vector to history
   */
  private addToHistory(latent: LatentVector): void {
    this.latentHistory.push(latent);

    // Maintain max history size
    if (this.latentHistory.length > this.maxHistorySize) {
      this.latentHistory.shift();
    }
  }

  /**
   * Calculate shape similarity based on coordinates
   */
  calculateShapeSimilarity(points1: AeroPoint[], points2: AeroPoint[]): number {
    if (points1.length !== points2.length) {
      // Resample to same length for comparison
      const targetLength = Math.min(points1.length, points2.length);
      points1 = this.resamplePoints(points1, targetLength);
      points2 = this.resamplePoints(points2, targetLength);
    }

    let sumSquaredDiff = 0;
    let sumSquaredNorm = 0;

    for (let i = 0; i < points1.length; i++) {
      const dx = points1[i].x - points2[i].x;
      const dy = points1[i].y - points2[i].y;
      sumSquaredDiff += dx * dx + dy * dy;
      sumSquaredNorm += points1[i].x * points1[i].x + points1[i].y * points1[i].y;
    }

    if (sumSquaredNorm === 0) return 0;

    // Normalized difference (0 = identical, 1 = completely different)
    const difference = Math.sqrt(sumSquaredDiff / sumSquaredNorm);
    
    // Convert to similarity (0 = different, 1 = identical)
    return Math.max(0, 1 - difference);
  }

  /**
   * Resample points to target length
   */
  private resamplePoints(points: AeroPoint[], targetLength: number): AeroPoint[] {
    if (points.length === targetLength) return points;

    const resampled: AeroPoint[] = [];
    const step = (points.length - 1) / (targetLength - 1);

    for (let i = 0; i < targetLength; i++) {
      const index = i * step;
      const lowerIndex = Math.floor(index);
      const upperIndex = Math.ceil(index);
      const t = index - lowerIndex;

      if (lowerIndex === upperIndex) {
        resampled.push(points[lowerIndex]);
      } else {
        const p1 = points[lowerIndex];
        const p2 = points[upperIndex];
        resampled.push({
          x: p1.x * (1 - t) + p2.x * t,
          y: p1.y * (1 - t) + p2.y * t,
        });
      }
    }

    return resampled;
  }

  /**
   * Get history statistics
   */
  getStatistics(): {
    totalGenerated: number;
    byType: Record<string, number>;
    averageSimilarity: number;
  } {
    const byType: Record<string, number> = {};
    
    for (const history of this.latentHistory) {
      byType[history.shapeType] = (byType[history.shapeType] || 0) + 1;
    }

    // Calculate average similarity between consecutive generations
    let totalSimilarity = 0;
    let count = 0;

    for (let i = 1; i < this.latentHistory.length; i++) {
      if (this.latentHistory[i].shapeType === this.latentHistory[i - 1].shapeType) {
        const sim = this.cosineSimilarity(
          this.latentHistory[i].vector,
          this.latentHistory[i - 1].vector
        );
        totalSimilarity += sim;
        count++;
      }
    }

    return {
      totalGenerated: this.latentHistory.length,
      byType,
      averageSimilarity: count > 0 ? totalSimilarity / count : 0,
    };
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.latentHistory = [];
  }

  /**
   * Get recent latent vectors
   */
  getRecentLatents(count: number = 10): LatentVector[] {
    return this.latentHistory.slice(-count);
  }

  /**
   * Set similarity threshold
   */
  setSimilarityThreshold(threshold: number): void {
    this.similarityThreshold = Math.max(0, Math.min(1, threshold));
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Export singleton instance
 */
export const diversityTracker = DiversityTracker.getInstance();
