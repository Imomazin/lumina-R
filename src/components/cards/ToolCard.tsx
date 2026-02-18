import { Link } from 'react-router-dom';
import { cn } from '../../utils';
import type { RiskTool } from '../../types';

interface ToolCardProps {
  tool: RiskTool;
  className?: string;
}

// Generate a short abbreviation from tool name
function getToolAbbrev(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export function ToolCard({ tool, className }: ToolCardProps) {
  return (
    <Link
      to={tool.route}
      className={cn(
        'group glass-card-hover p-5 flex flex-col',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-700/50 to-navy-800/50 border border-navy-600/30 group-hover:from-accent-primary/20 group-hover:to-accent-secondary/20 group-hover:border-accent-primary/30 transition-all duration-300 flex items-center justify-center text-sm font-bold text-navy-300 group-hover:text-accent-primary">
          {getToolAbbrev(tool.name)}
        </div>

        <div className="flex items-center gap-2">
          {tool.isNew && (
            <span className="px-2 py-0.5 rounded-full bg-accent-primary/20 text-accent-primary text-2xs font-medium">
              New
            </span>
          )}
          {tool.isPremium && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-2xs font-medium">
              Premium
            </span>
          )}
        </div>
      </div>

      <h3 className="text-base font-semibold text-navy-100 mb-2 group-hover:text-accent-primary transition-colors">
        {tool.name}
      </h3>

      <p className="text-sm text-navy-400 flex-1 mb-4">
        {tool.description}
      </p>

      <div className="text-sm font-medium text-navy-400 group-hover:text-accent-primary transition-colors">
        Launch Tool →
      </div>
    </Link>
  );
}
