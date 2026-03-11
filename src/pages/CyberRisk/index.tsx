// Cyber Risk Analyzer — Threat landscape, vulnerability management, security controls, incident response
// Follows Lumina-R patterns: glass-card, navy color scheme, accent-primary, isDataActive gating

import { useState, useMemo } from 'react';
import { PageHeader, SectionCard } from '../../components';
import { useData } from '../../context/DataContext';
import { cn } from '../../utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type ThreatType = 'malware' | 'phishing' | 'insider' | 'ddos' | 'ransomware' | 'apt';
type ThreatStatus = 'active' | 'monitoring' | 'contained' | 'remediated';
type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';
type RemediationStatus = 'open' | 'in_progress' | 'patched' | 'accepted_risk';
type IncidentSeverity = 'P1' | 'P2' | 'P3' | 'P4';

interface Threat {
  id: string;
  name: string;
  type: ThreatType;
  severity: SeverityLevel;
  likelihood: number;      // 1-5
  impact: number;          // 1-5
  affectedSystems: string;
  status: ThreatStatus;
  lastUpdated: string;
}

interface Vulnerability {
  id: string;              // CVE ID
  description: string;
  cvssScore: number;       // 0-10
  affectedAsset: string;
  discoveryDate: string;
  remediationStatus: RemediationStatus;
  slaDaysRemaining: number;
}

interface NISTSubcategory {
  id: string;
  name: string;
  maturityScore: number;   // 1-5
  compliancePct: number;   // 0-100
}

interface NISTCategory {
  id: string;
  name: string;
  subcategories: NISTSubcategory[];
}

interface Incident {
  id: string;
  title: string;
  date: string;
  severity: IncidentSeverity;
  mttrHours: number;       // Mean Time to Resolve in hours
  rootCause: string;
  status: 'resolved' | 'investigating' | 'post_mortem';
}

// ---------------------------------------------------------------------------
// Sample Threats (8)
// ---------------------------------------------------------------------------
const sampleThreats: Threat[] = [
  {
    id: 'THR-001',
    name: 'Emotet Botnet Resurgence',
    type: 'malware',
    severity: 'critical',
    likelihood: 4,
    impact: 5,
    affectedSystems: 'Email Gateway, Endpoint Fleet',
    status: 'active',
    lastUpdated: '2026-02-21',
  },
  {
    id: 'THR-002',
    name: 'Executive Spear-Phishing Campaign',
    type: 'phishing',
    severity: 'high',
    likelihood: 4,
    impact: 4,
    affectedSystems: 'Corporate Email, M365 Tenant',
    status: 'monitoring',
    lastUpdated: '2026-02-19',
  },
  {
    id: 'THR-003',
    name: 'Disgruntled Employee Data Exfiltration',
    type: 'insider',
    severity: 'high',
    likelihood: 2,
    impact: 5,
    affectedSystems: 'DLP Gateway, SharePoint, USB Ports',
    status: 'contained',
    lastUpdated: '2026-02-15',
  },
  {
    id: 'THR-004',
    name: 'Volumetric DDoS on Public APIs',
    type: 'ddos',
    severity: 'medium',
    likelihood: 3,
    impact: 3,
    affectedSystems: 'API Gateway, CDN, WAF',
    status: 'monitoring',
    lastUpdated: '2026-02-20',
  },
  {
    id: 'THR-005',
    name: 'LockBit 4.0 Ransomware Variant',
    type: 'ransomware',
    severity: 'critical',
    likelihood: 3,
    impact: 5,
    affectedSystems: 'Backup Infrastructure, AD Domain Controllers',
    status: 'active',
    lastUpdated: '2026-02-22',
  },
  {
    id: 'THR-006',
    name: 'APT-41 Supply Chain Compromise',
    type: 'apt',
    severity: 'critical',
    likelihood: 2,
    impact: 5,
    affectedSystems: 'CI/CD Pipeline, Third-Party Libraries',
    status: 'monitoring',
    lastUpdated: '2026-02-18',
  },
  {
    id: 'THR-007',
    name: 'Credential Stuffing on Customer Portal',
    type: 'phishing',
    severity: 'medium',
    likelihood: 4,
    impact: 3,
    affectedSystems: 'Customer Portal, IAM System',
    status: 'remediated',
    lastUpdated: '2026-02-10',
  },
  {
    id: 'THR-008',
    name: 'Insider Privilege Escalation Attempt',
    type: 'insider',
    severity: 'high',
    likelihood: 2,
    impact: 4,
    affectedSystems: 'PAM System, Active Directory',
    status: 'contained',
    lastUpdated: '2026-02-17',
  },
];

