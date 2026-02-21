// ============================================================================
// LUMINA-R v2 ENGINE — BOARD PACK GENERATOR
// Structured board reporting, executive summaries, action plans
// ============================================================================

import {
  getRiskStats,
  getBreachedAppetites,
  getKRIStats,
  getControlStats
} from './dataLayer';
import {
  calculatePortfolioEMV,
  calculateCategoryEMV,
  getTopRisksByEMV,
  calculateAppetiteBreachDeltas
} from './quantificationLayer';
import { forecastPortfolio, getTopDeterioratingRisks, getImminentBreachWarnings } from './forecastLayer';
import { optimizeCapitalAllocation, identifyQuickWins } from './optimisationLayer';
import { detectSystemicClusters, getHighCentralityRisks } from './correlationLayer';
import { evaluateGovernanceTriggers, generateGovernanceCalendar } from './governanceLayer';
import { compareScenarios } from './scenarioLayer';
import { getPortfolioConfidenceOverview } from './confidenceLayer';

// ============================================================================
// BOARD PACK TYPES
// ============================================================================

export interface BoardPackSection {
  sectionId: string;
  title: string;
  executiveSummary: string;
  keyMetrics: Record<string, string | number>;
  details: unknown;
  actionRequired: boolean;
  priority: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
}

export interface BoardPack {
  generatedAt: string;
  reportingPeriod: string;
  portfolioSummary: BoardPackSection;
  topRisks: BoardPackSection;
  appetiteBreaches: BoardPackSection;
  forecastedExposures: BoardPackSection;
  systemicClusters: BoardPackSection;
  capitalRecommendations: BoardPackSection;
  governanceFlags: BoardPackSection;
  actionPlan90Day: BoardPackSection;
  stressTestResults: BoardPackSection;
  confidenceAssessment: BoardPackSection;
  executiveBriefing: string;
  keyDecisionsRequired: string[];
  appendices: {
    fullRiskList: boolean;
    detailedMethodology: boolean;
    glossary: boolean;
  };
}

// ============================================================================
// SECTION GENERATORS
// ============================================================================

function generatePortfolioSummary(): BoardPackSection {
  const stats = getRiskStats();
  const portfolio = calculatePortfolioEMV();
  const categories = calculateCategoryEMV();
  const kriStats = getKRIStats();
  const controlStats = getControlStats();
  const confidence = getPortfolioConfidenceOverview();

  const topCategory = categories.sort((a, b) => b.totalResidualEMV - a.totalResidualEMV)[0];

  return {
    sectionId: 'portfolio-summary',
    title: 'Portfolio Risk Summary',
    executiveSummary: `The enterprise risk portfolio comprises ${stats.total} risks with total residual EMV of £${(portfolio.totalResidualEMV / 1000000).toFixed(1)}M. Controls provide ${portfolio.controlEffectivenessPercent}% EMV reduction. ${stats.escalated} risks are escalated and ${stats.outsideAppetite} are outside appetite. ${topCategory.category} represents the highest exposure at £${(topCategory.totalResidualEMV / 1000000).toFixed(1)}M.`,
    keyMetrics: {
      'Total Risks': stats.total,
      'Total Inherent EMV': `£${(portfolio.totalInherentEMV / 1000000).toFixed(1)}M`,
      'Total Residual EMV': `£${(portfolio.totalResidualEMV / 1000000).toFixed(1)}M`,
      'Control Effectiveness': `${portfolio.controlEffectivenessPercent}%`,
      'Escalated Risks': stats.escalated,
      'Outside Appetite': stats.outsideAppetite,
      'KRI Breach Rate': `${kriStats.breachRate}%`,
      'Avg Control Score': `${controlStats.avgEffectiveness}%`,
      'Portfolio Confidence': `${confidence.averageConfidence}%`
    },
    details: {
      categoryBreakdown: categories,
      riskDistribution: stats,
      kriHealth: kriStats,
      controlCoverage: controlStats.riskCoverage
    },
    actionRequired: stats.outsideAppetite > 5 || stats.escalated > 10,
    priority: stats.outsideAppetite > 10 ? 'Critical' : stats.outsideAppetite > 5 ? 'High' : 'Medium'
  };
}

