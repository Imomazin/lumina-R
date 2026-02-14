import { useState } from 'react';
import { Activity, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { PageHeader, SectionCard, MetricCard } from '../../components';
import { KRITable } from '../../components/tables';
import { KRIStatusBadge } from '../../components/badges';
import { kris, getKRIsByCategory, getKRIStatusCounts } from '../../data';
import { cn } from '../../utils';
import type { KRI, RiskCategory } from '../../types';

export default function RiskIndicators() {
  const [selectedCategory, setSelectedCategory] = useState<RiskCategory | 'all'>('all');
  const [selectedKRI, setSelectedKRI] = useState<KRI | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const statusCounts = getKRIStatusCounts();
  const filteredKRIs = selectedCategory === 'all' ? kris : getKRIsByCategory(selectedCategory);

  const categories: { value: RiskCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'financial', label: 'Financial' },
    { value: 'operational', label: 'Operational' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'cyber', label: 'Cyber' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Key Risk Indicators"
        subtitle="Monitor leading indicators of risk exposure"
        actions={
          <button className="btn-primary" onClick={() => setShowConfigModal(true)}>
            <Activity className="w-4 h-4 mr-2" />
            Configure KRIs
          </button>
        }
      />

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total KRIs"
          value={kris.length}
          icon={<Activity className="w-5 h-5 text-accent-primary" />}
        />
        <div className="glass-card p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-navy-400">Green Status</p>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-emerald-400">{statusCounts.green}</p>
          <p className="text-sm text-navy-500">Within threshold</p>
        </div>
        <div className="glass-card p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-navy-400">Amber Status</p>
            <AlertCircle className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-amber-400">{statusCounts.amber}</p>
          <p className="text-sm text-navy-500">Approaching threshold</p>
        </div>
        <div className="glass-card p-5 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-navy-400">Red Status</p>
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-red-400">{statusCounts.red}</p>
          <p className="text-sm text-navy-500">Breached</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              selectedCategory === cat.value
                ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
                : 'text-navy-400 hover:text-navy-200 hover:bg-navy-800/50 border border-transparent'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* KRI Sections by Category */}
      {selectedCategory === 'all' ? (
        <div className="space-y-6">
          {['financial', 'operational', 'compliance', 'cyber'].map((category) => {
            const categoryKRIs = getKRIsByCategory(category as RiskCategory);
            if (categoryKRIs.length === 0) return null;

            return (
              <SectionCard
                key={category}
                title={`${category.charAt(0).toUpperCase() + category.slice(1)} KRIs`}
                subtitle={`${categoryKRIs.length} indicators monitored`}
              >
                <KRITable
                  kris={categoryKRIs}
                  onRowClick={(kri) => setSelectedKRI(kri)}
                />
              </SectionCard>
            );
          })}
        </div>
      ) : (
        <SectionCard
          title={`${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} KRIs`}
          subtitle={`${filteredKRIs.length} indicators monitored`}
        >
          <KRITable
            kris={filteredKRIs}
            onRowClick={(kri) => setSelectedKRI(kri)}
          />
        </SectionCard>
      )}

      {/* KRI Detail Modal */}
      {selectedKRI && (
        <div
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedKRI(null)}
        >
          <div
            className="glass-card max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-navy-700/50">
              <div className="flex items-start justify-between">
                <div>
                  <KRIStatusBadge status={selectedKRI.status} size="lg" />
                  <h2 className="text-xl font-bold text-navy-100 mt-3">{selectedKRI.name}</h2>
                  <p className="text-sm text-navy-400 mt-1">{selectedKRI.description}</p>
                </div>
                <button
                  onClick={() => setSelectedKRI(null)}
                  className="p-2 rounded-lg text-navy-400 hover:text-navy-200 hover:bg-navy-800/50"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="text-center py-4">
                <p className="text-5xl font-bold text-navy-100">
                  {selectedKRI.currentValue}
                  <span className="text-2xl font-normal text-navy-400 ml-1">{selectedKRI.unit}</span>
                </p>
                <div className={cn(
                  'flex items-center justify-center gap-2 mt-2',
                  selectedKRI.trend === 'up' ? 'text-red-400' : selectedKRI.trend === 'down' ? 'text-emerald-400' : 'text-navy-400'
                )}>
                  {selectedKRI.trend === 'up' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  <span className="font-medium">{selectedKRI.trendPercentage > 0 ? '+' : ''}{selectedKRI.trendPercentage}% from last period</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-navy-300 mb-3">Thresholds</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <span className="text-sm text-emerald-300">Green</span>
                    <span className="text-sm font-mono text-emerald-300">
                      {selectedKRI.threshold.green.min} - {selectedKRI.threshold.green.max} {selectedKRI.unit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <span className="text-sm text-amber-300">Amber</span>
                    <span className="text-sm font-mono text-amber-300">
                      {selectedKRI.threshold.amber.min} - {selectedKRI.threshold.amber.max} {selectedKRI.unit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                    <span className="text-sm text-red-300">Red</span>
                    <span className="text-sm font-mono text-red-300">
                      {selectedKRI.threshold.red.min} - {selectedKRI.threshold.red.max} {selectedKRI.unit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-navy-700/50">
                <div>
                  <p className="text-xs text-navy-500 uppercase tracking-wider">Owner</p>
                  <p className="text-sm text-navy-200 mt-1">{selectedKRI.owner}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-500 uppercase tracking-wider">Update Frequency</p>
                  <p className="text-sm text-navy-200 mt-1 capitalize">{selectedKRI.frequency}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-navy-700/50 flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setSelectedKRI(null)}>
                Close
              </button>
              <button className="btn-primary" onClick={() => setShowHistory(true)}>
                View History
              </button>
            </div>

            {/* History Panel */}
            {showHistory && (
              <div className="p-6 border-t border-navy-700/50 bg-navy-800/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-navy-200">Historical Trend</h3>
                  <button onClick={() => setShowHistory(false)} className="text-xs text-navy-400 hover:text-navy-200">Close</button>
                </div>
                <div className="space-y-2">
                  {[
                    { period: 'Current', value: selectedKRI.currentValue },
                    { period: 'Last Month', value: Math.round(selectedKRI.currentValue * (1 - selectedKRI.trendPercentage / 100)) },
                    { period: '2 Months Ago', value: Math.round(selectedKRI.currentValue * (1 - selectedKRI.trendPercentage * 2 / 100)) },
                    { period: '3 Months Ago', value: Math.round(selectedKRI.currentValue * (1 - selectedKRI.trendPercentage * 2.5 / 100)) },
                  ].map((entry, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-navy-800/30">
                      <span className="text-xs text-navy-300">{entry.period}</span>
                      <span className="text-sm font-mono text-navy-200">{entry.value} {selectedKRI.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Configure KRIs Modal */}
      {showConfigModal && (
        <div
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setShowConfigModal(false)}
        >
          <div
            className="glass-card max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-navy-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-navy-100">Configure KRIs</h2>
                <button onClick={() => setShowConfigModal(false)} className="p-2 rounded-lg text-navy-400 hover:text-navy-200 hover:bg-navy-800/50">×</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-300 mb-1">Default Update Frequency</label>
                <select className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50">
                  <option>Daily</option><option>Weekly</option><option>Monthly</option><option>Quarterly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-300 mb-1">Breach Notification</label>
                <select className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50">
                  <option>Email + Dashboard</option><option>Dashboard Only</option><option>Email Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-300 mb-1">Auto-escalation on Red</label>
                <select className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50">
                  <option>Enabled</option><option>Disabled</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-navy-700/50 flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setShowConfigModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => setShowConfigModal(false)}>Save Configuration</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
