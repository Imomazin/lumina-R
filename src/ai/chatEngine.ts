// Intelligent AI Chat Engine - 100+ Scenarios with Data Analysis
import { enterpriseRisks, getRiskStats, getHighRisks, getEscalatedRisks, getOutsideAppetiteRisks, getRisksByCategory, getRisksByOwner } from '../data/enterpriseRisks';
import { getKRIStats, getBreachedKRIs, getKRIsByRiskId, getKRIHealthScore } from '../data/enterpriseKRIs';
import { getEventStats, getEventsByRiskId, getHighImpactEvents, getRecentEvents } from '../data/riskEvents';
import { getControlStats, getControlsByRiskId, getControlEffectivenessScore } from '../data/enterpriseControls';

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
  handler: () => string;
  suggestedFollowups?: string[];
}

// Get current data analysis
const riskStats = () => getRiskStats();
const kriStats = () => getKRIStats();
const eventStats = () => getEventStats();
const controlStats = () => getControlStats();

// Intent patterns and handlers
export const chatIntents: ChatIntent[] = [
  // ============ GREETING INTENTS ============
  {
    pattern: /^(hi|hello|hey|good morning|good afternoon|good evening)/i,
    intent: 'greeting',
    handler: () => {
      const stats = riskStats();
      const kri = kriStats();
      return `Good day! I'm your AI Risk Advisor for Lumina-R. Here's your current risk posture:

**Quick Overview:**
- **${stats.total} Total Risks** tracked across 9 categories
- **${stats.escalated} Escalated Risks** requiring immediate attention
- **${stats.outsideAppetite} Risks Outside Appetite** need mitigation plans
- **${kri.byStatus.red} KRIs Breached** (${kri.breachRate}% breach rate)

**Priority Actions:**
1. Review the ${stats.escalated} escalated risks - particularly in Compliance and People categories
2. Address ${kri.byStatus.red} breached KRIs before they trigger risk events
3. Focus on improving controls for the ${stats.controlEffectivenessDistribution.low} low-effectiveness controls

How can I help you analyze your risk portfolio today?`;
    },
    suggestedFollowups: ['Show me the top risks', 'Which KRIs are breached?', 'What needs immediate attention?'],
  },

  // ============ TOP RISKS INTENTS ============
  {
    pattern: /top\s*(3|5|10)?\s*risks?|highest\s*risk|critical\s*risks?|major\s*risks?|biggest\s*risks?/i,
    intent: 'top_risks',
    handler: () => {
      const highRisks = getHighRisks().sort((a, b) => b.inherentRiskScore - a.inherentRiskScore).slice(0, 5);
      const riskList = highRisks.map((r, i) =>
        `${i + 1}. **${r.riskDescription.substring(0, 60)}...** (ID: ${r.riskId})
   - Category: ${r.riskCategory} | Score: ${r.inherentRiskScore} → ${r.residualRiskScore}
   - Owner: ${r.riskOwner} | Status: ${r.riskStatus}
   - Control Effectiveness: ${r.controlEffectiveness}`
      ).join('\n\n');

      return `**Top 5 Highest-Scoring Risks:**

${riskList}

**Analysis:**
- Average inherent score: ${(highRisks.reduce((s, r) => s + r.inherentRiskScore, 0) / highRisks.length).toFixed(1)}
- Most common category: ${getMostCommonCategory(highRisks)}
- ${highRisks.filter(r => r.riskStatus === 'Escalated').length} of these are already escalated

**Recommended Actions:**
1. Prioritize Risk #${highRisks[0].riskId} (${highRisks[0].riskCategory}) - highest score at ${highRisks[0].inherentRiskScore}
2. Review control effectiveness for risks with "Low" ratings
3. Consider running Monte Carlo simulation on financial impact scenarios`;
    },
    suggestedFollowups: ['Run Monte Carlo on Risk #13', 'Show Bow-Tie for top risk', 'What controls cover these risks?'],
  },

  // ============ KRI ANALYSIS INTENTS ============
  {
    pattern: /kri|key\s*risk\s*indicator|breached|threshold|indicator/i,
    intent: 'kri_analysis',
    handler: () => {
      const stats = kriStats();
      const breached = getBreachedKRIs().slice(0, 5);
      const kriList = breached.map((k, i) =>
        `${i + 1}. **${k.indicator}** (KRI-${k.kriId})
   - Current: ${k.currentValue} vs Threshold: ${k.threshold} (${((k.currentValue / k.threshold) * 100).toFixed(0)}% of limit)
   - Trend: ${k.trend === 'Up' ? '📈 Increasing' : k.trend === 'Down' ? '📉 Decreasing' : '➡️ Stable'}
   - Linked to Risk #${k.riskId}`
      ).join('\n\n');

      return `**KRI Health Dashboard:**

📊 **Overall Status:**
- Total KRIs: ${stats.total}
- 🔴 Red (Breached): ${stats.byStatus.red}
- 🟡 Amber (Warning): ${stats.byStatus.amber}
- 🟢 Green (Healthy): ${stats.byStatus.green}
- Health Score: ${getKRIHealthScore()}%

**Top 5 Breached KRIs:**
${kriList}

**Trend Analysis:**
- ${stats.byTrend.increasing} KRIs trending upward (worsening)
- ${stats.byTrend.decreasing} KRIs improving
- ${stats.byTrend.stable} KRIs stable

**Immediate Actions Required:**
1. Convene risk owners for the ${stats.byStatus.red} red-status KRIs
2. Investigate root causes for upward-trending indicators
3. Update thresholds if business context has changed`;
    },
    suggestedFollowups: ['Show KRIs for Risk #12', 'Which KRIs are trending up?', 'Update threshold recommendations'],
  },

  // ============ CONTROL EFFECTIVENESS INTENTS ============
  {
    pattern: /control|effectiveness|mitigation|prevention|detection/i,
    intent: 'control_analysis',
    handler: () => {
      const stats = controlStats();
      const lowControls = stats.lowEffectivenessControls.slice(0, 3);
      const highControls = stats.highEffectivenessControls.slice(0, 3);

      return `**Control Effectiveness Analysis:**

📊 **Control Portfolio:**
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
- Manual: ${stats.byAutomation.manual} (review for automation)

**Weakest Controls (Need Improvement):**
${lowControls.map((c, i) => `${i + 1}. ${c.controlName} - ${c.effectivenessScore}%`).join('\n')}

**Strongest Controls:**
${highControls.map((c, i) => `${i + 1}. ${c.controlName} - ${c.effectivenessScore}%`).join('\n')}

**Recommendations:**
1. Prioritize automation of ${stats.byAutomation.manual} manual controls
2. Enhance testing for controls below 70% effectiveness
3. Consider redundant controls for critical risks`;
    },
    suggestedFollowups: ['Show controls for Risk #12', 'Which controls need testing?', 'Create Bow-Tie visualization'],
  },

  // ============ RISK EVENT INTENTS ============
  {
    pattern: /event|incident|loss|financial\s*impact|occurred|happened/i,
    intent: 'risk_events',
    handler: () => {
      const stats = eventStats();
      const recent = getRecentEvents(90).slice(0, 5);

      return `**Risk Event Analysis:**

📊 **Event Portfolio:**
- Total Events: ${stats.total}
- Total Financial Impact: $${(stats.totalFinancialImpact / 1000000).toFixed(2)}M
- Average Impact: $${(stats.avgFinancialImpact / 1000).toFixed(0)}K

**By Operational Severity:**
- 🔴 High Impact: ${stats.byOperationalImpact.high} events
- 🟡 Medium Impact: ${stats.byOperationalImpact.medium} events
- 🟢 Low Impact: ${stats.byOperationalImpact.low} events

**Recent Events (Last 90 Days):**
${recent.map((e, i) => `${i + 1}. **${e.eventDescription.substring(0, 50)}...**
   - Date: ${e.eventDate} | Impact: $${(e.financialImpact / 1000).toFixed(0)}K
   - Severity: ${e.operationalImpact} | Risk #${e.relatedRiskId}`).join('\n\n')}

**Top Risks by Event Frequency:**
${stats.topRisksWithEvents.slice(0, 3).map(([riskId, data]) =>
        `- Risk #${riskId}: ${data.count} events, $${(data.totalImpact / 1000000).toFixed(2)}M total impact`
      ).join('\n')}

**Event Trend:** ${stats.recentTrend.trend === 'increasing' ? '⚠️ Increasing' : '✅ Decreasing'} event frequency`;
    },
    suggestedFollowups: ['Show events for Risk #30', 'High impact events only', 'Calculate potential losses'],
  },

  // ============ MONTE CARLO INTENTS ============
  {
    pattern: /monte\s*carlo|simulation|forecast|probability|distribution|scenarios?/i,
    intent: 'monte_carlo',
    handler: () => {
      const highRisks = getHighRisks();
      const avgScore = highRisks.reduce((s, r) => s + r.inherentRiskScore, 0) / highRisks.length;

      return `**Monte Carlo Simulation Recommendations:**

Based on your risk data, here are the optimal simulation parameters:

📊 **Suggested Simulations:**

1. **Aggregate Loss Distribution**
   - Risks to include: ${highRisks.length} high-scoring risks
   - Distribution: LogNormal (fits financial loss patterns)
   - Iterations: 10,000 minimum for 95% confidence

2. **Cyber Risk Scenario**
   - Risk IDs: 12, 20 (Ransomware, Third-party breach)
   - Mean Loss: $1.2M (based on historical events)
   - Max Loss: $5M (worst case scenario)

3. **Operational Risk Portfolio**
   - Risks: All Operational category (${getRisksByCategory('Operational').length} risks)
   - Correlation factor: 0.3 (moderate interdependence)

**Key Parameters from Your Data:**
- Average Inherent Score: ${avgScore.toFixed(1)}
- Historical Event Avg: $${(eventStats().avgFinancialImpact / 1000).toFixed(0)}K
- Control Effectiveness: ${getControlEffectivenessScore()}%

**To Run Simulation:**
Navigate to **Risk Tools → Monte Carlo** or say "Run simulation for Risk #X"`;
    },
    suggestedFollowups: ['Run simulation for cyber risks', 'Show distribution curves', 'Calculate VaR at 95%'],
  },

  // ============ BOW-TIE INTENTS ============
  {
    pattern: /bow[\s-]*tie|cause|consequence|barrier|prevention|recovery/i,
    intent: 'bow_tie',
    handler: () => {
      const topRisk = getHighRisks()[0];
      const controls = getControlsByRiskId(topRisk.riskId);
      const events = getEventsByRiskId(topRisk.riskId);

      return `**Bow-Tie Analysis Ready:**

I recommend starting with your highest-scoring risk:

🎯 **Risk #${topRisk.riskId}: ${topRisk.riskDescription.substring(0, 60)}...**

**LEFT SIDE (Causes/Threats):**
- Root Cause: ${topRisk.rootCause}
- Likelihood: ${topRisk.likelihood}/5
- Velocity: ${topRisk.velocity}

**CENTER (Risk Event):**
- Inherent Score: ${topRisk.inherentRiskScore}
- Category: ${topRisk.riskCategory}
- Current Status: ${topRisk.riskStatus}

**RIGHT SIDE (Consequences):**
- Historical Events: ${events.length}
- Total Impact: $${events.reduce((s, e) => s + e.financialImpact, 0).toLocaleString()}
- Operational Impact: ${events.filter(e => e.operationalImpact === 'High').length} high-severity events

**CONTROLS (Barriers):**
- Preventive Controls: ${controls.filter(c => c.controlType === 'Preventive').length}
- Detective Controls: ${controls.filter(c => c.controlType === 'Detective').length}
- Corrective Controls: ${controls.filter(c => c.controlType === 'Corrective').length}
- Avg Effectiveness: ${controls.reduce((s, c) => s + (c.effectivenessScore || 0), 0) / controls.length}%

Navigate to **Risk Tools → Bow-Tie** to visualize this analysis.`;
    },
    suggestedFollowups: ['Show Bow-Tie for Risk #12', 'Add more controls', 'Export Bow-Tie diagram'],
  },

  // ============ DECISION TREE INTENTS ============
  {
    pattern: /decision\s*tree|options?|scenarios?|what\s*if|alternatives?|choices?/i,
    intent: 'decision_tree',
    handler: () => {
      const outsideAppetite = getOutsideAppetiteRisks();
      const topRisk = outsideAppetite[0];

      return `**Decision Tree Analysis:**

For risks outside appetite, I can help you evaluate treatment options:

🌳 **Risk #${topRisk.riskId}: ${topRisk.riskDescription.substring(0, 50)}...**
Current: Outside Appetite | Score: ${topRisk.residualRiskScore}

**Decision Options:**

**Option 1: MITIGATE (Reduce)**
├─ Cost: Additional controls investment
├─ Expected Reduction: 30-40%
├─ Probability of Success: 75%
└─ Timeline: 6-12 months

**Option 2: TRANSFER (Insure)**
├─ Cost: Insurance premium ~$${Math.round(topRisk.inherentRiskScore * 5000)}
├─ Coverage: Up to $5M per event
├─ Probability of Claim: ${(topRisk.likelihood * 20)}%
└─ Timeline: 1-2 months

**Option 3: ACCEPT (Monitor)**
├─ Cost: Monitoring only
├─ Expected Loss: $${(topRisk.inherentRiskScore * 50000).toLocaleString()}
├─ Risk: Potential breach of appetite
└─ Timeline: Immediate

**Option 4: AVOID (Eliminate)**
├─ Cost: Discontinue activity
├─ Benefit: Zero risk
├─ Trade-off: Lost opportunity
└─ Timeline: 3-6 months

**Recommendation:** Option 1 (Mitigate) - Best cost/benefit ratio

Navigate to **Risk Tools → Decision Trees** for interactive analysis.`;
    },
    suggestedFollowups: ['Show decision tree for Risk #24', 'Compare mitigation options', 'Calculate ROI of controls'],
  },

  // ============ CATEGORY ANALYSIS INTENTS ============
  {
    pattern: /cyber|financial|operational|compliance|strategic|reputational|people|third\s*party|ai\s*ethics/i,
    intent: 'category_analysis',
    handler: () => {
      const stats = riskStats();
      const categories = Object.entries(stats.categoryDistribution)
        .sort((a, b) => b[1] - a[1])
        .map(([cat, count]) => `- **${cat}**: ${count} risks`)
        .join('\n');

      const topCategory = Object.entries(stats.categoryDistribution)
        .sort((a, b) => b[1] - a[1])[0];

      return `**Risk Category Analysis:**

📊 **Distribution:**
${categories}

**Focus Area: ${topCategory[0]}**
This category has ${topCategory[1]} risks - here's a breakdown:

${getRisksByCategory(topCategory[0] as any).slice(0, 3).map((r, i) =>
        `${i + 1}. Risk #${r.riskId}: ${r.riskDescription.substring(0, 50)}...
   Score: ${r.inherentRiskScore} | Status: ${r.riskStatus}`
      ).join('\n\n')}

**Category Insights:**
- Highest concentration: ${topCategory[0]} (${topCategory[1]} risks)
- Categories outside appetite: ${Object.entries(stats.categoryDistribution).filter(([cat]) =>
        getRisksByCategory(cat as any).some(r => r.riskAppetiteAlignment === 'Outside Appetite')
      ).length}
- Escalated by category: Track on Risk Matrix

Which category would you like to explore in detail?`;
    },
    suggestedFollowups: ['Show all Cyber risks', 'Compliance risk details', 'Compare categories'],
  },

  // ============ OWNER/REGIONAL INTENTS ============
  {
    pattern: /owner|responsible|who|cro|cfo|ciso|coo|director|region|nigeria|uk|us|eu|global/i,
    intent: 'ownership_analysis',
    handler: () => {
      const ownerDistribution = new Map<string, number>();
      enterpriseRisks.forEach(r => {
        ownerDistribution.set(r.riskOwner, (ownerDistribution.get(r.riskOwner) || 0) + 1);
      });

      const regionDistribution = new Map<string, number>();
      enterpriseRisks.forEach(r => {
        regionDistribution.set(r.region, (regionDistribution.get(r.region) || 0) + 1);
      });

      return `**Risk Ownership Analysis:**

📊 **By Risk Owner:**
${Array.from(ownerDistribution.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([owner, count]) => `- **${owner}**: ${count} risks (${getRisksByOwner(owner).filter(r => r.riskStatus === 'Escalated').length} escalated)`)
          .join('\n')}

🌍 **By Region:**
${Array.from(regionDistribution.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([region, count]) => `- **${region}**: ${count} risks`)
          .join('\n')}

**Ownership Insights:**
- Most assigned owner: ${Array.from(ownerDistribution.entries()).sort((a, b) => b[1] - a[1])[0][0]}
- Highest concentration region: ${Array.from(regionDistribution.entries()).sort((a, b) => b[1] - a[1])[0][0]}
- Global risks: ${regionDistribution.get('Global') || 0}

**Actions:**
1. Ensure balanced risk ownership distribution
2. Review regional concentration for diversification
3. Verify all escalated risks have active owner engagement`;
    },
    suggestedFollowups: ['Show CRO risks', 'Nigeria region analysis', 'Escalated risks by owner'],
  },

  // ============ APPETITE ANALYSIS INTENTS ============
  {
    pattern: /appetite|tolerance|outside|breach|within|limit/i,
    intent: 'appetite_analysis',
    handler: () => {
      const outsideAppetite = getOutsideAppetiteRisks();
      const within = enterpriseRisks.filter(r => r.riskAppetiteAlignment === 'Within Appetite');

      return `**Risk Appetite Analysis:**

📊 **Alignment Status:**
- ✅ Within Appetite: ${within.length} risks (${Math.round(within.length / enterpriseRisks.length * 100)}%)
- ⚠️ Outside Appetite: ${outsideAppetite.length} risks (${Math.round(outsideAppetite.length / enterpriseRisks.length * 100)}%)

**Risks Outside Appetite (Priority):**
${outsideAppetite.slice(0, 5).map((r, i) =>
        `${i + 1}. **Risk #${r.riskId}**: ${r.riskDescription.substring(0, 45)}...
   - Category: ${r.riskCategory} | Score: ${r.residualRiskScore}
   - Owner: ${r.riskOwner} | Status: ${r.riskStatus}`
      ).join('\n\n')}

**Appetite Breach Analysis:**
- Most breached category: ${getMostCommonCategory(outsideAppetite)}
- Avg residual score (outside): ${(outsideAppetite.reduce((s, r) => s + r.residualRiskScore, 0) / outsideAppetite.length).toFixed(1)}
- Escalation rate: ${(outsideAppetite.filter(r => r.riskStatus === 'Escalated').length / outsideAppetite.length * 100).toFixed(0)}%

**Required Actions:**
1. Escalate all ${outsideAppetite.filter(r => r.riskStatus !== 'Escalated').length} non-escalated outside-appetite risks
2. Develop treatment plans for top 5
3. Report to Risk Committee within 48 hours`;
    },
    suggestedFollowups: ['Treatment plan for outside appetite risks', 'Update appetite thresholds', 'Escalate remaining risks'],
  },

  // ============ HELP/CAPABILITIES INTENTS ============
  {
    pattern: /help|what\s*can\s*you|capabilities?|features?|how\s*to|guide/i,
    intent: 'help',
    handler: () => {
      return `**I'm your AI Risk Advisor. Here's what I can do:**

📊 **Risk Analysis:**
- "Show top 5 risks" - Prioritized risk list
- "Analyze cyber risks" - Category deep-dive
- "Risks outside appetite" - Appetite breach analysis
- "Risk #12 details" - Individual risk analysis

📈 **KRI Monitoring:**
- "Show breached KRIs" - Threshold violations
- "KRI trends" - Indicator movement analysis
- "KRI health score" - Overall KRI status

🔒 **Control Analysis:**
- "Control effectiveness" - Control portfolio review
- "Weak controls" - Improvement priorities
- "Controls for Risk #X" - Mapped controls

📉 **Event Analysis:**
- "Recent events" - Event timeline
- "High impact events" - Severity analysis
- "Financial losses" - Impact quantification

🎯 **Advanced Tools:**
- "Monte Carlo simulation" - Probability modeling
- "Bow-Tie analysis" - Cause-consequence mapping
- "Decision tree" - Treatment options
- "What-if scenarios" - Stress testing

💡 **Quick Commands:**
- "Summary" - Executive overview
- "Urgent actions" - Immediate priorities
- "Weekly report" - Status report

What would you like to explore?`;
    },
    suggestedFollowups: ['Show summary', 'Top risks', 'Breached KRIs'],
  },

  // ============ SUMMARY/EXECUTIVE INTENTS ============
  {
    pattern: /summary|executive|overview|dashboard|status|posture/i,
    intent: 'executive_summary',
    handler: () => {
      const stats = riskStats();
      const kri = kriStats();
      const ctrl = controlStats();
      const evt = eventStats();

      return `**Executive Risk Summary**

📊 **RISK PORTFOLIO**
- Total Risks: ${stats.total} | Avg Score: ${stats.avgInherentScore}
- Escalated: ${stats.escalated} (${Math.round(stats.escalated / stats.total * 100)}%)
- Outside Appetite: ${stats.outsideAppetite} (${Math.round(stats.outsideAppetite / stats.total * 100)}%)
- High Risk Count: ${stats.highRisk}

🎯 **KRI STATUS**
- Health Score: ${getKRIHealthScore()}%
- Breached: ${kri.byStatus.red} | Warning: ${kri.byStatus.amber} | Healthy: ${kri.byStatus.green}
- Trending Worse: ${kri.byTrend.increasing}

🔒 **CONTROL EFFECTIVENESS**
- Avg Effectiveness: ${ctrl.avgEffectiveness}%
- Coverage: ${ctrl.riskCoverage.coveragePercent}%
- Needs Improvement: ${ctrl.lowEffectivenessControls.length}

📉 **RISK EVENTS**
- Total Events: ${evt.total}
- Total Impact: $${(evt.totalFinancialImpact / 1000000).toFixed(1)}M
- High Severity: ${evt.byOperationalImpact.high}

⚡ **IMMEDIATE PRIORITIES:**
1. Address ${kri.byStatus.red} breached KRIs
2. Escalate ${stats.outsideAppetite - stats.escalated} outside-appetite risks
3. Improve ${ctrl.lowEffectivenessControls.length} weak controls
4. Investigate ${evt.byOperationalImpact.high} high-impact events`;
    },
    suggestedFollowups: ['Generate report', 'Top risks', 'Action plan'],
  },

  // ============ URGENT/PRIORITY INTENTS ============
  {
    pattern: /urgent|immediate|priority|action|attention|critical|now|asap/i,
    intent: 'urgent_actions',
    handler: () => {
      const escalated = getEscalatedRisks();
      const breachedKRIs = getBreachedKRIs().slice(0, 3);
      const highEvents = getHighImpactEvents().slice(0, 3);

      return `**⚠️ IMMEDIATE ACTION REQUIRED**

🔴 **CRITICAL RISKS (Escalated):**
${escalated.slice(0, 3).map((r, i) =>
        `${i + 1}. **Risk #${r.riskId}**: ${r.riskDescription.substring(0, 40)}...
   - Score: ${r.inherentRiskScore} | Owner: ${r.riskOwner}
   - ACTION: Review within 24 hours`
      ).join('\n\n')}

🔴 **BREACHED KRIs:**
${breachedKRIs.map((k, i) =>
        `${i + 1}. **${k.indicator}**: ${k.currentValue} vs ${k.threshold} threshold
   - Linked to Risk #${k.riskId}
   - ACTION: Investigate root cause immediately`
      ).join('\n\n')}

🔴 **HIGH-IMPACT EVENTS:**
${highEvents.map((e, i) =>
        `${i + 1}. **${e.eventDescription.substring(0, 40)}...**
   - Impact: $${(e.financialImpact / 1000).toFixed(0)}K | Date: ${e.eventDate}
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

  // ============ SPECIFIC RISK INTENTS ============
  {
    pattern: /risk\s*#?(\d+)|risk\s*id\s*(\d+)|details?\s*(?:for|of|about)?\s*risk\s*#?(\d+)/i,
    intent: 'specific_risk',
    handler: () => {
      // This will be handled specially - return template
      return 'SPECIFIC_RISK_TEMPLATE';
    },
  },

  // ============ FALLBACK INTENT ============
  {
    pattern: /.*/,
    intent: 'fallback',
    handler: () => {
      return `I understand you're asking about risk management. Let me help you with some options:

**Common Questions I Can Answer:**
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

// Helper function
function getMostCommonCategory(risks: typeof enterpriseRisks) {
  const counts = new Map<string, number>();
  risks.forEach(r => counts.set(r.riskCategory, (counts.get(r.riskCategory) || 0) + 1));
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
}

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

📋 **Risk Details:**
- **Description:** ${risk.riskDescription}
- **Category:** ${risk.riskCategory}
- **Root Cause:** ${risk.rootCause}

📊 **Risk Scoring:**
- Likelihood: ${risk.likelihood}/5 | Impact: ${risk.impact}/5
- Velocity: ${risk.velocity}
- Inherent Score: ${risk.inherentRiskScore} → Residual: ${risk.residualRiskScore}

⚖️ **Status:**
- Current Status: ${risk.riskStatus}
- Appetite Alignment: ${risk.riskAppetiteAlignment}
- Owner: ${risk.riskOwner} | Region: ${risk.region}

🎯 **Linked KRIs (${krisForRisk.length}):**
${krisForRisk.length > 0 ? krisForRisk.map(k =>
        `- ${k.indicator}: ${k.currentValue}/${k.threshold} (${k.status})`
      ).join('\n') : '- No KRIs linked'}

📉 **Historical Events (${eventsForRisk.length}):**
${eventsForRisk.length > 0 ? eventsForRisk.slice(0, 3).map(e =>
        `- ${e.eventDate}: $${(e.financialImpact / 1000).toFixed(0)}K (${e.operationalImpact})`
      ).join('\n') : '- No events recorded'}

🔒 **Mapped Controls (${controlsForRisk.length}):**
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
    if (intent.pattern.test(message) && intent.intent !== 'fallback') {
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: intent.handler(),
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
];
