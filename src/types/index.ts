// Core type definitions for Lumina-R Risk Intelligence Platform
// Canonical Risk Object Model - Full Deep Build Specification

// ============================================
// ENUMS & BASE TYPES
// ============================================

export type RiskSeverity = 'critical' | 'high' | 'medium' | 'low';
export type RiskStatus = 'active' | 'mitigated' | 'monitoring' | 'closed' | 'escalated';
export type KRIStatus = 'green' | 'amber' | 'red';

export type RiskCategory =
  | 'strategic'
  | 'financial'
  | 'operational'
  | 'compliance'
  | 'cyber'
  | 'reputational'
  | 'environmental';

export type ObjectiveType =
  | 'project'
  | 'programme'
  | 'portfolio'
  | 'business_unit'
  | 'enterprise';

export type ConstraintType =
  | 'cost'
  | 'time'
  | 'benefits'
  | 'risk_appetite'
  | 'quality'
  | 'scope';

export type ConstraintFlexibility = 'non_flexible' | 'may_flex' | 'should_flex';

export type ControlType = 'preventive' | 'detective';
export type ControlMode = 'automated' | 'manual';

export type SimulationType =
  | 'monte_carlo'
  | 'decision_tree'
  | 'bow_tie'
  | 'scenario'
  | 'tornado'
  | 'latin_hypercube';

// ============================================
// PHASE 1: OBJECTIVE OBJECT
// ============================================

export interface Objective {
  id: string;
  name: string;
  type: ObjectiveType;
  timeHorizon: {
    value: number;
    unit: 'months' | 'years';
  };
  primaryObjectives: string[];
  successMetrics: SuccessMetric[];
  criticalityLevel: 1 | 2 | 3 | 4 | 5;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
}

export interface SuccessMetric {
  id: string;
  name: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  isQuantifiable: boolean;
}

// ============================================
// PHASE 2: CONSTRAINT ARCHITECTURE
// ============================================

export interface Constraint {
  id: string;
  type: ConstraintType;
  name: string;
  flexibility: ConstraintFlexibility;
  targetValue: number;
  toleranceBand: {
    lower: number;
    upper: number;
  };
  breachThreshold: number;
  weightImportance: 1 | 2 | 3 | 4 | 5;
  unit: string;
  currentValue?: number;
}

export interface ConstraintMatrix {
  id: string;
  objectiveId: string;
  constraints: Constraint[];
  riskAppetiteScalar: number; // 1-10, default 5
  flexibilityScore: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// PHASE 3: RISK UNIVERSE - CANONICAL RISK OBJECT
// ============================================

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;
  severity: RiskSeverity;
  status: RiskStatus;

  // Objective linkage (optional for backward compatibility)
  linkedObjectiveIds?: string[];

  // Trigger & Source (optional for backward compatibility)
  triggerEvent?: string;
  affectedAssets?: string[];
  historicalPrecedent?: string;
  sourceType?: 'internal' | 'external';
  exposureType?: string;

  // Probability & Impact
  probability: number; // 1-5
  probabilityPercent?: number; // 0-100
  probabilityConfidence?: number; // 0-100
  impact: number; // 1-5
  riskScore: number;

  // Impact Dimensions (PHASE 4) - optional for backward compatibility
  impactDimensions?: ImpactDimensions;

  // Ownership
  owner: string;
  department: string;

  // Dates
  dateIdentified: string;
  lastReviewed: string;
  nextReview: string;

  // Mitigation
  mitigationPlan?: string;
  controls: string[];
  controlIds?: string[]; // Links to KCI objects

  // KRI Links
  linkedKRIs?: string[];

  // Scoring (optional for backward compatibility)
  grossRiskScore?: number;
  residualRiskScore?: number;
  riskPriorityRank?: number;
  thresholdBreachFlags?: string[];

  // Quantitative (optional for backward compatibility)
  expectedMonetaryValue?: number;
  scheduleRiskExposure?: number;

  // Metadata
  trend: 'increasing' | 'stable' | 'decreasing';
  tags: string[];

