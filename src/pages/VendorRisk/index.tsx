// Vendor Risk Portal — Third-party vendor risk management, concentration analysis, due diligence tracking
// Follows Lumina-R patterns: glass-card, navy color scheme, accent-primary, isDataActive gating

import { useState, useMemo } from 'react';
import { PageHeader, SectionCard } from '../../components';
import { useData } from '../../context/DataContext';
import { cn } from '../../utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type VendorCategory = 'technology' | 'financial' | 'professional_services' | 'logistics' | 'cloud';
type VendorCriticality = 'critical' | 'high' | 'medium' | 'low';
type VendorStatus = 'active' | 'under_review' | 'onboarding' | 'offboarding';
type DataAccess = 'full' | 'limited' | 'none';
type VendorRating = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  service: string;
  criticality: VendorCriticality;
  riskScore: number;           // 0-100
  contractValue: number;       // GBP
  contractEnd: string;
  lastAssessment: string;
  slaCompliance: number;       // 0-100
  dataAccess: DataAccess;
  status: VendorStatus;
  rating: VendorRating;
}

interface DueDiligenceItem {
  vendorId: string;
  vendorName: string;
  reviewType: string;
  dueDate: string;
  assignee: string;
}

// ---------------------------------------------------------------------------
// Sample Vendor Data (10 vendors)
// ---------------------------------------------------------------------------
const sampleVendors: Vendor[] = [
  {
    id: 'VND-001',
    name: 'AWS',
    category: 'cloud',
    service: 'Cloud Infrastructure & Compute',
    criticality: 'critical',
    riskScore: 28,
    contractValue: 2_450_000,
    contractEnd: '2027-03-31',
    lastAssessment: '2026-01-15',
    slaCompliance: 99.7,
    dataAccess: 'full',
    status: 'active',
    rating: 'A',
  },
  {
    id: 'VND-002',
    name: 'Salesforce',
    category: 'technology',
    service: 'CRM Platform & Marketing Automation',
    criticality: 'high',
    riskScore: 35,
    contractValue: 820_000,
    contractEnd: '2026-09-30',
    lastAssessment: '2025-11-20',
    slaCompliance: 98.2,
    dataAccess: 'full',
    status: 'active',
    rating: 'B',
  },
  {
    id: 'VND-003',
    name: 'Accenture',
    category: 'professional_services',
    service: 'Strategic Consulting & Digital Transformation',
    criticality: 'medium',
    riskScore: 42,
    contractValue: 1_350_000,
    contractEnd: '2026-12-31',
    lastAssessment: '2026-02-01',
    slaCompliance: 95.5,
    dataAccess: 'limited',
    status: 'active',
    rating: 'B',
  },
  {
    id: 'VND-004',
    name: 'Deloitte',
    category: 'professional_services',
    service: 'Internal Audit & Risk Advisory',
    criticality: 'high',
    riskScore: 30,
    contractValue: 980_000,
    contractEnd: '2026-06-30',
    lastAssessment: '2026-01-10',
    slaCompliance: 97.8,
    dataAccess: 'full',
    status: 'active',
    rating: 'A',
  },
  {
    id: 'VND-005',
    name: 'Oracle',
    category: 'technology',
    service: 'Database Management & ERP Systems',
    criticality: 'critical',
    riskScore: 52,
    contractValue: 1_780_000,
    contractEnd: '2026-08-15',
    lastAssessment: '2025-10-05',
    slaCompliance: 94.1,
    dataAccess: 'full',
    status: 'under_review',
    rating: 'C',
  },
  {
    id: 'VND-006',
    name: 'Microsoft Azure',
    category: 'cloud',
    service: 'Cloud Services & Active Directory',
    criticality: 'critical',
    riskScore: 25,
    contractValue: 1_920_000,
    contractEnd: '2027-01-31',
    lastAssessment: '2026-02-10',
    slaCompliance: 99.5,
    dataAccess: 'full',
    status: 'active',
    rating: 'A',
  },
  {
    id: 'VND-007',
    name: 'Bloomberg',
    category: 'financial',
    service: 'Market Data & Analytics Terminal',
    criticality: 'high',
    riskScore: 38,
    contractValue: 640_000,
    contractEnd: '2026-11-30',
    lastAssessment: '2025-12-18',
    slaCompliance: 99.1,
    dataAccess: 'limited',
    status: 'active',
    rating: 'B',
  },
  {
    id: 'VND-008',
    name: 'Refinitiv',
    category: 'financial',
    service: 'Financial Data Feeds & Risk Analytics',
    criticality: 'high',
    riskScore: 45,
    contractValue: 520_000,
    contractEnd: '2026-07-31',
    lastAssessment: '2025-09-22',
    slaCompliance: 96.3,
    dataAccess: 'limited',
    status: 'under_review',
    rating: 'C',
  },
  {
    id: 'VND-009',
    name: 'Iron Mountain',
    category: 'logistics',
    service: 'Secure Document Storage & Destruction',
    criticality: 'low',
    riskScore: 18,
    contractValue: 145_000,
    contractEnd: '2027-06-30',
    lastAssessment: '2026-01-28',
    slaCompliance: 99.9,
    dataAccess: 'none',
    status: 'active',
    rating: 'A',
  },
  {
    id: 'VND-010',
    name: 'Cloudflare',
    category: 'cloud',
    service: 'CDN, DDoS Protection & Web Security',
    criticality: 'medium',
    riskScore: 22,
    contractValue: 185_000,
    contractEnd: '2026-10-31',
    lastAssessment: '2026-02-05',
    slaCompliance: 99.8,
    dataAccess: 'limited',
    status: 'onboarding',
    rating: 'A',
  },
];

