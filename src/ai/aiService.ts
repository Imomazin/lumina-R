// ============================================================================
// LUMINA-R AI SERVICE - GPT-4o Risk Intelligence Engine
// Optimized Intelligence Mode: Tiered Data Injection (50% Token Reduction)
// Five-Layer Reasoning System with Comprehensive Data Grounding
// ============================================================================

import OpenAI from 'openai';
import {
  enterpriseRisks,
  getRiskStats,
  getEscalatedRisks,
  getOutsideAppetiteRisks
} from '../data/enterpriseRisks';
import {
  getKRIStats,
  getKRIHealthScore,
  getBreachedKRIs,
  getKRIsWithTrend
} from '../data/enterpriseKRIs';
import {
  enterpriseControls,
  getControlStats
} from '../data/enterpriseControls';
import {
  riskAppetite,
  getBreachedAppetites,
  getApproachingAppetites,
  getAppetiteStatusCounts
} from '../data/appetite';
import {
  getEventStats,
  getHighImpactEvents
} from '../data/riskEvents';

// ============================================================================
// API KEY MANAGEMENT
// ============================================================================

let apiKey: string | null = null;
let openaiClient: OpenAI | null = null;

export function setApiKey(key: string) {
  apiKey = key;
  openaiClient = new OpenAI({
    apiKey: key,
    dangerouslyAllowBrowser: true
  });
  localStorage.setItem('lumina_r_openai_key', key);
}

export function getApiKey(): string | null {
  if (apiKey) return apiKey;
  const stored = localStorage.getItem('lumina_r_openai_key');
  if (stored) {
    apiKey = stored;
    openaiClient = new OpenAI({
      apiKey: stored,
      dangerouslyAllowBrowser: true
    });
    return stored;
  }
  return null;
}

export function clearApiKey() {
  apiKey = null;
  openaiClient = null;
  localStorage.removeItem('lumina_r_openai_key');
}

export function isAIConfigured(): boolean {
  return !!getApiKey();
}

// ============================================================================
// QUANTITATIVE ENGINE - EMV Calculations
// ============================================================================

function calculateEMV(risk: typeof enterpriseRisks[0]) {
  const likelihoodMap: Record<number, number> = {
    1: 0.05, 2: 0.15, 3: 0.35, 4: 0.55, 5: 0.80
  };
  const impactMap: Record<number, number> = {
    1: 100000, 2: 500000, 3: 1500000, 4: 5000000, 5: 15000000
  };
  const controlFactorMap: Record<string, number> = {
    High: 0.70, Medium: 0.45, Low: 0.20
  };

  const probability = likelihoodMap[risk.likelihood] || 0;
  const financialImpact = impactMap[risk.impact] || 0;
  const inherentEMV = probability * financialImpact;
  const controlFactor = controlFactorMap[risk.controlEffectiveness] || 0.45;
  const residualEMV = inherentEMV * (1 - controlFactor);

  return { probability, financialImpact, inherentEMV, residualEMV, controlFactor };
}

// ============================================================================
// DEEP-DIVE TRIGGER DETECTION
// ============================================================================

const DEEP_DIVE_TRIGGERS = [
  'full portfolio analysis',
  'full portfolio',
  'all risks',
  'all 200 risks',
  'deep dive',
  'deep-dive',
  'complete dataset',
  'complete data',
  'entire portfolio',
  'every risk',
  'full risk register',
  'comprehensive analysis',
  'show me everything',
  'full analysis'
];

function isDeepDiveQuery(userMessage: string): boolean {
  const lower = userMessage.toLowerCase();
  return DEEP_DIVE_TRIGGERS.some(trigger => lower.includes(trigger));
}

// ============================================================================
// TIER 1 — LIGHTWEIGHT SNAPSHOT (Default)
// Portfolio totals, category aggregates, escalated/outside-appetite only,
// breached KRIs only, control summary stats, appetite summary
// ============================================================================

