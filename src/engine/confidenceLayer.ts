// ============================================================================
// LUMINA-R v2 ENGINE — CONFIDENCE SCORING LAYER
// Recommendation confidence scoring based on data quality and reliability
// ============================================================================

import {
  enterpriseRisks,
  type EnterpriseRisk,
  getKRIsByRiskId,
  getControlsByRiskId,
  getEventsByRiskId
} from './dataLayer';

// ============================================================================
// CONFIDENCE CONFIGURATION
// ============================================================================

export const CONFIDENCE_CONFIG = {
  // Weight factors for confidence components
  weights: {
    dataCompleteness: 0.25,
    kriStability: 0.20,
    controlMaturity: 0.25,
    eventRecency: 0.15,
    assessmentFreshness: 0.15
  },
  // KRI stability thresholds
  kriStability: {
    stableThreshold: 0.7,    // 70%+ stable KRIs = high stability
    volatileThreshold: 0.4   // <40% stable = volatile
  },
  // Control maturity scoring
  controlMaturity: {
    automatedBonus: 20,
    highEffectivenessBonus: 15,
    documentedBonus: 10
  },
  // Event recency (days)
  eventRecency: {
    recentThreshold: 90,     // Events within 90 days
    historicalThreshold: 365 // Events within 1 year
  },
  // Confidence thresholds
  confidenceLevels: {
    high: 80,
    medium: 60,
    low: 40
  }
};

// ============================================================================
// CONFIDENCE SCORE TYPES
// ============================================================================

export interface ConfidenceScore {
  overallScore: number;  // 0-100
  level: 'High' | 'Medium' | 'Low' | 'Very Low';
  components: {
    dataCompleteness: number;
    kriStability: number;
    controlMaturity: number;
    eventRecency: number;
    assessmentFreshness: number;
  };
  factors: {
    positive: string[];
    negative: string[];
  };
  recommendation: string;
}

export interface RiskConfidenceAssessment {
  riskId: number;
  riskDescription: string;
  category: string;
  emvConfidence: ConfidenceScore;
  dataQuality: {
    hasKRIs: boolean;
    kriCount: number;
    hasControls: boolean;
    controlCount: number;
    hasEvents: boolean;
    eventCount: number;
  };
}

// ============================================================================
// CONFIDENCE COMPONENT CALCULATORS
// ============================================================================

function calculateDataCompleteness(risk: EnterpriseRisk): number {
  const kris = getKRIsByRiskId(risk.riskId);
  const controls = getControlsByRiskId(risk.riskId);
  const events = getEventsByRiskId(risk.riskId);

  let score = 0;

  // KRI coverage (30 points max)
  if (kris.length >= 3) score += 30;
  else if (kris.length >= 1) score += 20;
  else score += 0;

  // Control coverage (40 points max)
  if (controls.length >= 2) score += 40;
  else if (controls.length >= 1) score += 25;
  else score += 0;

  // Event history (30 points max)
  if (events.length >= 2) score += 30;
  else if (events.length >= 1) score += 20;
  else score += 10; // Some base score even without events

  return score;
}

function calculateKRIStability(risk: EnterpriseRisk): number {
  const kris = getKRIsByRiskId(risk.riskId);

  if (kris.length === 0) return 50; // Neutral if no KRIs

  const stableCount = kris.filter(k => k.trend === 'Stable' || k.trend === 'Down').length;
  const stableRatio = stableCount / kris.length;

  // Score based on stability
  if (stableRatio >= CONFIDENCE_CONFIG.kriStability.stableThreshold) return 100;
  if (stableRatio >= CONFIDENCE_CONFIG.kriStability.volatileThreshold) return 70;
  return 40;
}

function calculateControlMaturity(risk: EnterpriseRisk): number {
  const controls = getControlsByRiskId(risk.riskId);

  if (controls.length === 0) return 30; // Low score if no controls

  let score = 50; // Base score

  // Automation bonus
  const automatedCount = controls.filter(c => c.automationLevel === 'Automated').length;
  if (automatedCount > 0) {
    score += Math.min(CONFIDENCE_CONFIG.controlMaturity.automatedBonus,
      (automatedCount / controls.length) * CONFIDENCE_CONFIG.controlMaturity.automatedBonus);
  }

  // High effectiveness bonus
  const avgEffectiveness = controls.reduce((sum, c) => sum + (c.effectivenessScore || 50), 0) / controls.length;
  if (avgEffectiveness >= 80) score += CONFIDENCE_CONFIG.controlMaturity.highEffectivenessBonus;
  else if (avgEffectiveness >= 60) score += 8;

  // Multiple controls bonus
  if (controls.length >= 2) score += 10;

  return Math.min(100, score);
}

