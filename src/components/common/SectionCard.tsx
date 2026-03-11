import { cn } from '../../utils';

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function SectionCard({ title, subtitle, actions, children, className, noPadding = false }: SectionCardProps) {
  return (
    <div className={cn('glass-card', className)}>
      {(title || actions) && (
        <div className="flex items-start justify-between p-5 border-b border-navy-700/50">
          <div>
            {title && <h2 className="text-lg font-semibold text-navy-100">{title}</h2>}
            {subtitle && <p className="text-sm text-navy-400 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn(!noPadding && 'p-5')}>
        {children}
      </div>
    </div>
  );
}
