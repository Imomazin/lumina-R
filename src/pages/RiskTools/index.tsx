import { useState } from 'react';
import { Search, Sparkles, Lock } from 'lucide-react';
import { PageHeader, ToolCard } from '../../components';
import { riskTools } from '../../data';
import { cn } from '../../utils';
import type { RiskTool } from '../../types';

type ToolCategory = RiskTool['category'] | 'all';

export default function RiskTools() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');

  const categories: { value: ToolCategory; label: string }[] = [
    { value: 'all', label: 'All Tools' },
    { value: 'analysis', label: 'Analysis' },
    { value: 'assessment', label: 'Assessment' },
    { value: 'monitoring', label: 'Monitoring' },
    { value: 'reporting', label: 'Reporting' },
    { value: 'compliance', label: 'Compliance' },
  ];

  const filteredTools = riskTools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const newTools = riskTools.filter((t) => t.isNew);
  const premiumTools = riskTools.filter((t) => t.isPremium);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Risk Tools Hub"
        subtitle="Comprehensive suite of risk analysis and management tools"
      />

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-navy-800/50 border border-navy-700 rounded-lg text-navy-100 placeholder-navy-500 focus:outline-none focus:border-accent-primary/50"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                selectedCategory === cat.value
                  ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
                  : 'text-navy-400 hover:text-navy-200 hover:bg-navy-800/50 border border-transparent'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex items-center gap-6 text-sm">
        <span className="text-navy-400">
          <span className="font-semibold text-navy-200">{filteredTools.length}</span> tools available
        </span>
        {newTools.length > 0 && (
          <span className="flex items-center gap-1.5 text-accent-primary">
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold">{newTools.length}</span> new
          </span>
        )}
        {premiumTools.length > 0 && (
          <span className="flex items-center gap-1.5 text-amber-400">
            <Lock className="w-4 h-4" />
            <span className="font-semibold">{premiumTools.length}</span> premium
          </span>
        )}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-navy-400">No tools found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