  // Simulation recommendation
  recommendedSimulation?: SimulationType;
}

export interface ImpactDimensions {
  financial: TriangularEstimate;
  time: TriangularEstimate;
  operational: TriangularEstimate;
  reputational: TriangularEstimate;
  regulatory: TriangularEstimate;
}

export interface TriangularEstimate {
  bestCase: number;
  mostLikely: number;
  worstCase: number;
  expectedValue?: number;
  variance?: number;
}

// ============================================
// PHASE 5: KRI (KEY RISK INDICATOR)
// ============================================

export interface KRI {
  id: string;
  name: string;
  description: string;
  category: RiskCategory;

  // Data source (optional for backward compatibility)
  dataSource?: string;
  measurementFrequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly'; // Legacy field

  // Values
  currentValue: number;
  previousValue?: number;
  unit: string;

  // Thresholds (optional new fields)
  warningThreshold?: number;
  breachThreshold?: number;
  threshold: {
    green: { min: number; max: number };
    amber: { min: number; max: number };
    red: { min: number; max: number };
  };

  // Escalation (optional for backward compatibility)
  escalationRule?: string;
  escalationContacts?: string[];

  // Calculated metrics (optional for backward compatibility)
  indicatorDriftVelocity?: number;
  thresholdProximityIndex?: number;

  // Status
  status: KRIStatus;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;

  // Links
  linkedRisks: string[];
  owner: string;
  lastUpdated: string;
}

// ============================================
// PHASE 6: KCI (KEY CONTROL INDICATOR)
// ============================================

export interface KCI {
  id: string;
  name: string;
  description: string;

  // Control characteristics
  controlType: ControlType;
  controlMode: ControlMode;
  frequency: 'continuous' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';

  // Ownership
  owner: string;

  // Effectiveness
  effectivenessRating: 1 | 2 | 3 | 4 | 5;
  lastTestDate: string;
  nextTestDate: string;
  testResults?: string;

  // Calculated metrics
  residualRiskAdjustmentFactor: number;
  controlReliabilityScore: number;

  // Links
  linkedRiskIds: string[];

  // Metadata
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'under_review';
}

// ============================================
// RISK APPETITE
// ============================================

export interface RiskAppetite {
  id?: string;
  category: RiskCategory;
  statement: string;
  currentLevel: number; // 0-100
  toleranceMin: number;
  toleranceMax: number;
  status: 'within' | 'approaching' | 'breached';
  rationale: string[];
  lastReviewed: string;
  approvedBy: string;

  // Extended fields (optional for backward compatibility)
  appetiteScalar?: number; // 1-10
  impactWeightModifier?: number;
}

// ============================================
// SIMULATION & ANALYTICS TYPES
// ============================================

// Monte Carlo
export interface MonteCarloConfig {
  iterations: number; // default 10000
  confidenceLevel: number; // e.g., 95
  distributionType: 'triangular' | 'normal' | 'uniform' | 'pert';
  riskIds: string[];
}

export interface MonteCarloResult {
  id: string;
  riskId: string;
  runDate: string;
  iterations: number;

  // Results
  probabilityDistribution: number[];
  valueAtRisk: number;
  conditionalVaR: number;
  percentiles: Record<number, number>; // e.g., {5: 10000, 50: 25000, 95: 50000}
  mean: number;
  stdDev: number;

  // Stress scenarios
  stressScenarios: StressScenario[];
}

export interface StressScenario {
  name: string;
  probability: number;
  impact: number;
  description: string;
}

// Decision Tree
export interface DecisionTreeNode {
  id: string;
  type: 'decision' | 'chance' | 'outcome';
  label: string;
  probability?: number;
  value?: number;
  children: DecisionTreeNode[];
}

export interface DecisionTreeResult {
  id: string;
  riskId: string;
  rootNode: DecisionTreeNode;
  expectedPayoff: number;
  optimalPath: string[];
  sensitivityAnalysis: SensitivityPoint[];
}

export interface SensitivityPoint {
  variable: string;
  baseValue: number;
  impact: number;
}

