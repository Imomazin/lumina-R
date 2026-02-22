// Strategy Implementation Risk — Enterprise Transformation Risk Intelligence
// Split: Left = Initiative Execution Diagnostics | Right = Financial Stress & Predictive Modelling

import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, Cell,
} from 'recharts';
import { PageHeader } from '../../components';
import { strategicInitiatives } from '../../data/strategicInitiatives';
import { useData } from '../../context/DataContext';
import {
  analyseInitiative,
  generateBoardIntelligence,
  simulateIntervention,
  getSCIColour,
  getIRSColour,
  getIRSLabel,
  getPSUBandColour,
} from '../../services/strategyRiskEngine';
import { formatCurrency } from '../../services/strategicRiskEngine';
import { cn } from '../../utils';
import type { InterventionScenario, PSURiskBand } from '../../types';

// Gauge component for readiness/fragility
function Gauge({ value, max, label, thresholds }: { value: number; max: number; label: string; thresholds: [number, number] }) {
  const pct = Math.min(100, (value / max) * 100);
  let colour = 'bg-emerald-500';
  if (pct > thresholds[1]) colour = 'bg-red-500';
  else if (pct > thresholds[0]) colour = 'bg-amber-500';

  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-navy-400">{label}</span>
        <span className="text-navy-200 font-mono">{value.toFixed(1)}%</span>
      </div>
      <div className="h-2.5 bg-navy-800 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', colour)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// PSU band badge
function PSUBadge({ band, probability }: { band: PSURiskBand; probability: number }) {
  const labels: Record<PSURiskBand, string> = { green: 'LOW', amber: 'AMBER', red: 'HIGH', black: 'CRITICAL' };
  return (
    <span className={cn('px-2 py-1 rounded text-xs font-bold uppercase border', getPSUBandColour(band))}>
      {labels[band]} ({probability.toFixed(1)}%)
    </span>
  );
}

export default function StrategyRisk() {
  const { isDataActive } = useData();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'overview' | 'readiness' | 'fragility' | 'capital' | 'drift' | 'psu' | 'intervention' | 'board'>('overview');
  const [intervention, setIntervention] = useState<InterventionScenario>({
    capitalIncrease: 0,
    scopeReduction: 0,
    phaseRollout: 0,
    leadershipSupport: 0,
    capabilityInvestment: 0,
  });

  const activeInitiatives = isDataActive ? strategicInitiatives : [];

  // Analyse all initiatives
  const analyses = useMemo(
    () => activeInitiatives.map((i) => analyseInitiative(i)),
    [isDataActive]
  );

  const boardIntel = useMemo(
    () => generateBoardIntelligence(analyses),
    [analyses]
  );

  const selectedAnalysis = analyses.find((a) => a.initiative.id === selectedId) || null;

  // Intervention simulation
  const interventionResult = useMemo(() => {
    if (!selectedAnalysis) return null;
    const anyChanged = Object.values(intervention).some((v) => v > 0);
    if (!anyChanged) return null;
    return simulateIntervention(selectedAnalysis.initiative, intervention);
  }, [selectedAnalysis, intervention]);

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Strategy Implementation Risk"
        subtitle="Enterprise Transformation Risk Intelligence Engine"
      />

      {/* Top Ribbon */}
      <div className="glass-card p-3 flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center divide-x divide-navy-700">
          <div className="flex flex-col items-center px-4 py-1">
            <span className="text-lg font-bold text-accent-primary">£{formatCurrency(boardIntel.totalCapitalDeployed)}</span>
            <span className="text-2xs text-navy-500 uppercase">Capital Deployed</span>
          </div>
          <div className="flex flex-col items-center px-4 py-1">
            <span className="text-lg font-bold text-navy-100">{boardIntel.averageIRS.toFixed(1)}%</span>
            <span className="text-2xs text-navy-500 uppercase">Avg IRS</span>
          </div>
          <div className="flex flex-col items-center px-4 py-1">
            <span className={cn('text-lg font-bold', boardIntel.averageSEFS > 50 ? 'text-red-400' : 'text-navy-100')}>
              {boardIntel.averageSEFS.toFixed(1)}
            </span>
            <span className="text-2xs text-navy-500 uppercase">Avg SEFS</span>
          </div>
          <div className="flex flex-col items-center px-4 py-1">
            <span className={cn('text-lg font-bold',
              boardIntel.portfolioPSU > 40 ? 'text-red-400' : boardIntel.portfolioPSU > 20 ? 'text-amber-400' : 'text-emerald-400'
            )}>
              {boardIntel.portfolioPSU.toFixed(1)}%
            </span>
            <span className="text-2xs text-navy-500 uppercase">Portfolio PSU</span>
          </div>
          <div className="flex flex-col items-center px-4 py-1">
            <span className={cn('text-lg font-bold',
              boardIntel.strategicResilienceIndex > 60 ? 'text-emerald-400' : 'text-amber-400'
            )}>
              {boardIntel.strategicResilienceIndex.toFixed(1)}
            </span>
            <span className="text-2xs text-navy-500 uppercase">Resilience</span>
          </div>
        </div>
      </div>

      {/* Initiative Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {analyses
          .sort((a, b) => b.psu.failureProbability - a.psu.failureProbability)
          .map(({ initiative: init, psu, sci, irs, sefs }) => (
            <button
              key={init.id}
              onClick={() => setSelectedId(init.id)}
              className={cn(
                'p-4 rounded-lg text-left transition-all border',
                selectedId === init.id
                  ? 'border-accent-primary bg-accent-primary/10'
                  : 'border-navy-700/50 bg-navy-800/30 hover:border-navy-600'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-navy-500">{init.id}</span>
                <PSUBadge band={psu.riskBand} probability={psu.failureProbability} />
              </div>
              <p className="text-sm font-medium text-navy-100 mb-1">{init.name}</p>
              <p className="text-2xs text-navy-500 mb-3">{init.horizon} | £{formatCurrency(init.totalInvestment)} | {init.executiveSponsor}</p>
              <div className="grid grid-cols-3 gap-2 text-2xs">
                <div className="text-center">
                  <p className="text-navy-500">SCI</p>
                  <p className={cn('font-bold', sci.classification === 'extreme' ? 'text-white' : sci.classification === 'high' ? 'text-red-400' : 'text-navy-200')}>
                    {sci.score.toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-navy-500">IRS</p>
                  <p className={cn('font-bold', irs.classification === 'high_failure_risk' ? 'text-red-400' : irs.classification === 'vulnerable' ? 'text-amber-400' : 'text-emerald-400')}>
                    {irs.score.toFixed(0)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-navy-500">SEFS</p>
                  <p className={cn('font-bold', sefs.isStructuralRisk ? 'text-red-400' : 'text-navy-200')}>
                    {sefs.score.toFixed(0)}
                  </p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-3">
                <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-primary rounded-full" style={{ width: `${init.actualProgress}%` }} />
                </div>
                <p className="text-2xs text-navy-500 mt-1">{init.actualProgress}% complete</p>
              </div>
            </button>
          ))}
      </div>

      {/* Section Tabs + Split Screen */}
      {selectedAnalysis && (
        <>
          <div className="flex gap-1 overflow-x-auto pb-1">
            {([
              { key: 'overview', label: 'Initiative Profile' },
              { key: 'readiness', label: 'Readiness (IRS)' },
              { key: 'fragility', label: 'Fragility (SEFS)' },
              { key: 'capital', label: 'Capital Stress' },
              { key: 'drift', label: 'Strategic Drift' },
              { key: 'psu', label: 'Failure Model (PSU)' },
              { key: 'intervention', label: 'Intervention Sim' },
              { key: 'board', label: 'Board View' },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveSection(tab.key)}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                  activeSection === tab.key
                    ? 'bg-accent-primary/20 text-accent-primary'
                    : 'text-navy-400 hover:text-navy-200 hover:bg-navy-800/50'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* LEFT PANEL */}
            <div className="space-y-4">
              {activeSection === 'overview' && (
                <div className="glass-card p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide">
                    Section 1: Strategic Initiative Profile
                  </h3>
                  <p className="text-sm text-navy-300">{selectedAnalysis.initiative.description}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-xs text-navy-500">Horizon</p><p className="text-navy-200">{selectedAnalysis.initiative.horizon}</p></div>
                    <div><p className="text-xs text-navy-500">Investment</p><p className="text-navy-200">£{formatCurrency(selectedAnalysis.initiative.totalInvestment)}</p></div>
                    <div><p className="text-xs text-navy-500">Sponsor</p><p className="text-navy-200">{selectedAnalysis.initiative.executiveSponsor}</p></div>
                    <div><p className="text-xs text-navy-500">Timeline</p><p className="text-navy-200">{selectedAnalysis.initiative.timeHorizonMonths} months</p></div>
                  </div>
                  <div>
                    <p className="text-xs text-navy-500 mb-2">Critical Dependencies</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedAnalysis.initiative.criticalDependencies.map((d, i) => (
                        <span key={i} className="px-2 py-0.5 bg-navy-800/50 rounded text-2xs text-navy-300">{d}</span>
                      ))}
                    </div>
                  </div>
                  {/* SCI Breakdown */}
                  <div className="p-4 bg-navy-800/30 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-navy-300">Strategic Complexity Index</span>
                      <span className={cn('px-2 py-0.5 rounded text-xs font-bold border', getSCIColour(selectedAnalysis.sci.classification))}>
                        {selectedAnalysis.sci.classification.toUpperCase()} ({selectedAnalysis.sci.score.toFixed(2)})
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      {[
                        { label: 'Dependency Density (30%)', value: selectedAnalysis.initiative.dependencyDensity },
                        { label: 'Technology Novelty (20%)', value: selectedAnalysis.initiative.technologyNovelty },
                        { label: 'Org Change Magnitude (25%)', value: selectedAnalysis.initiative.organisationalChangeMagnitude },
                        { label: 'External Uncertainty (25%)', value: selectedAnalysis.initiative.externalUncertainty },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-navy-400 text-xs">{item.label}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map((v) => (
                                <div key={v} className={cn('w-3 h-3 rounded-sm', v <= item.value ? 'bg-accent-primary' : 'bg-navy-700')} />
                              ))}
                            </div>
                            <span className="text-navy-200 w-4 text-right text-xs">{item.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'readiness' && (
                <div className="glass-card p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide">
                    Section 2: Implementation Readiness (IRS)
                  </h3>
                  <div className="flex items-center justify-between p-4 bg-navy-800/30 rounded-lg">
                    <div>
                      <p className="text-3xl font-bold text-navy-100">{selectedAnalysis.irs.score.toFixed(1)}%</p>
                      <p className="text-xs text-navy-500">Implementation Readiness Score</p>
                    </div>
                    <span className={cn('px-3 py-1 rounded text-xs font-bold border', getIRSColour(selectedAnalysis.irs.classification))}>
                      {getIRSLabel(selectedAnalysis.irs.classification)}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <Gauge value={selectedAnalysis.initiative.capabilityAlignmentScore} max={100} label="Capability Alignment (20%)" thresholds={[50, 75]} />
                    <Gauge value={selectedAnalysis.initiative.talentCapacityRatio} max={100} label="Talent Capacity (18%)" thresholds={[50, 75]} />
                    <Gauge value={selectedAnalysis.initiative.digitalMaturityIndex} max={100} label="Digital Maturity (15%)" thresholds={[50, 75]} />
                    <Gauge value={selectedAnalysis.initiative.capitalSecurityRatio} max={100} label="Capital Security (20%)" thresholds={[50, 75]} />
                    <Gauge value={selectedAnalysis.initiative.stakeholderAlignmentScore} max={100} label="Stakeholder Alignment (15%)" thresholds={[50, 75]} />
                    <Gauge value={selectedAnalysis.initiative.governanceMaturityScore} max={100} label="Governance Maturity (12%)" thresholds={[50, 75]} />
                  </div>
                </div>
              )}

              {activeSection === 'fragility' && (
                <div className="glass-card p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide">
                    Section 3: Execution Fragility (SEFS)
                  </h3>
                  <div className="flex items-center justify-between p-4 bg-navy-800/30 rounded-lg">
                    <div>
                      <p className="text-3xl font-bold text-navy-100">{selectedAnalysis.sefs.score.toFixed(1)}</p>
                      <p className="text-xs text-navy-500">Fragility Score (0-100)</p>
                    </div>
                    {selectedAnalysis.sefs.isStructuralRisk && (
                      <span className="px-3 py-1 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                        STRUCTURAL RISK
                      </span>
                    )}
                  </div>
                  {/* Fragility heat bar */}
                  <div>
                    <div className="h-4 bg-navy-800 rounded-full overflow-hidden relative">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          selectedAnalysis.sefs.score > 65 ? 'bg-gradient-to-r from-amber-500 to-red-500' :
                          selectedAnalysis.sefs.score > 40 ? 'bg-gradient-to-r from-emerald-500 to-amber-500' :
                          'bg-emerald-500'
                        )}
                        style={{ width: `${selectedAnalysis.sefs.score}%` }}
                      />
                      <div className="absolute top-0 left-[65%] w-0.5 h-full bg-red-500/50" />
                    </div>
                    <p className="text-2xs text-navy-500 mt-1">Threshold at 65 (structural risk)</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    {[
                      { label: 'Critical Path Dependencies', val: selectedAnalysis.sefs.breakdown.criticalPath, weight: '25%' },
                      { label: 'Cross-Functional Intensity', val: selectedAnalysis.sefs.breakdown.crossFunctional, weight: '20%' },
                      { label: 'Cultural Resistance', val: selectedAnalysis.sefs.breakdown.culturalResistance, weight: '20%' },
                      { label: 'Leadership Turnover', val: selectedAnalysis.sefs.breakdown.leadershipTurnover, weight: '15%' },
                      { label: 'Change Fatigue', val: selectedAnalysis.sefs.breakdown.changeFatigue, weight: '20%' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-navy-400 text-xs">{item.label} ({item.weight})</span>
                        <span className="text-navy-200 font-mono text-xs">{item.val.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'capital' && (
                <div className="glass-card p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide">
                    Section 4: Capital Sequencing Stress
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-navy-800/30 rounded-lg text-center">
                      <p className="text-xs text-navy-500">CSRS</p>
                      <p className="text-2xl font-bold text-navy-100">{selectedAnalysis.csrs.score.toFixed(1)}</p>
                    </div>
                    <div className="p-3 bg-navy-800/30 rounded-lg text-center">
                      <p className="text-xs text-navy-500">Liquidity Runway</p>
                      <p className="text-2xl font-bold text-navy-100">{selectedAnalysis.csrs.liquidityRunwayMonths} mo</p>
                    </div>
                    <div className="p-3 bg-navy-800/30 rounded-lg text-center">
                      <p className="text-xs text-navy-500">Capital Buffer</p>
                      <p className="text-xl font-bold text-amber-400">£{formatCurrency(selectedAnalysis.csrs.capitalBufferRequired)}</p>
                    </div>
                    <div className="p-3 bg-navy-800/30 rounded-lg text-center">
                      <p className="text-xs text-navy-500">Delay Risk</p>
                      <p className={cn('text-xl font-bold', selectedAnalysis.csrs.delayTriggered ? 'text-red-400' : 'text-emerald-400')}>
                        {selectedAnalysis.csrs.delayTriggered ? 'TRIGGERED' : 'Clear'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Gauge value={selectedAnalysis.csrs.spendTimingMismatch} max={100} label="Spend Timing Mismatch (40%)" thresholds={[40, 70]} />
                    <Gauge value={selectedAnalysis.csrs.liquidityBufferStress} max={100} label="Liquidity Buffer Stress (30%)" thresholds={[40, 70]} />
                    <Gauge value={selectedAnalysis.csrs.earningsVolatility} max={100} label="Earnings Volatility (30%)" thresholds={[30, 60]} />
                  </div>
                </div>
              )}

              {activeSection === 'drift' && (
                <div className="glass-card p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide">
                    Section 5: Strategic Drift Monitor
                  </h3>
                  <div className="flex items-center justify-between p-4 bg-navy-800/30 rounded-lg">
                    <div>
                      <p className="text-3xl font-bold text-navy-100">{selectedAnalysis.sdi.score.toFixed(1)}%</p>
                      <p className="text-xs text-navy-500">Strategic Drift Index</p>
                    </div>
                    {selectedAnalysis.sdi.boardVisibilityTriggered && (
                      <span className="px-3 py-1 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                        BOARD VISIBILITY
                      </span>
                    )}
                  </div>
                  {/* KPI deviations */}
                  <div className="space-y-2">
                    <p className="text-xs text-navy-500">KPI Performance vs Target</p>
                    {selectedAnalysis.sdi.kpiDeviations.map((kpi, i) => (
                      <div key={i} className="flex items-center justify-between text-sm p-2 bg-navy-800/20 rounded">
                        <span className="text-navy-300 text-xs">{kpi.name}</span>
                        <span className={cn('text-xs font-mono', kpi.deviation > 30 ? 'text-red-400' : kpi.deviation > 15 ? 'text-amber-400' : 'text-emerald-400')}>
                          {kpi.deviation.toFixed(1)}% deviation
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2 bg-navy-800/30 rounded">
                      <p className="text-2xs text-navy-500">Competitor</p>
                      <p className="text-sm font-bold text-navy-200">{selectedAnalysis.sdi.externalThreats.competitorMovement}/10</p>
                    </div>
                    <div className="p-2 bg-navy-800/30 rounded">
                      <p className="text-2xs text-navy-500">Tech Displacement</p>
                      <p className="text-sm font-bold text-navy-200">{selectedAnalysis.sdi.externalThreats.technologyDisplacement}/10</p>
                    </div>
                    <div className="p-2 bg-navy-800/30 rounded">
                      <p className="text-2xs text-navy-500">Regulatory Shift</p>
                      <p className="text-sm font-bold text-navy-200">{selectedAnalysis.sdi.externalThreats.regulatoryShift}/10</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'psu' && (
                <div className="glass-card p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide">
                    Section 6: Probability of Strategic Failure
                  </h3>
                  <div className="p-6 bg-navy-800/30 rounded-lg text-center">
                    <p className="text-5xl font-bold text-navy-100">{selectedAnalysis.psu.failureProbability.toFixed(1)}%</p>
                    <p className="text-sm text-navy-400 mt-1">Probability of Strategic Underperformance</p>
                    <p className="text-xs text-navy-500 mt-2">
                      CI: [{selectedAnalysis.psu.confidenceInterval.lower.toFixed(1)}% – {selectedAnalysis.psu.confidenceInterval.upper.toFixed(1)}%]
                    </p>
                    <div className="mt-3">
                      <PSUBadge band={selectedAnalysis.psu.riskBand} probability={selectedAnalysis.psu.failureProbability} />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'intervention' && (
                <div className="glass-card p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide">
                    Section 7: Strategic Intervention Simulator
                  </h3>
                  <div className="space-y-3">
                    {[
                      { key: 'capitalIncrease', label: 'Capital Increase (£)', max: 5_000_000, step: 100_000, format: true },
                      { key: 'scopeReduction', label: 'Scope Reduction (%)', max: 50, step: 5, format: false },
                      { key: 'phaseRollout', label: 'Phase Rollout (months)', max: 24, step: 3, format: false },
                      { key: 'leadershipSupport', label: 'Leadership Support (0-100)', max: 100, step: 10, format: false },
                      { key: 'capabilityInvestment', label: 'Capability Investment (£)', max: 2_000_000, step: 50_000, format: true },
                    ].map((slider) => (
                      <div key={slider.key}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-navy-400">{slider.label}</span>
                          <span className="text-navy-200 font-mono">
                            {slider.format ? `£${formatCurrency(intervention[slider.key as keyof InterventionScenario])}` : intervention[slider.key as keyof InterventionScenario]}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={slider.max}
                          step={slider.step}
                          value={intervention[slider.key as keyof InterventionScenario]}
                          onChange={(e) => setIntervention((prev) => ({ ...prev, [slider.key]: Number(e.target.value) }))}
                          className="w-full accent-accent-primary"
                        />
                      </div>
                    ))}
                  </div>
                  {interventionResult && (
                    <div className="p-4 bg-accent-primary/10 border border-accent-primary/20 rounded-lg">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs text-navy-400">PSU Change</p>
                          <p className={cn('text-xl font-bold', interventionResult.delta.psuChange < 0 ? 'text-emerald-400' : 'text-red-400')}>
                            {interventionResult.delta.psuChange > 0 ? '+' : ''}{interventionResult.delta.psuChange.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-navy-400">Intervention ROI</p>
                          <p className={cn('text-xl font-bold', interventionResult.delta.roiOfIntervention > 0 ? 'text-emerald-400' : 'text-red-400')}>
                            {interventionResult.delta.roiOfIntervention.toFixed(0)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-navy-400">Stabilisation</p>
                          <p className="text-xl font-bold text-navy-100">{interventionResult.delta.stabilisationMonths} mo</p>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-center text-xs">
                        <div className="p-2 bg-navy-800/50 rounded">
                          <p className="text-navy-500">Before PSU</p>
                          <p className="text-navy-200">{interventionResult.before.psu.failureProbability.toFixed(1)}%</p>
                        </div>
                        <div className="p-2 bg-navy-800/50 rounded">
                          <p className="text-navy-500">After PSU</p>
                          <p className={cn(interventionResult.after.psu.failureProbability < interventionResult.before.psu.failureProbability ? 'text-emerald-400' : 'text-red-400')}>
                            {interventionResult.after.psu.failureProbability.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'board' && (
                <div className="glass-card p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide">
                    Section 8: Board Intelligence View
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-navy-800/30 rounded-lg text-center">
                      <p className="text-xs text-navy-500">Capital at Risk</p>
                      <p className="text-2xl font-bold text-red-400">£{formatCurrency(boardIntel.capitalAtRisk)}</p>
                    </div>
                    <div className="p-4 bg-navy-800/30 rounded-lg text-center">
                      <p className="text-xs text-navy-500">Value Erosion</p>
                      <p className="text-2xl font-bold text-amber-400">£{formatCurrency(boardIntel.probabilityWeightedValueErosion)}</p>
                    </div>
                    <div className="p-4 bg-navy-800/30 rounded-lg text-center">
                      <p className="text-xs text-navy-500">Portfolio PSU</p>
                      <p className={cn('text-2xl font-bold', boardIntel.portfolioPSU > 40 ? 'text-red-400' : 'text-navy-100')}>
                        {boardIntel.portfolioPSU.toFixed(1)}%
                      </p>
                    </div>
                    <div className="p-4 bg-navy-800/30 rounded-lg text-center">
                      <p className="text-xs text-navy-500">Resilience Index</p>
                      <p className={cn('text-2xl font-bold', boardIntel.strategicResilienceIndex > 60 ? 'text-emerald-400' : 'text-amber-400')}>
                        {boardIntel.strategicResilienceIndex.toFixed(1)}
                      </p>
                    </div>
                  </div>
                  {/* Top 3 fragile */}
                  <div>
                    <p className="text-xs text-navy-500 mb-2">Top 3 Fragile Initiatives</p>
                    {boardIntel.top3FragileInitiatives.map((a) => (
                      <div key={a.initiative.id} className="flex items-center justify-between p-3 bg-navy-800/30 rounded-lg mb-2">
                        <div>
                          <span className="text-xs font-mono text-navy-500">{a.initiative.id}</span>
                          <p className="text-sm text-navy-200">{a.initiative.name}</p>
                        </div>
                        <PSUBadge band={a.psu.riskBand} probability={a.psu.failureProbability} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT PANEL — Financial & Predictive */}
            <div className="space-y-4">
              {/* PSU Component Radar (always visible when initiative selected) */}
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-3">
                  PSU Component Analysis
                </h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      { metric: 'SCI', value: (selectedAnalysis.sci.score / 5) * 100, fullMark: 100 },
                      { metric: 'IRS (inv)', value: 100 - selectedAnalysis.irs.score, fullMark: 100 },
                      { metric: 'SEFS', value: selectedAnalysis.sefs.score, fullMark: 100 },
                      { metric: 'CSRS', value: selectedAnalysis.csrs.score, fullMark: 100 },
                      { metric: 'SDI', value: selectedAnalysis.sdi.score, fullMark: 100 },
                    ]}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <PolarRadiusAxis tick={false} domain={[0, 100]} />
                      <Radar dataKey="value" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Capital spend curve */}
              {(activeSection === 'capital' || activeSection === 'overview') && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-3">
                    Capital Spend Curve
                  </h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={selectedAnalysis.initiative.plannedSpendCurve.map((v, i) => ({
                        month: `M${i + 1}`,
                        spend: v,
                        available: selectedAnalysis.initiative.cashFlowAvailability,
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                        <YAxis tickFormatter={(v) => `£${formatCurrency(v)}`} stroke="#64748b" tick={{ fontSize: 10 }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                          formatter={(value) => [`£${formatCurrency(value as number)}`, '']}
                        />
                        <Bar dataKey="spend" fill="#60a5fa" radius={[2, 2, 0, 0]}>
                          {selectedAnalysis.initiative.plannedSpendCurve.map((v, i) => (
                            <Cell key={i} fill={v > selectedAnalysis.initiative.cashFlowAvailability ? '#ef4444' : '#60a5fa'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-2xs text-navy-500 mt-1">Red bars exceed monthly cash flow availability (£{formatCurrency(selectedAnalysis.initiative.cashFlowAvailability)}/mo)</p>
                </div>
              )}

              {/* Drift chart */}
              {activeSection === 'drift' && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-3">
                    KPI Target vs Actual
                  </h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={selectedAnalysis.initiative.intendedKPIs.map((kpi) => ({
                          name: kpi.name.length > 15 ? kpi.name.substring(0, 15) + '...' : kpi.name,
                          target: kpi.target,
                          actual: kpi.actual,
                        }))}
                        margin={{ left: 10, right: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 9 }} />
                        <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                        <Bar dataKey="target" fill="#334155" name="Target" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="actual" fill="#60a5fa" name="Actual" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* PSU breakdown chart */}
              {activeSection === 'psu' && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-3">
                    PSU Component Weights
                  </h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'SCI (15%)', value: (selectedAnalysis.sci.score / 5) * 100 * 0.15, fill: '#f59e0b' },
                        { name: 'IRS (25%)', value: (100 - selectedAnalysis.irs.score) * 0.25, fill: '#ef4444' },
                        { name: 'SEFS (25%)', value: selectedAnalysis.sefs.score * 0.25, fill: '#ef4444' },
                        { name: 'CSRS (20%)', value: selectedAnalysis.csrs.score * 0.20, fill: '#f59e0b' },
                        { name: 'SDI (15%)', value: selectedAnalysis.sdi.score * 0.15, fill: '#60a5fa' },
                      ]} margin={{ left: 10, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 9 }} />
                        <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {[0,1,2,3,4].map((i) => (
                            <Cell key={i} fill={['#f59e0b', '#ef4444', '#ef4444', '#f59e0b', '#60a5fa'][i]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Intervention comparison */}
              {activeSection === 'intervention' && interventionResult && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-3">
                    Before vs After Comparison
                  </h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={[
                        { metric: 'SCI', before: (interventionResult.before.sci.score / 5) * 100, after: (interventionResult.after.sci.score / 5) * 100 },
                        { metric: 'IRS (inv)', before: 100 - interventionResult.before.irs.score, after: 100 - interventionResult.after.irs.score },
                        { metric: 'SEFS', before: interventionResult.before.sefs.score, after: interventionResult.after.sefs.score },
                        { metric: 'CSRS', before: interventionResult.before.csrs.score, after: interventionResult.after.csrs.score },
                        { metric: 'SDI', before: interventionResult.before.sdi.score, after: interventionResult.after.sdi.score },
                      ]}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <PolarRadiusAxis tick={false} domain={[0, 100]} />
                        <Radar dataKey="before" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} name="Before" />
                        <Radar dataKey="after" stroke="#10b981" fill="#10b981" fillOpacity={0.15} name="After" />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center gap-6 text-xs mt-2">
                    <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-500 inline-block" /> Before</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-500 inline-block" /> After</span>
                  </div>
                </div>
              )}

              {/* Board view — portfolio PSU chart */}
              {activeSection === 'board' && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-3">
                    Initiative PSU Distribution
                  </h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analyses.sort((a, b) => b.psu.failureProbability - a.psu.failureProbability).map((a) => ({
                          id: a.initiative.id,
                          psu: a.psu.failureProbability,
                          band: a.psu.riskBand,
                        }))}
                        margin={{ left: 10, right: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="id" stroke="#64748b" tick={{ fontSize: 10 }} />
                        <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                        <Bar dataKey="psu" radius={[4, 4, 0, 0]}>
                          {analyses.sort((a, b) => b.psu.failureProbability - a.psu.failureProbability).map((a, i) => {
                            const bandColours: Record<PSURiskBand, string> = { green: '#10b981', amber: '#f59e0b', red: '#ef4444', black: '#1e293b' };
                            return <Cell key={i} fill={bandColours[a.psu.riskBand]} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Readiness radar */}
              {activeSection === 'readiness' && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-3">
                    Readiness Radar
                  </h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={[
                        { metric: 'Capability', value: selectedAnalysis.initiative.capabilityAlignmentScore },
                        { metric: 'Talent', value: selectedAnalysis.initiative.talentCapacityRatio },
                        { metric: 'Digital', value: selectedAnalysis.initiative.digitalMaturityIndex },
                        { metric: 'Capital', value: selectedAnalysis.initiative.capitalSecurityRatio },
                        { metric: 'Stakeholder', value: selectedAnalysis.initiative.stakeholderAlignmentScore },
                        { metric: 'Governance', value: selectedAnalysis.initiative.governanceMaturityScore },
                      ]}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <PolarRadiusAxis tick={false} domain={[0, 100]} />
                        <Radar dataKey="value" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {!selectedAnalysis && (
        <div className="glass-card p-12 text-center">
          <p className="text-navy-400 text-lg mb-2">Select an initiative above to view its transformation risk analysis</p>
          <p className="text-navy-500 text-sm">Initiatives ranked by Probability of Strategic Underperformance (PSU)</p>
        </div>
      )}
    </div>
  );
}
