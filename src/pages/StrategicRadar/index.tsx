// Strategic Risk Radar — Emerging threats & opportunities, strategic themes, velocity-impact plotting
// Follows Lumina-R patterns: glass-card, navy color scheme, accent-primary, isDataActive gating

import { useState, useMemo } from 'react';
import { PageHeader, SectionCard } from '../../components';
import { useData } from '../../context/DataContext';
import { cn } from '../../utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Quadrant = 'growth' | 'disruption' | 'regulatory' | 'operational';
type Velocity = 'slow' | 'moderate' | 'fast' | 'sudden';
type RiskDirection = 'increasing' | 'stable' | 'decreasing';
type TimeHorizon = 'near' | 'medium' | 'long';
type ViewTab = 'radar' | 'themes' | 'emerging';

interface StrategicRisk {
  id: string;
  name: string;
  description: string;
  quadrant: Quadrant;
  impact: number;        // 1-10
  likelihood: number;    // 1-10
  velocity: Velocity;
  direction: RiskDirection;
  timeHorizon: TimeHorizon;
  owner: string;
  responseStrategy: string;
  lastReviewed: string;
}

interface StrategicTheme {
  id: string;
  name: string;
  description: string;
  riskCount: number;
  avgImpact: number;
  trend: RiskDirection;
  keyRisks: string[];
}

interface EmergingRisk {
  id: string;
  name: string;
  description: string;
  category: string;
  potentialImpact: 'high' | 'very_high' | 'extreme';
  timeToMaterialize: string;
  earlyWarningSignals: string[];
  preparednesScore: number; // 0-100
  recommendedActions: string[];
}

// ---------------------------------------------------------------------------
// Sample Data
// ---------------------------------------------------------------------------
const sampleRisks: StrategicRisk[] = [
  {
    id: 'SR-001', name: 'AI Disruption to Core Business',
    description: 'Generative AI reshapes competitive landscape, potentially displacing traditional service offerings',
    quadrant: 'disruption', impact: 9, likelihood: 8, velocity: 'fast', direction: 'increasing',
    timeHorizon: 'near', owner: 'Chief Strategy Officer', responseStrategy: 'Invest in AI capabilities; launch AI-augmented products',
    lastReviewed: '2025-01-10',
  },
  {
    id: 'SR-002', name: 'Regulatory Fragmentation',
    description: 'Diverging global regulations (EU AI Act, US state laws) create compliance complexity',
    quadrant: 'regulatory', impact: 7, likelihood: 9, velocity: 'moderate', direction: 'increasing',
    timeHorizon: 'near', owner: 'General Counsel', responseStrategy: 'Establish regulatory monitoring; hire compliance specialists',
    lastReviewed: '2025-01-08',
  },
  {
    id: 'SR-003', name: 'Talent War for Tech Skills',
    description: 'Inability to attract/retain AI, cybersecurity, and data science talent',
    quadrant: 'operational', impact: 7, likelihood: 7, velocity: 'moderate', direction: 'stable',
    timeHorizon: 'medium', owner: 'CHRO', responseStrategy: 'Upskill programs; competitive compensation; remote-first culture',
    lastReviewed: '2025-01-05',
  },
  {
    id: 'SR-004', name: 'Climate Transition Risk',
    description: 'Shift to low-carbon economy impacts asset valuations and operating costs',
    quadrant: 'regulatory', impact: 8, likelihood: 7, velocity: 'slow', direction: 'increasing',
    timeHorizon: 'long', owner: 'CFO', responseStrategy: 'TCFD alignment; green investment portfolio; carbon offset program',
    lastReviewed: '2025-01-12',
  },
  {
    id: 'SR-005', name: 'Geopolitical Supply Chain Disruption',
    description: 'Trade tensions and regional conflicts disrupt global supply chains',
    quadrant: 'disruption', impact: 8, likelihood: 6, velocity: 'sudden', direction: 'increasing',
    timeHorizon: 'near', owner: 'COO', responseStrategy: 'Nearshoring strategy; dual-source critical components',
    lastReviewed: '2025-01-09',
  },
  {
    id: 'SR-006', name: 'Digital Platform Dependency',
    description: 'Over-reliance on 3rd-party cloud platforms creates strategic lock-in risk',
    quadrant: 'operational', impact: 6, likelihood: 5, velocity: 'slow', direction: 'stable',
    timeHorizon: 'medium', owner: 'CTO', responseStrategy: 'Multi-cloud strategy; containerization; exit planning',
    lastReviewed: '2025-01-07',
  },
  {
    id: 'SR-007', name: 'Market Entry by Big Tech',
    description: 'Tech giants expanding into adjacent markets threaten market share',
    quadrant: 'growth', impact: 9, likelihood: 5, velocity: 'fast', direction: 'increasing',
    timeHorizon: 'medium', owner: 'CEO', responseStrategy: 'Differentiation strategy; niche market focus; strategic partnerships',
    lastReviewed: '2025-01-11',
  },
  {
    id: 'SR-008', name: 'Customer Behaviour Shift',
    description: 'Post-pandemic digital-first preferences accelerate channel migration',
    quadrant: 'growth', impact: 6, likelihood: 8, velocity: 'moderate', direction: 'stable',
    timeHorizon: 'near', owner: 'CMO', responseStrategy: 'Omnichannel investment; digital experience overhaul',
    lastReviewed: '2025-01-06',
  },
  {
    id: 'SR-009', name: 'ESG Reporting Mandates',
    description: 'Mandatory ESG disclosure requirements increase reporting burden and liability',
    quadrant: 'regulatory', impact: 5, likelihood: 9, velocity: 'moderate', direction: 'increasing',
    timeHorizon: 'near', owner: 'General Counsel', responseStrategy: 'ESG data platform; dedicated sustainability team',
    lastReviewed: '2025-01-04',
  },
  {
    id: 'SR-010', name: 'Quantum Computing Threat',
    description: 'Advances in quantum computing threaten current encryption and security standards',
    quadrant: 'disruption', impact: 10, likelihood: 3, velocity: 'slow', direction: 'increasing',
    timeHorizon: 'long', owner: 'CISO', responseStrategy: 'Post-quantum cryptography roadmap; early R&D investment',
    lastReviewed: '2025-01-03',
  },
];

