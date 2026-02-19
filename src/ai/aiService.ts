// ============================================================================
// LUMINA-R AI SERVICE - Real LLM Integration
// Connects to OpenAI API with full risk data grounding
// ============================================================================

import OpenAI from 'openai';
import { enterpriseRisks, getRiskStats, getEscalatedRisks, getOutsideAppetiteRisks } from '../data/enterpriseRisks';
import { getKRIStats, getBreachedKRIs, getKRIHealthScore } from '../data/enterpriseKRIs';
import { enterpriseControls, getControlStats } from '../data/enterpriseControls';
import { riskAppetite, getBreachedAppetites } from '../data/appetite';
import { riskEvents } from '../data/riskEvents';

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
// DATA SNAPSHOT BUILDER - Compresses risk data for context window
// ============================================================================

function buildDataSnapshot(): string {
  const riskStats = getRiskStats();
  const kriStats = getKRIStats();
  const controlStats = getControlStats();
  const breachedAppetites = getBreachedAppetites();
  const escalated = getEscalatedRisks();
  const outsideAppetite = getOutsideAppetiteRisks();
  const breachedKRIs = getBreachedKRIs();

  // Top 30 highest-scoring risks with full detail
  const topRisks = [...enterpriseRisks]
    .sort((a, b) => b.residualRiskScore - a.residualRiskScore)
    .slice(0, 30)
    .map(r => ({
      id: r.riskId,
      cat: r.riskCategory,
      desc: r.riskDescription,
      root: r.rootCause,
      L: r.likelihood,
      I: r.impact,
      vel: r.velocity,
      inhScore: r.inherentRiskScore,
      resScore: r.residualRiskScore,
      ctrl: r.controlEffectiveness,
      existCtrl: r.existingControls,
      appetite: r.riskAppetiteAlignment,
      owner: r.riskOwner,
      region: r.region,
      status: r.riskStatus
    }));

  // Top breached KRIs
  const topBreachedKRIs = breachedKRIs.slice(0, 20).map(k => ({
    id: k.kriId,
    riskId: k.riskId,
    indicator: k.indicator,
    current: k.currentValue,
    threshold: k.threshold,
    trend: k.trend,
    status: k.status,
    breachPct: Math.round((k.currentValue / k.threshold) * 100)
  }));

  // Control summary
  const controlSummary = enterpriseControls.slice(0, 40).map(c => ({
    id: c.controlId,
    name: c.controlName,
    type: c.controlType,
    auto: c.automationLevel,
    eff: c.effectivenessScore,
    risks: c.mappedRiskIds.slice(0, 5),
    owner: c.owner
  }));

  // Recent events
  const recentEvents = riskEvents.slice(0, 15).map(e => ({
    id: e.eventId,
    riskId: e.relatedRiskId,
    desc: e.eventDescription,
    date: e.eventDate,
    financial: e.financialImpact,
    impact: e.operationalImpact
  }));

  return `
=== LUMINA-R RISK DATA SNAPSHOT ===

PORTFOLIO SUMMARY:
- Total Risks: ${riskStats.total}
- Escalated: ${riskStats.escalated}
- Outside Appetite: ${riskStats.outsideAppetite}
- By Category: ${JSON.stringify(riskStats.categoryDistribution)}
- Avg Inherent Score: ${riskStats.avgInherentScore}, Avg Residual Score: ${riskStats.avgResidualScore}

KRI SUMMARY:
- Total KRIs: ${kriStats.total}
- Breached (Red): ${kriStats.byStatus.red} (${kriStats.breachRate}%)
- Warning (Amber): ${kriStats.byStatus.amber}
- Healthy (Green): ${kriStats.byStatus.green}
- Worsening Trend: ${kriStats.byTrend.increasing}
- KRI Health Score: ${getKRIHealthScore()}%

CONTROL SUMMARY:
- Total Controls: ${controlStats.total}
- Avg Effectiveness: ${controlStats.avgEffectiveness}%
- By Type: Preventive=${controlStats.byType.preventive}, Detective=${controlStats.byType.detective}, Corrective=${controlStats.byType.corrective}
- By Automation: Automated=${controlStats.byAutomation.automated}, Semi=${controlStats.byAutomation.semiAutomated}, Manual=${controlStats.byAutomation.manual}
- Weak Controls (<70%): ${controlStats.lowEffectivenessControls.length}
- Risk Coverage: ${controlStats.riskCoverage.coveragePercent}%

APPETITE STATUS:
${riskAppetite.map(a => `- ${a.category}: ${a.currentLevel}% (tolerance ${a.toleranceMin}-${a.toleranceMax}%) [${a.status.toUpperCase()}]`).join('\n')}
Breached Categories: ${breachedAppetites.map(a => a.category).join(', ') || 'none'}

TOP 30 RISKS (sorted by residual score):
${JSON.stringify(topRisks, null, 1)}

ESCALATED RISKS (${escalated.length}):
${escalated.slice(0, 10).map(r => `- Risk#${r.riskId} [${r.riskCategory}]: ${r.riskDescription} (Score:${r.residualRiskScore}, Owner:${r.riskOwner})`).join('\n')}

OUTSIDE APPETITE RISKS (${outsideAppetite.length}):
${outsideAppetite.slice(0, 10).map(r => `- Risk#${r.riskId} [${r.riskCategory}]: ${r.riskDescription} (Score:${r.residualRiskScore}, Ctrl:${r.controlEffectiveness})`).join('\n')}

TOP BREACHED KRIs:
${JSON.stringify(topBreachedKRIs, null, 1)}

CONTROL DETAILS (Top 40):
${JSON.stringify(controlSummary, null, 1)}

RECENT RISK EVENTS:
${JSON.stringify(recentEvents, null, 1)}

=== CALCULATION REFERENCE ===
EMV = Probability x Financial Impact
Probability by Likelihood: 1=5%, 2=15%, 3=35%, 4=55%, 5=80%
Financial Impact by Score: 1=£100K, 2=£500K, 3=£1.5M, 4=£5M, 5=£15M
Residual EMV = Inherent EMV x (1 - Control Effectiveness Factor)
Control Factor: High=0.70, Medium=0.45, Low=0.20
Investment per control effectiveness point: ~£35K
`;
}

// ============================================================================
// SYSTEM PROMPT - Five-Layer Reasoning Architecture
// ============================================================================

function buildSystemPrompt(): string {
  return `You are Lumina R's Chief Risk Intelligence Engine. You are NOT a generic chatbot. You are a senior risk advisor embedded in an enterprise risk management platform.

YOUR IDENTITY:
- You speak with the authority of a Chief Risk Officer
- You provide board-ready quantitative analysis
- Every response must be grounded in the ACTUAL data provided below
- You never guess or make up numbers - you calculate from the dataset

FIVE-LAYER REASONING SYSTEM:
Every substantive response must apply these five layers:

Layer 1 - STRUCTURAL INTERPRETATION: What does this data mean structurally? How many risks, what categories, what relationships exist?
Layer 2 - QUANTITATIVE ANALYSIS: Calculate EMV (Expected Monetary Value = Probability x Impact), residual risk, control reduction percentages, appetite breach severity, investment requirements.
Layer 3 - STRATEGIC CONTEXT: How does this affect business objectives? What are the implications for the organisation's strategy?
Layer 4 - GOVERNANCE IMPLICATION: Who needs to be informed? What regulatory requirements apply? What oversight actions are triggered?
Layer 5 - ACTION PRESCRIPTION: What should be done IMMEDIATELY (0-7 days), in 30 DAYS, and in 90 DAYS?

OUTPUT FORMAT FOR ANALYSIS:
Use this structure for substantive responses:

**EXECUTIVE SUMMARY (Board Ready)**
[2-3 sentence overview suitable for a board paper]

**QUANTITATIVE ANALYSIS**
[Numbers, EMV calculations, percentages, financial figures - all from actual data]

**RISK INTELLIGENCE INSIGHT**
[Strategic interpretation, trends, correlations, emerging patterns]

**DECISION PATH**
- Immediate (0-7 days): [specific actions]
- 30-Day: [tactical improvements]
- 90-Day: [strategic realignment]

**GOVERNANCE IMPLICATIONS**
[Who needs to know, what committees need briefing, regulatory considerations]

RISK ANALYTICS YOU MUST PERFORM:
1. Risk Prioritisation: Rank by residual EMV, volatility trend, control weakness, appetite breach severity
2. Appetite Breach Logic: Calculate % deviation from tolerance, financial delta, required probability reduction
3. Monte Carlo Intelligence: Reference P50/P75/P95 outcomes based on portfolio characteristics
4. Control Effectiveness: Analyse preventive vs detective ratio, coverage gaps, maturity levels, investment needs
5. Cluster Detection: Identify correlated risks (cyber clusters, vendor concentration, geographic clustering)

PROACTIVE BEHAVIOUR:
- NEVER say "please clarify" or "can you be more specific"
- Instead, when a query is ambiguous, offer 3-4 structured diagnostic options the user can select
- Always provide actionable intelligence, never generic advice
- Reference specific Risk IDs, KRI IDs, and Control IDs in your responses
- Use £ (GBP) for all financial figures

TARGET CAPABILITY EXAMPLE:
"Reducing probability of Vendor Breach (Risk #16) from 0.42 to 0.28 will bring residual EMV below appetite by 18% and requires estimated £420K additional control investment."

${buildDataSnapshot()}`;
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
// MAIN AI CALL
// ============================================================================

export async function callAI(userMessage: string): Promise<string> {
  if (!openaiClient) {
    getApiKey(); // Try to initialize from localStorage
  }

  if (!openaiClient) {
    throw new Error('API key not configured');
  }

  // Build conversation with system prompt
  if (conversationHistory.length === 0) {
    conversationHistory.push({
      role: 'system',
      content: buildSystemPrompt()
    });
  }

  // Add user message
  conversationHistory.push({
    role: 'user',
    content: userMessage
  });

  // Keep conversation manageable - trim if too long (keep system + last 10 exchanges)
  if (conversationHistory.length > 22) {
    const system = conversationHistory[0];
    conversationHistory = [system, ...conversationHistory.slice(-20)];
  }

  const completion = await openaiClient.chat.completions.create({
    model: 'gpt-4o',
    messages: conversationHistory,
    temperature: 0.3,
    max_tokens: 4000,
  });

  const reply = completion.choices[0]?.message?.content || 'No response generated.';

  // Add assistant reply to history
  conversationHistory.push({
    role: 'assistant',
    content: reply
  });

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
  if (!openaiClient) {
    getApiKey();
  }

  if (!openaiClient) {
    throw new Error('API key not configured');
  }

  if (conversationHistory.length === 0) {
    conversationHistory.push({
      role: 'system',
      content: buildSystemPrompt()
    });
  }

  conversationHistory.push({
    role: 'user',
    content: userMessage
  });

  if (conversationHistory.length > 22) {
    const system = conversationHistory[0];
    conversationHistory = [system, ...conversationHistory.slice(-20)];
  }

  const stream = await openaiClient.chat.completions.create({
    model: 'gpt-4o',
    messages: conversationHistory,
    temperature: 0.3,
    max_tokens: 4000,
    stream: true,
  });

  let fullReply = '';

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content || '';
    if (delta) {
      fullReply += delta;
      onChunk(fullReply);
    }
  }

  conversationHistory.push({
    role: 'assistant',
    content: fullReply
  });

  onDone();
}
