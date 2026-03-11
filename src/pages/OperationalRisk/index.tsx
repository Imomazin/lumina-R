import { useState, useMemo } from 'react';
import { PageHeader, SectionCard } from '../../components';
import { useData } from '../../context/DataContext';
import { cn } from '../../utils';

type EventCategory = 'process_failure' | 'human_error' | 'system_failure' | 'external_event' | 'fraud' | 'compliance_breach';
type Severity = 'critical' | 'high' | 'medium' | 'low';
type EventStatus = 'open' | 'investigating' | 'remediated' | 'closed';

interface OpRiskEvent {
  id: string;
  title: string;
  category: EventCategory;
  description: string;
  businessUnit: string;
  severity: Severity;
  financialImpact: number;
  recoveredAmount: number;
  dateOccurred: string;
  dateDetected: string;
  rootCause: string;
  status: EventStatus;
  owner: string;
  controlFailures: string[];
  lessonLearned: string;
}

interface ProcessRisk {
  id: string;
  process: string;
  department: string;
  inherentRisk: number;
  controlEffectiveness: number;
  residualRisk: number;
  keyControls: number;
  failedControls: number;
  lastAssessed: string;
}

const sampleEvents: OpRiskEvent[] = [
  { id: 'OE-001', title: 'Payment Processing Outage', category: 'system_failure', description: 'Core payment system experienced 4-hour outage affecting client transactions', businessUnit: 'Operations', severity: 'critical', financialImpact: 1200000, recoveredAmount: 400000, dateOccurred: '2024-03-10', dateDetected: '2024-03-10', rootCause: 'Database failover mechanism malfunction during peak load', status: 'remediated', owner: 'Tom Anderson', controlFailures: ['Capacity monitoring', 'Failover testing'], lessonLearned: 'Implement automated failover testing quarterly' },
  { id: 'OE-002', title: 'Unauthorised Wire Transfer', category: 'fraud', description: 'Business email compromise led to fraudulent wire transfer request', businessUnit: 'Finance', severity: 'high', financialImpact: 450000, recoveredAmount: 280000, dateOccurred: '2024-02-28', dateDetected: '2024-03-01', rootCause: 'Lack of multi-channel verification for high-value transfers', status: 'closed', owner: 'Emily Watson', controlFailures: ['Dual authorisation', 'Sender verification'], lessonLearned: 'Mandate callback verification for transfers > £100K' },
  { id: 'OE-003', title: 'Client Data Mismatch', category: 'human_error', description: 'Manual data entry errors caused incorrect client portfolio valuations', businessUnit: 'Client Services', severity: 'medium', financialImpact: 85000, recoveredAmount: 85000, dateOccurred: '2024-03-05', dateDetected: '2024-03-07', rootCause: 'Manual spreadsheet-based reconciliation process', status: 'remediated', owner: 'Lisa Johnson', controlFailures: ['Four-eye review'], lessonLearned: 'Automate reconciliation with STP integration' },
  { id: 'OE-004', title: 'Regulatory Reporting Delay', category: 'compliance_breach', description: 'EMIR trade reporting submissions delayed by 3 business days', businessUnit: 'Compliance', severity: 'high', financialImpact: 250000, recoveredAmount: 0, dateOccurred: '2024-02-15', dateDetected: '2024-02-18', rootCause: 'System migration caused data feed interruption', status: 'closed', owner: 'James Morrison', controlFailures: ['Automated reporting checks', 'Migration testing'], lessonLearned: 'Run parallel reporting during system migrations' },
  { id: 'OE-005', title: 'Vendor Service Degradation', category: 'external_event', description: 'Critical SaaS vendor experienced performance issues affecting operations', businessUnit: 'IT', severity: 'medium', financialImpact: 180000, recoveredAmount: 120000, dateOccurred: '2024-03-12', dateDetected: '2024-03-12', rootCause: 'Vendor cloud infrastructure scaling failure', status: 'investigating', owner: 'Sarah Chen', controlFailures: ['Vendor SLA monitoring'], lessonLearned: 'Establish backup vendor for critical services' },
  { id: 'OE-006', title: 'Trade Settlement Failure', category: 'process_failure', description: 'Failed settlement of OTC derivative trades due to incorrect netting', businessUnit: 'Operations', severity: 'high', financialImpact: 520000, recoveredAmount: 520000, dateOccurred: '2024-01-22', dateDetected: '2024-01-22', rootCause: 'Netting algorithm did not account for cross-currency legs', status: 'closed', owner: 'Michael Torres', controlFailures: ['Pre-settlement checks', 'Netting validation'], lessonLearned: 'Update netting rules for multi-currency trades' },
  { id: 'OE-007', title: 'Insider Trading Attempt', category: 'fraud', description: 'Suspicious trading pattern detected in restricted security', businessUnit: 'Compliance', severity: 'critical', financialImpact: 0, recoveredAmount: 0, dateOccurred: '2024-02-05', dateDetected: '2024-02-05', rootCause: 'Employee traded on material non-public information', status: 'closed', owner: 'James Morrison', controlFailures: ['Pre-clearance system'], lessonLearned: 'Enhance automated surveillance with ML models' },
  { id: 'OE-008', title: 'Physical Access Control Breach', category: 'external_event', description: 'Tailgating incident at secure data centre facility', businessUnit: 'Facilities', severity: 'low', financialImpact: 15000, recoveredAmount: 0, dateOccurred: '2024-03-08', dateDetected: '2024-03-09', rootCause: 'Security guard distraction during shift change', status: 'open', owner: 'Rachel Green', controlFailures: ['Physical access controls'], lessonLearned: 'Install anti-tailgating turnstiles' },
];

