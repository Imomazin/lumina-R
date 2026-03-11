// ============================================================================
// LUMINA-R v2 ENGINE — SCENARIO & STRESS TESTING LAYER
// Stress simulations, scenario analysis, shock modeling
// ============================================================================

import {
  enterpriseRisks,
  type EnterpriseRisk,
  getEscalatedRisks
} from './dataLayer';
import {
  calculateRiskEMV,
  calculatePortfolioEMV,
  calculateCategoryEMV,
  calculateAppetiteBreachDeltas,
  PROBABILITY_MAP,
  IMPACT_MAP,
  CONTROL_EFFECTIVENESS_FACTOR
} from './quantificationLayer';

// ============================================================================
// SCENARIO CONFIGURATION
// ============================================================================

export const SCENARIO_CONFIG = {
  // Pre-defined shock scenarios
  shockScenarios: {
    cyber: {
      name: 'Major Cyber Attack',
      description: 'Widespread ransomware or data breach affecting critical systems',
      probabilityShift: 0.25,
      impactShift: 1,
      affectedCategories: ['Cybersecurity', 'Operational', 'Reputational', 'Compliance']
    },
    vendor: {
      name: 'Critical Vendor Failure',
      description: 'Major vendor insolvency or service disruption',
      probabilityShift: 0.20,
      impactShift: 1,
      affectedCategories: ['Third Party', 'Operational', 'Strategic']
    },
    regulatory: {
      name: 'Regulatory Enforcement Action',
      description: 'Major regulatory fine or enforcement action',
      probabilityShift: 0.15,
      impactShift: 2,
      affectedCategories: ['Compliance', 'Reputational', 'Financial']
    },
    economic: {
      name: 'Economic Downturn',
      description: 'Significant economic recession affecting revenue and credit',
      probabilityShift: 0.20,
      impactShift: 1,
      affectedCategories: ['Financial', 'Strategic', 'People']
    },
    pandemic: {
      name: 'Pandemic / Health Crisis',
      description: 'Major health crisis affecting operations and workforce',
      probabilityShift: 0.30,
      impactShift: 1,
      affectedCategories: ['People', 'Operational', 'Strategic']
    }
  },
  // Maximum shifts allowed
  maxProbabilityShift: 0.40,
  maxImpactShift: 2,
  // Control degradation in stress
  stressControlDegradation: 0.15  // 15% control effectiveness reduction
};

// ============================================================================
// SCENARIO TYPES
// ============================================================================

export interface StressScenarioInput {
  scenarioName?: string;
  probabilityShift?: number;  // Additive shift to probability (0.0-0.4)
  impactShift?: number;       // Additive shift to impact level (0-2)
  cyberShock?: boolean;
  vendorShock?: boolean;
  regulatoryShock?: boolean;
  economicShock?: boolean;
  pandemicShock?: boolean;
  controlDegradation?: number; // % reduction in control effectiveness
  specificCategories?: string[];
}

export interface StressedRisk {
  riskId: number;
  riskDescription: string;
  category: string;
  baseResidualEMV: number;
  stressedResidualEMV: number;
  emvIncrease: number;
  emvIncreasePercent: number;
  wasAffected: boolean;
  newAppetiteStatus: 'Within' | 'Breached';
}

export interface CategoryStressResult {
  category: string;
  baseEMV: number;
  stressedEMV: number;
  increase: number;
  increasePercent: number;
  risksAffected: number;
  newBreachCount: number;
}

export interface StressScenarioResult {
  scenarioName: string;
  scenarioDescription: string;
  inputParameters: {
    probabilityShift: number;
    impactShift: number;
    controlDegradation: number;
    affectedCategories: string[];
  };
  portfolioImpact: {
    basePortfolioEMV: number;
    stressedPortfolioEMV: number;
    totalIncrease: number;
    increasePercent: number;
  };
  categoryImpacts: CategoryStressResult[];
  stressedRisks: StressedRisk[];
  escalationChange: {
    baseEscalatedCount: number;
    stressedEscalatedCount: number;
    newEscalations: number;
  };
  appetiteImpact: {
    baseBreachedCount: number;
    stressedBreachedCount: number;
    newBreaches: number;
    breachedCategories: string[];
  };
  topImpactedRisks: StressedRisk[];
  severityAssessment: 'Manageable' | 'Significant' | 'Severe' | 'Critical';
}