// Bow-Tie
export interface BowTieModel {
  id: string;
  riskId: string;
  centralEvent: string;

  // Left side - Threats & Preventive Controls
  threats: BowTieThreat[];

  // Right side - Consequences & Mitigating Controls
  consequences: BowTieConsequence[];
}

export interface BowTieThreat {
  id: string;
  name: string;
  probability: number;
  preventiveControls: BowTieControl[];
}

export interface BowTieConsequence {
  id: string;
  name: string;
  severity: number;
  mitigatingControls: BowTieControl[];
}

export interface BowTieControl {
  id: string;
  name: string;
  effectiveness: number; // 0-100
  type: ControlType;
  status: 'active' | 'degraded' | 'failed';
}

// Scenario Analysis
export interface ScenarioModel {
  id: string;
  name: string;
  riskIds: string[];
  scenarios: Scenario[];
}

export interface Scenario {
  id: string;
  name: 'base' | 'optimistic' | 'pessimistic' | 'extreme';
  description: string;
  assumptions: string[];
  probabilityModifier: number;
  impactModifier: number;
  constraintBreachProbability: Record<string, number>;
  totalExposure: number;
}

// Tornado Chart
export interface TornadoResult {
  id: string;
  riskId: string;
  variables: TornadoVariable[];
  baseValue: number;
}

export interface TornadoVariable {
  name: string;
  lowValue: number;
  highValue: number;
  lowImpact: number;
  highImpact: number;
  sensitivity: number;
}

// ============================================
// AI RISK ADVISOR
// ============================================

export interface AdvisorSession {
  id: string;
  userId: string;
  currentPhase: AdvisorPhase;
  startedAt: string;
  updatedAt: string;
  status: 'in_progress' | 'completed' | 'abandoned';

  // Collected data
  objectives: Objective[];
  constraintMatrix?: ConstraintMatrix;
  risks: Risk[];
  kris: KRI[];
  kcis: KCI[];

  // Validation
  phaseValidation: Record<AdvisorPhase, boolean>;
}

export type AdvisorPhase =
  | 'context_establishment'
  | 'constraint_architecture'
  | 'risk_universe'
  | 'likelihood_impact'
  | 'kri_builder'
  | 'kci_builder'
  | 'risk_scoring'
  | 'register_generation'
  | 'tool_selection'
  | 'simulation'
  | 'complete';

export interface AdvisorQuestion {
  id: string;
  phase: AdvisorPhase;
  question: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'slider' | 'matrix';
  options?: string[];
  validation?: {
    required: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
  helpText?: string;
}

// ============================================
// GOVERNANCE & AUDIT
// ============================================

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: AuditAction;
  entityType: 'risk' | 'kri' | 'kci' | 'objective' | 'constraint' | 'simulation';
  entityId: string;
  previousValue?: unknown;
  newValue?: unknown;
  reason?: string;
  ipAddress?: string;
}

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'score_change'
  | 'status_change'
  | 'control_update'
  | 'simulation_run'
  | 'export'
  | 'user_override';

// ============================================
// DATA UPLOAD & NORMALIZATION
// ============================================

export interface UploadSession {
  id: string;
  fileName: string;
  fileType: 'excel' | 'csv' | 'pdf' | 'word';
  status: 'uploading' | 'parsing' | 'mapping' | 'validating' | 'clarifying' | 'complete' | 'failed';
  uploadedAt: string;

  // Parsing results
  detectedSchema?: Record<string, string>;
  columnMapping?: Record<string, string>;
  missingFields?: string[];
  validationErrors?: string[];

  // Extracted data
  extractedRisks?: Partial<Risk>[];
}

export interface DataNormalization {
  baseCurrency: string;
  timeUnit: 'days' | 'weeks' | 'months' | 'years';
  probabilityFormat: 'decimal' | 'percentage';
  impactUnit: string;
}

// ============================================
// LEGACY TYPES (backwards compatibility)
// ============================================

export interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  challenge: string;
  solution: string;
  outcomes: {
    metric: string;
    value: string;
    improvement: string;
  }[];
  imageUrl?: string;
  tags: string[];
  publishedDate: string;
}

