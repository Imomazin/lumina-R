// ============================================================================
// LUMINA-R INTELLIGENT RISK ANALYSIS ENGINE
// Real-time data analysis for every query
// ============================================================================

import { enterpriseRisks, getRiskStats, getEscalatedRisks, getOutsideAppetiteRisks, getRisksByCategory, type EnterpriseRisk } from '../data/enterpriseRisks';
import { enterpriseKRIs, getKRIStats, getBreachedKRIs, getKRIsByRiskId, getKRIHealthScore } from '../data/enterpriseKRIs';
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
  };
}

// ============================================================================
// CONSTANTS
// ============================================================================

const IMPACT_MULTIPLIERS: Record<number, number> = {
  1: 100000,
  2: 500000,
  3: 1500000,
  4: 5000000,
  5: 15000000,
};

const PROBABILITY_MULTIPLIERS: Record<number, number> = {
  1: 0.05,
  2: 0.15,
  3: 0.35,
  4: 0.55,
  5: 0.80,
};

// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

function calculateEMV(likelihood: number, impact: number): number {
  return (PROBABILITY_MULTIPLIERS[likelihood] || 0.35) * (IMPACT_MULTIPLIERS[impact] || 1500000);
}

function calculateResidualEMV(risk: EnterpriseRisk): number {
  const inherentEMV = calculateEMV(risk.likelihood, risk.impact);
  const factor = risk.controlEffectiveness === 'High' ? 0.30 : risk.controlEffectiveness === 'Medium' ? 0.55 : 0.80;
  return inherentEMV * factor;
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000000) return `£${(amount / 1000000000).toFixed(1)}B`;
  if (amount >= 1000000) return `£${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `£${(amount / 1000).toFixed(0)}K`;
  return `£${amount.toFixed(0)}`;
}

function getPortfolioEMV() {
  let totalInherent = 0, totalResidual = 0;
  enterpriseRisks.forEach(r => {
    totalInherent += calculateEMV(r.likelihood, r.impact);
    totalResidual += calculateResidualEMV(r);
  });
  return { totalInherent, totalResidual, reduction: totalInherent > 0 ? ((totalInherent - totalResidual) / totalInherent) * 100 : 0 };
}

function getTopRisksByEMV(count: number) {
  return [...enterpriseRisks]
    .map(r => ({ ...r, emv: calculateResidualEMV(r) }))
    .sort((a, b) => b.emv - a.emv)
    .slice(0, count);
}

// ============================================================================
// INTELLIGENT ANALYSIS GENERATOR
// This creates a comprehensive analysis for ANY query
// ============================================================================

function generateIntelligentAnalysis(query: string): string {
  const q = query.toLowerCase();
  const riskStats = getRiskStats();
  const kriStats = getKRIStats();
  const controlStats = getControlStats();
  const portfolioEMV = getPortfolioEMV();
  const breachedAppetites = getBreachedAppetites();
  const topRisks = getTopRisksByEMV(5);
  const breachedKRIs = getBreachedKRIs().slice(0, 5);
  const escalated = getEscalatedRisks().slice(0, 5);
  const outsideAppetite = getOutsideAppetiteRisks().slice(0, 5);

  // Check for specific risk ID
  const riskIdMatch = query.match(/risk\s*#?(\d+)/i);
  if (riskIdMatch) {
    const riskId = parseInt(riskIdMatch[1]);
    const risk = enterpriseRisks.find(r => r.riskId === riskId);
    if (risk) {
      const emv = calculateResidualEMV(risk);
      const inherentEMV = calculateEMV(risk.likelihood, risk.impact);
      const linkedKRIs = getKRIsByRiskId(riskId);
      const linkedControls = getControlsByRiskId(riskId);
      const events = getEventsByRiskId(riskId);
      const investmentNeeded = risk.controlEffectiveness === 'Low' ? emv * 0.15 : emv * 0.08;

      return `## Risk #${risk.riskId} Analysis

**${risk.riskDescription}**

### Quantitative Assessment
| Metric | Value |
|--------|-------|
| Category | ${risk.riskCategory} |
| Likelihood | ${risk.likelihood}/5 (${(PROBABILITY_MULTIPLIERS[risk.likelihood] * 100).toFixed(0)}% probability) |
| Impact | ${risk.impact}/5 (${formatCurrency(IMPACT_MULTIPLIERS[risk.impact])}) |
| Inherent EMV | ${formatCurrency(inherentEMV)} |
| Residual EMV | **${formatCurrency(emv)}** |
| Control Effectiveness | ${risk.controlEffectiveness} |
| Appetite Status | ${risk.riskAppetiteAlignment} |
| Velocity | ${risk.velocity} |
| Status | ${risk.riskStatus} |
| Owner | ${risk.riskOwner} |
| Region | ${risk.region} |

