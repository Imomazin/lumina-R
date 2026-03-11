// Tier 4 Strategic Risk Register - Main Page
// Dual Panel View: Left (Qualitative) | Right (Quantitative)

import { useState, useMemo } from 'react';
import { PageHeader } from '../../components';
import { strategicRisks, companyThresholdConfig } from '../../data';
import { useData } from '../../context/DataContext';
import {
  formatCurrency,
  getColourClass,
  getProbabilityLabel,
  calculatePortfolioMetrics,
} from '../../services/strategicRiskEngine';
import { cn } from '../../utils';
import type { StrategicRisk, StrategicRiskColour, ThresholdConfig } from '../../types';

// Colour badge component
function ColourBadge({ colour }: { colour: StrategicRiskColour }) {
  const labels: Record<StrategicRiskColour, string> = {
    green: 'GREEN',
    amber: 'AMBER',
    red: 'RED',
    black: 'BLACK',
  };

  return (
    <span className={cn('px-2 py-1 rounded text-xs font-bold uppercase border', getColourClass(colour))}>
      {labels[colour]}
    </span>
  );
}

// Impact dimension row component
function ImpactRow({ label, value, weight }: { label: string; value: number; weight: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-navy-400">
        {label} <span className="text-navy-600">({(weight * 100).toFixed(0)}%)</span>
      </span>
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={cn(
                'w-4 h-4 rounded-sm',
                i <= value ? 'bg-accent-primary' : 'bg-navy-700'
              )}
            />
          ))}
        </div>
        <span className="text-navy-200 font-medium w-6 text-right">{value}</span>
      </div>
    </div>
  );
}

// Escalation trigger display
function EscalationBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    crisis_governance: 'bg-slate-900 text-white border-white/30',
    board_visibility: 'bg-red-500/20 text-red-400 border-red-500/30',
    cfo_review: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    executive_committee: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    department_head: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    risk_owner: 'bg-navy-700/50 text-navy-300 border-navy-600',
  };

  const labels: Record<string, string> = {
    crisis_governance: 'Crisis Governance',
    board_visibility: 'Board Visibility',
    cfo_review: 'CFO Review',
    executive_committee: 'Exec Committee',
    department_head: 'Dept Head',
    risk_owner: 'Risk Owner',
  };

  return (
    <span className={cn('px-2 py-0.5 rounded text-xs font-medium border', colors[level] || colors.risk_owner)}>
      {labels[level] || level}
    </span>
  );
}