// ============================================================================
// STRESS CALCULATION FUNCTIONS
// ============================================================================

function calculateStressedEMV(
  risk: EnterpriseRisk,
  probShift: number,
  impactShift: number,
  controlDegradation: number,
  affectedCategories: string[]
): { stressedEMV: number; wasAffected: boolean } {
  const isAffected = affectedCategories.length === 0 ||
    affectedCategories.includes(risk.riskCategory);

  if (!isAffected) {
    return { stressedEMV: calculateRiskEMV(risk).residualEMV, wasAffected: false };
  }

  // Apply probability shift
  const baseProbability = PROBABILITY_MAP[risk.likelihood];
  const stressedProbability = Math.min(0.95, baseProbability + probShift);

  // Apply impact shift
  const newImpactLevel = Math.min(5, risk.impact + impactShift) as 1 | 2 | 3 | 4 | 5;
  const stressedImpact = IMPACT_MAP[newImpactLevel];

  // Apply control degradation
  const baseControlFactor = CONTROL_EFFECTIVENESS_FACTOR[risk.controlEffectiveness];
  const stressedControlFactor = Math.max(0.05, baseControlFactor - controlDegradation);

  // Calculate stressed EMV
  const stressedInherentEMV = stressedProbability * stressedImpact;
  const stressedResidualEMV = Math.round(stressedInherentEMV * (1 - stressedControlFactor));

  return { stressedEMV: stressedResidualEMV, wasAffected: true };
}

// ============================================================================
// MAIN STRESS SIMULATION
// ============================================================================

