import type { CaseStudy } from '../types';

export const caseStudies: CaseStudy[] = [
  {
    id: 'CS-001',
    title: 'Global Bank Transforms Risk Management with AI-Driven Analytics',
    industry: 'Financial Services',
    challenge: 'A top-20 global bank struggled with fragmented risk data across 40+ systems, leading to delayed reporting, inconsistent risk assessments, and regulatory scrutiny. Manual processes consumed 70% of risk team capacity.',
    solution: 'Implemented Lumina-R as a unified risk intelligence platform, integrating all data sources with AI-powered analytics. Deployed automated KRI monitoring, real-time dashboards, and predictive risk scoring models.',
    outcomes: [
      { metric: 'Report Generation Time', value: '4 hours', improvement: 'From 5 days' },
      { metric: 'Risk Assessment Accuracy', value: '94%', improvement: '+23% improvement' },
      { metric: 'Regulatory Findings', value: '67%', improvement: 'Reduction' },
      { metric: 'Analyst Productivity', value: '3.5x', improvement: 'Increase' },
    ],
    tags: ['banking', 'ai-analytics', 'regulatory', 'automation'],
    publishedDate: '2024-01-15',
  },
  {
    id: 'CS-002',
    title: 'Insurance Leader Achieves Real-Time Operational Resilience',
    industry: 'Insurance',
    challenge: 'A multinational insurer faced operational risk blind spots, with incidents often discovered after customer impact. Legacy systems provided retrospective views, missing early warning signals.',
    solution: 'Deployed Lumina-R operational risk module with predictive incident detection, automated escalation workflows, and integrated business continuity management. Connected to IT monitoring and customer feedback systems.',
    outcomes: [
      { metric: 'Mean Time to Detection', value: '15 min', improvement: 'From 4 hours' },
      { metric: 'Customer-Impacting Incidents', value: '52%', improvement: 'Reduction' },
      { metric: 'Business Continuity Test Score', value: '96%', improvement: 'From 72%' },
      { metric: 'Operational Losses', value: '$4.2M', improvement: 'Annual savings' },
    ],
    tags: ['insurance', 'operational-resilience', 'real-time', 'bcp'],
    publishedDate: '2024-02-01',
  },
  {
    id: 'CS-003',
    title: 'Asset Manager Modernizes Investment Risk Framework',
    industry: 'Asset Management',
    challenge: 'A $200B asset manager\'s risk models were outdated, failing to capture emerging risks and correlation changes. Portfolio managers lacked real-time risk insights, leading to suboptimal decisions.',
    solution: 'Integrated Lumina-R with trading systems for real-time portfolio risk analytics. Implemented Monte Carlo simulation, scenario analysis, and AI-driven factor risk models with customizable dashboards.',
    outcomes: [
      { metric: 'Risk-Adjusted Returns', value: '+180bps', improvement: 'Annual improvement' },
      { metric: 'VaR Breach Events', value: '78%', improvement: 'Reduction' },
      { metric: 'Risk Report Delivery', value: 'Real-time', improvement: 'From T+1' },
      { metric: 'Model Coverage', value: '100%', improvement: 'All asset classes' },
    ],
    tags: ['asset-management', 'investment-risk', 'monte-carlo', 'real-time'],
    publishedDate: '2024-02-20',
  },
  {
    id: 'CS-004',
    title: 'Payment Processor Strengthens Cyber Risk Posture',
    industry: 'Payments',
    challenge: 'Processing $2T annually, a payment processor faced escalating cyber threats. Siloed security tools, alert fatigue, and manual threat analysis created significant vulnerability exposure.',
    solution: 'Deployed Lumina-R cyber risk module integrating SIEM, vulnerability scanners, and threat intelligence. AI-driven risk scoring prioritizes remediation, while automated workflows accelerate response.',
    outcomes: [
      { metric: 'Threat Detection Time', value: '45 sec', improvement: 'From 23 hours' },
      { metric: 'False Positive Rate', value: '12%', improvement: 'From 68%' },
      { metric: 'Vulnerability Remediation', value: '3 days', improvement: 'From 45 days' },
      { metric: 'Security Incidents', value: '61%', improvement: 'Reduction YoY' },
    ],
    tags: ['payments', 'cybersecurity', 'threat-intelligence', 'siem'],
    publishedDate: '2024-03-05',
  },
  {
    id: 'CS-005',
    title: 'Regional Bank Transforms Compliance Risk Management',
    industry: 'Banking',
    challenge: 'A regional bank faced mounting compliance costs and increasing regulatory pressure. Manual compliance monitoring, fragmented documentation, and reactive issue management strained resources.',
    solution: 'Implemented Lumina-R compliance module with automated regulatory change tracking, obligation mapping, and control testing workflows. AI assists in policy analysis and evidence collection.',
    outcomes: [
      { metric: 'Compliance Costs', value: '35%', improvement: 'Reduction' },
      { metric: 'Regulatory Change Response', value: '5 days', improvement: 'From 6 weeks' },
      { metric: 'Control Testing Coverage', value: '100%', improvement: 'From 40%' },
      { metric: 'Audit Preparation Time', value: '60%', improvement: 'Reduction' },
    ],
    tags: ['banking', 'compliance', 'regulatory', 'automation'],
    publishedDate: '2024-03-10',
  },
];

// Helper functions
export const getCaseStudyById = (id: string): CaseStudy | undefined => {
  return caseStudies.find(cs => cs.id === id);
};

export const getCaseStudiesByIndustry = (industry: string): CaseStudy[] => {
  return caseStudies.filter(cs => cs.industry.toLowerCase() === industry.toLowerCase());
};

export const getCaseStudiesByTag = (tag: string): CaseStudy[] => {
  return caseStudies.filter(cs => cs.tags.includes(tag.toLowerCase()));
};
