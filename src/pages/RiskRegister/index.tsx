import { useState } from 'react';
import { Plus, Download, Upload, LayoutGrid, List } from 'lucide-react';
import { PageHeader, RiskCard } from '../../components';
import { RiskTable } from '../../components/tables';
import { risks } from '../../data';
import { cn } from '../../utils';
import type { Risk } from '../../types';

export default function RiskRegister() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);

  // Calculate stats
  const stats = {
    total: risks.length,
    critical: risks.filter(r => r.severity === 'critical').length,
    high: risks.filter(r => r.severity === 'high').length,
    medium: risks.filter(r => r.severity === 'medium').length,
    low: risks.filter(r => r.severity === 'low').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Risk Register"
        subtitle="Centralized repository of all identified enterprise risks"
        actions={
          <div className="flex items-center gap-3">
            <button className="btn-ghost">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </button>
            <button className="btn-ghost">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Risk
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
            'p-2 rounded-lg transition-colors',
            viewMode === 'table'
              ? 'bg-accent-primary/20 text-accent-primary'
              : 'text-navy-400 hover:text-navy-200 hover:bg-navy-800/50'
          )}
        >
          <List className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode('grid')}
          className={cn(
            'p-2 rounded-lg transition-colors',
            viewMode === 'grid'
              ? 'bg-accent-primary/20 text-accent-primary'
              : 'text-navy-400 hover:text-navy-200 hover:bg-navy-800/50'
          )}
        >
          <LayoutGrid className="w-5 h-5" />
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

      {/* Risk Detail Modal - Placeholder */}
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
              <button className="btn-primary">
                Edit Risk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
