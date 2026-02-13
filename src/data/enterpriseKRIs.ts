// Enterprise KRI Dataset - 40 KRIs matching user data structure
export interface EnterpriseKRI {
  kriId: number;
  riskId: number;
  indicator: string;
  currentValue: number;
  threshold: number;
  trend: 'Stable' | 'Up' | 'Down';
  status: 'Red' | 'Amber' | 'Green';
}

export const enterpriseKRIs: EnterpriseKRI[] = [
  { kriId: 1, riskId: 28, indicator: 'Physical Security Incidents (Monthly)', currentValue: 19, threshold: 7, trend: 'Stable', status: 'Red' },
  { kriId: 2, riskId: 15, indicator: 'Change Failure Rate (%)', currentValue: 3, threshold: 3, trend: 'Up', status: 'Amber' },
  { kriId: 3, riskId: 9, indicator: 'Negative Social Mentions', currentValue: 16, threshold: 7, trend: 'Stable', status: 'Red' },
  { kriId: 4, riskId: 11, indicator: 'Critical Vacancy Duration (Days)', currentValue: 19, threshold: 6, trend: 'Stable', status: 'Red' },
  { kriId: 5, riskId: 30, indicator: 'Compliance Violation Count', currentValue: 13, threshold: 5, trend: 'Up', status: 'Red' },
  { kriId: 6, riskId: 2, indicator: 'System Uptime (%)', currentValue: 10, threshold: 10, trend: 'Down', status: 'Red' },
  { kriId: 7, riskId: 7, indicator: 'Key Person Risk Score', currentValue: 20, threshold: 8, trend: 'Down', status: 'Red' },
  { kriId: 8, riskId: 10, indicator: 'AI Model Bias Score', currentValue: 4, threshold: 10, trend: 'Up', status: 'Amber' },
  { kriId: 9, riskId: 17, indicator: 'Audit Finding Closure Rate (%)', currentValue: 5, threshold: 10, trend: 'Up', status: 'Red' },
  { kriId: 10, riskId: 11, indicator: 'Employee Turnover Rate (%)', currentValue: 5, threshold: 4, trend: 'Down', status: 'Red' },
  { kriId: 11, riskId: 7, indicator: 'Cross-Training Completion (%)', currentValue: 16, threshold: 3, trend: 'Stable', status: 'Red' },
  { kriId: 12, riskId: 1, indicator: 'Top Client Revenue Concentration (%)', currentValue: 20, threshold: 8, trend: 'Up', status: 'Red' },
  { kriId: 13, riskId: 10, indicator: 'Model Explainability Score', currentValue: 10, threshold: 9, trend: 'Up', status: 'Red' },
  { kriId: 14, riskId: 24, indicator: 'Sanctions Screening Match Rate', currentValue: 7, threshold: 6, trend: 'Down', status: 'Red' },
  { kriId: 15, riskId: 16, indicator: 'Vendor Financial Health Score', currentValue: 12, threshold: 4, trend: 'Stable', status: 'Red' },
  { kriId: 16, riskId: 13, indicator: 'Safety Incident Rate', currentValue: 9, threshold: 10, trend: 'Up', status: 'Amber' },
  { kriId: 17, riskId: 30, indicator: 'Customer Complaint Rate', currentValue: 5, threshold: 9, trend: 'Down', status: 'Amber' },
  { kriId: 18, riskId: 29, indicator: 'Interest Rate Exposure ($M)', currentValue: 17, threshold: 8, trend: 'Down', status: 'Red' },
  { kriId: 19, riskId: 30, indicator: 'Regulatory Inquiry Count', currentValue: 2, threshold: 10, trend: 'Up', status: 'Amber' },
  { kriId: 20, riskId: 5, indicator: 'Data Privacy Incidents', currentValue: 10, threshold: 9, trend: 'Up', status: 'Red' },
  { kriId: 21, riskId: 8, indicator: 'Suspicious Activity Report Volume', currentValue: 14, threshold: 7, trend: 'Down', status: 'Amber' },
  { kriId: 22, riskId: 24, indicator: 'Export Control Violations', currentValue: 6, threshold: 4, trend: 'Stable', status: 'Red' },
  { kriId: 23, riskId: 25, indicator: 'Ethics Hotline Calls', currentValue: 10, threshold: 3, trend: 'Up', status: 'Red' },
  { kriId: 24, riskId: 4, indicator: 'Critical Vendor Score', currentValue: 6, threshold: 9, trend: 'Stable', status: 'Amber' },
  { kriId: 25, riskId: 28, indicator: 'Access Control Failures', currentValue: 20, threshold: 8, trend: 'Up', status: 'Red' },
  { kriId: 26, riskId: 18, indicator: 'Product Defect Rate (%)', currentValue: 3, threshold: 4, trend: 'Stable', status: 'Amber' },
  { kriId: 27, riskId: 10, indicator: 'AI Decision Override Rate (%)', currentValue: 2, threshold: 10, trend: 'Up', status: 'Amber' },
  { kriId: 28, riskId: 20, indicator: 'Third Party Breach Incidents', currentValue: 2, threshold: 9, trend: 'Up', status: 'Amber' },
  { kriId: 29, riskId: 16, indicator: 'Vendor SLA Breach Count', currentValue: 17, threshold: 3, trend: 'Up', status: 'Red' },
  { kriId: 30, riskId: 30, indicator: 'CFPB Complaint Rate', currentValue: 1, threshold: 7, trend: 'Up', status: 'Amber' },
  { kriId: 31, riskId: 13, indicator: 'Workers Comp Claims', currentValue: 8, threshold: 6, trend: 'Stable', status: 'Red' },
  { kriId: 32, riskId: 2, indicator: 'Infrastructure Age Score', currentValue: 19, threshold: 7, trend: 'Down', status: 'Red' },
  { kriId: 33, riskId: 8, indicator: 'KYC Rejection Rate (%)', currentValue: 15, threshold: 8, trend: 'Up', status: 'Red' },
  { kriId: 34, riskId: 8, indicator: 'AML Alert False Positive Rate (%)', currentValue: 5, threshold: 5, trend: 'Down', status: 'Red' },
  { kriId: 35, riskId: 2, indicator: 'Mean Time to Recovery (Hours)', currentValue: 13, threshold: 5, trend: 'Up', status: 'Red' },
  { kriId: 36, riskId: 6, indicator: 'Cloud Service Availability (%)', currentValue: 16, threshold: 7, trend: 'Down', status: 'Red' },
  { kriId: 37, riskId: 15, indicator: 'Change Rollback Rate (%)', currentValue: 4, threshold: 10, trend: 'Up', status: 'Amber' },
  { kriId: 38, riskId: 21, indicator: 'Days Sales Outstanding', currentValue: 8, threshold: 8, trend: 'Stable', status: 'Red' },
  { kriId: 39, riskId: 1, indicator: 'Revenue Volatility Index', currentValue: 18, threshold: 8, trend: 'Up', status: 'Red' },
  { kriId: 40, riskId: 5, indicator: 'GDPR Data Subject Requests Backlog', currentValue: 3, threshold: 8, trend: 'Down', status: 'Amber' },
];

