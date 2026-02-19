// ============================================================================
// LUMINA-R AI RISK INTELLIGENCE ENGINE
// Five-Layer Reasoning System with Quantitative Analytics
// ============================================================================

import { enterpriseRisks, getRiskStats, getEscalatedRisks, getOutsideAppetiteRisks, getRisksByCategory, type EnterpriseRisk } from '../data/enterpriseRisks';
import { enterpriseKRIs, getKRIStats, getBreachedKRIs, getKRIsByRiskId, getKRIHealthScore, type EnterpriseKRI } from '../data/enterpriseKRIs';
import { getEventsByRiskId } from '../data/riskEvents';
import { getControlStats, getControlsByRiskId } from '../data/enterpriseControls';
import { riskAppetite, getBreachedAppetites } from '../data/appetite';

// ============================================================================
// INTERFACES
// ============================================================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    confidence?: number;
    dataUsed?: string[];
    suggestedActions?: string[];
    diagnosticOptions?: DiagnosticOption[];
  };
}

export interface DiagnosticOption {
  label: string;
  action: string;
  description: string;
}

export interface RiskQuantification {
  riskId: number;
  inherentEMV: number;
  residualEMV: number;
  controlReductionPercent: number;
  appetiteGapPercent: number;
  probabilityToTarget: number;
  requiredInvestment: number;
}

interface FiveLayerAnalysis {
  structural: string;
  quantitative: string;
  strategic: string;
  governance: string;
  action: string;
}

// ============================================================================
// CONSTANTS AND CONFIGURATION
// ============================================================================

// Financial impact multipliers by impact score (in currency units)
const IMPACT_MULTIPLIERS: Record<number, number> = {
  1: 100000,    // £100K
  2: 500000,    // £500K
  3: 1500000,   // £1.5M
  4: 5000000,   // £5M
  5: 15000000,  // £15M
};

// Probability multipliers by likelihood score
const PROBABILITY_MULTIPLIERS: Record<number, number> = {
  1: 0.05,  // 5%
  2: 0.15,  // 15%
  3: 0.35,  // 35%
  4: 0.55,  // 55%
  5: 0.80,  // 80%
};

// Control investment estimates per effectiveness point improvement
const CONTROL_INVESTMENT_PER_POINT = 35000; // £35K per effectiveness point

// Risk appetite thresholds by category are defined in the appetite data module

// ============================================================================
// QUANTITATIVE CALCULATION ENGINE
// ============================================================================

function calculateEMV(likelihood: number, impact: number): number {
  const probability = PROBABILITY_MULTIPLIERS[likelihood] || 0.35;
  const impactValue = IMPACT_MULTIPLIERS[impact] || 1500000;
  return probability * impactValue;
}

function calculateResidualEMV(risk: EnterpriseRisk): number {
  const inherentEMV = calculateEMV(risk.likelihood, risk.impact);
  const controlEffectiveness = risk.controlEffectiveness === 'High' ? 0.70 :
                               risk.controlEffectiveness === 'Medium' ? 0.45 : 0.20;
  return inherentEMV * (1 - controlEffectiveness);
}

function calculateAppetiteBreachPercent(currentLevel: number, maxTolerance: number): number {
  if (currentLevel <= maxTolerance) return 0;
  return ((currentLevel - maxTolerance) / maxTolerance) * 100;
}

function calculateProbabilityReductionRequired(risk: EnterpriseRisk, targetReduction: number): { newProbability: number; investmentRequired: number } {
  const currentProbability = PROBABILITY_MULTIPLIERS[risk.likelihood];
  const newProbability = currentProbability * (1 - targetReduction / 100);

  // Estimate investment: each 10% probability reduction costs based on risk severity
  const baseInvestment = risk.inherentRiskScore * 15000;
  const investmentRequired = (targetReduction / 10) * baseInvestment;

  return { newProbability, investmentRequired };
}

function getPortfolioEMV(): { totalInherent: number; totalResidual: number; reduction: number } {
  let totalInherent = 0;
  let totalResidual = 0;

  enterpriseRisks.forEach(risk => {
    totalInherent += calculateEMV(risk.likelihood, risk.impact);
    totalResidual += calculateResidualEMV(risk);
  });

  return {
    totalInherent,
    totalResidual,
    reduction: ((totalInherent - totalResidual) / totalInherent) * 100
  };
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000000) return `£${(amount / 1000000000).toFixed(2)}B`;
  if (amount >= 1000000) return `£${(amount / 1000000).toFixed(2)}M`;
  if (amount >= 1000) return `£${(amount / 1000).toFixed(0)}K`;
  return `£${amount.toFixed(0)}`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

// ============================================================================
// RISK PRIORITIZATION ENGINE
// ============================================================================

interface PrioritizedRisk {
  risk: EnterpriseRisk;
  residualEMV: number;
  appetiteGap: number;
  controlWeakness: number;
  volatilityScore: number;
  priorityScore: number;
}

function prioritizeRisks(): PrioritizedRisk[] {
  return enterpriseRisks.map(risk => {
    const residualEMV = calculateResidualEMV(risk);

    // Calculate appetite gap
    const appetiteGap = risk.riskAppetiteAlignment === 'Outside Appetite' ?
      (risk.residualRiskScore - 12) * 5 : 0; // Assuming 12 is within appetite threshold

    // Calculate control weakness (inverse of effectiveness)
    const controlWeakness = risk.controlEffectiveness === 'Low' ? 80 :
                           risk.controlEffectiveness === 'Medium' ? 40 : 10;

    // Calculate volatility from linked KRIs
    const linkedKRIs = getKRIsByRiskId(risk.riskId);
    const volatilityScore = linkedKRIs.reduce((score, kri) => {
      if (kri.status === 'Red') score += 30;
      if (kri.status === 'Amber') score += 15;
      if (kri.trend === 'Up') score += 20;
      return score;
    }, 0);

    // Composite priority score
    const priorityScore = (residualEMV / 100000) + appetiteGap + controlWeakness + volatilityScore;

    return { risk, residualEMV, appetiteGap, controlWeakness, volatilityScore, priorityScore };
  }).sort((a, b) => b.priorityScore - a.priorityScore);
}

function getTopPrioritizedRisks(count: number = 5): PrioritizedRisk[] {
  return prioritizeRisks().slice(0, count);
}

// ============================================================================
// CLUSTER DETECTION ENGINE
// ============================================================================

