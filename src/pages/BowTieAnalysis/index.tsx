import { useState } from 'react';
import {
  AlertTriangle,
  Shield,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Target,
  ArrowRight,
  Save,
  Download,
} from 'lucide-react';
import { PageHeader, SectionCard } from '../../components';
import { cn } from '../../utils';
import type { BowTieModel, BowTieThreat, BowTieConsequence, BowTieControl } from '../../types';

// Sample bow-tie model for demonstration
const sampleBowTie: BowTieModel = {
  id: 'bt-001',
  riskId: 'risk-001',
  centralEvent: 'Data Breach Occurs',
  threats: [
    {
      id: 'threat-1',
      name: 'Phishing Attack',
      probability: 0.4,
      preventiveControls: [
        { id: 'pc-1', name: 'Email Filtering', effectiveness: 85, type: 'preventive', status: 'active' },
        { id: 'pc-2', name: 'Security Awareness Training', effectiveness: 70, type: 'preventive', status: 'active' },
      ],
    },
    {
      id: 'threat-2',
      name: 'Malware Infection',
      probability: 0.3,
      preventiveControls: [
        { id: 'pc-3', name: 'Antivirus Software', effectiveness: 90, type: 'preventive', status: 'active' },
        { id: 'pc-4', name: 'Endpoint Detection', effectiveness: 80, type: 'preventive', status: 'degraded' },
      ],
    },
    {
      id: 'threat-3',
      name: 'Insider Threat',
      probability: 0.2,
      preventiveControls: [
        { id: 'pc-5', name: 'Access Controls', effectiveness: 75, type: 'preventive', status: 'active' },
        { id: 'pc-6', name: 'Background Checks', effectiveness: 60, type: 'preventive', status: 'active' },
      ],
    },
  ],
  consequences: [
    {
      id: 'cons-1',
      name: 'Financial Loss',
      severity: 0.8,
      mitigatingControls: [
        { id: 'mc-1', name: 'Cyber Insurance', effectiveness: 70, type: 'detective', status: 'active' },
        { id: 'mc-2', name: 'Incident Response Plan', effectiveness: 85, type: 'detective', status: 'active' },
      ],
    },
    {
      id: 'cons-2',
      name: 'Reputational Damage',
      severity: 0.7,
      mitigatingControls: [
        { id: 'mc-3', name: 'PR Crisis Plan', effectiveness: 65, type: 'detective', status: 'active' },
        { id: 'mc-4', name: 'Customer Notification Process', effectiveness: 80, type: 'detective', status: 'active' },
      ],
    },
    {
      id: 'cons-3',
      name: 'Regulatory Penalties',
      severity: 0.6,
      mitigatingControls: [
        { id: 'mc-5', name: 'Compliance Monitoring', effectiveness: 75, type: 'detective', status: 'degraded' },
        { id: 'mc-6', name: 'Legal Response Team', effectiveness: 70, type: 'detective', status: 'active' },
      ],
    },
  ],
};

