// Strategic Risk Implementation - Execution Intelligence Layer
// Split screen: Left = Execution Blueprint | Right = Financial & Stress Analytics

import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, PieChart, Pie, Cell,
} from 'recharts';
import { PageHeader } from '../../components';
import { strategicRisks, companyThresholdConfig } from '../../data';
import { implementationBlueprints } from '../../data/implementationBlueprints';
import {
  formatCurrency,
  getColourClass,
} from '../../services/strategicRiskEngine';
import {
  buildStrategicImplementation,
  calculateREPI,
  getREPIColour,
  getREPILabel,
  runStressScenarios,
  getGovernanceLevelLabel,
  getGovernanceLevelColour,
} from '../../services/implementationEngine';
import { cn } from '../../utils';
import type { StrategicImplementation as StrategicImpl } from '../../types';

// Top ribbon metric card
function RibbonMetric({ label, value, colour }: { label: string; value: string; colour?: string }) {
  return (
    <div className="flex flex-col items-center px-4 py-2">
      <span className={cn('text-lg font-bold', colour || 'text-navy-100')}>{value}</span>
      <span className="text-2xs text-navy-500 uppercase tracking-wide">{label}</span>
    </div>
  );
}

// Category badge
function CategoryBadge({ category }: { category: string }) {
  const colours: Record<string, string> = {
    preventative: 'bg-blue-500/20 text-blue-400',
    detective: 'bg-amber-500/20 text-amber-400',
    corrective: 'bg-red-500/20 text-red-400',
    adaptive: 'bg-emerald-500/20 text-emerald-400',
  };
  return (
    <span className={cn('px-2 py-0.5 rounded text-xs font-medium', colours[category] || 'bg-navy-700 text-navy-300')}>
      {category}
    </span>
  );
}

// Traffic light indicator
function TrafficLight({ status }: { status: 'green' | 'amber' | 'red' }) {
  const colours = {
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  };
  return <span className={cn('w-3 h-3 rounded-full inline-block', colours[status])} />;
}

