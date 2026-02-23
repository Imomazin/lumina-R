// Loss Event Database — Enterprise loss tracking, root cause analysis, trend monitoring, and reporting
// Follows Lumina-R patterns: glass-card, navy color scheme, accent-primary, isDataActive gating

import { useState, useMemo } from 'react';
import { PageHeader, SectionCard } from '../../components';
import { useData } from '../../context/DataContext';
import { cn } from '../../utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type EventCategory = 'operational' | 'financial' | 'compliance' | 'cyber' | 'reputational';
type EventSeverity = 'critical' | 'high' | 'medium' | 'low';
type EventStatus = 'open' | 'investigating' | 'closed' | 'escalated';
type RootCauseType = 'Process Failure' | 'Human Error' | 'System Failure' | 'External Event' | 'Vendor Failure';

interface LossEvent {
  eventId: string;
  date: string;
  description: string;
  relatedRiskId: string;
  category: EventCategory;
  rootCause: RootCauseType;
  financialImpact: number;
  recoveryAmount: number;
  netLoss: number;
  severity: EventSeverity;
  status: EventStatus;
  lessonsLearned: string;
}

// ---------------------------------------------------------------------------
// Sample data — realistic enterprise loss event scenarios
// ---------------------------------------------------------------------------
const sampleLossEvents: LossEvent[] = [
  {
    eventId: 'LE-001',
    date: '2025-11-03',
    description: 'Data breach at third-party payroll vendor exposing 12,000 employee records',
    relatedRiskId: 'R-001',
    category: 'cyber',
    rootCause: 'Vendor Failure',
    financialImpact: 450000,
    recoveryAmount: 120000,
    netLoss: 330000,
    severity: 'critical',
    status: 'investigating',
    lessonsLearned: 'Implement mandatory security audits for all vendors handling PII. Require real-time breach notification clauses in contracts.',
  },
  {
    eventId: 'LE-002',
    date: '2025-12-15',
    description: 'Core trading platform outage lasting 6 hours during peak market hours',
    relatedRiskId: 'R-003',
    category: 'operational',
    rootCause: 'System Failure',
    financialImpact: 1200000,
    recoveryAmount: 350000,
    netLoss: 850000,
    severity: 'critical',
    status: 'closed',
    lessonsLearned: 'Upgrade to active-active failover architecture. Implement automated health checks every 30 seconds with auto-scaling.',
  },
  {
    eventId: 'LE-003',
    date: '2026-01-08',
    description: 'FCA regulatory fine for MiFID II transaction reporting failures over Q3-Q4 2025',
    relatedRiskId: 'R-002',
    category: 'compliance',
    rootCause: 'Process Failure',
    financialImpact: 800000,
    recoveryAmount: 0,
    netLoss: 800000,
    severity: 'high',
    status: 'closed',
    lessonsLearned: 'Automate transaction reporting reconciliation. Add daily completeness checks against trade blotter.',
  },
  {
    eventId: 'LE-004',
    date: '2026-01-22',
    description: 'Unauthorised wire transfer of funds due to business email compromise (BEC) attack',
    relatedRiskId: 'R-001',
    category: 'financial',
    rootCause: 'Human Error',
    financialImpact: 275000,
    recoveryAmount: 180000,
    netLoss: 95000,
    severity: 'high',
    status: 'closed',
    lessonsLearned: 'Enforce dual-authorisation for all wire transfers above 50k. Deploy AI-based email threat detection.',
  },
  {
    eventId: 'LE-005',
    date: '2026-01-30',
    description: 'Customer data exposed via misconfigured cloud storage bucket in AWS S3',
    relatedRiskId: 'R-005',
    category: 'cyber',
    rootCause: 'Human Error',
    financialImpact: 620000,
    recoveryAmount: 75000,
    netLoss: 545000,
    severity: 'critical',
    status: 'escalated',
    lessonsLearned: 'Implement Infrastructure-as-Code policies that enforce encryption-at-rest and private-only access by default.',
  },
  {
    eventId: 'LE-006',
    date: '2026-02-05',
    description: 'Supply chain disruption caused delayed delivery to 3 key institutional clients',
    relatedRiskId: 'R-004',
    category: 'operational',
    rootCause: 'External Event',
    financialImpact: 340000,
    recoveryAmount: 50000,
    netLoss: 290000,
    severity: 'medium',
    status: 'closed',
    lessonsLearned: 'Diversify supplier base across at least two geographies. Maintain 30-day buffer stock for critical components.',
  },
  {
    eventId: 'LE-007',
    date: '2026-02-10',
    description: 'Negative media coverage after whistleblower allegations regarding ESG reporting practices',
    relatedRiskId: 'R-006',
    category: 'reputational',
    rootCause: 'Process Failure',
    financialImpact: 950000,
    recoveryAmount: 0,
    netLoss: 950000,
    severity: 'high',
    status: 'investigating',
    lessonsLearned: 'Establish independent ESG audit committee. Implement whistleblower protection programme with external hotline.',
  },
  {
    eventId: 'LE-008',
    date: '2026-02-14',
    description: 'Failed software deployment corrupted client portfolio reporting for 48 hours',
    relatedRiskId: 'R-003',
    category: 'operational',
    rootCause: 'Process Failure',
    financialImpact: 185000,
    recoveryAmount: 40000,
    netLoss: 145000,
    severity: 'medium',
    status: 'closed',
    lessonsLearned: 'Mandate blue-green deployments and automated rollback. Require production-parity staging environment sign-off.',
  },
  {
    eventId: 'LE-009',
    date: '2026-02-18',
    description: 'GDPR subject access request backlog resulted in ICO formal warning and potential fine',
    relatedRiskId: 'R-002',
    category: 'compliance',
    rootCause: 'Process Failure',
    financialImpact: 150000,
    recoveryAmount: 0,
    netLoss: 150000,
    severity: 'medium',
    status: 'open',
    lessonsLearned: 'Deploy automated SAR workflow with SLA tracking. Hire dedicated data privacy analyst to manage request pipeline.',
  },
  {
    eventId: 'LE-010',
    date: '2026-02-20',
    description: 'Critical vendor SaaS platform experienced ransomware attack disrupting HR and finance operations',
    relatedRiskId: 'R-001',
    category: 'cyber',
    rootCause: 'Vendor Failure',
    financialImpact: 530000,
    recoveryAmount: 200000,
    netLoss: 330000,
    severity: 'high',
    status: 'open',
    lessonsLearned: 'Require SOC 2 Type II certification for all critical SaaS vendors. Implement vendor contingency plans with manual workarounds.',
  },
];

