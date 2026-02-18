// Strategic Risk Engine - Tier 4 Calculation Service
// Implements all formulas from the Tier 4 Strategic Risk Register specification

import type {
  StrategicRisk,
  StrategicRiskColour,
  WeightedImpactDimensions,
  FinancialEstimate,
  ThresholdConfig,
  EscalationTrigger,
  EscalationLevel,
  StrategicPortfolioMetrics,
  StrategicHeatMapCell,
  MitigationOption,
} from '../types';

// Default threshold configuration
export const DEFAULT_THRESHOLD_CONFIG: ThresholdConfig = {
  annualEBITDA: 50_000_000, // £50M default
  greenScoreMax: 7,
  greenEMVMax: 100_000, // £100k
  amberScoreMax: 13,
  amberEMVMax: 500_000, // £500k
  mandatoryMitigationThreshold: 10, // 10% EBITDA
  executiveCommitteeScoreThreshold: 13,
  cfoReviewEMVThreshold: 500_000, // £500k
  strategicBoardThreshold: 4,
};

// ============================================
// SECTION B: QUALITATIVE RISK ANALYSIS
// ============================================

/**
 * Calculate Weighted Impact Score
 * Formula: (0.30 × Financial) + (0.20 × Operational) + (0.20 × Reputational) + (0.20 × Strategic) + (0.10 × Legal)
 */
export function calculateWeightedImpact(dimensions: WeightedImpactDimensions): number {
  const weights = {
    financial: 0.30,
    operational: 0.20,
    reputational: 0.20,
    strategic: 0.20,
    legal: 0.10,
  };

  const weighted =
    weights.financial * dimensions.financial +
    weights.operational * dimensions.operational +
    weights.reputational * dimensions.reputational +
    weights.strategic * dimensions.strategic +
    weights.legal * dimensions.legal;

  return Math.round(weighted * 100) / 100;
}

/**
 * Calculate Overall Risk Score
 * Formula: Probability × Weighted Impact Score
 */
export function calculateOverallRiskScore(
  probability: number,
  weightedImpact: number
): number {
  return Math.round(probability * weightedImpact * 100) / 100;
}

// ============================================
// SECTION C: QUANTITATIVE FINANCIAL MODEL
// ============================================

/**
 * Calculate Simple Expected Monetary Value
 * Formula: Probability × Most Likely Impact
 */
export function calculateSimpleEMV(
  probabilityPercent: number,
  mostLikelyImpact: number
): number {
  return Math.round((probabilityPercent / 100) * mostLikelyImpact);
}

/**
 * Calculate Triangular Expected Monetary Value
 * Formula: ((Best Case + Most Likely + Worst Case) ÷ 3) × Probability
 */
export function calculateTriangularEMV(
  probabilityPercent: number,
  estimate: FinancialEstimate
): number {
  const triangularMean =
    (estimate.bestCase + estimate.mostLikely + estimate.worstCase) / 3;
  return Math.round((probabilityPercent / 100) * triangularMean);
}

/**
 * Calculate Capital Allocation Required
 * Formula: Worst Case × Confidence Adjustment Factor
 * Confidence Adjustment: Higher confidence = closer to worst case
 */
export function calculateCapitalAllocation(estimate: FinancialEstimate): number {
  // Confidence adjustment: at 95% confidence, use ~90% of worst case
  // at 50% confidence, use ~60% of worst case
  const confidenceFactor = 0.5 + (estimate.confidenceLevel / 100) * 0.5;
  return Math.round(estimate.worstCase * confidenceFactor);
}

/**
 * Calculate EBITDA Exposure Percentage
 * Formula: (Worst Case ÷ Annual EBITDA) × 100
 */
export function calculateEBITDAExposure(
  worstCase: number,
  annualEBITDA: number
): number {
  if (annualEBITDA <= 0) return 0;
  return Math.round((worstCase / annualEBITDA) * 10000) / 100;
}

// ============================================
// SECTION D: RISK THRESHOLDS & DECISION RULES
// ============================================

/**
 * Determine Risk Colour based on thresholds
 * Green: Score < 7 AND EMV < £100k
 * Amber: Score 7-12 OR EMV £100k-£500k
 * Red: Score ≥ 13 OR EMV > £500k
 * Black: Worst Case > 20% EBITDA OR Legal Impact = 5
 */
