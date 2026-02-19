// Enterprise Risk Register — Operational risk listing with table/grid views

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, RiskCard } from '../../components';
import { RiskTable } from '../../components/tables';
import { risks } from '../../data';
import { cn } from '../../utils';
import type { Risk } from '../../types';

export default function EnterpriseRegister() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRisk, setEditingRisk] = useState(false);

  // Handle import - navigate to workspace
  const handleImport = () => {
    navigate('/dashboard/risk-workspace');
  };

  // Handle export
  const handleExport = () => {
    const headers = ['ID', 'Title', 'Category', 'Severity', 'Score', 'Probability', 'Impact', 'Status', 'Owner', 'Department'];
    const rows = risks.map(r => [r.id, `"${r.title}"`, r.category, r.severity, r.riskScore, r.probability, r.impact, r.status, r.owner, r.department]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `risk-register-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate stats
  const stats = {
    total: risks.length,
    critical: risks.filter(r => r.severity === 'critical').length,
    high: risks.filter(r => r.severity === 'high').length,
    medium: risks.filter(r => r.severity === 'medium').length,
    low: risks.filter(r => r.severity === 'low').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enterprise Risk Register"
        subtitle="Centralized repository of all identified enterprise risks"
        actions={
          <div className="flex items-center gap-3">
            <button className="btn-ghost" onClick={handleImport}>
              Import
            </button>
            <button className="btn-ghost" onClick={handleExport}>
              Export
            </button>
            <button className="btn-primary" onClick={() => setShowAddModal(true)}>
              + Add Risk
            </button>
          </div>
        }
      />

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-card p-4 border-l-4 border-l-accent-primary">
          <p className="text-2xl font-bold text-navy-100">{stats.total}</p>
          <p className="text-sm text-navy-400">Total Risks</p>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-risk-critical">
          <p className="text-2xl font-bold text-red-400">{stats.critical}</p>
          <p className="text-sm text-navy-400">Critical</p>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-risk-high">
          <p className="text-2xl font-bold text-red-300">{stats.high}</p>
          <p className="text-sm text-navy-400">High</p>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-risk-medium">
          <p className="text-2xl font-bold text-amber-400">{stats.medium}</p>
          <p className="text-sm text-navy-400">Medium</p>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-risk-low">
          <p className="text-2xl font-bold text-emerald-400">{stats.low}</p>
          <p className="text-sm text-navy-400">Low</p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-end gap-2">
        <span className="text-sm text-navy-400 mr-2">View:</span>
        <button
          onClick={() => setViewMode('table')}
          className={cn(
            'px-3 py-2 rounded-lg transition-colors text-sm font-medium',
            viewMode === 'table'
              ? 'bg-accent-primary/20 text-accent-primary'
              : 'text-navy-400 hover:text-navy-200 hover:bg-navy-800/50'
          )}
        >
          Table
        </button>
        <button
          onClick={() => setViewMode('grid')}
          className={cn(
            'px-3 py-2 rounded-lg transition-colors text-sm font-medium',
            viewMode === 'grid'
              ? 'bg-accent-primary/20 text-accent-primary'
              : 'text-navy-400 hover:text-navy-200 hover:bg-navy-800/50'
          )}
        >
          Grid
        </button>
      </div>

      {/* Risk List */}
      {viewMode === 'table' ? (
        <RiskTable
          risks={risks}
          onRowClick={(risk) => setSelectedRisk(risk)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {risks.map((risk) => (
            <RiskCard
              key={risk.id}
              risk={risk}
              className="cursor-pointer"
            />
          ))}
        </div>
      )}

      {/* Risk Detail Modal */}
      {selectedRisk && (
        <div
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedRisk(null)}
        >
          <div
            className="glass-card max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-navy-700/50">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-sm font-mono text-navy-500">{selectedRisk.id}</span>
                  <h2 className="text-xl font-bold text-navy-100 mt-1">{selectedRisk.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedRisk(null)}
                  className="p-2 rounded-lg text-navy-400 hover:text-navy-200 hover:bg-navy-800/50"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-navy-300 mb-2">Description</h3>
                <p className="text-navy-400">{selectedRisk.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-navy-300 mb-2">Risk Score</h3>
                  <p className="text-3xl font-bold text-navy-100">{selectedRisk.riskScore}</p>
                  <p className="text-sm text-navy-500">
                    Probability ({selectedRisk.probability}) × Impact ({selectedRisk.impact})
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-navy-300 mb-2">Owner</h3>
                  <p className="text-navy-100">{selectedRisk.owner}</p>
                  <p className="text-sm text-navy-500">{selectedRisk.department}</p>
                </div>
              </div>

              {selectedRisk.mitigationPlan && (
                <div>
                  <h3 className="text-sm font-semibold text-navy-300 mb-2">Mitigation Plan</h3>
                  <p className="text-navy-400">{selectedRisk.mitigationPlan}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-navy-300 mb-2">Controls</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRisk.controls.map((control, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-navy-700/50 text-navy-300 text-sm"
                    >
                      {control}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-navy-700/50 flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setSelectedRisk(null)}>
                Close
              </button>
              <button className="btn-primary" onClick={() => setEditingRisk(true)}>
                Edit Risk
              </button>
            </div>

            {/* Edit mode */}
            {editingRisk && (
              <div className="p-6 border-t border-navy-700/50 bg-navy-800/30">
                <h3 className="text-sm font-semibold text-navy-200 mb-4">Edit Risk Details</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-navy-400 mb-1">Title</label>
                    <input type="text" defaultValue={selectedRisk.title} className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50" />
                  </div>
                  <div>
                    <label className="block text-xs text-navy-400 mb-1">Owner</label>
                    <input type="text" defaultValue={selectedRisk.owner} className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50" />
                  </div>
                  <div>
                    <label className="block text-xs text-navy-400 mb-1">Probability (1-5)</label>
                    <input type="number" min={1} max={5} defaultValue={selectedRisk.probability} className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50" />
                  </div>
                  <div>
                    <label className="block text-xs text-navy-400 mb-1">Impact (1-5)</label>
                    <input type="number" min={1} max={5} defaultValue={selectedRisk.impact} className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50" />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button className="btn-secondary" onClick={() => setEditingRisk(false)}>Cancel</button>
                  <button className="btn-primary" onClick={() => { setEditingRisk(false); setSelectedRisk(null); }}>Save Changes</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Risk Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="glass-card max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-navy-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-navy-100">Add New Risk</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg text-navy-400 hover:text-navy-200 hover:bg-navy-800/50">×</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-300 mb-1">Risk Title</label>
                <input type="text" placeholder="Enter risk title..." className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 placeholder-navy-500 focus:outline-none focus:border-accent-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-300 mb-1">Description</label>
                <textarea rows={3} placeholder="Describe the risk..." className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 placeholder-navy-500 focus:outline-none focus:border-accent-primary/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy-300 mb-1">Category</label>
                  <select className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50">
                    <option>Cyber</option><option>Financial</option><option>Operational</option><option>Compliance</option><option>Strategic</option><option>Reputational</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-300 mb-1">Owner</label>
                  <input type="text" placeholder="Risk owner..." className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 placeholder-navy-500 focus:outline-none focus:border-accent-primary/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-300 mb-1">Probability (1-5)</label>
                  <input type="number" min={1} max={5} defaultValue={3} className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-300 mb-1">Impact (1-5)</label>
                  <input type="number" min={1} max={5} defaultValue={3} className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-navy-700/50 flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => setShowAddModal(false)}>Create Risk</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