function calculateEventRecency(risk: EnterpriseRisk): number {
  const events = getEventsByRiskId(risk.riskId);

  if (events.length === 0) return 60; // Moderate confidence without events

  const now = Date.now();
  const recentThreshold = now - (CONFIDENCE_CONFIG.eventRecency.recentThreshold * 24 * 60 * 60 * 1000);
  const historicalThreshold = now - (CONFIDENCE_CONFIG.eventRecency.historicalThreshold * 24 * 60 * 60 * 1000);

  const recentEvents = events.filter(e => new Date(e.eventDate).getTime() > recentThreshold);
  const historicalEvents = events.filter(e =>
    new Date(e.eventDate).getTime() > historicalThreshold &&
    new Date(e.eventDate).getTime() <= recentThreshold
  );

  // Recent events provide high confidence (validates current assessment)
  if (recentEvents.length > 0) return 90;

  // Historical events provide moderate confidence
  if (historicalEvents.length > 0) return 75;

  // Older events provide some validation
  return 55;
}

function calculateAssessmentFreshness(): number {
  // Simulated assessment freshness (in production, would check last update timestamps)
  // For now, assume 80% freshness score
  return 80;
}

// ============================================================================
// MAIN CONFIDENCE CALCULATION
// ============================================================================

export function calculateConfidenceScore(risk: EnterpriseRisk): ConfidenceScore {
  const components = {
    dataCompleteness: calculateDataCompleteness(risk),
    kriStability: calculateKRIStability(risk),
    controlMaturity: calculateControlMaturity(risk),
    eventRecency: calculateEventRecency(risk),
    assessmentFreshness: calculateAssessmentFreshness()
  };

  // Weighted average
  const overallScore = Math.round(
    components.dataCompleteness * CONFIDENCE_CONFIG.weights.dataCompleteness +
    components.kriStability * CONFIDENCE_CONFIG.weights.kriStability +
    components.controlMaturity * CONFIDENCE_CONFIG.weights.controlMaturity +
    components.eventRecency * CONFIDENCE_CONFIG.weights.eventRecency +
    components.assessmentFreshness * CONFIDENCE_CONFIG.weights.assessmentFreshness
  );

  // Determine level
  let level: ConfidenceScore['level'];
  if (overallScore >= CONFIDENCE_CONFIG.confidenceLevels.high) level = 'High';
  else if (overallScore >= CONFIDENCE_CONFIG.confidenceLevels.medium) level = 'Medium';
  else if (overallScore >= CONFIDENCE_CONFIG.confidenceLevels.low) level = 'Low';
  else level = 'Very Low';

  // Identify factors
  const positive: string[] = [];
  const negative: string[] = [];

  if (components.dataCompleteness >= 80) positive.push('Comprehensive data coverage');
  else if (components.dataCompleteness < 50) negative.push('Limited data coverage');

  if (components.kriStability >= 80) positive.push('Stable KRI trends');
  else if (components.kriStability < 50) negative.push('Volatile KRI indicators');

  if (components.controlMaturity >= 80) positive.push('Mature control framework');
  else if (components.controlMaturity < 50) negative.push('Control gaps identified');

  if (components.eventRecency >= 80) positive.push('Recent event validation');
  else if (components.eventRecency < 60) negative.push('Limited event history');

  // Generate recommendation
  let recommendation: string;
  if (level === 'High') {
    recommendation = 'High confidence in assessment. Proceed with recommendations.';
  } else if (level === 'Medium') {
    recommendation = 'Moderate confidence. Consider validating key assumptions before major decisions.';
  } else if (level === 'Low') {
    recommendation = 'Low confidence. Recommend additional data gathering and expert validation.';
  } else {
    recommendation = 'Very low confidence. Assessment requires significant validation before action.';
  }

  return {
    overallScore,
    level,
    components,
    factors: { positive, negative },
    recommendation
  };
}

// ============================================================================
// RISK CONFIDENCE ASSESSMENT
// ============================================================================

export function assessRiskConfidence(riskId: number): RiskConfidenceAssessment | null {
  const risk = enterpriseRisks.find(r => r.riskId === riskId);
  if (!risk) return null;

  const kris = getKRIsByRiskId(risk.riskId);
  const controls = getControlsByRiskId(risk.riskId);
  const events = getEventsByRiskId(risk.riskId);

  return {
    riskId: risk.riskId,
    riskDescription: risk.riskDescription,
    category: risk.riskCategory,
    emvConfidence: calculateConfidenceScore(risk),
    dataQuality: {
      hasKRIs: kris.length > 0,
      kriCount: kris.length,
      hasControls: controls.length > 0,
      controlCount: controls.length,
      hasEvents: events.length > 0,
      eventCount: events.length
    }
  };
}

// ============================================================================
// PORTFOLIO CONFIDENCE OVERVIEW
// ============================================================================

export interface PortfolioConfidenceOverview {
  averageConfidence: number;
  confidenceDistribution: {
    high: number;
    medium: number;
    low: number;
    veryLow: number;
  };
  lowConfidenceRisks: RiskConfidenceAssessment[];
  dataGaps: {
    risksWithoutKRIs: number;
    risksWithoutControls: number;
    risksWithoutEvents: number;
  };
  recommendations: string[];
}