export function determineRiskColour(
  overallScore: number,
  emv: number,
  ebitdaExposurePercent: number,
  legalImpact: number,
  config: ThresholdConfig = DEFAULT_THRESHOLD_CONFIG
): StrategicRiskColour {
  // Black conditions (crisis governance)
  if (ebitdaExposurePercent > 20 || legalImpact === 5) {
    return 'black';
  }

  // Red conditions
  if (overallScore >= config.amberScoreMax || emv > config.amberEMVMax) {
    return 'red';
  }

  // Amber conditions
  if (
    (overallScore >= config.greenScoreMax && overallScore < config.amberScoreMax) ||
    (emv >= config.greenEMVMax && emv <= config.amberEMVMax)
  ) {
    return 'amber';
  }

  // Green: below all thresholds
  return 'green';
}

/**
 * Determine escalation triggers based on risk attributes
 */
export function determineEscalationTriggers(
  risk: StrategicRisk,
  config: ThresholdConfig = DEFAULT_THRESHOLD_CONFIG
): EscalationTrigger[] {
  const triggers: EscalationTrigger[] = [];

  // Score >= 13 → Executive Committee
  if (risk.overallRiskScore >= config.executiveCommitteeScoreThreshold) {
    triggers.push({
      level: 'executive_committee',
      reason: `Risk score (${risk.overallRiskScore.toFixed(1)}) exceeds threshold (${config.executiveCommitteeScoreThreshold})`,
      triggered: true,
    });
  }

  // EMV > £500k → CFO Review
  if (risk.expectedMonetaryValue > config.cfoReviewEMVThreshold) {
    triggers.push({
      level: 'cfo_review',
      reason: `EMV (£${formatCurrency(risk.expectedMonetaryValue)}) exceeds threshold (£${formatCurrency(config.cfoReviewEMVThreshold)})`,
      triggered: true,
    });
  }

  // Strategic Impact >= 4 → Board Visibility
  if (risk.impactDimensions.strategic >= config.strategicBoardThreshold) {
    triggers.push({
      level: 'board_visibility',
      reason: `Strategic impact (${risk.impactDimensions.strategic}) requires board visibility`,
      triggered: true,
    });
  }

  // EBITDA Exposure > 10% → Mandatory Mitigation
  if (risk.ebitdaExposurePercent > config.mandatoryMitigationThreshold) {
    triggers.push({
      level: 'department_head',
      reason: `EBITDA exposure (${risk.ebitdaExposurePercent.toFixed(1)}%) exceeds mandatory mitigation threshold (${config.mandatoryMitigationThreshold}%)`,
      triggered: true,
    });
  }

  // Black status → Crisis Governance
  if (risk.colour === 'black') {
    triggers.push({
      level: 'crisis_governance',
      reason: 'Black risk status triggers crisis governance protocol',
      triggered: true,
    });
  }

  return triggers;
}

/**
 * Get highest escalation level from triggers
 */
export function getHighestEscalationLevel(
  triggers: EscalationTrigger[]
): EscalationLevel {
  const levelPriority: EscalationLevel[] = [
    'crisis_governance',
    'board_visibility',
    'cfo_review',
    'executive_committee',
    'department_head',
    'risk_owner',
    'none',
  ];

  for (const level of levelPriority) {
    if (triggers.some((t) => t.triggered && t.level === level)) {
      return level;
    }
  }

  return 'none';
}

// ============================================
// SECTION E: MITIGATION COSTING
// ============================================

/**
 * Calculate Mitigation ROI
 * Net Benefit = Risk Reduction Value - Mitigation Cost
 * ROI = (Net Benefit / Mitigation Cost) × 100
 */
export function calculateMitigationROI(option: MitigationOption): {
  netBenefit: number;
  roi: number;
} {
  const netBenefit = option.riskReductionValue - option.cost;
  const roi = option.cost > 0 ? (netBenefit / option.cost) * 100 : 0;
  return {
    netBenefit: Math.round(netBenefit),
    roi: Math.round(roi * 100) / 100,
  };
}

/**
 * Calculate residual risk score after mitigation
 * Simplified: assumes linear reduction based on expected EMV reduction
 */
export function calculateResidualScore(
  currentScore: number,
  currentEMV: number,
  emvReduction: number
): number {
  if (currentEMV <= 0) return currentScore;
  const reductionFactor = 1 - emvReduction / currentEMV;
  return Math.max(1, Math.round(currentScore * reductionFactor * 100) / 100);
}

// ============================================
// INTERDEPENDENCY SCORING
// ============================================

/**
 * Calculate interdependency score based on linked risks
 * Higher score = more interconnected = higher systemic risk
 */