export function simulateStressScenario(input: StressScenarioInput): StressScenarioResult {
  // Determine affected categories and parameters
  let affectedCategories: string[] = input.specificCategories || [];
  let scenarioName = input.scenarioName || 'Custom Stress Scenario';
  let scenarioDescription = 'User-defined stress parameters';
  let probShift = input.probabilityShift || 0;
  let impactShift = input.impactShift || 0;

  // Apply pre-defined shocks
  const shocks: Array<keyof typeof SCENARIO_CONFIG.shockScenarios> = [];
  if (input.cyberShock) shocks.push('cyber');
  if (input.vendorShock) shocks.push('vendor');
  if (input.regulatoryShock) shocks.push('regulatory');
  if (input.economicShock) shocks.push('economic');
  if (input.pandemicShock) shocks.push('pandemic');

  if (shocks.length > 0) {
    for (const shockType of shocks) {
      const shock = SCENARIO_CONFIG.shockScenarios[shockType];
      probShift = Math.max(probShift, shock.probabilityShift);
      impactShift = Math.max(impactShift, shock.impactShift);
      affectedCategories = [...new Set([...affectedCategories, ...shock.affectedCategories])];
    }
    scenarioName = shocks.length === 1
      ? SCENARIO_CONFIG.shockScenarios[shocks[0]].name
      : `Combined Shock: ${shocks.join(' + ')}`;
    scenarioDescription = shocks.length === 1
      ? SCENARIO_CONFIG.shockScenarios[shocks[0]].description
      : 'Multiple concurrent shock events';
  }

  // Apply limits
  probShift = Math.min(SCENARIO_CONFIG.maxProbabilityShift, probShift);
  impactShift = Math.min(SCENARIO_CONFIG.maxImpactShift, impactShift);
  const controlDegradation = input.controlDegradation ?? SCENARIO_CONFIG.stressControlDegradation;

  // Calculate baseline
  const basePortfolioEMV = calculatePortfolioEMV();
  const baseCategoryEMVs = calculateCategoryEMV();
  const baseAppetiteDeltas = calculateAppetiteBreachDeltas();
  const baseEscalated = getEscalatedRisks();

  // Calculate stressed values for all risks
  const stressedRisks: StressedRisk[] = enterpriseRisks.map(risk => {
    const baseEMV = calculateRiskEMV(risk);
    const { stressedEMV, wasAffected } = calculateStressedEMV(
      risk, probShift, impactShift, controlDegradation, affectedCategories
    );

    const emvIncrease = stressedEMV - baseEMV.residualEMV;
    const newAppetiteStatus = stressedEMV > baseEMV.residualEMV * 1.5 || risk.riskAppetiteAlignment === 'Outside Appetite'
      ? 'Breached' as const
      : 'Within' as const;

    return {
      riskId: risk.riskId,
      riskDescription: risk.riskDescription,
      category: risk.riskCategory,
      baseResidualEMV: baseEMV.residualEMV,
      stressedResidualEMV: stressedEMV,
      emvIncrease,
      emvIncreasePercent: baseEMV.residualEMV > 0
        ? Math.round((emvIncrease / baseEMV.residualEMV) * 100)
        : 0,
      wasAffected,
      newAppetiteStatus
    };
  });

  // Portfolio totals
  const stressedPortfolioEMV = stressedRisks.reduce((sum, r) => sum + r.stressedResidualEMV, 0);
  const totalIncrease = stressedPortfolioEMV - basePortfolioEMV.totalResidualEMV;

  // Category impacts
  const categories = ['Financial', 'Operational', 'Strategic', 'Compliance', 'Third Party', 'Reputational', 'AI Ethics', 'People', 'Cybersecurity'];
  const categoryImpacts: CategoryStressResult[] = categories.map(category => {
    const categoryStressed = stressedRisks.filter(r => r.category === category);
    const baseCategory = baseCategoryEMVs.find(c => c.category === category);
    const stressedEMV = categoryStressed.reduce((sum, r) => sum + r.stressedResidualEMV, 0);
    const baseEMV = baseCategory?.totalResidualEMV || 0;

    return {
      category,
      baseEMV,
      stressedEMV,
      increase: stressedEMV - baseEMV,
      increasePercent: baseEMV > 0 ? Math.round(((stressedEMV - baseEMV) / baseEMV) * 100) : 0,
      risksAffected: categoryStressed.filter(r => r.wasAffected).length,
      newBreachCount: categoryStressed.filter(r => r.newAppetiteStatus === 'Breached').length
    };
  });

  // Escalation changes
  const stressedEscalatedCount = stressedRisks.filter(r =>
    r.emvIncreasePercent >= 50 || r.newAppetiteStatus === 'Breached'
  ).length;

  // Appetite impact
  const stressedBreachedCount = stressedRisks.filter(r => r.newAppetiteStatus === 'Breached').length;
  const baseBreachedCount = baseAppetiteDeltas.filter(a => a.status === 'Breached').length;
  const newlyBreachedCategories = categoryImpacts
    .filter(c => c.newBreachCount > 0)
    .map(c => c.category);

  // Top impacted risks
  const topImpactedRisks = stressedRisks
    .filter(r => r.wasAffected)
    .sort((a, b) => b.emvIncrease - a.emvIncrease)
    .slice(0, 10);

  // Severity assessment
  const increasePercent = basePortfolioEMV.totalResidualEMV > 0
    ? Math.round((totalIncrease / basePortfolioEMV.totalResidualEMV) * 100)
    : 0;

  let severityAssessment: StressScenarioResult['severityAssessment'];
  if (increasePercent >= 50 || stressedBreachedCount >= 20) severityAssessment = 'Critical';
  else if (increasePercent >= 30 || stressedBreachedCount >= 10) severityAssessment = 'Severe';
  else if (increasePercent >= 15 || stressedBreachedCount >= 5) severityAssessment = 'Significant';
  else severityAssessment = 'Manageable';

  return {
    scenarioName,
    scenarioDescription,
    inputParameters: {
      probabilityShift: probShift,
      impactShift,
      controlDegradation,
      affectedCategories
    },
    portfolioImpact: {
      basePortfolioEMV: basePortfolioEMV.totalResidualEMV,
      stressedPortfolioEMV,
      totalIncrease,
      increasePercent
    },
    categoryImpacts,
    stressedRisks,
    escalationChange: {
      baseEscalatedCount: baseEscalated.length,
      stressedEscalatedCount,
      newEscalations: stressedEscalatedCount - baseEscalated.length
    },
    appetiteImpact: {
      baseBreachedCount,
      stressedBreachedCount,
      newBreaches: stressedBreachedCount - baseBreachedCount,
      breachedCategories: newlyBreachedCategories
    },
    topImpactedRisks,
    severityAssessment
  };
}