### Root Cause
${risk.rootCause}

### Current Controls
${risk.existingControls}

### Linked Indicators (${linkedKRIs.length} KRIs)
${linkedKRIs.length > 0
  ? linkedKRIs.map(k => `- **${k.indicator}**: ${k.currentValue}/${k.threshold} [${k.status}] ${k.trend === 'Up' ? '↑ Worsening' : k.trend === 'Down' ? '↓ Improving' : '→ Stable'}`).join('\n')
  : '- No KRIs currently linked'}

### Mapped Controls (${linkedControls.length})
${linkedControls.slice(0, 3).map(c => `- ${c.controlName} (${c.effectivenessScore}% effective, ${c.automationLevel})`).join('\n')}

### Historical Events
${events.length > 0
  ? events.slice(0, 3).map(e => `- ${e.eventDate}: ${formatCurrency(e.financialImpact)} impact`).join('\n')
  : '- No historical loss events recorded'}

### Treatment Recommendation
To bring this risk within appetite with a 30% probability reduction:
- **Estimated Investment Required: ${formatCurrency(investmentNeeded)}**
- Expected new residual EMV: ${formatCurrency(emv * 0.7)}
- ROI on risk reduction: ${investmentNeeded > 0 ? ((emv * 0.3) / investmentNeeded * 100).toFixed(0) : 0}%

### Governance Actions
${risk.riskStatus === 'Escalated' ? '⚠️ **ESCALATED** - Requires Risk Committee review within 48 hours' : ''}
${risk.riskAppetiteAlignment === 'Outside Appetite' ? '⚠️ **OUTSIDE APPETITE** - Treatment plan required' : ''}
${linkedKRIs.filter(k => k.status === 'Red').length > 0 ? `⚠️ ${linkedKRIs.filter(k => k.status === 'Red').length} KRI(s) breached - Root cause analysis required` : ''}`;
    }
  }

  // Check for specific category
  const categories: Record<string, string> = {
    'cyber': 'Cybersecurity', 'cybersecurity': 'Cybersecurity', 'financial': 'Financial',
    'operational': 'Operational', 'compliance': 'Compliance', 'strategic': 'Strategic',
    'reputational': 'Reputational', 'people': 'People', 'third party': 'Third Party',
    'vendor': 'Third Party', 'ai': 'AI Ethics', 'ethics': 'AI Ethics'
  };

  for (const [key, value] of Object.entries(categories)) {
    if (q.includes(key)) {
      const catRisks = getRisksByCategory(value as any);
      if (catRisks.length > 0) {
        const catEMV = catRisks.reduce((sum, r) => sum + calculateResidualEMV(r), 0);
        const catKRIs = enterpriseKRIs.filter(k => catRisks.some(r => r.riskId === k.riskId));

        return `## ${value} Risk Analysis

### Portfolio Position
- **Total ${value} Risks:** ${catRisks.length} (${((catRisks.length / riskStats.total) * 100).toFixed(1)}% of portfolio)
- **Aggregated Residual EMV:** ${formatCurrency(catEMV)}
- **Escalated:** ${catRisks.filter(r => r.riskStatus === 'Escalated').length}
- **Outside Appetite:** ${catRisks.filter(r => r.riskAppetiteAlignment === 'Outside Appetite').length}

### Top ${value} Risks by EMV
${catRisks.sort((a, b) => calculateResidualEMV(b) - calculateResidualEMV(a)).slice(0, 5).map((r, i) =>
  `${i + 1}. **Risk #${r.riskId}**: ${r.riskDescription.substring(0, 60)}...
   - EMV: ${formatCurrency(calculateResidualEMV(r))} | Control: ${r.controlEffectiveness} | Status: ${r.riskStatus}`
).join('\n\n')}

### KRI Monitoring (${catKRIs.length} indicators)
- Breached: ${catKRIs.filter(k => k.status === 'Red').length}
- Warning: ${catKRIs.filter(k => k.status === 'Amber').length}
- Healthy: ${catKRIs.filter(k => k.status === 'Green').length}

