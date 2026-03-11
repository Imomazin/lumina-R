// ============================================================================
// LUMINA-R v2 ENGINE — QUANTIFICATION LAYER
// EMV calculations, probability mappings, portfolio aggregations
// ============================================================================

import { enterpriseRisks, type EnterpriseRisk } from './dataLayer';
import { getBreachedAppetites, riskAppetite } from './dataLayer';

// ============================================================================
// CONFIGURATION CONSTANTS
// ============================================================================

export const PROBABILITY_MAP: Record<number, number> = {
  1: 0.05,  // Rare
  2: 0.15,  // Unlikely
  3: 0.35,  // Possible
  4: 0.55,  // Likely
  5: 0.80   // Almost Certain
};

export const IMPACT_MAP: Record<number, number> = {
  1: 100000,    // £100K - Negligible
  2: 500000,    // £500K - Minor
  3: 1500000,   // £1.5M - Moderate
  4: 5000000,   // £5M - Major
  5: 15000000   // £15M - Catastrophic
};

export const CONTROL_EFFECTIVENESS_FACTOR: Record<string, number> = {
  High: 0.70,    // 70% risk reduction
  Medium: 0.45,  // 45% risk reduction
  Low: 0.20      // 20% risk reduction
};

export const VELOCITY_MULTIPLIER: Record<string, number> = {
  Fast: 1.25,   // 25% faster materialization
  Medium: 1.0,  // Normal
  Slow: 0.75    // 25% slower materialization
};

// ============================================================================
// RISK EMV CALCULATION
// ============================================================================

export interface RiskEMV {
  riskId: number;
  probability: number;
  financialImpact: number;
  inherentEMV: number;
  residualEMV: number;
  controlFactor: number;
  controlReduction: number;
  velocityMultiplier: number;
  adjustedResidualEMV: number;
}

export function calculateRiskEMV(risk: EnterpriseRisk): RiskEMV {
  const probability = PROBABILITY_MAP[risk.likelihood] || 0;
  const financialImpact = IMPACT_MAP[risk.impact] || 0;
  const inherentEMV = probability * financialImpact;
  const controlFactor = CONTROL_EFFECTIVENESS_FACTOR[risk.controlEffectiveness] || 0.45;
  const residualEMV = inherentEMV * (1 - controlFactor);
  const controlReduction = inherentEMV - residualEMV;
  const velocityMultiplier = VELOCITY_MULTIPLIER[risk.velocity] || 1.0;
  const adjustedResidualEMV = residualEMV * velocityMultiplier;

  return {
    riskId: risk.riskId,
    probability,
    financialImpact,
    inherentEMV: Math.round(inherentEMV),
    residualEMV: Math.round(residualEMV),
    controlFactor,
    controlReduction: Math.round(controlReduction),
    velocityMultiplier,
    adjustedResidualEMV: Math.round(adjustedResidualEMV)
  };
}

// ============================================================================
// PORTFOLIO-LEVEL EMV
// ============================================================================

export interface PortfolioEMV {
  totalInherentEMV: number;
  totalResidualEMV: number;
  totalControlReduction: number;
  controlEffectivenessPercent: number;
  averageResidualEMV: number;
  maxResidualEMV: number;
  minResidualEMV: number;
  medianResidualEMV: number;
}

export function calculatePortfolioEMV(): PortfolioEMV {
  const emvs = enterpriseRisks.map(calculateRiskEMV);
  const residuals = emvs.map(e => e.residualEMV).sort((a, b) => a - b);

  const totalInherentEMV = emvs.reduce((sum, e) => sum + e.inherentEMV, 0);
  const totalResidualEMV = emvs.reduce((sum, e) => sum + e.residualEMV, 0);
  const totalControlReduction = totalInherentEMV - totalResidualEMV;

  return {
    totalInherentEMV,
    totalResidualEMV,
    totalControlReduction,
    controlEffectivenessPercent: Math.round((totalControlReduction / totalInherentEMV) * 100),
    averageResidualEMV: Math.round(totalResidualEMV / emvs.length),
    maxResidualEMV: Math.max(...residuals),
    minResidualEMV: Math.min(...residuals),
    medianResidualEMV: residuals[Math.floor(residuals.length / 2)]
  };
}

// ============================================================================
// CATEGORY-LEVEL EMV
// ============================================================================

export interface CategoryEMV {
  category: string;
  riskCount: number;
  totalInherentEMV: number;
  totalResidualEMV: number;
  controlReduction: number;
  avgResidualEMV: number;
  outsideAppetiteCount: number;
  escalatedCount: number;
  percentOfPortfolio: number;
}

