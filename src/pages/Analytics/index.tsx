import { Download, Filter, Calendar, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { PageHeader, SectionCard, MetricCard } from '../../components';
import { risks, kris } from '../../data';

// Mock data for analytics
const monthlyTrendData = [
  { month: 'Jul', risks: 42, incidents: 8, krisBreached: 2 },
  { month: 'Aug', risks: 45, incidents: 12, krisBreached: 3 },
  { month: 'Sep', risks: 48, incidents: 7, krisBreached: 2 },
  { month: 'Oct', risks: 44, incidents: 9, krisBreached: 4 },
  { month: 'Nov', risks: 46, incidents: 6, krisBreached: 2 },
  { month: 'Dec', risks: 43, incidents: 10, krisBreached: 3 },
  { month: 'Jan', risks: 47, incidents: 8, krisBreached: 1 },
];

const categoryData = [
  { name: 'Cyber', value: risks.filter(r => r.category === 'cyber').length, color: '#6366f1' },
  { name: 'Financial', value: risks.filter(r => r.category === 'financial').length, color: '#8b5cf6' },
  { name: 'Operational', value: risks.filter(r => r.category === 'operational').length, color: '#06b6d4' },
  { name: 'Compliance', value: risks.filter(r => r.category === 'compliance').length, color: '#10b981' },
  { name: 'Strategic', value: risks.filter(r => r.category === 'strategic').length, color: '#f59e0b' },
  { name: 'Reputational', value: risks.filter(r => r.category === 'reputational').length, color: '#ec4899' },
];

const severityTrend = [
  { month: 'Jul', critical: 2, high: 8, medium: 18, low: 14 },
  { month: 'Aug', critical: 3, high: 9, medium: 19, low: 14 },
  { month: 'Sep', critical: 2, high: 10, medium: 20, low: 16 },
  { month: 'Oct', critical: 4, high: 8, medium: 18, low: 14 },
  { month: 'Nov', critical: 3, high: 9, medium: 19, low: 15 },
  { month: 'Dec', critical: 2, high: 7, medium: 18, low: 16 },
  { month: 'Jan', critical: 2, high: 9, medium: 20, low: 16 },
];

const departmentRiskData = [
  { department: 'IT', count: 15, score: 180 },
  { department: 'Finance', count: 12, score: 144 },
  { department: 'Operations', count: 10, score: 95 },
  { department: 'Compliance', count: 8, score: 96 },
  { department: 'HR', count: 5, score: 40 },
];

export default function Analytics() {
  const avgRiskScore = (risks.reduce((sum, r) => sum + r.riskScore, 0) / risks.length).toFixed(1);
  const kriCompliance = ((kris.filter(k => k.status === 'green').length / kris.length) * 100).toFixed(0);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Risk Analytics"
        subtitle="Advanced analytics and insights across your risk portfolio"
        actions={
          <div className="flex items-center gap-3">
            <button className="btn-ghost">
              <Calendar className="w-4 h-4 mr-2" />
              Last 6 Months
            </button>
            <button className="btn-ghost">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button className="btn-primary">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        }
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Risk Exposure"
          value={risks.reduce((sum, r) => sum + r.riskScore, 0)}
          change={-5.2}
          trend="down"
          variant="success"
          icon={<Activity className="w-5 h-5 text-accent-primary" />}
        />
        <MetricCard
          title="Average Risk Score"
          value={avgRiskScore}
          change={-2.1}
          trend="down"
          variant="success"
          icon={<TrendingDown className="w-5 h-5 text-emerald-400" />}
        />
        <MetricCard
          title="KRI Compliance"
          value={`${kriCompliance}%`}
          change={3.5}
          trend="up"
          variant="success"
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
        />
        <MetricCard
          title="Risk Mitigation Rate"
          value="78%"
          change={8}
          trend="up"
          variant="success"
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Trend Over Time */}
        <SectionCard
          title="Risk & Incident Trends"
          subtitle="Monthly progression over 6 months"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="risks"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: '#6366f1' }}
                  name="Total Risks"
                />
                <Line
                  type="monotone"
                  dataKey="incidents"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b' }}
                  name="Incidents"
                />
                <Line
                  type="monotone"
                  dataKey="krisBreached"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: '#ef4444' }}
                  name="KRIs Breached"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Category Distribution */}
        <SectionCard
          title="Risk Distribution by Category"
          subtitle="Current portfolio composition"
        >
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
                <Legend
                  formatter={(value) => <span className="text-navy-300 text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Trend */}
        <SectionCard
          title="Severity Distribution Over Time"
          subtitle="Risk counts by severity level"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={severityTrend}>
                <defs>
                  <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="critical" stackId="1" stroke="#dc2626" fill="url(#colorCritical)" name="Critical" />
                <Area type="monotone" dataKey="high" stackId="1" stroke="#ef4444" fill="url(#colorHigh)" name="High" />
                <Area type="monotone" dataKey="medium" stackId="1" stroke="#f59e0b" fill="url(#colorMedium)" name="Medium" />
                <Area type="monotone" dataKey="low" stackId="1" stroke="#22c55e" fill="url(#colorLow)" name="Low" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Department Risk Distribution */}
        <SectionCard
          title="Risk Exposure by Department"
          subtitle="Risk count and aggregate scores"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentRiskData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis dataKey="department" type="category" stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill="#6366f1" name="Risk Count" radius={[0, 4, 4, 0]} />
                <Bar dataKey="score" fill="#8b5cf6" name="Total Score" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Summary Statistics */}
      <SectionCard title="Portfolio Summary">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-xl bg-navy-800/30 text-center">
            <p className="text-2xl font-bold text-navy-100">{risks.length}</p>
            <p className="text-xs text-navy-400">Total Risks</p>
          </div>
          <div className="p-4 rounded-xl bg-navy-800/30 text-center">
            <p className="text-2xl font-bold text-red-400">{risks.filter(r => r.severity === 'critical').length}</p>
            <p className="text-xs text-navy-400">Critical</p>
          </div>
          <div className="p-4 rounded-xl bg-navy-800/30 text-center">
            <p className="text-2xl font-bold text-navy-100">{kris.length}</p>
            <p className="text-xs text-navy-400">KRIs Tracked</p>
          </div>
          <div className="p-4 rounded-xl bg-navy-800/30 text-center">
            <p className="text-2xl font-bold text-emerald-400">{kris.filter(k => k.status === 'green').length}</p>
            <p className="text-xs text-navy-400">KRIs Green</p>
          </div>
          <div className="p-4 rounded-xl bg-navy-800/30 text-center">
            <p className="text-2xl font-bold text-navy-100">{new Set(risks.map(r => r.owner)).size}</p>
            <p className="text-xs text-navy-400">Risk Owners</p>
          </div>
          <div className="p-4 rounded-xl bg-navy-800/30 text-center">
            <p className="text-2xl font-bold text-navy-100">{risks.filter(r => r.mitigationPlan).length}</p>
            <p className="text-xs text-navy-400">With Mitigation</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