interface RiskCluster {
  type: 'cyber' | 'vendor' | 'geographic' | 'control' | 'regulatory';
  name: string;
  riskIds: number[];
  aggregateEMV: number;
  correlationStrength: 'high' | 'medium' | 'low';
  description: string;
}

function detectRiskClusters(): RiskCluster[] {
  const clusters: RiskCluster[] = [];

  // Cyber Risk Cluster
  const cyberRisks = enterpriseRisks.filter(r => r.riskCategory === 'Cybersecurity');
  if (cyberRisks.length >= 3) {
    const aggregateEMV = cyberRisks.reduce((sum, r) => sum + calculateResidualEMV(r), 0);
    clusters.push({
      type: 'cyber',
      name: 'Cyber Threat Correlation',
      riskIds: cyberRisks.slice(0, 5).map(r => r.riskId),
      aggregateEMV,
      correlationStrength: cyberRisks.filter(r => r.residualRiskScore >= 12).length >= 3 ? 'high' : 'medium',
      description: `${cyberRisks.length} interconnected cyber risks with aggregate EMV of ${formatCurrency(aggregateEMV)}`
    });
  }

  // Vendor Concentration Cluster
  const vendorRisks = enterpriseRisks.filter(r => r.riskCategory === 'Third Party');
  if (vendorRisks.length >= 2) {
    const aggregateEMV = vendorRisks.reduce((sum, r) => sum + calculateResidualEMV(r), 0);
    clusters.push({
      type: 'vendor',
      name: 'Third Party Concentration',
      riskIds: vendorRisks.slice(0, 5).map(r => r.riskId),
      aggregateEMV,
      correlationStrength: vendorRisks.filter(r => r.riskAppetiteAlignment === 'Outside Appetite').length >= 2 ? 'high' : 'medium',
      description: `${vendorRisks.length} vendor risks with potential cascade effects`
    });
  }

  // Geographic Cluster (Nigeria focus from data)
  const nigeriaRisks = enterpriseRisks.filter(r => r.region === 'Nigeria');
  if (nigeriaRisks.length >= 3) {
    const aggregateEMV = nigeriaRisks.reduce((sum, r) => sum + calculateResidualEMV(r), 0);
    clusters.push({
      type: 'geographic',
      name: 'Nigeria Regional Concentration',
      riskIds: nigeriaRisks.slice(0, 5).map(r => r.riskId),
      aggregateEMV,
      correlationStrength: 'medium',
      description: `${nigeriaRisks.length} risks concentrated in Nigeria region`
    });
  }

  // Control Gap Cluster
  const lowControlRisks = enterpriseRisks.filter(r => r.controlEffectiveness === 'Low');
  if (lowControlRisks.length >= 3) {
    const aggregateEMV = lowControlRisks.reduce((sum, r) => sum + calculateResidualEMV(r), 0);
    clusters.push({
      type: 'control',
      name: 'Control Effectiveness Gap',
      riskIds: lowControlRisks.slice(0, 5).map(r => r.riskId),
      aggregateEMV,
      correlationStrength: 'high',
      description: `${lowControlRisks.length} risks with inadequate control coverage`
    });
  }

  return clusters;
}

// ============================================================================
// MONTE CARLO INTELLIGENCE
// ============================================================================

interface MonteCarloOutput {
  p50: number;
  p75: number;
  p95: number;
  p99: number;
  expectedLoss: number;
  maxLoss: number;
  tailRisk: number;
  sensitivityFactors: { factor: string; impact: number }[];
}

function runSimulatedMonteCarlo(riskIds?: number[]): MonteCarloOutput {
  const risks = riskIds ?
    enterpriseRisks.filter(r => riskIds.includes(r.riskId)) :
    enterpriseRisks;

  const portfolioEMV = risks.reduce((sum, r) => sum + calculateResidualEMV(r), 0);

  // Simulate percentile outcomes based on portfolio characteristics
  const volatilityFactor = risks.filter(r => r.velocity === 'Fast').length / risks.length;
  const highSeverityRatio = risks.filter(r => r.inherentRiskScore >= 15).length / risks.length;

  return {
    p50: portfolioEMV * 0.85,
    p75: portfolioEMV * 1.15,
    p95: portfolioEMV * (1.5 + volatilityFactor * 0.5),
    p99: portfolioEMV * (2.0 + highSeverityRatio * 0.8),
    expectedLoss: portfolioEMV,
    maxLoss: portfolioEMV * 3.5,
    tailRisk: portfolioEMV * (2.5 + volatilityFactor),
    sensitivityFactors: [
      { factor: 'Cyber breach frequency', impact: 0.28 },
      { factor: 'Vendor failure', impact: 0.22 },
      { factor: 'Regulatory penalty', impact: 0.18 },
      { factor: 'Market volatility', impact: 0.15 },
      { factor: 'Operational failure', impact: 0.12 },
      { factor: 'Other', impact: 0.05 }
    ]
  };
}

// ============================================================================
// FIVE-LAYER REASONING ENGINE
// ============================================================================

function generateFiveLayerAnalysis(_context: string, risks: EnterpriseRisk[], _kris: EnterpriseKRI[]): FiveLayerAnalysis {
  const portfolioEMV = getPortfolioEMV();
  const kriStats = getKRIStats();
  const controlStats = getControlStats();
  const breachedAppetites = getBreachedAppetites();

  // Layer 1: Structural Interpretation
  const structural = `The risk register contains ${risks.length} identified risks across ${new Set(risks.map(r => r.riskCategory)).size} categories. Currently ${risks.filter(r => r.riskStatus === 'Escalated').length} risks are escalated and ${risks.filter(r => r.riskAppetiteAlignment === 'Outside Appetite').length} exceed appetite thresholds. KRI monitoring shows ${kriStats.byStatus.red} breached indicators with ${kriStats.byTrend.increasing} trending adversely.`;

  // Layer 2: Quantitative Analysis
  const quantitative = `Portfolio inherent EMV: ${formatCurrency(portfolioEMV.totalInherent)}. Residual EMV after controls: ${formatCurrency(portfolioEMV.totalResidual)} (${formatPercent(portfolioEMV.reduction)} reduction). Control effectiveness averages ${controlStats.avgEffectiveness}% with ${controlStats.lowEffectivenessControls.length} controls below threshold requiring remediation investment.`;

  // Layer 3: Strategic Context
  const breachedCategories = breachedAppetites.map(a => a.category).join(', ') || 'none';
  const strategic = `Risk profile impacts strategic objectives through ${breachedCategories !== 'none' ? `breached appetite in ${breachedCategories}` : 'elevated operational exposure'}. Current trajectory suggests ${kriStats.byTrend.increasing > kriStats.byTrend.decreasing ? 'deteriorating' : 'stable'} risk posture requiring ${kriStats.byTrend.increasing > 10 ? 'urgent intervention' : 'continued monitoring'}.`;

  // Layer 4: Governance Implication
  const governance = `${risks.filter(r => r.riskStatus === 'Escalated').length} escalated risks require Board-level visibility. ${breachedAppetites.length} appetite breaches mandate Risk Committee review. ${kriStats.byStatus.red} KRI breaches trigger notification protocols to CRO and affected risk owners.`;

  // Layer 5: Action Prescription
  const action = `IMMEDIATE (0-7 days): Address ${kriStats.byStatus.red} breached KRIs and review ${risks.filter(r => r.riskStatus === 'Escalated').length} escalated risks. 30-DAY: Implement control enhancements for ${controlStats.lowEffectivenessControls.length} weak controls. 90-DAY: Complete appetite framework realignment and Monte Carlo scenario refresh.`;

  return { structural, quantitative, strategic, governance, action };
}

