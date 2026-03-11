// Strategic Implementation Engine - Calculation Service
// REPI, Financial Analytics, Stress Testing, Governance, Contagion, Performance

import type {
  StrategicRisk,
  ThresholdConfig,
  RiskExecutionProfile,
  REPIClassification,
  RiskVelocityScore,
  FinancialImplementationAnalytics,
  ImplementationBlueprint,
  StressScenarioResult,
  ScenarioType,
  GovernanceEscalation,
  GovernanceLevel,
  ContagionAnalysis,
  ImplementationPerformance,
  StrategicImpactIntelligence,
  StrategicImplementation,
} from '../types';
import { DEFAULT_THRESHOLD_CONFIG } from './strategicRiskEngine';

// ============================================
// SECTION 1: RISK EXECUTION PRIORITY INDEX
// ============================================

const VELOCITY_MAP: Record<string, RiskVelocityScore> = {
  rapid: 5,
  moderate: 3,
  slow: 1,
};

/**
 * Calculate REPI = Weighted Impact × Risk Velocity × Financial Exposure Multiplier
 */
export function calculateREPI(
  risk: StrategicRisk,
  config: ThresholdConfig = DEFAULT_THRESHOLD_CONFIG
): RiskExecutionProfile {
  const velocityScore = VELOCITY_MAP[risk.riskVelocity] ?? 3;
  const financialExposureMultiplier =
    config.annualEBITDA > 0
      ? risk.financialEstimate.worstCase / config.annualEBITDA
      : 0;

  const repiScore =
    risk.weightedImpactScore * velocityScore * (1 + financialExposureMultiplier);

  const repiClassification = classifyREPI(repiScore);

  const executionUrgency =
    repiClassification === 'critical_implementation'
      ? 'immediate'
      : repiClassification === 'high_priority'
        ? 'short_term'
        : repiClassification === 'moderate'
          ? 'medium_term'
          : 'long_term';

  return {
    riskId: risk.id,
    repiScore: Math.round(repiScore * 100) / 100,
    repiClassification,
    velocityScore,
    financialExposureMultiplier: Math.round(financialExposureMultiplier * 10000) / 10000,
    executionUrgency,
  };
}

function classifyREPI(score: number): REPIClassification {
  if (score >= 15) return 'critical_implementation';
  if (score >= 8) return 'high_priority';
  if (score >= 4) return 'moderate';
  return 'monitor';
}

export function getREPIColour(classification: REPIClassification): string {
  switch (classification) {
    case 'critical_implementation':
      return 'bg-slate-900 text-white border-white/30';
    case 'high_priority':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'moderate':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'monitor':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  }
}

export function getREPILabel(classification: REPIClassification): string {
  switch (classification) {
    case 'critical_implementation':
      return 'Critical Implementation Required';
    case 'high_priority':
      return 'High Priority';
    case 'moderate':
      return 'Moderate';
    case 'monitor':
      return 'Monitor';
  }
}

// ============================================
// SECTION 3: FINANCIAL IMPLEMENTATION ANALYTICS
// ============================================

const DEFAULT_ANNUAL_CAPEX = 10_000_000; // £10M default

/**
 * Calculate financial analytics for a risk's implementation
 */