function buildLightSnapshot(): string {
  const riskStats = getRiskStats();
  const kriStats = getKRIStats();
  const controlStats = getControlStats();
  const appetiteStatus = getAppetiteStatusCounts();
  const breachedAppetites = getBreachedAppetites();
  const approachingAppetites = getApproachingAppetites();
  const escalated = getEscalatedRisks();
  const outsideAppetite = getOutsideAppetiteRisks();
  const eventStats = getEventStats();
  const kriHealth = getKRIHealthScore();
  const breachedKRIList = getBreachedKRIs();

  // Portfolio-level EMV (computed from all risks, but only totals injected)
  const allEMVs = enterpriseRisks.map(r => calculateEMV(r));
  const totalInherentEMV = allEMVs.reduce((s, e) => s + Math.round(e.inherentEMV), 0);
  const totalResidualEMV = allEMVs.reduce((s, e) => s + Math.round(e.residualEMV), 0);
  const emvReduction = totalInherentEMV - totalResidualEMV;

  // Category aggregates
  const categories = ['Financial', 'Operational', 'Strategic', 'Compliance', 'Third Party', 'Reputational', 'AI Ethics', 'People', 'Cybersecurity'];
  const categoryBreakdown = categories.map(cat => {
    const risks = enterpriseRisks.filter(r => r.riskCategory === cat);
    const emvs = risks.map(r => calculateEMV(r));
    const totalResEMV = emvs.reduce((s, e) => s + Math.round(e.residualEMV), 0);
    return {
      category: cat,
      count: risks.length,
      totalResEMV,
      avgResEMV: risks.length ? Math.round(totalResEMV / risks.length) : 0,
      outsideAppetite: risks.filter(r => r.riskAppetiteAlignment === 'Outside Appetite').length,
      escalated: risks.filter(r => r.riskStatus === 'Escalated').length
    };
  });

  // Breached KRI summary
  const breachedKRISummary = breachedKRIList.slice(0, 30).map(k => ({
    kriId: k.kriId,
    riskId: k.riskId,
    indicator: k.indicator,
    current: k.currentValue,
    threshold: k.threshold,
    breachPct: Math.round(((k.currentValue - k.threshold) / k.threshold) * 100),
    trend: k.trend
  }));

  // Appetite summary
  const appetiteDetails = riskAppetite.map(a => ({
    category: a.category,
    currentLevel: a.currentLevel,
    toleranceMax: a.toleranceMax,
    status: a.status,
    headroom: a.toleranceMax - a.currentLevel,
    breachAmount: a.currentLevel > a.toleranceMax ? a.currentLevel - a.toleranceMax : 0
  }));

  return `
═══════════════════════════════════════════════════════
LUMINA-R RISK DATA — TIER 1 (OPTIMIZED SNAPSHOT)
═══════════════════════════════════════════════════════

PORTFOLIO SUMMARY:
Total Risks: ${riskStats.total}
Escalated: ${riskStats.escalated} | Outside Appetite: ${riskStats.outsideAppetite}
High-Inherent (score>=15): ${riskStats.highRisk}
Avg Inherent Score: ${riskStats.avgInherentScore} | Avg Residual: ${riskStats.avgResidualScore}
Control Effectiveness: Low=${riskStats.controlEffectivenessDistribution.low}, Med=${riskStats.controlEffectivenessDistribution.medium}, High=${riskStats.controlEffectivenessDistribution.high}

PORTFOLIO EMV (£ GBP):
Total Inherent EMV: £${totalInherentEMV.toLocaleString()}
Total Residual EMV: £${totalResidualEMV.toLocaleString()}
Controls EMV Reduction: £${emvReduction.toLocaleString()} (${Math.round((emvReduction / totalInherentEMV) * 100)}%)

CATEGORY BREAKDOWN:
${JSON.stringify(categoryBreakdown, null, 1)}

ESCALATED RISKS (${escalated.length}):
${escalated.map(r => {
  const emv = calculateEMV(r);
  return `Risk#${r.riskId} [${r.riskCategory}] "${r.riskDescription.substring(0, 60)}" L=${r.likelihood} I=${r.impact} ResEMV=£${Math.round(emv.residualEMV).toLocaleString()} Ctrl=${r.controlEffectiveness} Owner=${r.riskOwner}`;
}).join('\n')}

OUTSIDE APPETITE RISKS (${outsideAppetite.length}):
${outsideAppetite.map(r => {
  const emv = calculateEMV(r);
  return `Risk#${r.riskId} [${r.riskCategory}] "${r.riskDescription.substring(0, 60)}" ResEMV=£${Math.round(emv.residualEMV).toLocaleString()} Score=${r.residualRiskScore} Owner=${r.riskOwner}`;
}).join('\n')}

KRI INTELLIGENCE:
Total: ${kriStats.total} | Red: ${kriStats.byStatus.red} | Amber: ${kriStats.byStatus.amber} | Green: ${kriStats.byStatus.green}
Health Score: ${kriHealth}% | Breach Rate: ${kriStats.breachRate}%
Trends: Worsening=${kriStats.byTrend.increasing}, Improving=${kriStats.byTrend.decreasing}, Stable=${kriStats.byTrend.stable}

