import { useState, useMemo } from 'react';
import { PageHeader, SectionCard } from '../../components';
import { useData } from '../../context/DataContext';
import { cn } from '../../utils';

// Types
type RiskType = 'market' | 'credit' | 'liquidity' | 'interest_rate' | 'fx';
type Severity = 'critical' | 'high' | 'medium' | 'low';

interface FinancialRiskItem {
  id: string;
  name: string;
  type: RiskType;
  description: string;
  exposure: number;
  potentialLoss: number;
  probability: number;
  var95: number;
  var99: number;
  cvar: number;
  hedgeRatio: number;
  owner: string;
  status: 'active' | 'hedged' | 'monitoring' | 'mitigated';
  trend: 'increasing' | 'stable' | 'decreasing';
  lastUpdated: string;
}

interface StressScenario {
  id: string;
  name: string;
  description: string;
  marketShock: number;
  creditSpread: number;
  fxMove: number;
  interestRateShift: number;
  portfolioImpact: number;
  capitalRequired: number;
  probability: number;
}

const sampleRisks: FinancialRiskItem[] = [
  { id: 'FR-001', name: 'Equity Portfolio VaR Breach', type: 'market', description: 'Potential for equity portfolio to exceed VaR limits due to elevated volatility', exposure: 45000000, potentialLoss: 6750000, probability: 15, var95: 4200000, var99: 6750000, cvar: 8100000, hedgeRatio: 65, owner: 'Michael Torres', status: 'active', trend: 'increasing', lastUpdated: '2024-03-15' },
  { id: 'FR-002', name: 'Corporate Bond Default Risk', type: 'credit', description: 'Elevated default probability in high-yield corporate bond holdings', exposure: 28000000, potentialLoss: 3360000, probability: 8, var95: 2100000, var99: 3360000, cvar: 4480000, hedgeRatio: 40, owner: 'Emily Watson', status: 'monitoring', trend: 'stable', lastUpdated: '2024-03-12' },
  { id: 'FR-003', name: 'USD/GBP FX Exposure', type: 'fx', description: 'Unhedged revenue exposure to USD/GBP depreciation', exposure: 35000000, potentialLoss: 3500000, probability: 25, var95: 2450000, var99: 3500000, cvar: 4550000, hedgeRatio: 55, owner: 'Emily Watson', status: 'hedged', trend: 'decreasing', lastUpdated: '2024-03-14' },
  { id: 'FR-004', name: 'Liquidity Coverage Shortfall', type: 'liquidity', description: 'Risk of LCR falling below regulatory minimum during market stress', exposure: 120000000, potentialLoss: 12000000, probability: 5, var95: 8400000, var99: 12000000, cvar: 15600000, hedgeRatio: 80, owner: 'James Morrison', status: 'monitoring', trend: 'stable', lastUpdated: '2024-03-10' },
  { id: 'FR-005', name: 'Interest Rate Duration Gap', type: 'interest_rate', description: 'Asset-liability duration mismatch creating interest rate sensitivity', exposure: 60000000, potentialLoss: 4200000, probability: 20, var95: 3000000, var99: 4200000, cvar: 5400000, hedgeRatio: 50, owner: 'Michael Torres', status: 'active', trend: 'increasing', lastUpdated: '2024-03-13' },
  { id: 'FR-006', name: 'EUR/GBP Translation Risk', type: 'fx', description: 'European subsidiary earnings translation exposure', exposure: 18000000, potentialLoss: 1440000, probability: 30, var95: 1080000, var99: 1440000, cvar: 1800000, hedgeRatio: 70, owner: 'Emily Watson', status: 'hedged', trend: 'stable', lastUpdated: '2024-03-11' },
  { id: 'FR-007', name: 'Counterparty Credit Concentration', type: 'credit', description: 'Large single-counterparty exposure exceeding internal limits', exposure: 22000000, potentialLoss: 4400000, probability: 3, var95: 2200000, var99: 4400000, cvar: 5500000, hedgeRatio: 25, owner: 'James Morrison', status: 'active', trend: 'increasing', lastUpdated: '2024-03-14' },
  { id: 'FR-008', name: 'Commodity Price Volatility', type: 'market', description: 'Energy and raw material cost exposure from commodity price movements', exposure: 15000000, potentialLoss: 2250000, probability: 35, var95: 1500000, var99: 2250000, cvar: 3000000, hedgeRatio: 45, owner: 'David Park', status: 'monitoring', trend: 'decreasing', lastUpdated: '2024-03-09' },
];

