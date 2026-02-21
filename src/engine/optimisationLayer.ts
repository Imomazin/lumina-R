// ============================================================================
// LUMINA-R v2 ENGINE — OPTIMISATION LAYER
// Capital allocation engine, marginal EMV reduction, ROI calculations
// ============================================================================

import { enterpriseRisks, type EnterpriseRisk } from './dataLayer';
import {
  calculateRiskEMV,
  calculatePortfolioEMV,
  CONTROL_EFFECTIVENESS_FACTOR
} from './quantificationLayer';

// ============================================================================
// OPTIMISATION CONFIGURATION
// ============================================================================

export const OPTIMISATION_CONFIG = {
  // Cost per 1% control effectiveness improvement (£)
  costPer1PercentImprovement: {
    Low: 25000,     // £25K to improve low controls by 1%
    Medium: 35000,  // £35K to improve medium controls by 1%
    High: 50000     // £50K to improve high controls by 1%
  },
  // Maximum control effectiveness achievable
  maxControlEffectiveness: 0.85,
  // Minimum investment threshold for recommendations
  minimumInvestmentThreshold: 10000,
  // Categories of investment priority
  priorityWeights: {
    outsideAppetite: 2.0,
    escalated: 1.5,
    highVelocity: 1.3,
    criticalCategory: 1.2  // Cybersecurity, Compliance, Financial
  },
  criticalCategories: ['Cybersecurity', 'Compliance', 'Financial']
};

// ============================================================================
// MARGINAL EMV ANALYSIS
// ============================================================================

export interface MarginalEMVAnalysis {
  riskId: number;
  riskDescription: string;
  category: string;
  currentControlEffectiveness: string;
  currentResidualEMV: number;
  marginalEMVPer1Percent: number;
  costPer1Percent: number;
  maxImprovementPossible: number;  // Percentage points
  maxEMVReductionPossible: number;
  costForMaxImprovement: number;
  roiPer1Percent: number;  // EMV reduction / cost
  priorityScore: number;
}

export function calculateMarginalEMV(risk: EnterpriseRisk): MarginalEMVAnalysis {
  const emv = calculateRiskEMV(risk);
  const currentControlFactor = CONTROL_EFFECTIVENESS_FACTOR[risk.controlEffectiveness];
  const maxFactor = OPTIMISATION_CONFIG.maxControlEffectiveness;

  // Calculate EMV with 1% better control
  const improvedFactor = Math.min(maxFactor, currentControlFactor + 0.01);
  const improvedResidualEMV = Math.round(emv.inherentEMV * (1 - improvedFactor));
  const marginalEMVPer1Percent = emv.residualEMV - improvedResidualEMV;

  // Cost per 1% improvement
  const costPer1Percent = OPTIMISATION_CONFIG.costPer1PercentImprovement[
    risk.controlEffectiveness as keyof typeof OPTIMISATION_CONFIG.costPer1PercentImprovement
  ];

  // Maximum improvement possible
  const maxImprovementPossible = Math.round((maxFactor - currentControlFactor) * 100);
  const maxImprovedResidualEMV = Math.round(emv.inherentEMV * (1 - maxFactor));
  const maxEMVReductionPossible = emv.residualEMV - maxImprovedResidualEMV;
  const costForMaxImprovement = maxImprovementPossible * costPer1Percent;

  // ROI calculation
  const roiPer1Percent = marginalEMVPer1Percent / costPer1Percent;

  // Priority score calculation
  let priorityScore = roiPer1Percent;
  if (risk.riskAppetiteAlignment === 'Outside Appetite') {
    priorityScore *= OPTIMISATION_CONFIG.priorityWeights.outsideAppetite;
  }
  if (risk.riskStatus === 'Escalated') {
    priorityScore *= OPTIMISATION_CONFIG.priorityWeights.escalated;
  }
  if (risk.velocity === 'Fast') {
    priorityScore *= OPTIMISATION_CONFIG.priorityWeights.highVelocity;
  }
  if (OPTIMISATION_CONFIG.criticalCategories.includes(risk.riskCategory)) {
    priorityScore *= OPTIMISATION_CONFIG.priorityWeights.criticalCategory;
  }

  return {
    riskId: risk.riskId,
    riskDescription: risk.riskDescription,
    category: risk.riskCategory,
    currentControlEffectiveness: risk.controlEffectiveness,
    currentResidualEMV: emv.residualEMV,
    marginalEMVPer1Percent,
    costPer1Percent,
    maxImprovementPossible,
    maxEMVReductionPossible,
    costForMaxImprovement,
    roiPer1Percent: Math.round(roiPer1Percent * 100) / 100,
    priorityScore: Math.round(priorityScore * 100) / 100
  };
}

