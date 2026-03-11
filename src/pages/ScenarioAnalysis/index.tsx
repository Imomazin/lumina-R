import { useState } from 'react';
import { PageHeader, SectionCard } from '../../components';
import { useData } from '../../context/DataContext';
import { risks } from '../../data';
import { cn } from '../../utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ScenarioModifier {
  probabilityMultiplier: number;
  impactMultiplier: number;
}

interface PrebuiltScenario {
  id: string;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  modifier: ScenarioModifier;
}

interface CustomScenario {
  name: string;
  description: string;
  selectedRiskIds: string[];
  probabilityMultiplier: number;
  impactMultiplier: number;
  assumptions: string;
}

// ---------------------------------------------------------------------------
// Pre-built scenarios
// ---------------------------------------------------------------------------

const prebuiltScenarios: PrebuiltScenario[] = [
  {
    id: 'base',
    name: 'Base Case',
    description: 'Current risk landscape with no adjustments. Reflects the existing assessment without modifications.',
    color: 'text-accent-primary',
    bgColor: 'bg-accent-primary/15',
    borderColor: 'border-accent-primary/40',
    modifier: { probabilityMultiplier: 1.0, impactMultiplier: 1.0 },
  },
  {
    id: 'optimistic',
    name: 'Optimistic',
    description: 'Favorable market conditions, strong controls, and reduced threat landscape.',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/15',
    borderColor: 'border-emerald-500/40',
    modifier: { probabilityMultiplier: 0.7, impactMultiplier: 0.8 },
  },
  {
    id: 'pessimistic',
    name: 'Pessimistic',
    description: 'Adverse conditions with heightened threat activity and weakened control environment.',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/15',
    borderColor: 'border-amber-500/40',
    modifier: { probabilityMultiplier: 1.4, impactMultiplier: 1.3 },
  },
  {
    id: 'extreme',
    name: 'Extreme / Stress',
    description: 'Severe stress scenario combining systemic failures, geopolitical crisis, and coordinated attacks.',
    color: 'text-red-400',
    bgColor: 'bg-red-500/15',
    borderColor: 'border-red-500/40',
    modifier: { probabilityMultiplier: 2.0, impactMultiplier: 2.5 },
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const APPETITE_THRESHOLD = 15; // Risk score at which appetite is breached

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

const formatCurrency = (value: number) => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
};

/** Simple EMV: probability (1-5 mapped to %) * impact mapped to $ */
const probabilityToPercent = (p: number) => clamp(p, 1, 5) * 20; // 1->20%, 5->100%
const impactToDollars = (i: number) => clamp(i, 1, 5) * 250_000; // 1->250K, 5->1.25M
const computeEMV = (prob: number, impact: number) =>
  (probabilityToPercent(prob) / 100) * impactToDollars(impact);

const getSeverityLabel = (score: number): string => {
  if (score >= 20) return 'Critical';
  if (score >= 15) return 'High';
  if (score >= 8) return 'Medium';
  return 'Low';
};

const getSeverityColor = (score: number) => {
  if (score >= 20) return 'text-red-400';
  if (score >= 15) return 'text-amber-400';
  if (score >= 8) return 'text-yellow-300';
  return 'text-emerald-400';
};

const getSeverityBg = (score: number) => {
  if (score >= 20) return 'bg-red-500/15';
  if (score >= 15) return 'bg-amber-500/15';
  if (score >= 8) return 'bg-yellow-500/15';
  return 'bg-emerald-500/15';
};

const getChangeColor = (delta: number) => {
  if (delta > 0) return 'text-red-400';
  if (delta < 0) return 'text-emerald-400';
  return 'text-navy-400';
};

const getChangeArrow = (delta: number) => {
  if (delta > 0) return '+';
  if (delta < 0) return '';
  return '';
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ScenarioAnalysis() {
  const { isDataActive } = useData();
  const activeRisks = isDataActive ? risks : [];

  // Pre-built scenario modifiers (editable)
  const [scenarioModifiers, setScenarioModifiers] = useState<Record<string, ScenarioModifier>>(
    Object.fromEntries(prebuiltScenarios.map((s) => [s.id, { ...s.modifier }]))
  );

  // Active tab
  const [activeTab, setActiveTab] = useState<'prebuilt' | 'custom'>('prebuilt');

  // Custom scenario builder state
  const [customScenario, setCustomScenario] = useState<CustomScenario>({
    name: '',
    description: '',
    selectedRiskIds: [],
    probabilityMultiplier: 1.0,
    impactMultiplier: 1.0,
    assumptions: '',
  });

  // Whether the custom scenario has been "applied"
  const [customApplied, setCustomApplied] = useState(false);

  // ---------------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------------

  /** Compute scenario results for each prebuilt scenario. */
  const prebuiltResults = prebuiltScenarios.map((scenario) => {
    const mod = scenarioModifiers[scenario.id];
    const riskResults = activeRisks.map((risk) => {
      const modProb = clamp(risk.probability * mod.probabilityMultiplier, 1, 5);
      const modImpact = clamp(risk.impact * mod.impactMultiplier, 1, 5);
      const origScore = risk.riskScore;
      const modScore = Math.round(modProb * modImpact);
      const origEMV = computeEMV(risk.probability, risk.impact);
      const modEMV = computeEMV(modProb, modImpact);
      return { risk, modProb, modImpact, origScore, modScore, origEMV, modEMV, deltaEMV: modEMV - origEMV };
    });
    const totalOrigEMV = riskResults.reduce((s, r) => s + r.origEMV, 0);
    const totalModEMV = riskResults.reduce((s, r) => s + r.modEMV, 0);
    const breachCount = riskResults.filter((r) => r.modScore >= APPETITE_THRESHOLD).length;
    return { scenario, riskResults, totalOrigEMV, totalModEMV, breachCount };
  });

  /** Custom scenario results (only applied risks). */
  const customResults = (() => {
    const selectedRisks = activeRisks.filter((r) => customScenario.selectedRiskIds.includes(r.id));
    return selectedRisks.map((risk) => {
      const modProb = clamp(risk.probability * customScenario.probabilityMultiplier, 1, 5);
      const modImpact = clamp(risk.impact * customScenario.impactMultiplier, 1, 5);
      const origScore = risk.riskScore;
      const modScore = Math.round(modProb * modImpact);
      const origEMV = computeEMV(risk.probability, risk.impact);
      const modEMV = computeEMV(modProb, modImpact);
      return { risk, modProb, modImpact, origScore, modScore, origEMV, modEMV, deltaEMV: modEMV - origEMV };
    });
  })();

  const customTotalOrigEMV = customResults.reduce((s, r) => s + r.origEMV, 0);
  const customTotalModEMV = customResults.reduce((s, r) => s + r.modEMV, 0);
  const customBreachCount = customResults.filter((r) => r.modScore >= APPETITE_THRESHOLD).length;

  // Chart data: max bar value for scaling
  const maxExposure = Math.max(...prebuiltResults.map((r) => r.totalModEMV), 1);

  // ---------------------------------------------------------------------------
  // Key findings (auto-generated)
  // ---------------------------------------------------------------------------

  const generateFindings = () => {
    if (activeRisks.length === 0) return [];
    const findings: string[] = [];

    // Most affected risk across all scenarios
    const extremeResult = prebuiltResults.find((r) => r.scenario.id === 'extreme');
    if (extremeResult) {
      const worst = [...extremeResult.riskResults].sort((a, b) => b.deltaEMV - a.deltaEMV)[0];
      if (worst) {
        findings.push(
          `Under the Extreme/Stress scenario, "${worst.risk.title}" shows the largest exposure increase of ${formatCurrency(worst.deltaEMV)}, moving from a score of ${worst.origScore} to ${worst.modScore}.`
        );
      }
    }

    // Total exposure change between base and extreme
    const baseResult = prebuiltResults.find((r) => r.scenario.id === 'base');
    if (baseResult && extremeResult) {
      const delta = extremeResult.totalModEMV - baseResult.totalModEMV;
      findings.push(
        `Total portfolio exposure increases by ${formatCurrency(delta)} (${((delta / (baseResult.totalModEMV || 1)) * 100).toFixed(0)}%) from Base Case to Extreme scenario.`
      );
    }

    // Appetite breaches
    const pessimisticResult = prebuiltResults.find((r) => r.scenario.id === 'pessimistic');
    if (pessimisticResult && pessimisticResult.breachCount > 0) {
      findings.push(
        `The Pessimistic scenario causes ${pessimisticResult.breachCount} risk${pessimisticResult.breachCount > 1 ? 's' : ''} to breach the appetite threshold (score >= ${APPETITE_THRESHOLD}).`
      );
    }
    if (extremeResult && extremeResult.breachCount > 0) {
      findings.push(
        `Under Extreme stress, ${extremeResult.breachCount} of ${activeRisks.length} risks breach appetite thresholds, requiring immediate executive attention.`
      );
    }

    // Optimistic upside
    const optimisticResult = prebuiltResults.find((r) => r.scenario.id === 'optimistic');
    if (optimisticResult && baseResult) {
      const saving = baseResult.totalModEMV - optimisticResult.totalModEMV;
      findings.push(
        `The Optimistic scenario reduces total exposure by ${formatCurrency(saving)}, demonstrating the value of strengthened controls and favorable conditions.`
      );
    }

    return findings;
  };

  const findings = generateFindings();

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const updateModifier = (scenarioId: string, field: keyof ScenarioModifier, value: number) => {
    setScenarioModifiers((prev) => ({
      ...prev,
      [scenarioId]: { ...prev[scenarioId], [field]: value },
    }));
  };

  const toggleCustomRisk = (riskId: string) => {
    setCustomScenario((prev) => ({
      ...prev,
      selectedRiskIds: prev.selectedRiskIds.includes(riskId)
        ? prev.selectedRiskIds.filter((id) => id !== riskId)
        : [...prev.selectedRiskIds, riskId],
    }));
    setCustomApplied(false);
  };

  const selectAllCustomRisks = () => {
    setCustomScenario((prev) => ({
      ...prev,
      selectedRiskIds: prev.selectedRiskIds.length === activeRisks.length ? [] : activeRisks.map((r) => r.id),
    }));
    setCustomApplied(false);
  };

  const handleExportCSV = () => {
    const headers = [
      'Scenario',
      'Risk ID',
      'Risk Title',
      'Category',
      'Original Score',
      'Modified Score',
      'Score Change',
      'Original EMV',
      'Modified EMV',
      'EMV Change',
      'Severity',
    ];

    const rows: string[][] = [];
    prebuiltResults.forEach((sr) => {
      sr.riskResults.forEach((rr) => {
        rows.push([
          sr.scenario.name,
          rr.risk.id,
          `"${rr.risk.title}"`,
          rr.risk.category,
          String(rr.origScore),
          String(rr.modScore),
          String(rr.modScore - rr.origScore),
          formatCurrency(rr.origEMV),
          formatCurrency(rr.modEMV),
          formatCurrency(rr.deltaEMV),
          getSeverityLabel(rr.modScore),
        ]);
      });
    });

    if (customApplied && customResults.length > 0) {
      customResults.forEach((rr) => {
        rows.push([
          customScenario.name || 'Custom',
          rr.risk.id,
          `"${rr.risk.title}"`,
          rr.risk.category,
          String(rr.origScore),
          String(rr.modScore),
          String(rr.modScore - rr.origScore),
          formatCurrency(rr.origEMV),
          formatCurrency(rr.modEMV),
          formatCurrency(rr.deltaEMV),
          getSeverityLabel(rr.modScore),
        ]);
      });
    }

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scenario-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------------------------------------------------------------------------
  // Render: empty state
  // ---------------------------------------------------------------------------

  if (!isDataActive) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="Scenario Analysis"
          subtitle="Model risk scenarios and compare potential impact across your portfolio"
        />
        <SectionCard>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-navy-800/50 flex items-center justify-center mb-4">
              <span className="text-2xl text-navy-500">S</span>
            </div>
            <h3 className="text-lg font-semibold text-navy-200 mb-2">No Data Available</h3>
            <p className="text-sm text-navy-500 max-w-md">
              No data available. Upload a dataset or connect your AI Advisor to begin scenario analysis.
            </p>
          </div>
        </SectionCard>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: main page
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Scenario Analysis"
        subtitle="Model risk scenarios and compare potential impact across your portfolio"
        actions={
          <div className="flex items-center gap-3">
            <button className="btn-secondary" onClick={handleExportCSV}>
              Export CSV
            </button>
          </div>
        }
      />

      {/* Tab Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('prebuilt')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            activeTab === 'prebuilt'
              ? 'bg-accent-primary text-white'
              : 'bg-navy-800/50 text-navy-400 hover:text-navy-200 hover:bg-navy-800'
          )}
        >
          Pre-built Scenarios
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            activeTab === 'custom'
              ? 'bg-accent-primary text-white'
              : 'bg-navy-800/50 text-navy-400 hover:text-navy-200 hover:bg-navy-800'
          )}
        >
          Custom Scenario Builder
        </button>
      </div>

      {/* ================================================================== */}
      {/* PRE-BUILT SCENARIOS TAB                                             */}
      {/* ================================================================== */}
      {activeTab === 'prebuilt' && (
        <>
          {/* -------------------------------------------------------------- */}
          {/* 1. Scenario Definition Panel                                    */}
          {/* -------------------------------------------------------------- */}
          <SectionCard title="Scenario Definitions" subtitle="Adjust probability and impact multipliers for each scenario">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {prebuiltScenarios.map((scenario) => {
                const mod = scenarioModifiers[scenario.id];
                return (
                  <div
                    key={scenario.id}
                    className={cn(
                      'p-4 rounded-xl border transition-all',
                      scenario.bgColor,
                      scenario.borderColor
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn('text-sm font-bold', scenario.color)}>{scenario.name}</span>
                    </div>
                    <p className="text-xs text-navy-400 mb-4 leading-relaxed">{scenario.description}</p>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs text-navy-500">Probability</label>
                          <span className={cn('text-xs font-bold', scenario.color)}>{mod.probabilityMultiplier.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="3.0"
                          step="0.1"
                          value={mod.probabilityMultiplier}
                          onChange={(e) => updateModifier(scenario.id, 'probabilityMultiplier', parseFloat(e.target.value))}
                          className="w-full h-1.5 rounded-full appearance-none bg-navy-700 cursor-pointer accent-current"
                          style={{ accentColor: 'currentColor' }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs text-navy-500">Impact</label>
                          <span className={cn('text-xs font-bold', scenario.color)}>{mod.impactMultiplier.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="3.0"
                          step="0.1"
                          value={mod.impactMultiplier}
                          onChange={(e) => updateModifier(scenario.id, 'impactMultiplier', parseFloat(e.target.value))}
                          className="w-full h-1.5 rounded-full appearance-none bg-navy-700 cursor-pointer accent-current"
                          style={{ accentColor: 'currentColor' }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* -------------------------------------------------------------- */}
          {/* 2. Scenario Comparison Chart (div-based)                        */}
          {/* -------------------------------------------------------------- */}
          <SectionCard title="Scenario Comparison" subtitle="Total portfolio exposure across scenarios">
            <div className="space-y-4">
              {prebuiltResults.map((sr) => {
                const pct = maxExposure > 0 ? (sr.totalModEMV / maxExposure) * 100 : 0;
                const breachPct = maxExposure > 0 ? (APPETITE_THRESHOLD * activeRisks.length * 50_000 / maxExposure) * 100 : 0; // approximate
                return (
                  <div key={sr.scenario.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={cn('text-sm font-medium', sr.scenario.color)}>{sr.scenario.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-navy-500">
                          {sr.breachCount} breach{sr.breachCount !== 1 ? 'es' : ''}
                        </span>
                        <span className="text-sm font-bold text-navy-200">{formatCurrency(sr.totalModEMV)}</span>
                      </div>
                    </div>
                    <div className="relative h-8 rounded-lg bg-navy-800/50 overflow-hidden">
                      <div
                        className={cn(
                          'absolute inset-y-0 left-0 rounded-lg transition-all duration-500',
                          sr.scenario.id === 'base' && 'bg-accent-primary/60',
                          sr.scenario.id === 'optimistic' && 'bg-emerald-500/60',
                          sr.scenario.id === 'pessimistic' && 'bg-amber-500/60',
                          sr.scenario.id === 'extreme' && 'bg-red-500/60'
                        )}
                        style={{ width: `${clamp(pct, 0, 100)}%` }}
                      />
                      {/* Appetite threshold line */}
                      {breachPct > 0 && breachPct < 100 && (
                        <div
                          className="absolute inset-y-0 w-0.5 bg-red-400/70"
                          style={{ left: `${clamp(breachPct, 0, 100)}%` }}
                          title="Appetite threshold"
                        />
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Legend */}
              <div className="flex items-center gap-4 pt-2 border-t border-navy-700/50">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-red-400/70" />
                  <span className="text-xs text-navy-500">Appetite Threshold</span>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* -------------------------------------------------------------- */}
          {/* 3. Impact Analysis Table                                        */}
          {/* -------------------------------------------------------------- */}
          <SectionCard title="Impact Analysis" subtitle="Risk-by-risk comparison across all scenarios" noPadding>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-navy-700">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-navy-500 sticky left-0 bg-navy-900/80 backdrop-blur-sm z-10">Risk</th>
                    <th className="text-center py-3 px-3 text-xs font-semibold text-navy-500">Original</th>
                    {prebuiltScenarios.map((s) => (
                      <th key={s.id} className={cn('text-center py-3 px-3 text-xs font-semibold', s.color)}>
                        {s.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeRisks.map((risk, idx) => (
                    <tr key={risk.id} className={cn('border-b border-navy-800/50', idx % 2 === 0 && 'bg-navy-800/10')}>
                      <td className="py-3 px-4 sticky left-0 bg-navy-900/80 backdrop-blur-sm z-10">
                        <div>
                          <p className="text-sm font-medium text-navy-200">{risk.title}</p>
                          <p className="text-xs text-navy-500">{risk.id} &middot; {risk.category}</p>
                        </div>
                      </td>
                      <td className="text-center py-3 px-3">
                        <div className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold', getSeverityBg(risk.riskScore), getSeverityColor(risk.riskScore))}>
                          {risk.riskScore}
                        </div>
                        <p className="text-xs text-navy-500 mt-0.5">{formatCurrency(computeEMV(risk.probability, risk.impact))}</p>
                      </td>
                      {prebuiltResults.map((sr) => {
                        const rr = sr.riskResults[idx];
                        const delta = rr.modScore - rr.origScore;
                        return (
                          <td key={sr.scenario.id} className="text-center py-3 px-3">
                            <div className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold', getSeverityBg(rr.modScore), getSeverityColor(rr.modScore))}>
                              {rr.modScore}
                              {delta !== 0 && (
                                <span className={cn('text-2xs', getChangeColor(delta))}>
                                  ({getChangeArrow(delta)}{delta})
                                </span>
                              )}
                            </div>
                            <p className={cn('text-xs mt-0.5', getChangeColor(rr.deltaEMV))}>
                              {rr.deltaEMV !== 0 ? `${getChangeArrow(rr.deltaEMV)}${formatCurrency(Math.abs(rr.deltaEMV))}` : '--'}
                            </p>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {/* Totals row */}
                  <tr className="border-t-2 border-navy-600">
                    <td className="py-3 px-4 sticky left-0 bg-navy-900/80 backdrop-blur-sm z-10">
                      <span className="text-sm font-bold text-navy-200">Total Exposure</span>
                    </td>
                    <td className="text-center py-3 px-3">
                      <span className="text-sm font-bold text-navy-200">{formatCurrency(prebuiltResults[0]?.totalOrigEMV ?? 0)}</span>
                    </td>
                    {prebuiltResults.map((sr) => {
                      const delta = sr.totalModEMV - sr.totalOrigEMV;
                      return (
                        <td key={sr.scenario.id} className="text-center py-3 px-3">
                          <span className={cn('text-sm font-bold', sr.scenario.color)}>{formatCurrency(sr.totalModEMV)}</span>
                          {delta !== 0 && (
                            <p className={cn('text-xs', getChangeColor(delta))}>
                              {getChangeArrow(delta)}{formatCurrency(Math.abs(delta))}
                            </p>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* -------------------------------------------------------------- */}
          {/* 4. Key Findings                                                 */}
          {/* -------------------------------------------------------------- */}
          <SectionCard title="Key Findings" subtitle="Auto-generated analysis summary">
            {findings.length > 0 ? (
              <div className="space-y-3">
                {findings.map((finding, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-navy-800/30 border border-navy-700/50">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-accent-primary">{idx + 1}</span>
                    </div>
                    <p className="text-sm text-navy-300 leading-relaxed">{finding}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-navy-500">No findings to display.</p>
            )}
          </SectionCard>
        </>
      )}

      {/* ================================================================== */}
      {/* CUSTOM SCENARIO BUILDER TAB                                        */}
      {/* ================================================================== */}
      {activeTab === 'custom' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Builder Panel */}
            <div className="space-y-6">
              <SectionCard title="Scenario Builder" subtitle="Define a custom scenario">
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="text-xs text-navy-500 mb-1 block">Scenario Name</label>
                    <input
                      type="text"
                      value={customScenario.name}
                      onChange={(e) => { setCustomScenario((p) => ({ ...p, name: e.target.value })); setCustomApplied(false); }}
                      placeholder="e.g. Cyber Incident Wave"
                      className="input w-full"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs text-navy-500 mb-1 block">Description</label>
                    <textarea
                      value={customScenario.description}
                      onChange={(e) => { setCustomScenario((p) => ({ ...p, description: e.target.value })); setCustomApplied(false); }}
                      placeholder="Describe the scenario context and rationale..."
                      rows={3}
                      className="input w-full resize-none"
                    />
                  </div>

                  {/* Probability Multiplier */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-navy-500">Probability Multiplier</label>
                      <span className="text-xs font-bold text-accent-primary">{customScenario.probabilityMultiplier.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.1"
                      value={customScenario.probabilityMultiplier}
                      onChange={(e) => { setCustomScenario((p) => ({ ...p, probabilityMultiplier: parseFloat(e.target.value) })); setCustomApplied(false); }}
                      className="w-full h-1.5 rounded-full appearance-none bg-navy-700 cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-navy-600 mt-0.5">
                      <span>0.5x</span>
                      <span>1.0x</span>
                      <span>2.0x</span>
                      <span>3.0x</span>
                    </div>
                  </div>

                  {/* Impact Multiplier */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-navy-500">Impact Multiplier</label>
                      <span className="text-xs font-bold text-accent-primary">{customScenario.impactMultiplier.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.1"
                      value={customScenario.impactMultiplier}
                      onChange={(e) => { setCustomScenario((p) => ({ ...p, impactMultiplier: parseFloat(e.target.value) })); setCustomApplied(false); }}
                      className="w-full h-1.5 rounded-full appearance-none bg-navy-700 cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-navy-600 mt-0.5">
                      <span>0.5x</span>
                      <span>1.0x</span>
                      <span>2.0x</span>
                      <span>3.0x</span>
                    </div>
                  </div>

                  {/* Assumptions */}
                  <div>
                    <label className="text-xs text-navy-500 mb-1 block">Assumptions</label>
                    <textarea
                      value={customScenario.assumptions}
                      onChange={(e) => { setCustomScenario((p) => ({ ...p, assumptions: e.target.value })); setCustomApplied(false); }}
                      placeholder="List key assumptions underpinning this scenario..."
                      rows={3}
                      className="input w-full resize-none"
                    />
                  </div>

                  <button
                    onClick={() => setCustomApplied(true)}
                    disabled={customScenario.selectedRiskIds.length === 0 || !customScenario.name.trim()}
                    className={cn(
                      'btn-primary w-full',
                      (customScenario.selectedRiskIds.length === 0 || !customScenario.name.trim()) && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    Apply Scenario
                  </button>
                </div>
              </SectionCard>

              {/* Risk Selection */}
              <SectionCard title="Risk Selection" subtitle="Select risks to include in scenario">
                <div className="space-y-2">
                  <button
                    onClick={selectAllCustomRisks}
                    className="text-xs text-accent-primary hover:underline mb-2"
                  >
                    {customScenario.selectedRiskIds.length === activeRisks.length ? 'Deselect All' : 'Select All'}
                  </button>
                  {activeRisks.map((risk) => (
                    <button
                      key={risk.id}
                      onClick={() => toggleCustomRisk(risk.id)}
                      className={cn(
                        'w-full p-3 rounded-lg text-left transition-all border',
                        customScenario.selectedRiskIds.includes(risk.id)
                          ? 'bg-accent-primary/10 border-accent-primary'
                          : 'bg-navy-800/30 border-navy-700/50 hover:border-navy-600'
                      )}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-medium text-navy-200">{risk.title}</span>
                        {customScenario.selectedRiskIds.includes(risk.id) && (
                          <span className="w-2 h-2 rounded-full bg-accent-primary" />
                        )}
                      </div>
                      <div className="flex gap-3 text-xs text-navy-500">
                        <span>{risk.id}</span>
                        <span>Score: {risk.riskScore}</span>
                        <span>{risk.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </SectionCard>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              {!customApplied ? (
                <SectionCard>
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-navy-800/50 flex items-center justify-center mb-4">
                      <span className="text-2xl text-navy-500">S</span>
                    </div>
                    <h3 className="text-lg font-semibold text-navy-200 mb-2">Build Your Scenario</h3>
                    <p className="text-sm text-navy-500 max-w-md">
                      Define a scenario name, select risks to include, set multipliers, and click "Apply Scenario" to see the impact analysis.
                    </p>
                  </div>
                </SectionCard>
              ) : (
                <>
                  {/* Summary metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="glass-card p-4">
                      <p className="text-xs text-navy-500 mb-1">Risks Selected</p>
                      <p className="text-2xl font-bold text-navy-100">{customResults.length}</p>
                    </div>
                    <div className="glass-card p-4">
                      <p className="text-xs text-navy-500 mb-1">Original Exposure</p>
                      <p className="text-xl font-bold text-navy-100">{formatCurrency(customTotalOrigEMV)}</p>
                    </div>
                    <div className="glass-card p-4">
                      <p className="text-xs text-navy-500 mb-1">Modified Exposure</p>
                      <p className={cn('text-xl font-bold', customTotalModEMV > customTotalOrigEMV ? 'text-red-400' : customTotalModEMV < customTotalOrigEMV ? 'text-emerald-400' : 'text-navy-100')}>
                        {formatCurrency(customTotalModEMV)}
                      </p>
                    </div>
                    <div className="glass-card p-4">
                      <p className="text-xs text-navy-500 mb-1">Appetite Breaches</p>
                      <p className={cn('text-2xl font-bold', customBreachCount > 0 ? 'text-red-400' : 'text-emerald-400')}>
                        {customBreachCount}
                      </p>
                    </div>
                  </div>

                  {/* Scenario Bar Comparison (custom vs base) */}
                  <SectionCard title="Exposure Comparison" subtitle={`${customScenario.name} vs Base Case`}>
                    <div className="space-y-4">
                      {/* Base */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-accent-primary">Base Case</span>
                          <span className="text-sm font-bold text-navy-200">{formatCurrency(customTotalOrigEMV)}</span>
                        </div>
                        <div className="relative h-8 rounded-lg bg-navy-800/50 overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 rounded-lg bg-accent-primary/60 transition-all duration-500"
                            style={{ width: `${customTotalOrigEMV > 0 ? clamp((customTotalOrigEMV / Math.max(customTotalOrigEMV, customTotalModEMV)) * 100, 0, 100) : 0}%` }}
                          />
                        </div>
                      </div>
                      {/* Custom */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-amber-400">{customScenario.name}</span>
                          <span className="text-sm font-bold text-navy-200">{formatCurrency(customTotalModEMV)}</span>
                        </div>
                        <div className="relative h-8 rounded-lg bg-navy-800/50 overflow-hidden">
                          <div
                            className={cn(
                              'absolute inset-y-0 left-0 rounded-lg transition-all duration-500',
                              customTotalModEMV > customTotalOrigEMV ? 'bg-red-500/60' : 'bg-emerald-500/60'
                            )}
                            style={{ width: `${customTotalModEMV > 0 ? clamp((customTotalModEMV / Math.max(customTotalOrigEMV, customTotalModEMV)) * 100, 0, 100) : 0}%` }}
                          />
                        </div>
                      </div>
                      {/* Delta */}
                      <div className="pt-2 border-t border-navy-700/50 flex items-center justify-between">
                        <span className="text-xs text-navy-500">Change in Exposure</span>
                        <span className={cn('text-sm font-bold', getChangeColor(customTotalModEMV - customTotalOrigEMV))}>
                          {getChangeArrow(customTotalModEMV - customTotalOrigEMV)}{formatCurrency(Math.abs(customTotalModEMV - customTotalOrigEMV))}
                          {customTotalOrigEMV > 0 && (
                            <span className="text-xs text-navy-500 ml-1">
                              ({customTotalModEMV > customTotalOrigEMV ? '+' : ''}{(((customTotalModEMV - customTotalOrigEMV) / customTotalOrigEMV) * 100).toFixed(0)}%)
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </SectionCard>

                  {/* Custom Scenario Impact Table */}
                  <SectionCard title="Detailed Impact Analysis" subtitle={`Risk impact under "${customScenario.name}"`} noPadding>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-navy-700">
                            <th className="text-left py-3 px-4 text-xs font-semibold text-navy-500">Risk</th>
                            <th className="text-center py-3 px-3 text-xs font-semibold text-navy-500">Original Score</th>
                            <th className="text-center py-3 px-3 text-xs font-semibold text-navy-500">Modified Score</th>
                            <th className="text-center py-3 px-3 text-xs font-semibold text-navy-500">Score Change</th>
                            <th className="text-right py-3 px-3 text-xs font-semibold text-navy-500">Original EMV</th>
                            <th className="text-right py-3 px-3 text-xs font-semibold text-navy-500">Modified EMV</th>
                            <th className="text-right py-3 px-4 text-xs font-semibold text-navy-500">EMV Change</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customResults.map((rr, idx) => {
                            const delta = rr.modScore - rr.origScore;
                            return (
                              <tr key={rr.risk.id} className={cn('border-b border-navy-800/50', idx % 2 === 0 && 'bg-navy-800/10')}>
                                <td className="py-3 px-4">
                                  <p className="text-sm font-medium text-navy-200">{rr.risk.title}</p>
                                  <p className="text-xs text-navy-500">{rr.risk.id} &middot; {rr.risk.category}</p>
                                </td>
                                <td className="text-center py-3 px-3">
                                  <span className={cn('inline-block px-2 py-0.5 rounded text-xs font-bold', getSeverityBg(rr.origScore), getSeverityColor(rr.origScore))}>
                                    {rr.origScore}
                                  </span>
                                </td>
                                <td className="text-center py-3 px-3">
                                  <span className={cn('inline-block px-2 py-0.5 rounded text-xs font-bold', getSeverityBg(rr.modScore), getSeverityColor(rr.modScore))}>
                                    {rr.modScore}
                                  </span>
                                </td>
                                <td className="text-center py-3 px-3">
                                  <span className={cn('text-sm font-bold', getChangeColor(delta))}>
                                    {delta === 0 ? '--' : `${getChangeArrow(delta)}${Math.abs(delta)}`}
                                  </span>
                                </td>
                                <td className="text-right py-3 px-3 text-sm text-navy-300">{formatCurrency(rr.origEMV)}</td>
                                <td className="text-right py-3 px-3 text-sm text-navy-300">{formatCurrency(rr.modEMV)}</td>
                                <td className="text-right py-3 px-4">
                                  <span className={cn('text-sm font-bold', getChangeColor(rr.deltaEMV))}>
                                    {rr.deltaEMV === 0 ? '--' : `${getChangeArrow(rr.deltaEMV)}${formatCurrency(Math.abs(rr.deltaEMV))}`}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                          {/* Totals */}
                          <tr className="border-t-2 border-navy-600">
                            <td className="py-3 px-4" colSpan={4}>
                              <span className="text-sm font-bold text-navy-200">Total</span>
                            </td>
                            <td className="text-right py-3 px-3 text-sm font-bold text-navy-200">{formatCurrency(customTotalOrigEMV)}</td>
                            <td className="text-right py-3 px-3 text-sm font-bold text-navy-200">{formatCurrency(customTotalModEMV)}</td>
                            <td className="text-right py-3 px-4">
                              <span className={cn('text-sm font-bold', getChangeColor(customTotalModEMV - customTotalOrigEMV))}>
                                {customTotalModEMV - customTotalOrigEMV === 0
                                  ? '--'
                                  : `${getChangeArrow(customTotalModEMV - customTotalOrigEMV)}${formatCurrency(Math.abs(customTotalModEMV - customTotalOrigEMV))}`}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </SectionCard>

                  {/* Assumptions display */}
                  {customScenario.assumptions.trim() && (
                    <SectionCard title="Scenario Assumptions">
                      <div className="p-3 rounded-lg bg-navy-800/30 border border-navy-700/50">
                        <p className="text-sm text-navy-300 whitespace-pre-wrap leading-relaxed">{customScenario.assumptions}</p>
                      </div>
                    </SectionCard>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
