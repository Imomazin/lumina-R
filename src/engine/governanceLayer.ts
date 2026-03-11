// ============================================================================
// LUMINA-R v2 ENGINE — GOVERNANCE LAYER
// Governance trigger engine, escalation rules, committee flagging
// ============================================================================

import {
  enterpriseRisks,
  getBreachedKRIs
} from './dataLayer';
import { calculateRiskEMV, calculateAppetiteBreachDeltas } from './quantificationLayer';
import { getImminentBreachWarnings } from './forecastLayer';

// ============================================================================
// GOVERNANCE CONFIGURATION
// ============================================================================

export const GOVERNANCE_CONFIG = {
  // EMV thresholds for escalation
  emvThresholds: {
    boardLevel: 5000000,       // £5M+ requires Board attention
    committeeLevel: 2000000,   // £2M+ requires Committee review
    executiveLevel: 1000000,   // £1M+ requires Executive attention
    managementLevel: 500000    // £500K+ requires Management monitoring
  },
  // Appetite breach percentages
  appetiteBreachThresholds: {
    critical: 20,  // 20%+ breach = critical
    high: 10,      // 10%+ breach = high priority
    medium: 5      // 5%+ breach = medium priority
  },
  // Control effectiveness thresholds
  controlThresholds: {
    tierOneMinEffectiveness: 70,  // Tier 1 risks need >70% control effectiveness
    auditFlagThreshold: 60        // <60% effectiveness flags for Audit
  },
  // Forecast breach window (days)
  forecastBreachWindow: 60,
  // KRI breach thresholds
  kriBreachThresholds: {
    criticalBreachCount: 5,   // 5+ breached KRIs = critical
    concerningBreachRate: 20  // 20%+ breach rate = concerning
  }
};

// ============================================================================
// GOVERNANCE FLAG TYPES
// ============================================================================

export type GovernanceBody =
  | 'Board'
  | 'Risk Committee'
  | 'Audit Committee'
  | 'Executive Committee'
  | 'Management'
  | 'Operational';

export type FlagSeverity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Advisory';

export interface GovernanceFlag {
  flagId: string;
  riskId: number | null;
  riskDescription: string | null;
  category: string | null;
  targetBody: GovernanceBody;
  severity: FlagSeverity;
  triggerRule: string;
  triggerValue: string;
  threshold: string;
  recommendation: string;
  requiredAction: string;
  deadline: string;
  status: 'New' | 'Acknowledged' | 'In Progress' | 'Resolved';
}

// ============================================================================
// GOVERNANCE RULE EVALUATORS
// ============================================================================

function evaluateEMVThresholdRules(): GovernanceFlag[] {
  const flags: GovernanceFlag[] = [];

  for (const risk of enterpriseRisks) {
    const emv = calculateRiskEMV(risk);

    if (emv.residualEMV >= GOVERNANCE_CONFIG.emvThresholds.boardLevel) {
      flags.push({
        flagId: `EMV-BOARD-${risk.riskId}`,
        riskId: risk.riskId,
        riskDescription: risk.riskDescription,
        category: risk.riskCategory,
        targetBody: 'Board',
        severity: 'Critical',
        triggerRule: 'Residual EMV exceeds Board threshold',
        triggerValue: `£${emv.residualEMV.toLocaleString()}`,
        threshold: `£${GOVERNANCE_CONFIG.emvThresholds.boardLevel.toLocaleString()}`,
        recommendation: 'Immediate Board briefing required. Consider strategic risk treatment options.',
        requiredAction: 'Board Risk Report + Treatment Plan',
        deadline: '7 days',
        status: 'New'
      });
    } else if (emv.residualEMV >= GOVERNANCE_CONFIG.emvThresholds.committeeLevel) {
      flags.push({
        flagId: `EMV-COMMITTEE-${risk.riskId}`,
        riskId: risk.riskId,
        riskDescription: risk.riskDescription,
        category: risk.riskCategory,
        targetBody: 'Risk Committee',
        severity: 'High',
        triggerRule: 'Residual EMV exceeds Committee threshold',
        triggerValue: `£${emv.residualEMV.toLocaleString()}`,
        threshold: `£${GOVERNANCE_CONFIG.emvThresholds.committeeLevel.toLocaleString()}`,
        recommendation: 'Include in next Risk Committee agenda. Assess control enhancement options.',
        requiredAction: 'Committee Paper + Control Review',
        deadline: '14 days',
        status: 'New'
      });
    }
  }

  return flags;
}

