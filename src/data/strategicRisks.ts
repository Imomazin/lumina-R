// Tier 4 Strategic Risk Register - Sample Data
// Includes worked example R-STR-004 from specification

import type { StrategicRisk, ThresholdConfig } from '../types';
import {
  calculateWeightedImpact,
  calculateOverallRiskScore,
  calculateSimpleEMV,
  calculateTriangularEMV,
  calculateCapitalAllocation,
  calculateEBITDAExposure,
  determineRiskColour,
  determineEscalationTriggers,
} from '../services/strategicRiskEngine';

// Company threshold configuration
export const companyThresholdConfig: ThresholdConfig = {
  annualEBITDA: 50_000_000, // £50M
  greenScoreMax: 7,
  greenEMVMax: 100_000,
  amberScoreMax: 13,
  amberEMVMax: 500_000,
  mandatoryMitigationThreshold: 10,
  executiveCommitteeScoreThreshold: 13,
  cfoReviewEMVThreshold: 500_000,
  strategicBoardThreshold: 4,
};

// Helper to build a complete strategic risk with calculations
function buildStrategicRisk(
  partial: Partial<StrategicRisk>,
  config: ThresholdConfig = companyThresholdConfig
): StrategicRisk {
  const impactDimensions = partial.impactDimensions!;
  const financialEstimate = partial.financialEstimate!;
  const probability = partial.probability!;
  const probabilityPercent = partial.probabilityPercent ?? probability * 20;

  const weightedImpactScore = calculateWeightedImpact(impactDimensions);
  const overallRiskScore = calculateOverallRiskScore(probability, weightedImpactScore);
  const simpleEMV = calculateSimpleEMV(probabilityPercent, financialEstimate.mostLikely);
  const expectedMonetaryValue = calculateTriangularEMV(probabilityPercent, financialEstimate);
  const capitalAllocationRequired = calculateCapitalAllocation(financialEstimate);
  const ebitdaExposurePercent = calculateEBITDAExposure(
    financialEstimate.worstCase,
    config.annualEBITDA
  );
  const colour = determineRiskColour(
    overallRiskScore,
    expectedMonetaryValue,
    ebitdaExposurePercent,
    impactDimensions.legal,
    config
  );

  const risk: StrategicRisk = {
    id: partial.id!,
    title: partial.title!,
    description: partial.description!,
    category: partial.category!,
    owner: partial.owner!,
    department: partial.department!,
    dateIdentified: partial.dateIdentified!,
    lastReviewed: partial.lastReviewed!,
    nextReview: partial.nextReview!,
    tags: partial.tags ?? [],
    probability,
    probabilityPercent,
    impactDimensions,
    weightedImpactScore,
    overallRiskScore,
    financialEstimate,
    expectedMonetaryValue,
    simpleEMV,
    capitalAllocationRequired,
    ebitdaExposurePercent,
    colour,
    escalationTriggers: [],
    status: partial.status ?? 'active',
    currentControls: partial.currentControls ?? [],
    mitigationOptions: partial.mitigationOptions ?? [],
    residualRiskScore: partial.residualRiskScore ?? overallRiskScore * 0.7,
    interdependencies: partial.interdependencies ?? [],
    interdependencyScore: partial.interdependencyScore ?? 1,
    earlyWarningIndicators: partial.earlyWarningIndicators ?? [],
    trend: partial.trend ?? 'stable',
    riskVelocity: partial.riskVelocity ?? 'moderate',
    maturityIndex: partial.maturityIndex ?? 3,
    linkedKRIs: partial.linkedKRIs ?? [],
    linkedObjectiveIds: partial.linkedObjectiveIds ?? [],
    lastModifiedBy: partial.lastModifiedBy ?? 'System',
    lastModifiedAt: partial.lastModifiedAt ?? new Date().toISOString(),
  };

  // Calculate escalation triggers after building base risk
  risk.escalationTriggers = determineEscalationTriggers(risk, config);

  return risk;
}

// ============================================
// WORKED EXAMPLE: R-STR-004
// Regulatory AI Compliance Shock
// ============================================

