import type { Integration } from '../types';

export const integrations: Integration[] = [
  {
    id: 'int-servicenow',
    name: 'ServiceNow',
    description: 'IT service management and incident tracking',
    icon: 'servicenow',
    status: 'connected',
    lastSync: '2024-03-15T10:30:00Z',
  },
  {
    id: 'int-sap-grc',
    name: 'SAP GRC',
    description: 'Governance, risk, and compliance management',
    icon: 'sap',
    status: 'connected',
    lastSync: '2024-03-15T09:15:00Z',
  },
  {
    id: 'int-powerbi',
    name: 'Power BI',
    description: 'Business intelligence and analytics',
    icon: 'powerbi',
    status: 'connected',
    lastSync: '2024-03-15T11:00:00Z',
  },
  {
    id: 'int-splunk',
    name: 'Splunk',
    description: 'Security information and event management',
    icon: 'splunk',
    status: 'connected',
    lastSync: '2024-03-15T10:45:00Z',
  },
  {
    id: 'int-jira',
    name: 'Jira',
    description: 'Issue tracking and project management',
    icon: 'jira',
    status: 'connected',
    lastSync: '2024-03-15T10:00:00Z',
  },
  {
    id: 'int-archer',
    name: 'RSA Archer',
    description: 'Integrated risk management platform',
    icon: 'archer',
    status: 'disconnected',
  },
  {
    id: 'int-qualys',
    name: 'Qualys',
    description: 'Vulnerability management and scanning',
    icon: 'qualys',
    status: 'connected',
    lastSync: '2024-03-15T08:00:00Z',
  },
  {
    id: 'int-salesforce',
    name: 'Salesforce',
    description: 'Customer relationship management',
    icon: 'salesforce',
    status: 'pending',
  },
];

// Helper functions
export const getIntegrationById = (id: string): Integration | undefined => {
  return integrations.find(int => int.id === id);
};

export const getConnectedIntegrations = (): Integration[] => {
  return integrations.filter(int => int.status === 'connected');
};

export const getIntegrationStatusCounts = () => {
  return {
    connected: integrations.filter(i => i.status === 'connected').length,
    disconnected: integrations.filter(i => i.status === 'disconnected').length,
    pending: integrations.filter(i => i.status === 'pending').length,
  };
};
