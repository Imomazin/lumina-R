// Comprehensive Risk Register — Mega Table with Qualitative, Quantitative, and Decision Sections
// Horizontal scrolling table with threshold configuration, color legends, and full financial modeling

import { useState, useMemo } from 'react';
import { PageHeader } from '../../components';
import { cn } from '../../utils';

// Comprehensive Risk Data Type
interface ComprehensiveRisk {
  // Section A: Qualitative Assessment
  id: string;
  category: string;
  title: string;
  description: string;
  cause: string;
  effect: string;
  owner: string;
  department: string;
  status: 'open' | 'in_progress' | 'mitigating' | 'monitoring' | 'closed';
  dateIdentified: string;
  reviewDate: string;
  riskSource: string;

  // Section B: Quantitative Assessment
  inherentProbability: number; // 1-5
  inherentImpact: number; // 1-5
  inherentScore: number; // probability × impact
  controlsInPlace: string[];
  controlEffectiveness: number; // 0-100%
  residualProbability: number;
  residualImpact: number;
  residualScore: number;
  velocity: 'immediate' | 'days' | 'weeks' | 'months' | 'years';
  trend: 'increasing' | 'stable' | 'decreasing';

  // Section C: Financial / Decision
  financialImpactLow: number;
  financialImpactMostLikely: number;
  financialImpactHigh: number;
  expectedMonetaryValue: number;
  capitalAllocation: number;
  ebitdaExposure: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  treatment: 'avoid' | 'transfer' | 'mitigate' | 'accept';
  responseStrategy: string;
  contingencyPlan: string;
  insuranceCoverage: number;

  // Color coding
  colour: 'green' | 'amber' | 'red' | 'black';
}

