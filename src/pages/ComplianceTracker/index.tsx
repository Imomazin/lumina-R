// Compliance Tracker — Regulatory obligation tracking, compliance dashboard, deadline calendar, and action items
// Follows Lumina-R patterns: glass-card, navy color scheme, accent-primary, isDataActive gating

import { useState, useMemo } from 'react';
import { PageHeader, SectionCard } from '../../components';
import { useData } from '../../context/DataContext';
import { cn } from '../../utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface RegulatoryObligation {
  id: string;
  regulation: string;
  description: string;
  category: 'data_protection' | 'operational_resilience' | 'financial_reporting' | 'conduct' | 'aml_kyc';
  owner: string;
  department: string;
  complianceStatus: 'compliant' | 'partially_compliant' | 'non_compliant';
  dueDate: string;
  lastAssessmentDate: string;
  evidenceStatus: 'documented' | 'pending' | 'missing';
  priority: 'critical' | 'high' | 'medium' | 'low';
}

interface ActionItem {
  id: string;
  obligationId: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: 'open' | 'in_progress' | 'completed';
}

// ---------------------------------------------------------------------------
// Sample Data — 12 regulatory obligations across GDPR, DORA, SOX, Basel III, MiFID II, SMCR, etc.
// ---------------------------------------------------------------------------
const sampleObligations: RegulatoryObligation[] = [
  {
    id: 'OBL-001',
    regulation: 'GDPR',
    description: 'Maintain lawful basis records for all personal data processing activities across EU operations',
    category: 'data_protection',
    owner: 'Emma Richardson',
    department: 'Legal & Compliance',
    complianceStatus: 'compliant',
    dueDate: '2026-03-31',
    lastAssessmentDate: '2026-01-15',
    evidenceStatus: 'documented',
    priority: 'critical',
  },
  {
    id: 'OBL-002',
    regulation: 'GDPR',
    description: 'Implement and test Data Subject Access Request (DSAR) response workflow within 30-day SLA',
    category: 'data_protection',
    owner: 'Emma Richardson',
    department: 'Legal & Compliance',
    complianceStatus: 'partially_compliant',
    dueDate: '2026-02-28',
    lastAssessmentDate: '2026-01-20',
    evidenceStatus: 'pending',
    priority: 'high',
  },
  {
    id: 'OBL-003',
    regulation: 'DORA',
    description: 'Establish ICT risk management framework with incident classification and reporting procedures',
    category: 'operational_resilience',
    owner: 'Marcus Webb',
    department: 'IT Security',
    complianceStatus: 'partially_compliant',
    dueDate: '2026-04-15',
    lastAssessmentDate: '2026-02-01',
    evidenceStatus: 'pending',
    priority: 'critical',
  },
  {
    id: 'OBL-004',
    regulation: 'DORA',
    description: 'Conduct digital operational resilience testing including threat-led penetration testing (TLPT)',
    category: 'operational_resilience',
    owner: 'Marcus Webb',
    department: 'IT Security',
    complianceStatus: 'non_compliant',
    dueDate: '2026-02-15',
    lastAssessmentDate: '2025-12-10',
    evidenceStatus: 'missing',
    priority: 'critical',
  },
  {
    id: 'OBL-005',
    regulation: 'SOX',
    description: 'Complete Section 404 internal controls over financial reporting assessment and auditor attestation',
    category: 'financial_reporting',
    owner: 'Catherine Lloyd',
    department: 'Finance',
    complianceStatus: 'compliant',
    dueDate: '2026-06-30',
    lastAssessmentDate: '2026-02-10',
    evidenceStatus: 'documented',
    priority: 'high',
  },
  {
    id: 'OBL-006',
    regulation: 'SOX',
    description: 'Ensure IT general controls (ITGC) for financial systems meet audit requirements including access management',
    category: 'financial_reporting',
    owner: 'Catherine Lloyd',
    department: 'Finance',
    complianceStatus: 'partially_compliant',
    dueDate: '2026-05-31',
    lastAssessmentDate: '2026-01-25',
    evidenceStatus: 'pending',
    priority: 'high',
  },
  {
    id: 'OBL-007',
    regulation: 'Basel III',
    description: 'Maintain minimum Common Equity Tier 1 (CET1) capital ratio above regulatory threshold of 4.5%',
    category: 'financial_reporting',
    owner: 'David Hargreaves',
    department: 'Treasury',
    complianceStatus: 'compliant',
    dueDate: '2026-03-31',
    lastAssessmentDate: '2026-02-05',
    evidenceStatus: 'documented',
    priority: 'critical',
  },
  {
    id: 'OBL-008',
    regulation: 'MiFID II',
    description: 'Implement best execution policy with transaction cost analysis and venue selection documentation',
    category: 'conduct',
    owner: 'Sarah Patel',
    department: 'Trading',
    complianceStatus: 'compliant',
    dueDate: '2026-04-30',
    lastAssessmentDate: '2026-02-12',
    evidenceStatus: 'documented',
    priority: 'medium',
  },
  {
    id: 'OBL-009',
    regulation: 'MiFID II',
    description: 'Conduct product governance suitability assessments and target market analysis for all distributed products',
    category: 'conduct',
    owner: 'Sarah Patel',
    department: 'Trading',
    complianceStatus: 'partially_compliant',
    dueDate: '2026-03-15',
    lastAssessmentDate: '2026-01-30',
    evidenceStatus: 'pending',
    priority: 'medium',
  },
  {
    id: 'OBL-010',
    regulation: 'SMCR',
    description: 'Maintain up-to-date Statements of Responsibilities and Management Responsibilities Maps for all SMFs',
    category: 'conduct',
    owner: 'Jonathan Meyer',
    department: 'Human Resources',
    complianceStatus: 'compliant',
    dueDate: '2026-05-01',
    lastAssessmentDate: '2026-02-18',
    evidenceStatus: 'documented',
    priority: 'high',
  },
  {
    id: 'OBL-011',
    regulation: 'AML/CFT',
    description: 'Execute enterprise-wide money laundering risk assessment and update customer due diligence procedures',
    category: 'aml_kyc',
    owner: 'Rebecca Stone',
    department: 'Financial Crime',
    complianceStatus: 'non_compliant',
    dueDate: '2026-01-31',
    lastAssessmentDate: '2025-11-20',
    evidenceStatus: 'missing',
    priority: 'critical',
  },
  {
    id: 'OBL-012',
    regulation: 'Basel III',
    description: 'Submit Liquidity Coverage Ratio (LCR) and Net Stable Funding Ratio (NSFR) reports to the regulator',
    category: 'financial_reporting',
    owner: 'David Hargreaves',
    department: 'Treasury',
    complianceStatus: 'compliant',
    dueDate: '2026-03-31',
    lastAssessmentDate: '2026-02-15',
    evidenceStatus: 'documented',
    priority: 'high',
  },
];

