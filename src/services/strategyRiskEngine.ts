// Strategy Implementation Risk Engine
// Calculates SCI, IRS, SEFS, CSRS, SDI, PSU for strategic initiatives

import type {
  StrategicInitiative,
  SCIResult,
  SCIClassification,
  IRSResult,
  IRSClassification,
  SEFSResult,
  CSRSResult,
  SDIResult,
  PSUResult,
  PSURiskBand,
  InitiativeAnalysis,
  BoardIntelligence,
  InterventionScenario,
} from '../types';

// ============================================
// SECTION 1: STRATEGIC COMPLEXITY INDEX (SCI)
// ============================================

/**
 * SCI = (Dependency Density × 0.30) + (Technology Novelty × 0.20)
 *     + (Org Change Magnitude × 0.25) + (External Uncertainty × 0.25)
 */
export function calculateSCI(initiative: StrategicInitiative): SCIResult {
  const dd = initiative.dependencyDensity * 0.30;
  const tn = initiative.technologyNovelty * 0.20;
  const oc = initiative.organisationalChangeMagnitude * 0.25;
  const eu = initiative.externalUncertainty * 0.25;
  const score = Math.round((dd + tn + oc + eu) * 100) / 100;

  let classification: SCIClassification;
  if (score >= 4) classification = 'extreme';
  else if (score >= 3) classification = 'high';
  else if (score >= 2) classification = 'moderate';
  else classification = 'low';

  return {
    score,
    classification,
    breakdown: {
      dependencyDensity: dd,
      technologyNovelty: tn,
      organisationalChange: oc,
      externalUncertainty: eu,
    },
  };
}

export function getSCIColour(classification: SCIClassification): string {
  switch (classification) {
    case 'extreme': return 'bg-slate-900 text-white border-white/30';
    case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'moderate': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  }
}

// ============================================
// SECTION 2: IMPLEMENTATION READINESS SCORE (IRS)
// ============================================

/**
 * IRS = weighted composite of 6 readiness variables (0-100 each)
 */
export function calculateIRS(initiative: StrategicInitiative): IRSResult {
  const weights = {
    capabilityAlignment: 0.20,
    talentCapacity: 0.18,
    digitalMaturity: 0.15,
    capitalSecurity: 0.20,
    stakeholderAlignment: 0.15,
    governanceMaturity: 0.12,
  };

  const components = {
    capabilityAlignment: initiative.capabilityAlignmentScore * weights.capabilityAlignment,
    talentCapacity: initiative.talentCapacityRatio * weights.talentCapacity,
    digitalMaturity: initiative.digitalMaturityIndex * weights.digitalMaturity,
    capitalSecurity: initiative.capitalSecurityRatio * weights.capitalSecurity,
    stakeholderAlignment: initiative.stakeholderAlignmentScore * weights.stakeholderAlignment,
    governanceMaturity: initiative.governanceMaturityScore * weights.governanceMaturity,
  };

  const score = Math.round(
    (components.capabilityAlignment +
      components.talentCapacity +
      components.digitalMaturity +
      components.capitalSecurity +
      components.stakeholderAlignment +
      components.governanceMaturity) * 100
  ) / 100;

  let classification: IRSClassification;
  if (score > 75) classification = 'ready';
  else if (score >= 50) classification = 'vulnerable';
  else classification = 'high_failure_risk';

  return { score, classification, breakdown: components };
}

export function getIRSColour(classification: IRSClassification): string {
  switch (classification) {
    case 'ready': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'vulnerable': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'high_failure_risk': return 'bg-red-500/20 text-red-400 border-red-500/30';
  }
}

export function getIRSLabel(classification: IRSClassification): string {
  switch (classification) {
    case 'ready': return 'Ready';
    case 'vulnerable': return 'Vulnerable';
    case 'high_failure_risk': return 'High Failure Risk';
  }
}

// ============================================
// SECTION 3: STRATEGIC EXECUTION FRAGILITY SCORE (SEFS)
// ============================================

const SEFS_STRUCTURAL_THRESHOLD = 65;

/**
 * SEFS = weighted aggregate of fragility inputs
 */