export function calculateFinancialAnalytics(
  risk: StrategicRisk,
  blueprint: ImplementationBlueprint,
  annualCapex: number = DEFAULT_ANNUAL_CAPEX
): FinancialImplementationAnalytics {
  const totalMitigationInvestment = blueprint.totalBudget;
  const originalEMV = risk.expectedMonetaryValue;

  // Estimate revised EMV based on residual risk target ratio
  const reductionRatio =
    risk.overallRiskScore > 0
      ? blueprint.overallResidualTarget / risk.overallRiskScore
      : 1;
  const revisedEMV = Math.round(originalEMV * reductionRatio);
  const netRiskReductionValue = originalEMV - revisedEMV;

  // Payback = months until EMV reduction pays for mitigation cost
  const monthlyReduction = netRiskReductionValue / 12;
  const paybackPeriodMonths =
    monthlyReduction > 0
      ? Math.ceil(totalMitigationInvestment / monthlyReduction)
      : 999;

  // Risk ROI = (Original EMV – Residual EMV – Mitigation Cost) ÷ Mitigation Cost
  const riskROI =
    totalMitigationInvestment > 0
      ? ((originalEMV - revisedEMV - totalMitigationInvestment) /
          totalMitigationInvestment) *
        100
      : 0;

  // Capital Efficiency = EMV Reduction ÷ Capital Deployed
  const capitalDeployed = blueprint.totalCapitalRequired;
  const capitalEfficiencyRatio =
    capitalDeployed > 0 ? netRiskReductionValue / capitalDeployed : 0;

  return {
    riskId: risk.id,
    totalMitigationInvestment: Math.round(totalMitigationInvestment),
    originalEMV: Math.round(originalEMV),
    revisedEMV: Math.round(revisedEMV),
    netRiskReductionValue: Math.round(netRiskReductionValue),
    paybackPeriodMonths,
    riskROI: Math.round(riskROI * 100) / 100,
    capitalEfficiencyRatio: Math.round(capitalEfficiencyRatio * 100) / 100,
    isFinanciallyEfficient: riskROI >= 0,
    requiresCFOEscalation: totalMitigationInvestment > annualCapex * 0.15,
  };
}

// ============================================
// SECTION 4: SCENARIO STRESS TESTING
// ============================================

interface ScenarioConfig {
  type: ScenarioType;
  name: string;
  description: string;
  probabilityMultiplier: number;
  impactMultiplier: number;
  liquidityMultiplier: number;
  cashRunwayImpactMonths: number;
}

const SCENARIO_CONFIGS: ScenarioConfig[] = [
  {
    type: 'regulatory_escalation',
    name: 'Regulatory Escalation',
    description:
      'Accelerated regulatory enforcement with expanded scope. New compliance requirements mandate immediate system changes and potential service restrictions.',
    probabilityMultiplier: 1.5,
    impactMultiplier: 1.8,
    liquidityMultiplier: 0.15,
    cashRunwayImpactMonths: 3,
  },
  {
    type: 'market_shock',
    name: 'Market Shock',
    description:
      'Sudden market downturn affecting revenue pipelines, client retention, and access to capital markets. Multiple clients delay or cancel engagements.',
    probabilityMultiplier: 1.3,
    impactMultiplier: 2.0,
    liquidityMultiplier: 0.25,
    cashRunwayImpactMonths: 6,
  },
  {
    type: 'technology_failure',
    name: 'Technology Failure',
    description:
      'Major technology infrastructure failure affecting core operations. Extended outage with data integrity concerns and client service disruption.',
    probabilityMultiplier: 1.2,
    impactMultiplier: 2.5,
    liquidityMultiplier: 0.10,
    cashRunwayImpactMonths: 2,
  },
  {
    type: 'multi_risk_cascade',
    name: 'Multi-Risk Cascade',
    description:
      'Simultaneous materialisation of interconnected risks creating amplified impact. Interdependencies trigger chain reactions across risk portfolio.',
    probabilityMultiplier: 2.0,
    impactMultiplier: 3.0,
    liquidityMultiplier: 0.35,
    cashRunwayImpactMonths: 9,
  },
];

/**
 * Run stress scenarios against a risk
 */