export default function StrategicImplementation() {
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'blueprint' | 'stress' | 'governance' | 'contagion' | 'performance' | 'intelligence'>('blueprint');

  // Filter to red/black/amber risks for implementation
  const implementableRisks = useMemo(() => {
    return strategicRisks
      .filter((r) => r.colour === 'red' || r.colour === 'black' || r.colour === 'amber')
      .sort((a, b) => b.overallRiskScore - a.overallRiskScore);
  }, []);

  // Build all implementations
  const implementations = useMemo(() => {
    const map = new Map<string, StrategicImpl>();
    for (const risk of strategicRisks) {
      const blueprint = implementationBlueprints.find((b) => b.riskId === risk.id);
      if (blueprint) {
        map.set(
          risk.id,
          buildStrategicImplementation(risk, blueprint, strategicRisks, companyThresholdConfig)
        );
      }
    }
    return map;
  }, []);

  // REPI profiles for all risks
  const repiProfiles = useMemo(() => {
    return strategicRisks.map((r) => ({
      risk: r,
      profile: calculateREPI(r, companyThresholdConfig),
    }));
  }, []);

  const selectedRisk = strategicRisks.find((r) => r.id === selectedRiskId) || null;
  const selectedImpl = selectedRiskId ? implementations.get(selectedRiskId) : null;
  const selectedStress = selectedRisk
    ? runStressScenarios(selectedRisk, strategicRisks, companyThresholdConfig)
    : [];

  // Portfolio totals
  const portfolioTotals = useMemo(() => {
    let totalBudget = 0;
    let totalCapitalDeployed = 0;
    let totalEMVReduced = 0;
    implementations.forEach((impl) => {
      totalBudget += impl.blueprint.totalBudget;
      totalCapitalDeployed += impl.performance.capitalDeployed;
      totalEMVReduced += impl.financials.netRiskReductionValue;
    });
    return { totalBudget, totalCapitalDeployed, totalEMVReduced };
  }, [implementations]);

  return (
    <div className="space-y-4 animate-fade-in">
      <PageHeader
        title="Strategic Risk Implementation"
        subtitle="Execution Intelligence Layer — Capital Allocation & Strategic Response"
      />

      {/* Top Ribbon */}
      <div className="glass-card p-3 flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center divide-x divide-navy-700">
          <RibbonMetric label="Total Budget" value={`£${formatCurrency(portfolioTotals.totalBudget)}`} colour="text-accent-primary" />
          <RibbonMetric label="Capital Deployed" value={`£${formatCurrency(portfolioTotals.totalCapitalDeployed)}`} colour="text-amber-400" />
          <RibbonMetric label="EMV Reduced" value={`£${formatCurrency(portfolioTotals.totalEMVReduced)}`} colour="text-emerald-400" />
          <RibbonMetric
            label="Risks in Implementation"
            value={`${implementableRisks.length}`}
            colour="text-red-400"
          />
        </div>
        {selectedRisk && selectedImpl && (
          <div className="flex items-center gap-3">
            <span className={cn('px-3 py-1 rounded text-xs font-bold border', getREPIColour(selectedImpl.executionProfile.repiClassification))}>
              {getREPILabel(selectedImpl.executionProfile.repiClassification)}
            </span>
            <span className={cn('px-3 py-1 rounded text-xs font-bold border', getColourClass(selectedRisk.colour))}>
              {selectedRisk.colour.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Risk Selection List */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-navy-300 mb-3">Risk Execution Priority Index (REPI)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {repiProfiles
            .sort((a, b) => b.profile.repiScore - a.profile.repiScore)
            .map(({ risk, profile }) => (
              <button
                key={risk.id}
                onClick={() => setSelectedRiskId(risk.id)}
                className={cn(
                  'p-3 rounded-lg text-left transition-all border',
                  selectedRiskId === risk.id
                    ? 'border-accent-primary bg-accent-primary/10'
                    : 'border-navy-700/50 bg-navy-800/30 hover:border-navy-600'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-navy-500">{risk.id}</span>
                  <span className={cn('px-2 py-0.5 rounded text-2xs font-bold border', getREPIColour(profile.repiClassification))}>
                    REPI: {profile.repiScore.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-navy-100 font-medium truncate">{risk.title}</p>
                <div className="flex items-center gap-2 mt-2 text-2xs text-navy-500">
                  <span className={cn('px-1.5 py-0.5 rounded border', getColourClass(risk.colour))}>
                    {risk.colour.toUpperCase()}
                  </span>
                  <span>EMV: £{formatCurrency(risk.expectedMonetaryValue)}</span>
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* Main Split Screen */}
      {selectedRisk && selectedImpl && (
        <>
          {/* Section Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            {([
              { key: 'blueprint', label: 'Execution Blueprint' },
              { key: 'stress', label: 'Stress Testing' },
              { key: 'governance', label: 'Governance' },
              { key: 'contagion', label: 'Contagion' },
              { key: 'performance', label: 'Performance' },
              { key: 'intelligence', label: 'Strategic Intelligence' },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveSection(tab.key)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                  activeSection === tab.key
                    ? 'bg-accent-primary/20 text-accent-primary'
                    : 'text-navy-400 hover:text-navy-200 hover:bg-navy-800/50'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* LEFT PANEL */}
            <div className="space-y-4">
              {activeSection === 'blueprint' && (
                <>
                  {/* Risk Identity Summary */}
                  <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide">
                        Section 1: Risk Execution Profile
                      </h3>
                      <span className={cn('px-2 py-1 rounded text-xs font-bold border', getREPIColour(selectedImpl.executionProfile.repiClassification))}>
                        {getREPILabel(selectedImpl.executionProfile.repiClassification)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-navy-500">REPI Score</p>
                        <p className="text-xl font-bold text-navy-100">{selectedImpl.executionProfile.repiScore.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-navy-500">Execution Urgency</p>
                        <p className="text-xl font-bold text-navy-100 capitalize">
                          {selectedImpl.executionProfile.executionUrgency.replace('_', ' ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-navy-500">Risk Velocity</p>
                        <p className="text-navy-200 capitalize">{selectedRisk.riskVelocity} ({selectedImpl.executionProfile.velocityScore}/5)</p>
                      </div>
                      <div>
                        <p className="text-xs text-navy-500">Financial Exposure</p>
                        <p className="text-navy-200">{(selectedImpl.executionProfile.financialExposureMultiplier * 100).toFixed(1)}% EBITDA</p>
                      </div>
                    </div>
                  </div>

                  {/* Strategic Objective */}
                  <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-3">
                      Section 2: Implementation Blueprint
                    </h3>
                    <div className="p-3 bg-navy-800/30 rounded-lg mb-4">
                      <p className="text-xs text-navy-500 mb-1">Strategic Objective</p>
                      <p className="text-sm text-navy-200 leading-relaxed">
                        {selectedImpl.blueprint.strategicObjective}
                      </p>
                    </div>

                    {/* Actions by category */}
                    <div className="space-y-3">
                      {selectedImpl.blueprint.actions.map((action) => (
                        <div key={action.id} className="p-3 bg-navy-800/30 rounded-lg border border-navy-700/50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <CategoryBadge category={action.category} />
                              <span className="text-sm font-medium text-navy-100">{action.title}</span>
                            </div>
                            <span className={cn(
                              'text-2xs px-2 py-0.5 rounded',
                              action.status === 'completed' && 'bg-emerald-500/20 text-emerald-400',
                              action.status === 'in_progress' && 'bg-blue-500/20 text-blue-400',
                              action.status === 'planned' && 'bg-navy-600 text-navy-300',
                              action.status === 'blocked' && 'bg-red-500/20 text-red-400',
                            )}>
                              {action.status}
                            </span>
                          </div>
                          <p className="text-xs text-navy-400 mb-3">{action.description}</p>
                          <div className="grid grid-cols-3 gap-2 text-2xs">
                            <div>
                              <p className="text-navy-500">Owner</p>
                              <p className="text-navy-300">{action.owner}</p>
                            </div>
                            <div>
                              <p className="text-navy-500">Budget</p>
                              <p className="text-navy-300">£{formatCurrency(action.budgetAllocation)}</p>
                            </div>
                            <div>
                              <p className="text-navy-500">Timeline</p>
                              <p className="text-navy-300">{action.timeline}</p>
                            </div>
                            <div>
                              <p className="text-navy-500">KPI</p>
                              <p className="text-navy-300">{action.successKPI}</p>
                            </div>
                            <div>
                              <p className="text-navy-500">Residual Target</p>
                              <p className="text-navy-300">{action.residualRiskTarget.toFixed(1)}</p>
                            </div>
                            <div>
                              <p className="text-navy-500">Reg. Alignment</p>
                              <p className="text-navy-300">{action.regulatoryAlignmentScore}/10</p>
                            </div>
                          </div>
                          {/* Progress bar */}
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-2xs mb-1">
                              <span className="text-navy-500">Completion</span>
                              <span className="text-navy-300">{action.milestoneCompletion}%</span>
                            </div>
                            <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent-primary rounded-full transition-all"
                                style={{ width: `${action.milestoneCompletion}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Budget auto-total */}
                    <div className="mt-4 p-3 bg-accent-primary/10 border border-accent-primary/20 rounded-lg">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs text-navy-400">Total Budget</p>
                          <p className="text-lg font-bold text-accent-primary">£{formatCurrency(selectedImpl.blueprint.totalBudget)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-navy-400">Capital Required</p>
                          <p className="text-lg font-bold text-amber-400">£{formatCurrency(selectedImpl.blueprint.totalCapitalRequired)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-navy-400">Residual Target</p>
                          <p className="text-lg font-bold text-navy-100">{selectedImpl.blueprint.overallResidualTarget.toFixed(1)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeSection === 'stress' && (
                <div className="glass-card p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide">
                    Section 4: Scenario Stress Testing
                  </h3>
                  {selectedStress.map((scenario) => (
                    <div key={scenario.scenarioId} className="p-4 bg-navy-800/30 rounded-lg border border-navy-700/50">
                      <h4 className="text-sm font-medium text-navy-100 mb-1">{scenario.name}</h4>
                      <p className="text-xs text-navy-400 mb-3">{scenario.description}</p>
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div>
                          <p className="text-navy-500">Revised Probability</p>
                          <p className="text-navy-200 font-mono">{scenario.revisedProbability.toFixed(1)}/5</p>
                        </div>
                        <div>
                          <p className="text-navy-500">Revised Impact</p>
                          <p className="text-navy-200 font-mono">{scenario.revisedImpact.toFixed(1)}/5</p>
                        </div>
                        <div>
                          <p className="text-navy-500">EBITDA Shock</p>
                          <p className={cn('font-mono', scenario.ebitdaShockPercent > 10 ? 'text-red-400' : 'text-navy-200')}>
                            {scenario.ebitdaShockPercent.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-navy-500">Liquidity Impact</p>
                          <p className="text-red-400 font-mono">£{formatCurrency(scenario.liquidityImpact)}</p>
                        </div>
                        <div>
                          <p className="text-navy-500">Cash Runway</p>
                          <p className="text-amber-400 font-mono">-{scenario.cashRunwayReductionMonths} months</p>
                        </div>
                        <div>
                          <p className="text-navy-500">Capital Buffer</p>
                          <p className="text-navy-200 font-mono">£{formatCurrency(scenario.capitalBufferRequired)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeSection === 'governance' && (
                <div className="glass-card p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide">
                    Section 5: Governance & Escalation
                  </h3>
                  <div className="p-4 bg-navy-800/30 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-navy-300">Required Governance Level</span>
                      <span className={cn('px-3 py-1 rounded text-xs font-bold border', getGovernanceLevelColour(selectedImpl.governance.requiredLevel))}>
                        {getGovernanceLevelLabel(selectedImpl.governance.requiredLevel)}
                      </span>
                    </div>
                    {selectedImpl.governance.isWorsening && selectedImpl.governance.escalationCountdown && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg mb-3">
                        <p className="text-sm text-red-400 font-medium">
                          Risk Worsening — Auto-escalation in {selectedImpl.governance.escalationCountdown} days
                        </p>
                      </div>
                    )}
                    <div className="space-y-2">
                      {Object.entries(selectedImpl.governance.triggers).map(([key, triggered]) => (
                        <div key={key} className="flex items-center justify-between text-sm">
                          <span className="text-navy-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className={triggered ? 'text-red-400' : 'text-emerald-400'}>
                            {triggered ? 'TRIGGERED' : 'Clear'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Governance escalation ladder */}
                  <div className="space-y-2">
                    {(['crisis_committee', 'board', 'executive_committee', 'operational_committee'] as const).map((level) => {
                      const isActive = selectedImpl.governance.requiredLevel === level;
                      const isAbove = ['crisis_committee', 'board', 'executive_committee', 'operational_committee']
                        .indexOf(selectedImpl.governance.requiredLevel) <= ['crisis_committee', 'board', 'executive_committee', 'operational_committee'].indexOf(level);
                      return (
                        <div
                          key={level}
                          className={cn(
                            'p-3 rounded-lg border text-sm font-medium transition-all',
                            isActive
                              ? cn(getGovernanceLevelColour(level), 'ring-1 ring-offset-1 ring-offset-navy-900')
                              : isAbove
                                ? 'border-navy-700/50 text-navy-400 bg-navy-800/20'
                                : 'border-navy-800 text-navy-600 bg-navy-900/50'
                          )}
                        >
                          {getGovernanceLevelLabel(level)}
                          {isActive && <span className="ml-2 text-xs">← CURRENT LEVEL</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeSection === 'contagion' && (
                <div className="glass-card p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide">
                    Section 6: Interdependency & Contagion
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-navy-800/30 rounded-lg text-center">
                      <p className="text-xs text-navy-500">Contagion Factor (CAF)</p>
                      <p className={cn(
                        'text-3xl font-bold',
                        selectedImpl.contagion.exceedsThreshold ? 'text-red-400' : 'text-navy-100'
                      )}>
                        {selectedImpl.contagion.contagionAmplificationFactor.toFixed(2)}x
                      </p>
                      <p className="text-2xs text-navy-500">Threshold: 2.50x</p>
                    </div>
                    <div className="p-4 bg-navy-800/30 rounded-lg text-center">
                      <p className="text-xs text-navy-500">Portfolio Adjustment</p>
                      <p className={cn(
                        'text-3xl font-bold',
                        selectedImpl.contagion.portfolioExposureAdjustment > 0 ? 'text-amber-400' : 'text-emerald-400'
                      )}>
                        +{selectedImpl.contagion.portfolioExposureAdjustment.toFixed(1)}%
                      </p>
                      <p className="text-2xs text-navy-500">Exposure increase</p>
                    </div>
                  </div>

                  {/* Network graph visualization (text-based) */}
                  <div className="p-4 bg-navy-800/30 rounded-lg">
                    <p className="text-xs text-navy-500 mb-3">Contagion Network</p>
                    {selectedImpl.contagion.connectedRisks.length > 0 ? (
                      <div className="space-y-2">
                        {selectedImpl.contagion.connectedRisks.map((cr, i) => {
                          const linkedRisk = strategicRisks.find((r) => r.id === cr.riskId);
                          return (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-16 text-center">
                                <span className={cn(
                                  'px-2 py-0.5 rounded text-2xs font-bold border',
                                  getColourClass(selectedRisk.colour)
                                )}>
                                  {selectedRisk.id}
                                </span>
                              </div>
                              <div className="flex-1 flex items-center">
                                <div className={cn(
                                  'h-0.5 flex-1',
                                  cr.strength > 10 ? 'bg-red-500' : cr.strength > 5 ? 'bg-amber-500' : 'bg-navy-600'
                                )} />
                                <span className="text-2xs text-navy-500 mx-1">{cr.strength.toFixed(1)}</span>
                                <div className={cn(
                                  'h-0.5 flex-1',
                                  cr.strength > 10 ? 'bg-red-500' : cr.strength > 5 ? 'bg-amber-500' : 'bg-navy-600'
                                )} />
                              </div>
                              <div className="w-16 text-center">
                                <span className={cn(
                                  'px-2 py-0.5 rounded text-2xs font-bold border',
                                  linkedRisk ? getColourClass(linkedRisk.colour) : 'bg-navy-700 text-navy-400'
                                )}>
                                  {cr.riskId}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-navy-400">No interdependencies identified</p>
                    )}
                  </div>
                </div>
              )}

              {activeSection === 'performance' && (
                <div className="glass-card p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide">
                    Section 7: Implementation Performance
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-navy-800/30 rounded-lg">
                      <p className="text-xs text-navy-500">Budget Utilisation</p>
                      <p className="text-xl font-bold text-navy-100">{selectedImpl.performance.budgetUtilisation.toFixed(1)}%</p>
                      <p className="text-2xs text-navy-500">
                        £{formatCurrency(selectedImpl.performance.budgetSpent)} / £{formatCurrency(selectedImpl.performance.budgetAllocated)}
                      </p>
                    </div>
                    <div className="p-3 bg-navy-800/30 rounded-lg">
                      <p className="text-xs text-navy-500">Milestone Completion</p>
                      <p className="text-xl font-bold text-navy-100">{selectedImpl.performance.milestoneCompletion.toFixed(0)}%</p>
                      <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-accent-primary rounded-full"
                          style={{ width: `${selectedImpl.performance.milestoneCompletion}%` }}
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-navy-800/30 rounded-lg">
                      <p className="text-xs text-navy-500">KPI Achievement</p>
                      <p className="text-xl font-bold text-navy-100">{selectedImpl.performance.kpiAchievementScore}%</p>
                    </div>
                    <div className="p-3 bg-navy-800/30 rounded-lg">
                      <p className="text-xs text-navy-500">Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        <TrafficLight status={selectedImpl.performance.trafficLight} />
                        <span className="text-sm text-navy-200 capitalize">{selectedImpl.performance.trafficLight}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-navy-800/30 rounded-lg">
                      <p className="text-xs text-navy-500">Capital Deployed</p>
                      <p className="text-amber-400 font-bold">£{formatCurrency(selectedImpl.performance.capitalDeployed)}</p>
                    </div>
                    <div className="p-3 bg-navy-800/30 rounded-lg">
                      <p className="text-xs text-navy-500">EMV Reduced</p>
                      <p className="text-emerald-400 font-bold">£{formatCurrency(selectedImpl.performance.emvReduced)}</p>
                    </div>
                    <div className="p-3 bg-navy-800/30 rounded-lg">
                      <p className="text-xs text-navy-500">Schedule Deviation</p>
                      <p className={cn('font-bold', Math.abs(selectedImpl.performance.scheduleDeviation) > 10 ? 'text-red-400' : 'text-navy-200')}>
                        {selectedImpl.performance.scheduleDeviation > 0 ? '+' : ''}{selectedImpl.performance.scheduleDeviation.toFixed(1)}%
                      </p>
                    </div>
                    <div className="p-3 bg-navy-800/30 rounded-lg">
                      <p className="text-xs text-navy-500">Cost Overrun</p>
                      <p className={cn('font-bold', selectedImpl.performance.costOverrun > 10 ? 'text-red-400' : 'text-navy-200')}>
                        {selectedImpl.performance.costOverrun > 0 ? '+' : ''}{selectedImpl.performance.costOverrun.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'intelligence' && (
                <div className="glass-card p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide">
                    Section 8: Strategic Impact Intelligence
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-navy-800/30 rounded-lg text-center">
                      <p className="text-xs text-navy-500 mb-1">Realignment Score</p>
                      <p className="text-2xl font-bold text-navy-100">{selectedImpl.strategicIntelligence.strategicRealignmentScore}/10</p>
                      <p className="text-2xs text-navy-500">New capability creation</p>
                    </div>
                    <div className="p-4 bg-navy-800/30 rounded-lg text-center">
                      <p className="text-xs text-navy-500 mb-1">Innovation Index</p>
                      <p className="text-2xl font-bold text-navy-100">{selectedImpl.strategicIntelligence.innovationOpportunityIndicator}/10</p>
                      <p className="text-2xs text-navy-500">Revenue opportunity</p>
                    </div>
                    <div className="p-4 bg-navy-800/30 rounded-lg text-center">
                      <p className="text-xs text-navy-500 mb-1">Competitive Delta</p>
                      <p className={cn(
                        'text-2xl font-bold',
                        selectedImpl.strategicIntelligence.competitiveAdvantageDelta.delta > 0 ? 'text-emerald-400' : 'text-navy-100'
                      )}>
                        +{selectedImpl.strategicIntelligence.competitiveAdvantageDelta.delta}
                      </p>
                      <p className="text-2xs text-navy-500">
                        {selectedImpl.strategicIntelligence.competitiveAdvantageDelta.preMitigation} → {selectedImpl.strategicIntelligence.competitiveAdvantageDelta.postMitigation}
                      </p>
                    </div>
                  </div>
                  <div className={cn(
                    'p-4 rounded-lg border',
                    selectedImpl.strategicIntelligence.isStrategicAsset
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-navy-800/30 border-navy-700/50'
                  )}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        'px-2 py-0.5 rounded text-xs font-bold',
                        selectedImpl.strategicIntelligence.isStrategicAsset
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-navy-700 text-navy-300'
                      )}>
                        {selectedImpl.strategicIntelligence.isStrategicAsset ? 'STRATEGIC ASSET' : 'DEFENSIVE'}
                      </span>
                    </div>
                    <p className="text-sm text-navy-300">{selectedImpl.strategicIntelligence.strategicInsight}</p>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT PANEL - Financial & Stress Analytics */}
            <div className="space-y-4">
              {/* Financial Implementation Analytics (always visible) */}
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-4">
                  Section 3: Financial Analytics
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-navy-800/30 rounded-lg text-center">
                    <p className="text-xs text-navy-500">Total Investment</p>
                    <p className="text-xl font-bold text-red-400">£{formatCurrency(selectedImpl.financials.totalMitigationInvestment)}</p>
                  </div>
                  <div className="p-3 bg-navy-800/30 rounded-lg text-center">
                    <p className="text-xs text-navy-500">Revised EMV</p>
                    <p className="text-xl font-bold text-accent-primary">£{formatCurrency(selectedImpl.financials.revisedEMV)}</p>
                  </div>
                  <div className="p-3 bg-navy-800/30 rounded-lg text-center">
                    <p className="text-xs text-navy-500">Net Risk Reduction</p>
                    <p className="text-xl font-bold text-emerald-400">£{formatCurrency(selectedImpl.financials.netRiskReductionValue)}</p>
                  </div>
                  <div className="p-3 bg-navy-800/30 rounded-lg text-center">
                    <p className="text-xs text-navy-500">Payback Period</p>
                    <p className="text-xl font-bold text-navy-100">{selectedImpl.financials.paybackPeriodMonths} mo</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className={cn(
                    'p-3 rounded-lg text-center border',
                    selectedImpl.financials.isFinanciallyEfficient
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  )}>
                    <p className="text-xs text-navy-500">Risk ROI</p>
                    <p className={cn(
                      'text-xl font-bold',
                      selectedImpl.financials.riskROI >= 0 ? 'text-emerald-400' : 'text-red-400'
                    )}>
                      {selectedImpl.financials.riskROI.toFixed(0)}%
                    </p>
                    {!selectedImpl.financials.isFinanciallyEfficient && (
                      <p className="text-2xs text-red-400 mt-1">Financially Inefficient</p>
                    )}
                  </div>
                  <div className={cn(
                    'p-3 rounded-lg text-center border',
                    selectedImpl.financials.requiresCFOEscalation
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-navy-800/30 border-navy-700/50'
                  )}>
                    <p className="text-xs text-navy-500">Capital Efficiency</p>
                    <p className="text-xl font-bold text-navy-100">{selectedImpl.financials.capitalEfficiencyRatio.toFixed(2)}</p>
                    {selectedImpl.financials.requiresCFOEscalation && (
                      <p className="text-2xs text-amber-400 mt-1">CFO Escalation Required</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Stress Radar Chart */}
              {activeSection === 'stress' && selectedStress.length > 0 && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-3">
                    Stress Radar
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={selectedStress.map((s) => ({
                        scenario: s.name.split(' ')[0],
                        probability: s.revisedProbability,
                        impact: s.revisedImpact,
                        ebitda: Math.min(5, s.ebitdaShockPercent / 10),
                        liquidity: Math.min(5, s.liquidityImpact / 1_000_000),
                      }))}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="scenario" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <PolarRadiusAxis tick={false} />
                        <Radar name="Probability" dataKey="probability" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                        <Radar name="Impact" dataKey="impact" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                        <Radar name="EBITDA" dataKey="ebitda" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Waterfall Chart for stress scenarios */}
              {activeSection === 'stress' && selectedStress.length > 0 && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-3">
                    Impact Waterfall — {selectedStress[3]?.name || 'Multi-Risk Cascade'}
                  </h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={selectedStress[3]?.waterfallData || []} margin={{ left: 10, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 10 }} />
                        <YAxis
                          tickFormatter={(v) => `£${formatCurrency(v)}`}
                          stroke="#64748b"
                          tick={{ fontSize: 10 }}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                          formatter={(value) => [`£${formatCurrency(value as number)}`, 'Impact']}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {(selectedStress[3]?.waterfallData || []).map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={index === 4 ? '#ef4444' : index === 0 ? '#60a5fa' : '#f59e0b'}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Liquidity Strain Meter */}
              {activeSection === 'stress' && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-3">
                    Liquidity Strain Meter
                  </h3>
                  <div className="space-y-3">
                    {selectedStress.map((scenario) => {
                      const strain = Math.min(100, scenario.ebitdaShockPercent * 2);
                      return (
                        <div key={scenario.scenarioId}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-navy-300">{scenario.name}</span>
                            <span className={cn(
                              strain > 60 ? 'text-red-400' : strain > 30 ? 'text-amber-400' : 'text-emerald-400'
                            )}>
                              {strain.toFixed(0)}%
                            </span>
                          </div>
                          <div className="h-2.5 bg-navy-800 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all',
                                strain > 60 ? 'bg-red-500' : strain > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                              )}
                              style={{ width: `${strain}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* EMV comparison chart (blueprint view) */}
              {activeSection === 'blueprint' && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-3">
                    EMV Impact Analysis
                  </h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { label: 'Original EMV', value: selectedImpl.financials.originalEMV, fill: '#ef4444' },
                        { label: 'Mitigation Cost', value: selectedImpl.financials.totalMitigationInvestment, fill: '#f59e0b' },
                        { label: 'Revised EMV', value: selectedImpl.financials.revisedEMV, fill: '#60a5fa' },
                        { label: 'Net Reduction', value: selectedImpl.financials.netRiskReductionValue, fill: '#10b981' },
                      ]} margin={{ left: 10, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 10 }} />
                        <YAxis
                          tickFormatter={(v) => `£${formatCurrency(v)}`}
                          stroke="#64748b"
                          tick={{ fontSize: 10 }}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                          formatter={(value) => [`£${formatCurrency(value as number)}`, '']}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {[
                            { fill: '#ef4444' },
                            { fill: '#f59e0b' },
                            { fill: '#60a5fa' },
                            { fill: '#10b981' },
                          ].map((c, i) => (
                            <Cell key={i} fill={c.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Performance radar (performance view) */}
              {activeSection === 'performance' && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-3">
                    Performance Radar
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={[
                        { metric: 'Budget', value: Math.min(100, selectedImpl.performance.budgetUtilisation) },
                        { metric: 'Milestone', value: selectedImpl.performance.milestoneCompletion },
                        { metric: 'KPI', value: selectedImpl.performance.kpiAchievementScore },
                        { metric: 'Capital Eff.', value: Math.min(100, selectedImpl.financials.capitalEfficiencyRatio * 50) },
                        { metric: 'ROI', value: Math.min(100, Math.max(0, selectedImpl.financials.riskROI)) },
                      ]}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <PolarRadiusAxis tick={false} domain={[0, 100]} />
                        <Radar dataKey="value" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Competitive advantage chart (intelligence view) */}
              {activeSection === 'intelligence' && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-3">
                    Strategic Value Analysis
                  </h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Defensive', value: 10 - selectedImpl.strategicIntelligence.strategicRealignmentScore },
                            { name: 'Strategic', value: selectedImpl.strategicIntelligence.strategicRealignmentScore },
                          ]}
                          cx="30%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={50}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          <Cell fill="#334155" />
                          <Cell fill="#10b981" />
                        </Pie>
                        <Pie
                          data={[
                            { name: 'Baseline', value: 10 - selectedImpl.strategicIntelligence.innovationOpportunityIndicator },
                            { name: 'Innovation', value: selectedImpl.strategicIntelligence.innovationOpportunityIndicator },
                          ]}
                          cx="70%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={50}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          <Cell fill="#334155" />
                          <Cell fill="#60a5fa" />
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center text-xs text-navy-400">
                    <div>Realignment Score</div>
                    <div>Innovation Index</div>
                  </div>
                </div>
              )}

              {/* Governance view - right side has portfolio-level governance summary */}
              {activeSection === 'governance' && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-3">
                    Portfolio Governance Summary
                  </h3>
                  <div className="space-y-2">
                    {strategicRisks.map((risk) => {
                      const impl = implementations.get(risk.id);
                      if (!impl) return null;
                      return (
                        <div key={risk.id} className="flex items-center justify-between p-2 bg-navy-800/30 rounded text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-navy-500 w-16">{risk.id}</span>
                            <span className="text-navy-200 truncate max-w-[150px]">{risk.title}</span>
                          </div>
                          <span className={cn('px-2 py-0.5 rounded text-2xs font-bold border', getGovernanceLevelColour(impl.governance.requiredLevel))}>
                            {getGovernanceLevelLabel(impl.governance.requiredLevel).split(' ')[0]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Contagion view - portfolio contagion overview */}
              {activeSection === 'contagion' && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-accent-primary uppercase tracking-wide mb-3">
                    Portfolio Contagion Overview
                  </h3>
                  <div className="space-y-2">
                    {strategicRisks.map((risk) => {
                      const impl = implementations.get(risk.id);
                      if (!impl) return null;
                      const caf = impl.contagion.contagionAmplificationFactor;
                      return (
                        <div key={risk.id} className="flex items-center justify-between p-2 bg-navy-800/30 rounded text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-navy-500 w-16">{risk.id}</span>
                            <span className="text-navy-200 truncate max-w-[150px]">{risk.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-navy-800 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  'h-full rounded-full',
                                  caf > 2.5 ? 'bg-red-500' : caf > 1.5 ? 'bg-amber-500' : 'bg-emerald-500'
                                )}
                                style={{ width: `${Math.min(100, caf * 30)}%` }}
                              />
                            </div>
                            <span className={cn(
                              'text-xs font-mono',
                              impl.contagion.exceedsThreshold ? 'text-red-400' : 'text-navy-400'
                            )}>
                              {caf.toFixed(2)}x
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Empty state */}
      {!selectedRisk && (
        <div className="glass-card p-12 text-center">
          <p className="text-navy-400 text-lg mb-2">Select a risk above to view its implementation intelligence</p>
          <p className="text-navy-500 text-sm">Risks are prioritised by REPI score — highest priority risks appear first</p>
        </div>
      )}
    </div>
  );
}