function evaluateAppetiteBreachRules(): GovernanceFlag[] {
  const flags: GovernanceFlag[] = [];
  const breachDeltas = calculateAppetiteBreachDeltas();

  for (const delta of breachDeltas) {
    if (delta.status === 'Breached') {
      const severity: FlagSeverity = delta.breachPercent >= GOVERNANCE_CONFIG.appetiteBreachThresholds.critical
        ? 'Critical'
        : delta.breachPercent >= GOVERNANCE_CONFIG.appetiteBreachThresholds.high
          ? 'High'
          : 'Medium';

      const targetBody: GovernanceBody = severity === 'Critical'
        ? 'Board'
        : severity === 'High'
          ? 'Risk Committee'
          : 'Executive Committee';

      flags.push({
        flagId: `APPETITE-${delta.category.toUpperCase()}`,
        riskId: null,
        riskDescription: null,
        category: delta.category,
        targetBody,
        severity,
        triggerRule: 'Risk appetite breach detected',
        triggerValue: `Level ${delta.currentLevel} (${delta.breachPercent}% over tolerance)`,
        threshold: `Max tolerance: ${delta.toleranceMax}`,
        recommendation: `Review all ${delta.category} risks. Determine if appetite needs adjustment or risks need treatment.`,
        requiredAction: 'Appetite Review + Category Risk Assessment',
        deadline: severity === 'Critical' ? '7 days' : '21 days',
        status: 'New'
      });
    }
  }

  return flags;
}

function evaluateControlEffectivenessRules(): GovernanceFlag[] {
  const flags: GovernanceFlag[] = [];

  // Check Tier 1 risks (high inherent score) with weak controls
  const tier1Risks = enterpriseRisks.filter(r => r.inherentRiskScore >= 15);

  for (const risk of tier1Risks) {
    if (risk.controlEffectiveness === 'Low') {
      flags.push({
        flagId: `CTRL-AUDIT-${risk.riskId}`,
        riskId: risk.riskId,
        riskDescription: risk.riskDescription,
        category: risk.riskCategory,
        targetBody: 'Audit Committee',
        severity: 'High',
        triggerRule: 'Tier 1 risk with Low control effectiveness',
        triggerValue: `Control effectiveness: ${risk.controlEffectiveness}`,
        threshold: `Minimum required: High for Tier 1 risks`,
        recommendation: 'Urgent control enhancement required. Consider independent assessment.',
        requiredAction: 'Control Remediation Plan + Audit Review',
        deadline: '30 days',
        status: 'New'
      });
    }
  }

  return flags;
}

function evaluateForecastBreachRules(): GovernanceFlag[] {
  const flags: GovernanceFlag[] = [];
  const warnings = getImminentBreachWarnings();

  for (const warning of warnings) {
    if (warning.projectedBreachDay <= GOVERNANCE_CONFIG.forecastBreachWindow) {
      const severity: FlagSeverity = warning.urgency === 'Immediate' ? 'Critical' : 'High';
      const targetBody: GovernanceBody = warning.urgency === 'Immediate'
        ? 'Executive Committee'
        : 'Risk Committee';

      flags.push({
        flagId: `FORECAST-${warning.riskId}`,
        riskId: warning.riskId,
        riskDescription: warning.riskDescription,
        category: warning.category,
        targetBody,
        severity,
        triggerRule: 'Forecasted appetite breach within monitoring window',
        triggerValue: `Projected breach in ${warning.projectedBreachDay} days`,
        threshold: `Monitoring window: ${GOVERNANCE_CONFIG.forecastBreachWindow} days`,
        recommendation: 'Pre-emptive action required to prevent breach. Review trajectory and intervention options.',
        requiredAction: 'Intervention Plan + Progress Monitoring',
        deadline: `${Math.max(7, warning.projectedBreachDay - 14)} days`,
        status: 'New'
      });
    }
  }

  return flags;
}