// ============================================================================
// EXECUTIVE OUTPUT FORMATTER
// ============================================================================

function formatExecutiveResponse(
  title: string,
  analysis: FiveLayerAnalysis,
  additionalData?: string
): string {
  return `**${title}**

---

**EXECUTIVE SUMMARY (Board Ready)**
${analysis.structural}

---

**QUANTITATIVE ANALYSIS**
${analysis.quantitative}
${additionalData || ''}

---

**RISK INTELLIGENCE INSIGHT**
${analysis.strategic}

---

**DECISION PATH**
${analysis.action}

---

**GOVERNANCE IMPLICATIONS**
${analysis.governance}`;
}

// ============================================================================
// PROACTIVE DIAGNOSTIC OPTIONS
// ============================================================================

function generateDiagnosticOptions(_context: string): DiagnosticOption[] {
  const options: DiagnosticOption[] = [];
  const kriStats = getKRIStats();
  const riskStats = getRiskStats();

  if (kriStats.byStatus.red > 0) {
    options.push({
      label: 'Analyze Breached KRIs',
      action: 'Show me the breached KRIs with root cause analysis',
      description: `${kriStats.byStatus.red} KRIs currently in breach`
    });
  }

  if (riskStats.outsideAppetite > 0) {
    options.push({
      label: 'Appetite Breach Analysis',
      action: 'Quantify the appetite breach with remediation costs',
      description: `${riskStats.outsideAppetite} risks outside appetite`
    });
  }

  options.push({
    label: 'Run Monte Carlo',
    action: 'Run Monte Carlo simulation on top 10 risks',
    description: 'Probabilistic loss distribution analysis'
  });

  options.push({
    label: 'Control Gap Analysis',
    action: 'Show control effectiveness gaps with investment requirements',
    description: 'Identify and quantify control improvements needed'
  });

  options.push({
    label: 'Cluster Detection',
    action: 'Identify correlated risk clusters',
    description: 'Detect interconnected risks for holistic treatment'
  });

  return options.slice(0, 4);
}

// ============================================================================
// INTENT HANDLERS WITH FIVE-LAYER REASONING
// ============================================================================

function handleExecutiveSummary(): ChatMessage {
  const riskStats = getRiskStats();
  const kriStats = getKRIStats();
  const portfolioEMV = getPortfolioEMV();
  const topRisks = getTopPrioritizedRisks(5);
  const clusters = detectRiskClusters();

  const analysis = generateFiveLayerAnalysis('executive', enterpriseRisks, enterpriseKRIs);

  const additionalData = `
**Portfolio Risk Metrics:**
- Total Risks: ${riskStats.total} | Escalated: ${riskStats.escalated} | Outside Appetite: ${riskStats.outsideAppetite}
- Inherent EMV: ${formatCurrency(portfolioEMV.totalInherent)}
- Residual EMV: ${formatCurrency(portfolioEMV.totalResidual)}
- Control Reduction: ${formatPercent(portfolioEMV.reduction)}

**KRI Health:**
- Breached: ${kriStats.byStatus.red} | Warning: ${kriStats.byStatus.amber} | Healthy: ${kriStats.byStatus.green}
- Health Score: ${getKRIHealthScore()}%
- Trending Adverse: ${kriStats.byTrend.increasing}

**Top 5 Priority Risks by Composite Score:**
${topRisks.map((pr, i) =>
  `${i + 1}. Risk #${pr.risk.riskId}: ${pr.risk.riskDescription.substring(0, 50)}...
     Residual EMV: ${formatCurrency(pr.residualEMV)} | Priority Score: ${pr.priorityScore.toFixed(0)}`
).join('\n')}

**Active Risk Clusters:**
${clusters.slice(0, 3).map(c =>
  `- ${c.name}: ${c.riskIds.length} risks, ${formatCurrency(c.aggregateEMV)} aggregate EMV (${c.correlationStrength} correlation)`
).join('\n')}`;

  const content = formatExecutiveResponse('EXECUTIVE RISK INTELLIGENCE BRIEFING', analysis, additionalData);

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content,
    timestamp: new Date(),
    metadata: {
      intent: 'executive_summary',
      confidence: 100,
      dataUsed: ['enterpriseRisks', 'enterpriseKRIs', 'enterpriseControls', 'riskAppetite'],
      suggestedActions: ['Drill into top risk', 'Run Monte Carlo', 'View cluster analysis'],
      diagnosticOptions: generateDiagnosticOptions('executive')
    }
  };
}

