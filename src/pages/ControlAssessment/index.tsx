// Control Assessment Tool — Enterprise control inventory, effectiveness analysis, gap detection, and testing schedule
// Follows Lumina-R patterns: glass-card, navy color scheme, accent-primary, isDataActive gating

import { useState, useMemo } from 'react';
import { PageHeader, SectionCard } from '../../components';
import { useData } from '../../context/DataContext';
import { controls } from '../../data';
import { cn } from '../../utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface AssessmentControl {
  id: string;
  name: string;
  description: string;
  type: 'preventive' | 'detective' | 'corrective';
  owner: string;
  linkedRiskIds: string[];
  effectiveness: number; // 0-100
  lastTestDate: string;
  nextTestDate: string;
  status: 'active' | 'under_review' | 'inactive';
  automationLevel: 'manual' | 'semi_automated' | 'automated';
  riskCategory: string;
}

// ---------------------------------------------------------------------------
// Sample control assessment data (maps from existing controls + enrichment)
// ---------------------------------------------------------------------------
const sampleControls: AssessmentControl[] = [
  {
    id: 'CTRL-001',
    name: 'Multi-Factor Authentication',
    description: 'Require MFA for all user access to critical systems',
    type: 'preventive',
    owner: 'IT Security Team',
    linkedRiskIds: ['RSK-001', 'RSK-002'],
    effectiveness: 92,
    lastTestDate: '2025-12-01',
    nextTestDate: '2026-03-01',
    status: 'active',
    automationLevel: 'automated',
    riskCategory: 'Cyber Security',
  },
  {
    id: 'CTRL-002',
    name: 'Data Encryption at Rest',
    description: 'Encrypt all sensitive data stored in databases and file systems',
    type: 'preventive',
    owner: 'Data Protection Team',
    linkedRiskIds: ['RSK-002', 'RSK-005'],
    effectiveness: 88,
    lastTestDate: '2025-11-15',
    nextTestDate: '2026-02-15',
    status: 'active',
    automationLevel: 'automated',
    riskCategory: 'Cyber Security',
  },
  {
    id: 'CTRL-003',
    name: 'Intrusion Detection System',
    description: 'Monitor network traffic for suspicious activity patterns',
    type: 'detective',
    owner: 'Security Operations',
    linkedRiskIds: ['RSK-001', 'RSK-003'],
    effectiveness: 78,
    lastTestDate: '2025-12-10',
    nextTestDate: '2026-01-10',
    status: 'active',
    automationLevel: 'automated',
    riskCategory: 'Cyber Security',
  },
  {
    id: 'CTRL-004',
    name: 'Vendor Risk Assessment',
    description: 'Regular assessment of third-party vendor security posture',
    type: 'preventive',
    owner: 'Vendor Management',
    linkedRiskIds: ['RSK-004', 'RSK-006'],
    effectiveness: 54,
    lastTestDate: '2025-10-01',
    nextTestDate: '2026-01-01',
    status: 'under_review',
    automationLevel: 'manual',
    riskCategory: 'Operational',
  },
  {
    id: 'CTRL-005',
    name: 'Incident Response Plan',
    description: 'Documented procedures for responding to security incidents',
    type: 'corrective',
    owner: 'Security Operations',
    linkedRiskIds: ['RSK-001', 'RSK-002', 'RSK-003'],
    effectiveness: 85,
    lastTestDate: '2025-11-01',
    nextTestDate: '2026-02-01',
    status: 'active',
    automationLevel: 'semi_automated',
    riskCategory: 'Cyber Security',
  },
  {
    id: 'CTRL-006',
    name: 'Access Review Process',
    description: 'Quarterly review of user access privileges',
    type: 'detective',
    owner: 'Identity Management',
    linkedRiskIds: ['RSK-001', 'RSK-008'],
    effectiveness: 70,
    lastTestDate: '2025-12-01',
    nextTestDate: '2026-03-01',
    status: 'active',
    automationLevel: 'semi_automated',
    riskCategory: 'Regulatory',
  },
  {
    id: 'CTRL-007',
    name: 'Backup & Recovery Testing',
    description: 'Regular testing of backup restoration procedures',
    type: 'corrective',
    owner: 'IT Operations',
    linkedRiskIds: ['RSK-003'],
    effectiveness: 82,
    lastTestDate: '2025-11-15',
    nextTestDate: '2026-02-15',
    status: 'active',
    automationLevel: 'semi_automated',
    riskCategory: 'Operational',
  },
  {
    id: 'CTRL-008',
    name: 'Regulatory Compliance Monitoring',
    description: 'Continuous monitoring of regulatory changes and compliance posture',
    type: 'detective',
    owner: 'Legal & Compliance',
    linkedRiskIds: ['RSK-002'],
    effectiveness: 45,
    lastTestDate: '2025-08-20',
    nextTestDate: '2025-11-20',
    status: 'inactive',
    automationLevel: 'manual',
    riskCategory: 'Regulatory',
  },
  {
    id: 'CTRL-009',
    name: 'Change Management Advisory Board',
    description: 'Governance board for evaluating and approving IT and operational changes',
    type: 'preventive',
    owner: 'COO Office',
    linkedRiskIds: ['RSK-005', 'RSK-008'],
    effectiveness: 73,
    lastTestDate: '2025-12-10',
    nextTestDate: '2026-03-10',
    status: 'active',
    automationLevel: 'manual',
    riskCategory: 'Strategic',
  },
  {
    id: 'CTRL-010',
    name: 'Financial Transaction Monitoring',
    description: 'Automated monitoring of financial transactions for anomalies and fraud patterns',
    type: 'detective',
    owner: 'Finance Team',
    linkedRiskIds: ['RSK-004', 'RSK-007'],
    effectiveness: 91,
    lastTestDate: '2025-12-20',
    nextTestDate: '2026-03-20',
    status: 'active',
    automationLevel: 'automated',
    riskCategory: 'Financial',
  },
];