// ---------------------------------------------------------------------------
// Sample Vulnerabilities (8)
// ---------------------------------------------------------------------------
const sampleVulnerabilities: Vulnerability[] = [
  {
    id: 'CVE-2026-0142',
    description: 'Remote code execution in Apache Struts via crafted Content-Type header',
    cvssScore: 9.8,
    affectedAsset: 'Web Application Server (Prod)',
    discoveryDate: '2026-01-28',
    remediationStatus: 'in_progress',
    slaDaysRemaining: 3,
  },
  {
    id: 'CVE-2026-1087',
    description: 'SQL injection in legacy reporting module parameter handling',
    cvssScore: 8.6,
    affectedAsset: 'Legacy Reporting Database',
    discoveryDate: '2026-02-05',
    remediationStatus: 'open',
    slaDaysRemaining: 7,
  },
  {
    id: 'CVE-2025-4892',
    description: 'Privilege escalation in Windows Print Spooler service',
    cvssScore: 7.8,
    affectedAsset: 'Windows Server Fleet (142 hosts)',
    discoveryDate: '2025-12-15',
    remediationStatus: 'patched',
    slaDaysRemaining: 0,
  },
  {
    id: 'CVE-2026-0298',
    description: 'Cross-site scripting in customer self-service portal authentication flow',
    cvssScore: 6.1,
    affectedAsset: 'Customer Portal (portal.acme.com)',
    discoveryDate: '2026-02-10',
    remediationStatus: 'in_progress',
    slaDaysRemaining: 14,
  },
  {
    id: 'CVE-2026-0561',
    description: 'Insecure deserialization in Java-based microservice message broker',
    cvssScore: 9.1,
    affectedAsset: 'Order Processing Microservice',
    discoveryDate: '2026-02-14',
    remediationStatus: 'open',
    slaDaysRemaining: 5,
  },
  {
    id: 'CVE-2025-3317',
    description: 'TLS certificate validation bypass in internal API gateway',
    cvssScore: 5.9,
    affectedAsset: 'Internal API Gateway',
    discoveryDate: '2025-11-20',
    remediationStatus: 'accepted_risk',
    slaDaysRemaining: 0,
  },
  {
    id: 'CVE-2026-0789',
    description: 'Authentication bypass in Fortinet SSL VPN appliance firmware',
    cvssScore: 9.4,
    affectedAsset: 'Fortinet VPN Gateway',
    discoveryDate: '2026-02-18',
    remediationStatus: 'in_progress',
    slaDaysRemaining: 2,
  },
  {
    id: 'CVE-2026-0412',
    description: 'Information disclosure via misconfigured S3 bucket access policy',
    cvssScore: 7.5,
    affectedAsset: 'AWS S3 (data-exports-prod)',
    discoveryDate: '2026-02-01',
    remediationStatus: 'patched',
    slaDaysRemaining: 0,
  },
];

