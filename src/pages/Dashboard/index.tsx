import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { PageHeader, SectionCard } from '../../components';
import { RiskTrendChart, CategoryDistributionChart } from '../../components/charts';
import { risks, kris, controls, riskAppetite } from '../../data';
import type { Control } from '../../data';
import { cn } from '../../utils';
import { useData } from '../../context/DataContext';

// Risk Exposure Gauge Component
function RiskExposureGauge({ value, maxValue = 100 }: { value: number; maxValue?: number }) {
  const percentage = (value / maxValue) * 100;
  const getColor = () => {
    if (percentage <= 30) return { stroke: '#10b981', text: 'text-emerald-400', label: 'Low' };
    if (percentage <= 60) return { stroke: '#f59e0b', text: 'text-amber-400', label: 'Moderate' };
    if (percentage <= 80) return { stroke: '#f97316', text: 'text-orange-400', label: 'High' };
    return { stroke: '#ef4444', text: 'text-red-400', label: 'Critical' };
  };
  const color = getColor();
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75;

  return (
    <div className="relative flex flex-col items-center">
      <svg width="140" height="100" viewBox="0 0 140 100">
        <path
          d="M 20 90 A 50 50 0 0 1 120 90"
          fill="none"
          stroke="#1e293b"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 20 90 A 50 50 0 0 1 120 90"
          fill="none"
          stroke={color.stroke}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference * 0.75}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute bottom-2 text-center">
        <span className={cn('text-3xl font-bold', color.text)}>{value}</span>
        <p className="text-xs text-navy-400">{color.label} Risk</p>
      </div>
    </div>
  );
}

// Mini Gauge Component for smaller displays
function MiniGauge({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 transform -rotate-90">
          <circle cx="24" cy="24" r="20" fill="none" stroke="#1e293b" strokeWidth="4" />
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={125.6}
            strokeDashoffset={125.6 - (value / 100) * 125.6}
            className="transition-all duration-500"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-navy-200">
          {value}
        </span>
      </div>
      <div>
        <p className="text-sm font-medium text-navy-200">{label}</p>
        <p className="text-xs text-navy-500">{value}%</p>
      </div>
    </div>
  );
}

// Heatmap Cell Component
function HeatmapCell({ value, row, col }: { value: number; row: number; col: number }) {
  const getColor = () => {
    if (value === 0) return 'bg-navy-800/30';
    if (value <= 2) return 'bg-emerald-500/40 hover:bg-emerald-500/60';
    if (value <= 4) return 'bg-amber-500/40 hover:bg-amber-500/60';
    if (value <= 6) return 'bg-orange-500/40 hover:bg-orange-500/60';
    return 'bg-red-500/40 hover:bg-red-500/60';
  };

  return (
    <div
      className={cn(
        'w-full aspect-square rounded-lg flex items-center justify-center text-xs font-medium cursor-pointer transition-all',
        getColor()
      )}
      title={`Likelihood: ${row + 1}, Impact: ${col + 1}, Count: ${value}`}
    >
      {value > 0 && value}
    </div>
  );
}

// KRI Status Indicator
function KRIStatusIndicator({ kri }: { kri: typeof kris[0] }) {
  const getStatusColor = () => {
    switch (kri.status) {
      case 'green': return 'bg-emerald-500';
      case 'amber': return 'bg-amber-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-navy-500';
    }
  };

  // Get the threshold max based on current status
  const getThresholdMax = () => {
    if (kri.status === 'green') return kri.threshold.green.max;
    if (kri.status === 'amber') return kri.threshold.amber.max;
    return kri.threshold.red.max;
  };

  const thresholdMax = getThresholdMax();
  const percentOfThreshold = Math.min((kri.currentValue / thresholdMax) * 100, 100);

  return (
    <div className="p-3 rounded-xl bg-navy-800/30 border border-navy-700/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-navy-200 truncate">{kri.name}</span>
        <div className={cn('w-2.5 h-2.5 rounded-full', getStatusColor())} />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-navy-700 rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all', getStatusColor())}
            style={{ width: `${percentOfThreshold}%` }}
          />
        </div>
        <span className="text-xs text-navy-400">{percentOfThreshold.toFixed(0)}%</span>
      </div>
      <div className="flex justify-between mt-1 text-2xs text-navy-500">
        <span>Current: {kri.currentValue}{kri.unit === '%' ? '%' : ''}</span>
        <span>Target: {kri.threshold.green.min}{kri.unit === '%' ? '%' : ''}</span>
      </div>
    </div>
  );
}