export function calculateSEFS(initiative: StrategicInitiative): SEFSResult {
  // Normalise critical path dependencies (cap at 10 = 100)
  const cpNorm = Math.min(100, initiative.criticalPathDependencies * 10);
  const cfNorm = initiative.crossFunctionalIntensity * 20;
  const crNorm = initiative.culturalResistanceIndicator * 20;
  const ltNorm = initiative.leadershipTurnoverProbability;
  const cfatigueNorm = initiative.changeFatigueIndex * 20;

  const weights = {
    criticalPath: 0.25,
    crossFunctional: 0.20,
    culturalResistance: 0.20,
    leadershipTurnover: 0.15,
    changeFatigue: 0.20,
  };

  const components = {
    criticalPath: cpNorm * weights.criticalPath,
    crossFunctional: cfNorm * weights.crossFunctional,
    culturalResistance: crNorm * weights.culturalResistance,
    leadershipTurnover: ltNorm * weights.leadershipTurnover,
    changeFatigue: cfatigueNorm * weights.changeFatigue,
  };

  const score = Math.round(
    (components.criticalPath +
      components.crossFunctional +
      components.culturalResistance +
      components.leadershipTurnover +
      components.changeFatigue) * 100
  ) / 100;

  return {
    score,
    isStructuralRisk: score > SEFS_STRUCTURAL_THRESHOLD,
    breakdown: components,
  };
}

// ============================================
// SECTION 4: CAPITAL SEQUENCING RISK SCORE (CSRS)
// ============================================

/**
 * CSRS = (Spend Timing Mismatch × 0.4) + (Liquidity Buffer Stress × 0.3) + (Earnings Volatility × 0.3)
 */
export function calculateCSRS(
  initiative: StrategicInitiative,
  _annualEBITDA: number = 50_000_000
): CSRSResult {
  // Spend timing mismatch: how front-loaded is spending vs cash flow?
  const totalPlanned = initiative.plannedSpendCurve.reduce((s, v) => s + v, 0);
  const first6Spend = initiative.plannedSpendCurve.slice(0, 6).reduce((s, v) => s + v, 0);
  const frontLoadRatio = totalPlanned > 0 ? first6Spend / totalPlanned : 0;
  const cashCoverRatio = initiative.cashFlowAvailability > 0
    ? (totalPlanned / 12) / initiative.cashFlowAvailability
    : 1;
  const spendTimingMismatch = Math.min(100, (frontLoadRatio * 50 + cashCoverRatio * 50));

  // Liquidity buffer stress
  const liquidityBufferStress = Math.min(100, Math.max(0, 100 - initiative.debtCovenantHeadroom * 2));

  // Earnings volatility: EBITDA sensitivity to spend
  const earningsVolatility = Math.min(
    100,
    initiative.ebitdaSensitivity * (totalPlanned / 1_000_000) * 5
  );

  const score = Math.round(
    (spendTimingMismatch * 0.4 + liquidityBufferStress * 0.3 + earningsVolatility * 0.3) * 100
  ) / 100;

  // Liquidity runway
  const monthlyBurn = totalPlanned / Math.max(initiative.timeHorizonMonths, 1);
  const liquidityRunwayMonths = monthlyBurn > 0
    ? Math.round(initiative.cashFlowAvailability / monthlyBurn * 12)
    : 999;

  const capitalBufferRequired = Math.round(totalPlanned * 0.2); // 20% buffer

  // Check if delay scenario triggered (initiative > 6 months behind)
  const expectedProgress = Math.min(100,
    ((Date.now() - new Date(initiative.startDate).getTime()) /
      (new Date(initiative.expectedEndDate).getTime() - new Date(initiative.startDate).getTime())) * 100
  );
  const delayTriggered = initiative.actualProgress < expectedProgress - 25;

  return {
    score,
    spendTimingMismatch: Math.round(spendTimingMismatch * 100) / 100,
    liquidityBufferStress: Math.round(liquidityBufferStress * 100) / 100,
    earningsVolatility: Math.round(earningsVolatility * 100) / 100,
    liquidityRunwayMonths,
    capitalBufferRequired,
    delayTriggered,
  };
}

// ============================================
// SECTION 5: STRATEGIC DRIFT INDEX (SDI)
// ============================================

const SDI_BOARD_THRESHOLD = 30;

/**
 * SDI = deviation % weighted by strategic importance
 */