export function getPortfolioConfidenceOverview(): PortfolioConfidenceOverview {
  const assessments = enterpriseRisks.map(r => assessRiskConfidence(r.riskId)!);

  const distribution = {
    high: assessments.filter(a => a.emvConfidence.level === 'High').length,
    medium: assessments.filter(a => a.emvConfidence.level === 'Medium').length,
    low: assessments.filter(a => a.emvConfidence.level === 'Low').length,
    veryLow: assessments.filter(a => a.emvConfidence.level === 'Very Low').length
  };

  const averageConfidence = Math.round(
    assessments.reduce((sum, a) => sum + a.emvConfidence.overallScore, 0) / assessments.length
  );

  const lowConfidenceRisks = assessments
    .filter(a => a.emvConfidence.level === 'Low' || a.emvConfidence.level === 'Very Low')
    .sort((a, b) => a.emvConfidence.overallScore - b.emvConfidence.overallScore)
    .slice(0, 10);

  const dataGaps = {
    risksWithoutKRIs: assessments.filter(a => !a.dataQuality.hasKRIs).length,
    risksWithoutControls: assessments.filter(a => !a.dataQuality.hasControls).length,
    risksWithoutEvents: assessments.filter(a => !a.dataQuality.hasEvents).length
  };

  // Generate recommendations
  const recommendations: string[] = [];
  if (dataGaps.risksWithoutKRIs > 20) {
    recommendations.push(`${dataGaps.risksWithoutKRIs} risks lack KRI monitoring. Priority: Establish KRIs for high-EMV risks.`);
  }
  if (dataGaps.risksWithoutControls > 10) {
    recommendations.push(`${dataGaps.risksWithoutControls} risks have no mapped controls. Review control inventory alignment.`);
  }
  if (distribution.low + distribution.veryLow > assessments.length * 0.3) {
    recommendations.push('Over 30% of risks have low confidence scores. Consider data quality improvement initiative.');
  }
  if (averageConfidence < 60) {
    recommendations.push('Portfolio average confidence below 60%. Recommend comprehensive data validation exercise.');
  }

  return {
    averageConfidence,
    confidenceDistribution: distribution,
    lowConfidenceRisks,
    dataGaps,
    recommendations
  };
}

// ============================================================================
// RECOMMENDATION CONFIDENCE WRAPPER
// ============================================================================

export interface ConfidenceWrappedRecommendation<T> {
  recommendation: T;
  confidence: ConfidenceScore;
  shouldProceed: boolean;
  caveats: string[];
}

export function wrapWithConfidence<T>(
  recommendation: T,
  associatedRiskIds: number[]
): ConfidenceWrappedRecommendation<T> {
  // Calculate aggregate confidence across associated risks
  const riskConfidences = associatedRiskIds
    .map(id => {
      const risk = enterpriseRisks.find(r => r.riskId === id);
      return risk ? calculateConfidenceScore(risk) : null;
    })
    .filter((c): c is ConfidenceScore => c !== null);

  if (riskConfidences.length === 0) {
    return {
      recommendation,
      confidence: {
        overallScore: 50,
        level: 'Medium',
        components: {
          dataCompleteness: 50,
          kriStability: 50,
          controlMaturity: 50,
          eventRecency: 50,
          assessmentFreshness: 50
        },
        factors: { positive: [], negative: ['No associated risks for validation'] },
        recommendation: 'Unable to validate recommendation confidence.'
      },
      shouldProceed: true,
      caveats: ['Recommendation confidence could not be fully validated.']
    };
  }

  const avgScore = Math.round(
    riskConfidences.reduce((sum, c) => sum + c.overallScore, 0) / riskConfidences.length
  );

  const aggregateConfidence: ConfidenceScore = {
    overallScore: avgScore,
    level: avgScore >= 80 ? 'High' : avgScore >= 60 ? 'Medium' : avgScore >= 40 ? 'Low' : 'Very Low',
    components: {
      dataCompleteness: Math.round(riskConfidences.reduce((s, c) => s + c.components.dataCompleteness, 0) / riskConfidences.length),
      kriStability: Math.round(riskConfidences.reduce((s, c) => s + c.components.kriStability, 0) / riskConfidences.length),
      controlMaturity: Math.round(riskConfidences.reduce((s, c) => s + c.components.controlMaturity, 0) / riskConfidences.length),
      eventRecency: Math.round(riskConfidences.reduce((s, c) => s + c.components.eventRecency, 0) / riskConfidences.length),
      assessmentFreshness: Math.round(riskConfidences.reduce((s, c) => s + c.components.assessmentFreshness, 0) / riskConfidences.length)
    },
    factors: {
      positive: [...new Set(riskConfidences.flatMap(c => c.factors.positive))],
      negative: [...new Set(riskConfidences.flatMap(c => c.factors.negative))]
    },
    recommendation: avgScore >= 60
      ? 'Recommendation has adequate confidence basis.'
      : 'Recommendation should be validated before implementation.'
  };

  const caveats: string[] = [];
  if (avgScore < 60) caveats.push('Confidence below recommended threshold for major decisions.');
  if (aggregateConfidence.factors.negative.length > 2) {
    caveats.push(`Multiple confidence concerns: ${aggregateConfidence.factors.negative.slice(0, 2).join(', ')}`);
  }

  return {
    recommendation,
    confidence: aggregateConfidence,
    shouldProceed: avgScore >= 50,
    caveats
  };
}
