// ============================================================================
// LUMINA-R v2 ENGINE — FORECAST LAYER
// Probability drift, control decay, trajectory projections
// ============================================================================

import { enterpriseRisks, type EnterpriseRisk, getKRIsByRiskId, getEventsByRiskId } from './dataLayer';
import {
  calculateRiskEMV,
  PROBABILITY_MAP,
  IMPACT_MAP,
  CONTROL_EFFECTIVENESS_FACTOR
} from './quantificationLayer';

// ============================================================================
// FORECAST CONFIGURATION
// ============================================================================

export const FORECAST_CONFIG = {
  // Probability drift: annual increase rate if no action taken
  probabilityDriftRate: {
    base: 0.05,        // 5% annual probability drift baseline
    adverseKRI: 0.10,  // Additional 10% if KRIs trending adversely
    recentEvent: 0.15, // Additional 15% if event in last 90 days
    outsideAppetite: 0.08 // Additional 8% if outside appetite
  },
  // Control decay: annual effectiveness reduction without maintenance
  controlDecayRate: {
    High: 0.03,   // High controls decay 3% annually
    Medium: 0.06, // Medium controls decay 6% annually
    Low: 0.10     // Low controls decay 10% annually
  },
  // Event trigger amplification
  eventAmplification: {
    recentDays: 90,
    amplificationFactor: 1.35  // 35% EMV amplification if recent event
  },
  // Velocity impact on forecast
  velocityForecastMultiplier: {
    Fast: 1.5,    // Fast risks evolve 50% quicker
    Medium: 1.0,
    Slow: 0.6     // Slow risks evolve 40% slower
  },
  // Forecast horizons in days
  horizons: [30, 90, 180, 365] as const
};

// ============================================================================
// RISK TRAJECTORY TYPES
// ============================================================================

export interface ForecastPoint {
  days: number;
  projectedProbability: number;
  projectedControlFactor: number;
  projectedInherentEMV: number;
  projectedResidualEMV: number;
  deltaFromCurrent: number;
  deltaPercent: number;
}

export interface RiskTrajectory {
  riskId: number;
  riskDescription: string;
  category: string;
  currentResidualEMV: number;
  probabilityDriftCoefficient: number;
  controlDecayCoefficient: number;
  eventAmplificationActive: boolean;
  velocityMultiplier: number;
  forecasts: ForecastPoint[];
  projectedAppetiteBreach: boolean;
  projectedBreachDay: number | null;
  riskTrend: 'Improving' | 'Stable' | 'Deteriorating' | 'Critical';
}

// ============================================================================
// COEFFICIENT CALCULATORS
// ============================================================================

function calculateProbabilityDriftCoefficient(risk: EnterpriseRisk): number {
  let coefficient = FORECAST_CONFIG.probabilityDriftRate.base;

  // Check KRI trends
  const kris = getKRIsByRiskId(risk.riskId);
  const hasAdverseKRI = kris.some(k => k.status === 'Red' && k.trend === 'Up');
  if (hasAdverseKRI) {
    coefficient += FORECAST_CONFIG.probabilityDriftRate.adverseKRI;
  }

  // Check recent events
  const events = getEventsByRiskId(risk.riskId);
  const recentThreshold = Date.now() - (FORECAST_CONFIG.eventAmplification.recentDays * 24 * 60 * 60 * 1000);
  const hasRecentEvent = events.some(e => new Date(e.eventDate).getTime() > recentThreshold);
  if (hasRecentEvent) {
    coefficient += FORECAST_CONFIG.probabilityDriftRate.recentEvent;
  }

  // Check appetite alignment
  if (risk.riskAppetiteAlignment === 'Outside Appetite') {
    coefficient += FORECAST_CONFIG.probabilityDriftRate.outsideAppetite;
  }

  return coefficient;
}

function calculateControlDecayCoefficient(risk: EnterpriseRisk): number {
  return FORECAST_CONFIG.controlDecayRate[risk.controlEffectiveness] || 0.06;
}