function generateTopRisksSection(): BoardPackSection {
  const topRisks = getTopRisksByEMV(5);
  const totalTopRiskEMV = topRisks.reduce((sum, r) => sum + r.emv.residualEMV, 0);
  const portfolio = calculatePortfolioEMV();
  const concentrationPercent = Math.round((totalTopRiskEMV / portfolio.totalResidualEMV) * 100);

  return {
    sectionId: 'top-risks',
    title: 'Top 5 Risks by EMV',
    executiveSummary: `The top 5 risks account for £${(totalTopRiskEMV / 1000000).toFixed(1)}M (${concentrationPercent}% of portfolio EMV). ${topRisks.filter(r => r.risk.riskAppetiteAlignment === 'Outside Appetite').length} are outside appetite and require immediate treatment planning.`,
    keyMetrics: {
      'Top Risk EMV': `£${(topRisks[0]?.emv.residualEMV || 0).toLocaleString()}`,
      'Top 5 Total': `£${(totalTopRiskEMV / 1000000).toFixed(1)}M`,
      'Portfolio Concentration': `${concentrationPercent}%`,
      'Outside Appetite Count': topRisks.filter(r => r.risk.riskAppetiteAlignment === 'Outside Appetite').length,
      'Escalated Count': topRisks.filter(r => r.risk.riskStatus === 'Escalated').length
    },
    details: topRisks.map(r => ({
      rank: r.rank,
      riskId: r.risk.riskId,
      category: r.risk.riskCategory,
      description: r.risk.riskDescription.substring(0, 80),
      residualEMV: r.emv.residualEMV,
      controlEffectiveness: r.risk.controlEffectiveness,
      appetiteStatus: r.risk.riskAppetiteAlignment,
      owner: r.risk.riskOwner,
      escalationLevel: r.escalation.escalationLevel
    })),
    actionRequired: topRisks.some(r => r.risk.riskAppetiteAlignment === 'Outside Appetite'),
    priority: topRisks[0]?.emv.residualEMV > 5000000 ? 'Critical' : 'High'
  };
}

function generateAppetiteBreachesSection(): BoardPackSection {
  const breaches = getBreachedAppetites();
  const deltas = calculateAppetiteBreachDeltas();
  const breachedDeltas = deltas.filter(d => d.status === 'Breached');
  const approachingDeltas = deltas.filter(d => d.status === 'Approaching');

  return {
    sectionId: 'appetite-breaches',
    title: 'Risk Appetite Status',
    executiveSummary: `${breaches.length} appetite categories are currently breached. ${approachingDeltas.length} categories are approaching tolerance limits. Total EMV exposure in breached categories is £${(breachedDeltas.reduce((s, d) => s + d.associatedEMV, 0) / 1000000).toFixed(1)}M.`,
    keyMetrics: {
      'Breached Categories': breaches.length,
      'Approaching Threshold': approachingDeltas.length,
      'Within Tolerance': deltas.filter(d => d.status === 'Within').length,
      'Total Breached EMV': `£${(breachedDeltas.reduce((s, d) => s + d.associatedEMV, 0) / 1000000).toFixed(1)}M`,
      'Max Breach %': `${Math.max(...deltas.map(d => d.breachPercent))}%`
    },
    details: {
      breachedCategories: breachedDeltas.map(d => ({
        category: d.category,
        currentLevel: d.currentLevel,
        tolerance: d.toleranceMax,
        breachAmount: d.breachAmount,
        breachPercent: d.breachPercent,
        associatedEMV: d.associatedEMV
      })),
      approachingCategories: approachingDeltas.map(d => ({
        category: d.category,
        currentLevel: d.currentLevel,
        tolerance: d.toleranceMax,
        headroom: d.toleranceMax - d.currentLevel
      }))
    },
    actionRequired: breaches.length > 0,
    priority: breaches.length > 2 ? 'Critical' : breaches.length > 0 ? 'High' : 'Low'
  };
}