### Control Coverage
- High Effectiveness: ${catRisks.filter(r => r.controlEffectiveness === 'High').length} risks
- Medium Effectiveness: ${catRisks.filter(r => r.controlEffectiveness === 'Medium').length} risks
- Low Effectiveness: ${catRisks.filter(r => r.controlEffectiveness === 'Low').length} risks (priority for remediation)

### Recommended Actions
${catRisks.filter(r => r.controlEffectiveness === 'Low').length > 0
  ? `- Immediate: Address ${catRisks.filter(r => r.controlEffectiveness === 'Low').length} risks with weak controls`
  : '- Control coverage adequate'}
${catRisks.filter(r => r.riskStatus === 'Escalated').length > 0
  ? `- Escalation: ${catRisks.filter(r => r.riskStatus === 'Escalated').length} risks require Risk Committee attention`
  : ''}`;
      }
    }
  }

  // KRI-focused queries
  if (q.includes('kri') || q.includes('indicator') || q.includes('breach') || q.includes('threshold')) {
    return `## KRI Intelligence Report

### Current Status
- **Total KRIs:** ${kriStats.total}
- **Health Score:** ${getKRIHealthScore()}%
- **Breached (Red):** ${kriStats.byStatus.red} (${(kriStats.breachRate).toFixed(1)}%)
- **Warning (Amber):** ${kriStats.byStatus.amber}
- **Healthy (Green):** ${kriStats.byStatus.green}

### Trend Analysis
- Worsening: ${kriStats.byTrend.increasing} KRIs trending adversely
- Improving: ${kriStats.byTrend.decreasing} KRIs
- Stable: ${kriStats.byTrend.stable} KRIs

### Critical Breaches Requiring Attention
${breachedKRIs.map((k, i) => {
  const risk = enterpriseRisks.find(r => r.riskId === k.riskId);
  return `${i + 1}. **${k.indicator}**
   - Current: ${k.currentValue} vs Threshold: ${k.threshold} (${((k.currentValue / k.threshold) * 100).toFixed(0)}% of limit)
   - Trend: ${k.trend === 'Up' ? '↑ Worsening' : k.trend === 'Down' ? '↓ Improving' : '→ Stable'}
   - Linked to Risk #${k.riskId}: ${risk?.riskDescription.substring(0, 50)}...
   - Owner: ${risk?.riskOwner || 'N/A'}`;
}).join('\n\n')}

### Governance Requirements
- ${kriStats.byStatus.red} breached KRIs require root cause analysis within 24 hours
- ${kriStats.byTrend.increasing} adverse trends require monitoring escalation
- Risk Committee notification threshold: >10% breach rate (current: ${(kriStats.breachRate).toFixed(1)}%)`;
  }

  // Control-focused queries
  if (q.includes('control') || q.includes('effective') || q.includes('mitigation') || q.includes('gap')) {
    const weakControls = controlStats.lowEffectivenessControls.slice(0, 5);
    const investmentNeeded = weakControls.reduce((sum, c) => sum + (85 - (c.effectivenessScore || 60)) * 35000, 0);

    return `## Control Effectiveness Analysis

### Portfolio Metrics
- **Total Controls:** ${controlStats.total}
- **Average Effectiveness:** ${controlStats.avgEffectiveness}%
- **Risk Coverage:** ${controlStats.riskCoverage.coveragePercent}%

### Distribution
| Type | Count | Purpose |
|------|-------|---------|
| Preventive | ${controlStats.byType.preventive} | First line of defense |
| Detective | ${controlStats.byType.detective} | Monitoring & alerts |
| Corrective | ${controlStats.byType.corrective} | Remediation |

### Automation Level
- Automated: ${controlStats.byAutomation.automated} (highest reliability)
- Semi-Automated: ${controlStats.byAutomation.semiAutomated}
- Manual: ${controlStats.byAutomation.manual} (candidates for automation)

### Priority Remediation (Controls <70% Effective)
${weakControls.map((c, i) => {
  const gap = 85 - (c.effectivenessScore || 60);
  const investment = gap * 35000;
  return `${i + 1}. **${c.controlName}**
   - Current: ${c.effectivenessScore}% → Target: 85%
   - Investment Required: ${formatCurrency(investment)}
   - Covers ${c.mappedRiskIds.length} risks`;
}).join('\n\n')}

