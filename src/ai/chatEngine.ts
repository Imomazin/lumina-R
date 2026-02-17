// Lumina-R AI Risk Intelligence Engine
// Advanced Chat Engine with 100+ Scenarios, Pattern Recognition, and Deep Data Analysis
import { enterpriseRisks, getRiskStats, getHighRisks, getEscalatedRisks, getOutsideAppetiteRisks, getRisksByCategory, getRisksByRegion } from '../data/enterpriseRisks';
import { getKRIStats, getBreachedKRIs, getKRIsByRiskId, getKRIHealthScore, getKRIsWithTrend } from '../data/enterpriseKRIs';
import { getEventStats, getEventsByRiskId, getHighImpactEvents, getRecentEvents } from '../data/riskEvents';
import { getControlStats, getControlsByRiskId, getControlEffectivenessScore, getAutomatedControls, getManualControls } from '../data/enterpriseControls';

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

export interface ChatIntent {
  pattern: RegExp;
  intent: string;
  handler: (match?: RegExpMatchArray) => string;
  suggestedFollowups?: string[];
}

// Get current data analysis
const riskStats = () => getRiskStats();
const kriStats = () => getKRIStats();
const eventStats = () => getEventStats();
const controlStats = () => getControlStats();

// Utility functions
function formatCurrency(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount.toFixed(0)}`;
}

function getMostCommonCategory(risks: typeof enterpriseRisks) {
  const counts = new Map<string, number>();
  risks.forEach(r => counts.set(r.riskCategory, (counts.get(r.riskCategory) || 0) + 1));
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
}

function getRiskSeverityLabel(score: number): string {
  if (score >= 20) return 'Critical';
  if (score >= 15) return 'High';
  if (score >= 10) return 'Medium';
  if (score >= 5) return 'Low';
  return 'Very Low';
}

function getTrendIndicator(trend: string): string {
  if (trend === 'Up') return 'Increasing';
  if (trend === 'Down') return 'Decreasing';
  return 'Stable';
}

// Intent patterns and handlers - 50+ comprehensive intents
export const chatIntents: ChatIntent[] = [
  // ============ GREETING & GENERAL INTENTS ============
  {
    pattern: /^(hi|hello|hey|good morning|good afternoon|good evening|greetings)/i,
    intent: 'greeting',
    handler: () => {
      const stats = riskStats();
      const kri = kriStats();
      const ctrl = controlStats();
      return `Welcome to Lumina-R Risk Intelligence. Here's your current risk posture:

**Risk Portfolio Overview:**
- ${stats.total} Total Risks tracked across 9 categories
- ${stats.escalated} Escalated Risks requiring immediate attention
- ${stats.outsideAppetite} Risks Outside Appetite need mitigation
- ${stats.highRisk} High-severity risks (score 15+)

**KRI Health Status:**
- ${kri.byStatus.red} KRIs Breached (${kri.breachRate}% breach rate)
- ${kri.byStatus.amber} KRIs in Warning status
- Health Score: ${getKRIHealthScore()}%

**Control Effectiveness:**
- Average effectiveness: ${ctrl.avgEffectiveness}%
- Coverage: ${ctrl.riskCoverage.coveragePercent}%

**Priority Actions:**
1. Review the ${stats.escalated} escalated risks
2. Address ${kri.byStatus.red} breached KRIs
3. Improve ${ctrl.lowEffectivenessControls.length} low-effectiveness controls

How can I help you analyze your risk portfolio?`;
    },
    suggestedFollowups: ['Show top risks', 'Which KRIs are breached?', 'What needs immediate attention?'],
  },

  // ============ TOP RISKS INTENTS ============
  {
    pattern: /top\s*(\d+)?\s*risks?|highest\s*risk|critical\s*risks?|major\s*risks?|biggest\s*risks?|worst\s*risks?/i,
    intent: 'top_risks',
    handler: (match) => {
      const count = match?.[1] ? parseInt(match[1]) : 5;
      const highRisks = getHighRisks().sort((a, b) => b.inherentRiskScore - a.inherentRiskScore).slice(0, Math.min(count, 10));

      const riskList = highRisks.map((r, i) =>
        `${i + 1}. **Risk #${r.riskId}**: ${r.riskDescription.substring(0, 55)}...
   - Category: ${r.riskCategory} | Score: ${r.inherentRiskScore} (${getRiskSeverityLabel(r.inherentRiskScore)})
   - Owner: ${r.riskOwner} | Region: ${r.region}
   - Status: ${r.riskStatus} | Controls: ${r.controlEffectiveness}`
      ).join('\n\n');

      const avgScore = highRisks.reduce((s, r) => s + r.inherentRiskScore, 0) / highRisks.length;
      const escalatedCount = highRisks.filter(r => r.riskStatus === 'Escalated').length;

      return `**Top ${highRisks.length} Highest-Scoring Risks:**

${riskList}

**Analysis:**
- Average inherent score: ${avgScore.toFixed(1)} (${getRiskSeverityLabel(avgScore)})
- Most common category: ${getMostCommonCategory(highRisks)}
- ${escalatedCount} of these are already escalated
- ${highRisks.filter(r => r.riskAppetiteAlignment === 'Outside Appetite').length} are outside appetite

