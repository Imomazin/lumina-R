import { useState } from 'react';
// Icons removed for cleaner UI
import { PageHeader, SectionCard } from '../../components';
import { RiskHeatMap } from '../../components/charts';
import { StatusBadge } from '../../components/badges';
import { risks } from '../../data';
import { cn } from '../../utils';
import type { Risk } from '../../types';

export default function RiskMatrix() {
  const [selectedCell, setSelectedCell] = useState<{
    probability: number;
    impact: number;
    risks: Risk[];
  } | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  // Handle export
  const handleExport = () => {
    const headers = ['ID', 'Title', 'Probability', 'Impact', 'Score', 'Severity', 'Category'];
    const rows = risks.map(r => [r.id, `"${r.title}"`, r.probability, r.impact, r.riskScore, r.severity, r.category]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `risk-matrix-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
            <button className="btn-ghost" onClick={() => setShowFilterPanel(!showFilterPanel)}>
              Filter
            </button>
            <button className="btn-ghost" onClick={handleExport}>
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

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-navy-200">Filter by Severity</h3>
            <button onClick={() => { setFilterSeverity('all'); setShowFilterPanel(false); }} className="text-xs text-navy-400 hover:text-navy-200">Clear</button>
          </div>
          <div className="flex gap-2">
            {['all', 'critical', 'high', 'medium', 'low'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize',
                  filterSeverity === sev
                    ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
                    : 'text-navy-400 bg-navy-800/50 border border-navy-700/30 hover:text-navy-200'
                )}
              >
                {sev === 'all' ? 'All' : sev}
              </button>
            ))}
          </div>
        </div>
      )}

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
                <span className="text-4xl text-navy-600 mb-4">ℹ</span>
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
