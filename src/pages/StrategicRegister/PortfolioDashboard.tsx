// Strategic Risk Portfolio Dashboard
// Visual overview: Heat Map, Top 10 Risks, Trends, EBITDA Exposure

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { PageHeader } from '../../components';
import { strategicRisks, companyThresholdConfig } from '../../data';
import {
  calculatePortfolioMetrics,
  generateStrategicHeatMap,
  formatCurrency,
  getColourClass,
} from '../../services/strategicRiskEngine';
import { cn } from '../../utils';
import type { StrategicRiskColour } from '../../types';

// Colour palette for charts
const COLOUR_PALETTE: Record<StrategicRiskColour, string> = {
  green: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
  black: '#1e293b',
};

// Heat map cell component
function HeatMapCell({
  count,
  totalEMV,
  dominantColour,
  onClick,
}: {
  count: number;
  totalEMV: number;
  dominantColour: StrategicRiskColour;
  onClick: () => void;
}) {
  const bgOpacity = count === 0 ? 'bg-navy-800/30' : '';
  const colourMap: Record<StrategicRiskColour, string> = {
    green: 'bg-emerald-500/40 hover:bg-emerald-500/50',
    amber: 'bg-amber-500/40 hover:bg-amber-500/50',
    red: 'bg-red-500/40 hover:bg-red-500/50',
    black: 'bg-slate-700 hover:bg-slate-600',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'aspect-square rounded-lg flex flex-col items-center justify-center transition-all',
        'border border-navy-700/50 hover:border-navy-500',
        count === 0 ? bgOpacity : colourMap[dominantColour],
        count > 0 && 'cursor-pointer'
      )}
    >
      {count > 0 && (
        <>
          <span className="text-xl font-bold text-white">{count}</span>
          <span className="text-xs text-white/70">£{formatCurrency(totalEMV)}</span>
        </>
      )}
    </button>
  );
}

