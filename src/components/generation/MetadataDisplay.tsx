/**
 * Metadata Display Component
 * Shows comprehensive shape metadata and documentation
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Zap, Code, Info, Clock, Hash } from 'lucide-react';
import type { ShapeMetadata } from '@/types/enhancedAero';

interface MetadataDisplayProps {
  metadata: ShapeMetadata;
}

export function MetadataDisplay({ metadata }: MetadataDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Shape Documentation
        </CardTitle>
        <CardDescription>Complete metadata and usage information</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="aero">Aerodynamics</TabsTrigger>
            <TabsTrigger value="cfd">CFD Notes</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4 mt-4">
            <div className="bg-muted/50 p-4 rounded-md">
              <p className="text-sm leading-relaxed">{metadata.summary}</p>
            </div>

            {metadata.familyName && (
              <div>
                <p className="text-sm font-medium mb-2">Airfoil Family</p>
                <Badge variant="secondary">{metadata.familyName}</Badge>
              </div>
            )}

            {metadata.sourceAirfoils && metadata.sourceAirfoils.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Source Airfoils</p>
                <div className="flex flex-wrap gap-2">
                  {metadata.sourceAirfoils.map((airfoil, idx) => (
                    <Badge key={idx} variant="outline">
                      {airfoil}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-2">
              <InfoItem icon={<Hash className="h-4 w-4" />} label="Similarity" value={`${(metadata.similarityScore * 100).toFixed(1)}%`} />
              <InfoItem icon={<Zap className="h-4 w-4" />} label="Diversity Attempts" value={metadata.diversityAttempts.toString()} />
              <InfoItem icon={<Clock className="h-4 w-4" />} label="Generation Time" value={`${metadata.generationTime.toFixed(0)}ms`} />
              <InfoItem icon={<Code className="h-4 w-4" />} label="Version" value={metadata.generatorVersion} />
            </div>
          </TabsContent>

          <TabsContent value="aero" className="space-y-4 mt-4">
            <div>
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Aerodynamic Characteristics
              </p>
              <div className="bg-muted/50 p-4 rounded-md">
                <p className="text-sm leading-relaxed whitespace-pre-line">{metadata.aerodynamicCharacteristics}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Parameter Effects</p>
              <div className="bg-muted/50 p-4 rounded-md">
                <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono">{metadata.parameterEffects}</pre>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cfd" className="space-y-4 mt-4">
            <div className="bg-muted/50 p-4 rounded-md">
              <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono">{metadata.cfdNotes}</pre>
            </div>
          </TabsContent>

          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="space-y-3">
              <InfoRow label="Identifier" value={metadata.identifier} mono />
              <InfoRow label="Timestamp" value={new Date(metadata.timestamp).toLocaleString()} />
              <InfoRow label="Chord Length" value={metadata.chordLength.toFixed(4)} mono />
              <InfoRow label="Max Thickness" value={`${(metadata.maxThickness * 100).toFixed(2)}%`} mono />
              <InfoRow label="Thickness Location" value={`${(metadata.maxThicknessLocation * 100).toFixed(1)}%`} mono />
              <InfoRow label="Max Camber" value={`${(Math.abs(metadata.maxCamber) * 100).toFixed(2)}%`} mono />
              <InfoRow label="Camber Location" value={`${(metadata.maxCamberLocation * 100).toFixed(1)}%`} mono />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

/**
 * Compact Metadata Badge
 */
interface MetadataBadgeProps {
  metadata: ShapeMetadata;
}

export function MetadataBadge({ metadata }: MetadataBadgeProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {metadata.familyName && (
        <Badge variant="secondary" className="text-xs">
          {metadata.familyName}
        </Badge>
      )}
      <Badge variant="outline" className="text-xs">
        L/D: ~{metadata.validationResult.score > 0.8 ? '80+' : '60+'}
      </Badge>
      <Badge variant="outline" className="text-xs">
        {(metadata.maxThickness * 100).toFixed(1)}% thick
      </Badge>
      {metadata.maxCamber > 0.005 && (
        <Badge variant="outline" className="text-xs">
          {(metadata.maxCamber * 100).toFixed(1)}% camber
        </Badge>
      )}
    </div>
  );
}