export function calculateInterdependencyScore(
  risk: StrategicRisk,
  allRisks: StrategicRisk[]
): number {
  if (risk.interdependencies.length === 0) return 1;

  let totalStrength = 0;
  let linkedCount = 0;

  for (const dep of risk.interdependencies) {
    const linkedRisk = allRisks.find((r) => r.id === dep.linkedRiskId);
    if (linkedRisk) {
      // Weight by linked risk's severity and relationship strength
      const severityMultiplier =
        linkedRisk.colour === 'black'
          ? 2
          : linkedRisk.colour === 'red'
            ? 1.5
            : linkedRisk.colour === 'amber'
              ? 1.2
              : 1;
      totalStrength += dep.strength * severityMultiplier;
      linkedCount++;
    }
  }

  if (linkedCount === 0) return 1;

  // Normalize to 1-10 scale
  const avgStrength = totalStrength / linkedCount;
  const countBonus = Math.min(linkedCount * 0.5, 3); // Bonus for more connections
  return Math.min(10, Math.round((avgStrength + countBonus) * 100) / 100);
}

// ============================================
// PORTFOLIO METRICS
// ============================================

/**
 * Calculate portfolio-level metrics across all strategic risks
 */
export function calculatePortfolioMetrics(
  risks: StrategicRisk[],
  config: ThresholdConfig = DEFAULT_THRESHOLD_CONFIG
): StrategicPortfolioMetrics {
  if (risks.length === 0) {
    return {
      totalEMVExposure: 0,
      totalCapitalAllocated: 0,
      averageRiskScore: 0,
      risksByColour: { green: 0, amber: 0, red: 0, black: 0 },
      top10ByCapitalImpact: [],
      top10ByEMV: [],
      ebitdaAtRisk: 0,
      ebitdaAtRiskPercent: 0,
      trendSummary: { increasing: 0, stable: 0, decreasing: 0 },
      mitigationROISummary: {
        totalMitigationCost: 0,
        totalRiskReduction: 0,
        totalNetBenefit: 0,
      },
    };
  }

  const totalEMV = risks.reduce((sum, r) => sum + r.expectedMonetaryValue, 0);
  const totalCapital = risks.reduce(
    (sum, r) => sum + r.capitalAllocationRequired,
    0
  );
  const avgScore =
    risks.reduce((sum, r) => sum + r.overallRiskScore, 0) / risks.length;

  const colourCounts = {
    green: risks.filter((r) => r.colour === 'green').length,
    amber: risks.filter((r) => r.colour === 'amber').length,
    red: risks.filter((r) => r.colour === 'red').length,
    black: risks.filter((r) => r.colour === 'black').length,
  };

  const sortedByCapital = [...risks].sort(
    (a, b) => b.capitalAllocationRequired - a.capitalAllocationRequired
  );
  const sortedByEMV = [...risks].sort(
    (a, b) => b.expectedMonetaryValue - a.expectedMonetaryValue
  );

  const totalWorstCase = risks.reduce(
    (sum, r) => sum + r.financialEstimate.worstCase,
    0
  );
  const ebitdaAtRiskPercent =
    config.annualEBITDA > 0
      ? (totalWorstCase / config.annualEBITDA) * 100
      : 0;

  const trendSummary = {
    increasing: risks.filter((r) => r.trend === 'increasing').length,
    stable: risks.filter((r) => r.trend === 'stable').length,
    decreasing: risks.filter((r) => r.trend === 'decreasing').length,
  };

  // Mitigation ROI summary
  let totalMitigationCost = 0;
  let totalRiskReduction = 0;
  for (const risk of risks) {
    for (const opt of risk.mitigationOptions) {
      if (opt.status === 'approved' || opt.status === 'in_progress') {
        totalMitigationCost += opt.cost;
        totalRiskReduction += opt.riskReductionValue;
      }
    }
  }

  return {
    totalEMVExposure: Math.round(totalEMV),
    totalCapitalAllocated: Math.round(totalCapital),
    averageRiskScore: Math.round(avgScore * 100) / 100,
    risksByColour: colourCounts,
    top10ByCapitalImpact: sortedByCapital.slice(0, 10),
    top10ByEMV: sortedByEMV.slice(0, 10),
    ebitdaAtRisk: Math.round(totalWorstCase),
    ebitdaAtRiskPercent: Math.round(ebitdaAtRiskPercent * 100) / 100,
    trendSummary,
    mitigationROISummary: {
      totalMitigationCost: Math.round(totalMitigationCost),
      totalRiskReduction: Math.round(totalRiskReduction),
      totalNetBenefit: Math.round(totalRiskReduction - totalMitigationCost),
    },
  };
}