// ============================================================================
// CAPITAL ALLOCATION ENGINE
// ============================================================================

export interface InvestmentRecommendation {
  riskId: number;
  riskDescription: string;
  category: string;
  currentEMV: number;
  recommendedInvestment: number;
  controlImprovementPercent: number;
  expectedEMVReduction: number;
  newProjectedEMV: number;
  roi: number;
  priority: number;
  rationale: string;
}

export interface CapitalAllocationResult {
  totalBudget: number;
  allocatedBudget: number;
  unallocatedBudget: number;
  recommendations: InvestmentRecommendation[];
  expectedTotalEMVReduction: number;
  currentPortfolioEMV: number;
  projectedPortfolioEMV: number;
  portfolioEMVReductionPercent: number;
  overallROI: number;
  summary: {
    risksAddressed: number;
    categoriesImpacted: string[];
    outsideAppetiteResolved: number;
  };
}

export function optimizeCapitalAllocation(budget: number): CapitalAllocationResult {
  const portfolioEMV = calculatePortfolioEMV();

  // Calculate marginal EMV for all risks
  const marginalAnalyses = enterpriseRisks
    .map(calculateMarginalEMV)
    .filter(m => m.maxImprovementPossible > 0)  // Only risks that can be improved
    .sort((a, b) => b.priorityScore - a.priorityScore);  // Highest priority first

  const recommendations: InvestmentRecommendation[] = [];
  let remainingBudget = budget;
  let totalEMVReduction = 0;

  for (const analysis of marginalAnalyses) {
    if (remainingBudget < OPTIMISATION_CONFIG.minimumInvestmentThreshold) break;

    // Calculate how much we can invest in this risk
    const maxInvestment = Math.min(remainingBudget, analysis.costForMaxImprovement);
    const improvementPercent = Math.floor(maxInvestment / analysis.costPer1Percent);

    if (improvementPercent < 1) continue;

    const actualInvestment = improvementPercent * analysis.costPer1Percent;
    const emvReduction = improvementPercent * analysis.marginalEMVPer1Percent;
    const newProjectedEMV = analysis.currentResidualEMV - emvReduction;

    // Generate rationale
    let rationale = `Improve ${analysis.currentControlEffectiveness} control effectiveness by ${improvementPercent}%`;
    if (analysis.currentControlEffectiveness === 'Low') {
      rationale += '. Low controls offer best improvement potential.';
    }
    const risk = enterpriseRisks.find(r => r.riskId === analysis.riskId);
    if (risk?.riskAppetiteAlignment === 'Outside Appetite') {
      rationale += ' Critical: Currently outside appetite.';
    }
    if (risk?.riskStatus === 'Escalated') {
      rationale += ' Note: Risk is escalated.';
    }

    recommendations.push({
      riskId: analysis.riskId,
      riskDescription: analysis.riskDescription,
      category: analysis.category,
      currentEMV: analysis.currentResidualEMV,
      recommendedInvestment: actualInvestment,
      controlImprovementPercent: improvementPercent,
      expectedEMVReduction: emvReduction,
      newProjectedEMV,
      roi: Math.round((emvReduction / actualInvestment) * 100) / 100,
      priority: recommendations.length + 1,
      rationale
    });

    remainingBudget -= actualInvestment;
    totalEMVReduction += emvReduction;
  }

  // Calculate summary stats
  const categoriesImpacted = [...new Set(recommendations.map(r => r.category))];
  const outsideAppetiteResolved = recommendations.filter(r => {
    const risk = enterpriseRisks.find(risk => risk.riskId === r.riskId);
    return risk?.riskAppetiteAlignment === 'Outside Appetite';
  }).length;

  const projectedPortfolioEMV = portfolioEMV.totalResidualEMV - totalEMVReduction;

  return {
    totalBudget: budget,
    allocatedBudget: budget - remainingBudget,
    unallocatedBudget: remainingBudget,
    recommendations,
    expectedTotalEMVReduction: totalEMVReduction,
    currentPortfolioEMV: portfolioEMV.totalResidualEMV,
    projectedPortfolioEMV,
    portfolioEMVReductionPercent: Math.round((totalEMVReduction / portfolioEMV.totalResidualEMV) * 100),
    overallROI: Math.round((totalEMVReduction / (budget - remainingBudget)) * 100) / 100,
    summary: {
      risksAddressed: recommendations.length,
      categoriesImpacted,
      outsideAppetiteResolved
    }
  };
}

// ============================================================================
// QUICK WIN ANALYSIS
// ============================================================================