export const workedExample: StrategicRisk = buildStrategicRisk({
  id: 'R-STR-004',
  title: 'Regulatory AI Compliance Shock',
  description:
    'Emerging AI regulations (EU AI Act and UK counterparts) may require significant system modifications, compliance investments, and potential service restrictions. The regulatory landscape is evolving rapidly with enforcement expected within 18 months. Failure to comply could result in market access restrictions, substantial fines, and reputational damage.',
  category: 'compliance',
  owner: 'Chief Compliance Officer',
  department: 'Legal & Compliance',
  dateIdentified: '2024-01-15',
  lastReviewed: '2024-02-01',
  nextReview: '2024-03-01',
  tags: ['AI', 'regulatory', 'EU AI Act', 'compliance', 'strategic'],

  // Section B: Qualitative Risk Analysis
  probability: 4, // Likely
  probabilityPercent: 70, // 70%
  impactDimensions: {
    financial: 4, // Major
    operational: 3, // Moderate
    reputational: 4, // Major
    strategic: 4, // Major
    legal: 4, // Major
  },

  // Section C: Financial Model
  financialEstimate: {
    bestCase: 500_000, // £500k
    mostLikely: 2_000_000, // £2M
    worstCase: 8_000_000, // £8M
    confidenceLevel: 75,
  },

  status: 'active',
  currentControls: [
    'Quarterly regulatory horizon scanning',
    'External legal advisory retainer',
    'AI model documentation process',
    'Preliminary gap assessment completed',
  ],
  mitigationOptions: [
    {
      id: 'MIT-004-01',
      name: 'AI Governance Framework Implementation',
      description:
        'Establish comprehensive AI governance framework including model inventory, risk classification, and documentation standards aligned with EU AI Act requirements.',
      cost: 350_000,
      riskReductionValue: 800_000,
      netBenefit: 450_000,
      newResidualScore: 9.8,
      implementationTime: '6 months',
      owner: 'Head of AI Ethics',
      status: 'approved',
    },
    {
      id: 'MIT-004-02',
      name: 'Compliance Technology Platform',
      description:
        'Procure and deploy automated compliance monitoring and reporting platform for AI systems.',
      cost: 200_000,
      riskReductionValue: 400_000,
      netBenefit: 200_000,
      newResidualScore: 8.5,
      implementationTime: '4 months',
      owner: 'CTO',
      status: 'proposed',
    },
    {
      id: 'MIT-004-03',
      name: 'Regulatory Engagement Programme',
      description:
        'Proactive engagement with regulators and industry bodies to shape compliance requirements and demonstrate good faith.',
      cost: 75_000,
      riskReductionValue: 300_000,
      netBenefit: 225_000,
      newResidualScore: 10.2,
      implementationTime: '3 months',
      owner: 'Head of Government Affairs',
      status: 'in_progress',
    },
  ],

  interdependencies: [
    {
      linkedRiskId: 'R-STR-001',
      relationshipType: 'amplifies',
      strength: 7,
      description: 'Regulatory changes could amplify digital transformation risks',
    },
    {
      linkedRiskId: 'R-STR-003',
      relationshipType: 'correlates',
      strength: 5,
      description: 'Correlates with broader technology risk exposure',
    },
  ],
  interdependencyScore: 6,

  earlyWarningIndicators: [
    {
      id: 'EWI-004-01',
      name: 'Regulatory Announcement Frequency',
      currentValue: 4,
      threshold: 6,
      trend: 'increasing',
      scoreBumpAmount: 2,
    },
    {
      id: 'EWI-004-02',
      name: 'Competitor Compliance Actions',
      currentValue: 3,
      threshold: 5,
      trend: 'increasing',
      scoreBumpAmount: 1,
    },
  ],

  trend: 'increasing',
  riskVelocity: 'moderate',
  maturityIndex: 3,
  linkedKRIs: ['KRI-COMP-001', 'KRI-COMP-003', 'KRI-TECH-002'],
  linkedObjectiveIds: ['OBJ-STR-01', 'OBJ-STR-03'],
  lastModifiedBy: 'Jane Smith',
  lastModifiedAt: '2024-02-01T14:30:00Z',
});