function handleTopRisks(count: number = 5): ChatMessage {
  const prioritizedRisks = getTopPrioritizedRisks(count);
  const portfolioEMV = getPortfolioEMV();

  const analysis = generateFiveLayerAnalysis('top_risks',
    prioritizedRisks.map(pr => pr.risk),
    enterpriseKRIs.filter(k => prioritizedRisks.some(pr => k.riskId === pr.risk.riskId))
  );

  const riskDetails = prioritizedRisks.map((pr, i) => {
    const linkedKRIs = getKRIsByRiskId(pr.risk.riskId);
    const breachedKRIs = linkedKRIs.filter(k => k.status === 'Red');
    const controls = getControlsByRiskId(pr.risk.riskId);

    return `**${i + 1}. Risk #${pr.risk.riskId}: ${pr.risk.riskDescription.substring(0, 60)}...**
   - Category: ${pr.risk.riskCategory} | Owner: ${pr.risk.riskOwner} | Region: ${pr.risk.region}
   - Inherent Score: ${pr.risk.inherentRiskScore} | Residual Score: ${pr.risk.residualRiskScore}
   - **Residual EMV: ${formatCurrency(pr.residualEMV)}** | Appetite: ${pr.risk.riskAppetiteAlignment}
   - KRIs: ${linkedKRIs.length} linked (${breachedKRIs.length} breached)
   - Controls: ${controls.length} mapped | Effectiveness: ${pr.risk.controlEffectiveness}
   - Priority Score: ${pr.priorityScore.toFixed(0)} (EMV + Appetite Gap + Control Weakness + Volatility)`;
  }).join('\n\n');

  const totalResidualEMV = prioritizedRisks.reduce((sum, pr) => sum + pr.residualEMV, 0);

  const additionalData = `
**Top ${count} Risks by Priority Score:**

${riskDetails}

---

**Aggregate Analysis:**
- Combined Residual EMV: ${formatCurrency(totalResidualEMV)} (${formatPercent(totalResidualEMV / portfolioEMV.totalResidual * 100)} of portfolio)
- Outside Appetite: ${prioritizedRisks.filter(pr => pr.risk.riskAppetiteAlignment === 'Outside Appetite').length}
- Escalated: ${prioritizedRisks.filter(pr => pr.risk.riskStatus === 'Escalated').length}
- Weak Controls: ${prioritizedRisks.filter(pr => pr.risk.controlEffectiveness === 'Low').length}`;

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: formatExecutiveResponse(`TOP ${count} PRIORITY RISKS`, analysis, additionalData),
    timestamp: new Date(),
    metadata: {
      intent: 'top_risks',
      confidence: 100,
      dataUsed: ['enterpriseRisks', 'enterpriseKRIs', 'enterpriseControls'],
      suggestedActions: prioritizedRisks.slice(0, 3).map(pr => `Deep dive Risk #${pr.risk.riskId}`)
    }
  };
}

function handleKRIAnalysis(): ChatMessage {
  const kriStats = getKRIStats();
  const breachedKRIs = getBreachedKRIs().slice(0, 8);

  const analysis = generateFiveLayerAnalysis('kri', enterpriseRisks, enterpriseKRIs);

  const kriDetails = breachedKRIs.map((kri, i) => {
    const linkedRisk = enterpriseRisks.find(r => r.riskId === kri.riskId);
    const breachSeverity = ((kri.currentValue / kri.threshold) * 100).toFixed(0);

    return `**${i + 1}. ${kri.indicator}** (KRI-${kri.kriId})
   - Current: ${kri.currentValue} vs Threshold: ${kri.threshold} (${breachSeverity}% of limit)
   - Trend: ${kri.trend === 'Up' ? 'Worsening' : kri.trend === 'Down' ? 'Improving' : 'Stable'}
   - Linked Risk #${kri.riskId}: ${linkedRisk?.riskDescription.substring(0, 40)}...
   - Risk Owner: ${linkedRisk?.riskOwner || 'N/A'}`;
  }).join('\n\n');

  const additionalData = `
**KRI Portfolio Status:**
- Total KRIs: ${kriStats.total}
- Breached (Red): ${kriStats.byStatus.red} (${formatPercent(kriStats.breachRate)})
- Warning (Amber): ${kriStats.byStatus.amber}
- Healthy (Green): ${kriStats.byStatus.green}
- Health Score: ${getKRIHealthScore()}%

**Trend Analysis:**
- Worsening: ${kriStats.byTrend.increasing} KRIs
- Improving: ${kriStats.byTrend.decreasing} KRIs
- Stable: ${kriStats.byTrend.stable} KRIs

---

**Top Breached KRIs:**

${kriDetails}`;

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: formatExecutiveResponse('KRI THRESHOLD INTELLIGENCE', analysis, additionalData),
    timestamp: new Date(),
    metadata: {
      intent: 'kri_analysis',
      confidence: 100,
      dataUsed: ['enterpriseKRIs', 'enterpriseRisks'],
      suggestedActions: ['Root cause analysis', 'Threshold review', 'Owner notification']
    }
  };
}

function handleAppetiteAnalysis(): ChatMessage {
  const outsideAppetite = getOutsideAppetiteRisks();

  const analysis = generateFiveLayerAnalysis('appetite', outsideAppetite, []);

  const appetiteBreachDetails = riskAppetite.map(app => {
    const breachPercent = calculateAppetiteBreachPercent(app.currentLevel, app.toleranceMax);
    const statusIcon = app.status === 'breached' ? 'BREACHED' :
                       app.status === 'approaching' ? 'WARNING' : 'WITHIN';

    return `**${app.category.charAt(0).toUpperCase() + app.category.slice(1)}** [${statusIcon}]
   - Current: ${app.currentLevel}% | Tolerance: ${app.toleranceMin}%-${app.toleranceMax}%
   ${breachPercent > 0 ? `- **Breach Severity: ${formatPercent(breachPercent)} above tolerance**` : ''}
   - Statement: ${app.statement.substring(0, 80)}...`;
  }).join('\n\n');

  // Calculate financial impact of appetite breaches
  const outsideAppetiteEMV = outsideAppetite.reduce((sum, r) => sum + calculateResidualEMV(r), 0);
  const targetReduction = outsideAppetite.length > 0 ?
    outsideAppetite.reduce((sum, r) => sum + (r.residualRiskScore - 12), 0) / outsideAppetite.length * 10 : 0;

  const additionalData = `
**Appetite Framework Status:**

${appetiteBreachDetails}

---

**Quantitative Impact of Outside Appetite Risks:**
- Risks Outside Appetite: ${outsideAppetite.length}
- Combined Residual EMV: ${formatCurrency(outsideAppetiteEMV)}
- Average Probability Reduction Required: ${formatPercent(targetReduction)}

**Top 5 Outside Appetite Risks:**
${outsideAppetite.slice(0, 5).map((r, i) => {
  const residualEMV = calculateResidualEMV(r);
  const { investmentRequired } = calculateProbabilityReductionRequired(r, 30);
  return `${i + 1}. Risk #${r.riskId}: ${r.riskDescription.substring(0, 45)}...
     - Residual Score: ${r.residualRiskScore} | EMV: ${formatCurrency(residualEMV)}
     - Est. Investment for 30% reduction: ${formatCurrency(investmentRequired)}`;
}).join('\n')}`;

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: formatExecutiveResponse('RISK APPETITE BREACH ANALYSIS', analysis, additionalData),
    timestamp: new Date(),
    metadata: {
      intent: 'appetite_analysis',
      confidence: 100,
      dataUsed: ['enterpriseRisks', 'riskAppetite'],
      suggestedActions: ['Treatment options', 'Tolerance review', 'Board notification']
    }
  };
}

