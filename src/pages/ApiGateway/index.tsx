import { useState } from 'react';
import { Settings, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';
import { PageHeader, SectionCard } from '../../components';
import { integrations } from '../../data';
import { cn } from '../../utils';

export default function ApiGateway() {
  const [selectedIntegration, setSelectedIntegration] = useState<typeof integrations[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const pendingCount = integrations.filter(i => i.status === 'pending').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'disconnected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40';
      case 'disconnected':
        return 'bg-red-500/15 text-red-400 border-red-500/40';
      case 'pending':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/40';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="API Gateway & Integrations"
        subtitle="Connect and manage external systems and data sources"
        actions={
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Integration
          </button>
        }
      />

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-l-4 border-l-accent-primary">
          <p className="text-3xl font-bold text-navy-100">{integrations.length}</p>
          <p className="text-sm text-navy-400">Total Integrations</p>
        </div>
        <div className="glass-card p-5 border-l-4 border-l-emerald-500">
          <p className="text-3xl font-bold text-emerald-400">{connectedCount}</p>
          <p className="text-sm text-navy-400">Connected</p>
        </div>
        <div className="glass-card p-5 border-l-4 border-l-amber-500">
          <p className="text-3xl font-bold text-amber-400">{pendingCount}</p>
          <p className="text-sm text-navy-400">Pending Setup</p>
        </div>
        <div className="glass-card p-5 border-l-4 border-l-red-500">
          <p className="text-3xl font-bold text-red-400">
            {integrations.filter(i => i.status === 'disconnected').length}
          </p>
          <p className="text-sm text-navy-400">Disconnected</p>
        </div>
      </div>

      {/* Integrations Grid */}
      <SectionCard title="Platform Integrations">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              onClick={() => setSelectedIntegration(integration)}
              className={cn(
                'p-5 rounded-xl border cursor-pointer transition-all duration-200',
                integration.status === 'connected'
                  ? 'bg-navy-800/30 border-navy-700/50 hover:border-navy-600/50'
                  : 'bg-navy-800/20 border-navy-700/30 hover:border-navy-700/50'
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-navy-700/50 flex items-center justify-center">
                  <span className="text-xl font-bold text-navy-300">
                    {integration.name.charAt(0)}
                  </span>
                </div>
                {getStatusIcon(integration.status)}
              </div>

              <h3 className="text-base font-semibold text-navy-100 mb-1">
                {integration.name}
              </h3>
              <p className="text-sm text-navy-400 mb-3">
                {integration.description}
              </p>

              <div className="flex items-center justify-between">
                <span className={cn(
                  'px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize',
                  getStatusBadge(integration.status)
                )}>
                  {integration.status}
                </span>
                {integration.lastSync && (
                  <span className="text-xs text-navy-500">
                    Synced: {new Date(integration.lastSync).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* API Documentation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="API Endpoints">
          <div className="space-y-3">
            {[
              { method: 'GET', endpoint: '/api/v1/risks', desc: 'Retrieve all risks' },
              { method: 'GET', endpoint: '/api/v1/kris', desc: 'Retrieve all KRIs' },
              { method: 'POST', endpoint: '/api/v1/risks', desc: 'Create new risk' },
              { method: 'PUT', endpoint: '/api/v1/risks/:id', desc: 'Update risk' },
              { method: 'GET', endpoint: '/api/v1/analytics', desc: 'Get analytics data' },
            ].map((api, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-navy-800/30">
                <span className={cn(
                  'px-2 py-0.5 rounded text-xs font-mono font-bold',
                  api.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                  api.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-amber-500/20 text-amber-400'
                )}>
                  {api.method}
                </span>
                <code className="text-sm text-navy-200 font-mono">{api.endpoint}</code>
                <span className="text-xs text-navy-500 ml-auto">{api.desc}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Webhooks">
          <div className="space-y-3">
            {[
              { event: 'risk.created', url: 'https://api.example.com/webhooks/risk', active: true },
              { event: 'kri.breached', url: 'https://api.example.com/webhooks/kri', active: true },
              { event: 'appetite.exceeded', url: 'https://api.example.com/webhooks/appetite', active: false },
            ].map((webhook, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-navy-800/30">
                <div>
                  <p className="text-sm font-medium text-navy-200">{webhook.event}</p>
                  <p className="text-xs text-navy-500 font-mono">{webhook.url}</p>
                </div>
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  webhook.active
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-navy-600/50 text-navy-400'
                )}>
                  {webhook.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Integration Detail Modal */}
      {selectedIntegration && (
        <div
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedIntegration(null)}
        >
          <div
            className="glass-card max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-navy-700/50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-navy-700/50 flex items-center justify-center">
                  <span className="text-2xl font-bold text-navy-300">
                    {selectedIntegration.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-navy-100">{selectedIntegration.name}</h2>
                  <p className="text-sm text-navy-400">{selectedIntegration.description}</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-navy-700/50">
                <span className="text-sm text-navy-400">Status</span>
                <span className={cn(
                  'px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize',
                  getStatusBadge(selectedIntegration.status)
                )}>
                  {selectedIntegration.status}
                </span>
              </div>
              {selectedIntegration.lastSync && (
                <div className="flex items-center justify-between py-2 border-b border-navy-700/50">
                  <span className="text-sm text-navy-400">Last Sync</span>
                  <span className="text-sm text-navy-200">
                    {new Date(selectedIntegration.lastSync).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-navy-700/50 flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setSelectedIntegration(null)}>
                Close
              </button>
              <button className="btn-primary" onClick={() => { setSelectedIntegration(null); }}>
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Integration Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="glass-card max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-navy-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-navy-100">Add Integration</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg text-navy-400 hover:text-navy-200 hover:bg-navy-800/50">×</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-300 mb-1">Integration Name</label>
                <input type="text" placeholder="e.g., ServiceNow, Jira..." className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 placeholder-navy-500 focus:outline-none focus:border-accent-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-300 mb-1">Type</label>
                <select className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 focus:outline-none focus:border-accent-primary/50">
                  <option>REST API</option><option>GraphQL</option><option>Webhook</option><option>File Import</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-300 mb-1">API Endpoint URL</label>
                <input type="text" placeholder="https://api.example.com/v1" className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 placeholder-navy-500 focus:outline-none focus:border-accent-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-300 mb-1">API Key</label>
                <input type="password" placeholder="Enter API key..." className="w-full px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 placeholder-navy-500 focus:outline-none focus:border-accent-primary/50" />
              </div>
            </div>
            <div className="p-6 border-t border-navy-700/50 flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => setShowAddModal(false)}>Connect</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