function hasEventAmplification(risk: EnterpriseRisk): boolean {
  const events = getEventsByRiskId(risk.riskId);
  const recentThreshold = Date.now() - (FORECAST_CONFIG.eventAmplification.recentDays * 24 * 60 * 60 * 1000);
  return events.some(e => new Date(e.eventDate).getTime() > recentThreshold);
}

// ============================================================================
// TRAJECTORY PROJECTION
// ============================================================================

function projectForecastPoint(
  risk: EnterpriseRisk,
  days: number,
  probDrift: number,
  controlDecay: number,
  velocityMult: number,
  eventAmp: boolean,
  currentEMV: number
): ForecastPoint {
  const years = days / 365;

  // Project probability (capped at 0.95)
  const currentProb = PROBABILITY_MAP[risk.likelihood];
  const projectedProbability = Math.min(
    0.95,
    currentProb * (1 + probDrift * years * velocityMult)
  );

  // Project control effectiveness (minimum 0.05)
  const currentControl = CONTROL_EFFECTIVENESS_FACTOR[risk.controlEffectiveness];
  const projectedControlFactor = Math.max(
    0.05,
    currentControl * (1 - controlDecay * years)
  );

  // Calculate projected EMV
  const impact = IMPACT_MAP[risk.impact];
  const projectedInherentEMV = Math.round(projectedProbability * impact);
  let projectedResidualEMV = Math.round(projectedInherentEMV * (1 - projectedControlFactor));

  // Apply event amplification if active
  if (eventAmp && days <= 180) {
    projectedResidualEMV = Math.round(projectedResidualEMV * FORECAST_CONFIG.eventAmplification.amplificationFactor);
  }

  const deltaFromCurrent = projectedResidualEMV - currentEMV;
  const deltaPercent = Math.round((deltaFromCurrent / currentEMV) * 100);

  return {
    days,
    projectedProbability: Math.round(projectedProbability * 100) / 100,
    projectedControlFactor: Math.round(projectedControlFactor * 100) / 100,
    projectedInherentEMV,
    projectedResidualEMV,
    deltaFromCurrent,
    deltaPercent
  };
}

// ============================================================================
// MAIN FORECAST FUNCTION
// ============================================================================

export function forecastRiskTrajectory(riskId: number): RiskTrajectory | null {
  const risk = enterpriseRisks.find(r => r.riskId === riskId);
  if (!risk) return null;

  const currentEMV = calculateRiskEMV(risk);
  const probDrift = calculateProbabilityDriftCoefficient(risk);
  const controlDecay = calculateControlDecayCoefficient(risk);
  const velocityMult = FORECAST_CONFIG.velocityForecastMultiplier[risk.velocity];
  const eventAmp = hasEventAmplification(risk);

  const forecasts = FORECAST_CONFIG.horizons.map(days =>
    projectForecastPoint(risk, days, probDrift, controlDecay, velocityMult, eventAmp, currentEMV.residualEMV)
  );

  // Determine if appetite breach is projected
  const appetiteThreshold = risk.riskAppetiteAlignment === 'Within Appetite'
    ? currentEMV.residualEMV * 1.5  // 50% increase would breach
    : currentEMV.residualEMV;       // Already breached

  let projectedBreachDay: number | null = null;
  for (const forecast of forecasts) {
    if (forecast.projectedResidualEMV > appetiteThreshold && risk.riskAppetiteAlignment === 'Within Appetite') {
      projectedBreachDay = forecast.days;
      break;
    }
  }

  // Determine risk trend
  const trend365 = forecasts.find(f => f.days === 365);
  let riskTrend: RiskTrajectory['riskTrend'];
  if (!trend365) {
    riskTrend = 'Stable';
  } else if (trend365.deltaPercent <= -10) {
    riskTrend = 'Improving';
  } else if (trend365.deltaPercent <= 10) {
    riskTrend = 'Stable';
  } else if (trend365.deltaPercent <= 30) {
    riskTrend = 'Deteriorating';
  } else {
    riskTrend = 'Critical';
  }

  return {
    riskId: risk.riskId,
    riskDescription: risk.riskDescription,
    category: risk.riskCategory,
    currentResidualEMV: currentEMV.residualEMV,
    probabilityDriftCoefficient: Math.round(probDrift * 100) / 100,
    controlDecayCoefficient: Math.round(controlDecay * 100) / 100,
    eventAmplificationActive: eventAmp,
    velocityMultiplier: velocityMult,
    forecasts,
    projectedAppetiteBreach: risk.riskAppetiteAlignment === 'Outside Appetite' || projectedBreachDay !== null,
    projectedBreachDay,
    riskTrend
  };
}

