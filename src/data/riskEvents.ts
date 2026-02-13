// Risk Events Dataset - 40 Events matching user data structure
export interface RiskEvent {
  eventId: number;
  relatedRiskId: number;
  eventDescription: string;
  eventDate: string;
  financialImpact: number;
  operationalImpact: 'Low' | 'Medium' | 'High';
  rootCauseConfirmed: boolean;
}

export const riskEvents: RiskEvent[] = [
  { eventId: 101, relatedRiskId: 29, eventDescription: 'Interest rate spike causing margin compression on variable rate facilities', eventDate: '2024-03-29', financialImpact: 334113, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 102, relatedRiskId: 12, eventDescription: 'Ransomware attack on secondary data center - contained within 4 hours', eventDate: '2024-11-20', financialImpact: 1087299, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 103, relatedRiskId: 21, eventDescription: 'Large customer bankruptcy resulting in significant write-off', eventDate: '2025-01-13', financialImpact: 1203356, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 104, relatedRiskId: 22, eventDescription: 'M&A integration delay - system consolidation postponed 3 months', eventDate: '2024-03-13', financialImpact: 477693, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 105, relatedRiskId: 20, eventDescription: 'Third-party vendor data breach exposing 10,000 customer records', eventDate: '2024-01-26', financialImpact: 645130, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 106, relatedRiskId: 30, eventDescription: 'CFPB enforcement action for disclosure violations', eventDate: '2024-03-27', financialImpact: 1339148, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 107, relatedRiskId: 17, eventDescription: 'External audit material weakness finding on revenue recognition', eventDate: '2024-09-23', financialImpact: 1222556, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 108, relatedRiskId: 16, eventDescription: 'Critical vendor sudden service discontinuation notice', eventDate: '2024-11-09', financialImpact: 1028006, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 109, relatedRiskId: 11, eventDescription: 'Key executive sudden resignation - Chief Risk Officer', eventDate: '2024-01-31', financialImpact: 1200175, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 110, relatedRiskId: 13, eventDescription: 'Workplace safety incident - office evacuation required', eventDate: '2024-01-14', financialImpact: 283719, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 111, relatedRiskId: 5, eventDescription: 'GDPR regulatory fine for consent management failures', eventDate: '2024-10-20', financialImpact: 1320900, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 112, relatedRiskId: 18, eventDescription: 'Major product defect recall affecting 5,000 units', eventDate: '2024-07-23', financialImpact: 435089, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 113, relatedRiskId: 30, eventDescription: 'State AG investigation into sales practices', eventDate: '2024-11-16', financialImpact: 1256675, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 114, relatedRiskId: 8, eventDescription: 'AML transaction monitoring system failure - 6 hour gap', eventDate: '2025-05-02', financialImpact: 1129706, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 115, relatedRiskId: 26, eventDescription: 'Product liability lawsuit filed - class action potential', eventDate: '2024-10-23', financialImpact: 603095, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 116, relatedRiskId: 9, eventDescription: 'Viral social media incident - negative brand trending', eventDate: '2024-01-20', financialImpact: 308553, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 117, relatedRiskId: 14, eventDescription: 'Data quality issue causing incorrect customer billing for 2 months', eventDate: '2025-04-06', financialImpact: 1226441, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 118, relatedRiskId: 17, eventDescription: 'Financial restatement required for previous quarter', eventDate: '2024-10-05', financialImpact: 1293120, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 119, relatedRiskId: 21, eventDescription: 'Credit loss spike in emerging market portfolio', eventDate: '2024-07-19', financialImpact: 1498110, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 120, relatedRiskId: 25, eventDescription: 'Executive conduct investigation launched by board', eventDate: '2025-02-02', financialImpact: 836087, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 121, relatedRiskId: 18, eventDescription: 'Customer satisfaction scores dropped 15 points', eventDate: '2024-02-29', financialImpact: 463709, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 122, relatedRiskId: 30, eventDescription: 'Consumer protection enforcement letter received', eventDate: '2024-05-03', financialImpact: 1043476, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 123, relatedRiskId: 10, eventDescription: 'AI lending model bias detected in protected class outcomes', eventDate: '2024-04-28', financialImpact: 928949, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 124, relatedRiskId: 14, eventDescription: 'Critical reporting system data feed failure', eventDate: '2024-02-22', financialImpact: 614696, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 125, relatedRiskId: 18, eventDescription: 'Product launch delayed due to quality failures', eventDate: '2024-03-30', financialImpact: 1259695, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 126, relatedRiskId: 13, eventDescription: 'OSHA inspection finding - multiple citations', eventDate: '2024-06-20', financialImpact: 309956, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 127, relatedRiskId: 12, eventDescription: 'Phishing attack compromised 50 employee accounts', eventDate: '2024-03-11', financialImpact: 968069, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 128, relatedRiskId: 1, eventDescription: 'Top 3 client revenue concentration exceeded 70%', eventDate: '2025-05-06', financialImpact: 893525, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 129, relatedRiskId: 18, eventDescription: 'Major software bug affecting core functionality', eventDate: '2025-05-01', financialImpact: 640467, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 130, relatedRiskId: 19, eventDescription: 'FX hedging strategy losses during market volatility', eventDate: '2024-11-27', financialImpact: 1470527, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 131, relatedRiskId: 14, eventDescription: 'Master data management failure affecting downstream systems', eventDate: '2025-04-01', financialImpact: 591028, operationalImpact: 'Medium', rootCauseConfirmed: true },
  { eventId: 132, relatedRiskId: 2, eventDescription: 'Core banking system unplanned outage - 8 hours', eventDate: '2024-09-14', financialImpact: 802124, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 133, relatedRiskId: 19, eventDescription: 'Currency devaluation in key operating region', eventDate: '2024-03-21', financialImpact: 1467234, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 134, relatedRiskId: 15, eventDescription: 'Failed system migration rollback required', eventDate: '2024-07-21', financialImpact: 696283, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 135, relatedRiskId: 13, eventDescription: 'Employee injury requiring medical attention', eventDate: '2025-02-14', financialImpact: 769326, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 136, relatedRiskId: 19, eventDescription: 'Interest rate derivative accounting error', eventDate: '2024-02-27', financialImpact: 616112, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 137, relatedRiskId: 30, eventDescription: 'State examination findings requiring remediation', eventDate: '2024-06-22', financialImpact: 880642, operationalImpact: 'Low', rootCauseConfirmed: true },
  { eventId: 138, relatedRiskId: 26, eventDescription: 'Product safety recall notification received', eventDate: '2024-07-05', financialImpact: 1092141, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 139, relatedRiskId: 13, eventDescription: 'COVID-19 outbreak at regional office', eventDate: '2025-03-01', financialImpact: 57272, operationalImpact: 'High', rootCauseConfirmed: true },
  { eventId: 140, relatedRiskId: 20, eventDescription: 'Vendor security audit revealed critical gaps', eventDate: '2024-12-09', financialImpact: 793795, operationalImpact: 'Low', rootCauseConfirmed: true },
];

