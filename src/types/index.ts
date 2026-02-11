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
