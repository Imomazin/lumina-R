// Unified Risk Register — Enterprise + Strategic + Portfolio views
// Combines operational risk register, Tier 4 strategic risks, and portfolio analytics

import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '../../utils';
import EnterpriseRegister from './EnterpriseRegister';
import StrategicRegister from './StrategicRegister';
import PortfolioDashboard from './PortfolioDashboard';

type RegisterTab = 'enterprise' | 'strategic' | 'portfolio';

export default function RiskRegister() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('view') as RegisterTab) || 'enterprise';
  const [activeTab, setActiveTab] = useState<RegisterTab>(initialTab);

  const handleTabChange = (tab: RegisterTab) => {
    setActiveTab(tab);
    setSearchParams({ view: tab });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-navy-700/50 pb-0">
        {([
          { key: 'enterprise' as const, label: 'Enterprise Risks' },
          { key: 'strategic' as const, label: 'Strategic Risks' },
          { key: 'portfolio' as const, label: 'Portfolio Dashboard' },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={cn(
              'px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-[1px]',
              activeTab === tab.key
                ? 'text-accent-primary border-accent-primary'
                : 'text-navy-400 border-transparent hover:text-navy-200 hover:border-navy-600'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'enterprise' && <EnterpriseRegister />}
      {activeTab === 'strategic' && <StrategicRegister />}
      {activeTab === 'portfolio' && <PortfolioDashboard />}
    </div>
  );
}