function evaluateKRIBreachRules(): GovernanceFlag[] {
  const flags: GovernanceFlag[] = [];
  const breachedKRIs = getBreachedKRIs();

  if (breachedKRIs.length >= GOVERNANCE_CONFIG.kriBreachThresholds.criticalBreachCount) {
    flags.push({
      flagId: 'KRI-BREACH-COUNT',
      riskId: null,
      riskDescription: null,
      category: 'Portfolio-wide',
      targetBody: 'Risk Committee',
      severity: 'High',
      triggerRule: 'Excessive KRI breaches detected',
      triggerValue: `${breachedKRIs.length} KRIs in breach (Red status)`,
      threshold: `Critical threshold: ${GOVERNANCE_CONFIG.kriBreachThresholds.criticalBreachCount}`,
      recommendation: 'Systemic issue possible. Review all breached KRIs for common patterns.',
      requiredAction: 'KRI Root Cause Analysis + Remediation Plan',
      deadline: '21 days',
      status: 'New'
    });
  }

  // Flag individual critical KRI breaches
  const adverseKRIs = breachedKRIs.filter(k => k.trend === 'Up');
  for (const kri of adverseKRIs.slice(0, 5)) {  // Top 5 most concerning
    const breachPercent = Math.round(((kri.currentValue - kri.threshold) / kri.threshold) * 100);
    if (breachPercent >= 50) {
      flags.push({
        flagId: `KRI-CRITICAL-${kri.kriId}`,
        riskId: kri.riskId,
        riskDescription: `KRI: ${kri.indicator}`,
        category: null,
        targetBody: 'Executive Committee',
        severity: 'High',
        triggerRule: 'Critical KRI breach with adverse trend',
        triggerValue: `${breachPercent}% over threshold, trending Up`,
        threshold: `Threshold: ${kri.threshold}`,
        recommendation: 'Immediate attention required. KRI indicates significant risk materialization.',
        requiredAction: 'Root Cause Investigation + Corrective Action',
        deadline: '14 days',
        status: 'New'
      });
    }
  }

  return flags;
}

function evaluateEscalatedRiskRules(): GovernanceFlag[] {
  const flags: GovernanceFlag[] = [];
  const escalatedRisks = enterpriseRisks.filter(r => r.riskStatus === 'Escalated');

  if (escalatedRisks.length > 10) {
    flags.push({
      flagId: 'ESCALATION-COUNT',
      riskId: null,
      riskDescription: null,
      category: 'Portfolio-wide',
      targetBody: 'Executive Committee',
      severity: 'Medium',
      triggerRule: 'High number of escalated risks',
      triggerValue: `${escalatedRisks.length} risks currently escalated`,
      threshold: 'Advisory: >10 escalated risks',
      recommendation: 'Review escalation backlog. Prioritize resolution and resource allocation.',
      requiredAction: 'Escalation Triage + Resource Assessment',
      deadline: '30 days',
      status: 'New'
    });
  }

  return flags;
}

// ============================================================================
// MAIN GOVERNANCE EVALUATION
// ============================================================================

export interface GovernanceEvaluationResult {
  evaluationTimestamp: string;
  totalFlags: number;
  flagsBySeverity: Record<FlagSeverity, number>;
  flagsByBody: Record<GovernanceBody, number>;
  flags: GovernanceFlag[];
  criticalActions: GovernanceFlag[];
  nextBoardItems: GovernanceFlag[];
  nextCommitteeItems: GovernanceFlag[];
  summary: {
    requiresImmediateAction: boolean;
    boardAttentionRequired: boolean;
    portfolioHealth: 'Healthy' | 'Concerning' | 'Critical';
  };
}

