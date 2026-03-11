// ============================================================================
// LUMINA-R v2 ENGINE — DATA LAYER
// Raw data access and type exports
// ============================================================================

import {
  enterpriseRisks as _enterpriseRisks,
  type EnterpriseRisk
} from '../data/enterpriseRisks';

import {
  enterpriseKRIs as _enterpriseKRIs,
  type EnterpriseKRI
} from '../data/enterpriseKRIs';

import {
  enterpriseControls as _enterpriseControls,
  type EnterpriseControl
} from '../data/enterpriseControls';

import {
  riskEvents as _riskEvents,
  type RiskEvent
} from '../data/riskEvents';

// Re-export all data sources
export {
  enterpriseRisks,
  getRiskById,
  getRisksByCategory,
  getHighRisks,
  getEscalatedRisks,
  getOutsideAppetiteRisks,
  getRisksByOwner,
  getRisksByRegion,
  getRiskStats,
  type EnterpriseRisk
} from '../data/enterpriseRisks';

export {
  enterpriseKRIs,
  getKRIById,
  getKRIsByRiskId,
  getBreachedKRIs,
  getKRIsByStatus,
  getKRIsWithTrend,
  getKRIStats,
  getKRIHealthScore,
  type EnterpriseKRI
} from '../data/enterpriseKRIs';

export {
  enterpriseControls,
  getControlById,
  getControlsByRiskId,
  getControlsByType,
  getControlsByOwner,
  getAutomatedControls,
  getManualControls,
  getControlStats,
  getControlEffectivenessScore,
  type EnterpriseControl
} from '../data/enterpriseControls';

export {
  riskAppetite,
  getAppetiteByCategory,
  getBreachedAppetites,
  getApproachingAppetites,
  getAppetiteStatusCounts
} from '../data/appetite';

export {
  riskEvents,
  getEventById,
  getEventsByRiskId,
  getRecentEvents,
  getHighImpactEvents,
  getEventStats,
  type RiskEvent
} from '../data/riskEvents';

// ============================================================================
// DATA LAYER CONFIGURATION
// ============================================================================

export const DATA_CONFIG = {
  totalRisks: 200,
  totalKRIs: 300,
  totalControls: 150,
  appetiteCategories: 6,
  regions: ['Nigeria', 'UK', 'US', 'EU', 'Global'],
  riskCategories: [
    'Financial',
    'Operational',
    'Strategic',
    'Compliance',
    'Third Party',
    'Reputational',
    'AI Ethics',
    'People',
    'Cybersecurity'
  ] as const,
  riskOwners: ['CRO', 'CISO', 'CFO', 'COO', 'Head of AI', 'HR Director']
};

// ============================================================================
// DATA QUALITY METRICS
// ============================================================================

export function getDataQualityMetrics() {
  // Use the imported data
  const risksData: EnterpriseRisk[] = _enterpriseRisks;
  const krisData: EnterpriseKRI[] = _enterpriseKRIs;
  const controlsData: EnterpriseControl[] = _enterpriseControls;
  const eventsData: RiskEvent[] = _riskEvents;

  const risksWithControls = risksData.filter((r) =>
    controlsData.some((c) => c.mappedRiskIds.includes(r.riskId))
  ).length;

  const risksWithKRIs = risksData.filter((r) =>
    krisData.some((k) => k.riskId === r.riskId)
  ).length;

  const risksWithEvents = risksData.filter((r) =>
    eventsData.some((e) => e.relatedRiskId === r.riskId)
  ).length;

  return {
    totalRisks: risksData.length,
    totalKRIs: krisData.length,
    totalControls: controlsData.length,
    totalEvents: eventsData.length,
    riskCoverage: {
      withControls: risksWithControls,
      withKRIs: risksWithKRIs,
      withEvents: risksWithEvents,
      controlCoveragePercent: Math.round((risksWithControls / risksData.length) * 100),
      kriCoveragePercent: Math.round((risksWithKRIs / risksData.length) * 100),
      eventCoveragePercent: Math.round((risksWithEvents / risksData.length) * 100)
    },
    dataCompleteness: Math.round(
      ((risksWithControls + risksWithKRIs + risksWithEvents) / (risksData.length * 3)) * 100
    )
  };
}
