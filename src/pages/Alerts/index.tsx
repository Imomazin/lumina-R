import { useState } from 'react';
// Icons removed for cleaner UI
import { PageHeader } from '../../components';
import { cn } from '../../utils';

interface Alert {
  id: string;
  type: 'risk' | 'kri' | 'appetite' | 'system';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: 'ALT-001',
    type: 'kri',
    severity: 'critical',
    title: 'KRI Breach: Vulnerability Remediation',
    message: 'Vulnerability Remediation KRI has breached red threshold. Current value 68% is below minimum threshold of 70%.',
    timestamp: '2024-03-15T10:30:00Z',
    isRead: false,
  },
  {
    id: 'ALT-002',
    type: 'appetite',
    severity: 'high',
    title: 'Risk Appetite Warning: Cyber',
    message: 'Cyber risk category is approaching tolerance limit. Current exposure at 52% versus maximum tolerance of 45%.',
    timestamp: '2024-03-15T09:15:00Z',
    isRead: false,
  },
  {
    id: 'ALT-003',
    type: 'risk',
    severity: 'high',
    title: 'Risk Escalated: Third-Party Vendor Data Breach',
    message: 'RSK-001 has been escalated due to increasing threat indicators. Immediate review recommended.',
    timestamp: '2024-03-15T08:45:00Z',
    isRead: false,
  },
  {
    id: 'ALT-004',
    type: 'kri',
    severity: 'medium',
    title: 'KRI Approaching Threshold: Credit Loss Rate',
    message: 'Credit Loss Rate KRI is in amber status at 1.8%. Threshold for red is 2.5%.',
    timestamp: '2024-03-14T16:20:00Z',
    isRead: true,
  },
  {
    id: 'ALT-005',
    type: 'system',
    severity: 'info',
    title: 'Scheduled Maintenance',
    message: 'System maintenance scheduled for March 20, 2024 from 02:00-04:00 UTC.',
    timestamp: '2024-03-14T14:00:00Z',
    isRead: true,
  },
  {
    id: 'ALT-006',
    type: 'risk',
    severity: 'medium',
    title: 'Risk Review Due: Market Volatility Impact',
    message: 'RSK-002 is due for quarterly review. Last reviewed on March 10, 2024.',
    timestamp: '2024-03-14T10:30:00Z',
    isRead: true,
  },
];

export default function Alerts() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'unread') return !alert.isRead;
    if (filter === 'critical') return alert.severity === 'critical' || alert.severity === 'high';
    return true;
  });

  const unreadCount = alerts.filter(a => !a.isRead).length;

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(a => ({ ...a, isRead: true })));
  };

  const getTypeIcon = (type: Alert['type']) => {
    switch (type) {
      case 'risk':
        return <span className="text-sm font-bold">!</span>;
      case 'kri':
        return <span className="text-sm font-bold">K</span>;
      case 'appetite':
        return <span className="text-sm font-bold">A</span>;
      case 'system':
        return <span className="text-sm font-bold">S</span>;
    }
  };

  const getSeverityStyles = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/15 text-red-400 border-red-500/40';
      case 'high':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/40';
      case 'medium':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/40';
      case 'low':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40';
      case 'info':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/40';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Alerts & Notifications"
        subtitle="Stay informed about critical risk events"
        actions={
          <button
            onClick={markAllAsRead}
            className="btn-ghost"
            disabled={unreadCount === 0}
          >
            Mark All Read
          </button>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 border-l-4 border-l-accent-primary">
          <p className="text-2xl font-bold text-navy-100">{alerts.length}</p>
          <p className="text-sm text-navy-400">Total Alerts</p>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-amber-500">
          <p className="text-2xl font-bold text-amber-400">{unreadCount}</p>
          <p className="text-sm text-navy-400">Unread</p>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-red-500">
          <p className="text-2xl font-bold text-red-400">
            {alerts.filter(a => a.severity === 'critical').length}
          </p>
          <p className="text-sm text-navy-400">Critical</p>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-orange-500">
          <p className="text-2xl font-bold text-orange-400">
            {alerts.filter(a => a.severity === 'high').length}
          </p>
          <p className="text-sm text-navy-400">High Priority</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'unread', 'critical'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
              filter === f
                ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
                : 'text-navy-400 hover:text-navy-200 hover:bg-navy-800/50'
            )}
          >
            {f}
            {f === 'unread' && unreadCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => markAsRead(alert.id)}
            className={cn(
              'glass-card p-5 cursor-pointer transition-all duration-200',
              !alert.isRead && 'border-l-4 border-l-accent-primary bg-accent-primary/5',
              alert.isRead && 'opacity-70 hover:opacity-100'
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn('p-2.5 rounded-xl border', getSeverityStyles(alert.severity))}>
                {getTypeIcon(alert.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-navy-100">
                        {alert.title}
                      </h3>
                      {!alert.isRead && (
                        <span className="w-2 h-2 rounded-full bg-accent-primary" />
                      )}
                    </div>
                    <p className="text-sm text-navy-400">{alert.message}</p>
                  </div>

                  <span className="text-xs text-navy-500 whitespace-nowrap">
                    {formatTimestamp(alert.timestamp)}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <span className={cn(
                    'px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize',
                    getSeverityStyles(alert.severity)
                  )}>
                    {alert.severity}
                  </span>
                  <span className="text-xs text-navy-500 capitalize">
                    {alert.type} Alert
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-navy-400">No alerts matching your filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
