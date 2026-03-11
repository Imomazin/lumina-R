import { useState } from 'react';
import { PageHeader, SectionCard } from '../../components';
import { useData } from '../../context/DataContext';
import { risks } from '../../data';
import { cn } from '../../utils';

interface Report {
  id: string;
  name: string;
  type: 'board' | 'executive' | 'regulatory' | 'operational';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'ad-hoc';
  lastGenerated: string;
  status: 'ready' | 'generating' | 'scheduled';
}

const reports: Report[] = [
  {
    id: 'RPT-001',
    name: 'Board Risk Summary',
    type: 'board',
    frequency: 'quarterly',
    lastGenerated: '2024-03-01',
    status: 'ready',
  },
  {
    id: 'RPT-002',
    name: 'Executive Risk Dashboard',
    type: 'executive',
    frequency: 'monthly',
    lastGenerated: '2024-03-15',
    status: 'ready',
  },
  {
    id: 'RPT-003',
    name: 'KRI Performance Report',
    type: 'operational',
    frequency: 'weekly',
    lastGenerated: '2024-03-14',
    status: 'ready',
  },
  {
    id: 'RPT-004',
    name: 'Regulatory Compliance Status',
    type: 'regulatory',
    frequency: 'monthly',
    lastGenerated: '2024-03-10',
    status: 'ready',
  },
  {
    id: 'RPT-005',
    name: 'Cyber Risk Assessment',
    type: 'operational',
    frequency: 'monthly',
    lastGenerated: '2024-03-12',
    status: 'ready',
  },
  {
    id: 'RPT-006',
    name: 'Risk Appetite Compliance',
    type: 'board',
    frequency: 'quarterly',
    lastGenerated: '2024-03-01',
    status: 'ready',
  },
];

const scheduledReports = [
  { name: 'Daily Risk Summary', nextRun: 'Tomorrow, 06:00' },
  { name: 'Weekly KRI Report', nextRun: 'Monday, 08:00' },
  { name: 'Monthly Executive Summary', nextRun: 'Apr 1, 2024' },
];

// ==================== ASSURANCE LEVEL REPORTS ====================
type AssuranceLevel = 'high' | 'substantial' | 'moderate' | 'limited';
type LineOfDefence = '1st' | '2nd' | '3rd';

interface AssuranceItem {
  id: string;
  area: string;
  category: string;
  lineOfDefence: LineOfDefence;
  assuranceLevel: AssuranceLevel;
  provider: string;
  lastAssessed: string;
  nextAssessment: string;
  findings: number;
  criticalFindings: number;
  actionPlan: string;
  completionRate: number; // 0-100
}