// Helper functions
export const getKRIById = (id: number) => enterpriseKRIs.find(k => k.kriId === id);
export const getKRIsByRiskId = (riskId: number) => enterpriseKRIs.filter(k => k.riskId === riskId);
export const getBreachedKRIs = () => enterpriseKRIs.filter(k => k.status === 'Red');
export const getKRIsByStatus = (status: EnterpriseKRI['status']) => enterpriseKRIs.filter(k => k.status === status);
export const getKRIsWithTrend = (trend: EnterpriseKRI['trend']) => enterpriseKRIs.filter(k => k.trend === trend);

// Analytics
export const getKRIStats = () => {
  const total = enterpriseKRIs.length;
  const red = getKRIsByStatus('Red').length;
  const amber = getKRIsByStatus('Amber').length;
  const green = getKRIsByStatus('Green').length;
  const increasing = getKRIsWithTrend('Up').length;
  const decreasing = getKRIsWithTrend('Down').length;
  const stable = getKRIsWithTrend('Stable').length;

  return {
    total,
    byStatus: { red, amber, green },
    byTrend: { increasing, decreasing, stable },
    breachRate: Math.round((red / total) * 100),
    criticalKRIs: enterpriseKRIs.filter(k => k.status === 'Red' && k.currentValue > k.threshold * 2),
  };
};

export const getKRIHealthScore = () => {
  const stats = getKRIStats();
  // Health score: Green = 100pts, Amber = 50pts, Red = 0pts
  const score = (stats.byStatus.green * 100 + stats.byStatus.amber * 50) / stats.total;
  return Math.round(score);
};