export function calculateSDI(initiative: StrategicInitiative): SDIResult {
  // KPI deviations
  const kpiDeviations = initiative.intendedKPIs.map((kpi) => {
    const deviation = kpi.target !== 0
      ? Math.abs((kpi.actual - kpi.target) / kpi.target) * 100
      : 0;
    return { name: kpi.name, deviation: Math.round(deviation * 100) / 100, weight: kpi.weight };
  });

  const totalWeight = kpiDeviations.reduce((s, k) => s + k.weight, 0);
  const weightedDeviation = totalWeight > 0
    ? kpiDeviations.reduce((s, k) => s + k.deviation * k.weight, 0) / totalWeight
    : 0;

  // External threats contribute to drift
  const externalFactor =
    (initiative.competitorMovementScore +
      initiative.technologyDisplacementRisk +
      initiative.regulatoryShiftExposure) / 30 * 20; // Scale to max 20%

  const score = Math.min(100, Math.round((weightedDeviation + externalFactor) * 100) / 100);

  return {
    score,
    driftPercentage: Math.round(weightedDeviation * 100) / 100,
    boardVisibilityTriggered: score > SDI_BOARD_THRESHOLD,
    kpiDeviations,
    externalThreats: {
      competitorMovement: initiative.competitorMovementScore,
      technologyDisplacement: initiative.technologyDisplacementRisk,
      regulatoryShift: initiative.regulatoryShiftExposure,
    },
  };
}

// ============================================
// SECTION 6: PROBABILITY OF STRATEGIC UNDERPERFORMANCE (PSU)
// ============================================

/**
 * PSU = f(SCI, IRS, SEFS, CSRS, SDI) using weighted regression
 */
export function calculatePSU(
  sci: SCIResult,
  irs: IRSResult,
  sefs: SEFSResult,
  csrs: CSRSResult,
  sdi: SDIResult
): PSUResult {
  // Normalise SCI to 0-100 (currently 1-5 scale)
  const sciNorm = (sci.score / 5) * 100;

  // IRS is inverted (higher = better, but for failure probability we need higher = worse)
  const irsInverted = 100 - irs.score;

  const weights = {
    sci: 0.15,
    irs: 0.25,
    sefs: 0.25,
    csrs: 0.20,
    sdi: 0.15,
  };

  const raw =
    sciNorm * weights.sci +
    irsInverted * weights.irs +
    sefs.score * weights.sefs +
    csrs.score * weights.csrs +
    sdi.score * weights.sdi;

  const failureProbability = Math.min(100, Math.max(0, Math.round(raw * 100) / 100));

  // Confidence interval (wider for more uncertain data)
  const uncertainty = (sci.score / 5) * 10; // Higher complexity = wider CI
  const confidenceInterval = {
    lower: Math.max(0, Math.round((failureProbability - uncertainty) * 100) / 100),
    upper: Math.min(100, Math.round((failureProbability + uncertainty) * 100) / 100),
  };

  let riskBand: PSURiskBand;
  if (failureProbability > 60) riskBand = 'black';
  else if (failureProbability > 40) riskBand = 'red';
  else if (failureProbability > 20) riskBand = 'amber';
  else riskBand = 'green';

  return {
    failureProbability,
    confidenceInterval,
    riskBand,
    componentWeights: weights,
  };
}

export function getPSUBandColour(band: PSURiskBand): string {
  switch (band) {
    case 'green': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'amber': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'red': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'black': return 'bg-slate-900 text-white border-white/30';
  }
}

// ============================================
// SECTION 7: INTERVENTION SIMULATOR
// ============================================

/**
 * Simulate intervention effects on an initiative and recalculate PSU
 */
export function simulateIntervention(
  initiative: StrategicInitiative,
  intervention: InterventionScenario,
  annualEBITDA: number = 50_000_000
): { before: InitiativeAnalysis; after: InitiativeAnalysis; delta: { psuChange: number; roiOfIntervention: number; stabilisationMonths: number } } {
  const before = analyseInitiative(initiative, annualEBITDA);

  // Create modified initiative
  const modified: StrategicInitiative = {
    ...initiative,
    totalInvestment: initiative.totalInvestment + intervention.capitalIncrease + intervention.capabilityInvestment,
    capitalSecurityRatio: Math.min(100, initiative.capitalSecurityRatio + (intervention.capitalIncrease / initiative.totalInvestment) * 30),
    capabilityAlignmentScore: Math.min(100, initiative.capabilityAlignmentScore + (intervention.capabilityInvestment / 100_000) * 5),
    stakeholderAlignmentScore: Math.min(100, initiative.stakeholderAlignmentScore + intervention.leadershipSupport * 0.3),
    organisationalChangeMagnitude: Math.max(1, initiative.organisationalChangeMagnitude - (intervention.scopeReduction / 25)),
    dependencyDensity: Math.max(1, initiative.dependencyDensity - (intervention.scopeReduction / 30)),
    changeFatigueIndex: Math.max(1, initiative.changeFatigueIndex - (intervention.phaseRollout > 0 ? 1 : 0)),
    timeHorizonMonths: initiative.timeHorizonMonths + intervention.phaseRollout,
    governanceMaturityScore: Math.min(100, initiative.governanceMaturityScore + intervention.leadershipSupport * 0.2),
  };

  const after = analyseInitiative(modified, annualEBITDA);

  const psuChange = after.psu.failureProbability - before.psu.failureProbability;
  const interventionCost = intervention.capitalIncrease + intervention.capabilityInvestment;
  const valueProtected = (before.psu.failureProbability - after.psu.failureProbability) / 100 * initiative.totalInvestment;
  const roiOfIntervention = interventionCost > 0
    ? Math.round(((valueProtected - interventionCost) / interventionCost) * 10000) / 100
    : 0;

  const stabilisationMonths = Math.max(3, Math.round(intervention.phaseRollout + Math.abs(psuChange) * 0.5));

  return {
    before,
    after,
    delta: { psuChange: Math.round(psuChange * 100) / 100, roiOfIntervention, stabilisationMonths },
  };
}