export function runStressScenarios(
  risk: StrategicRisk,
  allRisks: StrategicRisk[],
  config: ThresholdConfig = DEFAULT_THRESHOLD_CONFIG
): StressScenarioResult[] {
  return SCENARIO_CONFIGS.map((scenario) => {
    const revisedProbability = Math.min(
      5,
      risk.probability * scenario.probabilityMultiplier
    );
    const revisedImpact = Math.min(
      5,
      risk.weightedImpactScore * scenario.impactMultiplier
    );

    const stressedEMV =
      risk.expectedMonetaryValue * scenario.impactMultiplier;
    const liquidityImpact = stressedEMV * scenario.liquidityMultiplier;
    const ebitdaShockPercent =
      config.annualEBITDA > 0
        ? (stressedEMV / config.annualEBITDA) * 100
        : 0;
    const capitalBufferRequired = stressedEMV * 0.3; // 30% buffer

    // Find affected risks (interconnected)
    const affectedRiskIds =
      scenario.type === 'multi_risk_cascade'
        ? allRisks.map((r) => r.id)
        : risk.interdependencies.map((d) => d.linkedRiskId);

    // Waterfall data for visualization
    const waterfallData = [
      { label: 'Base EMV', value: risk.expectedMonetaryValue, cumulative: risk.expectedMonetaryValue },
      { label: 'Probability Stress', value: Math.round(stressedEMV * 0.3), cumulative: Math.round(risk.expectedMonetaryValue + stressedEMV * 0.3) },
      { label: 'Impact Stress', value: Math.round(stressedEMV * 0.5), cumulative: Math.round(risk.expectedMonetaryValue + stressedEMV * 0.8) },
      { label: 'Liquidity Effect', value: Math.round(liquidityImpact), cumulative: Math.round(stressedEMV + liquidityImpact) },
      { label: 'Total Stressed', value: Math.round(stressedEMV + liquidityImpact), cumulative: Math.round(stressedEMV + liquidityImpact) },
    ];

    return {
      scenarioId: `SCN-${risk.id}-${scenario.type}`,
      scenarioType: scenario.type,
      name: scenario.name,
      description: scenario.description,
      revisedProbability: Math.round(revisedProbability * 100) / 100,
      revisedImpact: Math.round(revisedImpact * 100) / 100,
      liquidityImpact: Math.round(liquidityImpact),
      ebitdaShockPercent: Math.round(ebitdaShockPercent * 100) / 100,
      cashRunwayReductionMonths: scenario.cashRunwayImpactMonths,
      capitalBufferRequired: Math.round(capitalBufferRequired),
      affectedRiskIds,
      waterfallData,
    };
  });
}

// ============================================
// SECTION 5: GOVERNANCE ESCALATION
// ============================================

/**
 * Determine governance level and escalation triggers
 */
export function calculateGovernanceEscalation(
  risk: StrategicRisk,
  profile: RiskExecutionProfile,
  config: ThresholdConfig = DEFAULT_THRESHOLD_CONFIG
): GovernanceEscalation {
  const triggers = {
    emvThreshold: risk.expectedMonetaryValue > config.cfoReviewEMVThreshold,
    strategicImpact: risk.impactDimensions.strategic >= 4,
    legalScore: risk.impactDimensions.legal >= 4,
    interdependencyScore: risk.interdependencyScore >= 7,
    velocityScore: profile.velocityScore >= 4,
  };

  const triggerCount = Object.values(triggers).filter(Boolean).length;
  const isWorsening = risk.trend === 'increasing';

  let requiredLevel: GovernanceLevel;
  if (risk.colour === 'black' || triggerCount >= 4) {
    requiredLevel = 'crisis_committee';
  } else if (triggerCount >= 3 || risk.colour === 'red') {
    requiredLevel = 'board';
  } else if (triggerCount >= 2 || risk.colour === 'amber') {
    requiredLevel = 'executive_committee';
  } else {
    requiredLevel = 'operational_committee';
  }

  // If worsening, auto-escalate one level up and calculate countdown
  const escalationCountdown = isWorsening
    ? Math.max(7, 30 - triggerCount * 5) // Days until auto-escalate
    : undefined;

  return {
    riskId: risk.id,
    requiredLevel,
    triggers,
    escalationCountdown,
    isWorsening,
  };
}

export function getGovernanceLevelLabel(level: GovernanceLevel): string {
  switch (level) {
    case 'operational_committee':
      return 'Operational Committee';
    case 'executive_committee':
      return 'Executive Committee';
    case 'board':
      return 'Board';
    case 'crisis_committee':
      return 'Crisis Committee';
  }
}

export function getGovernanceLevelColour(level: GovernanceLevel): string {
  switch (level) {
    case 'crisis_committee':
      return 'bg-slate-900 text-white border-white/30';
    case 'board':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'executive_committee':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'operational_committee':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  }
}

// ============================================
// SECTION 6: CONTAGION ANALYSIS
// ============================================

const CAF_THRESHOLD = 2.5;

/**
 * Calculate Contagion Amplification Factor for a risk
 */