// ---------------------------------------------------------------------------
// Sample NIST CSF Categories (5 categories, 3-4 subcategories each)
// ---------------------------------------------------------------------------
const sampleNISTCategories: NISTCategory[] = [
  {
    id: 'ID',
    name: 'Identify',
    subcategories: [
      { id: 'ID.AM', name: 'Asset Management', maturityScore: 4, compliancePct: 88 },
      { id: 'ID.BE', name: 'Business Environment', maturityScore: 3, compliancePct: 72 },
      { id: 'ID.GV', name: 'Governance', maturityScore: 4, compliancePct: 85 },
      { id: 'ID.RA', name: 'Risk Assessment', maturityScore: 3, compliancePct: 78 },
    ],
  },
  {
    id: 'PR',
    name: 'Protect',
    subcategories: [
      { id: 'PR.AC', name: 'Access Control', maturityScore: 4, compliancePct: 91 },
      { id: 'PR.AT', name: 'Awareness & Training', maturityScore: 3, compliancePct: 68 },
      { id: 'PR.DS', name: 'Data Security', maturityScore: 3, compliancePct: 75 },
      { id: 'PR.IP', name: 'Information Protection', maturityScore: 4, compliancePct: 82 },
    ],
  },
  {
    id: 'DE',
    name: 'Detect',
    subcategories: [
      { id: 'DE.AE', name: 'Anomalies & Events', maturityScore: 3, compliancePct: 70 },
      { id: 'DE.CM', name: 'Continuous Monitoring', maturityScore: 4, compliancePct: 85 },
      { id: 'DE.DP', name: 'Detection Processes', maturityScore: 3, compliancePct: 74 },
    ],
  },
  {
    id: 'RS',
    name: 'Respond',
    subcategories: [
      { id: 'RS.RP', name: 'Response Planning', maturityScore: 3, compliancePct: 76 },
      { id: 'RS.CO', name: 'Communications', maturityScore: 2, compliancePct: 58 },
      { id: 'RS.AN', name: 'Analysis', maturityScore: 3, compliancePct: 72 },
      { id: 'RS.MI', name: 'Mitigation', maturityScore: 3, compliancePct: 69 },
    ],
  },
  {
    id: 'RC',
    name: 'Recover',
    subcategories: [
      { id: 'RC.RP', name: 'Recovery Planning', maturityScore: 2, compliancePct: 55 },
      { id: 'RC.IM', name: 'Improvements', maturityScore: 2, compliancePct: 50 },
      { id: 'RC.CO', name: 'Communications', maturityScore: 3, compliancePct: 65 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Sample Incidents (5)
// ---------------------------------------------------------------------------
const sampleIncidents: Incident[] = [
  {
    id: 'INC-2026-041',
    title: 'Ransomware encryption detected on file server FS-PROD-03',
    date: '2026-02-20',
    severity: 'P1',
    mttrHours: 6.5,
    rootCause: 'Unpatched vulnerability in file sharing service exploited via phishing attachment',
    status: 'resolved',
  },
  {
    id: 'INC-2026-038',
    title: 'Credential compromise of senior executive M365 account',
    date: '2026-02-16',
    severity: 'P1',
    mttrHours: 3.2,
    rootCause: 'MFA bypass via SIM-swap attack on personal mobile device',
    status: 'post_mortem',
  },
  {
    id: 'INC-2026-035',
    title: 'DDoS attack causing 45-minute API gateway outage',
    date: '2026-02-12',
    severity: 'P2',
    mttrHours: 1.8,
    rootCause: 'Volumetric UDP flood from botnet targeting public API endpoints',
    status: 'resolved',
  },
  {
    id: 'INC-2026-032',
    title: 'Unauthorized access to staging environment database',
    date: '2026-02-08',
    severity: 'P2',
    mttrHours: 8.4,
    rootCause: 'Leaked service account credentials in public GitHub repository',
    status: 'resolved',
  },
  {
    id: 'INC-2026-029',
    title: 'Suspicious data exfiltration attempt via DNS tunneling',
    date: '2026-02-03',
    severity: 'P3',
    mttrHours: 4.1,
    rootCause: 'Compromised workstation communicating with C2 server via encoded DNS queries',
    status: 'investigating',
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

function getSeverityBadge(severity: SeverityLevel): string {
  switch (severity) {
    case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'high': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case 'low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  }
}

function getThreatTypeBadge(type: ThreatType): string {
  switch (type) {
    case 'malware': return 'bg-red-500/15 text-red-400';
    case 'phishing': return 'bg-amber-500/15 text-amber-400';
    case 'insider': return 'bg-purple-500/15 text-purple-400';
    case 'ddos': return 'bg-blue-500/15 text-blue-400';
    case 'ransomware': return 'bg-rose-500/15 text-rose-400';
    case 'apt': return 'bg-cyan-500/15 text-cyan-400';
  }
}

function getThreatTypeLabel(type: ThreatType): string {
  switch (type) {
    case 'malware': return 'Malware';
    case 'phishing': return 'Phishing';
    case 'insider': return 'Insider';
    case 'ddos': return 'DDoS';
    case 'ransomware': return 'Ransomware';
    case 'apt': return 'APT';
  }
}

function getStatusBadge(status: ThreatStatus): string {
  switch (status) {
    case 'active': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'monitoring': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'contained': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'remediated': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  }
}

function getRemediationBadge(status: RemediationStatus): string {
  switch (status) {
    case 'open': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'in_progress': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'patched': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'accepted_risk': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  }
}

function getRemediationLabel(status: RemediationStatus): string {
  switch (status) {
    case 'open': return 'Open';
    case 'in_progress': return 'In Progress';
    case 'patched': return 'Patched';
    case 'accepted_risk': return 'Accepted Risk';
  }
}

function getCVSSColor(score: number): string {
  if (score >= 9.0) return 'text-red-400';
  if (score >= 7.0) return 'text-amber-400';
  if (score >= 4.0) return 'text-yellow-300';
  return 'text-emerald-400';
}

function getCVSSBarColor(score: number): string {
  if (score >= 9.0) return 'bg-red-500';
  if (score >= 7.0) return 'bg-amber-500';
  if (score >= 4.0) return 'bg-yellow-500';
  return 'bg-emerald-500';
}

function getIncidentSeverityBadge(severity: IncidentSeverity): string {
  switch (severity) {
    case 'P1': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'P2': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'P3': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case 'P4': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  }
}

function getIncidentStatusBadge(status: Incident['status']): string {
  switch (status) {
    case 'resolved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'investigating': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'post_mortem': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  }
}

function getIncidentStatusLabel(status: Incident['status']): string {
  switch (status) {
    case 'resolved': return 'Resolved';
    case 'investigating': return 'Investigating';
    case 'post_mortem': return 'Post-Mortem';
  }
}

function getMaturityColor(score: number): string {
  if (score >= 4) return 'bg-emerald-500';
  if (score >= 3) return 'bg-amber-500';
  if (score >= 2) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getMaturityTextColor(score: number): string {
  if (score >= 4) return 'text-emerald-400';
  if (score >= 3) return 'text-amber-400';
  if (score >= 2) return 'text-yellow-300';
  return 'text-red-400';
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-amber-400';
  if (score >= 40) return 'text-yellow-300';
  return 'text-red-400';
}

function getScoreBarColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
}

// ---------------------------------------------------------------------------
// CSV Export
// ---------------------------------------------------------------------------
function exportCyberRiskCSV(
  threats: Threat[],
  vulnerabilities: Vulnerability[],
  incidents: Incident[],
  nistCategories: NISTCategory[],
): void {
  const lines: string[] = [];

  // Threats section
  lines.push('=== THREATS ===');
  lines.push('Threat ID,Name,Type,Severity,Likelihood,Impact,Affected Systems,Status,Last Updated');
  for (const t of threats) {
    lines.push([
      t.id,
      `"${t.name}"`,
      getThreatTypeLabel(t.type),
      t.severity,
      t.likelihood.toString(),
      t.impact.toString(),
      `"${t.affectedSystems}"`,
      t.status,
      t.lastUpdated,
    ].join(','));
  }

  lines.push('');

  // Vulnerabilities section
  lines.push('=== VULNERABILITIES ===');
  lines.push('CVE ID,Description,CVSS Score,Affected Asset,Discovery Date,Remediation Status,SLA Days Remaining');
  for (const v of vulnerabilities) {
    lines.push([
      v.id,
      `"${v.description}"`,
      v.cvssScore.toFixed(1),
      `"${v.affectedAsset}"`,
      v.discoveryDate,
      getRemediationLabel(v.remediationStatus),
      v.slaDaysRemaining.toString(),
    ].join(','));
  }

  lines.push('');

  // Incidents section
  lines.push('=== INCIDENTS ===');
  lines.push('Incident ID,Title,Date,Severity,MTTR (Hours),Root Cause,Status');
  for (const i of incidents) {
    lines.push([
      i.id,
      `"${i.title}"`,
      i.date,
      i.severity,
      i.mttrHours.toString(),
      `"${i.rootCause}"`,
      getIncidentStatusLabel(i.status),
    ].join(','));
  }

  lines.push('');

  // NIST CSF section
  lines.push('=== NIST CSF SECURITY CONTROLS ===');
  lines.push('Category,Subcategory ID,Subcategory Name,Maturity Score (1-5),Compliance %');
  for (const cat of nistCategories) {
    for (const sub of cat.subcategories) {
      lines.push([
        cat.name,
        sub.id,
        `"${sub.name}"`,
        sub.maturityScore.toString(),
        sub.compliancePct.toString(),
      ].join(','));
    }
  }

  const csv = lines.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cyber-risk-report-${TODAY}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function CyberRisk() {
  const { isDataActive } = useData();
  const [activeTab, setActiveTab] = useState<'threats' | 'vulnerabilities' | 'controls' | 'incidents'>('threats');

  // Gate all data behind isDataActive
  const threats: Threat[] = isDataActive ? sampleThreats : [];
  const vulnerabilities: Vulnerability[] = isDataActive ? sampleVulnerabilities : [];
  const nistCategories: NISTCategory[] = isDataActive ? sampleNISTCategories : [];
  const incidents: Incident[] = isDataActive ? sampleIncidents : [];

  // ---------------------------------------------------------------------------
  // Summary statistics
  // ---------------------------------------------------------------------------
  const stats = useMemo(() => {
    if (threats.length === 0 && vulnerabilities.length === 0) {
      return {
        cyberScore: 0,
        criticalVulns: 0,
        highVulns: 0,
        mediumVulns: 0,
        lowVulns: 0,
        incidentsThisQuarter: 0,
        mttd: 0,
        mttr: 0,
      };
    }

    // Cyber score: weighted average of NIST maturity across all subcategories (scaled 0-100)
    const allSubs = nistCategories.flatMap(c => c.subcategories);
    const avgMaturity = allSubs.length > 0
      ? allSubs.reduce((sum, s) => sum + s.maturityScore, 0) / allSubs.length
      : 0;
    const cyberScore = Math.round((avgMaturity / 5) * 100);

    // Vulnerability severity counts based on CVSS
    const criticalVulns = vulnerabilities.filter(v => v.cvssScore >= 9.0).length;
    const highVulns = vulnerabilities.filter(v => v.cvssScore >= 7.0 && v.cvssScore < 9.0).length;
    const mediumVulns = vulnerabilities.filter(v => v.cvssScore >= 4.0 && v.cvssScore < 7.0).length;
    const lowVulns = vulnerabilities.filter(v => v.cvssScore < 4.0).length;

    // Incidents this quarter
    const incidentsThisQuarter = incidents.length;

    // MTTD (Mean Time to Detect) — simulated as avg of 2.4h across incidents
    const mttd = 2.4;

    // MTTR (Mean Time to Respond)
    const mttr = incidents.length > 0
      ? Math.round((incidents.reduce((sum, i) => sum + i.mttrHours, 0) / incidents.length) * 10) / 10
      : 0;

    return { cyberScore, criticalVulns, highVulns, mediumVulns, lowVulns, incidentsThisQuarter, mttd, mttr };
  }, [threats, vulnerabilities, nistCategories, incidents]);

  // ---------------------------------------------------------------------------
  // NIST category-level maturity for radar chart
  // ---------------------------------------------------------------------------
  const categoryMaturity = useMemo(() => {
    return nistCategories.map(cat => {
      const avg = cat.subcategories.length > 0
        ? cat.subcategories.reduce((s, sub) => s + sub.maturityScore, 0) / cat.subcategories.length
        : 0;
      return {
        id: cat.id,
        name: cat.name,
        avgMaturity: Math.round(avg * 10) / 10,
      };
    });
  }, [nistCategories]);

  // ---------------------------------------------------------------------------
  // Render: empty state
  // ---------------------------------------------------------------------------
  if (!isDataActive) {
    return (
      <div className="space-y-4 animate-fade-in">
        <PageHeader
          title="Cyber Risk Analyzer"
          subtitle="Threat landscape, vulnerability management, security controls, and incident response"
        />
        <div className="glass-card p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-navy-800/60 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-navy-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-navy-300 mb-2">No data available</h3>
          <p className="text-sm text-navy-500 max-w-md">
            No data available. Upload a dataset or connect your AI Advisor to begin cyber risk analysis.
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
        title="Cyber Risk Analyzer"
        subtitle="Threat landscape, vulnerability management, security controls, and incident response"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportCyberRiskCSV(threats, vulnerabilities, incidents, nistCategories)}
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Cyber Score */}
        <div className="glass-card p-4 flex flex-col items-center justify-center">
          <span className={cn('text-2xl font-bold', getScoreColor(stats.cyberScore))}>{stats.cyberScore}</span>
          <span className="text-2xs text-navy-500 uppercase mt-1 text-center">Cyber Score</span>
        </div>
        {/* Vulnerability counts */}
        <div className="glass-card p-4 flex flex-col items-center justify-center">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-red-400">{stats.criticalVulns}</span>
            <span className="text-xs text-navy-500">/</span>
            <span className="text-lg font-bold text-amber-400">{stats.highVulns}</span>
            <span className="text-xs text-navy-500">/</span>
            <span className="text-lg font-bold text-yellow-300">{stats.mediumVulns}</span>
            <span className="text-xs text-navy-500">/</span>
            <span className="text-lg font-bold text-emerald-400">{stats.lowVulns}</span>
          </div>
          <span className="text-2xs text-navy-500 uppercase mt-1 text-center">Vulns C/H/M/L</span>
        </div>
        {/* Incidents */}
        <div className="glass-card p-4 flex flex-col items-center justify-center">
          <span className={cn('text-2xl font-bold', stats.incidentsThisQuarter > 3 ? 'text-amber-400' : 'text-emerald-400')}>
            {stats.incidentsThisQuarter}
          </span>
          <span className="text-2xs text-navy-500 uppercase mt-1 text-center">Incidents (Q1)</span>
        </div>
        {/* MTTD */}
        <div className="glass-card p-4 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-blue-400">{stats.mttd}h</span>
          <span className="text-2xs text-navy-500 uppercase mt-1 text-center">Mean Time to Detect</span>
        </div>
        {/* MTTR */}
        <div className="glass-card p-4 flex flex-col items-center justify-center">
          <span className={cn('text-2xl font-bold', stats.mttr <= 4 ? 'text-emerald-400' : stats.mttr <= 8 ? 'text-amber-400' : 'text-red-400')}>
            {stats.mttr}h
          </span>
          <span className="text-2xs text-navy-500 uppercase mt-1 text-center">Mean Time to Respond</span>
        </div>
        {/* Active Threats */}
        <div className="glass-card p-4 flex flex-col items-center justify-center">
          <span className={cn('text-2xl font-bold', threats.filter(t => t.status === 'active').length > 0 ? 'text-red-400' : 'text-emerald-400')}>
            {threats.filter(t => t.status === 'active').length}
          </span>
          <span className="text-2xs text-navy-500 uppercase mt-1 text-center">Active Threats</span>
        </div>
        {/* Open Vulns */}
        <div className="glass-card p-4 flex flex-col items-center justify-center">
          <span className={cn('text-2xl font-bold', vulnerabilities.filter(v => v.remediationStatus === 'open').length > 0 ? 'text-red-400' : 'text-emerald-400')}>
            {vulnerabilities.filter(v => v.remediationStatus === 'open').length}
          </span>
          <span className="text-2xs text-navy-500 uppercase mt-1 text-center">Open Vulns</span>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="glass-card p-1 flex items-center gap-1">
        {([
          { key: 'threats', label: 'Threat Landscape' },
          { key: 'vulnerabilities', label: 'Vulnerability Management' },
          { key: 'controls', label: 'Security Controls' },
          { key: 'incidents', label: 'Incident Response' },
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
      {/* TAB: Threat Landscape                                              */}
      {/* ================================================================= */}
      {activeTab === 'threats' && (
        <SectionCard
          title="Active Threats"
          subtitle={`${threats.length} threats tracked across the organisation`}
          noPadding
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-navy-700 bg-navy-900/50">
                  <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[80px]">ID</th>
                  <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[200px]">Name</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[100px]">Type</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[90px]">Severity</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[80px]">Likelihood</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[70px]">Impact</th>
                  <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[200px]">Affected Systems</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[100px]">Status</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[100px]">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {threats.map((t, idx) => (
                  <tr
                    key={t.id}
                    className={cn(
                      'border-b border-navy-800 hover:bg-navy-800/30 transition-colors',
                      idx % 2 === 0 && 'bg-navy-900/20'
                    )}
                  >
                    <td className="py-2.5 px-3 font-mono text-accent-primary font-medium">{t.id}</td>
                    <td className="py-2.5 px-3 text-navy-100 font-medium">{t.name}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={cn('px-2 py-0.5 rounded text-2xs font-medium uppercase', getThreatTypeBadge(t.type))}>
                        {getThreatTypeLabel(t.type)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={cn('px-2 py-0.5 rounded text-2xs font-medium uppercase border', getSeverityBadge(t.severity))}>
                        {t.severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={cn(
                              'w-2 h-2 rounded-full',
                              i < t.likelihood ? 'bg-amber-400' : 'bg-navy-700'
                            )}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={cn(
                              'w-2 h-2 rounded-full',
                              i < t.impact ? 'bg-red-400' : 'bg-navy-700'
                            )}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-navy-300">{t.affectedSystems}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={cn('px-2 py-0.5 rounded text-2xs font-medium uppercase border', getStatusBadge(t.status))}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center text-navy-400">{formatDate(t.lastUpdated)}</td>
                  </tr>
                ))}
                {threats.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-navy-500 text-sm">
                      No threats currently tracked.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* ================================================================= */}
      {/* TAB: Vulnerability Management                                      */}
      {/* ================================================================= */}
      {activeTab === 'vulnerabilities' && (
        <SectionCard
          title="Vulnerability Register"
          subtitle={`${vulnerabilities.length} vulnerabilities tracked`}
          noPadding
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-navy-700 bg-navy-900/50">
                  <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[130px]">CVE ID</th>
                  <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[250px]">Description</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[130px]">CVSS Score</th>
                  <th className="py-2.5 px-3 text-left text-navy-300 font-medium min-w-[200px]">Affected Asset</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[110px]">Discovery Date</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[120px]">Remediation</th>
                  <th className="py-2.5 px-3 text-center text-navy-300 font-medium min-w-[100px]">SLA Days Left</th>
                </tr>
              </thead>
              <tbody>
                {vulnerabilities.map((v, idx) => (
                  <tr
                    key={v.id}
                    className={cn(
                      'border-b border-navy-800 hover:bg-navy-800/30 transition-colors',
                      idx % 2 === 0 && 'bg-navy-900/20'
                    )}
                  >
                    <td className="py-2.5 px-3 font-mono text-accent-primary font-medium">{v.id}</td>
                    <td className="py-2.5 px-3 text-navy-300 max-w-[250px]" title={v.description}>
                      <span className="line-clamp-2">{v.description}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-navy-800 rounded-full overflow-hidden">
                          <div
                            className={cn('h-full rounded-full transition-all', getCVSSBarColor(v.cvssScore))}
                            style={{ width: `${(v.cvssScore / 10) * 100}%` }}
                          />
                        </div>
                        <span className={cn('text-xs font-mono font-bold w-8 text-right', getCVSSColor(v.cvssScore))}>
                          {v.cvssScore.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-navy-300">{v.affectedAsset}</td>
                    <td className="py-2.5 px-3 text-center text-navy-400">{formatDate(v.discoveryDate)}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={cn('px-2 py-0.5 rounded text-2xs font-medium uppercase border', getRemediationBadge(v.remediationStatus))}>
                        {getRemediationLabel(v.remediationStatus)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {v.remediationStatus === 'patched' || v.remediationStatus === 'accepted_risk' ? (
                        <span className="text-navy-500">--</span>
                      ) : (
                        <span className={cn(
                          'font-mono font-bold',
                          v.slaDaysRemaining <= 3 ? 'text-red-400' : v.slaDaysRemaining <= 7 ? 'text-amber-400' : 'text-emerald-400'
                        )}>
                          {v.slaDaysRemaining}d
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {vulnerabilities.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-navy-500 text-sm">
                      No vulnerabilities currently tracked.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* ================================================================= */}
      {/* TAB: Security Controls (NIST CSF)                                  */}
      {/* ================================================================= */}
      {activeTab === 'controls' && (
        <div className="space-y-4">
          <SectionCard
            title="NIST CSF Framework Alignment"
            subtitle="Security control maturity and compliance across the five NIST Cybersecurity Framework categories"
          >
            <div className="space-y-6">
              {nistCategories.map((cat) => {
                const avgMaturity = cat.subcategories.length > 0
                  ? cat.subcategories.reduce((s, sub) => s + sub.maturityScore, 0) / cat.subcategories.length
                  : 0;
                const avgCompliance = cat.subcategories.length > 0
                  ? Math.round(cat.subcategories.reduce((s, sub) => s + sub.compliancePct, 0) / cat.subcategories.length)
                  : 0;

                return (
                  <div key={cat.id} className="p-4 bg-navy-800/20 rounded-lg border border-navy-700/50">
                    {/* Category header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded bg-accent-primary/15 text-accent-primary text-xs font-bold">
                          {cat.id}
                        </span>
                        <span className="text-sm font-semibold text-navy-100">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-2xs text-navy-500 uppercase">Avg Maturity</span>
                          <span className={cn('block text-sm font-bold font-mono', getMaturityTextColor(Math.round(avgMaturity)))}>
                            {avgMaturity.toFixed(1)}/5
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-2xs text-navy-500 uppercase">Avg Compliance</span>
                          <span className={cn('block text-sm font-bold font-mono', getScoreColor(avgCompliance))}>
                            {avgCompliance}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Subcategories */}
                    <div className="space-y-3">
                      {cat.subcategories.map((sub) => (
                        <div key={sub.id} className="flex items-center gap-4">
                          {/* Subcategory label */}
                          <div className="flex items-center gap-2 min-w-[200px]">
                            <span className="text-2xs font-mono text-navy-500 w-12">{sub.id}</span>
                            <span className="text-xs text-navy-300">{sub.name}</span>
                          </div>

                          {/* Maturity dots */}
                          <div className="flex items-center gap-1 min-w-[80px]">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={cn(
                                  'w-3 h-3 rounded-sm',
                                  i < sub.maturityScore ? getMaturityColor(sub.maturityScore) : 'bg-navy-700'
                                )}
                              />
                            ))}
                            <span className={cn('text-xs font-mono font-bold ml-1', getMaturityTextColor(sub.maturityScore))}>
                              {sub.maturityScore}
                            </span>
                          </div>

                          {/* Compliance bar */}
                          <div className="flex-1 flex items-center gap-2">
                            <div className="flex-1 h-2 bg-navy-800 rounded-full overflow-hidden">
                              <div
                                className={cn('h-full rounded-full transition-all', getScoreBarColor(sub.compliancePct))}
                                style={{ width: `${sub.compliancePct}%` }}
                              />
                            </div>
                            <span className={cn('text-xs font-mono font-medium w-10 text-right', getScoreColor(sub.compliancePct))}>
                              {sub.compliancePct}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB: Incident Response                                             */}
      {/* ================================================================= */}
      {activeTab === 'incidents' && (
        <SectionCard
          title="Recent Incidents"
          subtitle={`${incidents.length} incidents this quarter`}
        >
          {incidents.length === 0 ? (
            <p className="text-center text-navy-500 py-8">No incidents recorded.</p>
          ) : (
            <div className="space-y-4">
              {incidents.map((inc) => (
                <div key={inc.id} className={cn(
                  'p-4 rounded-lg border transition-colors',
                  inc.status === 'investigating'
                    ? 'border-amber-500/20 bg-amber-500/5'
                    : 'border-navy-700/50 bg-navy-800/20'
                )}>
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-accent-primary font-medium">{inc.id}</span>
                      <span className={cn('px-2 py-0.5 rounded text-2xs font-bold uppercase border', getIncidentSeverityBadge(inc.severity))}>
                        {inc.severity}
                      </span>
                      <span className={cn('px-2 py-0.5 rounded text-2xs font-medium uppercase border', getIncidentStatusBadge(inc.status))}>
                        {getIncidentStatusLabel(inc.status)}
                      </span>
                    </div>
                    <span className="text-xs text-navy-400">{formatDate(inc.date)}</span>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-medium text-navy-100 mb-3">{inc.title}</h4>

                  {/* Detail grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Timeline */}
                    <div className="p-3 bg-navy-800/30 rounded-lg">
                      <p className="text-2xs text-navy-500 uppercase mb-1">Mean Time to Resolve</p>
                      <span className={cn(
                        'text-lg font-bold font-mono',
                        inc.mttrHours <= 4 ? 'text-emerald-400' : inc.mttrHours <= 8 ? 'text-amber-400' : 'text-red-400'
                      )}>
                        {inc.mttrHours}h
                      </span>
                    </div>
                    {/* Root Cause */}
                    <div className="p-3 bg-navy-800/30 rounded-lg md:col-span-2">
                      <p className="text-2xs text-navy-500 uppercase mb-1">Root Cause</p>
                      <p className="text-xs text-navy-300">{inc.rootCause}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* ================================================================= */}
      {/* Maturity Radar — Div-based bar chart for NIST categories           */}
      {/* ================================================================= */}
      <SectionCard
        title="NIST CSF Maturity Overview"
        subtitle="Average maturity score across the five core NIST Cybersecurity Framework categories"
      >
        {categoryMaturity.length === 0 ? (
          <p className="text-center text-navy-500 py-8">No data to display.</p>
        ) : (
          <div className="space-y-4">
            {/* Legend */}
            <div className="flex items-center gap-4 text-xs text-navy-400 mb-2">
              <span className="font-medium">Maturity Scale:</span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-red-500" /> 1 - Initial
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-yellow-500" /> 2 - Developing
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500" /> 3 - Defined
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500" /> 4-5 - Managed/Optimized
              </span>
            </div>

            {/* Bar chart */}
            <div className="space-y-4">
              {categoryMaturity.map(({ id, name, avgMaturity }) => {
                const barWidth = Math.round((avgMaturity / 5) * 100);

                return (
                  <div key={id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded bg-accent-primary/15 text-accent-primary text-xs font-bold w-10 text-center">
                          {id}
                        </span>
                        <span className="text-sm font-medium text-navy-200">{name}</span>
                      </div>
                      <span className={cn('text-sm font-mono font-bold', getMaturityTextColor(Math.round(avgMaturity)))}>
                        {avgMaturity.toFixed(1)} / 5.0
                      </span>
                    </div>
                    <div className="h-7 bg-navy-800 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all flex items-center justify-end pr-3',
                          getMaturityColor(Math.round(avgMaturity))
                        )}
                        style={{ width: `${barWidth}%` }}
                      >
                        {barWidth >= 20 && (
                          <span className="text-2xs font-bold text-white/90">{avgMaturity.toFixed(1)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overall maturity */}
            <div className="mt-6 p-4 bg-navy-800/20 rounded-lg">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-navy-400">Overall NIST CSF Maturity</span>
                {(() => {
                  const totalSubs = nistCategories.flatMap(c => c.subcategories);
                  const overallAvg = totalSubs.length > 0
                    ? totalSubs.reduce((s, sub) => s + sub.maturityScore, 0) / totalSubs.length
                    : 0;
                  return (
                    <span className={cn('font-mono font-bold text-lg', getMaturityTextColor(Math.round(overallAvg)))}>
                      {overallAvg.toFixed(1)} / 5.0
                    </span>
                  );
                })()}
              </div>
              <div className="h-3 bg-navy-800 rounded-full overflow-hidden">
                {(() => {
                  const totalSubs = nistCategories.flatMap(c => c.subcategories);
                  const overallAvg = totalSubs.length > 0
                    ? totalSubs.reduce((s, sub) => s + sub.maturityScore, 0) / totalSubs.length
                    : 0;
                  const barWidth = Math.round((overallAvg / 5) * 100);
                  return (
                    <div
                      className={cn('h-full rounded-full transition-all', getMaturityColor(Math.round(overallAvg)))}
                      style={{ width: `${barWidth}%` }}
                    />
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