// ============================================
// COMBINED ANALYSIS
// ============================================

/**
 * Full analysis of a single initiative
 */
export function analyseInitiative(
  initiative: StrategicInitiative,
  annualEBITDA: number = 50_000_000
): InitiativeAnalysis {
  const sci = calculateSCI(initiative);
  const irs = calculateIRS(initiative);
  const sefs = calculateSEFS(initiative);
  const csrs = calculateCSRS(initiative, annualEBITDA);
  const sdi = calculateSDI(initiative);
  const psu = calculatePSU(sci, irs, sefs, csrs, sdi);

  return { initiative, sci, irs, sefs, csrs, sdi, psu };
}

// ============================================
// SECTION 8: BOARD INTELLIGENCE
// ============================================

/**
 * Generate board-level intelligence across all initiatives
 */
export function generateBoardIntelligence(
  analyses: InitiativeAnalysis[]
): BoardIntelligence {
  if (analyses.length === 0) {
    return {
      totalCapitalDeployed: 0,
      averageIRS: 0,
      averageSEFS: 0,
      portfolioPSU: 0,
      strategicResilienceIndex: 100,
      top3FragileInitiatives: [],
      capitalAtRisk: 0,
      probabilityWeightedValueErosion: 0,
    };
  }

  const totalCapitalDeployed = analyses.reduce(
    (s, a) => s + a.initiative.totalInvestment * (a.initiative.actualProgress / 100),
    0
  );

  const averageIRS = analyses.reduce((s, a) => s + a.irs.score, 0) / analyses.length;
  const averageSEFS = analyses.reduce((s, a) => s + a.sefs.score, 0) / analyses.length;

  // Portfolio PSU: weighted by investment size
  const totalInvestment = analyses.reduce((s, a) => s + a.initiative.totalInvestment, 0);
  const portfolioPSU = totalInvestment > 0
    ? analyses.reduce(
        (s, a) => s + a.psu.failureProbability * (a.initiative.totalInvestment / totalInvestment),
        0
      )
    : 0;

  // Resilience = inverse of PSU
  const strategicResilienceIndex = Math.round((100 - portfolioPSU) * 100) / 100;

  // Top 3 most fragile
  const sorted = [...analyses].sort(
    (a, b) => b.psu.failureProbability - a.psu.failureProbability
  );
  const top3FragileInitiatives = sorted.slice(0, 3);

  // Capital at risk: sum of investment × failure probability
  const capitalAtRisk = analyses.reduce(
    (s, a) => s + a.initiative.totalInvestment * (a.psu.failureProbability / 100),
    0
  );

  // Probability-weighted value erosion
  const probabilityWeightedValueErosion = analyses.reduce(
    (s, a) => s + a.initiative.totalInvestment * (a.psu.failureProbability / 100) * (a.sdi.score / 100),
    0
  );

  return {
    totalCapitalDeployed: Math.round(totalCapitalDeployed),
    averageIRS: Math.round(averageIRS * 100) / 100,
    averageSEFS: Math.round(averageSEFS * 100) / 100,
    portfolioPSU: Math.round(portfolioPSU * 100) / 100,
    strategicResilienceIndex,
    top3FragileInitiatives,
    capitalAtRisk: Math.round(capitalAtRisk),
    probabilityWeightedValueErosion: Math.round(probabilityWeightedValueErosion),
  };
}
