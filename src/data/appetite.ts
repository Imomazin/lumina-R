import type { RiskAppetite } from '../types';

export const riskAppetite: RiskAppetite[] = [
  {
    category: 'strategic',
    statement: 'We accept measured strategic risk in pursuit of market leadership and innovation, provided initiatives align with our long-term vision and stakeholder expectations.',
    currentLevel: 62,
    toleranceMin: 40,
    toleranceMax: 70,
    status: 'within',
    rationale: [
      'Digital transformation investments aligned with 5-year strategy',
      'Market expansion balanced with core business protection',
      'Innovation initiatives subject to staged gate reviews',
      'Strategic partnerships evaluated for long-term value creation',
    ],
    lastReviewed: '2024-02-15',
    approvedBy: 'Board Risk Committee',
  },
  {
    category: 'financial',
    statement: 'We maintain conservative financial risk tolerance to ensure stability, adequate liquidity, and sustainable returns while meeting all regulatory capital requirements.',
    currentLevel: 45,
    toleranceMin: 30,
    toleranceMax: 55,
    status: 'within',
    rationale: [
      'Capital ratios maintained above regulatory minimums plus buffer',
      'Liquidity reserves sufficient for stressed conditions',
      'Credit exposure limits enforced by sector and counterparty',
      'Interest rate risk managed through active ALM program',
    ],
    lastReviewed: '2024-03-01',
    approvedBy: 'Board Risk Committee',
  },
  {
    category: 'operational',
    statement: 'We have low tolerance for operational failures that could impact customers, reputation, or regulatory standing. Resilience and reliability are paramount.',
    currentLevel: 58,
    toleranceMin: 25,
    toleranceMax: 50,
    status: 'approaching',
    rationale: [
      'Business continuity capabilities tested quarterly',
      'Critical system availability targets set at 99.9%',
      'Incident response procedures regularly drilled',
      'Third-party dependencies actively managed and monitored',
    ],
    lastReviewed: '2024-02-28',
    approvedBy: 'Executive Risk Committee',
  },
  {
    category: 'compliance',
    statement: 'We have zero tolerance for material compliance breaches. Full adherence to regulatory requirements and ethical standards is non-negotiable.',
    currentLevel: 35,
    toleranceMin: 0,
    toleranceMax: 30,
    status: 'approaching',
    rationale: [
      'Regulatory obligations tracked and monitored continuously',
      'Compliance training mandatory for all staff',
      'Regulatory relationships proactively managed',
      'Internal audit program provides independent assurance',
    ],
    lastReviewed: '2024-03-10',
    approvedBy: 'Board Audit Committee',
  },
  {
    category: 'cyber',
    statement: 'We maintain minimal tolerance for cyber risk given the critical nature of data protection and system integrity. Defense in depth is our core principle.',
    currentLevel: 52,
    toleranceMin: 20,
    toleranceMax: 45,
    status: 'breached',
    rationale: [
      'Multi-layered security controls deployed across all systems',
      'Continuous monitoring and threat intelligence integration',
      'Regular penetration testing and red team exercises',
      'Employee security awareness program with phishing simulations',
    ],
    lastReviewed: '2024-03-15',
    approvedBy: 'CISO / Executive Risk Committee',
  },
  {
    category: 'reputational',
    statement: 'We have very low tolerance for activities that could damage our brand, stakeholder trust, or market position. Reputation is a strategic asset.',
    currentLevel: 38,
    toleranceMin: 20,
    toleranceMax: 45,
    status: 'within',
    rationale: [
      'ESG commitments integrated into business decisions',
      'Stakeholder communication managed proactively',
      'Crisis management protocols established and tested',
      'Brand monitoring and sentiment analysis performed continuously',
    ],
    lastReviewed: '2024-02-20',
    approvedBy: 'Board Risk Committee',
  },
];

// Helper functions
export const getAppetiteByCategory = (category: RiskAppetite['category']): RiskAppetite | undefined => {
  return riskAppetite.find(a => a.category === category);
};

export const getBreachedAppetites = (): RiskAppetite[] => {
  return riskAppetite.filter(a => a.status === 'breached');
};

export const getApproachingAppetites = (): RiskAppetite[] => {
  return riskAppetite.filter(a => a.status === 'approaching');
};

export const getAppetiteStatusCounts = () => {
  return {
    within: riskAppetite.filter(a => a.status === 'within').length,
    approaching: riskAppetite.filter(a => a.status === 'approaching').length,
    breached: riskAppetite.filter(a => a.status === 'breached').length,
  };
};