// Helper functions
export const getEventById = (id: number) => riskEvents.find(e => e.eventId === id);
export const getEventsByRiskId = (riskId: number) => riskEvents.filter(e => e.relatedRiskId === riskId);
export const getRecentEvents = (days: number = 90) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return riskEvents.filter(e => new Date(e.eventDate) >= cutoff);
};
export const getHighImpactEvents = () => riskEvents.filter(e => e.operationalImpact === 'High');

// Analytics
export const getEventStats = () => {
  const total = riskEvents.length;
  const totalFinancialImpact = riskEvents.reduce((sum, e) => sum + e.financialImpact, 0);
  const avgFinancialImpact = totalFinancialImpact / total;

  return {
    total,
    totalFinancialImpact,
    avgFinancialImpact: Math.round(avgFinancialImpact),
    byOperationalImpact: {
      high: riskEvents.filter(e => e.operationalImpact === 'High').length,
      medium: riskEvents.filter(e => e.operationalImpact === 'Medium').length,
      low: riskEvents.filter(e => e.operationalImpact === 'Low').length,
    },
    topRisksWithEvents: getTopRisksWithEvents(),
    recentTrend: calculateEventTrend(),
  };
};

const getTopRisksWithEvents = () => {
  const riskEventCounts = new Map<number, { count: number; totalImpact: number }>();
  riskEvents.forEach(e => {
    const existing = riskEventCounts.get(e.relatedRiskId) || { count: 0, totalImpact: 0 };
    riskEventCounts.set(e.relatedRiskId, {
      count: existing.count + 1,
      totalImpact: existing.totalImpact + e.financialImpact,
    });
  });
  return Array.from(riskEventCounts.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);
};

const calculateEventTrend = () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const recentEvents = riskEvents.filter(e => new Date(e.eventDate) >= sixMonthsAgo);
  const olderEvents = riskEvents.filter(e => new Date(e.eventDate) < sixMonthsAgo);
  return {
    recentCount: recentEvents.length,
    olderCount: olderEvents.length,
    trend: recentEvents.length > olderEvents.length ? 'increasing' : 'decreasing',
  };
};
