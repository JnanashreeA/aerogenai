import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { AeroMetrics, PerformanceData, ComponentType } from '@/types/aero';

interface AnalysisSummaryProps {
  metrics: AeroMetrics | null;
  performanceData: PerformanceData | null;
  type: ComponentType;
  classification?: 'good' | 'poor' | null;
}

export function AnalysisSummary({ metrics, performanceData, type, classification }: AnalysisSummaryProps) {
  if (!metrics || !performanceData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            No analysis data available. Run validation to generate insights.
          </div>
        </CardContent>
      </Card>
    );
  }

  const generateSummary = (): string => {
    const maxLift = Math.max(...performanceData.lift);
    const maxDrag = Math.max(...performanceData.drag);
    const maxEfficiency = Math.max(...performanceData.efficiency);
    const optimalAoA = performanceData.angleOfAttack[performanceData.efficiency.indexOf(maxEfficiency)];
    const ldRatio = metrics.liftToDragRatio || 0;

    let summary = '';

    switch (type) {
      case 'airfoil':
        summary = `The airfoil analysis reveals ${classification === 'good' ? 'excellent' : 'moderate'} aerodynamic performance with a lift-to-drag ratio of ${ldRatio.toFixed(2)}. `;
        
        if (maxLift > 1.2) {
          summary += `The design demonstrates strong lift generation capabilities (Cl max = ${maxLift.toFixed(3)}), making it suitable for high-lift applications. `;
        } else if (maxLift > 0.8) {
          summary += `The design shows balanced lift characteristics (Cl max = ${maxLift.toFixed(3)}), appropriate for general aviation purposes. `;
        } else {
          summary += `The design exhibits conservative lift generation (Cl max = ${maxLift.toFixed(3)}), optimized for low-drag, high-speed applications. `;
        }

        summary += `Peak efficiency occurs at ${optimalAoA.toFixed(1)}° angle of attack with an L/D ratio of ${maxEfficiency.toFixed(2)}. `;

        if (maxDrag < 0.02) {
          summary += `The low drag coefficient (Cd max = ${maxDrag.toFixed(4)}) indicates excellent streamlining and minimal flow separation. `;
        } else if (maxDrag < 0.05) {
          summary += `The moderate drag coefficient (Cd max = ${maxDrag.toFixed(4)}) suggests acceptable aerodynamic efficiency with room for optimization. `;
        } else {
          summary += `The elevated drag coefficient (Cd max = ${maxDrag.toFixed(4)}) indicates potential flow separation or suboptimal geometry requiring refinement. `;
        }

        if (classification === 'good') {
          summary += `Overall, this airfoil demonstrates superior aerodynamic characteristics suitable for performance-critical applications.`;
        } else {
          summary += `While functional, this design would benefit from geometry optimization to improve the lift-to-drag ratio and overall efficiency.`;
        }
        break;

      case 'winglet':
        summary = `The winglet configuration analysis indicates ${ldRatio > 40 ? 'effective' : 'moderate'} induced drag reduction potential with an L/D ratio of ${ldRatio.toFixed(2)}. `;
        
        summary += `The design achieves maximum efficiency at ${optimalAoA.toFixed(1)}° with an L/D of ${maxEfficiency.toFixed(2)}, `;
        
        if (maxEfficiency > 50) {
          summary += `demonstrating excellent vortex management and wingtip flow control. `;
        } else {
          summary += `showing acceptable performance with opportunities for geometric refinement. `;
        }

        summary += `The lift distribution (Cl max = ${maxLift.toFixed(3)}) and drag characteristics (Cd max = ${maxDrag.toFixed(4)}) suggest `;
        
        if (maxLift / maxDrag > 40) {
          summary += `superior aerodynamic efficiency, effectively reducing induced drag and improving overall wing performance. `;
        } else {
          summary += `moderate effectiveness in reducing wingtip vortices, with potential for optimization through sweep or cant angle adjustments. `;
        }

        summary += `This winglet design is ${ldRatio > 45 ? 'highly recommended' : 'suitable'} for applications requiring improved fuel efficiency and range extension.`;
        break;

      case 'sidepod':
        const coolingEff = metrics.coolingEfficiency || 0;
        summary = `The sidepod design analysis reveals ${coolingEff > 0.7 ? 'excellent' : 'adequate'} cooling efficiency (${(coolingEff * 100).toFixed(1)}%) with a drag coefficient of ${maxDrag.toFixed(4)}. `;
        
        summary += `The aerodynamic profile demonstrates ${maxDrag < 0.15 ? 'minimal' : 'moderate'} drag penalty while maintaining `;
        
        if (coolingEff > 0.75) {
          summary += `superior airflow management through the cooling channels. `;
        } else {
          summary += `acceptable airflow characteristics with room for inlet/outlet optimization. `;
        }

        summary += `The efficiency score of ${(metrics.efficiency || 0).toFixed(3)} indicates `;
        
        if ((metrics.efficiency || 0) > 0.8) {
          summary += `an optimal balance between aerodynamic drag and cooling performance, suitable for high-performance racing applications. `;
        } else {
          summary += `a functional design that could benefit from refined inlet geometry or internal flow path optimization. `;
        }

        summary += `Overall, this sidepod configuration ${coolingEff > 0.7 ? 'successfully achieves' : 'provides'} the necessary cooling requirements while ${maxDrag < 0.15 ? 'minimizing' : 'managing'} aerodynamic penalties.`;
        break;

      case 'diffuser':
        const downforce = metrics.downforce || 0;
        summary = `The diffuser analysis demonstrates ${downforce > 0.5 ? 'strong' : 'moderate'} downforce generation (Cd = ${downforce.toFixed(3)}) with an efficiency ratio of ${(metrics.efficiency || 0).toFixed(3)}. `;
        
        summary += `The expansion profile achieves ${maxDrag < 0.2 ? 'minimal' : 'acceptable'} drag penalty (Cd = ${maxDrag.toFixed(4)}) while `;
        
        if (downforce > 0.6) {
          summary += `generating substantial ground effect, indicating effective flow acceleration and pressure recovery. `;
        } else {
          summary += `producing moderate downforce levels, suggesting potential for increased expansion angle or length optimization. `;
        }

        summary += `The performance characteristics suggest `;
        
        if ((metrics.efficiency || 0) > 0.7) {
          summary += `excellent aerodynamic efficiency with well-managed flow separation and optimal pressure gradients. `;
        } else {
          summary += `functional performance with opportunities to enhance downforce through refined expansion geometry or ride height optimization. `;
        }

        summary += `This diffuser design is ${downforce > 0.5 ? 'highly effective' : 'suitable'} for applications requiring ${downforce > 0.5 ? 'maximum' : 'balanced'} downforce generation and aerodynamic stability.`;
        break;
    }

    return summary;
  };

  const getPerformanceIndicator = () => {
    const ldRatio = metrics.liftToDragRatio || 0;
    const efficiency = metrics.efficiency || 0;

    if (type === 'airfoil' || type === 'winglet') {
      if (ldRatio > 50 || classification === 'good') {
        return { icon: CheckCircle2, color: 'text-chart-1', label: 'Excellent Performance' };
      } else if (ldRatio > 30) {
        return { icon: TrendingUp, color: 'text-chart-4', label: 'Good Performance' };
      } else {
        return { icon: AlertCircle, color: 'text-chart-3', label: 'Needs Optimization' };
      }
    } else {
      if (efficiency > 0.7) {
        return { icon: CheckCircle2, color: 'text-chart-1', label: 'Excellent Performance' };
      } else if (efficiency > 0.5) {
        return { icon: TrendingUp, color: 'text-chart-4', label: 'Good Performance' };
      } else {
        return { icon: TrendingDown, color: 'text-chart-3', label: 'Needs Optimization' };
      }
    }
  };

  const summary = generateSummary();
  const indicator = getPerformanceIndicator();
  const Icon = indicator.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Analysis Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 p-4 rounded border border-border bg-muted/30">
          <Icon className={`w-6 h-6 ${indicator.color}`} />
          <div>
            <p className="font-semibold text-foreground">{indicator.label}</p>
            <p className="text-sm text-muted-foreground">
              {type.charAt(0).toUpperCase() + type.slice(1)} Design Assessment
            </p>
          </div>
        </div>

        <div className="p-4 rounded border border-border bg-card">
          <p className="text-sm leading-relaxed text-foreground">
            {summary}
          </p>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded border border-border bg-muted/20 text-center">
            <p className="text-muted-foreground">Component</p>
            <p className="font-semibold text-foreground mt-1">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </p>
          </div>
          <div className="p-3 rounded border border-border bg-muted/20 text-center">
            <p className="text-muted-foreground">Status</p>
            <p className={`font-semibold mt-1 ${indicator.color}`}>
              {indicator.label.split(' ')[0]}
            </p>
          </div>
          <div className="p-3 rounded border border-border bg-muted/20 text-center">
            <p className="text-muted-foreground">Data Points</p>
            <p className="font-semibold text-foreground mt-1">
              {performanceData.angleOfAttack.length}
            </p>
          </div>
          <div className="p-3 rounded border border-border bg-muted/20 text-center">
            <p className="text-muted-foreground">Analysis</p>
            <p className="font-semibold text-foreground mt-1">Complete</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