// Control Effectiveness Card
function ControlEffectivenessCard({ control }: { control: Control }) {
  const getEffectivenessColor = () => {
    if (control.effectivenessScore >= 80) return 'text-emerald-400 bg-emerald-500/20';
    if (control.effectivenessScore >= 60) return 'text-amber-400 bg-amber-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-navy-800/20 border border-navy-700/30">
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm', getEffectivenessColor())}>
        C
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-navy-200 truncate">{control.name}</p>
        <p className="text-xs text-navy-500">{control.type} Control</p>
      </div>
      <div className="text-right">
        <span className={cn('text-lg font-bold', control.effectivenessScore >= 60 ? 'text-emerald-400' : 'text-red-400')}>
          {control.effectivenessScore}%
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { isDataActive } = useData();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [showUploadBanner, setShowUploadBanner] = useState(true);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Use actual data only when active, otherwise show zeros
  const activeRisks = isDataActive ? risks : [];
  const activeKRIs = isDataActive ? kris : [];
  const activeControls = isDataActive ? controls : [];
  const activeAppetite = isDataActive ? riskAppetite : [];

  // Export dashboard data as CSV
  const handleExport = () => {
    const headers = ['Risk ID', 'Title', 'Category', 'Severity', 'Score', 'Status', 'Owner'];
    const rows = activeRisks.map(r => [r.id, r.title, r.category, r.severity, r.riskScore, r.status, r.owner]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumina-r-dashboard-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate full report
  const handleGenerateReport = () => {
    const report = [
      'LUMINA-R RISK INTELLIGENCE REPORT',
      `Generated: ${new Date().toLocaleString()}`,
      `Time Range: ${selectedTimeRange}`,
      '',
      'EXECUTIVE SUMMARY',
      `Total Risks: ${activeRisks.length}`,
      `Risk Exposure Score: ${riskExposureScore}`,
      `Breached KRIs: ${breachedKRIs}`,
      `Control Effectiveness Avg: ${avgControlEffectiveness}%`,
      '',
      'RISK REGISTER',
      ...activeRisks.map(r => `${r.id} | ${r.title} | ${r.severity} | Score: ${r.riskScore} | ${r.status}`),
      '',
      'KRI STATUS',
      ...activeKRIs.map(k => `${k.name} | ${k.status} | Current: ${k.currentValue}${k.unit}`),
    ].join('\n');
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumina-r-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Refresh data simulation
  const handleRefreshData = () => {
    window.location.reload();
  };

  // Calculate metrics (show zeros when data not active)
  const highPriorityRisks = activeRisks.filter(r => r.severity === 'critical' || r.severity === 'high').length;
  const breachedKRIs = activeKRIs.filter(k => k.status === 'red').length;
  const outsideAppetite = activeAppetite.filter(a => a.status === 'breached').length;

  // Calculate risk exposure score
  const riskExposureScore = activeRisks.length > 0
    ? Math.round(activeRisks.reduce((sum, r) => sum + r.riskScore, 0) / activeRisks.length)
    : 0;

  // Calculate residual risk index
  const residualRiskIndex = activeRisks.length > 0
    ? Math.round(
        activeRisks.reduce((sum, r) => {
          const mitigation = r.mitigationPlan ? 0.3 : 0;
          return sum + (r.riskScore * (1 - mitigation));
        }, 0) / activeRisks.length
      )
    : 0;

  // Constraint breach count
  const constraintBreachCount = outsideAppetite;

  // Get top risks for the list
  const topRisks = activeRisks
    .filter(r => r.status === 'active' || r.status === 'escalated')
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);

  // Generate heatmap data (5x5 grid: likelihood x impact)
  const heatmapData: number[][] = Array(5).fill(null).map(() => Array(5).fill(0));
  activeRisks.forEach(risk => {
    const likelihood = Math.min(Math.max(risk.probability, 1), 5) - 1;
    const impact = Math.min(Math.max(risk.impact, 1), 5) - 1;
    heatmapData[likelihood][impact]++;
  });

  // Category distribution data
  const categoryData = [
    { name: 'Cyber', value: activeRisks.filter(r => r.category === 'cyber').length, color: '#6366f1' },
    { name: 'Financial', value: activeRisks.filter(r => r.category === 'financial').length, color: '#8b5cf6' },
    { name: 'Operational', value: activeRisks.filter(r => r.category === 'operational').length, color: '#06b6d4' },
    { name: 'Compliance', value: activeRisks.filter(r => r.category === 'compliance').length, color: '#10b981' },
    { name: 'Strategic', value: activeRisks.filter(r => r.category === 'strategic').length, color: '#f59e0b' },
    { name: 'Reputational', value: activeRisks.filter(r => r.category === 'reputational').length, color: '#ec4899' },
  ];

  // Control effectiveness average
  const avgControlEffectiveness = activeControls.length > 0
    ? Math.round(activeControls.reduce((sum, c) => sum + c.effectivenessScore, 0) / activeControls.length)
    : 0;

  // Mock audit log entries
  const auditLog = [
    { id: 1, action: 'Risk score updated', risk: 'Cyber Attack Vector', user: 'System', time: '2 min ago' },
    { id: 2, action: 'KRI threshold breach', risk: 'System Uptime KRI', user: 'Auto', time: '15 min ago' },
    { id: 3, action: 'Control reviewed', risk: 'MFA Implementation', user: 'J. Smith', time: '1 hour ago' },
    { id: 4, action: 'Risk mitigated', risk: 'Legacy System Risk', user: 'M. Johnson', time: '3 hours ago' },
  ];

  // Mock assumptions
  const assumptions = [
    { id: 1, text: 'Risk appetite set to Moderate (score 40-60)', status: 'active' },
    { id: 2, text: 'Monte Carlo simulation uses 10,000 iterations', status: 'active' },
    { id: 3, text: 'Control effectiveness measured quarterly', status: 'active' },
    { id: 4, text: 'KRI thresholds reviewed monthly', status: 'pending' },
  ];

  return (
    <div className="flex gap-6 animate-fade-in">
      {/* Main Dashboard Content */}
      <div className="flex-1 space-y-6">
        <PageHeader
          title="Risk Intelligence Dashboard"
          subtitle="Real-time visibility into enterprise risk posture"
          actions={
            <div className="flex items-center gap-2">
              {/* Time Range Selector */}
              <div className="flex items-center gap-0.5 p-1 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
                {['24h', '7d', '30d', '90d'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                      selectedTimeRange === range
                        ? 'bg-accent-primary text-white shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <button className="btn-secondary btn-sm" onClick={() => setShowFilterPanel(!showFilterPanel)}>
                <span className="hidden sm:inline">Filter</span>
              </button>
              <button className="btn-secondary btn-sm" onClick={handleExport}>
                <span className="hidden sm:inline">Export</span>
              </button>
              <button className="btn-primary btn-sm" onClick={handleGenerateReport}>
                <span className="hidden sm:inline">Generate Report</span>
              </button>
            </div>
          }
        />

        {/* Data Upload CTA Banner - Prominent with animation */}
        {showUploadBanner && (
          <div className="relative overflow-hidden rounded-2xl border-2 border-accent-primary/50 bg-gradient-to-r from-accent-primary/10 via-purple-500/10 to-pink-500/10 p-6 ai-advisor-glow">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/5 via-transparent to-accent-secondary/5" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-primary/30 to-accent-secondary/30 flex items-center justify-center border border-accent-primary/40">
                    <span className="text-2xl font-bold text-accent-primary">+</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-xs font-bold text-navy-950">!</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy-100">Upload Your Risk Data</h3>
                  <p className="text-sm text-navy-400 mt-1 max-w-lg">
                    Import your risk register, KRIs, controls, and events to unlock intelligent AI analysis across Monte Carlo, Bow-Tie, Decision Trees, and more.
                  </p>
                  <div className="flex items-center gap-6 mt-3">
                    <span className="text-xs text-navy-500">Excel / CSV</span>
                    <span className="text-xs text-navy-500">Auto-mapping</span>
                    <span className="text-xs text-navy-500">AI-powered gaps detection</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowUploadBanner(false)}
                  className="text-sm text-navy-500 hover:text-navy-300 transition-colors"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => navigate('/dashboard/risk-workspace')}
                  className="btn-primary text-base px-6 py-3 flex items-center gap-2 shadow-lg shadow-accent-primary/25"
                >
                  Upload Data Now →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Panel */}
        {showFilterPanel && (
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-navy-200">Filter by Category</h3>
              <button onClick={() => { setFilterCategory('all'); setShowFilterPanel(false); }} className="text-xs text-navy-400 hover:text-navy-200">Clear All</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['all', 'cyber', 'financial', 'operational', 'compliance', 'strategic', 'reputational'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize',
                    filterCategory === cat
                      ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
                      : 'text-navy-400 hover:text-navy-200 bg-navy-800/50 border border-navy-700/30'
                  )}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Row 1: Key Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Risk Exposure Gauge */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-navy-200">Risk Exposure</h3>
              <button className="p-1 rounded hover:bg-navy-700/50 text-navy-500 text-xs">
                ?
              </button>
            </div>
            <RiskExposureGauge value={riskExposureScore} />
            <div className="flex justify-between mt-4 text-xs text-navy-500">
              <span>Target: &lt;40</span>
              <span className={riskExposureScore > 60 ? 'text-red-400' : 'text-emerald-400'}>
                {riskExposureScore > 60 ? '↑ Above target' : '✓ Within target'}
              </span>
            </div>
          </div>

          {/* Residual Risk Index */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-navy-200">Residual Risk Index</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs">
                -12% from last month
              </span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <div className="text-4xl font-bold text-navy-100">{residualRiskIndex}</div>
                <p className="text-sm text-navy-400 mt-1">After mitigation controls</p>
              </div>
              <div className="space-y-2">
                <MiniGauge value={85} label="Inherent" color="#f59e0b" />
                <MiniGauge value={residualRiskIndex} label="Residual" color="#10b981" />
              </div>
            </div>
          </div>

          {/* Constraint Breach Count */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-navy-200">Constraint Breaches</h3>
              <Link
                to="/dashboard/ai-advisor"
                className="px-2 py-1 rounded-lg bg-accent-primary/20 text-accent-primary text-xs hover:bg-accent-primary/30 transition-colors"
              >
                AI Advisor
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                <div className="text-3xl font-bold text-red-400">{constraintBreachCount}</div>
                <p className="text-xs text-navy-400 mt-1">Non-Flexible</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="text-3xl font-bold text-amber-400">{breachedKRIs}</div>
                <p className="text-xs text-navy-400 mt-1">May Flex</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="text-3xl font-bold text-emerald-400">{highPriorityRisks}</div>
                <p className="text-xs text-navy-400 mt-1">Should Flex</p>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Heatmap & Top Risks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interactive Heatmap */}
          <SectionCard
            title="Risk Heatmap"
            subtitle="Likelihood vs Impact distribution"
            actions={
              <button className="text-sm text-accent-primary hover:text-accent-primary/80">
                Details →
              </button>
            }
          >
            <div className="p-4">
              {/* Impact Labels (Top) */}
              <div className="flex mb-2 ml-12">
                {['Very Low', 'Low', 'Medium', 'High', 'Critical'].map((label, i) => (
                  <div key={i} className="flex-1 text-center text-2xs text-navy-500">{label}</div>
                ))}
              </div>
              <div className="flex">
                {/* Likelihood Labels (Left) */}
                <div className="flex flex-col justify-around w-12 pr-2">
                  {['Rare', 'Unlikely', 'Possible', 'Likely', 'Certain'].reverse().map((label, i) => (
                    <div key={i} className="text-2xs text-navy-500 text-right">{label}</div>
                  ))}
                </div>
                {/* Heatmap Grid */}
                <div className="flex-1 grid grid-cols-5 gap-1">
                  {heatmapData.slice().reverse().map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <HeatmapCell
                        key={`${rowIndex}-${colIndex}`}
                        value={cell}
                        row={4 - rowIndex}
                        col={colIndex}
                      />
                    ))
                  )}
                </div>
              </div>
              {/* Legend */}
              <div className="flex items-center justify-center gap-4 mt-4 text-2xs text-navy-500">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-emerald-500/40" /> 1-2
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-amber-500/40" /> 3-4
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-orange-500/40" /> 5-6
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-red-500/40" /> 7+
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Top Risks Table */}
          <SectionCard
            title="Top Risks"
            subtitle="Highest scoring risks requiring attention"
            actions={
              <Link to="/dashboard/risk-register" className="text-sm text-accent-primary hover:text-accent-primary/80">
                View All →
              </Link>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-700">
                    <th className="text-left py-2 px-3 text-xs text-navy-500 font-medium">Risk</th>
                    <th className="text-center py-2 px-3 text-xs text-navy-500 font-medium">Score</th>
                    <th className="text-center py-2 px-3 text-xs text-navy-500 font-medium">Trend</th>
                    <th className="text-center py-2 px-3 text-xs text-navy-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topRisks.map((risk) => (
                    <tr key={risk.id} className="border-b border-navy-800/50 hover:bg-navy-800/30 cursor-pointer">
                      <td className="py-3 px-3">
                        <div>
                          <p className="font-medium text-navy-200">{risk.title}</p>
                          <p className="text-xs text-navy-500">{risk.category}</p>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={cn(
                          'px-2 py-1 rounded-lg text-xs font-bold',
                          risk.riskScore >= 70 ? 'bg-red-500/20 text-red-400' :
                          risk.riskScore >= 40 ? 'bg-amber-500/20 text-amber-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        )}>
                          {risk.riskScore}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-red-400 text-sm">↑</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-2xs font-medium uppercase',
                          risk.status === 'escalated' ? 'bg-red-500/20 text-red-400' :
                          risk.status === 'active' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        )}>
                          {risk.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        {/* Row 3: Analytics & Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Trend Analysis */}
          <div className="lg:col-span-2">
            <SectionCard
              title="Risk Trend Analysis"
              subtitle="6-month risk evolution by severity"
              actions={
                <Link to="/dashboard/monte-carlo" className="text-sm text-accent-primary hover:text-accent-primary/80">
                  Run Simulation →
                </Link>
              }
            >
              <RiskTrendChart />
            </SectionCard>
          </div>

          {/* Risk Distribution */}
          <SectionCard
            title="Risk Distribution"
            subtitle="By category"
          >
            <CategoryDistributionChart data={categoryData} />
          </SectionCard>
        </div>

        {/* Row 4: KRI Tracker & Control Effectiveness */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* KRI Tracker */}
          <SectionCard
            title="KRI Tracker"
            subtitle={`${activeKRIs.filter(k => k.status === 'green').length}/${activeKRIs.length} within threshold`}
            actions={
              <Link to="/dashboard/ai-advisor" className="text-sm text-accent-primary hover:text-accent-primary/80">
                Configure →
              </Link>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeKRIs.length > 0 ? (
                activeKRIs.slice(0, 6).map((kri) => (
                  <KRIStatusIndicator key={kri.id} kri={kri} />
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-navy-500 text-sm">
                  No KRI data loaded. Upload data or engage AI Advisor to begin.
                </div>
              )}
            </div>
          </SectionCard>

          {/* Control Effectiveness Monitor */}
          <SectionCard
            title="Control Effectiveness"
            subtitle={`Average effectiveness: ${avgControlEffectiveness}%`}
            actions={
              <Link to="/dashboard/bow-tie" className="text-sm text-accent-primary hover:text-accent-primary/80">
                Bow-Tie View →
              </Link>
            }
          >
            <div className="space-y-3">
              {activeControls.length > 0 ? (
                activeControls.slice(0, 5).map((control) => (
                  <ControlEffectivenessCard key={control.id} control={control} />
                ))
              ) : (
                <div className="text-center py-8 text-navy-500 text-sm">
                  No control data loaded.
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        {/* Row 5: AI Advisor Banner */}
        <div className="glass-card p-6 border-2 border-accent-primary/30 bg-gradient-to-r from-accent-primary/10 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-primary/20 flex items-center justify-center animate-pulse-glow">
                <span className="text-xl font-bold text-accent-primary">AI</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy-100">AI Risk Advisor</h3>
                <p className="text-sm text-navy-400">
                  {breachedKRIs > 0 || constraintBreachCount > 0
                    ? `${breachedKRIs + constraintBreachCount} issues detected. Get AI-powered recommendations.`
                    : 'Your risk profile is complete. Explore advanced analytics.'}
                </p>
              </div>
            </div>
            <Link to="/dashboard/ai-advisor" className="btn-primary">
              Launch Advisor →
            </Link>
          </div>
        </div>
      </div>

      {/* Collapsible Sidebar - Assumptions & Audit Log */}
      <div className={cn(
        'transition-all duration-300 ease-in-out',
        sidebarExpanded ? 'w-80' : 'w-12'
      )}>
        <div className="sticky top-6 space-y-4">
          {/* Toggle Button */}
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="w-full p-3 rounded-xl bg-navy-800/50 border border-navy-700/50 hover:border-navy-600/50 transition-colors flex items-center justify-center"
          >
            {sidebarExpanded ? (
              <ChevronRight className="w-5 h-5 text-navy-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-navy-400" />
            )}
          </button>

          {sidebarExpanded && (
            <>
              {/* Assumptions Panel */}
              <div className="glass-card p-4">
                <h3 className="text-sm font-semibold text-navy-200 mb-4">Assumptions</h3>
                <div className="space-y-2">
                  {assumptions.map((assumption) => (
                    <div
                      key={assumption.id}
                      className="p-2 rounded-lg bg-navy-800/30 border border-navy-700/30"
                    >
                      <div className="flex items-start gap-2">
                        <div className={cn(
                          'w-1.5 h-1.5 rounded-full mt-1.5',
                          assumption.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
                        )} />
                        <p className="text-xs text-navy-300">{assumption.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit Log Panel */}
              <div className="glass-card p-4">
                <h3 className="text-sm font-semibold text-navy-200 mb-4">Audit Log</h3>
                <div className="space-y-3">
                  {auditLog.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-2 rounded-lg bg-navy-800/30 border border-navy-700/30"
                    >
                      <p className="text-xs font-medium text-navy-200">{entry.action}</p>
                      <p className="text-2xs text-navy-500 mt-0.5">{entry.risk}</p>
                      <div className="flex items-center justify-between mt-1 text-2xs text-navy-600">
                        <span>{entry.user}</span>
                        <span>{entry.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-card p-4">
                <h3 className="text-sm font-semibold text-navy-200 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full btn-secondary text-sm py-2" onClick={handleRefreshData}>
                    Refresh Data
                  </button>
                  <Link to="/dashboard/monte-carlo" className="w-full btn-secondary text-sm py-2 flex items-center justify-center">
                    Run Simulation
                  </Link>
                  <Link to="/dashboard/bow-tie" className="w-full btn-secondary text-sm py-2 flex items-center justify-center">
                    Bow-Tie Analysis
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
