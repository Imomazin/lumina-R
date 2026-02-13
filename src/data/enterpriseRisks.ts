// Enterprise Risk Dataset - 30 Risks matching user data structure
export interface EnterpriseRisk {
  riskId: number;
  riskCategory: 'Financial' | 'Operational' | 'Strategic' | 'Compliance' | 'Third Party' | 'Reputational' | 'AI Ethics' | 'People' | 'Cybersecurity';
  riskDescription: string;
  rootCause: string;
  likelihood: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  velocity: 'Slow' | 'Medium' | 'Fast';
  inherentRiskScore: number;
  existingControls: string;
  controlEffectiveness: 'Low' | 'Medium' | 'High';
  residualRiskScore: number;
  riskAppetiteAlignment: 'Within Appetite' | 'Outside Appetite';
  riskOwner: string;
  region: string;
  riskStatus: 'Open' | 'Escalated' | 'Under Review';
}

export const enterpriseRisks: EnterpriseRisk[] = [
  { riskId: 1, riskCategory: 'Financial', riskDescription: 'Revenue concentration risk from top 5 clients exceeding 60% of total revenue', rootCause: 'Lack of client diversification strategy and market expansion initiatives', likelihood: 4, impact: 4, velocity: 'Slow', inherentRiskScore: 16, existingControls: 'Client diversification program, revenue monitoring dashboard', controlEffectiveness: 'Low', residualRiskScore: 14, riskAppetiteAlignment: 'Within Appetite', riskOwner: 'CRO', region: 'Nigeria', riskStatus: 'Escalated' },
  { riskId: 2, riskCategory: 'Operational', riskDescription: 'Critical system downtime due to legacy infrastructure dependencies', rootCause: 'Aging IT infrastructure and deferred modernization investments', likelihood: 2, impact: 3, velocity: 'Fast', inherentRiskScore: 6, existingControls: 'Redundancy systems, disaster recovery plan, monitoring alerts', controlEffectiveness: 'Low', residualRiskScore: 3, riskAppetiteAlignment: 'Outside Appetite', riskOwner: 'CRO', region: 'Nigeria', riskStatus: 'Open' },
  { riskId: 3, riskCategory: 'Strategic', riskDescription: 'Market share erosion from emerging fintech competitors', rootCause: 'Slower digital transformation compared to agile competitors', likelihood: 3, impact: 4, velocity: 'Fast', inherentRiskScore: 8, existingControls: 'Digital transformation program, competitive intelligence monitoring', controlEffectiveness: 'Medium', residualRiskScore: 4, riskAppetiteAlignment: 'Within Appetite', riskOwner: 'CISO', region: 'US', riskStatus: 'Escalated' },
  { riskId: 4, riskCategory: 'Operational', riskDescription: 'Supply chain disruption affecting critical vendor relationships', rootCause: 'Single-source dependency for critical services and components', likelihood: 2, impact: 5, velocity: 'Medium', inherentRiskScore: 10, existingControls: 'Vendor risk assessment, alternative supplier identification', controlEffectiveness: 'Low', residualRiskScore: 6, riskAppetiteAlignment: 'Outside Appetite', riskOwner: 'Head of AI', region: 'EU', riskStatus: 'Under Review' },
  { riskId: 5, riskCategory: 'Compliance', riskDescription: 'GDPR/Data privacy regulatory non-compliance penalties', rootCause: 'Evolving regulatory requirements and data handling practices', likelihood: 3, impact: 3, velocity: 'Slow', inherentRiskScore: 9, existingControls: 'Privacy impact assessments, data mapping, consent management', controlEffectiveness: 'Medium', residualRiskScore: 5, riskAppetiteAlignment: 'Outside Appetite', riskOwner: 'CISO', region: 'Global', riskStatus: 'Escalated' },
  { riskId: 6, riskCategory: 'Third Party', riskDescription: 'Cloud service provider outage impacting business continuity', rootCause: 'Over-reliance on single cloud provider without multi-cloud strategy', likelihood: 5, impact: 3, velocity: 'Slow', inherentRiskScore: 15, existingControls: 'SLA monitoring, backup procedures, incident response plan', controlEffectiveness: 'Medium', residualRiskScore: 11, riskAppetiteAlignment: 'Within Appetite', riskOwner: 'HR Director', region: 'Global', riskStatus: 'Escalated' },
  { riskId: 7, riskCategory: 'Operational', riskDescription: 'Key person dependency risk in critical business functions', rootCause: 'Insufficient succession planning and knowledge documentation', likelihood: 4, impact: 4, velocity: 'Fast', inherentRiskScore: 16, existingControls: 'Succession planning, cross-training programs, knowledge base', controlEffectiveness: 'High', residualRiskScore: 8, riskAppetiteAlignment: 'Outside Appetite', riskOwner: 'CFO', region: 'Nigeria', riskStatus: 'Open' },
  { riskId: 8, riskCategory: 'Compliance', riskDescription: 'Anti-money laundering control failures and regulatory scrutiny', rootCause: 'Inadequate transaction monitoring and suspicious activity detection', likelihood: 2, impact: 4, velocity: 'Medium', inherentRiskScore: 8, existingControls: 'AML transaction monitoring, SAR filing process, KYC procedures', controlEffectiveness: 'High', residualRiskScore: 3, riskAppetiteAlignment: 'Outside Appetite', riskOwner: 'Head of AI', region: 'UK', riskStatus: 'Under Review' },
  { riskId: 9, riskCategory: 'Reputational', riskDescription: 'Social media crisis from negative customer experience amplification', rootCause: 'Gaps in customer service response and social media monitoring', likelihood: 4, impact: 4, velocity: 'Slow', inherentRiskScore: 16, existingControls: 'Social media monitoring, crisis communication plan, PR team', controlEffectiveness: 'High', residualRiskScore: 11, riskAppetiteAlignment: 'Within Appetite', riskOwner: 'CRO', region: 'US', riskStatus: 'Escalated' },
  { riskId: 10, riskCategory: 'AI Ethics', riskDescription: 'Algorithmic bias in credit scoring and lending decisions', rootCause: 'Training data bias and insufficient model fairness testing', likelihood: 3, impact: 5, velocity: 'Medium', inherentRiskScore: 15, existingControls: 'Bias testing protocols, model governance committee, explainability tools', controlEffectiveness: 'Low', residualRiskScore: 13, riskAppetiteAlignment: 'Outside Appetite', riskOwner: 'COO', region: 'UK', riskStatus: 'Under Review' },
  { riskId: 11, riskCategory: 'People', riskDescription: 'Critical talent attrition in technology and risk functions', rootCause: 'Competitive labor market and inadequate retention strategies', likelihood: 5, impact: 3, velocity: 'Slow', inherentRiskScore: 15, existingControls: 'Retention programs, competitive compensation, career development', controlEffectiveness: 'Medium', residualRiskScore: 10, riskAppetiteAlignment: 'Outside Appetite', riskOwner: 'CRO', region: 'Nigeria', riskStatus: 'Under Review' },
  { riskId: 12, riskCategory: 'Cybersecurity', riskDescription: 'Ransomware attack targeting critical business systems', rootCause: 'Evolving cyber threats and potential endpoint vulnerabilities', likelihood: 4, impact: 4, velocity: 'Fast', inherentRiskScore: 16, existingControls: 'EDR solutions, backup systems, incident response, security training', controlEffectiveness: 'High', residualRiskScore: 11, riskAppetiteAlignment: 'Outside Appetite', riskOwner: 'Head of AI', region: 'Nigeria', riskStatus: 'Open' },
  { riskId: 13, riskCategory: 'People', riskDescription: 'Workplace safety incidents and occupational health risks', rootCause: 'Return to office policies and evolving workplace requirements', likelihood: 4, impact: 5, velocity: 'Fast', inherentRiskScore: 20, existingControls: 'Safety protocols, incident reporting, health monitoring', controlEffectiveness: 'Low', residualRiskScore: 17, riskAppetiteAlignment: 'Outside Appetite', riskOwner: 'CFO', region: 'Global', riskStatus: 'Escalated' },
  { riskId: 14, riskCategory: 'Operational', riskDescription: 'Data quality issues impacting business decision-making', rootCause: 'Fragmented data sources and inadequate data governance', likelihood: 4, impact: 3, velocity: 'Fast', inherentRiskScore: 12, existingControls: 'Data quality framework, validation rules, data stewardship', controlEffectiveness: 'High', residualRiskScore: 9, riskAppetiteAlignment: 'Within Appetite', riskOwner: 'CRO', region: 'Nigeria', riskStatus: 'Under Review' },
  { riskId: 15, riskCategory: 'Operational', riskDescription: 'Business process failures from inadequate change management', rootCause: 'Rapid organizational changes without proper controls', likelihood: 3, impact: 3, velocity: 'Fast', inherentRiskScore: 9, existingControls: 'Change management framework, testing protocols, rollback procedures', controlEffectiveness: 'Medium', residualRiskScore: 5, riskAppetiteAlignment: 'Outside Appetite', riskOwner: 'CRO', region: 'UK', riskStatus: 'Open' },
  { riskId: 16, riskCategory: 'Third Party', riskDescription: 'Critical vendor insolvency or service discontinuation', rootCause: 'Economic pressures on vendors and lack of financial monitoring', likelihood: 2, impact: 3, velocity: 'Medium', inherentRiskScore: 6, existingControls: 'Vendor financial monitoring, exit strategies, alternative vendors', controlEffectiveness: 'Medium', residualRiskScore: 3, riskAppetiteAlignment: 'Within Appetite', riskOwner: 'CRO', region: 'EU', riskStatus: 'Open' },
  { riskId: 17, riskCategory: 'Compliance', riskDescription: 'Financial reporting errors and audit findings', rootCause: 'Complex accounting requirements and manual processes', likelihood: 4, impact: 3, velocity: 'Medium', inherentRiskScore: 12, existingControls: 'Internal controls, SOX compliance, internal audit', controlEffectiveness: 'Medium', residualRiskScore: 8, riskAppetiteAlignment: 'Within Appetite', riskOwner: 'COO', region: 'Nigeria', riskStatus: 'Under Review' },
  { riskId: 18, riskCategory: 'Operational', riskDescription: 'Product quality defects impacting customer satisfaction', rootCause: 'Accelerated development cycles and testing gaps', likelihood: 5, impact: 3, velocity: 'Slow', inherentRiskScore: 15, existingControls: 'QA processes, user acceptance testing, defect tracking', controlEffectiveness: 'High', residualRiskScore: 11, riskAppetiteAlignment: 'Within Appetite', riskOwner: 'CRO', region: 'UK', riskStatus: 'Under Review' },
  { riskId: 19, riskCategory: 'Financial', riskDescription: 'Foreign exchange volatility impacting international revenues', rootCause: 'Multi-currency operations and macroeconomic uncertainty', likelihood: 5, impact: 4, velocity: 'Slow', inherentRiskScore: 20, existingControls: 'Hedging program, FX risk monitoring, natural hedging', controlEffectiveness: 'High', residualRiskScore: 17, riskAppetiteAlignment: 'Outside Appetite', riskOwner: 'HR Director', region: 'UK', riskStatus: 'Open' },
  { riskId: 20, riskCategory: 'Third Party', riskDescription: 'Data breach through third-party vendor compromise', rootCause: 'Inadequate vendor security assessments and monitoring', likelihood: 5, impact: 3, velocity: 'Slow', inherentRiskScore: 15, existingControls: 'Vendor security assessments, contract clauses, access controls', controlEffectiveness: 'Medium', residualRiskScore: 11, riskAppetiteAlignment: 'Outside Appetite', riskOwner: 'CISO', region: 'Nigeria', riskStatus: 'Under Review' },
  { riskId: 21, riskCategory: 'Financial', riskDescription: 'Credit risk from deteriorating customer payment behavior', rootCause: 'Economic downturn and customer financial stress', likelihood: 2, impact: 3, velocity: 'Fast', inherentRiskScore: 6, existingControls: 'Credit scoring, collection procedures, provisioning', controlEffectiveness: 'Low', residualRiskScore: 3, riskAppetiteAlignment: 'Within Appetite', riskOwner: 'CRO', region: 'US', riskStatus: 'Open' },
  { riskId: 22, riskCategory: 'Strategic', riskDescription: 'Failed M&A integration impacting business synergies', rootCause: 'Complex integration requirements and cultural differences', likelihood: 3, impact: 5, velocity: 'Medium', inherentRiskScore: 15, existingControls: 'Integration planning, PMO oversight, milestone tracking', controlEffectiveness: 'High', residualRiskScore: 12, riskAppetiteAlignment: 'Within Appetite', riskOwner: 'CISO', region: 'Nigeria', riskStatus: 'Open' },
  { riskId: 23, riskCategory: 'Reputational', riskDescription: 'ESG/sustainability commitments not being met', rootCause: 'Ambitious targets without adequate implementation plans', likelihood: 5, impact: 4, velocity: 'Fast', inherentRiskScore: 20, existingControls: 'ESG reporting, sustainability program, stakeholder engagement', controlEffectiveness: 'Low', residualRiskScore: 18, riskAppetiteAlignment: 'Outside Appetite', riskOwner: 'Head of AI', region: 'Global', riskStatus: 'Under Review' },
  { riskId: 24, riskCategory: 'Compliance', riskDescription: 'Sanctions and export control violations', rootCause: 'Complex international operations and evolving sanctions regimes', likelihood: 4, impact: 5, velocity: 'Slow', inherentRiskScore: 20, existingControls: 'Sanctions screening, trade compliance training, monitoring', controlEffectiveness: 'Low', residualRiskScore: 18, riskAppetiteAlignment: 'Outside Appetite', riskOwner: 'COO', region: 'EU', riskStatus: 'Escalated' },
  { riskId: 25, riskCategory: 'Reputational', riskDescription: 'Executive misconduct or governance failures', rootCause: 'Inadequate tone at the top and ethics culture', likelihood: 3, impact: 5, velocity: 'Slow', inherentRiskScore: 15, existingControls: 'Code of conduct, whistleblower program, board oversight', controlEffectiveness: 'High', residualRiskScore: 11, riskAppetiteAlignment: 'Outside Appetite', riskOwner: 'CFO', region: 'Nigeria', riskStatus: 'Escalated' },
  { riskId: 26, riskCategory: 'Reputational', riskDescription: 'Product liability claims and consumer protection issues', rootCause: 'Product design flaws and inadequate safety testing', likelihood: 4, impact: 3, velocity: 'Medium', inherentRiskScore: 12, existingControls: 'Product testing, legal review, insurance coverage', controlEffectiveness: 'High', residualRiskScore: 9, riskAppetiteAlignment: 'Outside Appetite', riskOwner: 'Head of AI', region: 'Nigeria', riskStatus: 'Open' },
  { riskId: 27, riskCategory: 'People', riskDescription: 'Discrimination and harassment claims impacting culture', rootCause: 'Gaps in diversity policies and reporting mechanisms', likelihood: 2, impact: 5, velocity: 'Medium', inherentRiskScore: 10, existingControls: 'HR policies, training, investigation procedures', controlEffectiveness: 'Low', residualRiskScore: 4, riskAppetiteAlignment: 'Outside Appetite', riskOwner: 'HR Director', region: 'Global', riskStatus: 'Under Review' },
  { riskId: 28, riskCategory: 'Operational', riskDescription: 'Physical security breaches at facilities', rootCause: 'Aging security infrastructure and access control gaps', likelihood: 5, impact: 3, velocity: 'Fast', inherentRiskScore: 15, existingControls: 'Access controls, security personnel, CCTV monitoring', controlEffectiveness: 'Medium', residualRiskScore: 10, riskAppetiteAlignment: 'Outside Appetite', riskOwner: 'CRO', region: 'EU', riskStatus: 'Escalated' },
  { riskId: 29, riskCategory: 'Financial', riskDescription: 'Interest rate risk impacting borrowing costs and margins', rootCause: 'Variable rate debt and interest rate volatility', likelihood: 5, impact: 4, velocity: 'Slow', inherentRiskScore: 20, existingControls: 'Interest rate hedging, debt structure optimization', controlEffectiveness: 'High', residualRiskScore: 14, riskAppetiteAlignment: 'Within Appetite', riskOwner: 'CFO', region: 'US', riskStatus: 'Open' },
  { riskId: 30, riskCategory: 'Compliance', riskDescription: 'Consumer financial protection act violations', rootCause: 'Complex product disclosures and sales practices', likelihood: 4, impact: 4, velocity: 'Fast', inherentRiskScore: 20, existingControls: 'Compliance monitoring, disclosure reviews, sales training', controlEffectiveness: 'Low', residualRiskScore: 17, riskAppetiteAlignment: 'Outside Appetite', riskOwner: 'CFO', region: 'US', riskStatus: 'Under Review' },
];