export interface RiskTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'analysis' | 'assessment' | 'monitoring' | 'reporting' | 'compliance';
  route: string;
  isNew?: boolean;
  isPremium?: boolean;
}

export interface DashboardMetrics {
  totalRisks: number;
  totalRisksChange: number;
  highPriorityRisks: number;
  highPriorityChange: number;
  krisBreached: number;
  krisBreachedChange: number;
  outsideAppetite: number;
  outsideAppetiteChange: number;
}

export interface Alert {
  id: string;
  type: 'risk' | 'kri' | 'appetite' | 'system';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer' | 'executive';
  avatar?: string;
  department: string;
  lastActive: string;
}

export interface NavItem {
  label: string;
  icon: string;
  path: string;
  badge?: number;
  children?: NavItem[];
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface MatrixCell {
  probability: number;
  impact: number;
  count: number;
  risks: Risk[];
  severity: RiskSeverity;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'pending';
  lastSync?: string;
}

// ============================================
// TIER 4 STRATEGIC RISK REGISTER
// ============================================

export type StrategicRiskColour = 'green' | 'amber' | 'red' | 'black';

export type EscalationLevel =
  | 'none'
  | 'risk_owner'
  | 'department_head'
  | 'executive_committee'
  | 'cfo_review'
  | 'board_visibility'
  | 'crisis_governance';

// Weighted Impact Dimensions - per user specification
// Financial: 30%, Operational: 20%, Reputational: 20%, Strategic: 20%, Legal: 10%
export interface WeightedImpactDimensions {
  financial: number; // 1-5 scale, weight 0.30
  operational: number; // 1-5 scale, weight 0.20
  reputational: number; // 1-5 scale, weight 0.20
  strategic: number; // 1-5 scale, weight 0.20
  legal: number; // 1-5 scale, weight 0.10
}

export const IMPACT_WEIGHTS = {
  financial: 0.30,
  operational: 0.20,
  reputational: 0.20,
  strategic: 0.20,
  legal: 0.10,
} as const;

// Financial estimate for triangular distribution
export interface FinancialEstimate {
  bestCase: number; // £ value
  mostLikely: number; // £ value
  worstCase: number; // £ value
  confidenceLevel: number; // 0-100%
}

// Mitigation option with ROI calculation
export interface MitigationOption {
  id: string;
  name: string;
  description: string;
  cost: number; // £ value
  riskReductionValue: number; // £ value (EMV reduction)
  netBenefit: number; // riskReductionValue - cost
  newResidualScore: number; // Projected residual risk score after mitigation
  implementationTime: string; // e.g., "3 months"
  owner: string;
  status: 'proposed' | 'approved' | 'in_progress' | 'completed';
}

// Early Warning Indicator for auto-bump risk scores
export interface EarlyWarningIndicator {
  id: string;
  name: string;
  currentValue: number;
  threshold: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  lastTriggered?: string;
  scoreBumpAmount: number; // How much to increase risk score when triggered
}

// Risk interdependency for network visualization
export interface RiskInterdependency {
  linkedRiskId: string;
  relationshipType: 'causes' | 'caused_by' | 'correlates' | 'amplifies';
  strength: number; // 1-10
  description: string;
}

// Threshold configuration for dynamic threshold engine
export interface ThresholdConfig {
  annualEBITDA: number; // £ value
  greenScoreMax: number; // Score below this = Green
  greenEMVMax: number; // EMV below this = Green (£100k default)
  amberScoreMax: number; // Score between green and this = Amber
  amberEMVMax: number; // EMV between green and this = Amber (£500k default)
  // Red: Score >= amberScoreMax OR EMV > amberEMVMax
  // Black: Worst Case > 20% EBITDA OR Legal Impact = 5
  mandatoryMitigationThreshold: number; // EBITDA % that triggers mandatory mitigation (10% default)
  executiveCommitteeScoreThreshold: number; // Score that triggers exec committee (13 default)
  cfoReviewEMVThreshold: number; // EMV that triggers CFO review (£500k default)
  strategicBoardThreshold: number; // Strategic impact score for board visibility (4 default)
}

// Auto-escalation trigger result
export interface EscalationTrigger {
  level: EscalationLevel;
  reason: string;
  triggered: boolean;
}

// The main Strategic Risk interface - Tier 4
export interface StrategicRisk {
  // Section A: Risk Identity
  id: string; // Format: R-STR-XXX
  title: string;
  description: string; // Narrative description
  category: RiskCategory;
  owner: string;
  department: string;
  dateIdentified: string;
  lastReviewed: string;
  nextReview: string;
  tags: string[];