function generateForecastSection(): BoardPackSection {
  const forecasts = forecastPortfolio();
  const deteriorating = getTopDeterioratingRisks(5);
  const warnings = getImminentBreachWarnings();
  const forecast90 = forecasts.find(f => f.horizon === 90);
  const forecast365 = forecasts.find(f => f.horizon === 365);

  return {
    sectionId: 'forecasted-exposures',
    title: 'Risk Trajectory Forecast',
    executiveSummary: `Portfolio EMV is projected to ${forecast90 && forecast90.deltaPercent > 0 ? 'increase' : 'decrease'} by ${Math.abs(forecast90?.deltaPercent || 0)}% over 90 days (£${((forecast90?.deltaEMV || 0) / 1000000).toFixed(1)}M). ${deteriorating.length} risks show deteriorating trajectories. ${warnings.filter(w => w.urgency === 'Immediate').length} risks have imminent breach warnings.`,
    keyMetrics: {
      '30-Day Delta': `${forecasts[0]?.deltaPercent || 0}%`,
      '90-Day Delta': `${forecast90?.deltaPercent || 0}%`,
      '365-Day Delta': `${forecast365?.deltaPercent || 0}%`,
      'Deteriorating Risks': deteriorating.length,
      'Imminent Breaches': warnings.filter(w => w.urgency === 'Immediate').length,
      'Critical Trajectory': forecasts[0]?.criticalRisksCount || 0
    },
    details: {
      horizonForecasts: forecasts,
      topDeteriorating: deteriorating.slice(0, 5).map(d => ({
        riskId: d.riskId,
        description: d.riskDescription.substring(0, 60),
        currentEMV: d.currentResidualEMV,
        forecast365EMV: d.forecasts.find(f => f.days === 365)?.projectedResidualEMV,
        trend: d.riskTrend
      })),
      imminentWarnings: warnings.slice(0, 5)
    },
    actionRequired: deteriorating.length > 3 || warnings.some(w => w.urgency === 'Immediate'),
    priority: warnings.some(w => w.urgency === 'Immediate') ? 'Critical' : deteriorating.length > 5 ? 'High' : 'Medium'
  };
}

function generateSystemicClustersSection(): BoardPackSection {
  const clusters = detectSystemicClusters();
  const highCentrality = getHighCentralityRisks(5);
  const criticalClusters = clusters.filter(c => c.systemicRiskLevel === 'Critical' || c.systemicRiskLevel === 'High');
  const totalCascadeExposure = clusters.reduce((sum, c) => sum + c.cascadeExposure, 0);

  return {
    sectionId: 'systemic-clusters',
    title: 'Systemic Risk Clusters',
    executiveSummary: `${clusters.length} systemic clusters identified, of which ${criticalClusters.length} are rated Critical/High. Total cascade exposure is £${(totalCascadeExposure / 1000000).toFixed(1)}M. The most connected risk (Risk #${highCentrality[0]?.riskId}) has ${highCentrality[0]?.connectionCount} connections.`,
    keyMetrics: {
      'Total Clusters': clusters.length,
      'Critical Clusters': criticalClusters.length,
      'Cascade Exposure': `£${(totalCascadeExposure / 1000000).toFixed(1)}M`,
      'Most Connected Risk': `#${highCentrality[0]?.riskId || 'N/A'}`,
      'Max Cluster Size': Math.max(...clusters.map(c => c.riskIds.length), 0),
      'Avg Density': `${Math.round(clusters.reduce((s, c) => s + c.connectionDensity, 0) / clusters.length || 0)}%`
    },
    details: {
      clusters: clusters.slice(0, 5).map(c => ({
        clusterId: c.clusterId,
        riskCount: c.riskIds.length,
        categories: c.categories,
        aggregateEMV: c.aggregateEMV,
        cascadeExposure: c.cascadeExposure,
        systemicLevel: c.systemicRiskLevel,
        primaryCorrelation: c.primaryCorrelation
      })),
      centralityLeaders: highCentrality.map(r => ({
        riskId: r.riskId,
        description: r.riskDescription.substring(0, 60),
        connections: r.connectionCount,
        centralityScore: r.centralityScore
      }))
    },
    actionRequired: criticalClusters.length > 0,
    priority: criticalClusters.length > 2 ? 'Critical' : criticalClusters.length > 0 ? 'High' : 'Medium'
  };
}