export interface QuickWin {
  riskId: number;
  riskDescription: string;
  category: string;
  investment: number;
  emvReduction: number;
  roi: number;
  timeToImplement: 'Immediate' | '30 days' | '90 days';
}

export function identifyQuickWins(maxInvestment: number = 100000): QuickWin[] {
  return enterpriseRisks
    .map(calculateMarginalEMV)
    .filter(m => m.costPer1Percent <= maxInvestment && m.roiPer1Percent >= 1.5)
    .map(m => {
      let timeToImplement: QuickWin['timeToImplement'];
      if (m.currentControlEffectiveness === 'Low') timeToImplement = '90 days';
      else if (m.currentControlEffectiveness === 'Medium') timeToImplement = '30 days';
      else timeToImplement = 'Immediate';

      return {
        riskId: m.riskId,
        riskDescription: m.riskDescription,
        category: m.category,
        investment: m.costPer1Percent,
        emvReduction: m.marginalEMVPer1Percent,
        roi: m.roiPer1Percent,
        timeToImplement
      };
    })
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 15);
}

// ============================================================================
// INVESTMENT SCENARIO COMPARISON
// ============================================================================

export interface InvestmentScenario {
  scenarioName: string;
  budget: number;
  result: CapitalAllocationResult;
}

export function compareInvestmentScenarios(budgets: number[]): InvestmentScenario[] {
  return budgets.map(budget => ({
    scenarioName: `£${(budget / 1000000).toFixed(1)}M Investment`,
    budget,
    result: optimizeCapitalAllocation(budget)
  }));
}

// ============================================================================
// CATEGORY-SPECIFIC OPTIMISATION
// ============================================================================

export function optimizeCategoryAllocation(
  category: string,
  budget: number
): CapitalAllocationResult {
  const categoryRisks = enterpriseRisks.filter(r => r.riskCategory === category);

  // Calculate marginal EMV for category risks only
  const marginalAnalyses = categoryRisks
    .map(calculateMarginalEMV)
    .filter(m => m.maxImprovementPossible > 0)
    .sort((a, b) => b.priorityScore - a.priorityScore);

  const recommendations: InvestmentRecommendation[] = [];
  let remainingBudget = budget;
  let totalEMVReduction = 0;
  const categoryEMV = categoryRisks.reduce((sum, r) => sum + calculateRiskEMV(r).residualEMV, 0);

  for (const analysis of marginalAnalyses) {
    if (remainingBudget < OPTIMISATION_CONFIG.minimumInvestmentThreshold) break;

    const maxInvestment = Math.min(remainingBudget, analysis.costForMaxImprovement);
    const improvementPercent = Math.floor(maxInvestment / analysis.costPer1Percent);

    if (improvementPercent < 1) continue;

    const actualInvestment = improvementPercent * analysis.costPer1Percent;
    const emvReduction = improvementPercent * analysis.marginalEMVPer1Percent;
    const newProjectedEMV = analysis.currentResidualEMV - emvReduction;

    recommendations.push({
      riskId: analysis.riskId,
      riskDescription: analysis.riskDescription,
      category: analysis.category,
      currentEMV: analysis.currentResidualEMV,
      recommendedInvestment: actualInvestment,
      controlImprovementPercent: improvementPercent,
      expectedEMVReduction: emvReduction,
      newProjectedEMV,
      roi: Math.round((emvReduction / actualInvestment) * 100) / 100,
      priority: recommendations.length + 1,
      rationale: `Category-specific: Improve ${analysis.currentControlEffectiveness} controls by ${improvementPercent}%`
    });

    remainingBudget -= actualInvestment;
    totalEMVReduction += emvReduction;
  }

  return {
    totalBudget: budget,
    allocatedBudget: budget - remainingBudget,
    unallocatedBudget: remainingBudget,
    recommendations,
    expectedTotalEMVReduction: totalEMVReduction,
    currentPortfolioEMV: categoryEMV,
    projectedPortfolioEMV: categoryEMV - totalEMVReduction,
    portfolioEMVReductionPercent: Math.round((totalEMVReduction / categoryEMV) * 100),
    overallROI: (budget - remainingBudget) > 0
      ? Math.round((totalEMVReduction / (budget - remainingBudget)) * 100) / 100
      : 0,
    summary: {
      risksAddressed: recommendations.length,
      categoriesImpacted: [category],
      outsideAppetiteResolved: recommendations.filter(r => {
        const risk = categoryRisks.find(risk => risk.riskId === r.riskId);
        return risk?.riskAppetiteAlignment === 'Outside Appetite';
      }).length
    }
  };
}
