import { cn } from '../../utils';
import { formatDate } from '../../utils/formatters';
import type { Risk } from '../../types';

interface RiskCardProps {
  risk: Risk;
  compact?: boolean;
  className?: string;
}

export function RiskCard({ risk, compact = false, className }: RiskCardProps) {
  const getSeverityColor = (severity: Risk['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-risk-critical/15 text-red-300 border-risk-critical/40';
      case 'high':
        return 'bg-risk-high/15 text-red-300 border-risk-high/40';
      case 'medium':
        return 'bg-risk-medium/15 text-amber-300 border-risk-medium/40';
      case 'low':
        return 'bg-risk-low/15 text-emerald-300 border-risk-low/40';
    }
  };

  const getStatusColor = (status: Risk['status']) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/40';
      case 'escalated':
        return 'bg-risk-critical/15 text-red-300 border-risk-critical/40';
      case 'monitoring':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
      case 'mitigated':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
      case 'closed':
        return 'bg-navy-600/50 text-navy-400 border-navy-600';
    }
  };

  const getTrendIcon = () => {
    switch (risk.trend) {
      case 'increasing':
        return <span className="text-sm text-red-400">↑</span>;
      case 'decreasing':
        return <span className="text-sm text-emerald-400">↓</span>;
      default:
        return <span className="text-sm text-navy-400">−</span>;
    }
  };

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-4 p-4 rounded-xl bg-navy-800/40 border border-navy-700/50 hover:bg-navy-800/60 transition-colors',
          className
        )}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-navy-500">{risk.id}</span>
            <span className={cn('px-2 py-0.5 rounded-full text-2xs font-medium border', getSeverityColor(risk.severity))}>
              {risk.severity}
            </span>
          </div>
          <p className="text-sm font-medium text-navy-100 truncate">{risk.title}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-lg font-bold text-navy-100">{risk.riskScore}</p>
            <p className="text-2xs text-navy-500">Risk Score</p>
          </div>
          {getTrendIcon()}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'glass-card-hover p-5',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-navy-500">{risk.id}</span>
          <span className={cn('px-2 py-0.5 rounded-full text-2xs font-medium border', getSeverityColor(risk.severity))}>
            {risk.severity}
          </span>
          <span className={cn('px-2 py-0.5 rounded-full text-2xs font-medium border', getStatusColor(risk.status))}>
            {risk.status}
          </span>
        </div>
        {getTrendIcon()}
      </div>

      <h3 className="text-base font-semibold text-navy-100 mb-2">{risk.title}</h3>
      <p className="text-sm text-navy-400 line-clamp-2 mb-4">{risk.description}</p>

      <div className="flex items-center justify-between pt-4 border-t border-navy-700/50">
        <div className="flex items-center gap-4">
          <span className="text-xs text-navy-400">
            {risk.owner}
          </span>
          <span className="text-xs text-navy-400">
            {formatDate(risk.nextReview)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-navy-500">Score</span>
          <span className="text-lg font-bold text-navy-100">{risk.riskScore}</span>
        </div>
      </div>
    </div>
  );
}