function generateCapitalRecommendationsSection(): BoardPackSection {
  const allocation = optimizeCapitalAllocation(5000000); // £5M budget scenario
  const quickWins = identifyQuickWins(100000);

  return {
    sectionId: 'capital-recommendations',
    title: 'Capital Allocation Recommendations',
    executiveSummary: `Optimal allocation of £5M investment would reduce portfolio EMV by £${(allocation.expectedTotalEMVReduction / 1000000).toFixed(1)}M (${allocation.portfolioEMVReductionPercent}% reduction) with ROI of ${allocation.overallROI}x. ${quickWins.length} quick wins identified under £100K each.`,
    keyMetrics: {
      'Recommended Budget': '£5M',
      'Expected EMV Reduction': `£${(allocation.expectedTotalEMVReduction / 1000000).toFixed(1)}M`,
      'Reduction %': `${allocation.portfolioEMVReductionPercent}%`,
      'Overall ROI': `${allocation.overallROI}x`,
      'Risks Addressed': allocation.summary.risksAddressed,
      'Quick Wins Available': quickWins.length
    },
    details: {
      topRecommendations: allocation.recommendations.slice(0, 5).map(r => ({
        riskId: r.riskId,
        category: r.category,
        investment: r.recommendedInvestment,
        emvReduction: r.expectedEMVReduction,
        roi: r.roi,
        rationale: r.rationale
      })),
      quickWins: quickWins.slice(0, 5).map(q => ({
        riskId: q.riskId,
        category: q.category,
        investment: q.investment,
        roi: q.roi,
        timeframe: q.timeToImplement
      })),
      allocationSummary: {
        allocated: allocation.allocatedBudget,
        unallocated: allocation.unallocatedBudget,
        categoriesImpacted: allocation.summary.categoriesImpacted
      }
    },
    actionRequired: true,
    priority: 'High'
  };
}

function generateGovernanceFlagsSection(): BoardPackSection {
  const governance = evaluateGovernanceTriggers();
  const calendar = generateGovernanceCalendar();

  return {
    sectionId: 'governance-flags',
    title: 'Governance Triggers & Escalations',
    executiveSummary: `${governance.totalFlags} governance flags raised. ${governance.criticalActions.length} require critical action. ${governance.nextBoardItems.length} items flagged for Board attention. Portfolio health status: ${governance.summary.portfolioHealth}.`,
    keyMetrics: {
      'Total Flags': governance.totalFlags,
      'Critical Actions': governance.criticalActions.length,
      'Board Items': governance.nextBoardItems.length,
      'Committee Items': governance.nextCommitteeItems.length,
      'Portfolio Health': governance.summary.portfolioHealth,
      'Immediate Action': governance.summary.requiresImmediateAction ? 'Yes' : 'No'
    },
    details: {
      criticalFlags: governance.criticalActions.slice(0, 5).map(f => ({
        flagId: f.flagId,
        targetBody: f.targetBody,
        trigger: f.triggerRule,
        value: f.triggerValue,
        deadline: f.deadline,
        action: f.requiredAction
      })),
      governanceCalendar: calendar,
      flagDistribution: governance.flagsBySeverity
    },
    actionRequired: governance.summary.requiresImmediateAction,
    priority: governance.summary.portfolioHealth === 'Critical' ? 'Critical' : governance.criticalActions.length > 0 ? 'High' : 'Medium'
  };
}

