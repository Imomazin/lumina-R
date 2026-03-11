import { cn } from '../../utils';
import { formatDate } from '../../utils/formatters';
import { KRIStatusBadge } from '../badges';
import type { KRI } from '../../types';

interface KRITableProps {
  kris: KRI[];
  onRowClick?: (kri: KRI) => void;
  compact?: boolean;
  className?: string;
}

export function KRITable({ kris, onRowClick, compact = false, className }: KRITableProps) {
  const getTrendIcon = (trend: KRI['trend']) => {
    switch (trend) {
      case 'up':
        return <span className="text-sm">↑</span>;
      case 'down':
        return <span className="text-sm">↓</span>;
      default:
        return <span className="text-sm text-navy-400">−</span>;
    }
  };

  const getTrendColor = (kri: KRI) => {
    // For most KRIs, up is bad (e.g., loss rate, incidents)
    // But for some, down is bad (e.g., capital ratio, compliance rate)
    const upIsBad = !['Capital Adequacy Ratio', 'Liquidity Coverage Ratio', 'Net Interest Margin', 'System Availability', 'Supplier Performance Score', 'Regulatory Finding Resolution', 'Policy Compliance Rate', 'Suspicious Activity Reports', 'Vulnerability Remediation', 'Privileged Access Reviews'].some(name => kri.name.includes(name));

    if (kri.trend === 'up') {
      return upIsBad ? 'text-red-400' : 'text-emerald-400';
    }
    if (kri.trend === 'down') {
      return upIsBad ? 'text-emerald-400' : 'text-red-400';
    }
    return 'text-navy-400';
  };

  if (compact) {
    return (
      <div className={cn('space-y-2', className)}>
        {kris.map((kri) => (
          <div
            key={kri.id}
            onClick={() => onRowClick?.(kri)}
            className={cn(
              'flex items-center gap-4 p-3 rounded-lg bg-navy-800/40 border border-navy-700/50',
              onRowClick && 'cursor-pointer hover:bg-navy-800/60 transition-colors'
            )}
          >
            <KRIStatusBadge status={kri.status} showLabel={false} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-navy-100 truncate">{kri.name}</p>
              <p className="text-2xs text-navy-500 capitalize">{kri.category}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-navy-100">
                {kri.currentValue}{kri.unit === '%' ? '%' : ` ${kri.unit}`}
              </p>
              <div className={cn('flex items-center gap-1 text-2xs', getTrendColor(kri))}>
                {getTrendIcon(kri.trend)}
                <span>{kri.trendPercentage > 0 ? '+' : ''}{kri.trendPercentage}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('table-container bg-navy-850/50', className)}>
      <table className="table">
        <thead>
          <tr>
            <th>Status</th>
            <th>KRI</th>
            <th>Category</th>
            <th>Current</th>
            <th>Threshold</th>
            <th>Trend</th>
            <th>Owner</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {kris.map((kri) => (
            <tr
              key={kri.id}
              onClick={() => onRowClick?.(kri)}
              className={cn(onRowClick && 'cursor-pointer')}
            >
              <td>
                <KRIStatusBadge status={kri.status} />
              </td>
              <td>
                <div className="max-w-xs">
                  <p className="font-medium text-navy-100">{kri.name}</p>
                  <p className="text-xs text-navy-500 line-clamp-1">{kri.description}</p>
                </div>
              </td>
              <td className="capitalize text-navy-300">{kri.category}</td>
              <td>
                <span className="text-lg font-bold text-navy-100">
                  {kri.currentValue}
                  <span className="text-sm font-normal text-navy-400 ml-0.5">{kri.unit}</span>
                </span>
              </td>
              <td>
                <div className="text-xs text-navy-400">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{kri.threshold.green.min}-{kri.threshold.green.max}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{kri.threshold.amber.min}-{kri.threshold.amber.max}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>{kri.threshold.red.min}-{kri.threshold.red.max}</span>
                  </div>
                </div>
              </td>
              <td>
                <div className={cn('flex items-center gap-1', getTrendColor(kri))}>
                  {getTrendIcon(kri.trend)}
                  <span className="text-sm font-medium">
                    {kri.trendPercentage > 0 ? '+' : ''}{kri.trendPercentage}%
                  </span>
                </div>
              </td>
              <td className="text-navy-300">{kri.owner}</td>
              <td className="text-navy-400">{formatDate(kri.lastUpdated)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