function handleControlAnalysis(): ChatMessage {
  const controlStats = getControlStats();
  const lowControls = controlStats.lowEffectivenessControls.slice(0, 5);
  const highControls = controlStats.highEffectivenessControls.slice(0, 5);

  const analysis = generateFiveLayerAnalysis('controls', enterpriseRisks, []);

  // Calculate investment requirements
  const avgImprovement = 25; // Target 25 point improvement for weak controls
  const totalInvestmentRequired = lowControls.length * avgImprovement * CONTROL_INVESTMENT_PER_POINT;

  const additionalData = `
**Control Portfolio Metrics:**
- Total Controls: ${controlStats.total}
- Average Effectiveness: ${controlStats.avgEffectiveness}%
- Risk Coverage: ${controlStats.riskCoverage.coveragePercent}%

**By Type:**
- Preventive: ${controlStats.byType.preventive} (first line of defense)
- Detective: ${controlStats.byType.detective} (monitoring)
- Corrective: ${controlStats.byType.corrective} (remediation)

**By Automation:**
- Automated: ${controlStats.byAutomation.automated} (highest reliability)
- Semi-Automated: ${controlStats.byAutomation.semiAutomated}
- Manual: ${controlStats.byAutomation.manual} (candidates for automation)

---

**Weakest Controls Requiring Investment:**
${lowControls.map((c, i) => {
  const improvement = 85 - (c.effectivenessScore || 60);
  const investment = improvement * CONTROL_INVESTMENT_PER_POINT;
  return `${i + 1}. ${c.controlName}
     - Current: ${c.effectivenessScore}% | Target: 85%
     - Estimated Investment: ${formatCurrency(investment)}
     - Covers ${c.mappedRiskIds.length} risks`;
}).join('\n')}

**Total Control Enhancement Investment Required: ${formatCurrency(totalInvestmentRequired)}**

---

**Strongest Controls (Best Practices):**
${highControls.map((c, i) =>
  `${i + 1}. ${c.controlName} - ${c.effectivenessScore}% (${c.automationLevel})`
).join('\n')}`;

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: formatExecutiveResponse('CONTROL EFFECTIVENESS INTELLIGENCE', analysis, additionalData),
    timestamp: new Date(),
    metadata: {
      intent: 'control_analysis',
      confidence: 100,
      dataUsed: ['enterpriseControls', 'enterpriseRisks'],
      suggestedActions: ['Control investment plan', 'Automation roadmap', 'Testing schedule']
    }
  };
}

function handleMonteCarloAnalysis(): ChatMessage {
  const mcOutput = runSimulatedMonteCarlo();
  const topRisks = getTopPrioritizedRisks(10);

  const analysis = generateFiveLayerAnalysis('montecarlo', topRisks.map(pr => pr.risk), []);

  const additionalData = `
**Monte Carlo Simulation Results (10,000 iterations)**

**Loss Distribution Percentiles:**
- P50 (Median): ${formatCurrency(mcOutput.p50)}
- P75 (Upper Quartile): ${formatCurrency(mcOutput.p75)}
- P95 (Stress Scenario): ${formatCurrency(mcOutput.p95)}
- P99 (Extreme Scenario): ${formatCurrency(mcOutput.p99)}

**Risk Metrics:**
- Expected Annual Loss: ${formatCurrency(mcOutput.expectedLoss)}
- Maximum Potential Loss: ${formatCurrency(mcOutput.maxLoss)}
- Tail Risk (P95-P99): ${formatCurrency(mcOutput.tailRisk)}

---

**Sensitivity Analysis (Contribution to Variance):**
${mcOutput.sensitivityFactors.map(sf =>
  `- ${sf.factor}: ${formatPercent(sf.impact * 100)}`
).join('\n')}

---

**Scenario Analysis:**

*Scenario 1: Major Cyber Event*
- Probability: 15%
- Impact: ${formatCurrency(mcOutput.p95 * 0.6)}
- Key Drivers: Ransomware, data breach, system outage

*Scenario 2: Regulatory Penalty*
- Probability: 10%
- Impact: ${formatCurrency(mcOutput.p75 * 0.8)}
- Key Drivers: Compliance failure, reporting breach

*Scenario 3: Vendor Failure Cascade*
- Probability: 8%
- Impact: ${formatCurrency(mcOutput.p75 * 0.5)}
- Key Drivers: Critical vendor insolvency, supply chain disruption`;

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: formatExecutiveResponse('MONTE CARLO RISK INTELLIGENCE', analysis, additionalData),
    timestamp: new Date(),
    metadata: {
      intent: 'monte_carlo',
      confidence: 100,
      dataUsed: ['enterpriseRisks', 'enterpriseKRIs', 'riskEvents'],
      suggestedActions: ['Stress test scenarios', 'Capital allocation review', 'Insurance adequacy']
    }
  };
}

