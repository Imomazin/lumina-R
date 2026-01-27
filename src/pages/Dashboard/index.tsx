import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Activity,
  Target,
  TrendingUp,
  ArrowRight,
  Calendar,
  Zap,
} from 'lucide-react';
import { PageHeader, SectionCard, MetricCard, RiskCard } from '../../components';
import { RiskHeatMap, RiskTrendChart, CategoryDistributionChart } from '../../components/charts';
import { RiskAdvisorPanel } from '../../ai';
import { risks, kris, riskAppetite, integrations, caseStudies } from '../../data';
import { cn } from '../../utils';

export default function Dashboard() {
  // Calculate metrics
  const totalRisks = risks.length;
  const highPriorityRisks = risks.filter(r => r.severity === 'critical' || r.severity === 'high').length;
  const breachedKRIs = kris.filter(k => k.status === 'red').length;
  const outsideAppetite = riskAppetite.filter(a => a.status === 'breached').length;

  // Get active risks for the list
  const activeRisks = risks
    .filter(r => r.status === 'active' || r.status === 'escalated')
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);

  // Category distribution data
  const categoryData = [
    { name: 'Cyber', value: risks.filter(r => r.category === 'cyber').length, color: '#6366f1' },
    { name: 'Financial', value: risks.filter(r => r.category === 'financial').length, color: '#8b5cf6' },
    { name: 'Operational', value: risks.filter(r => r.category === 'operational').length, color: '#06b6d4' },
    { name: 'Compliance', value: risks.filter(r => r.category === 'compliance').length, color: '#10b981' },
    { name: 'Strategic', value: risks.filter(r => r.category === 'strategic').length, color: '#f59e0b' },
    { name: 'Reputational', value: risks.filter(r => r.category === 'reputational').length, color: '#ec4899' },
  ];

  // Connected integrations
  const connectedIntegrations = integrations.filter(i => i.status === 'connected');

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Risk Intelligence Overview"
        subtitle="Real-time visibility into enterprise risk posture"
        actions={
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-sm text-navy-400">
              <Calendar className="w-4 h-4" />
              Last updated: Today, 10:45 AM
            </span>
            <button className="btn-primary">
              <Zap className="w-4 h-4 mr-2" />
              Generate Report
            </button>
          </div>
        }
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Risks"
          value={totalRisks}
          change={8}
          trend="up"
          icon={<AlertTriangle className="w-5 h-5 text-navy-400" />}
        />
        <MetricCard
          title="High Priority"
          value={highPriorityRisks}
          change={-12}
          trend="down"
          variant="danger"
          icon={<Target className="w-5 h-5 text-red-400" />}
        />
        <MetricCard
          title="KRIs Breached"
          value={breachedKRIs}
          change={1}
          trend="up"
          variant="warning"
          icon={<Activity className="w-5 h-5 text-amber-400" />}
        />
        <MetricCard
          title="Outside Appetite"
          value={outsideAppetite}
          change={0}
          trend="neutral"
          variant={outsideAppetite > 0 ? 'danger' : 'success'}
          icon={<TrendingUp className="w-5 h-5 text-accent-primary" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Heat Map & Trends */}
        <div className="lg:col-span-2 space-y-6">
          {/* Risk Heat Map */}
          <SectionCard
            title="Risk Heat Map"
            subtitle="Probability vs Impact distribution"
            actions={
              <Link to="/risk-matrix" className="text-sm text-accent-primary hover:text-accent-primary/80 flex items-center gap-1">
                View Full Matrix <ArrowRight className="w-4 h-4" />
              </Link>
            }
          >
            <RiskHeatMap risks={risks} />
          </SectionCard>

          {/* Risk Trend */}
          <SectionCard
            title="Risk Trend Analysis"
            subtitle="6-month risk evolution by severity"
          >
            <RiskTrendChart />
          </SectionCard>

          {/* Active Risks */}
          <SectionCard
            title="Active Risks"
            subtitle="Highest scoring risks requiring attention"
            actions={
              <Link to="/risk-register" className="text-sm text-accent-primary hover:text-accent-primary/80 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            }
          >
            <div className="space-y-3">
              {activeRisks.map((risk) => (
                <RiskCard key={risk.id} risk={risk} compact />
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Right Column - AI Advisor & Stats */}
        <div className="space-y-6">
          {/* AI Risk Advisor */}
          <RiskAdvisorPanel maxInsights={3} />

          {/* Category Distribution */}
          <SectionCard
            title="Risk Distribution"
            subtitle="By category"
          >
            <CategoryDistributionChart data={categoryData} />
          </SectionCard>

          {/* Quick Stats */}
          <SectionCard title="Key Statistics">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-navy-700/50">
                <span className="text-sm text-navy-400">Avg Risk Score</span>
                <span className="text-lg font-bold text-navy-100">
                  {(risks.reduce((sum, r) => sum + r.riskScore, 0) / risks.length).toFixed(1)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-navy-700/50">
                <span className="text-sm text-navy-400">Risks with Mitigation</span>
                <span className="text-lg font-bold text-navy-100">
                  {risks.filter(r => r.mitigationPlan).length}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-navy-700/50">
                <span className="text-sm text-navy-400">KRIs Monitored</span>
                <span className="text-lg font-bold text-navy-100">{kris.length}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-navy-400">Risk Owners</span>
                <span className="text-lg font-bold text-navy-100">
                  {new Set(risks.map(r => r.owner)).size}
                </span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Case Studies Carousel */}
        <SectionCard
          title="Success Stories"
          subtitle="How organizations transformed their risk management"
          actions={
            <Link to="/case-studies" className="text-sm text-accent-primary hover:text-accent-primary/80 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {caseStudies.slice(0, 2).map((study) => (
              <div
                key={study.id}
                className="p-4 rounded-xl bg-navy-800/30 border border-navy-700/50 hover:border-navy-600/50 transition-colors cursor-pointer"
              >
                <span className="text-2xs font-medium text-accent-primary uppercase tracking-wider">
                  {study.industry}
                </span>
                <h4 className="text-sm font-semibold text-navy-100 mt-2 mb-2 line-clamp-2">
                  {study.title}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {study.outcomes.slice(0, 2).map((outcome, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-2xs font-medium"
                    >
                      {outcome.value} {outcome.metric}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Platform Integrations */}
        <SectionCard
          title="Platform Integrations"
          subtitle={`${connectedIntegrations.length} of ${integrations.length} connected`}
          actions={
            <Link to="/integrations" className="text-sm text-accent-primary hover:text-accent-primary/80 flex items-center gap-1">
              Manage <ArrowRight className="w-4 h-4" />
            </Link>
          }
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {integrations.slice(0, 8).map((integration) => (
              <div
                key={integration.id}
                className={cn(
                  'flex flex-col items-center p-3 rounded-xl border transition-colors',
                  integration.status === 'connected'
                    ? 'bg-navy-800/30 border-navy-700/50 hover:border-navy-600/50'
                    : 'bg-navy-800/10 border-navy-700/30 opacity-60'
                )}
              >
                <div className="w-10 h-10 rounded-lg bg-navy-700/50 flex items-center justify-center mb-2">
                  <span className="text-lg font-bold text-navy-300">
                    {integration.name.charAt(0)}
                  </span>
                </div>
                <span className="text-xs font-medium text-navy-200 text-center">
                  {integration.name}
                </span>
                <span className={cn(
                  'text-2xs mt-1',
                  integration.status === 'connected' ? 'text-emerald-400' : 'text-navy-500'
                )}>
                  {integration.status}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
