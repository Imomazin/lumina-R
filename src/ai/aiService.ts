// ============================================================================
// LUMINA-R v2 AI SERVICE - Enterprise Risk Intelligence Engine
// Five-Layer Reasoning + Forecast + Optimisation + Correlation + Governance
// AI Role Modes: Board | CRO | Risk Manager | Audit
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
  getAppetiteStatusCounts
} from '../data/appetite';
import {
  getEventStats,
  getHighImpactEvents
} from '../data/riskEvents';

// Engine imports for v2 capabilities
import {
  forecastPortfolio,
  getTopDeterioratingRisks,
  getImminentBreachWarnings
} from '../engine/forecastLayer';
import {
  optimizeCapitalAllocation,
  identifyQuickWins
} from '../engine/optimisationLayer';
import {
  detectSystemicClusters,
  getHighCentralityRisks
} from '../engine/correlationLayer';
import {
  evaluateGovernanceTriggers
} from '../engine/governanceLayer';
import {
  getPortfolioConfidenceOverview
} from '../engine/confidenceLayer';

// ============================================================================
// AI ROLE MODES
// ============================================================================

export type AnalysisMode = 'board' | 'cro' | 'risk_manager' | 'audit';

let currentAnalysisMode: AnalysisMode = 'cro';

export function setAnalysisMode(mode: AnalysisMode) {
  currentAnalysisMode = mode;
  resetConversation(); // Reset conversation when mode changes
}

export function getAnalysisMode(): AnalysisMode {
  return currentAnalysisMode;
}

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
  'full portfolio analysis', 'full portfolio', 'all risks', 'all 200 risks',
  'deep dive', 'deep-dive', 'complete dataset', 'complete data',
  'entire portfolio', 'every risk', 'full risk register',
  'comprehensive analysis', 'show me everything', 'full analysis'
];

function isDeepDiveQuery(userMessage: string): boolean {
  const lower = userMessage.toLowerCase();
  return DEEP_DIVE_TRIGGERS.some(trigger => lower.includes(trigger));
}

// ============================================================================
// V2 ENGINE INTELLIGENCE SNAPSHOT
// Adds forecast, optimisation, correlation, governance data
// ============================================================================