/**
 * Generate heat map data for strategic risk matrix
 */
export function generateStrategicHeatMap(
  risks: StrategicRisk[]
): StrategicHeatMapCell[][] {
  // 5x5 matrix: probability (1-5) × weighted impact (1-5)
  const matrix: StrategicHeatMapCell[][] = [];

  for (let prob = 1; prob <= 5; prob++) {
    const row: StrategicHeatMapCell[] = [];
    for (let impact = 1; impact <= 5; impact++) {
      const cellRisks = risks.filter(
        (r) =>
          Math.round(r.probability) === prob &&
          Math.round(r.weightedImpactScore) === impact
      );
      const totalEMV = cellRisks.reduce(
        (sum, r) => sum + r.expectedMonetaryValue,
        0
      );
      const dominantColour = getDominantColour(cellRisks);

      row.push({
        probability: prob,
        weightedImpact: impact,
        risks: cellRisks,
        count: cellRisks.length,
        totalEMV,
        dominantColour,
      });
    }
    matrix.push(row);
  }

  return matrix;
}

function getDominantColour(risks: StrategicRisk[]): StrategicRiskColour {
  if (risks.length === 0) return 'green';
  if (risks.some((r) => r.colour === 'black')) return 'black';
  if (risks.some((r) => r.colour === 'red')) return 'red';
  if (risks.some((r) => r.colour === 'amber')) return 'amber';
  return 'green';
}

// ============================================
// FULL RISK CALCULATION
// ============================================

/**
 * Calculate all derived fields for a strategic risk
 */
export function calculateStrategicRiskFields(
  risk: Partial<StrategicRisk>,
  config: ThresholdConfig = DEFAULT_THRESHOLD_CONFIG
): Partial<StrategicRisk> {
  const probability = risk.probability ?? 3;
  const probabilityPercent = risk.probabilityPercent ?? probability * 20;
  const impactDimensions = risk.impactDimensions ?? {
    financial: 3,
    operational: 3,
    reputational: 3,
    strategic: 3,
    legal: 3,
  };
  const financialEstimate = risk.financialEstimate ?? {
    bestCase: 100000,
    mostLikely: 250000,
    worstCase: 500000,
    confidenceLevel: 70,
  };

  const weightedImpactScore = calculateWeightedImpact(impactDimensions);
  const overallRiskScore = calculateOverallRiskScore(
    probability,
    weightedImpactScore
  );
  const simpleEMV = calculateSimpleEMV(
    probabilityPercent,
    financialEstimate.mostLikely
  );
  const expectedMonetaryValue = calculateTriangularEMV(
    probabilityPercent,
    financialEstimate
  );
  const capitalAllocationRequired = calculateCapitalAllocation(financialEstimate);
  const ebitdaExposurePercent = calculateEBITDAExposure(
    financialEstimate.worstCase,
    config.annualEBITDA
  );
  const colour = determineRiskColour(
    overallRiskScore,
    expectedMonetaryValue,
    ebitdaExposurePercent,
    impactDimensions.legal,
    config
  );

  return {
    ...risk,
    probability,
    probabilityPercent,
    impactDimensions,
    financialEstimate,
    weightedImpactScore,
    overallRiskScore,
    simpleEMV,
    expectedMonetaryValue,
    capitalAllocationRequired,
    ebitdaExposurePercent,
    colour,
  } as Partial<StrategicRisk>;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}k`;
  }
  return value.toFixed(0);
}

/**
 * Get colour class for Tailwind
 */
export function getColourClass(colour: StrategicRiskColour): string {
  switch (colour) {
    case 'green':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'amber':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'red':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'black':
      return 'bg-slate-900 text-white border-white/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
}

/**
 * Get probability label
 */
export function getProbabilityLabel(probability: number): string {
  switch (probability) {
    case 1:
      return 'Rare';
    case 2:
      return 'Unlikely';
    case 3:
      return 'Possible';
    case 4:
      return 'Likely';
    case 5:
      return 'Almost Certain';
    default:
      return 'Unknown';
  }
}

/**
 * Get impact label
 */
export function getImpactLabel(impact: number): string {
  switch (impact) {
    case 1:
      return 'Minimal';
    case 2:
      return 'Minor';
    case 3:
      return 'Moderate';
    case 4:
      return 'Major';
    case 5:
      return 'Severe';
    default:
      return 'Unknown';
  }
}