// Sample comprehensive risk data
const comprehensiveRisks: ComprehensiveRisk[] = [
  {
    id: 'R-001',
    category: 'Cyber Security',
    title: 'Ransomware Attack on Critical Systems',
    description: 'Risk of ransomware infiltrating core IT infrastructure leading to data encryption and operational shutdown',
    cause: 'Phishing emails, unpatched vulnerabilities, weak access controls',
    effect: 'Business interruption, data loss, reputational damage, regulatory fines',
    owner: 'Sarah Chen',
    department: 'Information Technology',
    status: 'mitigating',
    dateIdentified: '2024-01-15',
    reviewDate: '2024-03-01',
    riskSource: 'Internal Audit',
    inherentProbability: 4,
    inherentImpact: 5,
    inherentScore: 20,
    controlsInPlace: ['EDR Solution', 'Email Filtering', 'Security Awareness Training', 'Backup Systems'],
    controlEffectiveness: 65,
    residualProbability: 3,
    residualImpact: 4,
    residualScore: 12,
    velocity: 'immediate',
    trend: 'increasing',
    financialImpactLow: 2000000,
    financialImpactMostLikely: 5000000,
    financialImpactHigh: 15000000,
    expectedMonetaryValue: 4200000,
    capitalAllocation: 6300000,
    ebitdaExposure: 12.6,
    priority: 'critical',
    treatment: 'mitigate',
    responseStrategy: 'Enhanced EDR deployment, Zero Trust implementation, quarterly pen testing',
    contingencyPlan: 'Incident response team activation, offline backups, crisis communications',
    insuranceCoverage: 10000000,
    colour: 'red',
  },
  {
    id: 'R-002',
    category: 'Regulatory',
    title: 'GDPR Non-Compliance Penalty',
    description: 'Risk of regulatory fines and sanctions due to non-compliance with data protection regulations',
    cause: 'Inadequate data governance, consent management gaps, cross-border data transfer issues',
    effect: 'Financial penalties up to 4% of global turnover, reputational harm, legal action',
    owner: 'James Morrison',
    department: 'Legal & Compliance',
    status: 'in_progress',
    dateIdentified: '2024-02-01',
    reviewDate: '2024-04-01',
    riskSource: 'Compliance Review',
    inherentProbability: 3,
    inherentImpact: 5,
    inherentScore: 15,
    controlsInPlace: ['Privacy Impact Assessments', 'DPO Oversight', 'Consent Management Platform'],
    controlEffectiveness: 70,
    residualProbability: 2,
    residualImpact: 4,
    residualScore: 8,
    velocity: 'months',
    trend: 'stable',
    financialImpactLow: 1000000,
    financialImpactMostLikely: 3500000,
    financialImpactHigh: 8000000,
    expectedMonetaryValue: 2100000,
    capitalAllocation: 3150000,
    ebitdaExposure: 6.3,
    priority: 'high',
    treatment: 'mitigate',
    responseStrategy: 'Data mapping exercise, privacy by design implementation, staff training',
    contingencyPlan: 'Legal counsel engagement, regulator liaison, remediation fund',
    insuranceCoverage: 5000000,
    colour: 'amber',
  },
  {
    id: 'R-003',
    category: 'Operational',
    title: 'Supply Chain Disruption',
    description: 'Risk of critical supplier failure leading to production delays and revenue loss',
    cause: 'Supplier concentration, geopolitical instability, logistics constraints',
    effect: 'Production stoppage, customer dissatisfaction, contract penalties, market share loss',
    owner: 'Michael Torres',
    department: 'Operations',
    status: 'monitoring',
    dateIdentified: '2024-01-20',
    reviewDate: '2024-03-15',
    riskSource: 'Supply Chain Review',
    inherentProbability: 4,
    inherentImpact: 4,
    inherentScore: 16,
    controlsInPlace: ['Dual Sourcing', 'Safety Stock', 'Supplier Monitoring', 'Force Majeure Clauses'],
    controlEffectiveness: 55,
    residualProbability: 3,
    residualImpact: 3,
    residualScore: 9,
    velocity: 'weeks',
    trend: 'increasing',
    financialImpactLow: 1500000,
    financialImpactMostLikely: 4000000,
    financialImpactHigh: 10000000,
    expectedMonetaryValue: 2880000,
    capitalAllocation: 4320000,
    ebitdaExposure: 8.6,
    priority: 'high',
    treatment: 'mitigate',
    responseStrategy: 'Supplier diversification, nearshoring initiatives, inventory optimization',
    contingencyPlan: 'Alternative supplier activation, customer communication plan',
    insuranceCoverage: 3000000,
    colour: 'amber',
  },
  {
    id: 'R-004',
    category: 'Financial',
    title: 'Currency Exchange Volatility',
    description: 'Risk of adverse currency movements impacting international revenue and costs',
    cause: 'Global economic uncertainty, interest rate differentials, political events',
    effect: 'Margin erosion, budget variances, competitive pricing pressure',
    owner: 'Emily Watson',
    department: 'Finance',
    status: 'monitoring',
    dateIdentified: '2024-01-10',
    reviewDate: '2024-02-28',
    riskSource: 'Treasury Analysis',
    inherentProbability: 4,
    inherentImpact: 3,
    inherentScore: 12,
    controlsInPlace: ['Hedging Program', 'Natural Hedges', 'FX Monitoring'],
    controlEffectiveness: 75,
    residualProbability: 2,
    residualImpact: 2,
    residualScore: 4,
    velocity: 'days',
    trend: 'stable',
    financialImpactLow: 500000,
    financialImpactMostLikely: 1500000,
    financialImpactHigh: 4000000,
    expectedMonetaryValue: 600000,
    capitalAllocation: 900000,
    ebitdaExposure: 1.8,
    priority: 'medium',
    treatment: 'transfer',
    responseStrategy: 'Structured hedging program, currency diversification, pricing adjustments',
    contingencyPlan: 'Dynamic hedging triggers, margin protection protocols',
    insuranceCoverage: 0,
    colour: 'green',
  },
  {
    id: 'R-005',
    category: 'Strategic',
    title: 'Market Share Erosion to Disruptors',
    description: 'Risk of losing market position to agile digital-native competitors',
    cause: 'Technology disruption, changing customer preferences, slow innovation cycle',
    effect: 'Revenue decline, talent attrition, investor confidence loss',
    owner: 'David Park',
    department: 'Strategy',
    status: 'in_progress',
    dateIdentified: '2024-02-10',
    reviewDate: '2024-04-15',
    riskSource: 'Strategic Planning',
    inherentProbability: 4,
    inherentImpact: 5,
    inherentScore: 20,
    controlsInPlace: ['Digital Transformation Program', 'Innovation Lab', 'Customer Experience Initiative'],
    controlEffectiveness: 45,
    residualProbability: 3,
    residualImpact: 4,
    residualScore: 12,
    velocity: 'months',
    trend: 'increasing',
    financialImpactLow: 5000000,
    financialImpactMostLikely: 12000000,
    financialImpactHigh: 25000000,
    expectedMonetaryValue: 7200000,
    capitalAllocation: 10800000,
    ebitdaExposure: 21.6,
    priority: 'critical',
    treatment: 'mitigate',
    responseStrategy: 'Accelerated digital roadmap, M&A for capability acquisition, talent investment',
    contingencyPlan: 'Strategic pivot options, partnership acceleration',
    insuranceCoverage: 0,
    colour: 'red',
  },
  {
    id: 'R-006',
    category: 'Reputational',
    title: 'Social Media Crisis',
    description: 'Risk of viral negative publicity damaging brand value and customer trust',
    cause: 'Product issues, employee misconduct, activist campaigns, misinformation',
    effect: 'Customer churn, stock price impact, recruitment challenges',
    owner: 'Lisa Johnson',
    department: 'Communications',
    status: 'open',
    dateIdentified: '2024-02-15',
    reviewDate: '2024-03-30',
    riskSource: 'Brand Monitoring',
    inherentProbability: 3,
    inherentImpact: 4,
    inherentScore: 12,
    controlsInPlace: ['Social Listening Tools', 'Crisis Communications Plan', 'Media Training'],
    controlEffectiveness: 60,
    residualProbability: 2,
    residualImpact: 3,
    residualScore: 6,
    velocity: 'immediate',
    trend: 'stable',
    financialImpactLow: 500000,
    financialImpactMostLikely: 2000000,
    financialImpactHigh: 8000000,
    expectedMonetaryValue: 1200000,
    capitalAllocation: 1800000,
    ebitdaExposure: 3.6,
    priority: 'medium',
    treatment: 'mitigate',
    responseStrategy: 'Enhanced monitoring, influencer relationships, rapid response protocols',
    contingencyPlan: 'Dark site activation, CEO messaging, stakeholder outreach',
    insuranceCoverage: 2000000,
    colour: 'amber',
  },
  {
    id: 'R-007',
    category: 'People',
    title: 'Key Person Dependency',
    description: 'Risk of critical knowledge loss due to departure of key personnel',
    cause: 'Retirement, competitor poaching, inadequate succession planning',
    effect: 'Operational disruption, project delays, institutional knowledge loss',
    owner: 'Rachel Green',
    department: 'Human Resources',
    status: 'mitigating',
    dateIdentified: '2024-01-25',
    reviewDate: '2024-03-10',
    riskSource: 'HR Review',
    inherentProbability: 3,
    inherentImpact: 3,
    inherentScore: 9,
    controlsInPlace: ['Succession Planning', 'Knowledge Management', 'Retention Programs'],
    controlEffectiveness: 50,
    residualProbability: 2,
    residualImpact: 2,
    residualScore: 4,
    velocity: 'weeks',
    trend: 'decreasing',
    financialImpactLow: 200000,
    financialImpactMostLikely: 800000,
    financialImpactHigh: 2000000,
    expectedMonetaryValue: 320000,
    capitalAllocation: 480000,
    ebitdaExposure: 1.0,
    priority: 'low',
    treatment: 'mitigate',
    responseStrategy: 'Accelerated succession planning, cross-training, competitive compensation',
    contingencyPlan: 'Emergency contractor engagement, interim leadership',
    insuranceCoverage: 0,
    colour: 'green',
  },
  {
    id: 'R-008',
    category: 'Technology',
    title: 'Legacy System Failure',
    description: 'Risk of critical legacy systems failing due to age and lack of support',
    cause: 'Technical debt, vendor end-of-life, skill shortage for legacy tech',
    effect: 'System outages, data integrity issues, compliance gaps',
    owner: 'Tom Anderson',
    department: 'Information Technology',
    status: 'in_progress',
    dateIdentified: '2024-01-05',
    reviewDate: '2024-02-20',
    riskSource: 'IT Assessment',
    inherentProbability: 4,
    inherentImpact: 4,
    inherentScore: 16,
    controlsInPlace: ['Monitoring Systems', 'Maintenance Contracts', 'Disaster Recovery'],
    controlEffectiveness: 55,
    residualProbability: 3,
    residualImpact: 3,
    residualScore: 9,
    velocity: 'days',
    trend: 'increasing',
    financialImpactLow: 1000000,
    financialImpactMostLikely: 3000000,
    financialImpactHigh: 8000000,
    expectedMonetaryValue: 2160000,
    capitalAllocation: 3240000,
    ebitdaExposure: 6.5,
    priority: 'high',
    treatment: 'mitigate',
    responseStrategy: 'Modernization roadmap, cloud migration, API layer implementation',
    contingencyPlan: 'Failover systems, manual workarounds, vendor escalation',
    insuranceCoverage: 2000000,
    colour: 'amber',
  },
];