// ---------------------------------------------------------------------------
// Sample Due Diligence Items
// ---------------------------------------------------------------------------
const sampleDueDiligence: DueDiligenceItem[] = [
  { vendorId: 'VND-005', vendorName: 'Oracle', reviewType: 'Annual Security Assessment', dueDate: '2026-03-05', assignee: 'James Chen' },
  { vendorId: 'VND-008', vendorName: 'Refinitiv', reviewType: 'SLA Performance Review', dueDate: '2026-03-10', assignee: 'Sarah Mitchell' },
  { vendorId: 'VND-002', vendorName: 'Salesforce', reviewType: 'Data Privacy Impact Assessment', dueDate: '2026-03-18', assignee: 'Emma Richardson' },
  { vendorId: 'VND-004', vendorName: 'Deloitte', reviewType: 'Contract Renewal Assessment', dueDate: '2026-04-15', assignee: 'David Hargreaves' },
  { vendorId: 'VND-001', vendorName: 'AWS', reviewType: 'Penetration Test Review', dueDate: '2026-04-30', assignee: 'Marcus Webb' },
  { vendorId: 'VND-007', vendorName: 'Bloomberg', reviewType: 'Business Continuity Assessment', dueDate: '2026-05-20', assignee: 'Michael Torres' },
  { vendorId: 'VND-006', vendorName: 'Microsoft Azure', reviewType: 'SOC 2 Report Review', dueDate: '2026-06-01', assignee: 'James Chen' },
  { vendorId: 'VND-010', vendorName: 'Cloudflare', reviewType: 'Onboarding Due Diligence', dueDate: '2026-03-01', assignee: 'Marcus Webb' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const TODAY = '2026-02-23';

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - new Date(TODAY).getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value);
}

