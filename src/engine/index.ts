// ============================================================================
// LUMINA-R v2 ENGINE — MAIN EXPORT INDEX
// Enterprise Risk Intelligence & Optimisation Engine
// ============================================================================

// ============================================================================
// DATA LAYER
// ============================================================================
export * from './dataLayer';

// ============================================================================
// QUANTIFICATION LAYER
// ============================================================================
export {
  // Types
  type RiskEMV,
  type PortfolioEMV,
  type CategoryEMV,
  type AppetiteBreachDelta,
  type EscalationScore,
  type RankedRisk,
  // Constants
  PROBABILITY_MAP,
  IMPACT_MAP,
  CONTROL_EFFECTIVENESS_FACTOR,
  VELOCITY_MULTIPLIER,
  // Functions
  calculateRiskEMV,
  calculatePortfolioEMV,
  calculateCategoryEMV,
  calculateAppetiteBreachDeltas,
  calculateEscalationScore,
  getTopRisksByEMV,
  getQuantificationSummary
} from './quantificationLayer';

// ============================================================================
// FORECAST LAYER
// ============================================================================
export {
  // Types
  type ForecastPoint,
  type RiskTrajectory,
  type PortfolioForecast,
  type BreachWarning,
  // Configuration
  FORECAST_CONFIG,
  // Functions
  forecastRiskTrajectory,
  forecastPortfolio,
  getTopDeterioratingRisks,
  getImminentBreachWarnings
} from './forecastLayer';

// ============================================================================
// OPTIMISATION LAYER
// ============================================================================
export {
  // Types
  type MarginalEMVAnalysis,
  type InvestmentRecommendation,
  type CapitalAllocationResult,
  type QuickWin,
  type InvestmentScenario,
  // Configuration
  OPTIMISATION_CONFIG,
  // Functions
  calculateMarginalEMV,
  optimizeCapitalAllocation,
  identifyQuickWins,
  compareInvestmentScenarios,
  optimizeCategoryAllocation
} from './optimisationLayer';

// ============================================================================
// CORRELATION LAYER
// ============================================================================
export {
  // Types
  type RiskEdge,
  type RiskNode,
  type RiskGraph,
  type SystemicCluster,
  type CascadeAnalysis,
  // Configuration
  CORRELATION_CONFIG,
  // Functions
  buildRiskGraph,
  detectSystemicClusters,
  analyzeCascadeImpact,
  getHighCentralityRisks
} from './correlationLayer';

// ============================================================================
// GOVERNANCE LAYER
// ============================================================================
export {
  // Types
  type GovernanceBody,
  type FlagSeverity,
  type GovernanceFlag,
  type GovernanceEvaluationResult,
  type GovernanceCalendarItem,
  // Configuration
  GOVERNANCE_CONFIG,
  // Functions
  evaluateGovernanceTriggers,
  generateGovernanceCalendar
} from './governanceLayer';

// ============================================================================
// SCENARIO LAYER
// ============================================================================
export {
  // Types
  type StressScenarioInput,
  type StressedRisk,
  type CategoryStressResult,
  type StressScenarioResult,
  type ScenarioComparison,
  type ReverseStressResult,
  // Configuration
  SCENARIO_CONFIG,
  // Functions
  simulateStressScenario,
  runCyberShockScenario,
  runVendorShockScenario,
  runRegulatoryShockScenario,
  runEconomicShockScenario,
  runCombinedShockScenario,
  compareScenarios,
  reverseStressTest
} from './scenarioLayer';

// ============================================================================
// CONFIDENCE LAYER
// ============================================================================
export {
  // Types
  type ConfidenceScore,
  type RiskConfidenceAssessment,
  type PortfolioConfidenceOverview,
  type ConfidenceWrappedRecommendation,
  // Configuration
  CONFIDENCE_CONFIG,
  // Functions
  calculateConfidenceScore,
  assessRiskConfidence,
  getPortfolioConfidenceOverview,
  wrapWithConfidence
} from './confidenceLayer';

// ============================================================================
// BOARD PACK GENERATOR
// ============================================================================
export {
  // Types
  type BoardPackSection,
  type BoardPack,
  // Functions
  generateBoardPack,
  generatePortfolioSummary,
  generateTopRisksSection,
  generateAppetiteBreachesSection,
  generateForecastSection,
  generateSystemicClustersSection,
  generateCapitalRecommendationsSection,
  generateGovernanceFlagsSection,
  generateActionPlanSection,
  generateStressTestSection,
  generateConfidenceSection
} from './boardPackGenerator';

// ============================================================================
// ENGINE VERSION & METADATA
// ============================================================================
export const ENGINE_VERSION = '2.0.0';
export const ENGINE_NAME = 'Lumina-R Enterprise Risk Intelligence Engine';
export const ENGINE_CAPABILITIES = [
  'Five-Layer Reasoning System',
  'EMV Quantification',
  'Risk Trajectory Forecasting',
  'Capital Allocation Optimisation',
  'Systemic Cluster Detection',
  'Governance Trigger Automation',
  'Scenario & Stress Testing',
  'Confidence Scoring',
  'Board Pack Generation',
  'AI Role-Based Analysis'
] as const;
