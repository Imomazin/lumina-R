import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'danger' | 'warning' | 'success';
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  icon,
  trend,
  variant = 'default',
  className,
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getChangeColor = () => {
    if (variant === 'danger') return change && change > 0 ? 'text-red-400' : 'text-emerald-400';
    if (variant === 'success') return change && change > 0 ? 'text-emerald-400' : 'text-red-400';
    return change && change > 0 ? 'text-emerald-400' : change && change < 0 ? 'text-red-400' : 'text-navy-400';
  };

  const getBorderColor = () => {
    switch (variant) {
      case 'danger':
        return 'border-l-risk-critical';
      case 'warning':
        return 'border-l-risk-medium';
      case 'success':
        return 'border-l-status-success';
      default:
        return 'border-l-accent-primary';
    }
  };

  return (
    <div
      className={cn(
        'glass-card p-5 border-l-4 transition-all duration-300 hover:shadow-card-hover',
        getBorderColor(),
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-navy-400">{title}</p>
        {icon && (
          <div className="p-2 rounded-lg bg-navy-800/50">
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-3xl font-bold text-navy-100">{value}</p>

        {change !== undefined && (
          <div className={cn('flex items-center gap-1.5 text-sm', getChangeColor())}>
            {getTrendIcon()}
            <span className="font-medium">
              {change > 0 ? '+' : ''}{change}%
            </span>
            <span className="text-navy-500">{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
