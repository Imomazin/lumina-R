import { cn } from '../../utils';

type BadgeVariant = 'critical' | 'high' | 'medium' | 'low' | 'success' | 'warning' | 'info' | 'default';

interface StatusBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export function StatusBadge({ variant, children, className, dot = false }: StatusBadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'critical':
        return 'bg-risk-critical/15 text-red-300 border-risk-critical/40';
      case 'high':
        return 'bg-risk-high/15 text-red-300 border-risk-high/40';
      case 'medium':
        return 'bg-risk-medium/15 text-amber-300 border-risk-medium/40';
      case 'low':
        return 'bg-risk-low/15 text-emerald-300 border-risk-low/40';
      case 'success':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
      case 'warning':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
      case 'info':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/40';
      default:
        return 'bg-navy-600/50 text-navy-300 border-navy-600';
    }
  };

  const getDotColor = () => {
    switch (variant) {
      case 'critical':
      case 'high':
        return 'bg-red-400';
      case 'medium':
      case 'warning':
        return 'bg-amber-400';
      case 'low':
      case 'success':
        return 'bg-emerald-400';
      case 'info':
        return 'bg-blue-400';
      default:
        return 'bg-navy-400';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        getVariantStyles(),
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', getDotColor())} />}
      {children}
    </span>
  );
}