// ============================================
// ADDITIONAL STRATEGIC RISKS
// ============================================

export const strategicRisks: StrategicRisk[] = [
  // R-STR-001: Digital Transformation Failure
  buildStrategicRisk({
    id: 'R-STR-001',
    title: 'Digital Transformation Programme Failure',
    description:
      'The enterprise-wide digital transformation programme may fail to deliver expected benefits due to technology complexity, change resistance, or integration challenges. This could result in stranded costs, competitive disadvantage, and operational disruption.',
    category: 'strategic',
    owner: 'Chief Digital Officer',
    department: 'Digital & Technology',
    dateIdentified: '2023-06-01',
    lastReviewed: '2024-01-15',
    nextReview: '2024-04-15',
    tags: ['digital', 'transformation', 'technology', 'strategic'],
    probability: 3,
    probabilityPercent: 50,
    impactDimensions: {
      financial: 5,
      operational: 4,
      reputational: 3,
      strategic: 5,
      legal: 1,
    },
    financialEstimate: {
      bestCase: 2_000_000,
      mostLikely: 8_000_000,
      worstCase: 15_000_000,
      confidenceLevel: 60,
    },
    status: 'active',
    currentControls: [
      'Monthly programme steering committee',
      'Independent programme assurance',
      'Agile delivery methodology',
      'Change management workstream',
    ],
    mitigationOptions: [
      {
        id: 'MIT-001-01',
        name: 'Programme Restructure',
        description: 'Restructure into smaller, independent deliverables with clear value milestones.',
        cost: 500_000,
        riskReductionValue: 2_500_000,
        netBenefit: 2_000_000,
        newResidualScore: 10.5,
        implementationTime: '3 months',
        owner: 'Programme Director',
        status: 'approved',
      },
    ],
    interdependencies: [
      {
        linkedRiskId: 'R-STR-003',
        relationshipType: 'causes',
        strength: 8,
        description: 'Digital transformation failure would expose technology vulnerabilities',
      },
    ],
    interdependencyScore: 7,
    trend: 'stable',
    riskVelocity: 'slow',
    maturityIndex: 4,
  }),

  // R-STR-002: Key Talent Attrition
  buildStrategicRisk({
    id: 'R-STR-002',
    title: 'Critical Talent Attrition',
    description:
      'Risk of losing key personnel in critical roles (technology, risk, leadership) to competitors offering higher compensation and remote work flexibility. Talent market remains highly competitive with specific skills in short supply.',
    category: 'operational',
    owner: 'Chief People Officer',
    department: 'Human Resources',
    dateIdentified: '2023-09-01',
    lastReviewed: '2024-02-01',
    nextReview: '2024-03-01',
    tags: ['talent', 'retention', 'HR', 'operational'],
    probability: 4,
    probabilityPercent: 65,
    impactDimensions: {
      financial: 3,
      operational: 4,
      reputational: 2,
      strategic: 3,
      legal: 1,
    },
    financialEstimate: {
      bestCase: 200_000,
      mostLikely: 800_000,
      worstCase: 2_000_000,
      confidenceLevel: 80,
    },
    status: 'active',
    currentControls: [
      'Competitive compensation review',
      'Flexible working policy',
      'Succession planning for critical roles',
      'Employee engagement surveys',
    ],
    mitigationOptions: [
      {
        id: 'MIT-002-01',
        name: 'Retention Bonus Scheme',
        description: 'Targeted retention bonuses for top 50 critical role holders.',
        cost: 750_000,
        riskReductionValue: 1_200_000,
        netBenefit: 450_000,
        newResidualScore: 6.8,
        implementationTime: '2 months',
        owner: 'HR Director',
        status: 'in_progress',
      },
    ],
    trend: 'stable',
    riskVelocity: 'moderate',
    maturityIndex: 4,
  }),

  // R-STR-003: Major Cyber Security Breach
  buildStrategicRisk({
    id: 'R-STR-003',
    title: 'Major Cyber Security Breach',
    description:
      'Risk of a significant cyber security incident resulting in data breach, system compromise, or ransomware attack. Threat landscape continues to evolve with increasing sophistication of attack vectors.',
    category: 'cyber',
    owner: 'Chief Information Security Officer',
    department: 'Information Security',
    dateIdentified: '2023-01-01',
    lastReviewed: '2024-02-01',
    nextReview: '2024-03-01',
    tags: ['cyber', 'security', 'data', 'breach', 'ransomware'],
    probability: 3,
    probabilityPercent: 45,
    impactDimensions: {
      financial: 5,
      operational: 5,
      reputational: 5,
      strategic: 4,
      legal: 4,
    },
    financialEstimate: {
      bestCase: 1_000_000,
      mostLikely: 5_000_000,
      worstCase: 20_000_000,
      confidenceLevel: 55,
    },
    status: 'active',
    currentControls: [
      '24/7 Security Operations Centre',
      'Multi-factor authentication',
      'Endpoint detection and response',
      'Annual penetration testing',
      'Cyber insurance coverage',
    ],
    mitigationOptions: [
      {
        id: 'MIT-003-01',
        name: 'Zero Trust Architecture',
        description: 'Implement zero trust network architecture across all systems.',
        cost: 1_200_000,
        riskReductionValue: 4_000_000,
        netBenefit: 2_800_000,
        newResidualScore: 8.2,
        implementationTime: '12 months',
        owner: 'CISO',
        status: 'approved',
      },
    ],
    interdependencies: [
      {
        linkedRiskId: 'R-STR-001',
        relationshipType: 'caused_by',
        strength: 6,
        description: 'Digital transformation may introduce new attack vectors',
      },
    ],
    interdependencyScore: 5,
    trend: 'increasing',
    riskVelocity: 'rapid',
    maturityIndex: 4,
  }),

  // R-STR-004: Worked Example
  workedExample,

  // R-STR-005: Economic Downturn Impact
  buildStrategicRisk({
    id: 'R-STR-005',
    title: 'Economic Downturn Revenue Impact',
    description:
      'Macroeconomic deterioration could significantly impact revenue through reduced client spending, delayed projects, and increased pricing pressure. Early indicators suggest potential recession in key markets.',
    category: 'financial',
    owner: 'Chief Financial Officer',
    department: 'Finance',
    dateIdentified: '2023-11-01',
    lastReviewed: '2024-02-01',
    nextReview: '2024-03-01',
    tags: ['economic', 'financial', 'revenue', 'recession'],
    probability: 3,
    probabilityPercent: 55,
    impactDimensions: {
      financial: 5,
      operational: 3,
      reputational: 2,
      strategic: 4,
      legal: 1,
    },
    financialEstimate: {
      bestCase: 3_000_000,
      mostLikely: 7_000_000,
      worstCase: 12_000_000,
      confidenceLevel: 65,
    },
    status: 'active',
    currentControls: [
      'Monthly revenue forecasting',
      'Client pipeline monitoring',
      'Cost reduction contingency plans',
      'Diversified client portfolio',
    ],
    mitigationOptions: [
      {
        id: 'MIT-005-01',
        name: 'Revenue Diversification',
        description: 'Accelerate expansion into counter-cyclical service lines.',
        cost: 400_000,
        riskReductionValue: 1_500_000,
        netBenefit: 1_100_000,
        newResidualScore: 9.5,
        implementationTime: '6 months',
        owner: 'Chief Revenue Officer',
        status: 'proposed',
      },
    ],
    trend: 'increasing',
    riskVelocity: 'moderate',
    maturityIndex: 4,
  }),

  // R-STR-006: Supply Chain Disruption
  buildStrategicRisk({
    id: 'R-STR-006',
    title: 'Critical Vendor/Supply Chain Failure',
    description:
      'Risk of significant operational disruption due to failure or material deterioration of critical third-party vendors including cloud providers, software vendors, and business process outsourcers.',
    category: 'operational',
    owner: 'Chief Operating Officer',
    department: 'Operations',
    dateIdentified: '2023-04-01',
    lastReviewed: '2024-01-15',
    nextReview: '2024-04-15',
    tags: ['vendor', 'supply chain', 'third party', 'operational'],
    probability: 2,
    probabilityPercent: 35,
    impactDimensions: {
      financial: 4,
      operational: 5,
      reputational: 3,
      strategic: 3,
      legal: 2,
    },
    financialEstimate: {
      bestCase: 500_000,
      mostLikely: 2_500_000,
      worstCase: 6_000_000,
      confidenceLevel: 70,
    },
    status: 'active',
    currentControls: [
      'Vendor risk assessment programme',
      'Multi-vendor strategy for critical services',
      'Business continuity plans',
      'Contract SLA monitoring',
    ],
    mitigationOptions: [
      {
        id: 'MIT-006-01',
        name: 'Vendor Redundancy Programme',
        description: 'Establish secondary vendors for all tier-1 dependencies.',
        cost: 300_000,
        riskReductionValue: 900_000,
        netBenefit: 600_000,
        newResidualScore: 5.2,
        implementationTime: '9 months',
        owner: 'Procurement Director',
        status: 'in_progress',
      },
    ],
    trend: 'stable',
    riskVelocity: 'slow',
    maturityIndex: 3,
  }),

  // R-STR-007: Climate & ESG Transition Risk
  buildStrategicRisk({
    id: 'R-STR-007',
    title: 'Climate & ESG Transition Risk',
    description:
      'Failure to adequately address climate change commitments and ESG expectations could result in client attrition, investor pressure, regulatory penalties, and reputational damage. Stakeholder expectations are accelerating.',
    category: 'strategic',
    owner: 'Chief Sustainability Officer',
    department: 'Sustainability',
    dateIdentified: '2023-07-01',
    lastReviewed: '2024-01-01',
    nextReview: '2024-04-01',
    tags: ['ESG', 'climate', 'sustainability', 'strategic'],
    probability: 3,
    probabilityPercent: 45,
    impactDimensions: {
      financial: 3,
      operational: 2,
      reputational: 4,
      strategic: 4,
      legal: 3,
    },
    financialEstimate: {
      bestCase: 300_000,
      mostLikely: 1_500_000,
      worstCase: 4_000_000,
      confidenceLevel: 60,
    },
    status: 'active',
    currentControls: [
      'Net zero roadmap published',
      'Annual ESG reporting',
      'Science-based targets commitment',
      'ESG governance committee',
    ],
    mitigationOptions: [
      {
        id: 'MIT-007-01',
        name: 'Accelerated Decarbonisation',
        description: 'Accelerate net zero timeline and expand scope 3 initiatives.',
        cost: 600_000,
        riskReductionValue: 1_200_000,
        netBenefit: 600_000,
        newResidualScore: 7.5,
        implementationTime: '12 months',
        owner: 'Head of Climate Strategy',
        status: 'approved',
      },
    ],
    trend: 'increasing',
    riskVelocity: 'moderate',
    maturityIndex: 3,
  }),

  // R-STR-008: Market Share Loss to Competitors
  buildStrategicRisk({
    id: 'R-STR-008',
    title: 'Market Share Erosion',
    description:
      'Risk of significant market share loss to aggressive competitors and new market entrants leveraging disruptive technologies or business models. Competitive intensity increasing in core markets.',
    category: 'strategic',
    owner: 'Chief Strategy Officer',
    department: 'Strategy',
    dateIdentified: '2023-08-01',
    lastReviewed: '2024-02-01',
    nextReview: '2024-03-15',
    tags: ['competition', 'market', 'strategic', 'disruption'],
    probability: 3,
    probabilityPercent: 50,
    impactDimensions: {
      financial: 4,
      operational: 2,
      reputational: 3,
      strategic: 5,
      legal: 1,
    },
    financialEstimate: {
      bestCase: 1_000_000,
      mostLikely: 4_000_000,
      worstCase: 10_000_000,
      confidenceLevel: 55,
    },
    status: 'active',
    currentControls: [
      'Competitive intelligence monitoring',
      'Innovation investment programme',
      'Client satisfaction tracking',
      'Strategic planning cycle',
    ],
    mitigationOptions: [
      {
        id: 'MIT-008-01',
        name: 'Innovation Accelerator',
        description: 'Launch innovation accelerator to develop disruptive offerings.',
        cost: 800_000,
        riskReductionValue: 2_000_000,
        netBenefit: 1_200_000,
        newResidualScore: 8.8,
        implementationTime: '12 months',
        owner: 'Chief Innovation Officer',
        status: 'proposed',
      },
    ],
    interdependencies: [
      {
        linkedRiskId: 'R-STR-001',
        relationshipType: 'correlates',
        strength: 7,
        description: 'Digital transformation success affects competitive positioning',
      },
    ],
    interdependencyScore: 5,
    trend: 'increasing',
    riskVelocity: 'moderate',
    maturityIndex: 3,
  }),

  // R-STR-009: Product Liability (Black Risk Example)
  buildStrategicRisk({
    id: 'R-STR-009',
    title: 'Major Product Liability Claim',
    description:
      'Risk of major product liability claim arising from alleged defects in advisory services or technology products causing significant client losses. Litigation environment increasingly aggressive.',
    category: 'compliance',
    owner: 'General Counsel',
    department: 'Legal',
    dateIdentified: '2023-05-01',
    lastReviewed: '2024-01-15',
    nextReview: '2024-04-15',
    tags: ['legal', 'liability', 'litigation', 'compliance'],
    probability: 2,
    probabilityPercent: 25,
    impactDimensions: {
      financial: 5,
      operational: 3,
      reputational: 5,
      strategic: 4,
      legal: 5, // Maximum legal impact triggers BLACK status
    },
    financialEstimate: {
      bestCase: 2_000_000,
      mostLikely: 10_000_000,
      worstCase: 30_000_000, // 60% of EBITDA - triggers BLACK
      confidenceLevel: 40,
    },
    status: 'active',
    currentControls: [
      'Professional indemnity insurance',
      'Quality assurance processes',
      'Contract liability limitations',
      'Legal review of major engagements',
    ],
    mitigationOptions: [
      {
        id: 'MIT-009-01',
        name: 'Enhanced QA Programme',
        description: 'Implement enhanced quality assurance and peer review for high-risk engagements.',
        cost: 250_000,
        riskReductionValue: 3_000_000,
        netBenefit: 2_750_000,
        newResidualScore: 6.0,
        implementationTime: '6 months',
        owner: 'Head of Quality',
        status: 'approved',
      },
    ],
    trend: 'stable',
    riskVelocity: 'slow',
    maturityIndex: 4,
  }),

  // R-STR-010: Geopolitical Disruption
  buildStrategicRisk({
    id: 'R-STR-010',
    title: 'Geopolitical Market Disruption',
    description:
      'Escalating geopolitical tensions could disrupt operations in key markets, impact supply chains, and create regulatory barriers. Uncertainty in multiple regions affecting business planning.',
    category: 'strategic',
    owner: 'Chief Strategy Officer',
    department: 'Strategy',
    dateIdentified: '2024-01-01',
    lastReviewed: '2024-02-01',
    nextReview: '2024-03-01',
    tags: ['geopolitical', 'strategic', 'international', 'disruption'],
    probability: 3,
    probabilityPercent: 40,
    impactDimensions: {
      financial: 4,
      operational: 4,
      reputational: 2,
      strategic: 4,
      legal: 3,
    },
    financialEstimate: {
      bestCase: 500_000,
      mostLikely: 3_000_000,
      worstCase: 8_000_000,
      confidenceLevel: 50,
    },
    status: 'active',
    currentControls: [
      'Geopolitical risk monitoring',
      'Regional diversification strategy',
      'Sanctions compliance programme',
      'Crisis management protocols',
    ],
    mitigationOptions: [
      {
        id: 'MIT-010-01',
        name: 'Regional Risk Hedging',
        description: 'Establish operational hedging through regional diversification.',
        cost: 350_000,
        riskReductionValue: 1_000_000,
        netBenefit: 650_000,
        newResidualScore: 8.5,
        implementationTime: '9 months',
        owner: 'Regional Directors',
        status: 'proposed',
      },
    ],
    trend: 'increasing',
    riskVelocity: 'rapid',
    maturityIndex: 2,
  }),
];

export default strategicRisks;