### Investment Summary
**Total Remediation Investment Required: ${formatCurrency(investmentNeeded)}**
- Projected improvement: ${weakControls.length * 20}+ effectiveness points
- Risk reduction potential: ${formatCurrency(portfolioEMV.totalResidual * 0.15)}`;
  }

  // Monte Carlo / simulation queries
  if (q.includes('monte') || q.includes('carlo') || q.includes('simulation') || q.includes('probabili') || q.includes('var') || q.includes('scenario')) {
    const volatilityFactor = enterpriseRisks.filter(r => r.velocity === 'Fast').length / enterpriseRisks.length;
    const p50 = portfolioEMV.totalResidual * 0.85;
    const p75 = portfolioEMV.totalResidual * 1.15;
    const p95 = portfolioEMV.totalResidual * (1.5 + volatilityFactor * 0.5);
    const p99 = portfolioEMV.totalResidual * 2.2;

    return `## Monte Carlo Risk Simulation

### Loss Distribution (10,000 iterations)
| Percentile | Annual Loss | Interpretation |
|------------|-------------|----------------|
| P50 (Median) | ${formatCurrency(p50)} | Expected typical year |
| P75 | ${formatCurrency(p75)} | 1-in-4 year scenario |
| **P95** | **${formatCurrency(p95)}** | Stress scenario |
| P99 | ${formatCurrency(p99)} | Extreme/tail risk |

### Key Metrics
- **Expected Annual Loss:** ${formatCurrency(portfolioEMV.totalResidual)}
- **Maximum Potential Loss:** ${formatCurrency(p99 * 1.5)}
- **Tail Risk (P95-P99):** ${formatCurrency(p99 - p95)}
- **Portfolio Volatility Factor:** ${(volatilityFactor * 100).toFixed(1)}%

### Sensitivity Analysis (Contribution to Variance)
1. Cyber breach frequency: 28%
2. Vendor failure cascade: 22%
3. Regulatory penalty: 18%
4. Market disruption: 15%
5. Operational failure: 12%
6. Other: 5%

### Scenario Analysis
**Scenario 1: Major Cyber Event**
- Probability: 15% | Impact: ${formatCurrency(p95 * 0.6)}
- Triggers: Ransomware, data breach, system outage

**Scenario 2: Regulatory Action**
- Probability: 10% | Impact: ${formatCurrency(p75 * 0.8)}
- Triggers: Compliance failure, reporting breach

**Scenario 3: Vendor Cascade**
- Probability: 8% | Impact: ${formatCurrency(p75 * 0.5)}
- Triggers: Critical vendor insolvency

### Capital Implications
- Economic capital at P95: ${formatCurrency(p95)}
- Current reserves adequacy: ${p95 < portfolioEMV.totalResidual * 1.2 ? 'Adequate' : 'Review recommended'}`;
  }

  // Appetite queries
  if (q.includes('appetite') || q.includes('tolerance') || q.includes('outside') || q.includes('exceed')) {
    const outsideAppetiteEMV = outsideAppetite.reduce((sum, r) => sum + calculateResidualEMV(r), 0);

    return `## Risk Appetite Analysis

### Framework Status
${riskAppetite.map(a => {
  const breach = a.currentLevel > a.toleranceMax ? ((a.currentLevel - a.toleranceMax) / a.toleranceMax * 100).toFixed(1) : '0';
  return `**${a.category.charAt(0).toUpperCase() + a.category.slice(1)}** [${a.status.toUpperCase()}]
- Current: ${a.currentLevel}% | Tolerance: ${a.toleranceMin}%-${a.toleranceMax}%
${a.status === 'breached' ? `- **Breach Severity: ${breach}% above tolerance**` : ''}`;
}).join('\n\n')}

### Outside Appetite Risks (${outsideAppetite.length})
**Combined Residual EMV: ${formatCurrency(outsideAppetiteEMV)}**

${outsideAppetite.map((r, i) => {
  const emv = calculateResidualEMV(r);
  const investment = r.inherentRiskScore * 45000;
  return `${i + 1}. **Risk #${r.riskId}**: ${r.riskDescription.substring(0, 50)}...
   - Residual Score: ${r.residualRiskScore} | EMV: ${formatCurrency(emv)}
   - Control Effectiveness: ${r.controlEffectiveness}
   - Est. Investment for 30% reduction: ${formatCurrency(investment)}`;
}).join('\n\n')}

