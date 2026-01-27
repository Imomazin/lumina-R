import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import { cn } from '../../utils';
import { formatDate } from '../../utils/formatters';
import { StatusBadge } from '../badges';
import type { Risk } from '../../types';

interface RiskTableProps {
  risks: Risk[];
  onRowClick?: (risk: Risk) => void;
  className?: string;
}

type SortField = 'id' | 'title' | 'severity' | 'riskScore' | 'owner' | 'nextReview';
type SortDirection = 'asc' | 'desc';

export function RiskTable({ risks, onRowClick, className }: RiskTableProps) {
  const [sortField, setSortField] = useState<SortField>('riskScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedRisks = risks
    .filter((risk) => {
      const matchesSearch =
        risk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.owner.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSeverity = filterSeverity === 'all' || risk.severity === filterSeverity;
      return matchesSearch && matchesSeverity;
    })
    .sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'riskScore') {
        return (a.riskScore - b.riskScore) * multiplier;
      }
      if (sortField === 'nextReview') {
        return (new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime()) * multiplier;
      }
      const aVal = String(a[sortField]).toLowerCase();
      const bVal = String(b[sortField]).toLowerCase();
      return aVal.localeCompare(bVal) * multiplier;
    });

  const getSeverityVariant = (severity: Risk['severity']) => {
    switch (severity) {
      case 'critical':
        return 'critical';
      case 'high':
        return 'high';
      case 'medium':
        return 'medium';
      case 'low':
        return 'low';
    }
  };

  const getStatusVariant = (status: Risk['status']) => {
    switch (status) {
      case 'active':
        return 'info';
      case 'escalated':
        return 'critical';
      case 'monitoring':
        return 'warning';
      case 'mitigated':
        return 'success';
      case 'closed':
        return 'default';
    }
  };

  const getTrendIcon = (trend: Risk['trend']) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-emerald-400" />;
      default:
        return <Minus className="w-4 h-4 text-navy-400" />;
    }
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-navy-200 transition-colors"
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <div className={cn('', className)}>
      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
          <input
            type="text"
            placeholder="Search risks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-100 placeholder-navy-500 focus:outline-none focus:border-accent-primary/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-navy-500" />
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-200 focus:outline-none focus:border-accent-primary/50"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container bg-navy-850/50">
        <table className="table">
          <thead>
            <tr>
              <th><SortHeader field="id">ID</SortHeader></th>
              <th><SortHeader field="title">Risk</SortHeader></th>
              <th><SortHeader field="severity">Severity</SortHeader></th>
              <th>Status</th>
              <th><SortHeader field="riskScore">Score</SortHeader></th>
              <th>Trend</th>
              <th><SortHeader field="owner">Owner</SortHeader></th>
              <th><SortHeader field="nextReview">Next Review</SortHeader></th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedRisks.map((risk) => (
              <tr
                key={risk.id}
                onClick={() => onRowClick?.(risk)}
                className={cn(onRowClick && 'cursor-pointer')}
              >
                <td className="font-mono text-navy-400">{risk.id}</td>
                <td>
                  <div className="max-w-xs">
                    <p className="font-medium text-navy-100 truncate">{risk.title}</p>
                    <p className="text-xs text-navy-500 capitalize">{risk.category}</p>
                  </div>
                </td>
                <td>
                  <StatusBadge variant={getSeverityVariant(risk.severity)}>
                    {risk.severity}
                  </StatusBadge>
                </td>
                <td>
                  <StatusBadge variant={getStatusVariant(risk.status)}>
                    {risk.status}
                  </StatusBadge>
                </td>
                <td>
                  <span className="text-lg font-bold text-navy-100">{risk.riskScore}</span>
                </td>
                <td>{getTrendIcon(risk.trend)}</td>
                <td className="text-navy-300">{risk.owner}</td>
                <td className="text-navy-400">{formatDate(risk.nextReview)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedRisks.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-navy-400">No risks found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between mt-4 text-sm text-navy-400">
        <span>Showing {filteredAndSortedRisks.length} of {risks.length} risks</span>
      </div>
    </div>
  );
}