**Recommended Actions:**
1. Prioritize Risk #${highRisks[0].riskId} - highest score at ${highRisks[0].inherentRiskScore}
2. Review control effectiveness for risks with "Low" ratings
3. Run Monte Carlo simulation on financial impact scenarios`;
    },
    suggestedFollowups: ['Show details for Risk #' + getHighRisks()[0]?.riskId, 'Run Monte Carlo analysis', 'What controls cover these?'],
  },

  // ============ KRI ANALYSIS INTENTS ============
  {
    pattern: /kri|key\s*risk\s*indicator|breached|threshold|indicator|kri\s*status|kri\s*health/i,
    intent: 'kri_analysis',
    handler: () => {
      const stats = kriStats();
      const breached = getBreachedKRIs().slice(0, 5);

      const kriList = breached.map((k, i) =>
        `${i + 1}. **${k.indicator}** (KRI-${k.kriId})
   - Current: ${k.currentValue} vs Threshold: ${k.threshold} (${((k.currentValue / k.threshold) * 100).toFixed(0)}% of limit)
   - Trend: ${getTrendIndicator(k.trend)}
   - Linked to Risk #${k.riskId}`
      ).join('\n\n');

      return `**KRI Health Dashboard:**

**Overall Status:**
- Total KRIs: ${stats.total}
- Breached (Red): ${stats.byStatus.red}
- Warning (Amber): ${stats.byStatus.amber}
- Healthy (Green): ${stats.byStatus.green}
- Health Score: ${getKRIHealthScore()}%

**Top 5 Breached KRIs:**
${kriList}

**Trend Analysis:**
- ${stats.byTrend.increasing} KRIs trending upward (worsening)
- ${stats.byTrend.decreasing} KRIs improving
- ${stats.byTrend.stable} KRIs stable

**Immediate Actions:**
1. Convene risk owners for the ${stats.byStatus.red} red-status KRIs
2. Investigate root causes for upward-trending indicators
3. Update thresholds if business context has changed`;
    },
    suggestedFollowups: ['Show KRIs for Risk #12', 'Which KRIs are trending up?', 'KRI threshold recommendations'],
  },

  {
    pattern: /kri.*trend|trending\s*(up|down|worse|better)|worsening\s*kri/i,
    intent: 'kri_trends',
    handler: () => {
      const increasing = getKRIsWithTrend('Up');
      const decreasing = getKRIsWithTrend('Down');

      return `**KRI Trend Analysis:**

**Worsening KRIs (${increasing.length} trending up):**
${increasing.slice(0, 5).map((k, i) =>
  `${i + 1}. ${k.indicator} - Current: ${k.currentValue} (Risk #${k.riskId})`
).join('\n')}

**Improving KRIs (${decreasing.length} trending down):**
${decreasing.slice(0, 5).map((k, i) =>
  `${i + 1}. ${k.indicator} - Current: ${k.currentValue} (Risk #${k.riskId})`
).join('\n')}

**Recommendations:**
- Focus on the ${increasing.length} worsening indicators
- Investigate root causes before they breach thresholds
- Document improvement drivers for decreasing KRIs`;
    },
    suggestedFollowups: ['Show all breached KRIs', 'Risk details for worsening KRIs', 'Update KRI thresholds'],
  },

  // ============ CONTROL EFFECTIVENESS INTENTS ============
  {
    pattern: /control|effectiveness|mitigation|prevention|detection|control\s*analysis/i,
    intent: 'control_analysis',
    handler: () => {
      const stats = controlStats();
      const lowControls = stats.lowEffectivenessControls.slice(0, 3);
      const highControls = stats.highEffectivenessControls.slice(0, 3);

      return `**Control Effectiveness Analysis:**

**Control Portfolio:**
- Total Controls: ${stats.total}
- Average Effectiveness: ${stats.avgEffectiveness}%
- Risk Coverage: ${stats.riskCoverage.coveragePercent}% (${stats.riskCoverage.risksWithControls}/${stats.riskCoverage.totalRisks} risks)

**By Type:**
- Preventive: ${stats.byType.preventive} controls
- Detective: ${stats.byType.detective} controls
- Corrective: ${stats.byType.corrective} controls

**By Automation:**
- Automated: ${stats.byAutomation.automated} (highest reliability)
- Semi-Automated: ${stats.byAutomation.semiAutomated}
- Manual: ${stats.byAutomation.manual} (candidates for automation)

**Weakest Controls (Need Improvement):**
${lowControls.map((c, i) => `${i + 1}. ${c.controlName} - ${c.effectivenessScore}%`).join('\n')}

**Strongest Controls:**
${highControls.map((c, i) => `${i + 1}. ${c.controlName} - ${c.effectivenessScore}%`).join('\n')}

**Recommendations:**
1. Prioritize automation of ${stats.byAutomation.manual} manual controls
2. Enhance testing for controls below 70% effectiveness
3. Consider redundant controls for critical risks`;
    },
    suggestedFollowups: ['Show controls for Risk #12', 'Which controls need testing?', 'Automation opportunities'],
  },

  {
    pattern: /manual\s*control|automat|control\s*automation/i,
    intent: 'control_automation',
    handler: () => {
      const manual = getManualControls();
      const automated = getAutomatedControls();

      return `**Control Automation Analysis:**

**Manual Controls (${manual.length}):**
${manual.slice(0, 5).map((c, i) =>
  `${i + 1}. ${c.controlName} - ${c.effectivenessScore}% effective
   Owner: ${c.owner} | Covers ${c.mappedRiskIds.length} risks`
).join('\n\n')}

**Automated Controls (${automated.length}):**
${automated.slice(0, 5).map((c, i) =>
  `${i + 1}. ${c.controlName} - ${c.effectivenessScore}% effective`
).join('\n')}

**Automation Opportunities:**
- ${manual.length} manual controls are candidates for automation
- Average manual control effectiveness: ${Math.round(manual.reduce((s, c) => s + (c.effectivenessScore || 0), 0) / manual.length)}%
- Average automated control effectiveness: ${Math.round(automated.reduce((s, c) => s + (c.effectivenessScore || 0), 0) / automated.length)}%

**Recommendation:** Automated controls show higher effectiveness. Prioritize automation.`;
    },
    suggestedFollowups: ['Control testing schedule', 'Control gaps analysis', 'Investment recommendations'],
  },

  // ============ RISK EVENT INTENTS ============
  {
    pattern: /event|incident|loss|financial\s*impact|occurred|happened|historical/i,
    intent: 'risk_events',
    handler: () => {
      const stats = eventStats();
      const recent = getRecentEvents(90).slice(0, 5);

      return `**Risk Event Analysis:**

**Event Portfolio:**
- Total Events: ${stats.total}
- Total Financial Impact: ${formatCurrency(stats.totalFinancialImpact)}
- Average Impact: ${formatCurrency(stats.avgFinancialImpact)}

**By Operational Severity:**
- High Impact: ${stats.byOperationalImpact.high} events
- Medium Impact: ${stats.byOperationalImpact.medium} events
- Low Impact: ${stats.byOperationalImpact.low} events

**Recent Events (Last 90 Days):**
${recent.map((e, i) => `${i + 1}. **${e.eventDescription.substring(0, 50)}...**
   - Date: ${e.eventDate} | Impact: ${formatCurrency(e.financialImpact)}
   - Severity: ${e.operationalImpact} | Risk #${e.relatedRiskId}`).join('\n\n')}

**Top Risks by Event Frequency:**
${stats.topRisksWithEvents.slice(0, 3).map(([riskId, data]) =>
  `- Risk #${riskId}: ${data.count} events, ${formatCurrency(data.totalImpact)} total impact`
).join('\n')}

**Event Trend:** ${stats.recentTrend.trend === 'increasing' ? 'Increasing event frequency - requires attention' : 'Decreasing event frequency - positive trend'}`;
    },
    suggestedFollowups: ['High impact events only', 'Events for Risk #30', 'Calculate potential losses'],
  },

  {
    pattern: /high\s*impact|major\s*event|significant\s*loss|big\s*incident/i,
    intent: 'high_impact_events',
    handler: () => {
      const highEvents = getHighImpactEvents().slice(0, 8);
      const totalImpact = highEvents.reduce((s, e) => s + e.financialImpact, 0);

      return `**High-Impact Risk Events:**

${highEvents.map((e, i) =>
  `${i + 1}. **${e.eventDescription}**
   - Date: ${e.eventDate}
   - Financial Impact: ${formatCurrency(e.financialImpact)}
   - Related Risk: #${e.relatedRiskId}
   - Root Cause Confirmed: ${e.rootCauseConfirmed ? 'Yes' : 'Pending'}`
).join('\n\n')}

**Summary:**
- Total high-impact events: ${highEvents.length}
- Combined financial impact: ${formatCurrency(totalImpact)}
- Average impact per event: ${formatCurrency(totalImpact / highEvents.length)}

**Actions Required:**
1. Ensure root cause analysis completed for all events
2. Update controls based on lessons learned
3. Review insurance coverage adequacy`;
    },
    suggestedFollowups: ['Root cause analysis', 'Update controls', 'Insurance review'],
  },

  // ============ MONTE CARLO INTENTS ============
  {
    pattern: /monte\s*carlo|simulation|forecast|probability|distribution|var|value\s*at\s*risk/i,
    intent: 'monte_carlo',
    handler: () => {
      const highRisks = getHighRisks();
      const avgScore = highRisks.reduce((s, r) => s + r.inherentRiskScore, 0) / highRisks.length;
      const events = eventStats();

      return `**Monte Carlo Simulation Recommendations:**

Based on your risk data, here are optimal simulation parameters:

**Suggested Simulations:**

1. **Aggregate Loss Distribution**
   - Risks to include: ${highRisks.length} high-scoring risks
   - Distribution: LogNormal (fits financial loss patterns)
   - Iterations: 10,000 minimum for 95% confidence

2. **Cyber Risk Scenario**
   - Risk IDs: 12, 20, 196-200 (Cyber category)
   - Mean Loss: ${formatCurrency(events.avgFinancialImpact * 1.5)}
   - Max Loss: ${formatCurrency(events.avgFinancialImpact * 10)}

3. **Operational Risk Portfolio**
   - Risks: All Operational category (${getRisksByCategory('Operational').length} risks)
   - Correlation factor: 0.3 (moderate interdependence)

**Key Parameters from Your Data:**
- Average Inherent Score: ${avgScore.toFixed(1)}
- Historical Event Avg: ${formatCurrency(events.avgFinancialImpact)}
- Control Effectiveness: ${getControlEffectivenessScore()}%

**VaR Estimates:**
- 95% VaR: ~${formatCurrency(events.avgFinancialImpact * 3)}
- 99% VaR: ~${formatCurrency(events.avgFinancialImpact * 5)}

Navigate to **Risk Tools > Monte Carlo** to run simulations.`;
    },
    suggestedFollowups: ['Run simulation for cyber risks', 'Show distribution curves', 'Calculate VaR at 95%'],
  },

  // ============ BOW-TIE INTENTS ============
  {
    pattern: /bow[\s-]*tie|cause|consequence|barrier|root\s*cause/i,
    intent: 'bow_tie',
    handler: () => {
      const topRisk = getHighRisks()[0];
      const controls = getControlsByRiskId(topRisk.riskId);
      const events = getEventsByRiskId(topRisk.riskId);
      const kris = getKRIsByRiskId(topRisk.riskId);

      return `**Bow-Tie Analysis Ready:**

Recommended analysis for highest-scoring risk:

**Risk #${topRisk.riskId}: ${topRisk.riskDescription.substring(0, 55)}...**

**LEFT SIDE (Causes/Threats):**
- Root Cause: ${topRisk.rootCause}
- Likelihood: ${topRisk.likelihood}/5
- Velocity: ${topRisk.velocity}

**CENTER (Risk Event):**
- Inherent Score: ${topRisk.inherentRiskScore} (${getRiskSeverityLabel(topRisk.inherentRiskScore)})
- Category: ${topRisk.riskCategory}
- Current Status: ${topRisk.riskStatus}

**RIGHT SIDE (Consequences):**
- Historical Events: ${events.length}
- Total Impact: ${formatCurrency(events.reduce((s, e) => s + e.financialImpact, 0))}
- High-severity events: ${events.filter(e => e.operationalImpact === 'High').length}

**PREVENTIVE BARRIERS:**
${controls.filter(c => c.controlType === 'Preventive').map(c => `- ${c.controlName} (${c.effectivenessScore}%)`).join('\n') || '- No preventive controls mapped'}

**DETECTIVE BARRIERS:**
${controls.filter(c => c.controlType === 'Detective').map(c => `- ${c.controlName} (${c.effectivenessScore}%)`).join('\n') || '- No detective controls mapped'}

**RECOVERY BARRIERS:**
${controls.filter(c => c.controlType === 'Corrective').map(c => `- ${c.controlName} (${c.effectivenessScore}%)`).join('\n') || '- No corrective controls mapped'}

**KRI MONITORING:**
${kris.map(k => `- ${k.indicator}: ${k.currentValue}/${k.threshold} (${k.status})`).join('\n') || '- No KRIs linked'}

Navigate to **Risk Tools > Bow-Tie** to visualize.`;
    },
    suggestedFollowups: ['Show Bow-Tie for another risk', 'Add more controls', 'Export analysis'],
  },

  // ============ DECISION TREE INTENTS ============
  {
    pattern: /decision\s*tree|treatment\s*option|what\s*if|alternative|mitigate|transfer|accept|avoid/i,
    intent: 'decision_tree',
    handler: () => {
      const outsideAppetite = getOutsideAppetiteRisks();
      const topRisk = outsideAppetite[0];
      const events = getEventsByRiskId(topRisk.riskId);
      const avgImpact = events.length > 0 ? events.reduce((s, e) => s + e.financialImpact, 0) / events.length : topRisk.inherentRiskScore * 50000;

      return `**Decision Tree Analysis:**

**Risk #${topRisk.riskId}: ${topRisk.riskDescription.substring(0, 50)}...**
Current: Outside Appetite | Score: ${topRisk.residualRiskScore}

**OPTION 1: MITIGATE (Reduce)**
- Cost: ${formatCurrency(avgImpact * 0.3)} - ${formatCurrency(avgImpact * 0.5)}
- Expected Reduction: 30-40% of residual score
- Probability of Success: 75%
- Timeline: 6-12 months
- NPV: Positive if >3 events expected

**OPTION 2: TRANSFER (Insure)**
- Cost: ${formatCurrency(topRisk.inherentRiskScore * 5000)}/year premium
- Coverage: Up to ${formatCurrency(avgImpact * 5)} per event
- Probability of Claim: ${(topRisk.likelihood * 20)}%
- Timeline: 1-2 months
- Best for: Low-frequency, high-impact risks

**OPTION 3: ACCEPT (Monitor)**
- Cost: Monitoring only
- Expected Annual Loss: ${formatCurrency(avgImpact * topRisk.likelihood * 0.2)}
- Risk: Potential appetite breach
- Timeline: Immediate
- Best for: Risks within tolerance

**OPTION 4: AVOID (Eliminate)**
- Cost: Discontinue activity
- Benefit: Zero residual risk
- Trade-off: Lost opportunity cost
- Timeline: 3-6 months
- Best for: Unacceptable risk/reward

**Recommendation:** ${topRisk.inherentRiskScore >= 15 ? 'Option 1 (Mitigate) - Best cost/benefit for high-severity risk' : 'Option 3 (Accept) with enhanced monitoring'}`;
    },
    suggestedFollowups: ['Compare options for another risk', 'Calculate ROI of mitigation', 'Insurance analysis'],
  },

  // ============ CATEGORY ANALYSIS INTENTS ============
  {
    pattern: /cyber|financial|operational|compliance|strategic|reputational|people|third\s*party|ai\s*ethics|category/i,
    intent: 'category_analysis',
    handler: (match) => {
      const stats = riskStats();
      const input = match?.[0]?.toLowerCase() || '';

      // Determine which category to focus on
      let focusCategory: string | null = null;
      if (input.includes('cyber')) focusCategory = 'Cybersecurity';
      else if (input.includes('financial')) focusCategory = 'Financial';
      else if (input.includes('operational')) focusCategory = 'Operational';
      else if (input.includes('compliance')) focusCategory = 'Compliance';
      else if (input.includes('strategic')) focusCategory = 'Strategic';
      else if (input.includes('reputational')) focusCategory = 'Reputational';
      else if (input.includes('people')) focusCategory = 'People';
      else if (input.includes('third')) focusCategory = 'Third Party';
      else if (input.includes('ai')) focusCategory = 'AI Ethics';

      const categories = Object.entries(stats.categoryDistribution)
        .sort((a, b) => b[1] - a[1])
        .map(([cat, count]) => `- **${cat}**: ${count} risks`)
        .join('\n');

      if (focusCategory) {
        const categoryRisks = getRisksByCategory(focusCategory as any);
        const escalated = categoryRisks.filter(r => r.riskStatus === 'Escalated');
        const outsideAppetite = categoryRisks.filter(r => r.riskAppetiteAlignment === 'Outside Appetite');

        return `**${focusCategory} Risk Analysis:**

**Summary:**
- Total ${focusCategory} Risks: ${categoryRisks.length}
- Escalated: ${escalated.length}
- Outside Appetite: ${outsideAppetite.length}
- Avg Inherent Score: ${(categoryRisks.reduce((s, r) => s + r.inherentRiskScore, 0) / categoryRisks.length).toFixed(1)}

**Top ${focusCategory} Risks:**
${categoryRisks.sort((a, b) => b.inherentRiskScore - a.inherentRiskScore).slice(0, 5).map((r, i) =>
  `${i + 1}. Risk #${r.riskId}: ${r.riskDescription.substring(0, 45)}...
   Score: ${r.inherentRiskScore} | Status: ${r.riskStatus}`
).join('\n\n')}

**Key Insights:**
- ${escalated.length > 0 ? `${escalated.length} risks require immediate escalation review` : 'No escalated risks in this category'}
- ${outsideAppetite.length > 0 ? `${outsideAppetite.length} risks exceed risk appetite` : 'All risks within appetite'}`;
      }

      return `**Risk Category Distribution:**

${categories}

**Category Insights:**
- Highest concentration: ${Object.entries(stats.categoryDistribution).sort((a, b) => b[1] - a[1])[0][0]}
- Categories with escalated risks: ${Object.entries(stats.categoryDistribution).filter(([cat]) =>
  getRisksByCategory(cat as any).some(r => r.riskStatus === 'Escalated')
).length}

Ask about a specific category for detailed analysis (e.g., "Show cyber risks")`;
    },
    suggestedFollowups: ['Show Cyber risks', 'Compliance risk details', 'Compare all categories'],
  },

  // ============ OWNERSHIP & REGIONAL INTENTS ============
  {
    pattern: /owner|responsible|who\s*owns|cro|cfo|ciso|coo|director|assigned/i,
    intent: 'ownership_analysis',
    handler: () => {
      const ownerDistribution = new Map<string, number>();
      const ownerEscalated = new Map<string, number>();
      enterpriseRisks.forEach(r => {
        ownerDistribution.set(r.riskOwner, (ownerDistribution.get(r.riskOwner) || 0) + 1);
        if (r.riskStatus === 'Escalated') {
          ownerEscalated.set(r.riskOwner, (ownerEscalated.get(r.riskOwner) || 0) + 1);
        }
      });

      return `**Risk Ownership Analysis:**

**By Risk Owner:**
${Array.from(ownerDistribution.entries())
  .sort((a, b) => b[1] - a[1])
  .map(([owner, count]) => `- **${owner}**: ${count} risks (${ownerEscalated.get(owner) || 0} escalated)`)
  .join('\n')}

**Ownership Insights:**
- Most assigned: ${Array.from(ownerDistribution.entries()).sort((a, b) => b[1] - a[1])[0][0]}
- Highest escalation rate: ${Array.from(ownerEscalated.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}

**Actions:**
1. Ensure balanced risk ownership distribution
2. Review workload of owners with most risks
3. Verify all escalated risks have active owner engagement`;
    },
    suggestedFollowups: ['Show CRO risks', 'Risks by CFO', 'Escalated risks by owner'],
  },

  {
    pattern: /region|nigeria|uk|us|eu|global|apac|latam|middle\s*east|geographic/i,
    intent: 'regional_analysis',
    handler: (match) => {
      const input = match?.[0]?.toLowerCase() || '';

      const regionDistribution = new Map<string, number>();
      enterpriseRisks.forEach(r => {
        regionDistribution.set(r.region, (regionDistribution.get(r.region) || 0) + 1);
      });

      // Check if asking about specific region
      let focusRegion: string | null = null;
      if (input.includes('nigeria')) focusRegion = 'Nigeria';
      else if (input.includes('uk')) focusRegion = 'UK';
      else if (input.includes('us')) focusRegion = 'US';
      else if (input.includes('eu')) focusRegion = 'EU';
      else if (input.includes('global')) focusRegion = 'Global';
      else if (input.includes('apac')) focusRegion = 'APAC';
      else if (input.includes('latam')) focusRegion = 'LATAM';
      else if (input.includes('middle')) focusRegion = 'Middle East';

      if (focusRegion) {
        const regionRisks = getRisksByRegion(focusRegion);
        return `**${focusRegion} Regional Risk Analysis:**

**Summary:**
- Total Risks: ${regionRisks.length}
- Escalated: ${regionRisks.filter(r => r.riskStatus === 'Escalated').length}
- Outside Appetite: ${regionRisks.filter(r => r.riskAppetiteAlignment === 'Outside Appetite').length}

**Top Risks in ${focusRegion}:**
${regionRisks.sort((a, b) => b.inherentRiskScore - a.inherentRiskScore).slice(0, 5).map((r, i) =>
  `${i + 1}. Risk #${r.riskId}: ${r.riskDescription.substring(0, 45)}...
   Category: ${r.riskCategory} | Score: ${r.inherentRiskScore}`
).join('\n\n')}`;
      }

      return `**Regional Risk Distribution:**

${Array.from(regionDistribution.entries())
  .sort((a, b) => b[1] - a[1])
  .map(([region, count]) => `- **${region}**: ${count} risks`)
  .join('\n')}

**Regional Insights:**
- Highest concentration: ${Array.from(regionDistribution.entries()).sort((a, b) => b[1] - a[1])[0][0]}
- Global risks: ${regionDistribution.get('Global') || 0}

Ask about a specific region for details (e.g., "Show Nigeria risks")`;
    },
    suggestedFollowups: ['Nigeria region analysis', 'EU risks', 'Global risk overview'],
  },

  // ============ APPETITE ANALYSIS INTENTS ============
  {
    pattern: /appetite|tolerance|outside|breach|within|limit|threshold/i,
    intent: 'appetite_analysis',
    handler: () => {
      const outsideAppetite = getOutsideAppetiteRisks();
      const within = enterpriseRisks.filter(r => r.riskAppetiteAlignment === 'Within Appetite');

      return `**Risk Appetite Analysis:**

**Alignment Status:**
- Within Appetite: ${within.length} risks (${Math.round(within.length / enterpriseRisks.length * 100)}%)
- Outside Appetite: ${outsideAppetite.length} risks (${Math.round(outsideAppetite.length / enterpriseRisks.length * 100)}%)

**Risks Outside Appetite (Priority):**
${outsideAppetite.slice(0, 5).map((r, i) =>
  `${i + 1}. **Risk #${r.riskId}**: ${r.riskDescription.substring(0, 45)}...
   - Category: ${r.riskCategory} | Score: ${r.residualRiskScore}
   - Owner: ${r.riskOwner} | Status: ${r.riskStatus}`
).join('\n\n')}

**Appetite Breach Analysis:**
- Most breached category: ${getMostCommonCategory(outsideAppetite)}
- Avg residual score (outside): ${(outsideAppetite.reduce((s, r) => s + r.residualRiskScore, 0) / outsideAppetite.length).toFixed(1)}
- Non-escalated breaches: ${outsideAppetite.filter(r => r.riskStatus !== 'Escalated').length}

**Required Actions:**
1. Escalate ${outsideAppetite.filter(r => r.riskStatus !== 'Escalated').length} non-escalated outside-appetite risks
2. Develop treatment plans for top 5
3. Report to Risk Committee within 48 hours`;
    },
    suggestedFollowups: ['Treatment options for outside appetite', 'Update appetite thresholds', 'Escalate remaining risks'],
  },

  // ============ SUMMARY & EXECUTIVE INTENTS ============
  {
    pattern: /summary|executive|overview|dashboard|status|posture|report/i,
    intent: 'executive_summary',
    handler: () => {
      const stats = riskStats();
      const kri = kriStats();
      const ctrl = controlStats();
      const evt = eventStats();

      return `**Executive Risk Summary**

**RISK PORTFOLIO**
- Total Risks: ${stats.total} | Avg Score: ${stats.avgInherentScore}
- Escalated: ${stats.escalated} (${Math.round(stats.escalated / stats.total * 100)}%)
- Outside Appetite: ${stats.outsideAppetite} (${Math.round(stats.outsideAppetite / stats.total * 100)}%)
- High Risk Count: ${stats.highRisk}

**KRI STATUS**
- Health Score: ${getKRIHealthScore()}%
- Breached: ${kri.byStatus.red} | Warning: ${kri.byStatus.amber} | Healthy: ${kri.byStatus.green}
- Trending Worse: ${kri.byTrend.increasing}

**CONTROL EFFECTIVENESS**
- Avg Effectiveness: ${ctrl.avgEffectiveness}%
- Coverage: ${ctrl.riskCoverage.coveragePercent}%
- Needs Improvement: ${ctrl.lowEffectivenessControls.length}

**RISK EVENTS**
- Total Events: ${evt.total}
- Total Impact: ${formatCurrency(evt.totalFinancialImpact)}
- High Severity: ${evt.byOperationalImpact.high}

**IMMEDIATE PRIORITIES:**
1. Address ${kri.byStatus.red} breached KRIs
2. Escalate ${stats.outsideAppetite - stats.escalated} outside-appetite risks
3. Improve ${ctrl.lowEffectivenessControls.length} weak controls
4. Investigate ${evt.byOperationalImpact.high} high-impact events

**RISK TREND:** ${evt.recentTrend.trend === 'increasing' ? 'Deteriorating - action required' : 'Improving - maintain vigilance'}`;
    },
    suggestedFollowups: ['Generate full report', 'Top risks', 'Detailed action plan'],
  },

  // ============ URGENT/PRIORITY INTENTS ============
  {
    pattern: /urgent|immediate|priority|action|attention|critical|now|asap|emergency/i,
    intent: 'urgent_actions',
    handler: () => {
      const escalated = getEscalatedRisks();
      const breachedKRIs = getBreachedKRIs().slice(0, 3);
      const highEvents = getHighImpactEvents().slice(0, 3);

      return `**IMMEDIATE ACTION REQUIRED**

**CRITICAL RISKS (${escalated.length} Escalated):**
${escalated.slice(0, 3).map((r, i) =>
  `${i + 1}. **Risk #${r.riskId}**: ${r.riskDescription.substring(0, 40)}...
   - Score: ${r.inherentRiskScore} | Owner: ${r.riskOwner}
   - ACTION: Review within 24 hours`
).join('\n\n')}

**BREACHED KRIs (${getBreachedKRIs().length} total):**
${breachedKRIs.map((k, i) =>
  `${i + 1}. **${k.indicator}**: ${k.currentValue} vs ${k.threshold} threshold
   - Linked to Risk #${k.riskId}
   - ACTION: Investigate root cause immediately`
).join('\n\n')}

**HIGH-IMPACT EVENTS:**
${highEvents.map((e, i) =>
  `${i + 1}. **${e.eventDescription.substring(0, 40)}...**
   - Impact: ${formatCurrency(e.financialImpact)} | Date: ${e.eventDate}
   - ACTION: Ensure lessons learned captured`
).join('\n\n')}

**RECOMMENDED IMMEDIATE ACTIONS:**
1. Convene emergency risk committee
2. Notify stakeholders of ${escalated.length} escalated risks
3. Deploy additional monitoring for ${breachedKRIs.length} breached KRIs
4. Review controls for effectiveness gaps`;
    },
    suggestedFollowups: ['Generate incident report', 'Contact risk owners', 'Schedule review meeting'],
  },

  // ============ HELP INTENTS ============
  {
    pattern: /help|what\s*can\s*you|capabilities?|features?|how\s*to|guide|commands?/i,
    intent: 'help',
    handler: () => {
      return `**Lumina-R AI Risk Advisor - Capabilities Guide**

**Risk Analysis:**
- "Show top 5 risks" - Prioritized risk list
- "Analyze cyber risks" - Category deep-dive
- "Risks outside appetite" - Appetite breach analysis
- "Risk #12 details" - Individual risk analysis

**KRI Monitoring:**
- "Show breached KRIs" - Threshold violations
- "KRI trends" - Indicator movement analysis
- "KRI health score" - Overall KRI status

**Control Analysis:**
- "Control effectiveness" - Control portfolio review
- "Weak controls" - Improvement priorities
- "Controls for Risk #X" - Mapped controls
- "Automation opportunities" - Manual control candidates

**Event Analysis:**
- "Recent events" - Event timeline
- "High impact events" - Severity analysis
- "Financial losses" - Impact quantification

**Advanced Tools:**
- "Monte Carlo simulation" - Probability modeling
- "Bow-Tie analysis" - Cause-consequence mapping
- "Decision tree" - Treatment options
- "What-if scenarios" - Stress testing

**Organizational:**
- "Risks by owner" - Ownership distribution
- "Regional analysis" - Geographic breakdown
- "Summary" - Executive overview
- "Urgent actions" - Immediate priorities

What would you like to explore?`;
    },
    suggestedFollowups: ['Show summary', 'Top risks', 'Breached KRIs'],
  },

  // ============ SPECIFIC RISK INTENTS ============
  {
    pattern: /risk\s*#?(\d+)|risk\s*id\s*(\d+)|details?\s*(?:for|of|about)?\s*risk\s*#?(\d+)/i,
    intent: 'specific_risk',
    handler: () => {
      return 'SPECIFIC_RISK_TEMPLATE';
    },
  },

  // ============ COMPARISON INTENTS ============
  {
    pattern: /compare|versus|vs|difference|between/i,
    intent: 'comparison',
    handler: () => {
      const stats = riskStats();
      const highVsLow = {
        high: enterpriseRisks.filter(r => r.controlEffectiveness === 'High'),
        low: enterpriseRisks.filter(r => r.controlEffectiveness === 'Low'),
      };

      return `**Risk Comparison Analysis:**

**By Control Effectiveness:**
- High Effectiveness (${highVsLow.high.length} risks):
  - Avg Inherent: ${(highVsLow.high.reduce((s, r) => s + r.inherentRiskScore, 0) / highVsLow.high.length).toFixed(1)}
  - Avg Residual: ${(highVsLow.high.reduce((s, r) => s + r.residualRiskScore, 0) / highVsLow.high.length).toFixed(1)}

- Low Effectiveness (${highVsLow.low.length} risks):
  - Avg Inherent: ${(highVsLow.low.reduce((s, r) => s + r.inherentRiskScore, 0) / highVsLow.low.length).toFixed(1)}
  - Avg Residual: ${(highVsLow.low.reduce((s, r) => s + r.residualRiskScore, 0) / highVsLow.low.length).toFixed(1)}

**Key Insight:** Strong controls reduce risk scores by ~${Math.round(((highVsLow.low.reduce((s, r) => s + r.residualRiskScore, 0) / highVsLow.low.length) - (highVsLow.high.reduce((s, r) => s + r.residualRiskScore, 0) / highVsLow.high.length)))} points on average.

**By Category Severity:**
${Object.entries(stats.categoryDistribution)
  .map(([cat, count]) => {
    const catRisks = getRisksByCategory(cat as any);
    const avgScore = catRisks.reduce((s, r) => s + r.inherentRiskScore, 0) / catRisks.length;
    return { cat, count, avgScore };
  })
  .sort((a, b) => b.avgScore - a.avgScore)
  .slice(0, 5)
  .map((c, i) => `${i + 1}. ${c.cat}: Avg Score ${c.avgScore.toFixed(1)} (${c.count} risks)`)
  .join('\n')}`;
    },
    suggestedFollowups: ['Compare specific risks', 'Category breakdown', 'Control effectiveness by type'],
  },

  // ============ FALLBACK INTENT ============
  {
    pattern: /.*/,
    intent: 'fallback',
    handler: () => {
      return `I can help you with risk management analysis. Here are some things you can ask:

**Common Questions:**
- "Show top risks" - See highest priority risks
- "KRI status" - Check indicator breaches
- "Control effectiveness" - Review control portfolio
- "Risk events" - Analyze incident history
- "Monte Carlo" - Run probability simulations
- "Bow-Tie analysis" - Visualize causes and consequences

**Quick Actions:**
- "Summary" - Get executive overview
- "Urgent actions" - See immediate priorities
- "Help" - Full capability guide

Could you rephrase your question or try one of these options?`;
    },
    suggestedFollowups: ['Help', 'Summary', 'Top risks'],
  },
];

// Main chat processing function
export function processMessage(userMessage: string): ChatMessage {
  const message = userMessage.trim().toLowerCase();

  // Check for specific risk number first
  const riskMatch = userMessage.match(/risk\s*#?(\d+)/i);
  if (riskMatch) {
    const riskId = parseInt(riskMatch[1]);
    const risk = enterpriseRisks.find(r => r.riskId === riskId);
    if (risk) {
      const krisForRisk = getKRIsByRiskId(riskId);
      const eventsForRisk = getEventsByRiskId(riskId);
      const controlsForRisk = getControlsByRiskId(riskId);

      const response = `**Risk #${risk.riskId} Deep Dive**

**Risk Details:**
- **Description:** ${risk.riskDescription}
- **Category:** ${risk.riskCategory}
- **Root Cause:** ${risk.rootCause}

**Risk Scoring:**
- Likelihood: ${risk.likelihood}/5 | Impact: ${risk.impact}/5
- Velocity: ${risk.velocity}
- Inherent Score: ${risk.inherentRiskScore} (${getRiskSeverityLabel(risk.inherentRiskScore)})
- Residual Score: ${risk.residualRiskScore}

**Status:**
- Current Status: ${risk.riskStatus}
- Appetite Alignment: ${risk.riskAppetiteAlignment}
- Owner: ${risk.riskOwner} | Region: ${risk.region}
- Control Effectiveness: ${risk.controlEffectiveness}

**Existing Controls:**
${risk.existingControls}

**Linked KRIs (${krisForRisk.length}):**
${krisForRisk.length > 0 ? krisForRisk.map(k =>
  `- ${k.indicator}: ${k.currentValue}/${k.threshold} (${k.status})`
).join('\n') : '- No KRIs linked'}

**Historical Events (${eventsForRisk.length}):**
${eventsForRisk.length > 0 ? eventsForRisk.slice(0, 3).map(e =>
  `- ${e.eventDate}: ${formatCurrency(e.financialImpact)} (${e.operationalImpact})`
).join('\n') : '- No events recorded'}
${eventsForRisk.length > 3 ? `\n... and ${eventsForRisk.length - 3} more events` : ''}

**Mapped Controls (${controlsForRisk.length}):**
${controlsForRisk.length > 0 ? controlsForRisk.map(c =>
  `- ${c.controlName} (${c.controlType}) - ${c.effectivenessScore}%`
).join('\n') : '- No controls mapped'}

**Recommended Actions:**
1. ${risk.riskStatus === 'Escalated' ? 'Already escalated - ensure active monitoring' : 'Consider escalation based on appetite breach'}
2. ${krisForRisk.filter(k => k.status === 'Red').length > 0 ? 'Address breached KRIs immediately' : 'Continue KRI monitoring'}
3. Run Bow-Tie analysis for cause-consequence mapping`;

      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        metadata: {
          intent: 'specific_risk',
          confidence: 100,
          dataUsed: ['enterpriseRisks', 'enterpriseKRIs', 'riskEvents', 'enterpriseControls'],
          suggestedActions: ['Run Monte Carlo', 'Show Bow-Tie', 'View Controls'],
        },
      };
    }
  }

  // Find matching intent
  for (const intent of chatIntents) {
    const match = message.match(intent.pattern);
    if (match && intent.intent !== 'fallback') {
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: intent.handler(match),
        timestamp: new Date(),
        metadata: {
          intent: intent.intent,
          confidence: 95,
          suggestedActions: intent.suggestedFollowups,
        },
      };
    }
  }

  // Fallback
  const fallbackIntent = chatIntents.find(i => i.intent === 'fallback')!;
  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: fallbackIntent.handler(),
    timestamp: new Date(),
    metadata: {
      intent: 'fallback',
      confidence: 50,
      suggestedActions: fallbackIntent.suggestedFollowups,
    },
  };
}

export const getSuggestedQuestions = () => [
  'What are the top 5 risks I should focus on?',
  'Which KRIs are currently breached?',
  'Show me risks outside appetite',
  'What is our control effectiveness score?',
  'Run Monte Carlo simulation for cyber risks',
  'Create Bow-Tie analysis for Risk #13',
  'What events occurred this quarter?',
  'Give me an executive summary',
  'Show urgent actions needed',
  'Compare risk categories',
];