const stressScenarios: StressScenario[] = [
  { id: 'SS-001', name: 'Global Recession', description: 'Severe economic downturn with credit crunch', marketShock: -30, creditSpread: 250, fxMove: -15, interestRateShift: -200, portfolioImpact: -18500000, capitalRequired: 25000000, probability: 10 },
  { id: 'SS-002', name: 'Interest Rate Spike', description: 'Rapid central bank tightening cycle', marketShock: -12, creditSpread: 100, fxMove: 5, interestRateShift: 300, portfolioImpact: -9200000, capitalRequired: 14000000, probability: 15 },
  { id: 'SS-003', name: 'Credit Crisis', description: 'Widespread corporate defaults and downgrades', marketShock: -20, creditSpread: 400, fxMove: -8, interestRateShift: -150, portfolioImpact: -14800000, capitalRequired: 20000000, probability: 8 },
  { id: 'SS-004', name: 'GBP Flash Crash', description: 'Rapid GBP devaluation from political shock', marketShock: -8, creditSpread: 50, fxMove: -25, interestRateShift: 50, portfolioImpact: -7600000, capitalRequired: 11000000, probability: 5 },
  { id: 'SS-005', name: 'Stagflation', description: 'Persistent high inflation with low growth', marketShock: -15, creditSpread: 150, fxMove: -10, interestRateShift: 200, portfolioImpact: -11400000, capitalRequired: 16000000, probability: 12 },
];