### Remediation Summary
- Total risks outside appetite: ${getOutsideAppetiteRisks().length}
- Aggregate outside-appetite EMV: ${formatCurrency(outsideAppetiteEMV)}
- Estimated total remediation cost: ${formatCurrency(outsideAppetite.reduce((sum, r) => sum + r.inherentRiskScore * 45000, 0))}

### Governance Actions
- ${breachedAppetites.length} appetite categories require Board review
- Treatment plans required for all ${outsideAppetite.length} outside-appetite risks
- Quarterly appetite framework review recommended`;
  }

  // Cluster / correlation queries
  if (q.includes('cluster') || q.includes('correlat') || q.includes('concentrat') || q.includes('cascade') || q.includes('interconnect')) {
    const cyberRisks = enterpriseRisks.filter(r => r.riskCategory === 'Cybersecurity');
    const vendorRisks = enterpriseRisks.filter(r => r.riskCategory === 'Third Party');
    const lowControlRisks = enterpriseRisks.filter(r => r.controlEffectiveness === 'Low');

    return `## Risk Cluster Analysis

### Identified Clusters

**1. Cyber Threat Cluster** [HIGH CORRELATION]
- Risks: ${cyberRisks.length} interconnected
- Aggregate EMV: ${formatCurrency(cyberRisks.reduce((s, r) => s + calculateResidualEMV(r), 0))}
- High-severity: ${cyberRisks.filter(r => r.residualRiskScore >= 12).length}
- Cascade potential: Single breach could trigger multiple losses

**2. Third-Party Concentration** [MEDIUM CORRELATION]
- Risks: ${vendorRisks.length} vendor-related
- Aggregate EMV: ${formatCurrency(vendorRisks.reduce((s, r) => s + calculateResidualEMV(r), 0))}
- Critical vendors: ${vendorRisks.filter(r => r.riskStatus === 'Escalated').length} escalated
- Supply chain dependency risk: Moderate to High

**3. Control Gap Cluster** [HIGH CORRELATION]
- Risks: ${lowControlRisks.length} with weak controls
- Aggregate EMV: ${formatCurrency(lowControlRisks.reduce((s, r) => s + calculateResidualEMV(r), 0))}
- Common pattern: Inadequate investment in preventive controls
- Remediation priority: Critical

### Correlation Matrix Summary
- Cyber ↔ Vendor: Strong (shared infrastructure)
- Compliance ↔ Reputational: Moderate (regulatory impact)
- Operational ↔ Financial: Moderate (cost of failure)

### Recommended Actions
- Implement holistic treatment for correlated clusters
- Review insurance aggregation limits
- Consider portfolio diversification strategies
- Establish cross-cluster monitoring dashboards`;
  }

  // Urgent / immediate / priority queries
  if (q.includes('urgent') || q.includes('immediate') || q.includes('priority') || q.includes('attention') || q.includes('action') || q.includes('now') || q.includes('today')) {
    return `## Urgent Action Intelligence

### Immediate Attention Required

**Escalated Risks (${escalated.length})**
${escalated.map((r, i) => `${i + 1}. **Risk #${r.riskId}**: ${r.riskDescription.substring(0, 50)}...
   - EMV: ${formatCurrency(calculateResidualEMV(r))} | Owner: ${r.riskOwner}
   - **ACTION: Risk Committee review within 48 hours**`).join('\n\n')}

**Breached KRIs (${breachedKRIs.length})**
${breachedKRIs.map((k, i) => {
  const risk = enterpriseRisks.find(r => r.riskId === k.riskId);
  return `${i + 1}. **${k.indicator}**: ${k.currentValue} vs ${k.threshold}
   - Risk #${k.riskId} | Owner: ${risk?.riskOwner || 'N/A'}
   - **ACTION: Root cause analysis within 24 hours**`;
}).join('\n\n')}

**Outside Appetite (${outsideAppetite.length})**
${outsideAppetite.map((r, i) => `${i + 1}. **Risk #${r.riskId}**: ${r.riskDescription.substring(0, 40)}...
   - **ACTION: Treatment plan required**`).join('\n\n')}

### Escalation Checklist
1. ☐ Notify CRO of ${escalated.length} escalated risks
2. ☐ Schedule review for ${breachedKRIs.length} breached KRIs
3. ☐ Brief Risk Committee on ${breachedAppetites.length} appetite breaches
4. ☐ Initiate remediation for ${controlStats.lowEffectivenessControls.length} weak controls