// Threshold configuration
interface ThresholdConfig {
  annualEBITDA: number;
  greenMax: number;
  amberMax: number;
  redMax: number;
  criticalThreshold: number;
}

const defaultThresholds: ThresholdConfig = {
  annualEBITDA: 50000000,
  greenMax: 5,
  amberMax: 12,
  redMax: 20,
  criticalThreshold: 15,
};

// Utility functions
function formatCurrency(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toFixed(0);
}

function getScoreColour(score: number, thresholds: ThresholdConfig): string {
  if (score <= thresholds.greenMax) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  if (score <= thresholds.amberMax) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  if (score <= thresholds.redMax) return 'bg-red-500/20 text-red-400 border-red-500/30';
  return 'bg-slate-800 text-white border-slate-600';
}

function getPriorityColour(priority: string): string {
  switch (priority) {
    case 'critical': return 'bg-slate-800 text-white';
    case 'high': return 'bg-red-500/20 text-red-400';
    case 'medium': return 'bg-amber-500/20 text-amber-400';
    case 'low': return 'bg-emerald-500/20 text-emerald-400';
    default: return 'bg-navy-700 text-navy-300';
  }
}

function getStatusColour(status: string): string {
  switch (status) {
    case 'open': return 'bg-red-500/20 text-red-400';
    case 'in_progress': return 'bg-amber-500/20 text-amber-400';
    case 'mitigating': return 'bg-blue-500/20 text-blue-400';
    case 'monitoring': return 'bg-emerald-500/20 text-emerald-400';
    case 'closed': return 'bg-navy-600/50 text-navy-400';
    default: return 'bg-navy-700 text-navy-300';
  }
}