const processRisks: ProcessRisk[] = [
  { id: 'PR-001', process: 'Client Onboarding (KYC/AML)', department: 'Compliance', inherentRisk: 85, controlEffectiveness: 72, residualRisk: 24, keyControls: 8, failedControls: 1, lastAssessed: '2024-02-15' },
  { id: 'PR-002', process: 'Trade Execution & Settlement', department: 'Operations', inherentRisk: 90, controlEffectiveness: 80, residualRisk: 18, keyControls: 12, failedControls: 2, lastAssessed: '2024-03-01' },
  { id: 'PR-003', process: 'Payment Processing', department: 'Finance', inherentRisk: 95, controlEffectiveness: 68, residualRisk: 30, keyControls: 10, failedControls: 3, lastAssessed: '2024-02-20' },
  { id: 'PR-004', process: 'Financial Reporting', department: 'Finance', inherentRisk: 75, controlEffectiveness: 85, residualRisk: 11, keyControls: 7, failedControls: 0, lastAssessed: '2024-03-10' },
  { id: 'PR-005', process: 'IT Change Management', department: 'IT', inherentRisk: 80, controlEffectiveness: 65, residualRisk: 28, keyControls: 9, failedControls: 2, lastAssessed: '2024-01-30' },
  { id: 'PR-006', process: 'Data Backup & Recovery', department: 'IT', inherentRisk: 88, controlEffectiveness: 78, residualRisk: 19, keyControls: 6, failedControls: 1, lastAssessed: '2024-02-28' },
  { id: 'PR-007', process: 'Vendor Management', department: 'Procurement', inherentRisk: 70, controlEffectiveness: 55, residualRisk: 32, keyControls: 5, failedControls: 2, lastAssessed: '2024-01-15' },
  { id: 'PR-008', process: 'Employee Exit Processing', department: 'HR', inherentRisk: 65, controlEffectiveness: 75, residualRisk: 16, keyControls: 6, failedControls: 0, lastAssessed: '2024-03-05' },
];