export function calculateContagion(
  risk: StrategicRisk,
  allRisks: StrategicRisk[]
): ContagionAnalysis {
  if (risk.interdependencies.length === 0) {
    return {
      riskId: risk.id,
      contagionAmplificationFactor: 1.0,
      connectedRisks: [],
      portfolioExposureAdjustment: 0,
      exceedsThreshold: false,
    };
  }

  const connectedRisks = risk.interdependencies.map((dep) => {
    const linked = allRisks.find((r) => r.id === dep.linkedRiskId);
    const linkedScore = linked?.overallRiskScore ?? 0;
    // Amplification path considers relationship type
    const typeMultiplier =
      dep.relationshipType === 'amplifies'
        ? 1.5
        : dep.relationshipType === 'causes'
          ? 1.3
          : 1.0;

    return {
      riskId: dep.linkedRiskId,
      strength: dep.strength * typeMultiplier,
      amplificationPath: `${risk.id} → [${dep.relationshipType}] → ${dep.linkedRiskId} (score: ${linkedScore.toFixed(1)})`,
    };
  });

  // CAF = 1 + (sum of weighted connection strengths / 10)
  const totalWeightedStrength = connectedRisks.reduce(
    (sum, cr) => sum + cr.strength,
    0
  );
  const caf = 1 + totalWeightedStrength / 10;

  // Portfolio adjustment: if CAF > threshold, increase portfolio exposure estimate
  const portfolioExposureAdjustment =
    caf > CAF_THRESHOLD ? (caf - 1) * 10 : 0; // % increase

  return {
    riskId: risk.id,
    contagionAmplificationFactor: Math.round(caf * 100) / 100,
    connectedRisks,
    portfolioExposureAdjustment: Math.round(portfolioExposureAdjustment * 100) / 100,
    exceedsThreshold: caf > CAF_THRESHOLD,
  };
}

// ============================================
// SECTION 7: IMPLEMENTATION PERFORMANCE
// ============================================

/**
 * Calculate performance metrics from blueprint
 */
export function calculatePerformance(
  risk: StrategicRisk,
  blueprint: ImplementationBlueprint,
  financials: FinancialImplementationAnalytics
): ImplementationPerformance {
  const actions = blueprint.actions;
  const budgetSpent = actions.reduce((sum, a) => {
    const ratio = a.milestoneCompletion / 100;
    return sum + a.budgetAllocation * ratio;
  }, 0);

  const overallMilestoneCompletion =
    actions.length > 0
      ? actions.reduce((sum, a) => sum + a.milestoneCompletion, 0) /
        actions.length
      : 0;

  const capitalDeployed = actions
    .filter((a) => a.status === 'in_progress' || a.status === 'completed')
    .reduce((sum, a) => sum + a.capitalRequirement, 0);

  // Simulate schedule deviation based on milestone vs expected
  const expectedCompletion = actions.filter(
    (a) => a.status === 'completed'
  ).length;
  const scheduleDeviation =
    actions.length > 0
      ? ((expectedCompletion / actions.length) * 100 - overallMilestoneCompletion) * -1
      : 0;

  const costOverrun =
    blueprint.totalBudget > 0
      ? ((budgetSpent / blueprint.totalBudget) * 100 - overallMilestoneCompletion)
      : 0;

  // KPI achievement: based on how close we are to residual risk target
  const kpiAchievementScore = Math.min(
    100,
    Math.max(
      0,
      100 -
        Math.abs(risk.residualRiskScore - blueprint.overallResidualTarget) * 10
    )
  );

  // Traffic light
  let trafficLight: 'green' | 'amber' | 'red';
  if (
    Math.abs(scheduleDeviation) > 20 ||
    costOverrun > 20 ||
    risk.residualRiskScore > blueprint.overallResidualTarget * 1.5
  ) {
    trafficLight = 'red';
  } else if (
    Math.abs(scheduleDeviation) > 10 ||
    costOverrun > 10 ||
    risk.residualRiskScore > blueprint.overallResidualTarget * 1.2
  ) {
    trafficLight = 'amber';
  } else {
    trafficLight = 'green';
  }

  return {
    riskId: risk.id,
    budgetSpent: Math.round(budgetSpent),
    budgetAllocated: Math.round(blueprint.totalBudget),
    budgetUtilisation:
      blueprint.totalBudget > 0
        ? Math.round((budgetSpent / blueprint.totalBudget) * 10000) / 100
        : 0,
    milestoneCompletion: Math.round(overallMilestoneCompletion * 100) / 100,
    residualRiskCurrent: risk.residualRiskScore,
    residualRiskTarget: blueprint.overallResidualTarget,
    kpiAchievementScore: Math.round(kpiAchievementScore),
    capitalDeployed: Math.round(capitalDeployed),
    emvReduced: Math.round(financials.netRiskReductionValue),
    scheduleDeviation: Math.round(scheduleDeviation * 100) / 100,
    costOverrun: Math.round(costOverrun * 100) / 100,
    trafficLight,
  };
}