const sampleThemes: StrategicTheme[] = [
  {
    id: 'ST-01', name: 'Technology Disruption', description: 'AI, quantum, and platform risks reshaping competitive landscape',
    riskCount: 3, avgImpact: 8.3, trend: 'increasing', keyRisks: ['SR-001', 'SR-007', 'SR-010'],
  },
  {
    id: 'ST-02', name: 'Regulatory & Compliance', description: 'Growing regulatory burden across jurisdictions',
    riskCount: 3, avgImpact: 6.7, trend: 'increasing', keyRisks: ['SR-002', 'SR-004', 'SR-009'],
  },
  {
    id: 'ST-03', name: 'Operational Resilience', description: 'Talent, supply chain, and infrastructure dependencies',
    riskCount: 3, avgImpact: 7.0, trend: 'stable', keyRisks: ['SR-003', 'SR-005', 'SR-006'],
  },
  {
    id: 'ST-04', name: 'Market & Growth', description: 'Evolving customer expectations and competitive dynamics',
    riskCount: 2, avgImpact: 7.5, trend: 'stable', keyRisks: ['SR-007', 'SR-008'],
  },
];

const sampleEmerging: EmergingRisk[] = [
  {
    id: 'ER-01', name: 'Deepfake Social Engineering', description: 'AI-generated deepfakes used for executive impersonation and fraud',
    category: 'Cybersecurity', potentialImpact: 'very_high', timeToMaterialize: '6-12 months',
    earlyWarningSignals: ['Increased phishing attempts', 'Deepfake tools becoming mainstream', 'Industry incidents reported'],
    preparednesScore: 35, recommendedActions: ['Deploy deepfake detection tools', 'Executive awareness training', 'Multi-factor voice verification'],
  },
  {
    id: 'ER-02', name: 'Autonomous AI Decision-Making Liability', description: 'Legal liability from AI systems making autonomous decisions that cause harm',
    category: 'Legal/Regulatory', potentialImpact: 'extreme', timeToMaterialize: '1-2 years',
    earlyWarningSignals: ['EU AI Act enforcement begins', 'Landmark lawsuits filed', 'Insurance market adjustments'],
    preparednesScore: 25, recommendedActions: ['AI governance framework', 'Human-in-the-loop requirements', 'AI liability insurance'],
  },
  {
    id: 'ER-03', name: 'Digital Currency Disruption', description: 'Central bank digital currencies and crypto regulation reshape financial infrastructure',
    category: 'Financial', potentialImpact: 'high', timeToMaterialize: '2-3 years',
    earlyWarningSignals: ['CBDC pilots expand globally', 'Crypto regulation standardization', 'Payment system modernization'],
    preparednesScore: 40, recommendedActions: ['CBDC readiness assessment', 'Blockchain capability development', 'Payment infrastructure upgrade'],
  },
  {
    id: 'ER-04', name: 'Biodiversity-Related Financial Risk', description: 'Nature-related dependencies create material financial risks (TNFD)',
    category: 'ESG/Climate', potentialImpact: 'high', timeToMaterialize: '2-5 years',
    earlyWarningSignals: ['TNFD framework adoption', 'Biodiversity regulation proposals', 'Supply chain nature dependencies identified'],
    preparednesScore: 15, recommendedActions: ['TNFD gap analysis', 'Nature dependency mapping', 'Biodiversity risk assessment'],
  },
  {
    id: 'ER-05', name: 'Space Weather / Solar Storm', description: 'Severe solar storms could disrupt satellite communications and power grids',
    category: 'Catastrophic', potentialImpact: 'extreme', timeToMaterialize: 'Unknown',
    earlyWarningSignals: ['Solar cycle 25 peak activity', 'Increased minor disruptions', 'Government preparedness advisories'],
    preparednesScore: 10, recommendedActions: ['BCP review for grid failure', 'Satellite dependency assessment', 'Backup communication protocols'],
  },
];

