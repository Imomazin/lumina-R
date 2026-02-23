// Risk & Control Self-Assessment (RCSA) Tool — Enterprise RCSA workflow, risk-control matrix, action tracking
// Follows Lumina-R patterns: glass-card, navy color scheme, accent-primary, isDataActive gating

import { useState, useMemo } from 'react';
import { PageHeader, SectionCard } from '../../components';
import { useData } from '../../context/DataContext';
import { cn } from '../../utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type RiskDomain = 'operational' | 'financial' | 'compliance' | 'technology' | 'people';
type OverallRiskRating = 'critical' | 'high' | 'medium' | 'low';
type ControlAdequacy = 'adequate' | 'needs_improvement' | 'inadequate';
type AssessmentStatus = 'completed' | 'in_progress' | 'not_started' | 'overdue';
type ActionPriority = 'critical' | 'high' | 'medium' | 'low';
type ActionStatus = 'open' | 'in_progress' | 'completed' | 'overdue';
type EffectivenessRating = 'effective' | 'partially_effective' | 'ineffective' | 'not_assessed';

interface RCSAAssessment {
  id: string;
  businessUnit: string;
  riskDomain: RiskDomain;
  riskOwner: string;
  assessmentPeriod: string;
  risksIdentified: number;
  controlsAssessed: number;
  overallRiskRating: OverallRiskRating;
  controlAdequacy: ControlAdequacy;
  status: AssessmentStatus;
  completionDate: string | null;
  dueDate: string;
}

interface RiskControlMapping {
  riskId: string;
  riskName: string;
  controls: {
    controlId: string;
    controlName: string;
    effectiveness: EffectivenessRating;
  }[];
}

interface ActionItem {
  id: string;
  assessmentId: string;
  description: string;
  owner: string;
  dueDate: string;
  priority: ActionPriority;
  status: ActionStatus;
  businessUnit: string;
}

// ---------------------------------------------------------------------------
// Workflow steps
// ---------------------------------------------------------------------------
const workflowSteps = [
  { step: 1, label: 'Risk Identification', description: 'Identify and catalogue inherent risks within each business unit' },
  { step: 2, label: 'Control Mapping', description: 'Map existing controls to identified risks for coverage analysis' },
  { step: 3, label: 'Effectiveness Testing', description: 'Assess control design and operating effectiveness' },
  { step: 4, label: 'Gap Analysis', description: 'Identify control gaps, weaknesses, and residual risk exposures' },
  { step: 5, label: 'Action Planning', description: 'Develop remediation plans with owners, timelines, and priorities' },
  { step: 6, label: 'Sign-off', description: 'Management attestation and formal sign-off of assessment results' },
];

// ---------------------------------------------------------------------------
// Sample RCSA Assessment data
// ---------------------------------------------------------------------------
const sampleAssessments: RCSAAssessment[] = [
  {
    id: 'RCSA-001',
    businessUnit: 'Information Technology',
    riskDomain: 'technology',
    riskOwner: 'James Chen',
    assessmentPeriod: 'Q4 2024',
    risksIdentified: 12,
    controlsAssessed: 18,
    overallRiskRating: 'high',
    controlAdequacy: 'needs_improvement',
    status: 'completed',
    completionDate: '2024-12-15',
    dueDate: '2024-12-31',
  },
  {
    id: 'RCSA-002',
    businessUnit: 'Finance',
    riskDomain: 'financial',
    riskOwner: 'Sarah Mitchell',
    assessmentPeriod: 'Q4 2024',
    risksIdentified: 8,
    controlsAssessed: 14,
    overallRiskRating: 'medium',
    controlAdequacy: 'adequate',
    status: 'completed',
    completionDate: '2024-12-20',
    dueDate: '2024-12-31',
  },
  {
    id: 'RCSA-003',
    businessUnit: 'Operations',
    riskDomain: 'operational',
    riskOwner: 'Michael Torres',
    assessmentPeriod: 'Q1 2025',
    risksIdentified: 15,
    controlsAssessed: 22,
    overallRiskRating: 'high',
    controlAdequacy: 'needs_improvement',
    status: 'in_progress',
    completionDate: null,
    dueDate: '2025-03-31',
  },
  {
    id: 'RCSA-004',
    businessUnit: 'Human Resources',
    riskDomain: 'people',
    riskOwner: 'Linda Nguyen',
    assessmentPeriod: 'Q1 2025',
    risksIdentified: 6,
    controlsAssessed: 9,
    overallRiskRating: 'low',
    controlAdequacy: 'adequate',
    status: 'completed',
    completionDate: '2025-01-28',
    dueDate: '2025-03-31',
  },
  {
    id: 'RCSA-005',
    businessUnit: 'Compliance',
    riskDomain: 'compliance',
    riskOwner: 'David Park',
    assessmentPeriod: 'Q1 2025',
    risksIdentified: 11,
    controlsAssessed: 16,
    overallRiskRating: 'critical',
    controlAdequacy: 'inadequate',
    status: 'overdue',
    completionDate: null,
    dueDate: '2025-01-31',
  },
  {
    id: 'RCSA-006',
    businessUnit: 'Legal',
    riskDomain: 'compliance',
    riskOwner: 'Emily Watson',
    assessmentPeriod: 'Q4 2024',
    risksIdentified: 7,
    controlsAssessed: 10,
    overallRiskRating: 'medium',
    controlAdequacy: 'adequate',
    status: 'completed',
    completionDate: '2024-12-22',
    dueDate: '2024-12-31',
  },
  {
    id: 'RCSA-007',
    businessUnit: 'Treasury',
    riskDomain: 'financial',
    riskOwner: 'Robert Kim',
    assessmentPeriod: 'Q1 2025',
    risksIdentified: 9,
    controlsAssessed: 13,
    overallRiskRating: 'high',
    controlAdequacy: 'needs_improvement',
    status: 'in_progress',
    completionDate: null,
    dueDate: '2025-03-31',
  },
  {
    id: 'RCSA-008',
    businessUnit: 'Sales',
    riskDomain: 'operational',
    riskOwner: 'Angela Rivera',
    assessmentPeriod: 'Q1 2025',
    risksIdentified: 5,
    controlsAssessed: 8,
    overallRiskRating: 'low',
    controlAdequacy: 'adequate',
    status: 'not_started',
    completionDate: null,
    dueDate: '2025-03-31',
  },
  {
    id: 'RCSA-009',
    businessUnit: 'Information Technology',
    riskDomain: 'technology',
    riskOwner: 'James Chen',
    assessmentPeriod: 'Q1 2025',
    risksIdentified: 14,
    controlsAssessed: 20,
    overallRiskRating: 'critical',
    controlAdequacy: 'needs_improvement',
    status: 'in_progress',
    completionDate: null,
    dueDate: '2025-03-31',
  },
  {
    id: 'RCSA-010',
    businessUnit: 'Operations',
    riskDomain: 'operational',
    riskOwner: 'Michael Torres',
    assessmentPeriod: 'Q4 2024',
    risksIdentified: 10,
    controlsAssessed: 15,
    overallRiskRating: 'medium',
    controlAdequacy: 'adequate',
    status: 'completed',
    completionDate: '2024-12-18',
    dueDate: '2024-12-31',
  },
];

