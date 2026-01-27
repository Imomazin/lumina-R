import { useState } from 'react';
import { Info, Download, Filter } from 'lucide-react';
import { PageHeader, SectionCard } from '../../components';
import { RiskHeatMap } from '../../components/charts';
import { StatusBadge } from '../../components/badges';
import { risks } from '../../data';
import type { Risk } from '../../types';

export default function RiskMatrix() {
  const [selectedCell, setSelectedCell] = useState<{
    probability: number;
    impact: number;
    risks: Risk[];
  } | null>(null);

  const handleCellClick = (probability: number, impact: number, cellRisks: Risk[]) => {
    if (cellRisks.length > 0) {
      setSelectedCell({ probability, impact, risks: cellRisks });
    }
  };

  // Calculate stats for each severity level
  const severityStats = {
    critical: risks.filter(r => r.riskScore >= 20).length,
    high: risks.filter(r => r.riskScore >= 15 && r.riskScore < 20).length,
    medium: risks.filter(r => r.riskScore >= 10 && r.riskScore < 15).length,
    low: risks.filter(r => r.riskScore < 10).length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Risk Matrix"
        subtitle="Probability vs Impact risk assessment visualization"
        actions={
          <div className="flex items-center gap-3">
            <button className="btn-ghost">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button className="btn-ghost">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 border-l-4 border-l-risk-critical">
          <p className="text-3xl font-bold text-red-400">{severityStats.critical}</p>
          <p className="text-sm text-navy-400">Critical (20-25)</p>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-risk-high">
          <p className="text-3xl font-bold text-red-300">{severityStats.high}</p>
          <p className="text-sm text-navy-400">High (15-19)</p>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-risk-medium">
          <p className="text-3xl font-bold text-amber-400">{severityStats.medium}</p>
          <p className="text-sm text-navy-400">Medium (10-14)</p>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-risk-low">
          <p className="text-3xl font-bold text-emerald-400">{severityStats.low}</p>
          <p className="text-sm text-navy-400">Low (1-9)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Matrix */}
        <div className="lg:col-span-2">
          <SectionCard
            title="Risk Heat Map"
            subtitle="Click on a cell to view associated risks"
          >
            <RiskHeatMap
              risks={risks}
              onCellClick={handleCellClick}
              className="py-4"
            />
          </SectionCard>
        </div>

        {/* Cell Detail Panel */}
        <div>
          {selectedCell ? (
            <SectionCard
              title={`Risks at P${selectedCell.probability} × I${selectedCell.impact}`}
              subtitle={`Score: ${selectedCell.probability * selectedCell.impact}`}
            >
              <div className="space-y-3">
                {selectedCell.risks.map((risk) => (
                  <div
                    key={risk.id}
                    className="p-4 rounded-xl bg-navy-800/30 border border-navy-700/50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-mono text-navy-500">{risk.id}</span>
                      <StatusBadge variant={risk.severity}>
                        {risk.severity}
                      </StatusBadge>
                    </div>
                    <h4 className="text-sm font-semibold text-navy-100 mb-1">
                      {risk.title}
                    </h4>
                    <p className="text-xs text-navy-400 line-clamp-2 mb-3">
                      {risk.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-navy-500">{risk.owner}</span>
                      <span className="font-bold text-navy-200">Score: {risk.riskScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          ) : (
            <SectionCard>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Info className="w-12 h-12 text-navy-600 mb-4" />
                <h3 className="text-lg font-medium text-navy-300 mb-2">
                  Select a Cell
                </h3>
                <p className="text-sm text-navy-500 max-w-xs">
                  Click on any cell in the heat map to view the risks at that probability and impact level.
                </p>
              </div>
            </SectionCard>
          )}

          {/* Matrix Guide */}
          <SectionCard title="Assessment Guide" className="mt-6">
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-navy-200 mb-2">Probability Scale</h4>
                <div className="space-y-1 text-navy-400">
                  <p>5 - Almost Certain (&gt;90%)</p>
                  <p>4 - Likely (60-90%)</p>
                  <p>3 - Possible (30-60%)</p>
                  <p>2 - Unlikely (10-30%)</p>
                  <p>1 - Rare (&lt;10%)</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-navy-200 mb-2">Impact Scale</h4>
                <div className="space-y-1 text-navy-400">
                  <p>5 - Catastrophic</p>
                  <p>4 - Major</p>
                  <p>3 - Moderate</p>
                  <p>2 - Minor</p>
                  <p>1 - Insignificant</p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