function generateActionPlanSection(): BoardPackSection {
  const governance = evaluateGovernanceTriggers();
  const warnings = getImminentBreachWarnings();
  const quickWins = identifyQuickWins(100000);

  // Build 90-day action plan
  const immediateActions = governance.criticalActions.slice(0, 3).map(f => ({
    timeframe: '0-7 days',
    action: f.requiredAction,
    owner: f.targetBody,
    trigger: f.triggerRule
  }));

  const shortTermActions = warnings.filter(w => w.urgency === 'Near-term').slice(0, 3).map(w => ({
    timeframe: '8-30 days',
    action: `Implement intervention plan for Risk #${w.riskId}`,
    owner: 'Risk Owner',
    trigger: `Projected breach in ${w.projectedBreachDay} days`
  }));

  const mediumTermActions = quickWins.slice(0, 3).map(q => ({
    timeframe: '31-90 days',
    action: `Implement quick win for Risk #${q.riskId} (£${q.investment.toLocaleString()} investment)`,
    owner: 'Risk Owner',
    trigger: `ROI: ${q.roi}x`
  }));

  const allActions = [...immediateActions, ...shortTermActions, ...mediumTermActions];

  return {
    sectionId: 'action-plan-90-day',
    title: '90-Day Action Plan',
    executiveSummary: `${allActions.length} priority actions identified across three phases: ${immediateActions.length} immediate (0-7 days), ${shortTermActions.length} short-term (8-30 days), ${mediumTermActions.length} medium-term (31-90 days).`,
    keyMetrics: {
      'Total Actions': allActions.length,
      'Immediate (0-7d)': immediateActions.length,
      'Short-term (8-30d)': shortTermActions.length,
      'Medium-term (31-90d)': mediumTermActions.length,
      'Critical Actions': immediateActions.filter(a => a.timeframe === '0-7 days').length
    },
    details: {
      actionPlan: allActions,
      phaseBreakdown: {
        immediate: immediateActions,
        shortTerm: shortTermActions,
        mediumTerm: mediumTermActions
      }
    },
    actionRequired: allActions.length > 0,
    priority: immediateActions.length > 0 ? 'Critical' : 'High'
  };
}

function generateStressTestSection(): BoardPackSection {
  const comparison = compareScenarios();
  const worstCase = comparison.scenarios.find(s => s.name === comparison.worstCaseScenario);

  return {
    sectionId: 'stress-test-results',
    title: 'Stress Test Results',
    executiveSummary: `Five stress scenarios analysed. Worst case (${comparison.worstCaseScenario}) would increase portfolio EMV by £${((worstCase?.portfolioIncrease || 0) / 1000000).toFixed(1)}M (+${worstCase?.increasePercent || 0}%). Average stress increase: £${(comparison.averageIncrease / 1000000).toFixed(1)}M.`,
    keyMetrics: {
      'Scenarios Tested': comparison.scenarios.length,
      'Worst Case': comparison.worstCaseScenario,
      'Worst Case Increase': `+${worstCase?.increasePercent || 0}%`,
      'Best Case': comparison.bestCaseScenario,
      'Average Increase': `£${(comparison.averageIncrease / 1000000).toFixed(1)}M`,
      'Max New Breaches': Math.max(...comparison.scenarios.map(s => s.newBreaches))
    },
    details: {
      scenarios: comparison.scenarios.map(s => ({
        name: s.name,
        increase: s.portfolioIncrease,
        increasePercent: s.increasePercent,
        newBreaches: s.newBreaches,
        severity: s.severity
      }))
    },
    actionRequired: (worstCase?.increasePercent || 0) > 30,
    priority: (worstCase?.increasePercent || 0) > 50 ? 'High' : 'Medium'
  };
}