BREACHED KRIs (Red):
${JSON.stringify(breachedKRISummary, null, 1)}

CONTROL FRAMEWORK:
Total: ${controlStats.total} | Avg Effectiveness: ${controlStats.avgEffectiveness}%
By Type: Preventive=${controlStats.byType.preventive}, Detective=${controlStats.byType.detective}, Corrective=${controlStats.byType.corrective}
By Automation: Auto=${controlStats.byAutomation.automated}, Semi=${controlStats.byAutomation.semiAutomated}, Manual=${controlStats.byAutomation.manual}
Coverage: ${controlStats.riskCoverage.coveragePercent}% (${controlStats.riskCoverage.risksWithControls}/${controlStats.riskCoverage.totalRisks})

RISK APPETITE:
Within: ${appetiteStatus.within} | Approaching: ${appetiteStatus.approaching} | Breached: ${appetiteStatus.breached}
${JSON.stringify(appetiteDetails, null, 1)}

BREACHED APPETITES:
${breachedAppetites.map(a => `${a.category.toUpperCase()}: Level=${a.currentLevel}, Max=${a.toleranceMax}, Breach=${a.currentLevel - a.toleranceMax}pts`).join('\n') || 'None'}

APPROACHING APPETITES:
${approachingAppetites.map(a => `${a.category.toUpperCase()}: Level=${a.currentLevel}, Max=${a.toleranceMax}, Headroom=${a.toleranceMax - a.currentLevel}pts`).join('\n') || 'None'}

LOSS HISTORY SUMMARY:
Total Events: ${eventStats.total} | Total Loss: £${eventStats.totalFinancialImpact.toLocaleString()} | Avg: £${eventStats.avgFinancialImpact.toLocaleString()}
High Impact: ${eventStats.byOperationalImpact.high} | Medium: ${eventStats.byOperationalImpact.medium} | Low: ${eventStats.byOperationalImpact.low}
Top Risks by Event Frequency: ${JSON.stringify(eventStats.topRisksWithEvents)}