// ---------------------------------------------------------------------------
// Sample Risk-Control Matrix data
// ---------------------------------------------------------------------------
const sampleRiskControlMatrix: RiskControlMapping[] = [
  {
    riskId: 'RSK-T01',
    riskName: 'Unauthorized System Access',
    controls: [
      { controlId: 'CTL-01', controlName: 'Multi-Factor Auth', effectiveness: 'effective' },
      { controlId: 'CTL-02', controlName: 'Access Reviews', effectiveness: 'partially_effective' },
      { controlId: 'CTL-03', controlName: 'Privilege Management', effectiveness: 'effective' },
      { controlId: 'CTL-04', controlName: 'Incident Response', effectiveness: 'partially_effective' },
    ],
  },
  {
    riskId: 'RSK-T02',
    riskName: 'Data Breach / Loss',
    controls: [
      { controlId: 'CTL-01', controlName: 'Multi-Factor Auth', effectiveness: 'partially_effective' },
      { controlId: 'CTL-02', controlName: 'Access Reviews', effectiveness: 'effective' },
      { controlId: 'CTL-03', controlName: 'Privilege Management', effectiveness: 'effective' },
      { controlId: 'CTL-04', controlName: 'Incident Response', effectiveness: 'effective' },
    ],
  },
  {
    riskId: 'RSK-F01',
    riskName: 'Financial Misstatement',
    controls: [
      { controlId: 'CTL-01', controlName: 'Multi-Factor Auth', effectiveness: 'not_assessed' },
      { controlId: 'CTL-02', controlName: 'Access Reviews', effectiveness: 'not_assessed' },
      { controlId: 'CTL-03', controlName: 'Privilege Management', effectiveness: 'not_assessed' },
      { controlId: 'CTL-04', controlName: 'Incident Response', effectiveness: 'not_assessed' },
    ],
  },
  {
    riskId: 'RSK-C01',
    riskName: 'Regulatory Non-Compliance',
    controls: [
      { controlId: 'CTL-01', controlName: 'Multi-Factor Auth', effectiveness: 'not_assessed' },
      { controlId: 'CTL-02', controlName: 'Access Reviews', effectiveness: 'partially_effective' },
      { controlId: 'CTL-03', controlName: 'Privilege Management', effectiveness: 'ineffective' },
      { controlId: 'CTL-04', controlName: 'Incident Response', effectiveness: 'partially_effective' },
    ],
  },
  {
    riskId: 'RSK-O01',
    riskName: 'Process Failure',
    controls: [
      { controlId: 'CTL-01', controlName: 'Multi-Factor Auth', effectiveness: 'not_assessed' },
      { controlId: 'CTL-02', controlName: 'Access Reviews', effectiveness: 'not_assessed' },
      { controlId: 'CTL-03', controlName: 'Privilege Management', effectiveness: 'partially_effective' },
      { controlId: 'CTL-04', controlName: 'Incident Response', effectiveness: 'effective' },
    ],
  },
  {
    riskId: 'RSK-P01',
    riskName: 'Key Person Dependency',
    controls: [
      { controlId: 'CTL-01', controlName: 'Multi-Factor Auth', effectiveness: 'not_assessed' },
      { controlId: 'CTL-02', controlName: 'Access Reviews', effectiveness: 'ineffective' },
      { controlId: 'CTL-03', controlName: 'Privilege Management', effectiveness: 'not_assessed' },
      { controlId: 'CTL-04', controlName: 'Incident Response', effectiveness: 'partially_effective' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Sample Action Items
// ---------------------------------------------------------------------------
const sampleActions: ActionItem[] = [
  {
    id: 'ACT-001',
    assessmentId: 'RCSA-001',
    description: 'Implement automated access recertification for critical systems',
    owner: 'James Chen',
    dueDate: '2025-02-28',
    priority: 'high',
    status: 'in_progress',
    businessUnit: 'Information Technology',
  },
  {
    id: 'ACT-002',
    assessmentId: 'RCSA-001',
    description: 'Deploy endpoint detection and response (EDR) across all workstations',
    owner: 'Maria Santos',
    dueDate: '2025-03-15',
    priority: 'critical',
    status: 'open',
    businessUnit: 'Information Technology',
  },
  {
    id: 'ACT-003',
    assessmentId: 'RCSA-003',
    description: 'Develop business continuity playbooks for top 5 operational risks',
    owner: 'Michael Torres',
    dueDate: '2025-04-30',
    priority: 'high',
    status: 'open',
    businessUnit: 'Operations',
  },
  {
    id: 'ACT-004',
    assessmentId: 'RCSA-005',
    description: 'Remediate gaps in AML transaction monitoring controls',
    owner: 'David Park',
    dueDate: '2025-01-15',
    priority: 'critical',
    status: 'overdue',
    businessUnit: 'Compliance',
  },
  {
    id: 'ACT-005',
    assessmentId: 'RCSA-005',
    description: 'Update regulatory change management process and documentation',
    owner: 'David Park',
    dueDate: '2025-02-28',
    priority: 'high',
    status: 'in_progress',
    businessUnit: 'Compliance',
  },
  {
    id: 'ACT-006',
    assessmentId: 'RCSA-002',
    description: 'Strengthen segregation of duties in accounts payable workflow',
    owner: 'Sarah Mitchell',
    dueDate: '2025-01-31',
    priority: 'medium',
    status: 'completed',
    businessUnit: 'Finance',
  },
  {
    id: 'ACT-007',
    assessmentId: 'RCSA-007',
    description: 'Implement dual authorization for treasury transfers above threshold',
    owner: 'Robert Kim',
    dueDate: '2025-03-31',
    priority: 'high',
    status: 'in_progress',
    businessUnit: 'Treasury',
  },
  {
    id: 'ACT-008',
    assessmentId: 'RCSA-009',
    description: 'Conduct penetration testing on externally-facing applications',
    owner: 'James Chen',
    dueDate: '2025-04-15',
    priority: 'critical',
    status: 'open',
    businessUnit: 'Information Technology',
  },
  {
    id: 'ACT-009',
    assessmentId: 'RCSA-004',
    description: 'Review and update employee onboarding risk acknowledgement forms',
    owner: 'Linda Nguyen',
    dueDate: '2025-02-15',
    priority: 'low',
    status: 'completed',
    businessUnit: 'Human Resources',
  },
  {
    id: 'ACT-010',
    assessmentId: 'RCSA-006',
    description: 'Establish quarterly legal risk reporting to the Board',
    owner: 'Emily Watson',
    dueDate: '2025-03-01',
    priority: 'medium',
    status: 'in_progress',
    businessUnit: 'Legal',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const TODAY = '2026-02-23';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getRiskRatingBadge(rating: OverallRiskRating): string {
  switch (rating) {
    case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'high': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case 'low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  }
}

function getAdequacyBadge(adequacy: ControlAdequacy): string {
  switch (adequacy) {
    case 'adequate': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'needs_improvement': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'inadequate': return 'bg-red-500/20 text-red-400 border-red-500/30';
  }
}

function getStatusBadge(status: AssessmentStatus): string {
  switch (status) {
    case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'not_started': return 'bg-navy-700/50 text-navy-400 border-navy-600/30';
    case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/30';
  }
}

function getDomainBadge(domain: RiskDomain): string {
  switch (domain) {
    case 'operational': return 'bg-blue-500/15 text-blue-400';
    case 'financial': return 'bg-emerald-500/15 text-emerald-400';
    case 'compliance': return 'bg-purple-500/15 text-purple-400';
    case 'technology': return 'bg-cyan-500/15 text-cyan-400';
    case 'people': return 'bg-amber-500/15 text-amber-400';
  }
}

function getActionPriorityBadge(priority: ActionPriority): string {
  switch (priority) {
    case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'high': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case 'low': return 'bg-navy-700/50 text-navy-400 border-navy-600/30';
  }
}

function getActionStatusBadge(status: ActionStatus): string {
  switch (status) {
    case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'open': return 'bg-navy-700/50 text-navy-400 border-navy-600/30';
    case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/30';
  }
}

function getEffectivenessDot(rating: EffectivenessRating): { color: string; label: string } {
  switch (rating) {
    case 'effective': return { color: 'bg-emerald-400', label: 'Effective' };
    case 'partially_effective': return { color: 'bg-amber-400', label: 'Partial' };
    case 'ineffective': return { color: 'bg-red-400', label: 'Ineffective' };
    case 'not_assessed': return { color: 'bg-navy-600', label: 'N/A' };
  }
}

function formatStatusLabel(status: string): string {
  return status.replace(/_/g, ' ');
}

// ---------------------------------------------------------------------------
// CSV Export
// ---------------------------------------------------------------------------
function exportRCSACSV(assessments: RCSAAssessment[], actions: ActionItem[]): void {
  // Assessment sheet
  const aHeaders = [
    'Assessment ID', 'Business Unit', 'Risk Domain', 'Risk Owner',
    'Assessment Period', 'Risks Identified', 'Controls Assessed',
    'Overall Risk Rating', 'Control Adequacy', 'Status',
    'Completion Date', 'Due Date',
  ];

  const aRows = assessments.map(a => [
    a.id,
    `"${a.businessUnit}"`,
    a.riskDomain,
    `"${a.riskOwner}"`,
    a.assessmentPeriod,
    a.risksIdentified.toString(),
    a.controlsAssessed.toString(),
    a.overallRiskRating,
    a.controlAdequacy,
    a.status,
    a.completionDate || '',
    a.dueDate,
  ]);

  // Action items sheet
  const actHeaders = [
    'Action ID', 'Assessment ID', 'Description', 'Owner',
    'Due Date', 'Priority', 'Status', 'Business Unit',
  ];

  const actRows = actions.map(act => [
    act.id,
    act.assessmentId,
    `"${act.description}"`,
    `"${act.owner}"`,
    act.dueDate,
    act.priority,
    act.status,
    `"${act.businessUnit}"`,
  ]);

  const csvParts = [
    '--- RCSA ASSESSMENTS ---',
    aHeaders.join(','),
    ...aRows.map(r => r.join(',')),
    '',
    '--- ACTION ITEMS ---',
    actHeaders.join(','),
    ...actRows.map(r => r.join(',')),
  ];

  const csv = csvParts.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rcsa-report-${TODAY}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function RCSATool() {
  const { isDataActive } = useData();
  const [activeTab, setActiveTab] = useState<'assessments' | 'workflow' | 'matrix' | 'actions'>('assessments');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [actionPriorityFilter, setActionPriorityFilter] = useState<string>('all');
  const [actionStatusFilter, setActionStatusFilter] = useState<string>('all');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(1);

  // Gate all data behind isDataActive
  const baseAssessments: RCSAAssessment[] = isDataActive ? sampleAssessments : [];
  const baseActions: ActionItem[] = isDataActive ? sampleActions : [];
  const baseMatrix: RiskControlMapping[] = isDataActive ? sampleRiskControlMatrix : [];

  // ---------------------------------------------------------------------------
  // Filtered assessments
  // ---------------------------------------------------------------------------
  const filteredAssessments = useMemo(() => {
    let result = [...baseAssessments];

    if (domainFilter !== 'all') {
      result = result.filter(a => a.riskDomain === domainFilter);
    }
    if (statusFilter !== 'all') {
      result = result.filter(a => a.status === statusFilter);
    }
    if (ratingFilter !== 'all') {
      result = result.filter(a => a.overallRiskRating === ratingFilter);
    }

    return result;
  }, [baseAssessments, domainFilter, statusFilter, ratingFilter]);

  // ---------------------------------------------------------------------------
  // Filtered actions
  // ---------------------------------------------------------------------------
  const filteredActions = useMemo(() => {
    let result = [...baseActions];

    if (actionPriorityFilter !== 'all') {
      result = result.filter(a => a.priority === actionPriorityFilter);
    }
    if (actionStatusFilter !== 'all') {
      result = result.filter(a => a.status === actionStatusFilter);
    }

    return result;
  }, [baseActions, actionPriorityFilter, actionStatusFilter]);

  // ---------------------------------------------------------------------------
  // Summary statistics
  // ---------------------------------------------------------------------------
  const stats = useMemo(() => {
    if (baseAssessments.length === 0) {
      return { total: 0, completed: 0, inProgress: 0, overdue: 0, compliancePct: 0 };
    }
    const total = baseAssessments.length;
    const completed = baseAssessments.filter(a => a.status === 'completed').length;
    const inProgress = baseAssessments.filter(a => a.status === 'in_progress').length;
    const overdue = baseAssessments.filter(a => a.status === 'overdue').length;
    const adequate = baseAssessments.filter(a => a.controlAdequacy === 'adequate').length;
    const compliancePct = Math.round((adequate / total) * 100);
    return { total, completed, inProgress, overdue, compliancePct };
  }, [baseAssessments]);

  // ---------------------------------------------------------------------------
  // Render: empty state
  // ---------------------------------------------------------------------------
  if (!isDataActive) {
    return (
      <div className="space-y-4 animate-fade-in">
        <PageHeader
          title="RCSA Tool"
          subtitle="Risk & Control Self-Assessment workflow, matrix analysis, and action tracking"
        />
        <div className="glass-card p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-navy-800/60 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-navy-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-navy-300 mb-2">No data available</h3>
          <p className="text-sm text-navy-500 max-w-md">
            No data available. Upload a dataset or connect your AI Advisor to begin RCSA workflows.
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: main page
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="RCSA Tool"
        subtitle="Risk & Control Self-Assessment workflow, matrix analysis, and action tracking"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportRCSACSV(filteredAssessments, filteredActions)}
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
          { label: 'Total Assessments', value: stats.total, color: 'text-navy-100' },
          { label: 'Completed', value: stats.completed, color: 'text-emerald-400' },
          { label: 'In Progress', value: stats.inProgress, color: 'text-blue-400' },
          { label: 'Overdue', value: stats.overdue, color: 'text-red-400' },
          { label: 'Overall Compliance', value: `${stats.compliancePct}%`, color: 'text-accent-primary' },
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
          { key: 'assessments', label: 'RCSA Assessments' },
          { key: 'workflow', label: 'Assessment Workflow' },
          { key: 'matrix', label: 'Risk-Control Matrix' },
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

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAB: RCSA Assessments Table                                       */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'assessments' && (
        <SectionCard
          title="RCSA Assessments"
          subtitle={`${filteredAssessments.length} of ${baseAssessments.length} assessments shown`}
          actions={
            <div className="flex items-center gap-2 flex-wrap">
              {/* Domain filter */}
              <select
                value={domainFilter}
                onChange={e => setDomainFilter(e.target.value)}
                className="px-3 py-1.5 bg-navy-800/50 border border-navy-700 rounded-lg text-xs text-navy-200 focus:outline-none focus:border-accent-primary/50"
              >
                <option value="all">All Domains</option>
                <option value="operational">Operational</option>
                <option value="financial">Financial</option>
                <option value="compliance">Compliance</option>
                <option value="technology">Technology</option>
                <option value="people">People</option>
              </select>
              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-navy-800/50 border border-navy-700 rounded-lg text-xs text-navy-200 focus:outline-none focus:border-accent-primary/50"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="not_started">Not Started</option>
                <option value="overdue">Overdue</option>
              </select>
              {/* Risk Rating filter */}
              <select
                value={ratingFilter}
                onChange={e => setRatingFilter(e.target.value)}
                className="px-3 py-1.5 bg-navy-800/50 border border-navy-700 rounded-lg text-xs text-navy-200 focus:outline-none focus:border-accent-primary/50"
              >
                <option value="all">All Ratings</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          }
          noPadding
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-navy-700 bg-navy-900/50">
                  <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[90px]">Assessment ID</th>
                  <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[140px]">Business Unit</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[100px]">Risk Domain</th>
                  <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[120px]">Risk Owner</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[90px]">Period</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[60px]">Risks</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[70px]">Controls</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[100px]">Risk Rating</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[120px]">Control Adequacy</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[100px]">Status</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[100px]">Completed</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[90px]">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssessments.map((a, idx) => (
                  <tr
                    key={a.id}
                    onClick={() => setSelectedAssessmentId(a.id === selectedAssessmentId ? null : a.id)}
                    className={cn(
                      'border-b border-navy-800 hover:bg-navy-800/30 cursor-pointer transition-colors',
                      selectedAssessmentId === a.id && 'bg-accent-primary/5',
                      idx % 2 === 0 && 'bg-navy-900/20'
                    )}
                  >
                    <td className="py-2.5 px-3 font-mono text-accent-primary font-medium">{a.id}</td>
                    <td className="py-2.5 px-3 text-navy-100 font-medium">{a.businessUnit}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={cn('px-2 py-0.5 rounded text-2xs font-medium uppercase', getDomainBadge(a.riskDomain))}>
                        {a.riskDomain}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-navy-300">{a.riskOwner}</td>
                    <td className="py-2.5 px-3 text-center text-navy-300">{a.assessmentPeriod}</td>
                    <td className="py-2.5 px-3 text-center text-navy-200 font-medium">{a.risksIdentified}</td>
                    <td className="py-2.5 px-3 text-center text-navy-200 font-medium">{a.controlsAssessed}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={cn('px-2 py-0.5 rounded text-2xs font-medium uppercase border', getRiskRatingBadge(a.overallRiskRating))}>
                        {a.overallRiskRating}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={cn('px-2 py-0.5 rounded text-2xs font-medium border', getAdequacyBadge(a.controlAdequacy))}>
                        {formatStatusLabel(a.controlAdequacy)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={cn('px-2 py-0.5 rounded text-2xs font-medium uppercase border', getStatusBadge(a.status))}>
                        {formatStatusLabel(a.status)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center text-navy-400">
                      {a.completionDate ? formatDate(a.completionDate) : '--'}
                    </td>
                    <td className={cn('py-2.5 px-3 text-center', a.status === 'overdue' ? 'text-red-400 font-medium' : 'text-navy-400')}>
                      {formatDate(a.dueDate)}
                    </td>
                  </tr>
                ))}
                {filteredAssessments.length === 0 && (
                  <tr>
                    <td colSpan={12} className="py-10 text-center text-navy-500 text-sm">
                      No assessments match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Detail panel for selected assessment */}
          {selectedAssessmentId && (() => {
            const a = baseAssessments.find(x => x.id === selectedAssessmentId);
            if (!a) return null;
            const relatedActions = baseActions.filter(act => act.assessmentId === a.id);
            return (
              <div className="p-5 border-t border-navy-700/50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs font-mono text-navy-500">{a.id}</span>
                    <h3 className="text-lg font-semibold text-navy-100">{a.businessUnit} - {a.assessmentPeriod}</h3>
                    <p className="text-sm text-navy-400 mt-1">Owner: {a.riskOwner} | Domain: {a.riskDomain}</p>
                  </div>
                  <button onClick={() => setSelectedAssessmentId(null)} className="text-navy-400 hover:text-navy-200 text-lg">
                    x
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="p-3 bg-navy-800/30 rounded-lg">
                    <p className="text-2xs text-navy-500 uppercase">Risks Identified</p>
                    <p className="text-xl font-bold text-navy-100">{a.risksIdentified}</p>
                  </div>
                  <div className="p-3 bg-navy-800/30 rounded-lg">
                    <p className="text-2xs text-navy-500 uppercase">Controls Assessed</p>
                    <p className="text-xl font-bold text-navy-100">{a.controlsAssessed}</p>
                  </div>
                  <div className="p-3 bg-navy-800/30 rounded-lg">
                    <p className="text-2xs text-navy-500 uppercase">Risk Rating</p>
                    <p className={cn('text-sm font-medium mt-1 uppercase', getRiskRatingBadge(a.overallRiskRating).split(' ')[1])}>
                      {a.overallRiskRating}
                    </p>
                  </div>
                  <div className="p-3 bg-navy-800/30 rounded-lg">
                    <p className="text-2xs text-navy-500 uppercase">Action Items</p>
                    <p className="text-xl font-bold text-navy-100">{relatedActions.length}</p>
                  </div>
                </div>
                {relatedActions.length > 0 && (
                  <div>
                    <p className="text-xs text-navy-500 uppercase mb-2">Related Actions</p>
                    <div className="space-y-1.5">
                      {relatedActions.map(act => (
                        <div key={act.id} className="flex items-center justify-between p-2.5 bg-navy-800/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-2xs text-accent-primary">{act.id}</span>
                            <span className="text-xs text-navy-200">{act.description}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={cn('px-1.5 py-0.5 rounded text-2xs font-medium border', getActionPriorityBadge(act.priority))}>
                              {act.priority}
                            </span>
                            <span className={cn('px-1.5 py-0.5 rounded text-2xs font-medium border', getActionStatusBadge(act.status))}>
                              {formatStatusLabel(act.status)}
                            </span>
                          </div>
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

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAB: Assessment Workflow                                           */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'workflow' && (
        <SectionCard
          title="RCSA Assessment Workflow"
          subtitle="Standardised 6-step process for conducting Risk & Control Self-Assessments"
        >
          {/* Visual step indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              {/* Connector line */}
              <div className="absolute top-5 left-8 right-8 h-0.5 bg-navy-700" />
              <div
                className="absolute top-5 left-8 h-0.5 bg-accent-primary transition-all duration-500"
                style={{ width: `${((activeWorkflowStep - 1) / (workflowSteps.length - 1)) * (100 - (16 / workflowSteps.length))}%` }}
              />

              {workflowSteps.map((ws) => (
                <button
                  key={ws.step}
                  onClick={() => setActiveWorkflowStep(ws.step)}
                  className="relative z-10 flex flex-col items-center group"
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2',
                      ws.step < activeWorkflowStep
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : ws.step === activeWorkflowStep
                        ? 'bg-accent-primary/20 border-accent-primary text-accent-primary'
                        : 'bg-navy-800/60 border-navy-700 text-navy-500'
                    )}
                  >
                    {ws.step < activeWorkflowStep ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      ws.step
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-2xs mt-2 font-medium text-center max-w-[80px] leading-tight',
                      ws.step === activeWorkflowStep ? 'text-accent-primary' : 'text-navy-500'
                    )}
                  >
                    {ws.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step detail */}
          {(() => {
            const currentStep = workflowSteps.find(ws => ws.step === activeWorkflowStep);
            if (!currentStep) return null;
            return (
              <div className="p-6 bg-navy-800/20 rounded-xl border border-navy-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-accent-primary/20 border border-accent-primary/40 flex items-center justify-center">
                    <span className="text-sm font-bold text-accent-primary">{currentStep.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-navy-100">{currentStep.label}</h3>
                </div>
                <p className="text-sm text-navy-400 mb-5">{currentStep.description}</p>

                {/* Step-specific guidance */}
                <div className="space-y-3">
                  {currentStep.step === 1 && (
                    <>
                      <div className="p-3 bg-navy-800/30 rounded-lg border border-navy-700/30">
                        <p className="text-xs text-navy-300 font-medium mb-1">Key Activities</p>
                        <ul className="text-xs text-navy-400 space-y-1 list-disc list-inside">
                          <li>Conduct risk workshops with business unit stakeholders</li>
                          <li>Review historical loss events and near-misses</li>
                          <li>Analyse external risk intelligence and industry benchmarks</li>
                          <li>Document risk descriptions, categories, and inherent ratings</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-navy-800/30 rounded-lg border border-navy-700/30">
                        <p className="text-xs text-navy-300 font-medium mb-1">Outputs</p>
                        <p className="text-xs text-navy-400">Risk register entries with inherent risk scores, risk owners, and categorisation</p>
                      </div>
                    </>
                  )}
                  {currentStep.step === 2 && (
                    <>
                      <div className="p-3 bg-navy-800/30 rounded-lg border border-navy-700/30">
                        <p className="text-xs text-navy-300 font-medium mb-1">Key Activities</p>
                        <ul className="text-xs text-navy-400 space-y-1 list-disc list-inside">
                          <li>Map existing controls to each identified risk</li>
                          <li>Classify controls as preventive, detective, or corrective</li>
                          <li>Identify control owners and automation level</li>
                          <li>Flag risks with no control coverage (control gaps)</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-navy-800/30 rounded-lg border border-navy-700/30">
                        <p className="text-xs text-navy-300 font-medium mb-1">Outputs</p>
                        <p className="text-xs text-navy-400">Risk-control mapping matrix with coverage indicators</p>
                      </div>
                    </>
                  )}
                  {currentStep.step === 3 && (
                    <>
                      <div className="p-3 bg-navy-800/30 rounded-lg border border-navy-700/30">
                        <p className="text-xs text-navy-300 font-medium mb-1">Key Activities</p>
                        <ul className="text-xs text-navy-400 space-y-1 list-disc list-inside">
                          <li>Assess design effectiveness of each control</li>
                          <li>Test operating effectiveness through walkthroughs and sampling</li>
                          <li>Rate controls as effective, partially effective, or ineffective</li>
                          <li>Document testing methodology and evidence</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-navy-800/30 rounded-lg border border-navy-700/30">
                        <p className="text-xs text-navy-300 font-medium mb-1">Outputs</p>
                        <p className="text-xs text-navy-400">Control effectiveness ratings with supporting test evidence</p>
                      </div>
                    </>
                  )}
                  {currentStep.step === 4 && (
                    <>
                      <div className="p-3 bg-navy-800/30 rounded-lg border border-navy-700/30">
                        <p className="text-xs text-navy-300 font-medium mb-1">Key Activities</p>
                        <ul className="text-xs text-navy-400 space-y-1 list-disc list-inside">
                          <li>Identify control gaps where risks lack adequate coverage</li>
                          <li>Calculate residual risk after control effectiveness adjustments</li>
                          <li>Compare residual risk against risk appetite thresholds</li>
                          <li>Prioritise gaps by exposure severity</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-navy-800/30 rounded-lg border border-navy-700/30">
                        <p className="text-xs text-navy-300 font-medium mb-1">Outputs</p>
                        <p className="text-xs text-navy-400">Gap register with residual risk exposure and breach indicators</p>
                      </div>
                    </>
                  )}
                  {currentStep.step === 5 && (
                    <>
                      <div className="p-3 bg-navy-800/30 rounded-lg border border-navy-700/30">
                        <p className="text-xs text-navy-300 font-medium mb-1">Key Activities</p>
                        <ul className="text-xs text-navy-400 space-y-1 list-disc list-inside">
                          <li>Develop remediation actions for each identified gap</li>
                          <li>Assign action owners and target completion dates</li>
                          <li>Set priority levels based on risk exposure</li>
                          <li>Define success criteria and monitoring approach</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-navy-800/30 rounded-lg border border-navy-700/30">
                        <p className="text-xs text-navy-300 font-medium mb-1">Outputs</p>
                        <p className="text-xs text-navy-400">Action plan with owners, deadlines, priorities, and KPIs</p>
                      </div>
                    </>
                  )}
                  {currentStep.step === 6 && (
                    <>
                      <div className="p-3 bg-navy-800/30 rounded-lg border border-navy-700/30">
                        <p className="text-xs text-navy-300 font-medium mb-1">Key Activities</p>
                        <ul className="text-xs text-navy-400 space-y-1 list-disc list-inside">
                          <li>Review assessment results with senior management</li>
                          <li>Obtain formal attestation from risk owners</li>
                          <li>Submit final report to Risk Committee</li>
                          <li>Archive assessment documentation for audit trail</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-navy-800/30 rounded-lg border border-navy-700/30">
                        <p className="text-xs text-navy-300 font-medium mb-1">Outputs</p>
                        <p className="text-xs text-navy-400">Signed-off RCSA report, management attestation, committee minutes</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Step navigation */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-navy-700/30">
                  <button
                    onClick={() => setActiveWorkflowStep(s => Math.max(1, s - 1))}
                    disabled={activeWorkflowStep === 1}
                    className={cn(
                      'btn-secondary text-xs',
                      activeWorkflowStep === 1 && 'opacity-40 cursor-not-allowed'
                    )}
                  >
                    Previous Step
                  </button>
                  <span className="text-xs text-navy-500">
                    Step {activeWorkflowStep} of {workflowSteps.length}
                  </span>
                  <button
                    onClick={() => setActiveWorkflowStep(s => Math.min(workflowSteps.length, s + 1))}
                    disabled={activeWorkflowStep === workflowSteps.length}
                    className={cn(
                      'btn-primary text-xs',
                      activeWorkflowStep === workflowSteps.length && 'opacity-40 cursor-not-allowed'
                    )}
                  >
                    Next Step
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Assessment Progress by Business Unit */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-navy-300 mb-3">Assessment Progress by Business Unit</h4>
            <div className="space-y-2">
              {(() => {
                const units = [...new Set(baseAssessments.map(a => a.businessUnit))];
                return units.map(unit => {
                  const unitAssessments = baseAssessments.filter(a => a.businessUnit === unit);
                  const completedCount = unitAssessments.filter(a => a.status === 'completed').length;
                  const pct = Math.round((completedCount / unitAssessments.length) * 100);
                  return (
                    <div key={unit} className="flex items-center gap-3">
                      <span className="text-xs text-navy-300 w-40 truncate">{unit}</span>
                      <div className="flex-1 h-2.5 bg-navy-800 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            pct === 100 ? 'bg-emerald-500' : pct > 0 ? 'bg-accent-primary' : 'bg-navy-700'
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className={cn(
                        'text-xs font-mono font-medium w-10 text-right',
                        pct === 100 ? 'text-emerald-400' : 'text-navy-400'
                      )}>
                        {pct}%
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </SectionCard>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAB: Risk-Control Matrix                                          */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'matrix' && (
        <SectionCard
          title="Risk-Control Matrix"
          subtitle="Effectiveness ratings for each risk-control pair (green = effective, amber = partial, red = ineffective)"
        >
          {baseMatrix.length === 0 ? (
            <p className="text-center text-navy-500 py-8">No data to display.</p>
          ) : (
            <>
              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 text-xs mb-6">
                <span className="text-navy-400 font-medium">Legend:</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-400" /> Effective
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-400" /> Partially Effective
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400" /> Ineffective
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-navy-600" /> Not Assessed
                </span>
              </div>

              {/* Matrix grid */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 text-left text-sm text-navy-300 font-medium min-w-[200px] bg-navy-900/30">
                        Risk / Control
                      </th>
                      {/* Column headers from first row's controls */}
                      {baseMatrix[0].controls.map(c => (
                        <th key={c.controlId} className="py-3 px-4 text-center text-xs text-navy-300 font-medium min-w-[120px] bg-navy-900/30">
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="font-mono text-2xs text-navy-500">{c.controlId}</span>
                            <span>{c.controlName}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {baseMatrix.map((mapping, rIdx) => (
                      <tr key={mapping.riskId} className={cn('border-t border-navy-800', rIdx % 2 === 0 && 'bg-navy-900/10')}>
                        <td className="py-3 px-4">
                          <div>
                            <span className="text-xs font-mono text-accent-primary">{mapping.riskId}</span>
                            <p className="text-sm text-navy-200 font-medium">{mapping.riskName}</p>
                          </div>
                        </td>
                        {mapping.controls.map(ctrl => {
                          const dot = getEffectivenessDot(ctrl.effectiveness);
                          return (
                            <td key={ctrl.controlId} className="py-3 px-4 text-center">
                              <div className="flex flex-col items-center gap-1">
                                <span className={cn('w-4 h-4 rounded-full', dot.color)} title={dot.label} />
                                <span className="text-2xs text-navy-500">{dot.label}</span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Matrix summary */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {(() => {
                  const allRatings = baseMatrix.flatMap(m => m.controls.map(c => c.effectiveness));
                  const assessed = allRatings.filter(r => r !== 'not_assessed');
                  const effective = allRatings.filter(r => r === 'effective').length;
                  const partial = allRatings.filter(r => r === 'partially_effective').length;
                  const ineffective = allRatings.filter(r => r === 'ineffective').length;
                  const notAssessed = allRatings.filter(r => r === 'not_assessed').length;
                  const coveragePct = assessed.length > 0 ? Math.round((effective / assessed.length) * 100) : 0;

                  return [
                    { label: 'Effective', value: effective, color: 'text-emerald-400', border: 'border-emerald-500/20' },
                    { label: 'Partially Effective', value: partial, color: 'text-amber-400', border: 'border-amber-500/20' },
                    { label: 'Ineffective', value: ineffective, color: 'text-red-400', border: 'border-red-500/20' },
                    { label: 'Not Assessed', value: notAssessed, color: 'text-navy-400', border: 'border-navy-600/20' },
                  ].map(item => (
                    <div key={item.label} className={cn('glass-card p-4 border', item.border)}>
                      <span className={cn('text-2xl font-bold', item.color)}>{item.value}</span>
                      <p className="text-xs text-navy-400 mt-1">{item.label}</p>
                    </div>
                  ));
                })()}
              </div>
            </>
          )}
        </SectionCard>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAB: Action Items Tracker                                         */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'actions' && (
        <SectionCard
          title="Action Items Tracker"
          subtitle={`${filteredActions.length} of ${baseActions.length} actions shown`}
          actions={
            <div className="flex items-center gap-2 flex-wrap">
              {/* Priority filter */}
              <select
                value={actionPriorityFilter}
                onChange={e => setActionPriorityFilter(e.target.value)}
                className="px-3 py-1.5 bg-navy-800/50 border border-navy-700 rounded-lg text-xs text-navy-200 focus:outline-none focus:border-accent-primary/50"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              {/* Action Status filter */}
              <select
                value={actionStatusFilter}
                onChange={e => setActionStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-navy-800/50 border border-navy-700 rounded-lg text-xs text-navy-200 focus:outline-none focus:border-accent-primary/50"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          }
          noPadding
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-navy-700 bg-navy-900/50">
                  <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[80px]">Action ID</th>
                  <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[70px]">RCSA</th>
                  <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[280px]">Description</th>
                  <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[120px]">Owner</th>
                  <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[110px]">Business Unit</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[90px]">Due Date</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[80px]">Priority</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[90px]">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredActions.map((act, idx) => {
                  const isOverdue = act.status === 'overdue' || (act.status !== 'completed' && act.dueDate < TODAY);
                  return (
                    <tr
                      key={act.id}
                      className={cn(
                        'border-b border-navy-800 hover:bg-navy-800/30 transition-colors',
                        idx % 2 === 0 && 'bg-navy-900/20'
                      )}
                    >
                      <td className="py-2.5 px-3 font-mono text-accent-primary font-medium">{act.id}</td>
                      <td className="py-2.5 px-3 font-mono text-navy-400">{act.assessmentId}</td>
                      <td className="py-2.5 px-3 text-navy-200">{act.description}</td>
                      <td className="py-2.5 px-3 text-navy-300">{act.owner}</td>
                      <td className="py-2.5 px-3 text-navy-300">{act.businessUnit}</td>
                      <td className={cn('py-2.5 px-3 text-center', isOverdue ? 'text-red-400 font-medium' : 'text-navy-400')}>
                        {formatDate(act.dueDate)}
                        {isOverdue && act.status !== 'completed' && <span className="block text-2xs text-red-400">(overdue)</span>}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={cn('px-2 py-0.5 rounded text-2xs font-medium uppercase border', getActionPriorityBadge(act.priority))}>
                          {act.priority}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={cn('px-2 py-0.5 rounded text-2xs font-medium uppercase border', getActionStatusBadge(act.status))}>
                          {formatStatusLabel(act.status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {filteredActions.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-navy-500 text-sm">
                      No action items match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Action summary bar */}
          <div className="p-5 border-t border-navy-700/50">
            <h4 className="text-sm font-medium text-navy-300 mb-3">Action Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(() => {
                const openCount = baseActions.filter(a => a.status === 'open').length;
                const ipCount = baseActions.filter(a => a.status === 'in_progress').length;
                const completedCount = baseActions.filter(a => a.status === 'completed').length;
                const overdueCount = baseActions.filter(a => a.status === 'overdue' || (a.status !== 'completed' && a.dueDate < TODAY)).length;

                return [
                  { label: 'Open', value: openCount, color: 'text-navy-300', border: 'border-navy-600/30' },
                  { label: 'In Progress', value: ipCount, color: 'text-blue-400', border: 'border-blue-500/20' },
                  { label: 'Completed', value: completedCount, color: 'text-emerald-400', border: 'border-emerald-500/20' },
                  { label: 'Overdue', value: overdueCount, color: 'text-red-400', border: 'border-red-500/20' },
                ].map(item => (
                  <div key={item.label} className={cn('p-3 bg-navy-800/20 rounded-lg border', item.border)}>
                    <span className={cn('text-xl font-bold', item.color)}>{item.value}</span>
                    <p className="text-2xs text-navy-500 uppercase mt-0.5">{item.label}</p>
                  </div>
                ));
              })()}
            </div>

            {/* Completion rate bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-navy-400">Overall Action Completion Rate</span>
                <span className="font-mono font-bold text-accent-primary">
                  {baseActions.length > 0 ? Math.round((baseActions.filter(a => a.status === 'completed').length / baseActions.length) * 100) : 0}%
                </span>
              </div>
              <div className="h-3 bg-navy-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent-primary transition-all"
                  style={{
                    width: `${baseActions.length > 0 ? (baseActions.filter(a => a.status === 'completed').length / baseActions.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