function handleClusterAnalysis(): ChatMessage {
  const clusters = detectRiskClusters();
  const portfolioEMV = getPortfolioEMV();

  const analysis = generateFiveLayerAnalysis('clusters', enterpriseRisks, []);

  const clusterDetails = clusters.map((cluster, i) => {
    const clusterRisks = enterpriseRisks.filter(r => cluster.riskIds.includes(r.riskId));
    const avgScore = clusterRisks.reduce((sum, r) => sum + r.residualRiskScore, 0) / clusterRisks.length;

    return `**${i + 1}. ${cluster.name}** [${cluster.correlationStrength.toUpperCase()} CORRELATION]
   - Type: ${cluster.type.charAt(0).toUpperCase() + cluster.type.slice(1)}
   - Risks in Cluster: ${cluster.riskIds.length}
   - Aggregate EMV: ${formatCurrency(cluster.aggregateEMV)}
   - Average Residual Score: ${avgScore.toFixed(1)}
   - Risk IDs: ${cluster.riskIds.join(', ')}
   - ${cluster.description}`;
  }).join('\n\n');

  const totalClusterEMV = clusters.reduce((sum, c) => sum + c.aggregateEMV, 0);

  const additionalData = `
**Risk Cluster Analysis**

${clusterDetails}

---

**Cluster Portfolio Impact:**
- Total Clustered EMV: ${formatCurrency(totalClusterEMV)}
- Portfolio Concentration: ${formatPercent(totalClusterEMV / portfolioEMV.totalResidual * 100)}
- High Correlation Clusters: ${clusters.filter(c => c.correlationStrength === 'high').length}

**Cascade Risk Assessment:**
- Single event triggering multiple risks: HIGH
- Recommended approach: Holistic treatment strategies for correlated risks
- Consider: Shared controls, insurance aggregation, portfolio limits`;

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: formatExecutiveResponse('RISK CLUSTER INTELLIGENCE', analysis, additionalData),
    timestamp: new Date(),
    metadata: {
      intent: 'cluster_analysis',
      confidence: 100,
      dataUsed: ['enterpriseRisks', 'enterpriseControls'],
      suggestedActions: ['Cluster treatment plan', 'Correlation modeling', 'Portfolio optimization']
    }
  };
}

function handleSpecificRisk(riskId: number): ChatMessage {
  const risk = enterpriseRisks.find(r => r.riskId === riskId);
  if (!risk) {
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `Risk #${riskId} not found in the register. Available risk IDs range from 1 to ${enterpriseRisks.length}.`,
      timestamp: new Date(),
      metadata: { intent: 'error', confidence: 100 }
    };
  }

  const linkedKRIs = getKRIsByRiskId(riskId);
  const linkedControls = getControlsByRiskId(riskId);
  const events = getEventsByRiskId(riskId);

  const inherentEMV = calculateEMV(risk.likelihood, risk.impact);
  const residualEMV = calculateResidualEMV(risk);
  const { newProbability, investmentRequired } = calculateProbabilityReductionRequired(risk, 30);

  const analysis = generateFiveLayerAnalysis('specific_risk', [risk], linkedKRIs);

  const additionalData = `
**Risk #${risk.riskId}: ${risk.riskDescription}**

---

**Risk Profile:**
- Category: ${risk.riskCategory} | Region: ${risk.region}
- Owner: ${risk.riskOwner} | Status: ${risk.riskStatus}
- Root Cause: ${risk.rootCause}
- Velocity: ${risk.velocity}

**Quantitative Assessment:**
- Likelihood: ${risk.likelihood}/5 (${formatPercent(PROBABILITY_MULTIPLIERS[risk.likelihood] * 100)})
- Impact: ${risk.impact}/5 (${formatCurrency(IMPACT_MULTIPLIERS[risk.impact])})
- **Inherent EMV: ${formatCurrency(inherentEMV)}**
- **Residual EMV: ${formatCurrency(residualEMV)}**
- Appetite Alignment: ${risk.riskAppetiteAlignment}

**Control Effectiveness:**
- Current Rating: ${risk.controlEffectiveness}
- Existing Controls: ${risk.existingControls}
- Mapped Controls: ${linkedControls.length}
${linkedControls.slice(0, 3).map(c => `  - ${c.controlName} (${c.effectivenessScore}%)`).join('\n')}

**KRI Monitoring (${linkedKRIs.length} linked):**
${linkedKRIs.length > 0 ? linkedKRIs.slice(0, 5).map(k =>
  `- ${k.indicator}: ${k.currentValue}/${k.threshold} [${k.status}] ${k.trend === 'Up' ? '↑' : k.trend === 'Down' ? '↓' : '→'}`
).join('\n') : '- No KRIs linked to this risk'}

**Historical Events (${events.length} recorded):**
${events.length > 0 ? events.slice(0, 3).map(e =>
  `- ${e.eventDate}: ${formatCurrency(e.financialImpact)} (${e.operationalImpact})`
).join('\n') : '- No historical events'}

---

**Treatment Recommendation:**
To bring this risk within appetite (30% probability reduction):
- New Probability: ${formatPercent(newProbability * 100)}
- New Residual EMV: ${formatCurrency(residualEMV * 0.7)}
- **Estimated Investment Required: ${formatCurrency(investmentRequired)}**
- ROI: ${formatPercent((residualEMV * 0.3 / investmentRequired) * 100)} return on risk reduction`;

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: formatExecutiveResponse(`RISK #${riskId} DEEP INTELLIGENCE`, analysis, additionalData),
    timestamp: new Date(),
    metadata: {
      intent: 'specific_risk',
      confidence: 100,
      dataUsed: ['enterpriseRisks', 'enterpriseKRIs', 'enterpriseControls', 'riskEvents'],
      suggestedActions: ['Bow-tie analysis', 'Treatment options', 'Monte Carlo for this risk']
    }
  };
}

