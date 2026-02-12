import { useState, useCallback } from 'react';
import {
  Target,
  Sliders,
  AlertTriangle,
  Activity,
  Shield,
  Calculator,
  FileText,
  Wrench,
  Play,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  HelpCircle,
  Lock,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  GitBranch,
  Dice5,
  Layers,
  Download,
  Eye,
} from 'lucide-react';
import { cn } from '../../utils';
import type {
  AdvisorPhase,
  Objective,
  Constraint,
  ConstraintType,
  ConstraintFlexibility,
  ObjectiveType,
  RiskCategory,
  TriangularEstimate,
  ControlType,
  ControlMode,
  SimulationType,
} from '../../types';

// Phase configuration - 8 steps per spec (Step 1-8, Step 0 is context selection in RiskLanding)
const phases: {
  id: AdvisorPhase;
  step: number;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    id: 'constraint_architecture',
    step: 1,
    label: 'Constraints',
    description: 'Set boundaries and limits',
    icon: Sliders,
  },
  {
    id: 'context_establishment',
    step: 2,
    label: 'Objectives',
    description: 'Define objectives and success metrics',
    icon: Target,
  },
  {
    id: 'risk_universe',
    step: 3,
    label: 'Risk Universe',
    description: 'Identify potential risks',
    icon: AlertTriangle,
  },
  {
    id: 'likelihood_impact',
    step: 4,
    label: 'Calibration',
    description: 'Likelihood & impact assessment',
    icon: Activity,
  },
  {
    id: 'kri_builder',
    step: 5,
    label: 'KRI Builder',
    description: 'Define key risk indicators',
    icon: BarChart3,
  },
  {
    id: 'kci_builder',
    step: 6,
    label: 'Controls',
    description: 'Map controls to risks',
    icon: Shield,
  },
  {
    id: 'risk_scoring',
    step: 7,
    label: 'Risk Profile',
    description: 'Confirm risk profile',
    icon: CheckCircle,
  },
  {
    id: 'tool_selection',
    step: 8,
    label: 'Analytics',
    description: 'Advanced analytics library',
    icon: Wrench,
  },
];

const objectiveTypes: { value: ObjectiveType; label: string }[] = [
  { value: 'project', label: 'Project' },
  { value: 'programme', label: 'Programme' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'business_unit', label: 'Business Unit' },
  { value: 'enterprise', label: 'Enterprise-wide' },
];

const constraintTemplates: {
  type: ConstraintType;
  name: string;
  flexibility: ConstraintFlexibility;
  unit: string;
}[] = [
  { type: 'cost', name: 'Cost Cap', flexibility: 'non_flexible', unit: 'USD' },
  { type: 'time', name: 'Time Deadline', flexibility: 'non_flexible', unit: 'days' },
  { type: 'benefits', name: 'Benefits Realisation', flexibility: 'may_flex', unit: '%' },
  { type: 'risk_appetite', name: 'Risk Appetite', flexibility: 'may_flex', unit: 'score' },
  { type: 'quality', name: 'Quality Standards', flexibility: 'should_flex', unit: 'score' },
  { type: 'scope', name: 'Scope Boundaries', flexibility: 'should_flex', unit: '%' },
];

const riskCategories: { value: RiskCategory; label: string; description: string }[] = [
  { value: 'strategic', label: 'Strategic Risk', description: 'Risks affecting long-term goals' },
  { value: 'financial', label: 'Financial Risk', description: 'Market, credit, liquidity risks' },
  { value: 'operational', label: 'Operational Risk', description: 'Process and execution risks' },
  { value: 'compliance', label: 'Compliance Risk', description: 'Regulatory and legal risks' },
  { value: 'reputational', label: 'Reputational Risk', description: 'Brand and stakeholder risks' },
  { value: 'cyber', label: 'Technological Risk', description: 'IT and cybersecurity risks' },
  { value: 'environmental', label: 'Environmental/ESG', description: 'Sustainability risks' },
];

interface RiskDraft {
  id: string;
  description: string;
  category: RiskCategory;
  triggerEvent: string;
  affectedAssets: string;
  historicalPrecedent: string;
  sourceType: 'internal' | 'external';
}

interface RiskAssessment {
  riskId: string;
  probability: number; // 1-5
  probabilityPercent: number; // 0-100
  probabilityConfidence: number; // 0-100
  impactDimensions: {
    financial: TriangularEstimate;
    time: TriangularEstimate;
    operational: TriangularEstimate;
    reputational: TriangularEstimate;
    regulatory: TriangularEstimate;
  };
}

interface KRIDraft {
  id: string;
  name: string;
  description: string;
  linkedRiskIds: string[];
  dataSource: string;
  measurementFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  warningThreshold: number;
  breachThreshold: number;
  unit: string;
  escalationRule: string;
}

interface KCIDraft {
  id: string;
  name: string;
  description: string;
  linkedRiskIds: string[];
  controlType: ControlType;
  controlMode: ControlMode;
  frequency: 'continuous' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  effectivenessRating: 1 | 2 | 3 | 4 | 5;
}

interface CalculatedRiskScore {
  riskId: string;
  grossRiskScore: number;
  residualRiskScore: number;
  expectedMonetaryValue: number;
  scheduleRiskExposure: number;
  priorityRank: number;
}

const impactDimensionLabels: { key: keyof RiskAssessment['impactDimensions']; label: string; unit: string }[] = [
  { key: 'financial', label: 'Financial Impact', unit: 'USD' },
  { key: 'time', label: 'Schedule Impact', unit: 'days' },
  { key: 'operational', label: 'Operational Impact', unit: 'score' },
  { key: 'reputational', label: 'Reputational Impact', unit: 'score' },
  { key: 'regulatory', label: 'Regulatory Impact', unit: 'score' },
];

const simulationTools: { id: SimulationType; name: string; description: string; icon: React.ElementType; useCase: string }[] = [
  {
    id: 'monte_carlo',
    name: 'Monte Carlo Simulation',
    description: 'Probabilistic modeling using triangular distributions',
    icon: Dice5,
    useCase: 'Best for: Quantifying uncertainty ranges and VaR calculations',
  },
  {
    id: 'decision_tree',
    name: 'Decision Tree Analysis',
    description: 'Sequential decision pathways with branch probabilities',
    icon: GitBranch,
    useCase: 'Best for: Evaluating options and contingency strategies',
  },
  {
    id: 'bow_tie',
    name: 'Bow-Tie Analysis',
    description: 'Threat → Control → Event → Control → Consequence mapping',
    icon: Target,
    useCase: 'Best for: Visualizing cause-effect chains and control gaps',
  },
  {
    id: 'scenario',
    name: 'Scenario Analysis',
    description: 'Base, optimistic, pessimistic, and extreme case modeling',
    icon: Layers,
    useCase: 'Best for: Stress testing and planning for multiple futures',
  },
  {
    id: 'tornado',
    name: 'Tornado Sensitivity',
    description: 'Variable sensitivity ranking and impact visualization',
    icon: BarChart3,
    useCase: 'Best for: Identifying key risk drivers',
  },
];