function getTreatmentColour(treatment: string): string {
  switch (treatment) {
    case 'avoid': return 'bg-red-500/20 text-red-400';
    case 'transfer': return 'bg-purple-500/20 text-purple-400';
    case 'mitigate': return 'bg-blue-500/20 text-blue-400';
    case 'accept': return 'bg-emerald-500/20 text-emerald-400';
    default: return 'bg-navy-700 text-navy-300';
  }
}

function getTrendIcon(trend: string): string {
  switch (trend) {
    case 'increasing': return '↑';
    case 'stable': return '→';
    case 'decreasing': return '↓';
    default: return '—';
  }
}

function getTrendColour(trend: string): string {
  switch (trend) {
    case 'increasing': return 'text-red-400';
    case 'stable': return 'text-navy-400';
    case 'decreasing': return 'text-emerald-400';
    default: return 'text-navy-500';
  }
}

export default function RiskRegister() {
  const [thresholds, setThresholds] = useState<ThresholdConfig>(defaultThresholds);
  const [showThresholdPanel, setShowThresholdPanel] = useState(false);
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);

  // Calculate summary statistics
  const stats = useMemo(() => {
    const totalEMV = comprehensiveRisks.reduce((sum, r) => sum + r.expectedMonetaryValue, 0);
    const totalCapital = comprehensiveRisks.reduce((sum, r) => sum + r.capitalAllocation, 0);
    const avgResidual = comprehensiveRisks.reduce((sum, r) => sum + r.residualScore, 0) / comprehensiveRisks.length;
    const criticalCount = comprehensiveRisks.filter(r => r.priority === 'critical').length;
    const highCount = comprehensiveRisks.filter(r => r.priority === 'high').length;

    return { totalEMV, totalCapital, avgResidual, criticalCount, highCount };
  }, []);

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Risk Register"
        subtitle="Comprehensive enterprise risk assessment and financial modeling"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowThresholdPanel(!showThresholdPanel)}
              className={cn('btn-ghost text-sm', showThresholdPanel && 'bg-accent-primary/10 text-accent-primary')}
            >
              Thresholds
            </button>
            <button className="btn-ghost text-sm">Export</button>
            <button className="btn-primary text-sm">+ Add Risk</button>
          </div>
        }
      />

      {/* Summary Ribbon */}
      <div className="glass-card p-3 flex items-center justify-between overflow-x-auto gap-4">
        <div className="flex items-center divide-x divide-navy-700">
          <div className="flex flex-col items-center px-4">
            <span className="text-lg font-bold text-navy-100">{comprehensiveRisks.length}</span>
            <span className="text-2xs text-navy-500 uppercase">Total Risks</span>
          </div>
          <div className="flex flex-col items-center px-4">
            <span className="text-lg font-bold text-red-400">{stats.criticalCount}</span>
            <span className="text-2xs text-navy-500 uppercase">Critical</span>
          </div>
          <div className="flex flex-col items-center px-4">
            <span className="text-lg font-bold text-amber-400">{stats.highCount}</span>
            <span className="text-2xs text-navy-500 uppercase">High</span>
          </div>
          <div className="flex flex-col items-center px-4">
            <span className="text-lg font-bold text-accent-primary">£{formatCurrency(stats.totalEMV)}</span>
            <span className="text-2xs text-navy-500 uppercase">Total EMV</span>
          </div>
          <div className="flex flex-col items-center px-4">
            <span className="text-lg font-bold text-amber-400">£{formatCurrency(stats.totalCapital)}</span>
            <span className="text-2xs text-navy-500 uppercase">Capital Required</span>
          </div>
          <div className="flex flex-col items-center px-4">
            <span className="text-lg font-bold text-navy-100">{stats.avgResidual.toFixed(1)}</span>
            <span className="text-2xs text-navy-500 uppercase">Avg Residual</span>
          </div>
        </div>
      </div>

      {/* Threshold Configuration Panel */}
      {showThresholdPanel && (
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-navy-100 mb-3">Threshold Configuration</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs text-navy-400 mb-1">Annual EBITDA (£)</label>
              <input
                type="number"
                value={thresholds.annualEBITDA}
                onChange={(e) => setThresholds({ ...thresholds, annualEBITDA: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100"
              />
            </div>
            <div>
              <label className="block text-xs text-navy-400 mb-1">Green Max Score</label>
              <input
                type="number"
                value={thresholds.greenMax}
                onChange={(e) => setThresholds({ ...thresholds, greenMax: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100"
              />
            </div>
            <div>
              <label className="block text-xs text-navy-400 mb-1">Amber Max Score</label>
              <input
                type="number"
                value={thresholds.amberMax}
                onChange={(e) => setThresholds({ ...thresholds, amberMax: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100"
              />
            </div>
            <div>
              <label className="block text-xs text-navy-400 mb-1">Red Max Score</label>
              <input
                type="number"
                value={thresholds.redMax}
                onChange={(e) => setThresholds({ ...thresholds, redMax: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100"
              />
            </div>
            <div>
              <label className="block text-xs text-navy-400 mb-1">Critical Threshold</label>
              <input
                type="number"
                value={thresholds.criticalThreshold}
                onChange={(e) => setThresholds({ ...thresholds, criticalThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100"
              />
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="glass-card p-3">
        <div className="flex flex-wrap items-center gap-6 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-navy-400 font-medium">Score:</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500/40" /> Green (1-{thresholds.greenMax})</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500/40" /> Amber ({thresholds.greenMax + 1}-{thresholds.amberMax})</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/40" /> Red ({thresholds.amberMax + 1}-{thresholds.redMax})</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-700" /> Black ({thresholds.redMax + 1}+)</span>
          </div>
          <div className="h-4 w-px bg-navy-700" />
          <div className="flex items-center gap-4">
            <span className="text-navy-400 font-medium">Treatment:</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> Avoid</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400" /> Transfer</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" /> Mitigate</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Accept</span>
          </div>
          <div className="h-4 w-px bg-navy-700" />
          <div className="flex items-center gap-4">
            <span className="text-navy-400 font-medium">Trend:</span>
            <span className="text-red-400">↑ Increasing</span>
            <span className="text-navy-400">→ Stable</span>
            <span className="text-emerald-400">↓ Decreasing</span>
          </div>
        </div>
      </div>

      {/* MEGA TABLE */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              {/* Section Headers */}
              <tr className="bg-navy-800/50">
                <th colSpan={12} className="py-2 px-3 text-left text-accent-primary font-semibold border-b border-navy-700 border-r border-r-navy-600">
                  A. QUALITATIVE RISK ASSESSMENT
                </th>
                <th colSpan={10} className="py-2 px-3 text-left text-amber-400 font-semibold border-b border-navy-700 border-r border-r-navy-600">
                  B. QUANTITATIVE ASSESSMENT
                </th>
                <th colSpan={10} className="py-2 px-3 text-left text-emerald-400 font-semibold border-b border-navy-700">
                  C. FINANCIAL / DECISION
                </th>
              </tr>
              {/* Column Headers */}
              <tr className="border-b border-navy-700 bg-navy-900/50">
                {/* Section A: Qualitative */}
                <th className="py-2 px-2 text-left text-navy-300 font-medium sticky left-0 bg-navy-900 z-10 min-w-[70px]">ID</th>
                <th className="py-2 px-2 text-left text-navy-300 font-medium min-w-[100px]">Category</th>
                <th className="py-2 px-2 text-left text-navy-300 font-medium min-w-[180px]">Title</th>
                <th className="py-2 px-2 text-left text-navy-300 font-medium min-w-[200px]">Description</th>
                <th className="py-2 px-2 text-left text-navy-300 font-medium min-w-[150px]">Cause</th>
                <th className="py-2 px-2 text-left text-navy-300 font-medium min-w-[150px]">Effect</th>
                <th className="py-2 px-2 text-left text-navy-300 font-medium min-w-[100px]">Owner</th>
                <th className="py-2 px-2 text-left text-navy-300 font-medium min-w-[100px]">Dept</th>
                <th className="py-2 px-2 text-center text-navy-300 font-medium min-w-[80px]">Status</th>
                <th className="py-2 px-2 text-left text-navy-300 font-medium min-w-[80px]">Identified</th>
                <th className="py-2 px-2 text-left text-navy-300 font-medium min-w-[80px]">Review</th>
                <th className="py-2 px-2 text-left text-navy-300 font-medium min-w-[80px] border-r border-r-navy-600">Source</th>

                {/* Section B: Quantitative */}
                <th className="py-2 px-2 text-center text-navy-300 font-medium min-w-[50px]">P</th>
                <th className="py-2 px-2 text-center text-navy-300 font-medium min-w-[50px]">I</th>
                <th className="py-2 px-2 text-center text-navy-300 font-medium min-w-[60px]">Inherent</th>
                <th className="py-2 px-2 text-left text-navy-300 font-medium min-w-[150px]">Controls</th>
                <th className="py-2 px-2 text-center text-navy-300 font-medium min-w-[60px]">Ctrl %</th>
                <th className="py-2 px-2 text-center text-navy-300 font-medium min-w-[50px]">Res P</th>
                <th className="py-2 px-2 text-center text-navy-300 font-medium min-w-[50px]">Res I</th>
                <th className="py-2 px-2 text-center text-navy-300 font-medium min-w-[60px]">Residual</th>
                <th className="py-2 px-2 text-center text-navy-300 font-medium min-w-[60px]">Velocity</th>
                <th className="py-2 px-2 text-center text-navy-300 font-medium min-w-[50px] border-r border-r-navy-600">Trend</th>

                {/* Section C: Financial / Decision */}
                <th className="py-2 px-2 text-right text-navy-300 font-medium min-w-[70px]">Low £</th>
                <th className="py-2 px-2 text-right text-navy-300 font-medium min-w-[70px]">Likely £</th>
                <th className="py-2 px-2 text-right text-navy-300 font-medium min-w-[70px]">High £</th>
                <th className="py-2 px-2 text-right text-navy-300 font-medium min-w-[70px]">EMV £</th>
                <th className="py-2 px-2 text-right text-navy-300 font-medium min-w-[70px]">Capital £</th>
                <th className="py-2 px-2 text-right text-navy-300 font-medium min-w-[60px]">EBITDA%</th>
                <th className="py-2 px-2 text-center text-navy-300 font-medium min-w-[70px]">Priority</th>
                <th className="py-2 px-2 text-center text-navy-300 font-medium min-w-[70px]">Treatment</th>
                <th className="py-2 px-2 text-left text-navy-300 font-medium min-w-[180px]">Response Strategy</th>
                <th className="py-2 px-2 text-right text-navy-300 font-medium min-w-[70px]">Insurance £</th>
              </tr>
            </thead>
            <tbody>
              {comprehensiveRisks.map((risk, idx) => (
                <tr
                  key={risk.id}
                  onClick={() => setSelectedRiskId(risk.id === selectedRiskId ? null : risk.id)}
                  className={cn(
                    'border-b border-navy-800 hover:bg-navy-800/30 cursor-pointer transition-colors',
                    selectedRiskId === risk.id && 'bg-accent-primary/5',
                    idx % 2 === 0 && 'bg-navy-900/20'
                  )}
                >
                  {/* Section A: Qualitative */}
                  <td className="py-2 px-2 font-mono text-navy-200 sticky left-0 bg-navy-900 z-10">{risk.id}</td>
                  <td className="py-2 px-2 text-navy-300">{risk.category}</td>
                  <td className="py-2 px-2 text-navy-100 font-medium">{risk.title}</td>
                  <td className="py-2 px-2 text-navy-400 max-w-[200px] truncate" title={risk.description}>{risk.description}</td>
                  <td className="py-2 px-2 text-navy-400 max-w-[150px] truncate" title={risk.cause}>{risk.cause}</td>
                  <td className="py-2 px-2 text-navy-400 max-w-[150px] truncate" title={risk.effect}>{risk.effect}</td>
                  <td className="py-2 px-2 text-navy-300">{risk.owner}</td>
                  <td className="py-2 px-2 text-navy-400">{risk.department}</td>
                  <td className="py-2 px-2 text-center">
                    <span className={cn('px-1.5 py-0.5 rounded text-2xs font-medium uppercase', getStatusColour(risk.status))}>
                      {risk.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-navy-500">{risk.dateIdentified}</td>
                  <td className="py-2 px-2 text-navy-500">{risk.reviewDate}</td>
                  <td className="py-2 px-2 text-navy-400 border-r border-r-navy-700">{risk.riskSource}</td>

                  {/* Section B: Quantitative */}
                  <td className="py-2 px-2 text-center font-mono text-navy-200">{risk.inherentProbability}</td>
                  <td className="py-2 px-2 text-center font-mono text-navy-200">{risk.inherentImpact}</td>
                  <td className="py-2 px-2 text-center">
                    <span className={cn('px-1.5 py-0.5 rounded font-mono font-bold border', getScoreColour(risk.inherentScore, thresholds))}>
                      {risk.inherentScore}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-navy-400 max-w-[150px]">
                    <span className="truncate block" title={risk.controlsInPlace.join(', ')}>
                      {risk.controlsInPlace.slice(0, 2).join(', ')}{risk.controlsInPlace.length > 2 && '...'}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span className={cn('font-mono', risk.controlEffectiveness >= 70 ? 'text-emerald-400' : risk.controlEffectiveness >= 50 ? 'text-amber-400' : 'text-red-400')}>
                      {risk.controlEffectiveness}%
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center font-mono text-navy-200">{risk.residualProbability}</td>
                  <td className="py-2 px-2 text-center font-mono text-navy-200">{risk.residualImpact}</td>
                  <td className="py-2 px-2 text-center">
                    <span className={cn('px-1.5 py-0.5 rounded font-mono font-bold border', getScoreColour(risk.residualScore, thresholds))}>
                      {risk.residualScore}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center text-navy-400 capitalize">{risk.velocity}</td>
                  <td className={cn('py-2 px-2 text-center font-bold border-r border-r-navy-700', getTrendColour(risk.trend))}>
                    {getTrendIcon(risk.trend)}
                  </td>

                  {/* Section C: Financial / Decision */}
                  <td className="py-2 px-2 text-right font-mono text-navy-400">{formatCurrency(risk.financialImpactLow)}</td>
                  <td className="py-2 px-2 text-right font-mono text-navy-300">{formatCurrency(risk.financialImpactMostLikely)}</td>
                  <td className="py-2 px-2 text-right font-mono text-navy-200">{formatCurrency(risk.financialImpactHigh)}</td>
                  <td className="py-2 px-2 text-right font-mono text-accent-primary font-medium">{formatCurrency(risk.expectedMonetaryValue)}</td>
                  <td className="py-2 px-2 text-right font-mono text-amber-400">{formatCurrency(risk.capitalAllocation)}</td>
                  <td className={cn('py-2 px-2 text-right font-mono', risk.ebitdaExposure > 10 ? 'text-red-400' : 'text-navy-300')}>
                    {risk.ebitdaExposure.toFixed(1)}%
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span className={cn('px-1.5 py-0.5 rounded text-2xs font-bold uppercase', getPriorityColour(risk.priority))}>
                      {risk.priority}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span className={cn('px-1.5 py-0.5 rounded text-2xs font-medium uppercase', getTreatmentColour(risk.treatment))}>
                      {risk.treatment}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-navy-400 max-w-[180px] truncate" title={risk.responseStrategy}>{risk.responseStrategy}</td>
                  <td className="py-2 px-2 text-right font-mono text-navy-400">{risk.insuranceCoverage > 0 ? formatCurrency(risk.insuranceCoverage) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Risk Detail Panel */}
      {selectedRiskId && (
        <div className="glass-card p-5">
          {(() => {
            const risk = comprehensiveRisks.find(r => r.id === selectedRiskId);
            if (!risk) return null;
            return (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono text-navy-500">{risk.id}</span>
                    <h3 className="text-lg font-semibold text-navy-100">{risk.title}</h3>
                    <p className="text-sm text-navy-400">{risk.category} · {risk.department}</p>
                  </div>
                  <button onClick={() => setSelectedRiskId(null)} className="text-navy-400 hover:text-navy-200">×</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-accent-primary uppercase">Description</h4>
                    <p className="text-sm text-navy-300">{risk.description}</p>
                    <h4 className="text-xs font-semibold text-accent-primary uppercase mt-3">Cause</h4>
                    <p className="text-sm text-navy-400">{risk.cause}</p>
                    <h4 className="text-xs font-semibold text-accent-primary uppercase mt-3">Effect</h4>
                    <p className="text-sm text-navy-400">{risk.effect}</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-amber-400 uppercase">Controls</h4>
                    <div className="flex flex-wrap gap-1">
                      {risk.controlsInPlace.map((ctrl, i) => (
                        <span key={i} className="px-2 py-0.5 bg-navy-800/50 rounded text-xs text-navy-300">{ctrl}</span>
                      ))}
                    </div>
                    <h4 className="text-xs font-semibold text-amber-400 uppercase mt-3">Response Strategy</h4>
                    <p className="text-sm text-navy-300">{risk.responseStrategy}</p>
                    <h4 className="text-xs font-semibold text-amber-400 uppercase mt-3">Contingency Plan</h4>
                    <p className="text-sm text-navy-400">{risk.contingencyPlan}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-emerald-400 uppercase">Financial Summary</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 bg-navy-800/30 rounded">
                        <p className="text-2xs text-navy-500">Expected Monetary Value</p>
                        <p className="text-lg font-bold text-accent-primary">£{formatCurrency(risk.expectedMonetaryValue)}</p>
                      </div>
                      <div className="p-2 bg-navy-800/30 rounded">
                        <p className="text-2xs text-navy-500">Capital Allocation</p>
                        <p className="text-lg font-bold text-amber-400">£{formatCurrency(risk.capitalAllocation)}</p>
                      </div>
                      <div className="p-2 bg-navy-800/30 rounded">
                        <p className="text-2xs text-navy-500">EBITDA Exposure</p>
                        <p className={cn('text-lg font-bold', risk.ebitdaExposure > 10 ? 'text-red-400' : 'text-navy-100')}>{risk.ebitdaExposure.toFixed(1)}%</p>
                      </div>
                      <div className="p-2 bg-navy-800/30 rounded">
                        <p className="text-2xs text-navy-500">Insurance Coverage</p>
                        <p className="text-lg font-bold text-navy-100">{risk.insuranceCoverage > 0 ? `£${formatCurrency(risk.insuranceCoverage)}` : 'None'}</p>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-navy-800/20 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-navy-400">Residual Score</span>
                        <span className={cn('px-2 py-0.5 rounded font-mono font-bold border', getScoreColour(risk.residualScore, thresholds))}>
                          {risk.residualScore}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-navy-400">Priority</span>
                        <span className={cn('px-2 py-0.5 rounded text-xs font-bold uppercase', getPriorityColour(risk.priority))}>
                          {risk.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Formula Reference */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-navy-100 mb-3">Formula Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-navy-400">
          <div>
            <p className="font-medium text-navy-300 mb-1">Inherent Score</p>
            <p className="font-mono bg-navy-800/30 px-2 py-1 rounded">= Probability × Impact</p>
          </div>
          <div>
            <p className="font-medium text-navy-300 mb-1">Residual Score</p>
            <p className="font-mono bg-navy-800/30 px-2 py-1 rounded">= (Inh. Score) × (1 - Control %)</p>
          </div>
          <div>
            <p className="font-medium text-navy-300 mb-1">EMV (Triangular)</p>
            <p className="font-mono bg-navy-800/30 px-2 py-1 rounded">= (Low + Likely + High) / 3 × P</p>
          </div>
          <div>
            <p className="font-medium text-navy-300 mb-1">Capital Allocation</p>
            <p className="font-mono bg-navy-800/30 px-2 py-1 rounded">= High Impact × 0.9 (90% conf.)</p>
          </div>
          <div>
            <p className="font-medium text-navy-300 mb-1">EBITDA Exposure</p>
            <p className="font-mono bg-navy-800/30 px-2 py-1 rounded">= (High Impact / Annual EBITDA) × 100</p>
          </div>
          <div>
            <p className="font-medium text-navy-300 mb-1">Priority</p>
            <p className="font-mono bg-navy-800/30 px-2 py-1 rounded">= f(EMV, Residual, Velocity)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
