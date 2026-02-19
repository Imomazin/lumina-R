// ============================================================================
// LUMINA-R AI SERVICE - Deterministic Risk Intelligence Engine
// Enterprise-grade quantitative reasoning
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
  getBreachedKRIs,
  getKRIHealthScore
} from '../data/enterpriseKRIs';
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
// QUANTITATIVE ENGINE (Precomputed Deterministic EMV)
// ============================================================================

function calculateEMV(risk: any) {
  const likelihoodMap: Record<number, number> = {
    1: 0.05,
    2: 0.15,
    3: 0.35,
    4: 0.55,
    5: 0.8
  };

  const impactMap: Record<number, number> = {
    1: 100000,
    2: 500000,
    3: 1500000,
    4: 5000000,
    5: 15000000
  };

  const controlFactorMap: Record<string, number> = {
    High: 0.7,
    Medium: 0.45,
    Low: 0.2
  };

  const probability = likelihoodMap[risk.likelihood] || 0;
  const financialImpact = impactMap[risk.impact] || 0;
  const inherentEMV = probability * financialImpact;

  const controlFactor = controlFactorMap[risk.controlEffectiveness] || 0.45;
  const residualEMV = inherentEMV * (1 - controlFactor);

  return {
    probability,
    financialImpact,
    inherentEMV,
    residualEMV
  };
}

// ============================================================================
// DATA SNAPSHOT BUILDER
// ============================================================================

function buildDataSnapshot(): string {
  const riskStats = getRiskStats();
  const kriStats = getKRIStats();
  const controlStats = getControlStats();
  const breachedAppetites = getBreachedAppetites();
  const escalated = getEscalatedRisks();
  const outsideAppetite = getOutsideAppetiteRisks();
  const breachedKRIs = getBreachedKRIs();

  const topRisks = [...enterpriseRisks]
    .sort((a, b) => b.residualRiskScore - a.residualRiskScore)
    .slice(0, 30)
    .map(r => {
      const emv = calculateEMV(r);
      return {
        id: r.riskId,
        category: r.riskCategory,
        likelihood: r.likelihood,
        impactScore: r.impact,
        probability: emv.probability,
        financialImpact: emv.financialImpact,
        inherentEMV: emv.inherentEMV,
        residualEMV: emv.residualEMV,
        controlEffectiveness: r.controlEffectiveness,
        owner: r.riskOwner,
        status: r.riskStatus
      };
    });

  return `
PORTFOLIO SUMMARY:
Total Risks: ${riskStats.total}
Escalated: ${riskStats.escalated}
Outside Appetite: ${riskStats.outsideAppetite}
Average Residual Score: ${riskStats.avgResidualScore}

KRI SUMMARY:
Breached KRIs: ${kriStats.byStatus.red}
Health Score: ${getKRIHealthScore()}%

CONTROL SUMMARY:
Total Controls: ${controlStats.total}
Avg Effectiveness: ${controlStats.avgEffectiveness}%

TOP RISKS (WITH PRECOMPUTED EMV):
${JSON.stringify(topRisks, null, 2)}

ESCALATED RISKS:
${escalated.map(r => `Risk#${r.riskId} Score:${r.residualRiskScore}`).join('\n')}

BREACHED APPETITES:
${breachedAppetites.map(a => a.category).join(', ') || 'None'}
`;
}

// ============================================================================
// SYSTEM PROMPT
// ============================================================================

function buildSystemPrompt(): string {
  return `
You are Lumina R's Chief Risk Intelligence Engine.

You operate with deterministic quantitative reasoning.

CRITICAL:
- Use ONLY the provided dataset.
- Do NOT invent numbers.
- Use precomputed probability, inherentEMV, and residualEMV fields.
- Provide board-ready structured responses.

REQUIRED RESPONSE STRUCTURE:

EXECUTIVE SUMMARY
QUANTITATIVE ANALYSIS
RISK INTELLIGENCE INSIGHT
DECISION PATH (0-7 days / 30 days / 90 days)
GOVERNANCE IMPLICATIONS

All financial figures must be in £ GBP.

${buildDataSnapshot()}
`;
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
  if (!openaiClient) getApiKey();
  if (!openaiClient) throw new Error('API key not configured');

  if (conversationHistory.length === 0) {
    conversationHistory.push({
      role: 'system',
      content: buildSystemPrompt()
    });
  }

  conversationHistory.push({ role: 'user', content: userMessage });

  if (conversationHistory.length > 22) {
    const system = conversationHistory[0];
    conversationHistory = [system, ...conversationHistory.slice(-20)];
  }

  const completion = await openaiClient.chat.completions.create({
    model: 'gpt-4.1',
    messages: conversationHistory,
    temperature: 0.15,
    max_tokens: 3000
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

  if (conversationHistory.length === 0) {
    conversationHistory.push({
      role: 'system',
      content: buildSystemPrompt()
    });
  }

  conversationHistory.push({ role: 'user', content: userMessage });

  const stream = await openaiClient.chat.completions.create({
    model: 'gpt-4.1',
    messages: conversationHistory,
    temperature: 0.15,
    max_tokens: 3000,
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