NOTE: This is the optimized snapshot. If the user asks for "full portfolio analysis", "all risks", "deep dive", or "complete dataset", you will receive the full 200-risk dataset in a follow-up system message.
`;
}

// ============================================================================
// TIER 2 — FULL SNAPSHOT (Deep-Dive Only)
// Everything from Tier 1 PLUS: all 200 risks with EMV, full control list,
// full event history, adverse-trend KRIs
// ============================================================================

function buildFullSnapshot(): string {
  const riskStats = getRiskStats();
  const kriStats = getKRIStats();
  const controlStats = getControlStats();
  const appetiteStatus = getAppetiteStatusCounts();
  const breachedAppetites = getBreachedAppetites();
  const approachingAppetites = getApproachingAppetites();
  const escalated = getEscalatedRisks();
  const outsideAppetite = getOutsideAppetiteRisks();
  const eventStats = getEventStats();
  const kriHealth = getKRIHealthScore();
  const breachedKRIList = getBreachedKRIs();
  const adverseTrendKRIs = getKRIsWithTrend('Up');
  const highImpactEvents = getHighImpactEvents();

  // ---- ALL RISKS WITH EMV ----
  const allRisksWithEMV = enterpriseRisks.map(r => {
    const emv = calculateEMV(r);
    return {
      id: r.riskId,
      cat: r.riskCategory,
      desc: r.riskDescription.substring(0, 80),
      L: r.likelihood,
      I: r.impact,
      vel: r.velocity,
      inherent: r.inherentRiskScore,
      residual: r.residualRiskScore,
      prob: emv.probability,
      finImpact: emv.financialImpact,
      inhEMV: Math.round(emv.inherentEMV),
      resEMV: Math.round(emv.residualEMV),
      ctrl: r.controlEffectiveness,
      appetite: r.riskAppetiteAlignment,
      owner: r.riskOwner,
      region: r.region,
      status: r.riskStatus
    };
  });

  const topByEMV = [...allRisksWithEMV].sort((a, b) => b.resEMV - a.resEMV);

  const totalInherentEMV = allRisksWithEMV.reduce((s, r) => s + r.inhEMV, 0);
  const totalResidualEMV = allRisksWithEMV.reduce((s, r) => s + r.resEMV, 0);
  const emvReduction = totalInherentEMV - totalResidualEMV;

  const categories = ['Financial', 'Operational', 'Strategic', 'Compliance', 'Third Party', 'Reputational', 'AI Ethics', 'People', 'Cybersecurity'];
  const categoryBreakdown = categories.map(cat => {
    const risks = allRisksWithEMV.filter(r => r.cat === cat);
    return {
      category: cat,
      count: risks.length,
      totalResEMV: risks.reduce((s, r) => s + r.resEMV, 0),
      avgResEMV: risks.length ? Math.round(risks.reduce((s, r) => s + r.resEMV, 0) / risks.length) : 0,
      outsideAppetite: risks.filter(r => r.appetite === 'Outside Appetite').length,
      escalated: risks.filter(r => r.status === 'Escalated').length
    };
  });

  const breachedKRISummary = breachedKRIList.slice(0, 40).map(k => ({
    kriId: k.kriId,
    riskId: k.riskId,
    indicator: k.indicator,
    current: k.currentValue,
    threshold: k.threshold,
    breachPct: Math.round(((k.currentValue - k.threshold) / k.threshold) * 100),
    trend: k.trend
  }));

  const adverseKRISummary = adverseTrendKRIs.filter(k => k.status === 'Red').slice(0, 20).map(k => ({
    kriId: k.kriId,
    riskId: k.riskId,
    indicator: k.indicator,
    current: k.currentValue,
    threshold: k.threshold,
    trend: k.trend
  }));

  const lowEffectivenessControls = enterpriseControls
    .filter(c => (c.effectivenessScore || 0) < 70)
    .map(c => ({
      id: c.controlId,
      name: c.controlName,
      type: c.controlType,
      auto: c.automationLevel,
      score: c.effectivenessScore,
      risks: c.mappedRiskIds.slice(0, 5)
    }));

  const highEffectivenessControls = enterpriseControls
    .filter(c => (c.effectivenessScore || 0) >= 85)
    .map(c => ({
      id: c.controlId,
      name: c.controlName,
      score: c.effectivenessScore
    }));

  const appetiteDetails = riskAppetite.map(a => ({
    category: a.category,
    currentLevel: a.currentLevel,
    toleranceMin: a.toleranceMin,
    toleranceMax: a.toleranceMax,
    status: a.status,
    headroom: a.toleranceMax - a.currentLevel,
    breachAmount: a.currentLevel > a.toleranceMax ? a.currentLevel - a.toleranceMax : 0
  }));

  const recentHighImpact = highImpactEvents.slice(0, 25).map(e => ({
    eventId: e.eventId,
    riskId: e.relatedRiskId,
    desc: e.eventDescription.substring(0, 80),
    date: e.eventDate,
    cost: e.financialImpact,
    impact: e.operationalImpact
  }));

  return `
═══════════════════════════════════════════════════════
LUMINA-R ENTERPRISE RISK DATA — TIER 2 (FULL PORTFOLIO)
═══════════════════════════════════════════════════════

PORTFOLIO SUMMARY:
Total Risks: ${riskStats.total}
Escalated: ${riskStats.escalated} | Outside Appetite: ${riskStats.outsideAppetite}
High-Inherent (score>=15): ${riskStats.highRisk}
Avg Inherent Score: ${riskStats.avgInherentScore} | Avg Residual: ${riskStats.avgResidualScore}
Control Effectiveness: Low=${riskStats.controlEffectivenessDistribution.low}, Med=${riskStats.controlEffectivenessDistribution.medium}, High=${riskStats.controlEffectivenessDistribution.high}

PORTFOLIO EMV (£ GBP):
Total Inherent EMV: £${totalInherentEMV.toLocaleString()}
Total Residual EMV: £${totalResidualEMV.toLocaleString()}
Controls EMV Reduction: £${emvReduction.toLocaleString()} (${Math.round((emvReduction / totalInherentEMV) * 100)}%)

CATEGORY BREAKDOWN:
${JSON.stringify(categoryBreakdown, null, 1)}

ALL ${allRisksWithEMV.length} RISKS BY RESIDUAL EMV (COMPLETE DATASET):
${JSON.stringify(topByEMV, null, 1)}

ESCALATED RISKS (${escalated.length}):
${escalated.map(r => {
  const emv = calculateEMV(r);
  return `Risk#${r.riskId} [${r.riskCategory}] "${r.riskDescription.substring(0, 60)}" ResEMV=£${Math.round(emv.residualEMV).toLocaleString()} Owner=${r.riskOwner}`;
}).join('\n')}