// ---------------------------------------------------------------------------
// Colour Helpers
// ---------------------------------------------------------------------------
const getQuadrantColour = (q: Quadrant) => {
  const map: Record<Quadrant, string> = {
    growth: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    disruption: 'bg-red-500/20 text-red-300 border-red-500/30',
    regulatory: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    operational: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  };
  return map[q];
};

const getVelocityColour = (v: Velocity) => {
  const map: Record<Velocity, string> = {
    slow: 'bg-sky-500/20 text-sky-300',
    moderate: 'bg-amber-500/20 text-amber-300',
    fast: 'bg-orange-500/20 text-orange-300',
    sudden: 'bg-red-500/20 text-red-300',
  };
  return map[v];
};

const getDirectionColour = (d: RiskDirection) => {
  const map: Record<RiskDirection, string> = {
    increasing: 'text-red-400', stable: 'text-amber-400', decreasing: 'text-emerald-400',
  };
  return map[d];
};

const getDirectionArrow = (d: RiskDirection) => {
  const map: Record<RiskDirection, string> = { increasing: '↑', stable: '→', decreasing: '↓' };
  return map[d];
};

const getTimeHorizonLabel = (t: TimeHorizon) => {
  const map: Record<TimeHorizon, string> = { near: '0-1 year', medium: '1-3 years', long: '3-5+ years' };
  return map[t];
};

const getImpactColour = (v: 'high' | 'very_high' | 'extreme') => {
  const map = {
    high: 'bg-amber-500/20 text-amber-300',
    very_high: 'bg-orange-500/20 text-orange-300',
    extreme: 'bg-red-500/20 text-red-300',
  };
  return map[v];
};