function buildEngineIntelligenceSnapshot(): string {
  try {
    // Forecast data
    const forecasts = forecastPortfolio();
    const deteriorating = getTopDeterioratingRisks(5);
    const warnings = getImminentBreachWarnings().slice(0, 5);
    const forecast90 = forecasts.find(f => f.horizon === 90);

    // Optimisation data
    const allocation = optimizeCapitalAllocation(2000000); // £2M scenario
    const quickWins = identifyQuickWins(100000).slice(0, 5);

    // Correlation data
    const clusters = detectSystemicClusters().slice(0, 5);
    const centrality = getHighCentralityRisks(5);

    // Governance data
    const governance = evaluateGovernanceTriggers();

    // Confidence data
    const confidence = getPortfolioConfidenceOverview();

    return `
═══════════════════════════════════════════════════════
LUMINA-R v2 INTELLIGENCE LAYER
═══════════════════════════════════════════════════════

RISK TRAJECTORY FORECAST:
90-Day Projection: ${forecast90 ? `${forecast90.deltaPercent >= 0 ? '+' : ''}${forecast90.deltaPercent}% (£${(forecast90.deltaEMV / 1000000).toFixed(1)}M)` : 'N/A'}
365-Day Projection: ${forecasts.find(f => f.horizon === 365)?.deltaPercent || 0}%
Deteriorating Risks: ${deteriorating.length}
Imminent Breaches: ${warnings.length}

TOP DETERIORATING RISKS:
${deteriorating.map(d => `Risk#${d.riskId}: ${d.riskTrend} trajectory, current £${(d.currentResidualEMV / 1000).toFixed(0)}K`).join('\n')}

CAPITAL OPTIMISATION (£2M Budget):
Expected EMV Reduction: £${(allocation.expectedTotalEMVReduction / 1000000).toFixed(2)}M
ROI: ${allocation.overallROI}x
Risks Addressable: ${allocation.summary.risksAddressed}
Top Investment: Risk#${allocation.recommendations[0]?.riskId || 'N/A'} (£${((allocation.recommendations[0]?.recommendedInvestment || 0) / 1000).toFixed(0)}K for £${((allocation.recommendations[0]?.expectedEMVReduction || 0) / 1000).toFixed(0)}K reduction)

QUICK WINS (<£100K):
${quickWins.map(q => `Risk#${q.riskId}: £${q.investment.toLocaleString()} → ${q.roi}x ROI`).join('\n')}

SYSTEMIC CLUSTERS:
Total Clusters: ${clusters.length}
Critical/High: ${clusters.filter(c => c.systemicRiskLevel === 'Critical' || c.systemicRiskLevel === 'High').length}
Total Cascade Exposure: £${(clusters.reduce((s, c) => s + c.cascadeExposure, 0) / 1000000).toFixed(1)}M

TOP CLUSTERS:
${clusters.map(c => `Cluster#${c.clusterId}: ${c.riskIds.length} risks, £${(c.cascadeExposure / 1000000).toFixed(1)}M cascade, ${c.systemicRiskLevel}`).join('\n')}

MOST CONNECTED RISKS:
${centrality.map(r => `Risk#${r.riskId}: ${r.connectionCount} connections, centrality ${r.centralityScore}%`).join('\n')}

GOVERNANCE STATUS:
Total Flags: ${governance.totalFlags}
Critical Actions: ${governance.criticalActions.length}
Board Items: ${governance.nextBoardItems.length}
Portfolio Health: ${governance.summary.portfolioHealth}

CRITICAL FLAGS:
${governance.criticalActions.slice(0, 3).map(f => `${f.targetBody}: ${f.triggerRule}`).join('\n') || 'None'}

DATA CONFIDENCE:
Portfolio Confidence: ${confidence.averageConfidence}%
High Confidence Risks: ${confidence.confidenceDistribution.high}
Low Confidence Risks: ${confidence.confidenceDistribution.low + confidence.confidenceDistribution.veryLow}
`;
  } catch {
    return '\nV2 Intelligence Layer: Initializing...\n';
  }
}

// ============================================================================
// TIER 1 — LIGHTWEIGHT SNAPSHOT (Default)
// ============================================================================

function buildLightSnapshot(): string {
  const riskStats = getRiskStats();
  const kriStats = getKRIStats();
  const controlStats = getControlStats();
  const appetiteStatus = getAppetiteStatusCounts();
  const escalated = getEscalatedRisks();
  const outsideAppetite = getOutsideAppetiteRisks();
  const eventStats = getEventStats();
  const kriHealth = getKRIHealthScore();
  const breachedKRIList = getBreachedKRIs();

  const allEMVs = enterpriseRisks.map(r => calculateEMV(r));
  const totalInherentEMV = allEMVs.reduce((s, e) => s + Math.round(e.inherentEMV), 0);
  const totalResidualEMV = allEMVs.reduce((s, e) => s + Math.round(e.residualEMV), 0);
  const emvReduction = totalInherentEMV - totalResidualEMV;

  const categories = ['Financial', 'Operational', 'Strategic', 'Compliance', 'Third Party', 'Reputational', 'AI Ethics', 'People', 'Cybersecurity'];
  const categoryBreakdown = categories.map(cat => {
    const risks = enterpriseRisks.filter(r => r.riskCategory === cat);
    const emvs = risks.map(r => calculateEMV(r));
    const totalResEMV = emvs.reduce((s, e) => s + Math.round(e.residualEMV), 0);
    return {
      category: cat, count: risks.length, totalResEMV,
      avgResEMV: risks.length ? Math.round(totalResEMV / risks.length) : 0,
      outsideAppetite: risks.filter(r => r.riskAppetiteAlignment === 'Outside Appetite').length,
      escalated: risks.filter(r => r.riskStatus === 'Escalated').length
    };
  });

  const breachedKRISummary = breachedKRIList.slice(0, 20).map(k => ({
    kriId: k.kriId, riskId: k.riskId, indicator: k.indicator,
    current: k.currentValue, threshold: k.threshold,
    breachPct: Math.round(((k.currentValue - k.threshold) / k.threshold) * 100), trend: k.trend
  }));

  const appetiteDetails = riskAppetite.map(a => ({
    category: a.category, currentLevel: a.currentLevel, toleranceMax: a.toleranceMax,
    status: a.status, headroom: a.toleranceMax - a.currentLevel,
    breachAmount: a.currentLevel > a.toleranceMax ? a.currentLevel - a.toleranceMax : 0
  }));

  return `
═══════════════════════════════════════════════════════
LUMINA-R v2 RISK DATA — OPTIMIZED SNAPSHOT
═══════════════════════════════════════════════════════

PORTFOLIO SUMMARY:
Total Risks: ${riskStats.total} | Escalated: ${riskStats.escalated} | Outside Appetite: ${riskStats.outsideAppetite}
High-Inherent (>=15): ${riskStats.highRisk} | Avg Residual: ${riskStats.avgResidualScore}

PORTFOLIO EMV (£ GBP):
Total Inherent: £${totalInherentEMV.toLocaleString()} | Residual: £${totalResidualEMV.toLocaleString()}
Control Reduction: £${emvReduction.toLocaleString()} (${Math.round((emvReduction / totalInherentEMV) * 100)}%)

CATEGORY BREAKDOWN:
${JSON.stringify(categoryBreakdown, null, 1)}

ESCALATED RISKS (${escalated.length}):
${escalated.slice(0, 15).map(r => {
    const emv = calculateEMV(r);
    return `Risk#${r.riskId} [${r.riskCategory}] ResEMV=£${Math.round(emv.residualEMV).toLocaleString()} Ctrl=${r.controlEffectiveness}`;
  }).join('\n')}

OUTSIDE APPETITE (${outsideAppetite.length}):
${outsideAppetite.slice(0, 15).map(r => {
    const emv = calculateEMV(r);
    return `Risk#${r.riskId} [${r.riskCategory}] ResEMV=£${Math.round(emv.residualEMV).toLocaleString()}`;
  }).join('\n')}

KRI STATUS:
Total: ${kriStats.total} | Red: ${kriStats.byStatus.red} | Amber: ${kriStats.byStatus.amber} | Green: ${kriStats.byStatus.green}
Health: ${kriHealth}% | Breach Rate: ${kriStats.breachRate}%

BREACHED KRIs:
${JSON.stringify(breachedKRISummary, null, 1)}

CONTROLS:
Total: ${controlStats.total} | Avg Effectiveness: ${controlStats.avgEffectiveness}%
Coverage: ${controlStats.riskCoverage.coveragePercent}%

APPETITE STATUS:
Within: ${appetiteStatus.within} | Approaching: ${appetiteStatus.approaching} | Breached: ${appetiteStatus.breached}
${JSON.stringify(appetiteDetails, null, 1)}

LOSS HISTORY:
Total Events: ${eventStats.total} | Total Loss: £${eventStats.totalFinancialImpact.toLocaleString()}
${buildEngineIntelligenceSnapshot()}`;
}

// ============================================================================
// TIER 2 — FULL SNAPSHOT (Deep-Dive)
// ============================================================================

function buildFullSnapshot(): string {
  const riskStats = getRiskStats();
  const kriStats = getKRIStats();
  const appetiteStatus = getAppetiteStatusCounts();
  const breachedAppetites = getBreachedAppetites();
  const kriHealth = getKRIHealthScore();
  const breachedKRIList = getBreachedKRIs();
  const adverseTrendKRIs = getKRIsWithTrend('Up');
  const highImpactEvents = getHighImpactEvents();

  const allRisksWithEMV = enterpriseRisks.map(r => {
    const emv = calculateEMV(r);
    return {
      id: r.riskId, cat: r.riskCategory, desc: r.riskDescription.substring(0, 80),
      L: r.likelihood, I: r.impact, vel: r.velocity,
      inherent: r.inherentRiskScore, residual: r.residualRiskScore,
      inhEMV: Math.round(emv.inherentEMV), resEMV: Math.round(emv.residualEMV),
      ctrl: r.controlEffectiveness, appetite: r.riskAppetiteAlignment,
      owner: r.riskOwner, region: r.region, status: r.riskStatus
    };
  });

  const topByEMV = [...allRisksWithEMV].sort((a, b) => b.resEMV - a.resEMV);
  const totalInherentEMV = allRisksWithEMV.reduce((s, r) => s + r.inhEMV, 0);
  const totalResidualEMV = allRisksWithEMV.reduce((s, r) => s + r.resEMV, 0);

  const breachedKRISummary = breachedKRIList.slice(0, 40).map(k => ({
    kriId: k.kriId, riskId: k.riskId, indicator: k.indicator,
    current: k.currentValue, threshold: k.threshold,
    breachPct: Math.round(((k.currentValue - k.threshold) / k.threshold) * 100), trend: k.trend
  }));

  const adverseKRISummary = adverseTrendKRIs.filter(k => k.status === 'Red').slice(0, 20).map(k => ({
    kriId: k.kriId, riskId: k.riskId, indicator: k.indicator, trend: k.trend
  }));

  const lowEffectivenessControls = enterpriseControls
    .filter(c => (c.effectivenessScore || 0) < 70)
    .map(c => ({ id: c.controlId, name: c.controlName, score: c.effectivenessScore, risks: c.mappedRiskIds.slice(0, 5) }));

  const recentHighImpact = highImpactEvents.slice(0, 20).map(e => ({
    eventId: e.eventId, riskId: e.relatedRiskId, cost: e.financialImpact, date: e.eventDate
  }));

  return `
═══════════════════════════════════════════════════════
LUMINA-R v2 — FULL PORTFOLIO DEEP DIVE
═══════════════════════════════════════════════════════

PORTFOLIO: ${riskStats.total} risks | Inherent £${totalInherentEMV.toLocaleString()} | Residual £${totalResidualEMV.toLocaleString()}
Escalated: ${riskStats.escalated} | Outside Appetite: ${riskStats.outsideAppetite}

ALL ${allRisksWithEMV.length} RISKS BY EMV:
${JSON.stringify(topByEMV, null, 1)}

KRIs: ${kriStats.total} total | ${kriStats.byStatus.red} Red | Health: ${kriHealth}%
BREACHED: ${JSON.stringify(breachedKRISummary, null, 1)}
ADVERSE TREND: ${JSON.stringify(adverseKRISummary, null, 1)}

WEAK CONTROLS (<70%):
${JSON.stringify(lowEffectivenessControls, null, 1)}

APPETITE: Within=${appetiteStatus.within} | Approaching=${appetiteStatus.approaching} | Breached=${appetiteStatus.breached}
${breachedAppetites.map(a => `${a.category}: ${a.currentLevel}/${a.toleranceMax}`).join(', ')}

RECENT HIGH-IMPACT EVENTS:
${JSON.stringify(recentHighImpact, null, 1)}
${buildEngineIntelligenceSnapshot()}`;
}

// ============================================================================
// AI ROLE MODE INSTRUCTIONS
// ============================================================================

function buildRoleModeInstructions(): string {
  const modeInstructions: Record<AnalysisMode, string> = {
    board: `
ANALYSIS MODE: BOARD
You are presenting to the Board of Directors. Responses must be:
- Strategic and high-level, avoiding technical jargon
- Focused on business impact and shareholder value
- Compressed into key decisions and governance implications
- NO raw JSON data - use narrative summaries with key £ figures
- Emphasize risks requiring Board attention and approval
- Include clear recommendation with expected outcomes
- Maximum 500 words per response`,

    cro: `
ANALYSIS MODE: CHIEF RISK OFFICER
You are the CRO's analytical advisor. Responses must include:
- Full EMV mathematics with formulas shown
- Detailed quantitative analysis across all risk dimensions
- Portfolio-level aggregations and trend analysis
- Forecast trajectories and projected exposures
- Capital allocation recommendations with ROI calculations
- Systemic cluster analysis and cascade exposures
- Governance flag status and escalation recommendations`,

    risk_manager: `
ANALYSIS MODE: RISK MANAGER
You are supporting operational risk managers. Focus on:
- Control effectiveness and remediation priorities
- Tactical action items with specific timelines
- KRI monitoring and threshold management
- Individual risk deep-dives with control mapping
- Quick wins and immediate improvements
- Operational reporting requirements
- Day-to-day risk monitoring guidance`,

    audit: `
ANALYSIS MODE: AUDIT
You are supporting Internal Audit. Focus on:
- Control sufficiency and design adequacy
- Evidence gaps and documentation requirements
- Compliance with risk appetite framework
- Control testing coverage and effectiveness validation
- Areas requiring independent review
- Regulatory alignment and reporting obligations
- Data quality and confidence assessment`
  };

  return modeInstructions[currentAnalysisMode];
}

// ============================================================================
// FIVE-LAYER SYSTEM PROMPT (v2 Enhanced)
// ============================================================================

function buildFiveLayerInstructions(): string {
  return `You are Lumina R v2 — Enterprise Risk Intelligence Engine.

${buildRoleModeInstructions()}

FIVE-LAYER REASONING SYSTEM:

LAYER 1 — STRUCTURAL INTERPRETATION
Identify relevant risks, KRIs, controls, appetites, events. Map relationships.

LAYER 2 — QUANTITATIVE ANALYSIS
EMV = Probability × Impact. Residual = Inherent × (1 - Control Factor).
Control Factors: High=0.70, Medium=0.45, Low=0.20. Quote exact £ GBP figures.

LAYER 3 — STRATEGIC CONTEXT
Consider velocity (Fast/Medium/Slow), appetite alignment, trends. Fast-velocity + breached appetite = urgent.

LAYER 4 — GOVERNANCE IMPLICATIONS
Map to board/committee/management actions. Reference governance flags provided.

LAYER 5 — ACTION PRESCRIPTION
Specific, costed recommendations with 0-7/30/90-day timelines.

v2 CAPABILITIES (USE WHEN RELEVANT):
- FORECAST: Reference 90/365-day projections and deteriorating risks
- OPTIMISATION: Propose capital allocation when investment discussed (include ROI)
- CORRELATION: Identify cluster risks and cascade exposure for systemic queries
- GOVERNANCE: Reference governance flags and escalation status
- CONFIDENCE: Note data confidence level for recommendations

RULES:
- Use ONLY provided data. NEVER invent.
- Quote Risk IDs, KRI IDs, Control IDs
- All figures in £ GBP
- Structure with **bold headers**

RESPONSE STRUCTURE:
**EXECUTIVE SUMMARY** (2-3 sentences, key £ figures)
**QUANTITATIVE ANALYSIS** (EMV, Risk IDs, figures)
**RISK INTELLIGENCE** (correlations, trends, forecasts)
**DECISION PATH** (0-7d / 30d / 90d actions)
**GOVERNANCE** (escalations, flags, confidence)`;
}

function buildSystemPrompt(userMessage: string): string {
  const instructions = buildFiveLayerInstructions();
  const snapshot = isDeepDiveQuery(userMessage) ? buildFullSnapshot() : buildLightSnapshot();
  return `${instructions}\n\n${snapshot}`;
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

function prepareConversation(userMessage: string) {
  const systemContent = buildSystemPrompt(userMessage);

  if (conversationHistory.length === 0) {
    conversationHistory.push({ role: 'system', content: systemContent });
  } else {
    conversationHistory[0] = { role: 'system', content: systemContent };
  }

  conversationHistory.push({ role: 'user', content: userMessage });

  if (conversationHistory.length > 22) {
    const system = conversationHistory[0];
    conversationHistory = [system, ...conversationHistory.slice(-20)];
  }
}

// ============================================================================
// MAIN AI CALLS
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

  const reply = completion.choices[0]?.message?.content || 'No response generated.';
  conversationHistory.push({ role: 'assistant', content: reply });
  return reply;
}

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

// ============================================================================
// ENGINE VERSION
// ============================================================================

export const AI_ENGINE_VERSION = '2.0.0';
export const AI_ENGINE_NAME = 'Lumina-R Enterprise Risk Intelligence Engine';