// ============================================================================
// PRE-DEFINED SCENARIO SIMULATIONS
// ============================================================================

export function runCyberShockScenario(): StressScenarioResult {
  return simulateStressScenario({ cyberShock: true });
}

export function runVendorShockScenario(): StressScenarioResult {
  return simulateStressScenario({ vendorShock: true });
}

export function runRegulatoryShockScenario(): StressScenarioResult {
  return simulateStressScenario({ regulatoryShock: true });
}

export function runEconomicShockScenario(): StressScenarioResult {
  return simulateStressScenario({ economicShock: true });
}

export function runCombinedShockScenario(): StressScenarioResult {
  return simulateStressScenario({
    cyberShock: true,
    vendorShock: true,
    regulatoryShock: true
  });
}

// ============================================================================
// SCENARIO COMPARISON
// ============================================================================

export interface ScenarioComparison {
  scenarios: Array<{
    name: string;
    portfolioIncrease: number;
    increasePercent: number;
    newBreaches: number;
    severity: string;
  }>;
  worstCaseScenario: string;
  bestCaseScenario: string;
  averageIncrease: number;
}

export function compareScenarios(): ScenarioComparison {
  const scenarios = [
    { name: 'Cyber Shock', result: runCyberShockScenario() },
    { name: 'Vendor Shock', result: runVendorShockScenario() },
    { name: 'Regulatory Shock', result: runRegulatoryShockScenario() },
    { name: 'Economic Shock', result: runEconomicShockScenario() },
    { name: 'Combined Shock', result: runCombinedShockScenario() }
  ];

  const comparison = scenarios.map(s => ({
    name: s.name,
    portfolioIncrease: s.result.portfolioImpact.totalIncrease,
    increasePercent: s.result.portfolioImpact.increasePercent,
    newBreaches: s.result.appetiteImpact.newBreaches,
    severity: s.result.severityAssessment
  }));

  const sorted = [...comparison].sort((a, b) => b.portfolioIncrease - a.portfolioIncrease);

  return {
    scenarios: comparison,
    worstCaseScenario: sorted[0].name,
    bestCaseScenario: sorted[sorted.length - 1].name,
    averageIncrease: Math.round(
      comparison.reduce((sum, s) => sum + s.portfolioIncrease, 0) / comparison.length
    )
  };
}

// ============================================================================
// REVERSE STRESS TEST
// ============================================================================

export interface ReverseStressResult {
  targetEMVThreshold: number;
  requiredProbabilityShift: number;
  requiredImpactShift: number;
  scenarioDescription: string;
  feasibility: 'Highly Unlikely' | 'Unlikely' | 'Possible' | 'Likely';
}

export function reverseStressTest(targetEMVMultiplier: number = 2.0): ReverseStressResult {
  const basePortfolio = calculatePortfolioEMV();
  const targetEMV = basePortfolio.totalResidualEMV * targetEMVMultiplier;

  // Binary search for required shifts
  let probShift = 0;
  let impactShift = 0;

  for (let p = 0; p <= 0.4; p += 0.05) {
    for (let i = 0; i <= 2; i++) {
      const result = simulateStressScenario({
        probabilityShift: p,
        impactShift: i
      });

      if (result.portfolioImpact.stressedPortfolioEMV >= targetEMV) {
        probShift = p;
        impactShift = i;
        break;
      }
    }
    if (probShift > 0) break;
  }

  // Assess feasibility
  let feasibility: ReverseStressResult['feasibility'];
  if (probShift >= 0.35 && impactShift >= 2) feasibility = 'Highly Unlikely';
  else if (probShift >= 0.25 || impactShift >= 2) feasibility = 'Unlikely';
  else if (probShift >= 0.15 || impactShift >= 1) feasibility = 'Possible';
  else feasibility = 'Likely';

  return {
    targetEMVThreshold: targetEMV,
    requiredProbabilityShift: probShift,
    requiredImpactShift: impactShift,
    scenarioDescription: `To reach ${targetEMVMultiplier}x portfolio EMV requires: +${Math.round(probShift * 100)}% probability shift and +${impactShift} impact level shift`,
    feasibility
  };
}