function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1000000) return `${sign}£${(abs / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `${sign}£${(abs / 1000).toFixed(0)}K`;
  return `${sign}£${abs.toFixed(0)}`;
}

function getSeverity(score: number): Severity {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

function getSeverityColour(s: Severity): string {
  switch (s) {
    case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'high': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case 'low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  }
}

function getTypeColour(t: RiskType): string {
  switch (t) {
    case 'market': return 'bg-blue-500/20 text-blue-400';
    case 'credit': return 'bg-purple-500/20 text-purple-400';
    case 'liquidity': return 'bg-cyan-500/20 text-cyan-400';
    case 'interest_rate': return 'bg-amber-500/20 text-amber-400';
    case 'fx': return 'bg-emerald-500/20 text-emerald-400';
  }
}

function getStatusColour(s: string): string {
  switch (s) {
    case 'active': return 'bg-red-500/20 text-red-400';
    case 'hedged': return 'bg-emerald-500/20 text-emerald-400';
    case 'monitoring': return 'bg-amber-500/20 text-amber-400';
    case 'mitigated': return 'bg-blue-500/20 text-blue-400';
    default: return 'bg-navy-700 text-navy-300';
  }
}

type TabView = 'portfolio' | 'stress' | 'capital';

export default function FinancialRisk() {
  const { isDataActive } = useData();
  const [activeTab, setActiveTab] = useState<TabView>('portfolio');
  const [filterType, setFilterType] = useState<string>('all');

  const activeRisks = isDataActive ? sampleRisks : [];
  const activeScenarios = isDataActive ? stressScenarios : [];
  const filteredRisks = filterType === 'all' ? activeRisks : activeRisks.filter(r => r.type === filterType);

  const stats = useMemo(() => {
    if (activeRisks.length === 0) return { totalExposure: 0, totalVaR95: 0, totalVaR99: 0, totalCVaR: 0, avgHedge: 0, riskCount: { market: 0, credit: 0, liquidity: 0, interest_rate: 0, fx: 0 } };
    return {
      totalExposure: activeRisks.reduce((s, r) => s + r.exposure, 0),
      totalVaR95: activeRisks.reduce((s, r) => s + r.var95, 0),
      totalVaR99: activeRisks.reduce((s, r) => s + r.var99, 0),
      totalCVaR: activeRisks.reduce((s, r) => s + r.cvar, 0),
      avgHedge: Math.round(activeRisks.reduce((s, r) => s + r.hedgeRatio, 0) / activeRisks.length),
      riskCount: {
        market: activeRisks.filter(r => r.type === 'market').length,
        credit: activeRisks.filter(r => r.type === 'credit').length,
        liquidity: activeRisks.filter(r => r.type === 'liquidity').length,
        interest_rate: activeRisks.filter(r => r.type === 'interest_rate').length,
        fx: activeRisks.filter(r => r.type === 'fx').length,
      },
    };
  }, [activeRisks]);

  const handleExport = () => {
    const headers = ['ID', 'Name', 'Type', 'Exposure', 'VaR 95%', 'VaR 99%', 'CVaR', 'Hedge Ratio', 'Owner', 'Status', 'Trend'];
    const rows = filteredRisks.map(r => [r.id, r.name, r.type, r.exposure, r.var95, r.var99, r.cvar, `${r.hedgeRatio}%`, r.owner, r.status, r.trend]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `financial-risk-${new Date().toISOString().split('T')[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  if (!isDataActive) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader title="Financial Risk Model" subtitle="Quantify market, credit, and liquidity risks" />
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-navy-800/50 flex items-center justify-center"><span className="text-2xl text-navy-500">£</span></div>
          <h3 className="text-lg font-semibold text-navy-200 mb-2">No Data Available</h3>
          <p className="text-sm text-navy-500">Upload a dataset or connect your AI Advisor to begin financial risk modelling.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Financial Risk Model" subtitle="Quantify market, credit, and liquidity risks" actions={<button className="btn-secondary" onClick={handleExport}>Export CSV</button>} />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-card p-4 border-l-4 border-l-accent-primary">
          <p className="text-2xl font-bold text-navy-100">{formatCurrency(stats.totalExposure)}</p>
          <p className="text-xs text-navy-400">Total Exposure</p>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-amber-500">
          <p className="text-2xl font-bold text-amber-400">{formatCurrency(stats.totalVaR95)}</p>
          <p className="text-xs text-navy-400">VaR (95%)</p>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-red-500">
          <p className="text-2xl font-bold text-red-400">{formatCurrency(stats.totalVaR99)}</p>
          <p className="text-xs text-navy-400">VaR (99%)</p>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-purple-500">
          <p className="text-2xl font-bold text-purple-400">{formatCurrency(stats.totalCVaR)}</p>
          <p className="text-xs text-navy-400">CVaR (ES)</p>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-emerald-500">
          <p className="text-2xl font-bold text-emerald-400">{stats.avgHedge}%</p>
          <p className="text-xs text-navy-400">Avg Hedge Ratio</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {([['portfolio', 'Risk Portfolio'], ['stress', 'Stress Testing'], ['capital', 'Capital Adequacy']] as [TabView, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors', activeTab === key ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30' : 'text-navy-400 hover:text-navy-200 hover:bg-navy-800/50 border border-transparent')}>{label}</button>
        ))}
      </div>

      {activeTab === 'portfolio' && (
        <>
          {/* Type Exposure Breakdown */}
          <SectionCard title="Exposure by Risk Type">
            <div className="space-y-3">
              {(['market', 'credit', 'liquidity', 'interest_rate', 'fx'] as RiskType[]).map((type) => {
                const typeRisks = activeRisks.filter(r => r.type === type);
                const typeExposure = typeRisks.reduce((s, r) => s + r.exposure, 0);
                const pct = stats.totalExposure > 0 ? (typeExposure / stats.totalExposure) * 100 : 0;
                return (
                  <div key={type} className="flex items-center gap-3">
                    <span className={cn('px-2 py-0.5 rounded text-xs font-medium capitalize w-28 text-center', getTypeColour(type))}>{type.replace('_', ' ')}</span>
                    <div className="flex-1 h-5 bg-navy-800/50 rounded overflow-hidden">
                      <div className="h-full bg-accent-primary/40 rounded" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-sm font-mono text-navy-300 w-24 text-right">{formatCurrency(typeExposure)}</span>
                    <span className="text-xs text-navy-500 w-12 text-right">{pct.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Filters */}
          <div className="flex items-center gap-2">
            {['all', 'market', 'credit', 'liquidity', 'interest_rate', 'fx'].map((t) => (
              <button key={t} onClick={() => setFilterType(t)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize', filterType === t ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30' : 'text-navy-400 bg-navy-800/50 border border-navy-700/30 hover:text-navy-200')}>{t === 'all' ? 'All Types' : t.replace('_', ' ')}</button>
            ))}
          </div>

          {/* Risk Table */}
          <SectionCard title="Financial Risk Portfolio">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-navy-700 bg-navy-900/50">
                    <th className="py-2 px-3 text-left text-navy-300 font-medium">ID</th>
                    <th className="py-2 px-3 text-left text-navy-300 font-medium">Risk</th>
                    <th className="py-2 px-3 text-center text-navy-300 font-medium">Type</th>
                    <th className="py-2 px-3 text-right text-navy-300 font-medium">Exposure</th>
                    <th className="py-2 px-3 text-right text-navy-300 font-medium">VaR 95%</th>
                    <th className="py-2 px-3 text-right text-navy-300 font-medium">VaR 99%</th>
                    <th className="py-2 px-3 text-right text-navy-300 font-medium">CVaR</th>
                    <th className="py-2 px-3 text-center text-navy-300 font-medium">Hedge %</th>
                    <th className="py-2 px-3 text-left text-navy-300 font-medium">Owner</th>
                    <th className="py-2 px-3 text-center text-navy-300 font-medium">Status</th>
                    <th className="py-2 px-3 text-center text-navy-300 font-medium">Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRisks.map((risk, idx) => {
                    const severity = getSeverity((risk.var99 / risk.exposure) * 100 * 2);
                    return (
                      <tr key={risk.id} className={cn('border-b border-navy-800 hover:bg-navy-800/30', idx % 2 === 0 && 'bg-navy-900/20')}>
                        <td className="py-2 px-3 font-mono text-navy-400">{risk.id}</td>
                        <td className="py-2 px-3 text-navy-200 font-medium max-w-[200px]">{risk.name}</td>
                        <td className="py-2 px-3 text-center"><span className={cn('px-1.5 py-0.5 rounded text-2xs font-medium capitalize', getTypeColour(risk.type))}>{risk.type.replace('_', ' ')}</span></td>
                        <td className="py-2 px-3 text-right font-mono text-navy-200">{formatCurrency(risk.exposure)}</td>
                        <td className="py-2 px-3 text-right font-mono text-amber-400">{formatCurrency(risk.var95)}</td>
                        <td className="py-2 px-3 text-right font-mono text-red-400">{formatCurrency(risk.var99)}</td>
                        <td className="py-2 px-3 text-right font-mono text-purple-400">{formatCurrency(risk.cvar)}</td>
                        <td className="py-2 px-3 text-center">
                          <div className="flex items-center gap-1 justify-center">
                            <div className="w-12 h-2 bg-navy-800 rounded-full overflow-hidden">
                              <div className={cn('h-full rounded-full', risk.hedgeRatio >= 70 ? 'bg-emerald-500' : risk.hedgeRatio >= 50 ? 'bg-amber-500' : 'bg-red-500')} style={{ width: `${risk.hedgeRatio}%` }} />
                            </div>
                            <span className="font-mono text-navy-400">{risk.hedgeRatio}%</span>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-navy-300">{risk.owner}</td>
                        <td className="py-2 px-3 text-center"><span className={cn('px-1.5 py-0.5 rounded text-2xs font-medium capitalize', getStatusColour(risk.status))}>{risk.status}</span></td>
                        <td className="py-2 px-3 text-center"><span className={cn('px-1.5 py-0.5 rounded text-2xs font-medium capitalize border', getSeverityColour(severity))}>{severity}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </>
      )}

      {activeTab === 'stress' && (
        <SectionCard title="Stress Testing Scenarios" subtitle="Impact analysis under adverse conditions">
          <div className="space-y-4">
            {activeScenarios.map((scenario) => (
              <div key={scenario.id} className="p-4 rounded-xl bg-navy-800/30 border border-navy-700/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-navy-100">{scenario.name}</span>
                      <span className={cn('px-1.5 py-0.5 rounded text-2xs font-medium', scenario.probability >= 10 ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400')}>{scenario.probability}% prob</span>
                    </div>
                    <p className="text-xs text-navy-400">{scenario.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-400">{formatCurrency(scenario.portfolioImpact)}</p>
                    <p className="text-2xs text-navy-500">Portfolio Impact</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="p-2 bg-navy-800/40 rounded">
                    <p className="text-2xs text-navy-500">Market Shock</p>
                    <p className={cn('text-sm font-bold', scenario.marketShock < 0 ? 'text-red-400' : 'text-emerald-400')}>{scenario.marketShock}%</p>
                  </div>
                  <div className="p-2 bg-navy-800/40 rounded">
                    <p className="text-2xs text-navy-500">Credit Spread</p>
                    <p className="text-sm font-bold text-amber-400">+{scenario.creditSpread}bp</p>
                  </div>
                  <div className="p-2 bg-navy-800/40 rounded">
                    <p className="text-2xs text-navy-500">FX Move</p>
                    <p className={cn('text-sm font-bold', scenario.fxMove < 0 ? 'text-red-400' : 'text-emerald-400')}>{scenario.fxMove}%</p>
                  </div>
                  <div className="p-2 bg-navy-800/40 rounded">
                    <p className="text-2xs text-navy-500">Rate Shift</p>
                    <p className={cn('text-sm font-bold', scenario.interestRateShift > 0 ? 'text-amber-400' : 'text-blue-400')}>{scenario.interestRateShift > 0 ? '+' : ''}{scenario.interestRateShift}bp</p>
                  </div>
                  <div className="p-2 bg-navy-800/40 rounded">
                    <p className="text-2xs text-navy-500">Capital Req.</p>
                    <p className="text-sm font-bold text-accent-primary">{formatCurrency(scenario.capitalRequired)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {activeTab === 'capital' && (
        <>
          <SectionCard title="Capital Adequacy Overview" subtitle="Regulatory capital buffers and utilization">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-navy-200">Capital Ratios</h4>
                {[
                  { name: 'CET1 Ratio', current: 13.2, min: 4.5, target: 11.0, colour: 'emerald' },
                  { name: 'Tier 1 Capital Ratio', current: 14.8, min: 6.0, target: 12.5, colour: 'emerald' },
                  { name: 'Total Capital Ratio', current: 17.1, min: 8.0, target: 15.0, colour: 'emerald' },
                  { name: 'Leverage Ratio', current: 5.2, min: 3.0, target: 4.5, colour: 'emerald' },
                  { name: 'LCR', current: 128, min: 100, target: 120, colour: 'emerald' },
                  { name: 'NSFR', current: 112, min: 100, target: 110, colour: 'amber' },
                ].map((ratio) => (
                  <div key={ratio.name} className="flex items-center gap-3">
                    <span className="text-xs text-navy-300 w-40">{ratio.name}</span>
                    <div className="flex-1 h-4 bg-navy-800/50 rounded-full overflow-hidden relative">
                      <div className={cn('h-full rounded-full', ratio.current >= ratio.target ? 'bg-emerald-500/60' : 'bg-amber-500/60')} style={{ width: `${Math.min(ratio.current / (ratio.min * 3) * 100, 100)}%` }} />
                      <div className="absolute top-0 h-full border-l-2 border-red-400/60" style={{ left: `${(ratio.min / (ratio.min * 3)) * 100}%` }} />
                    </div>
                    <span className={cn('text-sm font-bold font-mono w-16 text-right', ratio.current >= ratio.target ? 'text-emerald-400' : 'text-amber-400')}>{ratio.current}%</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-navy-200">Capital Buffers</h4>
                {[
                  { name: 'Capital Conservation Buffer', value: 2.5, required: 2.5, status: 'met' },
                  { name: 'Countercyclical Buffer', value: 1.0, required: 1.0, status: 'met' },
                  { name: 'Systemic Risk Buffer', value: 1.5, required: 1.0, status: 'exceeded' },
                  { name: 'Management Buffer', value: 2.2, required: 2.0, status: 'met' },
                ].map((buffer) => (
                  <div key={buffer.name} className="p-3 rounded-lg bg-navy-800/30 border border-navy-700/50 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-navy-200">{buffer.name}</p>
                      <p className="text-2xs text-navy-500">Required: {buffer.required}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-400">{buffer.value}%</p>
                      <span className="text-2xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 capitalize">{buffer.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Risk-Weighted Assets Breakdown">
            <div className="space-y-3">
              {[
                { category: 'Credit Risk RWA', value: 185000000, pct: 62 },
                { category: 'Market Risk RWA', value: 65000000, pct: 22 },
                { category: 'Operational Risk RWA', value: 35000000, pct: 12 },
                { category: 'CVA Risk RWA', value: 12000000, pct: 4 },
              ].map((rwa) => (
                <div key={rwa.category} className="flex items-center gap-3">
                  <span className="text-xs text-navy-300 w-40">{rwa.category}</span>
                  <div className="flex-1 h-5 bg-navy-800/50 rounded overflow-hidden">
                    <div className="h-full bg-accent-primary/30 rounded" style={{ width: `${rwa.pct}%` }} />
                  </div>
                  <span className="text-sm font-mono text-navy-200 w-24 text-right">{formatCurrency(rwa.value)}</span>
                  <span className="text-xs text-navy-500 w-10 text-right">{rwa.pct}%</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )}
    </div>
  );
}
