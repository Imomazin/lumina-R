import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Lock, Wrench, type LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { cn } from '../../utils';
import type { RiskTool } from '../../types';

interface ToolCardProps {
  tool: RiskTool;
  className?: string;
}

export function ToolCard({ tool, className }: ToolCardProps) {
  // Dynamically get the icon component
  const IconComponent = (Icons[tool.icon as keyof typeof Icons] as LucideIcon) || Wrench;

  return (
    <Link
      to={tool.route}
      className={cn(
        'group glass-card-hover p-5 flex flex-col',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-navy-700/50 to-navy-800/50 border border-navy-600/30 group-hover:from-accent-primary/20 group-hover:to-accent-secondary/20 group-hover:border-accent-primary/30 transition-all duration-300">
          <IconComponent className="w-6 h-6 text-navy-300 group-hover:text-accent-primary transition-colors" />
        </div>

        <div className="flex items-center gap-2">
          {tool.isNew && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-primary/20 text-accent-primary text-2xs font-medium">
              <Sparkles className="w-3 h-3" />
              New
            </span>
          )}
          {tool.isPremium && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-2xs font-medium">
              <Lock className="w-3 h-3" />
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

      <div className="flex items-center gap-2 text-sm font-medium text-navy-400 group-hover:text-accent-primary transition-colors">
        Launch Tool
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