export function evaluateGovernanceTriggers(): GovernanceEvaluationResult {
  // Collect all flags from different rule evaluators
  const allFlags = [
    ...evaluateEMVThresholdRules(),
    ...evaluateAppetiteBreachRules(),
    ...evaluateControlEffectivenessRules(),
    ...evaluateForecastBreachRules(),
    ...evaluateKRIBreachRules(),
    ...evaluateEscalatedRiskRules()
  ];

  // Calculate summaries
  const flagsBySeverity = allFlags.reduce((acc, f) => {
    acc[f.severity] = (acc[f.severity] || 0) + 1;
    return acc;
  }, {} as Record<FlagSeverity, number>);

  const flagsByBody = allFlags.reduce((acc, f) => {
    acc[f.targetBody] = (acc[f.targetBody] || 0) + 1;
    return acc;
  }, {} as Record<GovernanceBody, number>);

  const criticalActions = allFlags.filter(f => f.severity === 'Critical');
  const nextBoardItems = allFlags.filter(f => f.targetBody === 'Board');
  const nextCommitteeItems = allFlags.filter(f =>
    f.targetBody === 'Risk Committee' || f.targetBody === 'Audit Committee'
  );

  // Determine portfolio health
  let portfolioHealth: 'Healthy' | 'Concerning' | 'Critical';
  if (criticalActions.length > 0 || (flagsBySeverity['High'] || 0) > 5) {
    portfolioHealth = 'Critical';
  } else if ((flagsBySeverity['High'] || 0) > 2 || (flagsBySeverity['Medium'] || 0) > 5) {
    portfolioHealth = 'Concerning';
  } else {
    portfolioHealth = 'Healthy';
  }

  return {
    evaluationTimestamp: new Date().toISOString(),
    totalFlags: allFlags.length,
    flagsBySeverity,
    flagsByBody,
    flags: allFlags.sort((a, b) => {
      const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3, Advisory: 4 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }),
    criticalActions,
    nextBoardItems,
    nextCommitteeItems,
    summary: {
      requiresImmediateAction: criticalActions.length > 0,
      boardAttentionRequired: nextBoardItems.length > 0,
      portfolioHealth
    }
  };
}

// ============================================================================
// GOVERNANCE CALENDAR
// ============================================================================

export interface GovernanceCalendarItem {
  body: GovernanceBody;
  flagCount: number;
  highestSeverity: FlagSeverity;
  topFlags: GovernanceFlag[];
  recommendedAgendaItems: string[];
}

export function generateGovernanceCalendar(): GovernanceCalendarItem[] {
  const evaluation = evaluateGovernanceTriggers();
  const bodies: GovernanceBody[] = [
    'Board', 'Risk Committee', 'Audit Committee', 'Executive Committee'
  ];

  return bodies.map(body => {
    const bodyFlags = evaluation.flags.filter(f => f.targetBody === body);
    const severities = bodyFlags.map(f => f.severity);

    let highestSeverity: FlagSeverity = 'Advisory';
    if (severities.includes('Critical')) highestSeverity = 'Critical';
    else if (severities.includes('High')) highestSeverity = 'High';
    else if (severities.includes('Medium')) highestSeverity = 'Medium';
    else if (severities.includes('Low')) highestSeverity = 'Low';

    const recommendedAgendaItems = bodyFlags
      .slice(0, 5)
      .map(f => f.triggerRule + (f.riskId ? ` (Risk #${f.riskId})` : ''));

    return {
      body,
      flagCount: bodyFlags.length,
      highestSeverity,
      topFlags: bodyFlags.slice(0, 5),
      recommendedAgendaItems
    };
  }).filter(item => item.flagCount > 0);
}
