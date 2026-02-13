// Enterprise Controls Dataset - 25 Controls matching user data structure
export interface EnterpriseControl {
  controlId: string;
  controlName: string;
  controlType: 'Preventive' | 'Detective' | 'Corrective';
  automationLevel: 'Manual' | 'Semi Automated' | 'Automated';
  owner: string;
  mappedRiskIds: number[];
  effectivenessScore?: number;
  lastTestedDate?: string;
  testFrequency?: 'Monthly' | 'Quarterly' | 'Annually';
}

export const enterpriseControls: EnterpriseControl[] = [
  { controlId: 'C1', controlName: 'Revenue Concentration Monitoring Dashboard', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'COO', mappedRiskIds: [9, 19, 12], effectivenessScore: 72, lastTestedDate: '2024-12-15', testFrequency: 'Monthly' },
  { controlId: 'C2', controlName: 'Infrastructure Health Monitoring System', controlType: 'Preventive', automationLevel: 'Automated', owner: 'COO', mappedRiskIds: [6, 19, 24], effectivenessScore: 85, lastTestedDate: '2024-12-01', testFrequency: 'Monthly' },
  { controlId: 'C3', controlName: 'Competitive Intelligence Analysis', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CFO', mappedRiskIds: [28, 2, 4], effectivenessScore: 68, lastTestedDate: '2024-11-20', testFrequency: 'Quarterly' },
  { controlId: 'C4', controlName: 'Vendor Risk Assessment Framework', controlType: 'Preventive', automationLevel: 'Automated', owner: 'HR Director', mappedRiskIds: [27, 24, 2], effectivenessScore: 78, lastTestedDate: '2024-10-15', testFrequency: 'Quarterly' },
  { controlId: 'C5', controlName: 'Data Privacy Impact Assessments', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'Head of AI', mappedRiskIds: [19, 1, 25], effectivenessScore: 82, lastTestedDate: '2024-12-10', testFrequency: 'Monthly' },
  { controlId: 'C6', controlName: 'Cloud Service SLA Monitoring', controlType: 'Preventive', automationLevel: 'Automated', owner: 'Head of AI', mappedRiskIds: [16, 6, 24], effectivenessScore: 91, lastTestedDate: '2024-12-20', testFrequency: 'Monthly' },
  { controlId: 'C7', controlName: 'Succession Planning Program', controlType: 'Preventive', automationLevel: 'Manual', owner: 'COO', mappedRiskIds: [18, 8, 28], effectivenessScore: 65, lastTestedDate: '2024-09-01', testFrequency: 'Annually' },
  { controlId: 'C8', controlName: 'AML Transaction Monitoring System', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CFO', mappedRiskIds: [3, 7, 30], effectivenessScore: 88, lastTestedDate: '2024-12-15', testFrequency: 'Monthly' },
  { controlId: 'C9', controlName: 'Social Media Monitoring & Response', controlType: 'Preventive', automationLevel: 'Semi Automated', owner: 'HR Director', mappedRiskIds: [1, 5, 9], effectivenessScore: 76, lastTestedDate: '2024-11-30', testFrequency: 'Monthly' },
  { controlId: 'C10', controlName: 'AI Model Bias Testing Protocol', controlType: 'Preventive', automationLevel: 'Manual', owner: 'Head of AI', mappedRiskIds: [18, 14, 23], effectivenessScore: 71, lastTestedDate: '2024-12-05', testFrequency: 'Quarterly' },
  { controlId: 'C11', controlName: 'Employee Retention Program', controlType: 'Preventive', automationLevel: 'Manual', owner: 'CISO', mappedRiskIds: [21, 12, 10], effectivenessScore: 69, lastTestedDate: '2024-10-01', testFrequency: 'Quarterly' },
  { controlId: 'C12', controlName: 'Endpoint Detection & Response', controlType: 'Corrective', automationLevel: 'Semi Automated', owner: 'Head of AI', mappedRiskIds: [15, 30, 16], effectivenessScore: 86, lastTestedDate: '2024-12-18', testFrequency: 'Monthly' },
  { controlId: 'C13', controlName: 'Workplace Safety Incident Response', controlType: 'Corrective', automationLevel: 'Semi Automated', owner: 'HR Director', mappedRiskIds: [29, 6, 5], effectivenessScore: 74, lastTestedDate: '2024-11-15', testFrequency: 'Monthly' },
  { controlId: 'C14', controlName: 'Data Quality Validation Rules', controlType: 'Detective', automationLevel: 'Manual', owner: 'COO', mappedRiskIds: [5, 22, 24], effectivenessScore: 67, lastTestedDate: '2024-12-01', testFrequency: 'Monthly' },
  { controlId: 'C15', controlName: 'Change Management Advisory Board', controlType: 'Corrective', automationLevel: 'Semi Automated', owner: 'CISO', mappedRiskIds: [18, 5, 19], effectivenessScore: 79, lastTestedDate: '2024-12-10', testFrequency: 'Monthly' },
  { controlId: 'C16', controlName: 'Vendor Financial Health Screening', controlType: 'Preventive', automationLevel: 'Automated', owner: 'CRO', mappedRiskIds: [17, 8, 6], effectivenessScore: 83, lastTestedDate: '2024-11-25', testFrequency: 'Quarterly' },
  { controlId: 'C17', controlName: 'SOX Compliance Testing Program', controlType: 'Detective', automationLevel: 'Automated', owner: 'HR Director', mappedRiskIds: [21, 11, 14], effectivenessScore: 92, lastTestedDate: '2024-12-20', testFrequency: 'Quarterly' },
  { controlId: 'C18', controlName: 'Product Quality Assurance Testing', controlType: 'Detective', automationLevel: 'Manual', owner: 'COO', mappedRiskIds: [5, 11, 8], effectivenessScore: 73, lastTestedDate: '2024-12-12', testFrequency: 'Monthly' },
  { controlId: 'C19', controlName: 'FX Hedging Strategy Review', controlType: 'Corrective', automationLevel: 'Manual', owner: 'HR Director', mappedRiskIds: [17, 4, 13], effectivenessScore: 81, lastTestedDate: '2024-11-01', testFrequency: 'Monthly' },
  { controlId: 'C20', controlName: 'Third Party Security Assessments', controlType: 'Detective', automationLevel: 'Semi Automated', owner: 'CRO', mappedRiskIds: [23, 28, 8], effectivenessScore: 77, lastTestedDate: '2024-12-08', testFrequency: 'Quarterly' },
  { controlId: 'C21', controlName: 'Credit Risk Scoring Model', controlType: 'Corrective', automationLevel: 'Manual', owner: 'HR Director', mappedRiskIds: [10, 25, 2], effectivenessScore: 84, lastTestedDate: '2024-12-15', testFrequency: 'Monthly' },
  { controlId: 'C22', controlName: 'M&A Integration PMO', controlType: 'Corrective', automationLevel: 'Automated', owner: 'CISO', mappedRiskIds: [14, 18, 24], effectivenessScore: 70, lastTestedDate: '2024-10-20', testFrequency: 'Monthly' },
  { controlId: 'C23', controlName: 'ESG Reporting Framework', controlType: 'Corrective', automationLevel: 'Automated', owner: 'CFO', mappedRiskIds: [28, 10, 3], effectivenessScore: 66, lastTestedDate: '2024-11-30', testFrequency: 'Quarterly' },
  { controlId: 'C24', controlName: 'Sanctions Screening System', controlType: 'Detective', automationLevel: 'Manual', owner: 'CRO', mappedRiskIds: [7, 3, 15], effectivenessScore: 89, lastTestedDate: '2024-12-18', testFrequency: 'Monthly' },
  { controlId: 'C25', controlName: 'Ethics Hotline & Investigation Process', controlType: 'Preventive', automationLevel: 'Manual', owner: 'COO', mappedRiskIds: [19, 24, 11], effectivenessScore: 75, lastTestedDate: '2024-12-01', testFrequency: 'Quarterly' },
];

// Helper functions
export const getControlById = (id: string) => enterpriseControls.find(c => c.controlId === id);
export const getControlsByRiskId = (riskId: number) => enterpriseControls.filter(c => c.mappedRiskIds.includes(riskId));
export const getControlsByType = (type: EnterpriseControl['controlType']) => enterpriseControls.filter(c => c.controlType === type);
export const getControlsByOwner = (owner: string) => enterpriseControls.filter(c => c.owner === owner);
export const getAutomatedControls = () => enterpriseControls.filter(c => c.automationLevel === 'Automated');
export const getManualControls = () => enterpriseControls.filter(c => c.automationLevel === 'Manual');

// Analytics
export const getControlStats = () => {
  const total = enterpriseControls.length;
  const avgEffectiveness = enterpriseControls.reduce((sum, c) => sum + (c.effectivenessScore || 0), 0) / total;

  return {
    total,
    avgEffectiveness: Math.round(avgEffectiveness),
    byType: {
      preventive: getControlsByType('Preventive').length,
      detective: getControlsByType('Detective').length,
      corrective: getControlsByType('Corrective').length,
    },
    byAutomation: {
      automated: getAutomatedControls().length,
      semiAutomated: enterpriseControls.filter(c => c.automationLevel === 'Semi Automated').length,
      manual: getManualControls().length,
    },
    lowEffectivenessControls: enterpriseControls.filter(c => (c.effectivenessScore || 0) < 70),
    highEffectivenessControls: enterpriseControls.filter(c => (c.effectivenessScore || 0) >= 85),
    riskCoverage: calculateRiskCoverage(),
  };
};

const calculateRiskCoverage = () => {
  const allRiskIds = new Set<number>();
  enterpriseControls.forEach(c => c.mappedRiskIds.forEach(id => allRiskIds.add(id)));
  return {
    risksWithControls: allRiskIds.size,
    totalRisks: 30,
    coveragePercent: Math.round((allRiskIds.size / 30) * 100),
  };
};

export const getControlEffectivenessScore = () => {
  const stats = getControlStats();
  return stats.avgEffectiveness;
};