const assuranceData: AssuranceItem[] = [
  { id: 'ASR-001', area: 'Cyber Security Controls', category: 'Technology', lineOfDefence: '1st', assuranceLevel: 'moderate', provider: 'IT Security Team', lastAssessed: '2024-02-15', nextAssessment: '2024-05-15', findings: 8, criticalFindings: 2, actionPlan: 'EDR enhancement, access review completion', completionRate: 65 },
  { id: 'ASR-002', area: 'Financial Reporting Accuracy', category: 'Finance', lineOfDefence: '2nd', assuranceLevel: 'substantial', provider: 'Internal Audit', lastAssessed: '2024-01-20', nextAssessment: '2024-04-20', findings: 3, criticalFindings: 0, actionPlan: 'Reconciliation automation, SOX documentation', completionRate: 85 },
  { id: 'ASR-003', area: 'Regulatory Compliance (GDPR)', category: 'Compliance', lineOfDefence: '2nd', assuranceLevel: 'moderate', provider: 'Compliance Team', lastAssessed: '2024-03-01', nextAssessment: '2024-06-01', findings: 6, criticalFindings: 1, actionPlan: 'Data mapping exercise, consent refresh', completionRate: 55 },
  { id: 'ASR-004', area: 'Operational Risk Management', category: 'Operations', lineOfDefence: '1st', assuranceLevel: 'substantial', provider: 'Risk Management', lastAssessed: '2024-02-28', nextAssessment: '2024-05-28', findings: 4, criticalFindings: 0, actionPlan: 'Process documentation, incident response update', completionRate: 78 },
  { id: 'ASR-005', area: 'Anti-Money Laundering Controls', category: 'Compliance', lineOfDefence: '2nd', assuranceLevel: 'limited', provider: 'Compliance Team', lastAssessed: '2024-01-10', nextAssessment: '2024-04-10', findings: 12, criticalFindings: 4, actionPlan: 'Transaction monitoring upgrade, staff training', completionRate: 35 },
  { id: 'ASR-006', area: 'Business Continuity Planning', category: 'Operations', lineOfDefence: '1st', assuranceLevel: 'moderate', provider: 'Business Continuity Team', lastAssessed: '2024-02-20', nextAssessment: '2024-05-20', findings: 5, criticalFindings: 1, actionPlan: 'DR testing completion, RTO/RPO validation', completionRate: 60 },
  { id: 'ASR-007', area: 'Vendor Risk Management', category: 'Third Party', lineOfDefence: '2nd', assuranceLevel: 'limited', provider: 'Procurement & Risk', lastAssessed: '2024-01-15', nextAssessment: '2024-04-15', findings: 9, criticalFindings: 3, actionPlan: 'Vendor assessments, SLA enforcement, exit plans', completionRate: 40 },
  { id: 'ASR-008', area: 'External Financial Audit', category: 'Finance', lineOfDefence: '3rd', assuranceLevel: 'high', provider: 'Deloitte LLP', lastAssessed: '2024-03-10', nextAssessment: '2025-03-10', findings: 1, criticalFindings: 0, actionPlan: 'Minor disclosure enhancement', completionRate: 95 },
  { id: 'ASR-009', area: 'IT General Controls', category: 'Technology', lineOfDefence: '3rd', assuranceLevel: 'substantial', provider: 'KPMG', lastAssessed: '2024-02-01', nextAssessment: '2025-02-01', findings: 4, criticalFindings: 0, actionPlan: 'Change management hardening, access recertification', completionRate: 72 },
  { id: 'ASR-010', area: 'Conduct & Culture', category: 'People', lineOfDefence: '2nd', assuranceLevel: 'moderate', provider: 'HR & Compliance', lastAssessed: '2024-03-05', nextAssessment: '2024-06-05', findings: 3, criticalFindings: 0, actionPlan: 'Whistleblowing awareness, tone-from-top refresh', completionRate: 68 },
];

function getAssuranceLevelColour(level: AssuranceLevel): string {
  switch (level) {
    case 'high': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'substantial': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'moderate': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'limited': return 'bg-red-500/20 text-red-400 border-red-500/30';
  }
}

function getLineOfDefenceColour(line: LineOfDefence): string {
  switch (line) {
    case '1st': return 'bg-blue-500/20 text-blue-400';
    case '2nd': return 'bg-purple-500/20 text-purple-400';
    case '3rd': return 'bg-emerald-500/20 text-emerald-400';
  }
}

type ReportView = 'reports' | 'assurance';