// ---------------------------------------------------------------------------
// Sample Action Items — remediation actions for non-compliant / partially compliant
// ---------------------------------------------------------------------------
const sampleActions: ActionItem[] = [
  {
    id: 'ACT-001',
    obligationId: 'OBL-002',
    title: 'Automate DSAR intake pipeline and integrate with CRM for 30-day tracking',
    assignee: 'Emma Richardson',
    dueDate: '2026-02-25',
    status: 'in_progress',
  },
  {
    id: 'ACT-002',
    obligationId: 'OBL-003',
    title: 'Draft ICT incident classification taxonomy aligned with DORA Article 18 requirements',
    assignee: 'Marcus Webb',
    dueDate: '2026-03-10',
    status: 'open',
  },
  {
    id: 'ACT-003',
    obligationId: 'OBL-004',
    title: 'Engage third-party provider for threat-led penetration testing engagement',
    assignee: 'Marcus Webb',
    dueDate: '2026-03-01',
    status: 'open',
  },
  {
    id: 'ACT-004',
    obligationId: 'OBL-004',
    title: 'Remediate critical findings from previous vulnerability assessment before TLPT',
    assignee: 'IT Security Team',
    dueDate: '2026-02-28',
    status: 'in_progress',
  },
  {
    id: 'ACT-005',
    obligationId: 'OBL-006',
    title: 'Implement privileged access management (PAM) solution for financial systems',
    assignee: 'Catherine Lloyd',
    dueDate: '2026-04-15',
    status: 'open',
  },
  {
    id: 'ACT-006',
    obligationId: 'OBL-009',
    title: 'Complete target market analysis for 12 newly distributed structured products',
    assignee: 'Sarah Patel',
    dueDate: '2026-03-01',
    status: 'in_progress',
  },
  {
    id: 'ACT-007',
    obligationId: 'OBL-011',
    title: 'Conduct enterprise-wide ML/TF risk assessment using updated methodology',
    assignee: 'Rebecca Stone',
    dueDate: '2026-02-20',
    status: 'in_progress',
  },
  {
    id: 'ACT-008',
    obligationId: 'OBL-011',
    title: 'Update enhanced due diligence (EDD) procedures for high-risk customer segments',
    assignee: 'Rebecca Stone',
    dueDate: '2026-03-15',
    status: 'open',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const TODAY = '2026-02-22';

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - new Date(TODAY).getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getComplianceBadge(status: string): string {
  switch (status) {
    case 'compliant': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'partially_compliant': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'non_compliant': return 'bg-red-500/20 text-red-400 border-red-500/30';
    default: return 'bg-navy-700 text-navy-300 border-navy-600';
  }
}

function getComplianceLabel(status: string): string {
  switch (status) {
    case 'compliant': return 'Compliant';
    case 'partially_compliant': return 'Partial';
    case 'non_compliant': return 'Non-Compliant';
    default: return status;
  }
}

function getEvidenceBadge(status: string): string {
  switch (status) {
    case 'documented': return 'bg-emerald-500/15 text-emerald-400';
    case 'pending': return 'bg-amber-500/15 text-amber-400';
    case 'missing': return 'bg-red-500/15 text-red-400';
    default: return 'bg-navy-700 text-navy-300';
  }
}

function getPriorityBadge(priority: string): string {
  switch (priority) {
    case 'critical': return 'bg-slate-800 text-white border-slate-600';
    case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    default: return 'bg-navy-700 text-navy-300 border-navy-600';
  }
}

function getCategoryLabel(category: string): string {
  switch (category) {
    case 'data_protection': return 'Data Protection';
    case 'operational_resilience': return 'Operational Resilience';
    case 'financial_reporting': return 'Financial Reporting';
    case 'conduct': return 'Conduct';
    case 'aml_kyc': return 'AML/KYC';
    default: return category;
  }
}

function getCategoryBadge(category: string): string {
  switch (category) {
    case 'data_protection': return 'bg-blue-500/15 text-blue-400';
    case 'operational_resilience': return 'bg-purple-500/15 text-purple-400';
    case 'financial_reporting': return 'bg-emerald-500/15 text-emerald-400';
    case 'conduct': return 'bg-amber-500/15 text-amber-400';
    case 'aml_kyc': return 'bg-red-500/15 text-red-400';
    default: return 'bg-navy-700 text-navy-300';
  }
}

function getActionStatusBadge(status: string): string {
  switch (status) {
    case 'open': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'in_progress': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    default: return 'bg-navy-700 text-navy-300 border-navy-600';
  }
}

function getUrgencyColor(days: number): { dot: string; border: string; bg: string; text: string } {
  if (days < 0) return { dot: 'bg-red-400', border: 'border-red-500/20', bg: 'bg-red-500/5', text: 'text-red-400' };
  if (days <= 30) return { dot: 'bg-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/5', text: 'text-amber-400' };
  return { dot: 'bg-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', text: 'text-emerald-400' };
}

// ---------------------------------------------------------------------------
// CSV Export
// ---------------------------------------------------------------------------
function exportComplianceCSV(obligations: RegulatoryObligation[]): void {
  const headers = [
    'Obligation ID', 'Regulation', 'Description', 'Category', 'Owner', 'Department',
    'Compliance Status', 'Due Date', 'Last Assessment', 'Evidence Status', 'Priority',
  ];

  const rows = obligations.map(o => [
    o.id,
    o.regulation,
    `"${o.description}"`,
    getCategoryLabel(o.category),
    `"${o.owner}"`,
    `"${o.department}"`,
    getComplianceLabel(o.complianceStatus),
    o.dueDate,
    o.lastAssessmentDate,
    o.evidenceStatus,
    o.priority,
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `compliance-tracker-${TODAY}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ComplianceTracker() {
  const { isDataActive } = useData();
  const [activeTab, setActiveTab] = useState<'obligations' | 'dashboard' | 'deadlines' | 'actions'>('obligations');
  const [regulationFilter, setRegulationFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedObligationId, setSelectedObligationId] = useState<string | null>(null);

  // Gate all data behind isDataActive
  const obligations: RegulatoryObligation[] = isDataActive ? sampleObligations : [];
  const actions: ActionItem[] = isDataActive ? sampleActions : [];

  // Filtering
  const filteredObligations = useMemo(() => {
    let result = [...obligations];
    if (regulationFilter !== 'all') {
      result = result.filter(o => o.regulation === regulationFilter);
    }
    if (statusFilter !== 'all') {
      result = result.filter(o => o.complianceStatus === statusFilter);
    }
    if (categoryFilter !== 'all') {
      result = result.filter(o => o.category === categoryFilter);
    }
    return result;
  }, [obligations, regulationFilter, statusFilter, categoryFilter]);

  // Summary statistics
  const stats = useMemo(() => {
    if (obligations.length === 0) {
      return { total: 0, compliant: 0, partial: 0, nonCompliant: 0, overdue: 0 };
    }
    const total = obligations.length;
    const compliant = obligations.filter(o => o.complianceStatus === 'compliant').length;
    const partial = obligations.filter(o => o.complianceStatus === 'partially_compliant').length;
    const nonCompliant = obligations.filter(o => o.complianceStatus === 'non_compliant').length;
    const overdue = obligations.filter(o => daysUntil(o.dueDate) < 0).length;
    return { total, compliant, partial, nonCompliant, overdue };
  }, [obligations]);

  // Compliance % by regulation for the dashboard chart
  const complianceByRegulation = useMemo(() => {
    if (obligations.length === 0) return [];
    const regs = [...new Set(obligations.map(o => o.regulation))].sort();
    return regs.map(reg => {
      const regObligations = obligations.filter(o => o.regulation === reg);
      const total = regObligations.length;
      const compliantCount = regObligations.filter(o => o.complianceStatus === 'compliant').length;
      const partialCount = regObligations.filter(o => o.complianceStatus === 'partially_compliant').length;
      const nonCompliantCount = regObligations.filter(o => o.complianceStatus === 'non_compliant').length;
      // Compliant = 100%, Partial = 50%, Non-Compliant = 0%
      const pct = total > 0 ? Math.round(((compliantCount * 100) + (partialCount * 50)) / total) : 0;
      return { regulation: reg, total, compliantCount, partialCount, nonCompliantCount, pct };
    });
  }, [obligations]);

  // Deadlines sorted chronologically
  const deadlines = useMemo(() => {
    return [...obligations].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [obligations]);

  // Unique regulation list for filter
  const regulationOptions = useMemo(() => {
    return [...new Set(obligations.map(o => o.regulation))].sort();
  }, [obligations]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  // Zero-state when data is not active
  if (!isDataActive) {
    return (
      <div className="space-y-4 animate-fade-in">
        <PageHeader
          title="Compliance Tracker"
          subtitle="Regulatory obligation tracking, compliance monitoring, and remediation management"
        />
        <div className="glass-card p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-navy-800/60 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-navy-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-navy-300 mb-2">No data available</h3>
          <p className="text-sm text-navy-500 max-w-md">
            Upload a dataset or connect your AI Advisor to begin compliance tracking.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Compliance Tracker"
        subtitle="Regulatory obligation tracking, compliance monitoring, and remediation management"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportComplianceCSV(filteredObligations)}
              className="btn-secondary text-sm flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export CSV
            </button>
          </div>
        }
      />

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Obligations', value: stats.total, color: 'text-navy-100' },
          { label: 'Compliant', value: stats.compliant, color: 'text-emerald-400' },
          { label: 'Partially Compliant', value: stats.partial, color: 'text-amber-400' },
          { label: 'Non-Compliant', value: stats.nonCompliant, color: 'text-red-400' },
          { label: 'Overdue Deadlines', value: stats.overdue, color: stats.overdue > 0 ? 'text-red-400' : 'text-emerald-400' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4 flex flex-col items-center justify-center">
            <span className={cn('text-2xl font-bold', stat.color)}>{stat.value}</span>
            <span className="text-2xs text-navy-500 uppercase mt-1 text-center">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ── Tab Navigation ── */}
      <div className="glass-card p-1 flex items-center gap-1">
        {([
          { key: 'obligations', label: 'Regulatory Obligations' },
          { key: 'dashboard', label: 'Compliance Dashboard' },
          { key: 'deadlines', label: 'Deadline Calendar' },
          { key: 'actions', label: 'Action Items' },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === tab.key
                ? 'bg-accent-primary/15 text-accent-primary'
                : 'text-navy-400 hover:text-navy-200 hover:bg-navy-800/50'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================================================================= */}
      {/* TAB: Regulatory Obligations Table                                  */}
      {/* ================================================================= */}
      {activeTab === 'obligations' && (
        <SectionCard
          title="Regulatory Obligations"
          subtitle={`${filteredObligations.length} of ${obligations.length} obligations shown`}
          actions={
            <div className="flex items-center gap-2 flex-wrap">
              {/* Regulation filter */}
              <select
                value={regulationFilter}
                onChange={e => setRegulationFilter(e.target.value)}
                className="px-3 py-1.5 bg-navy-800/50 border border-navy-700 rounded-lg text-xs text-navy-200 focus:outline-none focus:border-accent-primary/50"
              >
                <option value="all">All Regulations</option>
                {regulationOptions.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-navy-800/50 border border-navy-700 rounded-lg text-xs text-navy-200 focus:outline-none focus:border-accent-primary/50"
              >
                <option value="all">All Statuses</option>
                <option value="compliant">Compliant</option>
                <option value="partially_compliant">Partially Compliant</option>
                <option value="non_compliant">Non-Compliant</option>
              </select>
              {/* Category filter */}
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 bg-navy-800/50 border border-navy-700 rounded-lg text-xs text-navy-200 focus:outline-none focus:border-accent-primary/50"
              >
                <option value="all">All Categories</option>
                <option value="data_protection">Data Protection</option>
                <option value="operational_resilience">Operational Resilience</option>
                <option value="financial_reporting">Financial Reporting</option>
                <option value="conduct">Conduct</option>
                <option value="aml_kyc">AML/KYC</option>
              </select>
            </div>
          }
          noPadding
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-navy-700 bg-navy-900/50">
                  <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[80px]">ID</th>
                  <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[90px]">Regulation</th>
                  <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[250px]">Description</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[130px]">Category</th>
                  <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[120px]">Owner</th>
                  <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[110px]">Department</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[110px]">Status</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[90px]">Due Date</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[100px]">Last Assessed</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[90px]">Evidence</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[80px]">Priority</th>
                </tr>
              </thead>
              <tbody>
                {filteredObligations.map((obl, idx) => {
                  const days = daysUntil(obl.dueDate);
                  const overdue = days < 0;
                  return (
                    <tr
                      key={obl.id}
                      onClick={() => setSelectedObligationId(obl.id === selectedObligationId ? null : obl.id)}
                      className={cn(
                        'border-b border-navy-800 hover:bg-navy-800/30 cursor-pointer transition-colors',
                        selectedObligationId === obl.id && 'bg-accent-primary/5',
                        idx % 2 === 0 && 'bg-navy-900/20'
                      )}
                    >
                      <td className="py-2.5 px-3 font-mono text-accent-primary font-medium">{obl.id}</td>
                      <td className="py-2.5 px-3 text-navy-100 font-medium">{obl.regulation}</td>
                      <td className="py-2.5 px-3 text-navy-300 max-w-[250px]" title={obl.description}>
                        <span className="line-clamp-2">{obl.description}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={cn('px-2 py-0.5 rounded text-2xs font-medium', getCategoryBadge(obl.category))}>
                          {getCategoryLabel(obl.category)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-navy-300">{obl.owner}</td>
                      <td className="py-2.5 px-3 text-navy-400">{obl.department}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={cn('px-2 py-0.5 rounded text-2xs font-medium uppercase border', getComplianceBadge(obl.complianceStatus))}>
                          {getComplianceLabel(obl.complianceStatus)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={cn('text-xs', overdue ? 'text-red-400 font-medium' : 'text-navy-400')}>
                          {formatDate(obl.dueDate)}
                          {overdue && <span className="ml-1 text-2xs">(overdue)</span>}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-navy-400">{formatDate(obl.lastAssessmentDate)}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={cn('px-2 py-0.5 rounded text-2xs font-medium capitalize', getEvidenceBadge(obl.evidenceStatus))}>
                          {obl.evidenceStatus}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={cn('px-2 py-0.5 rounded text-2xs font-bold uppercase border', getPriorityBadge(obl.priority))}>
                          {obl.priority}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {filteredObligations.length === 0 && (
                  <tr>
                    <td colSpan={11} className="py-10 text-center text-navy-500 text-sm">
                      No obligations match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Detail panel for selected obligation */}
          {selectedObligationId && (() => {
            const obl = obligations.find(o => o.id === selectedObligationId);
            if (!obl) return null;
            const relatedActions = actions.filter(a => a.obligationId === obl.id);
            return (
              <div className="p-5 border-t border-navy-700/50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs font-mono text-navy-500">{obl.id}</span>
                    <h3 className="text-lg font-semibold text-navy-100">{obl.regulation} - {getCategoryLabel(obl.category)}</h3>
                    <p className="text-sm text-navy-400 mt-1">{obl.description}</p>
                  </div>
                  <button onClick={() => setSelectedObligationId(null)} className="text-navy-400 hover:text-navy-200 text-lg">
                    x
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="p-3 bg-navy-800/30 rounded-lg">
                    <p className="text-2xs text-navy-500 uppercase">Owner</p>
                    <p className="text-sm font-medium text-navy-200 mt-1">{obl.owner}</p>
                    <p className="text-2xs text-navy-500">{obl.department}</p>
                  </div>
                  <div className="p-3 bg-navy-800/30 rounded-lg">
                    <p className="text-2xs text-navy-500 uppercase">Compliance Status</p>
                    <span className={cn('inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium uppercase border', getComplianceBadge(obl.complianceStatus))}>
                      {getComplianceLabel(obl.complianceStatus)}
                    </span>
                  </div>
                  <div className="p-3 bg-navy-800/30 rounded-lg">
                    <p className="text-2xs text-navy-500 uppercase">Due Date</p>
                    <p className={cn('text-sm font-medium mt-1', daysUntil(obl.dueDate) < 0 ? 'text-red-400' : 'text-navy-200')}>
                      {formatDate(obl.dueDate)}
                    </p>
                  </div>
                  <div className="p-3 bg-navy-800/30 rounded-lg">
                    <p className="text-2xs text-navy-500 uppercase">Evidence</p>
                    <span className={cn('inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium capitalize', getEvidenceBadge(obl.evidenceStatus))}>
                      {obl.evidenceStatus}
                    </span>
                  </div>
                </div>
                {relatedActions.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-accent-primary uppercase mb-2">Related Action Items</h4>
                    <div className="space-y-2">
                      {relatedActions.map(act => (
                        <div key={act.id} className="flex items-center justify-between p-2 bg-navy-800/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-2xs text-navy-500">{act.id}</span>
                            <span className="text-xs text-navy-200">{act.title}</span>
                          </div>
                          <span className={cn('px-2 py-0.5 rounded text-2xs font-medium uppercase border', getActionStatusBadge(act.status))}>
                            {act.status.replace('_', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </SectionCard>
      )}

      {/* ================================================================= */}
      {/* TAB: Compliance Dashboard                                          */}
      {/* ================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <SectionCard
            title="Compliance by Regulation"
            subtitle="Weighted compliance percentage across regulatory frameworks"
          >
            {complianceByRegulation.length === 0 ? (
              <p className="text-center text-navy-500 py-8">No data to display.</p>
            ) : (
              <>
                {/* Legend */}
                <div className="flex flex-wrap items-center gap-4 text-xs mb-6">
                  <span className="text-navy-400 font-medium">Legend:</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-500/40" /> Compliant
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-amber-500/40" /> Partially Compliant
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-red-500/40" /> Non-Compliant
                  </span>
                </div>

                {/* Bar chart using divs */}
                <div className="space-y-5">
                  {complianceByRegulation.map(({ regulation, total, compliantCount, partialCount, nonCompliantCount, pct }) => {
                    const compliantPct = total > 0 ? Math.round((compliantCount / total) * 100) : 0;
                    const partialPct = total > 0 ? Math.round((partialCount / total) * 100) : 0;
                    const nonCompliantPct = total > 0 ? Math.round((nonCompliantCount / total) * 100) : 0;

                    return (
                      <div key={regulation}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-navy-100 w-24">{regulation}</span>
                            <span className="text-2xs text-navy-500">{total} obligation{total !== 1 ? 's' : ''}</span>
                          </div>
                          <span className={cn(
                            'text-sm font-mono font-bold',
                            pct >= 80 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400'
                          )}>
                            {pct}%
                          </span>
                        </div>
                        {/* Stacked bar */}
                        <div className="h-6 bg-navy-800 rounded-full overflow-hidden flex">
                          {compliantPct > 0 && (
                            <div
                              className="h-full bg-emerald-500/60 flex items-center justify-center text-2xs text-white font-medium transition-all"
                              style={{ width: `${compliantPct}%` }}
                            >
                              {compliantPct >= 15 && `${compliantCount}`}
                            </div>
                          )}
                          {partialPct > 0 && (
                            <div
                              className="h-full bg-amber-500/60 flex items-center justify-center text-2xs text-white font-medium transition-all"
                              style={{ width: `${partialPct}%` }}
                            >
                              {partialPct >= 15 && `${partialCount}`}
                            </div>
                          )}
                          {nonCompliantPct > 0 && (
                            <div
                              className="h-full bg-red-500/60 flex items-center justify-center text-2xs text-white font-medium transition-all"
                              style={{ width: `${nonCompliantPct}%` }}
                            >
                              {nonCompliantPct >= 15 && `${nonCompliantCount}`}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Overall compliance */}
                <div className="mt-8 p-4 bg-navy-800/20 rounded-lg">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-navy-400">Overall Compliance Score</span>
                    {(() => {
                      const totalObl = obligations.length;
                      const overallPct = totalObl > 0
                        ? Math.round(
                            ((obligations.filter(o => o.complianceStatus === 'compliant').length * 100) +
                             (obligations.filter(o => o.complianceStatus === 'partially_compliant').length * 50)) / totalObl
                          )
                        : 0;
                      return (
                        <span className={cn(
                          'font-mono font-bold text-lg',
                          overallPct >= 80 ? 'text-emerald-400' : overallPct >= 50 ? 'text-amber-400' : 'text-red-400'
                        )}>
                          {overallPct}%
                        </span>
                      );
                    })()}
                  </div>
                  <div className="h-3 bg-navy-800 rounded-full overflow-hidden">
                    {(() => {
                      const totalObl = obligations.length;
                      const overallPct = totalObl > 0
                        ? Math.round(
                            ((obligations.filter(o => o.complianceStatus === 'compliant').length * 100) +
                             (obligations.filter(o => o.complianceStatus === 'partially_compliant').length * 50)) / totalObl
                          )
                        : 0;
                      const barColor = overallPct >= 80 ? 'bg-emerald-500' : overallPct >= 50 ? 'bg-amber-500' : 'bg-red-500';
                      return (
                        <div
                          className={cn('h-full rounded-full transition-all', barColor)}
                          style={{ width: `${overallPct}%` }}
                        />
                      );
                    })()}
                  </div>
                </div>
              </>
            )}
          </SectionCard>

          {/* Compliance by Category */}
          <SectionCard
            title="Compliance by Category"
            subtitle="Status distribution across regulatory categories"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(['data_protection', 'operational_resilience', 'financial_reporting', 'conduct', 'aml_kyc'] as const).map(cat => {
                const catObligations = obligations.filter(o => o.category === cat);
                if (catObligations.length === 0) return null;
                const catCompliant = catObligations.filter(o => o.complianceStatus === 'compliant').length;
                const catPartial = catObligations.filter(o => o.complianceStatus === 'partially_compliant').length;
                const catNonCompliant = catObligations.filter(o => o.complianceStatus === 'non_compliant').length;
                const catPct = Math.round(((catCompliant * 100) + (catPartial * 50)) / catObligations.length);

                return (
                  <div key={cat} className="p-4 bg-navy-800/20 rounded-lg border border-navy-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className={cn('px-2 py-0.5 rounded text-xs font-medium', getCategoryBadge(cat))}>
                        {getCategoryLabel(cat)}
                      </span>
                      <span className={cn(
                        'text-lg font-bold font-mono',
                        catPct >= 80 ? 'text-emerald-400' : catPct >= 50 ? 'text-amber-400' : 'text-red-400'
                      )}>
                        {catPct}%
                      </span>
                    </div>
                    <div className="h-2 bg-navy-800 rounded-full overflow-hidden mb-3">
                      <div
                        className={cn('h-full rounded-full', catPct >= 80 ? 'bg-emerald-500' : catPct >= 50 ? 'bg-amber-500' : 'bg-red-500')}
                        style={{ width: `${catPct}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-3 text-2xs">
                      <span className="text-emerald-400">{catCompliant} compliant</span>
                      <span className="text-amber-400">{catPartial} partial</span>
                      <span className="text-red-400">{catNonCompliant} non-compliant</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB: Deadline Calendar                                             */}
      {/* ================================================================= */}
      {activeTab === 'deadlines' && (
        <SectionCard
          title="Compliance Deadlines"
          subtitle="Upcoming and overdue regulatory deadlines ordered chronologically"
        >
          <div className="space-y-3">
            {/* Timeline header legend */}
            <div className="flex items-center gap-3 text-xs text-navy-400 mb-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Overdue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Due within 30 days
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> On track
              </span>
            </div>

            {deadlines.map(obl => {
              const days = daysUntil(obl.dueDate);
              const urgency = getUrgencyColor(days);
              const timeLabel = days < 0
                ? `${Math.abs(days)} days overdue`
                : days === 0
                ? 'Due today'
                : `In ${days} days`;

              return (
                <div key={obl.id} className={cn('flex items-center gap-4 p-4 rounded-lg border transition-colors', urgency.border, urgency.bg)}>
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <span className={cn('w-3 h-3 rounded-full', urgency.dot)} />
                    <span className="w-px h-4 bg-navy-700 mt-1" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-accent-primary">{obl.id}</span>
                      <span className="text-sm text-navy-100 font-medium">{obl.regulation}</span>
                      <span className={cn('px-2 py-0.5 rounded text-2xs font-medium uppercase border', getComplianceBadge(obl.complianceStatus))}>
                        {getComplianceLabel(obl.complianceStatus)}
                      </span>
                    </div>
                    <p className="text-xs text-navy-400 mt-1 truncate">{obl.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={cn('px-1.5 py-0.5 rounded text-2xs font-medium', getCategoryBadge(obl.category))}>
                        {getCategoryLabel(obl.category)}
                      </span>
                      <span className="text-2xs text-navy-500">Owner: {obl.owner}</span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-navy-400">
                      Due: <span className="text-navy-200 font-medium">{formatDate(obl.dueDate)}</span>
                    </p>
                    <p className="text-xs text-navy-500 mt-0.5">
                      Last assessed: {formatDate(obl.lastAssessmentDate)}
                    </p>
                  </div>

                  {/* Countdown */}
                  <div className="flex-shrink-0 min-w-[120px] text-right">
                    <span className={cn('text-sm font-medium', urgency.text)}>
                      {timeLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}

      {/* ================================================================= */}
      {/* TAB: Action Items                                                  */}
      {/* ================================================================= */}
      {activeTab === 'actions' && (
        <div className="space-y-4">
          {/* Action summary counters */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: 'Open Actions',
                value: actions.filter(a => a.status === 'open').length,
                color: 'text-red-400',
                borderColor: actions.filter(a => a.status === 'open').length > 0 ? 'border-red-500/20' : 'border-emerald-500/20',
              },
              {
                label: 'In Progress',
                value: actions.filter(a => a.status === 'in_progress').length,
                color: 'text-amber-400',
                borderColor: actions.filter(a => a.status === 'in_progress').length > 0 ? 'border-amber-500/20' : 'border-emerald-500/20',
              },
              {
                label: 'Completed',
                value: actions.filter(a => a.status === 'completed').length,
                color: 'text-emerald-400',
                borderColor: 'border-emerald-500/20',
              },
            ].map((item) => (
              <div key={item.label} className={cn('glass-card p-4 border flex flex-col items-center', item.borderColor)}>
                <span className={cn('text-2xl font-bold', item.color)}>{item.value}</span>
                <span className="text-2xs text-navy-500 uppercase mt-1">{item.label}</span>
              </div>
            ))}
          </div>

          <SectionCard
            title="Remediation Actions"
            subtitle="Actions required for non-compliant and partially compliant obligations"
          >
            {actions.length === 0 ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm py-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                No remediation actions required.
              </div>
            ) : (
              <div className="space-y-3">
                {actions.map(act => {
                  const days = daysUntil(act.dueDate);
                  const overdue = days < 0;
                  const linkedObl = obligations.find(o => o.id === act.obligationId);

                  return (
                    <div key={act.id} className={cn(
                      'flex items-center gap-4 p-4 rounded-lg border transition-colors',
                      overdue ? 'border-red-500/20 bg-red-500/5' : 'border-navy-700/50 bg-navy-800/20'
                    )}>
                      {/* Action details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-accent-primary">{act.id}</span>
                          {linkedObl && (
                            <span className="text-2xs text-navy-500">
                              {linkedObl.regulation} ({act.obligationId})
                            </span>
                          )}
                          <span className={cn('px-2 py-0.5 rounded text-2xs font-medium uppercase border', getActionStatusBadge(act.status))}>
                            {act.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-navy-200 font-medium">{act.title}</p>
                        <div className="flex items-center gap-4 mt-1.5">
                          <span className="text-2xs text-navy-500">Assignee: <span className="text-navy-300">{act.assignee}</span></span>
                          {linkedObl && (
                            <span className={cn('px-1.5 py-0.5 rounded text-2xs font-medium', getCategoryBadge(linkedObl.category))}>
                              {getCategoryLabel(linkedObl.category)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Due date */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-navy-400">
                          Due: <span className={cn('font-medium', overdue ? 'text-red-400' : 'text-navy-200')}>{formatDate(act.dueDate)}</span>
                        </p>
                        <p className={cn('text-xs mt-0.5', overdue ? 'text-red-400' : days <= 14 ? 'text-amber-400' : 'text-emerald-400')}>
                          {overdue ? `${Math.abs(days)} days overdue` : days === 0 ? 'Due today' : `${days} days remaining`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

          {/* Non-compliant obligations needing attention */}
          <SectionCard
            title="Obligations Requiring Immediate Attention"
            subtitle="Non-compliant and overdue obligations with missing evidence"
          >
            {(() => {
              const urgent = obligations.filter(
                o => o.complianceStatus === 'non_compliant' || daysUntil(o.dueDate) < 0 || o.evidenceStatus === 'missing'
              );

              if (urgent.length === 0) {
                return (
                  <div className="flex items-center gap-2 text-emerald-400 text-sm py-4">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    All obligations are in good standing.
                  </div>
                );
              }

              return (
                <div className="space-y-2">
                  {urgent.map(obl => (
                    <div key={obl.id} className="flex items-center justify-between p-3 bg-navy-800/30 rounded-lg border border-red-500/10">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-accent-primary">{obl.id}</span>
                        <span className="text-sm text-navy-100 font-medium">{obl.regulation}</span>
                        <span className={cn('px-2 py-0.5 rounded text-2xs font-medium uppercase border', getComplianceBadge(obl.complianceStatus))}>
                          {getComplianceLabel(obl.complianceStatus)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {obl.evidenceStatus === 'missing' && (
                          <span className="px-2 py-0.5 rounded bg-red-500/15 text-red-400 text-2xs font-medium">Evidence Missing</span>
                        )}
                        {daysUntil(obl.dueDate) < 0 && (
                          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-xs font-medium">
                            {Math.abs(daysUntil(obl.dueDate))} days overdue
                          </span>
                        )}
                        <span className={cn('px-2 py-0.5 rounded text-2xs font-bold uppercase border', getPriorityBadge(obl.priority))}>
                          {obl.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </SectionCard>
        </div>
      )}
    </div>
  );
}