function formatCurrency(v: number): string {
  if (v >= 1000000) return `£${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `£${(v / 1000).toFixed(0)}K`;
  return `£${v.toFixed(0)}`;
}

function getSeverityColour(s: Severity): string {
  switch (s) { case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30'; case 'high': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'; case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'; case 'low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'; }
}

function getCategoryColour(c: EventCategory): string {
  switch (c) { case 'process_failure': return 'bg-blue-500/20 text-blue-400'; case 'human_error': return 'bg-amber-500/20 text-amber-400'; case 'system_failure': return 'bg-red-500/20 text-red-400'; case 'external_event': return 'bg-purple-500/20 text-purple-400'; case 'fraud': return 'bg-rose-500/20 text-rose-400'; case 'compliance_breach': return 'bg-orange-500/20 text-orange-400'; }
}

function getStatusColour(s: EventStatus): string {
  switch (s) { case 'open': return 'bg-red-500/20 text-red-400'; case 'investigating': return 'bg-amber-500/20 text-amber-400'; case 'remediated': return 'bg-blue-500/20 text-blue-400'; case 'closed': return 'bg-emerald-500/20 text-emerald-400'; }
}

type TabView = 'events' | 'processes' | 'analysis';

export default function OperationalRisk() {
  const { isDataActive } = useData();
  const [activeTab, setActiveTab] = useState<TabView>('events');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const activeEvents = isDataActive ? sampleEvents : [];
  const activeProcesses = isDataActive ? processRisks : [];
  const filteredEvents = filterCategory === 'all' ? activeEvents : activeEvents.filter(e => e.category === filterCategory);

  const stats = useMemo(() => {
    if (activeEvents.length === 0) return { totalLoss: 0, recovered: 0, netLoss: 0, openEvents: 0, criticalCount: 0, avgDetectionDays: 0 };
    const totalLoss = activeEvents.reduce((s, e) => s + e.financialImpact, 0);
    const recovered = activeEvents.reduce((s, e) => s + e.recoveredAmount, 0);
    const openEvents = activeEvents.filter(e => e.status === 'open' || e.status === 'investigating').length;
    const criticalCount = activeEvents.filter(e => e.severity === 'critical').length;
    const detectionDays = activeEvents.map(e => { const d1 = new Date(e.dateOccurred); const d2 = new Date(e.dateDetected); return Math.max(0, Math.round((d2.getTime() - d1.getTime()) / 86400000)); });
    const avgDetection = detectionDays.reduce((s, d) => s + d, 0) / detectionDays.length;
    return { totalLoss: totalLoss, recovered, netLoss: totalLoss - recovered, openEvents, criticalCount, avgDetectionDays: avgDetection };
  }, [activeEvents]);

  const handleExport = () => {
    const headers = ['ID', 'Title', 'Category', 'Severity', 'Financial Impact', 'Recovered', 'Net Loss', 'Date', 'Status', 'Owner', 'Root Cause'];
    const rows = filteredEvents.map(e => [e.id, `"${e.title}"`, e.category, e.severity, e.financialImpact, e.recoveredAmount, e.financialImpact - e.recoveredAmount, e.dateOccurred, e.status, e.owner, `"${e.rootCause}"`]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `op-risk-events-${new Date().toISOString().split('T')[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  if (!isDataActive) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader title="Operational Risk Tool" subtitle="Assess and manage operational risk events" />
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-navy-800/50 flex items-center justify-center"><span className="text-2xl text-navy-500">⚙</span></div>
          <h3 className="text-lg font-semibold text-navy-200 mb-2">No Data Available</h3>
          <p className="text-sm text-navy-500">Upload a dataset or connect your AI Advisor to begin operational risk management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Operational Risk Tool" subtitle="Assess and manage operational risk events" actions={<button className="btn-secondary" onClick={handleExport}>Export CSV</button>} />

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="glass-card p-4 border-l-4 border-l-accent-primary"><p className="text-2xl font-bold text-navy-100">{activeEvents.length}</p><p className="text-xs text-navy-400">Total Events</p></div>
        <div className="glass-card p-4 border-l-4 border-l-red-500"><p className="text-2xl font-bold text-red-400">{stats.criticalCount}</p><p className="text-xs text-navy-400">Critical</p></div>
        <div className="glass-card p-4 border-l-4 border-l-amber-500"><p className="text-2xl font-bold text-amber-400">{stats.openEvents}</p><p className="text-xs text-navy-400">Open/Investigating</p></div>
        <div className="glass-card p-4 border-l-4 border-l-red-500"><p className="text-2xl font-bold text-red-400">{formatCurrency(stats.netLoss)}</p><p className="text-xs text-navy-400">Net Loss</p></div>
        <div className="glass-card p-4 border-l-4 border-l-emerald-500"><p className="text-2xl font-bold text-emerald-400">{formatCurrency(stats.recovered)}</p><p className="text-xs text-navy-400">Recovered</p></div>
        <div className="glass-card p-4 border-l-4 border-l-blue-500"><p className="text-2xl font-bold text-blue-400">{stats.avgDetectionDays.toFixed(1)}d</p><p className="text-xs text-navy-400">Avg Detection Time</p></div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {([['events', 'Loss Events'], ['processes', 'Process Risk Map'], ['analysis', 'Root Cause Analysis']] as [TabView, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors', activeTab === key ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30' : 'text-navy-400 hover:text-navy-200 hover:bg-navy-800/50 border border-transparent')}>{label}</button>
        ))}
      </div>

      {activeTab === 'events' && (
        <>
          <div className="flex items-center gap-2 flex-wrap">
            {['all', 'process_failure', 'human_error', 'system_failure', 'external_event', 'fraud', 'compliance_breach'].map((c) => (
              <button key={c} onClick={() => setFilterCategory(c)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize', filterCategory === c ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30' : 'text-navy-400 bg-navy-800/50 border border-navy-700/30 hover:text-navy-200')}>{c === 'all' ? 'All Categories' : c.replace(/_/g, ' ')}</button>
            ))}
          </div>
          <SectionCard title="Operational Loss Events">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-navy-700 bg-navy-900/50">
                    <th className="py-2 px-3 text-left text-navy-300">ID</th>
                    <th className="py-2 px-3 text-left text-navy-300">Event</th>
                    <th className="py-2 px-3 text-center text-navy-300">Category</th>
                    <th className="py-2 px-3 text-center text-navy-300">Severity</th>
                    <th className="py-2 px-3 text-right text-navy-300">Loss</th>
                    <th className="py-2 px-3 text-right text-navy-300">Recovered</th>
                    <th className="py-2 px-3 text-right text-navy-300">Net</th>
                    <th className="py-2 px-3 text-left text-navy-300">Date</th>
                    <th className="py-2 px-3 text-left text-navy-300">Owner</th>
                    <th className="py-2 px-3 text-center text-navy-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event, idx) => (
                    <tr key={event.id} onClick={() => setSelectedEvent(event.id === selectedEvent ? null : event.id)} className={cn('border-b border-navy-800 hover:bg-navy-800/30 cursor-pointer', idx % 2 === 0 && 'bg-navy-900/20', selectedEvent === event.id && 'bg-accent-primary/5')}>
                      <td className="py-2 px-3 font-mono text-navy-400">{event.id}</td>
                      <td className="py-2 px-3 text-navy-200 font-medium max-w-[200px] truncate">{event.title}</td>
                      <td className="py-2 px-3 text-center"><span className={cn('px-1.5 py-0.5 rounded text-2xs font-medium capitalize', getCategoryColour(event.category))}>{event.category.replace(/_/g, ' ')}</span></td>
                      <td className="py-2 px-3 text-center"><span className={cn('px-1.5 py-0.5 rounded text-2xs font-medium capitalize border', getSeverityColour(event.severity))}>{event.severity}</span></td>
                      <td className="py-2 px-3 text-right font-mono text-red-400">{formatCurrency(event.financialImpact)}</td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-400">{formatCurrency(event.recoveredAmount)}</td>
                      <td className="py-2 px-3 text-right font-mono text-navy-200">{formatCurrency(event.financialImpact - event.recoveredAmount)}</td>
                      <td className="py-2 px-3 text-navy-500">{event.dateOccurred}</td>
                      <td className="py-2 px-3 text-navy-300">{event.owner}</td>
                      <td className="py-2 px-3 text-center"><span className={cn('px-1.5 py-0.5 rounded text-2xs font-medium capitalize', getStatusColour(event.status))}>{event.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
          {selectedEvent && (() => {
            const event = activeEvents.find(e => e.id === selectedEvent);
            if (!event) return null;
            return (
              <div className="glass-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div><span className="text-xs font-mono text-navy-500">{event.id}</span><h3 className="text-lg font-semibold text-navy-100">{event.title}</h3></div>
                  <button onClick={() => setSelectedEvent(null)} className="text-navy-400 hover:text-navy-200">×</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><h4 className="text-xs font-semibold text-accent-primary uppercase mb-2">Description</h4><p className="text-sm text-navy-300">{event.description}</p><h4 className="text-xs font-semibold text-accent-primary uppercase mt-3 mb-2">Root Cause</h4><p className="text-sm text-navy-400">{event.rootCause}</p></div>
                  <div><h4 className="text-xs font-semibold text-amber-400 uppercase mb-2">Control Failures</h4><div className="space-y-1">{event.controlFailures.map((c, i) => <span key={i} className="block text-sm text-navy-300 px-2 py-1 bg-navy-800/30 rounded">• {c}</span>)}</div><h4 className="text-xs font-semibold text-amber-400 uppercase mt-3 mb-2">Lesson Learned</h4><p className="text-sm text-navy-400">{event.lessonLearned}</p></div>
                  <div><h4 className="text-xs font-semibold text-emerald-400 uppercase mb-2">Financial Summary</h4><div className="grid grid-cols-2 gap-2"><div className="p-2 bg-navy-800/30 rounded"><p className="text-2xs text-navy-500">Gross Loss</p><p className="text-lg font-bold text-red-400">{formatCurrency(event.financialImpact)}</p></div><div className="p-2 bg-navy-800/30 rounded"><p className="text-2xs text-navy-500">Recovered</p><p className="text-lg font-bold text-emerald-400">{formatCurrency(event.recoveredAmount)}</p></div></div></div>
                </div>
              </div>
            );
          })()}
        </>
      )}

      {activeTab === 'processes' && (
        <SectionCard title="Process Risk Map" subtitle="Inherent and residual risk by business process">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-navy-700 bg-navy-900/50">
                <th className="py-2 px-3 text-left text-navy-300">ID</th><th className="py-2 px-3 text-left text-navy-300">Process</th><th className="py-2 px-3 text-left text-navy-300">Department</th>
                <th className="py-2 px-3 text-center text-navy-300">Inherent Risk</th><th className="py-2 px-3 text-center text-navy-300">Control Effect.</th><th className="py-2 px-3 text-center text-navy-300">Residual Risk</th>
                <th className="py-2 px-3 text-center text-navy-300">Key Controls</th><th className="py-2 px-3 text-center text-navy-300">Failed</th><th className="py-2 px-3 text-left text-navy-300">Last Assessed</th>
              </tr></thead>
              <tbody>
                {activeProcesses.map((p, idx) => (
                  <tr key={p.id} className={cn('border-b border-navy-800 hover:bg-navy-800/30', idx % 2 === 0 && 'bg-navy-900/20')}>
                    <td className="py-2 px-3 font-mono text-navy-400">{p.id}</td>
                    <td className="py-2 px-3 text-navy-200 font-medium">{p.process}</td>
                    <td className="py-2 px-3 text-navy-300">{p.department}</td>
                    <td className="py-2 px-3"><div className="flex items-center gap-1 justify-center"><div className="w-16 h-2 bg-navy-800 rounded-full overflow-hidden"><div className={cn('h-full rounded-full', p.inherentRisk >= 85 ? 'bg-red-500' : p.inherentRisk >= 70 ? 'bg-amber-500' : 'bg-emerald-500')} style={{ width: `${p.inherentRisk}%` }} /></div><span className="font-mono text-navy-300">{p.inherentRisk}</span></div></td>
                    <td className="py-2 px-3"><div className="flex items-center gap-1 justify-center"><div className="w-16 h-2 bg-navy-800 rounded-full overflow-hidden"><div className={cn('h-full rounded-full', p.controlEffectiveness >= 75 ? 'bg-emerald-500' : p.controlEffectiveness >= 60 ? 'bg-amber-500' : 'bg-red-500')} style={{ width: `${p.controlEffectiveness}%` }} /></div><span className="font-mono text-navy-300">{p.controlEffectiveness}%</span></div></td>
                    <td className="py-2 px-3"><div className="flex items-center gap-1 justify-center"><span className={cn('px-2 py-0.5 rounded font-mono font-bold border', p.residualRisk >= 25 ? 'bg-red-500/20 text-red-400 border-red-500/30' : p.residualRisk >= 15 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30')}>{p.residualRisk}</span></div></td>
                    <td className="py-2 px-3 text-center font-mono text-navy-300">{p.keyControls}</td>
                    <td className="py-2 px-3 text-center"><span className={cn('font-mono font-bold', p.failedControls > 0 ? 'text-red-400' : 'text-emerald-400')}>{p.failedControls}</span></td>
                    <td className="py-2 px-3 text-navy-500">{p.lastAssessed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {activeTab === 'analysis' && (
        <>
          <SectionCard title="Root Cause Analysis" subtitle="Event distribution by root cause category">
            <div className="space-y-3">
              {(['process_failure', 'human_error', 'system_failure', 'external_event', 'fraud', 'compliance_breach'] as EventCategory[]).map((cat) => {
                const catEvents = activeEvents.filter(e => e.category === cat);
                const catLoss = catEvents.reduce((s, e) => s + (e.financialImpact - e.recoveredAmount), 0);
                const pct = stats.netLoss > 0 ? (catLoss / stats.netLoss) * 100 : 0;
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className={cn('px-2 py-0.5 rounded text-xs font-medium capitalize w-32 text-center', getCategoryColour(cat))}>{cat.replace(/_/g, ' ')}</span>
                    <span className="text-xs text-navy-400 w-8 text-right">{catEvents.length}</span>
                    <div className="flex-1 h-5 bg-navy-800/50 rounded overflow-hidden">
                      <div className="h-full bg-accent-primary/40 rounded" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-sm font-mono text-navy-300 w-20 text-right">{formatCurrency(catLoss)}</span>
                    <span className="text-xs text-navy-500 w-12 text-right">{pct.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </SectionCard>
          <SectionCard title="Lessons Learned Register">
            <div className="space-y-3">
              {activeEvents.filter(e => e.status === 'closed' || e.status === 'remediated').map((event) => (
                <div key={event.id} className="p-3 rounded-lg bg-navy-800/30 border border-navy-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-navy-500">{event.id}</span>
                    <span className={cn('px-1.5 py-0.5 rounded text-2xs font-medium capitalize border', getSeverityColour(event.severity))}>{event.severity}</span>
                  </div>
                  <p className="text-sm font-medium text-navy-200 mb-1">{event.title}</p>
                  <p className="text-xs text-accent-primary">{event.lessonLearned}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )}
    </div>
  );
}