function generateConfidenceSection(): BoardPackSection {
  const overview = getPortfolioConfidenceOverview();

  return {
    sectionId: 'confidence-assessment',
    title: 'Data Confidence Assessment',
    executiveSummary: `Portfolio average confidence score is ${overview.averageConfidence}%. ${overview.confidenceDistribution.high} risks have high confidence, ${overview.confidenceDistribution.low + overview.confidenceDistribution.veryLow} have low/very low confidence. Key data gaps: ${overview.dataGaps.risksWithoutKRIs} risks without KRIs, ${overview.dataGaps.risksWithoutControls} without mapped controls.`,
    keyMetrics: {
      'Average Confidence': `${overview.averageConfidence}%`,
      'High Confidence': overview.confidenceDistribution.high,
      'Medium Confidence': overview.confidenceDistribution.medium,
      'Low Confidence': overview.confidenceDistribution.low,
      'Risks Without KRIs': overview.dataGaps.risksWithoutKRIs,
      'Risks Without Controls': overview.dataGaps.risksWithoutControls
    },
    details: {
      distribution: overview.confidenceDistribution,
      dataGaps: overview.dataGaps,
      lowConfidenceRisks: overview.lowConfidenceRisks.slice(0, 5).map(r => ({
        riskId: r.riskId,
        description: r.riskDescription.substring(0, 60),
        confidence: r.emvConfidence.overallScore,
        level: r.emvConfidence.level
      })),
      recommendations: overview.recommendations
    },
    actionRequired: overview.averageConfidence < 60,
    priority: overview.averageConfidence < 50 ? 'High' : overview.averageConfidence < 70 ? 'Medium' : 'Low'
  };
}

// ============================================================================
// MAIN BOARD PACK GENERATOR
// ============================================================================

export function generateBoardPack(): BoardPack {
  const portfolioSummary = generatePortfolioSummary();
  const topRisks = generateTopRisksSection();
  const appetiteBreaches = generateAppetiteBreachesSection();
  const forecastedExposures = generateForecastSection();
  const systemicClusters = generateSystemicClustersSection();
  const capitalRecommendations = generateCapitalRecommendationsSection();
  const governanceFlags = generateGovernanceFlagsSection();
  const actionPlan90Day = generateActionPlanSection();
  const stressTestResults = generateStressTestSection();
  const confidenceAssessment = generateConfidenceSection();

  // Generate executive briefing
  const criticalSections = [portfolioSummary, topRisks, appetiteBreaches, governanceFlags]
    .filter(s => s.priority === 'Critical');

  const executiveBriefing = `
EXECUTIVE BRIEFING

Portfolio Status: ${portfolioSummary.keyMetrics['Total Residual EMV']} total exposure across ${portfolioSummary.keyMetrics['Total Risks']} risks.

Key Concerns:
${criticalSections.length > 0
      ? criticalSections.map(s => `• ${s.title}: ${s.executiveSummary.substring(0, 100)}...`).join('\n')
      : '• No critical issues requiring immediate Board attention.'
    }

Forecast: ${forecastedExposures.executiveSummary.substring(0, 150)}

Recommendation: ${capitalRecommendations.executiveSummary.substring(0, 150)}

Confidence: ${confidenceAssessment.keyMetrics['Average Confidence']} average portfolio confidence.
`.trim();

  // Identify key decisions
  const keyDecisionsRequired: string[] = [];
  if (appetiteBreaches.priority === 'Critical') {
    keyDecisionsRequired.push('Review and approve appetite breach remediation plan');
  }
  if (capitalRecommendations.actionRequired) {
    keyDecisionsRequired.push('Approve capital allocation for risk treatment');
  }
  if (governanceFlags.priority === 'Critical') {
    keyDecisionsRequired.push('Address critical governance flags');
  }
  if (forecastedExposures.details && (forecastedExposures.details as { imminentWarnings: unknown[] }).imminentWarnings?.length > 0) {
    keyDecisionsRequired.push('Approve intervention plans for imminent breach risks');
  }

  return {
    generatedAt: new Date().toISOString(),
    reportingPeriod: `${new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`,
    portfolioSummary,
    topRisks,
    appetiteBreaches,
    forecastedExposures,
    systemicClusters,
    capitalRecommendations,
    governanceFlags,
    actionPlan90Day,
    stressTestResults,
    confidenceAssessment,
    executiveBriefing,
    keyDecisionsRequired,
    appendices: {
      fullRiskList: true,
      detailedMethodology: true,
      glossary: true
    }
  };
}

// ============================================================================
// SECTION EXPORT FOR PARTIAL GENERATION
// ============================================================================

export {
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
};