function getCriticalityBadge(criticality: VendorCriticality): string {
  switch (criticality) {
    case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'high': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case 'low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  }
}

function getStatusBadge(status: VendorStatus): string {
  switch (status) {
    case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'under_review': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'onboarding': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'offboarding': return 'bg-red-500/20 text-red-400 border-red-500/30';
  }
}

function getStatusLabel(status: string): string {
  return status.replace(/_/g, ' ');
}

function getRatingBadge(rating: VendorRating): string {
  switch (rating) {
    case 'A': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'B': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'C': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'D': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'E': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'F': return 'bg-red-600/20 text-red-300 border-red-600/30';
  }
}

function getDataAccessBadge(access: DataAccess): string {
  switch (access) {
    case 'full': return 'bg-red-500/15 text-red-400';
    case 'limited': return 'bg-amber-500/15 text-amber-400';
    case 'none': return 'bg-emerald-500/15 text-emerald-400';
  }
}

function getCategoryLabel(category: VendorCategory): string {
  switch (category) {
    case 'technology': return 'Technology';
    case 'financial': return 'Financial';
    case 'professional_services': return 'Professional Services';
    case 'logistics': return 'Logistics';
    case 'cloud': return 'Cloud';
  }
}

function getCategoryBadge(category: VendorCategory): string {
  switch (category) {
    case 'technology': return 'bg-cyan-500/15 text-cyan-400';
    case 'financial': return 'bg-emerald-500/15 text-emerald-400';
    case 'professional_services': return 'bg-purple-500/15 text-purple-400';
    case 'logistics': return 'bg-amber-500/15 text-amber-400';
    case 'cloud': return 'bg-blue-500/15 text-blue-400';
  }
}

function getRiskScoreColor(score: number): string {
  if (score >= 75) return 'bg-red-500';
  if (score >= 50) return 'bg-amber-500';
  if (score >= 25) return 'bg-yellow-500';
  return 'bg-emerald-500';
}

function getRiskScoreText(score: number): string {
  if (score >= 75) return 'text-red-400';
  if (score >= 50) return 'text-amber-400';
  if (score >= 25) return 'text-yellow-300';
  return 'text-emerald-400';
}

function getUrgencyColor(days: number): { dot: string; border: string; bg: string; text: string } {
  if (days < 0) return { dot: 'bg-red-400', border: 'border-red-500/20', bg: 'bg-red-500/5', text: 'text-red-400' };
  if (days <= 30) return { dot: 'bg-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/5', text: 'text-amber-400' };
  if (days <= 60) return { dot: 'bg-yellow-400', border: 'border-yellow-500/20', bg: 'bg-yellow-500/5', text: 'text-yellow-300' };
  return { dot: 'bg-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', text: 'text-emerald-400' };
}

// ---------------------------------------------------------------------------
// CSV Export
// ---------------------------------------------------------------------------
function exportVendorCSV(vendors: Vendor[]): void {
  const headers = [
    'Vendor ID', 'Name', 'Category', 'Service', 'Criticality', 'Risk Score',
    'Contract Value (GBP)', 'Contract End', 'Last Assessment', 'SLA Compliance %',
    'Data Access', 'Status', 'Rating',
  ];

  const rows = vendors.map(v => [
    v.id,
    `"${v.name}"`,
    getCategoryLabel(v.category),
    `"${v.service}"`,
    v.criticality,
    v.riskScore.toString(),
    v.contractValue.toString(),
    v.contractEnd,
    v.lastAssessment,
    v.slaCompliance.toString(),
    v.dataAccess,
    v.status,
    v.rating,
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vendor-risk-report-${TODAY}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function VendorRisk() {
  const { isDataActive } = useData();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [criticalityFilter, setCriticalityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Vendor form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<VendorCategory>('technology');
  const [formService, setFormService] = useState('');
  const [formCriticality, setFormCriticality] = useState<VendorCriticality>('medium');
  const [formRiskScore, setFormRiskScore] = useState(50);
  const [formContractValue, setFormContractValue] = useState(0);
  const [formContractEnd, setFormContractEnd] = useState('');
  const [formDataAccess, setFormDataAccess] = useState<DataAccess>('limited');
  const [formStatus, setFormStatus] = useState<VendorStatus>('onboarding');

  // Local vendor list to support adding
  const [addedVendors, setAddedVendors] = useState<Vendor[]>([]);

  // Gate all data behind isDataActive
  const baseVendors: Vendor[] = isDataActive ? [...sampleVendors, ...addedVendors] : [];
  const baseDueDiligence: DueDiligenceItem[] = isDataActive ? sampleDueDiligence : [];

  // ---------------------------------------------------------------------------
  // Filtered vendors
  // ---------------------------------------------------------------------------
  const filteredVendors = useMemo(() => {
    let result = [...baseVendors];
    if (categoryFilter !== 'all') {
      result = result.filter(v => v.category === categoryFilter);
    }
    if (criticalityFilter !== 'all') {
      result = result.filter(v => v.criticality === criticalityFilter);
    }
    if (statusFilter !== 'all') {
      result = result.filter(v => v.status === statusFilter);
    }
    return result;
  }, [baseVendors, categoryFilter, criticalityFilter, statusFilter]);

  // ---------------------------------------------------------------------------
  // Summary statistics
  // ---------------------------------------------------------------------------
  const stats = useMemo(() => {
    if (baseVendors.length === 0) {
      return { total: 0, critical: 0, high: 0, medium: 0, low: 0, avgRiskScore: 0 };
    }
    const total = baseVendors.length;
    const critical = baseVendors.filter(v => v.criticality === 'critical').length;
    const high = baseVendors.filter(v => v.criticality === 'high').length;
    const medium = baseVendors.filter(v => v.criticality === 'medium').length;
    const low = baseVendors.filter(v => v.criticality === 'low').length;
    const avgRiskScore = Math.round(baseVendors.reduce((sum, v) => sum + v.riskScore, 0) / total);
    return { total, critical, high, medium, low, avgRiskScore };
  }, [baseVendors]);

  // ---------------------------------------------------------------------------
  // Concentration Risk — vendor spend by category
  // ---------------------------------------------------------------------------
  const concentrationData = useMemo(() => {
    if (baseVendors.length === 0) return [];
    const catMap = new Map<VendorCategory, number>();
    for (const v of baseVendors) {
      catMap.set(v.category, (catMap.get(v.category) || 0) + v.contractValue);
    }
    const entries = Array.from(catMap.entries()).map(([category, spend]) => ({
      category,
      spend,
      label: getCategoryLabel(category),
    }));
    entries.sort((a, b) => b.spend - a.spend);
    return entries;
  }, [baseVendors]);

  const maxConcentrationSpend = useMemo(() => {
    if (concentrationData.length === 0) return 1;
    return Math.max(...concentrationData.map(d => d.spend));
  }, [concentrationData]);

  const totalSpend = useMemo(() => {
    return baseVendors.reduce((sum, v) => sum + v.contractValue, 0);
  }, [baseVendors]);

  // ---------------------------------------------------------------------------
  // Due Diligence sorted by date
  // ---------------------------------------------------------------------------
  const sortedDueDiligence = useMemo(() => {
    return [...baseDueDiligence].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [baseDueDiligence]);

  // ---------------------------------------------------------------------------
  // Handle Add Vendor
  // ---------------------------------------------------------------------------
  function handleAddVendor() {
    if (!formName.trim() || !formService.trim() || !formContractEnd) return;

    const ratingScore = formRiskScore;
    let rating: VendorRating = 'A';
    if (ratingScore >= 80) rating = 'F';
    else if (ratingScore >= 65) rating = 'E';
    else if (ratingScore >= 50) rating = 'D';
    else if (ratingScore >= 35) rating = 'C';
    else if (ratingScore >= 20) rating = 'B';

    const newVendor: Vendor = {
      id: `VND-${String(sampleVendors.length + addedVendors.length + 1).padStart(3, '0')}`,
      name: formName.trim(),
      category: formCategory,
      service: formService.trim(),
      criticality: formCriticality,
      riskScore: formRiskScore,
      contractValue: formContractValue,
      contractEnd: formContractEnd,
      lastAssessment: TODAY,
      slaCompliance: 100,
      dataAccess: formDataAccess,
      status: formStatus,
      rating,
    };

    setAddedVendors(prev => [...prev, newVendor]);
    setShowAddModal(false);
    resetForm();
  }

  function resetForm() {
    setFormName('');
    setFormCategory('technology');
    setFormService('');
    setFormCriticality('medium');
    setFormRiskScore(50);
    setFormContractValue(0);
    setFormContractEnd('');
    setFormDataAccess('limited');
    setFormStatus('onboarding');
  }

  // ---------------------------------------------------------------------------
  // Render: empty state
  // ---------------------------------------------------------------------------
  if (!isDataActive) {
    return (
      <div className="space-y-4 animate-fade-in">
        <PageHeader
          title="Vendor Risk Portal"
          subtitle="Third-party vendor risk management, concentration analysis, and due diligence tracking"
        />
        <div className="glass-card p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-navy-800/60 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-navy-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349m-18 0a2.997 2.997 0 00.739 1.286l.001.001m16.52-1.287a2.997 2.997 0 01-.74 1.286m0 0l-.001.001M6 12h.008v.008H6V12zm0 3h.008v.008H6V15zm0 3h.008v.008H6V18z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-navy-300 mb-2">No data available</h3>
          <p className="text-sm text-navy-500 max-w-md">
            No data available. Upload a dataset or connect your AI Advisor to begin vendor risk assessment.
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
        title="Vendor Risk Portal"
        subtitle="Third-party vendor risk management, concentration analysis, and due diligence tracking"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary text-sm flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Vendor
            </button>
            <button
              onClick={() => exportVendorCSV(filteredVendors)}
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
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { label: 'Total Vendors', value: stats.total, color: 'text-navy-100' },
          { label: 'Critical', value: stats.critical, color: 'text-red-400' },
          { label: 'High', value: stats.high, color: 'text-amber-400' },
          { label: 'Medium', value: stats.medium, color: 'text-yellow-300' },
          { label: 'Low', value: stats.low, color: 'text-emerald-400' },
          { label: 'Avg Risk Score', value: stats.avgRiskScore, color: getRiskScoreText(stats.avgRiskScore) },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4 flex flex-col items-center justify-center">
            <span className={cn('text-2xl font-bold', stat.color)}>{stat.value}</span>
            <span className="text-2xs text-navy-500 uppercase mt-1 text-center">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Vendor Table                                                       */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <SectionCard
        title="Vendor Register"
        subtitle={`${filteredVendors.length} of ${baseVendors.length} vendors shown`}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category filter */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 bg-navy-800/50 border border-navy-700 rounded-lg text-xs text-navy-200 focus:outline-none focus:border-accent-primary/50"
            >
              <option value="all">All Categories</option>
              <option value="technology">Technology</option>
              <option value="financial">Financial</option>
              <option value="professional_services">Professional Services</option>
              <option value="logistics">Logistics</option>
              <option value="cloud">Cloud</option>
            </select>
            {/* Criticality filter */}
            <select
              value={criticalityFilter}
              onChange={e => setCriticalityFilter(e.target.value)}
              className="px-3 py-1.5 bg-navy-800/50 border border-navy-700 rounded-lg text-xs text-navy-200 focus:outline-none focus:border-accent-primary/50"
            >
              <option value="all">All Criticality</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
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
              <option value="onboarding">Onboarding</option>
              <option value="offboarding">Offboarding</option>
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
                <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[130px]">Vendor</th>
                <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[120px]">Category</th>
                <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[200px]">Service</th>
                <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[90px]">Criticality</th>
                <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[140px]">Risk Score</th>
                <th className="py-2.5 px-3 text-right text-navy-300 font-medium min-w-[110px]">Contract Value</th>
                <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[100px]">Contract End</th>
                <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[100px]">Last Assessment</th>
                <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[80px]">SLA %</th>
                <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[90px]">Data Access</th>
                <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[100px]">Status</th>
                <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[60px]">Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((v, idx) => (
                <tr
                  key={v.id}
                  className={cn(
                    'border-b border-navy-800 hover:bg-navy-800/30 transition-colors',
                    idx % 2 === 0 && 'bg-navy-900/20'
                  )}
                >
                  <td className="py-2.5 px-3 font-mono text-accent-primary font-medium">{v.id}</td>
                  <td className="py-2.5 px-3 text-navy-100 font-medium">{v.name}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={cn('px-2 py-0.5 rounded text-2xs font-medium', getCategoryBadge(v.category))}>
                      {getCategoryLabel(v.category)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-navy-300" title={v.service}>
                    <span className="line-clamp-1">{v.service}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={cn('px-2 py-0.5 rounded text-2xs font-medium uppercase border', getCriticalityBadge(v.criticality))}>
                      {v.criticality}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-navy-800 rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full transition-all', getRiskScoreColor(v.riskScore))}
                          style={{ width: `${v.riskScore}%` }}
                        />
                      </div>
                      <span className={cn('text-xs font-mono font-medium w-7 text-right', getRiskScoreText(v.riskScore))}>
                        {v.riskScore}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right text-navy-200 font-medium font-mono">
                    {formatCurrency(v.contractValue)}
                  </td>
                  <td className="py-2.5 px-3 text-center text-navy-400">{formatDate(v.contractEnd)}</td>
                  <td className="py-2.5 px-3 text-center text-navy-400">{formatDate(v.lastAssessment)}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={cn(
                      'font-mono font-medium',
                      v.slaCompliance >= 99 ? 'text-emerald-400' : v.slaCompliance >= 95 ? 'text-amber-400' : 'text-red-400'
                    )}>
                      {v.slaCompliance.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={cn('px-2 py-0.5 rounded text-2xs font-medium capitalize', getDataAccessBadge(v.dataAccess))}>
                      {v.dataAccess}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={cn('px-2 py-0.5 rounded text-2xs font-medium uppercase border', getStatusBadge(v.status))}>
                      {getStatusLabel(v.status)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={cn('px-2 py-0.5 rounded text-2xs font-bold border', getRatingBadge(v.rating))}>
                      {v.rating}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredVendors.length === 0 && (
                <tr>
                  <td colSpan={13} className="py-10 text-center text-navy-500 text-sm">
                    No vendors match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Concentration Risk — Vendor Spend by Category                     */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <SectionCard
        title="Concentration Risk"
        subtitle={`Total vendor spend: ${formatCurrency(totalSpend)} across ${concentrationData.length} categories`}
      >
        {concentrationData.length === 0 ? (
          <p className="text-center text-navy-500 py-8">No data to display.</p>
        ) : (
          <div className="space-y-4">
            {concentrationData.map(({ category, spend, label }) => {
              const pct = totalSpend > 0 ? Math.round((spend / totalSpend) * 100) : 0;
              const barWidth = maxConcentrationSpend > 0 ? Math.round((spend / maxConcentrationSpend) * 100) : 0;
              const vendorCount = baseVendors.filter(v => v.category === category).length;

              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-3">
                      <span className={cn('px-2 py-0.5 rounded text-xs font-medium', getCategoryBadge(category))}>
                        {label}
                      </span>
                      <span className="text-2xs text-navy-500">
                        {vendorCount} vendor{vendorCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono font-medium text-navy-200">
                        {formatCurrency(spend)}
                      </span>
                      <span className={cn(
                        'text-xs font-mono font-bold w-10 text-right',
                        pct >= 40 ? 'text-red-400' : pct >= 25 ? 'text-amber-400' : 'text-emerald-400'
                      )}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-6 bg-navy-800 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all flex items-center justify-end pr-2',
                        pct >= 40 ? 'bg-red-500/40' : pct >= 25 ? 'bg-amber-500/40' : 'bg-accent-primary/30'
                      )}
                      style={{ width: `${barWidth}%` }}
                    >
                      {barWidth >= 20 && (
                        <span className="text-2xs font-medium text-white/80">{formatCurrency(spend)}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Concentration warning */}
            {(() => {
              const topCategory = concentrationData[0];
              const topPct = totalSpend > 0 ? Math.round((topCategory.spend / totalSpend) * 100) : 0;
              if (topPct >= 35) {
                return (
                  <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2">
                    <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <div>
                      <p className="text-xs text-amber-400 font-medium">Concentration Warning</p>
                      <p className="text-xs text-navy-400 mt-0.5">
                        {topCategory.label} category represents {topPct}% of total vendor spend.
                        Consider diversifying to reduce single-category dependency risk.
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}
      </SectionCard>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Due Diligence Tracker                                              */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <SectionCard
        title="Due Diligence Tracker"
        subtitle="Upcoming vendor reviews and assessments"
      >
        {sortedDueDiligence.length === 0 ? (
          <p className="text-center text-navy-500 py-8">No upcoming reviews.</p>
        ) : (
          <div className="space-y-3">
            {/* Legend */}
            <div className="flex items-center gap-3 text-xs text-navy-400 mb-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Overdue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Due within 30 days
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" /> Due within 60 days
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> On track
              </span>
            </div>

            {sortedDueDiligence.map((item, idx) => {
              const days = daysUntil(item.dueDate);
              const urgency = getUrgencyColor(days);
              const timeLabel = days < 0
                ? `${Math.abs(days)} days overdue`
                : days === 0
                ? 'Due today'
                : `In ${days} days`;

              return (
                <div
                  key={`${item.vendorId}-${idx}`}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-lg border transition-colors',
                    urgency.border, urgency.bg
                  )}
                >
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <span className={cn('w-3 h-3 rounded-full', urgency.dot)} />
                    {idx < sortedDueDiligence.length - 1 && (
                      <span className="w-px h-4 bg-navy-700 mt-1" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-accent-primary">{item.vendorId}</span>
                      <span className="text-sm text-navy-100 font-medium">{item.vendorName}</span>
                    </div>
                    <p className="text-xs text-navy-400 mt-1">{item.reviewType}</p>
                    <span className="text-2xs text-navy-500">Assignee: {item.assignee}</span>
                  </div>

                  {/* Date */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-navy-400">
                      Due: <span className="text-navy-200 font-medium">{formatDate(item.dueDate)}</span>
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
        )}
      </SectionCard>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Add Vendor Modal                                                   */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { setShowAddModal(false); resetForm(); }}
          />

          {/* Modal */}
          <div className="relative glass-card w-full max-w-lg mx-4 p-6 border border-navy-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-navy-100">Add New Vendor</h2>
              <button
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="text-navy-400 hover:text-navy-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Vendor Name */}
              <div>
                <label className="block text-xs text-navy-400 font-medium mb-1">Vendor Name *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-200 placeholder-navy-600 focus:outline-none focus:border-accent-primary/50"
                />
              </div>

              {/* Category & Criticality */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-navy-400 font-medium mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as VendorCategory)}
                    className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-200 focus:outline-none focus:border-accent-primary/50"
                  >
                    <option value="technology">Technology</option>
                    <option value="financial">Financial</option>
                    <option value="professional_services">Professional Services</option>
                    <option value="logistics">Logistics</option>
                    <option value="cloud">Cloud</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-navy-400 font-medium mb-1">Criticality</label>
                  <select
                    value={formCriticality}
                    onChange={e => setFormCriticality(e.target.value as VendorCriticality)}
                    className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-200 focus:outline-none focus:border-accent-primary/50"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              {/* Service */}
              <div>
                <label className="block text-xs text-navy-400 font-medium mb-1">Service Description *</label>
                <input
                  type="text"
                  value={formService}
                  onChange={e => setFormService(e.target.value)}
                  placeholder="e.g. Data Centre Hosting"
                  className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-200 placeholder-navy-600 focus:outline-none focus:border-accent-primary/50"
                />
              </div>

              {/* Risk Score */}
              <div>
                <label className="block text-xs text-navy-400 font-medium mb-1">
                  Risk Score: <span className={cn('font-bold', getRiskScoreText(formRiskScore))}>{formRiskScore}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={formRiskScore}
                  onChange={e => setFormRiskScore(Number(e.target.value))}
                  className="w-full accent-accent-primary"
                />
                <div className="flex justify-between text-2xs text-navy-600 mt-0.5">
                  <span>0 (Low)</span>
                  <span>100 (Critical)</span>
                </div>
              </div>

              {/* Contract Value & End Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-navy-400 font-medium mb-1">Contract Value (GBP)</label>
                  <input
                    type="number"
                    value={formContractValue}
                    onChange={e => setFormContractValue(Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-200 focus:outline-none focus:border-accent-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-navy-400 font-medium mb-1">Contract End *</label>
                  <input
                    type="date"
                    value={formContractEnd}
                    onChange={e => setFormContractEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-200 focus:outline-none focus:border-accent-primary/50"
                  />
                </div>
              </div>

              {/* Data Access & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-navy-400 font-medium mb-1">Data Access</label>
                  <select
                    value={formDataAccess}
                    onChange={e => setFormDataAccess(e.target.value as DataAccess)}
                    className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-200 focus:outline-none focus:border-accent-primary/50"
                  >
                    <option value="full">Full</option>
                    <option value="limited">Limited</option>
                    <option value="none">None</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-navy-400 font-medium mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as VendorStatus)}
                    className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-200 focus:outline-none focus:border-accent-primary/50"
                  >
                    <option value="active">Active</option>
                    <option value="under_review">Under Review</option>
                    <option value="onboarding">Onboarding</option>
                    <option value="offboarding">Offboarding</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-navy-700/50">
              <button
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddVendor}
                disabled={!formName.trim() || !formService.trim() || !formContractEnd}
                className={cn(
                  'btn-primary text-sm',
                  (!formName.trim() || !formService.trim() || !formContractEnd) && 'opacity-40 cursor-not-allowed'
                )}
              >
                Add Vendor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