OUTSIDE APPETITE RISKS (${outsideAppetite.length}):
${outsideAppetite.map(r => `Risk#${r.riskId} [${r.riskCategory}] Score=${r.residualRiskScore} Owner=${r.riskOwner}`).join('\n')}

KRI INTELLIGENCE:
Total: ${kriStats.total} | Red: ${kriStats.byStatus.red} | Amber: ${kriStats.byStatus.amber} | Green: ${kriStats.byStatus.green}
Health Score: ${kriHealth}% | Breach Rate: ${kriStats.breachRate}%
Trends: Worsening=${kriStats.byTrend.increasing}, Improving=${kriStats.byTrend.decreasing}, Stable=${kriStats.byTrend.stable}

BREACHED KRIs (Red):
${JSON.stringify(breachedKRISummary, null, 1)}

ADVERSE TREND KRIs (Red + Trending Up):
${JSON.stringify(adverseKRISummary, null, 1)}

CONTROL FRAMEWORK:
Total: ${controlStats.total} | Avg Effectiveness: ${controlStats.avgEffectiveness}%
By Type: Preventive=${controlStats.byType.preventive}, Detective=${controlStats.byType.detective}, Corrective=${controlStats.byType.corrective}
By Automation: Auto=${controlStats.byAutomation.automated}, Semi=${controlStats.byAutomation.semiAutomated}, Manual=${controlStats.byAutomation.manual}
Coverage: ${controlStats.riskCoverage.coveragePercent}% (${controlStats.riskCoverage.risksWithControls}/${controlStats.riskCoverage.totalRisks})

LOW EFFECTIVENESS CONTROLS (<70%):
${JSON.stringify(lowEffectivenessControls, null, 1)}

HIGH EFFECTIVENESS CONTROLS (>=85%):
${JSON.stringify(highEffectivenessControls, null, 1)}

RISK APPETITE:
Within: ${appetiteStatus.within} | Approaching: ${appetiteStatus.approaching} | Breached: ${appetiteStatus.breached}
${JSON.stringify(appetiteDetails, null, 1)}

BREACHED APPETITES:
${breachedAppetites.map(a => `${a.category.toUpperCase()}: Level=${a.currentLevel}, Max=${a.toleranceMax}, Breach=${a.currentLevel - a.toleranceMax}pts — "${a.statement.substring(0, 80)}"`).join('\n') || 'None'}

APPROACHING APPETITES:
${approachingAppetites.map(a => `${a.category.toUpperCase()}: Level=${a.currentLevel}, Max=${a.toleranceMax}, Headroom=${a.toleranceMax - a.currentLevel}pts`).join('\n') || 'None'}

RISK EVENTS & LOSS HISTORY:
Total Events: ${eventStats.total} | Total Loss: £${eventStats.totalFinancialImpact.toLocaleString()} | Avg: £${eventStats.avgFinancialImpact.toLocaleString()}
High Impact: ${eventStats.byOperationalImpact.high} | Medium: ${eventStats.byOperationalImpact.medium} | Low: ${eventStats.byOperationalImpact.low}

RECENT HIGH-IMPACT EVENTS:
${JSON.stringify(recentHighImpact, null, 1)}

TOP RISK IDs BY EVENT FREQUENCY:
${JSON.stringify(eventStats.topRisksWithEvents, null, 1)}
`;
}

// ============================================================================
// FIVE-LAYER SYSTEM PROMPT (Tier-Aware)
// ============================================================================

function buildFiveLayerInstructions(): string {
  return `You are Lumina R's Chief Risk Intelligence Engine — the most advanced enterprise risk reasoning system.

You operate with a FIVE-LAYER REASONING SYSTEM:

LAYER 1 — STRUCTURAL INTERPRETATION
For every query, identify which risks, KRIs, controls, appetites, and events are relevant. Map relationships: which KRIs signal which risks, which controls mitigate which risks, which events validate which risk scores.

LAYER 2 — QUANTITATIVE ANALYSIS
Use the precomputed EMV (Expected Monetary Value) data. EMV = Probability x Financial Impact. Residual EMV = Inherent EMV x (1 - Control Factor). Control Factors: High=0.70, Medium=0.45, Low=0.20. Always quote exact £ GBP figures from the dataset. Run comparative analysis across categories, owners, and regions.

LAYER 3 — STRATEGIC CONTEXT
Relate findings to business strategy. Consider risk velocity (Fast/Medium/Slow), appetite alignment, and trend direction. A fast-velocity risk trending adversely with breached appetite demands different treatment than a slow-moving within-appetite risk.

