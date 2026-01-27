import { useState } from 'react';
import { Download, Settings, AlertTriangle, CheckCircle, ArrowRight, Info } from 'lucide-react';
import { PageHeader, SectionCard } from '../../components';
import { riskAppetite } from '../../data';
import { cn } from '../../utils';
import type { RiskAppetite } from '../../types';

export default function RiskAppetitePage() {
  const [selectedAppetite, setSelectedAppetite] = useState<RiskAppetite | null>(null);

  const getStatusColor = (status: RiskAppetite['status']) => {
    switch (status) {
      case 'within':
        return 'text-emerald-400';
      case 'approaching':
        return 'text-amber-400';
      case 'breached':
        return 'text-red-400';
    }
  };

  const getStatusBg = (status: RiskAppetite['status']) => {
    switch (status) {
      case 'within':
        return 'bg-emerald-500/15 border-emerald-500/40';
      case 'approaching':
        return 'bg-amber-500/15 border-amber-500/40';
      case 'breached':
        return 'bg-red-500/15 border-red-500/40';
    }
  };

  const getStatusIcon = (status: RiskAppetite['status']) => {
    switch (status) {
      case 'within':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'approaching':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'breached':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      strategic: '#6366f1',
      financial: '#8b5cf6',
      operational: '#06b6d4',
      compliance: '#10b981',
      cyber: '#ef4444',
      reputational: '#ec4899',
    };
    return colors[category] || '#6366f1';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Risk Appetite Framework"
        subtitle="Define and monitor organizational risk tolerance levels"
        actions={
          <div className="flex items-center gap-3">
            <button className="btn-ghost">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
            <button className="btn-primary">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </button>
          </div>
        }
      />

      {/* Overall Statement */}
      <SectionCard>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-accent-primary/10 border border-accent-primary/30">
            <Info className="w-6 h-6 text-accent-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-navy-100 mb-2">Risk Appetite Statement</h3>
            <p className="text-navy-300 leading-relaxed">
              Our organization pursues controlled growth while maintaining a conservative risk posture.
              We accept measured risk in strategic initiatives and innovation, while maintaining very low
              tolerance for compliance failures, cyber incidents, and reputational damage. Risk decisions
              are guided by our values, stakeholder expectations, and long-term sustainability objectives.
            </p>
            <p className="text-sm text-navy-500 mt-3">
              Approved by Board Risk Committee • Last reviewed: March 2024
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="text-2xl font-bold text-emerald-400">
                {riskAppetite.filter(a => a.status === 'within').length}
              </p>
              <p className="text-sm text-navy-400">Within Tolerance</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <div>
              <p className="text-2xl font-bold text-amber-400">
                {riskAppetite.filter(a => a.status === 'approaching').length}
              </p>
              <p className="text-sm text-navy-400">Approaching Limit</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5 border-l-4 border-l-red-500">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <div>
              <p className="text-2xl font-bold text-red-400">
                {riskAppetite.filter(a => a.status === 'breached').length}
              </p>
              <p className="text-sm text-navy-400">Exceeded</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appetite Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {riskAppetite.map((appetite) => (
          <div
            key={appetite.category}
            className="glass-card-hover cursor-pointer"
            onClick={() => setSelectedAppetite(appetite)}
          >
            <div className="p-5 border-b border-navy-700/50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getCategoryColor(appetite.category) }}
                  />
                  <h3 className="text-lg font-semibold text-navy-100 capitalize">
                    {appetite.category} Risk
                  </h3>
                </div>
                <span className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium border',
                  getStatusBg(appetite.status)
                )}>
                  {appetite.status === 'within' ? 'Within Tolerance' :
                   appetite.status === 'approaching' ? 'Approaching Limit' : 'Exceeded'}
                </span>
              </div>
            </div>

            <div className="p-5">
              <p className="text-sm text-navy-400 mb-6 line-clamp-2">
                {appetite.statement}
              </p>

              {/* Tolerance Slider Visualization */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-navy-500">
                  <span>0%</span>
                  <span>Current: {appetite.currentLevel}%</span>
                  <span>100%</span>
                </div>
                <div className="relative h-4 bg-navy-800 rounded-full overflow-hidden">
                  {/* Tolerance zone */}
                  <div
                    className="absolute h-full bg-emerald-500/30"
                    style={{
                      left: `${appetite.toleranceMin}%`,
                      width: `${appetite.toleranceMax - appetite.toleranceMin}%`,
                    }}
                  />
                  {/* Tolerance boundaries */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-emerald-500"
                    style={{ left: `${appetite.toleranceMin}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                    style={{ left: `${appetite.toleranceMax}%` }}
                  />
                  {/* Current position */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg"
                    style={{
                      left: `calc(${appetite.currentLevel}% - 8px)`,
                      backgroundColor: getCategoryColor(appetite.category),
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400">Min: {appetite.toleranceMin}%</span>
                  <span className="text-red-400">Max: {appetite.toleranceMax}%</span>
                </div>
              </div>

              <div className="flex items-center justify-end mt-4 text-sm text-accent-primary">
                View Details <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedAppetite && (
        <div
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedAppetite(null)}
        >
          <div
            className="glass-card max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-navy-700/50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(selectedAppetite.status)}
                  <div>
                    <h2 className="text-xl font-bold text-navy-100 capitalize">
                      {selectedAppetite.category} Risk Appetite
                    </h2>
                    <p className={cn('text-sm capitalize', getStatusColor(selectedAppetite.status))}>
                      {selectedAppetite.status === 'within' ? 'Within Tolerance' :
                       selectedAppetite.status === 'approaching' ? 'Approaching Limit' : 'Tolerance Exceeded'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAppetite(null)}
                  className="p-2 rounded-lg text-navy-400 hover:text-navy-200 hover:bg-navy-800/50"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-navy-300 mb-2">Appetite Statement</h3>
                <p className="text-navy-400 leading-relaxed">{selectedAppetite.statement}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-navy-800/30">
                <div className="text-center">
                  <p className="text-2xl font-bold text-navy-100">{selectedAppetite.currentLevel}%</p>
                  <p className="text-xs text-navy-500">Current Level</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">{selectedAppetite.toleranceMin}%</p>
                  <p className="text-xs text-navy-500">Min Tolerance</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-400">{selectedAppetite.toleranceMax}%</p>
                  <p className="text-xs text-navy-500">Max Tolerance</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-navy-300 mb-3">Rationale & Considerations</h3>
                <ul className="space-y-2">
                  {selectedAppetite.rationale.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-navy-400">
                      <CheckCircle className="w-4 h-4 text-accent-primary mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-navy-700/50">
                <div>
                  <p className="text-xs text-navy-500 uppercase tracking-wider">Last Reviewed</p>
                  <p className="text-sm text-navy-200 mt-1">{selectedAppetite.lastReviewed}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-500 uppercase tracking-wider">Approved By</p>
                  <p className="text-sm text-navy-200 mt-1">{selectedAppetite.approvedBy}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-navy-700/50 flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setSelectedAppetite(null)}>
                Close
              </button>
              <button className="btn-primary">
                Edit Appetite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