export default function Reports() {
  const { isDataActive } = useData();
  const [activeView, setActiveView] = useState<ReportView>('reports');
  const [showNewReport, setShowNewReport] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [generating, setGenerating] = useState<string | null>(null);
  const [assuranceFilter, setAssuranceFilter] = useState<string>('all');

  const activeAssurance = isDataActive ? assuranceData : [];
  const activeRisks = isDataActive ? risks : [];
  const filteredAssurance = assuranceFilter === 'all' ? activeAssurance : activeAssurance.filter(a => a.lineOfDefence === assuranceFilter);

  // Assurance summary stats
  const assuranceStats = {
    high: activeAssurance.filter(a => a.assuranceLevel === 'high').length,
    substantial: activeAssurance.filter(a => a.assuranceLevel === 'substantial').length,
    moderate: activeAssurance.filter(a => a.assuranceLevel === 'moderate').length,
    limited: activeAssurance.filter(a => a.assuranceLevel === 'limited').length,
    totalFindings: activeAssurance.reduce((s, a) => s + a.findings, 0),
    criticalFindings: activeAssurance.reduce((s, a) => s + a.criticalFindings, 0),
    avgCompletion: activeAssurance.length > 0 ? Math.round(activeAssurance.reduce((s, a) => s + a.completionRate, 0) / activeAssurance.length) : 0,
    risksCovered: new Set(activeRisks.map(r => r.category)).size,
  };

  // Handle report download
  const handleDownload = (report: Report) => {
    setGenerating(report.id);
    setTimeout(() => {
      const content = [
        `LUMINA-R ${report.name.toUpperCase()}`,
        `Type: ${report.type}`,
        `Generated: ${new Date().toLocaleString()}`,
        `Frequency: ${report.frequency}`,
        '',
        'This report contains comprehensive risk intelligence data.',
        'Full report generation requires backend integration.',
      ].join('\n');
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.id}-${report.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      setGenerating(null);
    }, 1000);
  };

  // Handle template click
  const handleTemplateClick = () => {
    setShowNewReport(true);
  };

  // Handle quick report generation
  const handleQuickReport = (type: string) => {
    const report = reports.find(r => r.name.toLowerCase().includes(type.toLowerCase()));
    if (report) handleDownload(report);
  };

  const filteredReports = filterType === 'all' ? reports : reports.filter(r => r.type === filterType);

  const getTypeColor = (type: Report['type']) => {
    switch (type) {
      case 'board':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/40';
      case 'executive':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/40';
      case 'regulatory':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/40';
      case 'operational':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Reports"
        subtitle="Generate and manage risk reports"
        actions={
          <button className="btn-primary" onClick={() => setShowNewReport(true)}>
            + New Report
          </button>
        }
      />

      {/* View Tabs */}
      <div className="flex items-center gap-2">
        {(['reports', 'assurance'] as ReportView[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveView(tab)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeView === tab
                ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
                : 'text-navy-400 hover:text-navy-200 hover:bg-navy-800/50 border border-transparent'
            )}
          >
            {tab === 'reports' ? 'Standard Reports' : 'Assurance Level Reports'}
          </button>
        ))}
      </div>

      {activeView === 'reports' ? (
      <>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="glass-card-hover p-5 text-left" onClick={() => handleQuickReport('Board')}>
          <div className="w-10 h-10 rounded-lg bg-accent-primary/20 flex items-center justify-center font-bold text-accent-primary mb-3">B</div>
          <h3 className="text-base font-semibold text-navy-100 mb-1">Board Risk Summary</h3>
          <p className="text-sm text-navy-400">Generate comprehensive board-ready report</p>
        </button>
        <button className="glass-card-hover p-5 text-left" onClick={() => handleQuickReport('Executive')}>
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center font-bold text-blue-400 mb-3">E</div>
          <h3 className="text-base font-semibold text-navy-100 mb-1">Executive Dashboard</h3>
          <p className="text-sm text-navy-400">Quick executive summary with key metrics</p>
        </button>
        <button className="glass-card-hover p-5 text-left" onClick={() => setShowNewReport(true)}>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 mb-3">+</div>
          <h3 className="text-base font-semibold text-navy-100 mb-1">Custom Report</h3>
          <p className="text-sm text-navy-400">Build a custom report with selected data</p>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Reports */}
        <div className="lg:col-span-2">
          <SectionCard
            title="Available Reports"
            actions={
              <button className="btn-ghost text-sm" onClick={() => setShowFilter(!showFilter)}>
                Filter
              </button>
            }
          >
            {showFilter && (
              <div className="flex gap-2 mb-4 flex-wrap">
                {['all', 'board', 'executive', 'regulatory', 'operational'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize',
                      filterType === type
                        ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
                        : 'text-navy-400 bg-navy-800/50 border border-navy-700/30 hover:text-navy-200'
                    )}
                  >
                    {type === 'all' ? 'All Types' : type}
                  </button>
                ))}
              </div>
            )}
            <div className="space-y-3">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-navy-800/30 border border-navy-700/50 hover:border-navy-600/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-navy-700/50 font-bold text-navy-300 text-sm">
                      R
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-navy-100">{report.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-2xs font-medium border capitalize',
                          getTypeColor(report.type)
                        )}>
                          {report.type}
                        </span>
                        <span className="text-2xs text-navy-500 capitalize">
                          {report.frequency}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-navy-400">Last generated</p>
                      <p className="text-sm text-navy-200">
                        {new Date(report.lastGenerated).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="btn-secondary text-sm py-2 px-3" onClick={() => handleDownload(report)}>
                      {generating === report.id ? 'Generating...' : 'Download'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Scheduled Reports */}
        <div className="space-y-6">
          <SectionCard title="Scheduled Reports">
            <div className="space-y-3">
              {scheduledReports.map((report, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg bg-navy-800/30"
                >
                  <span className="text-xs text-navy-400">⏱</span>
                  <div className="flex-1">
                    <p className="text-sm text-navy-200">{report.name}</p>
                    <p className="text-xs text-navy-500">{report.nextRun}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Report Templates">
            <div className="space-y-2">
              {['Board Risk Package', 'Regulatory Filing', 'Audit Summary', 'Risk Register Export'].map((template) => (
                <button
                  key={template}
                  onClick={() => handleTemplateClick()}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-navy-800/30 hover:bg-navy-800/50 transition-colors text-left"
                >
                  <span className="text-sm text-navy-200">→ {template}</span>
                </button>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
      {/* New Report Modal */}
      </>
      ) : (
      /* ==================== ASSURANCE LEVEL REPORTS VIEW ==================== */
      <div className="space-y-6">
        {/* Assurance Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 border-l-4 border-l-emerald-500">
            <p className="text-2xl font-bold text-emerald-400">{assuranceStats.high}</p>
            <p className="text-xs text-navy-400">High Assurance</p>
          </div>
          <div className="glass-card p-4 border-l-4 border-l-blue-500">
            <p className="text-2xl font-bold text-blue-400">{assuranceStats.substantial}</p>
            <p className="text-xs text-navy-400">Substantial</p>
          </div>
          <div className="glass-card p-4 border-l-4 border-l-amber-500">
            <p className="text-2xl font-bold text-amber-400">{assuranceStats.moderate}</p>
            <p className="text-xs text-navy-400">Moderate</p>
          </div>
          <div className="glass-card p-4 border-l-4 border-l-red-500">
            <p className="text-2xl font-bold text-red-400">{assuranceStats.limited}</p>
            <p className="text-xs text-navy-400">Limited</p>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="glass-card p-3 flex items-center justify-between overflow-x-auto gap-4">
          <div className="flex items-center divide-x divide-navy-700">
            <div className="flex flex-col items-center px-4">
              <span className="text-lg font-bold text-navy-100">{activeAssurance.length}</span>
              <span className="text-2xs text-navy-500 uppercase">Areas Assessed</span>
            </div>
            <div className="flex flex-col items-center px-4">
              <span className="text-lg font-bold text-amber-400">{assuranceStats.totalFindings}</span>
              <span className="text-2xs text-navy-500 uppercase">Total Findings</span>
            </div>
            <div className="flex flex-col items-center px-4">
              <span className="text-lg font-bold text-red-400">{assuranceStats.criticalFindings}</span>
              <span className="text-2xs text-navy-500 uppercase">Critical Findings</span>
            </div>
            <div className="flex flex-col items-center px-4">
              <span className="text-lg font-bold text-accent-primary">{assuranceStats.avgCompletion}%</span>
              <span className="text-2xs text-navy-500 uppercase">Avg Remediation</span>
            </div>
          </div>
        </div>

        {/* Three Lines of Defence Model */}
        <SectionCard title="Three Lines of Defence Model" subtitle="Assurance coverage across defence lines">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[
              { line: '1st' as LineOfDefence, label: 'Management Controls', desc: 'Operational management, risk ownership', items: activeAssurance.filter(a => a.lineOfDefence === '1st') },
              { line: '2nd' as LineOfDefence, label: 'Risk & Compliance Oversight', desc: 'Risk management, compliance functions', items: activeAssurance.filter(a => a.lineOfDefence === '2nd') },
              { line: '3rd' as LineOfDefence, label: 'Independent Assurance', desc: 'Internal audit, external audit', items: activeAssurance.filter(a => a.lineOfDefence === '3rd') },
            ].map((defence) => (
              <div key={defence.line} className="p-4 rounded-xl bg-navy-800/30 border border-navy-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn('px-2 py-0.5 rounded text-xs font-bold', getLineOfDefenceColour(defence.line))}>
                    {defence.line} Line
                  </span>
                  <span className="text-sm font-medium text-navy-200">{defence.label}</span>
                </div>
                <p className="text-xs text-navy-500 mb-3">{defence.desc}</p>
                <div className="space-y-2">
                  {defence.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 rounded bg-navy-800/40">
                      <span className="text-xs text-navy-300 truncate max-w-[60%]">{item.area}</span>
                      <span className={cn('px-1.5 py-0.5 rounded text-2xs font-medium border capitalize', getAssuranceLevelColour(item.assuranceLevel))}>
                        {item.assuranceLevel}
                      </span>
                    </div>
                  ))}
                  {defence.items.length === 0 && <p className="text-xs text-navy-500 italic">No assessments</p>}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Filter */}
        <div className="flex items-center gap-2">
          {['all', '1st', '2nd', '3rd'].map((line) => (
            <button
              key={line}
              onClick={() => setAssuranceFilter(line)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                assuranceFilter === line
                  ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
                  : 'text-navy-400 bg-navy-800/50 border border-navy-700/30 hover:text-navy-200'
              )}
            >
              {line === 'all' ? 'All Lines' : `${line} Line`}
            </button>
          ))}
        </div>

        {/* Assurance Detail Table */}
        <SectionCard title="Assurance Assessments">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-navy-700 bg-navy-900/50">
                  <th className="py-2 px-3 text-left text-navy-300 font-medium">ID</th>
                  <th className="py-2 px-3 text-left text-navy-300 font-medium">Area</th>
                  <th className="py-2 px-3 text-center text-navy-300 font-medium">Line</th>
                  <th className="py-2 px-3 text-center text-navy-300 font-medium">Assurance Level</th>
                  <th className="py-2 px-3 text-left text-navy-300 font-medium">Provider</th>
                  <th className="py-2 px-3 text-center text-navy-300 font-medium">Findings</th>
                  <th className="py-2 px-3 text-center text-navy-300 font-medium">Critical</th>
                  <th className="py-2 px-3 text-left text-navy-300 font-medium">Action Plan</th>
                  <th className="py-2 px-3 text-center text-navy-300 font-medium">Remediation</th>
                  <th className="py-2 px-3 text-left text-navy-300 font-medium">Next Assessment</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssurance.map((item, idx) => (
                  <tr key={item.id} className={cn('border-b border-navy-800 hover:bg-navy-800/30', idx % 2 === 0 && 'bg-navy-900/20')}>
                    <td className="py-2 px-3 font-mono text-navy-400">{item.id}</td>
                    <td className="py-2 px-3 text-navy-200 font-medium">{item.area}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={cn('px-1.5 py-0.5 rounded text-2xs font-bold', getLineOfDefenceColour(item.lineOfDefence))}>
                        {item.lineOfDefence}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className={cn('px-2 py-0.5 rounded text-2xs font-medium border capitalize', getAssuranceLevelColour(item.assuranceLevel))}>
                        {item.assuranceLevel}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-navy-300">{item.provider}</td>
                    <td className="py-2 px-3 text-center font-mono text-navy-200">{item.findings}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={cn('font-mono font-bold', item.criticalFindings > 0 ? 'text-red-400' : 'text-emerald-400')}>
                        {item.criticalFindings}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-navy-400 max-w-[200px] truncate" title={item.actionPlan}>{item.actionPlan}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-navy-800 rounded-full overflow-hidden">
                          <div
                            className={cn('h-full rounded-full', item.completionRate >= 80 ? 'bg-emerald-500' : item.completionRate >= 50 ? 'bg-amber-500' : 'bg-red-500')}
                            style={{ width: `${item.completionRate}%` }}
                          />
                        </div>
                        <span className="text-2xs font-mono text-navy-400">{item.completionRate}%</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-navy-500">{item.nextAssessment}</td>
                  </tr>
                ))}
                {filteredAssurance.length === 0 && (
                  <tr><td colSpan={10} className="py-8 text-center text-navy-500">No data available. Upload a dataset or connect your AI Advisor to view assurance reports.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Assurance Level Distribution */}
        <SectionCard title="Assurance Level Distribution" subtitle="Visual breakdown of assurance coverage">
          <div className="space-y-3">
            {(['high', 'substantial', 'moderate', 'limited'] as AssuranceLevel[]).map((level) => {
              const count = activeAssurance.filter(a => a.assuranceLevel === level).length;
              const pct = activeAssurance.length > 0 ? (count / activeAssurance.length) * 100 : 0;
              return (
                <div key={level} className="flex items-center gap-3">
                  <span className={cn('px-2 py-0.5 rounded text-xs font-medium border capitalize w-24 text-center', getAssuranceLevelColour(level))}>
                    {level}
                  </span>
                  <div className="flex-1 h-6 bg-navy-800/50 rounded overflow-hidden">
                    <div
                      className={cn('h-full rounded transition-all',
                        level === 'high' ? 'bg-emerald-500/40' :
                        level === 'substantial' ? 'bg-blue-500/40' :
                        level === 'moderate' ? 'bg-amber-500/40' : 'bg-red-500/40'
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono text-navy-300 w-16 text-right">{count} ({pct.toFixed(0)}%)</span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Legend */}
        <div className="glass-card p-3">
          <div className="flex flex-wrap items-center gap-6 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-navy-400 font-medium">Assurance Levels:</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> High — Controls operating effectively with minimal exceptions</span>
            </div>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" /> Substantial — Controls generally effective, minor improvements needed</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Moderate — Some control weaknesses, remediation in progress</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> Limited — Significant control gaps, urgent remediation required</span>
          </div>
        </div>
      </div>
      )}

      {showNewReport && (
        <div
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setShowNewReport(false)}
        >
          <div
            className="glass-card max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-navy-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-navy-100">Create New Report</h2>
                <button onClick={() => setShowNewReport(false)} className="p-2 rounded-lg text-navy-400 hover:text-navy-200 hover:bg-navy-800/50">×</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-300 mb-1">Report Name</label>
                <input type="text" placeholder="Enter report name..." className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 placeholder-navy-500 focus:outline-none focus:border-accent-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-300 mb-1">Report Type</label>
                <select className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50">
                  <option value="board">Board</option>
                  <option value="executive">Executive</option>
                  <option value="regulatory">Regulatory</option>
                  <option value="operational">Operational</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-300 mb-1">Frequency</label>
                <select className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50">
                  <option value="ad-hoc">Ad Hoc</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-navy-700/50 flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setShowNewReport(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => setShowNewReport(false)}>Create Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