  // Section B: Qualitative Risk Analysis
  probability: number; // 1-5 scale
  probabilityPercent: number; // 0-100%
  impactDimensions: WeightedImpactDimensions;
  weightedImpactScore: number; // Calculated: (0.30×F + 0.20×O + 0.20×R + 0.20×S + 0.10×L)
  overallRiskScore: number; // Calculated: Probability × Weighted Impact

  // Section C: Quantitative Financial Model
  financialEstimate: FinancialEstimate;
  expectedMonetaryValue: number; // Calculated: Triangular mean × probability
  simpleEMV: number; // Calculated: Probability × Most Likely
  capitalAllocationRequired: number; // Max(Worst Case × Confidence Adjustment)

  // Section D: Risk Thresholds & Decision Rules
  ebitdaExposurePercent: number; // Worst Case ÷ Annual EBITDA × 100
  colour: StrategicRiskColour; // Calculated based on thresholds
  escalationTriggers: EscalationTrigger[];
  status: RiskStatus;

  // Section E: Mitigation Costing
  currentControls: string[];
  mitigationOptions: MitigationOption[];
  residualRiskScore: number; // After current controls

  // Risk Interdependency Map
  interdependencies: RiskInterdependency[];
  interdependencyScore: number; // 1-10, calculated from linked risks

  // Early Warning Indicators
  earlyWarningIndicators: EarlyWarningIndicator[];

  // Trends and velocity
  trend: 'increasing' | 'stable' | 'decreasing';
  riskVelocity: 'rapid' | 'moderate' | 'slow'; // How fast the risk could materialize
  maturityIndex: number; // 1-5, risk management maturity for this risk

  // Linked entities
  linkedKRIs: string[];
  linkedObjectiveIds: string[];

  // Audit trail
  lastModifiedBy: string;
  lastModifiedAt: string;
}

// Portfolio-level metrics for dashboard
export interface StrategicPortfolioMetrics {
  totalEMVExposure: number; // Sum of all EMVs
  totalCapitalAllocated: number; // Sum of all capital allocations
  averageRiskScore: number;
  risksByColour: {
    green: number;
    amber: number;
    red: number;
    black: number;
  };
  top10ByCapitalImpact: StrategicRisk[];
  top10ByEMV: StrategicRisk[];
  ebitdaAtRisk: number; // Total EBITDA exposure
  ebitdaAtRiskPercent: number;
  trendSummary: {
    increasing: number;
    stable: number;
    decreasing: number;
  };
  mitigationROISummary: {
    totalMitigationCost: number;
    totalRiskReduction: number;
    totalNetBenefit: number;
  };
}

// Heat map cell for strategic risk matrix
export interface StrategicHeatMapCell {
  probability: number; // 1-5
  weightedImpact: number; // 1-5 (after weighting)
  risks: StrategicRisk[];
  count: number;
  totalEMV: number;
  dominantColour: StrategicRiskColour;
}

// Confidence interval for Monte Carlo results
export interface ConfidenceInterval {
  level: number; // e.g., 95
  lowerBound: number;
  upperBound: number;
  mean: number;
}

// Stress testing scenario
export interface StressTestScenario {
  id: string;
  name: string;
  description: string;
  probabilityMultiplier: number;
  impactMultiplier: number;
  affectedRiskIds: string[];
  resultingTotalEMV: number;
  resultingEBITDAExposure: number;
}
