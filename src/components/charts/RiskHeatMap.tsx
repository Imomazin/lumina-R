import { useMemo } from 'react';
import { cn } from '../../utils';
import type { Risk } from '../../types';

interface RiskHeatMapProps {
  risks: Risk[];
  onCellClick?: (probability: number, impact: number, risks: Risk[]) => void;
  className?: string;
}

export function RiskHeatMap({ risks, onCellClick, className }: RiskHeatMapProps) {
  // Build the matrix data
  const matrixData = useMemo(() => {
    const matrix: Record<string, Risk[]> = {};

    // Initialize all cells
    for (let p = 1; p <= 5; p++) {
      for (let i = 1; i <= 5; i++) {
        matrix[`${p}-${i}`] = [];
      }
    }

    // Populate with risks
    risks.forEach((risk) => {
      const key = `${risk.probability}-${risk.impact}`;
      if (matrix[key]) {
        matrix[key].push(risk);
      }
    });

    return matrix;
  }, [risks]);

  const getCellColor = (probability: number, impact: number) => {
    const score = probability * impact;
    if (score >= 20) return 'bg-risk-critical/60 hover:bg-risk-critical/70';
    if (score >= 15) return 'bg-risk-high/50 hover:bg-risk-high/60';
    if (score >= 10) return 'bg-risk-medium/50 hover:bg-risk-medium/60';
    if (score >= 5) return 'bg-amber-500/30 hover:bg-amber-500/40';
    return 'bg-risk-low/30 hover:bg-risk-low/40';
  };

  const impactLabels = ['Insignificant', 'Minor', 'Moderate', 'Major', 'Catastrophic'];
  const probabilityLabels = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'];

  return (
    <div className={cn('', className)}>
      <div className="flex">
        {/* Y-axis label */}
        <div className="flex items-center justify-center w-8 -rotate-90 origin-center">
          <span className="text-xs font-medium text-navy-400 whitespace-nowrap">Probability →</span>
        </div>

        <div className="flex-1">
          {/* Matrix grid */}
          <div className="grid grid-cols-6 gap-1">
            {/* Header row */}
            <div /> {/* Empty corner */}
            {impactLabels.map((label, i) => (
              <div key={i} className="text-center py-2">
                <span className="text-2xs font-medium text-navy-400">{label}</span>
              </div>
            ))}

            {/* Data rows (reversed so 5 is at top) */}
            {[5, 4, 3, 2, 1].map((probability) => (
              <>
                <div key={`label-${probability}`} className="flex items-center justify-end pr-2">
                  <span className="text-2xs font-medium text-navy-400">
                    {probabilityLabels[probability - 1]}
                  </span>
                </div>
                {[1, 2, 3, 4, 5].map((impact) => {
                  const cellRisks = matrixData[`${probability}-${impact}`];
                  const count = cellRisks.length;

                  return (
                    <button
                      key={`${probability}-${impact}`}
                      onClick={() => onCellClick?.(probability, impact, cellRisks)}
                      className={cn(
                        'aspect-square rounded-lg flex items-center justify-center transition-all duration-200 border border-navy-700/30',
                        getCellColor(probability, impact),
                        count > 0 && 'cursor-pointer'
                      )}
                    >
                      {count > 0 && (
                        <span className="text-lg font-bold text-white drop-shadow-md">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </>
            ))}
          </div>

          {/* X-axis label */}
          <div className="text-center mt-3">
            <span className="text-xs font-medium text-navy-400">Impact →</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-navy-700/50">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-risk-critical/60" />
          <span className="text-xs text-navy-400">Critical (20-25)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-risk-high/50" />
          <span className="text-xs text-navy-400">High (15-19)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-risk-medium/50" />
          <span className="text-xs text-navy-400">Medium (10-14)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500/30" />
          <span className="text-xs text-navy-400">Low (5-9)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-risk-low/30" />
          <span className="text-xs text-navy-400">Minimal (1-4)</span>
        </div>
      </div>
    </div>
  );
}
