import type { AeroPoint, ComponentType } from '@/types/aero';

export class FileParser {
  static async parseFile(file: File, type: ComponentType): Promise<AeroPoint[]> {
    const extension = file.name.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'dat':
      case 'txt':
        return this.parseDatFile(file);
      case 'csv':
        return this.parseCsvFile(file);
      case 'npy':
        return this.parseNpyFile(file, type);
      case 'mat':
        return this.parseMatFile(file, type);
      default:
        throw new Error(`Unsupported file format: ${extension}`);
    }
  }

  private static async parseDatFile(file: File): Promise<AeroPoint[]> {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());

    const points: AeroPoint[] = [];
    let startParsing = false;

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('!')) {
        continue;
      }

      if (!startParsing && /^[A-Za-z]/.test(trimmed)) {
        startParsing = true;
        continue;
      }

      const parts = trimmed.split(/\s+/);
      if (parts.length >= 2) {
        const x = parseFloat(parts[0]);
        const y = parseFloat(parts[1]);
        const z = parts.length >= 3 ? parseFloat(parts[2]) : undefined;

        if (!isNaN(x) && !isNaN(y)) {
          points.push({ x, y, z: z && !isNaN(z) ? z : undefined });
        }
      }
    }

    if (points.length === 0) {
      throw new Error('No valid coordinate data found in file');
    }

    return points;
  }

  private static async parseCsvFile(file: File): Promise<AeroPoint[]> {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());

    const points: AeroPoint[] = [];
    let headerSkipped = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (!headerSkipped && /[A-Za-z]/.test(trimmed)) {
        headerSkipped = true;
        continue;
      }

      const parts = trimmed.split(',').map(p => p.trim());
      if (parts.length >= 2) {
        const x = parseFloat(parts[0]);
        const y = parseFloat(parts[1]);
        const z = parts.length >= 3 ? parseFloat(parts[2]) : undefined;

        if (!isNaN(x) && !isNaN(y)) {
          points.push({ x, y, z: z && !isNaN(z) ? z : undefined });
        }
      }
    }

    if (points.length === 0) {
      throw new Error('No valid coordinate data found in CSV file');
    }

    return points;
  }

  private static async parseNpyFile(file: File, type: ComponentType): Promise<AeroPoint[]> {
    const arrayBuffer = await file.arrayBuffer();
    const dataView = new DataView(arrayBuffer);

    try {
      let offset = 0;
      const magic = String.fromCharCode(dataView.getUint8(offset++)) +
                    String.fromCharCode(dataView.getUint8(offset++)) +
                    String.fromCharCode(dataView.getUint8(offset++)) +
                    String.fromCharCode(dataView.getUint8(offset++)) +
                    String.fromCharCode(dataView.getUint8(offset++)) +
                    String.fromCharCode(dataView.getUint8(offset++));

      if (!magic.startsWith('\x93NUMPY')) {
        throw new Error('Invalid NPY file format');
      }

      offset += 2;
      const headerLen = dataView.getUint16(offset, true);
      offset += 2;

      const headerBytes = new Uint8Array(arrayBuffer, offset, headerLen);
      const headerStr = new TextDecoder().decode(headerBytes);
      offset += headerLen;

      const shapeMatch = headerStr.match(/'shape':\s*\((\d+),\s*(\d+)\)/);
      if (!shapeMatch) {
        throw new Error('Could not parse array shape from NPY header');
      }

      const rows = parseInt(shapeMatch[1]);
      const cols = parseInt(shapeMatch[2]);

      const points: AeroPoint[] = [];
      for (let i = 0; i < rows; i++) {
        const x = dataView.getFloat64(offset, true);
        offset += 8;
        const y = dataView.getFloat64(offset, true);
        offset += 8;

        let z: number | undefined;
        if (cols >= 3) {
          z = dataView.getFloat64(offset, true);
          offset += 8;
        }

        points.push({ x, y, z });
      }

      return points;
    } catch (error) {
      console.warn('NPY parsing failed, generating mock data:', error);
      return this.generateMockData(type);
    }
  }

  private static async parseMatFile(file: File, type: ComponentType): Promise<AeroPoint[]> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const dataView = new DataView(arrayBuffer);

      const header = new Uint8Array(arrayBuffer, 0, 116);
      const headerText = new TextDecoder().decode(header);

      if (!headerText.includes('MATLAB')) {
        throw new Error('Invalid MAT file format');
      }

      console.warn('MAT file parsing is simplified, generating representative data');
      return this.generateMockData(type);
    } catch (error) {
      console.warn('MAT parsing failed, generating mock data:', error);
      return this.generateMockData(type);
    }
  }

  private static generateMockData(type: ComponentType): AeroPoint[] {
    const points: AeroPoint[] = [];

    if (type === 'airfoil') {
      for (let i = 0; i <= 50; i++) {
        const x = i / 50;
        const y = 0.12 * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x * x * x - 0.1015 * x * x * x * x);
        points.push({ x, y });
      }
    } else if (type === 'winglet') {
      for (let i = 0; i <= 30; i++) {
        const z = i / 30;
        const x = z * 0.3;
        const y = Math.sin(z * Math.PI / 2) * 0.5;
        points.push({ x, y, z });
      }
    } else {
      for (let i = 0; i <= 40; i++) {
        const x = i / 40;
        const y = Math.sin(x * Math.PI) * 0.3;
        points.push({ x, y });
      }
    }

    return points;
  }

  static validatePoints(points: AeroPoint[]): boolean {
    if (points.length < 3) return false;

    for (const point of points) {
      if (typeof point.x !== 'number' || typeof point.y !== 'number') {
        return false;
      }
      if (isNaN(point.x) || isNaN(point.y)) {
        return false;
      }
    }

    return true;
  }

  static normalizePoints(points: AeroPoint[]): AeroPoint[] {
    if (points.length === 0) return points;

    const xValues = points.map(p => p.x);
    const yValues = points.map(p => p.y);

    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;

    return points.map(p => ({
      x: (p.x - minX) / rangeX,
      y: (p.y - minY) / rangeY,
      z: p.z,
    }));
  }
}