export default function BowTieAnalysis() {
  const [bowTie, setBowTie] = useState<BowTieModel>(sampleBowTie);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Handle export
  const handleExportBowTie = () => {
    const data = JSON.stringify(bowTie, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bow-tie-analysis-${bowTie.id}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle save
  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const getStatusIcon = (status: BowTieControl['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-3 h-3 text-emerald-400" />;
      case 'degraded':
        return <AlertCircle className="w-3 h-3 text-amber-400" />;
      case 'failed':
        return <XCircle className="w-3 h-3 text-red-400" />;
    }
  };

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 80) return 'text-emerald-400 bg-emerald-500/20';
    if (effectiveness >= 60) return 'text-amber-400 bg-amber-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const calculateThreatResidualProbability = (threat: BowTieThreat) => {
    const avgEffectiveness = threat.preventiveControls.reduce(
      (sum, c) => sum + (c.status !== 'failed' ? c.effectiveness : 0),
      0
    ) / threat.preventiveControls.length;
    return threat.probability * (1 - avgEffectiveness / 100);
  };

  const calculateConsequenceResidualSeverity = (consequence: BowTieConsequence) => {
    const avgEffectiveness = consequence.mitigatingControls.reduce(
      (sum, c) => sum + (c.status !== 'failed' ? c.effectiveness : 0),
      0
    ) / consequence.mitigatingControls.length;
    return consequence.severity * (1 - avgEffectiveness / 100);
  };

  const addThreat = () => {
    const newThreat: BowTieThreat = {
      id: `threat-${Date.now()}`,
      name: 'New Threat',
      probability: 0.3,
      preventiveControls: [],
    };
    setBowTie((prev) => ({ ...prev, threats: [...prev.threats, newThreat] }));
  };

  const addConsequence = () => {
    const newConsequence: BowTieConsequence = {
      id: `cons-${Date.now()}`,
      name: 'New Consequence',
      severity: 0.5,
      mitigatingControls: [],
    };
    setBowTie((prev) => ({ ...prev, consequences: [...prev.consequences, newConsequence] }));
  };

  const addPreventiveControl = (threatId: string) => {
    const newControl: BowTieControl = {
      id: `pc-${Date.now()}`,
      name: 'New Control',
      effectiveness: 70,
      type: 'preventive',
      status: 'active',
    };
    setBowTie((prev) => ({
      ...prev,
      threats: prev.threats.map((t) =>
        t.id === threatId ? { ...t, preventiveControls: [...t.preventiveControls, newControl] } : t
      ),
    }));
  };

  const addMitigatingControl = (consequenceId: string) => {
    const newControl: BowTieControl = {
      id: `mc-${Date.now()}`,
      name: 'New Control',
      effectiveness: 70,
      type: 'detective',
      status: 'active',
    };
    setBowTie((prev) => ({
      ...prev,
      consequences: prev.consequences.map((c) =>
        c.id === consequenceId ? { ...c, mitigatingControls: [...c.mitigatingControls, newControl] } : c
      ),
    }));
  };

  const overallRiskScore = bowTie.threats.reduce((sum, t) => {
    const residualProb = calculateThreatResidualProbability(t);
    const avgSeverity = bowTie.consequences.reduce((s, c) => s + calculateConsequenceResidualSeverity(c), 0) / bowTie.consequences.length;
    return sum + residualProb * avgSeverity;
  }, 0) / bowTie.threats.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Bow-Tie Analysis"
        subtitle="Visualize threat pathways, controls, and consequences"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditMode(!editMode)}
              className={cn('btn-secondary', editMode && 'bg-accent-primary/20 text-accent-primary')}
            >
              {editMode ? 'View Mode' : 'Edit Mode'}
            </button>
            <button className="btn-secondary" onClick={handleExportBowTie}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button className="btn-primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {isSaved ? 'Saved!' : 'Save'}
            </button>
          </div>
        }
      />

      {/* Overall Risk Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <p className="text-xs text-navy-500 mb-1">Central Event</p>
          <p className="text-lg font-semibold text-navy-100">{bowTie.centralEvent}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-navy-500 mb-1">Threats Identified</p>
          <p className="text-2xl font-bold text-navy-100">{bowTie.threats.length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-navy-500 mb-1">Consequences</p>
          <p className="text-2xl font-bold text-navy-100">{bowTie.consequences.length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-navy-500 mb-1">Residual Risk Score</p>
          <p className={cn(
            'text-2xl font-bold',
            overallRiskScore > 0.5 ? 'text-red-400' :
            overallRiskScore > 0.3 ? 'text-amber-400' : 'text-emerald-400'
          )}>
            {(overallRiskScore * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Bow-Tie Visualization */}
      <div className="glass-card p-6 overflow-x-auto">
        <div className="flex items-stretch justify-center gap-4 min-w-[1000px]">
          {/* Threats Column */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-navy-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Threats
              </h3>
              {editMode && (
                <button onClick={addThreat} className="p-1 text-navy-400 hover:text-accent-primary">
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
            {bowTie.threats.map((threat) => (
              <div
                key={threat.id}
                onClick={() => setSelectedElement(threat.id)}
                className={cn(
                  'p-4 rounded-xl border transition-all cursor-pointer',
                  selectedElement === threat.id
                    ? 'bg-red-500/10 border-red-500/50'
                    : 'bg-navy-800/30 border-navy-700/50 hover:border-navy-600'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-navy-200">{threat.name}</span>
                  <span className="px-2 py-0.5 rounded text-2xs bg-red-500/20 text-red-400">
                    P: {(threat.probability * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="space-y-1.5">
                  {threat.preventiveControls.map((control) => (
                    <div
                      key={control.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-navy-800/50"
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(control.status)}
                        <span className="text-xs text-navy-300">{control.name}</span>
                      </div>
                      <span className={cn('px-1.5 py-0.5 rounded text-2xs', getEffectivenessColor(control.effectiveness))}>
                        {control.effectiveness}%
                      </span>
                    </div>
                  ))}
                  {editMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addPreventiveControl(threat.id);
                      }}
                      className="w-full p-1.5 rounded-lg border border-dashed border-navy-700 text-2xs text-navy-500 hover:text-accent-primary hover:border-accent-primary/50"
                    >
                      + Add Control
                    </button>
                  )}
                </div>
                <div className="mt-2 pt-2 border-t border-navy-700/50">
                  <p className="text-2xs text-navy-500">
                    Residual: <span className="font-medium text-amber-400">{(calculateThreatResidualProbability(threat) * 100).toFixed(1)}%</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Preventive Controls Bar */}
          <div className="flex flex-col items-center justify-center px-2">
            <div className="w-2 h-8 bg-emerald-500/30 rounded-full" />
            <div className="flex items-center my-2">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-2xs text-navy-500 text-center writing-vertical">Preventive</p>
            <div className="flex-1 w-0.5 bg-navy-700" />
          </div>

          {/* Arrow to Central Event */}
          <div className="flex items-center">
            <ArrowRight className="w-6 h-6 text-navy-600" />
          </div>

          {/* Central Event */}
          <div className="flex items-center">
            <div className="w-40 p-6 rounded-2xl bg-gradient-to-br from-red-500/20 to-amber-500/20 border-2 border-red-500/50 text-center">
              <Target className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-navy-100">{bowTie.centralEvent}</p>
              <p className="text-2xs text-navy-400 mt-1">Risk Event</p>
            </div>
          </div>

          {/* Arrow from Central Event */}
          <div className="flex items-center">
            <ArrowRight className="w-6 h-6 text-navy-600" />
          </div>

          {/* Mitigating Controls Bar */}
          <div className="flex flex-col items-center justify-center px-2">
            <div className="w-2 h-8 bg-blue-500/30 rounded-full" />
            <div className="flex items-center my-2">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xs text-navy-500 text-center writing-vertical">Mitigating</p>
            <div className="flex-1 w-0.5 bg-navy-700" />
          </div>

          {/* Consequences Column */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-navy-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Consequences
              </h3>
              {editMode && (
                <button onClick={addConsequence} className="p-1 text-navy-400 hover:text-accent-primary">
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
            {bowTie.consequences.map((consequence) => (
              <div
                key={consequence.id}
                onClick={() => setSelectedElement(consequence.id)}
                className={cn(
                  'p-4 rounded-xl border transition-all cursor-pointer',
                  selectedElement === consequence.id
                    ? 'bg-amber-500/10 border-amber-500/50'
                    : 'bg-navy-800/30 border-navy-700/50 hover:border-navy-600'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-navy-200">{consequence.name}</span>
                  <span className="px-2 py-0.5 rounded text-2xs bg-amber-500/20 text-amber-400">
                    S: {(consequence.severity * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="space-y-1.5">
                  {consequence.mitigatingControls.map((control) => (
                    <div
                      key={control.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-navy-800/50"
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(control.status)}
                        <span className="text-xs text-navy-300">{control.name}</span>
                      </div>
                      <span className={cn('px-1.5 py-0.5 rounded text-2xs', getEffectivenessColor(control.effectiveness))}>
                        {control.effectiveness}%
                      </span>
                    </div>
                  ))}
                  {editMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addMitigatingControl(consequence.id);
                      }}
                      className="w-full p-1.5 rounded-lg border border-dashed border-navy-700 text-2xs text-navy-500 hover:text-accent-primary hover:border-accent-primary/50"
                    >
                      + Add Control
                    </button>
                  )}
                </div>
                <div className="mt-2 pt-2 border-t border-navy-700/50">
                  <p className="text-2xs text-navy-500">
                    Residual: <span className="font-medium text-amber-400">{(calculateConsequenceResidualSeverity(consequence) * 100).toFixed(1)}%</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Control Effectiveness Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Preventive Controls" subtitle="Barriers before the event">
          <div className="space-y-3">
            {bowTie.threats.flatMap((t) => t.preventiveControls).map((control) => (
              <div key={control.id} className="flex items-center justify-between p-3 rounded-lg bg-navy-800/30">
                <div className="flex items-center gap-3">
                  {getStatusIcon(control.status)}
                  <span className="text-sm text-navy-200">{control.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 rounded-full bg-navy-700 overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        control.effectiveness >= 80 ? 'bg-emerald-500' :
                        control.effectiveness >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      )}
                      style={{ width: `${control.effectiveness}%` }}
                    />
                  </div>
                  <span className="text-xs text-navy-400 w-10">{control.effectiveness}%</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Mitigating Controls" subtitle="Recovery after the event">
          <div className="space-y-3">
            {bowTie.consequences.flatMap((c) => c.mitigatingControls).map((control) => (
              <div key={control.id} className="flex items-center justify-between p-3 rounded-lg bg-navy-800/30">
                <div className="flex items-center gap-3">
                  {getStatusIcon(control.status)}
                  <span className="text-sm text-navy-200">{control.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 rounded-full bg-navy-700 overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        control.effectiveness >= 80 ? 'bg-emerald-500' :
                        control.effectiveness >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      )}
                      style={{ width: `${control.effectiveness}%` }}
                    />
                  </div>
                  <span className="text-xs text-navy-400 w-10">{control.effectiveness}%</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Legend */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-navy-400">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Active Control</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Degraded Control</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-400" />
            <span>Failed Control</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 rounded bg-emerald-500" />
            <span>High Effectiveness (≥80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 rounded bg-amber-500" />
            <span>Medium (60-79%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 rounded bg-red-500" />
            <span>Low (&lt;60%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