// ============================================================================
// PORTFOLIO FORECAST
// ============================================================================

export interface PortfolioForecast {
  horizon: number;
  currentTotalEMV: number;
  projectedTotalEMV: number;
  deltaEMV: number;
  deltaPercent: number;
  criticalRisksCount: number;
  deterioratingRisksCount: number;
  projectedBreachesCount: number;
}

export function forecastPortfolio(): PortfolioForecast[] {
  const trajectories = enterpriseRisks
    .map(r => forecastRiskTrajectory(r.riskId))
    .filter((t): t is RiskTrajectory => t !== null);

  const currentTotal = trajectories.reduce((sum, t) => sum + t.currentResidualEMV, 0);

  return FORECAST_CONFIG.horizons.map(horizon => {
    const projectedTotal = trajectories.reduce((sum, t) => {
      const forecast = t.forecasts.find(f => f.days === horizon);
      return sum + (forecast?.projectedResidualEMV || t.currentResidualEMV);
    }, 0);

    return {
      horizon,
      currentTotalEMV: currentTotal,
      projectedTotalEMV: projectedTotal,
      deltaEMV: projectedTotal - currentTotal,
      deltaPercent: Math.round(((projectedTotal - currentTotal) / currentTotal) * 100),
      criticalRisksCount: trajectories.filter(t => t.riskTrend === 'Critical').length,
      deterioratingRisksCount: trajectories.filter(t => t.riskTrend === 'Deteriorating').length,
      projectedBreachesCount: trajectories.filter(t =>
        t.projectedBreachDay !== null && t.projectedBreachDay <= horizon
      ).length
    };
  });
}

// ============================================================================
// TOP DETERIORATING RISKS
// ============================================================================

export function getTopDeterioratingRisks(limit: number = 10): RiskTrajectory[] {
  return enterpriseRisks
    .map(r => forecastRiskTrajectory(r.riskId))
    .filter((t): t is RiskTrajectory => t !== null)
    .filter(t => t.riskTrend === 'Critical' || t.riskTrend === 'Deteriorating')
    .sort((a, b) => {
      const aForecast = a.forecasts.find(f => f.days === 365);
      const bForecast = b.forecasts.find(f => f.days === 365);
      return (bForecast?.deltaPercent || 0) - (aForecast?.deltaPercent || 0);
    })
    .slice(0, limit);
}

// ============================================================================
// IMMINENT BREACH WARNINGS
// ============================================================================

export interface BreachWarning {
  riskId: number;
  riskDescription: string;
  category: string;
  currentEMV: number;
  projectedBreachDay: number;
  projectedEMVAtBreach: number;
  urgency: 'Immediate' | 'Near-term' | 'Medium-term';
}

export function getImminentBreachWarnings(): BreachWarning[] {
  return enterpriseRisks
    .map(r => forecastRiskTrajectory(r.riskId))
    .filter((t): t is RiskTrajectory => t !== null && t.projectedBreachDay !== null)
    .map(t => {
      const breachForecast = t.forecasts.find(f => f.days >= (t.projectedBreachDay || 0));
      let urgency: BreachWarning['urgency'];
      if (t.projectedBreachDay! <= 30) urgency = 'Immediate';
      else if (t.projectedBreachDay! <= 90) urgency = 'Near-term';
      else urgency = 'Medium-term';

      return {
        riskId: t.riskId,
        riskDescription: t.riskDescription,
        category: t.category,
        currentEMV: t.currentResidualEMV,
        projectedBreachDay: t.projectedBreachDay!,
        projectedEMVAtBreach: breachForecast?.projectedResidualEMV || t.currentResidualEMV,
        urgency
      };
    })
    .sort((a, b) => a.projectedBreachDay - b.projectedBreachDay);
}