export default function RiskInterrogation() {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseValidation, setPhaseValidation] = useState<Record<AdvisorPhase, boolean>>({
    constraint_architecture: false,
    context_establishment: false,
    risk_universe: false,
    likelihood_impact: false,
    kri_builder: false,
    kci_builder: false,
    risk_scoring: false,
    tool_selection: false,
    register_generation: false,
    simulation: false,
    complete: false,
  });

  // Step 1: Constraints (6 constraint cards)
  const [constraints, setConstraints] = useState<Partial<Constraint>[]>(
    constraintTemplates.map((t, i) => ({
      id: `const-${i}`,
      type: t.type,
      name: t.name,
      flexibility: t.flexibility,
      targetValue: 0,
      toleranceBand: { lower: 0, upper: 0 },
      breachThreshold: 0,
      weightImportance: 3 as const,
      unit: t.unit,
    }))
  );
  const [riskAppetiteScalar, setRiskAppetiteScalar] = useState(5);

  // Step 2: Objectives
  const [objective, setObjective] = useState<Partial<Objective>>({
    name: '',
    type: 'project',
    timeHorizon: { value: 12, unit: 'months' },
    primaryObjectives: [''],
    criticalityLevel: 3,
  });

  // Step 3: Risk Universe
  const [riskDrafts, setRiskDrafts] = useState<RiskDraft[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<RiskCategory>('strategic');

  // Step 4: Likelihood & Impact
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [assessmentRiskIndex, setAssessmentRiskIndex] = useState(0);

  // Step 5: KRI Builder
  const [kriDrafts, setKriDrafts] = useState<KRIDraft[]>([]);

  // Step 6: KCI Builder
  const [kciDrafts, setKciDrafts] = useState<KCIDraft[]>([]);

  // Step 7: Risk Profile (includes scoring + approval)
  const [calculatedScores, setCalculatedScores] = useState<CalculatedRiskScore[]>([]);
  const [riskProfileApproved, setRiskProfileApproved] = useState(false);

  // Step 8: Analytics Library
  const [selectedTools, setSelectedTools] = useState<SimulationType[]>([]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);

  const currentPhase = phases[currentPhaseIndex];

  // Initialize assessments when entering phase 4
  const initializeAssessments = useCallback(() => {
    if (riskAssessments.length === 0 && riskDrafts.length > 0) {
      const initialAssessments: RiskAssessment[] = riskDrafts.map((risk) => ({
        riskId: risk.id,
        probability: 3,
        probabilityPercent: 50,
        probabilityConfidence: 70,
        impactDimensions: {
          financial: { bestCase: 0, mostLikely: 0, worstCase: 0 },
          time: { bestCase: 0, mostLikely: 0, worstCase: 0 },
          operational: { bestCase: 1, mostLikely: 3, worstCase: 5 },
          reputational: { bestCase: 1, mostLikely: 3, worstCase: 5 },
          regulatory: { bestCase: 1, mostLikely: 3, worstCase: 5 },
        },
      }));
      setRiskAssessments(initialAssessments);
    }
  }, [riskAssessments.length, riskDrafts]);

  // Calculate risk scores
  const calculateScores = useCallback(() => {
    const scores: CalculatedRiskScore[] = riskAssessments.map((assessment, index) => {
      const financial = assessment.impactDimensions.financial;
      const time = assessment.impactDimensions.time;

      // Expected value using triangular distribution formula: (min + mode + max) / 3
      const financialEV = (financial.bestCase + financial.mostLikely + financial.worstCase) / 3;
      const timeEV = (time.bestCase + time.mostLikely + time.worstCase) / 3;

      // Gross risk score: probability (1-5) * weighted impact (normalized to 1-5)
      const avgImpact = Object.values(assessment.impactDimensions)
        .reduce((sum, dim) => sum + dim.mostLikely, 0) / 5;
      const grossScore = Math.round(assessment.probability * avgImpact * 4); // Scale to ~100

      // Residual risk = Gross * (1 - control effectiveness)
      // Find controls for this risk
      const riskControls = kciDrafts.filter((kci) =>
        kci.linkedRiskIds.includes(assessment.riskId)
      );
      const avgEffectiveness = riskControls.length > 0
        ? riskControls.reduce((sum, kci) => sum + kci.effectivenessRating, 0) / riskControls.length / 5
        : 0;
      const residualScore = Math.round(grossScore * (1 - avgEffectiveness * 0.6));

      // EMV = probability% * financial impact
      const emv = (assessment.probabilityPercent / 100) * financialEV;

      return {
        riskId: assessment.riskId,
        grossRiskScore: grossScore,
        residualRiskScore: residualScore,
        expectedMonetaryValue: emv,
        scheduleRiskExposure: (assessment.probabilityPercent / 100) * timeEV,
        priorityRank: index + 1,
      };
    });

    // Sort by gross score and assign priority ranks
    scores.sort((a, b) => b.grossRiskScore - a.grossRiskScore);
    scores.forEach((score, idx) => {
      score.priorityRank = idx + 1;
    });

    setCalculatedScores(scores);
  }, [riskAssessments, kciDrafts]);

  // Calculate constraint completion percentage
  const constraintCompletion = Math.round(
    (constraints.filter((c) => c.targetValue && c.targetValue > 0).length / constraints.length) * 100
  );

  const canProceed = useCallback(() => {
    switch (currentPhase.id) {
      case 'constraint_architecture':
        // All 6 constraints must have values (100% completion)
        return constraintCompletion === 100;
      case 'context_establishment':
        return (
          objective.name &&
          objective.name.length > 0 &&
          objective.primaryObjectives?.some((o) => o.length > 0)
        );
      case 'risk_universe':
        return riskDrafts.length > 0;
      case 'likelihood_impact':
        return riskAssessments.every((a) =>
          a.impactDimensions.financial.worstCase > 0 ||
          a.impactDimensions.time.worstCase > 0
        );
      case 'kri_builder':
        return kriDrafts.length > 0;
      case 'kci_builder':
        return kciDrafts.length > 0;
      case 'risk_scoring':
        // Must approve risk profile to proceed
        return riskProfileApproved;
      case 'tool_selection':
        // Final step - can always complete
        return selectedTools.length > 0 || simulationComplete;
      default:
        return true;
    }
  }, [currentPhase.id, constraintCompletion, objective, constraints, riskDrafts, riskAssessments, kriDrafts, kciDrafts, riskProfileApproved, selectedTools, simulationComplete]);

  const handleNext = () => {
    if (currentPhaseIndex < phases.length - 1 && canProceed()) {
      setPhaseValidation((prev) => ({ ...prev, [currentPhase.id]: true }));
      const nextIndex = currentPhaseIndex + 1;
      setCurrentPhaseIndex(nextIndex);

      // Initialize data for next phase
      const nextPhase = phases[nextIndex];
      if (nextPhase.id === 'likelihood_impact') {
        initializeAssessments();
      } else if (nextPhase.id === 'risk_scoring') {
        calculateScores();
      }
    }
  };

  const handleBack = () => {
    if (currentPhaseIndex > 0) {
      setCurrentPhaseIndex((prev) => prev - 1);
    }
  };

  const addPrimaryObjective = () => {
    setObjective((prev) => ({
      ...prev,
      primaryObjectives: [...(prev.primaryObjectives || []), ''],
    }));
  };

  const updatePrimaryObjective = (index: number, value: string) => {
    setObjective((prev) => ({
      ...prev,
      primaryObjectives: prev.primaryObjectives?.map((o, i) => (i === index ? value : o)),
    }));
  };

  const addRiskDraft = () => {
    setRiskDrafts((prev) => [
      ...prev,
      {
        id: `risk-draft-${Date.now()}`,
        description: '',
        category: selectedCategory,
        triggerEvent: '',
        affectedAssets: '',
        historicalPrecedent: '',
        sourceType: 'internal',
      },
    ]);
  };

  const updateRiskDraft = (id: string, field: keyof RiskDraft, value: string) => {
    setRiskDrafts((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const removeRiskDraft = (id: string) => {
    setRiskDrafts((prev) => prev.filter((r) => r.id !== id));
  };

  // Assessment helpers
  const updateAssessment = (riskId: string, field: keyof RiskAssessment, value: number) => {
    setRiskAssessments((prev) =>
      prev.map((a) => (a.riskId === riskId ? { ...a, [field]: value } : a))
    );
  };

  const updateImpactDimension = (
    riskId: string,
    dimension: keyof RiskAssessment['impactDimensions'],
    field: keyof TriangularEstimate,
    value: number
  ) => {
    setRiskAssessments((prev) =>
      prev.map((a) =>
        a.riskId === riskId
          ? {
              ...a,
              impactDimensions: {
                ...a.impactDimensions,
                [dimension]: { ...a.impactDimensions[dimension], [field]: value },
              },
            }
          : a
      )
    );
  };

  // KRI helpers
  const addKRI = () => {
    setKriDrafts((prev) => [
      ...prev,
      {
        id: `kri-${Date.now()}`,
        name: '',
        description: '',
        linkedRiskIds: [],
        dataSource: '',
        measurementFrequency: 'monthly',
        warningThreshold: 70,
        breachThreshold: 90,
        unit: '%',
        escalationRule: '',
      },
    ]);
  };

  const updateKRI = (id: string, field: keyof KRIDraft, value: KRIDraft[keyof KRIDraft]) => {
    setKriDrafts((prev) =>
      prev.map((k) => (k.id === id ? { ...k, [field]: value } : k))
    );
  };

  const removeKRI = (id: string) => {
    setKriDrafts((prev) => prev.filter((k) => k.id !== id));
  };

  // KCI helpers
  const addKCI = () => {
    setKciDrafts((prev) => [
      ...prev,
      {
        id: `kci-${Date.now()}`,
        name: '',
        description: '',
        linkedRiskIds: [],
        controlType: 'preventive',
        controlMode: 'manual',
        frequency: 'monthly',
        effectivenessRating: 3,
      },
    ]);
  };

  const updateKCI = (id: string, field: keyof KCIDraft, value: KCIDraft[keyof KCIDraft]) => {
    setKciDrafts((prev) =>
      prev.map((k) => (k.id === id ? { ...k, [field]: value } : k))
    );
  };

  const removeKCI = (id: string) => {
    setKciDrafts((prev) => prev.filter((k) => k.id !== id));
  };

  // Simulation helpers
  const toggleTool = (toolId: SimulationType) => {
    setSelectedTools((prev) =>
      prev.includes(toolId)
        ? prev.filter((t) => t !== toolId)
        : [...prev, toolId]
    );
  };

  const runSimulation = async () => {
    setSimulationRunning(true);
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSimulationRunning(false);
    setSimulationComplete(true);
  };

  // Get risk draft by ID helper
  const getRiskById = (id: string) => riskDrafts.find((r) => r.id === id);

  // Current assessment for phase 4
  const currentAssessmentRisk = riskDrafts[assessmentRiskIndex];
  const currentAssessment = riskAssessments.find(
    (a) => a.riskId === currentAssessmentRisk?.id
  );

  const renderPhaseContent = () => {
    switch (currentPhase.id) {
      case 'context_establishment':
        return (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-accent-primary/10 border border-accent-primary/30">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-accent-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-navy-100">Why this matters</p>
                  <p className="text-sm text-navy-400 mt-1">
                    No risk capture is allowed until at least one objective is defined.
                    Risk modelling without context is numerology.
                  </p>
                </div>
              </div>
            </div>

            {/* Initiative Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-navy-200">
                Initiative Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={objective.name || ''}
                onChange={(e) => setObjective((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Digital Transformation Programme"
                className="input"
              />
            </div>

            {/* Scope Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-navy-200">Scope Type</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {objectiveTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setObjective((prev) => ({ ...prev, type: type.value }))}
                    className={cn(
                      'px-4 py-3 rounded-lg border text-sm font-medium transition-all',
                      objective.type === type.value
                        ? 'bg-accent-primary/20 border-accent-primary text-accent-primary'
                        : 'bg-navy-800/50 border-navy-700 text-navy-300 hover:border-navy-600'
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Horizon */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-navy-200">Time Horizon</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={objective.timeHorizon?.value || 12}
                  onChange={(e) =>
                    setObjective((prev) => ({
                      ...prev,
                      timeHorizon: { ...prev.timeHorizon!, value: parseInt(e.target.value) || 0 },
                    }))
                  }
                  className="input w-32"
                  min={1}
                />
                <select
                  value={objective.timeHorizon?.unit || 'months'}
                  onChange={(e) =>
                    setObjective((prev) => ({
                      ...prev,
                      timeHorizon: {
                        ...prev.timeHorizon!,
                        unit: e.target.value as 'months' | 'years',
                      },
                    }))
                  }
                  className="input w-32"
                >
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>
            </div>

            {/* Primary Objectives */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-navy-200">
                Primary Objectives <span className="text-red-400">*</span>
              </label>
              <p className="text-sm text-navy-500">
                What are you trying to achieve? (e.g., cost reduction, growth, compliance)
              </p>
              <div className="space-y-2">
                {objective.primaryObjectives?.map((obj, index) => (
                  <input
                    key={index}
                    type="text"
                    value={obj}
                    onChange={(e) => updatePrimaryObjective(index, e.target.value)}
                    placeholder={`Objective ${index + 1}`}
                    className="input"
                  />
                ))}
                <button
                  onClick={addPrimaryObjective}
                  className="flex items-center gap-2 text-sm text-accent-primary hover:text-accent-primary/80"
                >
                  <Plus className="w-4 h-4" /> Add another objective
                </button>
              </div>
            </div>

            {/* Criticality Level */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-navy-200">Criticality Level</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={objective.criticalityLevel || 3}
                  onChange={(e) =>
                    setObjective((prev) => ({
                      ...prev,
                      criticalityLevel: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5,
                    }))
                  }
                  className="flex-1 accent-accent-primary"
                />
                <span className="w-12 text-center text-lg font-bold text-navy-100">
                  {objective.criticalityLevel || 3}
                </span>
              </div>
              <div className="flex justify-between text-xs text-navy-500">
                <span>Low</span>
                <span>Medium</span>
                <span>Critical</span>
              </div>
            </div>
          </div>
        );

      case 'constraint_architecture':
        return (
          <div className="space-y-6">
            {/* Completion Progress Bar */}
            <div className="p-4 rounded-xl bg-navy-800/50 border border-navy-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-navy-200">Risk Foundation Completion</span>
                <span className={cn(
                  'text-sm font-bold',
                  constraintCompletion === 100 ? 'text-emerald-400' : 'text-amber-400'
                )}>
                  {constraintCompletion}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-navy-700 overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    constraintCompletion === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                  )}
                  style={{ width: `${constraintCompletion}%` }}
                />
              </div>
              {constraintCompletion < 100 && (
                <p className="text-xs text-navy-500 mt-2">
                  Complete all 6 constraints to proceed to objective definition
                </p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-navy-100">Six Constraints Framework</p>
                  <p className="text-sm text-navy-400 mt-1">
                    All six constraints must contain numeric values. These boundaries determine
                    how risk appetite transforms likelihood weighting coefficients.
                  </p>
                </div>
              </div>
            </div>

            {/* Risk Appetite Slider */}
            <div className="p-4 rounded-xl bg-navy-800/50 border border-navy-700/50">
              <label className="text-sm font-medium text-navy-200">
                Overall Risk Appetite (1-10)
              </label>
              <p className="text-xs text-navy-500 mt-1 mb-3">
                Higher values reduce perceived impact weight in risk scoring
              </p>
              <div className="flex items-center gap-4">
                <span className="text-xs text-navy-500">Conservative</span>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={riskAppetiteScalar}
                  onChange={(e) => setRiskAppetiteScalar(parseInt(e.target.value))}
                  className="flex-1 accent-accent-primary"
                />
                <span className="text-xs text-navy-500">Aggressive</span>
                <span className="w-12 text-center text-lg font-bold text-accent-primary">
                  {riskAppetiteScalar}
                </span>
              </div>
            </div>

            {/* Constraints Grid */}
            <div className="space-y-4">
              {constraints.map((constraint, index) => (
                <div
                  key={constraint.id}
                  className={cn(
                    'p-4 rounded-xl border',
                    constraint.flexibility === 'non_flexible'
                      ? 'bg-red-500/5 border-red-500/30'
                      : constraint.flexibility === 'may_flex'
                      ? 'bg-amber-500/5 border-amber-500/30'
                      : 'bg-emerald-500/5 border-emerald-500/30'
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-sm font-medium text-navy-100">{constraint.name}</span>
                      <span
                        className={cn(
                          'ml-2 px-2 py-0.5 rounded text-2xs font-medium',
                          constraint.flexibility === 'non_flexible'
                            ? 'bg-red-500/20 text-red-300'
                            : constraint.flexibility === 'may_flex'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        )}
                      >
                        {constraint.flexibility === 'non_flexible'
                          ? 'Non-Flexible'
                          : constraint.flexibility === 'may_flex'
                          ? 'May Flex'
                          : 'Should Flex'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs text-navy-500">Target Value</label>
                      <div className="flex items-center gap-1 mt-1">
                        <input
                          type="number"
                          value={constraint.targetValue || ''}
                          onChange={(e) => {
                            const newConstraints = [...constraints];
                            newConstraints[index] = {
                              ...newConstraints[index],
                              targetValue: parseFloat(e.target.value) || 0,
                            };
                            setConstraints(newConstraints);
                          }}
                          className="input py-1.5 text-sm"
                          placeholder="0"
                        />
                        <span className="text-xs text-navy-500">{constraint.unit}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-navy-500">Tolerance (±)</label>
                      <input
                        type="number"
                        value={constraint.toleranceBand?.upper || ''}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const newConstraints = [...constraints];
                          newConstraints[index] = {
                            ...newConstraints[index],
                            toleranceBand: { lower: -val, upper: val },
                          };
                          setConstraints(newConstraints);
                        }}
                        className="input py-1.5 text-sm mt-1"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-navy-500">Breach Threshold</label>
                      <input
                        type="number"
                        value={constraint.breachThreshold || ''}
                        onChange={(e) => {
                          const newConstraints = [...constraints];
                          newConstraints[index] = {
                            ...newConstraints[index],
                            breachThreshold: parseFloat(e.target.value) || 0,
                          };
                          setConstraints(newConstraints);
                        }}
                        className="input py-1.5 text-sm mt-1"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-navy-500">Weight (1-5)</label>
                      <select
                        value={constraint.weightImportance || 3}
                        onChange={(e) => {
                          const newConstraints = [...constraints];
                          newConstraints[index] = {
                            ...newConstraints[index],
                            weightImportance: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5,
                          };
                          setConstraints(newConstraints);
                        }}
                        className="input py-1.5 text-sm mt-1"
                      >
                        {[1, 2, 3, 4, 5].map((w) => (
                          <option key={w} value={w}>
                            {w}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'risk_universe':
        return (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-accent-primary/10 border border-accent-primary/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-accent-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-navy-100">Risk Identification</p>
                  <p className="text-sm text-navy-400 mt-1">
                    Each risk must link to at least one objective and have a defined trigger.
                    Consider: What could go wrong? What would trigger this? What assets are exposed?
                  </p>
                </div>
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-navy-200">Risk Category</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {riskCategories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={cn(
                      'px-3 py-2 rounded-lg border text-left transition-all',
                      selectedCategory === cat.value
                        ? 'bg-accent-primary/20 border-accent-primary'
                        : 'bg-navy-800/50 border-navy-700 hover:border-navy-600'
                    )}
                  >
                    <span className="text-sm font-medium text-navy-100">{cat.label}</span>
                    <p className="text-2xs text-navy-500 mt-0.5">{cat.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Risk Drafts */}
            <div className="space-y-4">
              {riskDrafts
                .filter((r) => r.category === selectedCategory)
                .map((risk) => (
                  <div
                    key={risk.id}
                    className="p-4 rounded-xl bg-navy-800/50 border border-navy-700/50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-sm font-medium text-navy-200">Risk Statement</span>
                      <button
                        onClick={() => removeRiskDraft(risk.id)}
                        className="p-1 text-navy-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-navy-500">What could go wrong?</label>
                        <textarea
                          value={risk.description}
                          onChange={(e) => updateRiskDraft(risk.id, 'description', e.target.value)}
                          className="input mt-1 min-h-[60px]"
                          placeholder="Describe the risk..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-navy-500">What would trigger this?</label>
                          <input
                            type="text"
                            value={risk.triggerEvent}
                            onChange={(e) =>
                              updateRiskDraft(risk.id, 'triggerEvent', e.target.value)
                            }
                            className="input mt-1"
                            placeholder="Trigger event..."
                          />
                        </div>
                        <div>
                          <label className="text-xs text-navy-500">What assets are exposed?</label>
                          <input
                            type="text"
                            value={risk.affectedAssets}
                            onChange={(e) =>
                              updateRiskDraft(risk.id, 'affectedAssets', e.target.value)
                            }
                            className="input mt-1"
                            placeholder="Affected assets..."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-navy-500">Historical precedent?</label>
                          <input
                            type="text"
                            value={risk.historicalPrecedent}
                            onChange={(e) =>
                              updateRiskDraft(risk.id, 'historicalPrecedent', e.target.value)
                            }
                            className="input mt-1"
                            placeholder="Any past occurrences..."
                          />
                        </div>
                        <div>
                          <label className="text-xs text-navy-500">Source Type</label>
                          <select
                            value={risk.sourceType}
                            onChange={(e) =>
                              updateRiskDraft(
                                risk.id,
                                'sourceType',
                                e.target.value as 'internal' | 'external'
                              )
                            }
                            className="input mt-1"
                          >
                            <option value="internal">Internal</option>
                            <option value="external">External</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              <button
                onClick={addRiskDraft}
                className="w-full p-4 rounded-xl border-2 border-dashed border-navy-700 hover:border-accent-primary/50 text-navy-400 hover:text-accent-primary transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Risk for {riskCategories.find((c) => c.value === selectedCategory)?.label}
              </button>
            </div>

            {/* Risk Count Summary */}
            <div className="p-4 rounded-xl bg-navy-800/30 border border-navy-700/50">
              <p className="text-sm text-navy-400">
                Total risks identified: <span className="font-bold text-navy-100">{riskDrafts.length}</span>
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {riskCategories.map((cat) => {
                  const count = riskDrafts.filter((r) => r.category === cat.value).length;
                  if (count === 0) return null;
                  return (
                    <span
                      key={cat.value}
                      className="px-2 py-1 rounded bg-navy-700/50 text-xs text-navy-300"
                    >
                      {cat.label}: {count}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'likelihood_impact':
        if (!currentAssessmentRisk || !currentAssessment) {
          initializeAssessments();
          return <div className="text-navy-400">Loading assessments...</div>;
        }
        return (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-accent-primary/10 border border-accent-primary/30">
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-accent-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-navy-100">Impact Assessment</p>
                  <p className="text-sm text-navy-400 mt-1">
                    Provide triangular estimates (best case, most likely, worst case) for each impact dimension.
                    This enables Monte Carlo simulation.
                  </p>
                </div>
              </div>
            </div>

            {/* Risk Navigator */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-navy-800/50 border border-navy-700/50">
              <button
                onClick={() => setAssessmentRiskIndex((prev) => Math.max(0, prev - 1))}
                disabled={assessmentRiskIndex === 0}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  assessmentRiskIndex === 0
                    ? 'text-navy-600 cursor-not-allowed'
                    : 'text-navy-300 hover:bg-navy-700/50'
                )}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-center">
                <p className="text-sm text-navy-400">
                  Risk {assessmentRiskIndex + 1} of {riskDrafts.length}
                </p>
                <p className="text-sm font-medium text-navy-100 mt-1 line-clamp-1 max-w-md">
                  {currentAssessmentRisk.description || 'Untitled Risk'}
                </p>
              </div>
              <button
                onClick={() => setAssessmentRiskIndex((prev) => Math.min(riskDrafts.length - 1, prev + 1))}
                disabled={assessmentRiskIndex === riskDrafts.length - 1}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  assessmentRiskIndex === riskDrafts.length - 1
                    ? 'text-navy-600 cursor-not-allowed'
                    : 'text-navy-300 hover:bg-navy-700/50'
                )}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Probability Section */}
            <div className="p-4 rounded-xl bg-navy-800/30 border border-navy-700/50">
              <h4 className="text-sm font-medium text-navy-200 mb-4">Probability Assessment</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-navy-500">Likelihood Scale (1-5)</label>
                  <select
                    value={currentAssessment.probability}
                    onChange={(e) => updateAssessment(currentAssessment.riskId, 'probability', parseInt(e.target.value))}
                    className="input mt-1"
                  >
                    <option value={1}>1 - Rare</option>
                    <option value={2}>2 - Unlikely</option>
                    <option value={3}>3 - Possible</option>
                    <option value={4}>4 - Likely</option>
                    <option value={5}>5 - Almost Certain</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-navy-500">Probability (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={currentAssessment.probabilityPercent}
                    onChange={(e) => updateAssessment(currentAssessment.riskId, 'probabilityPercent', parseInt(e.target.value) || 0)}
                    className="input mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-navy-500">Confidence Level (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={currentAssessment.probabilityConfidence}
                    onChange={(e) => updateAssessment(currentAssessment.riskId, 'probabilityConfidence', parseInt(e.target.value) || 0)}
                    className="input mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Impact Dimensions */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-navy-200">Impact Dimensions (Triangular Estimates)</h4>
              {impactDimensionLabels.map((dim) => (
                <div key={dim.key} className="p-4 rounded-xl bg-navy-800/30 border border-navy-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-navy-200">{dim.label}</span>
                    <span className="text-xs text-navy-500">{dim.unit}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-emerald-400">Best Case</label>
                      <input
                        type="number"
                        value={currentAssessment.impactDimensions[dim.key].bestCase || ''}
                        onChange={(e) => updateImpactDimension(
                          currentAssessment.riskId,
                          dim.key,
                          'bestCase',
                          parseFloat(e.target.value) || 0
                        )}
                        className="input mt-1"
                        placeholder="Min"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-amber-400">Most Likely</label>
                      <input
                        type="number"
                        value={currentAssessment.impactDimensions[dim.key].mostLikely || ''}
                        onChange={(e) => updateImpactDimension(
                          currentAssessment.riskId,
                          dim.key,
                          'mostLikely',
                          parseFloat(e.target.value) || 0
                        )}
                        className="input mt-1"
                        placeholder="Mode"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-red-400">Worst Case</label>
                      <input
                        type="number"
                        value={currentAssessment.impactDimensions[dim.key].worstCase || ''}
                        onChange={(e) => updateImpactDimension(
                          currentAssessment.riskId,
                          dim.key,
                          'worstCase',
                          parseFloat(e.target.value) || 0
                        )}
                        className="input mt-1"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'kri_builder':
        return (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-navy-100">Key Risk Indicators</p>
                  <p className="text-sm text-navy-400 mt-1">
                    Define measurable indicators that signal when a risk is materializing.
                    Each KRI needs thresholds for warning and breach levels.
                  </p>
                </div>
              </div>
            </div>

            {/* KRI List */}
            <div className="space-y-4">
              {kriDrafts.map((kri) => (
                <div key={kri.id} className="p-4 rounded-xl bg-navy-800/50 border border-navy-700/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={kri.name}
                        onChange={(e) => updateKRI(kri.id, 'name', e.target.value)}
                        placeholder="KRI Name (e.g., System Downtime Hours)"
                        className="input font-medium"
                      />
                      <textarea
                        value={kri.description}
                        onChange={(e) => updateKRI(kri.id, 'description', e.target.value)}
                        placeholder="Description..."
                        className="input min-h-[60px]"
                      />
                    </div>
                    <button
                      onClick={() => removeKRI(kri.id)}
                      className="ml-3 p-2 text-navy-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div>
                      <label className="text-xs text-navy-500">Data Source</label>
                      <input
                        type="text"
                        value={kri.dataSource}
                        onChange={(e) => updateKRI(kri.id, 'dataSource', e.target.value)}
                        className="input mt-1"
                        placeholder="e.g., Monitoring System"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-navy-500">Measurement Frequency</label>
                      <select
                        value={kri.measurementFrequency}
                        onChange={(e) => updateKRI(kri.id, 'measurementFrequency', e.target.value as KRIDraft['measurementFrequency'])}
                        className="input mt-1"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-amber-400">Warning Threshold</label>
                      <input
                        type="number"
                        value={kri.warningThreshold}
                        onChange={(e) => updateKRI(kri.id, 'warningThreshold', parseInt(e.target.value) || 0)}
                        className="input mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-red-400">Breach Threshold</label>
                      <input
                        type="number"
                        value={kri.breachThreshold}
                        onChange={(e) => updateKRI(kri.id, 'breachThreshold', parseInt(e.target.value) || 0)}
                        className="input mt-1"
                      />
                    </div>
                  </div>

                  {/* Linked Risks */}
                  <div>
                    <label className="text-xs text-navy-500 mb-2 block">Linked Risks</label>
                    <div className="flex flex-wrap gap-2">
                      {riskDrafts.map((risk) => (
                        <button
                          key={risk.id}
                          onClick={() => {
                            const isLinked = kri.linkedRiskIds.includes(risk.id);
                            updateKRI(
                              kri.id,
                              'linkedRiskIds',
                              isLinked
                                ? kri.linkedRiskIds.filter((id) => id !== risk.id)
                                : [...kri.linkedRiskIds, risk.id]
                            );
                          }}
                          className={cn(
                            'px-2 py-1 rounded text-xs transition-colors',
                            kri.linkedRiskIds.includes(risk.id)
                              ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary'
                              : 'bg-navy-700/50 text-navy-400 border border-navy-600 hover:border-navy-500'
                          )}
                        >
                          {risk.description.slice(0, 30) || 'Untitled'}...
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addKRI}
                className="w-full p-4 rounded-xl border-2 border-dashed border-navy-700 hover:border-accent-primary/50 text-navy-400 hover:text-accent-primary transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Key Risk Indicator
              </button>
            </div>
          </div>
        );

      case 'kci_builder':
        return (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-navy-100">Key Control Indicators</p>
                  <p className="text-sm text-navy-400 mt-1">
                    Map controls to risks. Controls can be preventive (stop events) or detective (identify events).
                    Effectiveness ratings adjust residual risk scores.
                  </p>
                </div>
              </div>
            </div>

            {/* KCI List */}
            <div className="space-y-4">
              {kciDrafts.map((kci) => (
                <div key={kci.id} className="p-4 rounded-xl bg-navy-800/50 border border-navy-700/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={kci.name}
                        onChange={(e) => updateKCI(kci.id, 'name', e.target.value)}
                        placeholder="Control Name (e.g., Multi-Factor Authentication)"
                        className="input font-medium"
                      />
                      <textarea
                        value={kci.description}
                        onChange={(e) => updateKCI(kci.id, 'description', e.target.value)}
                        placeholder="Description of the control..."
                        className="input min-h-[60px]"
                      />
                    </div>
                    <button
                      onClick={() => removeKCI(kci.id)}
                      className="ml-3 p-2 text-navy-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div>
                      <label className="text-xs text-navy-500">Control Type</label>
                      <select
                        value={kci.controlType}
                        onChange={(e) => updateKCI(kci.id, 'controlType', e.target.value as ControlType)}
                        className="input mt-1"
                      >
                        <option value="preventive">Preventive</option>
                        <option value="detective">Detective</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-navy-500">Control Mode</label>
                      <select
                        value={kci.controlMode}
                        onChange={(e) => updateKCI(kci.id, 'controlMode', e.target.value as ControlMode)}
                        className="input mt-1"
                      >
                        <option value="automated">Automated</option>
                        <option value="manual">Manual</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-navy-500">Test Frequency</label>
                      <select
                        value={kci.frequency}
                        onChange={(e) => updateKCI(kci.id, 'frequency', e.target.value as KCIDraft['frequency'])}
                        className="input mt-1"
                      >
                        <option value="continuous">Continuous</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-navy-500">Effectiveness (1-5)</label>
                      <select
                        value={kci.effectivenessRating}
                        onChange={(e) => updateKCI(kci.id, 'effectivenessRating', parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5)}
                        className="input mt-1"
                      >
                        <option value={1}>1 - Ineffective</option>
                        <option value={2}>2 - Partially Effective</option>
                        <option value={3}>3 - Moderately Effective</option>
                        <option value={4}>4 - Mostly Effective</option>
                        <option value={5}>5 - Fully Effective</option>
                      </select>
                    </div>
                  </div>

                  {/* Linked Risks */}
                  <div>
                    <label className="text-xs text-navy-500 mb-2 block">Linked Risks (which risks does this control mitigate?)</label>
                    <div className="flex flex-wrap gap-2">
                      {riskDrafts.map((risk) => (
                        <button
                          key={risk.id}
                          onClick={() => {
                            const isLinked = kci.linkedRiskIds.includes(risk.id);
                            updateKCI(
                              kci.id,
                              'linkedRiskIds',
                              isLinked
                                ? kci.linkedRiskIds.filter((id) => id !== risk.id)
                                : [...kci.linkedRiskIds, risk.id]
                            );
                          }}
                          className={cn(
                            'px-2 py-1 rounded text-xs transition-colors',
                            kci.linkedRiskIds.includes(risk.id)
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500'
                              : 'bg-navy-700/50 text-navy-400 border border-navy-600 hover:border-navy-500'
                          )}
                        >
                          {risk.description.slice(0, 30) || 'Untitled'}...
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addKCI}
                className="w-full p-4 rounded-xl border-2 border-dashed border-navy-700 hover:border-emerald-500/50 text-navy-400 hover:text-emerald-400 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Control
              </button>
            </div>
          </div>
        );

      case 'risk_scoring':
        return (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-accent-primary/10 border border-accent-primary/30">
              <div className="flex items-start gap-3">
                <Calculator className="w-5 h-5 text-accent-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-navy-100">Risk Scoring Engine</p>
                  <p className="text-sm text-navy-400 mt-1">
                    Scores calculated using: Likelihood × Weighted Impact × Constraint Sensitivity × Risk Appetite Modifier.
                    Residual scores factor in control effectiveness.
                  </p>
                </div>
              </div>
            </div>

            {calculatedScores.length === 0 ? (
              <div className="text-center py-8">
                <button
                  onClick={calculateScores}
                  className="btn-primary"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Risk Scores
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-navy-800/50 border border-navy-700/50">
                    <p className="text-xs text-navy-500">Total EMV</p>
                    <p className="text-xl font-bold text-navy-100">
                      ${calculatedScores.reduce((sum, s) => sum + s.expectedMonetaryValue, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-navy-800/50 border border-navy-700/50">
                    <p className="text-xs text-navy-500">Avg Gross Score</p>
                    <p className="text-xl font-bold text-navy-100">
                      {(calculatedScores.reduce((sum, s) => sum + s.grossRiskScore, 0) / calculatedScores.length).toFixed(0)}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-navy-800/50 border border-navy-700/50">
                    <p className="text-xs text-navy-500">Avg Residual Score</p>
                    <p className="text-xl font-bold text-emerald-400">
                      {(calculatedScores.reduce((sum, s) => sum + s.residualRiskScore, 0) / calculatedScores.length).toFixed(0)}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-navy-800/50 border border-navy-700/50">
                    <p className="text-xs text-navy-500">Schedule Exposure</p>
                    <p className="text-xl font-bold text-navy-100">
                      {calculatedScores.reduce((sum, s) => sum + s.scheduleRiskExposure, 0).toFixed(0)} days
                    </p>
                  </div>
                </div>

                {/* Risk Score Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-navy-700">
                        <th className="text-left py-3 px-4 text-xs font-medium text-navy-500">Rank</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-navy-500">Risk</th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-navy-500">Gross</th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-navy-500">Residual</th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-navy-500">EMV</th>
                        <th className="text-center py-3 px-4 text-xs font-medium text-navy-500">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculatedScores.map((score) => {
                        const risk = getRiskById(score.riskId);
                        const reduction = ((score.grossRiskScore - score.residualRiskScore) / score.grossRiskScore) * 100;
                        return (
                          <tr key={score.riskId} className="border-b border-navy-800/50 hover:bg-navy-800/30">
                            <td className="py-3 px-4">
                              <span className="w-6 h-6 rounded-full bg-navy-700 flex items-center justify-center text-xs font-bold text-navy-200">
                                {score.priorityRank}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <p className="text-sm text-navy-200 line-clamp-1">{risk?.description || 'Unknown'}</p>
                              <p className="text-xs text-navy-500">{risk?.category}</p>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span className={cn(
                                'text-sm font-bold',
                                score.grossRiskScore >= 70 ? 'text-red-400' :
                                score.grossRiskScore >= 40 ? 'text-amber-400' : 'text-emerald-400'
                              )}>
                                {score.grossRiskScore}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span className="text-sm font-bold text-emerald-400">{score.residualRiskScore}</span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span className="text-sm text-navy-200">${score.expectedMonetaryValue.toLocaleString()}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {reduction > 20 ? (
                                <TrendingDown className="w-4 h-4 text-emerald-400 inline" />
                              ) : reduction > 0 ? (
                                <Minus className="w-4 h-4 text-amber-400 inline" />
                              ) : (
                                <TrendingUp className="w-4 h-4 text-red-400 inline" />
                              )}
                              <span className="text-xs text-navy-500 ml-1">-{reduction.toFixed(0)}%</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-navy-700/50">
                  <button
                    onClick={calculateScores}
                    className="text-sm text-accent-primary hover:text-accent-primary/80 flex items-center gap-1"
                  >
                    <Calculator className="w-4 h-4" /> Recalculate Scores
                  </button>

                  {/* Approve Risk Profile Button */}
                  {!riskProfileApproved ? (
                    <button
                      onClick={() => setRiskProfileApproved(true)}
                      className="btn-primary"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Risk Profile
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Profile Approved</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 'register_generation':
        return (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-navy-100">Risk Register Generated</p>
                  <p className="text-sm text-navy-400 mt-1">
                    Your canonical risk register is ready with {riskDrafts.length} risks,{' '}
                    {kriDrafts.length} KRIs, and {kciDrafts.length} controls.
                  </p>
                </div>
              </div>
            </div>

            {/* Register Preview */}
            <div className="p-4 rounded-xl bg-navy-800/30 border border-navy-700/50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-navy-200">Register Preview</h4>
                <div className="flex gap-2">
                  <button className="btn-secondary text-xs">
                    <Eye className="w-3 h-3 mr-1" /> Preview
                  </button>
                  <button className="btn-primary text-xs">
                    <Download className="w-3 h-3 mr-1" /> Export
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {riskDrafts.slice(0, 3).map((risk, idx) => {
                  const score = calculatedScores.find((s) => s.riskId === risk.id);
                  const controls = kciDrafts.filter((k) => k.linkedRiskIds.includes(risk.id));
                  const indicators = kriDrafts.filter((k) => k.linkedRiskIds.includes(risk.id));

                  return (
                    <div key={risk.id} className="p-3 rounded-lg bg-navy-800/50 border border-navy-700/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-2xs font-medium bg-navy-700 text-navy-300">
                              R-{String(idx + 1).padStart(3, '0')}
                            </span>
                            <span className={cn(
                              'px-2 py-0.5 rounded text-2xs font-medium',
                              risk.category === 'cyber' ? 'bg-violet-500/20 text-violet-300' :
                              risk.category === 'financial' ? 'bg-emerald-500/20 text-emerald-300' :
                              risk.category === 'operational' ? 'bg-blue-500/20 text-blue-300' :
                              'bg-amber-500/20 text-amber-300'
                            )}>
                              {risk.category}
                            </span>
                          </div>
                          <p className="text-sm text-navy-200 mt-2 line-clamp-2">{risk.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-navy-500">
                            <span>{controls.length} controls</span>
                            <span>{indicators.length} KRIs</span>
                            <span>Owner: {objective.name}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-navy-500">Risk Score</p>
                          <p className={cn(
                            'text-lg font-bold',
                            (score?.residualRiskScore || 0) >= 70 ? 'text-red-400' :
                            (score?.residualRiskScore || 0) >= 40 ? 'text-amber-400' : 'text-emerald-400'
                          )}>
                            {score?.residualRiskScore || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {riskDrafts.length > 3 && (
                  <p className="text-xs text-navy-500 text-center">+ {riskDrafts.length - 3} more risks</p>
                )}
              </div>
            </div>

            {/* Register Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-navy-800/50 border border-navy-700/50 text-center">
                <p className="text-2xl font-bold text-navy-100">{riskDrafts.length}</p>
                <p className="text-xs text-navy-500">Risks</p>
              </div>
              <div className="p-4 rounded-xl bg-navy-800/50 border border-navy-700/50 text-center">
                <p className="text-2xl font-bold text-navy-100">{kriDrafts.length}</p>
                <p className="text-xs text-navy-500">KRIs</p>
              </div>
              <div className="p-4 rounded-xl bg-navy-800/50 border border-navy-700/50 text-center">
                <p className="text-2xl font-bold text-navy-100">{kciDrafts.length}</p>
                <p className="text-xs text-navy-500">Controls</p>
              </div>
              <div className="p-4 rounded-xl bg-navy-800/50 border border-navy-700/50 text-center">
                <p className="text-2xl font-bold text-accent-primary">{constraints.length}</p>
                <p className="text-xs text-navy-500">Constraints</p>
              </div>
            </div>
          </div>
        );

      case 'tool_selection':
        return (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-accent-primary/10 border border-accent-primary/30">
              <div className="flex items-start gap-3">
                <Wrench className="w-5 h-5 text-accent-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-navy-100">Select Analysis Tools</p>
                  <p className="text-sm text-navy-400 mt-1">
                    Choose simulation and analysis tools based on your risk profile.
                    Multiple tools can be selected for comprehensive analysis.
                  </p>
                </div>
              </div>
            </div>

            {/* Tool Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {simulationTools.map((tool) => {
                const isSelected = selectedTools.includes(tool.id);
                return (
                  <button
                    key={tool.id}
                    onClick={() => toggleTool(tool.id)}
                    className={cn(
                      'p-4 rounded-xl border text-left transition-all',
                      isSelected
                        ? 'bg-accent-primary/10 border-accent-primary'
                        : 'bg-navy-800/50 border-navy-700 hover:border-navy-600'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'p-2 rounded-lg',
                        isSelected ? 'bg-accent-primary/20' : 'bg-navy-700/50'
                      )}>
                        <tool.icon className={cn(
                          'w-5 h-5',
                          isSelected ? 'text-accent-primary' : 'text-navy-400'
                        )} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={cn(
                            'text-sm font-medium',
                            isSelected ? 'text-accent-primary' : 'text-navy-200'
                          )}>
                            {tool.name}
                          </h4>
                          {isSelected && <CheckCircle className="w-4 h-4 text-accent-primary" />}
                        </div>
                        <p className="text-xs text-navy-400 mt-1">{tool.description}</p>
                        <p className="text-2xs text-navy-500 mt-2">{tool.useCase}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedTools.length > 0 && (
              <div className="p-3 rounded-lg bg-navy-800/30 border border-navy-700/50">
                <p className="text-xs text-navy-500">
                  Selected: {selectedTools.map((t) => simulationTools.find((st) => st.id === t)?.name).join(', ')}
                </p>
              </div>
            )}
          </div>
        );

      case 'simulation':
        return (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-start gap-3">
                <Play className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-navy-100">Run Simulations</p>
                  <p className="text-sm text-navy-400 mt-1">
                    Execute selected analysis tools on your risk portfolio.
                    Results will be saved and available in the Analytics dashboard.
                  </p>
                </div>
              </div>
            </div>

            {/* Selected Tools Summary */}
            <div className="space-y-3">
              {selectedTools.map((toolId) => {
                const tool = simulationTools.find((t) => t.id === toolId);
                if (!tool) return null;
                return (
                  <div key={tool.id} className="p-4 rounded-xl bg-navy-800/50 border border-navy-700/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-navy-700/50">
                        <tool.icon className="w-5 h-5 text-navy-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-navy-200">{tool.name}</h4>
                        <p className="text-xs text-navy-500">{tool.description}</p>
                      </div>
                      {simulationComplete && (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Simulation Controls */}
            {!simulationComplete ? (
              <div className="text-center py-8">
                <button
                  onClick={runSimulation}
                  disabled={simulationRunning}
                  className={cn(
                    'btn-primary',
                    simulationRunning && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {simulationRunning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Running Simulations...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run All Simulations
                    </>
                  )}
                </button>
                <p className="text-xs text-navy-500 mt-3">
                  This will run {selectedTools.length} analysis tool{selectedTools.length > 1 ? 's' : ''} on {riskDrafts.length} risks
                </p>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-navy-100 mb-2">Analysis Complete</h3>
                <p className="text-sm text-navy-400 mb-4">
                  All simulations have completed successfully. Results are now available.
                </p>
                <div className="flex justify-center gap-3">
                  <button className="btn-secondary">
                    <Eye className="w-4 h-4 mr-2" />
                    View Results
                  </button>
                  <button className="btn-primary">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-navy-800/50 flex items-center justify-center mb-4">
              <currentPhase.icon className="w-8 h-8 text-navy-500" />
            </div>
            <h3 className="text-lg font-semibold text-navy-200 mb-2">{currentPhase.label}</h3>
            <p className="text-sm text-navy-500 max-w-md">
              {currentPhase.description}. This phase will be unlocked after completing previous phases.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Phase Progress */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {phases.map((phase, index) => {
            const isComplete = phaseValidation[phase.id];
            const isCurrent = index === currentPhaseIndex;
            const isLocked = index > currentPhaseIndex && !phaseValidation[phases[index - 1]?.id];

            return (
              <button
                key={phase.id}
                onClick={() => !isLocked && setCurrentPhaseIndex(index)}
                disabled={isLocked}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all',
                  isCurrent
                    ? 'bg-accent-primary/20 text-accent-primary'
                    : isComplete
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : isLocked
                    ? 'bg-navy-800/30 text-navy-600 cursor-not-allowed'
                    : 'bg-navy-800/50 text-navy-400 hover:text-navy-200'
                )}
              >
                {isComplete ? (
                  <CheckCircle className="w-4 h-4" />
                ) : isLocked ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <phase.icon className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{phase.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Phase Content */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-accent-primary/20">
            <currentPhase.icon className="w-5 h-5 text-accent-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-navy-100">{currentPhase.label}</h2>
            <p className="text-sm text-navy-400">{currentPhase.description}</p>
          </div>
        </div>

        {renderPhaseContent()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={currentPhaseIndex === 0}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
            currentPhaseIndex === 0
              ? 'text-navy-600 cursor-not-allowed'
              : 'text-navy-300 hover:text-navy-100 hover:bg-navy-800/50'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-sm text-navy-500">
          Phase {currentPhaseIndex + 1} of {phases.length}
        </div>

        <button
          onClick={handleNext}
          disabled={!canProceed() || currentPhaseIndex === phases.length - 1}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
            canProceed() && currentPhaseIndex < phases.length - 1
              ? 'bg-accent-primary text-white hover:bg-accent-primary/90'
              : 'bg-navy-800/50 text-navy-600 cursor-not-allowed'
          )}
        >
          {currentPhaseIndex === phases.length - 1 ? 'Complete' : 'Continue'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