const getPreparednessColour = (score: number) => {
  if (score >= 60) return 'bg-emerald-500';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-red-500';
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function StrategicRadar() {
  const { isDataActive } = useData();
  const [activeTab, setActiveTab] = useState<ViewTab>('radar');
  const [selectedQuadrant, setSelectedQuadrant] = useState<Quadrant | 'all'>('all');

  const risks = isDataActive ? sampleRisks : [];
  const themes = isDataActive ? sampleThemes : [];
  const emerging = isDataActive ? sampleEmerging : [];

  // Filtered risks
  const filteredRisks = useMemo(() => {
    if (selectedQuadrant === 'all') return risks;
    return risks.filter(r => r.quadrant === selectedQuadrant);
  }, [risks, selectedQuadrant]);

  // Summary stats
  const stats = useMemo(() => {
    if (!risks.length) return { total: 0, increasing: 0, avgImpact: 0, critical: 0, quadrants: { growth: 0, disruption: 0, regulatory: 0, operational: 0 } };
    const increasing = risks.filter(r => r.direction === 'increasing').length;
    const avgImpact = risks.reduce((s, r) => s + r.impact, 0) / risks.length;
    const critical = risks.filter(r => r.impact >= 8 && r.likelihood >= 7).length;
    const quadrants = { growth: 0, disruption: 0, regulatory: 0, operational: 0 };
    risks.forEach(r => quadrants[r.quadrant]++);
    return { total: risks.length, increasing, avgImpact, critical, quadrants };
  }, [risks]);

  const tabs: { key: ViewTab; label: string }[] = [
    { key: 'radar', label: 'Risk Radar' },
    { key: 'themes', label: 'Strategic Themes' },
    { key: 'emerging', label: 'Emerging Risks' },
  ];

  // CSV Export
  const handleExport = () => {
    const headers = ['ID', 'Name', 'Quadrant', 'Impact', 'Likelihood', 'Velocity', 'Direction', 'Time Horizon', 'Owner'];
    const rows = risks.map(r => [r.id, r.name, r.quadrant, r.impact, r.likelihood, r.velocity, r.direction, r.timeHorizon, r.owner].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'strategic-risk-radar.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Strategic Risk Radar"
        subtitle="Visualize emerging strategic threats and opportunities across the enterprise"
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-t transition-colors',
              activeTab === t.key
                ? 'bg-[var(--accent-primary)] text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5',
            )}
          >
            {t.label}
          </button>
        ))}
        <div className="ml-auto">
          <button onClick={handleExport} className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 text-white rounded transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Strategic Risks', value: stats.total, sub: `${stats.quadrants.disruption} disruption` },
          { label: 'Increasing Risks', value: stats.increasing, sub: `${((stats.increasing / Math.max(stats.total, 1)) * 100).toFixed(0)}% of portfolio` },
          { label: 'Avg Impact Score', value: stats.avgImpact.toFixed(1), sub: 'out of 10' },
          { label: 'Critical (High I×L)', value: stats.critical, sub: 'impact ≥8 & likelihood ≥7' },
        ].map((c, i) => (
          <div key={i} className="glass-card p-4 rounded-lg">
            <p className="text-xs text-white/50 mb-1">{c.label}</p>
            <p className="text-2xl font-bold text-white">{c.value}</p>
            <p className="text-xs text-white/40 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* ===== RADAR VIEW ===== */}
      {activeTab === 'radar' && (
        <div className="space-y-6">
          {/* Quadrant Filter */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'growth', 'disruption', 'regulatory', 'operational'] as const).map(q => (
              <button
                key={q}
                onClick={() => setSelectedQuadrant(q)}
                className={cn(
                  'px-3 py-1.5 text-xs rounded-full border transition-colors capitalize',
                  selectedQuadrant === q
                    ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white'
                    : 'border-white/20 text-white/60 hover:border-white/40',
                )}
              >
                {q === 'all' ? 'All Quadrants' : q} {q !== 'all' && `(${stats.quadrants[q]})`}
              </button>
            ))}
          </div>

          {/* Radar Scatter Plot (visual representation) */}
          <SectionCard title="Risk Radar — Impact vs Likelihood">
            <div className="relative w-full" style={{ paddingBottom: '50%', minHeight: 300 }}>
              <div className="absolute inset-0">
                {/* Grid lines */}
                <div className="absolute inset-0 border border-white/10 rounded">
                  {/* Quadrant labels */}
                  <div className="absolute top-2 left-2 text-xs text-white/30">Low Impact / High Likelihood</div>
                  <div className="absolute top-2 right-2 text-xs text-white/30">High Impact / High Likelihood</div>
                  <div className="absolute bottom-2 left-2 text-xs text-white/30">Low Impact / Low Likelihood</div>
                  <div className="absolute bottom-2 right-2 text-xs text-white/30">High Impact / Low Likelihood</div>
                  {/* Center crosshair */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/10" />
                  <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10" />
                  {/* Axis labels */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/40">Impact →</div>
                  <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-white/40">Likelihood →</div>
                </div>
                {/* Risk dots */}
                {filteredRisks.map(r => {
                  const x = ((r.impact - 1) / 9) * 90 + 5; // 5-95%
                  const y = 95 - ((r.likelihood - 1) / 9) * 90; // inverted for top=high
                  const size = r.velocity === 'sudden' ? 16 : r.velocity === 'fast' ? 14 : r.velocity === 'moderate' ? 12 : 10;
                  const colorMap: Record<Quadrant, string> = {
                    growth: '#10b981', disruption: '#ef4444', regulatory: '#f59e0b', operational: '#3b82f6',
                  };
                  return (
                    <div
                      key={r.id}
                      className="absolute group"
                      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                    >
                      <div
                        className="rounded-full border-2 border-white/40 cursor-pointer transition-transform hover:scale-150"
                        style={{ width: size, height: size, backgroundColor: colorMap[r.quadrant] }}
                      />
                      {/* Tooltip */}
                      <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#1a1a2e] border border-white/20 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                        <span className="font-semibold">{r.id}</span> — {r.name}<br />
                        Impact: {r.impact} | Likelihood: {r.likelihood} | Velocity: {r.velocity}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-8 pt-4 border-t border-white/10">
              {(['growth', 'disruption', 'regulatory', 'operational'] as const).map(q => {
                const colorMap: Record<Quadrant, string> = {
                  growth: '#10b981', disruption: '#ef4444', regulatory: '#f59e0b', operational: '#3b82f6',
                };
                return (
                  <div key={q} className="flex items-center gap-2 text-xs text-white/60">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorMap[q] }} />
                    <span className="capitalize">{q}</span>
                  </div>
                );
              })}
              <div className="text-xs text-white/40 ml-4">Dot size = velocity (larger = faster)</div>
            </div>
          </SectionCard>

          {/* Risk Detail Table */}
          <SectionCard title="Strategic Risk Register">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-white/50">
                    <th className="pb-3 pr-4 font-medium">ID</th>
                    <th className="pb-3 pr-4 font-medium">Risk</th>
                    <th className="pb-3 pr-4 font-medium">Quadrant</th>
                    <th className="pb-3 pr-4 font-medium text-center">Impact</th>
                    <th className="pb-3 pr-4 font-medium text-center">Likelihood</th>
                    <th className="pb-3 pr-4 font-medium">Velocity</th>
                    <th className="pb-3 pr-4 font-medium">Direction</th>
                    <th className="pb-3 pr-4 font-medium">Horizon</th>
                    <th className="pb-3 font-medium">Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRisks.map(r => (
                    <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 pr-4 font-mono text-white/70">{r.id}</td>
                      <td className="py-3 pr-4">
                        <p className="text-white font-medium">{r.name}</p>
                        <p className="text-white/40 text-xs mt-0.5 max-w-xs truncate">{r.description}</p>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={cn('px-2 py-0.5 rounded text-xs border capitalize', getQuadrantColour(r.quadrant))}>
                          {r.quadrant}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-center">
                        <span className={cn('font-bold', r.impact >= 8 ? 'text-red-400' : r.impact >= 5 ? 'text-amber-400' : 'text-white/70')}>
                          {r.impact}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-center">
                        <span className={cn('font-bold', r.likelihood >= 8 ? 'text-red-400' : r.likelihood >= 5 ? 'text-amber-400' : 'text-white/70')}>
                          {r.likelihood}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={cn('px-2 py-0.5 rounded text-xs capitalize', getVelocityColour(r.velocity))}>
                          {r.velocity}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={cn('font-medium', getDirectionColour(r.direction))}>
                          {getDirectionArrow(r.direction)} {r.direction}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-white/60 text-xs">{getTimeHorizonLabel(r.timeHorizon)}</td>
                      <td className="py-3 text-white/60 text-xs">{r.owner}</td>
                    </tr>
                  ))}
                  {filteredRisks.length === 0 && (
                    <tr><td colSpan={9} className="py-12 text-center text-white/30">No strategic risks to display</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>
      )}

      {/* ===== STRATEGIC THEMES VIEW ===== */}
      {activeTab === 'themes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {themes.map(t => (
              <SectionCard key={t.id} title={t.name}>
                <p className="text-white/60 text-sm mb-4">{t.description}</p>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-white/40">Linked Risks</p>
                    <p className="text-xl font-bold text-white">{t.riskCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Avg Impact</p>
                    <p className="text-xl font-bold text-white">{t.avgImpact.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Trend</p>
                    <p className={cn('text-xl font-bold', getDirectionColour(t.trend))}>
                      {getDirectionArrow(t.trend)} {t.trend}
                    </p>
                  </div>
                </div>
                {/* Key Risks */}
                <div className="border-t border-white/10 pt-3">
                  <p className="text-xs text-white/40 mb-2">Key Risks</p>
                  <div className="flex flex-wrap gap-2">
                    {t.keyRisks.map(rid => {
                      const risk = sampleRisks.find(r => r.id === rid);
                      return (
                        <span key={rid} className="px-2 py-1 text-xs bg-white/5 border border-white/10 rounded text-white/70">
                          {rid}: {risk?.name || 'Unknown'}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </SectionCard>
            ))}
            {themes.length === 0 && (
              <div className="col-span-2 text-center py-12 text-white/30">No strategic themes to display</div>
            )}
          </div>

          {/* Theme Impact Comparison */}
          {themes.length > 0 && (
            <SectionCard title="Theme Impact Comparison">
              <div className="space-y-3">
                {themes.map(t => (
                  <div key={t.id} className="flex items-center gap-4">
                    <div className="w-40 text-sm text-white/70 truncate">{t.name}</div>
                    <div className="flex-1 h-8 bg-white/5 rounded overflow-hidden relative">
                      <div
                        className="h-full bg-[var(--accent-primary)] rounded transition-all flex items-center justify-end pr-2"
                        style={{ width: `${(t.avgImpact / 10) * 100}%` }}
                      >
                        <span className="text-xs font-bold text-white">{t.avgImpact.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="w-24 text-right">
                      <span className={cn('text-sm font-medium', getDirectionColour(t.trend))}>
                        {getDirectionArrow(t.trend)} {t.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      )}

      {/* ===== EMERGING RISKS VIEW ===== */}
      {activeTab === 'emerging' && (
        <div className="space-y-6">
          {emerging.map(e => (
            <SectionCard key={e.id} title={`${e.id} — ${e.name}`}>
              <div className="space-y-4">
                <p className="text-white/60 text-sm">{e.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-white/40">Category</p>
                    <p className="text-sm text-white font-medium">{e.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Potential Impact</p>
                    <span className={cn('px-2 py-0.5 rounded text-xs capitalize', getImpactColour(e.potentialImpact))}>
                      {e.potentialImpact.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Time to Materialize</p>
                    <p className="text-sm text-white font-medium">{e.timeToMaterialize}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Preparedness</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full', getPreparednessColour(e.preparednesScore))} style={{ width: `${e.preparednesScore}%` }} />
                      </div>
                      <span className="text-xs text-white/60">{e.preparednesScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Early Warning Signals */}
                <div>
                  <p className="text-xs text-white/40 mb-2">Early Warning Signals</p>
                  <div className="flex flex-wrap gap-2">
                    {e.earlyWarningSignals.map((s, i) => (
                      <span key={i} className="px-2 py-1 text-xs bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded">
                        ⚠ {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Actions */}
                <div>
                  <p className="text-xs text-white/40 mb-2">Recommended Actions</p>
                  <div className="space-y-1">
                    {e.recommendedActions.map((a, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                        <span className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-xs text-white/50">{i + 1}</span>
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
          ))}
          {emerging.length === 0 && (
            <div className="text-center py-12 text-white/30">No emerging risks to display</div>
          )}
        </div>
      )}
    </div>
  );
}