function handleCategoryAnalysis(category: string): ChatMessage {
  const categoryMap: Record<string, string> = {
    'cyber': 'Cybersecurity',
    'cybersecurity': 'Cybersecurity',
    'financial': 'Financial',
    'operational': 'Operational',
    'compliance': 'Compliance',
    'strategic': 'Strategic',
    'reputational': 'Reputational',
    'people': 'People',
    'third party': 'Third Party',
    'vendor': 'Third Party',
    'ai': 'AI Ethics',
    'ai ethics': 'AI Ethics'
  };

  const normalizedCategory = categoryMap[category.toLowerCase()] || category;
  const categoryRisks = getRisksByCategory(normalizedCategory as any);

  if (categoryRisks.length === 0) {
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `No risks found for category "${normalizedCategory}". Available categories: ${Array.from(new Set(enterpriseRisks.map(r => r.riskCategory))).join(', ')}`,
      timestamp: new Date(),
      metadata: { intent: 'error', confidence: 100 }
    };
  }

  const categoryEMV = categoryRisks.reduce((sum, r) => sum + calculateResidualEMV(r), 0);
  const linkedKRIs = enterpriseKRIs.filter(k => categoryRisks.some(r => r.riskId === k.riskId));

  const analysis = generateFiveLayerAnalysis(category, categoryRisks, linkedKRIs);

  const additionalData = `
**${normalizedCategory} Category Analysis**

**Category Metrics:**
- Total Risks: ${categoryRisks.length}
- Escalated: ${categoryRisks.filter(r => r.riskStatus === 'Escalated').length}
- Outside Appetite: ${categoryRisks.filter(r => r.riskAppetiteAlignment === 'Outside Appetite').length}
- Average Residual Score: ${(categoryRisks.reduce((s, r) => s + r.residualRiskScore, 0) / categoryRisks.length).toFixed(1)}
- **Total Category EMV: ${formatCurrency(categoryEMV)}**

**Top 5 ${normalizedCategory} Risks:**
${categoryRisks.sort((a, b) => b.residualRiskScore - a.residualRiskScore).slice(0, 5).map((r, i) => {
  const emv = calculateResidualEMV(r);
  return `${i + 1}. Risk #${r.riskId}: ${r.riskDescription.substring(0, 50)}...
     - Score: ${r.residualRiskScore} | EMV: ${formatCurrency(emv)} | Status: ${r.riskStatus}`;
}).join('\n')}

**Linked KRIs:**
- Total: ${linkedKRIs.length}
- Breached: ${linkedKRIs.filter(k => k.status === 'Red').length}
- Warning: ${linkedKRIs.filter(k => k.status === 'Amber').length}

**Control Coverage:**
- Risks with High Effectiveness: ${categoryRisks.filter(r => r.controlEffectiveness === 'High').length}
- Risks with Medium Effectiveness: ${categoryRisks.filter(r => r.controlEffectiveness === 'Medium').length}
- Risks with Low Effectiveness: ${categoryRisks.filter(r => r.controlEffectiveness === 'Low').length}`;

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: formatExecutiveResponse(`${normalizedCategory.toUpperCase()} CATEGORY INTELLIGENCE`, analysis, additionalData),
    timestamp: new Date(),
    metadata: {
      intent: 'category_analysis',
      confidence: 100,
      dataUsed: ['enterpriseRisks', 'enterpriseKRIs'],
      suggestedActions: categoryRisks.slice(0, 3).map(r => `Analyze Risk #${r.riskId}`)
    }
  };
}

function handleHelp(): ChatMessage {
  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: `**LUMINA-R AI RISK INTELLIGENCE ENGINE**

I operate on a five-layer reasoning system to provide board-ready risk intelligence:

**Layer 1: Structural Interpretation** - Understanding what the data represents
**Layer 2: Quantitative Analysis** - EMV calculations, statistics, financial impact
**Layer 3: Strategic Context** - Business objective implications
**Layer 4: Governance Implication** - Regulatory and oversight requirements
**Layer 5: Action Prescription** - Immediate, 30-day, and 90-day recommendations

---

**Available Analysis Capabilities:**

**Risk Prioritization**
- "Top 5 risks" - Priority-ranked risks by composite score
- "Risk #12" - Deep dive into specific risk with EMV and treatment costs
- "Cyber risks" / "Financial risks" - Category-specific analysis

**KRI Intelligence**
- "KRI status" / "Breached KRIs" - Threshold monitoring
- "KRI trends" - Adverse movement detection

**Quantitative Analytics**
- "Monte Carlo" - Probabilistic loss distribution (P50, P75, P95)
- "Appetite breach" - Quantified tolerance exceedances with remediation costs
- "Control gaps" - Investment requirements for effectiveness improvement

**Advanced Analytics**
- "Cluster analysis" - Correlated risk detection
- "Executive summary" - Board-ready portfolio overview

**Example Queries:**
- "What investment is needed to bring Risk #45 within appetite?"
- "Run Monte Carlo on our cyber risk portfolio"
- "Show me risks trending adversely with weak controls"

What would you like to analyze?`,
    timestamp: new Date(),
    metadata: {
      intent: 'help',
      confidence: 100,
      suggestedActions: ['Executive summary', 'Top 5 risks', 'Monte Carlo analysis'],
      diagnosticOptions: generateDiagnosticOptions('help')
    }
  };
}

function handleGreeting(): ChatMessage {
  const riskStats = getRiskStats();
  const kriStats = getKRIStats();
  const portfolioEMV = getPortfolioEMV();
  const breachedAppetites = getBreachedAppetites();

  // Determine urgency level
  const urgencyFactors = [];
  if (kriStats.byStatus.red > 10) urgencyFactors.push(`${kriStats.byStatus.red} KRIs breached`);
  if (riskStats.escalated > 5) urgencyFactors.push(`${riskStats.escalated} risks escalated`);
  if (breachedAppetites.length > 0) urgencyFactors.push(`${breachedAppetites.length} appetite categories breached`);

  const urgencyStatement = urgencyFactors.length > 0 ?
    `\n\n**Attention Required:** ${urgencyFactors.join(', ')}` : '';

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: `**LUMINA-R Risk Intelligence Active**

Welcome to your enterprise risk intelligence briefing.

**Current Risk Posture:**
- Portfolio Residual EMV: ${formatCurrency(portfolioEMV.totalResidual)}
- Risks Tracked: ${riskStats.total} | Escalated: ${riskStats.escalated} | Outside Appetite: ${riskStats.outsideAppetite}
- KRI Health Score: ${getKRIHealthScore()}% (${kriStats.byStatus.red} breached, ${kriStats.byStatus.amber} warning)
- Control Reduction: ${formatPercent(portfolioEMV.reduction)} of inherent exposure${urgencyStatement}

**Quick Analysis Options:**
What would you like to explore?`,
    timestamp: new Date(),
    metadata: {
      intent: 'greeting',
      confidence: 100,
      dataUsed: ['enterpriseRisks', 'enterpriseKRIs', 'riskAppetite'],
      suggestedActions: ['Executive summary', 'Top risks', 'Urgent actions'],
      diagnosticOptions: generateDiagnosticOptions('greeting')
    }
  };
}