// ============================================
// SECTION 8: STRATEGIC IMPACT INTELLIGENCE
// ============================================

/**
 * Calculate strategic impact intelligence
 */
export function calculateStrategicIntelligence(
  risk: StrategicRisk,
  blueprint: ImplementationBlueprint
): StrategicImpactIntelligence {
  // Realignment score: based on adaptive actions and strategic improvement
  const adaptiveActions = blueprint.actions.filter(
    (a) => a.category === 'adaptive'
  );
  const strategicRealignmentScore = Math.min(
    10,
    adaptiveActions.length * 2 + (risk.impactDimensions.strategic >= 4 ? 3 : 1)
  );

  // Innovation indicator: based on investment in new capabilities
  const totalInnovationBudget = adaptiveActions.reduce(
    (sum, a) => sum + a.budgetAllocation,
    0
  );
  const innovationOpportunityIndicator = Math.min(
    10,
    Math.round((totalInnovationBudget / Math.max(blueprint.totalBudget, 1)) * 20)
  );

  // Competitive advantage delta
  const preMitigation = Math.max(
    1,
    5 - Math.round(risk.overallRiskScore / 5)
  );
  const residualRatio =
    risk.overallRiskScore > 0
      ? blueprint.overallResidualTarget / risk.overallRiskScore
      : 1;
  const postMitigation = Math.min(10, Math.round(preMitigation + (1 - residualRatio) * 5));

  const isStrategicAsset =
    strategicRealignmentScore >= 6 || innovationOpportunityIndicator >= 5;

  let strategicInsight: string;
  if (isStrategicAsset) {
    strategicInsight =
      'Mitigation programme creates strategic value through new capabilities and competitive positioning improvement.';
  } else if (strategicRealignmentScore >= 4) {
    strategicInsight =
      'Mitigation provides moderate strategic benefit beyond risk reduction. Consider expanding adaptive components.';
  } else {
    strategicInsight =
      'Mitigation is primarily defensive. Explore opportunities to convert risk response into strategic advantage.';
  }

  return {
    riskId: risk.id,
    strategicRealignmentScore,
    innovationOpportunityIndicator,
    competitiveAdvantageDelta: {
      preMitigation,
      postMitigation,
      delta: postMitigation - preMitigation,
    },
    isStrategicAsset,
    strategicInsight,
  };
}

// ============================================
// COMBINED IMPLEMENTATION BUILDER
// ============================================

/**
 * Build complete strategic implementation record for a risk
 */
export function buildStrategicImplementation(
  risk: StrategicRisk,
  blueprint: ImplementationBlueprint,
  allRisks: StrategicRisk[],
  config: ThresholdConfig = DEFAULT_THRESHOLD_CONFIG
): StrategicImplementation {
  const executionProfile = calculateREPI(risk, config);
  const financials = calculateFinancialAnalytics(risk, blueprint);
  const governance = calculateGovernanceEscalation(risk, executionProfile, config);
  const contagion = calculateContagion(risk, allRisks);
  const performance = calculatePerformance(risk, blueprint, financials);
  const strategicIntelligence = calculateStrategicIntelligence(risk, blueprint);

  return {
    executionProfile,
    blueprint,
    financials,
    governance,
    contagion,
    performance,
    strategicIntelligence,
  };
}
