import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Target,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Zap,
  Shield,
  ChevronRight,
  ChevronDown,
  Gauge,
  BarChart3,
  LineChart,
  FileText,
  Sparkles,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Info,
  History,
  Settings,
} from 'lucide-react';
import { PageHeader, SectionCard } from '../../components';
import { RiskTrendChart, CategoryDistributionChart } from '../../components/charts';
import { risks, kris, controls, riskAppetite } from '../../data';
import type { Control } from '../../data';
import { cn } from '../../utils';

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
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', getEffectivenessColor())}>
        <Shield className="w-5 h-5" />
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
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  // Calculate metrics
  const highPriorityRisks = risks.filter(r => r.severity === 'critical' || r.severity === 'high').length;
  const breachedKRIs = kris.filter(k => k.status === 'red').length;
  const outsideAppetite = riskAppetite.filter(a => a.status === 'breached').length;

  // Calculate risk exposure score
  const riskExposureScore = Math.round(
    risks.reduce((sum, r) => sum + r.riskScore, 0) / risks.length
  );

  // Calculate residual risk index
  const residualRiskIndex = Math.round(
    risks.reduce((sum, r) => {
      const mitigation = r.mitigationPlan ? 0.3 : 0;
      return sum + (r.riskScore * (1 - mitigation));
    }, 0) / risks.length
  );

  // Constraint breach count
  const constraintBreachCount = outsideAppetite;

  // Get active risks for the list
  const activeRisks = risks
    .filter(r => r.status === 'active' || r.status === 'escalated')
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);

  // Generate heatmap data (5x5 grid: likelihood x impact)
  const heatmapData: number[][] = Array(5).fill(null).map(() => Array(5).fill(0));
  risks.forEach(risk => {
    const likelihood = Math.min(Math.max(risk.probability, 1), 5) - 1;
    const impact = Math.min(Math.max(risk.impact, 1), 5) - 1;
    heatmapData[likelihood][impact]++;
  });

  // Category distribution data
  const categoryData = [
    { name: 'Cyber', value: risks.filter(r => r.category === 'cyber').length, color: '#6366f1' },
    { name: 'Financial', value: risks.filter(r => r.category === 'financial').length, color: '#8b5cf6' },
    { name: 'Operational', value: risks.filter(r => r.category === 'operational').length, color: '#06b6d4' },
    { name: 'Compliance', value: risks.filter(r => r.category === 'compliance').length, color: '#10b981' },
    { name: 'Strategic', value: risks.filter(r => r.category === 'strategic').length, color: '#f59e0b' },
    { name: 'Reputational', value: risks.filter(r => r.category === 'reputational').length, color: '#ec4899' },
  ];

  // Control effectiveness average
  const avgControlEffectiveness = Math.round(
    controls.reduce((sum, c) => sum + c.effectivenessScore, 0) / controls.length
  );

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
            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-navy-800/50">
                {['24h', '7d', '30d', '90d'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    className={cn(
                      'px-3 py-1 rounded text-xs font-medium transition-colors',
                      selectedTimeRange === range
                        ? 'bg-accent-primary text-white'
                        : 'text-navy-400 hover:text-navy-200'
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <button className="btn-secondary">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
              <button className="btn-secondary">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="btn-primary">
                <Zap className="w-4 h-4 mr-2" />
                Generate Report
              </button>
            </div>
          }
        />

        {/* Row 1: Key Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Risk Exposure Gauge */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-accent-primary" />
                <h3 className="text-sm font-semibold text-navy-200">Risk Exposure</h3>
              </div>
              <button className="p-1 rounded hover:bg-navy-700/50">
                <Info className="w-4 h-4 text-navy-500" />
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
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-semibold text-navy-200">Residual Risk Index</h3>
              </div>
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
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-semibold text-navy-200">Constraint Breaches</h3>
              </div>
              <Link
                to="/dashboard/ai-advisor"
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-accent-primary/20 text-accent-primary text-xs hover:bg-accent-primary/30 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
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
              <button className="text-sm text-accent-primary hover:text-accent-primary/80 flex items-center gap-1">
                <Eye className="w-4 h-4" /> Details
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
              <Link to="/dashboard/risk-register" className="text-sm text-accent-primary hover:text-accent-primary/80 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
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
                  {activeRisks.map((risk) => (
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
                        <TrendingUp className="w-4 h-4 text-red-400 mx-auto" />
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
                <Link to="/dashboard/monte-carlo" className="text-sm text-accent-primary hover:text-accent-primary/80 flex items-center gap-1">
                  <LineChart className="w-4 h-4" /> Run Simulation
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
            subtitle={`${kris.filter(k => k.status === 'green').length}/${kris.length} within threshold`}
            actions={
              <Link to="/dashboard/ai-advisor" className="text-sm text-accent-primary hover:text-accent-primary/80 flex items-center gap-1">
                Configure <Settings className="w-4 h-4" />
              </Link>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {kris.slice(0, 6).map((kri) => (
                <KRIStatusIndicator key={kri.id} kri={kri} />
              ))}
            </div>
          </SectionCard>

          {/* Control Effectiveness Monitor */}
          <SectionCard
            title="Control Effectiveness"
            subtitle={`Average effectiveness: ${avgControlEffectiveness}%`}
            actions={
              <Link to="/dashboard/bow-tie" className="text-sm text-accent-primary hover:text-accent-primary/80 flex items-center gap-1">
                Bow-Tie View <ArrowRight className="w-4 h-4" />
              </Link>
            }
          >
            <div className="space-y-3">
              {controls.slice(0, 5).map((control) => (
                <ControlEffectivenessCard key={control.id} control={control} />
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Row 5: AI Advisor Banner */}
        <div className="glass-card p-6 border-2 border-accent-primary/30 bg-gradient-to-r from-accent-primary/10 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-primary/20 flex items-center justify-center animate-pulse-glow">
                <Sparkles className="w-6 h-6 text-accent-primary" />
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
              <Sparkles className="w-4 h-4 mr-2" />
              Launch Advisor
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
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 text-accent-primary" />
                  <h3 className="text-sm font-semibold text-navy-200">Assumptions</h3>
                </div>
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
                <div className="flex items-center gap-2 mb-4">
                  <History className="w-4 h-4 text-accent-primary" />
                  <h3 className="text-sm font-semibold text-navy-200">Audit Log</h3>
                </div>
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
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-accent-primary" />
                  <h3 className="text-sm font-semibold text-navy-200">Quick Actions</h3>
                </div>
                <div className="space-y-2">
                  <button className="w-full btn-secondary text-sm py-2">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Data
                  </button>
                  <Link to="/dashboard/monte-carlo" className="w-full btn-secondary text-sm py-2 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Run Simulation
                  </Link>
                  <Link to="/dashboard/bow-tie" className="w-full btn-secondary text-sm py-2 flex items-center justify-center">
                    <Target className="w-4 h-4 mr-2" />
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
