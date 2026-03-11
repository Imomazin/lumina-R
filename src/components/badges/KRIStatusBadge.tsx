import { cn } from '../../utils';
import type { KRIStatus } from '../../types';

interface KRIStatusBadgeProps {
  status: KRIStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function KRIStatusBadge({ status, size = 'md', showLabel = true, className }: KRIStatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'green':
        return {
          bg: 'bg-emerald-500/15',
          border: 'border-emerald-500/40',
          text: 'text-emerald-300',
          dot: 'bg-emerald-400',
          glow: 'shadow-[0_0_8px_rgba(16,185,129,0.4)]',
          label: 'On Track',
        };
      case 'amber':
        return {
          bg: 'bg-amber-500/15',
          border: 'border-amber-500/40',
          text: 'text-amber-300',
          dot: 'bg-amber-400',
          glow: 'shadow-[0_0_8px_rgba(245,158,11,0.4)]',
          label: 'At Risk',
        };
      case 'red':
        return {
          bg: 'bg-red-500/15',
          border: 'border-red-500/40',
          text: 'text-red-300',
          dot: 'bg-red-400',
          glow: 'shadow-[0_0_8px_rgba(239,68,68,0.4)]',
          label: 'Breached',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { badge: 'px-2 py-0.5 text-2xs', dot: 'w-1.5 h-1.5' };
      case 'md':
        return { badge: 'px-2.5 py-1 text-xs', dot: 'w-2 h-2' };
      case 'lg':
        return { badge: 'px-3 py-1.5 text-sm', dot: 'w-2.5 h-2.5' };
    }
  };

  const statusStyles = getStatusStyles();
  const sizeStyles = getSizeStyles();

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium border',
        statusStyles.bg,
        statusStyles.border,
        statusStyles.text,
        sizeStyles.badge,
        className
      )}
    >
      <span className={cn('rounded-full', statusStyles.dot, statusStyles.glow, sizeStyles.dot)} />
      {showLabel && statusStyles.label}
    </span>
  );
}
