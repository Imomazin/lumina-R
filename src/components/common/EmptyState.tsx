import { cn } from '../../utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      {icon && (
        <div className="w-16 h-16 text-navy-600 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-navy-300 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-navy-500 max-w-sm mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}