export function calculateCategoryEMV(): CategoryEMV[] {
  const portfolioEMV = calculatePortfolioEMV();
  const categories = [
    'Financial', 'Operational', 'Strategic', 'Compliance',
    'Third Party', 'Reputational', 'AI Ethics', 'People', 'Cybersecurity'
  ];

  return categories.map(category => {
    const categoryRisks = enterpriseRisks.filter(r => r.riskCategory === category);
    const emvs = categoryRisks.map(calculateRiskEMV);

    const totalInherentEMV = emvs.reduce((sum, e) => sum + e.inherentEMV, 0);
    const totalResidualEMV = emvs.reduce((sum, e) => sum + e.residualEMV, 0);

    return {
      category,
      riskCount: categoryRisks.length,
      totalInherentEMV,
      totalResidualEMV,
      controlReduction: totalInherentEMV - totalResidualEMV,
      avgResidualEMV: categoryRisks.length ? Math.round(totalResidualEMV / categoryRisks.length) : 0,
      outsideAppetiteCount: categoryRisks.filter(r => r.riskAppetiteAlignment === 'Outside Appetite').length,
      escalatedCount: categoryRisks.filter(r => r.riskStatus === 'Escalated').length,
      percentOfPortfolio: Math.round((totalResidualEMV / portfolioEMV.totalResidualEMV) * 100)
    };
  });
}

// ============================================================================
// APPETITE BREACH DELTA
// ============================================================================

export interface AppetiteBreachDelta {
  category: string;
  currentLevel: number;
  toleranceMax: number;
  breachAmount: number;
  breachPercent: number;
  status: 'Within' | 'Approaching' | 'Breached';
  associatedEMV: number;
}

export function calculateAppetiteBreachDeltas(): AppetiteBreachDelta[] {
  const categoryEMVs = calculateCategoryEMV();

  return riskAppetite.map(appetite => {
    const breachAmount = Math.max(0, appetite.currentLevel - appetite.toleranceMax);
    const breachPercent = breachAmount > 0
      ? Math.round((breachAmount / appetite.toleranceMax) * 100)
      : 0;

    const categoryEMV = categoryEMVs.find(c =>
      c.category.toLowerCase() === appetite.category.toLowerCase()
    );

    return {
      category: appetite.category,
      currentLevel: appetite.currentLevel,
      toleranceMax: appetite.toleranceMax,
      breachAmount,
      breachPercent,
      status: appetite.status as 'Within' | 'Approaching' | 'Breached',
      associatedEMV: categoryEMV?.totalResidualEMV || 0
    };
  });
}

// ============================================================================
// ESCALATION SCORING
// ============================================================================

export interface EscalationScore {
  riskId: number;
  baseScore: number;
  velocityBonus: number;
  appetiteBonus: number;
  controlPenalty: number;
  finalScore: number;
  escalationLevel: 'Monitor' | 'Management' | 'Committee' | 'Board';
}

export function calculateEscalationScore(risk: EnterpriseRisk): EscalationScore {
  const baseScore = risk.residualRiskScore;
  const velocityBonus = risk.velocity === 'Fast' ? 3 : risk.velocity === 'Medium' ? 1 : 0;
  const appetiteBonus = risk.riskAppetiteAlignment === 'Outside Appetite' ? 5 : 0;
  const controlPenalty = risk.controlEffectiveness === 'Low' ? 2 : 0;

  const finalScore = baseScore + velocityBonus + appetiteBonus + controlPenalty;

  let escalationLevel: EscalationScore['escalationLevel'];
  if (finalScore >= 20) escalationLevel = 'Board';
  else if (finalScore >= 15) escalationLevel = 'Committee';
  else if (finalScore >= 10) escalationLevel = 'Management';
  else escalationLevel = 'Monitor';

  return {
    riskId: risk.riskId,
    baseScore,
    velocityBonus,
    appetiteBonus,
    controlPenalty,
    finalScore,
    escalationLevel
  };
}

// ============================================================================
// TOP RISKS BY EMV
// ============================================================================

export interface RankedRisk {
  risk: EnterpriseRisk;
  emv: RiskEMV;
  escalation: EscalationScore;
  rank: number;
}

export function getTopRisksByEMV(limit: number = 20): RankedRisk[] {
  return enterpriseRisks
    .map(risk => ({
      risk,
      emv: calculateRiskEMV(risk),
      escalation: calculateEscalationScore(risk),
      rank: 0
    }))
    .sort((a, b) => b.emv.residualEMV - a.emv.residualEMV)
    .slice(0, limit)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

// ============================================================================
// QUICK STATS EXPORT
// ============================================================================

export function getQuantificationSummary() {
  const portfolio = calculatePortfolioEMV();
  const categories = calculateCategoryEMV();
  const appetiteDeltas = calculateAppetiteBreachDeltas();
  const breached = getBreachedAppetites();

  return {
    portfolio,
    categories,
    appetiteDeltas,
    breachedAppetiteCount: breached.length,
    topCategory: categories.sort((a, b) => b.totalResidualEMV - a.totalResidualEMV)[0],
    highestRisk: getTopRisksByEMV(1)[0]
  };
}