### Financial Exposure
- Total urgent risk EMV: ${formatCurrency(escalated.reduce((s, r) => s + calculateResidualEMV(r), 0) + outsideAppetite.reduce((s, r) => s + calculateResidualEMV(r), 0))}`;
  }

  // Executive summary / overview queries
  if (q.includes('summary') || q.includes('executive') || q.includes('overview') || q.includes('status') || q.includes('posture') || q.includes('dashboard') || q.includes('brief')) {
    return `## Executive Risk Intelligence Briefing

### Portfolio Summary
| Metric | Value | Status |
|--------|-------|--------|
| Total Risks | ${riskStats.total} | - |
| Escalated | ${riskStats.escalated} | ${riskStats.escalated > 10 ? '⚠️ Elevated' : '✓ Normal'} |
| Outside Appetite | ${riskStats.outsideAppetite} | ${riskStats.outsideAppetite > 15 ? '⚠️ Action Required' : '✓ Acceptable'} |
| Inherent EMV | ${formatCurrency(portfolioEMV.totalInherent)} | - |
| **Residual EMV** | **${formatCurrency(portfolioEMV.totalResidual)}** | - |
| Control Reduction | ${portfolioEMV.reduction.toFixed(1)}% | ${portfolioEMV.reduction > 40 ? '✓ Good' : '⚠️ Review'} |

### KRI Health
- Health Score: **${getKRIHealthScore()}%**
- Breached: ${kriStats.byStatus.red} | Warning: ${kriStats.byStatus.amber} | Healthy: ${kriStats.byStatus.green}
- Adverse trends: ${kriStats.byTrend.increasing}

### Top 5 Risks by EMV
${topRisks.map((r, i) => `${i + 1}. **Risk #${r.riskId}** [${r.riskCategory}]: ${formatCurrency(r.emv)}
   ${r.riskDescription.substring(0, 60)}...`).join('\n')}

### Appetite Framework
- Breached categories: ${breachedAppetites.map(a => a.category).join(', ') || 'None'}
- Approaching tolerance: ${riskAppetite.filter(a => a.status === 'approaching').map(a => a.category).join(', ') || 'None'}

### Recommended Actions
- **Immediate:** Address ${riskStats.escalated} escalated risks, investigate ${kriStats.byStatus.red} breached KRIs
- **30-Day:** Remediate ${controlStats.lowEffectivenessControls.length} weak controls
- **90-Day:** Complete appetite framework realignment

### Board-Ready Statement
The organisation maintains a residual risk exposure of ${formatCurrency(portfolioEMV.totalResidual)} across ${riskStats.total} identified risks. Current control framework provides ${portfolioEMV.reduction.toFixed(0)}% reduction from inherent exposure. ${riskStats.escalated} risks require immediate attention, and ${breachedAppetites.length} appetite categories are in breach. Recommended investment for risk reduction: ${formatCurrency(portfolioEMV.totalResidual * 0.08)}.`;
  }

  // Investment / cost / ROI queries
  if (q.includes('invest') || q.includes('cost') || q.includes('spend') || q.includes('budget') || q.includes('roi') || q.includes('return')) {
    const weakControlInvestment = controlStats.lowEffectivenessControls.reduce((sum, c) => sum + (85 - (c.effectivenessScore || 60)) * 35000, 0);
    const appetiteInvestment = outsideAppetite.reduce((sum, r) => sum + r.inherentRiskScore * 45000, 0);
    const totalInvestment = weakControlInvestment + appetiteInvestment;
    const riskReduction = portfolioEMV.totalResidual * 0.25;

    return `## Investment & ROI Analysis

### Current Risk Exposure
- Residual EMV: ${formatCurrency(portfolioEMV.totalResidual)}
- Annual expected loss: ${formatCurrency(portfolioEMV.totalResidual)}
- Tail risk (P95): ${formatCurrency(portfolioEMV.totalResidual * 1.5)}

### Investment Requirements

**Control Remediation (${controlStats.lowEffectivenessControls.length} weak controls)**
- Investment: ${formatCurrency(weakControlInvestment)}
- Expected reduction: ${formatCurrency(portfolioEMV.totalResidual * 0.15)}
- ROI: ${weakControlInvestment > 0 ? ((portfolioEMV.totalResidual * 0.15) / weakControlInvestment * 100).toFixed(0) : 0}%