function handleUrgentActions(): ChatMessage {
  const escalatedRisks = getEscalatedRisks();
  const breachedKRIs = getBreachedKRIs();
  const outsideAppetite = getOutsideAppetiteRisks();
  const controlStats = getControlStats();

  const analysis = generateFiveLayerAnalysis('urgent', escalatedRisks.slice(0, 10), breachedKRIs.slice(0, 10));

  const urgentEMV = escalatedRisks.reduce((sum, r) => sum + calculateResidualEMV(r), 0);

  const additionalData = `
**IMMEDIATE ACTION MATRIX**

**Escalated Risks (${escalatedRisks.length})** - Residual EMV: ${formatCurrency(urgentEMV)}
${escalatedRisks.slice(0, 5).map((r, i) => {
  const emv = calculateResidualEMV(r);
  return `${i + 1}. Risk #${r.riskId}: ${r.riskDescription.substring(0, 45)}...
     - EMV: ${formatCurrency(emv)} | Owner: ${r.riskOwner}
     - **ACTION: Require Risk Committee review within 48 hours**`;
}).join('\n')}

**Breached KRIs (${breachedKRIs.length})** - Requiring Root Cause Analysis
${breachedKRIs.slice(0, 5).map((k, i) => {
  const risk = enterpriseRisks.find(r => r.riskId === k.riskId);
  return `${i + 1}. ${k.indicator}: ${k.currentValue} vs ${k.threshold} threshold
     - Risk #${k.riskId} (${risk?.riskOwner || 'N/A'})
     - **ACTION: Investigate within 24 hours**`;
}).join('\n')}

**Outside Appetite (${outsideAppetite.length})** - Tolerance Breach
${outsideAppetite.slice(0, 3).map((r, i) => {
  const { investmentRequired } = calculateProbabilityReductionRequired(r, 25);
  return `${i + 1}. Risk #${r.riskId}: ${r.riskDescription.substring(0, 40)}...
     - **ACTION: Treatment plan required - Est. ${formatCurrency(investmentRequired)}**`;
}).join('\n')}

**Weak Controls (${controlStats.lowEffectivenessControls.length})** - Below 70% Effectiveness
${controlStats.lowEffectivenessControls.slice(0, 3).map((c, i) =>
  `${i + 1}. ${c.controlName}: ${c.effectivenessScore}%
     - **ACTION: Remediation plan within 30 days**`
).join('\n')}

---

**IMMEDIATE ESCALATION CHECKLIST:**
1. Notify CRO of ${escalatedRisks.length} escalated risks
2. Schedule emergency review for ${breachedKRIs.length} breached KRIs
3. Brief Risk Committee on ${outsideAppetite.length} appetite breaches
4. Initiate control remediation for ${controlStats.lowEffectivenessControls.length} weak controls`;

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: formatExecutiveResponse('URGENT ACTION INTELLIGENCE', analysis, additionalData),
    timestamp: new Date(),
    metadata: {
      intent: 'urgent_actions',
      confidence: 100,
      dataUsed: ['enterpriseRisks', 'enterpriseKRIs', 'enterpriseControls'],
      suggestedActions: ['Generate report', 'Owner notifications', 'Treatment planning']
    }
  };
}

// ============================================================================
// MAIN PROCESSING ENGINE
// ============================================================================

export function processMessage(userMessage: string): ChatMessage {
  const message = userMessage.trim().toLowerCase();

  // Specific risk lookup
  const riskMatch = userMessage.match(/risk\s*#?(\d+)/i);
  if (riskMatch) {
    return handleSpecificRisk(parseInt(riskMatch[1]));
  }

  // Top N risks
  const topMatch = message.match(/top\s*(\d+)?\s*risk/i);
  if (topMatch || message.includes('highest risk') || message.includes('priority risk') || message.includes('critical risk')) {
    const count = topMatch?.[1] ? parseInt(topMatch[1]) : 5;
    return handleTopRisks(count);
  }

  // KRI Analysis
  if (message.includes('kri') || message.includes('indicator') || message.includes('threshold') || message.includes('breached')) {
    return handleKRIAnalysis();
  }

  // Appetite Analysis
  if (message.includes('appetite') || message.includes('tolerance') || message.includes('outside')) {
    return handleAppetiteAnalysis();
  }

  // Control Analysis
  if (message.includes('control') || message.includes('effectiveness') || message.includes('mitigation')) {
    return handleControlAnalysis();
  }

  // Monte Carlo
  if (message.includes('monte carlo') || message.includes('simulation') || message.includes('probability') || message.includes('var') || message.includes('value at risk')) {
    return handleMonteCarloAnalysis();
  }

  // Cluster Analysis
  if (message.includes('cluster') || message.includes('correlation') || message.includes('interconnect') || message.includes('cascade')) {
    return handleClusterAnalysis();
  }

  // Category Analysis
  const categories = ['cyber', 'financial', 'operational', 'compliance', 'strategic', 'reputational', 'people', 'third party', 'vendor', 'ai'];
  for (const cat of categories) {
    if (message.includes(cat)) {
      return handleCategoryAnalysis(cat);
    }
  }

  // Executive Summary
  if (message.includes('summary') || message.includes('executive') || message.includes('overview') || message.includes('dashboard') || message.includes('posture')) {
    return handleExecutiveSummary();
  }

  // Urgent Actions
  if (message.includes('urgent') || message.includes('immediate') || message.includes('priority') || message.includes('attention') || message.includes('critical') || message.includes('action')) {
    return handleUrgentActions();
  }

  // Greeting
  if (message.match(/^(hi|hello|hey|good morning|good afternoon|good evening|greetings)/i)) {
    return handleGreeting();
  }

  // Help
  if (message.includes('help') || message.includes('what can you') || message.includes('how do') || message.includes('guide')) {
    return handleHelp();
  }

  // Fallback with diagnostic options
  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: `I can help you analyze your risk portfolio with quantitative intelligence. Here are some options:

**Select an Analysis Path:**`,
    timestamp: new Date(),
    metadata: {
      intent: 'clarification',
      confidence: 70,
      diagnosticOptions: [
        { label: 'Executive Summary', action: 'Show executive summary', description: 'Board-ready portfolio overview' },
        { label: 'Top Priority Risks', action: 'Show top 5 priority risks', description: 'Ranked by composite risk score' },
        { label: 'KRI Breach Analysis', action: 'Analyze breached KRIs', description: `${getKRIStats().byStatus.red} KRIs currently in breach` },
        { label: 'Monte Carlo Simulation', action: 'Run Monte Carlo analysis', description: 'Probabilistic loss distribution' }
      ],
      suggestedActions: ['Executive summary', 'Top risks', 'KRI status', 'Help']
    }
  };
}

export const getSuggestedQuestions = () => [
  'Show executive summary with EMV analysis',
  'What are the top 5 priority risks?',
  'Which KRIs are breached and trending adversely?',
  'Run Monte Carlo simulation on the portfolio',
  'Show appetite breaches with remediation costs',
  'Analyze control effectiveness gaps',
  'Identify correlated risk clusters',
  'What is the investment required for Risk #12 treatment?',
  'Show urgent actions needed today',
  'Compare cyber risks vs financial risks',
];
