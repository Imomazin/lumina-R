import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
// Icons removed for cleaner UI
import { PageHeader, SectionCard } from '../../components';
import { cn } from '../../utils';
import {
  runMonteCarloSimulation,
  generateHistogramData,
  generateCumulativeData,
  generateStressScenarios,
  calculateExpectedValue,
} from '../../services/monteCarlo';
import type { TriangularEstimate, MonteCarloConfig, StressScenario } from '../../types';

// Sample risk impacts for demonstration
const sampleRiskImpacts: { name: string; estimate: TriangularEstimate }[] = [
  {
    name: 'Cyber Security Breach',
    estimate: { bestCase: 50000, mostLikely: 200000, worstCase: 1000000 },
  },
  {
    name: 'Supply Chain Disruption',
    estimate: { bestCase: 100000, mostLikely: 300000, worstCase: 800000 },
  },
  {
    name: 'Regulatory Compliance Failure',
    estimate: { bestCase: 25000, mostLikely: 150000, worstCase: 500000 },
  },
  {
    name: 'Key Personnel Loss',
    estimate: { bestCase: 30000, mostLikely: 100000, worstCase: 250000 },
  },
  {
    name: 'System Downtime',
    estimate: { bestCase: 10000, mostLikely: 50000, worstCase: 200000 },
  },
];

type ViewTab = 'simulation' | 'sensitivity';