LAYER 4 — GOVERNANCE IMPLICATIONS
Map findings to governance actions: board escalation criteria, committee reporting requirements, regulatory obligations. Consider which risks need immediate board attention vs. management action vs. monitoring.

LAYER 5 — ACTION PRESCRIPTION
Provide specific, costed recommendations. For example: "Investing £420k in enhanced vendor monitoring would reduce Third Party residual EMV by 35%, bringing it within appetite." Always include timelines: 0-7 days (urgent), 30 days (near-term), 90 days (strategic).

CRITICAL RULES:
- Use ONLY the provided dataset. NEVER invent numbers or risks.
- Quote specific Risk IDs (e.g., Risk#23), KRI IDs, Control IDs from the data.
- All financial figures in £ GBP with exact values from the dataset.
- When asked about a risk category, provide ALL risks in that category with their EMV values.
- When asked for EMV, use the precomputed inherentEMV and residualEMV fields.
- Cross-reference: if KRI is breached, identify which risk it maps to and its current EMV.
- For Monte Carlo: use residualEMV values to compute P50/P75/P95/P99 portfolio VaR.
- For cluster detection: identify risks sharing owners, regions, categories, or control gaps.
- ALWAYS structure responses with clear sections and bold headers.

RESPONSE STRUCTURE FOR EVERY QUERY:

**EXECUTIVE SUMMARY**
(2-3 sentence board-ready overview with key £ figures)

**QUANTITATIVE ANALYSIS**
(EMV calculations, specific Risk IDs, exact financial figures)

**RISK INTELLIGENCE INSIGHT**
(Correlations, trends, KRI signals, appetite alignment)

**DECISION PATH**
- 0-7 days: (immediate actions)
- 30 days: (near-term priorities)
- 90 days: (strategic initiatives)

**GOVERNANCE IMPLICATIONS**
(Board reporting, committee actions, regulatory considerations)`;
}

function buildSystemPrompt(userMessage: string): string {
  const instructions = buildFiveLayerInstructions();
  const snapshot = isDeepDiveQuery(userMessage)
    ? buildFullSnapshot()
    : buildLightSnapshot();

  return `${instructions}

${snapshot}`;
}

// ============================================================================
// CONVERSATION MANAGEMENT
// ============================================================================

export interface ConversationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

let conversationHistory: ConversationMessage[] = [];

export function resetConversation() {
  conversationHistory = [];
}

// ============================================================================
// SYSTEM MESSAGE MANAGEMENT
// Rebuilds system message per-request to select appropriate data tier
// ============================================================================

function prepareConversation(userMessage: string) {
  const systemContent = buildSystemPrompt(userMessage);

  if (conversationHistory.length === 0) {
    conversationHistory.push({ role: 'system', content: systemContent });
  } else {
    // Update existing system message to match current tier
    conversationHistory[0] = { role: 'system', content: systemContent };
  }

  conversationHistory.push({ role: 'user', content: userMessage });

  // Keep conversation manageable - retain system + last 20 messages
  if (conversationHistory.length > 22) {
    const system = conversationHistory[0];
    conversationHistory = [system, ...conversationHistory.slice(-20)];
  }
}

// ============================================================================
// MAIN AI CALL
// ============================================================================

export async function callAI(userMessage: string): Promise<string> {
  if (!openaiClient) getApiKey();
  if (!openaiClient) throw new Error('API key not configured');

  prepareConversation(userMessage);

  const completion = await openaiClient.chat.completions.create({
    model: 'gpt-4.1',
    messages: conversationHistory,
    temperature: 0.15,
    max_tokens: 4000
  });

  const reply =
    completion.choices[0]?.message?.content || 'No response generated.';

  conversationHistory.push({ role: 'assistant', content: reply });

  return reply;
}

// ============================================================================
// STREAMING AI CALL
// ============================================================================

export async function callAIStreaming(
  userMessage: string,
  onChunk: (chunk: string) => void,
  onDone: () => void
): Promise<void> {
  if (!openaiClient) getApiKey();
  if (!openaiClient) throw new Error('API key not configured');

  prepareConversation(userMessage);

  const stream = await openaiClient.chat.completions.create({
    model: 'gpt-4.1',
    messages: conversationHistory,
    temperature: 0.15,
    max_tokens: 4000,
    stream: true
  });

  let fullReply = '';

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content || '';
    if (delta) {
      fullReply += delta;
      onChunk(fullReply);
    }
  }

  conversationHistory.push({ role: 'assistant', content: fullReply });
  onDone();
}
