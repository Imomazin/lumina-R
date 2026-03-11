export interface Control {
  id: string;
  name: string;
  description: string;
  type: 'preventive' | 'detective' | 'corrective' | 'directive';
  status: 'active' | 'inactive' | 'planned';
  effectivenessScore: number;
  linkedRisks: string[];
  owner: string;
  lastReviewDate: string;
  nextReviewDate: string;
  testFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
}

export const controls: Control[] = [
  {
    id: 'ctrl-1',
    name: 'Multi-Factor Authentication',
    description: 'Require MFA for all user access to critical systems',
    type: 'preventive',
    status: 'active',
    effectivenessScore: 92,
    linkedRisks: ['risk-1', 'risk-2'],
    owner: 'IT Security Team',
    lastReviewDate: '2024-12-01',
    nextReviewDate: '2025-03-01',
    testFrequency: 'monthly',
  },
  {
    id: 'ctrl-2',
    name: 'Data Encryption at Rest',
    description: 'Encrypt all sensitive data stored in databases and file systems',
    type: 'preventive',
    status: 'active',
    effectivenessScore: 88,
    linkedRisks: ['risk-2', 'risk-5'],
    owner: 'Data Protection Team',
    lastReviewDate: '2024-11-15',
    nextReviewDate: '2025-02-15',
    testFrequency: 'quarterly',
  },
  {
    id: 'ctrl-3',
    name: 'Intrusion Detection System',
    description: 'Monitor network traffic for suspicious activity patterns',
    type: 'detective',
    status: 'active',
    effectivenessScore: 78,
    linkedRisks: ['risk-1', 'risk-3'],
    owner: 'Security Operations',
    lastReviewDate: '2024-12-10',
    nextReviewDate: '2025-01-10',
    testFrequency: 'daily',
  },
  {
    id: 'ctrl-4',
    name: 'Vendor Risk Assessment',
    description: 'Regular assessment of third-party vendor security posture',
    type: 'preventive',
    status: 'active',
    effectivenessScore: 72,
    linkedRisks: ['risk-4', 'risk-6'],
    owner: 'Vendor Management',
    lastReviewDate: '2024-10-01',
    nextReviewDate: '2025-01-01',
    testFrequency: 'quarterly',
  },
  {
    id: 'ctrl-5',
    name: 'Security Awareness Training',
    description: 'Mandatory security training for all employees',
    type: 'directive',
    status: 'active',
    effectivenessScore: 65,
    linkedRisks: ['risk-1', 'risk-2', 'risk-7'],
    owner: 'HR/Training Team',
    lastReviewDate: '2024-09-01',
    nextReviewDate: '2025-03-01',
    testFrequency: 'annually',
  },
  {
    id: 'ctrl-6',
    name: 'Incident Response Plan',
    description: 'Documented procedures for responding to security incidents',
    type: 'corrective',
    status: 'active',
    effectivenessScore: 85,
    linkedRisks: ['risk-1', 'risk-2', 'risk-3'],
    owner: 'Security Operations',
    lastReviewDate: '2024-11-01',
    nextReviewDate: '2025-02-01',
    testFrequency: 'quarterly',
  },
  {
    id: 'ctrl-7',
    name: 'Access Review Process',
    description: 'Quarterly review of user access privileges',
    type: 'detective',
    status: 'active',
    effectivenessScore: 70,
    linkedRisks: ['risk-1', 'risk-8'],
    owner: 'Identity Management',
    lastReviewDate: '2024-12-01',
    nextReviewDate: '2025-03-01',
    testFrequency: 'quarterly',
  },
  {
    id: 'ctrl-8',
    name: 'Backup & Recovery Testing',
    description: 'Regular testing of backup restoration procedures',
    type: 'corrective',
    status: 'active',
    effectivenessScore: 82,
    linkedRisks: ['risk-3', 'risk-9'],
    owner: 'IT Operations',
    lastReviewDate: '2024-11-15',
    nextReviewDate: '2025-02-15',
    testFrequency: 'monthly',
  },
];
