import { useState } from 'react';
import { FileText, Download, Plus, Clock, Filter } from 'lucide-react';
import { PageHeader, SectionCard } from '../../components';
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

export default function Reports() {
  const [showNewReport, setShowNewReport] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [generating, setGenerating] = useState<string | null>(null);

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
  const handleTemplateClick = (template: string) => {
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
            <Plus className="w-4 h-4 mr-2" />
            New Report
          </button>
        }
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="glass-card-hover p-5 text-left" onClick={() => handleQuickReport('Board')}>
          <FileText className="w-8 h-8 text-accent-primary mb-3" />
          <h3 className="text-base font-semibold text-navy-100 mb-1">Board Risk Summary</h3>
          <p className="text-sm text-navy-400">Generate comprehensive board-ready report</p>
        </button>
        <button className="glass-card-hover p-5 text-left" onClick={() => handleQuickReport('Executive')}>
          <FileText className="w-8 h-8 text-blue-400 mb-3" />
          <h3 className="text-base font-semibold text-navy-100 mb-1">Executive Dashboard</h3>
          <p className="text-sm text-navy-400">Quick executive summary with key metrics</p>
        </button>
        <button className="glass-card-hover p-5 text-left" onClick={() => setShowNewReport(true)}>
          <FileText className="w-8 h-8 text-emerald-400 mb-3" />
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
                <Filter className="w-4 h-4 mr-2" />
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
                    <div className="p-2.5 rounded-xl bg-navy-700/50">
                      <FileText className="w-5 h-5 text-navy-300" />
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
                      <Download className="w-4 h-4 mr-1" />
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
                  <Clock className="w-4 h-4 text-navy-400" />
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
                  onClick={() => handleTemplateClick(template)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-navy-800/30 hover:bg-navy-800/50 transition-colors text-left"
                >
                  <FileText className="w-4 h-4 text-navy-400" />
                  <span className="text-sm text-navy-200">{template}</span>
                </button>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
      {/* New Report Modal */}
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
