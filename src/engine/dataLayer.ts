// ============================================================================
// LUMINA-R v2 ENGINE — DATA LAYER
// Raw data access and type exports
// ============================================================================

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
  const { enterpriseRisks } = require('../data/enterpriseRisks');
  const { enterpriseKRIs } = require('../data/enterpriseKRIs');
  const { enterpriseControls } = require('../data/enterpriseControls');
  const { riskEvents } = require('../data/riskEvents');

  const risksWithControls = enterpriseRisks.filter((r: { riskId: number }) =>
    enterpriseControls.some((c: { mappedRiskIds: number[] }) => c.mappedRiskIds.includes(r.riskId))
  ).length;

  const risksWithKRIs = enterpriseRisks.filter((r: { riskId: number }) =>
    enterpriseKRIs.some((k: { riskId: number }) => k.riskId === r.riskId)
  ).length;

  const risksWithEvents = enterpriseRisks.filter((r: { riskId: number }) =>
    riskEvents.some((e: { relatedRiskId: number }) => e.relatedRiskId === r.riskId)
  ).length;

  return {
    totalRisks: enterpriseRisks.length,
    totalKRIs: enterpriseKRIs.length,
    totalControls: enterpriseControls.length,
    totalEvents: riskEvents.length,
    riskCoverage: {
      withControls: risksWithControls,
      withKRIs: risksWithKRIs,
      withEvents: risksWithEvents,
      controlCoveragePercent: Math.round((risksWithControls / enterpriseRisks.length) * 100),
      kriCoveragePercent: Math.round((risksWithKRIs / enterpriseRisks.length) * 100),
      eventCoveragePercent: Math.round((risksWithEvents / enterpriseRisks.length) * 100)
    },
    dataCompleteness: Math.round(
      ((risksWithControls + risksWithKRIs + risksWithEvents) / (enterpriseRisks.length * 3)) * 100
    )
  };
}