// All risk IDs that exist in the enterprise
const allRiskIds = [
  'RSK-001', 'RSK-002', 'RSK-003', 'RSK-004', 'RSK-005',
  'RSK-006', 'RSK-007', 'RSK-008', 'RSK-009', 'RSK-010',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const TODAY = '2026-02-22';

function isOverdue(dateStr: string): boolean {
  return dateStr < TODAY;
}

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - new Date(TODAY).getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getStatusBadge(status: string): string {
  switch (status) {
    case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'under_review': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'inactive': return 'bg-red-500/20 text-red-400 border-red-500/30';
    default: return 'bg-navy-700 text-navy-300 border-navy-600';
  }
}

function getTypeBadge(type: string): string {
  switch (type) {
    case 'preventive': return 'bg-blue-500/20 text-blue-400';
    case 'detective': return 'bg-purple-500/20 text-purple-400';
    case 'corrective': return 'bg-amber-500/20 text-amber-400';
    default: return 'bg-navy-700 text-navy-300';
  }
}

function getAutomationBadge(level: string): string {
  switch (level) {
    case 'automated': return 'bg-emerald-500/15 text-emerald-400';
    case 'semi_automated': return 'bg-blue-500/15 text-blue-400';
    case 'manual': return 'bg-navy-600/50 text-navy-300';
    default: return 'bg-navy-700 text-navy-300';
  }
}

function getEffectivenessColor(score: number): string {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-red-400';
}

function getEffectivenessBarColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

function getHeatmapColor(value: number): string {
  if (value >= 85) return 'bg-emerald-500/30 text-emerald-300 border-emerald-500/20';
  if (value >= 70) return 'bg-blue-500/20 text-blue-300 border-blue-500/20';
  if (value >= 60) return 'bg-amber-500/20 text-amber-300 border-amber-500/20';
  if (value > 0) return 'bg-red-500/20 text-red-300 border-red-500/20';
  return 'bg-navy-800/30 text-navy-600 border-navy-700/30';
}

// ---------------------------------------------------------------------------
// CSV Export
// ---------------------------------------------------------------------------
function exportControlsCSV(data: AssessmentControl[]): void {
  const headers = [
    'Control ID', 'Name', 'Type', 'Owner', 'Linked Risks', 'Effectiveness (%)',
    'Last Test Date', 'Next Test Date', 'Status', 'Automation Level', 'Risk Category',
  ];

  const rows = data.map(c => [
    c.id,
    `"${c.name}"`,
    c.type,
    `"${c.owner}"`,
    `"${c.linkedRiskIds.join(', ')}"`,
    c.effectiveness.toString(),
    c.lastTestDate,
    c.nextTestDate,
    c.status,
    c.automationLevel,
    c.riskCategory,
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `control-assessment-${TODAY}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ControlAssessment() {
  const { isDataActive } = useData();
  const [activeTab, setActiveTab] = useState<'table' | 'heatmap' | 'gaps' | 'schedule'>('table');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [automationFilter, setAutomationFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'effectiveness' | 'nextTestDate' | 'name'>('effectiveness');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedControlId, setSelectedControlId] = useState<string | null>(null);

  // Gate all data behind isDataActive
  const _baseControls: AssessmentControl[] = isDataActive ? sampleControls : [];

  // Also consider mapping from the imported controls data if the user has not used the base data
  void controls; // acknowledge imported controls — we use the richer sampleControls for the assessment view

  // Filtering
  const filteredControls = useMemo(() => {
    let result = [..._baseControls];

    if (typeFilter !== 'all') {
      result = result.filter(c => c.type === typeFilter);
    }
    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter);
    }
    if (automationFilter !== 'all') {
      result = result.filter(c => c.automationLevel === automationFilter);
    }

    // Sorting
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'effectiveness') cmp = a.effectiveness - b.effectiveness;
      else if (sortField === 'nextTestDate') cmp = a.nextTestDate.localeCompare(b.nextTestDate);
      else cmp = a.name.localeCompare(b.name);
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [_baseControls, typeFilter, statusFilter, automationFilter, sortField, sortDir]);

  // Summary stats
  const stats = useMemo(() => {
    if (_baseControls.length === 0) {
      return { total: 0, effective: 0, needsImprovement: 0, ineffective: 0, avgEffectiveness: 0 };
    }
    const total = _baseControls.length;
    const effective = _baseControls.filter(c => c.effectiveness >= 80).length;
    const needsImprovement = _baseControls.filter(c => c.effectiveness >= 60 && c.effectiveness < 80).length;
    const ineffective = _baseControls.filter(c => c.effectiveness < 60).length;
    const avgEffectiveness = Math.round(_baseControls.reduce((s, c) => s + c.effectiveness, 0) / total);
    return { total, effective, needsImprovement, ineffective, avgEffectiveness };
  }, [_baseControls]);

  // Gap analysis
  const gapAnalysis = useMemo(() => {
    if (_baseControls.length === 0) {
      return { unlinkedRisks: [], lowEffectiveness: [], overdueTests: [], concentrationRisks: [] };
    }

    // Risks with no linked controls
    const coveredRisks = new Set(_baseControls.flatMap(c => c.linkedRiskIds));
    const unlinkedRisks = allRiskIds.filter(id => !coveredRisks.has(id));

    // Controls below 60% effectiveness
    const lowEffectiveness = _baseControls.filter(c => c.effectiveness < 60);

    // Overdue control tests
    const overdueTests = _baseControls.filter(c => isOverdue(c.nextTestDate));

    // Concentration risk: controls linked to 3+ risks
    const concentrationRisks = _baseControls.filter(c => c.linkedRiskIds.length >= 3);

    return { unlinkedRisks, lowEffectiveness, overdueTests, concentrationRisks };
  }, [_baseControls]);

  // Heatmap data: rows = risk categories, cols = control types
  const heatmapData = useMemo(() => {
    if (_baseControls.length === 0) return { categories: [], types: [], grid: {} as Record<string, Record<string, number>> };

    const categories = [...new Set(_baseControls.map(c => c.riskCategory))].sort();
    const types: ('preventive' | 'detective' | 'corrective')[] = ['preventive', 'detective', 'corrective'];

    const grid: Record<string, Record<string, number>> = {};
    categories.forEach(cat => {
      grid[cat] = {};
      types.forEach(type => {
        const matching = _baseControls.filter(c => c.riskCategory === cat && c.type === type);
        if (matching.length === 0) {
          grid[cat][type] = 0;
        } else {
          grid[cat][type] = Math.round(matching.reduce((s, c) => s + c.effectiveness, 0) / matching.length);
        }
      });
    });

    return { categories, types, grid };
  }, [_baseControls]);

  // Testing schedule — sorted by next test date
  const testingSchedule = useMemo(() => {
    return [..._baseControls]
      .sort((a, b) => a.nextTestDate.localeCompare(b.nextTestDate));
  }, [_baseControls]);

  // Handle sort toggling
  const handleSort = (field: 'effectiveness' | 'nextTestDate' | 'name') => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir(field === 'effectiveness' ? 'desc' : 'asc');
    }
  };

  const sortIndicator = (field: string) => {
    if (sortField !== field) return '';
    return sortDir === 'asc' ? ' ↑' : ' ↓';
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  // Zero-state when data is not active
  if (!isDataActive) {
    return (
      <div className="space-y-4 animate-fade-in">
        <PageHeader
          title="Control Assessment"
          subtitle="Enterprise control inventory, effectiveness testing, and gap analysis"
        />
        <div className="glass-card p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-navy-800/60 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-navy-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-navy-300 mb-2">No data available</h3>
          <p className="text-sm text-navy-500 max-w-md">
            Upload a dataset or connect your AI Advisor to begin control assessment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Control Assessment"
        subtitle="Enterprise control inventory, effectiveness testing, and gap analysis"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportControlsCSV(filteredControls)}
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

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Controls', value: stats.total, color: 'text-navy-100' },
          { label: 'Effective (80%+)', value: stats.effective, color: 'text-emerald-400' },
          { label: 'Needs Improvement', value: stats.needsImprovement, color: 'text-amber-400' },
          { label: 'Ineffective (<60%)', value: stats.ineffective, color: 'text-red-400' },
          { label: 'Avg Effectiveness', value: `${stats.avgEffectiveness}%`, color: 'text-accent-primary' },
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
          { key: 'table', label: 'Control Inventory' },
          { key: 'heatmap', label: 'Effectiveness Heatmap' },
          { key: 'gaps', label: 'Gap Analysis' },
          { key: 'schedule', label: 'Testing Schedule' },
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

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAB: Control Assessment Table                                      */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'table' && (
        <SectionCard
          title="Control Inventory"
          subtitle={`${filteredControls.length} of ${_baseControls.length} controls shown`}
          actions={
            <div className="flex items-center gap-2 flex-wrap">
              {/* Type filter */}
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="px-3 py-1.5 bg-navy-800/50 border border-navy-700 rounded-lg text-xs text-navy-200 focus:outline-none focus:border-accent-primary/50"
              >
                <option value="all">All Types</option>
                <option value="preventive">Preventive</option>
                <option value="detective">Detective</option>
                <option value="corrective">Corrective</option>
              </select>
              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-navy-800/50 border border-navy-700 rounded-lg text-xs text-navy-200 focus:outline-none focus:border-accent-primary/50"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="under_review">Under Review</option>
                <option value="inactive">Inactive</option>
              </select>
              {/* Automation filter */}
              <select
                value={automationFilter}
                onChange={e => setAutomationFilter(e.target.value)}
                className="px-3 py-1.5 bg-navy-800/50 border border-navy-700 rounded-lg text-xs text-navy-200 focus:outline-none focus:border-accent-primary/50"
              >
                <option value="all">All Automation</option>
                <option value="automated">Automated</option>
                <option value="semi_automated">Semi-Automated</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          }
          noPadding
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-navy-700 bg-navy-900/50">
                  <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[80px]">Control ID</th>
                  <th
                    className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[180px] cursor-pointer hover:text-navy-100"
                    onClick={() => handleSort('name')}
                  >
                    Name{sortIndicator('name')}
                  </th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[90px]">Type</th>
                  <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[130px]">Owner</th>
                  <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[120px]">Linked Risks</th>
                  <th
                    className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[150px] cursor-pointer hover:text-navy-100"
                    onClick={() => handleSort('effectiveness')}
                  >
                    Effectiveness{sortIndicator('effectiveness')}
                  </th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[90px]">Last Test</th>
                  <th
                    className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[90px] cursor-pointer hover:text-navy-100"
                    onClick={() => handleSort('nextTestDate')}
                  >
                    Next Test{sortIndicator('nextTestDate')}
                  </th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[90px]">Status</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[110px]">Automation</th>
                </tr>
              </thead>
              <tbody>
                {filteredControls.map((ctrl, idx) => {
                  const overdue = isOverdue(ctrl.nextTestDate);
                  return (
                    <tr
                      key={ctrl.id}
                      onClick={() => setSelectedControlId(ctrl.id === selectedControlId ? null : ctrl.id)}
                      className={cn(
                        'border-b border-navy-800 hover:bg-navy-800/30 cursor-pointer transition-colors',
                        selectedControlId === ctrl.id && 'bg-accent-primary/5',
                        idx % 2 === 0 && 'bg-navy-900/20'
                      )}
                    >
                      <td className="py-2.5 px-3 font-mono text-accent-primary font-medium">{ctrl.id}</td>
                      <td className="py-2.5 px-3 text-navy-100 font-medium">{ctrl.name}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={cn('px-2 py-0.5 rounded text-2xs font-medium uppercase', getTypeBadge(ctrl.type))}>
                          {ctrl.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-navy-300">{ctrl.owner}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {ctrl.linkedRiskIds.map(rId => (
                            <span key={rId} className="px-1.5 py-0.5 bg-navy-800/60 rounded text-2xs text-navy-400 font-mono">{rId}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-navy-800 rounded-full overflow-hidden">
                            <div
                              className={cn('h-full rounded-full transition-all', getEffectivenessBarColor(ctrl.effectiveness))}
                              style={{ width: `${ctrl.effectiveness}%` }}
                            />
                          </div>
                          <span className={cn('text-xs font-mono font-medium w-10 text-right', getEffectivenessColor(ctrl.effectiveness))}>
                            {ctrl.effectiveness}%
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center text-navy-400">{formatDate(ctrl.lastTestDate)}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={cn('text-xs', overdue ? 'text-red-400 font-medium' : 'text-navy-400')}>
                          {formatDate(ctrl.nextTestDate)}
                          {overdue && <span className="ml-1 text-2xs">(overdue)</span>}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={cn('px-2 py-0.5 rounded text-2xs font-medium uppercase border', getStatusBadge(ctrl.status))}>
                          {ctrl.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={cn('px-2 py-0.5 rounded text-2xs font-medium', getAutomationBadge(ctrl.automationLevel))}>
                          {ctrl.automationLevel.replace('_', '-')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {filteredControls.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-10 text-center text-navy-500 text-sm">
                      No controls match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Detail panel for selected control */}
          {selectedControlId && (() => {
            const ctrl = _baseControls.find(c => c.id === selectedControlId);
            if (!ctrl) return null;
            return (
              <div className="p-5 border-t border-navy-700/50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs font-mono text-navy-500">{ctrl.id}</span>
                    <h3 className="text-lg font-semibold text-navy-100">{ctrl.name}</h3>
                    <p className="text-sm text-navy-400 mt-1">{ctrl.description}</p>
                  </div>
                  <button onClick={() => setSelectedControlId(null)} className="text-navy-400 hover:text-navy-200 text-lg">
                    x
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-navy-800/30 rounded-lg">
                    <p className="text-2xs text-navy-500 uppercase">Effectiveness</p>
                    <p className={cn('text-xl font-bold', getEffectivenessColor(ctrl.effectiveness))}>{ctrl.effectiveness}%</p>
                  </div>
                  <div className="p-3 bg-navy-800/30 rounded-lg">
                    <p className="text-2xs text-navy-500 uppercase">Linked Risks</p>
                    <p className="text-xl font-bold text-navy-100">{ctrl.linkedRiskIds.length}</p>
                  </div>
                  <div className="p-3 bg-navy-800/30 rounded-lg">
                    <p className="text-2xs text-navy-500 uppercase">Automation</p>
                    <p className="text-sm font-medium text-navy-200 mt-1 capitalize">{ctrl.automationLevel.replace('_', ' ')}</p>
                  </div>
                  <div className="p-3 bg-navy-800/30 rounded-lg">
                    <p className="text-2xs text-navy-500 uppercase">Next Test</p>
                    <p className={cn('text-sm font-medium mt-1', isOverdue(ctrl.nextTestDate) ? 'text-red-400' : 'text-navy-200')}>
                      {formatDate(ctrl.nextTestDate)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </SectionCard>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAB: Effectiveness Heatmap                                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'heatmap' && (
        <SectionCard
          title="Control Effectiveness Heatmap"
          subtitle="Average effectiveness by risk category and control type"
        >
          {heatmapData.categories.length === 0 ? (
            <p className="text-center text-navy-500 py-8">No data to display.</p>
          ) : (
            <>
              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 text-xs mb-6">
                <span className="text-navy-400 font-medium">Legend:</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-500/40" /> 85%+ (Strong)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-blue-500/30" /> 70-84% (Adequate)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-amber-500/30" /> 60-69% (Marginal)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-red-500/30" /> &lt;60% (Weak)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-navy-800/40" /> No Controls
                </span>
              </div>

              {/* Grid */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 text-left text-sm text-navy-300 font-medium min-w-[160px]">Risk Category</th>
                      {heatmapData.types.map(type => (
                        <th key={type} className="py-3 px-4 text-center text-sm text-navy-300 font-medium capitalize min-w-[140px]">
                          {type}
                        </th>
                      ))}
                      <th className="py-3 px-4 text-center text-sm text-navy-300 font-medium min-w-[120px]">Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heatmapData.categories.map(cat => {
                      const values = heatmapData.types.map(t => heatmapData.grid[cat][t]);
                      const nonZero = values.filter(v => v > 0);
                      const avg = nonZero.length > 0 ? Math.round(nonZero.reduce((s, v) => s + v, 0) / nonZero.length) : 0;
                      return (
                        <tr key={cat} className="border-t border-navy-800">
                          <td className="py-3 px-4 text-sm text-navy-200 font-medium">{cat}</td>
                          {heatmapData.types.map(type => {
                            const val = heatmapData.grid[cat][type];
                            return (
                              <td key={type} className="py-3 px-4 text-center">
                                <div className={cn(
                                  'inline-flex items-center justify-center w-16 h-10 rounded-lg border font-mono text-sm font-bold',
                                  getHeatmapColor(val)
                                )}>
                                  {val > 0 ? `${val}%` : '--'}
                                </div>
                              </td>
                            );
                          })}
                          <td className="py-3 px-4 text-center">
                            <div className={cn(
                              'inline-flex items-center justify-center w-16 h-10 rounded-lg border font-mono text-sm font-bold',
                              getHeatmapColor(avg)
                            )}>
                              {avg > 0 ? `${avg}%` : '--'}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Summary bar */}
              <div className="mt-6 p-4 bg-navy-800/20 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-navy-400">Overall Average Effectiveness</span>
                  <span className={cn('font-mono font-bold text-lg', getEffectivenessColor(stats.avgEffectiveness))}>
                    {stats.avgEffectiveness}%
                  </span>
                </div>
                <div className="mt-2 h-3 bg-navy-800 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', getEffectivenessBarColor(stats.avgEffectiveness))}
                    style={{ width: `${stats.avgEffectiveness}%` }}
                  />
                </div>
              </div>
            </>
          )}
        </SectionCard>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAB: Gap Analysis                                                  */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'gaps' && (
        <div className="space-y-4">
          {/* Overview counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: 'Unlinked Risks',
                value: gapAnalysis.unlinkedRisks.length,
                desc: 'Risks with no control coverage',
                color: gapAnalysis.unlinkedRisks.length > 0 ? 'text-red-400' : 'text-emerald-400',
                bgColor: gapAnalysis.unlinkedRisks.length > 0 ? 'border-red-500/20' : 'border-emerald-500/20',
              },
              {
                label: 'Low Effectiveness',
                value: gapAnalysis.lowEffectiveness.length,
                desc: 'Controls below 60% threshold',
                color: gapAnalysis.lowEffectiveness.length > 0 ? 'text-amber-400' : 'text-emerald-400',
                bgColor: gapAnalysis.lowEffectiveness.length > 0 ? 'border-amber-500/20' : 'border-emerald-500/20',
              },
              {
                label: 'Overdue Tests',
                value: gapAnalysis.overdueTests.length,
                desc: 'Control tests past due date',
                color: gapAnalysis.overdueTests.length > 0 ? 'text-red-400' : 'text-emerald-400',
                bgColor: gapAnalysis.overdueTests.length > 0 ? 'border-red-500/20' : 'border-emerald-500/20',
              },
              {
                label: 'Concentration Risk',
                value: gapAnalysis.concentrationRisks.length,
                desc: 'Controls linked to 3+ risks',
                color: gapAnalysis.concentrationRisks.length > 0 ? 'text-amber-400' : 'text-emerald-400',
                bgColor: gapAnalysis.concentrationRisks.length > 0 ? 'border-amber-500/20' : 'border-emerald-500/20',
              },
            ].map((item) => (
              <div key={item.label} className={cn('glass-card p-4 border', item.bgColor)}>
                <span className={cn('text-2xl font-bold', item.color)}>{item.value}</span>
                <p className="text-sm font-medium text-navy-200 mt-1">{item.label}</p>
                <p className="text-2xs text-navy-500 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Unlinked Risks */}
          <SectionCard title="Risks Without Control Coverage" subtitle="These risks have no controls mapped to them">
            {gapAnalysis.unlinkedRisks.length === 0 ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                All risks have at least one control mapped.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {gapAnalysis.unlinkedRisks.map(riskId => (
                  <div key={riskId} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <span className="text-sm font-mono text-red-300">{riskId}</span>
                    <span className="text-2xs text-red-400 ml-auto">No controls</span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Low Effectiveness Controls */}
          <SectionCard title="Controls Below Effectiveness Threshold" subtitle="Controls with less than 60% effectiveness require remediation">
            {gapAnalysis.lowEffectiveness.length === 0 ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                All controls meet the 60% effectiveness threshold.
              </div>
            ) : (
              <div className="space-y-2">
                {gapAnalysis.lowEffectiveness.map(ctrl => (
                  <div key={ctrl.id} className="flex items-center justify-between p-3 bg-navy-800/30 rounded-lg border border-amber-500/10">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-accent-primary">{ctrl.id}</span>
                      <span className="text-sm text-navy-200 font-medium">{ctrl.name}</span>
                      <span className={cn('px-2 py-0.5 rounded text-2xs font-medium uppercase', getTypeBadge(ctrl.type))}>
                        {ctrl.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-navy-800 rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full', getEffectivenessBarColor(ctrl.effectiveness))}
                          style={{ width: `${ctrl.effectiveness}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono text-red-400 font-medium w-10 text-right">{ctrl.effectiveness}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Overdue Tests */}
          <SectionCard title="Overdue Control Tests" subtitle="Controls with test dates that have passed">
            {gapAnalysis.overdueTests.length === 0 ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                All control tests are on schedule.
              </div>
            ) : (
              <div className="space-y-2">
                {gapAnalysis.overdueTests.map(ctrl => {
                  const days = Math.abs(daysUntil(ctrl.nextTestDate));
                  return (
                    <div key={ctrl.id} className="flex items-center justify-between p-3 bg-navy-800/30 rounded-lg border border-red-500/10">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-accent-primary">{ctrl.id}</span>
                        <span className="text-sm text-navy-200 font-medium">{ctrl.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-navy-400">Due: {formatDate(ctrl.nextTestDate)}</span>
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-xs font-medium">
                          {days} days overdue
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

          {/* Concentration Risk */}
          <SectionCard title="Control Concentration Risk" subtitle="Controls linked to 3 or more risks create single-point-of-failure scenarios">
            {gapAnalysis.concentrationRisks.length === 0 ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                No control concentration risk detected.
              </div>
            ) : (
              <div className="space-y-2">
                {gapAnalysis.concentrationRisks.map(ctrl => (
                  <div key={ctrl.id} className="flex items-center justify-between p-3 bg-navy-800/30 rounded-lg border border-amber-500/10">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-accent-primary">{ctrl.id}</span>
                      <span className="text-sm text-navy-200 font-medium">{ctrl.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-navy-400">Linked to:</span>
                      {ctrl.linkedRiskIds.map(rId => (
                        <span key={rId} className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-2xs text-amber-400 font-mono">{rId}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAB: Testing Schedule                                              */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'schedule' && (
        <SectionCard
          title="Control Testing Schedule"
          subtitle="Upcoming and overdue control tests ordered by next test date"
        >
          <div className="space-y-3">
            {/* Timeline header */}
            <div className="flex items-center gap-3 text-xs text-navy-400 mb-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Overdue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Due within 30 days
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> On schedule
              </span>
            </div>

            {testingSchedule.map(ctrl => {
              const days = daysUntil(ctrl.nextTestDate);
              const overdue = days < 0;
              const urgent = days >= 0 && days <= 30;
              const statusColor = overdue ? 'border-red-500/20 bg-red-500/5' : urgent ? 'border-amber-500/20 bg-amber-500/5' : 'border-navy-700/50 bg-navy-800/20';
              const dotColor = overdue ? 'bg-red-400' : urgent ? 'bg-amber-400' : 'bg-emerald-400';
              const timeLabel = overdue
                ? `${Math.abs(days)} days overdue`
                : days === 0
                ? 'Due today'
                : `In ${days} days`;
              const timeLabelColor = overdue ? 'text-red-400' : urgent ? 'text-amber-400' : 'text-emerald-400';

              return (
                <div key={ctrl.id} className={cn('flex items-center gap-4 p-4 rounded-lg border transition-colors', statusColor)}>
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <span className={cn('w-3 h-3 rounded-full', dotColor)} />
                    <span className="w-px h-4 bg-navy-700 mt-1" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-accent-primary">{ctrl.id}</span>
                      <span className="text-sm text-navy-100 font-medium truncate">{ctrl.name}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={cn('px-1.5 py-0.5 rounded text-2xs font-medium uppercase', getTypeBadge(ctrl.type))}>{ctrl.type}</span>
                      <span className="text-2xs text-navy-500">Owner: {ctrl.owner}</span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-navy-400">
                      Last tested: <span className="text-navy-300">{formatDate(ctrl.lastTestDate)}</span>
                    </p>
                    <p className="text-xs mt-0.5">
                      Next: <span className="text-navy-200 font-medium">{formatDate(ctrl.nextTestDate)}</span>
                    </p>
                  </div>

                  {/* Countdown */}
                  <div className="flex-shrink-0 min-w-[120px] text-right">
                    <span className={cn('text-sm font-medium', timeLabelColor)}>
                      {timeLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
