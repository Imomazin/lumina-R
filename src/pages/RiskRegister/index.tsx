// Unified Risk Register — Enterprise + Strategic + Portfolio views
// Premium tabbed interface with full Tier 4 strategic risk content

import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '../../utils';
import { PageHeader } from '../../components';
import EnterpriseRegister from './EnterpriseRegister';
import StrategicRegister from './StrategicRegister';
import PortfolioDashboard from './PortfolioDashboard';

type RegisterTab = 'enterprise' | 'strategic' | 'portfolio';

const TAB_CONFIG = [
  {
    key: 'enterprise' as const,
    label: 'Enterprise Risks',
    description: 'Operational risk register with scoring and controls',
  },
  {
    key: 'strategic' as const,
    label: 'Strategic Risks',
    description: 'Tier 4 financial modelling with EMV and EBITDA exposure',
  },
  {
    key: 'portfolio' as const,
    label: 'Portfolio Dashboard',
    description: 'Heat maps, trends, and capital allocation analytics',
  },
];

export default function RiskRegister() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('view') as RegisterTab) || 'enterprise';
  const [activeTab, setActiveTab] = useState<RegisterTab>(initialTab);

  const handleTabChange = (tab: RegisterTab) => {
    setActiveTab(tab);
    setSearchParams({ view: tab });
  };

  const currentTabConfig = TAB_CONFIG.find((t) => t.key === activeTab);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title="Risk Register"
        subtitle="Unified enterprise and strategic risk intelligence"
      />

      {/* Tab Navigation - Premium Style */}
      <div className="glass-card p-1.5">
        <div className="flex gap-1">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={cn(
                'flex-1 px-4 py-3 rounded-lg transition-all text-left',
                activeTab === tab.key
                  ? 'bg-accent-primary/15 border border-accent-primary/30'
                  : 'hover:bg-navy-800/50 border border-transparent'
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn(
                    'text-sm font-semibold',
                    activeTab === tab.key ? 'text-accent-primary' : 'text-navy-200'
                  )}>
                    {tab.label}
                  </p>
                  <p className="text-xs text-navy-500 mt-0.5">{tab.description}</p>
                </div>
                {activeTab === tab.key && (
                  <div className="w-2 h-2 rounded-full bg-accent-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Tab Indicator */}
      <div className="flex items-center gap-2">
        <div className="h-1 w-8 rounded-full bg-accent-primary" />
        <span className="text-sm font-medium text-accent-primary">{currentTabConfig?.label}</span>
        <div className="h-px flex-1 bg-navy-700/50" />
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'enterprise' && <EnterpriseRegister />}
        {activeTab === 'strategic' && <StrategicRegister />}
        {activeTab === 'portfolio' && <PortfolioDashboard />}
      </div>
    </div>
  );
}