export default function MonteCarloSimulation() {
  const [activeView, setActiveView] = useState<ViewTab>('simulation');
  const [iterations, setIterations] = useState(10000);
  const [confidenceLevel, setConfidenceLevel] = useState(95);
  const [distributionType, setDistributionType] = useState<MonteCarloConfig['distributionType']>('triangular');
  const [selectedRisks, setSelectedRisks] = useState<number[]>([0, 1, 2]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [simulationResults, setSimulationResults] = useState<{
    results: number[];
    statistics: {
      mean: number;
      stdDev: number;
      min: number;
      max: number;
      percentiles: Record<number, number>;
      valueAtRisk: number;
      conditionalVaR: number;
    };
  } | null>(null);

  const selectedEstimates = useMemo(
    () => selectedRisks.map((i) => sampleRiskImpacts[i].estimate),
    [selectedRisks]
  );

  const runSimulation = async () => {
    setIsRunning(true);

    // Simulate delay for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 500));

    const results = runMonteCarloSimulation(selectedEstimates, {
      iterations,
      confidenceLevel,
      distributionType,
    });

    setSimulationResults(results);
    setHasRun(true);
    setIsRunning(false);
  };

  const histogramData = useMemo(() => {
    if (!simulationResults) return [];
    return generateHistogramData(simulationResults.results, 40);
  }, [simulationResults]);

  const cumulativeData = useMemo(() => {
    if (!simulationResults) return [];
    return generateCumulativeData(simulationResults.results);
  }, [simulationResults]);

  const stressScenarios = useMemo(() => {
    if (!simulationResults) return [];
    return generateStressScenarios(
      simulationResults.results,
      simulationResults.statistics.mean
    );
  }, [simulationResults]);

  const totalExpectedValue = useMemo(() => {
    return selectedEstimates.reduce((sum, e) => sum + calculateExpectedValue(e), 0);
  }, [selectedEstimates]);

  const toggleRisk = (index: number) => {
    setSelectedRisks((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  // Sensitivity Analysis: compute tornado data per selected risk
  const sensitivityData = useMemo(() => {
    if (!simulationResults) return [];
    const baseTotal = simulationResults.statistics.mean;

    return selectedRisks.map((riskIdx) => {
      const risk = sampleRiskImpacts[riskIdx];
      const est = risk.estimate;
      const baseEV = (est.bestCase + est.mostLikely + est.worstCase) / 3;

      // Low scenario: hold this risk at best case, others at expected
      const lowTotal = baseTotal - baseEV + est.bestCase;
      // High scenario: hold this risk at worst case, others at expected
      const highTotal = baseTotal - baseEV + est.worstCase;

      return {
        name: risk.name,
        low: lowTotal,
        high: highTotal,
        base: baseTotal,
        swing: highTotal - lowTotal,
        lowDelta: lowTotal - baseTotal,
        highDelta: highTotal - baseTotal,
      };
    }).sort((a, b) => b.swing - a.swing);
  }, [simulationResults, selectedRisks]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Monte Carlo Simulation"
        subtitle="Probabilistic risk modeling using triangular distributions"
        actions={
          <div className="flex items-center gap-3">
            {hasRun && (
              <button className="btn-secondary" onClick={() => {
                if (!simulationResults) return;
                const headers = ['Metric', 'Value'];
                const data = [
                  ['Mean Impact', formatCurrency(simulationResults.statistics.mean)],
                  ['Standard Deviation', formatCurrency(simulationResults.statistics.stdDev)],
                  ['Min', formatCurrency(simulationResults.statistics.min)],
                  ['Max', formatCurrency(simulationResults.statistics.max)],
                  [`VaR (${confidenceLevel}%)`, formatCurrency(simulationResults.statistics.valueAtRisk)],
                  ['CVaR', formatCurrency(simulationResults.statistics.conditionalVaR)],
                  ...Object.entries(simulationResults.statistics.percentiles).map(([p, v]) => [`P${p}`, formatCurrency(v as number)]),
                ];
                const csv = [headers.join(','), ...data.map(r => r.join(','))].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `monte-carlo-results-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}>
                Export Results
              </button>
            )}
            <button
              onClick={runSimulation}
              disabled={isRunning || selectedRisks.length === 0}
              className={cn(
                'btn-primary',
                (isRunning || selectedRisks.length === 0) && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isRunning ? 'Running...' : 'Run Simulation'}
            </button>
          </div>
        }
      />

      {/* View Tabs */}
      <div className="flex items-center gap-2">
        {(['simulation', 'sensitivity'] as ViewTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveView(tab)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeView === tab
                ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
                : 'text-navy-400 hover:text-navy-200 hover:bg-navy-800/50 border border-transparent'
            )}
          >
            {tab === 'simulation' ? 'Monte Carlo Simulation' : 'Sensitivity Analysis (Tornado)'}
          </button>
        ))}
      </div>

      {activeView === 'simulation' ? (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <SectionCard title="Simulation Config" subtitle="Configure parameters">
            <div className="space-y-4">
              <div>
                <label className="text-xs text-navy-500 mb-1 block">Iterations</label>
                <select
                  value={iterations}
                  onChange={(e) => setIterations(parseInt(e.target.value))}
                  className="input"
                >
                  <option value={1000}>1,000</option>
                  <option value={5000}>5,000</option>
                  <option value={10000}>10,000</option>
                  <option value={50000}>50,000</option>
                  <option value={100000}>100,000</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-navy-500 mb-1 block">Confidence Level</label>
                <select
                  value={confidenceLevel}
                  onChange={(e) => setConfidenceLevel(parseInt(e.target.value))}
                  className="input"
                >
                  <option value={90}>90%</option>
                  <option value={95}>95%</option>
                  <option value={99}>99%</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-navy-500 mb-1 block">Distribution Type</label>
                <select
                  value={distributionType}
                  onChange={(e) => setDistributionType(e.target.value as MonteCarloConfig['distributionType'])}
                  className="input"
                >
                  <option value="triangular">Triangular</option>
                  <option value="pert">PERT (Beta)</option>
                  <option value="normal">Normal</option>
                  <option value="uniform">Uniform</option>
                </select>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Risk Selection" subtitle="Select risks to include">
            <div className="space-y-2">
              {sampleRiskImpacts.map((risk, index) => (
                <button
                  key={index}
                  onClick={() => toggleRisk(index)}
                  className={cn(
                    'w-full p-3 rounded-lg text-left transition-all border',
                    selectedRisks.includes(index)
                      ? 'bg-accent-primary/10 border-accent-primary'
                      : 'bg-navy-800/30 border-navy-700/50 hover:border-navy-600'
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-navy-200">{risk.name}</span>
                    {selectedRisks.includes(index) && (
                      <span className="w-2 h-2 rounded-full bg-accent-primary" />
                    )}
                  </div>
                  <div className="flex gap-4 text-xs text-navy-500">
                    <span>Min: {formatCurrency(risk.estimate.bestCase)}</span>
                    <span>Likely: {formatCurrency(risk.estimate.mostLikely)}</span>
                    <span>Max: {formatCurrency(risk.estimate.worstCase)}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-lg bg-navy-800/30 border border-navy-700/50">
              <p className="text-xs text-navy-500">
                Expected Total Impact: <span className="font-bold text-navy-200">{formatCurrency(totalExpectedValue)}</span>
              </p>
            </div>
          </SectionCard>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {!hasRun ? (
            <SectionCard>
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-navy-800/50 flex items-center justify-center mb-4">
                  <span className="text-2xl text-navy-500">⚙</span>
                </div>
                <h3 className="text-lg font-semibold text-navy-200 mb-2">Configure & Run</h3>
                <p className="text-sm text-navy-500 max-w-md">
                  Select risks to include and configure simulation parameters, then click "Run Simulation"
                  to generate probabilistic impact analysis.
                </p>
              </div>
            </SectionCard>
          ) : (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-navy-500">$</span>
                    <span className="text-xs text-navy-500">Mean Impact</span>
                  </div>
                  <p className="text-xl font-bold text-navy-100">
                    {formatCurrency(simulationResults?.statistics.mean || 0)}
                  </p>
                </div>
                <div className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-navy-500">V</span>
                    <span className="text-xs text-navy-500">VaR ({confidenceLevel}%)</span>
                  </div>
                  <p className="text-xl font-bold text-amber-400">
                    {formatCurrency(simulationResults?.statistics.valueAtRisk || 0)}
                  </p>
                </div>
                <div className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-navy-500">C</span>
                    <span className="text-xs text-navy-500">CVaR</span>
                  </div>
                  <p className="text-xl font-bold text-red-400">
                    {formatCurrency(simulationResults?.statistics.conditionalVaR || 0)}
                  </p>
                </div>
                <div className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-navy-500">σ</span>
                    <span className="text-xs text-navy-500">Std Deviation</span>
                  </div>
                  <p className="text-xl font-bold text-navy-100">
                    {formatCurrency(simulationResults?.statistics.stdDev || 0)}
                  </p>
                </div>
              </div>

              {/* Probability Distribution */}
              <SectionCard
                title="Probability Distribution"
                subtitle={`${iterations.toLocaleString()} iterations using ${distributionType} distribution`}
              >
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={histogramData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis
                        dataKey="bin"
                        tickFormatter={(v) => formatCurrency(v)}
                        stroke="#64748b"
                        fontSize={10}
                      />
                      <YAxis
                        tickFormatter={(v) => `${v.toFixed(1)}%`}
                        stroke="#64748b"
                        fontSize={10}
                      />
                      <Tooltip
                        formatter={(value) => [`${Number(value).toFixed(2)}%`, 'Probability']}
                        labelFormatter={(v) => `Impact: ${formatCurrency(Number(v))}`}
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                        }}
                      />
                      <ReferenceLine
                        x={simulationResults?.statistics.mean}
                        stroke="#6366f1"
                        strokeDasharray="5 5"
                        label={{ value: 'Mean', fill: '#6366f1', fontSize: 10 }}
                      />
                      <ReferenceLine
                        x={simulationResults?.statistics.valueAtRisk}
                        stroke="#f59e0b"
                        strokeDasharray="5 5"
                        label={{ value: `VaR ${confidenceLevel}%`, fill: '#f59e0b', fontSize: 10 }}
                      />
                      <Bar dataKey="percentage" name="Probability">
                        {histogramData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.bin > (simulationResults?.statistics.valueAtRisk || 0)
                                ? '#ef4444'
                                : entry.bin > (simulationResults?.statistics.mean || 0)
                                ? '#f59e0b'
                                : '#6366f1'
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>

              {/* Cumulative Distribution */}
              <SectionCard
                title="Cumulative Distribution (S-Curve)"
                subtitle="Probability of impact being less than or equal to value"
              >
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cumulativeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis
                        dataKey="value"
                        tickFormatter={(v) => formatCurrency(v)}
                        stroke="#64748b"
                        fontSize={10}
                      />
                      <YAxis
                        tickFormatter={(v) => `${v}%`}
                        stroke="#64748b"
                        fontSize={10}
                      />
                      <Tooltip
                        formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Cumulative Probability']}
                        labelFormatter={(v) => `Impact: ${formatCurrency(Number(v))}`}
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="probability"
                        stroke="#6366f1"
                        fill="url(#colorGradient)"
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>

              {/* Stress Scenarios */}
              <SectionCard title="Stress Scenarios" subtitle="Impact at key probability thresholds">
                <div className="space-y-3">
                  {stressScenarios.map((scenario: StressScenario) => (
                    <div
                      key={scenario.name}
                      className="p-4 rounded-xl bg-navy-800/30 border border-navy-700/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded text-xs font-medium',
                              scenario.probability >= 95
                                ? 'bg-red-500/20 text-red-400'
                                : scenario.probability >= 75
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-emerald-500/20 text-emerald-400'
                            )}
                          >
                            P{scenario.probability}
                          </span>
                          <span className="text-sm font-medium text-navy-200">{scenario.name}</span>
                        </div>
                        <span className="text-lg font-bold text-navy-100">
                          {formatCurrency(scenario.impact)}
                        </span>
                      </div>
                      <p className="text-xs text-navy-500">{scenario.description}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Percentiles Table */}
              <SectionCard title="Percentile Analysis" subtitle="Impact values at various probability levels">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-navy-700">
                        <th className="text-left py-2 px-3 text-xs text-navy-500">Percentile</th>
                        <th className="text-right py-2 px-3 text-xs text-navy-500">Impact Value</th>
                        <th className="text-right py-2 px-3 text-xs text-navy-500">Interpretation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(simulationResults?.statistics.percentiles || {}).map(([p, value]) => (
                        <tr key={p} className="border-b border-navy-800/50">
                          <td className="py-2 px-3">
                            <span className="px-2 py-0.5 rounded bg-navy-700/50 text-xs font-medium text-navy-300">
                              P{p}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right text-sm font-medium text-navy-200">
                            {formatCurrency(value as number)}
                          </td>
                          <td className="py-2 px-3 text-right text-xs text-navy-500">
                            {parseInt(p)}% chance of being at or below this value
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            </>
          )}
        </div>
      </div>
      ) : (
      /* ========== SENSITIVITY ANALYSIS (TORNADO) VIEW ========== */
      <div className="space-y-6">
        {!hasRun ? (
          <SectionCard>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-navy-800/50 flex items-center justify-center mb-4">
                <span className="text-2xl text-navy-500">⚙</span>
              </div>
              <h3 className="text-lg font-semibold text-navy-200 mb-2">Run Simulation First</h3>
              <p className="text-sm text-navy-500 max-w-md">
                Switch to the Monte Carlo Simulation tab, configure your parameters, and run a simulation.
                The sensitivity analysis will then show which risk variables have the most influence on total impact.
              </p>
              <button
                onClick={() => setActiveView('simulation')}
                className="mt-4 btn-primary"
              >
                Go to Simulation
              </button>
            </div>
          </SectionCard>
        ) : (
          <>
            {/* Tornado Chart Header */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-4">
                <p className="text-xs text-navy-500 mb-1">Base Case (Mean)</p>
                <p className="text-xl font-bold text-navy-100">{formatCurrency(simulationResults?.statistics.mean || 0)}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-navy-500 mb-1">Most Sensitive Risk</p>
                <p className="text-xl font-bold text-accent-primary">{sensitivityData[0]?.name || 'N/A'}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-navy-500 mb-1">Max Swing</p>
                <p className="text-xl font-bold text-amber-400">{formatCurrency(sensitivityData[0]?.swing || 0)}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-navy-500 mb-1">Variables Analysed</p>
                <p className="text-xl font-bold text-navy-100">{sensitivityData.length}</p>
              </div>
            </div>

            {/* Tornado Chart - Div based */}
            <SectionCard title="Tornado Diagram" subtitle="Variable impact on total portfolio exposure (sorted by influence)">
              <div className="space-y-4">
                {sensitivityData.map((item, idx) => {
                  const maxAbsDelta = Math.max(
                    ...sensitivityData.map((d) => Math.max(Math.abs(d.lowDelta), Math.abs(d.highDelta)))
                  );
                  const barScale = maxAbsDelta > 0 ? 40 / maxAbsDelta : 1;
                  const lowWidth = Math.abs(item.lowDelta) * barScale;
                  const highWidth = Math.abs(item.highDelta) * barScale;

                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-48 text-right shrink-0">
                        <span className="text-sm font-medium text-navy-200">{item.name}</span>
                      </div>
                      <div className="flex-1 flex items-center">
                        {/* Low (left) bar */}
                        <div className="flex-1 flex justify-end">
                          <div
                            className="h-8 rounded-l bg-emerald-500/60 border border-emerald-500/80 flex items-center justify-end px-2"
                            style={{ width: `${lowWidth}%`, minWidth: lowWidth > 0 ? '2rem' : '0' }}
                          >
                            <span className="text-xs font-mono text-emerald-200 whitespace-nowrap">
                              {formatCurrency(item.low)}
                            </span>
                          </div>
                        </div>
                        {/* Center base line */}
                        <div className="w-px h-10 bg-navy-400 shrink-0" />
                        {/* High (right) bar */}
                        <div className="flex-1">
                          <div
                            className="h-8 rounded-r bg-red-500/60 border border-red-500/80 flex items-center px-2"
                            style={{ width: `${highWidth}%`, minWidth: highWidth > 0 ? '2rem' : '0' }}
                          >
                            <span className="text-xs font-mono text-red-200 whitespace-nowrap">
                              {formatCurrency(item.high)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-20 text-right shrink-0">
                        <span className="text-xs text-navy-500">Swing: {formatCurrency(item.swing)}</span>
                      </div>
                    </div>
                  );
                })}
                {/* Base line label */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-48" />
                  <div className="flex-1 flex items-center">
                    <div className="flex-1 text-right pr-2">
                      <span className="text-xs text-emerald-400">← Best Case</span>
                    </div>
                    <div className="text-center px-2">
                      <span className="text-xs font-medium text-navy-300">Base: {formatCurrency(simulationResults?.statistics.mean || 0)}</span>
                    </div>
                    <div className="flex-1 pl-2">
                      <span className="text-xs text-red-400">Worst Case →</span>
                    </div>
                  </div>
                  <div className="w-20" />
                </div>
              </div>
            </SectionCard>

            {/* Sensitivity Data Table */}
            <SectionCard title="Sensitivity Analysis Table" subtitle="Detailed variable-by-variable impact analysis">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-navy-700">
                      <th className="text-left py-2 px-3 text-xs text-navy-500">Rank</th>
                      <th className="text-left py-2 px-3 text-xs text-navy-500">Risk Variable</th>
                      <th className="text-right py-2 px-3 text-xs text-navy-500">Best Case Total</th>
                      <th className="text-right py-2 px-3 text-xs text-navy-500">Base Case Total</th>
                      <th className="text-right py-2 px-3 text-xs text-navy-500">Worst Case Total</th>
                      <th className="text-right py-2 px-3 text-xs text-navy-500">Total Swing</th>
                      <th className="text-right py-2 px-3 text-xs text-navy-500">% of Base</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sensitivityData.map((item, idx) => (
                      <tr key={idx} className="border-b border-navy-800/50 hover:bg-navy-800/20">
                        <td className="py-2 px-3">
                          <span className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                            idx === 0 ? 'bg-red-500/20 text-red-400' :
                            idx === 1 ? 'bg-amber-500/20 text-amber-400' :
                            'bg-navy-700/50 text-navy-400'
                          )}>
                            {idx + 1}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-sm font-medium text-navy-200">{item.name}</td>
                        <td className="py-2 px-3 text-right text-sm text-emerald-400 font-mono">{formatCurrency(item.low)}</td>
                        <td className="py-2 px-3 text-right text-sm text-navy-300 font-mono">{formatCurrency(item.base)}</td>
                        <td className="py-2 px-3 text-right text-sm text-red-400 font-mono">{formatCurrency(item.high)}</td>
                        <td className="py-2 px-3 text-right text-sm font-bold text-navy-100 font-mono">{formatCurrency(item.swing)}</td>
                        <td className="py-2 px-3 text-right text-sm text-navy-400 font-mono">
                          {item.base > 0 ? ((item.swing / item.base) * 100).toFixed(1) : 0}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* Interpretation */}
            <SectionCard title="Key Sensitivity Findings">
              <div className="space-y-3">
                {sensitivityData.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-navy-800/30 border border-navy-700/50">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        'px-2 py-0.5 rounded text-xs font-medium',
                        idx === 0 ? 'bg-red-500/20 text-red-400' :
                        idx === 1 ? 'bg-amber-500/20 text-amber-400' :
                        'bg-blue-500/20 text-blue-400'
                      )}>
                        #{idx + 1} Sensitivity Driver
                      </span>
                    </div>
                    <p className="text-sm text-navy-300">
                      <span className="font-semibold text-navy-100">{item.name}</span> has a total swing of{' '}
                      <span className="font-bold text-accent-primary">{formatCurrency(item.swing)}</span>
                      {' '}({item.base > 0 ? ((item.swing / item.base) * 100).toFixed(1) : 0}% of base case).
                      {' '}Best case reduces total exposure to {formatCurrency(item.low)}, while worst case increases it to {formatCurrency(item.high)}.
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </>
        )}
      </div>
      )}
    </div>
  );
}