// Monthly trend data (last 12 months)
const monthlyTrendData = [
  { month: 'Mar 25', events: 1, losses: 120000 },
  { month: 'Apr 25', events: 0, losses: 0 },
  { month: 'May 25', events: 2, losses: 310000 },
  { month: 'Jun 25', events: 1, losses: 180000 },
  { month: 'Jul 25', events: 1, losses: 95000 },
  { month: 'Aug 25', events: 0, losses: 0 },
  { month: 'Sep 25', events: 2, losses: 420000 },
  { month: 'Oct 25', events: 1, losses: 260000 },
  { month: 'Nov 25', events: 1, losses: 450000 },
  { month: 'Dec 25', events: 1, losses: 1200000 },
  { month: 'Jan 26', events: 3, losses: 1695000 },
  { month: 'Feb 26', events: 4, losses: 1815000 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatCurrency(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toFixed(0);
}

function formatCurrencyFull(value: number): string {
  return new Intl.NumberFormat('en-GB', { style: 'decimal', minimumFractionDigits: 0 }).format(value);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getSeverityBadge(severity: EventSeverity): string {
  switch (severity) {
    case 'critical': return 'bg-red-600/25 text-red-300 border-red-500/40';
    case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  }
}

function getStatusBadge(status: EventStatus): string {
  switch (status) {
    case 'open': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'investigating': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'closed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'escalated': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
  }
}

function getCategoryColor(category: EventCategory): string {
  switch (category) {
    case 'operational': return 'bg-blue-500/20 text-blue-400';
    case 'financial': return 'bg-amber-500/20 text-amber-400';
    case 'compliance': return 'bg-purple-500/20 text-purple-400';
    case 'cyber': return 'bg-red-500/20 text-red-400';
    case 'reputational': return 'bg-teal-500/20 text-teal-400';
  }
}

function getCategoryBarColor(category: EventCategory): string {
  switch (category) {
    case 'operational': return 'bg-blue-500';
    case 'financial': return 'bg-amber-500';
    case 'compliance': return 'bg-purple-500';
    case 'cyber': return 'bg-red-500';
    case 'reputational': return 'bg-teal-500';
  }
}

// ---------------------------------------------------------------------------
// CSV Export
// ---------------------------------------------------------------------------
function exportLossEventsCSV(data: LossEvent[]): void {
  const headers = [
    'Event ID', 'Date', 'Description', 'Related Risk ID', 'Category',
    'Root Cause', 'Financial Impact', 'Recovery Amount', 'Net Loss',
    'Severity', 'Status', 'Lessons Learned',
  ];

  const rows = data.map(e => [
    e.eventId,
    e.date,
    `"${e.description.replace(/"/g, '""')}"`,
    e.relatedRiskId,
    e.category,
    e.rootCause,
    e.financialImpact.toString(),
    e.recoveryAmount.toString(),
    e.netLoss.toString(),
    e.severity,
    e.status,
    `"${e.lessonsLearned.replace(/"/g, '""')}"`,
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `loss-events-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Empty form state
// ---------------------------------------------------------------------------
const emptyFormState: Omit<LossEvent, 'eventId' | 'netLoss'> = {
  date: new Date().toISOString().slice(0, 10),
  description: '',
  relatedRiskId: '',
  category: 'operational',
  rootCause: 'Process Failure',
  financialImpact: 0,
  recoveryAmount: 0,
  severity: 'medium',
  status: 'open',
  lessonsLearned: '',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function LossEvents() {
  const { isDataActive } = useData();

  // State
  const [events, setEvents] = useState<LossEvent[]>(sampleLossEvents);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'date' | 'financialImpact' | 'netLoss'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState(emptyFormState);

  // Gate all data behind isDataActive
  const activeEvents = isDataActive ? events : [];

  // ── Filtering & Sorting ──
  const filteredEvents = useMemo(() => {
    let result = [...activeEvents];

    if (categoryFilter !== 'all') result = result.filter(e => e.category === categoryFilter);
    if (severityFilter !== 'all') result = result.filter(e => e.severity === severityFilter);
    if (statusFilter !== 'all') result = result.filter(e => e.status === statusFilter);

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') cmp = a.date.localeCompare(b.date);
      else if (sortField === 'financialImpact') cmp = a.financialImpact - b.financialImpact;
      else cmp = a.netLoss - b.netLoss;
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [activeEvents, categoryFilter, severityFilter, statusFilter, sortField, sortDir]);

  // ── Summary Stats ──
  const stats = useMemo(() => {
    if (activeEvents.length === 0) {
      return { totalEvents: 0, totalImpact: 0, avgLoss: 0, thisQuarter: 0 };
    }
    const totalEvents = activeEvents.length;
    const totalImpact = activeEvents.reduce((s, e) => s + e.financialImpact, 0);
    const avgLoss = Math.round(activeEvents.reduce((s, e) => s + e.netLoss, 0) / totalEvents);
    // Events this quarter (Q1 2026: Jan-Mar)
    const thisQuarter = activeEvents.filter(e => e.date >= '2026-01-01' && e.date <= '2026-03-31').length;
    return { totalEvents, totalImpact, avgLoss, thisQuarter };
  }, [activeEvents]);

  // ── Loss Distribution by Category ──
  const categoryDistribution = useMemo(() => {
    const categories: EventCategory[] = ['operational', 'financial', 'compliance', 'cyber', 'reputational'];
    return categories.map(cat => {
      const catEvents = activeEvents.filter(e => e.category === cat);
      const totalLoss = catEvents.reduce((s, e) => s + e.netLoss, 0);
      return { category: cat, count: catEvents.length, totalLoss };
    });
  }, [activeEvents]);

  const maxCategoryLoss = useMemo(() => {
    const max = Math.max(...categoryDistribution.map(c => c.totalLoss), 1);
    return max;
  }, [categoryDistribution]);

  // ── Root Cause Analysis ──
  const rootCauseAnalysis = useMemo(() => {
    const causes: RootCauseType[] = ['Process Failure', 'Human Error', 'System Failure', 'External Event', 'Vendor Failure'];
    return causes.map(cause => {
      const causeEvents = activeEvents.filter(e => e.rootCause === cause);
      const totalLoss = causeEvents.reduce((s, e) => s + e.netLoss, 0);
      return { cause, count: causeEvents.length, totalLoss };
    });
  }, [activeEvents]);

  // ── Monthly Trend Data ──
  const maxMonthlyLoss = useMemo(() => {
    return Math.max(...monthlyTrendData.map(m => m.losses), 1);
  }, []);

  // ── Sort handler ──
  const handleSort = (field: 'date' | 'financialImpact' | 'netLoss') => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sortIndicator = (field: string) => {
    if (sortField !== field) return '';
    return sortDir === 'asc' ? ' \u2191' : ' \u2193';
  };

  // ── Add Event handler ──
  const handleAddEvent = () => {
    const newId = `LE-${String(events.length + 1).padStart(3, '0')}`;
    const netLoss = formData.financialImpact - formData.recoveryAmount;
    const newEvent: LossEvent = {
      ...formData,
      eventId: newId,
      netLoss: netLoss < 0 ? 0 : netLoss,
    };
    setEvents(prev => [...prev, newEvent]);
    setFormData(emptyFormState);
    setShowAddModal(false);
  };

  // ── Form field updater ──
  const updateForm = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // =========================================================================
  // Zero-state when data is not active
  // =========================================================================
  if (!isDataActive) {
    return (
      <div className="space-y-4 animate-fade-in">
        <PageHeader
          title="Loss Event Database"
          subtitle="Enterprise loss event tracking, root cause analysis, and trend reporting"
        />
        <div className="glass-card p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-navy-800/60 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-navy-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-navy-300 mb-2">No data available</h3>
          <p className="text-sm text-navy-500 max-w-md">
            Upload a dataset or connect your AI Advisor to begin tracking loss events.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // Main render
  // =========================================================================
  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Loss Event Database"
        subtitle="Enterprise loss event tracking, root cause analysis, and trend reporting"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportLossEventsCSV(filteredEvents)}
              className="btn-secondary text-sm flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export CSV
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary text-sm flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Event
            </button>
          </div>
        }
      />

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* Summary Cards                                                     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Loss Events', value: stats.totalEvents.toString(), color: 'text-navy-100' },
          { label: 'Total Financial Impact', value: `\u00A3${formatCurrency(stats.totalImpact)}`, color: 'text-red-400' },
          { label: 'Avg Net Loss per Event', value: `\u00A3${formatCurrency(stats.avgLoss)}`, color: 'text-amber-400' },
          { label: 'Events This Quarter', value: stats.thisQuarter.toString(), color: 'text-accent-primary' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4 flex flex-col items-center justify-center">
            <span className={cn('text-2xl font-bold', stat.color)}>{stat.value}</span>
            <span className="text-2xs text-navy-500 uppercase mt-1 text-center">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* Loss Events Table                                                 */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <SectionCard
        title="Loss Events"
        subtitle={`${filteredEvents.length} of ${activeEvents.length} events shown`}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 bg-navy-800/50 border border-navy-700 rounded-lg text-xs text-navy-200 focus:outline-none focus:border-accent-primary/50"
            >
              <option value="all">All Categories</option>
              <option value="operational">Operational</option>
              <option value="financial">Financial</option>
              <option value="compliance">Compliance</option>
              <option value="cyber">Cyber</option>
              <option value="reputational">Reputational</option>
            </select>
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="px-3 py-1.5 bg-navy-800/50 border border-navy-700 rounded-lg text-xs text-navy-200 focus:outline-none focus:border-accent-primary/50"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-navy-800/50 border border-navy-700 rounded-lg text-xs text-navy-200 focus:outline-none focus:border-accent-primary/50"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="closed">Closed</option>
              <option value="escalated">Escalated</option>
            </select>
          </div>
        }
        noPadding
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-navy-700 bg-navy-900/50">
                <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[80px]">Event ID</th>
                <th
                  className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[90px] cursor-pointer hover:text-navy-100"
                  onClick={() => handleSort('date')}
                >
                  Date{sortIndicator('date')}
                </th>
                <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[220px]">Description</th>
                <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[80px]">Risk ID</th>
                <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[100px]">Category</th>
                <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[120px]">Root Cause</th>
                <th
                  className="py-2.5 px-3 text-right text-navy-300 font-medium min-w-[100px] cursor-pointer hover:text-navy-100"
                  onClick={() => handleSort('financialImpact')}
                >
                  Impact (\u00A3){sortIndicator('financialImpact')}
                </th>
                <th className="py-2.5 px-3 text-right text-navy-300 font-medium min-w-[100px]">Recovery (\u00A3)</th>
                <th
                  className="py-2.5 px-3 text-right text-navy-300 font-medium min-w-[90px] cursor-pointer hover:text-navy-100"
                  onClick={() => handleSort('netLoss')}
                >
                  Net Loss (\u00A3){sortIndicator('netLoss')}
                </th>
                <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[80px]">Severity</th>
                <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[100px]">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((evt, idx) => (
                <tr
                  key={evt.eventId}
                  onClick={() => setSelectedEventId(evt.eventId === selectedEventId ? null : evt.eventId)}
                  className={cn(
                    'border-b border-navy-800 hover:bg-navy-800/30 cursor-pointer transition-colors',
                    selectedEventId === evt.eventId && 'bg-accent-primary/5',
                    idx % 2 === 0 && 'bg-navy-900/20'
                  )}
                >
                  <td className="py-2.5 px-3 font-mono text-accent-primary font-medium">{evt.eventId}</td>
                  <td className="py-2.5 px-3 text-navy-300">{formatDate(evt.date)}</td>
                  <td className="py-2.5 px-3 text-navy-200 max-w-[220px] truncate" title={evt.description}>{evt.description}</td>
                  <td className="py-2.5 px-3 font-mono text-navy-400">{evt.relatedRiskId}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={cn('px-2 py-0.5 rounded text-2xs font-medium uppercase', getCategoryColor(evt.category))}>
                      {evt.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-navy-400">{evt.rootCause}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-navy-200">{formatCurrencyFull(evt.financialImpact)}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-400">{formatCurrencyFull(evt.recoveryAmount)}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-red-400 font-medium">{formatCurrencyFull(evt.netLoss)}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={cn('px-2 py-0.5 rounded text-2xs font-bold uppercase border', getSeverityBadge(evt.severity))}>
                      {evt.severity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={cn('px-2 py-0.5 rounded text-2xs font-medium uppercase border', getStatusBadge(evt.status))}>
                      {evt.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-10 text-center text-navy-500 text-sm">
                    No loss events match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Detail panel for selected event */}
        {selectedEventId && (() => {
          const evt = activeEvents.find(e => e.eventId === selectedEventId);
          if (!evt) return null;
          return (
            <div className="p-5 border-t border-navy-700/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-mono text-navy-500">{evt.eventId}</span>
                  <h3 className="text-base font-semibold text-navy-100 mt-0.5">{evt.description}</h3>
                  <p className="text-sm text-navy-400 mt-1">
                    {formatDate(evt.date)} &middot; {evt.category.charAt(0).toUpperCase() + evt.category.slice(1)} &middot; {evt.rootCause}
                  </p>
                </div>
                <button onClick={() => setSelectedEventId(null)} className="text-navy-400 hover:text-navy-200 text-lg">
                  x
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="p-3 bg-navy-800/30 rounded-lg">
                  <p className="text-2xs text-navy-500 uppercase">Financial Impact</p>
                  <p className="text-lg font-bold text-navy-100">{'\u00A3'}{formatCurrencyFull(evt.financialImpact)}</p>
                </div>
                <div className="p-3 bg-navy-800/30 rounded-lg">
                  <p className="text-2xs text-navy-500 uppercase">Recovery Amount</p>
                  <p className="text-lg font-bold text-emerald-400">{'\u00A3'}{formatCurrencyFull(evt.recoveryAmount)}</p>
                </div>
                <div className="p-3 bg-navy-800/30 rounded-lg">
                  <p className="text-2xs text-navy-500 uppercase">Net Loss</p>
                  <p className="text-lg font-bold text-red-400">{'\u00A3'}{formatCurrencyFull(evt.netLoss)}</p>
                </div>
                <div className="p-3 bg-navy-800/30 rounded-lg">
                  <p className="text-2xs text-navy-500 uppercase">Related Risk</p>
                  <p className="text-lg font-bold text-accent-primary font-mono">{evt.relatedRiskId}</p>
                </div>
              </div>
              <div className="p-4 bg-navy-800/20 rounded-lg">
                <h4 className="text-xs font-semibold text-amber-400 uppercase mb-2">Lessons Learned</h4>
                <p className="text-sm text-navy-300 leading-relaxed">{evt.lessonsLearned}</p>
              </div>
            </div>
          );
        })()}
      </SectionCard>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* Analytics Row: Distribution + Root Cause                          */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Loss Distribution by Category */}
        <SectionCard title="Loss Distribution by Category" subtitle="Net losses aggregated by event category">
          <div className="space-y-3">
            {categoryDistribution.map(item => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn('px-2 py-0.5 rounded text-2xs font-medium uppercase', getCategoryColor(item.category))}>
                      {item.category}
                    </span>
                    <span className="text-xs text-navy-500">{item.count} events</span>
                  </div>
                  <span className="text-xs font-mono text-navy-200 font-medium">{'\u00A3'}{formatCurrency(item.totalLoss)}</span>
                </div>
                <div className="h-3 bg-navy-800 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', getCategoryBarColor(item.category))}
                    style={{ width: `${maxCategoryLoss > 0 ? (item.totalLoss / maxCategoryLoss) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Category legend */}
          <div className="mt-5 pt-4 border-t border-navy-700/50">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              {categoryDistribution.map(item => (
                <span key={item.category} className="flex items-center gap-1.5">
                  <span className={cn('w-2.5 h-2.5 rounded-full', getCategoryBarColor(item.category))} />
                  <span className="text-navy-400 capitalize">{item.category}</span>
                </span>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Root Cause Analysis */}
        <SectionCard title="Root Cause Analysis" subtitle="Event breakdown by root cause type">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-700">
                  <th className="py-2 px-3 text-left text-navy-300 font-medium">Root Cause</th>
                  <th className="py-2 px-3 text-center text-navy-300 font-medium">Count</th>
                  <th className="py-2 px-3 text-right text-navy-300 font-medium">Total Net Loss</th>
                  <th className="py-2 px-3 text-right text-navy-300 font-medium">Share</th>
                </tr>
              </thead>
              <tbody>
                {rootCauseAnalysis.map(item => {
                  const totalNetLoss = activeEvents.reduce((s, e) => s + e.netLoss, 0);
                  const share = totalNetLoss > 0 ? ((item.totalLoss / totalNetLoss) * 100) : 0;
                  return (
                    <tr key={item.cause} className="border-b border-navy-800 hover:bg-navy-800/20">
                      <td className="py-2.5 px-3 text-navy-200 font-medium">{item.cause}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={cn(
                          'inline-flex items-center justify-center w-7 h-7 rounded-full font-mono font-bold text-xs',
                          item.count > 0 ? 'bg-accent-primary/15 text-accent-primary' : 'bg-navy-800/50 text-navy-600'
                        )}>
                          {item.count}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-red-400">{'\u00A3'}{formatCurrency(item.totalLoss)}</td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-navy-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-accent-primary transition-all"
                              style={{ width: `${share}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-navy-400 w-10 text-right">{share.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-navy-600">
                  <td className="py-2.5 px-3 text-navy-100 font-semibold">Total</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-navy-100">
                    {rootCauseAnalysis.reduce((s, r) => s + r.count, 0)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-red-400 font-bold">
                    {'\u00A3'}{formatCurrency(rootCauseAnalysis.reduce((s, r) => s + r.totalLoss, 0))}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-navy-300">100.0%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </SectionCard>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* Trend Analysis — Monthly Loss Events (last 12 months)             */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <SectionCard title="Trend Analysis" subtitle="Monthly loss events and financial impact over the last 12 months">
        <div className="space-y-4">
          {/* Mini bar chart */}
          <div className="flex items-end justify-between gap-2" style={{ height: 160 }}>
            {monthlyTrendData.map(m => {
              const barHeight = maxMonthlyLoss > 0 ? (m.losses / maxMonthlyLoss) * 140 : 0;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-2xs font-mono text-navy-400">{m.events > 0 ? m.events : ''}</span>
                  <div className="w-full flex items-end justify-center" style={{ height: 140 }}>
                    <div
                      className={cn(
                        'w-full max-w-[40px] rounded-t transition-all',
                        m.losses > 0 ? 'bg-accent-primary/60 hover:bg-accent-primary/80' : 'bg-navy-800/30'
                      )}
                      style={{ height: Math.max(barHeight, m.losses > 0 ? 4 : 2) }}
                      title={`${m.month}: ${m.events} events, \u00A3${formatCurrencyFull(m.losses)}`}
                    />
                  </div>
                  <span className="text-2xs text-navy-500 whitespace-nowrap">{m.month}</span>
                </div>
              );
            })}
          </div>

          {/* Summary row */}
          <div className="flex items-center justify-between pt-3 border-t border-navy-700/50">
            <div className="flex items-center gap-6 text-xs text-navy-400">
              <span>Total events (12mo): <span className="text-navy-100 font-semibold">{monthlyTrendData.reduce((s, m) => s + m.events, 0)}</span></span>
              <span>Total losses (12mo): <span className="text-red-400 font-semibold">{'\u00A3'}{formatCurrency(monthlyTrendData.reduce((s, m) => s + m.losses, 0))}</span></span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded bg-accent-primary/60" />
              <span className="text-navy-500">Monthly loss amount</span>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* Add Event Modal                                                   */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-navy-700/50">
              <div>
                <h2 className="text-lg font-semibold text-navy-100">Add Loss Event</h2>
                <p className="text-sm text-navy-400 mt-0.5">Record a new loss event in the database</p>
              </div>
              <button
                onClick={() => { setShowAddModal(false); setFormData(emptyFormState); }}
                className="text-navy-400 hover:text-navy-200 text-xl leading-none"
              >
                x
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {/* Row 1: Date + Risk ID */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-navy-400 mb-1.5">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => updateForm('date', e.target.value)}
                    className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-navy-400 mb-1.5">Related Risk ID</label>
                  <input
                    type="text"
                    placeholder="e.g. R-001"
                    value={formData.relatedRiskId}
                    onChange={e => updateForm('relatedRiskId', e.target.value)}
                    className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50"
                  />
                </div>
              </div>

              {/* Row 2: Description */}
              <div>
                <label className="block text-xs text-navy-400 mb-1.5">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the loss event..."
                  value={formData.description}
                  onChange={e => updateForm('description', e.target.value)}
                  className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50 resize-none"
                />
              </div>

              {/* Row 3: Category + Root Cause */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-navy-400 mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => updateForm('category', e.target.value)}
                    className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50"
                  >
                    <option value="operational">Operational</option>
                    <option value="financial">Financial</option>
                    <option value="compliance">Compliance</option>
                    <option value="cyber">Cyber</option>
                    <option value="reputational">Reputational</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-navy-400 mb-1.5">Root Cause</label>
                  <select
                    value={formData.rootCause}
                    onChange={e => updateForm('rootCause', e.target.value)}
                    className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50"
                  >
                    <option value="Process Failure">Process Failure</option>
                    <option value="Human Error">Human Error</option>
                    <option value="System Failure">System Failure</option>
                    <option value="External Event">External Event</option>
                    <option value="Vendor Failure">Vendor Failure</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Financial Impact + Recovery */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-navy-400 mb-1.5">Financial Impact ({'\u00A3'})</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.financialImpact || ''}
                    onChange={e => updateForm('financialImpact', Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-navy-400 mb-1.5">Recovery Amount ({'\u00A3'})</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.recoveryAmount || ''}
                    onChange={e => updateForm('recoveryAmount', Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50"
                  />
                </div>
              </div>

              {/* Computed net loss preview */}
              <div className="p-3 bg-navy-800/20 rounded-lg flex items-center justify-between">
                <span className="text-xs text-navy-400">Computed Net Loss</span>
                <span className="text-sm font-mono font-bold text-red-400">
                  {'\u00A3'}{formatCurrencyFull(Math.max(formData.financialImpact - formData.recoveryAmount, 0))}
                </span>
              </div>

              {/* Row 5: Severity + Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-navy-400 mb-1.5">Severity</label>
                  <select
                    value={formData.severity}
                    onChange={e => updateForm('severity', e.target.value)}
                    className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-navy-400 mb-1.5">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => updateForm('status', e.target.value)}
                    className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50"
                  >
                    <option value="open">Open</option>
                    <option value="investigating">Investigating</option>
                    <option value="closed">Closed</option>
                    <option value="escalated">Escalated</option>
                  </select>
                </div>
              </div>

              {/* Row 6: Lessons Learned */}
              <div>
                <label className="block text-xs text-navy-400 mb-1.5">Lessons Learned</label>
                <textarea
                  rows={3}
                  placeholder="Describe lessons learned and recommended preventive actions..."
                  value={formData.lessonsLearned}
                  onChange={e => updateForm('lessonsLearned', e.target.value)}
                  className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50 resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-navy-700/50">
              <button
                onClick={() => { setShowAddModal(false); setFormData(emptyFormState); }}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                disabled={!formData.description || !formData.relatedRiskId}
                className={cn(
                  'btn-primary text-sm',
                  (!formData.description || !formData.relatedRiskId) && 'opacity-50 cursor-not-allowed'
                )}
              >
                Add Loss Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