// Helper functions
export const getRiskById = (id: number) => enterpriseRisks.find(r => r.riskId === id);
export const getRisksByCategory = (category: EnterpriseRisk['riskCategory']) =>
  enterpriseRisks.filter(r => r.riskCategory === category);
export const getHighRisks = () => enterpriseRisks.filter(r => r.inherentRiskScore >= 15);
export const getEscalatedRisks = () => enterpriseRisks.filter(r => r.riskStatus === 'Escalated');
export const getOutsideAppetiteRisks = () => enterpriseRisks.filter(r => r.riskAppetiteAlignment === 'Outside Appetite');
export const getRisksByOwner = (owner: string) => enterpriseRisks.filter(r => r.riskOwner === owner);
export const getRisksByRegion = (region: string) => enterpriseRisks.filter(r => r.region === region);

// Analytics
export const getRiskStats = () => {
  const total = enterpriseRisks.length;
  const escalated = getEscalatedRisks().length;
  const outsideAppetite = getOutsideAppetiteRisks().length;
  const highRisk = getHighRisks().length;
  const avgInherentScore = enterpriseRisks.reduce((sum, r) => sum + r.inherentRiskScore, 0) / total;
  const avgResidualScore = enterpriseRisks.reduce((sum, r) => sum + r.residualRiskScore, 0) / total;

  return {
    total,
    escalated,
    outsideAppetite,
    highRisk,
    avgInherentScore: Math.round(avgInherentScore * 10) / 10,
    avgResidualScore: Math.round(avgResidualScore * 10) / 10,
    controlEffectivenessDistribution: {
      low: enterpriseRisks.filter(r => r.controlEffectiveness === 'Low').length,
      medium: enterpriseRisks.filter(r => r.controlEffectiveness === 'Medium').length,
      high: enterpriseRisks.filter(r => r.controlEffectiveness === 'High').length,
    },
    categoryDistribution: {
      Financial: getRisksByCategory('Financial').length,
      Operational: getRisksByCategory('Operational').length,
      Strategic: getRisksByCategory('Strategic').length,
      Compliance: getRisksByCategory('Compliance').length,
      'Third Party': getRisksByCategory('Third Party').length,
      Reputational: getRisksByCategory('Reputational').length,
      'AI Ethics': getRisksByCategory('AI Ethics').length,
      People: getRisksByCategory('People').length,
      Cybersecurity: getRisksByCategory('Cybersecurity').length,
    },
  };
};