// Main Strategic Register Page
export default function StrategicRegister() {
  const { isDataActive } = useData();
  const [selectedRisk, setSelectedRisk] = useState<StrategicRisk | null>(null);
  const [filterColour, setFilterColour] = useState<StrategicRiskColour | 'all'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'emv' | 'ebitda'>('score');
  const [showThresholdConfig, setShowThresholdConfig] = useState(false);
  const [thresholdConfig] = useState<ThresholdConfig>(companyThresholdConfig);

  const activeStrategicRisks = isDataActive ? strategicRisks : [];

  // Calculate portfolio metrics
  const portfolioMetrics = useMemo(
    () => calculatePortfolioMetrics(activeStrategicRisks, thresholdConfig),
    [thresholdConfig, isDataActive]
  );

  // Filter and sort risks
  const filteredRisks = useMemo(() => {
    let result = [...activeStrategicRisks];

    if (filterColour !== 'all') {
      result = result.filter((r) => r.colour === filterColour);
    }

    switch (sortBy) {
      case 'score':
        result.sort((a, b) => b.overallRiskScore - a.overallRiskScore);
        break;
      case 'emv':
        result.sort((a, b) => b.expectedMonetaryValue - a.expectedMonetaryValue);
        break;
      case 'ebitda':
        result.sort((a, b) => b.ebitdaExposurePercent - a.ebitdaExposurePercent);
        break;
    }

    return result;
  }, [filterColour, sortBy, isDataActive]);

  // Handle export
  const handleExport = () => {
    const headers = [
      'ID', 'Title', 'Colour', 'Score', 'EMV', 'Capital Allocation',
      'EBITDA Exposure %', 'Probability', 'Financial Impact', 'Owner',
    ];
    const rows = activeStrategicRisks.map((r) => [
      r.id,
      `"${r.title}"`,
      r.colour.toUpperCase(),
      r.overallRiskScore.toFixed(2),
      r.expectedMonetaryValue,
      r.capitalAllocationRequired,
      r.ebitdaExposurePercent.toFixed(2),
      r.probability,
      r.financialEstimate.mostLikely,
      r.owner,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `strategic-risk-register-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Strategic Risk Register"
        subtitle="Tier 4 Enterprise Risk Intelligence with Financial Modelling"
        actions={
          <div className="flex items-center gap-3">
            <button
              className="btn-ghost"
              onClick={() => setShowThresholdConfig(!showThresholdConfig)}
            >
              Thresholds
            </button>
            <button className="btn-ghost" onClick={handleExport}>
              Export
            </button>
          </div>
        }
      />

      {/* Portfolio Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="glass-card p-4 border-l-4 border-l-accent-primary">
          <p className="text-2xl font-bold text-navy-100">
            £{formatCurrency(portfolioMetrics.totalEMVExposure)}
          </p>
          <p className="text-sm text-navy-400">Total EMV Exposure</p>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-amber-500">
          <p className="text-2xl font-bold text-navy-100">
            £{formatCurrency(portfolioMetrics.totalCapitalAllocated)}
          </p>
          <p className="text-sm text-navy-400">Capital Allocated</p>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-emerald-500">
          <p className="text-2xl font-bold text-emerald-400">{portfolioMetrics.risksByColour.green}</p>
          <p className="text-sm text-navy-400">Green</p>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-amber-500">
          <p className="text-2xl font-bold text-amber-400">{portfolioMetrics.risksByColour.amber}</p>
          <p className="text-sm text-navy-400">Amber</p>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-red-500">
          <p className="text-2xl font-bold text-red-400">{portfolioMetrics.risksByColour.red}</p>
          <p className="text-sm text-navy-400">Red</p>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-slate-500">
          <p className="text-2xl font-bold text-white">{portfolioMetrics.risksByColour.black}</p>
          <p className="text-sm text-navy-400">Black</p>
        </div>
      </div>

      {/* Threshold Configuration Panel */}
      {showThresholdConfig && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-navy-100 mb-4">Threshold Configuration</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-navy-400">Annual EBITDA</p>
              <p className="text-navy-100 font-mono">£{formatCurrency(thresholdConfig.annualEBITDA)}</p>
            </div>
            <div>
              <p className="text-navy-400">Green Max Score</p>
              <p className="text-navy-100 font-mono">&lt; {thresholdConfig.greenScoreMax}</p>
            </div>
            <div>
              <p className="text-navy-400">Green Max EMV</p>
              <p className="text-navy-100 font-mono">£{formatCurrency(thresholdConfig.greenEMVMax)}</p>
            </div>
            <div>
              <p className="text-navy-400">Amber Max Score</p>
              <p className="text-navy-100 font-mono">&lt; {thresholdConfig.amberScoreMax}</p>
            </div>
            <div>
              <p className="text-navy-400">Amber Max EMV</p>
              <p className="text-navy-100 font-mono">£{formatCurrency(thresholdConfig.amberEMVMax)}</p>
            </div>
            <div>
              <p className="text-navy-400">Mandatory Mitigation</p>
              <p className="text-navy-100 font-mono">&gt; {thresholdConfig.mandatoryMitigationThreshold}% EBITDA</p>
            </div>
            <div>
              <p className="text-navy-400">Exec Committee Trigger</p>
              <p className="text-navy-100 font-mono">Score ≥ {thresholdConfig.executiveCommitteeScoreThreshold}</p>
            </div>
            <div>
              <p className="text-navy-400">CFO Review Trigger</p>
              <p className="text-navy-100 font-mono">EMV &gt; £{formatCurrency(thresholdConfig.cfoReviewEMVThreshold)}</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-navy-800/50 rounded-lg text-sm text-navy-400">
            <strong className="text-navy-300">Colour Logic:</strong>{' '}
            Green (Score &lt;7 AND EMV &lt;£100k) | Amber (Score 7-12 OR EMV £100k-£500k) |
            Red (Score ≥13 OR EMV &gt;£500k) | Black (Worst Case &gt;20% EBITDA OR Legal=5)
          </div>
        </div>
      )}

      {/* Filters and Sort */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-navy-400">Filter:</span>
          {(['all', 'green', 'amber', 'red', 'black'] as const).map((colour) => (
            <button
              key={colour}
              onClick={() => setFilterColour(colour)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                filterColour === colour
                  ? 'bg-accent-primary/20 text-accent-primary'
                  : 'text-navy-400 hover:text-navy-200 hover:bg-navy-800/50'
              )}
            >
              {colour === 'all' ? 'All' : colour.charAt(0).toUpperCase() + colour.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-navy-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'score' | 'emv' | 'ebitda')}
            className="px-3 py-1.5 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50"
          >
            <option value="score">Risk Score</option>
            <option value="emv">EMV</option>
            <option value="ebitda">EBITDA Exposure</option>
          </select>
        </div>
      </div>

      {/* Risk List */}
      <div className="space-y-3">
        {filteredRisks.map((risk) => (
          <div
            key={risk.id}
            onClick={() => setSelectedRisk(risk)}
            className={cn(
              'glass-card p-4 cursor-pointer transition-all hover:border-accent-primary/50',
              selectedRisk?.id === risk.id && 'border-accent-primary/50 ring-1 ring-accent-primary/20'
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-mono text-navy-500">{risk.id}</span>
                  <ColourBadge colour={risk.colour} />
                  {risk.trend === 'increasing' && (
                    <span className="text-xs text-red-400">↑ Increasing</span>
                  )}
                  {risk.riskVelocity === 'rapid' && (
                    <span className="text-xs text-amber-400">Fast Moving</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-navy-100 truncate">{risk.title}</h3>
                <p className="text-sm text-navy-400 mt-1 line-clamp-2">{risk.description}</p>
              </div>
              <div className="flex gap-6 text-right shrink-0">
                <div>
                  <p className="text-2xl font-bold text-navy-100">{risk.overallRiskScore.toFixed(1)}</p>
                  <p className="text-xs text-navy-500">Score</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent-primary">£{formatCurrency(risk.expectedMonetaryValue)}</p>
                  <p className="text-xs text-navy-500">EMV</p>
                </div>
                <div>
                  <p className={cn(
                    'text-2xl font-bold',
                    risk.ebitdaExposurePercent > 10 ? 'text-red-400' : 'text-navy-100'
                  )}>
                    {risk.ebitdaExposurePercent.toFixed(1)}%
                  </p>
                  <p className="text-xs text-navy-500">EBITDA</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-navy-700/50">
              <span className="text-sm text-navy-400">
                <span className="text-navy-500">Owner:</span> {risk.owner}
              </span>
              <span className="text-sm text-navy-400">
                <span className="text-navy-500">Dept:</span> {risk.department}
              </span>
              {risk.escalationTriggers.filter((t) => t.triggered).length > 0 && (
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-xs text-navy-500">Escalations:</span>
                  {risk.escalationTriggers
                    .filter((t) => t.triggered)
                    .slice(0, 2)
                    .map((t, i) => (
                      <EscalationBadge key={i} level={t.level} />
                    ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dual Panel Detail Modal */}
      {selectedRisk && (
        <div
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedRisk(null)}
        >
          <div
            className="glass-card max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-navy-700/50 shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-mono text-navy-500">{selectedRisk.id}</span>
                    <ColourBadge colour={selectedRisk.colour} />
                  </div>
                  <h2 className="text-xl font-bold text-navy-100">{selectedRisk.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedRisk(null)}
                  className="p-2 rounded-lg text-navy-400 hover:text-navy-200 hover:bg-navy-800/50 text-xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Dual Panel Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-navy-700/50">
                {/* Left Panel: Qualitative Assessment */}
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-4">
                      Section A: Risk Identity
                    </h3>
                    <p className="text-navy-300 text-sm leading-relaxed">{selectedRisk.description}</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-navy-500">Owner</p>
                        <p className="text-sm text-navy-200">{selectedRisk.owner}</p>
                      </div>
                      <div>
                        <p className="text-xs text-navy-500">Department</p>
                        <p className="text-sm text-navy-200">{selectedRisk.department}</p>
                      </div>
                      <div>
                        <p className="text-xs text-navy-500">Date Identified</p>
                        <p className="text-sm text-navy-200">{selectedRisk.dateIdentified}</p>
                      </div>
                      <div>
                        <p className="text-xs text-navy-500">Next Review</p>
                        <p className="text-sm text-navy-200">{selectedRisk.nextReview}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-4">
                      Section B: Qualitative Risk Analysis
                    </h3>

                    {/* Probability */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-navy-400">Probability</span>
                        <span className="text-sm text-navy-200 font-medium">
                          {getProbabilityLabel(selectedRisk.probability)} ({selectedRisk.probabilityPercent}%)
                        </span>
                      </div>
                      <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent-primary rounded-full"
                          style={{ width: `${selectedRisk.probabilityPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Impact Dimensions */}
                    <div className="space-y-2 mb-4">
                      <p className="text-xs text-navy-500 uppercase tracking-wide">Weighted Impact Dimensions</p>
                      <ImpactRow label="Financial" value={selectedRisk.impactDimensions.financial} weight={0.30} />
                      <ImpactRow label="Operational" value={selectedRisk.impactDimensions.operational} weight={0.20} />
                      <ImpactRow label="Reputational" value={selectedRisk.impactDimensions.reputational} weight={0.20} />
                      <ImpactRow label="Strategic" value={selectedRisk.impactDimensions.strategic} weight={0.20} />
                      <ImpactRow label="Legal" value={selectedRisk.impactDimensions.legal} weight={0.10} />
                    </div>

                    {/* Calculated Scores */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-navy-800/30 rounded-lg">
                      <div>
                        <p className="text-xs text-navy-500">Weighted Impact</p>
                        <p className="text-xl font-bold text-navy-100">{selectedRisk.weightedImpactScore.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-navy-500">Overall Risk Score</p>
                        <p className="text-xl font-bold text-navy-100">{selectedRisk.overallRiskScore.toFixed(2)}</p>
                        <p className="text-xs text-navy-500">
                          {selectedRisk.probability} × {selectedRisk.weightedImpactScore.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Current Controls */}
                  <div>
                    <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-3">
                      Current Controls
                    </h3>
                    <ul className="space-y-1">
                      {selectedRisk.currentControls.map((control, i) => (
                        <li key={i} className="text-sm text-navy-300 flex items-start gap-2">
                          <span className="text-accent-primary">✓</span>
                          {control}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Interdependencies */}
                  {selectedRisk.interdependencies.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-3">
                        Risk Interdependencies
                      </h3>
                      <div className="space-y-2">
                        {selectedRisk.interdependencies.map((dep, i) => (
                          <div key={i} className="p-2 bg-navy-800/30 rounded text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-navy-200 font-mono">{dep.linkedRiskId}</span>
                              <span className="text-navy-400">{dep.relationshipType}</span>
                            </div>
                            <p className="text-navy-400 text-xs mt-1">{dep.description}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-navy-500 mt-2">
                        Interdependency Score: <span className="text-navy-200">{selectedRisk.interdependencyScore}/10</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Panel: Quantitative Assessment */}
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-4">
                      Section C: Quantitative Financial Model
                    </h3>

                    {/* Triangular Estimate */}
                    <div className="mb-4">
                      <p className="text-xs text-navy-500 uppercase tracking-wide mb-2">Scenario Estimates</p>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center">
                          <p className="text-xs text-emerald-400 mb-1">Best Case</p>
                          <p className="text-lg font-bold text-emerald-300">
                            £{formatCurrency(selectedRisk.financialEstimate.bestCase)}
                          </p>
                        </div>
                        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-center">
                          <p className="text-xs text-amber-400 mb-1">Most Likely</p>
                          <p className="text-lg font-bold text-amber-300">
                            £{formatCurrency(selectedRisk.financialEstimate.mostLikely)}
                          </p>
                        </div>
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                          <p className="text-xs text-red-400 mb-1">Worst Case</p>
                          <p className="text-lg font-bold text-red-300">
                            £{formatCurrency(selectedRisk.financialEstimate.worstCase)}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-navy-500 mt-2 text-center">
                        Confidence Level: {selectedRisk.financialEstimate.confidenceLevel}%
                      </p>
                    </div>

                    {/* Key Financial Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-navy-800/30 rounded-lg">
                        <p className="text-xs text-navy-500">Simple EMV</p>
                        <p className="text-xl font-bold text-accent-primary">
                          £{formatCurrency(selectedRisk.simpleEMV)}
                        </p>
                        <p className="text-xs text-navy-500 mt-1">
                          {selectedRisk.probabilityPercent}% × £{formatCurrency(selectedRisk.financialEstimate.mostLikely)}
                        </p>
                      </div>
                      <div className="p-4 bg-navy-800/30 rounded-lg">
                        <p className="text-xs text-navy-500">Triangular EMV</p>
                        <p className="text-xl font-bold text-accent-primary">
                          £{formatCurrency(selectedRisk.expectedMonetaryValue)}
                        </p>
                        <p className="text-xs text-navy-500 mt-1">
                          Using (B+M+W)/3 method
                        </p>
                      </div>
                      <div className="p-4 bg-navy-800/30 rounded-lg">
                        <p className="text-xs text-navy-500">Capital Allocation</p>
                        <p className="text-xl font-bold text-amber-400">
                          £{formatCurrency(selectedRisk.capitalAllocationRequired)}
                        </p>
                        <p className="text-xs text-navy-500 mt-1">
                          Worst case × confidence adjustment
                        </p>
                      </div>
                      <div className="p-4 bg-navy-800/30 rounded-lg">
                        <p className="text-xs text-navy-500">EBITDA Exposure</p>
                        <p className={cn(
                          'text-xl font-bold',
                          selectedRisk.ebitdaExposurePercent > 10 ? 'text-red-400' : 'text-navy-100'
                        )}>
                          {selectedRisk.ebitdaExposurePercent.toFixed(1)}%
                        </p>
                        <p className="text-xs text-navy-500 mt-1">
                          {selectedRisk.ebitdaExposurePercent > 10
                            ? 'Mandatory mitigation required'
                            : 'Within tolerance'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-4">
                      Section D: Escalation Triggers
                    </h3>
                    {selectedRisk.escalationTriggers.length > 0 ? (
                      <div className="space-y-2">
                        {selectedRisk.escalationTriggers.map((trigger, i) => (
                          <div
                            key={i}
                            className={cn(
                              'p-3 rounded-lg border',
                              trigger.triggered
                                ? 'bg-red-500/10 border-red-500/30'
                                : 'bg-navy-800/30 border-navy-700'
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <EscalationBadge level={trigger.level} />
                              {trigger.triggered && (
                                <span className="text-xs text-red-400">TRIGGERED</span>
                              )}
                            </div>
                            <p className="text-sm text-navy-300 mt-2">{trigger.reason}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-navy-400">No escalation triggers active</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-4">
                      Section E: Mitigation Options
                    </h3>
                    {selectedRisk.mitigationOptions.length > 0 ? (
                      <div className="space-y-3">
                        {selectedRisk.mitigationOptions.map((option) => {
                          const roi = option.cost > 0
                            ? ((option.netBenefit / option.cost) * 100).toFixed(0)
                            : '0';
                          return (
                            <div
                              key={option.id}
                              className="p-4 bg-navy-800/30 rounded-lg border border-navy-700/50"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="text-sm font-medium text-navy-100">{option.name}</h4>
                                <span className={cn(
                                  'px-2 py-0.5 rounded text-xs font-medium',
                                  option.status === 'approved' && 'bg-emerald-500/20 text-emerald-400',
                                  option.status === 'in_progress' && 'bg-blue-500/20 text-blue-400',
                                  option.status === 'proposed' && 'bg-navy-600 text-navy-300',
                                  option.status === 'completed' && 'bg-emerald-500/20 text-emerald-400'
                                )}>
                                  {option.status}
                                </span>
                              </div>
                              <p className="text-xs text-navy-400 mb-3">{option.description}</p>
                              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                                <div>
                                  <p className="text-navy-500">Cost</p>
                                  <p className="text-navy-200 font-medium">£{formatCurrency(option.cost)}</p>
                                </div>
                                <div>
                                  <p className="text-navy-500">Reduction</p>
                                  <p className="text-emerald-400 font-medium">
                                    £{formatCurrency(option.riskReductionValue)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-navy-500">Net Benefit</p>
                                  <p className={cn(
                                    'font-medium',
                                    option.netBenefit >= 0 ? 'text-emerald-400' : 'text-red-400'
                                  )}>
                                    £{formatCurrency(option.netBenefit)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-navy-500">ROI</p>
                                  <p className={cn(
                                    'font-medium',
                                    Number(roi) >= 0 ? 'text-emerald-400' : 'text-red-400'
                                  )}>
                                    {roi}%
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2 pt-2 border-t border-navy-700/50 flex items-center justify-between text-xs">
                                <span className="text-navy-500">
                                  New Residual Score: <span className="text-navy-200">{option.newResidualScore.toFixed(1)}</span>
                                </span>
                                <span className="text-navy-500">
                                  Timeline: <span className="text-navy-200">{option.implementationTime}</span>
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-navy-400">No mitigation options defined</p>
                    )}
                  </div>

                  {/* Early Warning Indicators */}
                  {selectedRisk.earlyWarningIndicators.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-3">
                        Early Warning Indicators
                      </h3>
                      <div className="space-y-2">
                        {selectedRisk.earlyWarningIndicators.map((ewi) => (
                          <div key={ewi.id} className="p-2 bg-navy-800/30 rounded text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-navy-200">{ewi.name}</span>
                              <span className={cn(
                                'text-xs',
                                ewi.currentValue >= ewi.threshold ? 'text-red-400' : 'text-navy-400'
                              )}>
                                {ewi.currentValue} / {ewi.threshold}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-1.5 bg-navy-800 rounded-full overflow-hidden">
                                <div
                                  className={cn(
                                    'h-full rounded-full',
                                    ewi.currentValue >= ewi.threshold ? 'bg-red-500' : 'bg-accent-primary'
                                  )}
                                  style={{ width: `${Math.min((ewi.currentValue / ewi.threshold) * 100, 100)}%` }}
                                />
                              </div>
                              <span className={cn(
                                'text-xs',
                                ewi.trend === 'increasing' ? 'text-red-400' : ewi.trend === 'decreasing' ? 'text-emerald-400' : 'text-navy-400'
                              )}>
                                {ewi.trend === 'increasing' ? '↑' : ewi.trend === 'decreasing' ? '↓' : '→'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-navy-700/50 flex items-center justify-between shrink-0">
              <div className="text-xs text-navy-500">
                Last modified by {selectedRisk.lastModifiedBy} on{' '}
                {new Date(selectedRisk.lastModifiedAt).toLocaleDateString()}
              </div>
              <button className="btn-secondary" onClick={() => setSelectedRisk(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