export default function PortfolioDashboard() {
  const metrics = useMemo(
    () => calculatePortfolioMetrics(strategicRisks, companyThresholdConfig),
    []
  );

  const heatMap = useMemo(() => generateStrategicHeatMap(strategicRisks), []);

  // Prepare chart data
  const colourDistribution = [
    { name: 'Green', value: metrics.risksByColour.green, colour: COLOUR_PALETTE.green },
    { name: 'Amber', value: metrics.risksByColour.amber, colour: COLOUR_PALETTE.amber },
    { name: 'Red', value: metrics.risksByColour.red, colour: COLOUR_PALETTE.red },
    { name: 'Black', value: metrics.risksByColour.black, colour: COLOUR_PALETTE.black },
  ].filter((d) => d.value > 0);

  const top10Data = metrics.top10ByEMV.map((r) => ({
    id: r.id,
    name: r.title.length > 20 ? r.title.substring(0, 20) + '...' : r.title,
    emv: r.expectedMonetaryValue,
    capital: r.capitalAllocationRequired,
    score: r.overallRiskScore,
    colour: r.colour,
  }));

  const trendData = [
    { name: 'Increasing', value: metrics.trendSummary.increasing, fill: '#ef4444' },
    { name: 'Stable', value: metrics.trendSummary.stable, fill: '#6b7280' },
    { name: 'Decreasing', value: metrics.trendSummary.decreasing, fill: '#10b981' },
  ];

  // Simulated monthly trend data (in production, this would come from historical data)
  const monthlyTrend = [
    { month: 'Sep', totalEMV: 8500000, riskCount: 8 },
    { month: 'Oct', totalEMV: 9200000, riskCount: 9 },
    { month: 'Nov', totalEMV: 10100000, riskCount: 9 },
    { month: 'Dec', totalEMV: 9800000, riskCount: 10 },
    { month: 'Jan', totalEMV: 11200000, riskCount: 10 },
    { month: 'Feb', totalEMV: metrics.totalEMVExposure, riskCount: strategicRisks.length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Strategic Risk Portfolio"
        subtitle="Enterprise-wide risk exposure and capital allocation overview"
      />

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <p className="text-sm text-navy-400 mb-1">Total EMV Exposure</p>
          <p className="text-3xl font-bold text-accent-primary">
            £{formatCurrency(metrics.totalEMVExposure)}
          </p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-navy-400 mb-1">Capital Allocated</p>
          <p className="text-3xl font-bold text-amber-400">
            £{formatCurrency(metrics.totalCapitalAllocated)}
          </p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-navy-400 mb-1">EBITDA at Risk</p>
          <p className={cn(
            'text-3xl font-bold',
            metrics.ebitdaAtRiskPercent > 20 ? 'text-red-400' : 'text-navy-100'
          )}>
            {metrics.ebitdaAtRiskPercent.toFixed(1)}%
          </p>
          <p className="text-xs text-navy-500">£{formatCurrency(metrics.ebitdaAtRisk)} worst case</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-navy-400 mb-1">Average Risk Score</p>
          <p className="text-3xl font-bold text-navy-100">{metrics.averageRiskScore.toFixed(1)}</p>
          <p className="text-xs text-navy-500">{strategicRisks.length} strategic risks</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strategic Heat Map */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-navy-100 mb-4">Strategic Risk Heat Map</h3>
          <p className="text-sm text-navy-400 mb-4">
            Probability (vertical) × Weighted Impact (horizontal)
          </p>
          <div className="grid grid-cols-6 gap-1">
            {/* Header row */}
            <div className="aspect-square" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={`h-${i}`}
                className="aspect-square flex items-center justify-center text-xs text-navy-400"
              >
                {i}
              </div>
            ))}
            {/* Heat map rows (reversed so 5 is at top) */}
            {[5, 4, 3, 2, 1].map((prob) => (
              <>
                <div
                  key={`l-${prob}`}
                  className="aspect-square flex items-center justify-center text-xs text-navy-400"
                >
                  {prob}
                </div>
                {[1, 2, 3, 4, 5].map((impact) => {
                  const cell = heatMap[prob - 1]?.[impact - 1];
                  return (
                    <HeatMapCell
                      key={`${prob}-${impact}`}
                      count={cell?.count || 0}
                      totalEMV={cell?.totalEMV || 0}
                      dominantColour={cell?.dominantColour || 'green'}
                      onClick={() => {}}
                    />
                  );
                })}
              </>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-emerald-500/40" /> Green
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-amber-500/40" /> Amber
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-500/40" /> Red
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-slate-700" /> Black
            </span>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-navy-100 mb-4">Risk Colour Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={colourDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {colourDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.colour} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            {colourDistribution.map((d) => (
              <div key={d.name} className="text-center">
                <div className="text-2xl font-bold" style={{ color: d.colour }}>
                  {d.value}
                </div>
                <div className="text-xs text-navy-400">{d.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 10 Risks by EMV */}
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-navy-100 mb-4">Top 10 Risks by EMV</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10Data} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `£${formatCurrency(v)}`}
                  stroke="#64748b"
                />
                <YAxis
                  type="category"
                  dataKey="id"
                  width={70}
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`£${formatCurrency(value as number)}`, 'EMV']}
                />
                <Bar dataKey="emv" fill="#60a5fa" radius={[0, 4, 4, 0]}>
                  {top10Data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLOUR_PALETTE[entry.colour]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* EMV Trend Over Time */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-navy-100 mb-4">EMV Trend (6 Months)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend} margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis
                  tickFormatter={(v) => `£${formatCurrency(v)}`}
                  stroke="#64748b"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`£${formatCurrency(value as number)}`, 'Total EMV']}
                />
                <Line
                  type="monotone"
                  dataKey="totalEMV"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={{ fill: '#60a5fa', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Trend Summary */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-navy-100 mb-4">Risk Trend Summary</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ left: 0, right: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {trendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Mitigation ROI Summary */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-navy-100 mb-4">Mitigation Investment Summary</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-4 bg-navy-800/30 rounded-lg">
            <p className="text-sm text-navy-400 mb-1">Total Mitigation Cost</p>
            <p className="text-2xl font-bold text-red-400">
              £{formatCurrency(metrics.mitigationROISummary.totalMitigationCost)}
            </p>
            <p className="text-xs text-navy-500">Approved & In Progress</p>
          </div>
          <div className="text-center p-4 bg-navy-800/30 rounded-lg">
            <p className="text-sm text-navy-400 mb-1">Expected Risk Reduction</p>
            <p className="text-2xl font-bold text-emerald-400">
              £{formatCurrency(metrics.mitigationROISummary.totalRiskReduction)}
            </p>
            <p className="text-xs text-navy-500">EMV Reduction Value</p>
          </div>
          <div className="text-center p-4 bg-navy-800/30 rounded-lg">
            <p className="text-sm text-navy-400 mb-1">Net Benefit</p>
            <p className={cn(
              'text-2xl font-bold',
              metrics.mitigationROISummary.totalNetBenefit >= 0 ? 'text-emerald-400' : 'text-red-400'
            )}>
              £{formatCurrency(metrics.mitigationROISummary.totalNetBenefit)}
            </p>
            <p className="text-xs text-navy-500">
              ROI: {metrics.mitigationROISummary.totalMitigationCost > 0
                ? ((metrics.mitigationROISummary.totalNetBenefit / metrics.mitigationROISummary.totalMitigationCost) * 100).toFixed(0)
                : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Top Risk Details Table */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-navy-100 mb-4">Top 10 Risks - Detail View</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-700">
                <th className="text-left py-3 px-4 text-navy-400 font-medium">Risk ID</th>
                <th className="text-left py-3 px-4 text-navy-400 font-medium">Title</th>
                <th className="text-center py-3 px-4 text-navy-400 font-medium">Status</th>
                <th className="text-right py-3 px-4 text-navy-400 font-medium">Score</th>
                <th className="text-right py-3 px-4 text-navy-400 font-medium">EMV</th>
                <th className="text-right py-3 px-4 text-navy-400 font-medium">Capital</th>
                <th className="text-right py-3 px-4 text-navy-400 font-medium">EBITDA %</th>
                <th className="text-center py-3 px-4 text-navy-400 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {metrics.top10ByEMV.map((risk) => (
                <tr key={risk.id} className="border-b border-navy-800 hover:bg-navy-800/30">
                  <td className="py-3 px-4 font-mono text-navy-300">{risk.id}</td>
                  <td className="py-3 px-4 text-navy-100">{risk.title}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={cn(
                      'px-2 py-0.5 rounded text-xs font-bold uppercase border',
                      getColourClass(risk.colour)
                    )}>
                      {risk.colour}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-navy-100">{risk.overallRiskScore.toFixed(1)}</td>
                  <td className="py-3 px-4 text-right text-accent-primary font-medium">
                    £{formatCurrency(risk.expectedMonetaryValue)}
                  </td>
                  <td className="py-3 px-4 text-right text-amber-400">
                    £{formatCurrency(risk.capitalAllocationRequired)}
                  </td>
                  <td className={cn(
                    'py-3 px-4 text-right font-medium',
                    risk.ebitdaExposurePercent > 10 ? 'text-red-400' : 'text-navy-100'
                  )}>
                    {risk.ebitdaExposurePercent.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    {risk.trend === 'increasing' && <span className="text-red-400">↑</span>}
                    {risk.trend === 'stable' && <span className="text-navy-400">→</span>}
                    {risk.trend === 'decreasing' && <span className="text-emerald-400">↓</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