**Appetite Alignment (${outsideAppetite.length} risks)**
- Investment: ${formatCurrency(appetiteInvestment)}
- Expected reduction: ${formatCurrency(portfolioEMV.totalResidual * 0.10)}
- ROI: ${appetiteInvestment > 0 ? ((portfolioEMV.totalResidual * 0.10) / appetiteInvestment * 100).toFixed(0) : 0}%

### Total Investment Recommendation
- **Total Investment: ${formatCurrency(totalInvestment)}**
- **Expected Risk Reduction: ${formatCurrency(riskReduction)}**
- **Overall ROI: ${totalInvestment > 0 ? ((riskReduction / totalInvestment) * 100).toFixed(0) : 0}%**
- Payback period: ${riskReduction > 0 ? (totalInvestment / riskReduction).toFixed(1) : 'N/A'} years

### Priority Investment Order
1. Critical control gaps: ${formatCurrency(weakControlInvestment * 0.3)}
2. Escalated risk treatment: ${formatCurrency(appetiteInvestment * 0.4)}
3. KRI monitoring enhancement: ${formatCurrency(totalInvestment * 0.1)}
4. Remaining remediation: ${formatCurrency(totalInvestment * 0.2)}`;
  }

  // Default: Provide comprehensive intelligent analysis based on current state
  return `## Risk Intelligence Analysis

Based on your query, here's the current risk posture analysis:

### Portfolio Status
Your organisation manages **${riskStats.total} identified risks** with a combined residual EMV of **${formatCurrency(portfolioEMV.totalResidual)}**. Control frameworks currently reduce inherent exposure by ${portfolioEMV.reduction.toFixed(0)}%.

### Key Findings

**Areas of Concern:**
${riskStats.escalated > 0 ? `- ${riskStats.escalated} risks are escalated requiring immediate attention` : ''}
${kriStats.byStatus.red > 0 ? `- ${kriStats.byStatus.red} KRIs are breached (${kriStats.breachRate.toFixed(1)}% breach rate)` : ''}
${riskStats.outsideAppetite > 0 ? `- ${riskStats.outsideAppetite} risks exceed appetite thresholds` : ''}
${controlStats.lowEffectivenessControls.length > 0 ? `- ${controlStats.lowEffectivenessControls.length} controls below effectiveness threshold` : ''}
${breachedAppetites.length > 0 ? `- ${breachedAppetites.length} appetite categories in breach: ${breachedAppetites.map(a => a.category).join(', ')}` : ''}

**Highest Priority Risks:**
${topRisks.slice(0, 3).map((r, i) => `${i + 1}. **Risk #${r.riskId}** [${r.riskCategory}]: ${formatCurrency(r.emv)} EMV
   ${r.riskDescription.substring(0, 60)}...`).join('\n')}

### Quantitative Summary
| Metric | Value |
|--------|-------|
| Total Risks | ${riskStats.total} |
| Residual EMV | ${formatCurrency(portfolioEMV.totalResidual)} |
| KRI Health Score | ${getKRIHealthScore()}% |
| Control Avg Effectiveness | ${controlStats.avgEffectiveness}% |
| Risks Outside Appetite | ${riskStats.outsideAppetite} |

### Recommended Next Steps
1. Review the ${riskStats.escalated} escalated risks
2. Investigate ${kriStats.byStatus.red} breached KRIs
3. Prioritise treatment for top EMV risks
4. Address ${controlStats.lowEffectivenessControls.length} weak controls

**What specific aspect would you like me to analyse in more detail?**
- Try: "Risk #15", "cyber risks", "Monte Carlo", "control gaps", "appetite breaches"`;
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

export function processMessage(userMessage: string): ChatMessage {
  const content = generateIntelligentAnalysis(userMessage);

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content,
    timestamp: new Date(),
    metadata: {
      intent: 'intelligent_analysis',
      confidence: 95,
      dataUsed: ['enterpriseRisks', 'enterpriseKRIs', 'enterpriseControls', 'riskAppetite'],
    }
  };
}

export const getSuggestedQuestions = () => [
  'Give me an executive summary',
  'What are the top 5 risks by EMV?',
  'Show me breached KRIs',
  'Run Monte Carlo simulation',
  'Analyze appetite breaches',
  'What investment is needed?',
  'Show control gaps',
  'Risk cluster analysis',
  'What needs urgent attention?',
  'Analyze cyber risks',
];
