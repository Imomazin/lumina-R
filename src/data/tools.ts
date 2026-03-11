import type { RiskTool } from '../types';

export const riskTools: RiskTool[] = [
  {
    id: 'tool-heat-map',
    name: 'Risk Heat Map',
    description: 'Visualize risk exposure across probability and impact dimensions',
    icon: 'Grid3X3',
    category: 'analysis',
    route: '/dashboard/risk-matrix',
  },
  {
    id: 'tool-bowtie',
    name: 'Bow-Tie Analysis',
    description: 'Map causes, controls, and consequences for key risks',
    icon: 'GitBranch',
    category: 'analysis',
    route: '/dashboard/tools/bowtie',
    isNew: true,
  },
  {
    id: 'tool-monte-carlo',
    name: 'Monte Carlo Simulation',
    description: 'Probabilistic modeling for risk quantification',
    icon: 'Dice5',
    category: 'analysis',
    route: '/dashboard/tools/monte-carlo',
    isPremium: true,
  },
  {
    id: 'tool-scenario',
    name: 'Scenario Analysis',
    description: 'Model impact of adverse scenarios on risk profile',
    icon: 'Layers',
    category: 'analysis',
    route: '/dashboard/tools/scenario',
  },
  {
    id: 'tool-register',
    name: 'Risk Register',
    description: 'Centralized repository of all identified risks',
    icon: 'ClipboardList',
    category: 'assessment',
    route: '/dashboard/risk-register',
  },
  {
    id: 'tool-kri',
    name: 'KRI Dashboard',
    description: 'Monitor key risk indicators and thresholds',
    icon: 'Activity',
    category: 'monitoring',
    route: '/dashboard/risk-indicators',
  },
  {
    id: 'tool-control',
    name: 'Control Assessment',
    description: 'Evaluate control effectiveness and gaps',
    icon: 'ShieldCheck',
    category: 'assessment',
    route: '/dashboard/tools/controls',
  },
  {
    id: 'tool-rcsa',
    name: 'RCSA Tool',
    description: 'Risk and control self-assessment workflows',
    icon: 'CheckSquare',
    category: 'assessment',
    route: '/dashboard/tools/rcsa',
  },
  {
    id: 'tool-loss',
    name: 'Loss Event Database',
    description: 'Track and analyze operational loss events',
    icon: 'Database',
    category: 'monitoring',
    route: '/dashboard/tools/loss-events',
  },
  {
    id: 'tool-appetite',
    name: 'Risk Appetite Manager',
    description: 'Define and monitor risk appetite statements',
    icon: 'Gauge',
    category: 'monitoring',
    route: '/dashboard/risk-appetite',
  },
  {
    id: 'tool-compliance',
    name: 'Compliance Tracker',
    description: 'Monitor regulatory obligations and deadlines',
    icon: 'Scale',
    category: 'compliance',
    route: '/dashboard/tools/compliance',
  },
  {
    id: 'tool-vendor',
    name: 'Vendor Risk Portal',
    description: 'Assess and monitor third-party risk exposure',
    icon: 'Building2',
    category: 'assessment',
    route: '/dashboard/tools/vendor',
    isNew: true,
  },
  {
    id: 'tool-cyber',
    name: 'Cyber Risk Analyzer',
    description: 'Evaluate cybersecurity posture and vulnerabilities',
    icon: 'Shield',
    category: 'analysis',
    route: '/dashboard/tools/cyber',
  },
  {
    id: 'tool-financial',
    name: 'Financial Risk Model',
    description: 'Quantify market, credit, and liquidity risks',
    icon: 'TrendingUp',
    category: 'analysis',
    route: '/dashboard/tools/financial',
    isPremium: true,
  },
  {
    id: 'tool-operational',
    name: 'Operational Risk Tool',
    description: 'Assess and manage operational risk events',
    icon: 'Settings',
    category: 'assessment',
    route: '/dashboard/tools/operational',
  },
  {
    id: 'tool-strategic',
    name: 'Strategic Risk Radar',
    description: 'Visualize emerging strategic threats and opportunities',
    icon: 'Target',
    category: 'analysis',
    route: '/dashboard/tools/strategic',
    isNew: true,
  },
];

// Helper functions
export const getToolById = (id: string): RiskTool | undefined => {
  return riskTools.find(tool => tool.id === id);
};

export const getToolsByCategory = (category: RiskTool['category']): RiskTool[] => {
  return riskTools.filter(tool => tool.category === category);
};

export const getNewTools = (): RiskTool[] => {
  return riskTools.filter(tool => tool.isNew);
};

export const getPremiumTools = (): RiskTool[] => {
  return riskTools.filter(tool => tool.isPremium);
};
